import Vendor, { IVendor } from "../../models/vendor.model";
import bcrypt from "bcryptjs";
import Logger from "../../utils/logger";
import randomGen from "../../utils/random-generator";
import { BadRequestException, NotFoundException } from "../../utils/service-exceptions";
import EmailService from "../common/email.service";
import { createAccount, signIn } from "./interfaces/auth.types";
import { loginResponse } from "../../utils/login-response";
import { UpdateProfile } from "./interfaces/vendor.types";
import Orders from "../../models/order.model";

const ObjectId = require("mongoose").Types.ObjectId;
export default class VendorServices {
  private logger: Logger;
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
    this.logger = new Logger("users-service");
  }

  createAccount = async (payload: createAccount) => {
    const vendorExist = await Vendor.findOne({ email: payload.email })
    if (vendorExist) {
      throw new BadRequestException("There is an vendor account associated with this email")
    }
    const vuid = randomGen("alphanumeric", 8)
    const hashedVuid = await bcrypt.hash(vuid, 10);
    const formattedName = payload.name.toLowerCase().replace(/\s+/g, '_');

    const data: Partial<IVendor> = {
      email: payload.email,
      vendorId: hashedVuid, // wish to change upon account setup
      phone: payload.phone,
      name: payload.name,
      coins: payload.coins
        ? payload.coins.map((id) => new ObjectId(id))
        : undefined,
      slug: formattedName
    }
    const createData = await Vendor.create(data)
    await this.emailService.sendEmail("", "", "") // this will send confirmation email
    return {
      message: "Congratulations Chief! Your Vendor account has been created. Kindly login to your email to activate your account.",
      data: createData
    }
  }

  signIn = async (payload: signIn) => {
    const vendor = await Vendor.findOne({ email: payload.email })
    if (!vendor) {
      throw new NotFoundException("Sorry Chief, Invalid Credentials")
    }
    const validVuid = await bcrypt.compare(payload.vendorId, vendor.vendorId);

    if (!validVuid) {
      throw new BadRequestException("Sorry Chief, Invalid credentials");
    }
    if (!vendor.emailVerified) {
      return {
        user: {
          _id: vendor._id,
          email: vendor.email,
          firstName: vendor.name,
          phone: vendor.phone
        },
        emailVerificationRequired: true,
      };
    }
    return loginResponse(vendor._id.toString());
  }

  updateProfile = async (userId: string, payload: UpdateProfile) => {
    const user = await Vendor.exists({ _id: userId });
    if (!user) {
      throw new NotFoundException("Vendor does not exist");
    }
    const updatedCoins = payload.coinsIds
      ? payload.coinsIds.map((id) => new ObjectId(id))
      : [];
    await Vendor.updateOne(
      { _id: userId },
      {
        $push: { coins: { $each: updatedCoins } },
        bio: payload.bio,
        color: payload.color,
        isActive: payload.isActive,
      }
    );

    return { message: "Profile updated successfully" };
  };

  getMyProfile = async (vendorId: string) => {
    const profile = await Vendor.findOne({ _id: vendorId })
    if (!profile) {
      null
    } return profile
  }

  getMyTransactions = async (vendorId: string) => {
    const orders = await Orders.find({ vendorId })
    if (!orders) {
      return []
    } return orders
  }

  getATransaction = async (OrderId: string) => {
    const order = await Orders.find({ _id: OrderId })
    if (!order) {
      return null
    } return order
  }
}