/**
 * VÉLANE ATELIER - Product Catalog Dataset
 * High-resolution curated apparel with full variant matrices (colors, sizes, inventory)
 */

export const PRODUCTS = [
  {
    id: "prod-001",
    name: "Architectural Wool Trench Coat",
    slug: "architectural-wool-trench-coat",
    brand: "VÉLANE ATELIER",
    category: "outerwear",
    gender: "unisex",
    price: 11999,
    originalPrice: 14500,
    badge: "Bestseller",
    rating: 4.9,
    reviewsCount: 128,
    description: "Tailored from double-faced Australian Merino wool with an oversized notched lapel, storm flap detailing, and an adjustable belted waist. Designed for effortless drape across all seasons.",
    details: [
      "100% Traceable Merino Wool (580 GSM)",
      "Double-breasted horn button closure",
      "Raglan sleeves for natural shoulder contouring",
      "Deep welt hand-warmer pockets & interior passport pocket",
      "Water-repellent nanotech finish"
    ],
    fabricCare: [
      "Specialist dry clean only",
      "Store on contoured wooden hanger",
      "Steam gently to release transit creases"
    ],
    colors: [
      {
        name: "Camel Tan",
        hex: "#c39e76",
        images: [
          "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Obsidian Black",
        hex: "#1a1a1a",
        images: [
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Sage Slate",
        hex: "#78866b",
        images: [
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80"
        ]
      }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inventory: {
      "Camel Tan-XS": 3,
      "Camel Tan-S": 7,
      "Camel Tan-M": 2, // low stock test
      "Camel Tan-L": 9,
      "Camel Tan-XL": 4,
      "Obsidian Black-XS": 5,
      "Obsidian Black-S": 8,
      "Obsidian Black-M": 6,
      "Obsidian Black-L": 3,
      "Obsidian Black-XL": 2,
      "Sage Slate-XS": 2,
      "Sage Slate-S": 4,
      "Sage Slate-M": 5,
      "Sage Slate-L": 1,
      "Sage Slate-XL": 0
    },
    isNewArrival: false,
    isFeatured: true
  },
  {
    id: "prod-002",
    name: "Heavyweight Boxy Hoodie",
    slug: "heavyweight-boxy-hoodie",
    brand: "STUDIO NINE",
    category: "streetwear",
    gender: "unisex",
    price: 3499,
    originalPrice: 4200,
    badge: "Trending",
    rating: 4.8,
    reviewsCount: 94,
    description: "Constructed from custom-developed 480 GSM French Terry loopback cotton. Cut with dropped shoulders, a structured double-layer hood without drawstrings, and a boxy contemporary crop.",
    details: [
      "100% Organic Combed Ring-Spun Cotton (480 GSM)",
      "Double-needle flatlock seam construction",
      "Hidden kangaroo side-seam pockets",
      "Pre-shrunk to retain structural silhouette"
    ],
    fabricCare: [
      "Machine wash cold inside out with like colors",
      "Hang dry in shade to preserve color intensity",
      "Do not tumble dry"
    ],
    colors: [
      {
        name: "Vintage Ash Grey",
        hex: "#8c8e90",
        images: [
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Pitch Black",
        hex: "#111111",
        images: [
          "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Washed Cocoa",
        hex: "#5c4033",
        images: [
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inventory: {
      "Vintage Ash Grey-S": 6,
      "Vintage Ash Grey-M": 12,
      "Vintage Ash Grey-L": 8,
      "Vintage Ash Grey-XL": 4,
      "Vintage Ash Grey-XXL": 2,
      "Pitch Black-S": 10,
      "Pitch Black-M": 14,
      "Pitch Black-L": 7,
      "Pitch Black-XL": 5,
      "Pitch Black-XXL": 3,
      "Washed Cocoa-S": 4,
      "Washed Cocoa-M": 5,
      "Washed Cocoa-L": 3,
      "Washed Cocoa-XL": 1,
      "Washed Cocoa-XXL": 0
    },
    isNewArrival: true,
    isFeatured: true
  },
  {
    id: "prod-003",
    name: "Pleated Relaxed Trouser",
    slug: "pleated-relaxed-trouser",
    brand: "VÉLANE ATELIER",
    category: "tailoring",
    gender: "men",
    price: 4999,
    originalPrice: null,
    badge: "New Season",
    rating: 4.7,
    reviewsCount: 62,
    description: "Modernized sartorial tailoring featuring deep forward twin pleats, a wide fluid drape through the leg, and internal waistband gripper tape for a locked-in shirt tuck.",
    details: [
      "68% Tropical Wool, 29% Recycled Poly, 3% Elastane stretch",
      "Twin forward pleats with full break hem",
      "Concealed hook-and-bar with zip fly",
      "Rear welt pockets with horn buttons"
    ],
    fabricCare: [
      "Dry clean or cold hand wash",
      "Medium iron with pressing cloth"
    ],
    colors: [
      {
        name: "Charcoal Heather",
        hex: "#3a3d40",
        images: [
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Oatmeal Beige",
        hex: "#d5cabb",
        images: [
          "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    inventory: {
      "Charcoal Heather-S": 5,
      "Charcoal Heather-M": 7,
      "Charcoal Heather-L": 6,
      "Charcoal Heather-XL": 2,
      "Oatmeal Beige-S": 4,
      "Oatmeal Beige-M": 8,
      "Oatmeal Beige-L": 3,
      "Oatmeal Beige-XL": 1
    },
    isNewArrival: true,
    isFeatured: false
  },
  {
    id: "prod-004",
    name: "Silk-Blend Bias Cut Midi Dress",
    slug: "silk-blend-bias-cut-midi-dress",
    brand: "ÉTOILE NOUVELLE",
    category: "dresses",
    gender: "women",
    price: 6999,
    originalPrice: 8400,
    badge: "Limited Edition",
    rating: 4.9,
    reviewsCount: 88,
    description: "Gracefully skimming the silhouette, this liquid silk-blend slip dress is cut on the true bias for fluidity. Styled with dainty adjustable rouleau straps and a soft cowl neckline.",
    details: [
      "70% Mulberry Silk, 30% EcoVero Viscose",
      "True bias cut contours without clinging",
      "French-seamed interior finishes",
      "Adjustable micro-straps with gold metal sliders"
    ],
    fabricCare: [
      "Delicate hand wash cold with silk detergent or dry clean",
      "Do not wring; lay flat on towel to dry",
      "Steam on low setting"
    ],
    colors: [
      {
        name: "Champagne Gold",
        hex: "#e5c07b",
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Midnight Emerald",
        hex: "#1d3b32",
        images: [
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Noir Onyx",
        hex: "#151515",
        images: [
          "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1000&q=80"
        ]
      }
    ],
    sizes: ["XS", "S", "M", "L"],
    inventory: {
      "Champagne Gold-XS": 2,
      "Champagne Gold-S": 6,
      "Champagne Gold-M": 3,
      "Champagne Gold-L": 1,
      "Midnight Emerald-XS": 4,
      "Midnight Emerald-S": 5,
      "Midnight Emerald-M": 2,
      "Midnight Emerald-L": 0,
      "Noir Onyx-XS": 3,
      "Noir Onyx-S": 7,
      "Noir Onyx-M": 6,
      "Noir Onyx-L": 2
    },
    isNewArrival: false,
    isFeatured: true
  },
  {
    id: "prod-005",
    name: "Merino Ribbed Mockneck Sweater",
    slug: "merino-ribbed-mockneck-sweater",
    brand: "VÉLANE ATELIER",
    category: "knitwear",
    gender: "unisex",
    price: 4499,
    originalPrice: 5200,
    badge: "Essential",
    rating: 4.8,
    reviewsCount: 110,
    description: "An architectural winter staple spun with ultra-fine 19.5 micron merino wool in a substantial 7-gauge fisherman rib. Engineered collar retains structure wear after wear.",
    details: [
      "100% Extra-Fine Australian Merino Wool",
      "Seamless 3D knit technology eliminates bulky side seams",
      "Subtle saddle shoulder detailing",
      "Non-itch hypoallergenic hand feel"
    ],
    fabricCare: [
      "Hand wash cold with wool wash",
      "Do not hang when wet; dry flat",
      "Pilling comb safe"
    ],
    colors: [
      {
        name: "Cream Ivory",
        hex: "#ece7de",
        images: [
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Forest Pine",
        hex: "#263e32",
        images: [
          "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Burnt Ochre",
        hex: "#a6522c",
        images: [
          "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=1000&q=80"
        ]
      }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inventory: {
      "Cream Ivory-XS": 4,
      "Cream Ivory-S": 9,
      "Cream Ivory-M": 8,
      "Cream Ivory-L": 5,
      "Cream Ivory-XL": 3,
      "Forest Pine-XS": 2,
      "Forest Pine-S": 4,
      "Forest Pine-M": 3,
      "Forest Pine-L": 2,
      "Forest Pine-XL": 1,
      "Burnt Ochre-XS": 3,
      "Burnt Ochre-S": 6,
      "Burnt Ochre-M": 4,
      "Burnt Ochre-L": 2,
      "Burnt Ochre-XL": 0
    },
    isNewArrival: false,
    isFeatured: true
  },
  {
    id: "prod-006",
    name: "Structured Minimalist Leather Tote",
    slug: "structured-minimalist-leather-tote",
    brand: "ATELIER ACCESSORIES",
    category: "accessories",
    gender: "unisex",
    price: 7499,
    originalPrice: 8999,
    badge: "Staff Pick",
    rating: 5.0,
    reviewsCount: 76,
    description: "Sculpted from vegetable-tanned Italian leather with hand-painted beveled edges. Sized to effortlessly hold a 15-inch laptop, water bottle, and daily essentials with magnetic closure.",
    details: [
      "100% Full-Grain Tuscan Vegetable-Tanned Leather",
      "Microfiber suede interior lining with zip pocket and key leash",
      "Sturdy 26cm handle drop for comfortable shoulder carry",
      "Brass protective feet on base"
    ],
    fabricCare: [
      "Condition with organic leather balm twice annually",
      "Store in provided organic cotton dust bag"
    ],
    colors: [
      {
        name: "Espresso Brown",
        hex: "#3d2817",
        images: [
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Matte Black",
        hex: "#1b1b1b",
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80"
        ]
      }
    ],
    sizes: ["One Size"],
    inventory: {
      "Espresso Brown-One Size": 5,
      "Matte Black-One Size": 8
    },
    isNewArrival: true,
    isFeatured: true
  },
  {
    id: "prod-007",
    name: "Raw Selvedge Denim Jacket",
    slug: "raw-selvedge-denim-jacket",
    brand: "STUDIO NINE",
    category: "outerwear",
    gender: "men",
    price: 5999,
    originalPrice: 6999,
    badge: "Crafted in Japan",
    rating: 4.8,
    reviewsCount: 53,
    description: "Milled on vintage shuttle looms using long-staple cotton in Okayama. This 14.5oz raw indigo jacket develops unique personalized fading and creases unique to your lifestyle over time.",
    details: [
      "14.5oz Japanese Selvedge Cotton Denim",
      "Red-line selvedge visible on interior placket",
      "Custom anti-rust copper shank buttons",
      "Sanforized to minimize shrink after first soak"
    ],
    fabricCare: [
      "Wear 6 months before initial wash for highest fade contrast",
      "Submerge in cold water inside out; drip dry"
    ],
    colors: [
      {
        name: "Deep Indigo",
        hex: "#1a2a44",
        images: [
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Washed Stonewash",
        hex: "#5d769c",
        images: [
          "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?auto=format&fit=crop&w=1000&q=80"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    inventory: {
      "Deep Indigo-S": 3,
      "Deep Indigo-M": 7,
      "Deep Indigo-L": 4,
      "Deep Indigo-XL": 2,
      "Washed Stonewash-S": 2,
      "Washed Stonewash-M": 5,
      "Washed Stonewash-L": 3,
      "Washed Stonewash-XL": 1
    },
    isNewArrival: false,
    isFeatured: false
  },
  {
    id: "prod-008",
    name: "Resort Open-Collar Linen Shirt",
    slug: "resort-open-collar-linen-shirt",
    brand: "VÉLANE ATELIER",
    category: "tailoring",
    gender: "unisex",
    price: 2999,
    originalPrice: null,
    badge: "Breathable",
    rating: 4.9,
    reviewsCount: 82,
    description: "Spun from 100% Normandy flax linen. Features a relaxed camp collar, side vents for ease of movement, and genuine mother-of-pearl buttons. Naturally temperature regulating.",
    details: [
      "100% Certified Normandy Flax Linen",
      "Garment-washed for instantaneous super-soft texture",
      "Cuban camp collar with loop top closure",
      "Straight boxy hem designed to be worn untucked"
    ],
    fabricCare: [
      "Gentle machine wash cold",
      "Hang dry; embrace the natural linen texture or press damp"
    ],
    colors: [
      {
        name: "Alabaster White",
        hex: "#f4f3ef",
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Terracotta Earth",
        hex: "#b85d43",
        images: [
          "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80"
        ]
      },
      {
        name: "Sky Mist",
        hex: "#8ea4b8",
        images: [
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
        ]
      }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inventory: {
      "Alabaster White-XS": 4,
      "Alabaster White-S": 9,
      "Alabaster White-M": 11,
      "Alabaster White-L": 6,
      "Alabaster White-XL": 3,
      "Terracotta Earth-XS": 2,
      "Terracotta Earth-S": 5,
      "Terracotta Earth-M": 4,
      "Terracotta Earth-L": 2,
      "Terracotta Earth-XL": 1,
      "Sky Mist-XS": 3,
      "Sky Mist-S": 6,
      "Sky Mist-M": 5,
      "Sky Mist-L": 3,
      "Sky Mist-XL": 2
    },
    isNewArrival: true,
    isFeatured: true
  }
];

export const CATEGORIES = [
  { id: "all", label: "All Collections", icon: "sparkles" },
  { id: "outerwear", label: "Coats & Jackets", icon: "shield" },
  { id: "knitwear", label: "Sweaters & Knits", icon: "sun" },
  { id: "streetwear", label: "Streetwear & Hoodies", icon: "zap" },
  { id: "tailoring", label: "Tailoring & Shirts", icon: "scissors" },
  { id: "dresses", label: "Dresses & Sets", icon: "heart" },
  { id: "accessories", label: "Bags & Leather", icon: "briefcase" }
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const PROMO_CODES = {
  "WELCOME15": { discountPercent: 15, description: "15% off first order" },
  "STYLE20": { discountPercent: 20, description: "20% VIP seasonal discount" },
  "FREESHIP": { freeShipping: true, description: "Complimentary worldwide shipping" }
};

export const SIZE_CHART = {
  women: [
    { size: "XS", bust: "31-32 in", waist: "24-25 in", hips: "34-35 in" },
    { size: "S", bust: "33-34 in", waist: "26-27 in", hips: "36-37 in" },
    { size: "M", bust: "35-36 in", waist: "28-29 in", hips: "38-39 in" },
    { size: "L", bust: "37-39 in", waist: "30-32 in", hips: "40-42 in" },
    { size: "XL", bust: "40-42 in", waist: "33-35 in", hips: "43-45 in" }
  ],
  men: [
    { size: "S", chest: "36-38 in", waist: "29-31 in", neck: "14-14.5 in" },
    { size: "M", chest: "39-41 in", waist: "32-34 in", neck: "15-15.5 in" },
    { size: "L", chest: "42-44 in", waist: "35-37 in", neck: "16-16.5 in" },
    { size: "XL", chest: "45-47 in", waist: "38-40 in", neck: "17-17.5 in" },
    { size: "XXL", chest: "48-50 in", waist: "41-43 in", neck: "18-18.5 in" }
  ]
};
