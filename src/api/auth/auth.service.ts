import { prisma } from "../../../prisma/prisma";
import {
  CreateUserInput,
  GoogleOAuthInput,
  SignInInput,
} from "./auth.validations";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../shared/services/Error.service";

export const authService = {
  signUp: async (dto: CreateUserInput | GoogleOAuthInput) => {
    const { email, firstName, lastName } = dto;
    const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);

    let passwordHash = null;
    let googleId = null;
    if ("password" in dto) {
      passwordHash = await bcrypt.hash(dto.password, saltRounds);
    } else if ("googleId" in dto) {
      googleId = dto.googleId;
    }

    const user = await prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        passwordHash: passwordHash,
        googleId: googleId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw AppError.create("User creation failed", 500);
    }
    const token = generateToken(user.id, false);
    return {
      user,
      token,
    };
  },

  signIn: async (dto: SignInInput | GoogleOAuthInput) => {
    const { email } = dto;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        passwordHash: true,
        googleId: true,
      },
    });

    if (!user) {
      throw AppError.create("Bad Request", 409);
    }

    let match = false;
    if ("password" in dto && user?.passwordHash) {
      match = await bcrypt.compare(dto?.password, user?.passwordHash || "");
    } else if ("googleId" in dto && user?.googleId) {
      match = user.googleId === dto.googleId;
    }
    if (!match) {
      throw AppError.create("Bad Request", 400);
    }

    const token = generateToken(user.id, false);
    const { lastName, firstName, id } = user;
    return {
      user: {
        id,
        firstName,
        lastName,
      },
      token,
    };
  },

  validateToken: async (token: string) => {
    if (!token) {
      return null;
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw AppError.create("JWT_SECRET is not defined", 500);
    }
    
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      isAdmin: boolean;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, firstName: true, lastName: true, isAdmin: true },
    });

    if (!user) {
      throw AppError.create("User not found", 404);
    }

    return {
      ...user,
      isAdmin: user.isAdmin,
    };
  },
};

const generateToken = (userId: string, isAdmin: boolean) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw AppError.create("JWT_SECRET is not defined", 500);
  }

  const payload = {
    userId,
    isAdmin,
  };
  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
};
