import {
  InferSchemaType,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

import { EAdmissionStatus } from "./admission.enum";
import {
  addressInformationSchema,
  aviationInformationSchema,
  documentSchema,
  educationInformationSchema,
  guardianInformationSchema,
  personalInformationSchema,
  reviewSchema,
} from "./model";

const admissionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(EAdmissionStatus),
      default: EAdmissionStatus.SUBMITTED,
      index: true,
    },

    personalInformation: {
      type: personalInformationSchema,
      required: true,
    },

    addressInformation: {
      type: addressInformationSchema,
      required: true,
    },

    guardianInformation: {
      type: guardianInformationSchema,
      required: true,
    },

    educationInformation: {
      type: educationInformationSchema,
      required: true,
    },

    aviationInformation: {
      type: aviationInformationSchema,
      required: true,
    },

    documents: {
      type: new Schema(
        {
          photo: {
            type: documentSchema,
            required: true,
          },

          nidOrBirthCertificate: {
            type: documentSchema,
            required: true,
          },

          academicCertificate: {
            type: documentSchema,
            required: true,
          },

          passport: documentSchema,

          medicalCertificate: documentSchema,
        },
        {
          _id: false,
        },
      ),
      required: true,
    },

    review: {
      type: reviewSchema,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

admissionSchema.index(
  {
    user: 1,
    course: 1,
  },
  {
    unique: true,
  },
);

export type TAdmission = InferSchemaType<typeof admissionSchema>;

export const Admission: Model<TAdmission> =
  models.Admission || model<TAdmission>("Admission", admissionSchema);