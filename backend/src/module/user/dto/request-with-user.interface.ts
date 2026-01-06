import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
    profileImage?: string;
  };
}
export interface GetMe extends Request {
  user: {
    id: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: UserRole;
    profileImage?: string;

  };
}