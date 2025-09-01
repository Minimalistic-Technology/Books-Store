"use client";
import { atom } from "jotai";

// Holds the JWT token
export const tokenAtom = atom<string | null>(null);

// Holds the user role (e.g., "admin", "user")
export const roleAtom = atom<string | null>(null);
