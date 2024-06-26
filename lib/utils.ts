import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const replacements: { [K in string]: string } = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
  Ą: "A",
  Ć: "C",
  Ę: "E",
  Ł: "L",
  Ń: "N",
  Ó: "O",
  Ś: "S",
  Ź: "Z",
  Ż: "Z",
};

export const replacePolishLetters = (text: string) => {
  let result = "";
  for (let letter of text) {
    if (letter in replacements) result += replacements[letter];
    else result += letter;
  }
  return result;
};

const instrumentChierarchy: { [K in string]: number } = {
  skrzypce: 0,
  "skrzypce I": 0,
  "skrzypce II": 1,
  altówka: 2,
  wiolonczela: 3,
  kontrabas: 4,
};

export const sortByInstrument = (arr: string[]) => {
  return arr.sort((a, b) => instrumentChierarchy[a] - instrumentChierarchy[b]);
};

export const toRoman = (num: number, result = ""): string => {
  const map: Record<string, number> = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  for (const key in map) {
    if (num >= map[key]) {
      if (num !== 0) {
        return toRoman(num - map[key], result + key);
      }
    }
  }
  return result;
};
