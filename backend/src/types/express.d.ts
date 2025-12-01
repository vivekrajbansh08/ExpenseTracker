// Type definitions for Express with custom properties
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: any;
  email: string;
  name: string;
  // Add other user properties as needed
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      userId?: string;
    }
  }
}

export {};
