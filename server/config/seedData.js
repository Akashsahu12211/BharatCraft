const Product = require("../models/Product");

const defaultProducts = [
  {
    name: "Blue Pottery Vase",
    price: 3200,
    category: "Pottery",
    artisan: "Meera Sethi",
    location: "Jaipur",
    image: "assets/images/blue-pottery.svg",
    description:
      "Wheel-thrown and hand-painted with floral geometry, this Jaipur blue pottery piece pairs traditional glazing with contemporary silhouette.",
    popularity: 98,
    launchedAt: "2026-03-10"
  },
  {
    name: "Pashmina Stole",
    price: 5400,
    category: "Textiles",
    artisan: "Tariq Lone",
    location: "Srinagar",
    image: "assets/images/pashmina.svg",
    description:
      "A soft handwoven pashmina stole in muted sand tones, finished with delicate fringe and subtle tonal blockwork.",
    popularity: 95,
    launchedAt: "2026-02-14"
  },
  {
    name: "Brass Temple Lamp",
    price: 4100,
    category: "Metalwork",
    artisan: "Anita Nair",
    location: "Kochi",
    image: "assets/images/brass-lamp.svg",
    description:
      "Cast in polished brass with balanced proportions, this lamp draws from temple forms while fitting modern interiors.",
    popularity: 93,
    launchedAt: "2026-03-22"
  },
  {
    name: "Handloom Durrie Rug",
    price: 6800,
    category: "Textiles",
    artisan: "Raghav Chouhan",
    location: "Jodhpur",
    image: "assets/images/durrie-rug.svg",
    description:
      "Flat-woven cotton durrie featuring contemporary stripe rhythm inspired by Rajasthan desert motifs.",
    popularity: 90,
    launchedAt: "2026-01-30"
  },
  {
    name: "Terracotta Urn",
    price: 2800,
    category: "Home Decor",
    artisan: "Sushmita Pal",
    location: "Kolkata",
    image: "assets/images/terracotta-vase.svg",
    description:
      "A burnished terracotta urn with an earthy finish, ideal for dried arrangements and statement console styling.",
    popularity: 92,
    launchedAt: "2026-02-05"
  },
  {
    name: "Bamboo Utility Basket",
    price: 1900,
    category: "Home Decor",
    artisan: "Keren Ao",
    location: "Kohima",
    image: "assets/images/bamboo-basket.svg",
    description:
      "Handwoven from treated bamboo strips, this basket combines lightweight durability with a clean modern profile.",
    popularity: 88,
    launchedAt: "2026-03-08"
  },
  {
    name: "Indigo Serve Bowl",
    price: 2400,
    category: "Pottery",
    artisan: "Meera Sethi",
    location: "Jaipur",
    image: "assets/images/blue-pottery.svg",
    description: "Hand-glazed serving bowl for table styling and festive hosting.",
    popularity: 89,
    launchedAt: "2026-03-29"
  },
  {
    name: "Kani Pattern Shawl",
    price: 6200,
    category: "Textiles",
    artisan: "Tariq Lone",
    location: "Srinagar",
    image: "assets/images/pashmina.svg",
    description: "Fine weave shawl inspired by Kashmiri kani motifs and winter palettes.",
    popularity: 94,
    launchedAt: "2026-03-16"
  },
  {
    name: "Brass Deepam Set",
    price: 3500,
    category: "Metalwork",
    artisan: "Anita Nair",
    location: "Kochi",
    image: "assets/images/brass-lamp.svg",
    description: "Set of two brass lamps ideal for pooja corners and premium gifting.",
    popularity: 86,
    launchedAt: "2026-02-26"
  },
  {
    name: "Desert Weave Runner",
    price: 4700,
    category: "Textiles",
    artisan: "Raghav Chouhan",
    location: "Jodhpur",
    image: "assets/images/durrie-rug.svg",
    description: "A long woven runner with muted geometric rhythm and earthy tones.",
    popularity: 84,
    launchedAt: "2026-03-01"
  },
  {
    name: "Clay Aroma Diffuser",
    price: 1600,
    category: "Home Decor",
    artisan: "Sushmita Pal",
    location: "Kolkata",
    image: "assets/images/terracotta-vase.svg",
    description: "Minimal terracotta diffuser hand-burnished for soft interior accents.",
    popularity: 83,
    launchedAt: "2026-02-09"
  },
  {
    name: "Bamboo Planter Sleeve",
    price: 1300,
    category: "Home Decor",
    artisan: "Keren Ao",
    location: "Kohima",
    image: "assets/images/bamboo-basket.svg",
    description: "Textured bamboo wrap that upgrades indoor planters instantly.",
    popularity: 82,
    launchedAt: "2026-03-24"
  },
  {
    name: "Temple Bell Charm",
    price: 2800,
    category: "Jewelry",
    artisan: "Anita Nair",
    location: "Kochi",
    image: "assets/images/brass-lamp.svg",
    description: "Hand-cast pendant inspired by temple bell forms and sacred geometry.",
    popularity: 87,
    launchedAt: "2026-03-27"
  },
  {
    name: "Miniature Folk Painting",
    price: 2100,
    category: "Painting",
    artisan: "Sushmita Pal",
    location: "Kolkata",
    image: "assets/images/terracotta-vase.svg",
    description: "Small-format framed folk artwork for gallery walls and desks.",
    popularity: 80,
    launchedAt: "2026-02-18"
  },
  {
    name: "Blockprint Table Mats",
    price: 1750,
    category: "Textiles",
    artisan: "Raghav Chouhan",
    location: "Jodhpur",
    image: "assets/images/durrie-rug.svg",
    description: "Set of four blockprint mats with heat-resistant woven backing.",
    popularity: 91,
    launchedAt: "2026-03-31"
  },
  {
    name: "Ceramic Spice Canister",
    price: 2300,
    category: "Pottery",
    artisan: "Meera Sethi",
    location: "Jaipur",
    image: "assets/images/blue-pottery.svg",
    description: "Kitchen-safe ceramic jar with hand-painted lid and airtight fit.",
    popularity: 85,
    launchedAt: "2026-03-11"
  },
  {
    name: "Woven Wall Tray",
    price: 2600,
    category: "Home Decor",
    artisan: "Keren Ao",
    location: "Kohima",
    image: "assets/images/bamboo-basket.svg",
    description: "Decorative wall tray woven in concentric pattern with natural bamboo.",
    popularity: 81,
    launchedAt: "2026-01-28"
  },
  {
    name: "Loom Stripe Throw",
    price: 3900,
    category: "Textiles",
    artisan: "Tariq Lone",
    location: "Srinagar",
    image: "assets/images/pashmina.svg",
    description: "Soft throw blanket with loom-woven stripe structure and luxe hand feel.",
    popularity: 79,
    launchedAt: "2026-02-11"
  }
];

const ensureSeedData = async () => {
  const productCount = await Product.countDocuments();

  if (productCount > 0) {
    return;
  }

  await Product.insertMany(defaultProducts);
};

module.exports = ensureSeedData;
