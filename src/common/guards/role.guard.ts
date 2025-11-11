import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //Get roles from reflector
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    // Get request object
    const request = context.switchToHttp().getRequest<Request>();
    const matchRoles = (
      requiredRoles: string[],
      userRoles: string[],
    ): boolean => {
      return requiredRoles.some((role) => userRoles.includes(role));
    };
    return matchRoles(roles, [request.user.roles]);
  }
}
