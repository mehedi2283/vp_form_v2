import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const fileValidation = z.any()
  .refine((files) => {
    if (!files || files.length === 0) return true; // Optional
    return files[0].size <= MAX_FILE_SIZE;
  }, "Max file size is 5MB. Please reduce the image size.")
  .optional();

export const formSchema = z.object({
  // Step 1: Personal Details
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  preferredName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().min(1, "Please select your date of birth"),
  gender: z.enum(["Male", "Female", "Prefer not to say", "Other"]),
  nationality: z.string().min(1, "Nationality is required"),
  passportNumber: z.string().optional(),
  countryOfResidence: z.string().min(1, "Country of residence is required"),
  requiresVisa: z.enum(["Yes", "No"]),

  // Step 2: Contact Information
  emailAddress: z.string().email("Invalid email address"),
  confirmEmailAddress: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required").refine((val) => val.startsWith('+'), "Phone number must include country code (e.g., +44)"),
  currentAddress: z.string().min(1, "Current address is required"),

  // Step 3: Programme Selection
  programme: z.string().min(1, "Programme selection is required"),
  preferredIntake: z.string().min(1, "Preferred intake is required"),
  intendedDegreeProgression: z.string().optional(),

  // Step 4: Academic Background
  highestQualification: z.string().min(1, "Highest qualification is required"),
  institutionName: z.string().min(1, "Institution name is required"),
  countryOfInstitution: z.string().min(1, "Country of institution is required"),
  yearOfCompletion: z.string().min(1, "Year of completion is required"),
  qualificationsAndGrades: z.string().min(1, "Qualifications and grades are required"),

  // Step 5: English Language Ability
  isEnglishFirstLanguage: z.enum(["Yes", "No"]),
  englishTestTaken: z.string().optional(),
  englishTestScore: z.string().optional(),
  englishTestDate: z.string().optional(),

  // Step 6: Supporting Documents
  passportUpload: fileValidation,
  transcriptsUpload: fileValidation,
  englishCertUpload: fileValidation,
  personalStatement: z.string().min(100, "Personal statement must be at least 100 characters"),

  // Step 7: Additional Information
  hasDisability: z.enum(["Yes", "No", "Prefer not to say"]),
  disabilityDetails: z.string().optional(),
  requiresLearningSupport: z.enum(["Yes", "No"]),

  // Step 8: Marketing & Referral
  hearAboutUs: z.string().min(1, "Please tell us how you heard about us"),
  agentName: z.string().optional(),
  declaration1: z.boolean().refine((val) => val === true, "You must confirm this statement"),
  declaration2: z.boolean().refine((val) => val === true, "You must confirm this statement"),
  declaration3: z.boolean().refine((val) => val === true, "You must confirm this statement"),
  declaration4: z.boolean().refine((val) => val === true, "You must confirm this statement"),
  signature: z.string().min(1, "Signature is required"), // Base64 string
}).refine((data) => data.emailAddress === data.confirmEmailAddress, {
  message: "Email addresses must match",
  path: ["confirmEmailAddress"],
}).refine((data) => {
  if (data.isEnglishFirstLanguage === "No") {
    // If English is not first language, check if test details are filled if 'Not taken yet' is NOT selected?
    // The prompt says: "If No is selected show: englishTestTaken...". It doesn't explicitly say they are required, 
    // but usually they are unless "Not taken yet" is chosen. Let's assume required if shown.
    if (!data.englishTestTaken) return false;
  }
  return true;
}, {
  message: "Please select which English test you have taken",
  path: ["englishTestTaken"],
}).refine((data) => {
  if (data.hasDisability === "Yes" && !data.disabilityDetails) {
    return false;
  }
  return true;
}, {
  message: "Please provide details about your disability",
  path: ["disabilityDetails"],
});

export type AppFormData = z.infer<typeof formSchema>;
