import { Admin } from "./admin";


export interface AuthResponse {
  token: string;
  administrador: Admin;
}