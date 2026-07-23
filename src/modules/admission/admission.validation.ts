import { z } from "zod";

import {
  EAdmissionStatus,
  EBloodGroup,
  EGender,
} from "./admission.enum";

const objectIdSchema = z.string().trim().min(1);

const documentSchema = z.object({
  url: z.string().trim().url(),
});

const personalInformationSchema = z.object({
  fullName: z.string().trim().min(1),

  email: z.email().trim().toLowerCase(),

  phone: z.string().trim().min(1),

  dateOfBirth: z.coerce.date(),

  gender: z.enum(EGender),

  bloodGroup: z.enum(EBloodGroup),

  nationality: z.string().trim().min(1),
});

const addressInformationSchema = z.object({
  presentAddress: z.string().trim().min(1),

  permanentAddress: z.string().trim().min(1),
});

const guardianInformationSchema = z.object({
  fatherName: z.string().trim().min(1),

  motherName: z.string().trim().min(1),

  guardianName: z.string().trim().min(1),

  relationship: z.string().trim().min(1),

  guardianPhone: z.string().trim().min(1),
});

const educationInformationSchema = z.object({
  highestQualification: z.string().trim().min(1),

  institutionName: z.string().trim().min(1),

  passingYear: z.coerce.number().int(),

  result: z.string().trim().min(1),
});

const aviationInformationSchema = z.object({
  passportNumber: z.string().trim().optional(),

  height: z.coerce.number().positive().optional(),

  weight: z.coerce.number().positive().optional(),

  medicalInformation: z.string().trim().optional(),
});

const createAdmissionValidationSchema = z.object({
  body: z.object({
    user: objectIdSchema,

    course: objectIdSchema,

    personalInformation: personalInformationSchema,

    addressInformation: addressInformationSchema,

    guardianInformation: guardianInformationSchema,

    educationInformation: educationInformationSchema,

    aviationInformation: aviationInformationSchema,

    documents: z.object({
      photo: documentSchema,

      nidOrBirthCertificate: documentSchema,

      academicCertificate: documentSchema,

      passport: documentSchema.optional(),

      medicalCertificate: documentSchema.optional(),
    }),
  }),
});

const reviewAdmissionValidationSchema = z.object({
  body: z.object({
    status: z.enum([
      EAdmissionStatus.UNDER_REVIEW,
      EAdmissionStatus.APPROVED,
      EAdmissionStatus.REJECTED,
    ]),

    remark: z.string().trim().optional(),
  }),
});

export type TCreateAdmissionPayload = z.infer<
  typeof createAdmissionValidationSchema
>["body"];

export type TReviewAdmissionPayload = z.infer<
  typeof reviewAdmissionValidationSchema
>["body"];

export const AdmissionValidation = {
  createAdmissionValidationSchema,
  reviewAdmissionValidationSchema,
};