"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import locationIcon from "@/public/icons/location.svg";
import { Button } from "@/components/ui/button";

export function Map({ lat = 0, lon = 0, address = "" }) {
  const [key, setKey] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setOverlayVisible(true);
    });

    window.addEventListener("scroll", () => {
      setOverlayVisible(true);
    });
    return () => {
      document.body.removeEventListener("click", () => {
        setOverlayVisible(true);
      });

      window.removeEventListener("scroll", () => {
        setOverlayVisible(true);
      });
    };
  }, []);
  const handleMapClick = () => {
    setOverlayVisible(false);
  };

  const handleReset = () => {
    setKey((prev) => prev + 1);
  };

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.002}%2C${lat - 0.001}%2C${lon + 0.002}%2C${lat + 0.001}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="space-y-3">
      <div className="relative w-full overflow-hidden rounded-xl">
        <iframe
          key={key}
          src={mapSrc}
          className="h-[350px] w-full rounded-xl border-none"
          loading="lazy"
        ></iframe>

        {overlayVisible && (
          <div
            onClick={handleMapClick}
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/30 font-semibold text-white backdrop-blur-sm transition hover:bg-black/20"
          >
            Click to interact with map
          </div>
        )}

        {/* Reset button */}
        <Button
          size="sm"
          onClick={handleReset}
          className="absolute right-2 top-2 z-20 rounded-md bg-white/90 px-3 py-1 text-sm shadow hover:bg-white"
        >
          Reset View
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Image src={locationIcon} alt="location" width={16} height={16} />
        <span className="opacity-75">{address}</span>
      </div>
    </div>
  );
}
