const ZODIAC = [
  { name: "Capricorn", emoji: "♑", start: [12,22], end: [1,19] },
  { name: "Aquarius", emoji: "♒", start: [1,20], end: [2,18] },
  { name: "Pisces", emoji: "♓", start: [2,19], end: [3,20] },
  { name: "Aries", emoji: "♈", start: [3,21], end: [4,19] },
  { name: "Taurus", emoji: "♉", start: [4,20], end: [5,20] },
  { name: "Gemini", emoji: "♊", start: [5,21], end: [6,21] },
  { name: "Cancer", emoji: "♋", start: [6,22], end: [7,22] },
  { name: "Leo", emoji: "♌", start: [7,23], end: [8,22] },
  { name: "Virgo", emoji: "♍", start: [8,23], end: [9,22] },
  { name: "Libra", emoji: "♎", start: [9,23], end: [10,23] },
  { name: "Scorpio", emoji: "♏", start: [10,24], end: [11,22] },
  { name: "Sagittarius", emoji: "♐", start: [11,23], end: [12,21] },
];

export function getZodiac(birthday: string) {
  if (!birthday) return null;
  const [,m,d] = birthday.split("-").map(Number);
  for (const z of ZODIAC) {
    const [sm,sd] = z.start, [em,ed] = z.end;
    if ((m === sm && d >= sd) || (m === em && d <= ed)) return z;
  }
  return ZODIAC[0];
}

export function getAge(birthday: string) {
  if (!birthday) return null;
  const today = new Date(), bday = new Date(birthday);
  let age = today.getFullYear() - bday.getFullYear();
  const mo = today.getMonth() - bday.getMonth();
  if (mo < 0 || (mo === 0 && today.getDate() < bday.getDate())) age--;
  return age;
}

export function daysUntilBirthday(birthday: string) {
  if (!birthday) return null;
  const today = new Date();
  const [,m,d] = birthday.split("-").map(Number);
  let next = new Date(today.getFullYear(), m-1, d);
  if (next < today) next = new Date(today.getFullYear()+1, m-1, d);
  return Math.ceil((next.getTime() - today.getTime()) / 86400000);
}
