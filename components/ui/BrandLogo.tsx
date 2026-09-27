interface BrandLogoProps {
  name: string;
  className?: string;
  /** Classes for the small second line (colour, size). */
  subClassName?: string;
}

/** Two-line wordmark: first word in display type, the rest small and tracked. Not uppercased, to keep "uPVC". */
export function BrandLogo({ name, className = "", subClassName = "" }: BrandLogoProps) {
  const [primary, ...rest] = name.split(" ");
  const secondary = rest.join(" ");

  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="font-display tracking-tight">{primary}</span>
      {secondary && (
        <span
          className={`mt-1 text-[0.6875rem] font-medium tracking-[0.12em] sm:text-xs ${subClassName}`}
        >
          {secondary}
        </span>
      )}
    </span>
  );
}
