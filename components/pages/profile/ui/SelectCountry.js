"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import countryInfo from "@/data/countryInfo.json";
import { ChevronDown } from "lucide-react";
export function SelectCountry({ name = "country" }) {
  const [country, setCountry] = useState(countryInfo[0].emoji);
  const [callingCode, setCallingCode] = useState(countryInfo[0].dial_code);
  const ulRef = useRef();
  useEffect(() => {
    function adjustHeight() {
      const screenHeight = window.innerHeight;
      const ul = ulRef.current;
      const ulPosition = ul.getBoundingClientRect();

      const ulHeight = screenHeight - ulPosition.y - 30;
      ul.style.maxHeight = `${ulHeight}px`;
    }
    window.addEventListener("resize", adjustHeight);
    adjustHeight();

    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, []);

  function handleTrigger(e) {
    ulRef.current.classList.toggle("invisible");
  }

  return (
    <div>
      <input name={name} type="hidden" value={callingCode} />
      <Button
        variant="icon"
        type="button"
        className="h-full !bg-slate-100 px-2 bg-inherit text-2xl lg:text-3xl"
        onClick={handleTrigger}
      >
        {country}&nbsp;{" "}
        <span className={"text-sm text-disabled-foreground"}>
          {callingCode}
        </span>
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
      <ul
        ref={ulRef}
        className={
          "absolute invisible overflow-y-scroll golobe-scrollbar rounded-lg p-2 top-10 lg:top-14 left-0 z-50 w-full bg-white shadow-lg border"
        }
      >
        {countryInfo.map((item, i) => (
          <li
            key={item.code}
            className="flex mb-1 items-center gap-2 p-2 hover:bg-slate-100"
            onClick={() => {
              setCountry(item.emoji);
              setCallingCode(item.dial_code);
            }}
          >
            <span className={"text-2xl"}>{item.emoji}</span>
            {item.name} ({item.dial_code})
          </li>
        ))}
      </ul>
    </div>
  );
}
