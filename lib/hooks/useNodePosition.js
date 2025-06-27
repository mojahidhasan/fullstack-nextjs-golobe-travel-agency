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

      const containerRect =
        popoverRef.current.offsetParent?.getBoundingClientRect?.() ?? {
          top: 0,
          left: 0,
        };

      let position = {
        left: buttonRect.left - containerRect.left,
        top:
          placement === "bottom"
            ? buttonRect.bottom - containerRect.top
            : buttonRect.top - popoverHeight - containerRect.top,
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
