import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
}

const secret: jwt.Secret = process.env.JWT_SECRET || "fallback-secret";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId } as TokenPayload, secret, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, secret) as TokenPayload;
};
