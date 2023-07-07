import { PartialType } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';
import { IsDefined, IsString, NotEquals } from 'class-validator';

export class RegisterDto extends PartialType(AuthDto) {
  /**
   * Gets or sets login.
   */
  @IsDefined()
  login: string;

  /**
   * Gets or sets login.
   */
  @IsString()
  @NotEquals(null)
  password?: string;
}
