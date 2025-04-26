import { Option, Select } from "@/components/local-ui/Select";
import { useState } from "react";
// incomplete, working on it currently
const PassengerForm = ({ passenger, index, onPreferenceChange }) => {
  return (
    <div className="mb-8 rounded-lg border p-6">
      <h2 className="mb-6 flex items-center justify-between text-2xl font-bold">
        <span>Passenger {index + 1} Preferences</span>
      </h2>

      <div className="space-y-6">
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            Seating Preferences
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block">Seat Position</label>
              <Select
                name="seatPosition"
                popoverAttributes={{ className: "h-auto", search: false }}
              >
                <Option value="window">Window</Option>
                <Option value="aisle">Aisle</Option>
                <Option value="middle">Middle</Option>
                <Option value="exit">Exit Row</Option>
              </Select>
            </div>
            <div>
              <label className="mb-2 block">Seat Location</label>
              <Select
                name="seatLocation"
                popoverAttributes={{ className: "h-auto", search: false }}
              >
                <Option value="front">Front</Option>
                <Option value="middle">Middle</Option>
                <Option value="back">Back</Option>
              </Select>
            </div>
            <div>
              <label className="mb-2 block">Legroom</label>

              <Select
                name="legroom"
                popoverAttributes={{ className: "h-auto", search: false }}
              >
                <Option value="standard">Standard</Option>
                <Option value="extra">Extra Legroom</Option>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="quietZone"
                checked={passenger.seating.quietZone}
                onChange={(e) =>
                  onPreferenceChange(
                    index,
                    "seating",
                    "quietZone",
                    e.target.checked,
                  )
                }
              />
              <label htmlFor="quietZone">Quiet Zone</label>
            </div>
          </div>
        </section>

        {/* Baggage Preferences */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            Baggage Preferences
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block">Baggage Type</label>
              <Select
                name="baggageType"
                popoverAttributes={{ className: "h-auto", search: false }}
              >
                <Option value="carry-on">Carry-on Only</Option>
                <Option value="checked">Checked-in Luggage</Option>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="extraBaggage"
                checked={passenger.baggage.extraAllowance}
                onChange={(e) =>
                  onPreferenceChange(
                    index,
                    "baggage",
                    "extraAllowance",
                    e.target.checked,
                  )
                }
              />
              <label htmlFor="extraBaggage">Extra Baggage Allowance</label>
            </div>
          </div>
        </section>

        {/* Meal Preferences */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            Meal Preferences
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block">Meal Type</label>
              <Select
                name="mealType"
                popoverAttributes={{ className: "h-auto", search: false }}
              >
                <Option value="standard">Standard Meal</Option>
                <Option value="vegetarian">Vegetarian</Option>
                <Option value="vegan">Vegan</Option>
                <Option value="halal">Halal</Option>
                <Option value="kosher">Kosher</Option>
                <Option value="gluten-free">Gluten-Free</Option>
                <Option value="child">Child Meal</Option>
                <Option value="diabetic">Diabetic</Option>
              </Select>
            </div>
          </div>
        </section>

        {/* Special Assistance */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            Special Assistance
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              "wheelchair",
              "boarding",
              "elderlyInfant",
              "medicalEquipment",
            ].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={item}
                  checked={passenger.specialAssistance[item]}
                  onChange={(e) =>
                    onPreferenceChange(
                      index,
                      "specialAssistance",
                      item,
                      e.target.checked,
                    )
                  }
                />
                <label htmlFor={item} className="capitalize">
                  {item.replace(/([A-Z])/g, " $1").trim()}
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Other Preferences */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            Other Preferences
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {["entertainment", "wifi", "powerOutlet"].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={item}
                  checked={passenger.other[item]}
                  onChange={(e) =>
                    onPreferenceChange(index, "other", item, e.target.checked)
                  }
                />
                <label htmlFor={item} className="capitalize">
                  {item === "wifi"
                    ? "Wi-Fi"
                    : item.replace(/([A-Z])/g, " $1").trim()}
                </label>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const PassengerPreferences = ({ numberOfPassengers = 1 }) => {
  const initialPassengerPreference = {
    seating: {
      position: "",
      location: "",
      legroom: "standard",
      quietZone: false,
      nearLavatory: "",
    },
    baggage: {
      type: "",
      extraAllowance: false,
      specialHandling: false,
    },
    meal: {
      type: "standard",
      specialMealType: "",
    },
    specialAssistance: {
      wheelchair: false,
      boarding: false,
      elderlyInfant: false,
      medicalEquipment: false,
    },
    other: {
      entertainment: false,
      wifi: false,
      powerOutlet: false,
    },
  };

  const [passengers, setPassengers] = useState(
    Array(numberOfPassengers)
      .fill(null)
      .map(() => ({ ...initialPassengerPreference })),
  );

  const handlePreferenceChange = (passengerIndex, category, field, value) => {
    setPassengers((prev) => {
      const newPassengers = [...prev];
      newPassengers[passengerIndex] = {
        ...newPassengers[passengerIndex],
        [category]: {
          ...newPassengers[passengerIndex][category],
          [field]: value,
        },
      };
      return newPassengers;
    });
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Passenger Preferences</h1>
        <p className="text-gray-600">
          Please set preferences for all {numberOfPassengers} passenger(s)
        </p>
      </div>

      {passengers.map((passenger, index) => (
        <PassengerForm
          key={index}
          passenger={passenger}
          index={index}
          onPreferenceChange={handlePreferenceChange}
        />
      ))}
    </div>
  );
};

export default PassengerPreferences;
