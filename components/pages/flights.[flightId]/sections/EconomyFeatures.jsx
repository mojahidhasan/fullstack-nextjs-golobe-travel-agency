import { Checkbox } from "@/components/ui/checkbox";

import Image from "next/image";

export function EconomyFeatures() {
  return (
    <section className="text-secondary">
      <div className="mb-[24px] flex items-center justify-center max-md:flex-col max-md:gap-[20px] md:justify-between">
        <h2 className="font-tradeGothic text-[1.5rem] font-bold">
          Basic Economy Features
        </h2>
        <div className="flex gap-[20px] max-lg:flex-wrap">
          <Checkbox id={"economy-uweygduw"} label={"Economy"} defaultChecked />{" "}
          <Checkbox id={"first-class-jeyhvc"} label={"First  Class"} />
          <Checkbox id={"business-class-kehdu"} label={"Business Class"} />
        </div>
      </div>
      <div className="mb-[40px] flex justify-between gap-[8px] overflow-hidden">
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-12px object-cover"
          src="https://source.unsplash.com/_TUvJQS9Aoo"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://source.unsplash.com/_TUvJQS9Aoo"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://source.unsplash.com/_TUvJQS9Aoo"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://source.unsplash.com/_TUvJQS9Aoo"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://source.unsplash.com/_TUvJQS9Aoo"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://source.unsplash.com/_TUvJQS9Aoo"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://source.unsplash.com/_TUvJQS9Aoo"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://source.unsplash.com/_TUvJQS9Aoo"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://source.unsplash.com/_TUvJQS9Aoo"
          alt=""
        />
      </div>
    </section>
  );
}
