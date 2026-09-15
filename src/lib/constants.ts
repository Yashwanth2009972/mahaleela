export const BRAND = {
  name: "MAHALEELA",
  fullName: "MAHALEELA",
  tagline: "WHERE STYLE BECOMES EXPRESSION",
  address: "2ACROSS MARUTI NAGAR, CHIKKABANAVARA, BENGALURU 560090, INDIA",
  phone: "8892919723",
  email: "concierge@mahaleela.com",
  socials: {
    instagram: "https://www.instagram.com/mahaleelafashion?stkn=MTUwMXZoemU1aDVrZg==",
    facebook: "https://www.facebook.com/share/19WYAmRggi/",
    youtube: "https://youtube.com/@mahaleelafashion?si=VNvR9rG1nVfsujnn",
  },
  shipping: {
    codFee: 10,
    notice: "PLUS DELIVERY CHARGES ACCORDING TO LOCATION (CONFIRMED ON WHATSAPP)",
  },
  colors: {
    white: "#000000",
    cream: "#1E1E1E",
    charcoal: "#1E1E1E",
    gold: "#C9A45C",
  },
} as const;

export const PREDEFINED_CATEGORIES = [
  { name: "T SHIRTS", slug: "t-shirts" },
  { name: "SHIRTS", slug: "shirts" },
  { name: "SWEATSHIRTS", slug: "sweatshirts" },
  { name: "HOODIES", slug: "hoodies" },
  { name: "MUGS", slug: "mugs" },
  { name: "HEADCAPS", slug: "headcaps" },
  { name: "KEYCHAINS", slug: "keychains" },
  { name: "SUNGLASSES", slug: "sunglasses" },
  { name: "WATCHES", slug: "watches" },
  { name: "MOBILE COVERS", slug: "mobile-covers" },
  { name: "PHOTO FRAMES", slug: "photo-frames" },
  { name: "WALLETS", slug: "wallets" },
] as const;

export const ORDER_STATUSES = [
  "PENDING_ACCEPTANCE",
  "ACCEPTED",
  "REJECTED",
  "ORDER RECEIVED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT FOR DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURN REQUESTED",
  "RETURNED",
] as const;
