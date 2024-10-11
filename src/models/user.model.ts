import { model, Schema } from "mongoose";
import { schemaOpts } from "./mixins";

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  emailVerified: boolean;
  referralCode?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  emailVerified: { type: Boolean, default: false },
  referralCode: { type: String },
  createdAt: { type: Date }
},
  schemaOpts
)

const User = model<IUser>("User", userSchema);
export default User;