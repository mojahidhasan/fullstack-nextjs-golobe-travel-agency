import Link from "next/link";
import { Button } from "@/components/ui/button";
import routes from "@/data/routes.json";

export default function NotFound({
  whatHappened,
  explanation,
  navigateTo = { path: "/", title: "Go Home" },
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center dark:bg-gray-900">
      <h1 className="text-9xl font-extrabold text-primary drop-shadow-xl transition-all duration-500 hover:text-destructive dark:text-gray-700">
        404
      </h1>
      <p className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        {whatHappened || "Page Not Found"}
      </p>
      <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
        {explanation ||
          "Sorry, the page you're looking for doesn't exist or has been moved. Let's take you back home."}
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href={navigateTo.path || routes.home.path}>
            {navigateTo.title || routes.home.title || "Go Home"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
