"use client";
import { atom } from "jotai";
import { Category, SiteSettings } from "../admin/order-product-management/types";
export const categoriesAtom = atom<Category[] | null>(null);
export const siteSettingsAtom = atom<SiteSettings | null>(null);
