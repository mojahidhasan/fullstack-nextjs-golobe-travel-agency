import Link from "next/link";
import { Button } from "@/components/ui/button";
import routes from "@/data/routes.json";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center dark:bg-gray-900">
      <h1 className="text-9xl font-extrabold text-primary drop-shadow-xl transition-all duration-500 hover:text-destructive dark:text-gray-700">
        404
      </h1>
      <p className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Page Not Found
      </p>
      <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
        moved. Let&apos;s take you back home.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href={routes.home.path}>{routes.home.title || "Go Home"}</Link>
        </Button>
      </div>
    </div>
  );
}
