import useColorMode from "@/hooks/useColorMode";

const toggleState = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
        <label
          className={`relative m-0 block h-7.5 w-14 rounded-full ${
            colorMode === "on" ? "bg-primary" : "bg-stroke"
          }`}
        >
        <input
          type="checkbox"
          onChange={() => {
            if (typeof setColorMode === "function") {
              setColorMode(colorMode === "off" ? "on" : "off");
            }
          }}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute left-[3px] top-1/2 flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${
            colorMode === "on" && "!right-[3px] !translate-x-full"
          }`}
        >
        </span>
      </label>
  );
};

export default toggleState ;
