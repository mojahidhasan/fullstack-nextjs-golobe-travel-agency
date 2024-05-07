import Image from "next/image";
export function SmallDataCard({ imgSrc, title, data }) {
  return (
    <div className="flex items-center gap-[8px]">
      <div className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-primary/20">
        <Image src={imgSrc} width={22} height={22} alt="" />
      </div>
      <div>
        <p className="text-[0.75rem] font-semibold opacity-60">{title}</p>
        <p className="font-medium">{data}</p>
      </div>
    </div>
  );
}
