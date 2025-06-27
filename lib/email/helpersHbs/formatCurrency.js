export default function formatCurrency(amount, currency) {
  const num = parseFloat(amount);
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(num);
}
