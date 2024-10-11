import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
export function FilterRating({ className, value, setValue }) {
  return (
    <ToggleGroup
      type="multiple"
      onValueChange={(value) => {
        setValue(value);
      }}
      value={value}
      className={cn(
        "w-full [&_button[data-state=on]]:bg-primary/20 [&_button]:border [&_button[data-state=on]]:border-primary",
        className
      )}
    >
      <ToggleGroupItem
        className="data-[state=on]:bg-primary/20"
        name={"star1"}
        value="1"
        aria-label="Toggle 1 star"
      >
        +1
      </ToggleGroupItem>
      <ToggleGroupItem name={"star2"} value="2" aria-label="Toggle 2 star">
        +2
      </ToggleGroupItem>
      <ToggleGroupItem name={"star3"} value="3" aria-label="Toggle 3 star">
        +3
      </ToggleGroupItem>
      <ToggleGroupItem name={"star4"} value="4" aria-label="Toggle 4 star">
        +4
      </ToggleGroupItem>
      <ToggleGroupItem name={"star5"} value="5" aria-label="Toggle 5 star">
        +5
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
