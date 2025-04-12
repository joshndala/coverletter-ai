import Cookies from 'js-cookie';
import { SessionData } from './sessionStorage';

const AUTH_COOKIE_NAME = 'auth';
const AUTH_COOKIE_EXPIRY = 7; // days

export const setAuthCookie = (isAuthenticated: boolean) => {
  if (isAuthenticated) {
    Cookies.set(AUTH_COOKIE_NAME, 'true', { expires: AUTH_COOKIE_EXPIRY, sameSite: 'strict' });
  } else {
    Cookies.remove(AUTH_COOKIE_NAME);
  }
};

export const getAuthCookie = (): boolean => {
  return Cookies.get(AUTH_COOKIE_NAME) === 'true';
};

export const clearAuthCookie = () => {
  Cookies.remove(AUTH_COOKIE_NAME);
}; 