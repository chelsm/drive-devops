import { BaseDto } from '../../shared/base/base.dto';
import { Users } from '../entity/users.entity';

export class UsersDto extends BaseDto {
  /**
   * Gets or sets username.
   */
  login: string;
  /**
   * Gets or sets password.
   */
  password: string;

  public static Load(users: Users): UsersDto {
    return {
      id: users.id,
      login: users.login,
      password: users.password,
    };
  }
}
