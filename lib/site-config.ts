// Central place for site-wide info. Change here → reflects everywhere.
export const siteConfig = {
  name: "SRI SRI NIKHIL UTKAL SAIBA PANCHAL VISWA BRAHMIN SAMAJ",
  shortName: "SPVBS",
  domain: "SPVBS.in",
  tagline: "Ek Samaj, Ek Parivaar",
  description:
    "The official platform of our samaj — connecting families, committees, and community across all talukas.",

  // Main navigation (public). Items with `children` render as a dropdown.
  nav: [
    { label: "Home", href: "/" },
    { label: "Members", href: "/members" },
    { label: "Committee", href: "/committee" },
    { label: "Events", href: "/events" },
    {
      label: "Permission",
      href: "/permission",
      children: [
        { label: "Marriage & Negotiation", href: "/permission/marriage" },
        { label: "Membership", href: "/register" },
        { label: "Others", href: "/permission/others" },
      ],
    },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],

  // Quick stats shown on homepage (later these will be pulled from the database)
  stats: [
    { value: "40+", label: "Registered Families" },
    { value: "150+", label: "Community Members" },
    { value: "1", label: "Taluka United" },
  ],

  contact: {
    email: "info@spvbs.com",
    phones: ["7008341570", "9937915203", "8093770857"],
    address: "Laxmi Bazaar, Aska, Odisha",
    tagline: "Carrying forward the divine legacy of Lord Vishwakarma's five sons, we embody a rich heritage of creation rooted in the Vedas. United under the philosophy of \"Vasudhaiva Kutumbakam.\"",
    socials: {
      facebook: "",
      twitter: "",
      youtube: "",
      instagram: "",
    },
  },
};

// Official taluka list for the samaj (used in dropdowns/filters everywhere)
export const TALUKAS = [
  "Aska",
  "Athagada",
  "Badagada",
  "Badakhemundi",
  "Banapur",
  "Birudi",
  "Chikiti",
  "Dharakote",
  "Ghumusara",
  "Khalasha",
  "Khalikote",
  "Nayagarh",
  "Purbakhanda",
  "Sanakhemundi",
  "Saroda",
  "Seragada",
];
