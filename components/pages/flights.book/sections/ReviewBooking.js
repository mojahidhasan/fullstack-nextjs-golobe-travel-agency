import React, { useState } from "react";
import { format } from "date-fns";
// incomplete, working on it currently
const SectionHeader = ({ icon, title }) => (
  <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
    <span>{icon}</span> {title}
  </h3>
);

const FlightDetails = ({ flight }) => (
  <div className="rounded-lg bg-white p-6 shadow-sm">
    <SectionHeader icon="✈️" title="Flight Details" />
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
        <p className="font-semibold">
          {format(new Date(flight.departure.scheduled), "PPP p")}
        </p>
        <p className="text-sm text-gray-500">
          {flight.departure.airport.name} - Terminal {flight.departure.terminal}
        </p>
      </div>
      <div>
        <p className="text-gray-600">Arrival</p>
        <p className="font-semibold">
          {format(new Date(flight.arrival.scheduled), "PPP p")}
        </p>
        <p className="text-sm text-gray-500">
          {flight.arrival.airport.name} - Terminal {flight.arrival.terminal}
        </p>
      </div>
    </div>
  </div>
);

const PassengerCard = ({ passenger, preferences, seat, onEdit }) => (
  <div className="mb-4 rounded-lg bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h4 className="text-lg font-semibold">
          {passenger.title}. {passenger.firstName} {passenger.lastName}
        </h4>
        <p className="text-sm text-gray-500">
          {passenger.passengerType.charAt(0).toUpperCase() +
            passenger.passengerType.slice(1)}
        </p>
      </div>
      <button
        onClick={() => onEdit(passenger._id)}
        className="text-blue-600 hover:text-blue-800"
      >
        Edit Details
      </button>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <p className="text-gray-600">Seat Assignment</p>
        <p className="font-semibold">{seat.seatNumber}</p>
      </div>
      <div>
        <p className="text-gray-600">Meal Preference</p>
        <p className="font-semibold">
          {preferences.meal.specialMealType || "Standard Meal"}
        </p>
      </div>
      <div>
        <p className="text-gray-600">Baggage</p>
        <p className="font-semibold">
          {preferences.baggage.type === "checked"
            ? "Checked-in Luggage"
            : "Carry-on Only"}
        </p>
      </div>
      {preferences.specialAssistance && (
        <div>
          <p className="text-gray-600">Special Assistance</p>
          <ul className="list-inside list-disc">
            {Object.entries(preferences.specialAssistance)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <li key={key} className="text-sm">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const PriceBreakdown = ({ booking }) => (
  <div className="rounded-lg bg-white p-6 shadow-sm">
    <SectionHeader icon="💰" title="Price Breakdown" />
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Base Fare</span>
        <span>
          {booking.totalPrice} {booking.currency}
        </span>
      </div>
      {/* Add other price components like taxes, fees, etc. */}
      <div className="mt-4 border-t pt-2">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>
            {booking.totalPrice} {booking.currency}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const ReviewBooking = ({ bookingData, onEditPassenger, onConfirm }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Your Booking</h1>
          <p className="text-gray-600">
            Booking Reference: {bookingData.bookingRef}
          </p>
        </div>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Confirm Booking
        </button>
      </div>

      {/* Flight Details Section */}
      <FlightDetails flight={bookingData.flightSnapshot} />

      {/* Passengers Section */}
      <div className="space-y-4">
        <SectionHeader icon="👥" title="Passenger Details" />
        {bookingData.passengers.map((passenger, index) => (
          <PassengerCard
            key={passenger._id}
            passenger={passenger}
            preferences={bookingData.preferences[index]}
            seat={bookingData.seats.find(
              (seat) => seat.passengerId === passenger._id,
            )}
            onEdit={() => {
              setIsEditing(true);
              onEditPassenger(passenger._id);
            }}
          />
        ))}
      </div>

      {/* Price Breakdown */}
      <PriceBreakdown booking={bookingData} />

      {/* Contact Information */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <SectionHeader icon="📞" title="Contact Information" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-semibold">
              {bookingData.passengers.find((p) => p.isPrimary)?.email}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <p className="font-semibold">
              {
                bookingData.passengers.find((p) => p.isPrimary)?.phoneNumber
                  .number
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBooking;
