import { TabContentMockup } from "@/components/pages/profile/ui/TabContentMockup";
import { ChangeNamePopup } from "@/components/pages/profile/ui/changeNamePopup";
import { VerifyEmailBtn } from "./ui/VerifyEmailBtn";
import { cookies } from "next/headers";
import { ChangePasswordPopup } from "./ui/ChangePasswordPopup";
import { ChangePhonePopup } from "./ui/ChangePhonePopup";
import { ChangeAddressPopup } from "./ui/ChangeAddressPopup";
import { ChangeDateOfBirthPopup } from "./ui/ChangeDateOfBirthPopup";
import { ChangeEmailPopup } from "./ui/ChangeEmailPopup";
import { AddAnotherEmailPopup } from "./ui/AddAnotherEmailPopup";
export function AccountDetails({ userDetails }) {
  const sendAgainAt = cookies().get("sai")?.expires?.toISOString();
  const accountDetails = {
    name: userDetails.firstName + " " + userDetails.lastName,
    emails: userDetails.emails,
    phone: userDetails?.phoneNumbers,
    address: userDetails?.address,
    dateOfBirth: userDetails?.dateOfBirth,
  };
  return (
    <TabContentMockup title={"Account"}>
      <div className={"rounded-2 flex flex-col gap-3 bg-white p-5 shadow-md"}>
        <div>
          <h4 className="opacity-75">Name</h4>
          <div className="flex items-center justify-between">
            <p className="text-[1.25rem] font-semibold">
              {accountDetails.name}
            </p>
            <ChangeNamePopup
              firstname={userDetails.firstName}
              lastname={userDetails.lastName}
            />
          </div>
        </div>
        <div>
          <h4 className="opacity-75">Email</h4>
          <div
            className={
              "flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between"
            }
          >
            <div>
              {accountDetails?.emails.map((item) => {
                return (
                  <div
                    key={item.email}
                    className="flex flex-wrap items-center gap-1 text-[1.25rem] font-semibold"
                  >
                    <span>{item.email}</span>
                    {item.primary === true && (
                      <span className={"text-sm"}>(primary)</span>
                    )}
                    {item.emailVerifiedAt === null && (
                      <VerifyEmailBtn
                        email={item.email}
                        sendAgainAt={sendAgainAt}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <AddAnotherEmailPopup />
              <ChangeEmailPopup emails={accountDetails.emails} />
            </div>
          </div>
        </div>
        <div>
          <h4 className="opacity-75">Password</h4>
          <div className="flex items-center justify-between">
            <p className="font-semibold">✦✦✦✦✦✦✦</p>
            <ChangePasswordPopup />
          </div>
        </div>
        <div>
          <h4 className="opacity-75">Phone</h4>
          <div className="flex items-center justify-between">
            <p className="text-[1.25rem] font-semibold">
              {accountDetails.phone.length
                ? accountDetails.phone[0].dialCode +
                  " " +
                  accountDetails.phone[0].number
                : "N/A"}
            </p>
            <ChangePhonePopup />
          </div>
        </div>
        <div>
          <h4 className="opacity-75">Address</h4>
          <div className="flex items-center justify-between">
            <p className="text-[1.25rem] font-semibold">
              {accountDetails.address ?? "N/A"}
            </p>
            <ChangeAddressPopup />
          </div>
        </div>
        <div>
          <h4 className="opacity-75">Date of birth</h4>
          <div className="flex items-center justify-between">
            <p className="text-[1.25rem] font-semibold">
              {accountDetails.dateOfBirth ?? "N/A"}
            </p>
            <ChangeDateOfBirthPopup />
          </div>
        </div>
      </div>
    </TabContentMockup>
  );
}
