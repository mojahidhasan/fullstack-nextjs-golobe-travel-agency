"use client";

import { cn } from "@/lib/utils";

function ProgressStepper({
  steps,
  currentStep,
  className,
  setStep = () => {},
}) {
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
            title={step}
            className={cn(
              `z-[2] flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs font-semibold md:h-8 md:w-8 md:text-base`,
              index + 1 <= currentStep
                ? "bg-primary text-white"
                : "bg-[#e7e8e9] text-[#8b8b8b]",
            )}
            onClick={() => {
              if (index + 1 < currentStep) {
                setStep(index + 1);
              }
            }}
          >
            {index + 1}
          </div>
          <div className="mt-1 hidden text-center text-[10px] text-[#112211] xsm:block md:mt-2 md:text-sm">
            {step}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProgressStepper;
