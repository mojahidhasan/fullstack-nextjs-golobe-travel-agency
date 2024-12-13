"use client";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import routes from "@/data/routes.json";
export function AccountDeletedToast() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("deleted") === "true") {
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
      router.replace(routes.signup.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
}
