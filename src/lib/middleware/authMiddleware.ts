import { container } from "../server/DI_container/container";
import { User, UserPayload } from "../Types/userTypes";
export class AuthMiddleware {
  private refreshRepository = container.refreshTokenRepository;
  private userRepository = container.userRepository;
  private cookieService = container.cookieService;

  private async validateUserSession(): Promise<UserPayload> {
    try {
      const token = await this.cookieService.getAccessCookie();

      if (!token) throw new Error("UNAUTHORIZED: No token provided");

      const UserPayload = await container.tokenService.verifyAuthToken(token);

      const currentUser: User | null = await this.userRepository.findById(
        UserPayload.id
      );
      //check if user still exists and is active in database
      if (!currentUser) {
        throw new Error("UNAUTHORIZED: User no longer exists");
      }
      //token check
      const tokenIssuedAt = new Date((UserPayload.iat || 0) * 1000);
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
