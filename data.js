// Honeydew Restaurant, Ajmer - Master Menu & Config Data Store (English Version)

const HONEYDEW_DEFAULT_CONFIG = {
  restaurantName: "Honeydew Restaurant",
  hindiName: "हनीड्यू रेस्टोरेंट, अजमेर",
  tagline: "The Heritage Taste of Ajmer • Serving Authenticity Since 1970",
  description: "Located directly opposite Ajmer Junction Railway Station Gate No. 1, Honeydew Restaurant has been the premier culinary destination for tourists, railway travelers, and pilgrims visiting Ajmer Sharif Dargah and Pushkar for over 50 years. Renowned for authentic Mughlai specials, Pure Vegetarian feasts, Royal Sweets, Fresh Fruit Juices, and grand event celebrations.",
  establishedYear: "1970",
  phone: "+91 94140 12345",
  rawPhone: "919414012345",
  whatsapp: "+91 94140 12345",
  rawWhatsapp: "919414012345",
  email: "info@honeydewajmer.com",
  address: "Station Road, Ramganj, Directly Opposite Ajmer Junction Railway Station, Ajmer, Rajasthan - 305001",
  landmark: "Directly opposite Gate No. 1, Ajmer Railway Station (1 min walk)",
  distanceDargah: "1.8 km (Only 7 mins drive from Dargah Sharif)",
  distanceStation: "100 meters (1 min walk from Ajmer Junction)",
  distancePushkar: "12 km (Pushkar Lake & Brahma Temple)",
  workingHours: "11:00 AM to 11:30 PM (Open All 7 Days)",
  defaultBookingFee: 150, // advance booking confirmation fee in INR (100% adjustable in final bill)
  partyBookingFee: 1000, // advance booking confirmation fee for parties/events in INR
  upiId: "honeydew.ajmer@okaxis",
  upiName: "Honeydew Restaurant",
  adminUser: "admin",
  adminPass: "honeydew@123",
  googleMapsUrl: "https://maps.google.com/?q=Honeydew+Restaurant+Ajmer+Station+Road",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.9566270601955!2d74.6367351!3d26.4526543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396be6e257cfda47%3A0xe979ca6d396ec2b9!2sAjmer%20Junction!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
};

// Distinct, Dedicated Menu Categories
const MENU_CATEGORIES = [
  { id: "all", name: "All Dishes", icon: "fa-utensils" },
  { id: "nonveg", name: "🥩 Royal Non-Veg", icon: "fa-drumstick-bite" },
  { id: "veg", name: "🥦 Pure Vegetarian", icon: "fa-leaf" },
  { id: "sweets", name: "🍮 Royal Sweets", icon: "fa-cake-candles" },
  { id: "juices", name: "🥤 Fresh Juices & Shakes", icon: "fa-wine-glass" },
  { id: "tandoor", name: "🔥 Tandoor & Breads", icon: "fa-fire-burner" },
  { id: "quick", name: "🍱 Traveler Combos", icon: "fa-train" }
];

// Master Menu Items with Dedicated Veg, Non-Veg, Sweets & Juices
const INITIAL_MENU_ITEMS = [
  // ==================== 1. ROYAL NON-VEG SPECIALS ====================
  {
    id: "dish-nv-1",
    name: "Royal Mutton Rogan Josh (मटन रोगन जोश)",
    category: "nonveg",
    type: "non-veg",
    price: 380,
    rating: 4.9,
    reviews: 430,
    badge: "Chef's Special",
    description: "Tender mutton slow-cooked on gentle flame with whole Kashmiri spices, pure ghee, and rich aromatic gravy.",
    image: "assets/dishes/dish-nv-1.jpg",
    prepTime: "25 Mins",
    inStock: true
  },
  {
    id: "dish-nv-2",
    name: "Honeydew Special Chicken Dum Biryani",
    category: "nonveg",
    type: "non-veg",
    price: 290,
    rating: 4.9,
    reviews: 680,
    badge: "Best Seller",
    description: "Fragrant long-grain aged Basmati rice layered with juicy chicken, saffron, mint, and sealed in clay handi. Served with raita and salan.",
    image: "assets/dishes/dish-nv-2.jpg",
    prepTime: "20 Mins",
    inStock: true
  },
  {
    id: "dish-nv-3",
    name: "Classic Butter Chicken (शाही बटर चिकन)",
    category: "nonveg",
    type: "non-veg",
    price: 340,
    rating: 4.9,
    reviews: 520,
    badge: "All-Time Favorite",
    description: "Charcoal tandoor-grilled chicken tikka immersed in a silky, velvety tomato-cashew makhani gravy enriched with Amul butter.",
    image: "assets/dishes/dish-nv-3.jpg",
    prepTime: "20 Mins",
    inStock: true
  },
  {
    id: "dish-nv-4",
    name: "Royal Mughlai Mutton Korma (शाही मटन कोरमा)",
    category: "nonveg",
    type: "non-veg",
    price: 390,
    rating: 4.8,
    reviews: 310,
    badge: "Royal Mughlai",
    description: "Rich Mughlai delicacy cooked with cashew-almond paste, brown onions, kewra water, and fragrant green cardamom.",
    image: "assets/dishes/dish-nv-4.jpg",
    prepTime: "25 Mins",
    inStock: true
  },
  {
    id: "dish-nv-5",
    name: "Tandoori Murgh Full/Half (तंदूरी मुर्ग)",
    category: "nonveg",
    type: "non-veg",
    price: 320,
    rating: 4.8,
    reviews: 390,
    badge: "Tandoori Classic",
    description: "Whole tender chicken marinated in spiced hung yogurt, Kashmiri chilies, and roasted crisp in traditional coal clay oven.",
    image: "assets/dishes/dish-nv-5.jpg",
    prepTime: "20 Mins",
    inStock: true
  },
  {
    id: "dish-nv-6",
    name: "Juicy Mutton Seekh Kebab (मटन सीक कबाब)",
    category: "nonveg",
    type: "non-veg",
    price: 310,
    rating: 4.9,
    reviews: 275,
    badge: "Party Starter",
    description: "Finely minced mutton infused with fresh mint, coriander, and royal spices, skewered and char-grilled to juicy perfection.",
    image: "assets/dishes/dish-nv-6.jpg",
    prepTime: "15 Mins",
    inStock: true
  },
  {
    id: "dish-nv-7",
    name: "Murgh Malai Tikka (मुर्ग मलाई टिक्का)",
    category: "nonveg",
    type: "non-veg",
    price: 290,
    rating: 4.8,
    reviews: 240,
    badge: "Creamy & Mild",
    description: "Mouth-melting boneless chicken chunks marinated in cashew cream, cheese, cardamom, and roasted delicately.",
    image: "assets/dishes/dish-nv-7.jpg",
    prepTime: "18 Mins",
    inStock: true
  },
  {
    id: "dish-nv-8",
    name: "Chicken Tikka Masala (चिकन टिक्का मसाला)",
    category: "nonveg",
    type: "non-veg",
    price: 330,
    rating: 4.8,
    reviews: 315,
    badge: "Zesty & Spicy",
    description: "Smoky tandoori chicken tikka tossed in a thick, semi-dry spiced onion-tomato gravy with bell peppers.",
    image: "assets/dishes/dish-nv-8.jpg",
    prepTime: "20 Mins",
    inStock: true
  },
  {
    id: "dish-nv-9",
    name: "Crispy Amritsari Fish Fry (अमृतसरी फिश फ्राई)",
    category: "nonveg",
    type: "non-veg",
    price: 350,
    rating: 4.7,
    reviews: 190,
    badge: "Golden Crispy",
    description: "Fresh boneless fish fillets coated in seasoned carom seed (ajwain) and gram flour batter, fried golden and crisp.",
    image: "assets/dishes/dish-nv-9.jpg",
    prepTime: "15 Mins",
    inStock: true
  },

  // ==================== 2. PURE VEG DELICACIES ====================
  {
    id: "dish-vg-1",
    name: "Amritsari Dal Makhani (अमृतसरी दाल मखनी)",
    category: "veg",
    type: "veg",
    price: 240,
    rating: 4.9,
    reviews: 740,
    badge: "Honeydew Signature",
    description: "Black whole lentils and kidney beans slow-simmered overnight over charcoal embers, blended with fresh cream and butter.",
    image: "assets/dishes/dish-vg-1.jpg",
    prepTime: "15 Mins",
    inStock: true
  },
  {
    id: "dish-vg-2",
    name: "Paneer Butter Masala (पनीर बटर मसाला)",
    category: "veg",
    type: "veg",
    price: 260,
    rating: 4.9,
    reviews: 580,
    badge: "Top Favorite",
    description: "Soft fresh cottage cheese cubes cooked in a luxurious, creamy tomato and cashew nut gravy touched with fenugreek.",
    image: "assets/dishes/dish-vg-2.jpg",
    prepTime: "15 Mins",
    inStock: true
  },
  {
    id: "dish-vg-3",
    name: "Royal Kadhai Paneer (शाही कड़ाही पनीर)",
    category: "veg",
    type: "veg",
    price: 260,
    rating: 4.8,
    reviews: 390,
    badge: "Robust & Flavorful",
    description: "Paneer cubes tossed with fresh bell peppers, onions, and freshly ground coriander-chili spices in an iron kadhai.",
    image: "assets/dishes/dish-vg-3.jpg",
    prepTime: "15 Mins",
    inStock: true
  },
  {
    id: "dish-vg-4",
    name: "Traditional Rajasthani Gatta Curry (राजस्थानी गट्टा करी)",
    category: "veg",
    type: "veg",
    price: 230,
    rating: 4.9,
    reviews: 440,
    badge: "Ajmer Heritage",
    description: "Authentic steamed gram flour dumplings cooked in a spiced yogurt gravy tempered with asafoetida and mustard seeds.",
    image: "assets/dishes/dish-vg-4.jpg",
    prepTime: "15 Mins",
    inStock: true
  },
  {
    id: "dish-vg-5",
    name: "Royal Malai Kofta (शाही मलाई कोफ्ता)",
    category: "veg",
    type: "veg",
    price: 280,
    rating: 4.8,
    reviews: 320,
    badge: "Royal Dining",
    description: "Melt-in-mouth cottage cheese and mawa dumplings filled with nuts, served in a rich white cashew and saffron sauce.",
    image: "assets/dishes/dish-vg-5.jpg",
    prepTime: "20 Mins",
    inStock: true
  },
  {
    id: "dish-vg-6",
    name: "Tandoori Paneer Tikka (तंदूरी पनीर टिक्का)",
    category: "veg",
    type: "veg",
    price: 240,
    rating: 4.8,
    reviews: 410,
    badge: "Tandoor Starter",
    description: "Fresh cottage cheese, capsicum, and onions marinated in mustard oil, ajwain, and yogurt, grilled crisp over embers.",
    image: "assets/dishes/dish-vg-6.jpg",
    prepTime: "15 Mins",
    inStock: true
  },
  {
    id: "dish-vg-7",
    name: "Yellow Dal Tadka in Pure Desi Ghee (दाल तड़का)",
    category: "veg",
    type: "veg",
    price: 190,
    rating: 4.8,
    reviews: 360,
    badge: "Homestyle Comfort",
    description: "Yellow lentils tempered with cumin, garlic, red chilies, hing, and generous sizzling pure cow desi ghee.",
    image: "assets/dishes/dish-vg-7.jpg",
    prepTime: "12 Mins",
    inStock: true
  },
  {
    id: "dish-vg-8",
    name: "Veg Diwani Handi (वेज दीवानी हांडी)",
    category: "veg",
    type: "veg",
    price: 220,
    rating: 4.7,
    reviews: 210,
    badge: "Fresh Garden Mix",
    description: "Assorted seasonal garden vegetables and cottage cheese simmered in a spiced spinach and cashew nut gravy in an earthen pot.",
    image: "assets/dishes/dish-vg-8.jpg",
    prepTime: "18 Mins",
    inStock: true
  },

  // ==================== 3. ROYAL SWEETS & DESSERTS ====================
  {
    id: "dish-sw-1",
    name: "Ajmeri Royal Kulfi Falooda with Rabdi",
    category: "sweets",
    type: "veg",
    price: 130,
    rating: 4.9,
    reviews: 820,
    badge: "World Famous",
    description: "Thick malai rabdi, saffron pistachio kulfi, silky falooda vermicelli, rose syrup, sweet basil seeds, and crushed nuts.",
    image: "assets/dishes/dish-sw-1.jpg",
    prepTime: "5 Mins",
    inStock: true
  },
  {
    id: "dish-sw-2",
    name: "Hot Gulab Jamun with Chilled Rabdi (2 Pcs)",
    category: "sweets",
    type: "veg",
    price: 90,
    rating: 4.9,
    reviews: 640,
    badge: "Sweet Sensation",
    description: "Two warm, soft khoya gulab jamuns served atop a bed of chilled, thickened cardamom-infused malai rabdi.",
    image: "assets/dishes/dish-sw-2.jpg",
    prepTime: "5 Mins",
    inStock: true
  },
  {
    id: "dish-sw-3",
    name: "Royal Shahi Tukda Saffron & Pistachio",
    category: "sweets",
    type: "veg",
    price: 140,
    rating: 4.9,
    reviews: 350,
    badge: "Nawabi Treat",
    description: "Crispy fried golden toast soaked in saffron syrup, smothered with dense rabdi cream, silver leaf, and pistachios.",
    image: "assets/dishes/dish-sw-3.jpg",
    prepTime: "8 Mins",
    inStock: true
  },
  {
    id: "dish-sw-4",
    name: "Kesar Malai Rasmalai (2 Pcs) (केसरिया रसमलाई)",
    category: "sweets",
    type: "veg",
    price: 110,
    rating: 4.9,
    reviews: 490,
    badge: "Delicate & Spongy",
    description: "Soft, spongy cottage cheese patties soaked in luscious saffron and pistachio-flavored clotted cream milk.",
    image: "assets/dishes/dish-sw-4.jpg",
    prepTime: "5 Mins",
    inStock: true
  },
  {
    id: "dish-sw-5",
    name: "Pure Desi Ghee Moong Dal Halwa (मूंग दाल हलवा)",
    category: "sweets",
    type: "veg",
    price: 120,
    rating: 4.8,
    reviews: 420,
    badge: "Rajasthani Pride",
    description: "Coarsely ground yellow lentils roasted in pure cow desi ghee on slow flame, enriched with mawa, saffron, and almonds.",
    image: "assets/dishes/dish-sw-5.jpg",
    prepTime: "5 Mins",
    inStock: true
  },
  {
    id: "dish-sw-6",
    name: "Royal Matka Kesar Pista Kulfi (मटका कुल्फी)",
    category: "sweets",
    type: "veg",
    price: 85,
    rating: 4.8,
    reviews: 380,
    badge: "Traditional Pot",
    description: "Traditional slow-reduced dense milk kulfi set in earthen clay pots, flavored with pure Kashmiri saffron and pistachios.",
    image: "assets/dishes/dish-sw-6.jpg",
    prepTime: "3 Mins",
    inStock: true
  },
  {
    id: "dish-sw-7",
    name: "Warm Gajar Ka Halwa Special (गाजर का हलवा)",
    category: "sweets",
    type: "veg",
    price: 110,
    rating: 4.8,
    reviews: 310,
    badge: "Winter Classic",
    description: "Sweet red juicy carrots simmered with full-cream milk, pure desi ghee, khoya, and loaded with roasted cashews and raisins.",
    image: "assets/dishes/dish-sw-7.jpg",
    prepTime: "5 Mins",
    inStock: true
  },

  // ==================== 4. FRESH JUICES, SHAKES & DRINKS ====================
  {
    id: "dish-jc-1",
    name: "Kulhad Malai Lassi with Dry Fruits (कुल्हड़ लस्सी)",
    category: "juices",
    type: "veg",
    price: 80,
    rating: 4.9,
    reviews: 950,
    badge: "Ajmer's Best",
    description: "Traditional churned thick sweet yogurt drink served in an earthen clay kulhad with heavy clotted malai and chopped dry fruits.",
    image: "assets/dishes/dish-jc-1.jpg",
    prepTime: "5 Mins",
    inStock: true
  },
  {
    id: "dish-jc-2",
    name: "100% Pure Fresh Pomegranate Juice (अनार जूस)",
    category: "juices",
    type: "veg",
    price: 110,
    rating: 4.9,
    reviews: 430,
    badge: "Pure & Sugar-Free",
    description: "Cold-pressed directly from fresh red ruby pomegranate arils. 100% natural, zero added sugar, no added water.",
    image: "assets/dishes/dish-jc-2.jpg",
    prepTime: "5 Mins",
    inStock: true
  },
  {
    id: "dish-jc-3",
    name: "Fresh Mosambi & Orange Juice (मौसमी संतरा जूस)",
    category: "juices",
    type: "veg",
    price: 80,
    rating: 4.8,
    reviews: 560,
    badge: "Vitamin C Boost",
    description: "Freshly squeezed sweet lime and Nagpur oranges, lightly seasoned with black rock salt and fresh mint leaves.",
    image: "assets/dishes/dish-jc-3.jpg",
    prepTime: "5 Mins",
    inStock: true
  },
  {
    id: "dish-jc-4",
    name: "Alphonso Mango Mastani Royal Shake (मैंगो मस्तानी)",
    category: "juices",
    type: "veg",
    price: 120,
    rating: 4.9,
    reviews: 410,
    badge: "Royal Thick Shake",
    description: "Decadent Alphonso mango shake topped with a scoop of vanilla ice cream, glazed tutti-frutti, cashews, and glazed cherries.",
    image: "assets/dishes/dish-jc-4.jpg",
    prepTime: "6 Mins",
    inStock: true
  },
  {
    id: "dish-jc-5",
    name: "Kesar Pista Badam Energy Milkshake (केसर बादाम शेक)",
    category: "juices",
    type: "veg",
    price: 110,
    rating: 4.8,
    reviews: 370,
    badge: "Energy Tonic",
    description: "Rich blend of soaked California almonds, pure saffron strands, chopped pistachios, and chilled thickened milk.",
    image: "assets/dishes/dish-jc-5.jpg",
    prepTime: "6 Mins",
    inStock: true
  },
  {
    id: "dish-jc-6",
    name: "Pineapple Mint Cooler (पाइनएप्पल मिंट कूलर)",
    category: "juices",
    type: "veg",
    price: 90,
    rating: 4.7,
    reviews: 290,
    badge: "Tropical Chill",
    description: "Sweet tropical pineapple juice blended with crushed mint leaves, lemon juice, and shaved ice for instant cooling.",
    image: "assets/dishes/dish-jc-6.jpg",
    prepTime: "5 Mins",
    inStock: true
  },
  {
    id: "dish-jc-7",
    name: "Virgin Mint Mojito (वर्जिन मिंट मोजिटो)",
    category: "juices",
    type: "veg",
    price: 95,
    rating: 4.8,
    reviews: 340,
    badge: "Party Refreshment",
    description: "Muddled fresh garden mint and lime wedges with simple syrup, topped with sparkling soda and ice.",
    image: "assets/dishes/dish-jc-7.jpg",
    prepTime: "5 Mins",
    inStock: true
  },
  {
    id: "dish-jc-8",
    name: "Ajmeri Masala Shikanji Soda (मसाला शिकंजी)",
    category: "juices",
    type: "veg",
    price: 50,
    rating: 4.9,
    reviews: 620,
    badge: "Traveler Recharger",
    description: "Traditional refreshing lemon soda blended with roasted cumin, rock salt, dry ginger, and mint. Perfect after long train journey.",
    image: "assets/dishes/dish-jc-8.jpg",
    prepTime: "4 Mins",
    inStock: true
  },

  // ==================== 5. TANDOOR & BREADS ====================
  {
    id: "dish-tb-1",
    name: "Amritsari Stuffed Kulcha Thali with Chhole",
    category: "tandoor",
    type: "veg",
    price: 150,
    rating: 4.9,
    reviews: 680,
    badge: "Breakfast & Lunch Special",
    description: "Flaky tandoori kulcha stuffed with spiced potatoes and onions, served with tangy Pindi chhole, tamarind chutney, and pickle.",
    image: "assets/dishes/dish-tb-1.jpg",
    prepTime: "12 Mins",
    inStock: true
  },
  {
    id: "dish-tb-2",
    name: "Butter Garlic Naan (बटर गार्लिक नान)",
    category: "tandoor",
    type: "veg",
    price: 65,
    rating: 4.8,
    reviews: 510,
    badge: "Tandoori Special",
    description: "Soft leavened flatbread baked in tandoor, topped with minced roasted garlic and brushed with melted Amul butter.",
    image: "assets/dishes/dish-tb-2.jpg",
    prepTime: "8 Mins",
    inStock: true
  },
  {
    id: "dish-tb-3",
    name: "Crispy Lachha Paratha (खस्ता लच्छा पराठा)",
    category: "tandoor",
    type: "veg",
    price: 50,
    rating: 4.7,
    reviews: 320,
    badge: "Flaky & Layered",
    description: "Whole wheat multi-layered crispy tandoori paratha baked golden with aromas of pure desi ghee.",
    image: "assets/dishes/dish-tb-3.jpg",
    prepTime: "8 Mins",
    inStock: true
  },
  {
    id: "dish-tb-4",
    name: "Paneer Stuffed Tandoori Kulcha (पनीर कुलचा)",
    category: "tandoor",
    type: "veg",
    price: 90,
    rating: 4.8,
    reviews: 280,
    badge: "Paneer Lover",
    description: "Crispy tandoori kulcha generously stuffed with fresh crumbled paneer, green chilies, coriander, and dollop of butter.",
    image: "assets/dishes/dish-tb-4.jpg",
    prepTime: "10 Mins",
    inStock: true
  },

  // ==================== 6. FAST MEALS & COMBOS ====================
  {
    id: "dish-qc-1",
    name: "Traveler Executive Super Thali (ट्रेवलर थाली)",
    category: "quick",
    type: "veg",
    price: 250,
    rating: 4.9,
    reviews: 840,
    badge: "Train Passenger Special (10 Min Ready)",
    description: "Paneer butter masala, yellow dal tadka, seasonal vegetable, 4 butter rotis, jeera rice, curd raita, papad, salad, and gulab jamun.",
    image: "assets/dishes/dish-qc-1.jpg",
    prepTime: "10 Mins",
    inStock: true
  },
  {
    id: "dish-qc-2",
    name: "Chicken Fried Rice & Chilli Chicken Meal Box",
    category: "quick",
    type: "non-veg",
    price: 280,
    rating: 4.8,
    reviews: 380,
    badge: "Hot Combo Box",
    description: "Steaming hot chicken egg fried rice served with crispy spicy chilli chicken gravy in a convenient traveler meal box.",
    image: "assets/dishes/dish-qc-2.jpg",
    prepTime: "12 Mins",
    inStock: true
  }
];

// Seating areas for table booking
const SEATING_AREAS = [
  { id: "ac-family", name: "Royal AC Family Hall", extraFee: 0, desc: "Peaceful, plush sofa seating ideal for families & pilgrims" },
  { id: "window-view", name: "Railway Station View Corner", extraFee: 0, desc: "Scenic window table overlooking the vibrant station square" },
  { id: "express-traveler", name: "Express Traveler Dining Table", extraFee: 0, desc: "Super-fast service zone tailored for transit passengers" },
  { id: "private-booth", name: "VIP Private Dining Booth", extraFee: 50, desc: "Quiet air-conditioned cabin for intimate gatherings & meetings" }
];

// ==================== WEDDING & BIRTHDAY PARTY CELEBRATION DATA ====================
const PARTY_OCCASIONS = [
  {
    id: "wedding",
    name: "Wedding & Grand Reception (विवाह समारोह)",
    icon: "fa-ring",
    badge: "Royal Wedding Special",
    guestsRange: "50 - 500+ Guests",
    startingPrice: "Starts ₹599 / Plate",
    image: "assets/dishes/party-wedding.jpg",
    desc: "Magnificent stage & floral decor, VIP sofa lounge seating, live chef cooking counters, Barat reception, and royal wedding feast."
  },
  {
    id: "birthday",
    name: "Birthday Celebration Bash (बर्थडे पार्टी)",
    icon: "fa-cake-candles",
    badge: "Most Popular",
    guestsRange: "15 - 150 Guests",
    startingPrice: "Starts ₹349 / Plate",
    image: "assets/dishes/party-birthday.jpg",
    desc: "Theme balloon & LED lighting decor, complimentary custom birthday cake, DJ dance floor, sizzling starters, and kids favorite treats."
  },
  {
    id: "engagement",
    name: "Engagement & Ring Ceremony (सगाई समारोह)",
    icon: "fa-gem",
    badge: "Premium Celebration",
    guestsRange: "30 - 200 Guests",
    startingPrice: "Starts ₹499 / Plate",
    image: "assets/dishes/party-engagement.jpg",
    desc: "Elegant floral ring exchange stage with spotlight, welcome mocktail drink bar, musical backdrop, and multi-course royal dinner."
  },
  {
    id: "anniversary",
    name: "Anniversary & Family Gathering (वर्षगांठ उत्सव)",
    icon: "fa-champagne-glasses",
    badge: "Family Special",
    guestsRange: "20 - 100 Guests",
    startingPrice: "Starts ₹399 / Plate",
    image: "assets/dishes/party-anniversary.jpg",
    desc: "Intimate climate-controlled banquet hall, candlelight dining setup, soothing acoustic music, and personalized culinary menus."
  }
];

const PARTY_PACKAGES = [
  {
    id: "pkg-wedding-royal",
    name: "Royal Wedding Grand Feast (रॉयल वेडिंग महाभोज)",
    pricePerPerson: 699,
    minGuests: 50,
    tag: "Best for Weddings & Receptions",
    includes: [
      "2 Welcome Fresh Juices / Mocktails (Pomegranate / Mango Mastani / Mojito)",
      "4 Starters (Mutton Seekh Kebab, Chicken Tikka, Paneer Tikka)",
      "5 Main Courses (Mutton Rogan Josh, Dal Makhani, Butter Chicken, Kadhai Paneer)",
      "Royal Basmati Chicken Dum Biryani & Jeera Pulao",
      "4 Tandoori Breads (Butter Garlic Naan, Stuffed Kulcha, Lachha Paratha)",
      "3 Royal Desserts (Ajmeri Kulfi Falooda, Kesar Rasmalai, Hot Gulab Jamun)",
      "Stage & Floral Decor Assistance + VIP Dedicated Service Captains"
    ]
  },
  {
    id: "pkg-birthday-bash",
    name: "Birthday Bash Special Package (धमाका बर्थडे बैश)",
    pricePerPerson: 399,
    minGuests: 15,
    tag: "Birthday Party Best Seller",
    includes: [
      "1 Pound Custom Theme Designer Birthday Cake (Complimentary)",
      "Welcome Kulhad Malai Lassi or Fresh Fruit Juice",
      "3 Crispy Starters (Paneer Bites, Chilli Chicken/Paneer, Crispy Corn)",
      "Main Course (Paneer Butter Masala / Chicken Curry + Dal Makhani)",
      "Hot Butter Naan, Rotis & Jeera Pulao",
      "Ajmeri Kulfi Falooda & Hot Gulab Jamun with Rabdi",
      "Theme Balloon Decoration & Celebration Party Poppers"
    ]
  },
  {
    id: "pkg-celebration-silver",
    name: "Silver Celebration Buffet (प्रीमियम सेलिब्रेशन बुफे)",
    pricePerPerson: 499,
    minGuests: 25,
    tag: "Engagements & Anniversaries",
    includes: [
      "Welcome Drink & Fresh Mosambi Juice Counter",
      "3 Starters (Veg / Non-Veg Mixed Assortment)",
      "4 Main Courses (Paneer, Dal Makhani, Rajasthani Gatta, Chicken Tikka Masala)",
      "Amritsari Stuffed Kulcha & Butter Garlic Naan",
      "Royal Shahi Tukda & Kesar Rasmalai",
      "Sound System & Ambient Celebration Music Setup"
    ]
  }
];

const PARTY_VENUES = [
  { id: "banquet-hall", name: "Royal Heritage Banquet Hall (50-300 Guests)", capacity: "50 to 300 Guests", fee: 5000, desc: "Centralized AC, wedding stage, DJ dance floor, and grand dining zone" },
  { id: "rooftop-lounge", name: "Heritage Rooftop Party Lounge (30-120 Guests)", capacity: "30 to 120 Guests", fee: 3500, desc: "Open star-lit sky, fairy lights, live BBQ grill setup, and railway station square view" },
  { id: "ac-celebration-hall", name: "Royal AC Celebration Hall (20-70 Guests)", capacity: "20 to 70 Guests", fee: 2000, desc: "Beautiful private air-conditioned hall perfect for family birthdays & anniversaries" },
  { id: "vip-private-cabin", name: "VIP Private Dining Cabin (10-25 Guests)", capacity: "10 to 25 Guests", fee: 1000, desc: "Quiet, exclusive air-conditioned cabin for close family & friend gatherings" }
];

const PARTY_SERVICES = [
  { id: "srv-balloon", name: "🎈 Theme Balloon & LED Lighting Decor", price: 1500 },
  { id: "srv-flower", name: "🌸 Royal Fresh Floral Stage Decoration", price: 3500 },
  { id: "srv-dj", name: "🎵 DJ Sound System & Dance Floor", price: 3000 },
  { id: "srv-cake", name: "🎂 2kg Custom Theme Designer Cake", price: 1200 },
  { id: "srv-juice-bar", name: "🥤 Live Fresh Fruit Juice & Mocktail Bar", price: 2500 },
  { id: "srv-photo", name: "📸 Professional Photography & Video Service", price: 4500 }
];

// Sample Initial Bookings
const SAMPLE_BOOKINGS = [
  {
    bookingId: "HDW-9021",
    bookingType: "table",
    customerName: "Rajesh Kumar Sharma",
    phone: "9829011223",
    email: "rajesh.sharma@gmail.com",
    guests: 4,
    date: "2026-10-01",
    timeSlot: "01:30 PM",
    seatingArea: "ac-family",
    travelDetails: "Ajmer Shatabdi Express (Arrival Platform 1)",
    preOrderItems: [
      { id: "dish-nv-1", name: "Royal Mutton Rogan Josh", qty: 2, price: 380 },
      { id: "dish-tb-2", name: "Butter Garlic Naan", qty: 4, price: 65 },
      { id: "dish-sw-1", name: "Ajmeri Royal Kulfi Falooda with Rabdi", qty: 4, price: 130 }
    ],
    foodTotal: 1540,
    bookingFee: 150,
    paymentStatus: "Paid (UPI)",
    upiRef: "UPI-409823901248",
    bookingStatus: "Confirmed",
    timestamp: "2026-09-30 11:30 AM",
    notes: "Train arrives at 1:15 PM, please keep food ready on table upon arrival."
  },
  {
    bookingId: "HDW-PTY-8040",
    bookingType: "party",
    occasion: "wedding",
    occasionTitle: "Wedding & Grand Reception",
    customerName: "Mohammad Irfan Khan",
    phone: "9829155442",
    email: "irfan.khan@gmail.com",
    guests: 120,
    date: "2026-10-15",
    timeSlot: "07:30 PM (Dinner Party)",
    packageId: "pkg-wedding-royal",
    packageName: "Royal Wedding Grand Feast",
    venueId: "banquet-hall",
    venueName: "Royal Heritage Banquet Hall",
    foodType: "mix",
    services: ["🌸 Royal Fresh Floral Stage Decoration", "🥤 Live Fresh Fruit Juice & Mocktail Bar", "🎵 DJ Sound System & Dance Floor"],
    estimatedTotal: 89880,
    bookingFee: 2000,
    paymentStatus: "Paid (UPI)",
    upiRef: "UPI-992388102341",
    bookingStatus: "Confirmed",
    timestamp: "2026-09-30 12:15 PM",
    notes: "Barat arrives at 8:00 PM. Please maintain separate counters for Veg and Non-Veg."
  },
  {
    bookingId: "HDW-PTY-8041",
    bookingType: "party",
    occasion: "birthday",
    occasionTitle: "Birthday Celebration Bash",
    customerName: "Sunil Vaishnav",
    phone: "9414233112",
    email: "sunil.vaishnav@yahoo.com",
    guests: 35,
    date: "2026-10-08",
    timeSlot: "06:30 PM (Evening Party)",
    packageId: "pkg-birthday-bash",
    packageName: "Birthday Bash Special Package",
    venueId: "ac-celebration-hall",
    venueName: "Royal AC Celebration Hall",
    foodType: "veg",
    services: ["🎈 Theme Balloon & LED Lighting Decor", "🎂 2kg Custom Theme Designer Cake"],
    estimatedTotal: 16665,
    bookingFee: 1000,
    paymentStatus: "Paid (UPI)",
    upiRef: "UPI-771239012390",
    bookingStatus: "Confirmed",
    timestamp: "2026-09-30 01:20 PM",
    notes: "Son's 5th Birthday celebration. Spider-man theme balloon decor required."
  }
];
