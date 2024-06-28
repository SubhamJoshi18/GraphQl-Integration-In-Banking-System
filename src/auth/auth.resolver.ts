import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/graphql/models/User';
import { RegisterInput } from 'src/graphql/utils/RegisterInput';
import { AuthService } from './auth.service';
import { RegisterResponse } from './CustomResponses/RegisterResponse';
import { LoginInput } from 'src/graphql/utils/LoginInput';
import { LoginResposne } from './CustomResponses/LoginResponse';
import { GqlAuthGuard } from './gql-auth-guard';

@Resolver()
export class AuthResolver {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Mutation((returns) => RegisterResponse, { nullable: false })
  async register(@Args('RegisterInput') RegisterInput: RegisterInput) {
    return this.authService.registerUser(RegisterInput);
  }

  @Mutation((returns) => LoginResposne, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async login(@Args('LoginInput') { username, password }: LoginInput) {
    return await this.authService.validateUser(username, password);
  }
}
