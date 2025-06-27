import { useEffect, useState } from "react";
import { defaultPassengerPreference } from "@/reduxStore/features/singlePassengerFormSlice";
import { Select, Option } from "@/components/local-ui/Select";
import { Checkbox } from "@/components/ui/checkbox";

const PreferencesForm = ({ passenger, index }) => {
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
    const passengersPreferences = JSON.parse(
      sessionStorage.getItem("passengersPreferences") ?? "[]",
    );
    const findThisPreferences = passengersPreferences.find(
      (x) => x.key === passenger.key,
    );
    if (findThisPreferences) {
      setPreferences(findThisPreferences);
    } else {
      const prefere = {
        ...defaultPassengerPreference,
        key: passenger.key,
        passengerType: passenger.passengerType,
      };
      setPreferences(prefere);
      sessionStorage.setItem(
        "passengersPreferences",
        JSON.stringify([...passengersPreferences, prefere]),
      );
    }
  }, [passenger.key, passenger.passengerType]);

  function updatePassengersPreferencesSession(val) {
    const passengersPreferences =
      sessionStorage.getItem("passengersPreferences") ?? "[]";
    let parsed = JSON.parse(passengersPreferences);
    // eslint-disable-next-line no-undef
    const preferencesMap = new Map();
    for (let pre of parsed) {
      if (Object.keys(pre) < 1) continue;
      preferencesMap.set(pre.key, pre);
    }
    preferencesMap.set(passenger.key, val);
    const preferencesObj = Object.fromEntries(preferencesMap);
    const newPreferences = Object.values(preferencesObj);
    sessionStorage.setItem(
      "passengersPreferences",
      JSON.stringify(newPreferences),
    );
  }

  function handlePreferencesChange(updatedPreference) {
    setPreferences(updatedPreference);
    updatePassengersPreferencesSession(updatedPreference);
  }
  return (
    <div className="rounded-lg border p-6 shadow-lg">
      <h2 className="mb-6 flex items-center justify-between text-2xl font-bold">
        <span>Passenger {index + 1} Preferences</span>
      </h2>

      <div className="mb-3">
        <p>
          <span className="font-bold">First name:</span> {passenger.firstName}
        </p>
        <p>
          <span className="font-bold">Last name:</span> {passenger.lastName}
        </p>
        <p>
          <span className="font-bold">Type:</span> {passenger.key.split("-")[0]}
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4 p-0">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            Seating Preferences
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <span className="absolute -top-[8px] left-5 z-10 bg-background px-1 text-sm font-normal leading-4">
                Seat Position
              </span>
              <Select
                name="seatPosition"
                value={preferences?.seating?.position}
                popoverAttributes={{ className: "h-auto", search: false }}
                onValueChange={(val) => {
                  const update = {
                    ...preferences,
                    seating: {
                      ...preferences.seating,
                      position: val.value,
                    },
                  };
                  handlePreferencesChange(update);
                }}
              >
                <Option value="any">Any</Option>
                <Option value="window">Window</Option>
                <Option value="aisle">Aisle</Option>
                <Option value="middle">Middle</Option>
                <Option value="exit">Exit Row</Option>
              </Select>
            </div>
            <div className="relative">
              <span className="absolute -top-[8px] left-5 z-10 bg-background px-1 text-sm font-normal leading-4">
                Seat Location
              </span>
              <Select
                name="seatLocation"
                value={preferences?.seating?.location}
                popoverAttributes={{ className: "h-auto", search: false }}
                onValueChange={(val) => {
                  const update = {
                    ...preferences,
                    seating: {
                      ...preferences.seating,
                      location: val.value,
                    },
                  };
                  handlePreferencesChange(update);
                }}
              >
                <Option value="any">Any</Option>
                <Option value="front">Front</Option>
                <Option value="middle">Middle</Option>
                <Option value="back">Back</Option>
              </Select>
            </div>
            <div className="relative">
              <span className="absolute -top-[8px] left-5 z-10 bg-background px-1 text-sm font-normal leading-4">
                Legroom
              </span>
              <Select
                name="legroom"
                value={preferences?.seating?.legroom}
                popoverAttributes={{ className: "h-auto", search: false }}
                onValueChange={(val) => {
                  const update = {
                    ...preferences,
                    seating: {
                      ...preferences.seating,
                      legroom: val.value,
                    },
                  };
                  handlePreferencesChange(update);
                }}
              >
                <Option value="none">None</Option>
                <Option value="standard">Standard</Option>
                <Option value="extra">Extra Legroom</Option>
              </Select>
            </div>
          </div>
          <div>
            <Checkbox
              id={`p-${index}-quiteZone`}
              name={"quietZone"}
              label={"Quiet Zone"}
              checked={preferences?.seating?.quietZone || false}
              onChange={(e) => {
                const update = {
                  ...preferences,
                  seating: {
                    ...preferences.seating,
                    quietZone: e.target.checked,
                  },
                };
                handlePreferencesChange(update);
              }}
            />
          </div>
        </section>

        {/* Baggage Preferences */}
        <section className="space-y-4 p-0">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            Baggage Preferences
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <span className="absolute -top-[8px] left-5 z-10 bg-background px-1 text-sm font-normal leading-4">
                Baggage Type
              </span>
              <Select
                name={`p-${index}-baggageType`}
                value={preferences?.baggage?.type}
                popoverAttributes={{ className: "h-auto", search: false }}
                onValueChange={(val) => {
                  const update = {
                    ...preferences,
                    baggage: {
                      ...preferences.baggage,
                      type: val.value,
                    },
                  };
                  handlePreferencesChange(update);
                }}
              >
                <Option value="any">Any</Option>
                <Option value="carry-on">Carry-on Only</Option>
                <Option value="checked">Checked-in Laggage</Option>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`p-${index}-extraBaggage`}
              label="Extra Baggage Allowance"
              checked={preferences?.baggage?.extraAllowance || false}
              onChange={(e) => {
                const update = {
                  ...preferences,
                  baggage: {
                    ...preferences.baggage,
                    extraAllowance: e.target.checked,
                  },
                };
                handlePreferencesChange(update);
              }}
            />
          </div>
        </section>

        {/* Meal Preferences */}
        <section className="space-y-4 p-0">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            Meal Preferences
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <span className="absolute -top-[8px] left-5 z-10 bg-background px-1 text-sm font-normal leading-4">
                Meal Type
              </span>
              <Select
                name="mealType"
                value={preferences?.meal?.type}
                popoverAttributes={{ className: "h-auto", search: false }}
                onValueChange={(val) => {
                  const update = {
                    ...preferences,
                    meal: {
                      ...preferences.meal,
                      type: val.value,
                    },
                  };
                  handlePreferencesChange(update);
                }}
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
        <section className="space-y-4 p-0">
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
                <Checkbox
                  id={`p-${index}-${item}`}
                  checked={preferences?.specialAssistance?.[item] || false}
                  label={
                    <span className="capitalize">
                      {item.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  }
                  onChange={(e) => {
                    const update = {
                      ...preferences,
                      specialAssistance: {
                        ...preferences.specialAssistance,
                        [item]: e.target.checked,
                      },
                    };
                    handlePreferencesChange(update);
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Other Preferences */}
        <section className="space-y-4 p-0">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            Other Preferences
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {["entertainment", "wifi", "powerOutlet"].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={`p-${index}-${item}`}
                  checked={preferences?.other?.[item] || false}
                  onChange={(e) => {
                    const update = {
                      ...preferences,
                      other: { ...preferences.other, [item]: e.target.checked },
                    };
                    handlePreferencesChange(update);
                  }}
                  label={
                    <span className="capitalize">
                      {item.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  }
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PreferencesForm;
