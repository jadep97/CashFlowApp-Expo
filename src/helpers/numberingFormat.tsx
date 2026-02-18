export const numberFormat = (value: any) => {
  if (value === undefined || value === null) return "0";

  const str = String(value);

  const cleanText = str.replace(/[^0-9.]/g, "");

  const [whole, decimal] = cleanText.split(".");
  const formattedWhole = Number(whole || 0).toLocaleString();

  return decimal !== undefined
    ? `${formattedWhole}.${decimal}`
    : formattedWhole;
};
