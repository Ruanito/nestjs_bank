import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entity';
import { RegisterDTO } from '../dtos';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEvent } from '../../users/shered';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: { id: true, password: true, username: true },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async saveUser(registerDTO: RegisterDTO): Promise<void> {
    const user = await this.userRepository.findOneBy({
      username: registerDTO.username,
      active: true,
    });

    if (user) {
      throw new UnprocessableEntityException(`user registered`);
    }

    const hashPassword = await this.hashPassword(registerDTO.password);
    const userSaved = await this.userRepository.save({
      username: registerDTO.username,
      password: hashPassword,
    });

    this.eventEmitter.emit('user.created', new UserEvent(userSaved.id));
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
