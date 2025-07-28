"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function TruncatedBadgeList({ label, items }) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, 5);
  const showToggle = items.length > 5;

  return (
    <div>
      <p className="mb-1 text-sm font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {visibleItems.map((item, index) => (
          <Badge key={`${item}-${index}`} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
      {showToggle && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm font-bold text-tertiary hover:underline"
        >
          {expanded ? "Show less" : "See more"}
        </button>
      )}
    </div>
  );
}
