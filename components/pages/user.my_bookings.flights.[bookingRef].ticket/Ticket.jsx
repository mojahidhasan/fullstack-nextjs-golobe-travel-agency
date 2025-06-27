"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import flightGoingIcon from "@/public/icons/flightsGoing.svg";
import calenderMint from "@/public/icons/calender-mint.svg";
import timerMint from "@/public/icons/timer-mint.svg";
import doorMint from "@/public/icons/door-closed-mint.svg";
import airLineSeatMint from "@/public/icons/airline-seat-mint.svg";
import ShowTimeInClientSide from "@/components/helpers/ShowTimeInClientSide";
import NoSSR from "@/components/helpers/NoSSR";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Separator } from "@/components/ui/separator";
import { toDataURL } from "qrcode";
import { useEffect, useState } from "react";
export default function FlightTicket({ ticketData }) {
  const {
    segments,
    passengers,
    qrCodeStr,
    itineraryFlightNumber,
    pnrCode,
    totalFare,
  } = ticketData;

  const [qrcodeImg, setQrcodeImg] = useState("");

  useEffect(() => {
    (async () => {
      const img = await toDataURL(qrCodeStr, {
        errorCorrectionLevel: "M",
        scale: 20,
        margin: 2,
      });
      setQrcodeImg(img);
    })();
  }, [qrCodeStr]);

  async function handleDownload(key, passengerFullName, e) {
    if (e) e.target.disabled = true;
    const originalElement = document.getElementById(`ticket-${key}`);
    if (!originalElement) return;

    const clone = originalElement.cloneNode(true);
    clone.style.width = "900px";
    clone.style.padding = "2rem";
    clone.style.boxSizing = "border-box";
    clone.style.position = "absolute";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";
    document.body.appendChild(clone);

    // eslint-disable-next-line no-undef
    await new Promise((r) => setTimeout(r, 100));

    const scaleFactor = 1;

    const canvas = await html2canvas(clone, {
      scale: scaleFactor,
      useCORS: true,
      backgroundColor: "#ffffff",
      allowTaint: true,
    });

    document.body.removeChild(clone);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`ticket_${key}_${passengerFullName}.pdf`);

    if (e) e.target.disabled = false;
  }

  async function downloadAll(e) {
    e.target.disabled = true;
    const allTickets = passengers.map((p) => {
      return handleDownload(p.key, `${p.fullName.replace(" ", "_")}`, e);
    });
    await Promise.all(allTickets);
    e.target.disabled = false;
  }
  return (
    <main className="mx-auto mb-[80px] mt-7 w-[90%] text-secondary">
      <div className="my-6 flex flex-col items-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-800">
          Total paid: ${Number(totalFare).toFixed(2)}
        </h3>
        <Button
          onClick={downloadAll}
          className="rounded-md bg-secondary px-5 py-2 text-white hover:bg-secondary/80"
        >
          Download All
        </Button>
      </div>

      <div className="mx-auto max-w-[840px]">
        {passengers.map((p) => {
          return (
            <div key={p.key}>
              <div id={`ticket-${p.key}`} className="mb-3 border p-5">
                <div className="mb-3">
                  <h3 className="text-2xl font-bold text-gray-800">
                    FN {itineraryFlightNumber}
                  </h3>
                  <p className="text-sm font-semibold opacity-60">
                    PNR {pnrCode}
                  </p>
                </div>
                {segments.map((s) => {
                  return (
                    <div key={s.key} className="mb-3 space-y-2">
                      <div className="flex min-h-[350px] flex-col-reverse overflow-hidden rounded-lg border md:flex-row">
                        {/* Left: Flight route */}
                        <div className="flex justify-between bg-[#EBF6F2] p-6 md:max-w-[300px] md:flex-col md:items-center">
                          <div className="flex flex-col justify-center">
                            <h3 className="text-xl font-semibold">
                              <NoSSR>
                                <ShowTimeInClientSide
                                  date={s.departureDateTime}
                                  formatStr="hh:mm a"
                                />
                              </NoSSR>
                            </h3>
                            <p className="text-center text-sm font-bold opacity-60">
                              {s.departureAirportIataCode}
                            </p>
                          </div>
                          <div className="flex justify-center">
                            <Image
                              src={flightGoingIcon}
                              alt="flight_icon"
                              className="my-4 rotate-90 md:rotate-0"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h3 className="text-xl font-semibold">
                              <NoSSR>
                                <ShowTimeInClientSide
                                  date={s.arrivalDateTime}
                                  formatStr="hh:mm a"
                                />
                              </NoSSR>
                            </h3>
                            <p className="text-center text-sm font-bold opacity-60">
                              {s.arrivalAirportIataCode}
                            </p>
                          </div>
                        </div>

                        {/* Right: Ticket Details */}
                        <div className="flex flex-1 flex-col justify-between gap-3 border-l p-3 md:border-0">
                          <div className="flex items-center justify-between rounded-md bg-primary p-6 text-white">
                            <div className="text-secondary">
                              <h3 className="text-lg font-bold">
                                {p.fullName}
                              </h3>
                              <p className="text-sm">
                                Boarding Pass N&apos;
                                {p.fullName.slice(-4)}
                              </p>
                            </div>
                            <h3 className="text-sm font-bold capitalize text-secondary">
                              {p.seatClass} Class
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-8 text-sm">
                            <TicketDetail
                              icon={calenderMint}
                              label="Date"
                              value={
                                <NoSSR>
                                  <ShowTimeInClientSide
                                    date={s.departureDateTime}
                                    formatStr="d MMM yyyy"
                                  />
                                </NoSSR>
                              }
                            />
                            <TicketDetail
                              icon={timerMint}
                              label="Flight time"
                              value={
                                <NoSSR>
                                  <ShowTimeInClientSide
                                    date={s.departureDateTime}
                                    formatStr="hh:mm aaa"
                                  />
                                </NoSSR>
                              }
                            />
                            <TicketDetail
                              icon={doorMint}
                              label="Gate"
                              value={s.gate}
                            />
                            <TicketDetail
                              icon={airLineSeatMint}
                              label="Seat"
                              value={p.seatNumber}
                            />
                          </div>

                          <div className="flex items-end justify-between text-sm">
                            <div>
                              <h2 className="text-2xl font-bold">
                                {s.airlineIataCode}
                              </h2>
                              <p className="font-medium opacity-60">
                                {s.flightNumber}
                              </p>
                              <p className="font-medium opacity-60">
                                {s.airplaneModelName}
                              </p>
                            </div>
                            <Image
                              alt="barcode"
                              width={70}
                              height={70}
                              src={qrcodeImg}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="mt-8">
                  <h2 className="mb-[34px] text-[1.5rem] font-semibold">
                    Terms and Conditions
                  </h2>

                  <h3 className="mb-[16px] text-[1.25rem] font-medium">
                    Payments
                  </h3>
                  <ul className="list-disc pl-[16px] text-[0.875rem] leading-[1.25rem]">
                    <li className="mb-[16px]">
                      All payments made via debit or credit card through our
                      website are processed using a secure, encrypted payment
                      gateway. Transactions may be subject to fraud screening
                      protocols to ensure compliance with financial regulations.
                    </li>
                    <li className="mb-[16px]">
                      Providing incorrect billing details or cardholder
                      information may result in booking failure or payment
                      rejection. We reserve the right to cancel bookings without
                      notice if payment is declined or fraudulent activity is
                      detected.
                    </li>
                    <li className="mb-[16px]">
                      In case of any suspected fraudulent activity, including
                      disputed or withheld payments, we reserve the right to
                      cancel the booking and recover associated costs. Legal
                      action may be pursued as deemed necessary.
                    </li>
                    <li className="mb-[16px]">
                      Additional verification may be required for certain
                      transactions. The cardholder may be asked to complete a
                      verification process online, at the airport, or at a
                      designated Golobe service center.
                    </li>
                    <li className="mb-[16px]">
                      If the original payment card cannot be presented at
                      check-in or ticket collection, Golobe reserves the right
                      to deny boarding or require payment with an alternative
                      method. Stored payment information is managed in a PCI-DSS
                      compliant and secure environment.
                    </li>
                  </ul>

                  <h3 className="mb-[16px] text-[1.25rem] font-medium">
                    General Conditions
                  </h3>
                  <ul className="list-disc pl-[16px] text-[0.875rem] leading-[1.25rem]">
                    <li className="mb-[16px]">
                      All tickets are non-transferable and non-refundable unless
                      stated otherwise in the fare rules.
                    </li>
                    <li className="mb-[16px]">
                      Changes to booking details may incur additional charges
                      and are subject to availability.
                    </li>
                    <li className="mb-[16px]">
                      Passengers must comply with all applicable immigration,
                      customs, and travel regulations. Golobe is not responsible
                      for denied boarding or entry due to incomplete
                      documentation.
                    </li>
                  </ul>

                  <h3 className="mb-[16px] text-[1.25rem] font-medium">
                    Contact Us
                  </h3>
                  <address className="text-[0.875rem] not-italic leading-[1.25rem]">
                    <p>
                      If you have any questions regarding these Terms and
                      Conditions, please contact us at:
                    </p>
                    <p className="mt-2 font-medium">Golobe Group Q.C.S.C</p>
                    <p>Golobe Tower</p>
                    <p>Doha, State of Qatar</p>
                    <p>
                      For more information, visit:{" "}
                      <Button
                        asChild
                        variant="link"
                        className="h-auto p-0 text-tertiary"
                      >
                        <Link href="/support">golobe.com/support</Link>
                      </Button>
                    </p>
                  </address>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  onClick={(e) =>
                    handleDownload(p.key, `${p.fullName.replace(" ", "_")}`, e)
                  }
                >
                  Download
                </Button>
              </div>
              <Separator className="my-8" />
            </div>
          );
        })}
      </div>
    </main>
  );
}
function TicketDetail({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded bg-primary/20 p-1.5">
        <Image src={icon} alt={`${label}_icon`} width={24} height={24} />
      </div>
      <div>
        <p className="font-semibold opacity-60">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
