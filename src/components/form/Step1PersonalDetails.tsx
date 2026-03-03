import { useFormContext, Controller } from "react-hook-form";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { DatePicker } from "../ui/DatePicker";
import { RadioGroup } from "../ui/RadioGroup";
import { AppFormData } from "../../lib/schema";

export const Step1PersonalDetails = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AppFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name *"
          placeholder="Enter first name"
          {...register("firstName")}
          error={errors.firstName?.message}
        />
        <Input
          label="Surname *"
          placeholder="Enter surname"
          {...register("surname")}
          error={errors.surname?.message}
        />
      </div>

      <Input
        label="Preferred Name (if different)"
        placeholder="Enter here"
        {...register("preferredName")}
        error={errors.preferredName?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email *"
          type="email"
          placeholder="Enter email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <DatePicker
              label="Date Of Birth *"
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : "")}
              error={errors.dateOfBirth?.message}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="gender"
        render={({ field }) => (
          <Select
            label="Gender"
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Prefer not to say", value: "Prefer not to say" },
              { label: "Other", value: "Other" },
            ]}
            placeholder="Select gender"
            value={field.value}
            onValueChange={field.onChange}
            error={errors.gender?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nationality *"
          placeholder="Enter nationality"
          {...register("nationality")}
          error={errors.nationality?.message}
        />
        <Input
          label="Country of Residence *"
          placeholder="Enter country of residence"
          {...register("countryOfResidence")}
          error={errors.countryOfResidence?.message}
        />
      </div>

      <Input
        label="Passport Number (** For International Students)"
        placeholder="Enter passport number"
        {...register("passportNumber")}
        error={errors.passportNumber?.message}
      />

      <Controller
        name="requiresVisa"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Do you require a visa to study in the UK? *"
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            value={field.value}
            onChange={field.onChange}
            error={errors.requiresVisa?.message}
            name="requiresVisa"
          />
        )}
      />
    </div>
  );
};
