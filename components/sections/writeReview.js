"use client";
import { Input } from "../local-ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { SubmitBtn } from "../local-ui/SubmitBtn";
import { LoginForm } from "../pages/login/LoginForm";
import { useRef } from "react";
export function WriteReview({ isLoggedIn }) {
  console.log(isLoggedIn);
  const reviewInput = useRef();
  const reviewBtn = useRef();

  async function handleClick(action, e) {
    const delay = async (milli = 10) =>
      new Promise((resolve) => setTimeout(resolve, milli));
    switch (action) {
      case "reviewOpen":
        reviewInput.current.classList.replace("hidden", "block");
        await delay();
        reviewInput.current.classList.replace("opacity-0", "opacity-100");
        reviewBtn.current.classList.replace("inline-block", "hidden");
        break;
      case "reviewClose":
        reviewInput.current.classList.replace("opacity-100", "opacity-0");
        await delay(200);
        reviewInput.current.classList.replace("block", "hidden");
        reviewBtn.current.classList.replace("hidden", "inline-block");
        break;
      default:
        break;
    }
  }
  return (
    <>
      <Button
        className={"inline-block opacity-100 float-right"}
        onClick={(e) => handleClick("reviewOpen", e)}
        ref={reviewBtn}
      >
        Write your review
      </Button>
      <div
        ref={reviewInput}
        className={
          "transition-all transition-[duration:200ms] w-full hidden opacity-0"
        }
      >
        <div className={"flex justify-between my-4"}>
          <h3 className={"font-bold"}>
            {isLoggedIn ? "Write a Review" : "Sign in to write a review"}
          </h3>
          <X
            className={
              "transition-all hover:border-2 cursor-pointer border-black rounded-sm"
            }
            onClick={(e) => handleClick("reviewClose", e)}
          />
        </div>
        {isLoggedIn ? (
          <>
            <div className={"my-4"}>
              {/* <Input label={"Rating"} type={"range"} /> */}
              <Input label={"Comment"} type={"textarea"} />
            </div>
            <SubmitBtn />
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </>
  );
}
