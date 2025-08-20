export interface LoginFormInputs {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  userId: string;
  email: string;
  name: string;
  type: "ADMIN" | "USER";
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  name: string;
  email: string;
  password: string;
  type: string;
  _id: string;
}
