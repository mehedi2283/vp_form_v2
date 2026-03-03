import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "../ui/Textarea";
import { RadioGroup } from "../ui/RadioGroup";
import { AppFormData } from "../../lib/schema";

export const Step7Additional = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<AppFormData>();

  const hasDisability = watch("hasDisability");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>

      <Controller
        name="hasDisability"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Do you have any disability, learning difficulty, or medical condition you wish to disclose?"
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
              { label: "Prefer not to say", value: "Prefer not to say" },
            ]}
            value={field.value}
            onChange={field.onChange}
            error={errors.hasDisability?.message}
            name="hasDisability"
          />
        )}
      />

      {hasDisability === "Yes" && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <Textarea
            label="If Yes, please provide details:"
            placeholder="Provide relevant details..."
            {...register("disabilityDetails")}
            error={errors.disabilityDetails?.message}
          />
        </div>
      )}

      <Controller
        name="requiresLearningSupport"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Do you require additional learning or welfare support?"
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            value={field.value}
            onChange={field.onChange}
            error={errors.requiresLearningSupport?.message}
            name="requiresLearningSupport"
          />
        )}
      />
    </div>
  );
};
