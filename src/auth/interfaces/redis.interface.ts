import { Token } from './token.type';

export interface RedisLogin {
  id: string;
  token: Token;
  email: string;
  password: string;
}

export interface Redis {
  id: string;
  token: string;
  email: string;
  password: string;
}
