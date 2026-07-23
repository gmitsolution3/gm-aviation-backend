export const admissionSearchableFields = [
  "personalInformation.fullName",
  "personalInformation.email",
  "personalInformation.phone",
] as const;

export type TAdmissionSearchableField =
  (typeof admissionSearchableFields)[number];

export const admissionFilterableFields = [
  "status",
  "course",
] as const;

export type TAdmissionFilterableField =
  (typeof admissionFilterableFields)[number];

export const AdmissionConstants = {
  messages: {
    created: "Admission submitted successfully.",
    reviewed: "Admission reviewed successfully.",

    retrieved: "Admission retrieved successfully.",
    retrievedAll: "Admissions retrieved successfully.",

    notFound: "Admission not found.",
    alreadyApplied: "You have already applied for this course.",

    inactiveCourse: "This course is currently inactive.",
    unpublishedCourse: "This course is not available for admission.",
    admissionClosed: "Admission is currently closed for this course.",

    invalidStatusTransition: "Invalid admission status transition.",
  },
} as const;