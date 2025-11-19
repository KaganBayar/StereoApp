import { container } from "../server/DI_container/container";
import { User, UserPayload } from "../Types/userTypes";
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

  /**
   * Validates user session with automatic token refresh
   * This method handles the complex flow of token validation and refresh
   */
  private async validateUserSession(): Promise<UserPayload> {
    try {
      let token: string;

      try {
        // First, try to get and verify access token
        token = await getAccessCookie();

        // Verify the access token
        const userPayload = await this.tokenService.verifyAuthToken(token);

        // Validate user still exists and data hasn't changed
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
        console.log("Access token validation failed, attempting refresh...");

        const refreshToken = await getRefreshCookie();
        if (!refreshToken) {
          throw new Error("UNAUTHORIZED: No refresh token found");
        }

        try {
          // Generate new tokens using refresh token
          const { newAccessToken, newRefreshToken } =
            await this.tokenService.refreshAccessToken(refreshToken);

          // Set new cookies - this is why we need server actions/route handlers
          await setAccessCookie(newAccessToken);
          await setRefreshCookie(newRefreshToken);

          // Verify the new access token and return payload
          const userPayload = await this.tokenService.verifyAuthToken(
            newAccessToken
          );

          console.log("Token refresh successful");
          return userPayload;
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          throw new Error(
            "UNAUTHORIZED: Token refresh failed - " + refreshError
          );
        }
      }
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
