import { ObjectId } from "mongodb";
import { addDays, addMinutes, subMinutes } from "date-fns";
import { lerp, normalize } from "../../../utils";

const flightDurationFactors = {
  climbDescentTime: 30,
  taxiTime: 20,
  atcDirectives: 15,
  aircraftWeight: 10,
  altitudeChanges: 5,
  fuelEfficiency: 20,
  airportSlotTimes: 15,
  maintenanceIssues: 10,
};

const layoverFactors = {
  minimumConnectionTime: 60,
  securityAndImmigration: 30,
  airportCongestion: 15,
  boardingDeboarding: 20,
  terminalChange: 20,
  baggageRecheck: 15,
};

// Airline-specific flight number ranges and patterns
const airlineFlightNumberPatterns = {
  AA: { min: 1, max: 3000, evenOdd: true }, // American Airlines
  DL: { min: 1, max: 3000, evenOdd: true }, // Delta
  UA: { min: 1, max: 3000, evenOdd: true }, // United
  WN: { min: 1, max: 4000, evenOdd: false }, // Southwest
  BA: { min: 1, max: 3000, evenOdd: true }, // British Airways
  LH: { min: 1, max: 5000, evenOdd: true }, // Lufthansa
  NH: { min: 1, max: 2000, evenOdd: true }, // ANA
  SQ: { min: 1, max: 4000, evenOdd: true }, // Singapore Airlines
  EK: { min: 1, max: 3000, evenOdd: true }, // Emirates
  FZ: { min: 1, max: 3000, evenOdd: true }, // Qatar Airways
  EY: { min: 1, max: 3000, evenOdd: true }, // Etihad
};

export default function generateOneDayFlight(
  airlines,
  airlineFlightPrices,
  airports,
  airplanes,
  lastFlightDate,
) {
  let flightItineraries = [];
  let flightSegments = [];
  let flightSeats = [];

  const flightTimes = ["04:00", "12:00", "20:00"];
  const stopFlightRatio = 0.3;
  const nextDayFromLastFlight = addDays(new Date(lastFlightDate), 1);
  const maxTotalFlightDuration = 2900;
  const minTotalFlightDuration = 180;

  for (const airline of airlines) {
    const routes = airlineFlightPrices.filter(
      (f) => f.airlineCode === airline._id,
    );
    const airlineAircrafts = airplanes.filter(
      (ap) => ap.airlineId === airline._id,
    );

    for (const route of routes) {
      for (const time of flightTimes) {
        const choosingAirplane =
          airlineAircrafts[Math.floor(Math.random() * airlineAircrafts.length)];
        const seats = choosingAirplane.seats.map((seat) => ({
          ...seat,
          _id: new ObjectId(),
          airplaneId: choosingAirplane._id,
          reservation: {
            type: null,
            expiresAt: 0,
            for: null,
          },
        }));

        const departureAirportId = route.departureAirportCode;
        const arrivalAirportId = route.arrivalAirportCode;
        const routeDistance = +route.distance.value;
        const airplaneCruiseSpeed = +choosingAirplane.cruiseSpeed.value;
        const flightDurationInMinutes =
          (routeDistance / airplaneCruiseSpeed) * 60;

        let totalFlightDuration =
          Object.values(flightDurationFactors).reduce(
            (acc, curr) => +acc + curr,
            flightDurationInMinutes,
          ) + Math.floor(Math.random() * 120);

        const reductionPercentageForDuration = lerp(
          0,
          10,
          normalize(
            totalFlightDuration,
            minTotalFlightDuration,
            maxTotalFlightDuration,
          ),
        );
        let discount = reductionPercentageForDuration;

        const parseHoursAndMins = time.split(":").map(Number);
        const departureTime = new Date(nextDayFromLastFlight);
        departureTime.setUTCHours(
          parseHoursAndMins[0],
          parseHoursAndMins[1],
          0,
          0,
        );
        const arrivalTime = addMinutes(departureTime, totalFlightDuration);

        const isStopFlight = Math.random() <= stopFlightRatio;
        let segmentIds = [];
        let segments = [];
        let layovers = [];

        // Create base segment
        const baseSegmentId = new ObjectId();
        const baseSegmentSeats = seats.map((seat) => {
          return {
            ...seat,
            _id: new ObjectId(),
            segmentId: baseSegmentId,
          };
        });

        const baseSegment = createSegment({
          segmentId: baseSegmentId,
          airlineId: airline._id,
          fromAirport: departureAirportId,
          toAirport: arrivalAirportId,
          departureTime,
          arrivalTime,
          airplaneId: choosingAirplane._id,
          duration: totalFlightDuration,
          seats: baseSegmentSeats.map((seat) => seat._id),
          route,
          airlineFlightPrices,
          discount,
          airline,
        });
        segments.push(baseSegment);
        segmentIds.push(baseSegmentId);

        let segment1Seats = [],
          segment2Seats = [];

        if (isStopFlight) {
          const totalLayoverDuration =
            Object.values(layoverFactors).reduce(
              (acc, curr) => +acc + curr,
              0,
            ) + Math.floor(Math.random() * 120);

          const randomAirport = selectRandomStop(
            airports,
            departureAirportId,
            arrivalAirportId,
          );
          const originToStopRoute = routes.find(
            (r) =>
              r.departureAirportCode === departureAirportId &&
              r.arrivalAirportCode === randomAirport._id,
          );
          const stopToDestRoute = routes.find(
            (r) =>
              r.departureAirportCode === randomAirport._id &&
              r.arrivalAirportCode === arrivalAirportId,
          );

          const segment1Duration = calculateSegmentDuration(
            originToStopRoute,
            choosingAirplane,
          );
          const segment2Duration = calculateSegmentDuration(
            stopToDestRoute,
            choosingAirplane,
          );
          totalFlightDuration =
            segment1Duration + segment2Duration + totalLayoverDuration;

          discount = combineDiscounts([
            lerp(
              0,
              10,
              normalize(
                totalFlightDuration,
                minTotalFlightDuration,
                maxTotalFlightDuration,
              ),
            ),
            50, // stopover discount
          ]);

          const segment1Arrival = addMinutes(departureTime, segment1Duration);
          const segment2Departure = addMinutes(
            segment1Arrival,
            totalLayoverDuration,
          );
          const segment2Arrival = addMinutes(
            segment2Departure,
            segment2Duration,
          );

          // Create segments for stop flight
          const segment1Id = new ObjectId();
          const segment2Id = new ObjectId();

          segment1Seats = seats.map((seat) => {
            return {
              ...seat,
              _id: new ObjectId(),
              segmentId: segment1Id,
            };
          });
          segment2Seats = seats.map((seat) => {
            return {
              ...seat,
              _id: new ObjectId(),
              segmentId: segment2Id,
            };
          });

          segments = [
            createSegment({
              segmentId: segment1Id,
              airlineId: airline._id,
              fromAirport: departureAirportId,
              toAirport: randomAirport._id,
              departureTime,
              arrivalTime: segment1Arrival,
              airplaneId: choosingAirplane._id,
              duration: segment1Duration,
              seats: segment1Seats.map((s) => s._id),
              route: originToStopRoute,
              airlineFlightPrices,
              discount,
              airline,
            }),
            createSegment({
              segmentId: segment2Id,
              airlineId: airline._id,
              fromAirport: randomAirport._id,
              toAirport: arrivalAirportId,
              departureTime: segment2Departure,
              arrivalTime: segment2Arrival,
              airplaneId: choosingAirplane._id,
              duration: segment2Duration,
              seats: segment2Seats.map((s) => s._id),
              route: stopToDestRoute,
              airlineFlightPrices,
              discount,
              airline,
            }),
          ];

          segmentIds = [segment1Id, segment2Id];
          layovers = [
            {
              fromSegmentIndex: 0,
              durationMinutes: totalLayoverDuration,
            },
          ];
        }

        const flightCode = generateFlightNumber(
          airline.iataCode,
          departureAirportId,
          arrivalAirportId,
          departureTime,
          time,
        );

        // Add segments to flightSegments array
        flightSegments.push(
          ...segments.map((segment) => ({
            ...segment,
            flightNumber: `${flightCode}-${segmentIds.indexOf(segment._id) + 1}`,
            date: departureTime,
            expireAt: subMinutes(departureTime, 30),
          })),
        );

        // Create flight itinerary
        flightItineraries.push({
          flightCode,
          carrierInCharge: airline._id,
          date: departureTime,
          departureAirportId,
          arrivalAirportId,
          segmentIds,
          totalDurationMinutes: totalFlightDuration,
          layovers,
          baggageAllowance: generateBaggageAllowance(airline),
          status: "scheduled",
          expireAt: subMinutes(departureTime, 30),
        });

        flightSeats.push(
          ...baseSegmentSeats,
          ...segment1Seats,
          ...segment2Seats,
        );
      }
    }
  }

  return {
    flightItinerary: flightItineraries,
    flightSegments: flightSegments,
    flightSeats: flightSeats,
  };
}

// Helper functions
function createSegment({
  segmentId,
  airlineId,
  fromAirport,
  toAirport,
  departureTime,
  arrivalTime,
  airplaneId,
  duration,
  seats,
  route,
  airlineFlightPrices,
  discount,
  airline,
}) {
  return {
    _id: segmentId,
    flightNumber: "", // Will be set later when added to flightSegments array
    date: departureTime,
    airlineId,
    from: {
      airport: fromAirport,
      scheduledDeparture: departureTime,
      terminal: Math.floor(Math.random() * 4).toString(),
      gate: Math.floor(Math.random() * 4).toString(),
    },
    to: {
      airport: toAirport,
      scheduledArrival: arrivalTime,
      terminal: Math.floor(Math.random() * 4).toString(),
      gate: Math.floor(Math.random() * 4).toString(),
    },
    airplaneId,
    durationMinutes: duration,
    seats,
    fareDetails: generateFareDetails(
      route,
      airlineFlightPrices,
      { _id: airlineId },
      discount,
    ),
    baggageAllowance: generateBaggageAllowance(airline),
    status: "scheduled",
    expireAt: subMinutes(departureTime, 30),
  };
}

function calculateSegmentDuration(route, airplane) {
  const distance = +route.distance.value;
  const speed = +airplane.cruiseSpeed.value;
  return (
    (distance / speed) * 60 +
    Object.values(flightDurationFactors).reduce((a, c) => a + c, 0)
  );
}

function generateFlightNumber(
  airlineCode,
  departureAirport,
  arrivalAirport,
  date,
  time,
) {
  const pattern = airlineFlightNumberPatterns[airlineCode] || {
    min: 1,
    max: 3000,
    evenOdd: true,
  };

  const timeSlot = getTimeSlot(time);
  const routeTimeKey = `${airlineCode}-${departureAirport}-${arrivalAirport}-${timeSlot}`;
  const dateKey = date.toISOString().split("T")[0];

  let baseNumber =
    (hashCode(routeTimeKey) % (pattern.max - pattern.min)) + pattern.min;
  const dateVariation = hashCode(dateKey) % 100;

  let flightNum = baseNumber + dateVariation;
  if (pattern.evenOdd) {
    const isEastbound = departureAirport < arrivalAirport;
    flightNum = isEastbound
      ? flightNum % 2 === 0
        ? flightNum
        : flightNum + 1
      : flightNum % 2 === 1
        ? flightNum
        : flightNum + 1;
  }

  flightNum = Math.max(pattern.min, Math.min(pattern.max, flightNum));
  flightNum = String(flightNum).padStart(4, "0").slice(-4);

  const letterSuffix =
    Math.random() > 0.9
      ? String.fromCharCode(65 + Math.floor(Math.random() * 26))
      : "";

  return `${airlineCode}${flightNum}${letterSuffix}`;
}

function getTimeSlot(timeString) {
  const hour = parseInt(timeString.split(":")[0]);
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function generateFareDetails(route, airlineFlightPrices, airline, discount) {
  const currentRoutePrice = airlineFlightPrices.find(
    (r) =>
      r.airlineCode === airline._id &&
      r.departureAirportCode === route.departureAirportCode &&
      r.arrivalAirportCode === route.arrivalAirportCode,
  );

  const flightPrice = JSON.parse(JSON.stringify(currentRoutePrice));
  const flightClasses = ["economy", "premium_economy", "business", "first"];
  const randomPriceMultiplier = lerp(1.2, 1.6, Math.random());

  flightClasses.forEach((classs) => {
    flightPrice.basePrice[classs] = {
      adult: +flightPrice.basePrice[classs].adult * randomPriceMultiplier,
      child: +flightPrice.basePrice[classs].child * randomPriceMultiplier,
      infant: +flightPrice.basePrice[classs].infant * randomPriceMultiplier,
    };
  });

  Object.entries(currentRoutePrice.discount).forEach(([key, value]) => {
    flightPrice.discount[key] = {
      type: "percentage",
      amount: value.amount
        ? Math.floor(combineDiscounts([value.amount, discount]))
        : 0,
    };
  });

  return flightPrice;
}

function generateBaggageAllowance(airline) {
  // Use airline's policy if available, otherwise use default
  if (airline.airlinePolicy?.baggageAllowance) {
    return airline.airlinePolicy.baggageAllowance;
  }

  return {
    currency: "USD",
    carryOn: {
      maxPieces: 1,
      maxWeight: { measurementUnit: "kg", value: 7 },
      maxDimensions: {
        length: 55,
        width: 40,
        height: 20,
        measurementUnit: "cm",
      },
    },
    checked: {
      maxPieces: 1,
      maxWeight: { measurementUnit: "kg", value: 23 },
    },
    excessWeightFee: {
      feeAmount: 50,
      currency: "USD",
      feeType: "perKg",
    },
    excessPieceFee: {
      feeAmount: 100,
      currency: "USD",
      feeType: "perPiece",
    },
  };
}

function selectRandomStop(airports, originId, destinationId) {
  const possibleStops = airports.filter(
    (airport) => airport._id !== originId && airport._id !== destinationId,
  );
  return possibleStops[Math.floor(Math.random() * possibleStops.length)];
}

function combineDiscounts(percentages) {
  return (1 - percentages.reduce((acc, p) => acc * (1 - p / 100), 1)) * 100;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
