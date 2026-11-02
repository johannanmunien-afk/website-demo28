import { db } from "./index";
import { products, reviews, type NewProduct } from "./schema";
import { count, eq } from "drizzle-orm";

interface SeedProductEntry {
  product: NewProduct;
  reviews: Array<{
    authorName: string;
    authorTag: string;
    rating: number;
    title: string;
    comment: string;
    verifiedPurchase: boolean;
  }>;
}

const SEED_CATALOG: SeedProductEntry[] = [
  {
    product: {
      slug: "sovereign-terracotta-diffuser",
      name: "Sovereign Terracotta Ultrasonic Diffuser",
      subtitle: "Hand-Finished Porous Stoneware Aroma Diffuser · 300 ml",
      description:
        "Sculpted from unglazed matte terracotta stoneware, our signature ultrasonic diffuser transforms any bedroom, studio, or living room into a tranquil sanctuary. Whisper-quiet mist technology disperses pure botanical essential oils for up to 10 continuous hours without heat, preserving delicate aromatic notes.",
      priceCents: 11800,
      compareAtPriceCents: 14000,
      category: "household",
      subcategory: "Home Fragrance",
      audience: "everyone",
      audiences: ["everyone", "adults"],
      badge: "Kingdom Signature",
      images: [
        "/images/prod-diffuser.jpg",
        "https://images.pexels.com/photos/29904622/pexels-photo-29904622.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "/images/collection-household.jpg",
      ],
      variants: {
        label: "Stone Finish",
        options: ["Raw Terracotta", "Warm Alabaster", "Smoked Olive"],
      },
      highlights: [
        "Artisan-cast matte ceramic cover with BPA-free medical-grade reservoir",
        "Dual mist modes: 5-hour continuous or 10-hour intermittent cadence",
        "Warm candle-glow ambient LED toggle with automatic waterless shut-off",
      ],
      detailsAndCare:
        "Hand-finished stoneware ceramic exterior; BPA-free polypropylene inner reservoir. Dimensions: 11.5 cm diameter × 18 cm height. Includes braided linen-wrapped power cord (1.8 m). Wipe interior weekly with a soft damp cloth.",
      ritualNotes:
        "Fill reservoir to the internal line with filtered room-temperature water and add 6–10 drops of your preferred essential oil blend. Set to intermittent mode thirty minutes before evening rest.",
      stock: 28,
      featured: true,
      ratingAvg: 4.9,
      reviewCount: 3,
    },
    reviews: [
      {
        authorName: "Camille Laurent",
        authorTag: "Verified Buyer · Brooklyn, NY",
        rating: 5,
        title: "Looks like ceramic gallery art on my console",
        comment:
          "I hid plastic diffusers in corners for years. This terracotta piece sits front and center on our travertine table and guests always ask which studio made it. Virtually silent too.",
        verifiedPurchase: true,
      },
      {
        authorName: "Marcus Vance",
        authorTag: "Adult · Chicago, IL",
        rating: 5,
        title: "Elevated my entire home office",
        comment:
          "Got the Raw Terracotta finish for my study. Pairing it with cedar oil makes long workdays feel grounded and calm. Build weight feels genuinely substantial.",
        verifiedPurchase: true,
      },
      {
        authorName: "Maya Lin-Park",
        authorTag: "Young Adult · Seattle, WA",
        rating: 5,
        title: "Worth every penny for small apartments",
        comment:
          "The linen-wrapped cord is such a thoughtful touch! The warm ambient light at night replaces my bedside lamp.",
        verifiedPurchase: true,
      },
    ],
  },
  {
    product: {
      slug: "antwerp-belgian-linen-throw",
      name: "Antwerp Waffle-Weave Belgian Linen Throw",
      subtitle: "100% Organic Stone-Washed Flax Linen · 140 × 200 cm",
      description:
        "Loomed in small batches from long-staple European flax, this generously proportioned waffle-weave throw balances airy breathability with comforting weight. Enzyme stone-washed for immediate drape and lived-in softness that grows more supple with every wash.",
      priceCents: 16400,
      compareAtPriceCents: null,
      category: "household",
      subcategory: "Textiles & Throws",
      audience: "adults",
      audiences: ["adults", "females", "everyone"],
      badge: "Bestseller",
      images: [
        "/images/prod-linen-throw.jpg",
        "https://images.pexels.com/photos/39196722/pexels-photo-39196722.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/5793641/pexels-photo-5793641.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      variants: {
        label: "Colorway",
        options: ["Oatmeal & Sage", "Sunlit Sand", "Sienna Clay"],
      },
      highlights: [
        "OEKO-TEX Standard 100 certified Belgian flax linen (380 GSM)",
        "Thermoregulating honeycomb waffle texture for year-round comfort",
        "Finished with hand-knotted 3 cm eyelash fringe along short edges",
      ],
      detailsAndCare:
        "100% long-staple European flax linen. Machine wash cold on gentle cycle with mild plant detergent. Tumble dry low or line dry in shade to preserve natural loft; do not iron to retain organic waffle dimension.",
      ritualNotes:
        "Drape effortlessly across the foot of a queen or king bed, or keep folded over your reading chair for cool mornings with tea.",
      stock: 19,
      featured: true,
      ratingAvg: 5.0,
      reviewCount: 3,
    },
    reviews: [
      {
        authorName: "Eleanor Vance-Hayes",
        authorTag: "Verified Buyer · Boston, MA",
        rating: 5,
        title: "Heirloom weight without overheating",
        comment:
          "Both my husband and I fight over this throw every evening. The waffle weave has real depth and zero scratchiness right out of the linen dustbag.",
        verifiedPurchase: true,
      },
      {
        authorName: "Julian Mercer",
        authorTag: "Adult · Austin, TX",
        rating: 5,
        title: "Oatmeal & Sage colorway is perfection",
        comment:
          "Subtle, earthy tones that tied our leather sofa and oak coffee table together effortlessly. Washed twice already and it only got softer.",
        verifiedPurchase: true,
      },
      {
        authorName: "Hannah Okafor",
        authorTag: "Female · Atlanta, GA",
        rating: 5,
        title: "My go-to housewarming gift under Esther's Kingdom",
        comment:
          "Ordered one for myself and came back a week later for two more as wedding presents. Truly five-star textile quality.",
        verifiedPurchase: true,
      },
    ],
  },
  {
    product: {
      slug: "fig-leaf-atlas-cedar-candle",
      name: "No. 04 Fig Leaf & Atlas Cedar Botanical Candle",
      subtitle: "Hand-Poured Coconut-Soy Wax · Brass Lid · 65-Hour Burn",
      description:
        "An intoxicating olfactory walk through a sun-warmed Mediterranean orchard at dusk. Crushed green fig leaf, wild bergamot rind, and creamy fig milk settle into an anchoring base of Moroccan Atlas cedarwood and warm vetiver root. Housed in reusable smoked amber glass with a brushed brass snuffing lid.",
      priceCents: 5400,
      compareAtPriceCents: 6200,
      category: "household",
      subcategory: "Home Fragrance",
      audience: "young-adults",
      audiences: ["young-adults", "everyone", "males"],
      badge: "Bestseller",
      images: [
        "/images/prod-candle.jpg",
        "https://images.pexels.com/photos/7233906/pexels-photo-7233906.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/14415003/pexels-photo-14415003.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      variants: {
        label: "Vessel Size",
        options: ["Standard · 280g", "Grand Atelier · 550g"],
      },
      highlights: [
        "100% vegan coconut-soy wax blend with braided unbleached cotton wick",
        "Phthalate-free, paraben-free botanical fragrance & essential oils",
        "Includes heavy brushed-brass lid to extinguish flame without smoke",
      ],
      detailsAndCare:
        "280g / 9.8 oz net weight (approx. 65 hours burn time). Hand-poured in small batches. Once finished, rinse vessel with warm soapy water to repurpose for makeup brushes or vanity storage.",
      ritualNotes:
        "On first lighting, allow wax pool to reach the full perimeter of the amber glass (approximately 2 hours) to prevent tunneling. Trim wick to 5 mm before each subsequent burn.",
      stock: 45,
      featured: true,
      ratingAvg: 4.9,
      reviewCount: 3,
    },
    reviews: [
      {
        authorName: "Devon Morales",
        authorTag: "Young Adult · Los Angeles, CA",
        rating: 5,
        title: "Sophisticated, green, never cloying",
        comment:
          "You can smell the fresh green snap of fig leaves balanced by warm cedar. Even unlit, you catch a gentle scent walking past my bookshelf.",
        verifiedPurchase: true,
      },
      {
        authorName: "Sienna Brooks",
        authorTag: "Young Adult · Denver, CO",
        rating: 5,
        title: "The brass lid alone makes it look twice the price",
        comment:
          "Burns super evenly with zero black soot on the jar. Everyone who visits my apartment asks what candle I'm burning.",
        verifiedPurchase: true,
      },
      {
        authorName: "Liam Gallagher-Chen",
        authorTag: "Male · San Francisco, CA",
        rating: 4,
        title: "Clean unisex scent",
        comment:
          "Not overly floral or sweet—hits that exact woody-botanical note I love. Ordering the Grand Atelier size next.",
        verifiedPurchase: true,
      },
    ],
  },
  {
    product: {
      slug: "solstice-stoneware-carafe-set",
      name: "Solstice Speckled Stoneware Carafe & Tumbler Set",
      subtitle: "3-Piece Wheel-Thrown Ceramic Hydration Set · Matte Glaze",
      description:
        "Designed to honor daily hydration rituals from bedside table to dining room. Wheel-thrown from iron-flecked stoneware clay and dipped in a tactile satin-matte alabaster glaze, the set includes a 950 ml tapered carafe and two nesting tumblers—one doubling neatly as a dust-proof lid.",
      priceCents: 9200,
      compareAtPriceCents: null,
      category: "household",
      subcategory: "Artisanal Ceramics",
      audience: "females",
      audiences: ["females", "adults", "everyone"],
      badge: "Artisan Craft",
      images: [
        "/images/prod-ceramic-set.jpg",
        "https://images.pexels.com/photos/29378867/pexels-photo-29378867.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "/images/collection-household.jpg",
      ],
      variants: {
        label: "Glaze",
        options: ["Speckled Alabaster", "Dune Sand"],
      },
      highlights: [
        "Includes 950 ml carafe plus two 260 ml ergonomic ceramic tumblers",
        "Lead-free, food-safe satin stoneware fired at 1,240°C for durability",
        "Subtle raw clay foot ring prevents slipping on stone or wood nightstands",
      ],
      detailsAndCare:
        "High-fired speckled stoneware ceramic. Dishwasher safe on top rack; hand washing recommended to preserve the artisanal matte glaze luster over decades.",
      ritualNotes:
        "Fill before bed and invert one tumbler over the carafe neck to keep midnight water crisp, cool, and protected.",
      stock: 16,
      featured: false,
      ratingAvg: 4.8,
      reviewCount: 3,
    },
    reviews: [
      {
        authorName: "Clara Lindqvist",
        authorTag: "Female · Minneapolis, MN",
        rating: 5,
        title: "Turned drinking water into a ritual",
        comment:
          "Each tumbler fits so naturally in the palm, and the tiny natural iron speckles through the cream glaze feel warm and handmade.",
        verifiedPurchase: true,
      },
      {
        authorName: "Nadia Al-Mansoor",
        authorTag: "Adult · Washington, DC",
        rating: 5,
        title: "Gorgeous guest bedroom touch",
        comment:
          "Placed this set on our guest nightstand with fresh eucalyptus nearby—looks straight out of a boutique hotel.",
        verifiedPurchase: true,
      },
      {
        authorName: "Tessa Nguyen",
        authorTag: "Young Adult · Portland, OR",
        rating: 4,
        title: "Lovely craftsmanship",
        comment:
          "Pours cleanly without dripping down the spout, which is rare for ceramic carafes! Very pleased.",
        verifiedPurchase: true,
      },
    ],
  },
  {
    product: {
      slug: "monarch-oak-brass-valet-tray",
      name: "Monarch Smoked Oak & Brass Valet Catchall Tray",
      subtitle: "Solid European White Oak & Brushed Brass Desk Organizer",
      description:
        "Carved from a single block of FSC-certified European white oak and accented with a removable solid brushed-brass rail divider. Created to bring architectural order to watches, signet rings, eyewear, everyday carry keys, or vanity flacons.",
      priceCents: 7800,
      compareAtPriceCents: null,
      category: "household",
      subcategory: "Home Organization",
      audience: "males",
      audiences: ["males", "adults"],
      badge: "New Arrival",
      images: [
        "https://images.pexels.com/photos/20541349/pexels-photo-20541349.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/39774571/pexels-photo-39774571.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/8128872/pexels-photo-8128872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      variants: {
        label: "Wood Tone",
        options: ["Smoked Walnut Oak", "Natural Honey Oak"],
      },
      highlights: [
        "CNC-milled and hand-sanded solid oak sealed with plant-based beeswax oil",
        "Solid milled brass divider bar protects watch crowns and jewelry",
        "Recessed micro-suede base pads safeguard marble and lacquered furniture",
      ],
      detailsAndCare:
        "Solid European oak & solid brushed brass. Dimensions: 28 cm × 16 cm × 2.6 cm. Dust with a dry microfiber cloth; nourish wood grain annually with a drop of natural mineral or beeswax oil.",
      ritualNotes:
        "Position by the entryway console or dresser to create an effortless anchor for your daily essentials the moment you step home.",
      stock: 22,
      featured: false,
      ratingAvg: 4.9,
      reviewCount: 3,
    },
    reviews: [
      {
        authorName: "David Sterling",
        authorTag: "Male · New York, NY",
        rating: 5,
        title: "Hefty, masculine, impeccably milled",
        comment:
          "Finally an everyday carry tray that doesn't use faux leather. The smoked oak grain and solid brass insert hold my watch, wallet, and keys cleanly.",
        verifiedPurchase: true,
      },
      {
        authorName: "Rachel Kim",
        authorTag: "Female · Dallas, TX",
        rating: 5,
        title: "Bought for my partner, ended up getting a second for my perfume bottles",
        comment:
          "Works equally well on a men's dresser or holding amber skincare serums in the bathroom. Stunning woodwork.",
        verifiedPurchase: true,
      },
      {
        authorName: "Andre Baptiste",
        authorTag: "Adult · Miami, FL",
        rating: 5,
        title: "Zero wobble, museum-grade finish",
        comment:
          "Suede pads underneath keep my glass desk scratch-free. Packaging from Esther's Kingdom was top tier.",
        verifiedPurchase: true,
      },
    ],
  },
  {
    product: {
      slug: "vesper-vetiver-linen-room-mist",
      name: "Vesper Vetiver & Bergamot Linen & Room Mist",
      subtitle: "Fine Botanical Textile & Sanctuary Spray · 150 ml Amber Glass",
      description:
        "An instant atmospheric reset bottled in UV-protective apothecary glass. Distilled with organic witch hazel hydrosol, Haitian vetiver, Calabrian bergamot, and calming Roman chamomile to refresh bed linens, curtains, upholstery, and evening air without staining delicate textiles.",
      priceCents: 3800,
      compareAtPriceCents: null,
      category: "household",
      subcategory: "Home Fragrance",
      audience: "young-adults",
      audiences: ["young-adults", "females"],
      badge: null,
      images: [
        "https://images.pexels.com/photos/39612710/pexels-photo-39612710.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/17307177/pexels-photo-17307177.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "/images/hero-kingdom.jpg",
      ],
      variants: {
        label: "Aroma Profile",
        options: ["Vetiver & Bergamot", "White Tea & Neroli"],
      },
      highlights: [
        "Non-aerosol micro-fine brass atomizer delivers an ultra-dry cloud mist",
        "Safe on linen, organic cotton, wool throws, and cashmere",
        "Alcohol-free botanical hydrosol base—gentle around sensitive noses",
      ],
      detailsAndCare:
        "150 ml / 5.0 fl oz recyclable amber glass bottle. Ingredients: Aqua, Hamamelis Virginiana Distillate, Vetiveria Zizanoides Root Oil, Citrus Aurantium Bergamia Peel Oil, Anthemis Nobilis Flower Oil.",
      ritualNotes:
        "Mist 3–4 times from 30 cm above freshly made sheets or across living room drapery before welcoming guests.",
      stock: 52,
      featured: false,
      ratingAvg: 4.8,
      reviewCount: 3,
    },
    reviews: [
      {
        authorName: "Zoe Castellanos",
        authorTag: "Young Adult · Philadelphia, PA",
        rating: 5,
        title: "My nightly sleep cue",
        comment:
          "Two spritzes on my linen pillowcases every night and my brain immediately switches off. Doesn't leave damp spots at all.",
        verifiedPurchase: true,
      },
      {
        authorName: "Owen Pritchard",
        authorTag: "Young Adult · Nashville, TN",
        rating: 5,
        title: "Instant apartment refresh after cooking",
        comment:
          "Clears kitchen aromas naturally without smelling artificial. Vetiver & Bergamot is crisp and grounding.",
        verifiedPurchase: true,
      },
      {
        authorName: "Grace Cho",
        authorTag: "Adult · San Diego, CA",
        rating: 4,
        title: "Fine mist sprayer is super luxe",
        comment:
          "Love that it uses a metal mist collar and dark glass bottle. Subtle, natural scent longevity.",
        verifiedPurchase: true,
      },
    ],
  },
  {
    product: {
      slug: "aurelia-neroli-bakuchiol-serum",
      name: "Aurelia Golden Neroli & Bakuchiol Radiance Serum",
      subtitle: "Plant-Retinol Cellular Renewal Facial Elixir · 30 ml",
      description:
        "Our flagship botanical skincare elixir delivers all the smoothing, firming brilliance of retinol without irritation or sun sensitivity. Clinical-grade 1.5% Sytenol® A Bakuchiol is suspended in cold-pressed cloudberry seed oil, Moroccan neroli blossom, and olive-derived squalane for luminous, glass-smooth skin across every complexion.",
      priceCents: 7600,
      compareAtPriceCents: 8800,
      category: "beauty",
      subcategory: "Skincare Serums",
      audience: "females",
      audiences: ["females", "adults"],
      badge: "Kingdom Signature",
      images: [
        "/images/prod-serum.jpg",
        "https://images.pexels.com/photos/39400892/pexels-photo-39400892.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/39452544/pexels-photo-39452544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      variants: {
        label: "Bottle Volume",
        options: ["30 ml / 1.0 fl oz", "50 ml / 1.7 fl oz"],
      },
      highlights: [
        "1.5% pure plant-derived Bakuchiol visibly refines texture & fine lines",
        "Featherlight dry-oil absorption—never greasy under SPF or makeup",
        "Dermatologist-tested, cruelty-free, and safe for sensitive skin barriers",
      ],
      detailsAndCare:
        "30 ml frosted amber glass dropper bottle. Key Actives: Bakuchiol (1.5%), Squalane, Rosa Canina Fruit Oil, Rubus Chamaemorus Seed Oil, Citrus Aurantium Amara Flower Oil, Tocopherol (Vitamin E). Store away from direct midday heat.",
      ritualNotes:
        "Warm 4 golden drops between palms and press gently into damp skin morning and evening after cleansing or misting.",
      stock: 34,
      featured: true,
      ratingAvg: 4.9,
      reviewCount: 4,
    },
    reviews: [
      {
        authorName: "Isabelle Moreau",
        authorTag: "Female · Montreal, QC",
        rating: 5,
        title: "Replaced three serums on my shelf",
        comment:
          "Traditional retinol always made my cheeks flake. After three weeks of Aurelia, my skin tone looks remarkably even, calm, and dewy.",
        verifiedPurchase: true,
      },
      {
        authorName: "Priya Ramanathan",
        authorTag: "Adult · San Jose, CA",
        rating: 5,
        title: "Liquid gold without heaviness",
        comment:
          "Sinks right into damp skin in seconds and smells faintly of real neroli blossoms. Makeup glides over it beautifully.",
        verifiedPurchase: true,
      },
      {
        authorName: "Jordan Ellis",
        authorTag: "Young Adult · Brooklyn, NY",
        rating: 5,
        title: "Saved my post-winter dull skin",
        comment:
          "Zero breakouts on my combination skin and my post-blemish marks faded noticeably faster.",
        verifiedPurchase: true,
      },
      {
        authorName: "Simone Laurent",
        authorTag: "Female · Chicago, IL",
        rating: 5,
        title: "Pure luxury",
        comment:
          "The brushed gold dropper dispenses the exact amount needed. Already on my second bottle.",
        verifiedPurchase: true,
      },
    ],
  },
  {
    product: {
      slug: "velvet-oat-rosehip-cleanser",
      name: "Velvet Oat & Wild Rosehip Gentle Cream Cleanser",
      subtitle: "pH-Balanced Barrier-Soothing Daily Wash · 200 ml",
      description:
        "Formulated for every face under one kingdom—from reactive young skin to mature dry complexions. Colloidal Nordic oat silk, cold-pressed Andean rosehip, and panthenol melt away daily impurities, mineral sunscreen, and urban dust while leaving the skin's lipid barrier soft, calm, and hydrated.",
      priceCents: 4400,
      compareAtPriceCents: null,
      category: "beauty",
      subcategory: "Cleansers & Tonics",
      audience: "everyone",
      audiences: ["everyone", "young-adults", "males"],
      badge: "Bestseller",
      images: [
        "/images/prod-cleanser.jpg",
        "https://images.pexels.com/photos/39448506/pexels-photo-39448506.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/39392892/pexels-photo-39392892.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      variants: {
        label: "Formula",
        options: ["Fragrance-Free Oat", "Wild Rosehip & Chamomile"],
      },
      highlights: [
        "Optimal pH 5.3 non-stripping cream-to-milk emulsion (sulfate-free)",
        "Colloidal oat beta-glucans calm redness after shaving or exfoliation",
        "Heavy refillable amber apothecary glass with lockable dispenser pump",
      ],
      detailsAndCare:
        "200 ml / 6.7 fl oz amber glass pump bottle. Vegan, cruelty-free, silicone-free, SLS-free. Suitable for morning and evening cleansing across all skin types.",
      ritualNotes:
        "Massage two pumps onto dry or damp skin for 60 full seconds, breathing deeply, then rinse thoroughly with lukewarm water or wipe away with a warm damp linen cloth.",
      stock: 48,
      featured: true,
      ratingAvg: 4.9,
      reviewCount: 3,
    },
    reviews: [
      {
        authorName: "Noah Takahashi",
        authorTag: "Male · Seattle, WA",
        rating: 5,
        title: "Zero tightness after washing or shaving",
        comment:
          "My partner and I share this in the shower. It cleans off SPF effortlessly without that squeaky, tight feeling foaming cleansers leave behind.",
        verifiedPurchase: true,
      },
      {
        authorName: "Amara Osei",
        authorTag: "Young Adult · Toronto, ON",
        rating: 5,
        title: "Holy grail for sensitive barriers",
        comment:
          "Got the Fragrance-Free Oat version when my skin barrier was stressed and within four days my redness vanished.",
        verifiedPurchase: true,
      },
      {
        authorName: "Claire Whitman",
        authorTag: "Adult · Charlotte, NC",
        rating: 5,
        title: "Silky texture & gorgeous bottle",
        comment:
          "Looks like an Aesop apothecary piece by our sink, and a single bottle lasts nearly three months.",
        verifiedPurchase: true,
      },
    ],
  },
  {
    product: {
      slug: "sovereign-shea-hinoki-body-balm",
      name: "Sovereign Shea & Hinoki Whipped Body Balm",
      subtitle: "Cold-Pressed Unrefined Shea, Squalane & Japanese Cypress · 180 ml",
      description:
        "Triple-whipped to an airy soufflé consistency that melts on contact into a velvety satin sheen. Fair-trade Ghanaian shea butter, ceramide-rich meadowfoam seed oil, and sacred Japanese Hinoki cypress envelop parched skin in 24-hour moisture and serene forest-bath aromatics.",
      priceCents: 5800,
      compareAtPriceCents: 6800,
      category: "beauty",
      subcategory: "Body & Bath",
      audience: "adults",
      audiences: ["adults", "females"],
      badge: "Winter Ritual",
      images: [
        "/images/prod-body-balm.jpg",
        "https://images.pexels.com/photos/36339062/pexels-photo-36339062.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "/images/collection-beauty.jpg",
      ],
      variants: {
        label: "Botanical Infusion",
        options: ["Hinoki & Warm Amber", "Sweet Almond & Vanilla Bean"],
      },
      highlights: [
        "Waterless concentrated soufflé—a fingernail-sized scoop covers limbs",
        "Restores cracked knuckles, elbows, and post-shower dryness instantly",
        "Packaged in heavy UV-shielding amber glass with brushed brass lid",
      ],
      detailsAndCare:
        "180 ml / 6.1 fl oz wide-mouth glass jar. Keep in a cool bathroom cabinet below 28°C to maintain whipped cloud texture.",
      ritualNotes:
        "Apply immediately after bathing while skin still holds gentle warmth and steam to lock in deep hydration.",
      stock: 27,
      featured: true,
      ratingAvg: 5.0,
      reviewCount: 3,
    },
    reviews: [
      {
        authorName: "Margot Vance",
        authorTag: "Adult · Salt Lake City, UT",
        rating: 5,
        title: "Survives high-altitude dry winters",
        comment:
          "Hinoki & Warm Amber smells like a Kyoto cedar spa. Absorbs cleanly enough that you can slip into linen pajamas five minutes later.",
        verifiedPurchase: true,
      },
      {
        authorName: "Samuel Adeyemi",
        authorTag: "Male · Houston, TX",
        rating: 5,
        title: "Unbelievable texture and woody aroma",
        comment:
          "Most body butters feel sticky; this whips into an almost dry-touch cashmere finish. Huge fan.",
        verifiedPurchase: true,
      },
      {
        authorName: "Elena Rostova",
        authorTag: "Female · New York, NY",
        rating: 5,
        title: "Pure indulgence every night",
        comment:
          "Bought Sweet Almond & Vanilla Bean for my bedside table. My hands and cuticles have never looked healthier.",
        verifiedPurchase: true,
      },
    ],
  },
  {
    product: {
      slug: "crown-atlas-cedar-grooming-elixir",
      name: "Crown Atlas Cedar & Jojoba Beard & Face Elixir",
      subtitle: "Fast-Absorbing Cold-Pressed Botanical Conditioning Oil · 50 ml",
      description:
        "Crafted for effortless daily grooming—whether conditioning coarse facial hair, soothing freshly shaved skin, or hydrating wind-chapped complexions. Golden organic jojoba, Abyssinian seed oil, and Moroccan argan soften without shine, finished with subtle notes of Atlas cedarwood and cracked black pepper.",
      priceCents: 4800,
      compareAtPriceCents: null,
      category: "beauty",
      subcategory: "Grooming & Botanicals",
      audience: "males",
      audiences: ["males", "young-adults"],
      badge: "For Him & All",
      images: [
        "https://images.pexels.com/photos/39281918/pexels-photo-39281918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/36238538/pexels-photo-36238538.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/5113049/pexels-photo-5113049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      ],
      variants: {
        label: "Scent Note",
        options: ["Atlas Cedar & Black Pepper", "Sandalwood & Vetiver"],
      },
      highlights: [
        "Biomimetic golden jojoba mirrors natural skin sebum to prevent clogged pores",
        "Eliminates beard itch, flakiness, and post-razor irritation",
        "Precision glass pipette dispenses exact drops with zero spill",
      ],
      detailsAndCare:
        "50 ml / 1.7 fl oz amber glass bottle. 100% cold-pressed plant oils, zero silicones, zero mineral oil, zero synthetic parfum.",
      ritualNotes:
        "Dispense 3–5 drops into palms, rub briskly to warm, and comb fingers upward through facial hair and across cheekbones.",
      stock: 31,
      featured: false,
      ratingAvg: 4.9,
      reviewCount: 3,
    },
    reviews: [
      {
        authorName: "Harrison Cole",
        authorTag: "Male · Denver, CO",
        rating: 5,
        title: "Best grooming oil I've ever owned",
        comment:
          "Softens stubble immediately without making my collar greasy, and the subtle cedar-pepper scent gets compliments without overpowering cologne.",
        verifiedPurchase: true,
      },
      {
        authorName: "Mateo Silva",
        authorTag: "Young Adult · Miami, FL",
        rating: 5,
        title: "Doubles as an awesome post-shave serum",
        comment:
          "I stay clean-shaven and use three drops after razor shaving—zero razor bumps since switching.",
        verifiedPurchase: true,
      },
      {
        authorName: "Olivia Bennett",
        authorTag: "Female · Boston, MA",
        rating: 5,
        title: "Gifted to my brother & dad",
        comment:
          "Both of them texted me within a week asking where I found Esther's Kingdom. Packaging looks super refined.",
        verifiedPurchase: true,
      },
    ],
  },
  {
    product: {
      slug: "dewdrop-niacinamide-clarity-serum",
      name: "Dewdrop Niacinamide & Prickly Pear Clarity Gel-Serum",
      subtitle: "Lightweight Pore-Refining & Barrier Hydrator · 30 ml",
      description:
        "An ultra-fresh aqueous gel-serum engineered for active, modern routines. 5% pharmaceutical-grade Niacinamide (Vitamin B3), desert prickly pear stem extract, and multi-molecular hyaluronic acid balance excess T-zone shine, visibly tighten pores, and flood thirsty skin with weightless bounce.",
      priceCents: 3600,
      compareAtPriceCents: null,
      category: "beauty",
      subcategory: "Skincare Serums",
      audience: "young-adults",
      audiences: ["young-adults", "everyone"],
      badge: "Youth Favorite",
      images: [
        "https://images.pexels.com/photos/39400913/pexels-photo-39400913.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/7020055/pexels-photo-7020055.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "/images/collection-beauty.jpg",
      ],
      variants: {
        label: "Strength",
        options: ["5% Niacinamide Daily", "10% Intensive Clarity"],
      },
      highlights: [
        "Oil-free, non-comedogenic hydration ideal for humid climates & active lifestyles",
        "Zinc PCA + Niacinamide calm blemish-prone areas without drying",
        "Fragrance-free formula layers seamlessly under moisturizer or sunscreen",
      ],
      detailsAndCare:
        "30 ml recyclable glass dropper bottle. Vegan, oil-free, fragrance-free, alcohol-free.",
      ritualNotes:
        "Apply one full dropper onto clean skin morning and night before moisturizer or facial oil.",
      stock: 56,
      featured: false,
      ratingAvg: 4.8,
      reviewCount: 3,
    },
    reviews: [
      {
        authorName: "Chloe Park",
        authorTag: "Young Adult · Los Angeles, CA",
        rating: 5,
        title: "Zero pilling, instant glass-skin bounce",
        comment:
          "So many niacinamide serums foam up or pill under sunscreen—Dewdrop sinks right in like silk water. Obsessed!",
        verifiedPurchase: true,
      },
      {
        authorName: "Ethan Brooks",
        authorTag: "Young Adult · Austin, TX",
        rating: 5,
        title: "Simple, effective, keeps shine down all day",
        comment:
          "Started a basic 2-step routine with the Velvet Oat Cleanser and this serum. My skin hasn't been this clear in years.",
        verifiedPurchase: true,
      },
      {
        authorName: "Mei-Ling Zhou",
        authorTag: "Female · Vancouver, BC",
        rating: 4,
        title: "Gentle 5% sweet spot",
        comment:
          "Love that they offer a 5% daily option—clinically proven strength without irritating sensitive cheeks.",
        verifiedPurchase: true,
      },
    ],
  },
  {
    product: {
      slug: "rosemary-mint-botanical-scalp-tonic",
      name: "Rosemary Mint & Biotin Botanical Scalp & Hair Tonic",
      subtitle: "Invigorating Root-Strengthening Herbal Leave-In Elixir · 100 ml",
      description:
        "Healthy, lustrous hair begins at the scalp. Our weightless water-based botanical tonic combines organic Mediterranean rosemary leaf distillate, cooling peppermint, plant biotin, and fermented rice water peptides to energize follicles, soothe dry scalp tension, and add natural root volume without oily residue.",
      priceCents: 4200,
      compareAtPriceCents: 5000,
      category: "beauty",
      subcategory: "Hair & Scalp Rituals",
      audience: "everyone",
      audiences: ["everyone", "females", "males"],
      badge: "New Arrival",
      images: [
        "https://images.pexels.com/photos/39452544/pexels-photo-39452544.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "https://images.pexels.com/photos/39612710/pexels-photo-39612710.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "/images/prod-serum.jpg",
      ],
      variants: {
        label: "Applicator",
        options: ["Glass Pipette · 100 ml", "Fine Mist Pump · 100 ml"],
      },
      highlights: [
        "Water-based leave-in formula—no greasy roots or mandatory wash-out",
        "Organic rosemary, caffeine & biotin support denser, resilient strands",
        "Universal ritual for straight, wavy, curly, coily, or protective hairstyles",
      ],
      detailsAndCare:
        "100 ml / 3.4 fl oz amber glass bottle. Silicone-free, paraben-free, color-safe.",
      ritualNotes:
        "Part damp or dry hair in sections, apply along the scalp, and massage gently with fingertips for two minutes to stimulate micro-circulation.",
      stock: 39,
      featured: false,
      ratingAvg: 4.9,
      reviewCount: 3,
    },
    reviews: [
      {
        authorName: "Brianna Washington",
        authorTag: "Female · Atlanta, GA",
        rating: 5,
        title: "Cooling relief without weighing down curls",
        comment:
          "Because it's hydrosol-based rather than heavy castor oil, I can use it three times a week between wash days and my roots stay bouncy and fresh.",
        verifiedPurchase: true,
      },
      {
        authorName: "Daniel Lindholm",
        authorTag: "Male · Minneapolis, MN",
        rating: 5,
        title: "Refreshing morning scalp wake-up",
        comment:
          "The tingle of peppermint and rosemary after a morning shower feels incredible and my hair looks noticeably fuller at the crown.",
        verifiedPurchase: true,
      },
      {
        authorName: "Sofia Alvarez",
        authorTag: "Young Adult · Phoenix, AZ",
        rating: 5,
        title: "Baby hairs thriving!",
        comment:
          "Two months in and my temples look noticeably denser. Smells like fresh crushed herbs.",
        verifiedPurchase: true,
      },
    ],
  },
];

let seedingPromise: Promise<void> | null = null;

export async function ensureSeeded(): Promise<void> {
  if (seedingPromise) {
    return seedingPromise;
  }

  seedingPromise = (async () => {
    try {
      const [{ total }] = await db.select({ total: count() }).from(products);
      if (Number(total) > 0) {
        return;
      }

      for (const entry of SEED_CATALOG) {
        const [inserted] = await db
          .insert(products)
          .values(entry.product)
          .onConflictDoNothing({ target: products.slug })
          .returning();

        const targetProduct =
          inserted ??
          (
            await db
              .select()
              .from(products)
              .where(eq(products.slug, entry.product.slug))
          )[0];

        if (targetProduct && entry.reviews.length > 0) {
          await db.insert(reviews).values(
            entry.reviews.map((rev) => ({
              productId: targetProduct.id,
              authorName: rev.authorName,
              authorTag: rev.authorTag,
              rating: rev.rating,
              title: rev.title,
              comment: rev.comment,
              verifiedPurchase: rev.verifiedPurchase,
            }))
          );
        }
      }
    } finally {
      seedingPromise = null;
    }
  })();

  return seedingPromise;
}
