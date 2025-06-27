"use client";

import { cn } from "@/lib/utils";

function ProgressStepper({
  steps,
  currentStepValue,
  onCurrentValueChange = () => {},
  className,
}) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-between py-3 md:py-5",
        className,
      )}
    >
      {steps.map((step, index) => {
        const currentStepIndex = steps.findIndex(
          (s) => s.value === currentStepValue,
        );
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.value}
            className="relative flex flex-1 flex-col items-center"
          >
            <div className="relative z-[2] flex w-full items-center justify-center">
              <div
                title={step.label}
                className={cn(
                  `flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-full text-xs font-semibold md:h-8 md:w-8 md:text-base`,
                  index <= currentStepIndex
                    ? "bg-primary text-white"
                    : "bg-[#e7e8e9] text-[#8b8b8b]",
                )}
                onClick={() => {
                  onCurrentValueChange(step.value);
                }}
              >
                {index + 1}
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "absolute left-[60%] top-1/2 -z-10 h-0.5 w-[80%] -translate-y-1/2 rounded-full md:h-1",
                    index < currentStepIndex ? "bg-primary" : "bg-[#e7e8e9]",
                  )}
                ></div>
              )}
            </div>

            <div className="mt-1 text-center text-[10px] text-[#112211] md:mt-2 md:text-sm">
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProgressStepper;
