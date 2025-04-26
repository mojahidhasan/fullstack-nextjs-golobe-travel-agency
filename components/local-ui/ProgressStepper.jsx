"use client";

import { cn } from "@/lib/utils";

function ProgressStepper({ steps, currentStep, className }) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between py-3 md:py-5",
        className,
      )}
    >
      {steps.map((step, index) => (
        <div key={index} className="relative flex flex-1 flex-col items-center">
          <div
            className={`z-[2] flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold md:h-8 md:w-8 md:text-base ${
              index + 1 === currentStep
                ? "bg-primary text-white"
                : index + 1 < currentStep
                  ? "bg-primary text-white"
                  : "bg-[#e7e8e9] text-[#8b8b8b]"
            }`}
          >
            {index + 1}
          </div>
          <div className="mt-1 hidden text-center text-[10px] text-[#112211] xsm:block md:mt-2 md:text-sm">
            {step}
          </div>
          {/* Show only step number on very small screens */}
          <div className="mt-1 text-center text-[10px] text-[#112211] xsm:hidden">
            Step {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`absolute left-[calc(50%+10px)] top-3 z-[1] h-[1px] w-[calc(100%-20px)] md:left-[calc(50%+16px)] md:top-4 md:h-[2px] md:w-[calc(100%-32px)] ${index + 1 < currentStep ? "bg-primary" : "bg-[#e7e8e9]"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ProgressStepper;
