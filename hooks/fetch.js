import { useState, useEffect } from "react";

export const useFetchGet = (url, options = {}) => {
  if (options?.method !== "GET") {
    throw new Error("method must be GET");
  }
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      //fake delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        setIsPending(false);
        setData(json);
        setError(null);
      } catch (error) {
        setError(`${error} Could not Fetch Data `);
        setIsPending(false);
      }
    };
    fetchData();
  }, []);
  return { data, isPending, error };
};
