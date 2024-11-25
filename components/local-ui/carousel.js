"use client";
import { useRef, useEffect, useState, Children } from "react";
import { cn } from "@/lib/utils";
function Carousel({ children, className }) {
  return (
    <div
      className={cn(
        "w-[600px] relative h-[600px] bg-slate-500 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

function CarouselItem({ children, className }) {
  return (
    <div
      className={cn(
        "shrink-0 snap-end w-full h-full bg-primary/50 text-9xl font-bold",
        className
      )}
    >
      {children}
    </div>
  );
}

function CarouselContent({
  children,
  className,
  indicator = true,
  interval = 5000,
  gap = 0,
}) {
  const contentRef = useRef(null);
  const dotRef = useRef(null);
  const items = Children.count(children);
  const [active, setActive] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  //initial carousel scroll position on page load
  useEffect(() => {
    contentRef.current.scrollTo(0, 0);
  }, []);

  //auto scroll to next item
  useEffect(() => {
    const int = setInterval(() => {
      setActive((active) => active + 1);
      setActiveDot(active % items);
      const scroll = (active % items) * (contentRef.current.offsetWidth + gap);
      contentRef.current.scrollTo(scroll, 0);
    }, interval);

    return () => clearInterval(int);
  }, [items, interval, active, gap]);
  return (
    <>
      <div
        ref={contentRef}
        className={cn(
          "scroll-smooth w-full flex snap-x snap-mandatory overflow-hidden h-full",
          className
        )}
      >
        {children}
      </div>
      {indicator && (
        <div
          className="absolute bottom-4 -translate-x-1/2 left-1/2 flex sm:gap-2 2xsm:gap-1 gap-0"
          ref={dotRef}
        >
          {Array.from({ length: items }).map((_, i) => {
            return (
              <div
                key={i}
                className={cn(
                  "transition-all scale-50 2xsm:scale-75 sm:scale-100 duration-500 w-[10px] h-[10px] rounded-full",
                  activeDot === i ? "bg-primary w-[30px]" : `bg-white`
                )}
              ></div>
            );
          })}
        </div>
      )}
    </>
  );
}

export { Carousel, CarouselItem, CarouselContent };
