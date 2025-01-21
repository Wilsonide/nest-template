import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GithubStrategy } from './strategies/github-auth.strategy';
import { GoogleStrategy } from './strategies/google-auth.strategy';
import googleAuthConfig from './config/google-auth.config';
import githubAuthConfig from './config/github-auth.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { VerificationModule } from 'src/verification/verification.module';
import { EmailsModule } from 'src/message/emails.module';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {},
      }),
    }),
    ConfigModule.forFeature(githubAuthConfig),
    ConfigModule.forFeature(googleAuthConfig),
    DatabaseModule,
    UsersModule,
    PassportModule,
    VerificationModule,
    EmailsModule,
  ],

  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    GithubStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
