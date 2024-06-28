import { Inject, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { User } from 'src/graphql/models/User';
import { UserService } from './user.service';
import { CreateUserInput } from 'src/graphql/utils/CreateUserInput';
import { DeleteUserInput } from 'src/graphql/utils/DeleteUserInput';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Resolver((of) => User)
export class UserResolver {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Query((returns) => [User], { nullable: true })
  async getAllUser(): Promise<User[] | User> {
    return this.userService.getAllUser();
  }

  @Query((returns) => User, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.userService.getUserById(id);
  }

  @Query((returns) => User, { nullable: true })
  async getUserByName(@Args('name') name: string) {
    return this.userService.getUserByName(name);
  }

  @Mutation((returns) => User, { nullable: true })
  async createUser(
    @Args('CreateUserInput', { nullable: false })
    CreateUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.createUser(CreateUserInput);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('DeleteUserInput') DeleteUserInput: DeleteUserInput) {
    return this.userService.deleteUserById(DeleteUserInput);
  }
}
