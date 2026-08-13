import { useEffect, useState } from "react";
import { Countdown } from "../components/landing/Countdown";
import { Schedule } from "../components/landing/Schedule";
import { fetchSchedule } from "../api/schedule";
import { usePublicSettings } from "../layouts/PublicLayout";
import type { ScheduleItem } from "../types";

export function SchedulePage() {
  const settings = usePublicSettings();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    fetchSchedule().then(setSchedule);
  }, []);

  return (
    <>
      <Countdown targetDate={settings.wedding_date} />
      <Schedule items={schedule} />
    </>
  );
}
