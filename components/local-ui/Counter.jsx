"use client";
import { useState, useEffect } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
export default function Counter({ className, defaultCount = 0, maxCount = Infinity, minCount = -Infinity, getCount = () => { } }) {

  const [count, setCount] = useState(() => defaultCount);

  useEffect(() => {
    setCount(defaultCount);
  }, [defaultCount]);


  function handleIncrement() {
    setCount((prev) => {
      const newCount = prev < maxCount ? prev + 1 : prev;
      getCount(newCount);
      return newCount;
    });
  }

  function handleDecrement() {
    setCount((prev) => {
      const newCount = prev > minCount ? prev - 1 : prev;
      getCount(newCount);
      return newCount;
    });
  }
  return <div className={ cn("flex w-fit items-center gap-2 h-8", className) }>
    <button className={ "w-fit h-full" } onClick={ handleDecrement }><MinusCircle width={ 24 } height={ 24 } className={ "w-full h-full text-primary" } /></button>
    <p className={ "h-fit w-8 text-center text-md font-bold" }>{ count }</p>
    <button className={ "w-fit h-full" } onClick={ handleIncrement }><PlusCircle width={ 24 } height={ 24 } className={ "w-full h-full text-primary" } /></button>
  </div>;

}