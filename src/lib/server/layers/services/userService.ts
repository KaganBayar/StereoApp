import { deleteUser } from "firebase/auth";
import { UserRepository } from "../repositories/userRepository";
import { AuthService } from "./authService";
import { User } from "@/lib/Types/userTypes";

export class UserService {
  private userRepository: UserRepository;
  private authService: AuthService;
  constructor(userRepository: UserRepository, authService: AuthService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }
  createUser(data: User): Promise<User> {
    this.authService.validateUserSession();
    return this.userRepository.create(data);
  }
  updateUser(id: string, data: Partial<User>): Promise<User> {
    this.authService.validateUserSession();
    return this.userRepository.update(id, data);
  }
  deleteUser(id: string): Promise<User> {
    this.authService.validateUserSession();
    return this.userRepository.delete(id);
  }
  deleteManyUsers(id: string): Promise<void> {
    this.authService.validateUserSession();
    return this.userRepository.deleteMany(id);
  }

  getUserById(id: string): Promise<User | null> {
    this.authService.validateUserSession();
    return this.userRepository.findById(id);
  }
  findById(id: string): Promise<User | null> {
    this.authService.validateUserSession();
    return this.userRepository.findById(id);
  }

  getAllUsers(): Promise<User[]> {
    this.authService.validateUserSession();
    return this.userRepository.findMany();
  }
  findUserByEmail(email: string): Promise<User | null> {
    this.authService.validateUserSession();
    return this.userRepository.findUserByEmail(email);
  }
  
}
