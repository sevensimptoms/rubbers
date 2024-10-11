import { Router } from "express";
import EmailTempController from "./email-temp.controller";

const controller = new EmailTempController();
const router = Router();

router.post('/email/create-temp', controller.createEmailTemp);

export default router;