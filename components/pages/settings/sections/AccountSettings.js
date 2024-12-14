import { DeleteAccountPopupForm } from "../ui/DeleteAccountPopupForm";
import { Separator } from "@/components/ui/separator";

export function AccountSettings() {
  return (
    <div>
      {/* <div>
        <h2 className="text-2xl w-full font-bold">Change Email</h2>
        <Separator className="my-2" />
      </div> */}
      <div>
        <h2 className="text-2xl w-full text-destructive font-bold">
          Delete Account
        </h2>
        <Separator className="my-2" />
        <p className={"text-sm mb-4"}>
          Once deleted, there is no going back. Your account will be permanently
          deleted.
        </p>
        <DeleteAccountPopupForm />
      </div>
    </div>
  );
}
