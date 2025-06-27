"use client";
import { Input } from "../local-ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { SubmitBtn } from "../local-ui/SubmitBtn";
import { LoginForm } from "../pages/login/LoginForm";
import { SuccessMessage } from "../local-ui/successMessage";
import { ErrorMessage } from "../local-ui/errorMessage";
import { RatingStar } from "@/components/local-ui/ratingStar";
import { useRef, useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { writeReviewAction } from "@/lib/actions";
export function WriteReview({
  isLoggedIn,
  isAlreadyReviewed,
  reviewKeys,
  userReviewObj,
  flightOrHotel = "flight",
}) {
  const extendedWriteReviewAction = writeReviewAction.bind(
    null,
    reviewKeys,
    isAlreadyReviewed,
    flightOrHotel,
  );
  const [state, dispatch] = useFormState(extendedWriteReviewAction, undefined);
  const reviewInput = useRef();
  const reviewBtn = useRef();

  const [shouldMessageShow, setShouldMessageShow] = useState(false);

  useEffect(() => {
    setShouldMessageShow(true);
    setTimeout(() => {
      setShouldMessageShow(false);
    }, 5000);
  }, [state]);

  async function handleClick(action, e) {
    const delay = async (milli = 10) =>
      // eslint-disable-next-line no-undef
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
        className={"float-right inline-block opacity-100"}
        onClick={(e) => handleClick("reviewOpen", e)}
        ref={reviewBtn}
      >
        {isLoggedIn
          ? isAlreadyReviewed
            ? "Edit Your Review"
            : "Write Your review"
          : "Sign in to write a review"}
      </Button>
      <div
        ref={reviewInput}
        className={
          "transition-[duration:200ms] hidden w-full rounded-lg border p-3 opacity-0 transition-all"
        }
      >
        <div className={"my-4 flex justify-between"}>
          <h3 className={"font-bold"}>
            {isLoggedIn
              ? isAlreadyReviewed
                ? "Edit Review"
                : "Write a Review"
              : "Sign in to write a review"}
          </h3>
          <X
            className={
              "cursor-pointer rounded-sm border-black transition-all hover:border-2"
            }
            onClick={(e) => handleClick("reviewClose", e)}
          />
        </div>
        {isLoggedIn ? (
          <>
            {shouldMessageShow && state?.success === true && state?.message && (
              <SuccessMessage message={state?.message} />
            )}
            {shouldMessageShow &&
              state?.success === false &&
              state?.message && <ErrorMessage message={state?.message} />}
            <form id={"review-form"} action={dispatch}>
              <div className={"mb-5 flex flex-col gap-4"}>
                <RatingStar
                  fill={"hsl(120, 33%, 10%)"}
                  error={state?.error && state?.error.rating}
                  defaultRating={+userReviewObj?.rating ?? 0}
                />
              </div>
              <div className={"mb-5"}>
                <Input
                  label={"Comment"}
                  type={"textarea"}
                  name={"reviewComment"}
                  defaultValue={userReviewObj?.comment ?? ""}
                  error={state?.error && state?.error.reviewComment}
                  className={"leading-snug"}
                />
              </div>
              <SubmitBtn formId={"review-form"} />
            </form>
          </>
        ) : (
          <LoginForm className={"p-0 shadow-none"} />
        )}
      </div>
    </>
  );
}
