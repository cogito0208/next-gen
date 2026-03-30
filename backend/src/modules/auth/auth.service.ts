import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service.js';
import { User, UserStatus } from '../user/entities/user.entity.js';
import { LoginDto } from './dto/login.dto.js';
import { CreateUserDto } from '../user/dto/create-user.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: CreateUserDto): Promise<{ user: Omit<User, 'password'> }> {
    const user = await this.userService.create(dto);
    const { password: _, ...result } = user as User & { password: string };
    return { user: result };
  }

  async login(dto: LoginDto): Promise<{
    access_token: string;
    refresh_token: string;
    user: Partial<User>;
  }> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    if (user.status === UserStatus.LOCKED) {
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new ForbiddenException(
          '계정이 잠겼습니다. 30분 후 다시 시도해주세요.',
        );
      }
      // 잠금 해제
      await this.userService.resetLoginAttempts(user.id);
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new ForbiddenException('비활성화된 계정입니다.');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      await this.userService.incrementLoginAttempts(user.id);
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    await this.userService.resetLoginAttempts(user.id);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh-secret'),
    });

    const { password: _, ...safeUser } = user as User & { password: string };

    return { access_token, refresh_token, user: safeUser };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string; role: string }>(
        refreshToken,
        {
          secret: this.configService.get<string>(
            'JWT_REFRESH_SECRET',
            'refresh-secret',
          ),
        },
      );
      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      return {
        access_token: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
      };
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
