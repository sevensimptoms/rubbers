import { model, Schema, Types } from "mongoose";
import Coins from "./coin.model";
import { schemaOpts } from "./mixins";

export interface IVendor {
  bio: string;
  color: string;
  coins: Types.ObjectId[]; // list of coins vendor trades
  email: string;
  emailVerified: boolean;
  isActive: boolean; // is the account active
  logo: string;
  name: string;
  nin: string;
  ninUpload: string;
  phone: string;
  slug: string;
  vendorId: string;
  createdAt: Date
  // referralCode?: string;
}

const vendorSchema = new Schema<IVendor>({
  bio: { type: String },
  color: { type: String },
  coins: [
    {
      type: Schema.Types.ObjectId,
      ref: Coins,
      required: false,
    },
  ],
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  logo: { type: String },
  name: { type: String },
  nin: { type: String },
  ninUpload: { type: String },
  phone: { type: String },
  slug: { type: String },
  vendorId: { type: String },
  createdAt: { type: Date },
},
  schemaOpts
)

const Vendor = model<IVendor>("Vendor", vendorSchema);
export default Vendor;