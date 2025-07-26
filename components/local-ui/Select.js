"use client";

import usePopoverNodePosition from "@/lib/hooks/useNodePosition";
import { cn } from "@/lib/utils";
import {
  forwardRef,
  useRef,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import { Button } from "../ui/button";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { Input } from "./input";

const SelecValueContext = createContext({
  value: {},
  name: "",
  setValue: () => {},
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {},
  triggerRef: null,
  options: {},
  setOptions: () => {},
});

const SelectPopover = forwardRef(
  (
    {
      children,
      className,
      search = true,
      containerDomObjRef,
      align = "left",
      ...props
    },
    ref,
  ) => {
    const [searchQuery, setSearchQuery] = useState("");
    const popoverRef = useRef(ref);
    const cntx = useContext(SelecValueContext);
    const popoverNodePosition = usePopoverNodePosition({
      popoverRef: popoverRef,
      popoverTriggerRef: cntx.triggerRef,
      alignment: align,
      isOpen: cntx.isOpen,
    });
    const { top, left, width } = popoverNodePosition;

    function handleSearch(e) {
      setSearchQuery(e.target.value);
    }
    return createPortal(
      <div
        ref={popoverRef}
        style={{
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          width: width,
        }}
        className={cn(
          "golobe-scrollbar z-[9999] flex h-96 min-w-[300px] flex-col gap-3 overflow-y-scroll rounded-lg border bg-white p-3 shadow-lg transition-[opacity,_visibility] duration-300 ease-in-out",
          className,
          cntx.isOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
        {...props}
      >
        {search && (
          <Input
            label="Search"
            placeholder={"Search values"}
            onChange={handleSearch}
          />
        )}
        {children.filter((el) => {
          if (!el || !el.props) return false;

          const defaultQuery = "";
          if (searchQuery === defaultQuery) return true;

          const textToSearch =
            el.props.searchableValue || String(el.props.children);
          const escapedQuery = escapeRegExp(searchQuery);
          function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          const regexPattern =
            escapedQuery.match(/.{1,2}/g)?.join("+?.*") || escapedQuery;
          if (!regexPattern) return true;

          try {
            const regex = new RegExp(regexPattern, "i");
            return regex.test(textToSearch);
          } catch (error) {
            console.error("Invalid regex pattern:", regexPattern, error);
            return false;
          }
        })}
      </div>,
      containerDomObjRef,
    );
  },
);

const Select = forwardRef(
  (
    {
      children,
      className,
      onValueChange = () => {},
      name,
      value,
      error,
      placeholder = "select a value",
      popoverAttributes,
      ...props
    },
    ref,
  ) => {
    const [options, setOptions] = useState({});
    const [val, setVal] = useState(() => {
      const initialOption = children?.find((el) => el?.props?.value === value);
      return {
        value: value || "",
        placeholder: initialOption
          ? initialOption.props.displayValue || initialOption.props.children
          : placeholder,
      };
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const triggerRef = useRef(ref);

    useEffect(() => {
      setIsMounted(true);
      return () => setIsMounted(false);
    }, []);

    useEffect(() => {
      if (children) {
        const findVal = children.find((el) => el?.props?.value === value);
        if (findVal) {
          if (
            val.value !== findVal.props.value ||
            val.placeholder !==
              (findVal.props.displayValue || findVal.props.children)
          ) {
            setVal({
              value: findVal.props.value,
              placeholder: findVal.props.displayValue || findVal.props.children,
            });
          }
        } else if (value !== val.value) {
          setVal({
            value: value || "",
            placeholder: value ? val.placeholder : placeholder,
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children, value, placeholder]);

    function handleTrigger() {
      setIsOpen(!isOpen);
    }

    const contextValue = {
      value: val,
      name: name,
      setValue: setVal,
      onValueChange,
      isOpen,
      setIsOpen,
      triggerRef,
      options,
      setOptions,
      placeholder,
    };

    const buttonTitle =
      typeof val.placeholder === "string"
        ? val.placeholder
        : typeof val.placeholder === "number"
          ? String(val.placeholder)
          : placeholder;

    return (
      <SelecValueContext.Provider value={contextValue}>
        <input
          type="hidden"
          name={name}
          value={val.value}
          onChange={() => {}}
        />
        <Button
          ref={triggerRef}
          type="button"
          title={buttonTitle}
          onClick={handleTrigger}
          className={cn(
            "flex h-[2.5rem] w-full items-center justify-between rounded-md border-2 border-black bg-background px-3 py-2 text-left text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:h-[3.5rem]",
            className,
            error && "border-destructive",
          )}
          {...props}
        >
          <div className="h-auto w-full">{val.placeholder}</div>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
        {children && isMounted && (
          <SelectPopover
            {...popoverAttributes}
            containerDomObjRef={
              popoverAttributes?.containerDomObjRef || triggerRef.current
            }
          >
            {children}
          </SelectPopover>
        )}
      </SelecValueContext.Provider>
    );
  },
);

const Option = forwardRef(
  (
    {
      children,
      className,
      selectedClassNames,
      value,
      searchableValue,
      displayValue,
      ...props
    },
    ref,
  ) => {
    const cntx = useContext(SelecValueContext);

    const titleText =
      searchableValue ||
      (typeof children === "string" || typeof children === "number"
        ? String(children)
        : value);

    return (
      <div
        role="option"
        aria-selected={cntx.value.value === value}
        value={value}
        title={titleText}
        ref={ref}
        className={cn(
          "h-auto w-full cursor-pointer select-none justify-start rounded-sm bg-slate-100 px-3 py-2 text-left text-sm font-semibold outline-none hover:bg-slate-200",
          cntx.value.value === value &&
            (selectedClassNames ||
              "bg-primary text-primary-foreground hover:bg-primary/90"),
          className,
        )}
        onClick={(e) => {
          typeof props?.onclick === "function" && props?.onClick(e);
          const v = {
            value: value,
            placeholder: displayValue || children,
          };

          if (cntx.value.value === v.value) {
            // de-select
            cntx.setValue({ value: "", placeholder: cntx.placeholder });
            cntx.onValueChange({ value: "", placeholder: cntx.placeholder });
          } else {
            // select
            cntx.setValue(v);
            cntx.onValueChange(v);
          }
          cntx.setIsOpen(false);
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Select.displayName = "Select";
SelectPopover.displayName = "SelectPopover";
Option.displayName = "Option";

export { Select, SelectPopover, SelecValueContext, Option };
