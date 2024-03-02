import { Token } from './token.type';

export interface RedisLogin {
  id: string;
  token: Token;
  email: string;
  password: string;
}