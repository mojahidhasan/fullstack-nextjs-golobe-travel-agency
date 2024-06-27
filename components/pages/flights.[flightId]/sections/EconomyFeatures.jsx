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
          src="https://images.unsplash.com/photo-1483450388369-9ed95738483c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://images.unsplash.com/photo-1483450388369-9ed95738483c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://images.unsplash.com/photo-1483450388369-9ed95738483c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://images.unsplash.com/photo-1483450388369-9ed95738483c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://images.unsplash.com/photo-1483450388369-9ed95738483c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://images.unsplash.com/photo-1483450388369-9ed95738483c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://images.unsplash.com/photo-1483450388369-9ed95738483c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://images.unsplash.com/photo-1483450388369-9ed95738483c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <Image
          height={120}
          width={120}
          className="h-[120px] w-[120px] rounded-[12px] object-cover"
          src="https://images.unsplash.com/photo-1483450388369-9ed95738483c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
      </div>
    </section>
  );
}
