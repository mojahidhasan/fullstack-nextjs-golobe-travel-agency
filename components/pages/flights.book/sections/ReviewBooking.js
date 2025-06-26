"use client";
import React, { Fragment, useLayoutEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { isObject, minutesToHMFormat } from "@/lib/utils";
import validatePassengerDetails from "@/lib/zodSchemas/passengerDetailsValidation";
import validatePassengerPreferences from "@/lib/zodSchemas/passengersPreferencesValidation";
import { AlertTriangle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import NoSSR from "@/components/helpers/NoSSR";
// incomplete, working on it currently
const SectionHeader = ({ title }) => (
  <h3 className="text-xl font-semibold">{title}</h3>
);

const FlightDetails = ({ flight }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <p className="text-gray-600">Flight Number</p>
          <p className="font-semibold">{flight.flightNumber}</p>
        </div>
        <div>
          <p className="text-gray-600">Airline</p>
          <p className="font-semibold">{flight.airlineId.name}</p>
        </div>
        <div>
          <p className="text-gray-600">Departure</p>
          <div className="font-semibold">
            <NoSSR fallback={"eee, MMM d, yyyy"}>
              {format(flight.from.scheduledDeparture, "eee, MMM d, yyyy")}
            </NoSSR>
          </div>
          <p className="text-sm text-gray-500">
            {flight.from.airport.name} - Terminal {flight.from.terminal}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Arrival</p>
          <div className="font-semibold">
            <NoSSR fallback={"eee, MMM d, yyyy"}>
              {format(flight.to.scheduledArrival, "eee, MMM d, yyyy")}
            </NoSSR>
          </div>
          <p className="text-sm text-gray-500">
            {flight.to.airport.name} - Terminal {flight.to.terminal}
          </p>
        </div>
      </div>
    </div>
  );
};
const PassengerCard = ({ passenger, preferences }) => {
  const p = { ...passenger };
  delete p.key;
  delete p.errors;
  delete p.saveDetails;
  delete p.isPrimary;

  const pref = { ...preferences };
  delete pref.errors;
  delete pref.key;
  delete pref.passengerType;
  return (
    <div className="mb-4 rounded-lg bg-white p-6 shadow-lg">
      <h2 className="text-2xl font-semibold">{passenger.key}</h2>
      <Separator className="my-3" />
      <div>
        <h4 className="mb-3 text-xl font-semibold">Details</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.entries(p).map(([key, value]) => {
            const obj = {
              key,
              value,
            };
            if (obj.key === "phoneNumber") {
              obj.value = Object.values(obj.value).join(" ");
            }
            return (
              <div key={key}>
                <p className="capitalize text-gray-600">
                  {obj.key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="font-semibold">{obj.value || "N/A"}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Separator className="my-3" />
      <div>
        <h4 className="mb-3 text-xl font-semibold">Preferences</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Object.entries(pref).map(([key, value]) => {
            return (
              <div key={key}>
                <p className="text-lg font-bold capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <div>
                  {isObject(value)
                    ? Object.entries(value).map(([k, v]) => (
                        <div key={k} className="flex gap-2">
                          <p className="capitalize text-gray-600">
                            {k.replace(/([A-Z])/g, " $1").trim() + " :"}
                          </p>
                          <p className="font-semibold">
                            {typeof v === "boolean"
                              ? v
                                ? "Yes"
                                : "No"
                              : v || "N/A"}
                          </p>
                        </div>
                      ))
                    : value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ReviewBooking = ({
  flight,
  reserveActionError,
  setReserveActionError = () => {},
  formsError,
  setFormsError = () => {},
  onConfirm,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [pDetails, setPDetails] = useState([]);
  const [preferences, setPreferences] = useState([]);

  useLayoutEffect(() => {
    const passengersJSON = sessionStorage.getItem("passengersDetails") || "[]";
    const preferencesJSON =
      sessionStorage.getItem("passengersPreferences") || "[]";

    const passengers = JSON.parse(passengersJSON);
    const preferences = JSON.parse(preferencesJSON);

    if (passengersJSON === "[]" || preferencesJSON === "[]") {
      setFormsError({
        ...formsError,
        passengersDetails: {},
        passengersPreferences: {},
      });
      return;
    }
    const passengerError = {};
    passengers.forEach((passenger) => {
      const { success, errors } = validatePassengerDetails(passenger);
      if (success === false) {
        passengerError[passenger?.key] = errors;
      }
    });

    if (Object.keys(passengerError).length > 0) {
      setFormsError({ ...formsError, passengersDetails: passengerError });
      return;
    }

    const preferenceError = {};
    preferences.forEach((preference) => {
      const { success, errors } = validatePassengerPreferences(preference);
      if (!success) {
        preferenceError[preference?.key] = errors;
      }
    });

    if (preferenceError.length > 0) {
      setFormsError({ ...formsError, passengersPreferences: preferenceError });
      return;
    }

    setPDetails(passengers);
    setPreferences(preferences);

    return () => {
      setFormsError({});
      setPDetails([]);
      setPreferences([]);
      setReserveActionError({});
    };
  }, []);

  function setProgress(step) {
    router.push(`${pathname}?tab=${step}`);
  }
  const hasFormsError = Object.keys(formsError).length > 0;
  const hasReserveError = Object.keys(reserveActionError).length > 0;
  const hasError = hasFormsError || hasReserveError;

  const primaryPassengerPhone = pDetails.find((p) => p.isPrimary)?.phoneNumber;
  return hasError ? (
    <>
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 rounded-md border border-red-300 bg-red-50 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Booking Review Failed</h2>
        </div>

        {hasFormsError && (
          <>
            <p className="max-w-xl text-center text-sm text-red-700">
              Some passenger details or preferences are missing or invalid.
              Please review and correct them before proceeding.
            </p>

            <div className="w-full max-w-2xl space-y-4 text-left">
              {Object.entries(formsError).map(([section, passengers]) => (
                <div
                  key={section}
                  className="rounded-md border border-red-200 bg-white p-4 shadow-sm"
                >
                  <h3 className="mb-2 text-base font-bold text-red-700">
                    {section
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </h3>
                  <div className="space-y-3 pl-2">
                    {Object.entries(passengers).map(
                      ([passengerKey, errors]) => (
                        <div key={passengerKey}>
                          <p className="font-semibold text-red-600">
                            Passenger Key: {passengerKey}
                          </p>
                          <ul className="list-inside list-disc text-sm text-red-700">
                            {Object.entries(errors).map(([field, errorMsg]) => (
                              <li key={field}>
                                <span className="font-medium">
                                  {field
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^\w/, (c) => c.toUpperCase())}
                                </span>
                                : {errorMsg}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => setProgress("passenger_forms")}
              className="bg-red-600 font-semibold text-white hover:bg-red-700"
            >
              Go Back & Fix Details
            </Button>
          </>
        )}
        {hasReserveError && (
          <>
            <p className="max-w-xl text-center text-sm text-red-700">
              {reserveActionError?.message ||
                "Something went wrong. Please try again."}
            </p>
            {reserveActionError?.link && (
              <Button
                size="lg"
                className="bg-red-600 font-semibold text-white hover:bg-red-700"
                onClick={() => router.push(reserveActionError?.link?.href)}
              >
                {reserveActionError?.link?.label}
              </Button>
            )}
          </>
        )}
      </div>
    </>
  ) : (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Your Booking</h1>
        </div>
        <Button onClick={onConfirm} className="rounded-lg text-black">
          Reserve & Pay
        </Button>
      </div>

      {/* Flight Details Section */}
      <div className="flex flex-col gap-3">
        <SectionHeader title="Flight Details" />
        {flight.segmentIds.map((segment, index) => {
          return (
            <Fragment key={segment._id}>
              <FlightDetails flight={segment} />
              {index !== flight.segmentIds.length - 1 &&
                flight.segmentIds.length > 1 && (
                  <div className="w-fit self-center rounded-md bg-tertiary px-5 py-1 text-center font-bold text-white">
                    Layover{" "}
                    {minutesToHMFormat(
                      flight?.layovers?.find(
                        (layover) => +layover.fromSegmentIndex === index,
                      )?.durationMinutes,
                    )}
                  </div>
                )}
            </Fragment>
          );
        })}
      </div>

      {/* Passengers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeader title="Passenger Details" />
          <Button
            size="sm"
            onClick={() => setProgress("passenger_forms")}
            className="text-black"
          >
            Edit Details
          </Button>
        </div>
        {pDetails.map((passenger, index) => (
          <PassengerCard
            key={passenger.key}
            passenger={passenger}
            preferences={preferences.find((p) => p.key === passenger.key)}
            // seat={bookingData.seats.find(
            //   (seat) => seat.passengerId === passenger._id,
            // )}
            onEdit={() => {
              setProgress("passenger_forms");
            }}
          />
        ))}
      </div>

      {/* Contact Information */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <SectionHeader title="Contact Information" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">
              {pDetails.find((p) => p.isPrimary)?.email}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <p className="font-semibold">
              {primaryPassengerPhone
                ? Object.values(primaryPassengerPhone).join(" ")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBooking;
