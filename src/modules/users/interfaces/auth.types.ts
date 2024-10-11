export interface SignUp {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  referralCode: string;
}

export interface SignIn {
  email: string;
  password: string;
}

export interface ConfirmEmail {
  userId: string;
  token: string;
}

export interface ResetPassword {
  userId: string;
  token: string;
  password: string;
}

