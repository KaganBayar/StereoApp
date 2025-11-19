import { container } from "../server/DI_container/container";
import { User, UserPayload } from "../shared/Types/userTypes";
import {
  getAccessCookie,
  getRefreshCookie,
  deleteAccessCookie,
  deleteRefreshCookie,
  setAccessCookie,
  setRefreshCookie,
} from "../server/cookie";
import { get } from "http";

class AuthMiddleware {
  private refreshRepository = container.refreshTokenRepository;
  private userRepository = container.userRepository;
  private tokenService = container.tokenService;

  private async validateUserSession(): Promise<UserPayload> {
    try {
      let token: string;
      //Try to get access token
      try {
        token = await getAccessCookie();

        const userPayload = await this.tokenService.verifyAuthToken(token);

        const currentUser = await this.userRepository.findById(userPayload.id);

        if (!currentUser) {
          throw new Error("UNAUTHORIZED: User no longer exists");
        }

        // Check if user data changed after token was issued
        const tokenIssuedAt = userPayload.iat;
        const userLastUpdated =
          currentUser.updated_at || currentUser.created_at;

        if (userLastUpdated && userLastUpdated > tokenIssuedAt) {
          await this.refreshRepository.deleteAllByUserId(currentUser.id);
          throw new Error(
            "UNAUTHORIZED: User data modified, re-authentication required"
          );
        }

        return userPayload;
      } catch (accessError) {
        // Access token doesn't exist, expired, or invalid - try refresh flow

        const refreshToken = await getRefreshCookie();
        if (!refreshToken) {
          throw new Error("UNAUTHORIZED: No refresh token found");
        }
        //refresh flow
        try {
          // Generate new tokens using refresh token
          const { newAccessToken, newRefreshToken } =
            await this.tokenService.refreshAccessToken(refreshToken);

          await setAccessCookie(newAccessToken);
          await setRefreshCookie(newRefreshToken);

          const userPayload = await this.tokenService.verifyAuthToken(
            newAccessToken
          );

          console.log("Token refresh successful");
          return userPayload;
          //Refresh Error
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          throw new Error(
            "UNAUTHORIZED: Token refresh failed - " + refreshError
          );
        }
      }
      //General Error
    } catch (error) {
      // Clean up invalid tokens on any authentication failure
      try {
        await deleteAccessCookie();
        await deleteRefreshCookie();
      } catch (cleanupError) {
        console.error("Cookie cleanup failed:", cleanupError);
      }

      throw error;
    }
  }

  /**
   * Requires a valid authenticated user
   * Throws error if validation fails
   */
  public async requireValidUser(): Promise<UserPayload> {
    try {
      return await this.validateUserSession();
    } catch (error) {
      throw new Error("UNAUTHORIZED: Invalid user session - " + error);
    }
  }
  public async requireAdminUser(): Promise<UserPayload> {
    const currentUser = await this.requireValidUser();
    if (!currentUser.roles.includes("admin")) {
      throw new Error("FORBIDDEN: Admin access required");
    }
    return currentUser;
  }
}

export const authMiddleware = new AuthMiddleware();
