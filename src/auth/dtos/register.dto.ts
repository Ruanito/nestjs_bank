import { IsString, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsString()
  @MinLength(6)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
