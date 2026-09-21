import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const email = 'abbas'
const adminPassword = '123'
const adminName = 'Abbas'

async function main() {
  // 1. Seed / Reset Admin User (abbas / 123)
  await prisma.loginAttempt.deleteMany()
  const passwordHash = await bcrypt.hash(adminPassword, 10)
  await prisma.user.upsert({
    where: { email: 'abbas' },
    update: { passwordHash, role: 'Admin', name: adminName },
    create: { email: 'abbas', passwordHash, role: 'Admin', name: adminName },
  })
  console.log(`Admin user ready: ${email} (Password: ${adminPassword})`)

  // 2. Seed Company Settings
  await prisma.companySettings.upsert({
    where: { id: 1 },
    update: {
      name: 'Tahira Syndicate',
      tagline: 'Direct Manufacturer & Master Wholesale Distributor of Industrial Ropes, Nets, Tarpaulins & Packaging Materials.',
      description: 'Direct manufacturer and wholesale distributor of PE, PVC, PP, uPVC and HDPE materials, pressure pipes, agro shade nets, safety nets, tarpaulins and packing supplies in Karachi, Pakistan.',
      address: 'Shop # 1, Thakurdwara Ln, Main Shahra-e-Liaquat Road, opp. Sindh Madarsa-tul-Islam, near Karachi Chamber of Commerce, Searl Quarters, Karachi, 74000',
      phone: '+92 321 2043552',
      whatsapp: '+923212043552',
      email: 'info@tahirasyndicate.com',
      facebook: 'https://facebook.com/tahirasyndicate',
      instagram: 'https://instagram.com/tahirasyndicate',
      hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
    },
    create: {
      id: 1,
      name: 'Tahira Syndicate',
      tagline: 'Direct Manufacturer & Master Wholesale Distributor of Industrial Ropes, Nets, Tarpaulins & Packaging Materials.',
      description: 'Direct manufacturer and wholesale distributor of PE, PVC, PP, uPVC and HDPE materials, pressure pipes, agro shade nets, safety nets, tarpaulins and packing supplies in Karachi, Pakistan.',
      address: 'Shop # 1, Thakurdwara Ln, Main Shahra-e-Liaquat Road, opp. Sindh Madarsa-tul-Islam, near Karachi Chamber of Commerce, Searl Quarters, Karachi, 74000',
      phone: '+92 321 2043552',
      whatsapp: '+923212043552',
      email: 'info@tahirasyndicate.com',
      facebook: 'https://facebook.com/tahirasyndicate',
      instagram: 'https://instagram.com/tahirasyndicate',
      hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
    },
  })
  console.log('Company Settings ready.')

  // 3. Remove old unassigned dummy placeholder categories
  await prisma.category.deleteMany({
    where: {
      slug: {
        in: ['polymers-raw-materials', 'nets-tarpaulins', 'packaging-hardware'],
      },
    },
  })


  // 3.5 Seed Ropes & Twines Category
  const ropesCat = await prisma.category.upsert({
    where: { slug: 'ropes' },
    update: {
      name: "Ropes & Twines",
      slug: 'ropes',
      image: "/uploads/categories/ropes.jpeg",
      description: "Tahira Syndicate supplies wholesale ropes, cords, and twines across Pakistan. Our stock covers synthetic options like Polypropylene, Nylon, Polyester, Braided Dura cord, and Georgette marine ropes for heavy transport, mooring, construction, and cargo lashing. We also stock natural fiber cordage including Manila, Sisal, Jute, Cotton, and Coconut Coir for marine rigging, agriculture, industrial packaging, and general commercial use. All ropes are available in full standard coils, bundles, and custom cut lengths.",
      metaTitle: "Wholesale Ropes & Twines Supplier Karachi | Tahira",
      metaDescription: "Wholesale supplier of synthetic and natural fiber ropes in Karachi, Pakistan. Manila, PP, Nylon, Sisal, Jute, Cotton & Coir ropes from 2mm to 36mm coils.",
      status: 'Active',
    },
    create: {
      name: "Ropes & Twines",
      slug: 'ropes',
      image: "/uploads/categories/ropes.jpeg",
      description: "Tahira Syndicate supplies wholesale ropes, cords, and twines across Pakistan. Our stock covers synthetic options like Polypropylene, Nylon, Polyester, Braided Dura cord, and Georgette marine ropes for heavy transport, mooring, construction, and cargo lashing. We also stock natural fiber cordage including Manila, Sisal, Jute, Cotton, and Coconut Coir for marine rigging, agriculture, industrial packaging, and general commercial use. All ropes are available in full standard coils, bundles, and custom cut lengths.",
      metaTitle: "Wholesale Ropes & Twines Supplier Karachi | Tahira",
      metaDescription: "Wholesale supplier of synthetic and natural fiber ropes in Karachi, Pakistan. Manila, PP, Nylon, Sisal, Jute, Cotton & Coir ropes from 2mm to 36mm coils.",
      status: 'Active',
    },
  })
  console.log('Ropes & Twines category initialized.')

  if (ropesCat) {
    const ropesAttributesData = [
    {
        "name": "Available Diameters / Size (mm)",
        "type": "Text",
        "options": []
    },
    {
        "name": "Material Composition",
        "type": "Text",
        "options": []
    },
    {
        "name": "Strand Construction",
        "type": "Text",
        "options": []
    },
    {
        "name": "Standard Packaging / Coil Length",
        "type": "Text",
        "options": []
    },
    {
        "name": "Standard Color(s)",
        "type": "Text",
        "options": []
    },
    {
        "name": "Water & Moisture Behavior",
        "type": "Text",
        "options": []
    }
]

    const ropesAttributeMap = new Map<string, number>()
    for (const attr of ropesAttributesData) {
      let existing = await prisma.attribute.findFirst({ where: { name: attr.name } })
      if (!existing) {
        existing = await prisma.attribute.create({
          data: {
            name: attr.name,
            type: attr.type as any,
            options: attr.options as any,
          },
        })
      }
      ropesAttributeMap.set(attr.name, existing.id)

      await prisma.categoryAttribute.upsert({
        where: {
          categoryId_attributeId: {
            categoryId: ropesCat.id,
            attributeId: existing.id,
          },
        },
        update: {},
        create: {
          categoryId: ropesCat.id,
          attributeId: existing.id,
        },
      })
    }

    const ropesProducts = [
    {
        "name": "Manila Natural Fiber Rope",
        "sku": "TS-ROP-MAN-001",
        "slug": "manila-natural-fiber-rope",
        "price": 0,
        "moq": 1,
        "tradeAliases": "Jahazi Rassa • Manila Rassa • Natural Abaca Rope • Jahaz Rassi",
        "shortDescription": "Genuine 3-strand abaca fiber Jahazi Rassa. Gives a non-slip grip in wet hands, holds knots firmly, and will not melt under friction heat on ship decks and pilot ladders.",
        "longDescription": "If you are working on a ship deck or rigging a pilot ladder at Karachi Port, you cannot use ropes that melt when rubbed hard against metal edges. Manila (Abaca) natural fiber rope is built for high-friction marine use. It does not stretch out under heavy pulls, handles saltwater and strong sunlight without degrading, and holds knots securely without slipping. We stock full 100m and 220m coils from 6mm up to 36mm at our Shahra-e-Liaquat Road counter.",
        "metaTitle": "Manila Natural Fiber Rope Wholesale Karachi & Global",
        "metaDescription": "Wholesale grade 3-strand Manila natural fiber ropes in Karachi, Pakistan. High tensile, marine and industrial grade, bulk coils for worldwide shipping.",
        "usage": "Ideal for ship pilot ladders (Kaath Seerhi), tugboat mooring, cargo deck lashing, gymnasium climbing ropes, and construction barricades across Karachi and coastal ports.",
        "benefits": [
          "Non-slip coarse grip that stays secure even with wet hands",
          "Natural abaca fibers will not melt or fuse from friction heat",
          "Very low stretch under heavy pulling and lashing tension",
          "Biodegradable, eco-friendly natural plant cordage"
],
        "suitedFor": [
          "Marine rigging & deck work",
          "Pilot ladder steps & vessel gangways",
          "Tug & barge mooring lines",
          "Cargo lashing & transport binding",
          "Gym climbing & obstacle courses"
],
        "notSuitedFor": [
          "Direct acidic chemical exposure",
          "Continuous damp storage without air drying"
],
        "bulkPricing": [],
        "images": [
            {
                "src": "/uploads/products/ropes/manila-natural-fiber-rope/manila-rope-primary.jpg",
                "alt": "Grade-A Manila natural abaca fiber rope coil",
                "sortOrder": 0
            },
            {
                "src": "/uploads/products/ropes/manila-natural-fiber-rope/manila-rope-coil.jpg",
                "alt": "Manila natural fiber rope coil packaging",
                "sortOrder": 1
            },
            {
                "src": "/uploads/products/ropes/manila-natural-fiber-rope/manila-rope-detail.jpg",
                "alt": "Close-up 3-strand Manila rope texture and fibers",
                "sortOrder": 2
            },
            {
                "src": "/uploads/categories/ropes.jpeg",
                "alt": "Tahira Syndicate wholesale ropes inventory and warehouse stock coils",
                "sortOrder": 3
            }
        ],
        "faqs": [
          {
                    "question": "What diameters are available for Manila rope in wholesale orders?",
                    "answer": "We stock standard Manila rope diameters from 6mm up to 36mm (including 6mm, 8mm, 10mm, 12mm, 16mm, 18mm, 20mm, 24mm, 28mm, 32mm, and 36mm) in full coils (100m/220m) and custom bundle lengths."
          },
          {
                    "question": "Why choose Manila rope over synthetic ropes for marine ladders and pilot steps?",
                    "answer": "Manila natural fiber rope provides a rough, non-slip grip even when wet with seawater and will not melt or fuse from surface friction, making it the globally trusted material for marine pilot ladder steps and deck safety lines."
          },
          {
                    "question": "How should Manila rope be stored to maximize lifespan?",
                    "answer": "Manila rope should be stored in a dry, well-ventilated area off the floor. If the rope gets wet during marine or outdoor use, allow it to dry thoroughly before coiling and storing to prevent mildew."
          }
],
        "attrValues": [
            {
                "attr": "Available Diameters / Size (mm)",
                "val": "6mm – 36mm"
            },
            {
                "attr": "Material Composition",
                "val": "100% Grade-A Abaca / Manila Fiber"
            },
            {
                "attr": "Strand Construction",
                "val": "3-Strand Twisted (Hawser Laid)"
            },
            {
                "attr": "Standard Packaging / Coil Length",
                "val": "100m & 220m Coils / Bundles"
            },
            {
                "attr": "Standard Color(s)",
                "val": "Natural Golden Tan"
            },
            {
                "attr": "Water & Moisture Behavior",
                "val": "Non-floating (Sinks) • High Wet Grip"
            }
        ]
    },
    {
        "name": "PP 3-Strand Twisted Rope",
        "sku": "TS-ROP-PP-002",
        "slug": "pp-3-strand-twisted-rope",
        "price": 0,
        "moq": 1,
        "tradeAliases": "PP Rassa • Plastic Rassi • Polypropylene Mooring Rope • Hafte Wali Rassi",
        "shortDescription": "Lightweight, 100% waterproof 3-strand polypropylene rope that floats on water. Rot-proof and resistant to acids and oils for transport tying, marine docking, and farm use.",
        "longDescription": "Polypropylene (PP) 3-strand rope is Karachi most widely used all-round synthetic rassa. Because PP resin has a low density, this rope floats right on the surface of water and will never absorb moisture, rot, or swell in rain. It handles acids, alkalis, and dirty workshop grease without weakening. Truck drivers across Maripur and contractors on construction sites rely on our PP coils for daily cargo lashing and boundary fencing.",
        "metaTitle": "PP 3-Strand Twisted Rope Wholesale Karachi & Pakistan",
        "metaDescription": "Premium polypropylene (PP) 3-strand twisted ropes in Karachi. Water-resistant, high tensile strength for industrial, marine, and commercial export packaging.",
        "usage": "Used for truck cargo tie-downs, fishing boat mooring lines, swimming area lane barriers, agricultural shade net ties, and general warehouse packaging across Pakistan.",
        "benefits": [
          "Floats naturally on water without absorbing moisture",
          "Completely immune to rot, mildew, marine growth, and chemical corrosion",
          "Lightweight and easy for laborers to handle when wet",
          "High tensile breaking strength for transport and mooring work"
],
        "suitedFor": [
          "Boat mooring & dock lines",
          "Truck cargo securing & transport lashing",
          "Agricultural shade net & greenhouse ties",
          "Construction site safety barriers",
          "General tarpaulin tie-downs & packaging"
],
        "notSuitedFor": [
          "High-friction winch drums where extreme surface heat is generated"
],
        "bulkPricing": [],
        "images": [
            {
                "src": "/uploads/products/ropes/pp-3-strand-twisted-rope/pp-rope-primary.webp",
                "alt": "High tenacity 3-strand PP polypropylene twisted rope",
                "sortOrder": 0
            },
            {
                "src": "/uploads/products/ropes/pp-3-strand-twisted-rope/pp-mooring-rope.avif",
                "alt": "Heavy duty 3-strand twisted PP marine mooring rope",
                "sortOrder": 1
            },
            {
                "src": "/uploads/products/ropes/pp-3-strand-twisted-rope/pp-rope-detail.jpg",
                "alt": "Close-up texture of polypropylene 3-strand rope",
                "sortOrder": 2
            },
            {
                "src": "/uploads/categories/ropes.jpeg",
                "alt": "Tahira Syndicate wholesale ropes inventory and warehouse stock coils",
                "sortOrder": 3
            }
        ],
        "faqs": [
          {
                    "question": "Does PP rope float on water?",
                    "answer": "Yes, polypropylene has a specific gravity lower than water (around 0.91), which means it naturally floats. This makes it ideal for water rescue lines, swimming pool lane markers, and marine mooring."
          },
          {
                    "question": "What sizes and colors of PP rope are stocked?",
                    "answer": "We supply PP ropes from 2mm up to 36mm in standard 200m/220m coils. Common colors include White, Blue, Yellow, Orange, and multi-color combinations."
          },
          {
                    "question": "Is PP rope resistant to chemicals and oils?",
                    "answer": "Yes, PP rope offers excellent resistance to acids, alkalis, oils, petrol, and organic solvents, making it widely used in chemical plants, workshops, and marine environments."
          }
],
        "attrValues": [
            {
                "attr": "Available Diameters / Size (mm)",
                "val": "2mm – 36mm"
            },
            {
                "attr": "Material Composition",
                "val": "100% Virgin High-Tenacity PP"
            },
            {
                "attr": "Strand Construction",
                "val": "3-Strand Twisted Cordage"
            },
            {
                "attr": "Standard Packaging / Coil Length",
                "val": "200m & 220m Standard Coils / Reels"
            },
            {
                "attr": "Standard Color(s)",
                "val": "White, Blue, Yellow, Orange"
            },
            {
                "attr": "Water & Moisture Behavior",
                "val": "100% Floats on Water • Rot & Chemical Proof"
            }
        ]
    },
    {
        "name": "Dura Braided Utility Rope",
        "sku": "TS-ROP-DUR-003",
        "slug": "dura-rope-braided-cord",
        "price": 0,
        "moq": 1,
        "tradeAliases": "Dura Rassi • Braided Dori • Round Braided Cord • Multipurpose Dura Rope",
        "shortDescription": "Solid circular braided synthetic cord with strong kink resistance. Glides smoothly through tarpaulin eyelets and metal pulleys without untwisting or fraying.",
        "longDescription": "If you have ever dealt with twisted ropes untwisting or jamming inside small pulleys, Dura Braided cord is the answer. It is woven with a solid circular braid so it stays round, flexible, and completely kink-free even under repetitive pulling. It slides through eyelets and tent grommets without snagging. We supply Dura cord in 2mm to 12mm diameters for tarpaulin tie-downs, window blinds, flagpoles, and carton bundling.",
        "metaTitle": "Dura Braided Utility Rope Wholesale Pakistan & Export",
        "metaDescription": "Heavy-duty Dura braided utility ropes wholesale in Karachi. Superior knot retention, abrasion resistance, and flexible handling for logistics across Pakistan.",
        "usage": "Best for tying tarpaulin sheets, window blind mechanisms, awning rigging, canopy lacing, flagpole halyards, and industrial bundle tying in warehouses.",
        "benefits": [
          "Circular braided weave that will never untwist or kink",
          "Glides cleanly through pulleys, rings, and tarpaulin eyelets",
          "High surface resistance against abrasion and rubbing",
          "Holds knots tightly without slipping loose under tension"
],
        "suitedFor": [
          "Tarpaulin hem lacing & canopy tie-downs",
          "Window blind & awning pull cords",
          "Flagpole halyards & banner hanging",
          "Heavy carton & parcel bundling"
],
        "notSuitedFor": [
          "Heavy crane hoisting where certified webbing slings are required"
],
        "bulkPricing": [],
        "images": [
            {
                "src": "/uploads/products/ropes/dura-rope-braided-cord/dura-braided-rope-primary.jpg",
                "alt": "Dura braided synthetic utility cord spool",
                "sortOrder": 0
            },
            {
                "src": "/uploads/products/ropes/dura-rope-braided-cord/dura-cord-detail-1.jpg",
                "alt": "Multi-color braided Dura rope bundle",
                "sortOrder": 1
            },
            {
                "src": "/uploads/products/ropes/dura-rope-braided-cord/dura-cord-detail-2.jpg",
                "alt": "Close-up braided cord weave texture",
                "sortOrder": 2
            },
            {
                "src": "/uploads/categories/ropes.jpeg",
                "alt": "Tahira Syndicate wholesale ropes inventory and warehouse stock coils",
                "sortOrder": 3
            }
        ],
        "faqs": [
          {
                    "question": "What makes Dura Braided rope different from standard 3-strand twisted rope?",
                    "answer": "Dura Braided rope has a woven tubular structure that will not untwist, unravel, or spin under load, making it much smoother to handle through pulleys and grommets than twisted cordage."
          },
          {
                    "question": "What diameters are available for Dura Braided cord?",
                    "answer": "We stock Dura cord in 2mm, 3mm, 4mm, 5mm, 6mm, 8mm, 10mm, and 12mm spools and master coils for wholesale trade orders."
          }
],
        "attrValues": [
            {
                "attr": "Available Diameters / Size (mm)",
                "val": "2mm – 36mm"
            },
            {
                "attr": "Material Composition",
                "val": "High-Tenacity Polymer Blend"
            },
            {
                "attr": "Strand Construction",
                "val": "Solid / Diamond Braided Round Cord"
            },
            {
                "attr": "Standard Packaging / Coil Length",
                "val": "Continuous Spools & Reels"
            },
            {
                "attr": "Standard Color(s)",
                "val": "White, Blue, Red/White, Green"
            },
            {
                "attr": "Water & Moisture Behavior",
                "val": "Kink-Resistant • Smooth Pulley Transit"
            }
        ]
    },
    {
        "name": "Nylon Industrial Rope",
        "sku": "TS-ROP-NYL-004",
        "slug": "nylon-industrial-rope",
        "price": 0,
        "moq": 1,
        "tradeAliases": "Nylon Rassa • Polyamide Rope • High Elasticity Rassa • Resham Rassi • White Nylon Rope",
        "shortDescription": "High-strength 3-strand polyamide nylon rope. Delivers superior shock energy absorption, high breaking strength, and resistance to repeated sudden impact pulls.",
        "longDescription": "When heavy vessels pitch against dock pilings or tow lines face sudden jerk loads, rigid ropes snap under shock. 3-strand Nylon (Polyamide) rope acts as a natural mechanical shock absorber, stretching safely under peak loads and springing back without structural damage. It delivers the highest tensile strength among common synthetic ropes and resists friction wear against bollards and fairleads.",
        "metaTitle": "Nylon Industrial Rope Wholesale Karachi & Pakistan",
        "metaDescription": "High-tenacity nylon 3-strand industrial ropes in Karachi. Superior shock absorption and breaking strength for marine towing, mooring, and heavy rigging.",
        "usage": "Essential for ship towing hawsers, anchor rode lines, harbor mooring, recovery pull lines, heavy machinery tie-downs, and industrial safety lifelines.",
        "benefits": [
          "Highest shock absorption and elasticity among commercial synthetic ropes",
          "High tensile breaking strength handles sudden heavy jerks",
          "Excellent resistance against bollard and fairlead friction wear",
          "Stays supple and easy for deckhands to coil even after heavy use"
],
        "suitedFor": [
          "Vessel mooring lines & harbor anchor rodes",
          "Towing hawsers & vehicle kinetic recovery lines",
          "Industrial fall-arrest lifelines & safety lines",
          "Heavy equipment dynamic tie-down lashing"
],
        "notSuitedFor": [
          "High-precision positioning lifts where zero stretch is required"
],
        "bulkPricing": [],
        "images": [
            {
                "src": "/uploads/products/ropes/nylon-industrial-rope/nylon-rope-primary.jpg",
                "alt": "High tensile industrial nylon rope coil",
                "sortOrder": 0
            },
            {
                "src": "/uploads/products/ropes/nylon-industrial-rope/nylon-rope-detail.jpg",
                "alt": "Nylon twisted rope strand construction",
                "sortOrder": 1
            },
            {
                "src": "/uploads/categories/ropes.jpeg",
                "alt": "Tahira Syndicate wholesale ropes inventory and warehouse stock coils",
                "sortOrder": 2
            }
        ],
        "faqs": [
          {
                    "question": "Why is Nylon rope preferred for marine anchor and mooring lines?",
                    "answer": "Nylon has natural elasticity that absorbs the shock of waves, wind gusts, and sudden vessel movements, protecting boat deck cleats and dock anchors from breaking under impact."
          },
          {
                    "question": "What sizes of Nylon rope do you supply in Karachi?",
                    "answer": "We stock Nylon rope from 4mm up to 40mm in standard 100m and 220m coils, as well as custom lengths for marine and industrial projects."
          }
],
        "attrValues": [
            {
                "attr": "Available Diameters / Size (mm)",
                "val": "2mm – 36mm"
            },
            {
                "attr": "Material Composition",
                "val": "100% High-Tenacity Polyamide (Nylon)"
            },
            {
                "attr": "Strand Construction",
                "val": "3-Strand Twisted & High-Density Braided"
            },
            {
                "attr": "Standard Packaging / Coil Length",
                "val": "100m, 200m & 220m Coils"
            },
            {
                "attr": "Standard Color(s)",
                "val": "White (with optional tracer)"
            },
            {
                "attr": "Water & Moisture Behavior",
                "val": "High Elastic Shock Absorption (Up to 25%)"
            }
        ]
    },
    {
        "name": "Sisal Natural Fiber Rope",
        "sku": "TS-ROP-SIS-005",
        "slug": "sisal-natural-fiber-rope",
        "price": 0,
        "moq": 1,
        "tradeAliases": "Sisal Rassa • Natural White Rassa • Agave Fiber Rope • Sisal Dori",
        "shortDescription": "Stiff, natural agave plant fiber rope with rough non-slip texture and low stretch. Perfect for agricultural baling, tree tying, parcel bundling, and cat scratch furniture.",
        "longDescription": "Sisal rope is spun from the tough leaf fibers of the agave plant. It has a pale cream color and a rough, bristly texture that provides unmatched knot-holding security. Sisal is 100% biodegradable and does not stretch excessively under load. Farmers use it for baling straw and binding crops, while furniture makers buy our coils for pet scratching posts and rustic boundary barriers.",
        "metaTitle": "Sisal Natural Fiber Rope Wholesale Karachi & Pakistan",
        "metaDescription": "Eco-friendly 3-strand sisal fiber ropes in Karachi. Biodegradable, non-slip grip, heavy-duty bundling and agricultural tying coils ready for bulk shipment.",
        "usage": "Commonly used for agricultural baling, crop binding, nursery plant staking, parcel bundling, pet scratch posts, and rustic outdoor fencing across Sindh and Punjab.",
        "benefits": [
          "100% natural, biodegradable plant fiber with no synthetic chemicals",
          "Rough, bristly texture provides tight, non-slip knot holding",
          "Very low stretch under static loads",
          "Safe for farm animals, plants, and domestic pet furniture"
],
        "suitedFor": [
          "Agricultural baling & crop binding",
          "Warehouse parcel bundling & pallet tie-downs",
          "Cat scratching posts & pet furniture",
          "Rustic interior decor & handicraft manufacturing"
],
        "notSuitedFor": [
          "Overhead crane lifting where certified synthetic slings are mandatory"
],
        "bulkPricing": [],
        "images": [
            {
                "src": "/uploads/products/ropes/sisal-natural-fiber-rope/sisal-rope-primary.jpg",
                "alt": "28mm natural sisal 3-strand fiber rope",
                "sortOrder": 0
            },
            {
                "src": "/uploads/products/ropes/sisal-natural-fiber-rope/sisal-rope-detail-1.jpeg",
                "alt": "Natural sisal rope coil presentation",
                "sortOrder": 1
            },
            {
                "src": "/uploads/products/ropes/sisal-natural-fiber-rope/sisal-rope-detail-2.jpeg",
                "alt": "Sisal natural agave fiber detail and texture",
                "sortOrder": 2
            },
            {
                "src": "/uploads/categories/ropes.jpeg",
                "alt": "Tahira Syndicate wholesale ropes inventory and warehouse stock coils",
                "sortOrder": 3
            }
        ],
        "faqs": [
          {
                    "question": "What makes Sisal rope suitable for cat scratch posts?",
                    "answer": "Sisal is 100% natural, non-toxic, and has stiff, durable fibers that cats naturally love to scratch without exposing them to synthetic chemical toxins."
          },
          {
                    "question": "What sizes of Sisal rope are available?",
                    "answer": "We stock Sisal rope from thin 2mm, 3mm, 4mm, 6mm twines up to heavy 8mm, 10mm, 12mm, 16mm, 20mm, 24mm, 28mm, and 36mm ropes in wholesale coils."
          }
],
        "attrValues": [
            {
                "attr": "Available Diameters / Size (mm)",
                "val": "2mm – 36mm"
            },
            {
                "attr": "Material Composition",
                "val": "100% Natural Sisal Agave Plant Fiber"
            },
            {
                "attr": "Strand Construction",
                "val": "3-Strand Twisted Cordage"
            },
            {
                "attr": "Standard Packaging / Coil Length",
                "val": "Standard Coils, Spools & Bales"
            },
            {
                "attr": "Standard Color(s)",
                "val": "Natural Blonde / Light Tan"
            },
            {
                "attr": "Water & Moisture Behavior",
                "val": "100% Biodegradable • Coarse Non-Slip Grip"
            }
        ]
    },
    {
        "name": "Jute & Hessian Twine Rope",
        "sku": "TS-ROP-JUT-006",
        "slug": "jute-hessian-twine-rope",
        "price": 0,
        "moq": 1,
        "tradeAliases": "Patson Rassi • Jute Sutli • Burlap Twine • Golden Fiber Rope • Jute Dori",
        "shortDescription": "Traditional natural golden jute twine and twisted rope. Soft on hands, easy to tie, 100% biodegradable, and cost-effective for stitching sacks, bundling, and farming.",
        "longDescription": "Jute (Patson) is Pakistan most economical natural cordage. Spun from golden jute plant fibers, it is soft to handle, easy to cut with scissors or a knife, and grips tightly without snapping easily under hand tension. Wholesale traders and farmers across Pakistan use Jute Sutli to stitch 50kg grain bags, tie agricultural bundles, and wrap nursery roots. It decomposes naturally in soil without harming crops.",
        "metaTitle": "Jute & Hessian Twine Rope Wholesale Karachi & Pakistan",
        "metaDescription": "Wholesale Jute twine (sutli) and hessian ropes in Karachi, Pakistan. Eco-friendly, golden fiber cordage for sack stitching, agriculture, and packaging.",
        "usage": "Used for stitching hessian and jute sacks, tying cotton bales, nursery tree root wrapping, handicraft production, and light packaging across wholesale markets.",
        "benefits": [
          "Very economical cordage for high-volume commercial tying and stitching",
          "Soft natural fibers that will not cut into plant stems or tender tree bark",
          "100% compostable and eco-friendly — breaks down safely in farm soil",
          "Holds tight friction knots with zero back-slip"
],
        "suitedFor": [
          "Jute bag & agricultural grain sack stitching",
          "Plant nursery root ball wrapping & vine training",
          "Textile fabric roll binding & carton parcel tying",
          "Handicraft macramé & eco-friendly packaging"
],
        "notSuitedFor": [
          "Mooring boats or permanent outdoor exposure to wet weather"
],
        "bulkPricing": [],
        "images": [
            {
                "src": "/uploads/products/ropes/jute-hessian-twine-rope/jute-twine-primary.webp",
                "alt": "2mm natural golden jute twine spool 250g",
                "sortOrder": 0
            },
            {
                "src": "/uploads/products/ropes/jute-hessian-twine-rope/jute-rope-detail-1.jpg",
                "alt": "Jute twine bundle ball for packaging",
                "sortOrder": 1
            },
            {
                "src": "/uploads/products/ropes/jute-hessian-twine-rope/jute-rope-detail-2.jpg",
                "alt": "3-strand twisted jute rope coil",
                "sortOrder": 2
            },
            {
                "src": "/uploads/categories/ropes.jpeg",
                "alt": "Tahira Syndicate wholesale ropes inventory and warehouse stock coils",
                "sortOrder": 3
            }
        ],
        "faqs": [
          {
                    "question": "What plies and thicknesses are available for Jute twine?",
                    "answer": "We supply 2-ply, 3-ply, 4-ply, and multi-strand Jute cords and twisted ropes from 1mm up to 24mm in spools, balls, and 50kg pressed bales."
          },
          {
                    "question": "Is Jute twine suitable for agricultural composting and organic farming?",
                    "answer": "Yes, our natural jute is completely free of synthetic plastic additives and breaks down into natural organic matter in soil within months."
          }
],
        "attrValues": [
            {
                "attr": "Available Diameters / Size (mm)",
                "val": "2mm – 20mm"
            },
            {
                "attr": "Material Composition",
                "val": "100% Natural Golden Jute (Patson / Sutli)"
            },
            {
                "attr": "Strand Construction",
                "val": "2/3-Ply Twine & 3-Strand Twisted Rope"
            },
            {
                "attr": "Standard Packaging / Coil Length",
                "val": "250g–1kg Balls & 20kg–50kg Bulk Bales"
            },
            {
                "attr": "Standard Color(s)",
                "val": "Natural Golden Tan / Earthy Brown"
            },
            {
                "attr": "Water & Moisture Behavior",
                "val": "100% Biodegradable • Soft on Hands"
            }
        ]
    },
    {
        "name": "Pure Cotton Twisted Rope",
        "sku": "TS-ROP-COT-007",
        "slug": "pure-cotton-twisted-rope",
        "price": 0,
        "moq": 1,
        "tradeAliases": "Sooti Rassi • Cotton Dori • White Cotton Cord • Cotton Twisted Rope • Soft Cotton Rassa",
        "shortDescription": "Soft, 100% pure natural cotton twisted rope (Sooti Rassi). Skin-friendly, non-abrasive, and easy to wash for awnings, tent lacing, theater rigging, and crafts.",
        "longDescription": "When you need a rope that feels gentle in bare hands, never causes friction rope burns, and ties into smooth decorative knots, Pure Cotton rope (Sooti Rassi) is the ideal choice. Spun from unbleached natural cotton yarns, it is soft, flexible, and completely free of harsh synthetic chemicals. It absorbs dyes easily, operates quietly through pulleys, and is widely used for awning cords, theater stage rigging, tent lacing, and interior decor.",
        "metaTitle": "Pure Cotton Twisted Rope Wholesale Karachi & Pakistan",
        "metaDescription": "Soft 100% pure cotton twisted ropes (Sooti Rassi) in Karachi. Non-abrasive, natural cotton cordage for awnings, stage rigging, crafts, and commercial use.",
        "usage": "Best for shop awning pull cords, marquee tent lacing, theater stage curtain rigging, domestic clotheslines, pet toys, and handicraft macramé art.",
        "benefits": [
          "Ultra-soft natural feel that never causes rope burns on bare hands",
          "Ties and unties easily without jamming or kinking",
          "Absorbs moisture and dye evenly for custom color treatments",
          "Runs quietly and smoothly through small wooden and brass pulleys"
],
        "suitedFor": [
          "Awning & canopy retractable pull cords",
          "Theater stage curtain rigging & backstage lines",
          "Tent lacing & decorative marquee finishes",
          "Macramé crafts, wall hangings & pet toys"
],
        "notSuitedFor": [
          "Harsh chemical wash plants or industrial high-tonnage lifting"
],
        "bulkPricing": [],
        "images": [
            {
                "src": "/uploads/products/ropes/pure-cotton-twisted-rope/cotton-rope-primary.jpg",
                "alt": "25mm pure cotton 3-strand twisted rope",
                "sortOrder": 0
            },
            {
                "src": "/uploads/products/ropes/pure-cotton-twisted-rope/cotton-rope-detail-1.webp",
                "alt": "Natural cream pure cotton rope bundle",
                "sortOrder": 1
            },
            {
                "src": "/uploads/products/ropes/pure-cotton-twisted-rope/cotton-rope-detail-2.jpg",
                "alt": "Soft cotton rope close-up texture",
                "sortOrder": 2
            },
            {
                "src": "/uploads/categories/ropes.jpeg",
                "alt": "Tahira Syndicate wholesale ropes inventory and warehouse stock coils",
                "sortOrder": 3
            }
        ],
        "faqs": [
          {
                    "question": "Can cotton rope be washed and reused?",
                    "answer": "Yes, pure cotton rope can be hand-washed with mild soap and air-dried. It retains its soft texture and strength through repeated gentle washings."
          },
          {
                    "question": "What diameters of Cotton rope are available?",
                    "answer": "We stock Cotton rope from 4mm up to 24mm in standard 50m, 100m, and 200m hanks and master spools."
          }
],
        "attrValues": [
            {
                "attr": "Available Diameters / Size (mm)",
                "val": "2mm – 25mm"
            },
            {
                "attr": "Material Composition",
                "val": "100% Pure Virgin Natural Cotton"
            },
            {
                "attr": "Strand Construction",
                "val": "3-Strand Twisted & Soft Braided"
            },
            {
                "attr": "Standard Packaging / Coil Length",
                "val": "Continuous Coils, Hanks & Spools"
            },
            {
                "attr": "Standard Color(s)",
                "val": "Natural Cream / Off-White"
            },
            {
                "attr": "Water & Moisture Behavior",
                "val": "High Liquid Absorption • Zero Static Charge"
            }
        ]
    },
    {
        "name": "Polyester Industrial Rope",
        "sku": "TS-ROP-POL-008",
        "slug": "polyester-industrial-rope",
        "price": 0,
        "moq": 1,
        "tradeAliases": "Polyester Rassa • PES Mooring Rope • High UV Resistance Rope • Low Stretch Marine Rope",
        "shortDescription": "Premium low-stretch polyester industrial rope. Delivers high UV resistance, smooth winching performance, and wet breaking strength for marine yachting and heavy transport.",
        "longDescription": "Unlike nylon which stretches under load or polypropylene which degrades faster under UV sun, Polyester (PES) rope maintains consistent length, does not lose strength when wet, and provides superior resistance against UV sunlight. It handles abrasive winch drums and capstans without melting or losing flexibility. Yacht captains, industrial riggers, and antenna mast technicians rely on polyester cordage for long-term outdoor installations.",
        "metaTitle": "Polyester Industrial Rope Wholesale Karachi Pakistan",
        "metaDescription": "High-tenacity low-stretch polyester industrial ropes in Karachi. Maximum UV resistance, high wet strength for marine rigging, winching, and transport.",
        "usage": "The preferred choice for yacht running rigging, antenna guy lines, flagpole halyards, utility winch lines, and heavy-duty cargo securing across Pakistan.",
        "benefits": [
          "Superior UV sunlight resistance for multi-year outdoor installations",
          "Low elongation — holds exact tension without sagging over time",
          "Retains 100% of its rated tensile breaking strength when wet",
          "High resistance against abrasive surface rubbing and friction wear"
],
        "suitedFor": [
          "Marine yacht running rigging & halyards",
          "Telecommunication tower & antenna guy lines",
          "Flagpole ropes & outdoor commercial banner suspension",
          "Winch pull lines & industrial safety barricades"
],
        "notSuitedFor": [
          "Applications requiring high kinetic shock absorption (use Nylon instead)"
],
        "bulkPricing": [],
        "images": [
            {
                "src": "/uploads/products/ropes/polyester-industrial-rope/polyester-rope-primary.jpg",
                "alt": "Low stretch industrial polyester rope coil",
                "sortOrder": 0
            },
            {
                "src": "/uploads/products/ropes/polyester-industrial-rope/polyester-rope-detail.jpg",
                "alt": "Polyester braided and twisted rope close-up",
                "sortOrder": 1
            },
            {
                "src": "/uploads/categories/ropes.jpeg",
                "alt": "Tahira Syndicate wholesale ropes inventory and warehouse stock coils",
                "sortOrder": 2
            }
        ],
        "faqs": [
          {
                    "question": "What is the main advantage of Polyester rope over Nylon rope?",
                    "answer": "Polyester has significantly lower stretch than nylon and retains full strength when wet, making it better for guy lines, halyards, and applications where maintaining tight tension without sag is essential."
          },
          {
                    "question": "What sizes are available in Polyester ropes?",
                    "answer": "We stock 3-strand and braided Polyester ropes from 4mm up to 32mm in standard 100m and 220m coils for wholesale orders."
          }
],
        "attrValues": [
            {
                "attr": "Available Diameters / Size (mm)",
                "val": "2mm – 36mm"
            },
            {
                "attr": "Material Composition",
                "val": "100% High-Tenacity Polyester (PES)"
            },
            {
                "attr": "Strand Construction",
                "val": "3-Strand Twisted & 16-Plait Braided"
            },
            {
                "attr": "Standard Packaging / Coil Length",
                "val": "100m, 200m & 220m Reels & Spools"
            },
            {
                "attr": "Standard Color(s)",
                "val": "White (with optional tracer)"
            },
            {
                "attr": "Water & Moisture Behavior",
                "val": "100% Wet Strength Retention • Low Stretch"
            }
        ]
    },
    {
        "name": "Coconut Coir Fiber Rope",
        "sku": "TS-ROP-COI-009",
        "slug": "coconut-coir-fiber-rope",
        "price": 0,
        "moq": 1,
        "tradeAliases": "Naryal Ka Rassa • Coir Yarn Rope • Natural Coconut Cordage • Kathya Rassa • Coir Twine",
        "shortDescription": "Traditional 100% natural coconut husk coir fiber rope (Naryal Ka Rassa). Lightweight, buoyant in seawater, naturally textured, and rot-resistant for marine and organic farm use.",
        "longDescription": "Spun from the fibrous husk of coconuts, Coir rope (Naryal Ka Rassa) is one of nature most water-tolerant natural cordages. Unlike other natural fibers that rot quickly in water, coir fibers are naturally rich in lignin, giving them resistance to saltwater, mold, and bacterial breakdown. Coir rope floats on water, provides a coarse, high-friction grip, and is widely used for wooden boat caulking, tree staking, aquaculture oyster farming, and eco-geotextiles.",
        "metaTitle": "Coconut Coir Fiber Rope Wholesale Karachi & Pakistan",
        "metaDescription": "Natural coconut coir fiber ropes (Naryal Ka Rassa) in Karachi. Rot-resistant, eco-friendly cordage for marine caulking, farming, and soil erosion control.",
        "usage": "Used for traditional wooden boat caulking, coastal aquaculture lines, agricultural plant and tree staking, soil erosion control, and rustic landscaping projects.",
        "benefits": [
          "Naturally resistant to saltwater rot and marine microorganism decay",
          "Lightweight and buoyant — floats on surface water",
          "100% biodegradable and organic natural coconut husk material",
          "Rough coarse surface texture holds knots and binds soil naturally"
],
        "suitedFor": [
          "Wooden fishing boat & dhow plank caulking",
          "Tree staking, vineyard training & organic farming",
          "Soil erosion control logs & coir geotextile blankets",
          "Rustic themed landscape architecture & eco fencing"
],
        "notSuitedFor": [
          "High-tonnage mechanical lifting or motorized winch drums"
],
        "bulkPricing": [],
        "images": [
            {
                "src": "/uploads/products/ropes/coconut-coir-fiber-rope/coir-rope-primary.jpg",
                "alt": "6mm natural coconut coir fiber rope",
                "sortOrder": 0
            },
            {
                "src": "/uploads/products/ropes/coconut-coir-fiber-rope/coir-rope-detail-1.jpg",
                "alt": "Coconut coir rope coil natural dark brown",
                "sortOrder": 1
            },
            {
                "src": "/uploads/products/ropes/coconut-coir-fiber-rope/coir-rope-detail-2.jpg",
                "alt": "Coir rope twisted fiber close-up texture",
                "sortOrder": 2
            },
            {
                "src": "/uploads/products/ropes/coconut-coir-fiber-rope/coir-rope-detail-3.jpg",
                "alt": "Coir rope bulk bundle",
                "sortOrder": 3
            },
            {
                "src": "/uploads/categories/ropes.jpeg",
                "alt": "Tahira Syndicate wholesale ropes inventory and warehouse stock coils",
                "sortOrder": 4
            }
        ],
        "faqs": [
          {
                    "question": "Why is Coir rope used for wooden boat caulking in Karachi Fish Harbour?",
                    "answer": "Coconut coir fiber swells slightly when wet, creating a tight, natural waterproof seal between wooden boat planks that resists saltwater rotting for years."
          },
          {
                    "question": "What coil sizes are available for wholesale Coir rope?",
                    "answer": "We supply Coir ropes from 6mm up to 28mm in standard bundles and bulk wholesale bales ready for immediate dispatch."
          }
],
        "attrValues": [
            {
                "attr": "Available Diameters / Size (mm)",
                "val": "2mm – 36mm"
            },
            {
                "attr": "Material Composition",
                "val": "100% Natural Coconut Husk Coir Fiber"
            },
            {
                "attr": "Strand Construction",
                "val": "2-Strand & 3-Strand Twisted Coir"
            },
            {
                "attr": "Standard Packaging / Coil Length",
                "val": "Continuous Hanks, Coils & Bales"
            },
            {
                "attr": "Standard Color(s)",
                "val": "Natural Amber / Dark Brown"
            },
            {
                "attr": "Water & Moisture Behavior",
                "val": "Saltwater Rot & Soil Decay Resistant"
            }
        ]
    },
    {
        "name": "Georgette Marine Mooring Rope",
        "sku": "TS-ROP-GEO-010",
        "slug": "georgette-marine-mooring-rope",
        "price": 0,
        "moq": 1,
        "tradeAliases": "Georgette Rassa • High-Grip Synthetic Rope • Marine Mooring Line • Georgette Cordage",
        "shortDescription": "Heavy-duty blended synthetic marine rope with crinkled georgette texture. Delivers non-slip grip in wet hands and high tensile strength for trawlers and cargo vessels.",
        "longDescription": "Deckhands on marine trawlers at Karachi Fish Harbour and cargo barges face slippery decks where smooth plastic ropes slip from wet hands. Georgette Marine Rope is engineered with a specialized crinkled filament texture that gives a coarse, non-slip grip even when soaked with ocean water and fish slime. It combines high tensile strength, rot resistance, and UV protection for tough coastal maritime operations.",
        "metaTitle": "Georgette Marine Mooring Rope Wholesale Karachi Supply",
        "metaDescription": "Heavy-duty Georgette marine ropes in Karachi. Textured non-slip grip, rot-proof synthetic cordage for fishing trawlers, barge mooring, and coastal docking.",
        "usage": "The go-to rope for fishing trawler nets, cargo vessel docking lines, harbor barge mooring, coastal fish farm anchoring, and heavy marine transport lashing.",
        "benefits": [
          "Crinkled surface texture gives positive, non-slip hand grip when wet",
          "100% waterproof and impervious to saltwater, fish slime, and oil",
          "High tensile breaking strength handles heavy vessel surge loads",
          "Resists fraying and abrasion against concrete docks and steel bollards"
],
        "suitedFor": [
          "Fishing trawler net lines & deck rigging",
          "Harbor tug & barge mooring lines",
          "Coastal fish farm cage anchoring",
          "Heavy cargo transport deck tie-downs"
],
        "notSuitedFor": [
          "High-heat industrial furnace lines exceeding 90°C"
],
        "bulkPricing": [],
        "images": [
            {
                "src": "/uploads/products/ropes/georgette-marine-mooring-rope/georgette-mooring-rope-primary.webp",
                "alt": "Georgette marine high-tenacity ship mooring rope",
                "sortOrder": 0
            },
            {
                "src": "/uploads/products/ropes/georgette-marine-mooring-rope/georgette-rope-thickness-measure.jpg",
                "alt": "Measuring thickness diameter of marine mooring rope",
                "sortOrder": 1
            },
            {
                "src": "/uploads/products/ropes/georgette-marine-mooring-rope/georgette-rope-coil-detail.avif",
                "alt": "High tenacity poly-composite marine rope coil",
                "sortOrder": 2
            },
            {
                "src": "/uploads/categories/ropes.jpeg",
                "alt": "Tahira Syndicate wholesale ropes inventory and warehouse stock coils",
                "sortOrder": 3
            }
        ],
        "faqs": [
          {
                    "question": "What makes Georgette rope better than standard smooth PP rope on fishing boats?",
                    "answer": "Standard PP rope becomes very slippery when wet with seawater and fish slime. Georgette rope has a textured, ribbed filament surface that provides a secure hand grip even under wet deck conditions."
          },
          {
                    "question": "What diameters are stocked in Georgette marine rope?",
                    "answer": "We stock Georgette ropes from 8mm up to 36mm in standard 100m, 200m, and 220m coils at our Karachi wholesale warehouse."
          }
],
        "attrValues": [
            {
                "attr": "Available Diameters / Size (mm)",
                "val": "6mm – 36mm"
            },
            {
                "attr": "Material Composition",
                "val": "High-Tenacity Poly-Composite Blend"
            },
            {
                "attr": "Strand Construction",
                "val": "3-Strand Twisted & 8-Strand Hawser"
            },
            {
                "attr": "Standard Packaging / Coil Length",
                "val": "Full Ship Mooring Coils (220m) & Cuts"
            },
            {
                "attr": "Standard Color(s)",
                "val": "Deep Marine Blue / White with Blue Tracer"
            },
            {
                "attr": "Water & Moisture Behavior",
                "val": "100% Floats on Water • Marine Fatigue Proof"
            }
        ]
    }
]

    for (const prodData of ropesProducts) {
      const product = await prisma.product.upsert({
        where: { sku: prodData.sku },
        update: {
          name: prodData.name,
          slug: prodData.slug,
          categoryId: ropesCat.id,
          price: prodData.price,
          moq: prodData.moq,
          availability: 'InStock',
          status: 'Active',
          seoStatus: 'Complete',
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
        create: {
          name: prodData.name,
          sku: prodData.sku,
          slug: prodData.slug,
          categoryId: ropesCat.id,
          price: prodData.price,
          moq: prodData.moq,
          availability: 'InStock',
          status: 'Active',
          seoStatus: 'Complete',
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
      })

      await prisma.productImage.deleteMany({ where: { productId: product.id } })
      for (const img of prodData.images) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            src: img.src,
            alt: img.alt,
            sortOrder: img.sortOrder,
          },
        })
      }

      await prisma.productFaq.deleteMany({ where: { productId: product.id } })
      for (let fIdx = 0; fIdx < prodData.faqs.length; fIdx++) {
        const faq = prodData.faqs[fIdx]
        await prisma.productFaq.create({
          data: {
            productId: product.id,
            question: faq.question,
            answer: faq.answer,
            sortOrder: fIdx + 1,
          },
        })
      }

      await prisma.productAttributeValue.deleteMany({ where: { productId: product.id } })
      for (const av of prodData.attrValues) {
        const attrId = ropesAttributeMap.get(av.attr)
        if (attrId) {
          await prisma.productAttributeValue.create({
            data: {
              productId: product.id,
              attributeId: attrId,
              value: av.val,
            },
          })
        }
      }
      console.log(`✅ Seeded product: ${product.name} (${product.sku})`)
    }
  }


  // 4. Seed Safety Belts & Webbing Slings Category
  const safetyCat = await prisma.category.upsert({
    where: { slug: 'safety-belts-webbing-slings' },
    update: {
      name: 'Safety Belts & Webbing Slings',
      slug: 'safety-belts-webbing-slings',
      image: '/uploads/categories/safety-belts-webbing-slings.jpeg',
      description: 'Certified polyester duplex webbing slings (1T-10T), endless round slings (gol patta), heavy ratchet cargo lashing tie-down belts, and 5-point full-body fall-arrest safety harnesses for industrial lifting, high-rise construction, and commercial transport in Karachi.',
      metaTitle: 'Wholesale Webbing Slings & Safety Belts Karachi | Tahira Syndicate',
      metaDescription: 'Certified polyester lifting webbing slings (1T-10T), ratchet tie-down belts and fall-arrest safety harnesses at wholesale rates in Karachi, Pakistan.',
    },
    create: {
      name: 'Safety Belts & Webbing Slings',
      slug: 'safety-belts-webbing-slings',
      image: '/uploads/categories/safety-belts-webbing-slings.jpeg',
      description: 'Certified polyester duplex webbing slings (1T-10T), endless round slings (gol patta), heavy ratchet cargo lashing tie-down belts, and 5-point full-body fall-arrest safety harnesses for industrial lifting, high-rise construction, and commercial transport in Karachi.',
      metaTitle: 'Wholesale Webbing Slings & Safety Belts Karachi | Tahira Syndicate',
      metaDescription: 'Certified polyester lifting webbing slings (1T-10T), ratchet tie-down belts and fall-arrest safety harnesses at wholesale rates in Karachi, Pakistan.',
    },
  })
  console.log('Safety Belts & Webbing Slings category initialized.')
  if (safetyCat) {
    const attributesData = [
      {
        name: 'Material Base',
        type: 'Select' as const,
        options: ['100% High-Tenacity Polyester (PES)', 'Polypropylene (PP)', 'Polyamide Nylon Blend', 'Forged Alloy Steel Hardware'],
      },
      {
        name: 'Working Load Limit (WLL)',
        type: 'Select' as const,
        options: ['1 Ton (Violet)', '2 Ton (Green)', '3 Ton (Yellow)', '4 Ton (Grey)', '5 Ton (Red)', '8 Ton (Blue)', '10 Ton (Orange)', '15 Ton', '20 Ton (Heavy Duty)'],
      },
      {
        name: 'Safety Factor Rating',
        type: 'Select' as const,
        options: ['SF 5:1 Standard', 'SF 6:1 Heavy Industrial', 'SF 7:1 Continuous Loop Safety Factor'],
      },
      {
        name: 'Webbing Width',
        type: 'Select' as const,
        options: ['25mm (1")', '38mm (1.5")', '50mm (2")', '75mm (3")', '100mm (4")', '125mm (5")', '150mm (6")', '200mm (8")', '250mm (10")'],
      },
      {
        name: 'Length Range',
        type: 'Select' as const,
        options: ['1 Meter (3.3 ft)', '2 Meters (6.6 ft)', '3 Meters (10 ft)', '4 Meters (13 ft)', '5 Meters (16 ft)', '6 Meters (20 ft)', '8 Meters (26 ft)', '10 Meters (33 ft)', '12 Meters (40 ft)', '50m Master Roll', '100m Master Roll'],
      },
      {
        name: 'Hardware & End Fittings',
        type: 'Select' as const,
        options: ['Reinforced Folded Eye Loops (Becket Eyes)', 'Endless Continuous Loop', 'Forged Double J-Hooks & Zinc Ratchet', 'Dorsal D-Ring & Mating Buckles', '55mm Large Scaffold Snap Hooks & Energy Absorber', 'Reinforced Snatch Loop Eyes'],
      },
    ]

    const attributeMap = new Map<string, number>()

    for (let i = 0; i < attributesData.length; i++) {
      const attrDef = attributesData[i]
      let attr = await prisma.attribute.findFirst({ where: { name: attrDef.name } })
      if (!attr) {
        attr = await prisma.attribute.create({
          data: {
            name: attrDef.name,
            type: attrDef.type,
            options: attrDef.options,
            status: 'Active',
          },
        })
      }
      attributeMap.set(attrDef.name, attr.id)

      await prisma.categoryAttribute.upsert({
        where: {
          categoryId_attributeId: {
            categoryId: safetyCat.id,
            attributeId: attr.id,
          },
        },
        update: { sortOrder: i + 1 },
        create: {
          categoryId: safetyCat.id,
          attributeId: attr.id,
          sortOrder: i + 1,
        },
      })
    }

    const products = [
      {
        name: 'Flat Woven Duplex Webbing Sling',
        sku: 'TS-SLG-DUP-001',
        slug: 'flat-woven-duplex-webbing-sling',
        price: 1850,
        moq: 1,
        "tradeAliases": "Webbing Sling • Crane Patta • Flat Lifting Belt • Duplex Sling • Polyester Hoist Belt • Chatta Patta",
        "shortDescription": "Double-ply polyester duplex flat webbing sling (1-Ton to 10-Ton). Features reinforced becket eyes, color-coded capacities, and 6:1 safety factor for crane lifts without surface scratches.",
        "longDescription": "Lifting heavy finished machinery, polished marble, painted steel, or yacht hulls with steel wire ropes leaves deep dents and scratches. Duplex Flat Webbing Slings provide high lifting strength with a broad, soft contact surface. Manufactured from 100% high-tenacity polyester webbing with reinforced folded becket eyes, these slings wrap securely around loads without damaging sensitive surfaces. Every sling is color-coded to international standards with woven capacity stripes.",
        "metaTitle": "Flat Woven Duplex Webbing Sling (1T-10T) Karachi Wholesale",
        "metaDescription": "Double-ply polyester duplex webbing slings (1 Ton to 10 Ton) in Karachi. Color-coded, SF 6:1 certified lifting belts for cranes, factories, and rigging.",
        "usage": "Used across steel pipe handling, machinery assembly plants, shipping container yards, granite slab lifting, yacht hoisting, and high-rise construction crane rigging in Pakistan.",
        "benefits": [
          "Wide flat surface distributes lifting pressure and protects delicate painted finishes",
          "Color-coded webbing with woven capacity stripes for instant safe load identification",
          "Reinforced folded becket eye loops resist hook abrasion and wear",
          "Lightweight and flexible — easy for crane riggers to handle and position"
],
        "suitedFor": [
          "Machinery, transformer & generator hoisting",
          "Polished stone, marble & glass pack handling",
          "Painted pipe & structural steel bundle lifting",
          "Marine boat & yacht haul-out lifting"
],
        "notSuitedFor": [
          "Lifting sharp, bare metal edges without protective corner cut sleeves"
],
        bulkPricing: [
          { minQty: 1, maxQty: 9, pricePerUnit: 1850, label: 'Standard Counter Rate' },
          { minQty: 10, maxQty: 49, pricePerUnit: 1650, label: 'Workshop Wholesale Pack' },
          { minQty: 50, pricePerUnit: 1450, label: 'Carton Master Lot' },
        ],
        images: [
          { src: '/uploads/products/safety-belts-webbing-slings/flat-woven-duplex-webbing-sling/flat-woven-duplex-webbing-sling-primary.jpg', alt: 'Color-coded flat woven duplex webbing sling lifting patta in Tahira Syndicate Bohrapir warehouse Karachi', sortOrder: 1 },
          { src: '/uploads/products/safety-belts-webbing-slings/flat-woven-duplex-webbing-sling/webbing-sling-reinforced-eye-texture.jpg', alt: 'Reinforced eye loop and heavy-duty polyester stitching on 3 ton yellow duplex crane sling', sortOrder: 2 },
          { src: '/uploads/products/safety-belts-webbing-slings/flat-woven-duplex-webbing-sling/polyester-crane-patta-tonnage-stripes.jpg', alt: 'International color-coded tonnage identification stripes on 100% polyester lifting sling patta', sortOrder: 3 },
          { src: '/uploads/products/safety-belts-webbing-slings/flat-woven-duplex-webbing-sling/duplex-lifting-patta-hook-attachment.jpg', alt: 'Flat woven lifting sling connected to heavy crane swivel hook for industrial hoisting', sortOrder: 4 },
          { src: '/uploads/products/safety-belts-webbing-slings/flat-woven-duplex-webbing-sling/safety-belts-webbing-slings-warehouse-bulk-stock.jpeg', alt: 'Wholesale stock of polyester lifting slings and safety belts on shelves in Bohrapir shop Karachi', sortOrder: 5 },
        ],
        "faqs": [
          {
                    "question": "How do I identify the lifting capacity of a duplex webbing sling?",
                    "answer": "Each sling follows international color codes: Violet (1 Ton), Green (2 Ton), Yellow (3 Ton), Grey (4 Ton), Red (5 Ton), Brown (6 Ton), Blue (8 Ton), and Orange (10 Ton). Each 25mm of webbing width corresponds to 1 Ton of capacity."
          },
          {
                    "question": "What capacities and lengths are available in stock?",
                    "answer": "We stock 1 Ton to 10 Ton slings in 1m, 2m, 3m, 4m, 6m, 8m, 10m, and 12m lengths, with custom multi-ton orders fabricated upon request."
          }
],
        attrValues: [
          { attr: 'Material Base', val: '100% High-Tenacity Polyester (PES)' },
          { attr: 'Working Load Limit (WLL)', val: '3 Ton (Yellow)' },
          { attr: 'Safety Factor Rating', val: 'SF 6:1 Heavy Industrial' },
          { attr: 'Webbing Width', val: '75mm (3")' },
          { attr: 'Length Range', val: '3 Meters (10 ft)' },
          { attr: 'Hardware & End Fittings', val: 'Reinforced Folded Eye Loops (Becket Eyes)' },
        ],
      },
      {
        name: 'Endless Tubular Round Webbing Sling',
        sku: 'TS-SLG-RND-002',
        slug: 'endless-tubular-round-webbing-sling',
        price: 2400,
        moq: 1,
        "tradeAliases": "Gol Patta • Endless Sling • Round Lifting Belt • Tubular Round Sling • Heavy Hoist Sling",
        "shortDescription": "Seamless tubular endless round sling (Gol Patta). Features a load-bearing polyester yarn core inside a protective sleeve that rotates choke points for maximum rigging life.",
        "longDescription": "Unlike flat eye-to-eye slings with fixed hook points, an Endless Round Sling (Gol Patta) is a continuous closed loop. This lets riggers rotate the choke point with each lift, preventing premature wear on a single spot. Inside the tough outer sleeve is a core of continuous parallel polyester filament strands that carry the entire load. It is extremely flexible, molds around irregular cylinders, and makes choke hitches on pipes and steel shafts simple and secure.",
        "metaTitle": "Endless Round Lifting Sling (Gol Patta) Karachi Supply",
        "metaDescription": "Heavy-duty endless round polyester lifting slings (Gol Patta) in Karachi. Continuous loop, flexible choke-hitch rigging for pipes and heavy machinery.",
        "usage": "Perfect for choke-hitch lifting of large cylindrical pipes, turbine shafts, heavy electric transformers, oil drums, and precision industrial molds in workshops.",
        "benefits": [
          "Continuous loop design allows rotation of wear points for longer sling life",
          "Molds flexibly around round, smooth, and cylindrical cargo loads",
          "Seamless outer sleeve shields internal load-bearing yarns from dirt and grit",
          "Ultra-compact and lightweight compared to heavy wire rope chokers"
],
        "suitedFor": [
          "Cylindrical pipe & tube bundle lifting (choke hitch)",
          "Heavy electric motor & transformer rigging",
          "Turbine rotor & industrial shaft hoisting",
          "Precision tooling & mold positioning in factories"
],
        "notSuitedFor": [
          "Direct contact with sharp sheet metal burrs without cut-resistant sleeves"
],
        bulkPricing: [
          { minQty: 1, maxQty: 9, pricePerUnit: 2400, label: 'Standard Single Unit' },
          { minQty: 10, maxQty: 49, pricePerUnit: 2150, label: 'Rigging Crew Pack' },
          { minQty: 50, pricePerUnit: 1900, label: 'Master Contractor Lot' },
        ],
        images: [
          { src: '/uploads/products/safety-belts-webbing-slings/endless-tubular-round-webbing-sling/endless-tubular-round-webbing-sling-primary.jpg', alt: 'Endless tubular round webbing sling gol patta for crane choke lifting in Karachi warehouse', sortOrder: 1 },
          { src: '/uploads/products/safety-belts-webbing-slings/endless-tubular-round-webbing-sling/round-sling-choke-hitch-detail.jpg', alt: 'Heavy-duty green and yellow endless round sling wrapped around cylindrical steel load', sortOrder: 2 },
          { src: '/uploads/products/safety-belts-webbing-slings/endless-tubular-round-webbing-sling/tubular-polyester-gol-patta-core-structure.jpg', alt: 'Cross-section of continuous polyester filament core inside protective seamless tubular sleeve', sortOrder: 3 },
          { src: '/uploads/products/safety-belts-webbing-slings/endless-tubular-round-webbing-sling/safety-belts-webbing-slings-warehouse-bulk-stock.jpeg', alt: 'Wholesale inventory of lifting slings and safety belts stacked on shelves in Bohrapir Karachi shop', sortOrder: 4 },
        ],
        "faqs": [
          {
                    "question": "Why choose a round sling (Gol Patta) over a flat webbing sling?",
                    "answer": "Round slings mold tighter around cylindrical objects like pipes and allow you to rotate the contact point so the sling wears evenly, lasting significantly longer in heavy daily use."
          },
          {
                    "question": "What happens if the outer sleeve gets scuffed?",
                    "answer": "The outer tubular sleeve is a protective cover; the actual weight is carried by continuous inner core yarns. However, if the outer jacket is cut deeply enough to expose inner white yarns, the sling should be retired."
          }
],
        attrValues: [
          { attr: 'Material Base', val: '100% High-Tenacity Polyester (PES)' },
          { attr: 'Working Load Limit (WLL)', val: '5 Ton (Red)' },
          { attr: 'Safety Factor Rating', val: 'SF 7:1 Continuous Loop Safety Factor' },
          { attr: 'Length Range', val: '4 Meters (13 ft)' },
          { attr: 'Hardware & End Fittings', val: 'Endless Continuous Loop' },
        ],
      },
      {
        name: 'Ratchet Cargo Lashing Tie-Down Belt',
        sku: 'TS-LSH-RAT-003',
        slug: 'ratchet-cargo-lashing-tie-down-belt',
        price: 2100,
        moq: 1,
        "tradeAliases": "Ratchet Belt • Cargo Lashing Patta • Truck Tie-Down Belt • Lashing Strap • Ratchet Strap",
        "shortDescription": "Heavy-duty polyester cargo tie-down strap with hardened steel ratchet buckle and double J-hooks. Locks freight tightly on flatbed trucks, trailers, and shipping containers.",
        "longDescription": "Tying down cargo on open flatbed trailers with loose ropes is slow and risks loads shifting during highway transit. Our heavy-duty ratchet lashing belts use high-tenacity polyester webbing with low elongation and a smooth, mechanical gear-locking ratchet handle. One operator can crank thousands of kilograms of tension across palletized freight in seconds. The double J-hooks latch securely onto truck chassis rails and container anchor rings.",
        "metaTitle": "Heavy-Duty Cargo Ratchet Lashing Belt Wholesale Karachi",
        "metaDescription": "Heavy duty ratchet tie-down lashing belts (25mm to 100mm) with J-hooks in Karachi. High tensile polyester strap for truck cargo securing and container lashing.",
        "usage": "Engineered for flatbed truck transport, trailer cargo lashing, shipping container tie-downs, generator road securing, and heavy pallet freight transport across Pakistan highways.",
        "benefits": [
          "High mechanical leverage crank handle applies massive tension with minimal effort",
          "Low-stretch polyester webbing keeps cargo completely locked over long highway journeys",
          "Double J-hooks made from forged heat-treated alloy steel for secure chassis anchoring",
          "Weather-proof, oil-resistant webbing that will not rot in coastal humidity"
],
        "suitedFor": [
          "Flatbed trailer & truck bed freight securing",
          "Shipping container internal cargo lashing",
          "Heavy machinery, generator & transformer road transit",
          "Steel coil & building material transport tie-downs"
],
        "notSuitedFor": [
          "Vertical overhead crane hoisting (this is a lashing strap, not a lifting sling)"
],
        bulkPricing: [
          { minQty: 1, maxQty: 9, pricePerUnit: 2100, label: 'Single Lashing Set' },
          { minQty: 10, maxQty: 49, pricePerUnit: 1850, label: 'Fleet Box Pack (10 Sets)' },
          { minQty: 50, pricePerUnit: 1600, label: 'Logistics Master Lot' },
        ],
        images: [
          { src: '/uploads/products/safety-belts-webbing-slings/ratchet-cargo-lashing-tie-down-belt/ratchet-cargo-lashing-tie-down-belt-primary.jpg', alt: '5 Ton 50mm ratchet cargo lashing tie-down belt with double J-hooks in Bohrapir Karachi warehouse', sortOrder: 1 },
          { src: '/uploads/products/safety-belts-webbing-slings/ratchet-cargo-lashing-tie-down-belt/ratchet-buckle-tensioner-detail.webp', alt: 'Heavy-duty zinc plated ratchet buckle mechanism on orange polyester cargo lashing strap', sortOrder: 2 },
          { src: '/uploads/products/safety-belts-webbing-slings/ratchet-cargo-lashing-tie-down-belt/forged-double-j-hook-anchor-fitting.jpg', alt: 'Forged carbon steel double J-hook anchor fitting for truck bed rail lashing', sortOrder: 3 },
          { src: '/uploads/products/safety-belts-webbing-slings/ratchet-cargo-lashing-tie-down-belt/safety-belts-webbing-slings-warehouse-bulk-stock.jpeg', alt: 'Wholesale inventory of lifting slings and safety belts stacked on shelves in Bohrapir Karachi shop', sortOrder: 4 },
        ],
        "faqs": [
          {
                    "question": "What widths and break strengths are available for ratchet lashing belts?",
                    "answer": "We supply 25mm (1-Ton), 38mm (2-Ton to 3-Ton), 50mm (5-Ton), and 75mm/100mm (10-Ton) ratchet tie-down belts in standard 6m, 8m, 10m, and 12m lengths."
          },
          {
                    "question": "Can ratchet belts be used to lift machinery with a crane?",
                    "answer": "No. Ratchet straps are designed exclusively for static cargo tie-down and road transit lashing. For crane lifting, use certified Duplex Webbing Slings or Round Slings."
          }
],
        attrValues: [
          { attr: 'Material Base', val: '100% High-Tenacity Polyester (PES)' },
          { attr: 'Working Load Limit (WLL)', val: '5 Ton (Red)' },
          { attr: 'Safety Factor Rating', val: 'SF 5:1 Standard' },
          { attr: 'Webbing Width', val: '50mm (2")' },
          { attr: 'Length Range', val: '8 Meters (26 ft)' },
          { attr: 'Hardware & End Fittings', val: 'Forged Double J-Hooks & Zinc Ratchet' },
        ],
      },
      {
        name: 'Full Body Fall-Arrest Safety Harness',
        sku: 'TS-SAF-HAR-004',
        slug: 'full-body-fall-arrest-safety-harness',
        price: 3200,
        moq: 1,
        "tradeAliases": "Safety Belt • 5-Point Safety Harness • Construction Safety Belt • Fall Arrest Harness",
        "shortDescription": "Full-body 5-point fall-arrest safety harness with dorsal D-ring, adjustable chest/thigh straps, and energy-absorbing lanyard for high-rise scaffolding and tower workers.",
        "longDescription": "A standard waist belt can cause severe spinal injury in a fall. A certified 5-point full-body safety harness distributes fall impact forces across the shoulders, chest, and thighs. Our harnesses are built from high-strength polyester webbing with stamped alloy steel buckles, a heavy dorsal D-ring for lifeline attachment, and an optional shock-absorbing lanyard with double scaffold snap hooks for 100% tie-off safety on construction jobs.",
        "metaTitle": "Full Body Fall-Arrest Safety Harness Belt Karachi Supply",
        "metaDescription": "Certified 5-point full body fall-arrest safety harnesses with energy absorber lanyards in Karachi. High-strength construction safety belts for site workers.",
        "usage": "Essential personal protective equipment (PPE) for high-rise scaffolding, elevator shaft work, steel building erection, cell tower maintenance, and industrial roofing.",
        "benefits": [
          "5-point ergonomic adjustment spreads fall shock forces across chest and thighs",
          "High-tensile polyester webbing with high abrasion and chemical resistance",
          "Heavy forged dorsal D-ring for quick snap hook and lifeline connection",
          "Dual scaffold hooks on energy-absorbing lanyard allow 100% tie-off during movement"
],
        "suitedFor": [
          "High-rise building scaffolding & facade maintenance",
          "Structural steel erection & crane rigging access",
          "Telecommunication tower & mast climbing",
          "Elevator shaft, bridge & roof construction work"
],
        "notSuitedFor": [
          "Chemical splash suits or high-heat direct welding operations without leather covers"
],
        bulkPricing: [
          { minQty: 1, maxQty: 9, pricePerUnit: 3200, label: 'Single Safety Harness' },
          { minQty: 10, maxQty: 49, pricePerUnit: 2850, label: 'Contractor Crew Pack (10 Units)' },
          { minQty: 50, pricePerUnit: 2500, label: 'Project Master Lot' },
        ],
        images: [
          { src: '/uploads/products/safety-belts-webbing-slings/full-body-fall-arrest-safety-harness/full-body-fall-arrest-safety-harness-primary.jpeg', alt: 'Full body fall-arrest safety harness with dorsal D-ring in Tahira Syndicate Bohrapir stock Karachi', sortOrder: 1 },
          { src: '/uploads/products/safety-belts-webbing-slings/full-body-fall-arrest-safety-harness/safety-harness-d-ring-buckle-detail.jpeg', alt: 'Forged steel dorsal D-ring and reinforced pass-through buckles on high-rise construction safety harness', sortOrder: 2 },
          { src: '/uploads/products/safety-belts-webbing-slings/full-body-fall-arrest-safety-harness/5-point-high-altitude-harness-adjustment-straps.webp', alt: '5-point adjustable chest and thigh strapping on industrial safety belt', sortOrder: 3 },
          { src: '/uploads/products/safety-belts-webbing-slings/full-body-fall-arrest-safety-harness/safety-belts-webbing-slings-warehouse-bulk-stock.jpeg', alt: 'Wholesale inventory of lifting slings and safety belts stacked on shelves in Bohrapir Karachi shop', sortOrder: 4 },
        ],
        "faqs": [
          {
                    "question": "Why is a 5-point full body harness safer than a simple waist safety belt?",
                    "answer": "A full body harness distributes the shock of a sudden fall across the pelvic bone and shoulders, keeping the worker upright and preventing severe internal spinal injuries caused by waist-only belts."
          },
          {
                    "question": "Does the safety harness include a lanyard and snap hooks?",
                    "answer": "Yes, we supply full sets complete with a shock-absorbing lanyard, double large forged steel scaffold hooks, and quick-connect carabiners for immediate on-site compliance."
          }
],
        attrValues: [
          { attr: 'Material Base', val: '100% High-Tenacity Polyester (PES)' },
          { attr: 'Webbing Width', val: '50mm (2")' },
          { attr: 'Hardware & End Fittings', val: 'Dorsal D-Ring & Mating Buckles' },
        ],
      },
      {
        name: 'Shock-Absorbing Double Lanyard with Scaffold Hooks',
        sku: 'TS-SAF-LAN-005',
        slug: 'shock-absorbing-double-lanyard-scaffold-hooks',
        price: 2800,
        moq: 1,
        tradeAliases: "Double Lanyard • Scaffold Hook Lanyard • Shock Absorber Lanyard • Fall Arrest Lanyard • Y-Lanyard",
        shortDescription: "Twin-leg Y-lanyard with integrated tear-webbing shock absorber and double large steel scaffold hooks. Guarantees 100% continuous tie-off while transitioning across scaffolding.",
        longDescription: "Moving along scaffolding beams and structural steel requires disconnecting and reconnecting your safety hook. With a single lanyard, a worker is unprotected during the transition. A Twin-Leg Shock-Absorbing Y-Lanyard solves this hazard by allowing the rigger to keep one scaffold hook anchored while moving the other. The integrated tear-webbing energy absorber deploys smoothly during a fall, reducing arrest forces on the body to below safe limits.",
        metaTitle: "Shock Absorbing Double Lanyard Scaffold Hooks Karachi",
        metaDescription: "Twin-leg shock absorbing lanyards with forged steel scaffold hooks in Karachi. Certified 100% tie-off fall protection for scaffolding and high-rise riggers.",
        usage: "Used with full-body safety harnesses on high-rise building scaffolding, steel frame erection, transmission tower painting, and tower crane assembly.",
        benefits: [
          "Twin-leg Y-design ensures worker remains 100% tied off at all times during movement",
          "Tear-webbing energy absorber dampens sudden deceleration shock forces safely",
          "Large forged alloy steel scaffold hooks fit over standard 50mm scaffold pipes",
          "Abrasion-resistant tubular polyester webbing sleeve for prolonged outdoor life"
],
        suitedFor: [
          "Scaffold pipe transit & steel beam walking",
          "Tower crane maintenance & aerial platform rigging",
          "Transmission line & mast climbing",
          "Industrial plant pipe rack inspection"
],
        notSuitedFor: [
          "Working with less than 5.5 meters of free fall clearance beneath the anchorage point"
],
        bulkPricing: [
          { minQty: 1, maxQty: 9, pricePerUnit: 2800, label: 'Single Lanyard Set' },
          { minQty: 10, maxQty: 49, pricePerUnit: 2500, label: 'Scaffolding Team Pack (10 Sets)' },
          { minQty: 50, pricePerUnit: 2200, label: 'Contractor Master Lot' },
        ],
        images: [
          { src: '/uploads/products/safety-belts-webbing-slings/shock-absorbing-double-lanyard-scaffold-hooks/shock-absorbing-double-lanyard-scaffold-hooks-primary.jpeg', alt: 'Shock-absorbing double lanyard with dual 55mm scaffold hooks in Tahira Syndicate Karachi warehouse', sortOrder: 1 },
          { src: '/uploads/products/safety-belts-webbing-slings/shock-absorbing-double-lanyard-scaffold-hooks/scaffold-hook-energy-absorber-detail.webp', alt: 'Close-up of forged steel self-locking scaffold hook and energy dissipation tear pack', sortOrder: 2 },
          { src: '/uploads/products/safety-belts-webbing-slings/shock-absorbing-double-lanyard-scaffold-hooks/twin-leg-y-lanyard-55mm-forged-steel-snap-hooks.jpg', alt: 'Twin-leg Y-type energy absorbing lanyard with dual large opening scaffolding hooks', sortOrder: 3 },
          { src: '/uploads/products/safety-belts-webbing-slings/shock-absorbing-double-lanyard-scaffold-hooks/safety-belts-webbing-slings-warehouse-bulk-stock.jpeg', alt: 'Wholesale inventory of lifting slings and safety belts stacked on shelves in Bohrapir Karachi shop', sortOrder: 4 },
        ],
        faqs: [
          {
                    "question": "How does the tear-webbing energy absorber work?",
                    "answer": "Inside the zippered pouch is a folded length of webbing stitched together with controlled-release threads. In a fall, the stitching tears progressively, absorbing kinetic energy and cushioning the worker body."
          },
          {
                    "question": "What is the hook opening size on the scaffold hooks?",
                    "answer": "The large forged alloy scaffold hooks feature a 55mm gate opening with an automatic double-locking spring gate that fits standard scaffolding pipes."
          }
],
        attrValues: [
          { attr: 'Material Base', val: '100% High-Tenacity Polyester (PES)' },
          { attr: 'Length Range', val: '2 Meters (6.6 ft)' },
          { attr: 'Hardware & End Fittings', val: '55mm Large Scaffold Snap Hooks & Energy Absorber' },
        ],
      },
      {
        name: 'Heavy-Duty Vehicle Towing & Recovery Strap',
        sku: 'TS-TOW-STR-006',
        slug: 'heavy-duty-vehicle-towing-recovery-strap',
        price: 2900,
        moq: 1,
        tradeAliases: "Tow Strap • Recovery Belt • Towing Patta • Truck Pulling Belt • Gari Khainchne Wala Patta",
        shortDescription: "Heavy-duty 5-Ton to 20-Ton polyester vehicle recovery and towing strap with reinforced eye loops and forged steel shackles. Pulls stuck trucks, 4x4s, and trailers safely.",
        longDescription: "Towing stuck trucks, loaded trailers, or construction equipment with rusty chains or steel cables risks snapped metal whipping through windshields. Heavy-Duty Polyester Towing & Recovery Straps provide a safer pulling solution with high tensile strength and controlled elasticity. They absorb the initial jolt when the tow vehicle accelerates, preventing transmission damage and chassis bending.",
        metaTitle: "Vehicle Towing Recovery Strap (5T-20T) Karachi Wholesale",
        metaDescription: "Heavy-duty vehicle recovery tow straps (5 Ton to 20 Ton) in Karachi. Reinforced loop ends and forged shackles for truck breakdown and off-road recovery.",
        usage: "Carried by highway breakdown recovery fleets, heavy transport logistics trucks, off-road 4x4 vehicles, construction site dumpers, and agricultural tractors across Pakistan.",
        benefits: [
          "Controlled elasticity cushions initial jerk shock, protecting vehicle drivelines",
          "Reinforced loop ends with Cordura protective sleeves prevent hook friction tears",
          "Much lighter, safer, and easier to store in a vehicle boot than heavy steel chains",
          "Weather-resistant polyester webbing that will not rust or weaken in mud and water"
],
        suitedFor: [
          "Highway breakdown truck & trailer towing",
          "4x4 off-road mud, sand & rocky track recovery",
          "Construction site dumper & excavator recovery",
          "Agricultural tractor field towing"
],
        notSuitedFor: [
          "Kinetic snatch recoveries where 100% high-stretch nylon snatch straps are required"
],
        bulkPricing: [
          { minQty: 1, maxQty: 9, pricePerUnit: 2900, label: 'Single Recovery Strap' },
          { minQty: 10, maxQty: 49, pricePerUnit: 2600, label: 'Fleet Emergency Pack (10 Straps)' },
          { minQty: 50, pricePerUnit: 2300, label: 'Transport Union Master Lot' },
        ],
        images: [
          { src: '/uploads/products/safety-belts-webbing-slings/heavy-duty-vehicle-towing-recovery-strap/heavy-duty-vehicle-towing-recovery-strap-primary.jpg', alt: 'Heavy-duty 10 ton vehicle towing and recovery strap with reinforced eyes in Bohrapir Karachi warehouse', sortOrder: 1 },
          { src: '/uploads/products/safety-belts-webbing-slings/heavy-duty-vehicle-towing-recovery-strap/recovery-strap-reinforced-eye-detail.jpg', alt: 'Double-stitched protective cordura sleeve on high-tensile truck recovery snatch strap loop', sortOrder: 2 },
          { src: '/uploads/products/safety-belts-webbing-slings/heavy-duty-vehicle-towing-recovery-strap/heavy-truck-snatch-strap-kinetic-recovery.webp', alt: 'Heavy truck recovery strap coiled ready for breakdown towing on Karachi highway', sortOrder: 3 },
          { src: '/uploads/products/safety-belts-webbing-slings/heavy-duty-vehicle-towing-recovery-strap/safety-belts-webbing-slings-warehouse-bulk-stock.jpeg', alt: 'Wholesale inventory of lifting slings and safety belts stacked on shelves in Bohrapir Karachi shop', sortOrder: 4 },
        ],
        faqs: [
          {
                    "question": "What tonnages and lengths are available for recovery tow straps?",
                    "answer": "We supply 5-Ton (50mm width), 10-Ton (75mm width), 15-Ton (100mm width), and heavy 20-Ton (150mm width) recovery straps in standard 6m, 9m, and 12m lengths."
          },
          {
                    "question": "Can these straps be used with forged bow shackles?",
                    "answer": "Yes, the reinforced becket eyes are sized to fit standard 3.25T, 4.75T, and 6.5T forged screw-pin bow shackles without binding."
          }
],
        attrValues: [
          { attr: 'Material Base', val: '100% High-Tenacity Polyester (PES)' },
          { attr: 'Working Load Limit (WLL)', val: '10 Ton (Orange)' },
          { attr: 'Safety Factor Rating', val: 'SF 5:1 Standard' },
          { attr: 'Webbing Width', val: '75mm (3")' },
          { attr: 'Length Range', val: '6 Meters (20 ft)' },
          { attr: 'Hardware & End Fittings', val: 'Reinforced Snatch Loop Eyes' },
        ],
      },
      {
        name: 'Industrial Polyester Webbing & Niwar Roll',
        sku: 'TS-WEB-ROL-007',
        slug: 'industrial-polyester-webbing-niwar-roll',
        price: 3800,
        moq: 1,
        tradeAliases: "Polyester Niwar • Webbing Thaan • Industrial Tape Roll • Cargo Belt Webbing • Niwar Roll",
        shortDescription: "Continuous 50m and 100m master rolls of high-tenacity polyester webbing and niwar (25mm to 100mm). For strap fabrication, bag handles, furniture borders, and heavy binding.",
        metaTitle: "Industrial Polyester Webbing Niwar Roll Karachi Wholesale",
        metaDescription: "High-tenacity polyester webbing rolls and industrial niwar (25mm to 100mm) in Karachi. Heavy-duty strap fabrication, tarpaulin edging, and luggage webbing.",
        usage: "Used by strap fabricators, bag and backpack manufacturers, furniture makers, tarpaulin border stitchers, and logistics packaging operations across Karachi.",
        benefits: [
          "High-tenacity polyester yarns ensure high break strength across the entire roll",
          "Tight, balanced weave resists edge fraying during stitching and hot-knife cutting",
          "High UV sunlight and rot resistance for indoor and outdoor applications",
          "Available in continuous 50m and 100m master rolls with minimal splices"
],
        suitedFor: [
          "Custom cargo strap & ratchet belt manufacturing",
          "Tarpaulin hem & shade net border reinforcement stitching",
          "Heavy luggage, military tactical gear & backpack straps",
          "Industrial pipe bundling & godown shelf edge lashing"
],
        notSuitedFor: [
          "Direct human fall arrest without certified end termination stitching"
],
        bulkPricing: [
          { minQty: 1, maxQty: 4, pricePerUnit: 3800, label: 'Single Roll (50m Thaan)' },
          { minQty: 5, maxQty: 19, pricePerUnit: 3400, label: 'Workshop Bundle (5 Rolls)' },
          { minQty: 20, pricePerUnit: 3000, label: 'Master Sack Lot (20 Rolls)' },
        ],
        images: [
          { src: '/uploads/products/safety-belts-webbing-slings/industrial-polyester-webbing-niwar-roll/industrial-polyester-webbing-niwar-roll-primary.jpg', alt: 'Industrial polyester webbing and niwar rolls thaan in Tahira Syndicate Bohrapir warehouse Karachi', sortOrder: 1 },
          { src: '/uploads/products/safety-belts-webbing-slings/industrial-polyester-webbing-niwar-roll/webbing-roll-weave-thickness-detail.jpg', alt: 'Multi-width black and orange high-tenacity polyester niwar rolls showing edge weave', sortOrder: 2 },
          { src: '/uploads/products/safety-belts-webbing-slings/industrial-polyester-webbing-niwar-roll/slotted-polyester-niwar-thaan-bulk-coils.jpg', alt: 'Bulk stacks of heavy polyester webbing coils ready for dispatch in Karachi', sortOrder: 3 },
          { src: '/uploads/products/safety-belts-webbing-slings/industrial-polyester-webbing-niwar-roll/safety-belts-webbing-slings-warehouse-bulk-stock.jpeg', alt: 'Wholesale inventory of lifting slings and safety belts stacked on shelves in Bohrapir Karachi shop', sortOrder: 4 },
        ],
        faqs: [
          {
                    "question": "What roll widths and colors are available for polyester niwar?",
                    "answer": "We stock 25mm (1\"), 38mm (1.5\"), 50mm (2\"), 75mm (3\"), and 100mm (4\") widths in High-Visibility Orange, Yellow, Blue, Black, White, and Military Olive Green."
          },
          {
                    "question": "Can this webbing be heat-sealed with a hot knife?",
                    "answer": "Yes, polyester webbing cuts and seals cleanly with an electric hot knife cutter, preventing end fraying before stitching."
          }
],
        attrValues: [
          { attr: 'Material Base', val: '100% High-Tenacity Polyester (PES)' },
          { attr: 'Webbing Width', val: '50mm (2")' },
          { attr: 'Length Range', val: '50m Master Roll' },
        ],
      },
    ]

    for (const prodData of products) {
      const product = await prisma.product.upsert({
        where: { sku: prodData.sku },
        update: {
          name: prodData.name,
          slug: prodData.slug,
          categoryId: safetyCat.id,
          price: prodData.price,
          moq: prodData.moq,
          availability: 'InStock',
          status: 'Active',
          seoStatus: 'Complete',
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
        create: {
          name: prodData.name,
          sku: prodData.sku,
          slug: prodData.slug,
          categoryId: safetyCat.id,
          price: prodData.price,
          moq: prodData.moq,
          availability: 'InStock',
          status: 'Active',
          seoStatus: 'Complete',
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
      })

      await prisma.productImage.deleteMany({ where: { productId: product.id } })
      for (const img of prodData.images) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            src: img.src,
            alt: img.alt,
            sortOrder: img.sortOrder,
          },
        })
      }

      await prisma.productFaq.deleteMany({ where: { productId: product.id } })
      for (let fIdx = 0; fIdx < prodData.faqs.length; fIdx++) {
        const faq = prodData.faqs[fIdx]
        await prisma.productFaq.create({
          data: {
            productId: product.id,
            question: faq.question,
            answer: faq.answer,
            sortOrder: fIdx + 1,
          },
        })
      }

      await prisma.productAttributeValue.deleteMany({ where: { productId: product.id } })
      for (const av of prodData.attrValues) {
        const attrId = attributeMap.get(av.attr)
        if (attrId) {
          await prisma.productAttributeValue.create({
            data: {
              productId: product.id,
              attributeId: attrId,
              value: av.val,
            },
          })
        }
      }
      console.log(`✅ Seeded product: ${product.name} (${product.sku})`)
    }
  }

  // 5. Seed Tarpaulins & Canvas Tents Category
  const tarpCat = await prisma.category.upsert({
    where: { slug: 'tarpaulins-canvas-tents' },
    update: {
      name: 'Tarpaulins & Canvas Tents',
      slug: 'tarpaulins-canvas-tents',
      image: '/uploads/categories/tarpaulins-canvas-tents.jpeg',
      description: 'Cross-laminated HDPE waterproof tarpaulins, heavy-duty 100% cotton canvas truck sheets, industrial PVC vinyl coated covers, and emergency relief tents for logistics, agriculture, and construction in Pakistan.',
      metaTitle: 'Wholesale Tarpaulin & Canvas Tents Karachi | Tahira Syndicate',
      metaDescription: 'Heavy-duty waterproof HDPE tarpal, canvas truck tirpal, PVC coated tarpaulin & relief canvas tents at wholesale factory rates in Bohrapir Karachi Pakistan.',
    },
    create: {
      name: 'Tarpaulins & Canvas Tents',
      slug: 'tarpaulins-canvas-tents',
      image: '/uploads/categories/tarpaulins-canvas-tents.jpeg',
      description: 'Cross-laminated HDPE waterproof tarpaulins, heavy-duty 100% cotton canvas truck sheets, industrial PVC vinyl coated covers, and emergency relief tents for logistics, agriculture, and construction in Pakistan.',
      metaTitle: 'Wholesale Tarpaulin & Canvas Tents Karachi | Tahira Syndicate',
      metaDescription: 'Heavy-duty waterproof HDPE tarpal, canvas truck tirpal, PVC coated tarpaulin & relief canvas tents at wholesale factory rates in Bohrapir Karachi Pakistan.',
    },
  })
  console.log('Tarpaulins & Canvas Tents category initialized.')

  if (tarpCat) {
    const tarpAttributesData = [
      {
        name: 'Material Composition',
        type: 'Select' as const,
        options: ['100% Virgin HDPE (LDPE Laminated)', '100% Breathable Duck Cotton Canvas', 'High-Tenacity PVC Coated Scrim', 'Optical Clear Flexible PVC'],
      },
      {
        name: 'Fabric Weight / Density',
        type: 'Select' as const,
        options: ['90 GSM', '120 GSM', '150 GSM', '180 GSM', '200 GSM', '250 GSM', '14oz (400 GSM)', '16oz (480 GSM)', '18oz (550 GSM)', '650–750+ GSM PVC'],
      },
      {
        name: 'Waterproof & UV Protection',
        type: 'Select' as const,
        options: ['100% Hydrostatic Waterproof', 'Dual-Side UV Stabilized', 'Mildew & Fungus Resistant Treatment'],
      },
      {
        name: 'Standard Roll & Sheet Sizes',
        type: 'Select' as const,
        options: ['9x12 ft', '12x15 ft', '15x18 ft', '18x24 ft', '20x30 ft', '24x36 ft', '30x40 ft', 'Custom Godown & Truck Sizes'],
      },
      {
        name: 'Hem & Eyelet Construction',
        type: 'Select' as const,
        options: ['Heat-Sealed Rope Hem with Aluminum Eyelets at 3ft', 'Triple-Stitched Hem with Solid Brass Eyelets', 'High-Frequency Welded Border with Nickel Grommets'],
      },
      {
        name: 'Standard Color Options',
        type: 'Select' as const,
        options: ['Blue/Orange', 'Blue/Silver', 'Green/Silver', 'Olive Green Canvas', 'Khaki Tan', 'Glossy Blue/Yellow PVC', 'Crystal Transparent'],
      },
    ]

    const tarpAttributeMap = new Map<string, number>()

    for (let i = 0; i < tarpAttributesData.length; i++) {
      const attrDef = tarpAttributesData[i]
      let attr = await prisma.attribute.findFirst({ where: { name: attrDef.name } })
      if (!attr) {
        attr = await prisma.attribute.create({
          data: {
            name: attrDef.name,
            type: attrDef.type,
            options: attrDef.options,
            status: 'Active',
          },
        })
      }
      tarpAttributeMap.set(attrDef.name, attr.id)

      await prisma.categoryAttribute.upsert({
        where: {
          categoryId_attributeId: {
            categoryId: tarpCat.id,
            attributeId: attr.id,
          },
        },
        update: { sortOrder: i + 1 },
        create: {
          categoryId: tarpCat.id,
          attributeId: attr.id,
          sortOrder: i + 1,
        },
      })
    }

    const tarpProducts = [
      {
        name: 'Multi-Color HDPE Waterproof Tarpaulin',
        sku: 'TS-TRP-HDP-001',
        slug: 'multi-color-hdpe-waterproof-tarpaulin',
        price: 1850,
        moq: 5,
        tradeAliases: "Silpaulin • Blue/Orange Tirpal • Multilayer Tarpaulin Sheet • Waterproof Plastic Tarpal",
        shortDescription: "Multi-layer cross-laminated HDPE waterproof tarpaulin. Ultra-lightweight, easy to fold, and highly tear-resistant with ultrasonic eyelets for quick temporary roof and site protection.",
        longDescription: "Heavy PVC tarpaulins can be too heavy for 1 or 2 workers to spread quickly over a large area. Cross-laminated HDPE tarpaulins (Silpaulin type) give you 100% waterproof protection at a fraction of the weight. Built by cross-bonding high-density polyethylene films at alternating angles, this sheet will not tear even if punctured by a sharp point. It folds down compactly, handles extreme heat and cold, and comes equipped with ultrasonically sealed corner eyelets.",
        metaTitle: "HDPE Cross-Laminated Tarpaulin Sheet Karachi Wholesale",
        metaDescription: "Lightweight multi-layer cross-laminated HDPE waterproof tarpaulin sheets in Karachi. Tear-resistant, UV-treated blue/orange tirpal for construction and farming.",
        usage: "Used for quick emergency roof leak covers, agricultural grain drying, hay covers, camp groundsheets, construction sand piles, and light commercial truck covers.",
        benefits: [
          "Lightweight and manageable — one person can cover large areas quickly",
          "Cross-laminated film structure stops punctures from running into long tears",
          "100% waterproof with ultrasonic sealed joints and hem eyelets",
          "Folds down compactly for easy storage in vehicle boots and toolboxes"
],
        suitedFor: [
          "Emergency roof leak & rain protection",
          "Agricultural grain drying floors & crop piles",
          "Light truck bed & pickup cargo covers",
          "Construction scaffold weather screening"
],
        notSuitedFor: [
          "Permanent multi-year open canopy structures with continuous tension pulling"
],
        bulkPricing: [
          { minQty: 5, maxQty: 24, pricePerUnit: 1850, label: 'Standard Wholesale Bundle' },
          { minQty: 25, maxQty: 99, pricePerUnit: 1700, label: 'Commercial Fleet Pack' },
          { minQty: 100, pricePerUnit: 1550, label: 'Master Distributor Bale' },
        ],
        images: [
          { src: '/uploads/products/tarpaulins-canvas-tents/multi-color-hdpe-waterproof-tarpaulin/multi-color-hdpe-waterproof-tarpaulin-1.jpg', alt: 'Multi-Color HDPE Waterproof Tarpaulin primary wholesale sheet', sortOrder: 1 },
          { src: '/uploads/products/tarpaulins-canvas-tents/multi-color-hdpe-waterproof-tarpaulin/multi-color-hdpe-waterproof-tarpaulin-2.webp', alt: 'Multi-Color HDPE Waterproof Tarpaulin woven lamination detail', sortOrder: 2 },
          { src: '/uploads/products/tarpaulins-canvas-tents/multi-color-hdpe-waterproof-tarpaulin/multi-color-hdpe-waterproof-tarpaulin-3.jpg', alt: 'Multi-Color HDPE Waterproof Tarpaulin eyelet hem view', sortOrder: 3 },
          { src: '/uploads/products/tarpaulins-canvas-tents/multi-color-hdpe-waterproof-tarpaulin/multi-color-hdpe-waterproof-tarpaulin-4.jpeg', alt: 'Multi-Color HDPE Waterproof Tarpaulin folded bale lot', sortOrder: 4 },
          { src: '/uploads/products/tarpaulins-canvas-tents/multi-color-hdpe-waterproof-tarpaulin/tarpaulins-warehouse-stock-1.jpeg', alt: 'Multi-Color HDPE Waterproof Tarpaulin authentic warehouse inventory', sortOrder: 5 },
          { src: '/uploads/products/tarpaulins-canvas-tents/multi-color-hdpe-waterproof-tarpaulin/tarpaulins-warehouse-stock-2.jpeg', alt: 'Multi-Color HDPE Waterproof Tarpaulin warehouse rolls', sortOrder: 6 },
          { src: '/uploads/products/tarpaulins-canvas-tents/multi-color-hdpe-waterproof-tarpaulin/tarpaulins-warehouse-stock-3.jpeg', alt: 'Multi-Color HDPE Waterproof Tarpaulin distribution stock', sortOrder: 7 },
          { src: '/uploads/products/tarpaulins-canvas-tents/multi-color-hdpe-waterproof-tarpaulin/tarpaulins-warehouse-stock-4.jpeg', alt: 'Multi-Color HDPE Waterproof Tarpaulin bulk lot Karachi', sortOrder: 8 },
          { src: '/uploads/products/tarpaulins-canvas-tents/multi-color-hdpe-waterproof-tarpaulin/tarpaulins-warehouse-stock-5.jpeg', alt: 'Multi-Color HDPE Waterproof Tarpaulin ready dispatch', sortOrder: 9 },
          { src: '/uploads/products/tarpaulins-canvas-tents/multi-color-hdpe-waterproof-tarpaulin/tarpaulins-warehouse-stock-6.jpeg', alt: 'Multi-Color HDPE Waterproof Tarpaulin Bohrapir shop view', sortOrder: 10 },
        ],
        faqs: [
          {
                    "question": "What is cross-lamination and why is it stronger?",
                    "answer": "Cross-lamination places multiple polymer layers at crisscross angles to each other. This eliminates weak grain directions so tears cannot propagate across the sheet."
          },
          {
                    "question": "What standard sizes are available in HDPE tarpaulins?",
                    "answer": "We stock sizes from 12ft × 12ft, 15ft × 12ft, 18ft × 24ft, 24ft × 30ft, up to large 30ft × 40ft and 40ft × 60ft master tarpaulin sheets."
          }
],
        attrValues: [
          { attr: 'Material Composition', val: '100% Virgin HDPE (LDPE Laminated)' },
          { attr: 'Fabric Weight / Density', val: '180 GSM' },
          { attr: 'Waterproof & UV Protection', val: '100% Hydrostatic Waterproof' },
          { attr: 'Standard Roll & Sheet Sizes', val: '18x24 ft' },
          { attr: 'Hem & Eyelet Construction', val: 'Heat-Sealed Rope Hem with Aluminum Eyelets at 3ft' },
          { attr: 'Standard Color Options', val: 'Blue/Orange' },
        ],
      },
      {
        name: 'Heavy-Duty Waterproof Cotton Canvas Tarpal',
        sku: 'TS-TRP-CNV-002',
        slug: 'heavy-duty-waterproof-cotton-canvas-tarpal',
        price: 8500,
        moq: 2,
        tradeAliases: "Moom Jama • Waxed Canvas • Truck Tarpal • Cotton Duck Tarpaulin • Heavy Tirpal",
        shortDescription: "Traditional waxed heavy cotton duck canvas (Moom Jama). Breathable and 100% water-repellent, preventing condensation buildup on wheat, cement, and long-haul truck freight.",
        longDescription: "Plastic tarpaulins trap heat and cause condensation to sweat on cargo inside, which ruins wheat, sugar, flour, and cement bags. Heavy waxed Cotton Canvas (Moom Jama) solves this problem completely. The dense cotton duck fabric is impregnated with water-repellent wax and paraffin oil. When it rains, the cotton fibers swell and shed water while allowing hot air and vapor to breathe outward. It is the gold standard for long-haul highway transport in Pakistan.",
        metaTitle: "Heavy Cotton Canvas Moom Jama Wholesale Karachi Pakistan",
        metaDescription: "Waxed heavy-duty cotton canvas tarpaulin sheets (Moom Jama) in Karachi. Breathable, water-repellent cotton duck fabric for truck cargo and grain protection.",
        usage: "The preferred choice for long-distance highway freight trucks carrying grain, flour, cotton, cement, and sugar across Pakistan, as well as army field storage covers.",
        benefits: [
          "Naturally breathable — prevents moisture condensation on flour, grain, and cement",
          "Wax-impregnated cotton duck fabric sheds driving rain cleanly",
          "Heavy cotton weave resists high-speed highway wind buffeting and road flap",
          "Double-lock stitched seams with rot-proof nylon thread and solid brass eyelets"
],
        suitedFor: [
          "Long-haul highway truck & trailer cargo covers",
          "Grain, sugar, rice & flour transport",
          "Military outdoor field tents & marquee fabrication",
          "Heavy machinery & generator breathable dust covers"
],
        notSuitedFor: [
          "Storing while wet in closed boxes (must be air-dried to prevent organic mildew)"
],
        bulkPricing: [
          { minQty: 2, maxQty: 9, pricePerUnit: 8500, label: 'Transport Fleet Rate' },
          { minQty: 10, maxQty: 49, pricePerUnit: 7900, label: 'Goods Forwarder Pack' },
          { minQty: 50, pricePerUnit: 7300, label: 'Master Fleet Contract Bale' },
        ],
        images: [
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-waterproof-cotton-canvas-tarpal/heavy-duty-waterproof-cotton-canvas-tarpal-1.jpg', alt: 'Heavy-Duty Waterproof Cotton Canvas Tarpal truck cover', sortOrder: 1 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-waterproof-cotton-canvas-tarpal/heavy-duty-waterproof-cotton-canvas-tarpal-2.jpg', alt: 'Heavy-Duty Waterproof Cotton Canvas Tarpal wax finish detail', sortOrder: 2 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-waterproof-cotton-canvas-tarpal/heavy-duty-waterproof-cotton-canvas-tarpal-3.jpeg', alt: 'Heavy-Duty Waterproof Cotton Canvas Tarpal stitched border', sortOrder: 3 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-waterproof-cotton-canvas-tarpal/tarpaulins-warehouse-stock-1.jpeg', alt: 'Heavy-Duty Waterproof Cotton Canvas Tarpal warehouse inventory', sortOrder: 4 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-waterproof-cotton-canvas-tarpal/tarpaulins-warehouse-stock-2.jpeg', alt: 'Heavy-Duty Waterproof Cotton Canvas Tarpal rolls and stock', sortOrder: 5 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-waterproof-cotton-canvas-tarpal/tarpaulins-warehouse-stock-3.jpeg', alt: 'Heavy-Duty Waterproof Cotton Canvas Tarpal distribution aisle', sortOrder: 6 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-waterproof-cotton-canvas-tarpal/tarpaulins-warehouse-stock-4.jpeg', alt: 'Heavy-Duty Waterproof Cotton Canvas Tarpal bundles lot', sortOrder: 7 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-waterproof-cotton-canvas-tarpal/tarpaulins-warehouse-stock-5.jpeg', alt: 'Heavy-Duty Waterproof Cotton Canvas Tarpal dispatch ready', sortOrder: 8 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-waterproof-cotton-canvas-tarpal/tarpaulins-warehouse-stock-6.jpeg', alt: 'Heavy-Duty Waterproof Cotton Canvas Tarpal Bohrapir warehouse', sortOrder: 9 },
        ],
        faqs: [
          {
                    "question": "Why do truck drivers prefer Moom Jama canvas over PVC tarpal for grain cargo?",
                    "answer": "Moom Jama breathes naturally. Plastic tarpaulins sweat condensation under direct sun, causing grain and flour bags to spoil and mold. Waxed canvas allows vapor to escape while blocking rain."
          },
          {
                    "question": "What canvas weights are available?",
                    "answer": "We supply cotton canvas Moom Jama in 10oz, 12oz, 14oz, 16oz, and heavy 18oz (350 GSM to 600 GSM) in standard truck cut sizes or custom stitched sheets."
          }
],
        attrValues: [
          { attr: 'Material Composition', val: '100% Breathable Duck Cotton Canvas' },
          { attr: 'Fabric Weight / Density', val: '16oz (480 GSM)' },
          { attr: 'Waterproof & UV Protection', val: '100% Hydrostatic Waterproof' },
          { attr: 'Standard Roll & Sheet Sizes', val: '20x30 ft' },
          { attr: 'Hem & Eyelet Construction', val: 'Triple-Stitched Hem with Solid Brass Eyelets' },
          { attr: 'Standard Color Options', val: 'Olive Green Canvas' },
        ],
      },
      {
        name: 'Industrial Heavy-Duty PVC Coated Tarpaulin',
        sku: 'TS-TRP-PVC-003',
        slug: 'industrial-heavy-duty-pvc-coated-tarpaulin',
        price: 12500,
        moq: 1,
        tradeAliases: "PVC Tarpal • Heavy Tirpal • Waterproof Godown Cover • Rubberized Tarpal • PVC Coated Sheet",
        shortDescription: "Heavy-duty 100% waterproof PVC-coated tarpaulin sheet (450–750+ GSM). Built with high-frequency heat-welded seams, reinforced borders, and rust-free eyelets for outdoor godowns.",
        longDescription: "When you need zero leaks under torrential monsoon rains, heavy PVC tarpaulin (Tarpal) is the ultimate industrial shield. Made from a polyester mesh base fabric coated on both sides with flexible PVC, it is completely impervious to water and resists tearing under high coastal winds. All seams are heat-fused with high-frequency welders so water cannot seep through stitching holes. We fabricate custom sizes with reinforced nylon edge tape and brass eyelets every 2 feet.",
        metaTitle: "Waterproof Heavy PVC Tarpaulin (Tarpal) Karachi Wholesale",
        metaDescription: "100% waterproof heavy PVC tarpaulin sheets (450 to 750+ GSM) in Karachi. Heat-welded seams, reinforced eyelets for outdoor godown storage and truck transport.",
        usage: "Widely used for covering outdoor warehouse storage, open cargo freight on trailers, construction equipment sheds, grain heaps, and factory loading bays across Pakistan.",
        benefits: [
          "100% waterproof barrier with zero moisture penetration under heavy downpours",
          "High-frequency thermal-welded seams that never leak or pull apart",
          "Heavy tear and puncture resistance against sharp machinery edges",
          "UV-stabilized coating prevents cracking and fading under intense sun"
],
        suitedFor: [
          "Outdoor warehouse godown yard storage",
          "Highway truck & trailer freight protection",
          "Construction site raw material & cement covers",
          "Temporary shed roofs & commercial drop curtains"
],
        notSuitedFor: [
          "Breathable storage where natural air circulation is mandatory (use Moom Jama canvas instead)"
],
        bulkPricing: [
          { minQty: 1, maxQty: 4, pricePerUnit: 12500, label: 'Single Unit Custom Cut' },
          { minQty: 5, maxQty: 19, pricePerUnit: 11600, label: 'Contractor Volume Pack' },
          { minQty: 20, pricePerUnit: 10800, label: 'Master Shipping Line Order' },
        ],
        images: [
          { src: '/uploads/products/tarpaulins-canvas-tents/industrial-heavy-duty-pvc-coated-tarpaulin/industrial-heavy-duty-pvc-coated-tarpaulin-1.webp', alt: 'Industrial Heavy-Duty PVC Coated Tarpaulin 650 GSM roll', sortOrder: 1 },
          { src: '/uploads/products/tarpaulins-canvas-tents/industrial-heavy-duty-pvc-coated-tarpaulin/industrial-heavy-duty-pvc-coated-tarpaulin-2.jpg', alt: 'Industrial Heavy-Duty PVC Coated Tarpaulin scrim cross section', sortOrder: 2 },
          { src: '/uploads/products/tarpaulins-canvas-tents/industrial-heavy-duty-pvc-coated-tarpaulin/industrial-heavy-duty-pvc-coated-tarpaulin-3.jpg', alt: 'Industrial Heavy-Duty PVC Coated Tarpaulin weld seam detail', sortOrder: 3 },
          { src: '/uploads/products/tarpaulins-canvas-tents/industrial-heavy-duty-pvc-coated-tarpaulin/tarpaulins-warehouse-stock-1.jpeg', alt: 'Industrial Heavy-Duty PVC Coated Tarpaulin warehouse inventory', sortOrder: 4 },
          { src: '/uploads/products/tarpaulins-canvas-tents/industrial-heavy-duty-pvc-coated-tarpaulin/tarpaulins-warehouse-stock-2.jpeg', alt: 'Industrial Heavy-Duty PVC Coated Tarpaulin rolls and stock', sortOrder: 5 },
          { src: '/uploads/products/tarpaulins-canvas-tents/industrial-heavy-duty-pvc-coated-tarpaulin/tarpaulins-warehouse-stock-3.jpeg', alt: 'Industrial Heavy-Duty PVC Coated Tarpaulin distribution aisle', sortOrder: 6 },
          { src: '/uploads/products/tarpaulins-canvas-tents/industrial-heavy-duty-pvc-coated-tarpaulin/tarpaulins-warehouse-stock-4.jpeg', alt: 'Industrial Heavy-Duty PVC Coated Tarpaulin bundles lot', sortOrder: 7 },
          { src: '/uploads/products/tarpaulins-canvas-tents/industrial-heavy-duty-pvc-coated-tarpaulin/tarpaulins-warehouse-stock-5.jpeg', alt: 'Industrial Heavy-Duty PVC Coated Tarpaulin dispatch ready', sortOrder: 8 },
          { src: '/uploads/products/tarpaulins-canvas-tents/industrial-heavy-duty-pvc-coated-tarpaulin/tarpaulins-warehouse-stock-6.jpeg', alt: 'Industrial Heavy-Duty PVC Coated Tarpaulin Bohrapir warehouse', sortOrder: 9 },
        ],
        faqs: [
          {
                    "question": "What GSM weights are available in PVC tarpaulin sheets?",
                    "answer": "We supply PVC tarpaulin in 450 GSM, 550 GSM, 650 GSM, and heavy 750+ GSM industrial grades in standard roll cuts or custom heat-welded dimensions."
          },
          {
                    "question": "Are the seams stitched or welded?",
                    "answer": "Our PVC tarpaulins are thermal-welded using high-frequency heating technology, creating a continuous, seamless waterproof bond that is far stronger than stitched seams."
          }
],
        attrValues: [
          { attr: 'Material Composition', val: 'High-Tenacity PVC Coated Scrim' },
          { attr: 'Fabric Weight / Density', val: '650–750+ GSM PVC' },
          { attr: 'Waterproof & UV Protection', val: '100% Hydrostatic Waterproof' },
          { attr: 'Standard Roll & Sheet Sizes', val: '24x36 ft' },
          { attr: 'Hem & Eyelet Construction', val: 'High-Frequency Welded Border with Nickel Grommets' },
          { attr: 'Standard Color Options', val: 'Glossy Blue/Yellow PVC' },
        ],
      },
      {
        name: 'Agricultural Fumigation & Grain Storage Waterproof Cover',
        sku: 'TS-TRP-FUM-004',
        slug: 'agricultural-fumigation-grain-storage-waterproof-cover',
        price: 6800,
        moq: 2,
        tradeAliases: "Fumigation Cover • Gas Proof Sheet • Grain Storage Cover • Tarpal Cover • Galla Godown Sheet",
        shortDescription: "Gas-tight multi-layer waterproof fumigation sheet. Locks in aluminum phosphide fumigation gases to eliminate pests in stored grain, wheat stacks, and seed godowns.",
        longDescription: "Fumigating wheat, rice, corn, and tobacco stockpiles requires gas-impermeable covers that prevent fumigant gases from escaping into warehouse air. Our Agricultural Fumigation Covers are manufactured with specialized multilayer barrier films that retain phosphine gas for the required 7 to 14 day treatment cycles. With sealed seams and heavy sand-snake weighted borders, they ensure 100% pest eradication in large open godown heaps.",
        metaTitle: "Agricultural Fumigation Grain Cover Karachi Wholesale",
        metaDescription: "Gas-tight agricultural grain fumigation covers in Karachi. Multi-layer gas proof sheets for wheat, rice, and seed pest eradication in warehouse godowns.",
        usage: "Essential for PASSCO and provincial food department grain godowns, private flour mills, seed storage warehouses, and export crop fumigation stations across Pakistan.",
        benefits: [
          "Gas-tight barrier prevents fumigant gas leakage and ensures complete pest eradication",
          "Multi-layer lamination provides high tear resistance over large stacked grain bags",
          "100% waterproof surface protects grain stacks against roof leaks and condensation",
          "Supplied in large single-sheet dimensions to minimize on-site taped joints"
],
        suitedFor: [
          "Wheat & paddy rice bulk stack fumigation",
          "Flour mill & seed warehouse pest control",
          "Tobacco & pulses godown gas fumigation",
          "Emergency grain storage outdoor buffer heaps"
],
        notSuitedFor: [
          "Permanent high-wind open roofing without proper anchorage ballast"
],
        bulkPricing: [
          { minQty: 2, maxQty: 9, pricePerUnit: 6800, label: 'Mandi Wholesale Pack' },
          { minQty: 10, maxQty: 49, pricePerUnit: 6300, label: 'Flour Mill Volume Lot' },
          { minQty: 50, pricePerUnit: 5800, label: 'Government Storage Contract Bale' },
        ],
        images: [
          { src: '/uploads/products/tarpaulins-canvas-tents/agricultural-fumigation-grain-storage-waterproof-cover/agricultural-fumigation-grain-storage-waterproof-cover-1.jpg', alt: 'Agricultural Fumigation Cover specialized gas barrier sheet', sortOrder: 1 },
          { src: '/uploads/products/tarpaulins-canvas-tents/agricultural-fumigation-grain-storage-waterproof-cover/agricultural-fumigation-grain-storage-waterproof-cover-2.jpg', alt: 'Agricultural Fumigation Cover grain godown covering', sortOrder: 2 },
          { src: '/uploads/products/tarpaulins-canvas-tents/agricultural-fumigation-grain-storage-waterproof-cover/agricultural-fumigation-grain-storage-waterproof-cover-3.jpg', alt: 'Agricultural Fumigation Cover sealed perimeter hem', sortOrder: 3 },
          { src: '/uploads/products/tarpaulins-canvas-tents/agricultural-fumigation-grain-storage-waterproof-cover/tarpaulins-warehouse-stock-1.jpeg', alt: 'Agricultural Fumigation Cover warehouse inventory', sortOrder: 4 },
          { src: '/uploads/products/tarpaulins-canvas-tents/agricultural-fumigation-grain-storage-waterproof-cover/tarpaulins-warehouse-stock-2.jpeg', alt: 'Agricultural Fumigation Cover rolls and stock', sortOrder: 5 },
          { src: '/uploads/products/tarpaulins-canvas-tents/agricultural-fumigation-grain-storage-waterproof-cover/tarpaulins-warehouse-stock-3.jpeg', alt: 'Agricultural Fumigation Cover distribution aisle', sortOrder: 6 },
          { src: '/uploads/products/tarpaulins-canvas-tents/agricultural-fumigation-grain-storage-waterproof-cover/tarpaulins-warehouse-stock-4.jpeg', alt: 'Agricultural Fumigation Cover bundles lot', sortOrder: 7 },
          { src: '/uploads/products/tarpaulins-canvas-tents/agricultural-fumigation-grain-storage-waterproof-cover/tarpaulins-warehouse-stock-5.jpeg', alt: 'Agricultural Fumigation Cover dispatch ready', sortOrder: 8 },
          { src: '/uploads/products/tarpaulins-canvas-tents/agricultural-fumigation-grain-storage-waterproof-cover/tarpaulins-warehouse-stock-6.jpeg', alt: 'Agricultural Fumigation Cover Bohrapir warehouse', sortOrder: 9 },
        ],
        faqs: [
          {
                    "question": "How do fumigation sheets prevent gas leakage?",
                    "answer": "Our fumigation sheets use specialized barrier polymers with near-zero gas permeability. When weighted down at the base with sand snakes, they maintain gas concentration throughout the fumigation cycle."
          },
          {
                    "question": "What sheet sizes are standard for grain stacks?",
                    "answer": "We fabricate standard 30ft × 40ft, 40ft × 60ft, and large 50ft × 80ft single-piece seamless covers tailored for 100-ton and 250-ton bag stacks."
          }
],
        attrValues: [
          { attr: 'Material Composition', val: '100% Virgin HDPE (LDPE Laminated)' },
          { attr: 'Fabric Weight / Density', val: '200 GSM' },
          { attr: 'Waterproof & UV Protection', val: '100% Hydrostatic Waterproof' },
          { attr: 'Standard Roll & Sheet Sizes', val: '30x40 ft' },
          { attr: 'Hem & Eyelet Construction', val: 'Heat-Sealed Rope Hem with Aluminum Eyelets at 3ft' },
          { attr: 'Standard Color Options', val: 'Blue/Silver' },
        ],
      },
      {
        name: 'Heavy-Duty Relief, Construction & Shed Canvas Tents',
        sku: 'TS-TRP-TNT-005',
        slug: 'heavy-duty-relief-construction-shed-canvas-tents',
        price: 28500,
        moq: 1,
        tradeAliases: "Relief Tambu • Emergency Khaima • A-Frame Canvas Tent • Disaster Shelter • NGO Relief Tent",
        shortDescription: "Complete 4m × 4m and 5m × 4m family disaster relief canvas tent. Heavy water-repellent cotton duck canvas, steel center poles, ground pegs, mosquito-mesh windows, and PE floor liner.",
        longDescription: "In flood and emergency relief situations, affected families need rapid shelter that stands up to rain, heat, and high winds. Our disaster relief tents (Khaimas and Tambus) are manufactured to international humanitarian standards. Constructed from rot-resistant, water-repellent cotton canvas, they feature a central steel ridge pole frame, breathable ventilation flaps with mosquito netting, a heavy waterproof groundsheet, and strong guy ropes with forged steel ground stakes.",
        metaTitle: "Relief & Construction Canvas Tents Karachi Wholesale",
        metaDescription: "Heavy canvas family disaster relief tents (Tambu & Khaima) in Karachi. Steel poles, waterproof groundsheet, and mosquito mesh for emergency NGO supply.",
        usage: "Supplied in bulk to NGOs, government disaster management authorities (NDMA/PDMA), humanitarian relief missions, charity welfare trusts, and rural temporary field camps.",
        benefits: [
          "Complete ready-to-pitch kit with steel poles, guy ropes, ground stakes, and floor liner",
          "Heavy-duty water-repellent and rot-resistant cotton canvas construction",
          "Ventilated side walls with insect-proof mosquito mesh screens",
          "Spacious family design (160 sq ft to 220 sq ft) comfortably sleeps 6 to 8 persons"
],
        suitedFor: [
          "Flood, earthquake & humanitarian disaster relief camps",
          "Refugee & displaced person emergency housing",
          "Remote construction site labor accommodation",
          "Security guard posts & military temporary bivouacs"
],
        notSuitedFor: [
          "Permanent concrete building replacement without structural foundation ties"
],
        bulkPricing: [
          { minQty: 1, maxQty: 4, pricePerUnit: 28500, label: 'Single Unit Camp Kit' },
          { minQty: 5, maxQty: 24, pricePerUnit: 26500, label: 'Contractor Shelter Pack' },
          { minQty: 25, pricePerUnit: 24500, label: 'Disaster Relief Master Lot' },
        ],
        images: [
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-relief-construction-shed-canvas-tents/heavy-duty-relief-construction-shed-canvas-tents-1.jpg', alt: 'Canvas Relief Tents disaster camp shelter', sortOrder: 1 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-relief-construction-shed-canvas-tents/heavy-duty-relief-construction-shed-canvas-tents-2.jpg', alt: 'Canvas Relief Tents steel frame and poles assembly', sortOrder: 2 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-relief-construction-shed-canvas-tents/tarpaulins-warehouse-stock-1.jpeg', alt: 'Canvas Relief Tents warehouse inventory', sortOrder: 3 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-relief-construction-shed-canvas-tents/tarpaulins-warehouse-stock-2.jpeg', alt: 'Canvas Relief Tents rolls and stock', sortOrder: 4 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-relief-construction-shed-canvas-tents/tarpaulins-warehouse-stock-3.jpeg', alt: 'Canvas Relief Tents distribution aisle', sortOrder: 5 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-relief-construction-shed-canvas-tents/tarpaulins-warehouse-stock-4.jpeg', alt: 'Canvas Relief Tents bundles lot', sortOrder: 6 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-relief-construction-shed-canvas-tents/tarpaulins-warehouse-stock-5.jpeg', alt: 'Canvas Relief Tents dispatch ready', sortOrder: 7 },
          { src: '/uploads/products/tarpaulins-canvas-tents/heavy-duty-relief-construction-shed-canvas-tents/tarpaulins-warehouse-stock-6.jpeg', alt: 'Canvas Relief Tents Bohrapir warehouse', sortOrder: 8 },
        ],
        faqs: [
          {
                    "question": "What is included in a standard relief tent package?",
                    "answer": "Each tent comes packed in a durable canvas bag containing the outer canvas shell, waterproof groundsheet, galvanized steel center poles, side wall poles, high-tenacity guy ropes, and forged steel ground pegs."
          },
          {
                    "question": "How quickly can Tahira Syndicate fulfill large relief tent orders?",
                    "answer": "With our dedicated stitching floor and large canvas stock in Karachi, we can fulfill urgent emergency orders of 500 to 5,000+ relief tents on fast schedules during disaster relief operations."
          }
],
        attrValues: [
          { attr: 'Material Composition', val: '100% Breathable Duck Cotton Canvas' },
          { attr: 'Fabric Weight / Density', val: '14oz (400 GSM)' },
          { attr: 'Waterproof & UV Protection', val: '100% Hydrostatic Waterproof' },
          { attr: 'Standard Roll & Sheet Sizes', val: 'Custom Godown & Truck Sizes' },
          { attr: 'Hem & Eyelet Construction', val: 'Triple-Stitched Hem with Solid Brass Eyelets' },
          { attr: 'Standard Color Options', val: 'Khaki Tan' },
        ],
      },
      {
        name: 'Transparent Clear PVC Waterproof Curtain & Patio Tarpaulin',
        sku: 'TS-TRP-CLR-006',
        slug: 'transparent-clear-pvc-waterproof-curtain-tarpaulin',
        price: 4500,
        moq: 2,
        tradeAliases: "Tarpal Parda • Sliding Dock Curtain • Godown Partition • Weatherproof Drop Curtain",
        shortDescription: "Heavy waterproof sliding tarpaulin curtains (Tarpal Parda) with steel roller hooks and guide tracks. Protects loading docks and warehouse bays from wind-blown rain and dust.",
        longDescription: "Open loading docks leave warehouse inventory exposed to driving rain, dust storms, and blistering heat. Our sliding Tarpal Parda systems provide instant industrial weather protection that glides open and shut with zero effort. Fabricated from 550–650 GSM PVC with clear vision windows if needed, these curtains hang from heavy-duty galvanized steel tracks on ball-bearing roller trolleys. When trucks arrive, workers slide the curtain open in seconds.",
        metaTitle: "Clear PVC Waterproof Curtain Tarpaulin Karachi Supply",
        metaDescription: "Industrial sliding tarpaulin curtains (Tarpal Parda) with roller tracks in Karachi. Protect loading docks and warehouse bays from driving rain and dust.",
        usage: "Installed on factory loading docks, warehouse open doorways, automotive spray booths, food plant washdown areas, and commercial workshop partitions.",
        benefits: [
          "Smooth ball-bearing roller tracks allow easy one-person sliding operation",
          "Creates instant weatherproof closure over wide loading dock doors",
          "Heavy 550+ GSM PVC fabric blocks wind-driven rain, dust, and direct sun",
          "Optional clear transparent PVC window panels maintain indoor visibility"
],
        suitedFor: [
          "Warehouse loading & unloading dock bays",
          "Factory internal dust & noise partitions",
          "Car wash & paint spray booth enclosures",
          "Open godown shutter weather screening"
],
        notSuitedFor: [
          "High-security anti-theft barriers (this is a weatherproof curtain, not a steel shutter)"
],
        bulkPricing: [
          { minQty: 2, maxQty: 9, pricePerUnit: 4500, label: 'Standard Retail Roll Rate' },
          { minQty: 10, maxQty: 49, pricePerUnit: 4100, label: 'Cafe & Commercial Pack' },
          { minQty: 50, pricePerUnit: 3750, label: 'Master Contractor Bale' },
        ],
        images: [
          { src: '/uploads/products/tarpaulins-canvas-tents/transparent-clear-pvc-waterproof-curtain-tarpaulin/transparent-clear-pvc-waterproof-curtain-tarpaulin-1.jpg', alt: 'Transparent Clear PVC Curtain optical clear sheet', sortOrder: 1 },
          { src: '/uploads/products/tarpaulins-canvas-tents/transparent-clear-pvc-waterproof-curtain-tarpaulin/tarpaulins-warehouse-stock-1.jpeg', alt: 'Transparent Clear PVC Curtain warehouse inventory', sortOrder: 2 },
          { src: '/uploads/products/tarpaulins-canvas-tents/transparent-clear-pvc-waterproof-curtain-tarpaulin/tarpaulins-warehouse-stock-2.jpeg', alt: 'Transparent Clear PVC Curtain rolls and stock', sortOrder: 3 },
          { src: '/uploads/products/tarpaulins-canvas-tents/transparent-clear-pvc-waterproof-curtain-tarpaulin/tarpaulins-warehouse-stock-3.jpeg', alt: 'Transparent Clear PVC Curtain distribution aisle', sortOrder: 4 },
          { src: '/uploads/products/tarpaulins-canvas-tents/transparent-clear-pvc-waterproof-curtain-tarpaulin/tarpaulins-warehouse-stock-4.jpeg', alt: 'Transparent Clear PVC Curtain bundles lot', sortOrder: 5 },
          { src: '/uploads/products/tarpaulins-canvas-tents/transparent-clear-pvc-waterproof-curtain-tarpaulin/tarpaulins-warehouse-stock-5.jpeg', alt: 'Transparent Clear PVC Curtain dispatch ready', sortOrder: 6 },
          { src: '/uploads/products/tarpaulins-canvas-tents/transparent-clear-pvc-waterproof-curtain-tarpaulin/tarpaulins-warehouse-stock-6.jpeg', alt: 'Transparent Clear PVC Curtain Bohrapir warehouse', sortOrder: 7 },
        ],
        faqs: [
          {
                    "question": "Does the sliding curtain system include the overhead track and rollers?",
                    "answer": "Yes, we supply complete turnkey sets including galvanized steel overhead tracks, heavy-duty ball-bearing roller trolleys, wall anchor brackets, and the custom-fabricated PVC curtain."
          },
          {
                    "question": "Can clear transparent PVC viewing windows be added to the curtain?",
                    "answer": "Yes, we can thermal-weld crystal clear transparent PVC panels at eye level so your warehouse staff can see approaching forklifts and trucks while the curtain is closed."
          }
],
        attrValues: [
          { attr: 'Material Composition', val: 'Optical Clear Flexible PVC' },
          { attr: 'Fabric Weight / Density', val: '250 GSM' },
          { attr: 'Waterproof & UV Protection', val: '100% Hydrostatic Waterproof' },
          { attr: 'Standard Roll & Sheet Sizes', val: '12x15 ft' },
          { attr: 'Hem & Eyelet Construction', val: 'Heat-Sealed Rope Hem with Aluminum Eyelets at 3ft' },
          { attr: 'Standard Color Options', val: 'Crystal Transparent' },
        ],
      },
    ]

    for (const prodData of tarpProducts) {
      const product = await prisma.product.upsert({
        where: { slug: prodData.slug },
        update: {
          name: prodData.name,
          sku: prodData.sku,
          price: prodData.price,
          moq: prodData.moq,
          status: 'Active',
          seoStatus: 'Complete',
          categoryId: tarpCat.id,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
        create: {
          name: prodData.name,
          sku: prodData.sku,
          slug: prodData.slug,
          price: prodData.price,
          moq: prodData.moq,
          status: 'Active',
          seoStatus: 'Complete',
          categoryId: tarpCat.id,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
      })

      await prisma.productImage.deleteMany({ where: { productId: product.id } })
      for (const img of prodData.images) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            src: img.src,
            alt: img.alt,
            sortOrder: img.sortOrder,
          },
        })
      }

      await prisma.productFaq.deleteMany({ where: { productId: product.id } })
      for (let fIdx = 0; fIdx < prodData.faqs.length; fIdx++) {
        const faq = prodData.faqs[fIdx]
        await prisma.productFaq.create({
          data: {
            productId: product.id,
            question: faq.question,
            answer: faq.answer,
            sortOrder: fIdx + 1,
          },
        })
      }

      await prisma.productAttributeValue.deleteMany({ where: { productId: product.id } })
      for (const av of prodData.attrValues) {
        const attrId = tarpAttributeMap.get(av.attr)
        if (attrId) {
          await prisma.productAttributeValue.create({
            data: {
              productId: product.id,
              attributeId: attrId,
              value: av.val,
            },
          })
        }
      }
      console.log(`✅ Seeded product: ${product.name} (${product.sku})`)
    }
  }

  
  // 6. Seed Building & Flexible Pipes Category
  const pipeCat = await prisma.category.upsert({
    where: { slug: 'building-flexible-pipes' },
    update: {
      name: 'Building & Flexible Pipes',
      slug: 'building-flexible-pipes',
      image: '/uploads/categories/building-flexible-pipes.jpeg',
      description: 'Heavy-duty flexible PVC garden pipes, braided water suction hoses, layflat canvas discharge pipes, corrugated electrical conduit tubing, and clear PVC level tubes for construction, agricultural tubewells, and industrial fluid transfer in Pakistan.',
      metaTitle: 'Wholesale Building & Flexible Pipes Karachi | Tahira Syndicate',
      metaDescription: 'Heavy-duty PVC garden pipes, spiral suction hoses, canvas delivery pipes and conduit pipes at factory wholesale rates in Bohrapir Karachi, Pakistan.',
    },
    create: {
      name: 'Building & Flexible Pipes',
      slug: 'building-flexible-pipes',
      image: '/uploads/categories/building-flexible-pipes.jpeg',
      description: 'Heavy-duty flexible PVC garden pipes, braided water suction hoses, layflat canvas discharge pipes, corrugated electrical conduit tubing, and clear PVC level tubes for construction, agricultural tubewells, and industrial fluid transfer in Pakistan.',
      metaTitle: 'Wholesale Building & Flexible Pipes Karachi | Tahira Syndicate',
      metaDescription: 'Heavy-duty PVC garden pipes, spiral suction hoses, canvas delivery pipes and conduit pipes at factory wholesale rates in Bohrapir Karachi, Pakistan.',
    },
  })
  console.log('Building & Flexible Pipes category initialized.')

  if (pipeCat) {
    const pipeAttributesData = [
      {
        name: 'Material Base',
        type: 'Select' as const,
        options: ['100% Virgin Flexible PVC', 'Rigid PVC Spiral Reinforcement', 'High-Tenacity Polyester Braided Yarn', 'Circular Woven Canvas Jacket with Synthetic Rubber Lining', 'Flame-Retardant PVC Compound', 'UV-Stabilized Polyethylene (PE)'],
      },
      {
        name: 'Nominal Diameter (Bore Size)',
        type: 'Select' as const,
        options: ['1/2" (12mm)', '3/4" (19mm)', '1" (25mm)', '1.5" (38mm)', '2" (50mm)', '2.5" (63mm)', '3" (75mm)', '4" (100mm)', '6" (150mm)', '8" (200mm)'],
      },
      {
        name: 'Working Pressure Rating',
        type: 'Select' as const,
        options: ['1.5–3 Bar Low Head', '4–6 Bar Medium Duty', '8–10 Bar High Pressure', 'Full Vacuum Suction (-0.9 Bar)'],
      },
      {
        name: 'Roll Length Standard',
        type: 'Select' as const,
        options: ['25 Meters Coil', '30 Meters (100 ft)', '50 Meters Coil', '100 Meters (330 ft) Master Coil'],
      },
      {
        name: 'Wall Construction & Reinforcement',
        type: 'Select' as const,
        options: ['3-Ply Cross-Braided Heavy-Wall', 'Shock-Resistant Rigid PVC Spiral Helix', 'Double-Layer Seamless Woven Canvas & Extruded Liner', 'Annular Ring Corrugated Flexible Structure', 'Single-Wall Flexible Crystal Tube', 'Seamless Extruded Heavy-Gauge PE Layflat'],
      },
      {
        name: 'Standard Color Coding',
        type: 'Select' as const,
        options: ['Transparent Emerald Green with Yellow Braiding', 'Translucent Olive Green with White Spiral Helix', 'Natural Off-White / High-Visibility Yellow', 'Industrial Black / Grey Conduit', 'Optical Crystal Transparent', 'Carbon Black with Blue Identity Stripes'],
      },
    ]

    const pipeAttributeMap = new Map<string, number>()

    for (let i = 0; i < pipeAttributesData.length; i++) {
      const attrDef = pipeAttributesData[i]
      let attr = await prisma.attribute.findFirst({ where: { name: attrDef.name } })
      if (!attr) {
        attr = await prisma.attribute.create({
          data: {
            name: attrDef.name,
            type: attrDef.type,
            options: attrDef.options,
            status: 'Active',
          },
        })
      }
      pipeAttributeMap.set(attrDef.name, attr.id)

      await prisma.categoryAttribute.upsert({
        where: {
          categoryId_attributeId: {
            categoryId: pipeCat.id,
            attributeId: attr.id,
          },
        },
        update: { sortOrder: i + 1 },
        create: {
          categoryId: pipeCat.id,
          attributeId: attr.id,
          sortOrder: i + 1,
        },
      })
    }

    const pipeProducts = [
      {
        name: 'Heavy-Duty Braided PVC Flexible Garden Pipe',
        sku: 'TS-PIP-GAR-001',
        slug: 'heavy-duty-braided-pvc-flexible-garden-pipe',
        price: 2600,
        moq: 5,
        tradeAliases: "Mali Pipe • Garden Pipe • Braided Water Pipe • Nalkay Ka Pipe • Green Flexible Pipe • Car Wash Hose • 3-Ply Water Pipe",
        shortDescription: "High-durability 3-ply braided PVC garden water pipe. High burst pressure resistance, kink-free flexibility, and all-weather UV protection for landscaping and car washing.",
        longDescription: "Thin, unreinforced garden hoses easily kink, crack under direct sun, and burst when water taps are left pressurized. Our Heavy-Duty Braided PVC Garden Pipe (Mali Pipe) is built with a tough 3-layer construction: a smooth virgin PVC inner core, high-tensile braided polyester cross-mesh reinforcement, and an abrasion-resistant, UV-stabilized outer skin. It bends smoothly without kinking, resists bursting under municipal water pressure, and stays supple in summer heat and winter cold.",
        metaTitle: "Braided PVC Garden Water Pipe (Mali Pipe) Karachi Wholesale",
        metaDescription: "Heavy-duty 3-ply braided PVC flexible garden pipes (Mali Pipe) in Karachi. Kink-resistant, high burst pressure water hose for lawns, car wash, and washdown.",
        usage: "The preferred water pipe for commercial lawn landscaping, residential gardening, car wash service centers, building terrace cleaning, and factory floor washdowns across Pakistan.",
        benefits: [
          "3-ply polyester yarn reinforcement prevents pipe bursting under high water pressure",
          "Kink-resistant construction maintains continuous, uninterrupted water flow",
          "UV-stabilized outer compound will not crack, fade, or stiffen under direct sunlight",
          "Glass-smooth inner core delivers maximum water volume with zero internal algae buildup"
],
        suitedFor: [
          "Commercial landscape & residential garden watering",
          "Automotive service station & car wash washdown lines",
          "Construction site curing & water barrel filling",
          "Building roof & floor washdown operations"
],
        notSuitedFor: [
          "High-pressure steam or hot oil lines exceeding 60°C"
],
        bulkPricing: [
          { minQty: 5, maxQty: 24, label: 'Standard Wholesale Bundle' },
          { minQty: 25, maxQty: 99, label: 'Commercial Landscaper / Builder Pack' },
          { minQty: 100, label: 'Master Wholesale Distributor Bale' },
        ],
        images: [
          { src: '/uploads/products/building-flexible-pipes/heavy-duty-braided-pvc-flexible-garden-pipe/heavy-duty-braided-pvc-flexible-garden-pipe-1.webp', alt: 'Heavy-Duty Braided PVC Flexible Garden Pipe emerald roll with yellow braiding', sortOrder: 1 },
          { src: '/uploads/products/building-flexible-pipes/heavy-duty-braided-pvc-flexible-garden-pipe/heavy-duty-braided-pvc-flexible-garden-pipe-2.webp', alt: 'Heavy-Duty Braided PVC Flexible Garden Pipe close-up texture', sortOrder: 2 },
          { src: '/uploads/products/building-flexible-pipes/heavy-duty-braided-pvc-flexible-garden-pipe/heavy-duty-braided-pvc-flexible-garden-pipe-3.webp', alt: 'Heavy-Duty Braided PVC Flexible Garden Pipe coil cross section', sortOrder: 3 },
          { src: '/uploads/products/building-flexible-pipes/heavy-duty-braided-pvc-flexible-garden-pipe/pipes-warehouse-stock-1.jpeg', alt: 'Heavy-Duty Braided PVC Flexible Garden Pipe Bohrapir warehouse inventory', sortOrder: 4 },
        ],
        faqs: [
          {
                    "question": "What diameters and roll lengths are available for braided garden pipe?",
                    "answer": "We stock standard 1/2\" (12mm), 3/4\" (19mm), and 1\" (25mm) internal diameters in 30-meter (100 ft), 45-meter (150 ft), and 90-meter (300 ft) continuous coils."
          },
          {
                    "question": "Will this pipe crack if left outside in Karachi summer sun?",
                    "answer": "No, our garden pipe is extruded with premium UV stabilizers and virgin plasticizers that keep the PVC flexible and crack-free even during peak summer months."
          }
],
        attrValues: [
          { attr: 'Material Base', val: '100% Virgin Flexible PVC' },
          { attr: 'Nominal Diameter (Bore Size)', val: '3/4" (19mm)' },
          { attr: 'Working Pressure Rating', val: '8–10 Bar High Pressure' },
          { attr: 'Roll Length Standard', val: '30 Meters (100 ft)' },
          { attr: 'Wall Construction & Reinforcement', val: '3-Ply Cross-Braided Heavy-Wall' },
          { attr: 'Standard Color Coding', val: 'Transparent Emerald Green with Yellow Braiding' },
        ],
      },
      {
        name: 'Heavy-Duty PVC Spiral Reinforced Suction Hose',
        sku: 'TS-PIP-SUC-002',
        slug: 'heavy-duty-pvc-spiral-reinforced-suction-hose',
        price: 7800,
        moq: 2,
        tradeAliases: "Hara Pipe • Kisan Suction Pipe • Tube Well Suction Pipe • Green PVC Hose • Heavy Suction Pipe",
        shortDescription: "Heavy green PVC suction pipe with rigid spiral reinforcement. Will not collapse under high vacuum pressure on diesel water pumps, tube wells, and construction dewatering.",
        longDescription: "When a diesel engine or agricultural tube well pump pulls deep suction, thin hoses collapse inward and choke off water flow. Our green PVC suction pipe (Hara Pipe) is extruded with a heavy rigid PVC spiral helix embedded inside flexible PVC walls. It withstands deep vacuum without flattening, resists gritty sludge and mud abrasion, and flexes easily over uneven canal banks and muddy trenches. Available in 1-inch up to 8-inch inner diameters.",
        metaTitle: "Heavy Duty PVC Green Suction Pipe Karachi Wholesale",
        metaDescription: "Heavy-duty green PVC suction pipes (1\" to 8\") in Karachi. Non-collapsing rigid spiral helix for tube well pumping and dewatering across Pakistan.",
        usage: "The standard choice for agricultural tube well water drawing, construction pit dewatering, tanker loading/unloading, sewage bypass pumping, and industrial sludge suction.",
        benefits: [
          "Rigid PVC spiral helix prevents pipe collapse under powerful engine vacuum",
          "Smooth inner bore maximizes water flow rate and stops sludge blockages",
          "Abrasion-resistant green outer wall handles dragging over gravel and rocky ground",
          "Flexible radius bends easily around trench corners and canal banks"
],
        suitedFor: [
          "Agricultural tube well & tractor engine water suction",
          "Construction foundation dewatering & mud pumping",
          "Water tanker truck suction & delivery lines",
          "Industrial wastewater & effluent transfer"
],
        notSuitedFor: [
          "High-pressure steam lines or boiling water transfer over 65°C"
],
        bulkPricing: [
          { minQty: 2, maxQty: 5, label: 'Standard Contractor Lot' },
          { minQty: 6, maxQty: 19, label: 'Tubewell Driller / Rental Fleet Pack' },
          { minQty: 20, label: 'Master Wholesale Dealer Stock' },
        ],
        images: [
          { src: '/uploads/products/building-flexible-pipes/heavy-duty-pvc-spiral-reinforced-suction-hose/heavy-duty-pvc-spiral-reinforced-suction-hose-1.jpg', alt: 'Heavy-Duty PVC Spiral Reinforced Suction Hose green coil with rigid white rib', sortOrder: 1 },
          { src: '/uploads/products/building-flexible-pipes/heavy-duty-pvc-spiral-reinforced-suction-hose/heavy-duty-pvc-spiral-reinforced-suction-hose-2.webp', alt: 'Heavy-Duty PVC Spiral Reinforced Suction Hose internal smooth bore detail', sortOrder: 2 },
          { src: '/uploads/products/building-flexible-pipes/heavy-duty-pvc-spiral-reinforced-suction-hose/heavy-duty-pvc-spiral-reinforced-suction-hose-3.jpg', alt: 'Heavy-Duty PVC Spiral Reinforced Suction Hose vacuum crush resistance demonstration', sortOrder: 3 },
          { src: '/uploads/products/building-flexible-pipes/heavy-duty-pvc-spiral-reinforced-suction-hose/pipes-warehouse-stock-1.jpeg', alt: 'Heavy-Duty PVC Spiral Reinforced Suction Hose Bohrapir warehouse inventory', sortOrder: 4 },
        ],
        faqs: [
          {
                    "question": "What diameters and coil lengths are available for green suction pipe?",
                    "answer": "We supply green suction pipe in 1\", 1.25\", 1.5\", 2\", 2.5\", 3\", 4\", 5\", 6\", and 8\" internal diameters in standard 30-meter coils and cut lengths."
          },
          {
                    "question": "Can this pipe handle muddy water and sand slurry?",
                    "answer": "Yes, the thick PVC compound is formulated specifically to resist abrasive sand, gravel, and muddy slurry without thinning or puncturing the wall."
          }
],
        attrValues: [
          { attr: 'Material Base', val: 'Rigid PVC Spiral Reinforcement' },
          { attr: 'Nominal Diameter (Bore Size)', val: '3" (75mm)' },
          { attr: 'Working Pressure Rating', val: 'Full Vacuum Suction (-0.9 Bar)' },
          { attr: 'Roll Length Standard', val: '30 Meters (100 ft)' },
          { attr: 'Wall Construction & Reinforcement', val: 'Shock-Resistant Rigid PVC Spiral Helix' },
          { attr: 'Standard Color Coding', val: 'Translucent Olive Green with White Spiral Helix' },
        ],
      },
      {
        name: 'High-Pressure Layflat Canvas Delivery Hose Pipe',
        sku: 'TS-PIP-CNV-003',
        slug: 'high-pressure-layflat-canvas-delivery-hose-pipe',
        price: 6500,
        moq: 2,
        tradeAliases: "Canvas Delivery Pipe • Fire Hose Pipe • Kheti Canvas Pipe • High Pressure Water Delivery Hose • White Canvas Pipe",
        shortDescription: "Heavy-duty woven canvas fire-grade water discharge hose with internal rubber lining. Handles high pump delivery pressures and rolls up flat for rapid farm deployment.",
        longDescription: "When high-horsepower turbine pumps or tractor engines discharge water under high pressure, plastic layflat pipes can balloon and burst. Canvas Delivery Hose features a high-tenacity woven circular polyester/canvas jacket lined with smooth vulcanized rubber. It handles high operating pressures without stretching out of shape, glides over rough stones and stubble fields without punctures, and folds completely flat onto compact storage reels.",
        metaTitle: "High-Pressure Canvas Water Delivery Hose Karachi Wholesale",
        metaDescription: "Heavy-duty canvas layflat water delivery hose pipes (2\" to 6\") in Karachi. High-pressure rubber lined discharge hose for agriculture and flood dewatering.",
        usage: "Engineered for high-pressure agricultural farm irrigation, emergency flood dewatering, civil engineering drainage, and municipal firefighting water supply lines.",
        benefits: [
          "Woven canvas jacket provides high burst pressure resistance against engine surges",
          "Seamless vulcanized rubber inner liner ensures zero water leakage and friction loss",
          "Rolls flat compactly — 100 meters can be stored in minimal space on a truck bed",
          "High abrasion resistance against dragging over rocky fields and concrete curbs"
],
        suitedFor: [
          "High-pressure tractor & turbine pump water delivery",
          "Agricultural field flood irrigation & canal bypass",
          "Municipal flood dewatering & emergency drainage",
          "Construction foundation discharge lines"
],
        notSuitedFor: [
          "Pump suction intake side (must be used for discharge only)"
],
        bulkPricing: [
          { minQty: 2, maxQty: 5, label: 'Standard Farmer / Contractor Pack' },
          { minQty: 6, maxQty: 24, label: 'Agricultural Cooperatives / Rental Lot' },
          { minQty: 25, label: 'Master Government / Disaster Relief Bale' },
        ],
        images: [
          { src: '/uploads/products/building-flexible-pipes/high-pressure-layflat-canvas-delivery-hose-pipe/high-pressure-layflat-canvas-delivery-hose-pipe-1.webp', alt: 'High-Pressure Layflat Canvas Delivery Hose Pipe coiled roll', sortOrder: 1 },
          { src: '/uploads/products/building-flexible-pipes/high-pressure-layflat-canvas-delivery-hose-pipe/high-pressure-layflat-canvas-delivery-hose-pipe-2.webp', alt: 'High-Pressure Layflat Canvas Delivery Hose Pipe woven jacket detail', sortOrder: 2 },
          { src: '/uploads/products/building-flexible-pipes/high-pressure-layflat-canvas-delivery-hose-pipe/high-pressure-layflat-canvas-delivery-hose-pipe-3.jpg', alt: 'High-Pressure Layflat Canvas Delivery Hose Pipe inner rubber liner cross section', sortOrder: 3 },
          { src: '/uploads/products/building-flexible-pipes/high-pressure-layflat-canvas-delivery-hose-pipe/pipes-warehouse-stock-1.jpeg', alt: 'High-Pressure Layflat Canvas Delivery Hose Pipe Bohrapir warehouse inventory', sortOrder: 4 },
        ],
        faqs: [
          {
                    "question": "What working pressures can canvas delivery hose handle?",
                    "answer": "Our canvas delivery hoses are rated for 6 Bar to 16 Bar operating pressure (100 PSI to 230 PSI), making them capable of handling heavy pump discharge heads."
          },
          {
                    "question": "What sizes are available in canvas hose?",
                    "answer": "We stock 1.5\", 2\", 2.5\", 3\", 4\", and 6\" diameters in standard 30-meter, 50-meter, and 100-meter continuous lengths with quick-action camlock or storz couplings."
          }
],
        attrValues: [
          { attr: 'Material Base', val: 'Circular Woven Canvas Jacket with Synthetic Rubber Lining' },
          { attr: 'Nominal Diameter (Bore Size)', val: '3" (75mm)' },
          { attr: 'Working Pressure Rating', val: '8–10 Bar High Pressure' },
          { attr: 'Roll Length Standard', val: '30 Meters (100 ft)' },
          { attr: 'Wall Construction & Reinforcement', val: 'Double-Layer Seamless Woven Canvas & Extruded Liner' },
          { attr: 'Standard Color Coding', val: 'Natural Off-White / High-Visibility Yellow' },
        ],
      },
      {
        name: 'Corrugated Flexible PVC Electrical Conduit Pipe',
        sku: 'TS-PIP-COR-004',
        slug: 'corrugated-flexible-pvc-electrical-conduit-pipe',
        price: 1850,
        moq: 5,
        tradeAliases: "Churi Pipe • Corrugated Conduit • Electrical Flexible Pipe • Wiring Churi Pipe • PVC Conduit Roll",
        shortDescription: "Flexible corrugated PVC electrical wiring conduit pipe (Churi Pipe). Flame-retardant and shock-resistant for concealed wall routing, ceiling slabs, and switchboard wiring.",
        longDescription: "Routing electrical cables through tight concrete slab corners, brick masonry grooves, and false ceiling channels requires conduit that bends freely without cracking. Corrugated PVC Conduit Pipe (Churi Pipe) features a continuous ribbed profile that gives extreme flexibility while resisting crushing under wet concrete pours. Manufactured with self-extinguishing flame-retardant PVC resin, it protects domestic and commercial wiring from moisture, rodents, and electrical shorts.",
        metaTitle: "Flexible Corrugated PVC Electrical Conduit Karachi Wholesale",
        metaDescription: "Flame-retardant corrugated PVC electrical conduit pipes (Churi Pipe) in Karachi (16mm to 32mm). Crush-proof flexible tubing for concealed slab and wall wiring.",
        usage: "Standard installation material for concealed residential and commercial electrical wiring inside walls, ceiling slabs, false ceilings, and industrial control panels.",
        benefits: [
          "Continuous corrugated ribs allow 360-degree bends without kinking or pinching wires",
          "Self-extinguishing flame-retardant PVC resin enhances building fire safety",
          "High impact crush resistance survives concrete pouring and worker foot traffic",
          "Smooth internal profile allows easy pulling of electrical copper wire cables"
],
        suitedFor: [
          "Concealed concrete roof slab electrical routing",
          "Brick masonry wall electrical chasing & switchboard drops",
          "False ceiling & gypsum partition wiring channels",
          "Industrial electrical control panel & machine wiring"
],
        notSuitedFor: [
          "High-pressure fluid transfer (this is strictly an electrical wiring conduit)"
],
        bulkPricing: [
          { minQty: 5, maxQty: 19, label: 'Electrician Wholesale Pack' },
          { minQty: 20, maxQty: 49, label: 'Commercial Contractor Lot' },
          { minQty: 50, label: 'High-Rise Building Master Lot' },
        ],
        images: [
          { src: '/uploads/products/building-flexible-pipes/corrugated-flexible-pvc-electrical-conduit-pipe/corrugated-flexible-pvc-electrical-conduit-pipe-1.webp', alt: 'Corrugated Flexible PVC Electrical Conduit Pipe black coil', sortOrder: 1 },
          { src: '/uploads/products/building-flexible-pipes/corrugated-flexible-pvc-electrical-conduit-pipe/pipes-warehouse-stock-1.jpeg', alt: 'Corrugated Flexible PVC Electrical Conduit Pipe Bohrapir warehouse inventory', sortOrder: 2 },
        ],
        faqs: [
          {
                    "question": "What sizes of Churi pipe are standard for building wiring?",
                    "answer": "Standard sizes are 1/2\" (16mm), 3/4\" (20mm), 1\" (25mm), and 1.25\" (32mm) supplied in 50m and 100m continuous coils."
          },
          {
                    "question": "Is this conduit flame-retardant?",
                    "answer": "Yes, it is extruded from grade-A PVC with flame-retardant additives that automatically self-extinguish when the source of flame is removed."
          }
],
        attrValues: [
          { attr: 'Material Base', val: 'Flame-Retardant PVC Compound' },
          { attr: 'Nominal Diameter (Bore Size)', val: '3/4" (19mm)' },
          { attr: 'Working Pressure Rating', val: '4–6 Bar Medium Duty' },
          { attr: 'Roll Length Standard', val: '50 Meters Coil' },
          { attr: 'Wall Construction & Reinforcement', val: 'Annular Ring Corrugated Flexible Structure' },
          { attr: 'Standard Color Coding', val: 'Industrial Black / Grey Conduit' },
        ],
      },
      {
        name: 'Transparent Clear Flexible PVC Water Level Tubing',
        sku: 'TS-PIP-CLR-005',
        slug: 'transparent-clear-flexible-pvc-water-level-tubing',
        price: 1450,
        moq: 5,
        tradeAliases: "Sheesha Pipe • Level Pipe • Transparent PVC Tubing • Clear Water Level Pipe • Non-Toxic Tubing",
        shortDescription: "Crystal clear flexible PVC tubing (Sheesha Pipe / Level Pipe). Non-toxic, glass-smooth, and highly visible for construction water levels, aquariums, and sanitary fluid transfer.",
        longDescription: "Masonry and construction contractors need a perfectly clear, bubble-free tube to check level lines between distant building columns. Our Clear Transparent PVC Tubing (Sheesha Pipe / Level Pipe) is extruded from 100% virgin, non-toxic PVC resin. It provides optical glass clarity with zero cloudiness, allowing water levels and fluid flow to be checked instantly. It is non-toxic, odorless, and resistant to mild chemicals, making it equally popular in food and laboratory fluid lines.",
        metaTitle: "Food Grade Clear PVC Tubing (Sheesha Pipe) Karachi Supply",
        metaDescription: "Glass-clear virgin transparent PVC tubing (Sheesha Pipe / Level Pipe) in Karachi. Non-toxic, flexible clear tubing for construction leveling and fluid transfer.",
        usage: "Essential for construction masonry water leveling, aquarium air and water lines, food and beverage dispensing, laboratory fluid transfer, and chemical siphon lines.",
        benefits: [
          "High optical transparency allows instant visual check of water levels and bubbles",
          "Extruded from 100% virgin non-toxic PVC resin with zero chemical odor",
          "Glass-smooth interior bore resists bacteria buildup and simplifies cleaning",
          "Soft and pliable — bends around corners without kinking shut"
],
        suitedFor: [
          "Construction masonry & tile water level measurements",
          "Aquarium aeration & fish farm water tubing",
          "Food, beverage & drinking water dispensing lines",
          "Laboratory fluid siphon & chemical drain tubes"
],
        notSuitedFor: [
          "Pressurized steam or boiling oil applications exceeding 60°C"
],
        bulkPricing: [
          { minQty: 5, maxQty: 19, label: 'Masonry Wholesale Pack' },
          { minQty: 20, maxQty: 49, label: 'Hardware Retailer Bundle' },
          { minQty: 50, label: 'Master Distributor Lot' },
        ],
        images: [
          { src: '/uploads/products/building-flexible-pipes/transparent-clear-flexible-pvc-water-level-tubing/transparent-clear-flexible-pvc-water-level-tubing-1.jpg', alt: 'Transparent Clear Flexible PVC Water Level Tubing optical crystal coil', sortOrder: 1 },
          { src: '/uploads/products/building-flexible-pipes/transparent-clear-flexible-pvc-water-level-tubing/transparent-clear-flexible-pvc-water-level-tubing-2.jpg', alt: 'Transparent Clear Flexible PVC Water Level Tubing clarity and transparency inspection', sortOrder: 2 },
          { src: '/uploads/products/building-flexible-pipes/transparent-clear-flexible-pvc-water-level-tubing/transparent-clear-flexible-pvc-water-level-tubing-3.jpg', alt: 'Transparent Clear Flexible PVC Water Level Tubing wall thickness detail', sortOrder: 3 },
          { src: '/uploads/products/building-flexible-pipes/transparent-clear-flexible-pvc-water-level-tubing/pipes-warehouse-stock-1.jpeg', alt: 'Transparent Clear Flexible PVC Water Level Tubing Bohrapir warehouse inventory', sortOrder: 4 },
        ],
        faqs: [
          {
                    "question": "What sizes are commonly used for construction level pipe?",
                    "answer": "For water leveling, 1/4\" (6mm), 5/16\" (8mm), and 3/8\" (10mm) are standard. We also stock up to 1\" and 2\" for fluid transfer in 30m, 50m, and 100m coils."
          },
          {
                    "question": "Is this tubing food-safe for drinking water and beverages?",
                    "answer": "Yes, it is extruded from 100% virgin food-grade PVC resin free from heavy metal stabilizers, making it completely safe for potable water and beverage lines."
          }
],
        attrValues: [
          { attr: 'Material Base', val: '100% Virgin Flexible PVC' },
          { attr: 'Nominal Diameter (Bore Size)', val: '5/16" (8mm)' },
          { attr: 'Working Pressure Rating', val: '1.5–3 Bar Low Head' },
          { attr: 'Roll Length Standard', val: '30 Meters (100 ft)' },
          { attr: 'Wall Construction & Reinforcement', val: 'Single-Wall Flexible Crystal Tube' },
          { attr: 'Standard Color Coding', val: 'Optical Crystal Transparent' },
        ],
      },
      {
        name: 'Agricultural Layflat PE Irrigation Delivery Hose',
        sku: 'TS-PIP-HDP-006',
        slug: 'agricultural-layflat-pe-irrigation-delivery-hose',
        price: 3200,
        moq: 2,
        tradeAliases: "Delivery Pipe • Kheti Discharge Hose • Flat Nalka Pipe • Blue Layflat Hose • Flooding Water Pipe",
        shortDescription: "Collapsible blue layflat PVC water delivery hose. Rolls up completely flat for compact storage and handles large water volume discharge for agricultural irrigation and dewatering.",
        longDescription: "Moving high volumes of water across long farm fields or construction sites with rigid pipes is expensive and back-breaking to relocate. Layflat PVC Delivery Hose rolls out completely flat like a fire hose. Extruded with high-tenacity polyester yarn reinforcement embedded directly between layers of flexible PVC, it handles heavy water discharge pressure without kinking or bursting. When pumping is finished, one person can roll up hundreds of meters into compact coils.",
        metaTitle: "Layflat PVC Water Discharge Delivery Hose Karachi Wholesale",
        metaDescription: "Collapsible blue layflat PVC water delivery hoses (1.5\" to 8\") in Karachi. High-volume, lightweight agricultural irrigation and construction pumping hose.",
        usage: "Designed for agricultural flood irrigation, construction foundation dewatering discharge, emergency floodwater pumping, and mobile water tanker delivery.",
        benefits: [
          "Rolls up completely flat for space-saving storage in vehicles and farm sheds",
          "Continuous polyester reinforcement handles high water volume discharge pressure",
          "Easy for a single laborer to deploy over hundreds of meters in minutes",
          "Resists agricultural fertilizers, mild chemicals, and abrasive muddy water"
],
        suitedFor: [
          "Agricultural crop flooding & farm irrigation runs",
          "Construction dewatering pump discharge lines",
          "Emergency municipal flood water evacuation",
          "Temporary water bypass & tanker distribution"
],
        notSuitedFor: [
          "Pump suction intake lines (layflat hoses collapse under vacuum and are for discharge only)"
],
        bulkPricing: [
          { minQty: 2, maxQty: 9, label: 'Farm Wholesale Pack' },
          { minQty: 10, maxQty: 29, label: 'Landowner / Mandi Volume Pack' },
          { minQty: 30, label: 'Agricultural Fertilizer Dealer Master Lot' },
        ],
        images: [
          { src: '/uploads/products/building-flexible-pipes/agricultural-layflat-pe-irrigation-delivery-hose/agricultural-layflat-pe-irrigation-delivery-hose-1.jpg', alt: 'Agricultural Layflat PE Irrigation Delivery Hose black coil roll', sortOrder: 1 },
          { src: '/uploads/products/building-flexible-pipes/agricultural-layflat-pe-irrigation-delivery-hose/agricultural-layflat-pe-irrigation-delivery-hose-2.jpg', alt: 'Agricultural Layflat PE Irrigation Delivery Hose field deployment detail', sortOrder: 2 },
          { src: '/uploads/products/building-flexible-pipes/agricultural-layflat-pe-irrigation-delivery-hose/agricultural-layflat-pe-irrigation-delivery-hose-3.jpg', alt: 'Agricultural Layflat PE Irrigation Delivery Hose heavy gauge wall view', sortOrder: 3 },
          { src: '/uploads/products/building-flexible-pipes/agricultural-layflat-pe-irrigation-delivery-hose/pipes-warehouse-stock-1.jpeg', alt: 'Agricultural Layflat PE Irrigation Delivery Hose Bohrapir warehouse inventory', sortOrder: 4 },
        ],
        faqs: [
          {
                    "question": "Can Layflat hose be used on the suction side of a pump?",
                    "answer": "No. Layflat hose is designed exclusively for positive water discharge. On the suction side, vacuum pressure will cause it to flatten immediately; use Green Suction Pipe instead."
          },
          {
                    "question": "What sizes and lengths are stocked?",
                    "answer": "We supply layflat delivery hose in 1.5\", 2\", 2.5\", 3\", 4\", 6\", and 8\" diameters in standard 50m and 100m continuous rolls."
          }
],
        attrValues: [
          { attr: 'Material Base', val: 'UV-Stabilized Polyethylene (PE)' },
          { attr: 'Nominal Diameter (Bore Size)', val: '3" (75mm)' },
          { attr: 'Working Pressure Rating', val: '1.5–3 Bar Low Head' },
          { attr: 'Roll Length Standard', val: '50 Meters Coil' },
          { attr: 'Wall Construction & Reinforcement', val: 'Seamless Extruded Heavy-Gauge PE Layflat' },
          { attr: 'Standard Color Coding', val: 'Carbon Black with Blue Identity Stripes' },
        ],
      },
    ]

    for (const prodData of pipeProducts) {
      const product = await prisma.product.upsert({
        where: { slug: prodData.slug },
        update: {
          name: prodData.name,
          sku: prodData.sku,
          price: prodData.price,
          moq: prodData.moq,
          status: 'Active',
          seoStatus: 'Complete',
          categoryId: pipeCat.id,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
        create: {
          name: prodData.name,
          sku: prodData.sku,
          slug: prodData.slug,
          price: prodData.price,
          moq: prodData.moq,
          status: 'Active',
          seoStatus: 'Complete',
          categoryId: pipeCat.id,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
      })

      await prisma.productImage.deleteMany({ where: { productId: product.id } })
      for (const img of prodData.images) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            src: img.src,
            alt: img.alt,
            sortOrder: img.sortOrder,
          },
        })
      }

      await prisma.productFaq.deleteMany({ where: { productId: product.id } })
      for (let fIdx = 0; fIdx < prodData.faqs.length; fIdx++) {
        const faq = prodData.faqs[fIdx]
        await prisma.productFaq.create({
          data: {
            productId: product.id,
            question: faq.question,
            answer: faq.answer,
            sortOrder: fIdx + 1,
          },
        })
      }

      await prisma.productAttributeValue.deleteMany({ where: { productId: product.id } })
      for (const av of prodData.attrValues) {
        const attrId = pipeAttributeMap.get(av.attr)
        if (attrId) {
          await prisma.productAttributeValue.create({
            data: {
              productId: product.id,
              attributeId: attrId,
              value: av.val,
            },
          })
        }
      }
      console.log(`✅ Seeded product: ${product.name} (${product.sku})`)
    }
  }

  
  // 7. Seed Polythene Sheets & Plastic Films Category
  const polyCat = await prisma.category.upsert({
    where: { slug: 'polythene-sheets-films' },
    update: {
      name: 'Polythene Sheets & Plastic Films',
      slug: 'polythene-sheets-films',
      image: '/uploads/categories/polythene-sheets-films.jpeg',
      description: 'Factory-grade virgin and heavy-duty recycled LDPE/LLDPE polythene rolls, black construction DPC vapor barrier sheets, optical clear plastic packaging film rolls, and multi-layer pallet stretch film for industrial, civil construction, and agricultural wrapping across Pakistan.',
      metaTitle: 'Wholesale Polythene Sheets & Plastic Film Rolls Karachi | Tahira Syndicate',
      metaDescription: 'Factory wholesale black construction polythene rolls, virgin transparent plastic sheets, DPC sheets & stretch film at Bohrapir & SITE Karachi Pakistan.',
    },
    create: {
      name: 'Polythene Sheets & Plastic Films',
      slug: 'polythene-sheets-films',
      image: '/uploads/categories/polythene-sheets-films.jpeg',
      description: 'Factory-grade virgin and heavy-duty recycled LDPE/LLDPE polythene rolls, black construction DPC vapor barrier sheets, optical clear plastic packaging film rolls, and multi-layer pallet stretch film for industrial, civil construction, and agricultural wrapping across Pakistan.',
      metaTitle: 'Wholesale Polythene Sheets & Plastic Film Rolls Karachi | Tahira Syndicate',
      metaDescription: 'Factory wholesale black construction polythene rolls, virgin transparent plastic sheets, DPC sheets & stretch film at Bohrapir & SITE Karachi Pakistan.',
    },
  })
  console.log('Polythene Sheets & Plastic Films category initialized.')

  if (polyCat) {
    const polyAttributesData = [
      {
        name: 'Polymer Resin Grade',
        type: 'Select' as const,
        options: ['100% Virgin LDPE', 'Premium Recycled Black Polyethylene', 'Linear Low-Density (LLDPE) High-Tack', 'Multi-Layer Co-Extruded Film'],
      },
      {
        name: 'Film Thickness (Gauge / Micron)',
        type: 'Select' as const,
        options: ['0.05mm (50 Micron / 200 Gauge)', '0.10mm (100 Micron / 400 Gauge)', '0.15mm (150 Micron / 600 Gauge)', '0.20mm (200 Micron / 800 Gauge)', '0.25mm (250 Micron / 1000 Gauge)', '23 Micron Stretch'],
      },
      {
        name: 'Roll Width Standard',
        type: 'Select' as const,
        options: ['3 Feet (0.9m)', '4 Feet (1.2m)', '6 Feet (1.8m)', '8 Feet (2.4m)', '10 Feet (3.0m)', '12 Feet (3.6m Centerfold / Gusseted)', '500mm Stretch'],
      },
      {
        name: 'Roll Weight / Length Specification',
        type: 'Select' as const,
        options: ['15 kg Standard Roll', '20 kg Commercial Roll', '25 kg Master Roll', '30 kg Heavy Contractor Roll', '50 kg Jumbo Bale', '2.5 kg Stretch Roll'],
      },
      {
        name: 'Transparency & Optical Clarity',
        type: 'Select' as const,
        options: ['Jet Black Opaque', 'Optical Crystal Transparent (Shisha)', 'Translucent Natural Milky', 'UV-Treated Green / Blue Tinted'],
      },
      {
        name: 'Tensile & Puncture Resistance',
        type: 'Select' as const,
        options: ['Standard Duty Packaging', 'High-Impact Puncture-Proof Construction Grade', 'Heavy DPC Hydrostatic Barrier', 'High-Yield 300% Pre-Stretch'],
      },
    ]

    const polyAttributeMap = new Map<string, number>()
    for (let i = 0; i < polyAttributesData.length; i++) {
      const aData = polyAttributesData[i]
      let attr = await prisma.attribute.findFirst({ where: { name: aData.name } })
      if (!attr) {
        attr = await prisma.attribute.create({
          data: {
            name: aData.name,
            type: aData.type,
            options: aData.options,
            status: 'Active',
          },
        })
      } else {
        attr = await prisma.attribute.update({
          where: { id: attr.id },
          data: {
            type: aData.type,
            options: aData.options,
          },
        })
      }
      polyAttributeMap.set(aData.name, attr.id)

      await prisma.categoryAttribute.upsert({
        where: {
          categoryId_attributeId: {
            categoryId: polyCat.id,
            attributeId: attr.id,
          },
        },
        update: { sortOrder: i + 1 },
        create: {
          categoryId: polyCat.id,
          attributeId: attr.id,
          sortOrder: i + 1,
        },
      })
    }

    const polyProducts = [
      {
        name: 'Heavy-Duty Black Construction & Agricultural Polythene Sheet',
        sku: 'TS-PLY-BLK-001',
        slug: 'heavy-duty-black-construction-agricultural-polythene-sheet',
        price: 4800,
        moq: 5,
        tradeAliases: "Dhalai Plastic • Chhat Ka Plastic • Concrete Underlay Film • Vapor Barrier Roll • Slab Plastic",
        shortDescription: "Heavy-gauge polythene roll (300 to 1200 gauge) for concrete roof casting and slab foundation work. Stops cement water from draining through shuttering and seals out ground moisture.",
        longDescription: "When pouring a concrete roof slab or basement foundation in Karachi, any gap in the wooden shuttering allows wet cement slurry to escape. This weakens the cured concrete mix and leads to surface cracks. Laying our heavy Dhalai Plastic roll over the shuttering forms a continuous waterproof membrane that holds all cement water inside the slab for proper curing. It also blocks rising dampness when laid underneath ground floor basement concrete.",
        metaTitle: "Black Construction Polythene Sheet Roll Karachi Wholesale",
        metaDescription: "Heavy-duty polythene sheets for roof concrete casting (Dhalai Plastic) in Karachi. 300 to 1200 gauge rolls for moisture barrier and basement damp-proofing.",
        usage: "Laid over roof shuttering before casting concrete slabs, under basement foundations for damp-proofing, and over cured concrete as a moisture-retaining curing blanket.",
        benefits: [
          "Prevents cement slurry from leaking through wooden shuttering gaps",
          "Acts as a permanent vapor barrier against rising underground dampness",
          "Heavy puncture resistance survives laborer foot traffic and steel rebar placement",
          "Available in wide continuous rolls (up to 12 feet wide) for fast site coverage"
],
        suitedFor: [
          "Roof slab concrete casting & shuttering underlay",
          "Basement floor foundation vapor barriers",
          "Concrete curing moisture-retention blankets",
          "Temporary construction dust and rain screening"
],
        notSuitedFor: [
          "Permanent open roofing exposed to years of direct overhead sunlight without concrete cover"
],
        bulkPricing: [
          { minQty: 15, maxQty: 49, label: 'Standard Construction Contractor Pack' },
          { minQty: 50, maxQty: 199, label: 'Commercial Project / Mandi Dealer Bale' },
          { minQty: 200, label: 'Master Wholesale Factory Container Lot' },
        ],
        images: [
          { src: '/uploads/products/polythene-sheets-films/heavy-duty-black-construction-agricultural-polythene-sheet/heavy-duty-black-construction-agricultural-polythene-sheet-1.jpg', alt: 'Heavy-Duty Black Construction & Agricultural Polythene Sheet master coils in warehouse', sortOrder: 1 },
          { src: '/uploads/products/polythene-sheets-films/heavy-duty-black-construction-agricultural-polythene-sheet/heavy-duty-black-construction-agricultural-polythene-sheet-2.jpg', alt: 'Heavy-Duty Black Construction & Agricultural Polythene Sheet foundation underlayment deployment', sortOrder: 2 },
          { src: '/uploads/products/polythene-sheets-films/heavy-duty-black-construction-agricultural-polythene-sheet/heavy-duty-black-construction-agricultural-polythene-sheet-3.jpg', alt: 'Heavy-Duty Black Construction & Agricultural Polythene Sheet heavy gauge film texture', sortOrder: 3 },
        ],
        faqs: [
          {
                    "question": "What gauge thickness is standard for roof casting in Karachi?",
                    "answer": "Builders typically use 300 to 600 gauge black or doodhia rolls for roof casting, and 800 to 1200 gauge for heavy basement foundation moisture proofing."
          },
          {
                    "question": "How are the rolls supplied and billed?",
                    "answer": "Our Dhalai Plastic is extruded at our Karachi plant and supplied in 25kg, 30kg, and 50kg rolls. Every roll is weighed on calibrated digital scales with verified weight slips."
          }
],
        attrValues: [
          { attr: 'Polymer Resin Grade', val: 'Premium Recycled Black Polyethylene' },
          { attr: 'Film Thickness (Gauge / Micron)', val: '0.15mm (150 Micron / 600 Gauge)' },
          { attr: 'Roll Width Standard', val: '10 Feet (3.0m)' },
          { attr: 'Roll Weight / Length Specification', val: '25 kg Master Roll' },
          { attr: 'Transparency & Optical Clarity', val: 'Jet Black Opaque' },
          { attr: 'Tensile & Puncture Resistance', val: 'High-Impact Puncture-Proof Construction Grade' },
        ],
      },
      {
        name: 'Transparent Virgin Clear LDPE Plastic Roll',
        sku: 'TS-PLY-CLR-002',
        slug: 'transparent-virgin-clear-ldpe-plastic-roll',
        price: 5400,
        moq: 5,
        tradeAliases: "Doodhia Plastic • White Polythene Roll • Milky Sheeting • Virgin White Plastic • Doodhia Sheet",
        shortDescription: "Semi-opaque milky white polythene film roll (Doodhia Plastic). Reflects sunlight heat, provides clean packaging protection, and serves as an aesthetic barrier on construction sites.",
        longDescription: "Black plastic absorbs intense solar heat and can overheat products stored beneath it. Milky White Doodhia Polythene Film reflects sunlight, keeping covered goods and concrete slabs cooler. Extruded from virgin and blended LDPE polymers, it offers a clean, professional appearance for wrapping finished commercial products, covering furniture, masking walls during painting, and wrapping palletized boxes for export transport.",
        metaTitle: "Virgin Clear LDPE Plastic Roll Wholesale Karachi Supply",
        metaDescription: "Premium milky white polythene film rolls (Doodhia Plastic) in Karachi. Heat-reflective, tear-resistant sheeting for packaging, wrapping, and construction.",
        usage: "Used for pallet shrink wrapping, commercial cargo dust covers, furniture protection, paint masking sheets, and light-reflecting greenhouse floor liners across Pakistan.",
        benefits: [
          "Milky white color reflects solar heat rather than absorbing it like black plastic",
          "Clean, aesthetic appearance ideal for packaging commercial consumer goods",
          "Tough puncture and tear resistance for industrial pallet wrapping",
          "100% waterproof and dust-proof protective barrier"
],
        suitedFor: [
          "Warehouse palletized cargo wrapping",
          "Commercial furniture & textile dust covers",
          "Paint overspray masking & interior renovation protection",
          "Heat-reflective agricultural nursery ground liners"
],
        notSuitedFor: [
          "High-temperature furnace shrink ovens above 150°C"
],
        bulkPricing: [
          { minQty: 10, maxQty: 29, label: 'Standard Furniture & Retailer Bundle' },
          { minQty: 30, maxQty: 99, label: 'Industrial Textile / Export Factory Pack' },
          { minQty: 100, label: 'Master Wholesale Distributor Consignment' },
        ],
        images: [
          { src: '/uploads/products/polythene-sheets-films/transparent-virgin-clear-ldpe-plastic-roll/transparent-virgin-clear-ldpe-plastic-roll-1.webp', alt: 'Transparent Virgin Clear LDPE Plastic Roll optical clarity showcase', sortOrder: 1 },
          { src: '/uploads/products/polythene-sheets-films/transparent-virgin-clear-ldpe-plastic-roll/transparent-virgin-clear-ldpe-plastic-roll-2.jpg', alt: 'Transparent Virgin Clear LDPE Plastic Roll furniture wrapping detail', sortOrder: 2 },
          { src: '/uploads/products/polythene-sheets-films/transparent-virgin-clear-ldpe-plastic-roll/transparent-virgin-clear-ldpe-plastic-roll-3.webp', alt: 'Transparent Virgin Clear LDPE Plastic Roll roll thickness and transparency', sortOrder: 3 },
        ],
        faqs: [
          {
                    "question": "What roll widths and thicknesses are available in Doodhia plastic?",
                    "answer": "We supply Doodhia plastic from 2 feet up to 12 feet wide (center-folded or single-wound) in thicknesses from 150 gauge (37 micron) up to 800 gauge (200 micron)."
          },
          {
                    "question": "Is Doodhia plastic virgin grade?",
                    "answer": "We manufacture both 100% virgin grade Doodhia rolls for export packaging and economical commercial blends for construction masking."
          }
],
        attrValues: [
          { attr: 'Polymer Resin Grade', val: '100% Virgin LDPE' },
          { attr: 'Film Thickness (Gauge / Micron)', val: '0.10mm (100 Micron / 400 Gauge)' },
          { attr: 'Roll Width Standard', val: '6 Feet (1.8m)' },
          { attr: 'Roll Weight / Length Specification', val: '20 kg Commercial Roll' },
          { attr: 'Transparency & Optical Clarity', val: 'Optical Crystal Transparent (Shisha)' },
          { attr: 'Tensile & Puncture Resistance', val: 'Standard Duty Packaging' },
        ],
      },
      {
        name: 'Heavy-Duty Construction DPC Damp-Proof Membrane Sheet',
        sku: 'TS-PLY-DPC-003',
        slug: 'heavy-duty-construction-dpc-damp-proof-membrane-sheet',
        price: 3600,
        moq: 5,
        tradeAliases: "Kala Plastic • Black Polythene Roll • Basement Damp Proof Membrane • Foundation Liner",
        shortDescription: "Heavy-duty black carbon polythene roll (500 to 1200 gauge). Built for deep basement foundation damp-proofing, retaining walls, and long-term water seepage control.",
        longDescription: "Underground moisture and groundwater seepage can destroy basement walls, cause salt efflorescence (shora), and ruin interior paint finishes. Our Heavy-Duty Black Foundation Plastic (Kala Plastic) is loaded with carbon black additives for maximum durability and UV stability. It creates an impenetrable subterranean damp-proof membrane (DPM) underneath basement raft slabs and behind retaining walls, permanently sealing out groundwater.",
        metaTitle: "Heavy-Duty Black Foundation Plastic Roll Karachi Wholesale",
        metaDescription: "Heavy-duty black foundation polythene rolls (500–1200 gauge) in Karachi. Carbon-black damp proof membrane (DPM) for basement moisture and seepage prevention.",
        usage: "Essential under basement foundation raft slabs, behind earth retaining walls, inside civil drainage trenches, and as water pond lining across civil engineering projects.",
        benefits: [
          "Carbon black formulation provides high puncture resistance against sharp rocks",
          "Permanent barrier against groundwater seepage and rising capillary dampness",
          "Resists soil chemicals, sulfate salts, and biological soil degradation",
          "Available in wide continuous master rolls to minimize on-site overlapping joints"
],
        suitedFor: [
          "Basement foundation raft slab damp-proofing (DPM)",
          "Earth retaining wall external moisture sealing",
          "Water canal & civil drainage trench lining",
          "Outdoor raw material & scrap yard weather covers"
],
        notSuitedFor: [
          "Food packaging where direct contact with edible items is required"
],
        bulkPricing: [
          { minQty: 10, maxQty: 39, label: 'Civil Contractor Starter Pack' },
          { minQty: 40, maxQty: 99, label: 'Commercial Building Project Lot' },
          { minQty: 100, label: 'Master Builders / Hardware Mandi Bale' },
        ],
        images: [
          { src: '/uploads/products/polythene-sheets-films/heavy-duty-construction-dpc-damp-proof-membrane-sheet/heavy-duty-construction-dpc-damp-proof-membrane-sheet-1.jpg', alt: 'Heavy-Duty Construction DPC Damp-Proof Membrane Sheet embossed roll', sortOrder: 1 },
          { src: '/uploads/products/polythene-sheets-films/heavy-duty-construction-dpc-damp-proof-membrane-sheet/heavy-duty-construction-dpc-damp-proof-membrane-sheet-2.jpg', alt: 'Heavy-Duty Construction DPC Damp-Proof Membrane Sheet plinth beam masonry alignment', sortOrder: 2 },
        ],
        faqs: [
          {
                    "question": "What gauge thickness is recommended for basement damp-proofing?",
                    "answer": "For underground basement slabs and retaining walls, we recommend 800 to 1200 gauge (200–300 micron) heavy black plastic to resist puncturing from sub-base gravel."
          },
          {
                    "question": "How should overlapping sheets be sealed on site?",
                    "answer": "Sheets should overlap by at least 12 to 18 inches and be sealed with heavy bitumen tape or waterproof adhesive sealant to ensure a continuous watertight seal."
          }
],
        attrValues: [
          { attr: 'Polymer Resin Grade', val: '100% Virgin LDPE' },
          { attr: 'Film Thickness (Gauge / Micron)', val: '0.25mm (250 Micron / 1000 Gauge)' },
          { attr: 'Roll Width Standard', val: '3 Feet (0.9m)' },
          { attr: 'Roll Weight / Length Specification', val: '20 kg Commercial Roll' },
          { attr: 'Transparency & Optical Clarity', val: 'Jet Black Opaque' },
          { attr: 'Tensile & Puncture Resistance', val: 'Heavy DPC Hydrostatic Barrier' },
        ],
      },
      {
        name: 'Industrial LDPE Tubular Roll & Protective Packaging Film',
        sku: 'TS-PLY-IND-004',
        slug: 'industrial-ldpe-tubular-roll-protective-packaging-film',
        price: 4200,
        moq: 5,
        tradeAliases: "Shopper Thaan • Tubular Plastic Roll • Packaging Film Roll • Continuous Plastic Sleeve • Shopper Roll",
        shortDescription: "Continuous seamless tubular polythene rolls (Shopper Thaan) in HDPE and LDPE. Ready for automatic bag-making machines or manual heat-sealing for retail and packing sacks.",
        longDescription: "Packaging factories and plastic bag converters need consistent, uniform tubular film rolls that run smoothly through high-speed sealing and cutting machines without jamming. Our Shopper Roll Thaan is extruded with tight gauge tolerance and uniform bubble cooling. Available in virgin crystal-clear LDPE or high-strength crisp HDPE, it heat-seals cleanly at standard temperatures to produce retail bags, hardware packaging sleeves, and textile liners.",
        metaTitle: "Packaging Shopper Roll Thaan (Tubular Film) Karachi Supply",
        metaDescription: "Continuous tubular plastic film rolls (Shopper Thaan) in Karachi. Uniform gauge, heat-sealable film for bag making and industrial sleeve packing.",
        usage: "Supplied to plastic bag converters, textile garment packing factories, chemical sack producers, retail packaging workshops, and hardware pouch makers across Karachi.",
        benefits: [
          "Seamless tubular sleeve design allows custom length bag cutting and heat-sealing",
          "Uniform gauge thickness across the width ensures smooth high-speed machine feeding",
          "Strong heat-seal strength prevents bag bottom seam splitting under heavy contents",
          "Available in high-clarity LDPE or high-tensile crisp HDPE formulations"
],
        suitedFor: [
          "Plastic shopping bag & carrier bag manufacturing",
          "Garment & textile fabric roll protective packaging",
          "Long hardware pipe, rod & aluminum profile protective sleeves",
          "Chemical & food grain moisture-proof liner bags"
],
        notSuitedFor: [
          "Heavy civil concrete casting where wide flat sheets are required"
],
        bulkPricing: [
          { minQty: 10, maxQty: 29, label: 'Factory Packaging Pack' },
          { minQty: 30, maxQty: 99, label: 'Industrial Manufacturer Consignment' },
          { minQty: 100, label: 'Master Wholesale Converter Lot' },
        ],
        images: [
          { src: '/uploads/products/polythene-sheets-films/industrial-ldpe-tubular-roll-protective-packaging-film/industrial-ldpe-tubular-roll-protective-packaging-film-1.jpg', alt: 'Industrial LDPE Tubular Roll continuous seamless sleeve reel Bohrapir Karachi', sortOrder: 1 },
          { src: '/uploads/products/polythene-sheets-films/industrial-ldpe-tubular-roll-protective-packaging-film/industrial-ldpe-tubular-roll-protective-packaging-film-2.jpg', alt: 'Industrial LDPE Tubular Roll open plastic sleeve flat sheet fold', sortOrder: 2 },
          { src: '/uploads/products/polythene-sheets-films/industrial-ldpe-tubular-roll-protective-packaging-film/industrial-ldpe-tubular-roll-protective-packaging-film-3.jpg', alt: 'Industrial LDPE Tubular Roll protective packaging film roll', sortOrder: 3 },
        ],
        faqs: [
          {
                    "question": "What tube widths are available in Shopper Thaan rolls?",
                    "answer": "We manufacture tubular sleeve widths from 3 inches (narrow pouches) up to 48 inches (wide master sleeves) in thicknesses from 80 gauge up to 600 gauge."
          },
          {
                    "question": "Can you produce custom colored tubular rolls?",
                    "answer": "Yes, we extrude natural crystal clear, milky white, deep black, blue, yellow, and red tubular rolls according to your packaging color BOQ."
          }
],
        attrValues: [
          { attr: 'Polymer Resin Grade', val: '100% Virgin LDPE' },
          { attr: 'Film Thickness (Gauge / Micron)', val: '0.10mm (100 Micron / 400 Gauge)' },
          { attr: 'Roll Width Standard', val: '4 Feet (1.2m)' },
          { attr: 'Roll Weight / Length Specification', val: '20 kg Commercial Roll' },
          { attr: 'Transparency & Optical Clarity', val: 'Optical Crystal Transparent (Shisha)' },
          { attr: 'Tensile & Puncture Resistance', val: 'Standard Duty Packaging' },
        ],
      },
      {
        name: 'High-Clarity Industrial Pallet Stretch Wrap Film Roll',
        sku: 'TS-PLY-STR-006',
        slug: 'high-clarity-industrial-pallet-stretch-wrap-film-roll',
        price: 1850,
        moq: 6,
        tradeAliases: "Shrink Film • Pallet Wrap Roll • Heat Shrink Poly Film • Clear Packaging Roll • Bottle Shrink Wrap",
        shortDescription: "High-clarity virgin LDPE industrial heat-shrink film. Delivers high puncture resistance and tight, uniform shrinkage around beverage bottles, cans, and palletized cartons.",
        longDescription: "Packaging beverage bottles, canned goods, and carton bundles into tight, transport-ready multipacks requires heat-shrink film with balanced bidirectional shrinkage and high clarity. Our Virgin LDPE Shrink Film is extruded from prime virgin low-density resin with optical clarity and high puncture resistance. When passed through a heat tunnel, it shrinks uniformly around the products, locking them into rigid, moisture-proof commercial bundles.",
        metaTitle: "Virgin LDPE Shrink Packaging Film Roll Karachi Wholesale",
        metaDescription: "Prime virgin LDPE heat shrink packaging film rolls in Karachi. High clarity, balanced shrinkage for beverage bottles, canned goods, and pallet wrapping.",
        usage: "Used across beverage bottling plants, pharmaceutical packaging lines, canned food multi-packs, carton bundling, and heavy pallet heat-shrink hooding.",
        benefits: [
          "High optical clarity showcases printed brand graphics on bottles and cartons",
          "Balanced machine-direction and cross-direction shrinkage creates tight, rigid packs",
          "High puncture resistance prevents pack bursting during truck transit",
          "100% prime virgin resin formulation ensures consistent seal strength in shrink tunnels"
],
        suitedFor: [
          "Beverage bottle & aluminum can multi-pack packaging",
          "Pharmaceutical & consumer goods bundle wrapping",
          "Ceramic tile & construction material pallet hooding",
          "Corrugated box protective weather sealing"
],
        notSuitedFor: [
          "Manual cold stretch wrapping without heat application (use Stretch Wrap instead)"
],
        bulkPricing: [
          { minQty: 1, maxQty: 9, label: 'Standard Warehouse Trial Pack (6 Rolls/Box)' },
          { minQty: 10, maxQty: 49, label: 'Commercial Logistics / FMCG Distributor Lot' },
          { minQty: 50, label: 'Master Export Shipper Container Consignment' },
        ],
        images: [
          { src: '/uploads/products/polythene-sheets-films/high-clarity-industrial-pallet-stretch-wrap-film-roll/high-clarity-industrial-pallet-stretch-wrap-film-roll-1.jpg', alt: 'High-Clarity Industrial Pallet Stretch Wrap Film Roll dispenser hand wrapping', sortOrder: 1 },
          { src: '/uploads/products/polythene-sheets-films/high-clarity-industrial-pallet-stretch-wrap-film-roll/high-clarity-industrial-pallet-stretch-wrap-film-roll-2.jpg', alt: 'High-Clarity Industrial Pallet Stretch Wrap Film standing warehouse rolls Bohrapir Karachi', sortOrder: 2 },
          { src: '/uploads/products/polythene-sheets-films/high-clarity-industrial-pallet-stretch-wrap-film-roll/high-clarity-industrial-pallet-stretch-wrap-film-roll-3.jpg', alt: 'High-Clarity Industrial Pallet Stretch Wrap Film pyramid carton packaging rolls', sortOrder: 3 },
        ],
        faqs: [
          {
                    "question": "What is the difference between Shrink Film and Stretch Film?",
                    "answer": "Shrink Film requires heat (from a heat gun or shrink tunnel) to shrink tightly around products. Stretch Film is elastic plastic that stretches and clings tightly around pallets at room temperature without heat."
          },
          {
                    "question": "What thickness range is available for bottle shrink packaging?",
                    "answer": "We supply shrink film from 150 gauge (37 micron) for light multi-packs up to 600 gauge (150 micron) for heavy master pallet shrink hoods."
          }
],
        attrValues: [
          { attr: 'Polymer Resin Grade', val: 'Linear Low-Density (LLDPE) High-Tack' },
          { attr: 'Film Thickness (Gauge / Micron)', val: '23 Micron Stretch' },
          { attr: 'Roll Width Standard', val: '500mm Stretch' },
          { attr: 'Roll Weight / Length Specification', val: '2.5 kg Stretch Roll' },
          { attr: 'Transparency & Optical Clarity', val: 'Optical Crystal Transparent (Shisha)' },
          { attr: 'Tensile & Puncture Resistance', val: 'High-Yield 300% Pre-Stretch' },
        ],
      },
    ]

    for (const prodData of polyProducts) {
      const product = await prisma.product.upsert({
        where: { sku: prodData.sku },
        update: {
          name: prodData.name,
          slug: prodData.slug,
          price: prodData.price,
          moq: prodData.moq,
          status: 'Active',
          seoStatus: 'Complete',
          categoryId: polyCat.id,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
        create: {
          name: prodData.name,
          sku: prodData.sku,
          slug: prodData.slug,
          price: prodData.price,
          moq: prodData.moq,
          status: 'Active',
          seoStatus: 'Complete',
          categoryId: polyCat.id,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
      })

      await prisma.productImage.deleteMany({ where: { productId: product.id } })
      for (const img of prodData.images) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            src: img.src,
            alt: img.alt,
            sortOrder: img.sortOrder,
          },
        })
      }

      await prisma.productFaq.deleteMany({ where: { productId: product.id } })
      for (let fIdx = 0; fIdx < prodData.faqs.length; fIdx++) {
        const faq = prodData.faqs[fIdx]
        await prisma.productFaq.create({
          data: {
            productId: product.id,
            question: faq.question,
            answer: faq.answer,
            sortOrder: fIdx + 1,
          },
        })
      }

      await prisma.productAttributeValue.deleteMany({ where: { productId: product.id } })
      for (const av of prodData.attrValues) {
        const attrId = polyAttributeMap.get(av.attr)
        if (attrId) {
          await prisma.productAttributeValue.create({
            data: {
              productId: product.id,
              attributeId: attrId,
              value: av.val,
            },
          })
        }
      }
      console.log(`✅ Seeded product: ${product.name} (${product.sku})`)
    }
  }

  // 10. Seed Packaging & Strapping Materials Category
  {
    console.log('Seeding Category: Packaging & Strapping Materials...')
    const pkgCat = await prisma.category.upsert({
      where: { slug: 'packaging-strapping' },
      update: {
        name: 'Packaging & Strapping Materials',
        image: '/uploads/categories/packaging-strapping.jpeg',
        status: 'Active',
        metaTitle: 'Wholesale Packaging & Strapping Materials Karachi | Tahira Syndicate',
        metaDescription: 'Industrial strapping materials, PP strapping band (patti), PET strapping rolls, BOPP carton packing tapes, woven niwar, and heavy galvanized metal strapping clips & seals in Karachi, Pakistan.',
        description: 'Industrial packaging and strapping solutions across Pakistan. High-tensile PP strapping band (patti), PET strapping rolls, machine and manual carton sealing tapes, cotton & nylon niwar rolls, and heavy galvanized metal strapping clips/seals engineered for pallet stabilization, factory baling, and secure logistics.',
      },
      create: {
        name: 'Packaging & Strapping Materials',
        slug: 'packaging-strapping',
        image: '/uploads/categories/packaging-strapping.jpeg',
        status: 'Active',
        metaTitle: 'Wholesale Packaging & Strapping Materials Karachi | Tahira Syndicate',
        metaDescription: 'Industrial strapping materials, PP strapping band (patti), PET strapping rolls, BOPP carton packing tapes, woven niwar, and heavy galvanized metal strapping clips & seals in Karachi, Pakistan.',
        description: 'Industrial packaging and strapping solutions across Pakistan. High-tensile PP strapping band (patti), PET strapping rolls, machine and manual carton sealing tapes, cotton & nylon niwar rolls, and heavy galvanized metal strapping clips/seals engineered for pallet stabilization, factory baling, and secure logistics.',
      },
    })

    const pkgAttributes = [
      {
        name: 'Material Type & Polymer Grade',
        type: 'Select' as const,
        options: ['High-Tensile Polypropylene (PP)', 'Oriented PET (Polyester)', 'BOPP Film + Acrylic Adhesive', 'Woven Cotton & Nylon', 'Galvanized Cold-Rolled Steel (CRCA)'],
      },
      {
        name: 'Standard Width / Gauge Size',
        type: 'Select' as const,
        options: ['9mm (3/8 Inch)', '12mm / 12.5mm (1/2 Inch)', '15mm / 15.5mm (5/8 Inch)', '19mm (3/4 Inch)', '48mm (2 Inch)', '72mm (3 Inch)', '25mm - 75mm (1 to 3 Inch Webbing)'],
      },
      {
        name: 'Operating Mode & Tool Compatibility',
        type: 'Select' as const,
        options: ['Manual Tensioner & Crimping Sealer', 'Semi-Automatic & Automatic Strapping Machine', 'Battery Powered Friction Welder / Heavy Sealer', 'Manual Tape Gun & Carton Sealer Line', 'Manual Webbing Tie-Down & Knotting'],
      },
      {
        name: 'Industrial Application & Baling Duty',
        type: 'Select' as const,
        options: ['Carton Bundling & Corrugated Box Sealing', 'Heavy Pallet & Machinery Stabilization', 'Export Container & Sea Cargo Lashing', 'Textile Baling & Fiber Bundling', 'Truck Tie-Down & Furniture Webbing'],
      },
    ]

    const pkgAttributeMap = new Map<string, number>()
    for (let i = 0; i < pkgAttributes.length; i++) {
      const aData = pkgAttributes[i]
      let attr = await prisma.attribute.findFirst({ where: { name: aData.name } })
      if (!attr) {
        attr = await prisma.attribute.create({
          data: {
            name: aData.name,
            type: aData.type,
            options: aData.options,
            status: 'Active',
            required: false,
          },
        })
      }
      pkgAttributeMap.set(aData.name, attr.id)

      await prisma.categoryAttribute.upsert({
        where: {
          categoryId_attributeId: {
            categoryId: pkgCat.id,
            attributeId: attr.id,
          },
        },
        update: { sortOrder: i + 1 },
        create: {
          categoryId: pkgCat.id,
          attributeId: attr.id,
          sortOrder: i + 1,
        },
      })
    }

    const pkgProducts = [
      {
        name: 'Manual Polypropylene (PP) Strapping Roll (Patti)',
        sku: 'TS-PKG-PPR-001',
        slug: 'manual-polypropylene-pp-strapping-roll-patti',
        price: 2400,
        moq: 5,
        tradeAliases: "Hath Wali Patti • Manual Strapping Roll • Packaging Patti • Heavy Duty PP Patti • Box Patti",
        shortDescription: "Heavy-gauge manual polypropylene hand strapping roll (Hath Wali Patti). High breaking strength for manual tensioners and metal clips (patti kundi) on crates and pallets.",
        longDescription: "When packing heavy wooden crates, metal parts, or large warehouse cartons by hand, standard machine strapping is too thin. Our Manual PP Hand Strapping Roll (Hath Wali Patti) is extruded with a thicker gauge and deep diamond embossing. It works seamlessly with manual ratchet tensioners and crimping sealers, holding heavy loads firmly with galvanized metal clips (patti kundi) without splitting along the length.",
        metaTitle: "Manual PP Hand Strapping Roll (Hath Patti) Karachi Wholesale",
        metaDescription: "Heavy-duty manual PP hand strapping rolls (Hath Wali Patti) in Karachi. High break strength, diamond embossed for manual tensioners and metal strapping clips.",
        usage: "The everyday standard for manual carton bundling, wooden crate securing, brick pallet strapping, textile bale lashing, and general warehouse shipping across Pakistan.",
        benefits: [
          "Thick gauge formulation delivers high break strength for heavy manual packing",
          "Deep diamond embossing ensures metal clips (patti kundi) grip without slipping",
          "Supplied in convenient portable dispenser rolls for fast warehouse mobility",
          "Cost-effective and reliable alternative to expensive steel strapping"
],
        suitedFor: [
          "Manual ratchet tensioner & crimping tool operation",
          "Heavy corrugated carton & master box securing",
          "Wooden crate & export wooden pallet strapping",
          "Textile fabric bale & yarn carton packaging"
],
        notSuitedFor: [
          "High-speed automatic arch strapping machines (use machine-grade PP instead)"
],
        bulkPricing: [
          { minQty: 10, maxQty: 29, label: 'Warehouse Starter Pack' },
          { minQty: 30, maxQty: 74, label: 'Commercial Distribution Lot' },
          { minQty: 75, label: 'Master Industrial Mandi Bale' },
        ],
        images: [
          { src: '/uploads/products/packaging-strapping/manual-polypropylene-pp-strapping-roll-patti/manual-pp-strapping-roll-patti-karachi-view-1.jpg', alt: 'Manual Polypropylene PP Strapping Roll Patti view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/packaging-strapping/manual-polypropylene-pp-strapping-roll-patti/manual-pp-strapping-roll-patti-karachi-view-2.jpg', alt: 'Manual Polypropylene PP Strapping Roll Patti view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/packaging-strapping/manual-polypropylene-pp-strapping-roll-patti/manual-pp-strapping-roll-patti-karachi-view-3.jpg', alt: 'Manual Polypropylene PP Strapping Roll Patti view 3 Karachi', sortOrder: 3 },
          { src: '/uploads/products/packaging-strapping/manual-polypropylene-pp-strapping-roll-patti/manual-pp-strapping-roll-patti-karachi-category-packaging-strapping-overview.jpg', alt: 'Tahira Syndicate industrial packaging and strapping materials wholesale stock Bohrapir Karachi Pakistan', sortOrder: 4 },
        ],
        faqs: [
          {
                    "question": "What tool set is used with manual PP strapping?",
                    "answer": "Manual PP strapping uses a manual ratchet tensioner to pull the band tight, a manual sealer tool, and galvanized metal strapping clips (patti kundi) to crimp the joint."
          },
          {
                    "question": "What roll weights and colors are stocked?",
                    "answer": "We supply manual strapping in 5kg, 8kg, 10kg, and 12kg rolls in White, Blue, Yellow, Green, and Black colors."
          }
],
        attrValues: [
          { attr: 'Material Type & Polymer Grade', val: 'High-Tensile Polypropylene (PP)' },
          { attr: 'Standard Width / Gauge Size', val: '12mm / 12.5mm (1/2 Inch)' },
          { attr: 'Operating Mode & Tool Compatibility', val: 'Manual Tensioner & Crimping Sealer' },
          { attr: 'Industrial Application & Baling Duty', val: 'Carton Bundling & Corrugated Box Sealing' },
        ],
      },
      {
        name: 'Semi-Automatic Machine Grade PP Strapping Band Roll',
        sku: 'TS-PKG-PPS-002',
        slug: 'semi-automatic-machine-grade-pp-strapping-band-roll',
        price: 3200,
        moq: 4,
        tradeAliases: "Machine Patti • PP Strapping Band • Automatic Box Strapping • Plastic Packaging Patti",
        shortDescription: "Precision machine-grade virgin polypropylene box strapping band (9mm–15mm). Smooth feeding, zero machine jams, and strong heat-seal joints for high-speed automated carton packing.",
        longDescription: "High-speed packaging lines cannot afford downtime from brittle strapping bands that jam tensioning rollers or fail to heat-weld properly. Our Machine-Grade PP Strapping Roll (Machine Patti) is extruded with precision width tolerances, consistent curvature camber, and high tensile strength. It feeds smoothly through semi-automatic and fully automatic arch strapping machines, delivering strong friction or heat-welded joints in less than 2 seconds per box.",
        metaTitle: "PP Machine Box Strapping Roll (Machine Patti) Karachi Supply",
        metaDescription: "Virgin machine-grade PP plastic box strapping rolls (Machine Patti) in Karachi. Jam-free, high tensile strapping bands for semi-auto and auto packing machines.",
        usage: "Used in carton packing lines, pharmaceutical logistics, textile export cartons, paper printing presses, food processing plants, and e-commerce distribution centers.",
        benefits: [
          "Precision width and thickness tolerances prevent strapping machine jams",
          "100% virgin PP polymer creates clean, high-strength heat-weld joints",
          "Embossed surface texture provides positive grip on machine feed rollers",
          "High shock elasticity prevents carton damage during transit and handling"
],
        suitedFor: [
          "Semi-automatic table-top strapping machines",
          "Fully automatic arch strapping conveyor lines",
          "Corrugated carton & export box bundling",
          "Newspaper, magazine & printed paper batch strapping"
],
        notSuitedFor: [
          "Heavy 5-Ton steel coil securing (use Green PET or Steel strapping instead)"
],
        bulkPricing: [
          { minQty: 10, maxQty: 24, label: 'Factory Monthly Supply Pack' },
          { minQty: 25, maxQty: 49, label: 'Automated Line Project Lot' },
          { minQty: 50, label: 'Master OEM Wholesale Mandi Bale' },
        ],
        images: [
          { src: '/uploads/products/packaging-strapping/semi-automatic-machine-grade-pp-strapping-band-roll/semi-automatic-machine-pp-strapping-band-roll-karachi-view-1.jpg', alt: 'Semi-Automatic Machine Grade PP Strapping Band Roll view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/packaging-strapping/semi-automatic-machine-grade-pp-strapping-band-roll/semi-automatic-machine-pp-strapping-band-roll-karachi-category-packaging-strapping-overview.jpg', alt: 'Tahira Syndicate industrial packaging and strapping materials wholesale stock Bohrapir Karachi Pakistan', sortOrder: 2 },
        ],
        faqs: [
          {
                    "question": "What widths and core sizes are available for machine strapping?",
                    "answer": "We stock 9mm, 12mm, and 15mm widths on standard 200mm (8-inch) industrial paper cores that fit all standard semi-auto and automatic strapping machines."
          },
          {
                    "question": "Does this strapping work with heat-sealing machines without metal clips?",
                    "answer": "Yes, machine-grade PP strapping is formulated specifically for instant thermal and friction welding inside strapping machines without needing metal seals."
          }
],
        attrValues: [
          { attr: 'Material Type & Polymer Grade', val: 'High-Tensile Polypropylene (PP)' },
          { attr: 'Standard Width / Gauge Size', val: '12mm / 12.5mm (1/2 Inch)' },
          { attr: 'Operating Mode & Tool Compatibility', val: 'Semi-Automatic & Automatic Strapping Machine' },
          { attr: 'Industrial Application & Baling Duty', val: 'Carton Bundling & Corrugated Box Sealing' },
        ],
      },
      {
        name: 'High-Tensile Embossed PET (Polyester) Strapping Roll',
        sku: 'TS-PKG-PET-003',
        slug: 'high-tensile-embossed-pet-polyester-strapping-roll',
        price: 4500,
        moq: 3,
        "tradeAliases": "PET Patti • Green Polyester Strapping • Heavy Duty PET Band • Steel Strap Replacement • Polyester Patti",
        "shortDescription": "High-tensile green PET polyester strapping band. Replaces dangerous steel strapping with high retained tension and shock recovery for lumber, bricks, and heavy machinery pallets.",
        "longDescription": "Steel strapping rusts, stains valuable cargo, and has dangerous razor-sharp edges that injure warehouse laborers when snapped. Green PET (Polyester) Strapping is the modern, safe industrial alternative to steel. Extruded from high-strength polyester resin, PET strapping provides high tensile break strength with elastic memory — meaning if the pallet settles or shrinks in transit, the PET band contracts and stays tight without going slack.",
        "metaTitle": "Green PET Polyester Strapping Roll Karachi Wholesale Supply",
        "metaDescription": "High-tensile green PET polyester strapping bands in Karachi (12mm to 19mm). Safe, rust-free steel strapping replacement for bricks, lumber, and heavy pallets.",
        "usage": "Used for strapping concrete blocks, brick cubes, timber lumber, metal ingots, heavy appliance pallets, ceramic tiles, and export shipping containers.",
        "benefits": [
          "Superior retained tension — stays tight even if pallets settle during long highway trips",
          "Zero rust — will not leave ugly rust stains on export goods and building stone",
          "Smooth, safe edges eliminate the severe cuts and hand injuries caused by steel bands",
          "High shock absorption recovers from heavy forklift bumps without snapping"
],
        "suitedFor": [
          "Battery-powered friction-weld strapping tools",
          "Pneumatic & manual heavy-duty PET tensioners",
          "Concrete block & brick cube pallet strapping",
          "Timber, lumber & aluminum extrusion bundling"
],
        "notSuitedFor": [
          "Lightweight paper cartons where light PP machine strap is sufficient"
],
        bulkPricing: [
          { minQty: 6, maxQty: 19, label: 'Export Contractor Starter Pack' },
          { minQty: 20, maxQty: 49, label: 'Industrial Palletizing Lot' },
          { minQty: 50, label: 'Heavy Industry Master Bale' },
        ],
        images: [
          { src: '/uploads/products/packaging-strapping/high-tensile-embossed-pet-polyester-strapping-roll/high-tensile-embossed-pet-polyester-strapping-roll-karachi-view-1.jpg', alt: 'High-Tensile Embossed PET Strapping Roll view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/packaging-strapping/high-tensile-embossed-pet-polyester-strapping-roll/high-tensile-embossed-pet-polyester-strapping-roll-karachi-view-2.jpg', alt: 'High-Tensile Embossed PET Strapping Roll view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/packaging-strapping/high-tensile-embossed-pet-polyester-strapping-roll/high-tensile-embossed-pet-polyester-strapping-roll-karachi-category-packaging-strapping-overview.jpg', alt: 'Tahira Syndicate industrial packaging and strapping materials wholesale stock Bohrapir Karachi Pakistan', sortOrder: 3 },
        ],
        "faqs": [
          {
                    "question": "Can PET strapping replace steel strapping on heavy pallet loads?",
                    "answer": "Yes! High-tensile 16mm and 19mm PET strapping matches the effective breaking strength of steel strap while offering superior shock elasticity, zero rust, and much safer handling for workers."
          },
          {
                    "question": "What tools are used to seal PET strapping?",
                    "answer": "PET strapping can be sealed using battery-powered friction welding tools (which weld without clips) or manual heavy-duty PET tensioners with serrated steel clips."
          }
],
        attrValues: [
          { attr: 'Material Type & Polymer Grade', val: 'Oriented PET (Polyester)' },
          { attr: 'Standard Width / Gauge Size', val: '15mm / 15.5mm (5/8 Inch)' },
          { attr: 'Operating Mode & Tool Compatibility', val: 'Battery Powered Friction Welder / Heavy Sealer' },
          { attr: 'Industrial Application & Baling Duty', val: 'Heavy Pallet & Machinery Stabilization' },
        ],
      },
      {
        name: 'Industrial Clear & Brown BOPP Carton Packaging Tape Roll',
        sku: 'TS-PKG-BOP-004',
        slug: 'industrial-clear-brown-bopp-carton-packaging-tape-roll',
        price: 180,
        moq: 36,
        tradeAliases: "Packaging Tape • Brown Tape Roll • Clear Packing Tape • BOPP Tape • Carton Sealing Tape • Khaki Tape",
        shortDescription: "Industrial-grade BOPP adhesive carton sealing tape (48mm & 72mm) in Clear and Brown. Strong pressure-sensitive acrylic glue sticks instantly to recycled corrugated cartons.",
        longDescription: "Corrugated cartons opening during warehouse handling or shipping transit leads to product damage and pilferage. Our Industrial BOPP Carton Sealing Tape uses a biaxially oriented polypropylene film coated with high-tack water-based acrylic adhesive. It bonds instantly to single-wall and double-wall kraft cartons, resists humid coastal weather, and will not peel off or turn yellow during prolonged warehouse storage.",
        metaTitle: "Industrial BOPP Packaging Tape Roll Karachi Wholesale",
        metaDescription: "Heavy-duty BOPP carton packaging tape rolls (Clear & Brown) in Karachi (48mm & 72mm). High-tack adhesive tape for secure export box sealing.",
        usage: "Universal standard for corrugated carton sealing, export box packaging, e-commerce parcel packing, and bundling across wholesale commercial hubs.",
        benefits: [
          "High-tack acrylic adhesive creates a permanent seal on recycled kraft boxes",
          "Strong BOPP film resists stretching and snapping inside manual tape dispensers",
          "Weather-resistant adhesive will not dry out, peel, or yellow in coastal humidity",
          "Available in standard 48mm (2-inch) and wide 72mm (3-inch) master rolls"
],
        suitedFor: [
          "Manual handheld tape gun carton taping",
          "Automatic case sealer conveyor machines",
          "E-commerce & retail courier box sealing",
          "Master export corrugated carton packaging"
],
        notSuitedFor: [
          "High-temperature baking oven masking (use specialized crepe paper masking tape instead)"
],
        bulkPricing: [
          { minQty: 72, maxQty: 215, label: 'Carton Sealing Starter Carton (2-6 Cartons)' },
          { minQty: 216, maxQty: 719, label: 'Commercial Warehouse Wholesale Pack' },
          { minQty: 720, label: 'Industrial Manufacturer Master Lot' },
        ],
        images: [
          { src: '/uploads/products/packaging-strapping/industrial-clear-brown-bopp-carton-packaging-tape-roll/industrial-clear-brown-bopp-carton-packaging-tape-roll-karachi-view-1.jpg', alt: 'Industrial Clear Brown BOPP Carton Packaging Tape Roll view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/packaging-strapping/industrial-clear-brown-bopp-carton-packaging-tape-roll/industrial-clear-brown-bopp-carton-packaging-tape-roll-karachi-view-2.jpg', alt: 'Industrial Clear Brown BOPP Carton Packaging Tape Roll view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/packaging-strapping/industrial-clear-brown-bopp-carton-packaging-tape-roll/industrial-clear-brown-bopp-carton-packaging-tape-roll-karachi-view-3.jpg', alt: 'Industrial Clear Brown BOPP Carton Packaging Tape Roll view 3 Karachi', sortOrder: 3 },
          { src: '/uploads/products/packaging-strapping/industrial-clear-brown-bopp-carton-packaging-tape-roll/industrial-clear-brown-bopp-carton-packaging-tape-roll-karachi-view-4.jpg', alt: 'Industrial Clear Brown BOPP Carton Packaging Tape Roll view 4 Karachi', sortOrder: 4 },
          { src: '/uploads/products/packaging-strapping/industrial-clear-brown-bopp-carton-packaging-tape-roll/industrial-clear-brown-bopp-carton-packaging-tape-roll-karachi-category-packaging-strapping-overview.jpg', alt: 'Tahira Syndicate industrial packaging and strapping materials wholesale stock Bohrapir Karachi Pakistan', sortOrder: 5 },
        ],
        faqs: [
          {
                    "question": "What lengths and widths are stocked in BOPP packaging tape?",
                    "answer": "We supply 48mm (2-inch) and 72mm (3-inch) tape in standard 60-yard, 100-yard, and 500-yard industrial machine rolls in Clear, Brown (Khaki), and custom printed logos."
          },
          {
                    "question": "Does this tape adhere well to recycled corrugated boxes?",
                    "answer": "Yes, our premium acrylic adhesive is formulated with higher initial tack specifically to penetrate and stick firmly to high-recycled content kraft liners."
          }
],
        attrValues: [
          { attr: 'Material Type & Polymer Grade', val: 'BOPP Film + Acrylic Adhesive' },
          { attr: 'Standard Width / Gauge Size', val: '48mm (2 Inch)' },
          { attr: 'Operating Mode & Tool Compatibility', val: 'Manual Tape Gun & Carton Sealer Line' },
          { attr: 'Industrial Application & Baling Duty', val: 'Carton Bundling & Corrugated Box Sealing' },
        ],
      },
      {
        name: 'Heavy-Duty Woven Cotton & Nylon Niwar Strapping Roll',
        sku: 'TS-PKG-NIW-005',
        slug: 'heavy-duty-woven-cotton-nylon-niwar-strapping-roll',
        price: 850,
        moq: 10,
        tradeAliases: "Cotton Niwar • Nylon Niwar • Charpai Patti • Heavy Woven Webbing • Bed Niwar Roll • Niwar Patti",
        shortDescription: "Heavy-duty woven cotton and nylon niwar webbing (38mm to 75mm). High strength, non-elastic, and comfortable for charpai beds, folding chairs, and cargo bundling.",
        longDescription: "Traditional charpai beds, folding camp cots, and furniture webbing need high-tensile niwar that does not stretch out or sag over time. Our Heavy-Duty Woven Niwar is tightly woven from pure cotton and high-strength synthetic yarns with dense edge selvedges. It provides firm, non-elastic support, holds up under heavy daily body weight, and is easy to nail, rivet, or weave onto wooden and metal furniture frames.",
        metaTitle: "Cotton & Nylon Niwar Strapping Roll Karachi Wholesale",
        metaDescription: "Heavy-duty woven cotton and nylon niwar rolls (38mm to 75mm) in Karachi. Non-sagging furniture webbing for charpai beds, folding chairs, and industrial lashing.",
        usage: "Used for weaving charpai beds, folding camp cots, patio furniture seating, heavy cotton bale tying, tarpaulin edge reinforcement, and industrial bundle lashing.",
        benefits: [
          "Dense woven structure prevents sagging and loose body hollows in furniture",
          "Reinforced selvedge borders resist fraying along the edges during tight weaving",
          "Soft, breathable natural cotton yarns provide cool comfort in summer heat",
          "Available in continuous 10kg and 20kg master coils for furniture makers"
],
        suitedFor: [
          "Traditional charpai bed & wooden furniture weaving",
          "Folding camp cot & lawn chair repair",
          "Textile fabric bale & cotton roll binding",
          "Heavy cargo lashing & tarpaulin edge reinforcement"
],
        notSuitedFor: [
          "Certified crane hoisting (use Duplex Webbing Slings for crane lifts)"
],
        bulkPricing: [
          { minQty: 20, maxQty: 49, label: 'Transport Depot Starter Lot' },
          { minQty: 50, maxQty: 149, label: 'Furniture & Hardware Mandi Pack' },
          { minQty: 150, label: 'Master Industrial Webbing Bale' },
        ],
        images: [
          { src: '/uploads/products/packaging-strapping/heavy-duty-woven-cotton-nylon-niwar-strapping-roll/heavy-duty-woven-cotton-nylon-niwar-strapping-roll-karachi-view-1.jpg', alt: 'Heavy-Duty Woven Cotton Nylon Niwar Strapping Roll view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/packaging-strapping/heavy-duty-woven-cotton-nylon-niwar-strapping-roll/heavy-duty-woven-cotton-nylon-niwar-strapping-roll-karachi-view-2.jpg', alt: 'Heavy-Duty Woven Cotton Nylon Niwar Strapping Roll view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/packaging-strapping/heavy-duty-woven-cotton-nylon-niwar-strapping-roll/heavy-duty-woven-cotton-nylon-niwar-strapping-roll-karachi-view-3.jpg', alt: 'Heavy-Duty Woven Cotton Nylon Niwar Strapping Roll view 3 Karachi', sortOrder: 3 },
          { src: '/uploads/products/packaging-strapping/heavy-duty-woven-cotton-nylon-niwar-strapping-roll/heavy-duty-woven-cotton-nylon-niwar-strapping-roll-karachi-view-4.jpg', alt: 'Heavy-Duty Woven Cotton Nylon Niwar Strapping Roll view 4 Karachi', sortOrder: 4 },
          { src: '/uploads/products/packaging-strapping/heavy-duty-woven-cotton-nylon-niwar-strapping-roll/heavy-duty-woven-cotton-nylon-niwar-strapping-roll-karachi-category-packaging-strapping-overview.jpg', alt: 'Tahira Syndicate industrial packaging and strapping materials wholesale stock Bohrapir Karachi Pakistan', sortOrder: 5 },
        ],
        faqs: [
          {
                    "question": "What widths and colors are available in Niwar rolls?",
                    "answer": "We stock Niwar in 1.5\" (38mm), 2\" (50mm), 2.5\" (65mm), and 3\" (75mm) widths in Natural White, Grey, Striped, Red, Blue, and Green colors."
          },
          {
                    "question": "Is this niwar 100% cotton or blended with synthetic fibers?",
                    "answer": "We manufacture both 100% pure cotton traditional niwar and heavy nylon-reinforced synthetic niwar for maximum break strength."
          }
],
        attrValues: [
          { attr: 'Material Type & Polymer Grade', val: 'Woven Cotton & Nylon' },
          { attr: 'Standard Width / Gauge Size', val: '25mm - 75mm (1 to 3 Inch Webbing)' },
          { attr: 'Operating Mode & Tool Compatibility', val: 'Manual Webbing Tie-Down & Knotting' },
          { attr: 'Industrial Application & Baling Duty', val: 'Truck Tie-Down & Furniture Webbing' },
        ],
      },
      {
        name: 'Heavy Galvanized Metal Strapping Seals, Clips & Patti Kundi',
        sku: 'TS-PKG-MET-006',
        slug: 'heavy-galvanized-metal-strapping-seals-clips-patti-kundi',
        price: 1500,
        moq: 5,
        "tradeAliases": "Metal Patti Kundi • Strapping Clips • Pusher Seals • Open Flange Seals • Serrated PET Clips • Steel Clips",
        "shortDescription": "Heavy-duty galvanized steel strapping seals and clips (Patti Kundi) for 12mm–19mm PP, PET, and steel strapping bands. Delivers 100% crimp joint security without slippage.",
        "longDescription": "Even the strongest strapping band fails if the joint seal slips under tension. Our Heavy Galvanized Metal Strapping Clips (Patti Kundi) are stamped from cold-rolled galvanized steel. Available in open snap-on style for manual PP strapping and deeply serrated grip style for high-tensile PET strapping, these seals bite into the plastic band when crimped with a sealer tool, delivering up to 90% of the band break strength with zero joint slip.",
        "metaTitle": "Metal Strapping Seals & Clips (Patti Kundi) Karachi Supply",
        "metaDescription": "Heavy galvanized steel strapping seals and clips (Patti Kundi) in Karachi (12mm to 19mm) for manual PP, PET, and steel strapping tools and crimpers.",
        "usage": "Essential for crimping manual PP strapping, high-tensile green PET strapping, and heavy steel packing patti on export cartons, wooden crates, and brick pallets.",
        "benefits": [
          "Heavy galvanized steel construction prevents rust and corrosion in storage",
          "Serrated internal teeth bite firmly into PET strap to eliminate joint slippage",
          "Open-flange design allows quick placement over pre-tensioned strapping bands",
          "Provides high joint efficiency matching the breaking strength of the strapping band"
],
        "suitedFor": [
          "Manual strapping crimper & sealer tool operations",
          "PP manual hand strapping (smooth/semi-open clips)",
          "High-tensile PET polyester strapping (heavy serrated clips)",
          "Wooden crate & export carton joint locking"
],
        "notSuitedFor": [
          "Automatic friction-welding strapping machines (which weld plastic without metal clips)"
],
        bulkPricing: [
          { minQty: 10, maxQty: 29, label: 'Warehouse Seal Starter Pack (1,000 pcs/box)' },
          { minQty: 30, maxQty: 99, label: 'Commercial Packaging Lot' },
          { minQty: 100, label: 'Master Mandi Burlap Sack (5,000 pcs)' },
        ],
        images: [
          { src: '/uploads/products/packaging-strapping/heavy-galvanized-metal-strapping-seals-clips-patti-kundi/heavy-galvanized-metal-strapping-seals-clips-patti-kundi-karachi-view-1.jpg', alt: 'Heavy Galvanized Metal Strapping Seals Clips Patti Kundi view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/packaging-strapping/heavy-galvanized-metal-strapping-seals-clips-patti-kundi/heavy-galvanized-metal-strapping-seals-clips-patti-kundi-karachi-view-2.jpg', alt: 'Heavy Galvanized Metal Strapping Seals Clips Patti Kundi view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/packaging-strapping/heavy-galvanized-metal-strapping-seals-clips-patti-kundi/heavy-galvanized-metal-strapping-seals-clips-patti-kundi-karachi-category-packaging-strapping-overview.jpg', alt: 'Tahira Syndicate industrial packaging and strapping materials wholesale stock Bohrapir Karachi Pakistan', sortOrder: 3 },
        ],
        "faqs": [
          {
                    "question": "What is the difference between smooth PP clips and serrated PET clips?",
                    "answer": "Smooth clips are designed for softer PP strapping. Serrated clips have internal diamond teeth that bite through the hard, glossy surface of PET strapping to prevent slipping under high tension."
          },
          {
                    "question": "What sizes are available in metal strapping clips?",
                    "answer": "We stock standard 1/2\" (12mm), 5/8\" (16mm), and 3/4\" (19mm) metal seals packed in 1,000-piece cartons and bulk wholesale sacks."
          }
],
        attrValues: [
          { attr: 'Material Type & Polymer Grade', val: 'Galvanized Cold-Rolled Steel (CRCA)' },
          { attr: 'Standard Width / Gauge Size', val: '12mm / 12.5mm (1/2 Inch)' },
          { attr: 'Operating Mode & Tool Compatibility', val: 'Manual Tensioner & Crimping Sealer' },
          { attr: 'Industrial Application & Baling Duty', val: 'Carton Bundling & Corrugated Box Sealing' },
        ],
      },
    ]

    for (const prodData of pkgProducts) {
      const product = await prisma.product.upsert({
        where: { slug: prodData.slug },
        update: {
          name: prodData.name,
          sku: prodData.sku,
          price: prodData.price,
          moq: prodData.moq,
          status: 'Active',
          seoStatus: 'Complete',
          categoryId: pkgCat.id,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
        create: {
          name: prodData.name,
          sku: prodData.sku,
          slug: prodData.slug,
          price: prodData.price,
          moq: prodData.moq,
          status: 'Active',
          seoStatus: 'Complete',
          categoryId: pkgCat.id,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
      })

      await prisma.productImage.deleteMany({ where: { productId: product.id } })
      for (const img of prodData.images) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            src: img.src,
            alt: img.alt,
            sortOrder: img.sortOrder,
          },
        })
      }

      await prisma.productFaq.deleteMany({ where: { productId: product.id } })
      for (let fIdx = 0; fIdx < prodData.faqs.length; fIdx++) {
        const faq = prodData.faqs[fIdx]
        await prisma.productFaq.create({
          data: {
            productId: product.id,
            question: faq.question,
            answer: faq.answer,
            sortOrder: fIdx + 1,
          },
        })
      }

      await prisma.productAttributeValue.deleteMany({ where: { productId: product.id } })
      for (const av of prodData.attrValues) {
        const attrId = pkgAttributeMap.get(av.attr)
        if (attrId) {
          await prisma.productAttributeValue.create({
            data: {
              productId: product.id,
              attributeId: attrId,
              value: av.val,
            },
          })
        }
      }
      console.log(`✅ Seeded product: ${product.name} (${product.sku})`)
    }
  }

  // 11. Seed Nets & Netting Category
  {
    console.log('Seeding Category: Nets & Netting...')
    const netsCat = await prisma.category.upsert({
      where: { slug: 'nets' },
      update: {
        name: 'Nets & Netting',
        image: '/uploads/categories/nets.jpeg',
        status: 'Active',
        metaTitle: 'Wholesale Nets & Netting Supplier Karachi | Tahira Syndicate',
        metaDescription: 'Supplier of agricultural shade nets (hara parda), construction safety nets, anti-bird netting, cricket turf nets & fishing nets in Karachi, Pakistan.',
        description: 'Tahira Syndicate is a master wholesale distributor and fabricator of industrial, agricultural, and commercial netting in Karachi. Dispatched directly from our Bohrapir warehouse and SITE Area rigging yard, our inventory covers UV-stabilized green and multi-color shade nets (hara parda) for nurseries and car parking, certified fall-arrest construction safety nets (scaffolding jaal), translucent anti-bird pigeon netting, heavy-ply cricket practice and futsal turf nets, knotted marine fishing nets for deep-sea trawlers, and heavy synthetic cargo containment nets for transport trucks. All nets are available in standard factory rolls (2m to 6m widths) or custom-fabricated dimensions with reinforced border ropes and brass tie grommets.',
      },
      create: {
        name: 'Nets & Netting',
        slug: 'nets',
        image: '/uploads/categories/nets.jpeg',
        status: 'Active',
        metaTitle: 'Wholesale Nets & Netting Supplier Karachi | Tahira Syndicate',
        metaDescription: 'Supplier of agricultural shade nets (hara parda), construction safety nets, anti-bird netting, cricket turf nets & fishing nets in Karachi, Pakistan.',
        description: 'Tahira Syndicate is a master wholesale distributor and fabricator of industrial, agricultural, and commercial netting in Karachi. Dispatched directly from our Bohrapir warehouse and SITE Area rigging yard, our inventory covers UV-stabilized green and multi-color shade nets (hara parda) for nurseries and car parking, certified fall-arrest construction safety nets (scaffolding jaal), translucent anti-bird pigeon netting, heavy-ply cricket practice and futsal turf nets, knotted marine fishing nets for deep-sea trawlers, and heavy synthetic cargo containment nets for transport trucks. All nets are available in standard factory rolls (2m to 6m widths) or custom-fabricated dimensions with reinforced border ropes and brass tie grommets.',
      },
    })

    const netsAttributes = [
      {
        name: 'Netting Material Composition',
        type: 'Select' as const,
        options: ['100% Virgin HDPE (High-Density Polyethylene)', 'High-Tenacity Knotted Polyamide Nylon', 'Twisted Polypropylene (PP)', 'Braided Polyester Core', 'UV-Stabilized Monofilament'],
      },
      {
        name: 'Mesh Aperture & Hole Size',
        type: 'Select' as const,
        options: ['Micro-Mesh Knitted (Agro Shade)', '15mm (Anti-Bird / Pigeon)', '25mm (Debris Containment)', '45mm (Sports / Box Cricket)', '50mm (Cargo Containment)', '75mm (Truck Daala)', '100mm (Fall Arrest Safety Net)'],
      },
      {
        name: 'Shade / Sun Block Density',
        type: 'Select' as const,
        options: ['50% Sunlight Block (Agricultural Nursery)', '75% Sunlight Block (Standard Agro / Roof)', '90% Extreme Heat Block (Commercial / Parking)', 'Non-Shade Open Mesh'],
      },
      {
        name: 'Border Reinforcement & Rigging',
        type: 'Select' as const,
        options: ['Heat-Cut Clean Edge', 'Heavy 8mm–12mm Border Rope with Corner Loops', 'Webbing Tape Reinforced with Brass Eyelets', 'Double-Knotted Knotted Selvage'],
      },
    ]

    const netsAttributeMap = new Map<string, number>()
    for (let i = 0; i < netsAttributes.length; i++) {
      const aData = netsAttributes[i]
      let attr = await prisma.attribute.findFirst({ where: { name: aData.name } })
      if (!attr) {
        attr = await prisma.attribute.create({
          data: {
            name: aData.name,
            type: aData.type,
            options: aData.options,
            status: 'Active',
            required: false,
          },
        })
      }
      netsAttributeMap.set(aData.name, attr.id)

      await prisma.categoryAttribute.upsert({
        where: {
          categoryId_attributeId: {
            categoryId: netsCat.id,
            attributeId: attr.id,
          },
        },
        update: { sortOrder: i + 1 },
        create: {
          categoryId: netsCat.id,
          attributeId: attr.id,
          sortOrder: i + 1,
        },
      })
    }

    const netsProducts = [
      {
        name: 'Agricultural Green Shade Net',
        sku: 'TS-NET-SHD-001',
        slug: 'agricultural-green-shade-net',
        price: 5200,
        moq: 1,
        "tradeAliases": "Hara Parda • Green Agro Net • Greenhouse Shade Jaal • Chhat Ki Jali • Nursery Shade Sheet • 75% 90% Hara Jaal",
        "shortDescription": "Knitted 100% virgin HDPE green shade net (Hara Parda) in 50%, 75%, and 90% density. Lowers temperature by 5°C to 10°C, protects crops from burning sun, and cools rooftop lawns.",
        "longDescription": "Summer temperatures in Karachi, Sindh, and Punjab can easily exceed 45°C, burning delicate plant leaves, drying out nursery saplings, and turning rooftop terraces into ovens. Our Green Agro Shade Net (Hara Parda) is knitted from UV-stabilized virgin HDPE monofilament and tape yarns with lock-stitch technology that won’t fray when cut. Available in 50% and 75% for plant growth, and 90% for car parking sheds and rooftop patio cooling.",
        "metaTitle": "Agricultural Green Shade Net (Hara Parda) Karachi Wholesale",
        "metaDescription": "UV-stabilized agricultural green shade nets (Hara Parda) in Karachi. 50%, 75%, 90% sun block rolls for nurseries, rooftop cooling, and greenhouse farming.",
        "usage": "Widely installed over commercial plant nurseries, vegetable farm polyhouses, poultry and dairy shed heat shielding, car parking structures, and rooftop terrace lawns.",
        "benefits": [
          "Lowers ambient temperature by 5°C to 10°C while allowing natural breeze to pass",
          "UV-stabilized virgin HDPE resists sun degradation and brittle snapping for 5+ years",
          "Lock-stitch knitted construction allows custom cutting without unraveling",
          "Diffuses harsh direct sunlight into gentle, uniform growth light for crops"
],
        "suitedFor": [
          "Commercial plant nurseries & greenhouse polyhouses",
          "Vegetable crop sun & hail protection (tomatoes, chilies, herbs)",
          "Dairy farm & poultry shed roof heat insulation",
          "Residential rooftop lawns, patios & car parking sheds"
],
        "notSuitedFor": [
          "Structural fall-arrest safety nets for heavy construction workers"
],
        bulkPricing: [
          { minQty: 3, maxQty: 9, label: 'Nursery Starter Lot (50m roll)' },
          { minQty: 10, maxQty: 24, label: 'Commercial Farm Package' },
          { minQty: 25, label: 'Master Agriculture Mandi Bale' },
        ],
        images: [
          { src: '/uploads/products/nets/agricultural-green-shade-net/agricultural-green-shade-net-karachi-view-1.jpg', alt: 'Agricultural Green Shade Net view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/nets/agricultural-green-shade-net/agricultural-green-shade-net-karachi-view-2.jpg', alt: 'Agricultural Green Shade Net view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/nets/agricultural-green-shade-net/agricultural-green-shade-net-karachi-view-3.jpg', alt: 'Agricultural Green Shade Net view 3 Karachi', sortOrder: 3 },
          { src: '/uploads/products/nets/agricultural-green-shade-net/agricultural-green-shade-net-karachi-view-4.jpg', alt: 'Agricultural Green Shade Net view 4 Karachi', sortOrder: 4 },
          { src: '/uploads/products/nets/agricultural-green-shade-net/agricultural-green-shade-net-karachi-view-5.jpg', alt: 'Agricultural Green Shade Net and industrial netting bundle Bohrapir Karachi warehouse', sortOrder: 5 },
          { src: '/uploads/products/nets/agricultural-green-shade-net/agricultural-green-shade-net-karachi-category-nets-overview.jpg', alt: 'Tahira Syndicate wholesale agro shade nets and industrial netting warehouse stock Bohrapir Karachi Pakistan', sortOrder: 6 },
        ],
        "faqs": [
          {
                    "question": "Which shade percentage should I choose for plants versus rooftop lawns?",
                    "answer": "For plant nurseries, vegetables, and crops, 50% to 75% shade is recommended to provide optimal light for photosynthesis. For car parking sheds, outdoor seating, and rooftop lawns, 90% density gives maximum cooling and UV relief."
          },
          {
                    "question": "What are the standard factory roll dimensions for Hara Parda?",
                    "answer": "Standard rolls are 3 meters, 4 meters, 5 meters, and 6 meters wide by 50 meters long. We also stitch custom sheets with heavy black edge webbing and brass eyelets."
          }
],
        attrValues: [
          { attr: 'Netting Material Composition', val: '100% Virgin HDPE (High-Density Polyethylene)' },
          { attr: 'Mesh Aperture & Hole Size', val: 'Micro-Mesh Knitted (Agro Shade)' },
          { attr: 'Shade / Sun Block Density', val: '75% Sunlight Block (Standard Agro / Roof)' },
          { attr: 'Border Reinforcement & Rigging', val: 'Heat-Cut Clean Edge' },
        ],
      },
      {
        name: 'Commercial Colored Shade Net',
        sku: 'TS-NET-COL-002',
        slug: 'commercial-colored-shade-net',
        price: 6800,
        moq: 1,
        "tradeAliases": "Car Parking Shade Net • Tan Beige Netting • Blue Commercial Shade Net • Striped Canopy Net • School Ground Parda",
        "shortDescription": "High-density commercial colored shade netting in Beige, Deep Blue, Sand, and Desert Tan (90% UV block). Ideal for school grounds, restaurant terraces, and car parking sheds.",
        "longDescription": "Commercial architectural spaces, school assembly areas, and restaurant outdoor patios need effective sun protection that also looks clean and modern. Our Commercial Colored Shade Netting is knitted from premium UV-stabilized HDPE tape yarns in architectural colors including Desert Sand Beige, Deep Marine Blue, Forest Green, and Charcoal. It blocks up to 90% of harsh UV radiation and glare while letting cooling ocean breezes circulate freely.",
        "metaTitle": "Commercial Colored Shade Netting Karachi Wholesale Supply",
        "metaDescription": "Architectural colored shade nets in Sand Beige, Blue, and Green in Karachi. 90% UV blocking fabric for commercial car parking, school canopies, and cafes.",
        "usage": "Installed over commercial car parking lots, school sports grounds, swimming pool sun sails, cafe outdoor seating, resort decks, and architectural shade pergolas.",
        "benefits": [
          "90% UV and solar heat blockage creates cool, glare-free shaded environments",
          "Modern architectural colors (Beige, Blue, Sand, Charcoal) complement modern buildings",
          "Permeable knitted weave lets hot air rise and escape without trapping stuffy heat",
          "UV-stabilized formulation resists color fading and brittleness under intense sun"
],
        "suitedFor": [
          "Commercial building & hospital car parking canopies",
          "School assembly areas & playground shade canopies",
          "Restaurant outdoor dining terraces & cafe pergolas",
          "Swimming pool deck sun shade sails & resort patios"
],
        "notSuitedFor": [
          "Complete waterproof rain protection (use PVC Tarpaulin instead)"
],
        bulkPricing: [
          { minQty: 2, maxQty: 5, label: 'Contractor Starter Roll' },
          { minQty: 6, maxQty: 14, label: 'Commercial Canopy Project Lot' },
          { minQty: 15, label: 'Master Architectural Wholesaler Bale' },
        ],
        images: [
          { src: '/uploads/products/nets/commercial-colored-shade-net/commercial-colored-shade-net-karachi-view-1.jpg', alt: 'Commercial Colored Shade Net view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/nets/commercial-colored-shade-net/commercial-colored-shade-net-karachi-view-2.jpg', alt: 'Commercial Colored Shade Net view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/nets/commercial-colored-shade-net/commercial-colored-shade-net-karachi-view-3.jpg', alt: 'Commercial Colored Shade Net view 3 Karachi', sortOrder: 3 },
          { src: '/uploads/products/nets/commercial-colored-shade-net/commercial-colored-shade-net-karachi-view-4.jpg', alt: 'Commercial Colored Shade Net view 4 Karachi', sortOrder: 4 },
          { src: '/uploads/products/nets/commercial-colored-shade-net/commercial-colored-shade-net-karachi-view-5.jpg', alt: 'Commercial Colored Shade Net and industrial netting inventory Bohrapir Karachi warehouse', sortOrder: 5 },
          { src: '/uploads/products/nets/commercial-colored-shade-net/commercial-colored-shade-net-karachi-category-nets-overview.jpg', alt: 'Tahira Syndicate wholesale agro shade nets and industrial netting warehouse stock Bohrapir Karachi Pakistan', sortOrder: 6 },
        ],
        "faqs": [
          {
                    "question": "What colors are available in commercial shade netting?",
                    "answer": "We supply Desert Sand Beige, Deep Blue, Forest Green, Terracotta, and Black in full 50m rolls and custom stitched canopy sails."
          },
          {
                    "question": "Can you supply these nets stitched with border tape and eyelets?",
                    "answer": "Yes, we fabricate custom shade sails with heavy reinforced black border webbing, corner stainless steel D-rings, and heavy brass eyelets for easy cable rigging."
          }
],
        attrValues: [
          { attr: 'Netting Material Composition', val: '100% Virgin HDPE (High-Density Polyethylene)' },
          { attr: 'Mesh Aperture & Hole Size', val: 'Micro-Mesh Knitted (Agro Shade)' },
          { attr: 'Shade / Sun Block Density', val: '90% Extreme Heat Block (Commercial / Parking)' },
          { attr: 'Border Reinforcement & Rigging', val: 'Webbing Tape Reinforced with Brass Eyelets' },
        ],
      },
      {
        name: 'Construction Fall-Arrest Safety Net',
        sku: 'TS-NET-SAF-003',
        slug: 'construction-fall-arrest-safety-net',
        price: 8500,
        moq: 1,
        "tradeAliases": "Construction Safety Jaal • Fall Arrest Net • Scaffolding Debris Net • Building Safety Mesh • Dhalai Safety Net",
        "shortDescription": "Heavy-duty knotted polypropylene and nylon safety net (Safety Jaal) with 12mm–16mm border ropes. Certified for catching falling tools, scaffolding debris, and worker fall protection.",
        "longDescription": "High-rise building construction carries serious safety risks from falling workers, tools, plaster chips, and bricks that can injure laborers and pedestrians below. Our Construction Safety Net (Safety Jaal) is manufactured with high-tenacity knotted polyamide and polypropylene cordage (3mm to 6mm twine thickness) reinforced with heavy 12mm to 16mm perimeter tie ropes. It catches falling debris and cushions accidental worker falls with certified energy absorption.",
        "metaTitle": "Construction Fall-Arrest Safety Net (Safety Jaal) Karachi",
        "metaDescription": "Heavy-duty construction safety nets (Safety Jaal) in Karachi. Scaffolding debris mesh and certified worker fall-arrest nets with reinforced border tie ropes.",
        "usage": "Installed on exterior high-rise building scaffolding, elevator shafts, internal stairwell voids, bridge and flyover construction sites, and factory ceiling maintenance bays.",
        "benefits": [
          "Certified high-impact energy absorption catches falling debris and workers safely",
          "Reinforced with thick 12mm to 16mm perimeter boundary ropes for solid anchoring",
          "UV-stabilized polymer withstands harsh coastal Karachi sun and sea salt air",
          "Knotted square mesh design prevents tear propagation if individual strands are cut"
],
        "suitedFor": [
          "External high-rise building scaffolding debris containment",
          "Internal elevator shaft & stairwell void fall protection",
          "Bridge, flyover & highway cantilever safety netting",
          "Factory & warehouse overhead ceiling maintenance barriers"
],
        "notSuitedFor": [
          "Fine sand or liquid cement containment without an additional fine mesh liner layer"
],
        bulkPricing: [
          { minQty: 2, maxQty: 5, label: 'Civil Contractor Starter Set' },
          { minQty: 6, maxQty: 14, label: 'Tower Construction Package' },
          { minQty: 15, label: 'Master Contractor Mandi Bale' },
        ],
        images: [
          { src: '/uploads/products/nets/construction-fall-arrest-safety-net/construction-fall-arrest-safety-net-karachi-view-1.jpg', alt: 'Construction Fall Arrest Safety Net view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/nets/construction-fall-arrest-safety-net/construction-fall-arrest-safety-net-karachi-view-2.jpg', alt: 'Construction Fall Arrest Safety Net view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/nets/construction-fall-arrest-safety-net/construction-fall-arrest-safety-net-karachi-view-3.jpg', alt: 'Construction Fall Arrest Safety Net view 3 Karachi', sortOrder: 3 },
          { src: '/uploads/products/nets/construction-fall-arrest-safety-net/construction-fall-arrest-safety-net-karachi-view-4.jpg', alt: 'Construction Fall Arrest Safety Net view 4 Karachi', sortOrder: 4 },
          { src: '/uploads/products/nets/construction-fall-arrest-safety-net/construction-fall-arrest-safety-net-karachi-view-5.jpg', alt: 'Construction Fall Arrest Safety Net bundles and industrial rigging jaal Bohrapir Karachi warehouse', sortOrder: 5 },
          { src: '/uploads/products/nets/construction-fall-arrest-safety-net/construction-fall-arrest-safety-net-karachi-category-nets-overview.jpg', alt: 'Tahira Syndicate wholesale agro shade nets and industrial netting warehouse stock Bohrapir Karachi Pakistan', sortOrder: 6 },
        ],
        "faqs": [
          {
                    "question": "What is the standard mesh size for construction safety nets in Pakistan?",
                    "answer": "For scaffolding debris containment, 25mm × 25mm to 50mm × 50mm square mesh is standard. For heavy fall-arrest nets, 75mm to 100mm knotted mesh made with 4mm to 6mm high-tenacity cord is used."
          },
          {
                    "question": "Do you provide on-site installation rigging in Karachi?",
                    "answer": "Yes! Our trained rigging team handles complete on-site anchoring, guide wire stringing, and safety net installation across high-rise sites in Karachi and Sindh."
          }
],
        attrValues: [
          { attr: 'Netting Material Composition', val: 'High-Tenacity Knotted Polyamide Nylon' },
          { attr: 'Mesh Aperture & Hole Size', val: '100mm (Fall Arrest Safety Net)' },
          { attr: 'Shade / Sun Block Density', val: 'Non-Shade Open Mesh' },
          { attr: 'Border Reinforcement & Rigging', val: 'Heavy 8mm–12mm Border Rope with Corner Loops' },
        ],
      },
      {
        name: 'Anti-Bird & Pigeon Protection Net',
        sku: 'TS-NET-BRD-004',
        slug: 'anti-bird-pigeon-protection-net',
        price: 3800,
        moq: 1,
        "tradeAliases": "Kabootar Jaal • Anti-Bird Net • Pigeon Safety Net • Bird Spikes Mesh • Balcony Safety Net • Monofilament Bird Net",
        "shortDescription": "Discreet, high-transparency nylon monofilament anti-bird net (Kabootar Jaal). Keeps pigeons and birds off apartment balconies, AC ledges, and warehouse roofs without blocking light or air.",
        "longDescription": "Pigeons nesting on balcony railings, AC compressor ledges, and apartment duct shafts create foul odors, stained marble, and dangerous airborne bacteria. Our Anti-Bird Netting (Kabootar Jaal) is woven from ultra-thin, high-strength UV-stabilized nylon monofilament twine. It is virtually invisible from the ground, yet creates an impenetrable physical barrier that harmlessly bounces birds away without trapping or harming them, while keeping 95% of daylight and fresh breeze flowing.",
        "metaTitle": "Anti-Bird Pigeon Protection Net (Kabootar Jaal) Karachi",
        "metaDescription": "Discreet nylon anti-bird protection nets (Kabootar Jaal) in Karachi. Rust-proof stainless steel hook installation for apartment balconies and warehouse rafters.",
        "usage": "Installed on residential apartment balconies, building ventilation air shafts, AC compressor brackets, warehouse roof rafters, and commercial plaza architectural facades.",
        "benefits": [
          "High transparency monofilament mesh is virtually invisible from the ground",
          "Maintains 95% open ventilation and natural daylight in apartment balconies",
          "100% rust-proof installation with grade-304 stainless steel anchor hooks",
          "Humane bird exclusion — birds bounce off the taut net safely without getting hurt"
],
        "suitedFor": [
          "Residential apartment balconies & window ledges",
          "Building ventilation duct shafts & light wells",
          "Air conditioner outdoor unit compressor brackets",
          "Warehouse steel rafters & industrial factory ceilings"
],
        "notSuitedFor": [
          "Heavy industrial debris catching or human fall-arrest protection"
],
        bulkPricing: [
          { minQty: 3, maxQty: 9, label: 'Pest Control Contractor Pack' },
          { minQty: 10, maxQty: 24, label: 'Apartment Building Complex Lot' },
          { minQty: 25, label: 'Master Hardware Mandi Bale' },
        ],
        images: [
          { src: '/uploads/products/nets/anti-bird-pigeon-protection-net/anti-bird-pigeon-protection-net-karachi-view-1.jpg', alt: 'Anti Bird Pigeon Protection Net view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/nets/anti-bird-pigeon-protection-net/anti-bird-pigeon-protection-net-karachi-view-2.jpg', alt: 'Anti Bird Pigeon Protection Net view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/nets/anti-bird-pigeon-protection-net/anti-bird-pigeon-protection-net-karachi-view-3.jpg', alt: 'Anti Bird Pigeon Protection Net view 3 Karachi', sortOrder: 3 },
          { src: '/uploads/products/nets/anti-bird-pigeon-protection-net/anti-bird-pigeon-protection-net-karachi-view-4.jpg', alt: 'Anti Bird Pigeon Protection Net rolls and nylon netting stock Bohrapir Karachi warehouse', sortOrder: 4 },
          { src: '/uploads/products/nets/anti-bird-pigeon-protection-net/anti-bird-pigeon-protection-net-karachi-category-nets-overview.jpg', alt: 'Tahira Syndicate wholesale agro shade nets and industrial netting warehouse stock Bohrapir Karachi Pakistan', sortOrder: 5 },
        ],
        "faqs": [
          {
                    "question": "Will anti-bird netting block light or breeze in my balcony?",
                    "answer": "No. The thin monofilament twine has a 95% open area, allowing sunlight and natural coastal breeze to flow freely while keeping pigeons completely out."
          },
          {
                    "question": "What hardware is used for installation?",
                    "answer": "We use grade-304 stainless steel anchor hooks, coated wire rope, and brass ferrules to ensure the installation never rusts or stains your balcony tiles in Karachi humid air."
          }
],
        attrValues: [
          { attr: 'Netting Material Composition', val: 'UV-Stabilized Monofilament' },
          { attr: 'Mesh Aperture & Hole Size', val: '15mm (Anti-Bird / Pigeon)' },
          { attr: 'Shade / Sun Block Density', val: 'Non-Shade Open Mesh' },
          { attr: 'Border Reinforcement & Rigging', val: 'Double-Knotted Knotted Selvage' },
        ],
      },
      {
        name: 'Sports Pitch & Practice Net',
        sku: 'TS-NET-SPT-005',
        slug: 'sports-pitch-cricket-practice-net',
        price: 9500,
        moq: 1,
        "tradeAliases": "Cricket Net • Box Cricket Jaal • Futsal Turf Net • Football Goal Net • Sports Ground Netting • Golf Impact Net",
        "shortDescription": "Heavy-duty 18 to 48 ply braided nylon and HDPE sports netting (40mm mesh). Built to take 130+ km/h fast bowling cricket ball impacts for batting cages, futsal arenas, and goalposts.",
        "longDescription": "Hard leather cricket balls and fast football shots quickly rip through cheap, thin netting. That is why we weave 30 to 48 ply braided nylon and high-density HDPE sports nets with tight 40mm mesh and overlocked border ropes. We have rigged complete batting practice cages, box cricket arenas, and futsal turf grounds for top institutions like Karachi Grammar School and commercial rooftop arenas across Karachi.",
        "metaTitle": "Sports Pitch & Cricket Practice Net Karachi Wholesale Supply",
        "metaDescription": "Heavy-duty 18–48 ply braided sports nets for cricket practice pitches and futsal turf grounds in Karachi. Tested for hard leather cricket balls.",
        "usage": "Installed for cricket batting practice cages, commercial box cricket turf arenas, futsal pitch perimeter and ceiling nets, football goalposts, and sports hall divider curtains.",
        "benefits": [
          "Heavy 30 to 48-ply braided cordage handles 130+ km/h leather cricket ball strikes",
          "40mm tight square mesh prevents cricket and futsal balls from squeezing through",
          "100% waterproof and UV-stabilized — will not rot or weaken under outdoor rain and sun",
          "Overlocked 8mm–10mm perimeter boundary rope for easy suspension and tie-off"
],
        "suitedFor": [
          "Cricket batting practice tunnels & training cages",
          "Commercial box cricket & indoor sports arenas",
          "Futsal turf court perimeter & overhead ceiling nets",
          "School & college sports grounds and goalposts"
],
        "notSuitedFor": [
          "Heavy construction debris containment where certified safety jaal is required"
],
        bulkPricing: [
          { minQty: 2, maxQty: 5, label: 'Turf Arena Starter Bay' },
          { minQty: 6, maxQty: 14, label: 'Commercial Sports Facility Package' },
          { minQty: 15, label: 'Master Sports Mandi Bale' },
        ],
        images: [
          { src: '/uploads/products/nets/sports-pitch-cricket-practice-net/sports-pitch-cricket-practice-net-karachi-view-1.jpg', alt: 'Sports Pitch Cricket Practice Net view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/nets/sports-pitch-cricket-practice-net/sports-pitch-cricket-practice-net-karachi-view-2.jpg', alt: 'Sports Pitch Cricket Practice Net view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/nets/sports-pitch-cricket-practice-net/sports-pitch-cricket-practice-net-karachi-view-3.jpg', alt: 'Sports Pitch Cricket Practice Net view 3 Karachi', sortOrder: 3 },
          { src: '/uploads/products/nets/sports-pitch-cricket-practice-net/sports-pitch-cricket-practice-net-karachi-view-4.jpg', alt: 'Sports Pitch Cricket Practice Net rolls and high-impact nylon netting Bohrapir Karachi warehouse', sortOrder: 4 },
          { src: '/uploads/products/nets/sports-pitch-cricket-practice-net/sports-pitch-cricket-practice-net-karachi-category-nets-overview.jpg', alt: 'Tahira Syndicate wholesale agro shade nets and industrial netting warehouse stock Bohrapir Karachi Pakistan', sortOrder: 5 },
        ],
        "faqs": [
          {
                    "question": "What ply thickness is recommended for hard leather cricket ball cages?",
                    "answer": "We recommend 30-ply to 48-ply braided nylon or HDPE with a 40mm (1.5 inch) mesh size. This comfortably absorbs repeated strikes from fast bowlers without snapping."
          },
          {
                    "question": "Do you supply full cricket batting cage kits with steel pole frames?",
                    "answer": "Yes, we supply complete turnkey kits including steel support poles, overhead guide wire cables, snap hooks, and custom-tailored batting cage nets."
          }
],
        attrValues: [
          { attr: 'Netting Material Composition', val: 'High-Tenacity Knotted Polyamide Nylon' },
          { attr: 'Mesh Aperture & Hole Size', val: '45mm (Sports / Box Cricket)' },
          { attr: 'Shade / Sun Block Density', val: 'Non-Shade Open Mesh' },
          { attr: 'Border Reinforcement & Rigging', val: 'Heavy 8mm–12mm Border Rope with Corner Loops' },
        ],
      },
      {
        name: 'Commercial Marine & Fishing Net',
        sku: 'TS-NET-FSH-006',
        slug: 'marine-commercial-fishing-net',
        price: 7800,
        moq: 1,
        "tradeAliases": "Machli Ka Jaal • Fishing Net • Marine Trawl Net • Nylon Gill Net • Monofilament Fishing Mesh • Trawler Net",
        "shortDescription": "High-tenacity nylon and HDPE commercial fishing net (Machli Ka Jaal). Soft, knot-tight, and highly durable for marine trawlers, gill nets, cast nets, and aquaculture farms.",
        "longDescription": "Commercial fishing trawlers operating from Karachi Fish Harbour and deep-sea coastal waters need nets that combine high wet breaking strength with soft flexibility for smooth handling. Our Commercial Marine Fishing Netting (Machli Ka Jaal) is woven from high-tenacity nylon 6 monofilament and multifilament yarns with heat-set knots that will not slip under heavy fish loads. It resists abrasion against sandy sea beds and will not rot in salty ocean water.",
        "metaTitle": "Commercial Marine & Fishing Net (Machli Jaal) Karachi Supply",
        "metaDescription": "High-tenacity nylon and HDPE commercial fishing nets (Machli Ka Jaal) in Karachi. Knot-tight, saltwater-resistant mesh for trawlers, gill nets, and aquaculture.",
        "usage": "Used by commercial fishing trawlers for bottom trawling, surface gill netting, shrimp drag nets, cast nets, fish farm cages, and aquaculture pond barriers across coastal Pakistan.",
        "benefits": [
          "Heat-set double knots ensure mesh squares stay rigid and will not slip under heavy loads",
          "High wet breaking strength handles heavy marine fish and shrimp catches",
          "100% saltwater rot-proof and resistant to marine biological growth",
          "Soft and pliable — handles smoothly over trawler winches and power blocks"
],
        "suitedFor": [
          "Commercial marine fishing trawlers & shrimp boats",
          "Coastal gill netting & surface drift nets",
          "Fish farming & aquaculture pond predator exclusion",
          "Harbor barrier netting & seafood holding pens"
],
        "notSuitedFor": [
          "Direct contact with sharp sheet metal cutters or high heat sources"
],
        bulkPricing: [
          { minQty: 3, maxQty: 9, label: 'Harbour Fishermen Starter Pack' },
          { minQty: 10, maxQty: 24, label: 'Commercial Trawler Lot' },
          { minQty: 25, label: 'Master Marine Fisheries Mandi Bale' },
        ],
        images: [
          { src: '/uploads/products/nets/marine-commercial-fishing-net/marine-commercial-fishing-net-karachi-view-1.jpg', alt: 'Marine Commercial Fishing Net view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/nets/marine-commercial-fishing-net/marine-commercial-fishing-net-karachi-view-2.jpg', alt: 'Marine Commercial Fishing Net view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/nets/marine-commercial-fishing-net/marine-commercial-fishing-net-karachi-view-3.jpg', alt: 'Marine Commercial Fishing Net view 3 Karachi', sortOrder: 3 },
          { src: '/uploads/products/nets/marine-commercial-fishing-net/marine-commercial-fishing-net-karachi-view-4.jpg', alt: 'Commercial Marine and Fishing Net twine rolls and ocean trawler mesh Bohrapir Karachi warehouse', sortOrder: 4 },
          { src: '/uploads/products/nets/marine-commercial-fishing-net/marine-commercial-fishing-net-karachi-category-nets-overview.jpg', alt: 'Tahira Syndicate wholesale agro shade nets and industrial netting warehouse stock Bohrapir Karachi Pakistan', sortOrder: 5 },
        ],
        "faqs": [
          {
                    "question": "What mesh sizes and twine thicknesses are available in fishing nets?",
                    "answer": "We stock mesh sizes from 12mm up to 150mm in 0.20mm to 1.5mm monofilament and 210D/2 to 210D/48 multifilament nylon cordage."
          },
          {
                    "question": "Are the knots double-locked and heat-set?",
                    "answer": "Yes, all our marine nets undergo computerized thermal knot-setting so the mesh openings stay precise and never distort under tension."
          }
],
        attrValues: [
          { attr: 'Netting Material Composition', val: 'High-Tenacity Knotted Polyamide Nylon' },
          { attr: 'Mesh Aperture & Hole Size', val: '25mm (Debris Containment)' },
          { attr: 'Shade / Sun Block Density', val: 'Non-Shade Open Mesh' },
          { attr: 'Border Reinforcement & Rigging', val: 'Double-Knotted Knotted Selvage' },
        ],
      },
      {
        name: 'Cargo Containment & Truck Bed Net',
        sku: 'TS-NET-CAR-007',
        slug: 'cargo-truck-bed-containment-net',
        price: 12500,
        moq: 1,
        "tradeAliases": "Truck Daala Jaal • Cargo Lashing Net • Container Safety Net • Truck Bed Webbing Net • Daala Cover Net",
        "shortDescription": "Heavy-duty knotted nylon and polypropylene cargo containment net (Truck Daala Jaal) with 12mm border tie ropes. Keeps luggage, cartons, and scrap from falling off open truck beds.",
        "longDescription": "Transporting corrugated boxes, luggage, plastic goods, or scrap on open truck beds risks items blowing off or bouncing onto the highway, leading to fines and lost cargo. Our Cargo Containment Truck Bed Net (Truck Daala Jaal) is knotted from heavy 3mm–5mm braided polypropylene and nylon cordage with a thick 12mm perimeter rope and brass attachment hooks. It stretches firmly over irregular cargo heaps, locking the load securely onto the truck chassis.",
        "metaTitle": "Cargo Containment Truck Bed Net (Daala Jaal) Karachi Supply",
        "metaDescription": "Heavy-duty knotted cargo containment nets (Truck Daala Jaal) in Karachi. Secure open truck beds, pickups, and trailers from cargo spillage on highways.",
        "usage": "Fitted over open pickup truck beds, Mazda truck cargo daalas, flatbed trailers, waste recycling trucks, and airport luggage trolleys to prevent load spillage.",
        "benefits": [
          "Heavy knotted cordage holds irregular cargo heaps securely on open truck beds",
          "Thick 12mm perimeter tie rope allows fast, tight lashing to truck chassis hooks",
          "Prevents costly cargo loss, road littering fines, and highway traffic accidents",
          "UV-stabilized and rot-proof — handles all-weather road transit across Pakistan"
],
        "suitedFor": [
          "Mazda & Shehzore open truck bed (Daala) cargo securing",
          "Pickup truck & commercial delivery van luggage containment",
          "Waste recycling & scrap transport containment",
          "Flatbed trailer & shipping container open-top barrier nets"
],
        "notSuitedFor": [
          "Vertical overhead crane lifting where certified webbing slings must be used"
],
        bulkPricing: [
          { minQty: 2, maxQty: 4, label: 'Transport Operator Starter Net' },
          { minQty: 5, maxQty: 19, label: 'Commercial Fleet Lot' },
          { minQty: 20, label: 'Master Maripur Truck Stand Bale' },
        ],
        images: [
          { src: '/uploads/products/nets/cargo-truck-bed-containment-net/cargo-truck-bed-containment-net-karachi-view-1.jpg', alt: 'Cargo Truck Bed Containment Net view 1 Karachi', sortOrder: 1 },
          { src: '/uploads/products/nets/cargo-truck-bed-containment-net/cargo-truck-bed-containment-net-karachi-view-2.jpg', alt: 'Cargo Truck Bed Containment Net view 2 Karachi', sortOrder: 2 },
          { src: '/uploads/products/nets/cargo-truck-bed-containment-net/cargo-truck-bed-containment-net-karachi-view-3.jpg', alt: 'Cargo Truck Bed Containment Net view 3 Karachi', sortOrder: 3 },
          { src: '/uploads/products/nets/cargo-truck-bed-containment-net/cargo-truck-bed-containment-net-karachi-view-4.jpg', alt: 'Cargo Containment and Truck Bed Netting bundles and transit daala mesh Bohrapir Karachi warehouse', sortOrder: 4 },
          { src: '/uploads/products/nets/cargo-truck-bed-containment-net/cargo-truck-bed-containment-net-karachi-category-nets-overview.jpg', alt: 'Tahira Syndicate wholesale agro shade nets and industrial netting warehouse stock Bohrapir Karachi Pakistan', sortOrder: 5 },
        ],
        "faqs": [
          {
                    "question": "What sizes are standard for truck bed cargo nets in Pakistan?",
                    "answer": "Standard sizes include 10ft × 12ft for pickups, 14ft × 18ft for Shehzore/Mazda trucks, and 18ft × 30ft for 10-wheeler open truck daalas."
          },
          {
                    "question": "Does the net come with perimeter tie ropes?",
                    "answer": "Yes, every cargo net is fabricated with a continuous 12mm thick border tie rope and tie-off tails at all four corners for quick lashing to chassis hooks."
          }
],
        attrValues: [
          { attr: 'Netting Material Composition', val: 'Twisted Polypropylene (PP)' },
          { attr: 'Mesh Aperture & Hole Size', val: '75mm (Truck Daala)' },
          { attr: 'Shade / Sun Block Density', val: 'Non-Shade Open Mesh' },
          { attr: 'Border Reinforcement & Rigging', val: 'Heavy 8mm–12mm Border Rope with Corner Loops' },
        ],
      },
    ]

    for (const prodData of netsProducts) {
      const product = await prisma.product.upsert({
        where: { slug: prodData.slug },
        update: {
          name: prodData.name,
          sku: prodData.sku,
          price: prodData.price,
          moq: prodData.moq,
          status: 'Active',
          seoStatus: 'Complete',
          categoryId: netsCat.id,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
        create: {
          name: prodData.name,
          sku: prodData.sku,
          slug: prodData.slug,
          price: prodData.price,
          moq: prodData.moq,
          status: 'Active',
          seoStatus: 'Complete',
          categoryId: netsCat.id,
          metaTitle: prodData.metaTitle,
          metaDescription: prodData.metaDescription,
          shortDescription: prodData.shortDescription,
          longDescription: prodData.longDescription,
          tradeAliases: prodData.tradeAliases,
          usage: prodData.usage,
          benefits: prodData.benefits,
          suitedFor: prodData.suitedFor,
          notSuitedFor: prodData.notSuitedFor,
          bulkPricing: prodData.bulkPricing,
          relatedProductIds: [],
        },
      })

      await prisma.productImage.deleteMany({ where: { productId: product.id } })
      for (const img of prodData.images) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            src: img.src,
            alt: img.alt,
            sortOrder: img.sortOrder,
          },
        })
      }

      await prisma.productFaq.deleteMany({ where: { productId: product.id } })
      for (let fIdx = 0; fIdx < prodData.faqs.length; fIdx++) {
        const faq = prodData.faqs[fIdx]
        await prisma.productFaq.create({
          data: {
            productId: product.id,
            question: faq.question,
            answer: faq.answer,
            sortOrder: fIdx + 1,
          },
        })
      }

      await prisma.productAttributeValue.deleteMany({ where: { productId: product.id } })
      for (const av of prodData.attrValues) {
        const attrId = netsAttributeMap.get(av.attr)
        if (attrId) {
          await prisma.productAttributeValue.create({
            data: {
              productId: product.id,
              attributeId: attrId,
              value: av.val,
            },
          })
        }
      }
      console.log(`✅ Seeded product: ${product.name} (${product.sku})`)
    }
  }

  console.log('✅ CRM database ready with all products & categories.')
}

main().finally(() => prisma.$disconnect())

