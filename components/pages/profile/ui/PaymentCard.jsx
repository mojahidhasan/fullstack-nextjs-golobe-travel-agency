import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { deletePaymentCardAction } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
export function PaymentCard({ card, tryAgain = () => {} }) {
  const [deleting, setDeleting] = useState(false);

  async function handleClick() {
    setDeleting(true);
    const res = await deletePaymentCardAction(card.id);
    if (res?.success === false) {
      toast({
        title: "Error",
        description: res?.message,
        variant: "destructive",
      });
    } else {
      tryAgain();
    }
    setDeleting(false);
  }

  return (
    <div
      className={cn(
        "flex h-[212px] min-h-[200px] w-[378px] min-w-[300px] flex-col justify-between rounded-[16px] bg-primary p-[16px]",
        deleting && "grayscale",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="font-semibold leading-none">
          <p className="text-[1.5rem]">**** **** ****</p>
          <p className="text-[2rem]">{card.last4Digits}</p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild title="Delete Payment Method">
            <Button
              variant="icon"
              className={"h-auto w-auto p-1 hover:text-destructive"}
            >
              <svg
                width="22"
                height="20"
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 0.25H2C1.17157 0.25 0.5 0.921573 0.5 1.75V2.5C0.5 3.32843 1.17157 4 2 4H20C20.8284 4 21.5 3.32843 21.5 2.5V1.75C21.5 0.921573 20.8284 0.25 20 0.25Z"
                  fill="currentColor"
                />
                <path
                  d="M2.49031 5.50001C2.43761 5.49972 2.38544 5.51055 2.33721 5.53178C2.28898 5.55301 2.24576 5.58416 2.21038 5.62322C2.17499 5.66227 2.14824 5.70834 2.13186 5.75843C2.11548 5.80852 2.10984 5.8615 2.11531 5.91391L3.34859 17.7527C3.34833 17.7561 3.34833 17.7595 3.34859 17.763C3.41303 18.3105 3.67628 18.8154 4.08837 19.1817C4.50046 19.548 5.0327 19.7502 5.58406 19.75H16.4164C16.9676 19.75 17.4996 19.5477 17.9115 19.1814C18.3234 18.8151 18.5865 18.3104 18.6509 17.763V17.7531L19.8823 5.91391C19.8878 5.8615 19.8822 5.80852 19.8658 5.75843C19.8494 5.70834 19.8226 5.66227 19.7873 5.62322C19.7519 5.58416 19.7087 5.55301 19.6604 5.53178C19.6122 5.51055 19.56 5.49972 19.5073 5.50001H2.49031ZM14.1556 13.9698C14.2269 14.0391 14.2837 14.1219 14.3228 14.2133C14.3618 14.3048 14.3823 14.403 14.383 14.5024C14.3837 14.6019 14.3646 14.7004 14.3269 14.7924C14.2891 14.8844 14.2335 14.9679 14.1632 15.0382C14.0929 15.1085 14.0093 15.1641 13.9173 15.2018C13.8253 15.2395 13.7267 15.2585 13.6273 15.2577C13.5279 15.257 13.4296 15.2365 13.3382 15.1974C13.2468 15.1583 13.1641 15.1015 13.0948 15.0302L11.0005 12.9358L8.90562 15.0302C8.76432 15.1675 8.57467 15.2436 8.37766 15.2422C8.18065 15.2408 7.9921 15.162 7.85276 15.0227C7.71342 14.8834 7.63448 14.6949 7.633 14.4979C7.63151 14.3009 7.70761 14.1112 7.84484 13.9698L9.93968 11.875L7.84484 9.78016C7.70761 9.6388 7.63151 9.44912 7.633 9.25211C7.63448 9.0551 7.71342 8.86659 7.85276 8.72731C7.9921 8.58803 8.18065 8.50917 8.37766 8.50778C8.57467 8.50638 8.76432 8.58256 8.90562 8.71985L11.0005 10.8142L13.0948 8.71985C13.2361 8.58256 13.4258 8.50638 13.6228 8.50778C13.8198 8.50917 14.0084 8.58803 14.1477 8.72731C14.287 8.86659 14.366 9.0551 14.3675 9.25211C14.3689 9.44912 14.2928 9.6388 14.1556 9.78016L12.0608 11.875L14.1556 13.9698Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                card.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleClick}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.75rem] font-medium">Valid Thru</p>
          <p className="text-[1.25rem] font-semibold">{card.validTill}</p>
        </div>
        <Image
          src={"/icons/cards/" + card.cardType + ".svg"}
          height={70}
          width={70}
          alt={card.cardType + "_icon"}
        />
      </div>
    </div>
  );
}
