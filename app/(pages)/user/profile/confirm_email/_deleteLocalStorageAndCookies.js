"use client";
import { useEffect } from "react";
import { deleteCookies } from "@/lib/actions";
import routes from "@/data/routes.json";
export default function DeleteLocalStorageAndCookies({ email }) {
  useEffect(() => {
    async function deletes() {
      await deleteCookies(["ces", "sai"]);
      localStorage.removeItem("sendAgainAt");
      const emailsSent = JSON.parse(localStorage.getItem("emailsSent"));

      delete emailsSent[email];
      localStorage.setItem("emailsSent", JSON.stringify(emailsSent));

      setTimeout(() => window.location.replace(routes.profile.path), 2000);
    }
    deletes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
