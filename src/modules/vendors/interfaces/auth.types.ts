import { Types } from "mongoose";

export interface createAccount {
  email: string;
  phone: string;
  name: string;
  coins: Types.ObjectId[];
}

export interface signIn {
  email: string;
  vendorId: string;
}