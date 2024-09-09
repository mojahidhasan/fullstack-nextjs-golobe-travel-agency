import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-5 text-7xl font-black">
      <span>The Flight you are looking for may not exist or got deleted</span>
      <Button asChild>
        <Link href="/flights">Search flight</Link>
      </Button>
    </div>
  );
}
