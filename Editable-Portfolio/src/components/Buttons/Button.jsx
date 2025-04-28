function ButtonPrimary({
  href,
  target = "_self",
  label,
  icon,
  classes,
  ...probs
}) {
  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={"btn btn-primary " + classes}
        {...probs}
      >
        {label}

        {icon && (
          <span className="material-symbols-rounded" aria-hidden="true">
            {icon}
            {console.log(icon)}
          </span>
        )}
      </a>
    );
  } else {
    return (
      <button className={"btn btn-primary " + classes}>
        {" "}
        {label}
        {icon ? (
          <span className="material-symbols-rounded" aria-hidden="true">
            {icon}
          </span>
        ) : undefined}
      </button>
    );
  }
}

export default ButtonPrimary;
