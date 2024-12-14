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
    name: userDetails.firstname + " " + userDetails.lastname,
    emails: userDetails.emails,
    phone: userDetails?.phone,
    address: userDetails?.address,
    dateOfBirth: userDetails?.dateOfBirth,
  };
  return (
    <TabContentMockup title={ "Account" }>
      <div className={ "bg-white flex flex-col gap-3 p-5 shadow-md rounded-2" }>
        <div>
          <h4 className="opacity-75">Name</h4>
          <div className="flex items-center justify-between">
            <p className="text-[1.25rem] font-semibold">{ accountDetails.name }</p>
            <ChangeNamePopup firstname={ userDetails.firstname } lastname={ userDetails.lastname } />
          </div>
        </div>
        <div>
          <h4 className="opacity-75">Email</h4>
          <div className={ "flex flex-col gap-3 items-start lg:flex-row lg:justify-between lg:items-center" }>
            <div>
              { accountDetails?.emails.map((item) => {
                return (
                  <div key={ item.email } className="text-[1.25rem] font-semibold flex flex-wrap items-center gap-1">
                    <span>{ item.email }</span>
                    { item.primary === true && (
                      <span className={ "text-sm" }>(primary)</span>
                    ) }
                    { item.emailVerifiedAt === null && (
                      <VerifyEmailBtn email={ item.email } sendAgainAt={ sendAgainAt } />
                    ) }
                  </div>
                );
              }) }

            </div>
            <div className="flex gap-2">
              <AddAnotherEmailPopup />
              <ChangeEmailPopup emails={ accountDetails.emails } />
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
              { accountDetails.phone ?? "N/A" }
            </p>
            <ChangePhonePopup />
          </div>
        </div>
        <div>
          <h4 className="opacity-75">Address</h4>
          <div className="flex items-center justify-between">
            <p className="text-[1.25rem] font-semibold">
              { accountDetails.address ?? "N/A" }
            </p>
            <ChangeAddressPopup />
          </div>
        </div>
        <div>
          <h4 className="opacity-75">Date of birth</h4>
          <div className="flex items-center justify-between">
            <p className="text-[1.25rem] font-semibold">
              { accountDetails.dateOfBirth ?? "N/A" }
            </p>
            <ChangeDateOfBirthPopup />
          </div>
        </div>
      </div>
    </TabContentMockup>
  );
}
