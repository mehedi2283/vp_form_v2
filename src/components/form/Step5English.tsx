import { useFormContext, Controller } from "react-hook-form";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { DatePicker } from "../ui/DatePicker";
import { RadioGroup } from "../ui/RadioGroup";
import { AppFormData } from "../../lib/schema";

export const Step5English = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<AppFormData>();

  const isEnglishFirstLanguage = watch("isEnglishFirstLanguage");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">English Language Ability</h2>

      <Controller
        name="isEnglishFirstLanguage"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Is English your first language? *"
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            value={field.value}
            onChange={field.onChange}
            error={errors.isEnglishFirstLanguage?.message}
            name="isEnglishFirstLanguage"
          />
        )}
      />

      {isEnglishFirstLanguage === "No" && (
        <div className="space-y-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="text-lg font-serif italic">If No, please complete below:</p>
          <Controller
            control={control}
            name="englishTestTaken"
            render={({ field }) => (
              <Select
                label="English Language Test Taken"
                options={[
                  { label: "IELTS", value: "IELTS" },
                  { label: "TOEFL", value: "TOEFL" },
                  { label: "PTE", value: "PTE" },
                  { label: "Other", value: "Other" },
                  { label: "Not taken yet", value: "Not taken yet" },
                ]}
                placeholder='Choose test or select "Not taken yet"'
                value={field.value}
                onValueChange={field.onChange}
                error={errors.englishTestTaken?.message}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Overall Score"
              placeholder="Enter overall score.."
              {...register("englishTestScore")}
              error={errors.englishTestScore?.message}
            />
            <Controller
              control={control}
              name="englishTestDate"
              render={({ field }) => (
                <DatePicker
                  label="Test Date (or Expected Date)"
                  placeholder="Enter date taken or planned test date"
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : "")}
                  error={errors.englishTestDate?.message}
                />
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};
