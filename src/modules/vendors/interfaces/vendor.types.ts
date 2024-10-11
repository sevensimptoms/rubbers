import { Types } from "mongoose";

export interface UpdateProfile {
  bio?: string;
  color?: string;
  coinsIds: Types.ObjectId[];
  isActive?: boolean;
  nin?: string;
  ninUpload?: string;
  phone?: string;
}