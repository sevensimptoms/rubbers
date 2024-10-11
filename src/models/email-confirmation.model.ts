import { Schema, Types, model } from 'mongoose';
import { schemaOpts } from './mixins';
import User from './user.model';

export interface IEmailConfirmation {
  userId: Types.ObjectId;
  token: string;
  expirationTime: Date;
}

const emailConfirmationSchema = new Schema<IEmailConfirmation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: User },
    token: { type: String },
    expirationTime: { type: Date }
  },
  schemaOpts,
)

const EmailConfirmation = model<IEmailConfirmation>('expiration', emailConfirmationSchema);
export default EmailConfirmation