import { useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Checkbox } from "../ui/Checkbox";
import { Button } from "../ui/Button";
import { AppFormData } from "../../lib/schema";

export const Step8Marketing = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<AppFormData>();

  const sigPad = useRef<SignatureCanvas>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Marketing & Referral</h2>

      <Controller
        control={control}
        name="hearAboutUs"
        render={({ field }) => (
          <Select
            label="How did you hear about Veritas Pathways?"
            options={[
              { label: "Website", value: "Website" },
              { label: "Education Agent", value: "Education Agent" },
              { label: "School / Counsellor", value: "School / Counsellor" },
              { label: "Social Media", value: "Social Media" },
              { label: "Friend or Family", value: "Friend or Family" },
              { label: "Other", value: "Other" },
            ]}
            placeholder="Select an option"
            value={field.value}
            onValueChange={field.onChange}
            error={errors.hearAboutUs?.message}
          />
        )}
      />

      <Input
        label="Agent Name (if applicable)"
        placeholder="Enter agent name"
        {...register("agentName")}
        error={errors.agentName?.message}
      />

      <div className="space-y-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Declaration & Consent *</h3>
        
        <Checkbox
          id="declaration1"
          label="I confirm that the information provided in this application is true and accurate."
          onCheckedChange={(checked) => setValue("declaration1", checked === true, { shouldValidate: true })}
          error={errors.declaration1?.message}
        />
        <Checkbox
          id="declaration2"
          label="I understand that submitting this form does not guarantee an offer of admission."
          onCheckedChange={(checked) => setValue("declaration2", checked === true, { shouldValidate: true })}
          error={errors.declaration2?.message}
        />
        <Checkbox
          id="declaration3"
          label="I consent to Veritas Pathways storing and processing my data in accordance with its Privacy Policy."
          onCheckedChange={(checked) => setValue("declaration3", checked === true, { shouldValidate: true })}
          error={errors.declaration3?.message}
        />
        <Checkbox
          id="declaration4"
          label="I confirm that I have completed this form willingly and accurately. I understand that my information will be used for admission purposes and handled in accordance with UK GDPR and applicable data protection laws."
          onCheckedChange={(checked) => setValue("declaration4", checked === true, { shouldValidate: true })}
          error={errors.declaration4?.message}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Your Signature</label>
        <div 
          className="border border-gray-300 rounded-md overflow-hidden bg-white h-40"
        >
          <SignatureCanvas
            ref={sigPad}
            penColor="black"
            canvasProps={{
              className: "w-full h-full cursor-crosshair",
            }}
            onEnd={() => {
              if (sigPad.current) {
                setValue("signature", sigPad.current.toDataURL(), { shouldValidate: true });
              }
            }}
          />
        </div>
        <input type="hidden" {...register("signature")} />
        {errors.signature && (
          <p className="text-xs text-red-500">{errors.signature.message}</p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              sigPad.current?.clear();
              setValue("signature", "", { shouldValidate: true });
            }}
            className="text-xs text-[#2DD4BF] underline hover:text-[#26b5a3]"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
