import { users } from '@prisma/client';

export class Users implements users {
  id: string;
  login: string;
  password: string;
}
