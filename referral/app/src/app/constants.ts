import { environment } from '../environments/environment';

export const { apiBaseUrl } = environment;

export interface ApiUrlConfig {
  users: string;
  logout:string;
  isAuthenticated:string;
}

export const apiUrlConfig: ApiUrlConfig = {
  users: `${apiBaseUrl}/user`,
  logout: `${apiBaseUrl}/user/logout`,
  isAuthenticated:`${apiBaseUrl}/user/isAuthenticated`,
};
