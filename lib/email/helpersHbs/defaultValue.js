export default function defaultValue(value, defaultValue) {
  return value === undefined || value === null || value === ""
    ? defaultValue
    : value;
}
