"use client";

import { AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <section className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-red-100 to-red-200 px-4 text-center dark:from-red-900 dark:to-red-800">
          <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-950">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 shadow-inner dark:bg-red-900">
              <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-red-700 dark:text-red-300">
              Something went wrong
            </h1>
            <button
              onClick={reset}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-2 text-white shadow-md transition duration-200 hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </section>
      </body>
    </html>
  );
}
