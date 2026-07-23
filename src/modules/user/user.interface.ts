import { Model } from "mongoose";

export enum EUserRole {
  SUPER_ADMIN = "super_admin",

  MANAGER = "manager",

  CASHIER = "cashier",

  KITCHEN = "kitchen",
}

export type TUser = {
  name: string;

  email: string;

  emailVerified: boolean;

  image: string;

  role: EUserRole;

  createdAt: Date;

  updatedAt: Date;
};

export type TUserModel = Model<TUser>;
