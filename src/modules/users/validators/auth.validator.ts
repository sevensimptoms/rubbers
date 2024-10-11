import { Joi, validate } from "express-validation";
import { SignUp } from "../interfaces/auth.types";

export const signUp = validate({
  body: Joi.object<SignUp>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
  })
});