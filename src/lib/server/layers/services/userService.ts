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
  async createUser(data: User): Promise<User> {
    return this.userRepository.create(data);
  }
  async updateUser(user_id: string, data: Partial<User>): Promise<User> {
    return this.userRepository.update(user_id, data);
  }
  async deleteUser(id: string): Promise<User> {
    return this.userRepository.delete(id);
  }
  async deleteManyUsers(ids: string[]): Promise<void> {
    return this.userRepository.deleteMany(ids);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findMany();
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findUserByEmail(email);
  }
  async isUserAdmin(userId: string): Promise<boolean> {
    return this.userRepository.checkIfUserIsAdmin(userId);
  }
}
