import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function SingleReviewSkeleton() {
  return (
    <div>
      <div className="flex items-start gap-[16px]">
        <Skeleton className={"h-[45px] min-w-[45px] rounded-full p-0"} />
        <div className="w-full">
          <div className="mb-[8px] flex items-center gap-1">
            <Skeleton className={"inline-block h-4 w-[100px]"} />
            <span>|</span>
            <Skeleton className={"inline-block h-4 w-[100px]"} />
          </div>
          <Skeleton className={"my-1 block h-4 w-[80%]"} />
          <Skeleton className={"my-1 block h-4 w-[70%]"} />
          <Skeleton className={"my-1 block h-4 w-[60%]"} />
        </div>
        <div className="flex items-center gap-1">
          <svg
            width="16"
            height="18"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-pulse"
          >
            <path
              d="M1.125 17.75C0.95924 17.75 0.800269 17.6842 0.683058 17.5669C0.565848 17.4497 0.5 17.2908 0.5 17.125V1.66133C0.500045 1.49757 0.542982 1.33668 0.624538 1.19468C0.706094 1.05268 0.823423 0.934514 0.964844 0.851953C1.4375 0.577344 2.38984 0.25 4.25 0.25C5.70352 0.25 7.3293 0.824609 8.76367 1.33125C9.91875 1.73945 11.0098 2.125 11.75 2.125C12.7029 2.12208 13.6457 1.92953 14.5234 1.55859C14.6303 1.51348 14.7467 1.49551 14.8622 1.50629C14.9777 1.51708 15.0888 1.55628 15.1855 1.6204C15.2822 1.68452 15.3615 1.77158 15.4164 1.8738C15.4713 1.97602 15.5 2.09023 15.5 2.20625V10.775C15.4998 10.9269 15.4554 11.0754 15.3722 11.2024C15.2889 11.3295 15.1704 11.4295 15.0312 11.4902C14.691 11.6391 13.4488 12.125 11.75 12.125C10.807 12.125 9.62578 11.8461 8.37539 11.5504C6.96992 11.2184 5.5168 10.875 4.25 10.875C2.80977 10.875 2.07266 11.093 1.75 11.2309V17.125C1.75 17.2908 1.68415 17.4497 1.56694 17.5669C1.44973 17.6842 1.29076 17.75 1.125 17.75Z"
              fill="#cbd5e1"
            />
          </svg>
        </div>
      </div>
      <Separator className="my-[24px]" />
    </div>
  );
}
