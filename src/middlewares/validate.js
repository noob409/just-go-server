import { check, query, validationResult } from "express-validator";

export const validateRegister = [
  check("username").notEmpty().withMessage("Username is required"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("password").notEmpty().withMessage("password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateLogin = [
  check("email").isEmail().withMessage("Invalid email format"),
  check("password").notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

//  Here, token stands for auth-code
export const validateGoogleLogin = [
  check("token").notEmpty().withMessage("token is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
