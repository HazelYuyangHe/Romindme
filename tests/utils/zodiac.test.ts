import { getZodiac, getAge, daysUntilBirthday } from "@/utils/zodiac";

describe("getZodiac", () => {
  it("returns Virgo for September 21", () => {
    const z = getZodiac("1998-09-21");
    expect(z?.name).toBe("Virgo");
  });

  it("returns Aries for April 1", () => {
    const z = getZodiac("2000-04-01");
    expect(z?.name).toBe("Aries");
  });

  it("returns Capricorn for January 1", () => {
    const z = getZodiac("1990-01-01");
    expect(z?.name).toBe("Capricorn");
  });

  it("returns Scorpio for November 1", () => {
    const z = getZodiac("1995-11-01");
    expect(z?.name).toBe("Scorpio");
  });

  it("returns Pisces for March 1", () => {
    const z = getZodiac("2001-03-01");
    expect(z?.name).toBe("Pisces");
  });

  it("returns null for empty string", () => {
    const z = getZodiac("");
    expect(z).toBeNull();
  });

  it("returns correct emoji for Leo", () => {
    const z = getZodiac("1999-08-01");
    expect(z?.emoji).toBe("♌");
  });

  it("returns Sagittarius for December 1", () => {
    const z = getZodiac("1997-12-01");
    expect(z?.name).toBe("Sagittarius");
  });
});

describe("getAge", () => {
  it("returns null for empty string", () => {
    expect(getAge("")).toBeNull();
  });

  it("returns correct age", () => {
    const year = new Date().getFullYear() - 25;
    const age = getAge(`${year}-01-01`);
    expect(age).toBeGreaterThanOrEqual(24);
    expect(age).toBeLessThanOrEqual(25);
  });

  it("returns positive number", () => {
    const age = getAge("1990-06-15");
    expect(age).toBeGreaterThan(0);
  });
});

describe("daysUntilBirthday", () => {
  it("returns null for empty string", () => {
    expect(daysUntilBirthday("")).toBeNull();
  });

  it("returns a positive number", () => {
    const days = daysUntilBirthday("1990-12-31");
    expect(days).toBeGreaterThanOrEqual(0);
  });

  it("returns a number less than or equal to 366", () => {
    const days = daysUntilBirthday("1990-06-15");
    expect(days).toBeLessThanOrEqual(366);
  });
});
