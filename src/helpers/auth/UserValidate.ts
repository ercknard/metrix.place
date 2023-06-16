import { IncomingHttpHeaders } from 'http2';
import { parseCookiesHeader } from './Cookie';
import { jwtPayload, verifyToken } from './Jwt';

export default (
  req: {
    method: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    query: any;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    body: any;
    headers: IncomingHttpHeaders;
  },
  requireAdmin = false
): boolean | jwtPayload => {
  function userValidate(requireAdmin: boolean) {
    if (req.headers.host?.split(':')[0] === 'localhost') {
      //return true;
    }
    const cookies = parseCookiesHeader(req.headers);
    const cookie = cookies['metriverse-user'];
    if (cookie === undefined) {
      return false;
    }
    const token = verifyToken(cookie);
    if (!token) {
      return false;
    }
    if (requireAdmin && !token.adm) {
      return false;
    }
    return token;
  }

  return userValidate(requireAdmin);
};
