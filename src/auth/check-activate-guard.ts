import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Context, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export class CheckDeactivate implements CanActivate {
  async canActivate(context: ExecutionContext | any): Promise<any> {
    try {
      const userPayload = this.getRequestUser(context);
      console.log(userPayload);
      return true;
    } catch (err) {}
  }

  private async getRequestUser(@Context() Context) {
    const user = Context.req.user;
    return user;
  }
}
