import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionData, SessionService } from '../auth/session.service.js';
import { Request } from 'express';

type RequestWithUser = Request & {
  user?: SessionData;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const sessionId: unknown =
      request.signedCookies[this.sessionService.cookieName];

    if (typeof sessionId !== 'string') {
      throw new UnauthorizedException('请先登录!');
    } else {
      const session = await this.sessionService.get(sessionId);
      if (!session)
        throw new UnauthorizedException('登录状态已失效,请重新登陆!');

      request.user = session;
      return true;
    }
  }
}
