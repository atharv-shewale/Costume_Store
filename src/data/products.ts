export type Category =
  | "garba-navratri"
  | "mythological"
  | "kids-mythological"
  | "traditional-indian"
  | "halloween"
  | "festival";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number | "Price on Request";
  description: string;
  image: string; // relative path from /images/
  tags: string[];
  featured?: boolean;
}

// Base path for images — served via Next.js public folder (URL encoded for browser reliability)
const IMG = (filename: string) => encodeURI(`/images/${filename}`);

export const products: Product[] = [
// ─── GARBA & NAVRATRI ─────────────────────────────────────────────────────
  {
    id: "g-001",
    name: "Vibrant Patchwork Chaniya Choli",
    category: "garba-navratri",
    price: 550,
    description:
      "Stunning multicolour patchwork chaniya choli with intricate mirror embroidery. Perfect for Navratri and Garba celebrations.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.47 AM (1).jpeg"),
    tags: ["garba","navratri","chaniya choli","women","colourful"],
    featured: true,
  },
  {
    id: "g-002",
    name: "Mirror-Work Spinning Chaniya",
    category: "garba-navratri",
    price: 550,
    description:
      "Wide flare spinning chaniya with traditional mirror-work and colourful geometric embroidery. Ideal for dandiya nights.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.47 AM.jpeg"),
    tags: ["garba","navratri","chaniya","women","mirror work"],
    featured: true,
  },
  {
    id: "g-003",
    name: "Yellow & Pink Floral Lehenga Set",
    category: "garba-navratri",
    price: 550,
    description:
      "Vibrant yellow and pink floral printed lehenga with colourful embroidery border. Perfect for Garba evenings.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.48 AM (1).jpeg"),
    tags: ["garba","navratri","lehenga","women","yellow","pink"],
  },
  {
    id: "g-004",
    name: "Red Elephant Print Chaniya Choli",
    category: "garba-navratri",
    price: 550,
    description:
      "Bold red chaniya with elephant motif border and orange embroidered choli. A traditional Kutchi-inspired look.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.48 AM (2).jpeg"),
    tags: ["garba","navratri","chaniya choli","women","red"],
    featured: true,
  },
  {
    id: "g-005",
    name: "Multicolour Geometric Chaniya Choli",
    category: "garba-navratri",
    price: 600,
    description:
      "Bright multicolour geometric print chaniya choli with traditional Gujarati embroidery work.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.48 AM (3).jpeg"),
    tags: ["garba","navratri","chaniya choli","women","geometric"],
  },
  {
    id: "g-006",
    name: "Black Garba Lehenga with Bandhani Dupatta",
    category: "garba-navratri",
    price: 550,
    description:
      "Elegant black lehenga with colourful bandhani dupatta and silver coin belt. Stylish modern Garba look.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.49 AM (1).jpeg"),
    tags: ["garba","navratri","lehenga","women","black","modern"],
  },
  {
    id: "g-007",
    name: "Multicolour Kali Dress Print Chaniya",
    category: "garba-navratri",
    price: 600,
    description:
      "Stunning colourful chaniya with dancer motif prints and traditional border embroidery. Wide flare for spinning.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.49 AM.jpeg"),
    tags: ["garba","navratri","chaniya","women","dance"],
  },
  {
    id: "g-008",
    name: "Patchwork Duo Set – Black & Colourful",
    category: "garba-navratri",
    price: 550,
    description:
      "Two-piece Garba set showing patchwork black and multicolour chaniya. Great for group bookings.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.50 AM (1).jpeg"),
    tags: ["garba","navratri","chaniya","women","patchwork"],
  },
  {
    id: "g-009",
    name: "Navy Blue Patchwork Lehenga",
    category: "garba-navratri",
    price: 700,
    description:
      "Premium navy blue and gold patchwork lehenga set with mirror embellishments. Elegant choice for Garba events.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.50 AM (2).jpeg"),
    tags: ["garba","navratri","lehenga","women","navy blue","premium"],
    featured: true,
  },
  {
    id: "g-010",
    name: "Colourful Navratri Trio Collection",
    category: "garba-navratri",
    price: 500,
    description:
      "Three distinct Navratri outfits – black with jacket (₹500), red embroidered (₹550), and navy with koti (₹600). Available separately.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.51 AM (1).jpeg"),
    tags: ["garba","navratri","women","collection"],
  },
  {
    id: "g-011",
    name: "Red & Black Koti Style Lehenga",
    category: "garba-navratri",
    price: 700,
    description:
      "Premium red & black lehenga with embroidered koti jacket and silver coin belt. Festival showstopper.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.51 AM.jpeg"),
    tags: ["garba","navratri","lehenga","women","koti","premium"],
    featured: true,
  },
  {
    id: "g-012",
    name: "Black Mirror-Work Chaniya Choli",
    category: "garba-navratri",
    price: 600,
    description:
      "Exquisite black chaniya with dense mirror and embroidery work in multicolour. Traditional Kutchi aesthetic.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.52 AM (1).jpeg"),
    tags: ["garba","navratri","chaniya","women","black","mirror work"],
  },
  {
    id: "g-013",
    name: "Red & Black Silk Lehenga with Dupatta",
    category: "garba-navratri",
    price: 700,
    description:
      "Sophisticated red & black silk chaniya with elephant-print border and embroidered black dupatta. Complete 3-piece set.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.52 AM.jpeg"),
    tags: ["garba","navratri","lehenga","women","red","silk"],
  },
  {
    id: "g-014",
    name: "Blue & Red Paisley Spinning Chaniya",
    category: "garba-navratri",
    price: 550,
    description:
      "Wide-flare chaniya with blue & red paisley (kairi) pattern and mirror work. Beautiful floor spinner.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.53 AM (1).jpeg"),
    tags: ["garba","navratri","chaniya","women","blue","paisley"],
  },
  {
    id: "g-015",
    name: "Elephant Motif Garba Chaniya",
    category: "garba-navratri",
    price: 400,
    description:
      "Traditional black & red chaniya with elephant motif embroidery and mirror detailing. Classic Kathiyawadi style.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.53 AM (2).jpeg"),
    tags: ["garba","navratri","chaniya","women","elephant motif"],
  },
  {
    id: "g-016",
    name: "White Mirror Chaniya with Embroidered Choli",
    category: "garba-navratri",
    price: 350,
    description:
      "Pristine white mirror-work chaniya with colourful embroidered choli and bandhani dupatta. Budget-friendly Garba look.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.53 AM (3).jpeg"),
    tags: ["garba","navratri","chaniya","women","white","budget"],
  },
  {
    id: "g-017",
    name: "Green Embroidered Chaniya Choli",
    category: "garba-navratri",
    price: 550,
    description:
      "Vibrant green chaniya with traditional floral and geometric embroidery. Full flare design with cowrie shell tassels.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.53 AM.jpeg"),
    tags: ["garba","navratri","chaniya","women","green"],
  },
  {
    id: "g-018",
    name: "Orange & Blue Kids Garba Chaniya",
    category: "garba-navratri",
    price: 400,
    description:
      "Beautiful orange & blue chaniya with mirror embroidery for girls. Perfect for kids Garba events.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.54 AM (1).jpeg"),
    tags: ["garba","navratri","chaniya","kids","girls","orange"],
  },
  {
    id: "g-019",
    name: "Black Mirror Diamond Chaniya",
    category: "garba-navratri",
    price: 350,
    description:
      "Simple yet elegant black chaniya with diamond-pattern mirror work and colourful embroidered choli.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.54 AM (2).jpeg"),
    tags: ["garba","navratri","chaniya","women","black","budget"],
  },
  {
    id: "g-020",
    name: "Red Kids Navratri Chaniya Set",
    category: "garba-navratri",
    price: 450,
    description:
      "Adorable red chaniya choli for little girls with multicolour embroidered layers. Great for school Navratri events.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.54 AM (3).jpeg"),
    tags: ["garba","navratri","chaniya","kids","girls","red"],
  },
  {
    id: "g-021",
    name: "Red Kids Garba Chaniya (Full Set)",
    category: "garba-navratri",
    price: 400,
    description:
      "Festive red chaniya with bandhani print and golden border for girls. Comes with matching choli and dupatta.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.54 AM.jpeg"),
    tags: ["garba","navratri","chaniya","kids","girls"],
  },
  {
    id: "g-022",
    name: "Purple Garba Lehenga Set",
    category: "garba-navratri",
    price: 600,
    description:
      "Regal purple lehenga with golden stripe border, embroidered choli and matching dupatta. Elegant Garba attire.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.50 AM (3).jpeg"),
    tags: ["garba","navratri","lehenga","women","purple"],
  },
  {
    id: "g-023",
    name: "Yellow & Pink Garba Lehenga (Navratri Night)",
    category: "garba-navratri",
    price: 550,
    description:
      "Stunning yellow and pink chaniya choli photographed at an outdoor Garba event. Ready-to-wear set.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.08 AM (2).jpeg"),
    tags: ["garba","navratri","lehenga","women","yellow"],
    featured: true,
  },
  {
    id: "g-024",
    name: "Bottle Green Elephant & Peacock Mirror Chaniya Choli",
    category: "garba-navratri",
    price: 800,
    description:
      "Heavy bottle green chaniya with colourful circular peacock and elephant embroidery, dense mirror borders and white choli set.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.37 AM.jpeg"),
    tags: ["garba","navratri","chaniya choli","women","green","peacock","mirror work"],
    featured: true,
  },
  {
    id: "g-025",
    name: "Multicolour Kutchi Patchwork Mega Flare Chaniya",
    category: "garba-navratri",
    price: 550,
    description:
      "Extra-wide spinning flare chaniya covered in vibrant square Kutchi patchwork and mirror embellishments with black embroidered choli.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.38 AM (1).jpeg"),
    tags: ["garba","navratri","chaniya","women","patchwork","kutchi","flare"],
    featured: true,
  },
  {
    id: "g-026",
    name: "Black & Red Kutchi Mirror Chaniya Choli Set",
    category: "garba-navratri",
    price: 600,
    description:
      "Authentic Kutchi embroidery on black and deep red fabric with thousands of sparkling mirrors. Includes matching choli and dupatta.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.38 AM.jpeg"),
    tags: ["garba","navratri","chaniya choli","women","black","red","mirror work"],
    featured: true,
  },
  {
    id: "g-027",
    name: "Rust Orange Twirling Chaniya with Embroidered Choli",
    category: "garba-navratri",
    price: 600,
    description:
      "Striking rust-orange pleated twirling chaniya with silver gota border and colourful Kutchi embroidered choli top.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.39 AM (1).jpeg"),
    tags: ["garba","navratri","chaniya","women","orange","twirling"],
  },
  {
    id: "g-028",
    name: "Rani Pink & Black Heavy Embroidered Garba Set",
    category: "garba-navratri",
    price: 600,
    description:
      "Gorgeous rani pink flared chaniya with black animal motif border and matching embroidered koti-style choli.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.39 AM (2).jpeg"),
    tags: ["garba","navratri","chaniya choli","women","rani pink","black"],
    featured: true,
  },
  {
    id: "g-029",
    name: "Kids Multicolour Kutchi Mirrorwork Chaniya (Girls)",
    category: "garba-navratri",
    price: 550,
    description:
      "Adorable multicolour patchwork and mirrorwork chaniya for girls with flared borders. Perfect for school and community Garba.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.39 AM (3).jpeg"),
    tags: ["garba","navratri","chaniya","kids","girls","patchwork","mirror work"],
  },
  {
    id: "g-030",
    name: "Yellow & Multicolour Striped Spinning Chaniya",
    category: "garba-navratri",
    price: 550,
    description:
      "Rainbow-striped spinning chaniya with traditional Gujarati folk embroidery, blue choli and mirrorwork embellishments.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.39 AM.jpeg"),
    tags: ["garba","navratri","chaniya","women","yellow","rainbow","spinning"],
  },
  {
    id: "g-031",
    name: "Onion Pink Silk Lehenga with Mirror Work",
    category: "garba-navratri",
    price: 700,
    description:
      "Classy onion pink silk lehenga with silver gota accents, black Kutchi embroidered patches and matching dupatta.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.40 AM.jpeg"),
    tags: ["garba","navratri","lehenga","women","pink","silk","mirror work"],
    featured: true,
  },
  {
    id: "g-032",
    name: "Multicolour Vertical Kali Garba Chaniya Choli",
    category: "garba-navratri",
    price: 600,
    description:
      "Festive multi-panel (kali) chaniya featuring peacock embroidery, vibrant vertical stripes and yellow mirror-work blouse.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.41 AM.jpeg"),
    tags: ["garba","navratri","chaniya choli","women","kali","peacock","yellow"],
  },
  {
    id: "g-033",
    name: "Red & Yellow Kathiyawadi Chaniya Choli",
    category: "garba-navratri",
    price: 400,
    description:
      "Classic Kathiyawadi red and yellow chaniya with mirrorwork waistband, embroidered red choli and yellow dupatta.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.42 AM.jpeg"),
    tags: ["garba","navratri","chaniya choli","women","red","yellow","budget"],
  },
  {
    id: "g-034",
    name: "Royal Navy & Purple Embroidered Silk Lehenga",
    category: "garba-navratri",
    price: 900,
    description:
      "Premium navy and magenta purple silk lehenga with heavy thread and mirror embroidery work. Includes designer blouse and dupatta.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.43 AM (1).jpeg"),
    tags: ["garba","navratri","lehenga","women","navy","purple","premium","silk"],
    featured: true,
  },
  {
    id: "g-035",
    name: "White Warli Art Printed Chaniya with Pink Dupatta",
    category: "garba-navratri",
    price: 400,
    description:
      "Unique white chaniya featuring colourful Warli art and folk figures, paired with hot pink mirror-work dupatta and choli.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.43 AM.jpeg"),
    tags: ["garba","navratri","chaniya","women","white","warli","pink"],
  },
  {
    id: "g-036",
    name: "Brown & Earthy Tone Traditional Mirror Chaniya",
    category: "garba-navratri",
    price: 700,
    description:
      "Sophisticated earthy brown and terracotta chaniya with dense geometric mirrorwork border and matching blouse.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.44 AM (1).jpeg"),
    tags: ["garba","navratri","chaniya","women","brown","mirror work","traditional"],
  },
  {
    id: "g-037",
    name: "Royal Navy Blue Patchwork Designer Lehenga Set",
    category: "garba-navratri",
    price: 1000,
    description:
      "Ultra-premium royal navy blue patchwork lehenga with colourful checkered border embroidery, designer blouse and matching dupatta.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.44 AM (2).jpeg"),
    tags: ["garba","navratri","lehenga","women","navy blue","patchwork","premium"],
    featured: true,
  },
  {
    id: "g-038",
    name: "Maroon & Gold Traditional Twirling Lehenga",
    category: "garba-navratri",
    price: 700,
    description:
      "Classic maroon flared lehenga with intricate golden and mirrorwork borders, paired with a matching embroidered designer blouse.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.44 AM.jpeg"),
    tags: ["garba","navratri","lehenga","women","maroon","gold","twirling"],
  },
  {
    id: "g-039",
    name: "Rani Pink Peacock Motif Embroidered Lehenga",
    category: "garba-navratri",
    price: 900,
    description:
      "Exquisite rani pink lehenga with wide flare border showcasing dancing peacocks and traditional royal court motifs.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.45 AM.jpeg"),
    tags: ["garba","navratri","lehenga","women","rani pink","peacock","premium"],
    featured: true,
  },
  {
    id: "g-040",
    name: "Black Diamond Patchwork Chaniya with Pink Dupatta",
    category: "garba-navratri",
    price: 800,
    description:
      "Sleek black chaniya with colourful diamond-shaped mirror appliqués, contrast pink dupatta, and heavy embroidered choli.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.46 AM (1).jpeg"),
    tags: ["garba","navratri","chaniya","women","black","diamond","pink"],
  },
  {
    id: "g-041",
    name: "Traditional Kutchi Embroidered Chaniya Duo",
    category: "garba-navratri",
    price: 550,
    description:
      "Authentic pair of Kutchi mirror-embroidered chaniya cholis in blue and red tones. Perfect for group and friend duo rentals.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.46 AM (2).jpeg"),
    tags: ["garba","navratri","chaniya","women","kutchi","duo"],
  },
  {
    id: "g-042",
    name: "White & Red Layered Flare Chaniya Choli",
    category: "garba-navratri",
    price: 700,
    description:
      "Pristine white and red paneled flare chaniya with horizontal stripe borders and embroidered red choli with dupatta.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.46 AM (3).jpeg"),
    tags: ["garba","navratri","chaniya choli","women","white","red"],
  },
  {
    id: "g-043",
    name: "Yellow & Lavender Dual Tone Embroidered Chaniya",
    category: "garba-navratri",
    price: 800,
    description:
      "Unique festive colour combination featuring yellow top and lavender purple circular embroidered chaniya with rich mirror border.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.46 AM.jpeg"),
    tags: ["garba","navratri","chaniya","women","yellow","lavender","purple"],
  },
  {
    id: "g-044",
    name: "Multicolour Patchwork Navratri Chaniya Set",
    category: "garba-navratri",
    price: 550,
    description:
      "Colourful tiered patchwork chaniya with traditional Gujarati floral embroidery and full spin flare.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.47 AM (2).jpeg"),
    tags: ["garba","navratri","chaniya","women","patchwork","flared"],
  },
  {
    id: "g-045",
    name: "Kids Red & Royal Blue Mirror Chaniya (Girls)",
    category: "garba-navratri",
    price: 550,
    description:
      "Vibrant red, yellow and blue layered mirrorwork chaniya for girls with embroidered neckline choli. Great for Navratri competitions.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.48 AM.jpeg"),
    tags: ["garba","navratri","chaniya","kids","girls","red","blue"],
  },
  {
    id: "g-046",
    name: "Royal Purple Silk Pleated Lehenga with Dupatta",
    category: "garba-navratri",
    price: 600,
    description:
      "Solid royal purple silk lehenga with golden zari borders, matching blouse and long sheer dupatta. Modern minimalist Navratri style.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.50 AM.jpeg"),
    tags: ["garba","navratri","lehenga","women","purple","silk"],
  },
  {
    id: "g-047",
    name: "Black Heavy Mirrorwork Spinning Chaniya",
    category: "garba-navratri",
    price: 600,
    description:
      "Jet black spinning chaniya with dense geometric Kutchi mirror and thread work. Wide circular flare for dandiya nights.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.10.52 AM (2).jpeg"),
    tags: ["garba","navratri","chaniya","women","black","mirror work","spinning"],
    featured: true,
  },

  // ─── MYTHOLOGICAL / RELIGIOUS (ADULTS) ────────────────────────────────────
  {
    id: "m-001",
    name: "Maa Kali Costume (Adult)",
    category: "mythological",
    price: 400,
    description:
      "Dramatic Maa Kali costume with tiger-print top, skulls garland, sword prop and severed head. Complete with makeup accessories.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.04 AM.jpeg"),
    tags: ["kali","mythological","adult","women","navratri"],
    featured: true,
  },
  {
    id: "m-002",
    name: "Maa Kali with Durga Arms Frame (Adult)",
    category: "mythological",
    price: 400,
    description:
      "Maa Kali costume with decorative multi-arm frame, flower garland and skulls. Striking performance costume.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.07 AM (3).jpeg"),
    tags: ["kali","mythological","adult","women"],
  },
  {
    id: "m-003",
    name: "Maa Kali Costume with Price Tag",
    category: "mythological",
    price: 400,
    description:
      "Full Maa Kali costume with sword, skull necklace, and severed head prop. Includes makeup guide.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.18.42 AM.jpeg"),
    tags: ["kali","mythological","adult","women"],
  },
  {
    id: "m-004",
    name: "Shri Krishna / Vishnu Costume (Adult)",
    category: "mythological",
    price: "Price on Request",
    description:
      "Dark-skin Krishna/Vishnu costume with crown, multi-strand pearl necklace, yellow & blue royal attire.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.04 AM (2).jpeg"),
    tags: ["krishna","vishnu","mythological","adult"],
  },
  {
    id: "m-005",
    name: "Ravan / Demon King Costume with Sword Prop",
    category: "mythological",
    price: 400,
    description:
      "Dramatic Ravan warrior costume with black & royal blue attire, shoulder armor, pearl necklaces, crown, face art, and dagger.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.14.52 AM.jpeg"),
    tags: ["ravan","mythological","dussehra","ramayan","black","warrior"],
    featured: true,
  },

  // ─── KIDS MYTHOLOGICAL, HISTORIC & FREEDOM FIGHTERS ───────────────────────
  {
    id: "k-001",
    name: "Ram-Sita-Hanuman-Lakshman Set (Kids)",
    category: "kids-mythological",
    price: 300,
    description:
      "Complete Ramayan characters set – Ram, Sita, Lakshman & Hanuman costumes for children. Ideal for school events and Dussehra.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.03 AM (2).jpeg"),
    tags: ["ram","sita","hanuman","lakshman","kids","school event","ramayan"],
    featured: true,
  },
  {
    id: "k-002",
    name: "Ram / Lakshman Costume (Kids)",
    category: "kids-mythological",
    price: 300,
    description:
      "Orange dhoti-kurta Ram/Lakshman costume for children with rudraksha mala and bow prop. Per costume.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.06 AM.jpeg"),
    tags: ["ram","lakshman","kids","school event","orange"],
  },
  {
    id: "k-003",
    name: "Hanuman Costume with Mace (Kids)",
    category: "kids-mythological",
    price: 300,
    description:
      "Adorable Hanuman ji costume for children with red dhoti, crown, gada (mace) prop and tail.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.06 AM (1).jpeg"),
    tags: ["hanuman","kids","school event","red"],
  },
  {
    id: "k-004",
    name: "Sadhu / Sant Costume (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "White dhoti sadhu costume for children with rudraksha mala, ektar musical instrument prop.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.07 AM (1).jpeg"),
    tags: ["sadhu","saint","kids","school event","white"],
  },
  {
    id: "k-005",
    name: "Ravan Costume with 10-Head Crown (Kids)",
    category: "kids-mythological",
    price: "Price on Request",
    description:
      "Dramatic Ravan costume for kids with 10-headed crown backdrop, black & gold royal attire and sword prop.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.07 AM (2).jpeg"),
    tags: ["ravan","kids","school event","dussehra","black"],
    featured: true,
  },
  {
    id: "k-006",
    name: "Maa Durga Costume (Kids)",
    category: "kids-mythological",
    price: "Price on Request",
    description:
      "Beautiful Maa Durga costume for girls with golden crown, red silk saree, multi-arm frame and trident prop.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.08 AM.jpeg"),
    tags: ["durga","kids","school event","girls","red"],
  },
  {
    id: "k-007",
    name: "Mahadev / Lord Shiva Costume (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Tiger-skin print Shiva costume for children with rudraksha mala, snake prop and trident. Jata wig included.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.08 AM (1).jpeg"),
    tags: ["shiva","mahadev","kids","school event","tiger"],
    featured: true,
  },
  {
    id: "k-008",
    name: "Mahadev Shiva Tiger Costume (Alt) – Kids",
    category: "kids-mythological",
    price: 350,
    description:
      "Alternative Shiva tiger-skin costume for children. Includes trident (trishul) prop and rudraksha accessories.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.17.26 AM.jpeg"),
    tags: ["shiva","mahadev","kids","tiger","school event"],
  },
  {
    id: "k-009",
    name: "Ardhanarishvara Costume (Kids)",
    category: "kids-mythological",
    price: 500,
    description:
      "Unique half-Shiva half-Parvati Ardhanarishvara costume for children. Blue & red split with trident.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.09 AM (2).jpeg"),
    tags: ["ardhanarishvara","shiva","parvati","kids","school event"],
    featured: true,
  },
  {
    id: "k-010",
    name: "Ardhanarishvara (With Price) – Kids",
    category: "kids-mythological",
    price: 500,
    description:
      "Ardhanarishvara costume – half Shiva, half Parvati. Blue body paint half, red saree half. With trident and damru.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.20.12 AM.jpeg"),
    tags: ["ardhanarishvara","shiva","parvati","kids"],
  },
  {
    id: "k-011",
    name: "Sadhu / Rishi Baba Costume (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Sadhu costume with white jata wig, orange dhoti and prayer bowl (kamandal). Ideal for school tableaux.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.04 AM (1).jpeg"),
    tags: ["sadhu","rishi","kids","orange","school event"],
  },
  {
    id: "k-012",
    name: "Sadhu / Rishi Baba (With Price) – Kids",
    category: "kids-mythological",
    price: 350,
    description:
      "Orange sadhu/rishi baba costume for children with white beard wig and kamandal prop.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.21.27 AM.jpeg"),
    tags: ["sadhu","rishi","kids","orange","school event"],
  },
  {
    id: "k-013",
    name: "Tribal Warrior / Adivasi Costume (Kids)",
    category: "kids-mythological",
    price: 400,
    description:
      "Unique tribal/adivasi warrior costume for boys with Mahabali-style blue-yellow dhoti and pearl accessories.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.08 AM (3).jpeg"),
    tags: ["tribal","warrior","kids","boys","school event"],
  },
  {
    id: "k-014",
    name: "Vaman / Mahabali King Costume (Kids)",
    category: "kids-mythological",
    price: 400,
    description:
      "Traditional Maharaja/Vaman/Bali raja costume for boys with pink turban, yellow & blue royal dhoti and shell garland.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.07 AM.jpeg"),
    tags: ["mahabali","vaman","raja","kids","boys","school event"],
  },
  {
    id: "k-015",
    name: "Mahabali / King Warrior (Alt) – Kids",
    category: "kids-mythological",
    price: 400,
    description:
      "Warrior king costume for children with black face paint, golden crown and blue-orange royal dhoti.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.09 AM.jpeg"),
    tags: ["warrior","raja","kids","boys","school event"],
  },
  {
    id: "k-016",
    name: "Narad Muni Costume (Kids)",
    category: "kids-mythological",
    price: 400,
    description:
      "Black & gold Narad Muni costume for boys with veena/instrument accessories. School performance favourite.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.09 AM (1).jpeg"),
    tags: ["narad","muni","kids","boys","school event"],
  },
  {
    id: "k-017",
    name: "Shri Krishna / Vishnu (Kids – Blue)",
    category: "kids-mythological",
    price: "Price on Request",
    description:
      "Blue-skin Krishna/Vishnu costume for children with golden crown, pearl necklace and yellow dhoti.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.04 AM (2).jpeg"),
    tags: ["krishna","vishnu","kids","blue","school event"],
  },
  {
    id: "k-018",
    name: "Bal Ram / Lakshman with Golden Bow & Quiver (Kids)",
    category: "kids-mythological",
    price: 300,
    description:
      "Lord Ram / Lakshman costume for children featuring yellow & red dhoti, golden mukut, pearl haar, and golden bow & arrow prop.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.03 AM (1).jpeg"),
    tags: ["ram","lakshman","ramayan","kids","bow","arrow","school event"],
    featured: true,
  },
  {
    id: "k-019",
    name: "Ramayan Vanvas Trio Set – Ram, Sita, Lakshman (Kids)",
    category: "kids-mythological",
    price: 300,
    description:
      "Authentic Ramayan Vanvas attire in saffron cotton dhotis, rudraksha malas, and bow-arrow props for kids Ram Leela performances.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.13.03 AM.jpeg"),
    tags: ["ram","sita","lakshman","ramayan","vanvas","kids","school event"],
    featured: true,
  },
  {
    id: "k-020",
    name: "Ramayan Trio in Saffron Dhotis (Kids)",
    category: "kids-mythological",
    price: 300,
    description:
      "Orange saffron dhoti-kurta costumes for Ram, Lakshman and Sita with floral garland, bow, and rudraksha beads.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.16.19 AM.jpeg"),
    tags: ["ram","sita","lakshman","ramayan","saffron","kids"],
  },
  {
    id: "k-021",
    name: "King Mahabali / Vaman Royal Costume (Kids)",
    category: "kids-mythological",
    price: 400,
    description:
      "Regal Mahabali / Raja costume for boys with royal blue-yellow dhoti, shell belt, pearl necklace, and authentic Maharashtrian pink turban.",
    image: IMG("WhatsApp Image 2026-10-06 at 8.17.54 AM.jpeg"),
    tags: ["mahabali","king","raja","kids","boys","turban"],
  },
  {
    id: "k-022",
    name: "Bal Krishna Yellow & Red Toddler Set",
    category: "kids-mythological",
    price: 350,
    description:
      "Adorable Bal Krishna costume for toddlers with yellow angrakha kurta, red dhoti, morpankh mukut, bansuri flute, and decorated makhan pot.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.31 PM.jpeg"),
    tags: ["krishna","bal krishna","janmashtami","kids","toddler","yellow","red"],
    featured: true,
  },
  {
    id: "k-023",
    name: "Bal Shiva / Mahadev Costume with Tiger Skin & Damru (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Lord Shiva fancy dress for children featuring tiger-skin printed tunic, jata hair wig, rudraksha mala, serpent around neck, and mini damru.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.33 PM (1).jpeg"),
    tags: ["shiva","mahadev","bal shiva","kids","tiger","damru","rudraksha"],
    featured: true,
  },
  {
    id: "k-024",
    name: "Bal Krishna Royal Red & Gold Costume (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Festive Bal Krishna outfit with embroidered red angrakha, golden dhoti, multi-strand pearl garlands, ornate mukut, and flute.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.33 PM.jpeg"),
    tags: ["krishna","bal krishna","janmashtami","kids","red","gold"],
  },
  {
    id: "k-025",
    name: "Chhatrapati Shivaji Maharaj Costume in Royal Red (Kids)",
    category: "kids-mythological",
    price: 450,
    description:
      "Majestic Shivaji Maharaj warrior costume for boys with red brocade angrakha, gold dhoti, traditional red pheta turban, pearls and sword.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.34 PM (1).jpeg"),
    tags: ["shivaji maharaj","maratha","freedom fighter","king","boys","sword","pheta"],
    featured: true,
  },
  {
    id: "k-026",
    name: "Royal Peshwa / Maratha Prince Costume (Kids)",
    category: "kids-mythological",
    price: 450,
    description:
      "Elegant Peshwa prince costume with golden silk angrakha, royal blue sash, golden dhoti, velvet pheta turban, and sheathed sword.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.34 PM (2).jpeg"),
    tags: ["peshwa","maratha","prince","king","boys","gold","sword"],
  },
  {
    id: "k-027",
    name: "Maratha Warrior / Shivaji Maharaj in Green Brocade (Kids)",
    category: "kids-mythological",
    price: 450,
    description:
      "Authentic Maratha warrior king attire featuring green & red embroidered angrakha, white dhoti, pearl necklace, red pheta, and talwar sword.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.34 PM (3).jpeg"),
    tags: ["shivaji maharaj","maratha","warrior","boys","sword","green"],
  },
  {
    id: "k-028",
    name: "Chhatrapati Shivaji Maharaj with Shield & Talwar (Kids)",
    category: "kids-mythological",
    price: 500,
    description:
      "Full warrior look of Chhatrapati Shivaji Maharaj with brocade angrakha, beard & mustache prop, pheta, metallic dhal (shield) and talwar (sword).",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.34 PM.jpeg"),
    tags: ["shivaji maharaj","maratha","warrior","shield","sword","boys"],
    featured: true,
  },
  {
    id: "k-029",
    name: "Bal Krishna Vrindavan Matki Set (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Cute Bal Krishna costume with royal blue dhoti, peacock feather crown, flute, and colorful decorated makhan handi prop.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.35 PM (1).jpeg"),
    tags: ["krishna","bal krishna","janmashtami","kids","blue","makhan matki"],
  },
  {
    id: "k-030",
    name: "Lord Krishna / Vishnu Royal Costume with Crown (Kids)",
    category: "kids-mythological",
    price: 400,
    description:
      "Divine Krishna/Vishnu costume featuring grand golden crown (mukut), blue-gold angavastram, bright yellow dhoti, pearl malas, and flute.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.35 PM (2).jpeg"),
    tags: ["krishna","vishnu","kids","crown","yellow","blue","bansuri"],
  },
  {
    id: "k-031",
    name: "Royal Maratha King / Peshwa in Embroidered Sherwani (Kids)",
    category: "kids-mythological",
    price: 500,
    description:
      "Regal Maratha king costume with embroidered brocade jacket, orange dhoti sash, designer pheta, pearl garlands, and royal posture.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.35 PM.jpeg"),
    tags: ["peshwa","king","maratha","boys","royal","sherwani"],
  },
  {
    id: "k-032",
    name: "Bal Krishna Yellow & Royal Blue Dhoti Set (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Vibrant yellow embroidered top with royal blue pleated dhoti, kamarbandh, morpankh mukut, and flute for Janmashtami celebrations.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.37 PM (1).jpeg"),
    tags: ["krishna","bal krishna","janmashtami","kids","yellow","blue"],
  },
  {
    id: "k-033",
    name: "Bal Shiva / Mahadev with Trishul & Snake Prop (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Complete Lord Shiva costume with tiger skin attire, snake replica around neck, crescent moon on jata, trishul trident, and damru.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.37 PM (2).jpeg"),
    tags: ["shiva","mahadev","bal shiva","trishul","damru","kids"],
  },
  {
    id: "k-034",
    name: "Bal Krishna in Orange & Red Dhoti Set (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Traditional orange and blue dhoti-kurta set with peacock feather crown, pearl necklace, armbands, and decorated bansuri.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.37 PM.jpeg"),
    tags: ["krishna","bal krishna","janmashtami","kids","orange"],
  },
  {
    id: "k-035",
    name: "Bal Krishna with Kutchi Embroidered Koti (Kids)",
    category: "kids-mythological",
    price: 400,
    description:
      "Unique Kutchi mirrorwork embroidered jacket with rich red pleated dhoti, ornate pagdi with peacock feather, and flute.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.39 PM.jpeg"),
    tags: ["krishna","bal krishna","kutchi","mirror work","kids","red"],
  },
  {
    id: "k-036",
    name: "Goddess Sita / Lakshmi in Royal Blue Silk (Kids)",
    category: "kids-mythological",
    price: 400,
    description:
      "Goddess costume for girls featuring royal blue silk saree with gold border, intricate golden crown, nose ring, pearl necklaces, and bow-arrow prop.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.40 PM (1).jpeg"),
    tags: ["sita","lakshmi","devi","kids","girls","blue","crown"],
    featured: true,
  },
  {
    id: "k-037",
    name: "Bal Krishna Blue & Pink Dhoti Set with Makhan Pot (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Festive blue and pink dhoti set for little Krishna with peacock feather crown, pearl garlands, and traditional butter pot prop.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.40 PM.jpeg"),
    tags: ["krishna","bal krishna","janmashtami","toddler","kids"],
  },
  {
    id: "k-038",
    name: "Bharat Mata / Goddess Lakshmi Costume (Girls)",
    category: "kids-mythological",
    price: 400,
    description:
      "Divine Bharat Mata / Lakshmi costume in red & gold brocade lehenga-saree with ornate golden crown, red veil, and blessing pose.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.41 PM (1).jpeg"),
    tags: ["bharat mata","lakshmi","devi","girls","red","gold","crown"],
  },
  {
    id: "k-039",
    name: "Bal Krishna Embroidered White & Red Costume (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Traditional white embroidered choli with festive red dhoti, morpankh crown, pearl malas, and bansuri flute.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.41 PM.jpeg"),
    tags: ["krishna","bal krishna","janmashtami","kids","white","red"],
  },
  {
    id: "k-040",
    name: "Sant Tukaram / Varkari Saint Costume with Chipli (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Traditional Maharashtra saint costume with white angrakha, dhoti, saffron sash, white pagdi with tilak, rudraksha necklace, and musical chipli prop.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.42 PM (2).jpeg"),
    tags: ["sant tukaram","varkari","saint","kids","boys","white","school event"],
    featured: true,
  },
  {
    id: "k-041",
    name: "Lord Krishna in Sky Blue Silk Costume (Kids)",
    category: "kids-mythological",
    price: 400,
    description:
      "Stunning sky-blue silk dhoti-kurta with golden borders, peacock feather pagdi, pearl malas, and wooden flute.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.42 PM.jpeg"),
    tags: ["krishna","sky blue","silk","kids","bansuri","janmashtami"],
  },
  {
    id: "k-042",
    name: "Swami Vivekananda / Young Sanyasi Costume (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Authentic Swami Vivekananda / sadhu costume in bright saffron dhoti and kurta, rudraksha malas, and saffron turban.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.43 PM (1).jpeg"),
    tags: ["swami vivekananda","monk","sanyasi","saffron","kids","school event"],
  },
  {
    id: "k-043",
    name: "Royal Chhatrapati Shivaji Maharaj with Dhal & Talwar (Kids)",
    category: "kids-mythological",
    price: 500,
    description:
      "Complete royal Maratha outfit with deep red & gold brocade angrakha, traditional pheta, pearl haar, metallic shield, and sword.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.43 PM (2).jpeg"),
    tags: ["shivaji maharaj","maratha","king","sword","shield","boys"],
    featured: true,
  },
  {
    id: "k-044",
    name: "Bal Krishna Yellow Embroidered Angrakha Set (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Bright yellow embroidered angrakha top with red dhoti, jewel-encrusted mukut, pearl malas, and flute.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.43 PM (3).jpeg"),
    tags: ["krishna","bal krishna","janmashtami","kids","yellow","red"],
  },
  {
    id: "k-045",
    name: "Lord Venkateshwara Balaji & Padmavati Duo Set (Kids)",
    category: "kids-mythological",
    price: 500,
    description:
      "Majestic Tirupati Balaji and Goddess Padmavati South Indian deity costumes featuring tall golden kiritams, silk dhotis, and ornate temple jewels. Pair available.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.43 PM.jpeg"),
    tags: ["balaji","venkateshwara","padmavati","south indian","deity","kids","pair"],
    featured: true,
  },
  {
    id: "k-046",
    name: "Bal Krishna in Red Angrakha & Yellow Dhoti (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Playful Krishna costume with red printed angrakha, bright yellow dhoti, colorful turban with peacock feather, and flute.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.44 PM (1).jpeg"),
    tags: ["krishna","bal krishna","janmashtami","kids","red","yellow"],
  },
  {
    id: "k-047",
    name: "Radha & Krishna Festive Pair Set (Kids)",
    category: "kids-mythological",
    price: 600,
    description:
      "Matching Radha-Krishna pair costume. Krishna in yellow-blue dhoti with crown; Radha in gorgeous pink and blue embroidered lehenga with dupatta.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.44 PM (2).jpeg"),
    tags: ["radha krishna","pair","lehenga","dhoti","kids","janmashtami"],
    featured: true,
  },
  {
    id: "k-048",
    name: "Bal Krishna with Golden Flute & Mukut (Kids)",
    category: "kids-mythological",
    price: 350,
    description:
      "Classic yellow top and red dhoti Krishna costume with matching red turban, morpankh, and bansuri flute.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.44 PM.jpeg"),
    tags: ["krishna","bal krishna","janmashtami","kids"],
  },

  // ─── TRADITIONAL INDIAN & REGIONAL FOLK ───────────────────────────────────
  {
    id: "t-001",
    name: "Rajasthani Ghoomar Flared Skirt Costume (Girls)",
    category: "traditional-indian",
    price: 500,
    description:
      "Authentic Rajasthani folk dance outfit with wide flared yellow ghagra, contrasting pink koti, silver waist ornament and traditional jewellery.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.23.20 PM.jpeg"),
    tags: ["rajasthani","ghoomar","folk dance","traditional","girls","yellow"],
    featured: true,
  },
  {
    id: "t-002",
    name: "Marwadi Ghagra Choli with Borla (Girls)",
    category: "traditional-indian",
    price: 450,
    description:
      "Traditional yellow and red Marwadi ghagra choli with ethnic border work, matching odhani, borla maang tikka and traditional jewellery.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.33 PM.jpeg"),
    tags: ["rajasthani","marwadi","ghagra choli","girls","folk dance"],
  },
  {
    id: "t-003",
    name: "Gujarati / Rajasthani Kediyu Dhoti Set (Boys)",
    category: "traditional-indian",
    price: 400,
    description:
      "Vibrant red bandhani print kediyu top with yellow dhoti and matching bandhani pagdi/turban. Ideal for cultural and folk events.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.38 PM.jpeg"),
    tags: ["gujarati","kediyu","dhoti","boys","bandhani","traditional"],
  },
  {
    id: "t-004",
    name: "Kashmiri Traditional Folk Dress (Girls)",
    category: "traditional-indian",
    price: 450,
    description:
      "Lovely blue flared skirt with pink kurta and embroidered Kashmiri koti jacket, complete with matching headscarf and silver coin necklace.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.39 PM (2).jpeg"),
    tags: ["kashmiri","folk","traditional","girls","blue","school event"],
  },
  {
    id: "t-005",
    name: "Royal Red Velvet Kashmiri Pheran (Girls)",
    category: "traditional-indian",
    price: 500,
    description:
      "Rich red velvet Kashmiri pheran with traditional silver tilla embroidery, ornate taranga headwear, and authentic heavy silver jewellery.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.39 PM.jpeg"),
    tags: ["kashmiri","pheran","velvet","red","girls","traditional"],
    featured: true,
  },
  {
    id: "t-006",
    name: "Kerala Kasavu Traditional Saree (Girls)",
    category: "traditional-indian",
    price: 400,
    description:
      "Pristine white Kerala Kasavu saree with golden zari border paired with a contrasting festive blouse and temple jewellery.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.40 PM (1).jpeg"),
    tags: ["kerala","kasavu","onam","saree","girls","traditional","white"],
  },
  {
    id: "t-007",
    name: "Royal Blue Velvet Kashmiri Pheran with Flower Basket",
    category: "traditional-indian",
    price: 500,
    description:
      "Magnificent royal blue velvet Kashmiri pheran with elaborate silver embroidery, silver taranga cap, necklaces and wicker flower basket prop.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.40 PM.jpeg"),
    tags: ["kashmiri","pheran","velvet","blue","girls","traditional"],
    featured: true,
  },
  {
    id: "t-008",
    name: "Assamese Bihu Dance Mekhela Sador (Girls)",
    category: "traditional-indian",
    price: 450,
    description:
      "Authentic Assamese muga silk Mekhela Sador with red floral motifs, red blouse, flower bun and traditional Assamese gamkharu jewellery.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.41 PM (1).jpeg"),
    tags: ["assamese","bihu","mekhela sador","folk dance","girls","traditional"],
    featured: true,
  },
  {
    id: "t-009",
    name: "Rajasthani Bandhani Ghoomar Ghagra Set (Girls)",
    category: "traditional-indian",
    price: 450,
    description:
      "Authentic yellow and red bandhani print ghagra choli with yellow odhani, traditional Rajasthani borla, aad necklace and chooda bangles.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.41 PM (2).jpeg"),
    tags: ["rajasthani","bandhani","ghoomar","ghagra","girls","traditional"],
  },
  {
    id: "t-010",
    name: "Kerala Kasavu Traditional Onam Attire (Girls)",
    category: "traditional-indian",
    price: 400,
    description:
      "Classic Kerala Onam Kasavu costume with gold kasavu border, red blouse and traditional jasmine flower hair accessory.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.41 PM.jpeg"),
    tags: ["kerala","kasavu","onam","traditional","girls"],
  },
  {
    id: "t-011",
    name: "Punjabi Bhangra Dance Costume (Boys)",
    category: "traditional-indian",
    price: 450,
    description:
      "High-energy Punjabi Bhangra outfit with bright red & gold kurta, yellow pleated lungi/chadra, matching waistcoat and fan-shaped turla pagdi.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.42 PM (1).jpeg"),
    tags: ["punjabi","bhangra","folk dance","boys","pagdi","red","yellow"],
    featured: true,
  },
  {
    id: "t-012",
    name: "Bengali / Assamese Traditional Kurta Dhoti (Boys)",
    category: "traditional-indian",
    price: 400,
    description:
      "Cream tussar silk kurta paired with white golden-bordered dhoti and traditional red-white cotton gamosa/uttariya.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.42 PM (2).jpeg"),
    tags: ["bengali","assamese","dhoti kurta","boys","traditional","silk"],
  },
  {
    id: "t-013",
    name: "Bengali Lal Paar Saree (Girls)",
    category: "traditional-indian",
    price: 400,
    description:
      "Classic Bengali white silk saree with iconic red border (Lal Paar), red blouse, shankha pola bangles and gold temple jewellery.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.42 PM.jpeg"),
    tags: ["bengali","lal paar","saree","girls","durga puja","traditional"],
  },
  {
    id: "t-014",
    name: "South Indian Royal Red Kurta Dhoti Set (Boys)",
    category: "traditional-indian",
    price: 400,
    description:
      "Rich red silk kurta paired with pristine white pancha dhoti featuring wide gold zari borders and matching angavastram shawl.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.43 PM (1).jpeg"),
    tags: ["south indian","dhoti","kurta","boys","traditional","red"],
  },
  {
    id: "t-015",
    name: "South Indian Kasavu Mundu & Shirt Set (Boys)",
    category: "traditional-indian",
    price: 400,
    description:
      "Traditional cream silk shirt with authentic Kerala kasavu mundu/dhoti and gold border angavastram. Classic festive attire.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.43 PM.jpeg"),
    tags: ["south indian","mundu","kasavu","boys","traditional","cream"],
  },
  {
    id: "t-016",
    name: "Indian Farmer / Kisan Costume with Props (Kids)",
    category: "traditional-indian",
    price: 350,
    description:
      "Authentic Indian farmer fancy dress with red kurta, short printed lungi/dhoti, farmer headscarf, supda grain basket and spade prop.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.44 PM (1).jpeg"),
    tags: ["farmer","kisan","fancy dress","kids","school event","props"],
    featured: true,
  },
  {
    id: "t-017",
    name: "Rajasthani Royal Angrakha & Dhoti (Boys)",
    category: "traditional-indian",
    price: 400,
    description:
      "Pink and yellow bandhani flared angrakha with white dhoti, colorful Rajasthani pagdi turban, pearl necklace and mustache prop.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.44 PM (2).jpeg"),
    tags: ["rajasthani","angrakha","dhoti","boys","pagdi","traditional"],
  },
  {
    id: "t-018",
    name: "Himachali / Kullu Pahadi Boy Costume",
    category: "traditional-indian",
    price: 400,
    description:
      "Royal blue kurta-pyjama with traditional patterned Himachal Kullu waistcoat and authentic embroidered Kullu topi cap.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.44 PM (3).jpeg"),
    tags: ["himachali","pahadi","kullu","boys","traditional","school event"],
    featured: true,
  },
  {
    id: "t-019",
    name: "Odisha Sambalpuri Ikat Kurta Dhoti Set (Boys)",
    category: "traditional-indian",
    price: 400,
    description:
      "Traditional Sambalpuri geometric ikat weave kurta with contrasting black & gold dhoti. Rich handloom-style cultural costume.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.44 PM.jpeg"),
    tags: ["odisha","sambalpuri","ikat","dhoti","boys","traditional"],
  },
  {
    id: "t-020",
    name: "Kashmiri Traditional Couple Pair Costumes",
    category: "traditional-indian",
    price: 750,
    description:
      "Matching boy and girl Kashmiri pheran set in royal blue and magenta with intricate neck embroidery and authentic Kashmiri headgear. Pair rental.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.45 PM (1).jpeg"),
    tags: ["kashmiri","pheran","couple","pair","traditional","school event"],
    featured: true,
  },
  {
    id: "t-021",
    name: "Naga / North-East Tribal Folk Costume (Kids)",
    category: "traditional-indian",
    price: 350,
    description:
      "Authentic red and black striped North-East tribal tunic with beaded shell necklace and traditional feather-and-bead head ornament.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.45 PM.jpeg"),
    tags: ["naga","tribal","adivasi","north east","kids","traditional"],
  },
  {
    id: "t-022",
    name: "North-East Naga Warrior Costume with Spear (Kids)",
    category: "traditional-indian",
    price: 400,
    description:
      "Tribal warrior costume featuring tribal sash, feather headgear, beaded jewellery, face marks, and spear prop with 'Unity in Diversity' banner.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.46 PM.jpeg"),
    tags: ["naga","warrior","tribal","spear","school event","cultural day"],
    featured: true,
  },
  {
    id: "t-023",
    name: "Rajasthani Kalbelia / Folk Dance Flared Costume (Girls)",
    category: "traditional-indian",
    price: 500,
    description:
      "Stunning green and red flared folk dance skirt with silver gota ribbons, embroidered blouse, silver jewellery and head odhani.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.47.13 PM.jpeg"),
    tags: ["rajasthani","kalbelia","folk dance","flared","girls","green","red"],
  },
  {
    id: "t-024",
    name: "Maharashtrian Nauvari Saree in Emerald Green (Girls)",
    category: "traditional-indian",
    price: 450,
    description:
      "Traditional green Kashta / Nauvari saree with bright red border, paired with gold jewellery, Maharashtrian nath (nose ring), and green glass bangles.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.47.34 PM.jpeg"),
    tags: ["maharashtrian","nauvari","kashta","saree","girls","traditional","green"],
    featured: true,
  },
  {
    id: "t-025",
    name: "Odisha Sambalpuri Ikat Dance Saree (Girls)",
    category: "traditional-indian",
    price: 450,
    description:
      "Vibrant red and black Sambalpuri ikat patterned saree with ornate silver kamarbandh waistbelt, silver armlets, and traditional dance jewellery.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.48.02 PM.jpeg"),
    tags: ["sambalpuri","odissi","ikat","saree","girls","folk dance"],
  },
  {
    id: "t-026",
    name: "Kerala Kasavu Saree with Gold Border (Girls)",
    category: "traditional-indian",
    price: 400,
    description:
      "Traditional Kerala Kasavu pleated saree with shimmering gold zari border, contrasting pink blouse, and gold temple belt.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.49.01 PM.jpeg"),
    tags: ["kerala","kasavu","onam","girls","traditional","white"],
  },
  {
    id: "t-027",
    name: "Maharashtrian Nauvari Saree in Royal Peacock Blue (Girls)",
    category: "traditional-indian",
    price: 450,
    description:
      "Stunning peacock blue silk Nauvari saree with silver zari border, pink blouse, gold kamarpatta waist belt, and traditional ornaments.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.49.37 PM.jpeg"),
    tags: ["maharashtrian","nauvari","saree","girls","blue","traditional"],
  },

  // ─── HALLOWEEN & SPOOKY FANCY DRESS ──────────────────────────────────────
  {
    id: "h-001",
    name: "Cute Witch Orange & Black Dress with Pointed Hat (Girls)",
    category: "halloween",
    price: 350,
    description:
      "Charming Halloween witch outfit for girls featuring orange and black corset-style dress, ruffled sleeves, and tall cone witch hat.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.35 PM (1).jpeg"),
    tags: ["witch","halloween","girls","costume","orange","black","hat"],
    featured: true,
  },
  {
    id: "h-002",
    name: "Rainbow Joker / Pennywise Clown Costume with Red Balloon",
    category: "halloween",
    price: 350,
    description:
      "Fun and vibrant rainbow-striped clown jumpsuit with ruffled collar, clown wig, face paint, and signature red balloon prop.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.35 PM.jpeg"),
    tags: ["clown","joker","pennywise","halloween","rainbow","kids","balloon"],
    featured: true,
  },
  {
    id: "h-003",
    name: "Spooky White Ghost / Phantom Flowing Robe (Kids)",
    category: "halloween",
    price: 350,
    description:
      "Eerie full-length white ghost robe with jagged fringe sleeves and hem, complete with mesh face mask for total spooky illusion.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.36 PM (1).jpeg"),
    tags: ["ghost","phantom","white","halloween","spooky","kids"],
  },
  {
    id: "h-004",
    name: "Grim Reaper / Dark Shadow Hooded Robe (Kids)",
    category: "halloween",
    price: 350,
    description:
      "Mysterious black hooded Grim Reaper robe with shredded sheer grey sleeves, jagged hem, and ghostly white face makeup.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.36 PM (2).jpeg"),
    tags: ["grim reaper","reaper","halloween","black","hood","kids","spooky"],
    featured: true,
  },
  {
    id: "h-005",
    name: "Gothic Vampire / Morticia Addams Black Gown (Girls)",
    category: "halloween",
    price: 350,
    description:
      "Sleek and elegant gothic vampire/sorceress gown in jet black with flared batwing sleeves and jagged mermaid-tail hem.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.36 PM (3).jpeg"),
    tags: ["vampire","gothic","morticia","halloween","black dress","girls"],
  },
  {
    id: "h-006",
    name: "Little Witch with Pumpkin Trick-or-Treat Basket (Girls)",
    category: "halloween",
    price: 350,
    description:
      "Classic black witch robe with lime green collar accents, skull-embellished pointed hat with purple feather, and pumpkin candy basket.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.36 PM.jpeg"),
    tags: ["witch","halloween","pumpkin","trick or treat","girls","hat"],
  },
  {
    id: "h-007",
    name: "Twin Witches Trick-or-Treat Halloween Duo (Girls)",
    category: "halloween",
    price: 600,
    description:
      "Matching pair of witch costumes with black robes, green collars, tall pointed hats, spooky eye makeup, and pumpkin baskets. Pair rental.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.37 PM.jpeg"),
    tags: ["witch","pair","halloween","trick or treat","girls","duo"],
    featured: true,
  },
  {
    id: "h-008",
    name: "Count Dracula / Vampire Cape Costume (Boys)",
    category: "halloween",
    price: 350,
    description:
      "Classic vampire costume with red-lined batwing cape, crisp white ruffled shirt, black trousers, and red bow tie.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.57.59 PM (1).jpeg"),
    tags: ["vampire","dracula","cape","halloween","boys","red","black"],
    featured: true,
  },
  {
    id: "h-009",
    name: "Red & Black Sorceress Witch Costume with Feathered Hat",
    category: "halloween",
    price: 350,
    description:
      "Dramatic red and black witch costume with jagged collar, broad-brimmed bright red witch hat with feathery fringe, and spooky makeup.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.57.59 PM (2).jpeg"),
    tags: ["witch","sorceress","halloween","red","black","hat"],
  },
  {
    id: "h-010",
    name: "Dark Witch / Sorceress with Hat & Silver Wig (Girls)",
    category: "halloween",
    price: 350,
    description:
      "Mystical sorceress costume featuring floor-length black robe, black witch hat, long silver wig, spider necklace, and dark gothic eye makeup.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.57.59 PM (3).jpeg"),
    tags: ["witch","sorceress","halloween","black","girls","wig"],
  },
  {
    id: "h-011",
    name: "Red Devil / Demoness Costume with Horns (Teens/Adults)",
    category: "halloween",
    price: 400,
    description:
      "Fierce red metallic shimmer devil dress with flared batwing sleeves, jagged slit hem, and devil horns headband.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.57.59 PM.jpeg"),
    tags: ["devil","demon","halloween","red dress","horns","teens"],
  },
  {
    id: "h-012",
    name: "Cute Witch in Fiery Red-Black Robe with Claw Gloves",
    category: "halloween",
    price: 350,
    description:
      "Playful fiery witch costume with jagged red-and-black tunic, tall red hat with jagged brim, and green monster claw gloves.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.58.00 PM (1).jpeg"),
    tags: ["witch","halloween","claw gloves","girls","red","black"],
  },
  {
    id: "h-013",
    name: "Jack-o'-Lantern Pumpkin Costume for Kids",
    category: "halloween",
    price: 300,
    description:
      "Cute padded orange pumpkin tunic with carved jack-o'-lantern face, green leaf neckline, and matching pumpkin stem cap.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.58.00 PM (2).jpeg"),
    tags: ["pumpkin","jack o lantern","halloween","kids","toddler","orange","cute"],
    featured: true,
  },
  {
    id: "h-014",
    name: "Vampire Bat Costume with Wing Span (Kids)",
    category: "halloween",
    price: 350,
    description:
      "Cool black vampire bat jumpsuit with expandable scalloped bat wings and matching bat ear headband. Perfect for Halloween night.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.58.00 PM (3).jpeg"),
    tags: ["bat","vampire bat","halloween","wings","kids","black"],
    featured: true,
  },
  {
    id: "h-015",
    name: "Halloween Squad Group Costumes (Vampire, Skeleton, Witch)",
    category: "halloween",
    price: 700,
    description:
      "Group party collection featuring Vampire with cape, Skeleton bone costume, Classic Witch, and Mummy ghoul. Great for sibling or friends group rentals.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.58.00 PM.jpeg"),
    tags: ["halloween","group","squad","skeleton","witch","vampire"],
    featured: true,
  },
  {
    id: "h-016",
    name: "Green Goblin / Swamp Monster with Claw Gloves (Kids)",
    category: "halloween",
    price: 350,
    description:
      "Terrifying green monster costume with scale face paint, long metallic silver claw gloves, and shredded black robe.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.58.01 PM (1).jpeg"),
    tags: ["goblin","monster","witch","claws","halloween","spooky"],
  },
  {
    id: "h-017",
    name: "Classic Count Dracula Vampire with Cape & Collar (Boys)",
    category: "halloween",
    price: 350,
    description:
      "Traditional Count Dracula costume with high stand-up collar cape, pleated white tuxedo shirt, black bow tie, and authentic vampire makeup.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.58.01 PM.jpeg"),
    tags: ["dracula","vampire","cape","halloween","boys"],
  },
  {
    id: "h-018",
    name: "Little Devil / Lucifer Costume with Trident & Horns (Kids)",
    category: "halloween",
    price: 350,
    description:
      "Mischievous devil costume featuring black robe, satin red cape, horned hood, and red pitchfork / trident prop.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.58.02 PM (1).jpeg"),
    tags: ["devil","lucifer","horns","trident","pitchfork","halloween","kids"],
    featured: true,
  },
  {
    id: "h-019",
    name: "Dracula / Vampire Kid with Winged Cape",
    category: "halloween",
    price: 350,
    description:
      "Full-length black robe with red winged cape collar and vampire makeup. Dramatic look for school Halloween contests.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.58.02 PM.jpeg"),
    tags: ["vampire","dracula","halloween","cape","kids"],
  },
  {
    id: "h-020",
    name: "Purple Spiderweb Witch with Witch Hat (Girls)",
    category: "halloween",
    price: 350,
    description:
      "Pretty witch dress with purple spiderweb print bodice, purple ruffles, pointed black-and-purple witch hat, and spider face art.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.58.03 PM (1).jpeg"),
    tags: ["witch","spiderweb","purple","halloween","girls","hat"],
    featured: true,
  },
  {
    id: "h-021",
    name: "The Nun / Valak Spooky Costume with Cross (Kids)",
    category: "halloween",
    price: 350,
    description:
      "Iconic horror nun costume with black habit gown, white veil cowl, large cross necklace, white face makeup, and pumpkin basket.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.58.03 PM.jpeg"),
    tags: ["the nun","valak","horror","halloween","cross","kids"],
    featured: true,
  },

  // ─── FESTIVALS & SPECIAL THEMES ──────────────────────────────────────────
  {
    id: "f-001",
    name: "Goa Tourist / Beach Vacation Fancy Dress (Boys)",
    category: "festival",
    price: 300,
    description:
      "Fun vibrant floral Hawaiian-style beach shirt with red shorts. Great for summer theme and travel/vacation school fancy dress.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.45 PM (2).jpeg"),
    tags: ["goa","beach","tourist","fancy dress","boys","hawaiian"],
  },
  {
    id: "f-002",
    name: "Western Royal King / Prince Costume (Kids)",
    category: "festival",
    price: 400,
    description:
      "Regal European-style King costume for boys with golden crown, velvet red cape, golden belt, royal scepter mace, and smart white top with black trousers.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.41 PM (3).jpeg"),
    tags: ["king","prince","western","cape","crown","fancy dress","boys"],
  },
  {
    id: "f-003",
    name: "Red Apple / Fruit Fancy Dress Costume (Kids)",
    category: "festival",
    price: 300,
    description:
      "Adorable plush red apple jumpsuit costume with green leaf collar, matching green hat, and green sleeves. Perfect for kindergarten fancy dress.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.40.42 PM (1).jpeg"),
    tags: ["apple","fruit","fancy dress","kids","toddler","kindergarten","cute"],
    featured: true,
  },
  {
    id: "f-004",
    name: "Hawaiian Hula Dance Costume with Grass Skirt (Kids)",
    category: "festival",
    price: 350,
    description:
      "Tropical Hawaiian hula dancer costume with colorful floral printed crop top and bright yellow fringe grass skirt with flower accents.",
    image: IMG("WhatsApp Image 2026-10-09 at 9.46.39 PM (1).jpeg"),
    tags: ["hawaiian","hula dance","tropical","grass skirt","fancy dress","kids","girls"],
    featured: true,
  },
];

export const categories = [
  {
    id: "garba-navratri" as Category,
    label: "Garba & Navratri",
    emoji: "💃",
    description: "Traditional chaniya choli, lehenga sets for Garba & Navratri",
  },
  {
    id: "mythological" as Category,
    label: "Mythological (Adults)",
    emoji: "🙏",
    description: "Kali Mata, Krishna, and other mythological characters",
  },
  {
    id: "kids-mythological" as Category,
    label: "Kids Mythological & Historic",
    emoji: "👶",
    description: "Bal Krishna, Shiva, Ramayan, Shivaji Maharaj, and Saints",
  },
  {
    id: "traditional-indian" as Category,
    label: "Traditional & Regional Folk",
    emoji: "🪔",
    description: "Kashmiri, Kerala Kasavu, Assamese Bihu, Nauvari, Bhangra & more",
  },
  {
    id: "halloween" as Category,
    label: "Halloween & Spooky Costumes",
    emoji: "🎃",
    description: "Witches, Dracula, Devils, Phantoms, Clowns, and Bats",
  },
  {
    id: "festival" as Category,
    label: "Festivals & Special Themes",
    emoji: "🎉",
    description: "Costumes for annual days, cultural programs, and fun themes",
  },
];
