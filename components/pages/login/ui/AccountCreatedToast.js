"use client";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import routes from "@/data/routes.json";
export function AccountCreatedToast() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("signedUp") === "true") {
      toast({
        title: "Signed up Successful",
        description: "You have successfully signed up",
        variant: "default",
      });
      router.replace(routes.login.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
}
