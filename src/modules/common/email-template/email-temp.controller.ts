import { Request, Response } from "express";
import EmailTemplateService from "./email-temp.service";

export default class EmailTempController {
  private emailTempService: EmailTemplateService;

  constructor() {
    this.emailTempService = new EmailTemplateService();
  }

  createEmailTemp = async (req: Request, res: Response) => {
    const result = await this.emailTempService.createEmailTemplate(req.body);
    res.status(201).json(result);
  };
}