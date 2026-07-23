const normalizeString = (value: string): string => {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

export default normalizeString;