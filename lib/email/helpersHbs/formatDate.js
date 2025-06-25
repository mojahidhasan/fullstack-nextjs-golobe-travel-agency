import { formatInTimeZone } from "date-fns-tz";

export default function formatDate(
  timestamp,
  timezone,
  format = "dd MMMM yyyy",
) {
  try {
    if (!isNaN(parseInt(timestamp))) timestamp = parseInt(timestamp);
    return formatInTimeZone(new Date(timestamp), timezone, format);
  } catch (e) {
    console.error("formatDate error:", e);
    return "";
  }
}
