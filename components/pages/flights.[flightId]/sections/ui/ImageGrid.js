import Image from "next/image";
import { cn } from "@/lib/utils";
export function ImageGrid({
  imagesStrArr,
  imagesWidth = 400,
  imagesHeight = 400,
}) {
  const grids = {
    1: "grid-cols-1 grid-rows-1",
    2: "grid-cols-2 grid-rows-1",
    3: "grid-cols-2 grid-rows-2",
    4: "grid-cols-2 grid-rows-2",
    5: "grid-cols-4 grid-rows-2",
    6: "grid-cols-3 grid-rows-2",
    7: "grid-cols-5 grid-rows-3",
  };
  const firstPicSpan = {
    1: "",
    2: "",
    3: "row-span-2",
    4: "",
    5: "row-span-3 col-span-2",
    6: "",
    7: "row-span-3 col-span-3",
  };

  return (
    <div className={cn("grid gap-3", grids[imagesStrArr.length])}>
      {imagesStrArr.map((imageStr, index) => (
        <div
          key={index}
          className={cn(
            "rounded-lg w-auto h-auto overflow-hidden shadow-md",
            index === 0 && firstPicSpan[imagesStrArr.length],
            index !== 0 && "row-auto col-auto"
          )}
        >
          <Image
            src={imageStr}
            width={imagesWidth}
            height={imagesHeight}
            alt={`Airplane Image ${index + 1}`}
            className="object-cover w-full h-full transition duration-300 transform hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}
