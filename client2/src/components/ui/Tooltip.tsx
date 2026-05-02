import React, { useRef, useState, useLayoutEffect } from "react";

type TooltipProps = {
  content: string;
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom";
  contentClassName?: string;
};

export function Tooltip({ content, children, className, side = "top", contentClassName }: TooltipProps) {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [visible, setVisible] = useState(false);
  const [updated, setUpdated] = useState(0);
  // Show/hide tooltip on hover/focus
  const show = () => {
    setVisible(true);
    setUpdated((prev) => prev + 1);
  };
  const hide = () => {
    setVisible(false);
    setUpdated((prev) => prev + 1);
  };

  useLayoutEffect(() => {
    if (!tooltipRef.current || !wrapperRef.current) {
      setStyle({});
      return;
    }
    const tooltip = tooltipRef.current;
    const wrapper = wrapperRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = "50%";
    let translateX = "-50%";
    let top: string | undefined;
    let bottom: string | undefined;
    let translateY = "0";

    // Default vertical position
    if (side === "bottom") {
      top = `100%`;
      translateY = "0";
    } else {
      bottom = `100%`;
      translateY = "-0.25rem"; // -1px for subtle offset
    }

    // Calculate horizontal overflow
    const tooltipWidth = tooltipRect.width;
    const wrapperCenter = wrapperRect.left + wrapperRect.width / 2;
    // let leftPx = wrapperRect.width / 2; // unused
    let shift = 0;
    if (wrapperCenter - tooltipWidth / 2 < 8) {
      // Left overflow
      shift = 8 - (wrapperCenter - tooltipWidth / 2);
    } else if (wrapperCenter + tooltipWidth / 2 > viewportWidth - 8) {
      // Right overflow
      shift = (viewportWidth - 8) - (wrapperCenter + tooltipWidth / 2);
    }
    if (shift !== 0) {
      // Use px for left and remove translateX
      left = `calc(50% + ${shift}px)`;
      translateX = "-50%";
    }

    // Calculate vertical overflow and flip if needed
    if (side === "top" && wrapperRect.top - tooltipRect.height - 12 < 0) {
      // Not enough space above, flip to bottom
      top = `100%`;
      bottom = undefined;
      translateY = "0";
    } else if (side === "bottom" && wrapperRect.bottom + tooltipRect.height + 12 > viewportHeight) {
      // Not enough space below, flip to top
      top = undefined;
      bottom = `100%`;
      translateY = "-0.25rem";
    }

    setStyle({
      left,
      top,
      bottom,
      transform: `translate(${translateX}, ${translateY})`,
      maxWidth: `min(320px, calc(100vw - 16px))`,
    });
  }, [updated]);

  const positionClass =
    side === "bottom"
      ? "top-full mt-1.5"
      : "bottom-full mb-1.5";

  return (
    <div
      ref={wrapperRef}
      className={` relative group/tt ${className ?? ""}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      tabIndex={-1}
    >
      {children}
      <span
        ref={tooltipRef}
        role="tooltip"
        style={style}
        className={`pointer-events-none absolute  z-49  whitespace-nowrap 
            rounded-md border border-slate-200 bg-white px-2 py-1 font-semibold text-slate-700 shadow-md opacity-0 
            transition-all duration-150 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100 ${positionClass} ${contentClassName ?? ""} ${visible ? "opacity-100" : ""}`}
      >
        {content}
      </span>
    </div>
  );
}
