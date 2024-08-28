"use client";
import { useRef } from "react";
export function Notification() {
  const ref = useRef(null);
  function expandLines() {
    ref.current.classList.toggle("line-clamp-2");
  }
  return (
    <div className="text-[0.75rem] font-semibold text-center text-secondary p-2 bg-secondary text-white">
      <div ref={ref} className="line-clamp-2">
        This website is still in development. Some functionalities may not be
        available or don&apos;t work properly. Head to this{" "}
        <a
          className="underline text-tertiary font-bold"
          href="https://github.com/mojahidhasan/golob-travel-agency-nextjs?tab=readme-ov-file#todo"
          target="_blank"
        >
          GitHub repository
        </a>{" "}
        to see which functionalities are yet to develop.
      </div>
      <button
        className="text-primary min-[583px]:hidden underline-offset-4 underline"
        onClick={expandLines}
      >
        View more
      </button>
    </div>
  );
}
