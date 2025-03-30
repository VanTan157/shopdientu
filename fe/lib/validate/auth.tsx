export type LoginFormInputs = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  user: {
    email: string;
    name: string;
  };
};
