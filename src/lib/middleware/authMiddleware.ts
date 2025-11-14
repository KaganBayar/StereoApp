import { container } from "../server/DI_container/container";
import { User, UserPayload } from "../Types/userTypes";
import {
  getAccessCookie,
  getRefreshCookie,
  deleteAccessCookie,
  deleteRefreshCookie,
} from "../server/cookie";
import { get } from "http";

class AuthMiddleware {
  private refreshRepository = container.refreshTokenRepository;
  private userRepository = container.userRepository;
  private tokenService = container.tokenService;
  private async validateUserSession(): Promise<UserPayload> {
    try {
      const refreshToken = await getRefreshCookie();
      const token = await getAccessCookie().catch(async (e) => {
        const payload = await this.tokenService
          .refreshAccessToken(refreshToken)
          .catch((e) => {
            throw new Error("UNAUTHORIZED: No valid session");
          });
        return payload.newAccessToken;
      });

      const UserPayload = await container.tokenService.verifyAuthToken(token);

      const currentUser: User | null = await this.userRepository.findById(
        UserPayload.id
      );
      //check if user still exists and is active in database
      if (!currentUser) {
        throw new Error("UNAUTHORIZED: User no longer exists");
      }
      //token check
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
      deleteAccessCookie();
      deleteRefreshCookie();
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
