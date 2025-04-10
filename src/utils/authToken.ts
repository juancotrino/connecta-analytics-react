import { jwtDecode } from 'jwt-decode';
import { logger } from './defaultLogger';

interface CustomDecodedToken {
  expiration_date: number;
  [key: string]: any;
}

export function isAuthTokenValid(token: string): boolean {
  try {
    const decoded: CustomDecodedToken = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.expiration_date > now;
  } catch (error) {
    logger.debug(`Error decoding token: ${error}`)
    return false;
  }
}