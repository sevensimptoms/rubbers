import { Schema, model } from 'mongoose';
import { schemaOpts } from './mixins';

export interface IEmailTemplate {
  type: string;
  body: string;
  subject: string;
  from: string;
  createdAt: Date;
  updatedAt: Date;
}

const emailTempSchema = new Schema<IEmailTemplate>(
  {
    type: { type: String, required: true },
    body: { type: String },
    subject: { type: String },
    from: { type: String }
  },
  schemaOpts,
)

const EmailTemplate = model<IEmailTemplate>('EmailTemplate', emailTempSchema);
export default EmailTemplate