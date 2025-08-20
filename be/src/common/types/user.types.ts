export enum EUserType {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface JwtPayload {
  userId: string;
  email: string;
  type: EUserType;
  name: string;
}
