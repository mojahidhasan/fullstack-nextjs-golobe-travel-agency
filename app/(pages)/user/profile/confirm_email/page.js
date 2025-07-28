import { redirect } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import DeleteLocalStorageAndCookies from "./_deleteLocalStorageAndCookies";

export default async function ConfirmEmailPage({ searchParams }) {
  const token = searchParams?.token;

  if (!token) {
    return <ErrorCard message="Invalid or missing token." />;
  }

  const res = await fetch(
    `${process.env.API_URL}/api/confirm_email?token=${token}`,
    {
      cache: "no-store",
    },
  );
  const data = await res.json();

  if (data?.redirectURL) {
    redirect(data.redirectURL);
  }

  const isSuccess = data?.success === true;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div
        className={`w-full max-w-md rounded-xl border p-6 text-center shadow-sm ${isSuccess ? "border-green-300 bg-green-50 text-green-800" : "border-red-300 bg-red-50 text-red-800"}`}
      >
        {isSuccess ? (
          <>
            <CheckCircle className="mx-auto mb-2 h-12 w-12 text-green-600" />
            <h1 className="mb-2 text-xl font-semibold">{data.message}</h1>
            <p className="text-sm text-gray-600">You may now close this tab.</p>
            <DeleteLocalStorageAndCookies email={data.verifiedEmail} />
          </>
        ) : (
          <>
            <AlertCircle className="mx-auto mb-2 h-12 w-12 text-red-600" />
            <h1 className="mb-2 text-xl font-semibold">
              {data.message || "Verification failed."}
            </h1>
            <p className="text-sm text-gray-600">
              Please try again or contact support.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function ErrorCard({ message }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-red-300 bg-red-50 p-6 text-center text-red-800">
        <AlertCircle className="mx-auto mb-2 h-12 w-12 text-red-600" />
        <h1 className="mb-2 text-xl font-semibold">Error</h1>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
