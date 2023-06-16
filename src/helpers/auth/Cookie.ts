import cookie from 'cookie';
import { IncomingHttpHeaders } from 'http';
import { NextPageContext } from 'next';

export function parseCookiesReq({ req }: NextPageContext) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export function parseCookiesHeader(headers: IncomingHttpHeaders) {
  return cookie.parse(headers && headers.cookie ? headers.cookie : '');
}
