// Shared dropdown options — matches the Prisma enums.

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: "MARRIED", label: "Married" },
  { value: "UNMARRIED", label: "Unmarried" },
  { value: "WIDOWED", label: "Widowed" },
  { value: "DIVORCED", label: "Divorced" },
];

export const CURRENT_STATUS_OPTIONS = [
  { value: "STUDYING", label: "Studying" },
  { value: "EMPLOYED", label: "Employed" },
  { value: "HOMEMAKER", label: "Homemaker" },
  { value: "RETIRED", label: "Retired" },
  { value: "UNEMPLOYED", label: "Unemployed" },
];

export const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "Public (everyone)" },
  { value: "MEMBERS_ONLY", label: "Members only" },
  { value: "HIDDEN", label: "Hidden" },
];

export const BLOOD_GROUP_OPTIONS = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

export const RELATION_OPTIONS = [
  { value: "Spouse", label: "Spouse" },
  { value: "Son", label: "Son" },
  { value: "Daughter", label: "Daughter" },
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Brother", label: "Brother" },
  { value: "Sister", label: "Sister" },
  { value: "Daughter-in-Law", label: "Daughter-in-Law" },
  { value: "Son-in-Law", label: "Son-in-Law" },
  { value: "Grandfather", label: "Grandfather" },
  { value: "Grandmother", label: "Grandmother" },
  { value: "Grandson", label: "Grandson" },
  { value: "Granddaughter", label: "Granddaughter" },
  { value: "Other", label: "Other" },
];

export const GRIEVANCE_CATEGORY_OPTIONS = [
  { value: "COMMITTEE", label: "Against Committee / Admin" },
  { value: "MEMBER", label: "Against a Member" },
  { value: "EVENT", label: "About an Event / Function" },
  { value: "FINANCIAL", label: "Financial / Donation matter" },
  { value: "SUGGESTION", label: "Suggestion / Feedback" },
  { value: "OTHER", label: "Other" },
];
