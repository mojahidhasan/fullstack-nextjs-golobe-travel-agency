"use client";
import { useState, useEffect } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
export default function Counter({
  className,
  defaultCount = 0,
  maxCount = Infinity,
  minCount = -Infinity,
  getCount = () => {},
}) {
  const [count, setCount] = useState(() => defaultCount);

  useEffect(() => {
    getCount(count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleIncrement() {
    const c = Math.min(count + 1, maxCount);
    setCount(c);
    getCount(c);
  }

  function handleDecrement() {
    const c = Math.max(count - 1, minCount);
    setCount(c);
    getCount(c);
  }
  return (
    <div className={cn("flex h-8 w-fit items-center gap-2", className)}>
      <button className={"h-full w-fit"} onClick={handleDecrement}>
        <MinusCircle
          width={24}
          height={24}
          className={"h-full w-full text-primary"}
        />
      </button>
      <p className={"text-md h-fit w-8 text-center font-bold"}>{count}</p>
      <button className={"h-full w-fit"} onClick={handleIncrement}>
        <PlusCircle
          width={24}
          height={24}
          className={"h-full w-full text-primary"}
        />
      </button>
    </div>
  );
}
