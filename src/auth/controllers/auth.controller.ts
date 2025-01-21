import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { RegisterDTO } from '../dtos';
import { AuthService } from '../sevices';
import { JwtAuthGuard, LocalAuthGuard } from '../shered';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async register(@Body() registerDTO: RegisterDTO) {
    return await this.authService.saveUser(registerDTO);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
