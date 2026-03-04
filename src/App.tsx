import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { formSchema, AppFormData } from "./lib/schema";
import { Button } from "./components/ui/Button";
import { Step1PersonalDetails } from "./components/form/Step1PersonalDetails";
import { Step2ContactInfo } from "./components/form/Step2ContactInfo";
import { Step3Programme } from "./components/form/Step3Programme";
import { Step4Academic } from "./components/form/Step4Academic";
import { Step5English } from "./components/form/Step5English";
import { Step6Documents } from "./components/form/Step6Documents";
import { Step7Additional } from "./components/form/Step7Additional";
import { Step8Marketing } from "./components/form/Step8Marketing";
import { fetchNextApplicationId, generatePDF } from "./lib/pdfGenerator";
import { HighLevel } from "./lib/ghlService";
import { LoadingOverlay } from "./components/ui/LoadingOverlay";
import { SuccessScreen } from "./components/ui/SuccessScreen";

const steps = [
  {
    id: 1,
    title: "Personal Details",
    component: Step1PersonalDetails,
    fields: [
      "firstName",
      "surname",
      "preferredName",
      "email",
      "dateOfBirth",
      "gender",
      "nationality",
      "passportNumber",
      "countryOfResidence",
      "requiresVisa",
    ],
  },
  {
    id: 2,
    title: "Contact Info",
    component: Step2ContactInfo,
    fields: [
      "emailAddress",
      "confirmEmailAddress",
      "phoneNumber",
      "currentAddress",
    ],
  },
  {
    id: 3,
    title: "Programme",
    component: Step3Programme,
    fields: ["programme", "preferredIntake", "intendedDegreeProgression"],
  },
  {
    id: 4,
    title: "Academic",
    component: Step4Academic,
    fields: [
      "highestQualification",
      "institutionName",
      "countryOfInstitution",
      "yearOfCompletion",
      "qualificationsAndGrades",
    ],
  },
  {
    id: 5,
    title: "English",
    component: Step5English,
    fields: [
      "isEnglishFirstLanguage",
      "englishTestTaken",
      "englishTestScore",
      "englishTestDate",
    ],
  },
  {
    id: 6,
    title: "Documents",
    component: Step6Documents,
    fields: [
      "passportUpload",
      "transcriptsUpload",
      "englishCertUpload",
      "personalStatement",
    ],
  },
  {
    id: 7,
    title: "Additional",
    component: Step7Additional,
    fields: ["hasDisability", "disabilityDetails", "requiresLearningSupport"],
  },
  {
    id: 8,
    title: "Review & Submit",
    component: Step8Marketing,
    fields: [
      "hearAboutUs",
      "agentName",
      "declaration1",
      "declaration2",
      "declaration3",
      "declaration4",
      "signature",
    ],
  },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [applicationId, setApplicationId] = useState("");

  const methods = useForm<AppFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      dateOfBirth: "",
      gender: "Male",
      requiresVisa: "No",
      isEnglishFirstLanguage: "No",
      hasDisability: "No",
      requiresLearningSupport: "No",
      declaration1: false,
      declaration2: false,
      declaration3: false,
      declaration4: false,
    }
  });

  const { trigger, handleSubmit } = methods;

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await trigger(fields as any);

    // Special check for Step 2 email matching if trigger didn't catch it
    if (currentStep === 1 && isValid) {
      const { emailAddress, confirmEmailAddress } = methods.getValues();
      if (emailAddress !== confirmEmailAddress) {
        methods.setError("confirmEmailAddress", {
          type: "manual",
          message: "Email addresses must match",
        });
        return;
      }
    }

    if (isValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const onSubmit: SubmitHandler<AppFormData> = async (data) => {
    setIsSubmitting(true);
    
    try {
      // 1. Generate Application ID
      setLoadingMessage("Fetching Application ID...");
      const newApplicationId = await fetchNextApplicationId();
      setApplicationId(newApplicationId);

      // 2. Initialize GHL Service
      const clientId = (import.meta as any).env?.VITE_GHL_LOCATION_ID;
      const apiKey = (import.meta as any).env?.VITE_GHL_API_KEY;
      
      if (!clientId || !apiKey) {
        throw new Error("Missing GHL client credentials in environment variables.");
      }

      const highLevel = new HighLevel({
        clientId,
        clientSecret: apiKey,
      });

      // Helper to get extension
      const getExt = (file: File) => {
        const name = file.name;
        const lastDot = name.lastIndexOf('.');
        return lastDot !== -1 ? name.substring(lastDot) : '';
      };

      // Helper to upload and get URL
      const uploadFile = async (file: File, customName: string) => {
        const renamedFile = new File([file], customName, { type: file.type });
        const response = await highLevel.medias.uploadMediaContent({
          file: renamedFile,
          name: customName,
          hosted: false,
        });
        const responseData = response as any;
        return responseData.data?.url || responseData.data?.fileUrl || responseData.url || responseData.fileUrl;
      };

      // 3. Generate PDF (Now with access to uploaded image URLs directly from File objects)
      setLoadingMessage("Generating your application PDF...");
      // Wait a tick to ensure UI updates
      await new Promise(r => setTimeout(r, 100));
      const pdfBlob = await generatePDF(data, newApplicationId);
      
      // 4. Upload Application PDF
      setLoadingMessage("Uploading application form...");
      const applicationPdfUrl = await uploadFile(
        new File([pdfBlob], `${newApplicationId}.pdf`, { type: 'application/pdf' }),
        `${newApplicationId}.pdf`
      );

      // 5. Webhook
      setLoadingMessage("Finalising your submission...");
      
      const webhookKeys: Record<string, string> = {
        firstName: "first_name",
        surname: "surname",
        preferredName: "preferred_name",
        email: "email",
        dateOfBirth: "date_of_birth",
        gender: "gender",
        nationality: "nationality",
        passportNumber: "passport_number",
        countryOfResidence: "country_of_residence",
        requiresVisa: "requires_visa",
        emailAddress: "email_address",
        confirmEmailAddress: "confirm_email_address",
        phoneNumber: "phone_number",
        currentAddress: "current_address",
        programme: "programme",
        preferredIntake: "preferred_intake",
        intendedDegreeProgression: "intended_degree_progression",
        highestQualification: "highest_qualification",
        institutionName: "institution_name",
        countryOfInstitution: "country_of_institution",
        yearOfCompletion: "year_of_completion",
        qualificationsAndGrades: "qualifications_and_grades",
        isEnglishFirstLanguage: "is_english_first_language",
        englishTestTaken: "english_test_taken",
        englishTestScore: "english_test_score",
        englishTestDate: "english_test_date",
        personalStatement: "personal_statement",
        hasDisability: "has_disability",
        disabilityDetails: "disability_details",
        requiresLearningSupport: "requires_learning_support",
        hearAboutUs: "hear_about_us",
        agentName: "agent_name",
        declaration1: "declaration_1",
        declaration2: "declaration_2",
        declaration3: "declaration_3",
        declaration4: "declaration_4",
        signature: "signature"
      };

      // Map data to webhook keys
      const webhookData: Record<string, any> = {
        application_id: newApplicationId,
        application_pdf: applicationPdfUrl
      };

      Object.entries(data).forEach(([key, value]) => {
        // Skip file uploads as we send links
        if (key === 'passportUpload' || key === 'transcriptsUpload' || key === 'englishCertUpload') return;
        
        const webhookKey = webhookKeys[key] || key;
        webhookData[webhookKey] = value === undefined ? "" : value;
      });

      const webhookUrl = (import.meta as any).env?.VITE_GHL_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error("Missing GHL webhook URL in environment variables.");
      }

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData)
      });

      // 8. Success
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'form_submission_success',
          name: `${data.firstName} ${data.surname}`,
          email: data.emailAddress || data.email,
          phone: data.phoneNumber,
          application_id: newApplicationId,
          programme: data.programme
        });
      }
      window.location.href = "https://veritaspathways.co.uk/thank-you/";
      
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  if (isSuccess) {
    return <SuccessScreen applicationId={applicationId} />;
  }

  return (
    <div className="w-full h-full font-sans text-gray-900 bg-white p-4">
      {isSubmitting && <LoadingOverlay message={loadingMessage} />}
      
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-[#2DD4BF]">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 w-full rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2DD4BF] transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div key={currentStep}>
              <CurrentStepComponent />
            </div>

            <div className="flex justify-between pt-8 border-t border-gray-100 mt-8">
              <Button
                type="button"
                variant="secondary"
                onClick={prevStep}
                disabled={currentStep === 0 || isSubmitting}
                className={currentStep === 0 ? "invisible" : ""}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={!methods.formState.isValid}
                >
                  Submit Application
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="button" onClick={nextStep}>
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
