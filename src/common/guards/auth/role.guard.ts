import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
    const request = context.switchToHttp().getRequest();
    const matchRoles = (requiredRoles: string[], userRoles: string[]): boolean => {
      return requiredRoles.some(role => userRoles.includes(role));
    };
    return matchRoles(roles, [request.user.roleAtLogin]);
  }
}
