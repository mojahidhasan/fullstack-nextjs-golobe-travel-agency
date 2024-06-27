import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReviewsCard } from "@/components/pages/home/ui/ReviewsCard";

import { UNSPLASH_BASE_URL } from "@/lib/constants";
import { reviews } from "@/data/reviews";

export function Reviews() {
  return (
    <section className="mx-auto mb-[80px]">
      <div className="mb-[20px] flex items-center justify-between max-md:flex-col max-md:gap-[16px] md:mb-[40px]">
        <SectionTitle
          title="Reviews"
          subTitle="What people says about Golobe facilities"
        />
        <Button asChild variant={"outline"}>
          <Link href={"#"}>See All</Link>
        </Button>
      </div>
      <div
        className="flex flex-col gap-[16px] overflow-y-scroll pb-5 md:flex-row md:gap-[30px] lg:gap-[40px] lg:overflow-x-scroll"
        style={{
          scrollbarGutter: "none",
          scrollbarWidth: "thin",
          scrollbarColor: "#8dd3bb grey",
        }}
      >
        {reviews.map((review) => {
          const { id, comment, describedComment, rate, reviewer, imgSrc } =
            review;

          return (
            <ReviewsCard
              key={id}
              comment={comment}
              describedComment={describedComment}
              rate={rate}
              reviewer={reviewer}
              imgSrc={imgSrc}
            />
          );
        })}
      </div>
    </section>
  );
}
