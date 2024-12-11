"use client";

import DeleteLocalStorageAndCookies from "./_deleteLocalStorageAndCookies";
import { useEffect, useState } from "react";

export default function ConfirmEmailPage({ searchParams }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirm_email?token=${searchParams?.token}`
        );
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        setStatus({ success: false, message: "An error occurred" });
      }
    };

    confirmEmail();
  }, [searchParams?.token]);

  if (!status) {
    return <div>Loading...</div>;
  }

  if (status?.redirectURL) {
    window.location.href = status?.redirectURL;
  }

  return (
    <div className="flex flex-col justify-center items-center text-5xl font-bold h-screen">
      {status.success === true ? (
        <>
          <DeleteLocalStorageAndCookies email={status?.verifiedEmail} />
          <h1>{status.message}</h1>
          <h1>You may close this tab</h1>
        </>
      ) : (
        <h1>{status.message}</h1>
      )}
    </div>
  );
}
