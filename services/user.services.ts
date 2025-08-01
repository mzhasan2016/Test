import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserData, UpdateUserData, UserResponse, UserSearchParams } from '../models/user.model';
import { JWTPayload } from '../middlewares/auth.middleware';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
  refreshToken: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
}

export class UserService {
  constructor(private prisma: PrismaClient) {}

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateToken(user: UserResponse): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      is_superuser: user.is_superuser
    };

    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  private generateRefreshToken(user: UserResponse): string {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT refresh secret not configured');
    }

    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      is_superuser: user.is_superuser
    };

    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  async createUser(data: CreateUserData): Promise<UserResponse> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new Error('Email already registered');
      }
      if (existingUser.username === data.username) {
        throw new Error('Username already taken');
      }
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        is_superuser: data.is_superuser || false,
        is_active: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        is_superuser: true,
        is_active: true,
        created_at: true,
        updated_at: true
      }
    });

    return {
      ...user,
      middle_name: user.middle_name || undefined
    };
  }

  async findUserById(id: number): Promise<UserResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        is_superuser: true,
        is_active: true,
        created_at: true,
        updated_at: true
      }
    });

    return user ? {
      ...user,
      middle_name: user.middle_name || undefined
    } : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username }
    });
  }

  async getAllUsers(params: UserSearchParams = {}): Promise<{
    users: UserResponse[];
    total: number;
  }> {
    const { skip = 0, limit = 10, search } = params;
    
    const where = search ? {
      OR: [
        { username: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { first_name: { contains: search, mode: 'insensitive' as const } },
        { last_name: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          first_name: true,
          middle_name: true,
          last_name: true,
          is_superuser: true,
          is_active: true,
          created_at: true,
          updated_at: true
        }
      }),
      this.prisma.user.count({ where })
    ]);

    const formattedUsers: UserResponse[] = users.map(user => ({
      ...user,
      middle_name: user.middle_name || undefined
    }));

    return { users: formattedUsers, total };
  }

  async updateUser(id: number, data: UpdateUserData): Promise<UserResponse> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check if email/username already exists (if being updated)
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: data.email }
      });
      if (emailExists) {
        throw new Error('Email already registered');
      }
    }

    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await this.prisma.user.findUnique({
        where: { username: data.username }
      });
      if (usernameExists) {
        throw new Error('Username already taken');
      }
    }

    // Hash password if being updated
    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await this.hashPassword(data.password);
    }

    // Update user
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.username && { username: data.username }),
        ...(data.email && { email: data.email }),
        ...(hashedPassword && { password: hashedPassword }),
        ...(data.first_name && { first_name: data.first_name }),
        ...(data.middle_name !== undefined && { middle_name: data.middle_name }),
        ...(data.last_name && { last_name: data.last_name }),
        ...(data.is_superuser !== undefined && { is_superuser: data.is_superuser }),
        ...(data.is_active !== undefined && { is_active: data.is_active })
      },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        is_superuser: true,
        is_active: true,
        created_at: true,
        updated_at: true
      }
    });

    return {
      ...user,
      middle_name: user.middle_name || undefined
    };
  }

  async deleteUser(id: number): Promise<void> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Soft delete by setting is_active to false
    await this.prisma.user.update({
      where: { id },
      data: { is_active: false }
    });
  }

  async validateCredentials(email: string, password: string): Promise<UserResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.is_active) {
      return null;
    }

    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      middle_name: user.middle_name || undefined,
      last_name: user.last_name,
      is_superuser: user.is_superuser,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await this.comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    const hashedNewPassword = await this.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword }
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    // Validate email format
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Create user
    const user = await this.createUser({
      username: data.username,
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      middle_name: data.middle_name,
      last_name: data.last_name,
      is_superuser: false
    });

    // Generate tokens
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user,
      token,
      refreshToken
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Validate email format
    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }

    // Validate credentials
    const user = await this.validateCredentials(credentials.email, credentials.password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user,
      token,
      refreshToken
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT refresh secret not configured');
    }

    try {
      const decoded = jwt.verify(refreshToken, secret) as JWTPayload;
      const user = await this.getCurrentUser(decoded.userId);

      const token = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        user,
        token,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: number): Promise<UserResponse> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userId: number, data: UpdateUserData): Promise<UserResponse> {
    return this.updateUser(userId, data);
  }

  async getUserById(id: number): Promise<UserResponse> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createSuperuser(data: CreateUserData): Promise<UserResponse> {
    // Validate email format
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Create superuser
    const user = await this.createUser({
      ...data,
      is_superuser: true
    });

    return user;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 