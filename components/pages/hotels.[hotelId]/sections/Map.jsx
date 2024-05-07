import Image from "next/image";

import location from "@/public/icons/location.svg";

export function Map() {
  function handleClick(e) {
    e.target.style.display = "none";
  }
  return (
    <div>
      <div className="relative">
        <iframe
          width="425"
          height="350"
          src="https://www.openstreetmap.org/export/embed.html?bbox=28.972363471984863%2C41.00569842459431%2C28.976161479949955%2C41.00706671132942&amp;layer=mapnik"
          className="w-full rounded-16px border-none"
        ></iframe>
        <div
          onClick={handleClick}
          className="absolute left-0 top-0 flex h-[350px] w-full items-center justify-center rounded-[16px] bg-black/30 font-extrabold text-white"
        >
          Click to control map
        </div>
      </div>
      <div className="flex items-center">
        <Image src={location} alt="" className="mr-1" />
        <span className="text-[0.875rem] opacity-75">
          Gümüssuyu Mah. Inönü Cad. No:8, Istanbul 34437
        </span>
      </div>
    </div>
  );
}
