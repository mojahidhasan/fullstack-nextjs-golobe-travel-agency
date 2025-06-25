"use client";

import { useEffect, useState } from "react";

export function MaintenanceNotice({ maintenanceMode }) {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const startsAt = new Date(maintenanceMode?.startsAt || 0);
    if (startsAt.getTime() > Date.now()) {
      const updateCountdown = () => {
        const now = new Date();
        const diff = startsAt - now;

        if (diff <= 0) {
          setCountdown("Maintenance is starting soon");
          return;
        }

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown(`${minutes}m ${seconds}s`);
      };

      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [maintenanceMode?.startsAt]);

  if (maintenanceMode?.enabled) {
    return (
      <div className="bg-secondary p-2 text-center text-xl font-semibold !text-tertiary text-white">
        <div>Server is in maintenance</div>
      </div>
    );
  }

  if (
    !maintenanceMode?.enabled &&
    countdown === "Maintenance is starting soon"
  ) {
    return (
      <div className="bg-secondary p-2 text-center text-xl font-semibold !text-tertiary text-white">
        <div>Maintenance is starting soon</div>
      </div>
    );
  }

  if (!maintenanceMode?.enabled && countdown) {
    return (
      <div className="bg-secondary p-2 text-center text-xl font-semibold !text-tertiary text-white">
        Maintenance is starting in {countdown}
        <p className="text-sm text-secondary-foreground">
          The website will be down soon
        </p>
      </div>
    );
  }
}
