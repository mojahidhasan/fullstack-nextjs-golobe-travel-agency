import React from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

function InfoPage({ whatHappened, explanation, navigateTo }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-4 flex justify-center">
          <AlertCircle className="textsk h-12 w-12 text-sky-500" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-gray-800">
          {whatHappened}
        </h1>
        <p className="mb-6 text-gray-600">{explanation}</p>
        {navigateTo?.path && navigateTo?.title && (
          <Button
            className="bg-sky-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
            asChild
          >
            <Link href={navigateTo.path}>{navigateTo.title}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default InfoPage;
