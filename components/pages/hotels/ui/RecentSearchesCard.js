import { Fragment } from "react";
import Image from "next/image";

export function RecentSearchesCard({
  imgSrc = ``,
  placeName = "Tokyo",
  tags = ["Flight", "Hotel"],
}) {
  return (
    <div className="flex items-center gap-[16px] rounded-[16px] border p-[16px] shadow-md">
      <Image
        className="aspect-square w-[90px] rounded-[8px]"
        width={90}
        height={90}
        src={imgSrc}
        alt=""
      />
      <div>
        <p className="text-[1rem] font-semibold text-secondary opacity-70">
          {placeName}
        </p>
        <p>
          {tags.map((tag, i) => {
            if (i === tags.length - 1) return <span key={i}>{tag}</span>;
            return (
              <Fragment key={i}>
                <span className="text-[0.875rem] font-medium text-secondary">
                  {tag}
                </span>
                <span className="mx-[8px] inline-block">•</span>
              </Fragment>
            );
          })}
        </p>
      </div>
    </div>
  );
}
