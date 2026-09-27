import Image from "next/image";

interface BrandLogoProps {
  name: string;
  src: string;
  className?: string;
  /** Classes for the small second line (colour, size). */
  subClassName?: string;
  /** Optional slogan on one line, starting at the mark’s left edge. */
  tagline?: string;
  taglineClassName?: string;
  markClassName?: string;
  /** Load immediately in the sticky header. */
  priority?: boolean;
}

/**
 * Circular HTD mark + two-line wordmark. Mark is a fixed square matching the
 * wordmark stack (~44–48px) so it cannot collapse. First word in display type;
 * the rest stay mixed-case so "uPVC" is preserved.
 */
export function BrandLogo({
  name,
  src,
  className = "",
  subClassName = "",
  tagline,
  taglineClassName = "",
  markClassName = "h-11 w-11 lg:h-12 lg:w-12",
  priority = false,
}: BrandLogoProps) {
  const [primary, ...rest] = name.split(" ");
  const secondary = rest.join(" ");

  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span className="inline-flex items-center gap-2.5">
        <Image
          src={src}
          alt=""
          width={96}
          height={96}
          priority={priority}
          className={`shrink-0 object-contain ${markClassName}`}
        />
        <span className="inline-flex min-w-0 flex-col justify-center leading-none">
          <span className="font-display tracking-tight">{primary}</span>
          {secondary && (
            <span
              className={`mt-1 text-[0.6875rem] font-medium tracking-[0.12em] sm:text-xs ${subClassName}`}
            >
              {secondary}
            </span>
          )}
        </span>
      </span>
      {tagline && (
        <span
          className={`mt-2 whitespace-nowrap text-xs font-normal leading-none tracking-normal ${taglineClassName}`}
        >
          {tagline}
        </span>
      )}
    </span>
  );
}