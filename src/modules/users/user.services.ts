import User, { IUser } from "../../models/user.model";
import bcrypt from "bcryptjs";
import Logger from "../../utils/logger";
import { BadRequestException, NotFoundException } from "../../utils/service-exceptions";
import { ConfirmEmail, ResetPassword, SignIn, SignUp } from "./interfaces/auth.types";
import { loginResponse } from "../../utils/login-response";
import { ResendConfirmationEmail } from "./interfaces/user.types";
import redisClient, { limitCalls } from "../../utils/redis";
import randomGen from "../../utils/random-generator";
import EmailService from "../common/email.service";
import Vendor from "../../models/vendor.model";
import EmailConfirmation from "../../models/email-confirmation.model";


export default class UserService {
  private logger: Logger;
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
    this.logger = new Logger("users-service");
  }

  signUp = async (payload: SignUp) => {
    const checkIfUserExist = await User.findOne({
      email: payload.email
    }).select("email").lean();
    if (checkIfUserExist) {
      throw new BadRequestException("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const userData: Partial<IUser> = {
      email: payload.email,
      password: hashedPassword,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      createdAt: new Date()
    }
    const user = await User.create(userData);

    // Send welcome email and follow up with confirmation
    await this.emailService.sendWelcomeEmail(payload.email);

    // confirmation email
    await this.emailService.sendConfirmationEmail(payload.email, payload.firstName, user._id)

    return {
      id: user._id,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt
    }
  }

  confirmEmail = async (payload: ConfirmEmail) => {
    await this.validateEmailLink(payload);

    await Promise.all([
      User.updateOne({ _id: payload.userId }, { emailVerified: true }),
      EmailConfirmation.deleteOne({ token: payload.token })
    ]);

    return loginResponse(payload.userId);
  };

  resendConfirmationEmail = async (payload: ResendConfirmationEmail) => {
    const user = await User.findById(payload.userId)
      .select("emailVerified email firstName")
      .lean();

    if (!user) {
      throw new NotFoundException("User does not exist");
    }

    if (user.emailVerified) {
      throw new BadRequestException("Email already verified");
    }

    await this.emailService.sendConfirmationEmail(user.email, user.firstName, user._id)

    return { message: "Confirmation email sent successfully" };
  };

  signIn = async (payload: SignIn) => {
    const user = await User.findOne({ email: payload.email.toLowerCase() })

    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }
    const validPassword = await bcrypt.compare(payload.password, user.password);

    if (!validPassword) {
      throw new BadRequestException("Invalid credentials");
    }
    if (!user.emailVerified) {
      return {
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        },
        emailVerificationRequired: true,
      };
    }
    return loginResponse(user._id.toString());
  }

  forgotPassword = async (email: string) => {
    email = email.toLowerCase();
    const user = await User.findOne({ email }).select("firstName email").lean();

    if (!user) {
      throw new NotFoundException("Sorry, an account with this email does not exist");
    }

    await this.emailService.sendForgotPasswordEmail(user.email, user.firstName, user._id)
    return {
      message: `An email has been sent to ${email}. Kindly follow the steps to reset your password.`,
    };
  };

  resetPassword = async (payload: ResetPassword) => {
    // Validate the reset link (token and expiration time)
    await this.validateEmailLink(payload);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // Update user password and delete the token in parallel
    await Promise.all([
      User.updateOne({ _id: payload.userId }, { password: hashedPassword }),
      EmailConfirmation.deleteOne({ token: payload.token })
    ]);

    return { message: "Password reset successfully" };
  };

  // Check if email link (token) is valid
  validateEmailLink = async (payload: ConfirmEmail) => {
    const savedToken = await EmailConfirmation.findOne({ userId: payload.userId, token: payload.token });

    if (!savedToken) {
      throw new BadRequestException("The link is expired or invalid.");
    }

    // Check if the token has expired
    if (Date.now() > savedToken.expirationTime.getTime()) {
      throw new BadRequestException('Token has expired');
    }
  };

  //Get list of vendors
  getAllVendors = async () => {
    const vendors = await Vendor.find();
    return vendors;
  }

  getVendor = async (vendorId: string) => {
    const vendor = await Vendor.findOne({ _id: vendorId });
    return vendor;
  }
}