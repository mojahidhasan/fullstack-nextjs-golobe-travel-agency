"use client";
import { useEffect, useRef } from "react";

export default function Jumper({ id, children }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleJump = (event) => {
      if (event.detail === id && sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("jumpTo", handleJump);
    return () => window.removeEventListener("jumpTo", handleJump);
  }, [id]);

  return (
    <div ref={sectionRef} id={id} className="invisible m-0 h-0 w-0 p-0">
      {children}
    </div>
  );
}

export function jumpTo(id) {
  window.dispatchEvent(new CustomEvent("jumpTo", { detail: id }));
}
