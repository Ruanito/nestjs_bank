import { Module } from '@nestjs/common';
import { AuthService, JwtStrategy, LocalStrategy } from './sevices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity';
import { AuthController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy, ConfigService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
