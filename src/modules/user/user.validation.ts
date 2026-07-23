import z from "zod";
import { EUserRole } from "./user.interface";

const updateUserRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum(Object.values(EUserRole)),
  }),
});

export const UserValidation = {
  updateUserRoleValidationSchema,
};
