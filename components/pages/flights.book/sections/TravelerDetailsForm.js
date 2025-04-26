"use client";
import { Input } from "@/components/local-ui/input";
import { SelectCountry } from "@/components/SelectCountry";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, debounce } from "@/lib/utils";
import { useEffect, useState } from "react";
import { defaultPassengerFormValue } from "@/reduxStore/features/singlePassengerFormSlice";
export default function TravelerDetailsForm({
  errors,
  className,
  travelerType = "adult-1",
  primaryTraveler = false,
}) {
  const [thisPassenger, setThisPassenger] = useState(defaultPassengerFormValue);
  useEffect(() => {
    const passengersDetails = JSON.parse(
      sessionStorage.getItem("passengersDetails") || "[]",
    );
    const findThisPassenger = passengersDetails.find(
      (x) => x.passengerType === travelerType,
    );
    if (findThisPassenger) {
      setThisPassenger(findThisPassenger);
    }
  }, [travelerType, primaryTraveler]);

  const handleOnChange = debounce((e) => {
    const { name, value } = e.target;
    const extractName = name.split("-").at(-1);
    setPassengerFormInStorage({ [extractName]: value });
    setSessionTimeoutInStorage();
  }, 300);

  // session storage
  function setPassengerFormInStorage(payload) {
    let passengersDetails = JSON.parse(
      sessionStorage.getItem("passengersDetails") || "[]",
    );
    const pIndex = passengersDetails.findIndex(
      (x) => x.passengerType === travelerType,
    );

    let newPForm = {};
    if (pIndex === -1) {
      newPForm = {
        ...defaultPassengerFormValue,
        passengerType: travelerType,
        isPrimary: primaryTraveler,
      };
      passengersDetails.push({ ...newPForm, ...payload });
    }

    if (pIndex > -1) {
      passengersDetails[pIndex] = {
        ...passengersDetails[pIndex],
        ...newPForm,
        isPrimary: primaryTraveler,
        ...payload,
      };
    }

    setThisPassenger({ ...thisPassenger, ...payload });
    sessionStorage.setItem(
      "passengersDetails",
      JSON.stringify(passengersDetails),
    );
  }

  // local storage
  function setSessionTimeoutInStorage() {
    const newValue = Date.now() + 1200 * 1000;
    const oldValue = localStorage.getItem("sessionTimeoutAt");
    localStorage.setItem("sessionTimeoutAt", newValue);
    window.dispatchEvent(
      new CustomEvent("customStorage", {
        detail: {
          key: "sessionTimeoutAt",
          newValue,
          oldValue,
        },
      }),
    );
  }

  return (
    <form
      className={cn(
        "flex flex-col gap-6 rounded-md bg-white p-3 shadow-lg",
        className,
      )}
    >
      <Input
        defaultValue={thisPassenger?.firstName}
        type="text"
        name={travelerType + "-" + "firstName"}
        label="First Name"
        placeholder="Enter your first name"
        required
        onChange={handleOnChange}
        error={errors?.firstName}
      />
      <Input
        defaultValue={thisPassenger?.lastName}
        type="text"
        name={travelerType + "-" + "lastName"}
        label="Last Name"
        placeholder="Enter your last name"
        required
        onChange={handleOnChange}
        error={errors?.lastName}
      />
      <Input
        defaultValue={thisPassenger?.dateOfBirth}
        type="date"
        name={travelerType + "-" + "dateOfBirth"}
        label="Date of Birth"
        placeholder="Date of Birth"
        required
        onChange={handleOnChange}
        error={errors?.dateOfBirth}
      />
      <Input
        defaultValue={thisPassenger?.passportNumber}
        type="text"
        name={travelerType + "-" + "passportNumber"}
        label="Passport Number"
        placeholder="Passport Number"
        required
        onChange={handleOnChange}
        error={errors?.passportNumber}
      />
      <div>
        <Input
          defaultValue={thisPassenger?.passportExpiryDate}
          type="date"
          name={travelerType + "-" + "passportExpiryDate"}
          label="Passport Expiry Date"
          placeholder="Passport Expiry Date"
          required
          onChange={handleOnChange}
          error={errors?.passportExpiryDate}
        />
        <p className="mt-2 text-xs font-bold text-destructive">
          Note: Passport must be valid for at least 6 months from the date of
          departure
        </p>
      </div>
      <div className="relative block h-auto">
        <span className="absolute -top-[8px] left-5 z-10 bg-background px-1 text-sm font-normal leading-4">
          Country
        </span>
        <SelectCountry
          name={travelerType + "-" + "country"}
          className={"h-auto"}
          defaultValue={thisPassenger?.country}
          value={thisPassenger?.country}
          getSelected={(selected) => {
            setPassengerFormInStorage({ country: selected.value });
            setSessionTimeoutInStorage();
          }}
          error={errors?.country}
        />
      </div>
      <div
        className={cn(
          "flex flex-col gap-2 px-2",
          errors?.gender && "border-destructive",
        )}
      >
        <p className="text-sm font-bold">Gender</p>
        <RadioGroup
          name={travelerType + "-" + "gender"}
          value={thisPassenger?.gender}
          className="flex gap-3"
          onValueChange={(v) => {
            setPassengerFormInStorage({ gender: v });
            setSessionTimeoutInStorage();
          }}
        >
          <Label className="flex gap-1">
            <RadioGroupItem
              className="border-2 data-[state='checked']:border-primary data-[state='checked']:text-primary"
              value="male"
            />
            <p>Male</p>
          </Label>
          <Label className="flex gap-1">
            <RadioGroupItem
              className="border-2 data-[state='checked']:border-primary data-[state='checked']:text-primary"
              value="female"
            />
            <p>Female</p>
          </Label>
        </RadioGroup>
        {errors?.gender && (
          <p className="mt-1 pl-4 text-destructive">{errors.gender}</p>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-6">
        <h3 className="mb-2 text-xl font-bold">Frequent Flyer</h3>
        <Input
          defaultValue={thisPassenger?.frequentFlyerAirline}
          type="text"
          name={travelerType + "-" + "frequentFlyerAirline"}
          label="Frequent Flyer Airline(If Any)"
          placeholder="Frequent Flyer Airline"
          onChange={handleOnChange}
          error={errors?.frequentFlyerAirline}
        />
        <Input
          defaultValue={thisPassenger?.frequentFlyerNumber}
          type="text"
          name={travelerType + "-" + "frequentFlyerNumber"}
          label="Frequent Flyer Name"
          placeholder="Frequent Flyer Name"
          onChange={handleOnChange}
          error={errors?.frequentFlyerNumber}
        />
      </div>
      <div className="mt-3 flex flex-col gap-6">
        <h3 className="mb-2 text-xl font-bold">Contacts</h3>
        <Input
          defaultValue={thisPassenger?.email}
          type="text"
          name={travelerType + "-" + "email"}
          label="Email"
          placeholder="Email"
          onChange={handleOnChange}
          required
          error={errors?.email}
        />
        <Input
          defaultPhoneValue={JSON.stringify(thisPassenger?.phoneNumber)}
          type="tel"
          name={travelerType + "-" + "phoneNumber"}
          label="Phone Number"
          placeholder="Phone Number"
          required
          error={errors?.phoneNumber}
          onChange={debounce((e) => {
            const parsed = JSON.parse(e.target.value);
            setPassengerFormInStorage({
              phoneNumber: parsed,
            });
            setSessionTimeoutInStorage();
          }, 300)}
        />
      </div>
      {true && (
        <div>
          <Checkbox
            error={errors?.saveDetails}
            checked={thisPassenger?.saveDetails}
            name={travelerType + "-" + "savedetails"}
            id={travelerType + "-" + "savedetails"}
            label={<p className="font-semibold">Save my details</p>}
            onChange={(e) => {
              setThisPassenger({
                ...thisPassenger,
                saveDetails: e.target.checked,
              });
              setPassengerFormInStorage({ saveDetails: e.target.checked });
              setSessionTimeoutInStorage();
            }}
          />
        </div>
      )}
    </form>
  );
}
