import Link from "next/link";
import { Button } from "@/components/ui/button";
import routes from "@/data/routes.json";
export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5 text-7xl font-black">
      <span>404</span>
      <Button asChild>
        <Link href={routes.home.path}>{routes.home.title}</Link>
      </Button>
    </div>
  );
}
