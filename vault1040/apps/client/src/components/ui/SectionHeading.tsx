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
        <div className={`mb-4 ${centered ? 'flex justify-center' : ''}`}>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
              light
                ? 'bg-white/15 text-primary backdrop-blur-sm'
                : 'bg-primary/10 text-primary'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {subhead}
          </span>
        </div>
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
