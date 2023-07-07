import { IsString, NotEquals } from 'class-validator';

export class AuthDto {
  /**
   * Gets or sets login.
   */
  @IsString()
  @NotEquals(null)
  login: string;

  /**
   * Gets or sets password.
   */
  @IsString()
  @NotEquals(null)
  password: string;
}
