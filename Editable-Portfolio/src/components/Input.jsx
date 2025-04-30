import React, { useId, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Input = (
  {
    type = "text",
    label,
    className = "",
    showPasswordToggle = false,
    ...props
  },
  ref
) => {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  const inputClassName =
    className.length > 0
      ? `${className}`
      : `px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full`;

  return (
    <div className="w-full relative">
      {label && (
        <label htmlFor={id} className="inline-block mb-1 pl-1 text-white">
          {label}
        </label>
      )}
      <input
        type={inputType}
        id={id}
        className={`${inputClassName} ${showPasswordToggle ? "pr-10" : ""}`}
        {...props}
        ref={ref}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[70%] -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default React.forwardRef(Input);
