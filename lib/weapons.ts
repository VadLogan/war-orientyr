// Ukrainian long-range weapons and their published nominal ranges (km) — the "reach" of the potential targets layer on /strikes.
// Ranges are technical, rounded public figures; `limited` = partner-supplied, use on russian territory restricted by the supplier.
export type WeaponGroup = "drone" | "md" | "msl" | "partner";
/** `img`: a 640 px copy of a free-licensed Wikimedia Commons photo at /weapons/<id>.jpg; `url` = its Commons page (credit link). */
export type WeaponImg = { by: string; lic: string; url: string };
export type Weapon = { id: string; g: WeaponGroup; r: number; uk: string; en: string; limited?: boolean; img?: WeaponImg };
const cm = (f: string) => "https://commons.wikimedia.org/wiki/File:" + f;

export const WEAPONS: Weapon[] = [
  { id: "fpv", g: "drone", r: 25, uk: "FPV і бомбери", en: "FPV & bomber drones" },
  { id: "mid", g: "drone", r: 120, uk: "Ударні дрони середньої дальності", en: "Mid-range strike drones" },
  { id: "liutyi", g: "drone", r: 1000, uk: "«Лютий»", en: "Liutyi",
    img: { by: "Krzysztof Popławski", lic: "CC BY 4.0", url: cm("Ukrainian_Liutyi_long-range_strike_drone_at_MSPO_2026_in_Kielce.jpg") } },
  { id: "fp1", g: "drone", r: 1600, uk: "FP-1", en: "FP-1",
    img: { by: "Krzysztof Popławski", lic: "CC BY 4.0", url: cm("Fire_Point_FP-1_unmanned_aerial_vehicle_at_MSPO_2026_in_Kielce,_Poland.jpg") } },
  { id: "palianytsia", g: "md", r: 650, uk: "«Паляниця»", en: "Palianytsia" },
  { id: "peklo", g: "md", r: 700, uk: "«Пекло»", en: "Peklo",
    img: { by: "Ministry of Strategic Industries of Ukraine", lic: "CC BY 4.0", url: cm("Peklo_missile_drone_(2024).jpg") } },
  { id: "neptune", g: "msl", r: 280, uk: "«Нептун»", en: "Neptune",
    img: { by: "Office of the President of Ukraine", lic: "CC BY 4.0", url: cm("Neptune_cruise_missile_05.jpg") } },
  { id: "lneptune", g: "msl", r: 1000, uk: "«Довгий Нептун»", en: "Long Neptune" },
  { id: "flamingo", g: "msl", r: 3000, uk: "«Фламінго» FP-5", en: "Flamingo FP-5",
    img: { by: "Office of the President of Ukraine", lic: "CC BY 4.0", url: cm("Fp-5_flamingo_exhib.jpg") } },
  { id: "gmlrs", g: "partner", r: 84, uk: "HIMARS (GMLRS)", en: "HIMARS GMLRS", limited: true },
  { id: "storm", g: "partner", r: 250, uk: "Storm Shadow / SCALP", en: "Storm Shadow / SCALP", limited: true,
    img: { by: "Boevaya mashina", lic: "CC BY-SA 4.0", url: cm("Storm_Shadow_SCALP_Mockup_ILA_2018.jpg") } },
  { id: "atacms", g: "partner", r: 300, uk: "ATACMS", en: "ATACMS", limited: true,
    img: { by: "U.S. Army", lic: "public domain", url: cm("M57A1_Army_Tactical_Missile_System_missile.jpg") } },
];
export const WPN_GROUPS: WeaponGroup[] = ["drone", "md", "msl", "partner"];
export const wpnImg = (w: Weapon) => (w.img ? `/weapons/${w.id}.jpg` : null);
export const wpnName =(w: Weapon, lang: string) => (lang === "uk" ? w.uk : w.en);
/** Weapons whose range covers `km`, shortest first. */
export const reaching = (km: number) => WEAPONS.filter((w) => w.r >= km).sort((a, b) => a.r - b.r);
