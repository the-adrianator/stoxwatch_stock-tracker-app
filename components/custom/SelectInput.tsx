import ReactSelect, { StylesConfig } from "react-select";

const SelectInput = ({
  name,
  placeholder,
  options,
  value,
  onChange,
  isSearchable,
  isClearable,
  isDisabled,
}: SelectInputProps) => {
  const customStyles: StylesConfig = {
    control: (base, state) => ({
      ...base,
      height: "48px",
      minHeight: "48px",
      backgroundColor: "#141414", // bg-gray-800
      borderColor: state.isFocused ? "#E8BA40" : "#30333A", // yellow on focus, gray otherwise
      borderRadius: "12px", // rounded-lg
      color: "#ffffff",
      boxShadow: state.isFocused ? "0 0 0 0.3px #E8BA40" : base.boxShadow,
      "&:hover": {
        borderColor: state.isFocused ? "#E8BA40" : "#4b5563",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af", // text-gray-400
    }),
    singleValue: (base) => ({
      ...base,
      color: "#ffffff",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#141414", // bg-gray-800
      borderColor: "#30333A", // border-gray-600
      borderRadius: "12px", // rounded-lg
      borderWidth: "1px",
    }),
    menuList: (base) => ({
      ...base,
      padding: "4px",
      height: "auto",
      maxHeight: "205px",
      // borderRadius: "12px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#30333A" : "transparent", // bg-gray-600 on focus, transparent otherwise
      color: "#ffffff", // text-white
      padding: "6px 8px",
      borderRadius: "6px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#30333A !important", // hover:bg-gray-600
        color: "#ffffff", // hover:text-white
      },
      "&:active": {
        backgroundColor: "#30333A", // active:bg-gray-600
      },
    }),
    input: (base) => ({
      ...base,
      color: "#ffffff",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#4f5865",
      padding: "8px",
      "&:hover": {
        color: "#30333A",
      },
      svg: {
        width: "16px",
        height: "16px",
      },
    }),
  };

  return (
    <div className="space-y-2">
      <ReactSelect
        name={name}
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange as (newValue: unknown) => void}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isDisabled={isDisabled}
        styles={customStyles}
      />
    </div>
  );
};

export default SelectInput;
