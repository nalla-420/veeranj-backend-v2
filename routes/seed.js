// Special seed route — call once to populate database
// GET /api/seed?secret=VEERANJ_SEED_2024

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { User, Coupon, Menu } = require("../models");

const MENU = [
  { name:"Samosa (2 pcs)",      cat:"Starters",  price:89,  desc:"Crispy pastry stuffed with spiced potatoes & peas, with mint & tamarind chutney", img:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80", stars:4.9, avail:true },
  { name:"Paneer Tikka",        cat:"Starters",  price:249, desc:"Tandoor-grilled cottage cheese in yogurt marinade, smoky, juicy & succulent",      img:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&q=80", stars:4.8, avail:true },
  { name:"Aloo Tikki Chaat",    cat:"Starters",  price:129, desc:"Crispy potato patties with chickpeas, yogurt, tamarind & coriander chutney",       img:"https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&q=80", stars:4.9, avail:true },
  { name:"Hara Bhara Kebab",    cat:"Starters",  price:179, desc:"Spinach, peas & paneer patties, pan-seared, served with mint chutney",             img:"https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=500&q=80", stars:4.7, avail:true },
  { name:"Veg Spring Rolls",    cat:"Starters",  price:149, desc:"Crispy rolls with spiced cabbage, carrots & bell peppers",                         img:"https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80", stars:4.6, avail:true },
  { name:"Tandoori Chaap",        cat:"Chaap", price:229, desc:"Soya chaap marinated in tandoori spices, grilled to smoky perfection",          img:"https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&q=80", stars:5.0, avail:true },
  { name:"Malai Chaap",           cat:"Chaap", price:249, desc:"Tender soya chaap in rich malai & cashew marinade, melt-in-mouth texture",       img:"https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&q=80", stars:5.0, avail:true },
  { name:"Achari Chaap",          cat:"Chaap", price:239, desc:"Soya chaap in pickle spices — tangy, bold & utterly addictive",                  img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80", stars:4.9, avail:true },
  { name:"Peri Peri Chaap",       cat:"Chaap", price:249, desc:"Spicy peri peri glazed chaap — fiery, smoky & irresistible",                     img:"https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=500&q=80", stars:4.9, avail:true },
  { name:"Afghani Chaap",         cat:"Chaap", price:259, desc:"Creamy yogurt & herb marinated chaap with delicate smoky aroma",                 img:"https://images.unsplash.com/photo-1611250188496-e966043a0629?w=500&q=80", stars:4.8, avail:true },
  { name:"Seekh Chaap",           cat:"Chaap", price:239, desc:"Minced soya on skewers with ginger, garlic & aromatic spices from the tandoor",  img:"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80", stars:4.8, avail:true },
  { name:"Chaap Platter (4 pcs)", cat:"Chaap", price:399, desc:"Chef selection — Tandoori, Malai, Achari & Peri Peri chaap on one grand plate",  img:"https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=500&q=80", stars:5.0, avail:true },
  { name:"Shahi Paneer",         cat:"Mains", price:299, desc:"Paneer in rich cashew-tomato gravy with saffron & whole spices",                img:"https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80", stars:5.0, avail:true },
  { name:"Dal Makhani",          cat:"Mains", price:249, desc:"Black lentils slow-cooked overnight in butter, cream & aromatic spices",        img:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80", stars:4.9, avail:true },
  { name:"Palak Paneer",         cat:"Mains", price:269, desc:"Cottage cheese in velvety spinach gravy with ginger, garlic & fresh cream",     img:"https://images.unsplash.com/photo-1604152135912-04a022e23696?w=500&q=80", stars:4.8, avail:true },
  { name:"Paneer Butter Masala", cat:"Mains", price:299, desc:"Paneer in silky tomato-butter sauce with kasuri methi — the all-time classic",  img:"https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=500&q=80", stars:5.0, avail:true },
  { name:"Chole Masala",         cat:"Mains", price:219, desc:"Punjabi-style spiced chickpeas with onions, tomatoes & whole spices",           img:"https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&q=80", stars:4.8, avail:true },
  { name:"Veg Biryani",          cat:"Mains", price:279, desc:"Dum-cooked basmati with seasonal vegetables, saffron & caramelized onions",     img:"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80", stars:4.9, avail:true },
  { name:"Kadai Paneer",         cat:"Mains", price:289, desc:"Paneer & peppers tossed in bold kadai masala with freshly ground spices",       img:"https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&q=80", stars:4.7, avail:true },
  { name:"Butter Naan",    cat:"Breads", price:49, desc:"Soft tandoor-baked flatbread slathered with generous butter",  img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80", stars:4.9, avail:true },
  { name:"Garlic Naan",    cat:"Breads", price:59, desc:"Fluffy naan brushed with butter, minced garlic & fresh coriander", img:"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80", stars:4.8, avail:true },
  { name:"Stuffed Paratha",cat:"Breads", price:89, desc:"Whole-wheat flatbread stuffed with spiced aloo or paneer, with pickle & curd", img:"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80", stars:4.9, avail:true },
  { name:"Laccha Paratha", cat:"Breads", price:69, desc:"Flaky multi-layered flatbread roasted with desi ghee", img:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80", stars:4.7, avail:true },
  { name:"Gulab Jamun",  cat:"Desserts", price:99,  desc:"Soft milk-solid dumplings soaked in rose-cardamom syrup, served warm", img:"https://images.unsplash.com/photo-1666890835710-6e54de47c74c?w=500&q=80", stars:5.0, avail:true },
  { name:"Mango Kulfi",  cat:"Desserts", price:119, desc:"Dense creamy Indian ice cream with reduced milk & fresh Alphonso mangoes", img:"https://images.unsplash.com/photo-1488900128323-21503983a07e?w=500&q=80", stars:4.9, avail:true },
  { name:"Kheer",        cat:"Desserts", price:99,  desc:"Slow-cooked rice pudding with cardamom, saffron, pistachios & rose water", img:"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&q=80", stars:4.8, avail:true },
  { name:"Jalebi",       cat:"Desserts", price:89,  desc:"Crispy spirals soaked in saffron syrup — best enjoyed warm with rabdi", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80", stars:4.9, avail:true },
  { name:"Mango Scoop",        cat:"Ice Cream", price:89,  desc:"Three scoops of rich Alphonso mango ice cream with fresh fruit topping", img:"https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80", stars:5.0, avail:true },
  { name:"Pista Badam Scoop",  cat:"Ice Cream", price:99,  desc:"Creamy pistachio & almond ice cream with saffron swirls", img:"https://images.unsplash.com/photo-1514849302-984523450cf4?w=500&q=80", stars:4.9, avail:true },
  { name:"Gulab Jamun Sundae", cat:"Ice Cream", price:149, desc:"Vanilla ice cream topped with warm gulab jamun, rose syrup & pistachios", img:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80", stars:5.0, avail:true },
  { name:"Ice Cream Platter",  cat:"Ice Cream", price:249, desc:"6 mini scoops — Mango, Pista, Rose, Chocolate, Strawberry & Vanilla", img:"https://images.unsplash.com/photo-1488900128323-21503983a07e?w=500&q=80", stars:5.0, avail:true },
  { name:"Mango Lassi",    cat:"Drinks", price:99,  desc:"Chilled blended yogurt with Alphonso mangoes & cardamom", img:"https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80", stars:5.0, avail:true },
  { name:"Masala Chai",    cat:"Drinks", price:49,  desc:"Spiced tea with ginger, cardamom, cinnamon & whole milk", img:"https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=500&q=80", stars:4.9, avail:true },
  { name:"Sweet Lassi",    cat:"Drinks", price:79,  desc:"Thick cold yogurt with sugar, cardamom & a pinch of saffron", img:"https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80", stars:4.8, avail:true },
  { name:"Virgin Mojito",  cat:"Drinks", price:99,  desc:"Fresh lime, mint, soda & sugar syrup over crushed ice", img:"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80", stars:4.8, avail:true },
  { name:"Cold Coffee",    cat:"Drinks", price:89,  desc:"Rich blended coffee with ice cream, chocolate syrup & whipped cream", img:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80", stars:4.9, avail:true },
  { name:"Fresh Lime Soda",cat:"Drinks", price:59,  desc:"Sparkling lime soda — sweet, salted or mixed — light & zesty", img:"https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80", stars:4.6, avail:true },
];

const COUPONS = [
  { code:"WELCOME10", type:"percent", value:10, min:0,   desc:"10% off on any order",          label:"10% OFF",          active:true },
  { code:"FIRST50",   type:"flat",    value:50, min:199, desc:"₹50 off on orders above ₹199",  label:"₹50 OFF above ₹199", active:true },
  { code:"FEAST20",   type:"percent", value:20, min:499, desc:"20% off on orders above ₹499",  label:"20% OFF above ₹499", active:true },
  { code:"CHAAP99",   type:"flat",    value:99, min:299, desc:"₹99 off on chaap orders ₹299+", label:"₹99 OFF above ₹299", active:true },
];

router.get("/", async (req, res) => {
  try {
    if (req.query.secret !== "VEERANJ_SEED_2024")
      return res.status(403).json({ msg: "Wrong secret" });

    // Seed menu
    await Menu.deleteMany({});
    const menuResult = await Menu.insertMany(MENU);

    // Seed coupons
    for (const c of COUPONS) {
      await Coupon.findOneAndUpdate({ code: c.code }, c, { upsert: true });
    }

    // Seed admin
    const hash = await bcrypt.hash("Veeranj@2024", 10);
    await User.findOneAndUpdate(
      { phone: "9999999999" },
      { name: "Admin", phone: "9999999999", password: hash, role: "admin" },
      { upsert: true }
    );

    res.json({
      msg: "✅ Seed complete!",
      dishes: menuResult.length,
      coupons: COUPONS.length,
      admin: "Phone: 9999999999 | Pass: Veeranj@2024"
    });
  } catch(e) {
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
