// ============================================================
//  BHARATCRAFT – Database Seeder & Demo Data
// ============================================================

window.demoData = {
  artisans: [
    {
      id: 'a1',
      name: 'Rameshwar Jha',
      craftType: 'Madhubani Painting',
      bio: 'Rameshwar comes from a long lineage of traditional Mithila artists. He uses natural dyes extracted from flowers and leaves to create intricate, vibrant paintings that tell mythological stories. His work has been recognized globally for its authenticity.',
      location: { lat: 26.3495, lng: 86.0792, city: 'Madhubani', state: 'Bihar' },
      rating: 4.8,
      totalOrders: 342,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?u=rameshwar',
      coverImage: 'https://loremflickr.com/800/400/paint,art/all',
      establishedYear: 1985
    },
    {
      id: 'a2',
      name: 'Sunita Devi',
      craftType: 'Blue Pottery',
      bio: 'Sunita is a master of Jaipur blue pottery, a craft she learned from her grandfather. She expertly molds quartz stone powder to create stunning azure-colored ceramics. Her workshop supports ten women from her local village.',
      location: { lat: 26.9124, lng: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
      rating: 4.9,
      totalOrders: 512,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?u=sunita',
      coverImage: 'https://loremflickr.com/800/400/pottery,blue/all',
      establishedYear: 2002
    },
    {
      id: 'a3',
      name: 'Abdul Latif',
      craftType: 'Pashmina Weaving',
      bio: 'Hailing from the valleys of Kashmir, Abdul is a fourth-generation Pashmina weaver. He passionately creates incredibly soft and warm shawls using traditional handlooms. Every piece he makes is a labor of love taking weeks to complete.',
      location: { lat: 34.0837, lng: 74.7973, city: 'Srinagar', state: 'Jammu & Kashmir' },
      rating: 4.7,
      totalOrders: 189,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?u=abdul',
      coverImage: 'https://loremflickr.com/800/400/textile,kashmir/all',
      establishedYear: 1990
    },
    {
      id: 'a4',
      name: 'Jivya Soma',
      craftType: 'Warli Art',
      bio: 'Jivya is a celebrated Warli artist who preserves the tribal heritage of Maharashtra through his art. He uses a mixture of rice paste and water to paint delicate geometric patterns over mud walls and canvas. His art beautifully captures scenes of rural village life.',
      location: { lat: 19.9615, lng: 72.8096, city: 'Palghar', state: 'Maharashtra' },
      rating: 4.6,
      totalOrders: 275,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?u=jivya',
      coverImage: 'https://loremflickr.com/800/400/tribal,art/all',
      establishedYear: 1978
    },
    {
      id: 'a5',
      name: 'Kashinath Munda',
      craftType: 'Dhokra Casting',
      bio: 'Operating out of a small village in Chhattisgarh, Kashinath specializes in the ancient lost-wax casting technique. He crafts brass and bronze figurines that are as rustic as they are elegant. Each piece is entirely unique and deeply rooted in tribal folklore.',
      location: { lat: 19.0732, lng: 82.0302, city: 'Bastar', state: 'Chhattisgarh' },
      rating: 4.9,
      totalOrders: 420,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?u=kashinath',
      coverImage: 'https://loremflickr.com/800/400/bronze,sculpture/all',
      establishedYear: 2005
    },
    {
      id: 'a6',
      name: 'Syed Ali',
      craftType: 'Bidriware',
      bio: 'Syed Ali is an award-winning Bidriware artisan from Karnataka. He delicately inlays pure silver into blackened metal alloys to create breathtaking decorative objects. His dedication is keeping this 500-year-old Persian-influenced craft alive.',
      location: { lat: 17.9104, lng: 77.5199, city: 'Bidar', state: 'Karnataka' },
      rating: 4.8,
      totalOrders: 130,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?u=syed',
      coverImage: 'https://loremflickr.com/800/400/silver,metal/all',
      establishedYear: 2011
    },
    {
      id: 'a7',
      name: 'Anjali Biswas',
      craftType: 'Kantha Embroidery',
      bio: 'Anjali brings discarded fabrics back to life using the traditional Kantha running stitch. Based in West Bengal, she creates stunning sarees and quilts filled with vibrant floral motifs. She leads a cooperative of 25 women weavers.',
      location: { lat: 23.6335, lng: 87.6750, city: 'Bolpur', state: 'West Bengal' },
      rating: 4.9,
      totalOrders: 650,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?u=anjali',
      coverImage: 'https://loremflickr.com/800/400/embroidery,fabric/all',
      establishedYear: 2015
    },
    {
      id: 'a8',
      name: 'Ravi Gowda',
      craftType: 'Channapatna Toys',
      bio: 'Ravi is a master toy maker from the "Toy Town" of India. He crafts eco-friendly wooden toys using locally sourced ivory wood and safe vegetable dyes. His toys are safe, colorful, and beloved by children worldwide.',
      location: { lat: 12.6518, lng: 77.2089, city: 'Channapatna', state: 'Karnataka' },
      rating: 4.5,
      totalOrders: 890,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?u=ravi',
      coverImage: 'https://loremflickr.com/800/400/wood,toys/all',
      establishedYear: 1998
    }
  ],
  products: [
    {
      id: 'p1', artisanId: 'a1', artisanName: 'Rameshwar Jha', name: 'Peacock Tree of Life Painting', price: 4500, originalPrice: 5000, category: 'Painting', description: 'A detailed Madhubani painting showcasing peacocks on the mythological Tree of Life. Hand-painted on authentic handmade paper using natural dyes.', culturalStory: 'The Tree of Life is deeply revered in Mithila culture, representing harmony, growth, and eternity. Madhubani art has been passed down by women of the region for generations.', images: ['https://loremflickr.com/600/400/peacock,art/all', 'https://loremflickr.com/600/400/paint,brush/all'], rating: 4.9, reviewCount: 45, stock: 5, tags: ['art', 'madhubani', 'peacock', 'painting'], isFeatured: true, isHandmade: true, createdAt: new Date().getTime()
    },
    { id: 'p2', artisanId: 'a1', artisanName: 'Rameshwar Jha', name: 'Krishna Raas Leela Artwork', price: 7500, originalPrice: 8500, category: 'Painting', description: 'Vibrant depiction of Lord Krishna playing the flute amongst the Gopis. Created with intense attention to detail and traditional color palettes.', culturalStory: 'The Raas Leela is a classic theme in Indian mythology representing divine love. This style is unique to the artists of the Madhubani district.', images: ['https://loremflickr.com/600/400/mythology,art/all'], rating: 4.7, reviewCount: 12, stock: 2, tags: ['art', 'krishna', 'madhubani'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p3', artisanId: 'a1', artisanName: 'Rameshwar Jha', name: 'Fish Motif Coaster Set', price: 1200, originalPrice: 1500, category: 'Decor', description: 'Set of 6 wooden coasters hand-painted with Madhubani fish motifs and sealed with protective lacquer.', culturalStory: 'In Madhubani traditions, the fish symbolizes fertility, prosperity, and good luck. It is often painted during wedding ceremonies.', images: ['https://loremflickr.com/600/400/coaster,art/all'], rating: 4.8, reviewCount: 88, stock: 15, tags: ['coaster', 'decor', 'madhubani'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },

    { id: 'p4', artisanId: 'a2', artisanName: 'Sunita Devi', name: 'Royal Blue Quartz Vase', price: 2500, originalPrice: 3000, category: 'Pottery', description: 'Elegant and lightweight 10-inch vase featuring intricate floral motifs in striking Persian blue and bright yellow.', culturalStory: 'Blue Pottery originally came to Jaipur from Persia. It is unique globally because it is made from quartz stone powder, not clay.', images: ['https://loremflickr.com/600/400/vase,blue/all', 'https://loremflickr.com/600/400/pottery,floral/all'], rating: 4.9, reviewCount: 104, stock: 8, tags: ['pottery', 'vase', 'blue pottery', 'jaipur'], isFeatured: true, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p5', artisanId: 'a2', artisanName: 'Sunita Devi', name: 'Azure Decorative Plate', price: 1800, originalPrice: 2200, category: 'Decor', description: 'A stunning 8-inch wall plate painted with delicate birds and floral arrangements. Includes a wall mount at the back.', culturalStory: 'Turquoise and cobalt blue colors are achieved through copper and cobalt oxide. These colors reflect the distinct royal architectural style of Jaipur.', images: ['https://loremflickr.com/600/400/plate,decoration/all'], rating: 4.6, reviewCount: 42, stock: 20, tags: ['plate', 'decor', 'blue pottery'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p6', artisanId: 'a2', artisanName: 'Sunita Devi', name: 'Jaipur Blue Teacup Set', price: 3500, originalPrice: 4000, category: 'Pottery', description: 'Set of 4 beautiful teacups and saucers. Entirely hand-molded and fired at low temperatures for specific glazing.', culturalStory: 'Sipping tea from quartz pottery became a premium experience during the Rajput era, melding functionality with striking aesthetics.', images: ['https://loremflickr.com/600/400/teacup,blue/all'], rating: 4.8, reviewCount: 56, stock: 12, tags: ['teacup', 'dining', 'blue pottery'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },

    { id: 'p7', artisanId: 'a3', artisanName: 'Abdul Latif', name: 'Pure Handwoven Pashmina Shawl', price: 15000, originalPrice: 18000, category: 'Textiles', description: 'An authentic 100% pure Pashmina shawl in classic ivory. Woven incredibly fine, it provides immense warmth while being light enough to pass through a ring.', culturalStory: 'Pashmina wool comes from the Changthangi goat of the high Himalayas. The craft was historically patronized by emperors and royalty across the world.', images: ['https://loremflickr.com/600/400/shawl,ivory/all', 'https://loremflickr.com/600/400/kashmir,fabric/all'], rating: 5.0, reviewCount: 28, stock: 3, tags: ['pashmina', 'shawl', 'kashmir', 'wool'], isFeatured: true, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p8', artisanId: 'a3', artisanName: 'Abdul Latif', name: 'Kani Silk-Pashmina Stole', price: 8500, originalPrice: 10000, category: 'Textiles', description: 'A delicate blend of silk and Pashmina wool woven with vibrant Kani patterns along the borders. Perfect for both winter evenings and grand events.', culturalStory: 'The Kani weave uses small wooden sticks called "kanis" instead of shuttles. It is a highly meticulous and slow process native to the Kashmir valley.', images: ['https://loremflickr.com/600/400/stole,pattern/all'], rating: 4.7, reviewCount: 19, stock: 6, tags: ['stole', 'kani', 'pashmina', 'silk'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p9', artisanId: 'a3', artisanName: 'Abdul Latif', name: 'Kashmiri Aari Embroidered Scarf', price: 5500, originalPrice: 6500, category: 'Textiles', description: 'Soft woolen scarf featuring comprehensive Aari hook needle embroidery depicting Chinar leaves.', culturalStory: 'Aari embroidery uses a specialized hook to create fine, concentric chain stitches. The Chinar leaf motif represents the majestic beauty of Kashmir.', images: ['https://loremflickr.com/600/400/scarf,embroidery/all'], rating: 4.8, reviewCount: 65, stock: 10, tags: ['scarf', 'aari', 'embroidery', 'kashmir'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },

    { id: 'p10', artisanId: 'a4', artisanName: 'Jivya Soma', name: 'Warli Canvas - Village Harvest', price: 3200, originalPrice: 3800, category: 'Painting', description: 'A striking monochrome painting on earth-toned organic canvas, showcasing the lively Tarpa dance during harvest season.', culturalStory: 'Warli art uses simple geometric shapes—circles, triangles, and squares—to depict nature and village life. The circle represents the sun and moon, while the triangle comes from mountains.', images: ['https://loremflickr.com/600/400/warli,harvest/all', 'https://loremflickr.com/600/400/canvas,art/all'], rating: 4.9, reviewCount: 33, stock: 4, tags: ['warli', 'painting', 'tribal', 'canvas'], isFeatured: true, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p11', artisanId: 'a4', artisanName: 'Jivya Soma', name: 'Hand-painted Terracotta Pot', price: 900, originalPrice: 1200, category: 'Decor', description: 'Traditional baked clay pot beautifully adorned with white rice-paste Warli motifs on its exterior.', culturalStory: 'Traditionally, Warli paintings are drawn on the red mud walls of tribal homes in Maharashtra to invoke the blessings of the Mother Goddess.', images: ['https://loremflickr.com/600/400/terracotta,pot/all'], rating: 4.6, reviewCount: 88, stock: 25, tags: ['terracotta', 'pot', 'warli', 'decor'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p12', artisanId: 'a4', artisanName: 'Jivya Soma', name: 'Warli Wooden Tray', price: 1500, originalPrice: 1800, category: 'Decor', description: 'Sturdy wooden serving tray carrying intricate tribal artwork protected with a food-safe resin coating.', culturalStory: 'Applying tribal art to everyday utilitarian items bridges the gap between ancient ritualistic expressions and modern urban living.', images: ['https://loremflickr.com/600/400/tray,wood/all'], rating: 4.8, reviewCount: 42, stock: 15, tags: ['tray', 'wood', 'warli', 'serving'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },

    { id: 'p13', artisanId: 'a5', artisanName: 'Kashinath Munda', name: 'Dhokra Tribal Elephant', price: 5500, originalPrice: 6500, category: 'Metal', description: 'Solid brass casting of a royal elephant. Its surface features the intricate mesh-like textures characteristic of authentic Dhokra work.', culturalStory: 'Dhokra is a non-ferrous metal casting craft dating back 4000 years to the Indus Valley Civilization. Every single mould is used only once, making each piece entirely unique.', images: ['https://loremflickr.com/600/400/elephant,bronze/all', 'https://loremflickr.com/600/400/brass,statue/all'], rating: 4.9, reviewCount: 67, stock: 7, tags: ['dhokra', 'metal', 'elephant', 'statue'], isFeatured: true, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p14', artisanId: 'a5', artisanName: 'Kashinath Munda', name: 'Lost-Wax Horse Rider', price: 4200, originalPrice: 4800, category: 'Metal', description: 'Detailed figurine of a tribal warrior riding a horse, crafted entirely using beeswax strings and clay moulds.', culturalStory: 'The horse rider motif is incredibly popular in Bastar culture, often symbolizing local deities and heroic protector spirits.', images: ['https://loremflickr.com/600/400/horse,metal/all'], rating: 4.8, reviewCount: 22, stock: 5, tags: ['dhokra', 'horse', 'warrior', 'sculpture'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p15', artisanId: 'a5', artisanName: 'Kashinath Munda', name: 'Rustic Brass Urli', price: 6800, originalPrice: 7500, category: 'Decor', description: 'A wide brass Urli bowl with mesh detailing and tiny bells along the rim. Perfect for floating flowers and candles.', culturalStory: 'Urlis are traditional South Indian and tribal cookware implements that have beautifully transitioned into modern decorative art pieces.', images: ['https://loremflickr.com/600/400/urli,brass/all'], rating: 4.6, reviewCount: 18, stock: 3, tags: ['urli', 'brass', 'decor', 'dhokra'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },

    { id: 'p16', artisanId: 'a6', artisanName: 'Syed Ali', name: 'Silver Inlaid Bidri Vase', price: 8500, originalPrice: 9500, category: 'Metal', description: 'An elegant black zinc-copper alloy vase meticulously inlaid with pure silver wires forming creeping vine patterns.', culturalStory: 'Originating in Bidar, Karnataka, Bidriware is a testament to Indo-Islamic art. The stark black color is magically achieved using soil specific to the Bidar fort.', images: ['https://loremflickr.com/600/400/vase,silver/all', 'https://loremflickr.com/600/400/black,metal/all'], rating: 4.9, reviewCount: 41, stock: 4, tags: ['bidriware', 'vase', 'silver', 'metal'], isFeatured: true, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p17', artisanId: 'a6', artisanName: 'Syed Ali', name: 'Bidri Trinket Box', price: 3500, originalPrice: 4000, category: 'Decor', description: 'Small decorative box perfect for jewelry. The striking contrast of silver stars over deep matte black metal is truly captivating.', culturalStory: 'Craftsmen carve fine channels into the metal and carefully hammer silver wire into them before oxidizing the entire piece with special earth.', images: ['https://loremflickr.com/600/400/box,silver/all'], rating: 4.7, reviewCount: 89, stock: 10, tags: ['box', 'bidriware', 'decor', 'silver'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p18', artisanId: 'a6', artisanName: 'Syed Ali', name: 'Royal Elephant Paperweight', price: 2100, originalPrice: 2500, category: 'Metal', description: 'Solid metallic paperweight shaped like a royal elephant, draped in a silver-inlaid blanket design.', culturalStory: 'These pieces were historically patronized by the Bahmani sultans and traded widely across royal courts of the Deccan.', images: ['https://loremflickr.com/600/400/paperweight,black/all'], rating: 4.5, reviewCount: 112, stock: 15, tags: ['bidri', 'elephant', 'office', 'metal'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },

    { id: 'p19', artisanId: 'a7', artisanName: 'Anjali Biswas', name: 'Kantha Silk Saree', price: 9500, originalPrice: 11000, category: 'Textiles', description: 'Pure Tussar silk saree completely covered in exquisite Kantha hand-embroidery. Features traditional bird and floral motifs.', culturalStory: 'Kantha means "patched cloth" and originated as a way for rural women in Bengal to upcycle old cotton sarees into warm quilts with beautiful running stitches.', images: ['https://loremflickr.com/600/400/saree,kantha/all', 'https://loremflickr.com/600/400/embroidery,silk/all'], rating: 4.8, reviewCount: 29, stock: 5, tags: ['saree', 'kantha', 'silk', 'embroidery'], isFeatured: true, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p20', artisanId: 'a7', artisanName: 'Anjali Biswas', name: 'Embroidered Cotton Bedspread', price: 5500, originalPrice: 6500, category: 'Textiles', description: 'Large king-sized cotton bedcover featuring dense multi-colored Kantha running stitches across the entire surface.', culturalStory: 'These bedspreads often act as storytelling canvases, and passing down a heavily embroidered Kantha quilt is a cherished family tradition.', images: ['https://loremflickr.com/600/400/bedspread,cotton/all'], rating: 4.9, reviewCount: 156, stock: 8, tags: ['bedspread', 'kantha', 'decor', 'cotton'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p21', artisanId: 'a7', artisanName: 'Anjali Biswas', name: 'Kantha Cushion Covers (Set of 2)', price: 1500, originalPrice: 1800, category: 'Decor', description: 'Square cushion covers (16x16) made from upcycled cotton, tightly embroidered with traditional Bengal fauna designs.', culturalStory: 'This reflects the pure essence of Kantha—sustainability. Turning the old into something astonishingly new and beautiful.', images: ['https://loremflickr.com/600/400/cushion,kantha/all'], rating: 4.6, reviewCount: 84, stock: 20, tags: ['cushion', 'kantha', 'decor'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },

    { id: 'p22', artisanId: 'a8', artisanName: 'Ravi Gowda', name: 'Wooden Stacking Train', price: 850, originalPrice: 1000, category: 'Woodwork', description: 'A colorful, completely non-toxic pull-along wooden train toy. The edges are perfectly rounded, making it extremely safe for toddlers.', culturalStory: 'Channapatna toys trace their origins to the reign of Tipu Sultan, who invited Persian artisans to train local craftsmen in the art of wooden toy making.', images: ['https://loremflickr.com/600/400/toy,train/all', 'https://loremflickr.com/600/400/wood,colorful/all'], rating: 4.9, reviewCount: 231, stock: 50, tags: ['toys', 'wood', 'channapatna', 'kids'], isFeatured: true, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p23', artisanId: 'a8', artisanName: 'Ravi Gowda', name: 'Lacquerware Spinning Tops (Set of 3)', price: 500, originalPrice: 600, category: 'Woodwork', description: 'A set of three traditional spinning tops painted in bright primary colors. They spin beautifully and are highly durable.', culturalStory: 'The toys are made of "Aale mara" (ivory wood) and colored using vegetable dyes like turmeric for yellow and indigo for blue, making them eco-friendly.', images: ['https://loremflickr.com/600/400/top,toy/all'], rating: 4.7, reviewCount: 412, stock: 100, tags: ['toys', 'channapatna', 'spinning', 'wood'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() },
    { id: 'p24', artisanId: 'a8', artisanName: 'Ravi Gowda', name: 'Channapatna Abacus', price: 1200, originalPrice: 1500, category: 'Woodwork', description: 'An educational wooden abacus with brightly colored beads. Perfect for early childhood math learning while being an aesthetic piece.', culturalStory: 'Beyond play, Channapatna artisans constantly innovate to create educational items that blend ancient turning techniques with modern learning tools.', images: ['https://loremflickr.com/600/400/abacus,toy/all'], rating: 4.8, reviewCount: 95, stock: 30, tags: ['toys', 'abacus', 'education', 'channapatna'], isFeatured: false, isHandmade: true, createdAt: new Date().getTime() }
  ]
};

// ── Seed Firestore Database Function ────────────────────────
window.seedDatabase = async function() {
  if (!window.fbDB) {
    console.error('Firebase DB not initialized. Make sure you set up js/firebase-config.js');
    alert('Firebase not initialized. Check console.');
    return;
  }
  
  // Protect against seeding into the placeholder project
  if (window.fbDB.app.options.projectId === 'YOUR_PROJECT_ID') {
    const msg = 'Placeholder Firebase project detected. Please add your real Firebase API keys to js/firebase-config.js before seeding to the database.';
    console.error(msg);
    alert(msg);
    return;
  }

  try {
    console.log('🌱 Starting database seeding process...');
    const batch = window.fbDB.batch();

    window.demoData.artisans.forEach(a => {
      const ref = window.fbDB.collection('artisans').doc(a.id);
      const data = { ...a, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
      batch.set(ref, data);
    });

    window.demoData.products.forEach(p => {
      const ref = window.fbDB.collection('products').doc(p.id);
      const data = { ...p, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
      batch.set(ref, data);
    });

    await batch.commit();
    console.log('✅ Successfully seeded 8 artisans and 24 products!');
    alert('Database seeded successfully! Your Firebase project is now populated with BharatCraft data.');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    alert('Failed to seed database. Check if your firestore.rules allow writing, or if your network is up. Error: ' + err.message);
  }
};

// Automatic fallback setup on page load
(async function initData() {
  try {
    if (window.fbAuth) {
      // Wait for auth to resolve before checking DB
      await new Promise(r => window.fbAuth.onAuthStateChanged(() => r(), { once: false }));
    }
    
    if (window.fbDB && window.fbDB.app.options.projectId === 'YOUR_PROJECT_ID') {
      console.log('ℹ️ Utilizing local demo data memory structure due to placeholder Firebase config.');
    } else if (window.fbDB) {
      // It's a real project, check if we need to auto-seed
      const snap = await window.fbDB.collection('products').limit(1).get();
      if (snap.empty) {
        console.log('Database appears empty. You can run window.seedDatabase() in console to populate data.');
      }
    }
  } catch(e) {
    console.log('ℹ️ Local demo mode remains active. Database un-reachable.');
  }
})();
