import { ErrorInterceptor } from './error.interceptor';
import { TokenInterceptor } from './token.interceptor';

export * from './error.interceptor';
export * from './token.interceptor';

export const interceptors = [ErrorInterceptor, TokenInterceptor];
