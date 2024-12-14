import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReviewsCard } from "@/components/pages/home/ui/ReviewsCard";
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
          <Link scroll={false} href={"#"}>
            See All
          </Link>
        </Button>
      </div>
      <div className="flex flex-col h-[600px] gap-[16px] overflow-auto pb-5 md:flex-row md:h-auto md:gap-[30px] lg:gap-[40px] golobe-scrollbar">
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
