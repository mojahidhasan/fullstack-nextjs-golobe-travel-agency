import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function OneReview() {
  return (
    <>
      <div className="flex gap-[16px]">
        <Image
          className="h-[45px] w-[45px] rounded-full object-cover object-center"
          src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          width={45}
          height={45}
          alt=""
        />
        <div className="w-full text-[0.875rem]">
          <p className="mb-[8px]">
            <span className="font-semibold">5.0 Amazing</span> |{" "}
            <span>Omar Siphron</span>
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel
            quisquam animi quo recusandae itaque enim accusantium ipsa corporis,
            temporibus cum, unde odit distinctio modi dolores nisi, deserunt
            quam est numquam!
          </p>
        </div>
        <svg
          width="16"
          height="18"
          viewBox="0 0 16 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-75"
        >
          <path
            d="M1.125 17.75C0.95924 17.75 0.800269 17.6842 0.683058 17.5669C0.565848 17.4497 0.5 17.2908 0.5 17.125V1.66133C0.500045 1.49757 0.542982 1.33668 0.624538 1.19468C0.706094 1.05268 0.823423 0.934514 0.964844 0.851953C1.4375 0.577344 2.38984 0.25 4.25 0.25C5.70352 0.25 7.3293 0.824609 8.76367 1.33125C9.91875 1.73945 11.0098 2.125 11.75 2.125C12.7029 2.12208 13.6457 1.92953 14.5234 1.55859C14.6303 1.51348 14.7467 1.49551 14.8622 1.50629C14.9777 1.51708 15.0888 1.55628 15.1855 1.6204C15.2822 1.68452 15.3615 1.77158 15.4164 1.8738C15.4713 1.97602 15.5 2.09023 15.5 2.20625V10.775C15.4998 10.9269 15.4554 11.0754 15.3722 11.2024C15.2889 11.3295 15.1704 11.4295 15.0312 11.4902C14.691 11.6391 13.4488 12.125 11.75 12.125C10.807 12.125 9.62578 11.8461 8.37539 11.5504C6.96992 11.2184 5.5168 10.875 4.25 10.875C2.80977 10.875 2.07266 11.093 1.75 11.2309V17.125C1.75 17.2908 1.68415 17.4497 1.56694 17.5669C1.44973 17.6842 1.29076 17.75 1.125 17.75Z"
            fill="#112211"
          />
        </svg>
      </div>
      <Separator className="my-[24px]" />
    </>
  );
}
