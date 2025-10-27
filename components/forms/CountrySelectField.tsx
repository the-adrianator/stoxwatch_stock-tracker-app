import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import countryList from "react-select-country-list";
import SelectInput from "@/components/custom/SelectInput";
import { GroupBase } from "react-select";
import { Controller } from "react-hook-form";

const CountrySelectField = ({
  name,
  label,
  control,
  error,
  required,
}: CountrySelectProps) => {
  const countries = countryList().getData();

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const options = useMemo(() => {
    return countries.map((country) => ({
      value: country.value,
      label: `${getFlagEmoji(country.value)} ${country.label}`,
    }));
  }, [countries]);

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <SelectInput
            name={name}
            placeholder="Select your country"
            options={
              options as unknown as readonly (string | GroupBase<string>)[]
            }
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default CountrySelectField;
