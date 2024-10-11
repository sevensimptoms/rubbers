import { Router } from "express";
import VendorController from "./vendor.controller";


const controller = new VendorController();
const router = Router();

router.post("/vendor/create-account", controller.createAccount);