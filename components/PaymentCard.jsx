import PaymentForm from "./PaymentForm";
import { MessageSquareWarning } from "lucide-react";
export default function PaymentCard({ serverAction }) {
  return (
    <div className="mx-auto flex min-w-[200px] max-w-[700px] flex-col gap-3 rounded-lg bg-white p-3 shadow-lg">
      <h2 className="text-2xl font-bold">Payment Method</h2>
      <div className="flex gap-2 rounded-md bg-yellow-200 p-3 text-sm font-medium text-yellow-700">
        <MessageSquareWarning />
        <span className="font-bold">Warning:</span> Do <b>NOT</b> provide real
        information.
      </div>
      <PaymentForm serverAction={serverAction} />
    </div>
  );
}
