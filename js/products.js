/* Placeholder catalogue for the prototype.
   Every product below uses a licensed Unsplash photograph as a STAND-IN image.
   Replace with real product photography, prices and verified specifications
   before launch — see IMAGE-REGISTER.md. */
(function () {
  "use strict";

  // Build a responsive Unsplash CDN URL. `zoom` > 1 returns a close-up crop
  // centred on the focal point (used for hover + gallery detail shots).
  function img(id, w, opts) {
    opts = opts || {};
    var ratio = opts.ratio || 1.25; // 4:5 portrait by default
    var url = "https://images.unsplash.com/photo-" + id +
      "?auto=format&fit=crop&q=" + (opts.q || 78) + "&w=" + w + "&h=" + Math.round(w * ratio);
    if (opts.zoom) {
      url += "&crop=focalpoint&fp-x=" + (opts.fx || 0.5) + "&fp-y=" + (opts.fy || 0.5) + "&fp-z=" + opts.zoom;
    }
    return url;
  }

  function srcset(id, opts) {
    return [400, 700, 1000, 1400].map(function (w) { return img(id, w, opts) + " " + w + "w"; }).join(", ");
  }

  var products = [
    { id: "twist-hoop-earrings", name: "Twist Hoop Earrings", category: "earrings", metal: "yellow", purity: "18K", stone: "none", price: 28900, badge: "Bestseller", isNew: false, pop: 98, occasion: ["everyday", "gift"], stock: "in",
      photo: "1617038220319-276d3cfab638", fx: 0.66, fy: 0.74, alt: "Pair of chunky twisted gold hoop earrings resting on a pale stone in soft window light",
      desc: "Sculpted, rope-twisted hoops with a high-polish finish that catches every shift of light. Substantial in look, comfortably light to wear from morning to night.",
      dims: "Diameter approx. 22 mm · Width 6 mm", weight: "approx. 4.8 g (pair)", sizes: null },
    { id: "twisted-dome-ring", name: "Twisted Dome Ring", category: "rings", metal: "yellow", purity: "18K", stone: "none", price: 34500, badge: null, isNew: true, pop: 80, occasion: ["everyday", "statement"], stock: "in",
      photo: "1617038260897-41a1f14a8ca0", fx: 0.62, fy: 0.5, alt: "Two twisted gold dome rings displayed on stacked white stones",
      desc: "A bold, braided dome that pairs beautifully with the Twist Hoops. Hand-polished interior for an all-day comfortable fit.",
      dims: "Band width approx. 8 mm", weight: "approx. 5.2 g", sizes: [5, 6, 7, 8, 9, 10] },
    { id: "pink-sapphire-halo-ring", name: "Pink Sapphire Halo Ring", category: "rings", metal: "rose", purity: "18K", stone: "sapphire", price: 124000, badge: "Signature", isNew: false, pop: 92, occasion: ["bridal", "statement"], stock: "low",
      photo: "1603561591411-07134e71a2a9", fx: 0.48, fy: 0.32, alt: "Rose gold ring with a cushion-cut pink sapphire framed by a halo of small diamonds",
      desc: "A cushion-cut pink sapphire framed by a delicate halo and set on a slender pavé band. Romantic, considered and made to be treasured.",
      dims: "Centre stone approx. 8 × 6 mm · Band 1.8 mm", weight: "approx. 3.1 g", sizes: [5, 6, 7, 8, 9] },
    { id: "emerald-cut-solitaire", name: "Emerald-Cut Solitaire", category: "rings", metal: "yellow", purity: "18K", stone: "diamond", price: 186000, badge: null, isNew: false, pop: 90, occasion: ["bridal"], stock: "in",
      photo: "1598560917807-1bae44bd2be8", fx: 0.56, fy: 0.32, alt: "Yellow gold engagement ring with an emerald-cut clear stone and pavé shoulders",
      desc: "Clean architectural lines: an emerald-cut centre stone lifted on a four-claw basket with pavé shoulders.",
      dims: "Centre stone approx. 7 × 5 mm · Band 2 mm", weight: "approx. 3.4 g", sizes: [4, 5, 6, 7, 8, 9] },
    { id: "classic-comfort-bands", name: "Classic Comfort Bands", category: "rings", metal: "yellow", purity: "22K", stone: "none", price: 72800, badge: "Pair", isNew: false, pop: 76, occasion: ["bridal", "gift"], stock: "in",
      photo: "1622398925373-3f91b1e275f5", fx: 0.5, fy: 0.5, alt: "Two polished yellow gold wedding bands interlocked on beige fabric",
      desc: "Timeless comfort-fit bands with a rounded interior. Sold as a pair — select each size at checkout.",
      dims: "Widths 4 mm and 5 mm", weight: "approx. 9.6 g (pair)", sizes: [5, 6, 7, 8, 9, 10, 11] },
    { id: "heirloom-chain-bracelet", name: "Heirloom Chain Bracelet", category: "bracelets", metal: "yellow", purity: "18K", stone: "none", price: 58400, badge: null, isNew: true, pop: 85, occasion: ["everyday", "gift"], stock: "in",
      photo: "1602173574767-37ac01994b2a", fx: 0.6, fy: 0.5, alt: "Chunky yellow gold cable chain bracelet laid across an open magazine",
      desc: "Generous oval links with a secure lobster clasp. Wear alone or layer with finer chains.",
      dims: "Length 18 cm · Link 7 mm", weight: "approx. 8.2 g", sizes: ["16 cm", "17 cm", "18 cm", "19 cm"] },
    { id: "paisley-pave-bracelet", name: "Paisley Pavé Bracelet", category: "bracelets", metal: "rose", purity: "18K", stone: "diamond", price: 96500, badge: null, isNew: false, pop: 70, occasion: ["statement", "bridal"], stock: "low",
      photo: "1611591437281-460bfbe1220a", fx: 0.5, fy: 0.55, alt: "Rose gold bracelet of interlocking paisley shapes set with sparkling stones on a blush background",
      desc: "Interlocking paisley motifs encrusted with pavé — a modern take on a heritage pattern.",
      dims: "Inner circumference 17.5 cm · Width 9 mm", weight: "approx. 11 g", sizes: ["S", "M", "L"] },
    { id: "fine-link-bracelet", name: "Fine Link Bracelet", category: "bracelets", metal: "yellow", purity: "14K", stone: "none", price: 16500, badge: null, isNew: true, pop: 72, occasion: ["everyday", "gift"], stock: "in",
      photo: "1596944924616-7b38e7cfac36", fx: 0.6, fy: 0.5, alt: "Woman's wrists wearing a delicate gold link bracelet and a thin gold ring against a warm beige backdrop",
      desc: "A whisper-fine chain bracelet made for stacking and everyday wear.",
      dims: "Length 17 cm + 2 cm extender", weight: "approx. 1.4 g", sizes: null },
    { id: "medallion-layered-necklace", name: "Medallion Layered Necklace", category: "necklaces", metal: "yellow", purity: "18K", stone: "none", price: 46200, badge: "Bestseller", isNew: false, pop: 95, occasion: ["everyday", "statement"], stock: "in",
      photo: "1635767798638-3e25273a8236", fx: 0.5, fy: 0.78, alt: "Three layered gold chains of varying lengths with a round engraved medallion pendant",
      desc: "Three pre-layered chains — paperclip, satellite and box — finished with an engraved medallion.",
      dims: "Lengths 40 / 45 / 50 cm · Medallion 18 mm", weight: "approx. 7.5 g", sizes: null },
    { id: "baroque-pearl-pendant", name: "Baroque Pearl Pendant", category: "necklaces", metal: "yellow", purity: "18K", stone: "pearl", price: 22900, badge: null, isNew: true, pop: 88, occasion: ["everyday", "gift", "bridal"], stock: "in",
      photo: "1611085583191-a3b181a88401", fx: 0.57, fy: 0.62, alt: "Model in a white shirt wearing a fine gold chain with a single baroque pearl drop",
      desc: "A single freshwater baroque pearl on a whisper-fine curb chain. Each pearl is unique in shape and lustre.",
      dims: "Chain 42–45 cm adjustable · Pearl approx. 9 mm", weight: "approx. 2.1 g", sizes: null },
    { id: "champagne-drop-earrings", name: "Champagne Drop Earrings", category: "earrings", metal: "rose", purity: "18K", stone: "gemstone", price: 18600, badge: null, isNew: true, pop: 66, occasion: ["statement", "bridal"], stock: "in",
      photo: "1629224316810-9d8805b95e76", fx: 0.5, fy: 0.55, alt: "Pair of rose gold drop earrings with pear-shaped champagne stones and sparkling halos",
      desc: "Pear-shaped champagne stones in a glittering halo, suspended from a round-cut stud.",
      dims: "Drop length approx. 32 mm", weight: "approx. 3.6 g (pair)", sizes: null },
    { id: "ginkgo-leaf-pendant", name: "Ginkgo Leaf Pendant", category: "necklaces", metal: "yellow", purity: "18K", stone: "none", price: 19800, badge: null, isNew: false, pop: 74, occasion: ["everyday", "gift"], stock: "in",
      photo: "1620656798579-1984d9e87df7", fx: 0.6, fy: 0.62, alt: "Model touching her hair while wearing a small gold ginkgo leaf pendant and gold rings",
      desc: "A small sculpted ginkgo leaf — a symbol of endurance — on a fine trace chain.",
      dims: "Chain 45 cm · Pendant 14 mm", weight: "approx. 2.4 g", sizes: null },
    { id: "figaro-chain-necklace", name: "Figaro Chain Necklace", category: "necklaces", metal: "yellow", purity: "22K", stone: "none", price: 64000, badge: null, isNew: true, pop: 78, occasion: ["statement", "everyday"], stock: "in",
      photo: "1633810542706-90e5ff7557be", fx: 0.5, fy: 0.42, alt: "Model in a black top wearing a bold gold figaro chain necklace and matching bracelet",
      desc: "A classic figaro rhythm of long and short links in rich 22K gold.",
      dims: "Length 45 cm · Width 5 mm", weight: "approx. 12 g", sizes: null },
    { id: "signet-and-stone-stack", name: "Signet & Stone Stack", category: "rings", metal: "yellow", purity: "18K", stone: "gemstone", price: 41500, badge: "Set of 3", isNew: true, pop: 82, occasion: ["everyday", "gift"], stock: "in",
      photo: "1608042314453-ae338d80c427", fx: 0.5, fy: 0.3, alt: "Gold signet ring and gemstone rings arranged on a smooth white pebble with ivory fabric",
      desc: "A polished signet, an amazonite cabochon and a carnelian ring — curated to be worn together or apart.",
      dims: "Signet face 11 mm", weight: "approx. 8.4 g (set)", sizes: [5, 6, 7, 8, 9] },
    { id: "champagne-cluster-ring", name: "Champagne Cluster Ring", category: "rings", metal: "yellow", purity: "18K", stone: "gemstone", price: 88000, badge: null, isNew: false, pop: 64, occasion: ["statement"], stock: "low",
      photo: "1611955167811-4711904bb9f8", fx: 0.5, fy: 0.5, alt: "Ornate gold cocktail ring with a cluster of pear-shaped champagne stones on linen",
      desc: "A cocktail ring of pear-cut champagne stones arranged like petals in bloom.",
      dims: "Cluster approx. 20 × 18 mm", weight: "approx. 6.8 g", sizes: [5, 6, 7, 8] },
    { id: "sculpted-semi-hoops", name: "Sculpted Semi-Hoops", category: "earrings", metal: "yellow", purity: "18K", stone: "none", price: 24800, badge: null, isNew: true, pop: 79, occasion: ["everyday", "gift"], stock: "in",
      photo: "1608508644127-ba99d7732fee", fx: 0.62, fy: 0.55, alt: "Pair of gold semi-hoop earrings on a blush ribbed ceramic dish",
      desc: "Open-ended hoops with a soft faceted edge — modern, light and easy to wear.",
      dims: "Diameter approx. 18 mm", weight: "approx. 3.2 g (pair)", sizes: null },
    { id: "petite-charm-rings", name: "Petite Charm Rings", category: "rings", metal: "rose", purity: "14K", stone: "diamond", price: 32000, badge: "Set of 3", isNew: false, pop: 86, occasion: ["everyday", "gift"], stock: "in",
      photo: "1631982690223-8aa4be0a2497", fx: 0.5, fy: 0.42, alt: "Three petite rose gold rings with pavé heart, crown and bow motifs in a grey velvet ring tray",
      desc: "Three petite rings — a pavé heart, a crown and a bow — to stack together or share with friends. Arrives ready to gift.",
      dims: "Band widths 1.2–1.6 mm", weight: "approx. 3.9 g (set)", sizes: [4, 5, 6, 7, 8, 9] },
    { id: "diamond-band-trio", name: "Diamond Band Trio", category: "rings", metal: "yellow", purity: "18K", stone: "diamond", price: 142000, badge: null, isNew: false, pop: 68, occasion: ["bridal", "statement"], stock: "in",
      photo: "1543294001-f7cd5d7fb516", fx: 0.5, fy: 0.45, alt: "Three stacked textured gold rings with pavé diamond motifs on a white surface",
      desc: "Three textured bands topped with pavé round, heart and baguette motifs.",
      dims: "Band widths 4–5 mm", weight: "approx. 10.5 g (set)", sizes: [5, 6, 7, 8] },
    { id: "classic-pearl-strand", name: "Classic Pearl Strand", category: "necklaces", metal: "white", purity: "18K", stone: "pearl", price: 54000, badge: null, isNew: false, pop: 73, occasion: ["bridal", "gift"], stock: "in",
      photo: "1515562141207-7a88fb7ce338", fx: 0.5, fy: 0.55, alt: "Strand of white pearls with a pavé clasp displayed in an open jewellery box",
      desc: "Hand-knotted round pearls with a pavé ball clasp. Presented in our signature box.",
      dims: "Length 42 cm · Pearls 7–7.5 mm", weight: "approx. 28 g", sizes: null }
  ];

  var metalNames = { yellow: "Yellow Gold", rose: "Rose Gold", white: "White Gold" };
  var stoneNames = { none: "Plain gold", diamond: "Diamond", pearl: "Pearl", sapphire: "Sapphire", gemstone: "Gemstone" };

  function formatPrice(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }

  function find(id) {
    for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i];
    return null;
  }

  window.AURELLE = {
    products: products,
    img: img,
    srcset: srcset,
    find: find,
    formatPrice: formatPrice,
    metalNames: metalNames,
    stoneNames: stoneNames
  };
})();
