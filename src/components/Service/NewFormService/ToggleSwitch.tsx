interface ToggleSwitchProps {
  name: string;
  value: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  name,
  value,
  handleChange,
}) => {
  return (
    <label
      className={`relative m-0 block h-7.5 w-14 rounded-full ${
        value === true ? "bg-primary" : "bg-stroke"
      }`}
    >
      <input
        value={value ? "1" : "0"}
        type="checkbox"
        name={name}
        onChange={handleChange}
        className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
      />
      <span
        className={`absolute left-[3px] top-1/2 flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
          value === true && "!right-[3px] !translate-x-full"
        }`}
      ></span>
    </label>
  );
};

export default ToggleSwitch;
