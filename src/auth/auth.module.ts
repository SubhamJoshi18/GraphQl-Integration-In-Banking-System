import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/graphql/models/User';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'hide-me',
      signOptions: {
        issuer: 'subhamJoshi',
        expiresIn: '1h',
      },
    }),
    PassportModule,
  ],
  providers: [AuthService, AuthResolver, LocalStrategy],
})
export class AuthModule {}
