"use client";
import { Trash2 } from "lucide-react";

/** Verwijderen vraagt eerst om bevestiging. */
export function DeleteButton() {
  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
      onClick={(e) => {
        if (!confirm("Deze offerte definitief verwijderen?")) e.preventDefault();
      }}>
      <Trash2 className="size-4" /> Offerte verwijderen
    </button>
  );
}
