export function calculateTotalFlightPrice(priceObj) {
  let sum = 0;
  const prices = Object.values(priceObj);

  for (const p of prices) {
    sum += Object.values(p).reduce((sum, curr) => +sum + +curr, 0);
  }
  return sum;
}

export function minutesToHMFormat(min) {
  const hours = Math.floor(min / 60);
  const remainingMinutes = Math.round(min % 60);
  return `${hours}h ${remainingMinutes}m`;
}
