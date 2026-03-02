interface SectionHeadingProps {
  subhead?: string;
  title: React.ReactNode;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeading({
  subhead,
  title,
  description,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {subhead && (
        <span
          className={`mb-4 inline-block text-sm font-semibold uppercase tracking-wider ${
            light ? 'text-primary' : 'text-primary'
          }`}
        >
          {subhead}
        </span>
      )}
      <h2
        className={`text-3xl font-bold md:text-4xl lg:text-5xl ${
          light ? 'text-white' : 'text-navy'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mx-auto mt-4 max-w-2xl text-lg ${
            light ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
