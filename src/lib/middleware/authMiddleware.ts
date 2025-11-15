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
  private async validateUserSession(): Promise<UserPayload> {
    try {
      let token: string;

      try {
        token = await getAccessCookie();
      } catch (accessError) {
        // Access token doesn't exist or expired, try refresh
        const refreshToken = await getRefreshCookie();
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }
        try {
          const { newAccessToken, newRefreshToken } =
            await this.tokenService.refreshAccessToken(refreshToken);

          // Set new cookies
          await setAccessCookie(newAccessToken);
          await setRefreshCookie(newRefreshToken);

          token = newAccessToken;
        } catch (refreshError) {
          throw new Error("Failed to refresh access token: " + refreshError);
        }
      }

      const UserPayload = await this.tokenService.verifyAuthToken(token);

      const currentUser: User | null = await this.userRepository.findById(
        UserPayload.id
      );

      if (!currentUser) {
        throw new Error("UNAUTHORIZED: User no longer exists");
      }

      // Check if user data changed after token was issued
      const tokenIssuedAt = UserPayload.iat;
      const userLastUpdated = currentUser.updated_at || currentUser.created_at;

      if (userLastUpdated && userLastUpdated > tokenIssuedAt) {
        await this.refreshRepository.deleteAllByUserId(currentUser.id);
        throw new Error(
          "UNAUTHORIZED: User data has been modified. Please re-authenticate."
        );
      }

      return UserPayload;
    } catch (error) {
      // Clean up invalid tokens
      await deleteAccessCookie();
      await deleteRefreshCookie();
      throw error;
    }
  }

  public async requireValidUser(): Promise<UserPayload> {
    try {
      const userPayload = await this.validateUserSession();
      return userPayload;
    } catch (error) {
      throw new Error("UNAUTHORIZED: Invalid user session");
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
