import React, { useState, useEffect } from "react";
import Day from "./Day";

const Confirmation = ({ availability }) => {
  const [days, setDays] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (availability && availability !== "{}") {
      try {
        // Parse the availability prop
        const parsedAvailability = JSON.parse(availability);

        // Check if parsedAvailability is valid and has data
        if (parsedAvailability && Object.keys(parsedAvailability).length > 0) {
          // Extract the first entry (assuming the structure is consistent)
          const result = Object.entries(parsedAvailability)[0][1];

          // Map the result to Day components
          const mappedDays = result.map((e) => (
            <Day
              key={e.dayOfWeek}
              day={e.dayOfWeek.charAt(0).toUpperCase() + e.dayOfWeek.slice(1)}
              timeSlots={e.timeSlots}
            />
          ));

          // Update the days state
          setDays(mappedDays);
          setError(null); // Clear any previous errors
        } else {
          setError("No availability data found.");
        }
      } catch (err) {
        console.error("Error parsing availability:", err);
        setError("Failed to parse availability data.");
      }
    } else {
      setError("Availability data is empty, type a sentence to update it.");
    }
  }, [availability]);

  return (
    <div>
      <h3>Your new slots</h3>
      {error ? <p>{error}</p> : <div>{days}</div>}
    </div>
  );
};

export default Confirmation;
