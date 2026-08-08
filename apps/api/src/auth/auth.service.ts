import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { argon2id, hash, verify } from 'argon2';
import { Prisma } from '../generated/prisma/client.js';
import { LoginDto } from './dto/login.dto.js';
import { SessionService } from './session.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sessionService: SessionService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { username: dto.username },
      select: { id: true },
    });

    if (existingUser) throw new ConflictException('用户名已被使用!');

    const passwordHash = await hash(dto.password, { type: argon2id });

    try {
      return await this.prismaService.user.create({
        data: {
          username: dto.username,
          passwordHash,
        },
        select: {
          id: true,
          username: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('用户名已被使用!');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { username: dto.username },
      select: {
        id: true,
        username: true,
        passwordHash: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw new UnauthorizedException('用户名错误!');

    const passwordMatches = await verify(user.passwordHash, dto.password);

    if (!passwordMatches) throw new UnauthorizedException('密码错误!');

    const sessionId = await this.sessionService.create(user.id, user.role);

    return {
      sessionId,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}
