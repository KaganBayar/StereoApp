import { container } from "../server/DI_container/container";
import { User, UserPayload } from "../Types/userTypes";
export class AuthMiddleware {
  private refreshRepository = container.refreshTokenRepository;
  private userRepository = container.userRepository;
  private cookieService = container.cookieService;
  private tokenService = container.tokenService;

  private async validateUserSession(): Promise<UserPayload> {
    try {
      const token = await this.cookieService
        .getAccessCookie()
        .catch(async (e) => {
          return await this.tokenService.refreshAccessToken().catch((e) => {
            throw new Error("UNAUTHORIZED: No valid session");
          });
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
      this.cookieService.deleteCookie("accessToken");
      throw error;
    }
  }

  public async requireValidUser(): Promise<UserPayload> {
    const userPayload = await this.validateUserSession();
    try {
      return await this.validateUserSession();
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
