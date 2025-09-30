import { deleteUser } from "firebase/auth";
import { UserRepository } from "../repositories/userRepository";
import { AuthService } from "./authService";
import { User, UserPayload } from "@/lib/Types/userTypes";

export class UserService {
  private userRepository: UserRepository;
  private authService: AuthService;
  constructor(userRepository: UserRepository, authService: AuthService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }
  async createUser(UserPayload: UserPayload, data: User): Promise<User> {
    await this.authService.requireAdminUser(UserPayload);
    return this.userRepository.create(data);
  }
  async updateUser(
    UserPayload: UserPayload,
    user_id: string,
    data: Partial<User>
  ): Promise<User> {
    await this.authService.requireAdminUser(UserPayload);
    return this.userRepository.update(user_id, data);
  }
  async deleteUser(UserPayload: UserPayload, id: string): Promise<User> {
    await this.authService.requireAdminUser(UserPayload);
    return this.userRepository.delete(id);
  }
  async deleteManyUsers(
    UserPayload: UserPayload,
    ids: string[]
  ): Promise<void> {
    await this.authService.requireAdminUser(UserPayload);
    return this.userRepository.deleteMany(ids);
  }

  async getUserById(
    UserPayload: UserPayload,
    id: string
  ): Promise<User | null> {
    return this.userRepository.findById(id);
  }
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findMany();
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findUserByEmail(email);
  }
}
