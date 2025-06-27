import PayWithNewCardForm from "./PayWithNewCardForm";
import PayWithSavedCard from "./PayWithSavedCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";

export default function MakePaymentSection({
  className,
  loading,
  error,
  paymentIntents,
  paymentStatus,
  retry = () => {},
  middleware = async (next = async () => {}) => {
    await next();
  }, // runs before confirming the payment
  onSuccess = () => {},
}) {
  return (
    <div
      className={cn(
        "space-y-6 rounded-[12px] bg-white p-4 shadow-lg",
        className,
      )}
    >
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="flex h-auto flex-col gap-1 bg-white p-0 sm:flex-row">
          <TabsTrigger
            value="saved"
            className="w-full grow justify-center gap-2 text-center"
          >
            Saved Payment
          </TabsTrigger>
          <TabsTrigger value="new" className="w-full grow justify-center gap-2">
            New Payment
          </TabsTrigger>
        </TabsList>
        <TabsContent value="saved">
          <PayWithSavedCard
            onSuccess={onSuccess}
            middleware={middleware}
            loading={loading}
            error={error}
            retry={retry}
            paymentIntents={paymentIntents}
            paymentStatus={paymentStatus}
          />
        </TabsContent>
        <TabsContent value="new">
          <PayWithNewCardForm
            onSuccess={onSuccess}
            middleware={middleware}
            loading={loading}
            error={error}
            paymentIntents={paymentIntents}
            paymentStatus={paymentStatus}
            retry={retry}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
