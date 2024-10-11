import { Request, Response } from "express";
import VendorServices from "./vendor.services";


export default class VendorController {
  private vendorService: VendorServices;

  constructor() {
    this.vendorService = new VendorServices();
  }

  createAccount = async (req: Request, res: Response) => {
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    const result = await this.vendorService.createAccount(req.body);
    res.status(201).json(result);
  };

}