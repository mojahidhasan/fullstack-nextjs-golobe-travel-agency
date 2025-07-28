import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import DownloadInvoiceButton from "./ui/DownloadInvoiceButton";

export default function HotelBookingInvoice({
  bookingDetails: hotelBooking,
  hotelDetails,
  userDetails,
}) {
  const bookingId = hotelBooking._id;
  const fareBreakdowns = hotelBooking.fareBreakdown;
  const total = formatCurrency(hotelBooking.totalPrice);

  const statusColors = {
    confirmed: "text-green-700",
    paid: "text-green-700",
    pending: "text-yellow-700",
    cancelled: "text-red-700",
    failed: "text-red-700",
    refunded: "text-red-700",
  };

  const bookingData = {
    bookingId: hotelBooking._id,
    bookingDate: hotelBooking.bookedAt,
    status: hotelBooking.bookingStatus,
    paymentStatus: hotelBooking.paymentStatus,
    hotel: {
      name: hotelDetails.name,
      address:
        hotelDetails.address.streetAddress +
        ", " +
        hotelDetails.address.city +
        ", " +
        hotelDetails.address.country,
      phone: hotelDetails?.contact?.phone,
      email: hotelDetails?.contact?.email,
      supportEmail: hotelDetails?.contact?.supportEmail,
      supportPhone: hotelDetails?.contact?.supportPhone,
      logo: hotelDetails?.logo,
    },
  };

  const userPhone = userDetails?.phoneNumbers?.find((phone) => phone.primary);
  const userPhoneNumber = userPhone && userPhone?.dialCode + userPhone?.number;
  const userFullName = `${userDetails.firstName} ${userDetails.lastName}`;

  const hotel = bookingData.hotel;
  const bookingDate = bookingData.bookingDate;
  const status = bookingData.status;

  return (
    <div className="mx-auto max-w-[840px]">
      <div className="mb-2 flex justify-end">
        <DownloadInvoiceButton
          documentId={"hotel-invoice"}
          bookingId={bookingId}
          hotelBooking={hotelBooking}
          hotelDetails={hotelDetails}
          userDetails={userDetails}
        />
      </div>
      <div
        id="hotel-invoice"
        className="space-y-6 border bg-white p-6 print:max-w-full print:border-none print:p-0 print:shadow-none"
      >
        {/* Header */}
        <header className="flex items-start justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">Invoice</h1>
            <p className="text-sm text-gray-600">Booking ID: {bookingId}</p>
            <p className="text-sm text-gray-600">
              Issued: {format(new Date(bookingDate), "PPP")}
            </p>
          </div>
        </header>

        {/* Hotel Info */}
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-2 text-lg font-semibold">Hotel Information</h2>
            <p className="font-medium">{hotel.name}</p>
            <p className="text-sm text-gray-600">{hotel.address}</p>
            {hotel.phone && (
              <p className="text-sm text-gray-600">Phone: {hotel.phone}</p>
            )}
            {hotel.email && (
              <p className="text-sm text-gray-600">Email: {hotel.email}</p>
            )}
          </CardContent>
        </Card>

        {/* Booking Status and Payment Status */}
        <Card>
          <CardContent className="p-5 text-sm text-gray-700">
            <p className="font-medium">
              Booking Status:{" "}
              <span
                className={cn(
                  `mb-1 text-sm font-semibold capitalize`,
                  statusColors[status],
                )}
              >
                {status}
              </span>
            </p>
            <p className="font-medium">
              Payment Status:{" "}
              <span
                className={cn(
                  `text-sm font-semibold capitalize`,
                  statusColors[bookingData.paymentStatus],
                )}
              >
                {bookingData.paymentStatus === "paid" ? "Paid" : "Unpaid"}
              </span>
            </p>
            <p className="font-bold capitalize">
              <span className="font-medium">Payment Method:</span>{" "}
              {hotelBooking.paymentMethod || "N/A"}
            </p>
          </CardContent>
        </Card>

        {/* Fare Breakdown */}
        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="text-lg font-semibold">Fare Breakdown</h2>

            {/* Fare Summary Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[700px] overflow-hidden rounded-lg border border-gray-200 text-left text-sm text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-2">Room Type</th>
                    <th className="px-4 py-2">Bed Option</th>
                    <th className="px-4 py-2 text-center">Qty</th>
                    <th className="px-4 py-2 text-right">Base</th>
                    <th className="px-4 py-2 text-right">Tax</th>
                    <th className="px-4 py-2 text-right">Service</th>
                    <th className="px-4 py-2 text-right">Discount</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(fareBreakdowns).map(
                    ([roomType, bedOptions]) =>
                      Object.entries(bedOptions).map(
                        ([bedOption, breakdown], index) => (
                          <tr
                            key={`${roomType}-${bedOption}`}
                            className="border-t"
                          >
                            <td className="px-4 py-2">{roomType}</td>
                            <td className="px-4 py-2">{bedOption}</td>
                            <td className="px-4 py-2 text-center">
                              {breakdown.rooms.length}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(+breakdown.base)}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(+breakdown.tax)}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {formatCurrency(+breakdown.serviceFee)}
                            </td>
                            <td className="px-4 py-2 text-right">
                              -{formatCurrency(+breakdown.discount)}
                            </td>
                            <td className="px-4 py-2 text-right font-semibold">
                              {formatCurrency(+breakdown.total)}
                            </td>
                          </tr>
                        ),
                      ),
                  )}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr className="border-t">
                    <td className="px-4 py-2 font-semibold" colSpan={7}>
                      Total
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-gray-900">
                      {total}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="mb-2 text-lg font-semibold">Billed To</h2>
            <p className="font-medium">{userFullName}</p>
            <p className="text-sm text-gray-600">{userDetails.email}</p>
            <p className="text-sm text-gray-600">{userPhoneNumber}</p>
          </CardContent>
        </Card>

        {/* Footer */}
        {hotel.supportEmail && hotel.supportPhone && (
          <footer className="mt-6 border-t pt-4 text-sm text-gray-600">
            <p>
              For payment-related inquiries, contact{" "}
              <strong>{hotel.supportEmail}</strong> or call{" "}
              <strong>{hotel.supportPhone}</strong>.
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
