"use client"; // Error components must be Client Components
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div
      className={
        "h-screen p-1 w-full flex justify-center items-center flex-col"
      }
    >
      <h2 className={"font-bold text-4xl text-center mb-5"}>
        Something went wrong!
      </h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
