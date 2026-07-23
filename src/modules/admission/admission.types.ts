import { Types } from "mongoose";
import {
  EBloodGroup,
  EGender,
} from "./admission.enum";

export type TDocument = {
  url: string;
};

export type TPersonalInformation = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: EGender;
  bloodGroup: EBloodGroup;
  nationality: string;
};

export type TAddressInformation = {
  presentAddress: string;
  permanentAddress: string;
};

export type TGuardianInformation = {
  fatherName: string;
  motherName: string;
  guardianName: string;
  relationship: string;
  guardianPhone: string;
};

export type TEducationInformation = {
  highestQualification: string;
  institutionName: string;
  passingYear: number;
  result: string;
};

export type TAviationInformation = {
  passportNumber?: string;
  height?: number;
  weight?: number;
  medicalInformation?: string;
};

export type TDocuments = {
  photo: TDocument;
  nidOrBirthCertificate: TDocument;
  academicCertificate: TDocument;
  passport?: TDocument;
  medicalCertificate?: TDocument;
};

export type TReview = {
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  remark?: string;
};