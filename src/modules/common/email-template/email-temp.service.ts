import EmailTemplate, { IEmailTemplate } from "../../../models/email-template.model";
import { BadRequestException } from "../../../utils/service-exceptions";
import { EmailTemp } from "./interfaces/email-temp.types";

export default class EmailTemplateService {
  createEmailTemplate = async (payload: EmailTemp) => {
    const template = await EmailTemplate.findOne({
      type: payload.type,
    });

    if (template && template.type == payload.type) {
      throw new BadRequestException("There's already a template for this type");
    }

    const emailTemp: Partial<IEmailTemplate> = {
      type: payload.type,
      body: payload.body,
      subject: payload.subject,
      from: payload.from
    };
    await EmailTemplate.create(emailTemp);

    return { message: `Email Template for ${emailTemp.type} has been created.` };
  };
}