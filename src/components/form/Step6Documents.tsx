import { useFormContext } from "react-hook-form";
import { Textarea } from "../ui/Textarea";
import { FileInput } from "../ui/FileInput";
import { AppFormData } from "../../lib/schema";

export const Step6Documents = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<AppFormData>();

  const personalStatement = watch("personalStatement") || "";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Supporting Documents</h2>

      <div className="space-y-4">
        <p className="text-sm text-gray-500 italic">(You may upload documents now or after submitting the form)</p>
        <FileInput
          label="Upload Passport (Photo Page) (picture only)"
          placeholder="Upload clear passport photo page"
          accept="image/*"
          {...register("passportUpload")}
          error={errors.passportUpload?.message as string}
        />
        <FileInput
          label="Upload Academic Transcripts / Certificates (picture only)"
          placeholder="Upload official academic records"
          accept="image/*"
          {...register("transcriptsUpload")}
          error={errors.transcriptsUpload?.message as string}
        />
        <FileInput
          label="Upload English Language Certificate (if available) (picture only)"
          placeholder="Upload if available"
          accept="image/*"
          {...register("englishCertUpload")}
          error={errors.englishCertUpload?.message as string}
        />
      </div>

      <div className="space-y-1">
        <Textarea
          label="Personal Statement *"
          placeholder="Write your personal statement..."
          rows={6}
          {...register("personalStatement")}
          error={errors.personalStatement?.message}
        />
        <div className="flex justify-end">
          <span
            className={`text-xs ${
              personalStatement.length < 100 ? "text-red-500" : "text-green-600"
            }`}
          >
            {personalStatement.length} characters (min 100)
          </span>
        </div>
      </div>
    </div>
  );
};
