"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setStayForm } from "@/reduxStore/features/stayFormSlice";

import { cn } from "@/lib/utils";

export function Combobox({ className, searchResult, name }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(searchResult);
  const [filter, setFilter] = useState(items);

  const value = useSelector((state) => state.stayForm.value.destination);

  function handleChange(e) {
    const value = e.target.value;
    const filter = items.filter((item) =>
      item.label.toLowerCase().includes(value.toLowerCase())
    );
    setFilter(filter);
  }

  return (
    <Popover open={ open } onOpenChange={ setOpen }>
      <PopoverTrigger className={ cn("text-left", className) } asChild>
        <Button
          variant="ghost"
          className="justify-start line-clamp-1 font-normal"
        >
          { value === "" ? "Where are you going?" : value }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <Input
          className="w-full mb-3"
          placeholder="Search..."
          onChange={ handleChange }
        />
        <div className="h-80 overflow-auto">
          <div>
            { Object.keys(filter).length < 1 ? (
              <div className="p-4 text-center text-sm">No results found</div>
            ) : (
              filter.map((obj) => (
                <div
                  key={ obj.label }
                  onClick={ () => {
                    dispatch(
                      setStayForm({
                        destination: obj.label === value ? "" : obj.label,
                      })
                    );
                    setOpen(false);
                  } }
                  obj={ obj.label }
                  className="flex cursor-pointer items-center justify-between p-4 hover:bg-muted"
                >
                  <div className="text-sm">{ obj.label }</div>
                </div>
              ))
            ) }
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
