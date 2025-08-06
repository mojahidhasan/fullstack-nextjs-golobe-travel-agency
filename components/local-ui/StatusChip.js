import { cn } from "@/lib/utils";

const StatusChip = ({ text, bg, color }) => (
  <div
    className={cn("rounded-full px-3 py-1 text-xs font-semibold", bg, color)}
  >
    {text}
  </div>
);

export default StatusChip;
