import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSetting } from 'src/graphql/models/UserSetting';
import { Repository } from 'typeorm';
import { User } from 'src/graphql/models/User';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserSetting)
    private readonly userSettingRepository: Repository<UserSetting>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        throw new Error('Authorization header missing');
      }
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new Error('Token missing');
      }
      const payload = await this.authService.validateToken(token);
      if (Object.entries(payload).length === 0)
        throw new NotFoundException('Empty Payload');

      const user = await this.userRepository.findOne({
        where: {
          id: payload.sub,
        },
      });

      const findUserSetting = await this.userSettingRepository.findOne({
        where: {
          user: user,
        },
        relations: ['user'],
      });
      console.log(findUserSetting.deactivate_status);
      if (findUserSetting.deactivate_status)
        throw new HttpException(
          `Dear ${user.username} Your account is Deactivated Please Activate it`,
          403,
        );

      request.user = payload;

      return true;
    } catch (error) {
      console.log('Auth error:', error.message);
      throw new ForbiddenException(
        error.message || 'Session expired! Please sign in',
      );
    }
  }
}
