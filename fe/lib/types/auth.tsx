export type LoginFormInputs = {
  email: string;
  password: string;
  remember?: boolean;
};

export type LoginResponse = {
  message: string;
  user: {
    email: string;
    name: string;
  };
};

export type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterResponse = {
  name: string;
  email: string;
  password: string;
  type: string;
  _id: string;
};
