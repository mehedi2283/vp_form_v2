import { useFormContext, Controller } from "react-hook-form";
import { Select } from "../ui/Select";
import { AppFormData } from "../../lib/schema";

export const Step3Programme = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AppFormData>();

  const programmes = [
    { label: "Medical Foundation Programme", value: "Medical Foundation Programme" },
    { label: "Foundation in Computer Science", value: "Foundation in Computer Science" },
    { label: "Foundation in Social Sciences", value: "Foundation in Social Sciences" },
    { label: "Foundation in Engineering", value: "Foundation in Engineering" },
    { label: "Foundation in Business Management", value: "Foundation in Business Management" },
  ];

  const intakes = [
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "Sept", value: "Sept" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Programme Selection</h2>

      <Controller
        control={control}
        name="programme"
        render={({ field }) => (
          <Select
            label="Which programme are you applying for? *"
            options={programmes}
            placeholder="Select a programme"
            value={field.value}
            onValueChange={field.onChange}
            error={errors.programme?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="preferredIntake"
        render={({ field }) => (
          <Select
            label="Preferred Intake / Start Date *"
            options={intakes}
            placeholder="Select intake month"
            value={field.value}
            onValueChange={field.onChange}
            error={errors.preferredIntake?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="intendedDegreeProgression"
        render={({ field }) => (
          <Select
            label="Intended Degree Progression (if known)"
            options={programmes} // Using same list as requested, though usually this might be different
            placeholder="Select intended degree"
            value={field.value}
            onValueChange={field.onChange}
            error={errors.intendedDegreeProgression?.message}
          />
        )}
      />
    </div>
  );
};
