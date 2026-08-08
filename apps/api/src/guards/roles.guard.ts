import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators.js';
import { Role } from '../generated/prisma/enums.js';
import { Request } from 'express';
import { SessionData } from '../auth/session.service.js';

type RequestWithUser = Request & {
  user?: SessionData;
};
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user || !requiredRoles.includes(request.user.role))
      throw new ForbiddenException('该用户没有权限访问此资源!');

    return true;
  }
}
