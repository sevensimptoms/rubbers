import { Request, Response } from "express";
import UserService from "./user.services";
import { ConfirmEmail } from "./interfaces/auth.types";

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  signUp = async (req: Request, res: Response) => {
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    const result = await this.userService.signUp(req.body);
    res.status(201).json(result);
  };

  signIn = async (req: Request, res: Response) => {
    const result = await this.userService.signIn(req.body);
    res.status(201).json(result);
  };

  confirmEmail = async (req: Request, res: Response) => {
    const result = await this.userService.confirmEmail(req.query as unknown as ConfirmEmail);
    res.status(201).json(result);
  };

  resendConfirmationEmail = async (req: Request, res: Response) => {
    const result = await this.userService.resendConfirmationEmail(req.body);
    res.status(201).json(result);
  };

  forgotPassword = async (req: Request, res: Response) => {
    const result = await this.userService.forgotPassword(req.body);
    res.status(201).json(result);
  };
}