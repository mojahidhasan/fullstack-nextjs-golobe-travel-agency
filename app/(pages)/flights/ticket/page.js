import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";

import location from "@/public/icons/location.svg";
import share from "@/public/icons/share.svg";
import flightGoingIcon from "@/public/icons/flightsGoing.svg";
import calenderMint from "@/public/icons/calender-mint.svg";
import timerMint from "@/public/icons/timer-mint.svg";
import doorMint from "@/public/icons/door-closed-mint.svg";
import airLineSeatMint from "@/public/icons/airline-seat-mint.svg";
import flightPic from "@/public/images/flightPic.png";

export default function FlightTicketDownloadPage() {
  const breadcrumb = [
    { id: 1, title: "Turkey", link: "/" },
    { id: 2, title: "Istanbul", link: "/" },
    { id: 3, title: "CVK Park Bosphorus Hotel Istanbul", link: "/" },
  ];

  return (
    <main className="mx-auto mt-7 mb-[80px] w-[90%] text-secondary">
      <div>
        <BreadcrumbUI />
      </div>
      <div className="mt-[20px]">
        <div className="mb-[40px] gap-2 flex items-center justify-between">
          <div>
            <h2 className="mb-[16px] text-[1.5rem] font-bold">
              Emirates A380 Airbus
            </h2>
            <address className="flex gap-[4px]">
              <Image src={location} alt="location_icon" />
              <span className="text-[0.875rem] font-medium opacity-75">
                Gümüssuyu Mah. Inönü Cad. No:8, Istanbul 34437
              </span>
            </address>
          </div>
          <div>
            <h3 className="mb-[16px] text-right text-[2rem] font-bold">$240</h3>
            <div className="flex gap-[16px]">
              <Button asChild>
                <Link href={"#"}>
                  <Image
                    className="min-h-6 min-w-6"
                    src={share}
                    alt="share_icon"
                    width={24}
                    height={24}
                  />
                </Link>
              </Button>
              <Button>
                <Link href={"#"}>Download</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mb-[64px] flex md:flex-row flex-col-reverse">
          <div className="grow max-md:rounded-b-[12px] md:max-w-[300px] md:rounded-l-[12px] md:block flex max-md:items-center max-md:justify-between border border-t-0 md:border-r-0 bg-[#EBF6F2] p-[24px]">
            <div>
              <h3 className="text-[1.25rem] sm:text-[2rem] font-semibold">
                12:00 pm
              </h3>
              <p className="text-[0.75rem] font-medium opacity-60">
                Newark(EWR)
              </p>
            </div>
            <div className="p-3">
              <Image
                src={flightGoingIcon}
                className="max-sm:h-full max-sm:w-full max-md:-rotate-90"
                alt="flightGoing_icon"
              />
            </div>
            <div className="rounded-l-[12px]">
              <h3 className="text-[1.25rem] sm:text-[2rem] font-semibold">
                12:00 pm
              </h3>
              <p className="text-[0.75rem] font-medium opacity-60">
                Newark(EWR)
              </p>
            </div>
          </div>
          <div className="grow rounded-t-[12px] md:rounded-r-[12px] border md:border-l-0">
            <div className="flex items-center justify-between max-md:rounded-tl-[12px] rounded-tr-[12px] bg-primary p-[24px]">
              <div className="flex items-center gap-[16px]">
                <Image
                  width={200}
                  height={200}
                  className="h-[48px] w-[48px] rounded-full border border-white object-cover"
                  src="https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="avatar"
                />
                <div>
                  <h3 className="text-[1.25rem] font-bold">James Doe</h3>
                  <p className="text-[0.875rem]">Boarding Pass N&apos;123</p>
                </div>
              </div>
              <h3 className="text-[0.875rem] font-bold">Business Class</h3>
            </div>
            <div className="mb-[40px] flex gap-[32px] p-[24px] flex-wrap">
              <div className="flex items-center gap-[8px]">
                <div className="min-h-[32px] min-w-[32px] rounded-[4px] bg-primary/20 p-[5px]">
                  <Image
                    width={24}
                    height={24}
                    src={calenderMint}
                    alt="calender_icon"
                  />
                </div>
                <div>
                  <h4 className="text-[0.875rem] font-semibold opacity-60">
                    Date
                  </h4>
                  <p className="text-[0.75rem] font-medium">Newark(EWR)</p>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="min-h-[32px] min-w-[32px] rounded-[4px] bg-primary/20 p-[5px]">
                  <Image
                    width={24}
                    height={24}
                    src={timerMint}
                    alt="timer_icon"
                  />
                </div>
                <div>
                  <h4 className="text-[0.875rem] font-semibold opacity-60">
                    Flight time
                  </h4>
                  <p className="text-[0.75rem] font-medium">12:00</p>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="min-h-[32px] min-w-[32px] rounded-[4px] bg-primary/20 p-[5px]">
                  <Image
                    width={24}
                    height={24}
                    src={doorMint}
                    alt="door_icon"
                  />
                </div>
                <div>
                  <h4 className="text-[0.875rem] font-semibold opacity-60">
                    Gate
                  </h4>
                  <p className="text-[0.75rem] font-medium">A12</p>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="min-h-[32px] min-w-[32px] rounded-[4px] bg-primary/20 p-[5px]">
                  <Image
                    width={24}
                    height={24}
                    src={airLineSeatMint}
                    alt="airlineSeat_icon"
                  />
                </div>
                <div>
                  <h4 className="text-[0.875rem] font-semibold opacity-60">
                    Seat
                  </h4>
                  <p className="text-[0.75rem] font-medium">128</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between pl-[24px]">
              <div>
                <h2 className="text-[2rem] font-semibold">EK</h2>
                <p className="text-[0.75rem] font-medium opacity-60">
                  ABC12345
                </p>
              </div>
              <div>
                <svg
                  width="248"
                  height="81"
                  viewBox="0 0 248 81"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 16V65H18.0052V16H16ZM19.7227 16V65H20.2045V16H19.7227ZM20.8804 16V65H22.4047V16H20.8804ZM23.9535 16V65H24.604V16H23.9535ZM26.3225 16V65H26.8033V16H26.3225ZM27.0101 16V65H29.0026V16H27.0101ZM30.1983 16V65H31.2019V16H30.1983ZM33.1788 16V65H33.4012V16H33.1788ZM34.9314 16V65H35.6014V16H34.9314ZM37.3189 16V65H37.8007V16H37.3189ZM38.0075 16V65H40V16H38.0075Z"
                    fill="#112211"
                  />
                  <path
                    d="M40 16V65H42.0052V16H40ZM43.7227 16V65H44.2045V16H43.7227ZM44.8804 16V65H46.4047V16H44.8804ZM47.9535 16V65H48.604V16H47.9535ZM50.3225 16V65H50.8033V16H50.3225ZM51.0101 16V65H53.0026V16H51.0101ZM54.1983 16V65H55.2019V16H54.1983ZM57.1788 16V65H57.4012V16H57.1788ZM58.9314 16V65H59.6014V16H58.9314ZM61.3189 16V65H61.8007V16H61.3189ZM62.0075 16V65H64V16H62.0075Z"
                    fill="#112211"
                  />
                  <path
                    d="M64 16V65H66.0052V16H64ZM67.7227 16V65H68.2045V16H67.7227ZM68.8804 16V65H70.4047V16H68.8804ZM71.9535 16V65H72.604V16H71.9535ZM74.3225 16V65H74.8033V16H74.3225ZM75.0101 16V65H77.0026V16H75.0101ZM78.1983 16V65H79.2019V16H78.1983ZM81.1788 16V65H81.4012V16H81.1788ZM82.9314 16V65H83.6014V16H82.9314ZM85.3189 16V65H85.8007V16H85.3189ZM86.0075 16V65H88V16H86.0075Z"
                    fill="#112211"
                  />
                  <path
                    d="M88 16V65H90.0052V16H88ZM91.7227 16V65H92.2045V16H91.7227ZM92.8804 16V65H94.4047V16H92.8804ZM95.9535 16V65H96.604V16H95.9535ZM98.3225 16V65H98.8033V16H98.3225ZM99.0101 16V65H101.003V16H99.0101ZM102.198 16V65H103.202V16H102.198ZM105.179 16V65H105.401V16H105.179ZM106.931 16V65H107.601V16H106.931ZM109.319 16V65H109.801V16H109.319ZM110.007 16V65H112V16H110.007Z"
                    fill="#112211"
                  />
                  <path
                    d="M112 16V65H114.005V16H112ZM115.723 16V65H116.204V16H115.723ZM116.88 16V65H118.405V16H116.88ZM119.954 16V65H120.604V16H119.954ZM122.323 16V65H122.803V16H122.323ZM123.01 16V65H125.003V16H123.01ZM126.198 16V65H127.202V16H126.198ZM129.179 16V65H129.401V16H129.179ZM130.931 16V65H131.601V16H130.931ZM133.319 16V65H133.801V16H133.319ZM134.007 16V65H136V16H134.007Z"
                    fill="#112211"
                  />
                  <path
                    d="M136 16V65H138.005V16H136ZM139.723 16V65H140.204V16H139.723ZM140.88 16V65H142.405V16H140.88ZM143.954 16V65H144.604V16H143.954ZM146.323 16V65H146.803V16H146.323ZM147.01 16V65H149.003V16H147.01ZM150.198 16V65H151.202V16H150.198ZM153.179 16V65H153.401V16H153.179ZM154.931 16V65H155.601V16H154.931ZM157.319 16V65H157.801V16H157.319ZM158.007 16V65H160V16H158.007Z"
                    fill="#112211"
                  />
                  <path
                    d="M160 16V65H162.005V16H160ZM163.723 16V65H164.204V16H163.723ZM164.88 16V65H166.405V16H164.88ZM167.954 16V65H168.604V16H167.954ZM170.323 16V65H170.803V16H170.323ZM171.01 16V65H173.003V16H171.01ZM174.198 16V65H175.202V16H174.198ZM177.179 16V65H177.401V16H177.179ZM178.931 16V65H179.601V16H178.931ZM181.319 16V65H181.801V16H181.319ZM182.007 16V65H184V16H182.007Z"
                    fill="#112211"
                  />
                  <path
                    d="M184 16V65H186.005V16H184ZM187.723 16V65H188.204V16H187.723ZM188.88 16V65H190.405V16H188.88ZM191.954 16V65H192.604V16H191.954ZM194.323 16V65H194.803V16H194.323ZM195.01 16V65H197.003V16H195.01ZM198.198 16V65H199.202V16H198.198ZM201.179 16V65H201.401V16H201.179ZM202.931 16V65H203.601V16H202.931ZM205.319 16V65H205.801V16H205.319ZM206.007 16V65H208V16H206.007Z"
                    fill="#112211"
                  />
                  <path
                    d="M208 16V65H210.005V16H208ZM211.723 16V65H212.204V16H211.723ZM212.88 16V65H214.405V16H212.88ZM215.954 16V65H216.604V16H215.954ZM218.323 16V65H218.803V16H218.323ZM219.01 16V65H221.003V16H219.01ZM222.198 16V65H223.202V16H222.198ZM225.179 16V65H225.401V16H225.179ZM226.931 16V65H227.601V16H226.931ZM229.319 16V65H229.801V16H229.319ZM230.007 16V65H232V16H230.007Z"
                    fill="#112211"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="mb-[34px] text-[1.5rem] font-semibold">
            Terms and Conditions
          </h2>
          <h3 className="mb-[16px] text-[1.25rem] font-medium">Payments</h3>

          <ul className="list-disc pl-[16px] text-[0.875rem] leading-[1.25rem]">
            <li className="mb-[16px]">
              If you are purchasing your ticket using a debit or credit card via
              the Website, we will process these payments via the automated
              secure common payment gateway which will be subject to fraud
              screening purposes.
            </li>
            <li className="mb-[16px]">
              If you do not supply the correct card billing address and/or
              cardholder information, your booking will not be confirmed and the
              overall cost may increase. We reserve the right to cancel your
              booking if payment is declined for any reason or if you have
              supplied incorrect card information. If we become aware of, or is
              notified of, any fraud or illegal activity associated with the
              payment for the booking, the booking will be cancelled and you
              will be liable for all costs and expenses arising from such
              cancellation, without prejudice to any action that may be taken
              against us.
            </li>
            <li className="mb-[16px]">
              Golobe may require the card holder to provide additional payment
              verification upon request by either submitting an online form or
              visiting the nearest Golobe office, or at the airport at the time
              of check-in. Golobe reserves the right to deny boarding or to
              collect a guarantee payment (in cash or from another credit card)
              if the card originally used for the purchase cannot be presented
              by the cardholder at check-in or when collecting the tickets, or
              in the case the original payment has been withheld or disputed by
              the card issuing bank. Credit card details are held in a secured
              environment and transferred through an internationally accepted
              system.
            </li>
          </ul>

          <h3 className="mb-[16px] text-[1.25rem] font-medium">Contact Us</h3>

          <address className="text-[0.875rem] leading-[1.25rem]">
            <p>
              If you have any questions about our Website or our Terms of Use,
            </p>
            <p>Golob Group Q.C.S.C</p>
            <p>Golob Tower</p>
            <p>Doha, State of Qatar</p>
            <p>
              Further contact details can be found at{" "}
              <Button
                asChild
                variant={"link"}
                className={"p-0 h-auto text-tertiary"}
              >
                <Link href={"/support"}>golobe.com/support</Link>
              </Button>
            </p>
          </address>
        </div>
      </div>
    </main>
  );
}
