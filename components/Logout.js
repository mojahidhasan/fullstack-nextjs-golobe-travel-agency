"use client";

import { signOutAction } from "@/lib/actions";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { debounce } from "@/lib/utils";

export default function Logout({
  btnContent,
  className,
  size = "default",
  variant = "default",
  onSuccess = () => {},
  onError = () => {},
}) {
  async function handleLogout(e) {
    const toastId = toast.loading("Signing out...", {
      id: "signout",
      description: "Please wait...",
    });

    const res = await signOutAction();

    if (res?.success === true) {
      toast.success("Signed out", {
        id: toastId,
        description: res?.message,
      });
      onSuccess(res);
    }

    if (res?.success === false) {
      toast.error("Logout failed", { id: toastId, description: res?.message });
      onError(res);
    }
  }

  return (
    <Button
      className={className}
      onClick={debounce(handleLogout)}
      type="button"
      size={size}
      variant={variant}
    >
      {btnContent || "Logout"}
    </Button>
  );
}
