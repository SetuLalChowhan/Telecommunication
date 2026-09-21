import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';

/**
 * Composite authentication and authorization decorator.
 * Enforces role-based guards (default-deny for specified roles).
 * 
 * Usage:
 *   @Auth('DOCTOR')
 *   @Auth('PATIENT')
 *   @Auth('ADMIN', 'DOCTOR')
 */
export const Auth = (...roles: string[]) => {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(RolesGuard));
  }
  return applyDecorators(UseGuards(RolesGuard));
};
