"use client";
import { useState, useEffect } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
export default function Counter({ className, defaultCount = 0, maxCount = Infinity, minCount = -Infinity, getCount = () => { } }) {
  const [value, setValue] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getCount(count);
    setValue(count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    setValue(defaultCount);
  }, [defaultCount]);

  function handleIncrement() {
    if (count >= maxCount) {
      return;
    }
    setCount((count) => count + 1);
  }

  function handleDecrement() {
    if (count > minCount) {
      setCount((count) => count - 1);
    }
  }
  return <div className={ cn("flex w-fit items-center gap-2 h-8", className) }>
    <button className={ "w-fit h-full" } onClick={ handleDecrement }><MinusCircle width={ 24 } height={ 24 } className={ "w-full h-full text-primary" } /></button>
    <p className={ "h-fit w-8 text-center text-md font-bold" }>{ value }</p>
    <button className={ "w-fit h-full" } onClick={ handleIncrement }><PlusCircle width={ 24 } height={ 24 } className={ "w-full h-full text-primary" } /></button>
  </div>;

}