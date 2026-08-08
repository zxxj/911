import { SetMetadata } from '@nestjs/common';
import { Role } from '../generated/prisma/enums.js';

export const ROLES_KEY = 'roles';
export const roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
