import { Schema, Types, model } from 'mongoose'
import { schemaOpts } from './mixins'
import User from './user.model';
import Vendor from './vendor.model';
import { stat } from 'fs';

export enum status {
  Processing = "processing",
  Approved = "approved",
  Declined = "declined"
}
export enum type {
  Null = "null",
  Deposit = "deposit",
  Withdrawal = "withdrawal"
}
export interface IOrders {
  amount: Schema.Types.Decimal128;
  type: string; //withdrawal or deposit | buying or selling
  status: string;
  createdAt: Date;
  UpdatedAt: Date;
  vendorId: Types.ObjectId;
  userId: Types.ObjectId;
}

const OrdersSchema = new Schema<IOrders>({
  amount: { type: Schema.Types.Decimal128 },
  type: { type: String, enum: Object.values(status), default: type.Null },
  status: { type: String, enum: Object.values(status), default: status.Processing },
  userId: { type: Schema.Types.ObjectId, ref: User },
  vendorId: { type: Schema.Types.ObjectId, ref: Vendor },
}, schemaOpts)

const Orders = model<IOrders>('Orders', OrdersSchema)
export default Orders