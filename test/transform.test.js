const transform = require("../src/transform.js");

const now = new Date();

describe("String", () => {
  const t = transform.string;
  it("transform", () => {
    expect(t("1")).toBe("1");
    expect(t(1)).toBe("1");
    expect(t([])).toBe("");
    expect(t([1, 2])).toBe("");
    expect(t(false)).toBe("");
    expect(t({})).toBe("");
    expect(t(null)).toBe("");
    expect(t(undefined)).toBe("");
    expect(t(now)).toBe("");
  });
  it("default", () => {
    expect(t("1", "2")).toBe("1");
    expect(t(null, "2")).toBe("2");
  });
});

describe("Number", () => {
  const t = transform.number;
  it("transform", () => {
    expect(t(1)).toBe(1);
    expect(t("1")).toBe(1);
    expect(t([])).toBe(0);
    expect(t({})).toBe(0);
    expect(t(false)).toBe(0);
    expect(t(true)).toBe(1);
    expect(t(null)).toBe(0);
    expect(t(undefined)).toBe(0);
    expect(t(now)).toBe(now.getTime());
  });
  it("default", () => {
    expect(t(1, 2)).toBe(1);
    expect(t(null, 2)).toBe(2);
  });
});

describe("Date", () => {
  const t = transform.date;
  it("transform", () => {
    expect(t(now)).toBe(now);
    expect(t(1)).toBeTruthy();
    expect(t(0)).toBe(null);
    expect(t("1")).toBeTruthy();
    expect(t([])).toBe(null);
    expect(t({})).toBe(null);
    expect(t(false)).toBe(null);
    expect(t(true)).toBe(null);
    expect(t(null)).toBe(null);
    expect(t(undefined)).toBe(null);
  });
  it("default", () => {
    expect(t(null, now)).toBe(now);
  });
});

describe("Boolean", () => {
  const t = transform.bool;
  it("transform", () => {
    expect(t(true)).toBe(true);
    expect(t(false)).toBe(false);
    expect(t(1)).toBe(true);
    expect(t(0)).toBe(false);
    expect(t("1")).toBe(null);
    expect(t([])).toBe(null);
    expect(t({})).toBe(null);
    expect(t(null)).toBe(null);
    expect(t(undefined)).toBe(null);
  });
  it("default", () => {
    expect(t(null, null)).toBe(null);
    expect(t(null, true)).toBe(true);
    expect(t(null, false)).toBe(false);
  });
});

describe("Object", () => {
  const t = transform.object;
  const obj = { x: 1 };
  it("transform", () => {
    expect(t(obj).x).toBe(1);
  });
  it("clone", () => {
    expect(t(obj)).not.toBe(obj);
  });
  it("default", () => {
    expect(typeof t(1)).toBe("object");
    expect(typeof t("a")).toBe("object");
    expect(typeof t([])).toBe("object");
    expect(typeof t(null)).toBe("object");
    expect(t(null, obj).x).toBe(1);
  });
});

describe("Any", () => {
  const t = transform.any;
  it("transform", () => {
    expect(t("1")).toBe("1");
    expect(t(1)).toBe(1);
    expect(t(true)).toBe(true);
    expect(t(false)).toBe(false);
    expect(t(undefined)).toBe(null);
  });
  it("default", () => {
    expect(t(null, "1")).toBe("1");
    expect(t(null, false)).toBe(false);
  });
});

describe("Array", () => {
  const t = transform.array;
  const arr = [1, 2] 
  it("transform", () => {
    expect(t(arr)[0]).toBe(1);
    expect(t(1).length).toBe(0);
    expect(t(false).length).toBe(0);
    expect(t(undefined).length).toBe(0);
  });
  it("clone", () => {
    expect(t(arr)).not.toBe(arr);
    expect(t(null, arr)).not.toBe(arr);
  });
  it("default", () => {
    expect(t(null, arr)[0]).toBe(1);
  });
});