import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { EmailsModule } from 'src/message/emails.module';
import { VerificationModule } from 'src/verification/verification.module';

@Module({
  imports: [DatabaseModule, EmailsModule, VerificationModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
