"use client";

import { useEffect, useState } from "react";

// user have to be logged in
export default function useFetchCards() {
  const [cardData, setCardData] = useState([]);
  const [fetchError, setFetchError] = useState({
    status: false,
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [trying, setTrying] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    async function getPaymentCards() {
      setLoading(true);
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/user/get_payment_cards",
          { next: { revalidate: 600 }, signal: controller.signal },
        );
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const data = await res.json();
        if (data.success === false) {
          throw new Error(data.message);
        }

        setFetchError({ status: false, message: "" });
        setCardData(data.data);
        setLoading(false);
      } catch (err) {
        if (err.name === "AbortError") return;
        setLoading(false);
        setFetchError({
          status: true,
          message: err.message,
        });
      }
    }

    getPaymentCards();
    return () => controller.abort();
  }, [trying]);

  function tryAgain() {
    setTrying(Date.now());
  }

  return {
    loading,
    cardData,
    fetchError,
    tryAgain,
  };
}
