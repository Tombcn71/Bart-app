"use client";
import { InputHTMLAttributes } from "react";

type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> & {
  value: number;
  onChange: (value: number) => void;
};

// Toont het veld leeg i.p.v. een hardnekkige "0" zodra alles is weggehaald,
// zodat je direct kunt doortypen zonder eerst de 0 te hoeven verwijderen.
export function NumberInput({ value, onChange, ...props }: NumberInputProps) {
  return (
    <input
      {...props}
      type="number"
      value={value === 0 ? "" : value}
      onChange={(e) =>
        onChange(e.target.value === "" ? 0 : Number(e.target.value))
      }
    />
  );
}
