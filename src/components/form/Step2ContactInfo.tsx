import { useFormContext } from "react-hook-form";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { AppFormData } from "../../lib/schema";

export const Step2ContactInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<AppFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email Address *"
          type="email"
          placeholder="Enter email address"
          {...register("emailAddress")}
          error={errors.emailAddress?.message}
        />
        <div className="space-y-1">
          <Input
            label="Confirm Email Address *"
            type="email"
            placeholder="Confirm email address"
            {...register("confirmEmailAddress")}
            error={errors.confirmEmailAddress?.message}
          />
          <p className="text-[10px] text-gray-400">Re-enter your email address</p>
        </div>
      </div>

      <Input
        label="Mobile / Phone Number (include country code) *"
        placeholder="Enter phone number"
        {...register("phoneNumber")}
        error={errors.phoneNumber?.message}
      />

      <Textarea
        label="Current Address *"
        placeholder="Enter current address"
        {...register("currentAddress")}
        error={errors.currentAddress?.message}
      />
    </div>
  );
};
