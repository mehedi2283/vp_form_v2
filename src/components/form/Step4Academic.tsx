import { useFormContext, Controller } from "react-hook-form";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { AppFormData } from "../../lib/schema";

export const Step4Academic = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AppFormData>();

  const qualifications = [
    { label: "Secondary / High School", value: "Secondary / High School" },
    { label: "O-Levels / GCSEs / Equivalent", value: "O-Levels / GCSEs / Equivalent" },
    { label: "A-Levels / IB / Equivalent", value: "A-Levels / IB / Equivalent" },
    { label: "Diploma", value: "Diploma" },
    { label: "Bachelor's Degree", value: "Bachelor's Degree" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Academic Background</h2>

      <Controller
        control={control}
        name="highestQualification"
        render={({ field }) => (
          <Select
            label="Highest Level of Qualification Achieved *"
            options={qualifications}
            placeholder="Select highest qualification"
            value={field.value}
            onValueChange={field.onChange}
            error={errors.highestQualification?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Name of School / College / University *"
          placeholder="Enter institution name"
          {...register("institutionName")}
          error={errors.institutionName?.message}
        />
        <Input
          label="Country of Institution *"
          placeholder="Enter country of institution"
          {...register("countryOfInstitution")}
          error={errors.countryOfInstitution?.message}
        />
      </div>

      <Input
        label="Year of Completion *"
        placeholder="Select year of completion"
        {...register("yearOfCompletion")}
        error={errors.yearOfCompletion?.message}
      />

      <Textarea
        label="Qualifications Achieved & Grades *"
        placeholder="Please list subjects and grades, e.g. A-Levels, IB, national certificates, or degree results..."
        {...register("qualificationsAndGrades")}
        error={errors.qualificationsAndGrades?.message}
      />
    </div>
  );
};
