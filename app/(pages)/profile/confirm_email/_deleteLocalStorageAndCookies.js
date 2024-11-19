"use client";
import { useEffect } from "react";
import { deleteCookies } from "@/lib/actions";
export default function DeleteLocalStorageAndCookies({ email }) {
  useEffect(() => {
    async function deletes() {
      await deleteCookies(["ces", "sai"]);
      localStorage.removeItem("sendAgainAt");
      const emailsSent = JSON.parse(localStorage.getItem("emailsSent"));

      delete emailsSent[email];
      localStorage.setItem("emailsSent", JSON.stringify(emailsSent));
    }
    deletes();
  }, []);
}
