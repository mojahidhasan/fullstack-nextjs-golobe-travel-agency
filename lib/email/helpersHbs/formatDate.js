import { formatInTimeZone } from "date-fns-tz";

export default function formatDate(
  timestamp,
  timezone,
  format = "dd MMMM yyyy",
) {
  try {
    return formatInTimeZone(+timestamp, timezone, format);
  } catch (e) {
    console.error("formatDate error:", e);
    return "";
  }
}
