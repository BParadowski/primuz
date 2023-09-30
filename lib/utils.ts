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
