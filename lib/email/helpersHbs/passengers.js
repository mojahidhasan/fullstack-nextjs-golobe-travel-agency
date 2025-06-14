export default function passengers(p, seats) {
  return p.map((p) => {
    const seat = seats.find((s) => s.reservation.for === p._id);
    return {
      firstName: p.firstName,
      lastName: p.lastName,
      seatNumber: seat.seatNumber,
      seatClass: seat.class,
      type: p.passengerType,
    };
  });
}
