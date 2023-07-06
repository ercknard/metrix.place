import jwt from 'jsonwebtoken';

import { jwtPayload } from './Jwt';

export function JwtDecode(token: string): jwtPayload {
  return jwt.decode(token) as jwtPayload;
}
