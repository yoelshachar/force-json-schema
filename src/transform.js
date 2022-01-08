exports.string = (val, defaultVal) => {
  return val && typeof val !== "object" ? val + "" : defaultVal || "";
};

exports.number = (val, defaultVal) => {
  return +val || +defaultVal || 0;
};

exports.date = (val, defaultVal) => {
  const date = val || defaultVal;
  return date instanceof Date
    ? date
    : ["string", "number"].includes(typeof date)
    ? new Date(date)
    : null;
};

exports.bool = (val, defaultVal) => {
  return ["boolean", "number"].includes(typeof val) 
    ? !!val
    : ["boolean", "number"].includes(typeof defaultVal) 
    ? !!defaultVal
    : null;
};

exports.object = (val, defaultVal) => {
  const obj = val || defaultVal;
  return typeof obj == "object"
    ? JSON.parse(JSON.stringify(obj))
    : {};
};

exports.any = (val, defaultVal) => {
  return val ?? defaultVal ?? null;
};

exports.array = (val, defaultVal) => {
  const arr = val || defaultVal;
  return Array.isArray(arr)
    ? JSON.parse(JSON.stringify(arr))
    : [];
};
