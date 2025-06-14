import { useEffect, useState } from "react";

/**
 *
 * @param {string | URL | globalThis.Request} url
 * @param {RequestInit} [init]
 * @returns {{ data: Object | null, error: string | null , loading: boolean, retry: () => void }}
 */
export default function useFetch(url, init) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trying, setTrying] = useState(1);
  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const res = await fetch(url, {
          ...init,
          headers: { ...init.headers, "Content-Type": "application/json" },
          signal: controller.signal,
        });

        const json = await res.json();

        if (json.success === false) {
          throw new Error(json.message);
        }

        setData(json);
      } catch (e) {
        if (e.name === "AbortError") return;
        setError(e.message);
      }
      setLoading(false);
    }
    fetchData();
    return () => controller.abort();
  }, [url, init?.body, trying]);

  function retry() {
    setTrying(trying + 1);
  }
  return { data, error, loading, retry };
}
