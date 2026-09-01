import novakeys from "@/assets/novakeys-k1.jpg";
import novaflow from "@/assets/novaflow-mouse.jpg";
import novastand from "@/assets/novastand-pro.jpg";
import headset from "@/assets/nova-headset.jpg";
import deskMat from "@/assets/desk-mat.jpg";
import keycaps from "@/assets/keycaps.jpg";
import heroSetup from "@/assets/hero-setup.jpg";

export type Category = "Keyboards" | "Accessories" | "Audio" | "Desk Setup";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  brand: string;
  category: Category;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  images: string[];
  options?: { label: string; values: string[] };
  specs: { title: string; detail: string }[];
};

export const products: Product[] = [
  {
    id: "novakeys-k1",
    name: "NovaKeys K1 Mechanical Keyboard",
    tagline: "Compact mechanical keyboard",
    brand: "NOVAKEYS",
    category: "Keyboards",
    price: 29.9,
    rating: 4.8,
    reviews: 354,
    description:
      "A modern mechanical keyboard designed for comfortable typing, coding, and everyday productivity. Precision engineered for a tactile, satisfying keystroke in a minimalist chassis.",
    images: [novakeys, keycaps, heroSetup, deskMat],
    options: { label: "Switch Type", values: ["Tactile (Brown)", "Linear (Red)", "Clicky (Blue)"] },
    specs: [
      {
        title: "Mechanical Switches",
        detail:
          "Hot-swappable tactile, linear, or clicky options rated for 50M keystrokes.",
      },
      {
        title: "Dynamic Backlighting",
        detail: "Per-key bright white LED backlighting with 5 custom brightness levels.",
      },
      {
        title: "Wireless & Wired",
        detail: "Bluetooth 5.1 connection up to 3 devices or low-latency USB-C wired mode.",
      },
      {
        title: "Extended Battery Life",
        detail: "Up to 72 hours of continuous typing with backlighting enabled.",
      },
    ],
  },
  {
    id: "novaflow-mouse",
    name: "NovaFlow Mouse",
    tagline: "Ergonomic wireless precision",
    brand: "NOVAFLOW",
    category: "Accessories",
    price: 14.9,
    rating: 4.6,
    reviews: 182,
    description:
      "A lightweight ergonomic wireless mouse with a silent click mechanism and a sensor tuned for pixel-accurate work on any surface.",
    images: [novaflow, deskMat, heroSetup],
    options: { label: "Color", values: ["Arctic White", "Matte Black"] },
    specs: [
      { title: "26,000 DPI Sensor", detail: "Adjustable in 50 DPI steps for precise control." },
      { title: "Silent Switches", detail: "Rated for 20M quiet clicks." },
      { title: "Dual Connectivity", detail: "2.4GHz dongle or Bluetooth pairing." },
      { title: "Battery", detail: "Up to 90 days per charge with USB-C fast charging." },
    ],
  },
  {
    id: "novastand-pro",
    name: "NovaStand Pro",
    tagline: "Adjustable aluminium stand",
    brand: "NOVASTAND",
    category: "Desk Setup",
    price: 12.9,
    rating: 4.7,
    reviews: 97,
    description:
      "A machined aluminium laptop stand that lifts your screen to eye level, improves posture, and keeps airflow moving around your machine.",
    images: [novastand, heroSetup, deskMat],
    specs: [
      { title: "Aircraft Aluminium", detail: "Anodised body supports up to 8kg securely." },
      { title: "Adjustable Height", detail: "Six locking positions from 12cm to 26cm." },
      { title: "Silicone Padding", detail: "Protects your laptop from scratches and slipping." },
      { title: "Foldable", detail: "Collapses flat for travel in seconds." },
    ],
  },
  {
    id: "novasound-pro-headset",
    name: "NovaSound Pro Headset",
    tagline: "Active noise cancelling audio",
    brand: "NOVASOUND",
    category: "Audio",
    price: 39.9,
    rating: 4.9,
    reviews: 421,
    description:
      "Studio-tuned 40mm drivers with hybrid active noise cancelling, memory foam earcups, and a detachable boom microphone for calls.",
    images: [headset, heroSetup, deskMat],
    options: { label: "Color", values: ["Midnight Black", "Stone Grey"] },
    specs: [
      { title: "Hybrid ANC", detail: "Up to 38dB of ambient noise reduction." },
      { title: "40mm Drivers", detail: "Balanced tuning for music, calls, and gaming." },
      { title: "Multipoint", detail: "Connect to two devices simultaneously." },
      { title: "Battery", detail: "45 hours of playback, 5 hours from a 10 minute charge." },
    ],
  },
  {
    id: "pro-desk-mat-extended",
    name: "Pro Desk Mat Extended",
    tagline: "Extended felt work surface",
    brand: "NOVADESK",
    category: "Desk Setup",
    price: 8.9,
    rating: 4.5,
    reviews: 143,
    description:
      "An extended felt desk mat with a low-friction weave and stitched edges, giving your keyboard and mouse one continuous premium surface.",
    images: [deskMat, heroSetup, novaflow],
    options: { label: "Size", values: ["900 x 400mm", "1200 x 600mm"] },
    specs: [
      { title: "Water Resistant", detail: "Coated felt surface wipes clean instantly." },
      { title: "Anti-Slip Base", detail: "Natural rubber backing stays put during use." },
      { title: "Stitched Edges", detail: "Reinforced perimeter prevents fraying." },
      { title: "Lays Flat", detail: "Ships rolled and settles flat within hours." },
    ],
  },
  {
    id: "pbt-keycap-set-glacier",
    name: "PBT Keycap Set - Glacier",
    tagline: "Dye-sub PBT keycaps",
    brand: "NOVAKEYS",
    category: "Keyboards",
    price: 14.9,
    rating: 4.7,
    reviews: 88,
    description:
      "A 138-key dye-sublimated PBT keycap set in a soft glacier palette, built to resist shine and keep legends crisp for years.",
    images: [keycaps, novakeys, heroSetup],
    options: { label: "Profile", values: ["Cherry", "OEM"] },
    specs: [
      { title: "PBT Material", detail: "1.5mm thick doubleshot-grade PBT plastic." },
      { title: "138 Keys", detail: "Covers 60%, 65%, 75%, TKL and full-size layouts." },
      { title: "Dye-Sublimated", detail: "Legends will not fade or wear off." },
      { title: "Cherry Compatible", detail: "Fits all standard MX-style stems." },
    ],
  },
];

export const categories = ["All", "Keyboards", "Accessories", "Audio", "Desk Setup"] as const;

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const formatKD = (value: number) =>
  `${value.toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} KD`;

export { heroSetup };
