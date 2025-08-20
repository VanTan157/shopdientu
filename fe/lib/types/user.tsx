export enum EUserType {
  ADMIN = "ADMIN",
  USER = "USER",
  ALL = "ALL",
}

export interface User {
  userId: string;
  email: string;
  name: string;
  type: EUserType;
  // isActive: boolean;
}

export interface IAllUser {
  code: string;
  createdAt: string;
  email: string;
  isActive: boolean;
  name: string;
  password: string;
  type: EUserType;
  updatedAt: string;
  __v: number;
  _id: string;
}
