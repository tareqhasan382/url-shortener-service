import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
} from './dto/create-auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole, UserAccountStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ================= REGISTER =================
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password does not match.');
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      Number(process.env.SALT_ROUND),
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName ?? null,
          lastName: dto.lastName ?? null,
          phone: dto.phone ?? null,
          profileImage: dto.profileImage ?? null,
          role: UserRole.USER,
          status: UserAccountStatus.ACTIVE,
        },
      });

      // remove password before returning
      const { password, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create user',
        error,
      );
    }
  }

  // ================= LOGIN =================
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (user.status !== UserAccountStatus.ACTIVE) {
      throw new UnauthorizedException('Your account is inactive.');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: Number(process.env.JWT_EXPIRES_IN) ,
    });

    const { password, ...safeUser } = user;

    return {
      accessToken,
      user: safeUser,
    };
  }

  // ================= CHANGE PASSWORD =================
  async changePassword(email: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      Number(process.env.SALT_ROUND),
    );

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
