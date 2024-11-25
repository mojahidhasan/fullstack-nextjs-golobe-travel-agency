"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
export function RatingStar({
  width = 24,
  height = 34,
  fill = "#fafa00",
  stroke = "none",
  error = "",
  defaultRating = 0,
  ...props
}) {
  const [ratingVal, setRatingVal] = useState(defaultRating || 0);

  function handleClick(currentRating) {
    setRatingVal(currentRating);
  }
  return (
    <div
      className={cn(
        "flex gap-1 w-min",
        error && "border-2 border-destructive rounded-sm"
      )}
    >
      <input type={"hidden"} name={"rating"} value={ratingVal} />
      {Array.from({ length: 5 }).map((el, i) => (
        <SingleStar
          key={i}
          width={width}
          height={height}
          fill={i <= ratingVal - 1 ? fill : "#cccccc"}
          stroke={stroke}
          className={"cursor-pointer"}
          onClick={() => handleClick(i + 1)}
          {...props}
        />
      ))}
    </div>
  );
}

function SingleStar({ width = 24, height = 34, fill, stroke, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18.4687 22.5C18.3109 22.5006 18.1568 22.4514 18.0286 22.3594L12 17.9887L5.97139 22.3594C5.84259 22.4528 5.68742 22.5028 5.52832 22.5022C5.36921 22.5017 5.21441 22.4505 5.08629 22.3561C4.95818 22.2618 4.86339 22.1291 4.81563 21.9774C4.76787 21.8256 4.76961 21.6626 4.82061 21.5119L7.17186 14.5476L1.07811 10.3687C0.946113 10.2783 0.846491 10.1481 0.793797 9.99699C0.741103 9.84593 0.7381 9.68197 0.785225 9.52907C0.83235 9.37618 0.927135 9.24236 1.05573 9.14717C1.18432 9.05198 1.33999 9.0004 1.49998 8.99998H9.0178L11.2865 2.01795C11.3354 1.86721 11.4308 1.73583 11.559 1.64264C11.6871 1.54946 11.8415 1.49927 12 1.49927C12.1584 1.49927 12.3128 1.54946 12.441 1.64264C12.5692 1.73583 12.6645 1.86721 12.7134 2.01795L14.9822 9.00233H22.5C22.6602 9.00225 22.8162 9.05346 22.9452 9.14847C23.0741 9.24348 23.1693 9.37729 23.2167 9.5303C23.2642 9.68331 23.2613 9.84749 23.2087 9.99878C23.1561 10.1501 23.0564 10.2805 22.9242 10.3711L16.8281 14.5476L19.178 21.51C19.216 21.6227 19.2267 21.7429 19.2092 21.8605C19.1917 21.9782 19.1464 22.09 19.0771 22.1868C19.0078 22.2835 18.9165 22.3623 18.8107 22.4168C18.7049 22.4713 18.5877 22.4998 18.4687 22.5Z"
        fill={fill || "currentColor"}
        stroke={stroke || "currentColor"}
        {...props}
      />
    </svg>
  );
}
