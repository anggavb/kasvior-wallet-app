import { useState } from "react";
/**
 * A component for rendering a pin input field with a specified length.
 * @param {Object} props - The props for the component.
 * @param {number} props.length - The number of input fields to display.
 * @param {string} props.value - Optional controlled pin value.
 * @param {Function} props.callbackForm - Callback invoked with the full pin.
 * @param {boolean} props.autoFocus - Whether to focus the first input on mount.
 * @returns {JSX.Element} The rendered pin input component.
 */
const PinInput = ({ length = 6, value, callbackForm, autoFocus = true }) => {
  const [pin, setPin] = useState(Array(length).fill(""));
  const isControlled = value != null;
  const currentPin = isControlled
    ? Array.from({ length }, (_, index) => value[index] || "")
    : pin;

  const handleChange = (value, idx) => {
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newPin = [...currentPin];
    newPin[idx] = value;

    if (!isControlled) {
      setPin(newPin);
    }

    if (callbackForm) {
      callbackForm(newPin.join(""));
    }
  };

  return (
    <div className="flex justify-center gap-2 mt-6 mb-8 sm:mt-8 sm:mb-12">
      {[...Array(length)].map((_, idx) => (
        <input
          value={currentPin[idx] || ""}
          onChange={(e) => handleChange(e.target.value, idx)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && e.target.value === "" && idx > 0) {
              const prevInput = e.target.parentElement.children[idx - 1];
              prevInput.focus();
              prevInput.value = "";
              handleChange("", idx - 1);
            }
          }}
          onInput={(e) => {
            if (e.target.value && idx < length - 1) {
              const nextInput = e.target.parentElement.children[idx + 1];
              nextInput.focus();
            }
          }}
          key={idx}
          type="password"
          maxLength="1"
          inputMode="numeric"
          autoFocus={autoFocus && idx === 0}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-8.75 h-10.5 sm:w-10 sm:h-12 md:w-11.25 md:h-13.75 font-bold text-center text-[1.3rem] sm:text-[1.5rem] md:text-[1.8rem] text-neutral-800 bg-transparent border-b-2 outline-none transition-colors duration-300 focus:border-blue-700 border-neutral-200"
        />
      ))}
    </div>
  );
};

export default PinInput;
