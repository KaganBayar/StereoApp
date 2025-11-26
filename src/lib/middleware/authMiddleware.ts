import { container } from "../server/DI_container/container";
import { User, UserPayload } from "../shared/Types/userTypes";
import {
  AccessTokenNotFoundError,
  AccessTokenNeedRefreshError,
  RefreshTokenNotFoundError,
} from "../server/Errors/cookie";
import { get } from "http";
import {
  getAccessCookie,
  getRefreshCookie,
} from "../server/layers/actions/cookieActions";

class AuthMiddleware {
  private refreshRepository = container.refreshTokenRepository;
  private userRepository = container.userRepository;
  private tokenService = container.tokenService;

  private async validateUserSession(): Promise<UserPayload> {
    try {
      //Try to get access token

      const token = await getAccessCookie();

      const userPayload = await this.tokenService.verifyAuthToken(token);

      const currentUser = await this.userRepository.findById(userPayload.id);

      if (!currentUser) {
        throw new Error("UNAUTHORIZED: User no longer exists");
      }

      // Check if user data changed after token was issued
      const tokenIssuedAt = userPayload.iat;
      const userLastUpdated = currentUser.updated_at || currentUser.created_at;

      if (userLastUpdated && userLastUpdated > tokenIssuedAt) {
        await this.refreshRepository.deleteAllByUserId(currentUser.id);
        throw new Error(
          "UNAUTHORIZED: User data modified, re-authentication required"
        );
      }

      return userPayload;
    } catch (accessError) {
      // Access token doesn't exist, expired, or invalid - try refresh flow

      const refreshToken = await getRefreshCookie().catch(() => {
        throw new RefreshTokenNotFoundError();
      });

      throw new AccessTokenNeedRefreshError();
    }
  }

  public async requireValidUser(): Promise<UserPayload> {
    try {
      return await this.validateUserSession();
    } catch (error) {
      if (error instanceof AccessTokenNeedRefreshError) {
        throw error;
      }
      throw new Error("UNAUTHORIZED: Invalid user session - " + error);
    }
  }

  public async requireAdminUser(): Promise<UserPayload> {
    try {
      const currentUser = await this.requireValidUser();
      if (!currentUser.roles.includes("admin")) {
        throw new Error("FORBIDDEN: Admin access required");
      }
      return currentUser;
    } catch (error) {
      if (error instanceof AccessTokenNeedRefreshError) {
        throw error;
      }
      throw new Error("FORBIDDEN: Admin access required - " + error);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
