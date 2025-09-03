"use client";

import { Button } from "./ui/button";
import { debounce } from "@/lib/utils";
import { handleLogout } from "@/lib/eventHandlers/handleLogout";

export default function LogoutBtn({
  btnContent,
  className,
  size = "default",
  variant = "default",
  onSuccess = () => {},
  onError = () => {},
}) {
  return (
    <Button
      className={className}
      onClick={debounce(() => handleLogout(null, onSuccess, onError))}
      type="button"
      size={size}
      variant={variant}
    >
      {btnContent || "Logout"}
    </Button>
  );
}
