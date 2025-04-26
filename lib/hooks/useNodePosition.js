"use client";

import { useEffect, useState } from "react";

export default function usePopoverNodePosition({
  popoverRef,
  popoverTriggerRef,
  alignment,
  isOpen = false,
}) {
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    placement: "bottom",
  });
  useEffect(() => {
    function calculatePosition() {
      if (!popoverRef.current || !popoverTriggerRef.current) return;

      const buttonRect = popoverTriggerRef.current.getBoundingClientRect();
      const popoverHeight = popoverRef.current.offsetHeight;
      const popoverWidth = popoverRef.current.offsetWidth;
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      // Determine if dropdown should appear above or below
      const placement =
        spaceBelow >= popoverHeight || spaceBelow >= spaceAbove
          ? "bottom"
          : "top";

      let position = {
        left: buttonRect.left + window.scrollX,
        top:
          placement === "bottom"
            ? buttonRect.bottom + window.scrollY
            : buttonRect.top - popoverHeight + window.scrollY,
        width: buttonRect.width,
        placement,
      };

      if (alignment === "center") {
        const pos = position.left + buttonRect.width / 2 - popoverWidth / 2;
        position.left = Math.max(0, pos);
      }
      if (alignment === "right") {
        const pos = position.left + buttonRect.width - popoverWidth;
        position.left = Math.max(0, pos);
      }
      setDropdownPosition(position);
    }

    if (isOpen) {
      calculatePosition();

      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);
    }

    return () => {
      window.removeEventListener("scroll", calculatePosition, true);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [popoverRef, popoverTriggerRef, alignment, isOpen]);

  return dropdownPosition;
}
