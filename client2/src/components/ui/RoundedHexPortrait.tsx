import { useId } from "react";

export function RoundedHexPortrait({
  src,
  alt,
  className,
  imageInset = 4,
}: {
  src: string;
  alt: string;
  className: string;
  imageInset?: number;
}) {
  const clipPathId = useId().replace(/:/g, "");
  const innerClipPathId = `${clipPathId}-inner`;
  const imageScale = (100 - imageInset * 2) / 100;
  const hexPath =
    "M50 4 C53.5 4 56 5.2 58.3 7.2 L87.7 24.2 C90.5 25.8 92 28.3 92 31.5 V68.5 C92 71.7 90.5 74.2 87.7 75.8 L58.3 92.8 C56 94.8 53.5 96 50 96 C46.5 96 44 94.8 41.7 92.8 L12.3 75.8 C9.5 74.2 8 71.7 8 68.5 V31.5 C8 28.3 9.5 25.8 12.3 24.2 L41.7 7.2 C44 5.2 46.5 4 50 4 Z";

  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
        <defs>
          <clipPath id={clipPathId}>
            <path d={hexPath} />
          </clipPath>
          <clipPath id={innerClipPathId}>
            <path d={hexPath} transform={`translate(50 50) scale(${imageScale}) translate(-50 -50)`} />
          </clipPath>
        </defs>
        <path d={hexPath} fill="white" />
        <image
          href={src}
          x="0"
          y="0"
          width="100"
          height="100"
          preserveAspectRatio="xMidYMid slice"
        //   clipPath={`url(#${innerClipPathId})`}
        />
      </svg>
      <span className="sr-only">{alt}</span>
    </div>
  );
}
