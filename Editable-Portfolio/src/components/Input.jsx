import React, { useId } from "react";

// eslint-disable-next-line react/display-name
const Input = React.forwardRef(
  ({ type = "text", label, className = "", ...props }, ref) => {
    const id = useId();

    const inputClassName =
      className.length > 0
        ? `${className}`
        : `px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full`;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="inline-block mb-1 pl-1">
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={inputClassName}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

export default Input;
