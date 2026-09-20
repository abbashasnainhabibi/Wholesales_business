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
        "shortDescription": "Grade-A natural abaca fiber rope offering strong grip, high knot strength, and low stretch for marine rigging, cargo handling, and industrial lashing.",
        "longDescription": "Manila rope is twisted from natural abaca plant fibers. It is known for its firm grip, minimal stretch, and resistance to direct sunlight and saltwater. Unlike synthetic ropes, Manila does not melt from friction heat, making it a reliable traditional option for marine rigging, pilot ladder steps, gym climbing ropes, stage rigging, and cargo lashing.",
        "metaTitle": "Manila Natural Fiber Rope Wholesale Karachi & Global",
        "metaDescription": "Wholesale grade 3-strand Manila natural fiber ropes in Karachi, Pakistan. High tensile, marine and industrial grade, bulk coils for worldwide shipping.",
        "usage": "Manila rope is twisted from natural abaca plant fibers. It is known for its firm grip, minimal stretch, and resistance to direct sunlight and saltwater. Unlike synthetic ropes, Manila does not melt from friction heat, making it a reliable traditional option for marine rigging, pilot ladder steps, gym climbing ropes, stage rigging, and cargo lashing.",
        "benefits": [
            "High friction resistance and secure knot holding",
            "Does not melt under surface friction or contact heat",
            "Natural biodegradable abaca plant fiber construction",
            "Low elasticity for stable pulling and static lashing"
        ],
        "suitedFor": [
            "Marine rigging & deck work",
            "Pilot ladder steps & vessel gangways",
            "Tug & barge mooring lines",
            "Cargo lashing & transport binding",
            "Gym climbing & obstacle courses",
            "Architectural barrier ropes & construction ties"
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
        "shortDescription": "Lightweight, waterproof 3-strand polypropylene rope that floats on water and resists rot, moisture, and common chemicals.",
        "longDescription": "Our 3-strand twisted Polypropylene (PP) rope is a practical, all-purpose synthetic cordage. Because polypropylene has a low density, this rope floats on water and will not absorb moisture, rot, or swell. It offers dependable breaking strength and holds up well against acids, alkalis, and oils, making it widely used for boat mooring, truck cargo tying, construction site safety barriers, and agricultural netting.",
        "metaTitle": "PP 3-Strand Twisted Rope Wholesale Karachi & Pakistan",
        "metaDescription": "Premium polypropylene (PP) 3-strand twisted ropes in Karachi. Water-resistant, high tensile strength for industrial, marine, and commercial export packaging.",
        "usage": "Our 3-strand twisted Polypropylene (PP) rope is a practical, all-purpose synthetic cordage. Because polypropylene has a low density, this rope floats on water and will not absorb moisture, rot, or swell. It offers dependable breaking strength and holds up well against acids, alkalis, and oils, making it widely used for boat mooring, truck cargo tying, construction site safety barriers, and agricultural netting.",
        "benefits": [
            "Floats on water without absorbing moisture",
            "Resists rot, mildew, marine growth, and chemical corrosion",
            "Lightweight and easy to handle in wet conditions",
            "High tensile strength for transport and mooring work"
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
        "shortDescription": "Smooth braided synthetic cord with strong kink resistance and high wear strength for tarpaulins, awnings, blinds, and packaging.",
        "longDescription": "Dura Braided Rope is a tightly woven circular synthetic cord built for clean handling and flexibility. Unlike twisted ropes, solid braided cords do not untwist or kink under tension. They pass smoothly through eyelets, pulleys, and grommets, making Dura cord a practical choice for securing tarpaulins, rigging awnings and window blinds, flagpole lines, and industrial packaging.",
        "metaTitle": "Dura Braided Utility Rope Wholesale Pakistan & Export",
        "metaDescription": "Heavy-duty Dura braided utility ropes wholesale in Karachi. Superior knot retention, abrasion resistance, and flexible handling for logistics across Pakistan.",
        "usage": "Dura Braided Rope is a tightly woven circular synthetic cord built for clean handling and flexibility. Unlike twisted ropes, solid braided cords do not untwist or kink under tension. They pass smoothly through eyelets, pulleys, and grommets, making Dura cord a practical choice for securing tarpaulins, rigging awnings and window blinds, flagpole lines, and industrial packaging.",
        "benefits": [
            "Solid braided design that will not twist or kink",
            "Runs smoothly through pulleys, rings, and eyelets",
            "High surface abrasion resistance",
            "Holds knots firmly without unraveling at cut ends"
        ],
        "suitedFor": [
            "Tarpaulin grommet tie-downs",
            "Awning cords & window blinds",
            "Pulley lines & flagpole ropes",
            "Tent guy-lines & camping setups",
            "Commercial packaging & bundling"
        ],
        "notSuitedFor": [
            "Dynamic climbing safety systems requiring certified personal fall-arrest ratings"
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
                "question": "What is the advantage of Dura braided cord over twisted rope?",
                "answer": "Dura braided cord has a circular, smooth surface that will not hockle, untwist, or kink under load. It travels smoothly through pulleys and grommet rings with less surface friction."
            },
            {
                "question": "What diameters are available for Dura rope?",
                "answer": "Dura rope is stocked in diameters from 2mm, 3mm, 4mm, 5mm, 6mm, 8mm, 10mm, 12mm up to 36mm in continuous spools, reels, and bundles."
            },
            {
                "question": "Can Dura rope be heat-sealed at the ends?",
                "answer": "Yes, being composed of high-tenacity synthetic polymers, cut ends can be easily heat-sealed with a lighter or hot knife to prevent fraying."
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
        "tradeAliases": "Nylon Rassa • Polyamide Rope • High Tensile Nylon Rassi • Nylon Mooring Line",
        "shortDescription": "High-strength polyamide rope built for heavy shock absorption, high elasticity, and demanding towing, mooring, and industrial rigging.",
        "longDescription": "Nylon rope provides the highest breaking strength and elasticity among standard synthetic ropes. It can stretch under heavy dynamic load and return to its original length, absorbing sharp jerks and shocks that could snap other lines. Nylon stands up well against UV exposure, continuous abrasion, and surface friction, making it the industry standard for marine anchor lines, vessel towing, vehicle recovery, and general lifting applications.",
        "metaTitle": "Nylon Industrial Rope Wholesale Supplier in Karachi",
        "metaDescription": "High-tenacity nylon industrial ropes from Tahira Syndicate Karachi. Extreme shock absorption, UV resistance, and heavy lifting durability for global buyers.",
        "usage": "Nylon rope provides the highest breaking strength and elasticity among standard synthetic ropes. It can stretch under heavy dynamic load and return to its original length, absorbing sharp jerks and shocks that could snap other lines. Nylon stands up well against UV exposure, continuous abrasion, and surface friction, making it the industry standard for marine anchor lines, vessel towing, vehicle recovery, and general lifting applications.",
        "benefits": [
            "High breaking strength with built-in shock absorption",
            "Stretches under heavy dynamic load without snapping",
            "High resistance to UV rays and abrasive friction",
            "Flexible and easy to splice"
        ],
        "suitedFor": [
            "Marine anchor warps & dock mooring lines",
            "Boat towing & vessel recovery lines",
            "Vehicle recovery strops & winch lines",
            "Industrial safety lines & fall protection lanyards",
            "Heavy machinery cargo lashing"
        ],
        "notSuitedFor": [
            "Static survey applications requiring zero stretch under load"
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
                "question": "Why is Nylon rope preferred for towing and mooring lines?",
                "answer": "Nylon has natural elasticity (can stretch up to 20–25% under high shock loads) which absorbs sudden surges and wave impacts, protecting boat cleats and tow points from sudden shock fractures."
            },
            {
                "question": "What diameters of Nylon rope are available?",
                "answer": "We supply wholesale Nylon rope from 2mm to 36mm (including 6mm, 8mm, 10mm, 12mm, 14mm, 16mm, 18mm, 20mm, 24mm, 28mm, 32mm, and 36mm) in 100m, 200m, and 220m coils."
            },
            {
                "question": "Does Nylon rope lose strength when wet?",
                "answer": "Nylon experiences a slight temporary strength reduction of 10–15% when submerged in water, but regains its full rated tensile strength once dried."
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
        "shortDescription": "Stiff, biodegradable natural agave fiber rope with coarse texture, non-slip grip, and low stretch for agriculture and packaging.",
        "longDescription": "Sisal rope is manufactured from the leaf fibers of the agave plant. It has a pale blonde color and a rough, hairy texture that gives it great friction and knot-holding security. Sisal is fully biodegradable, environmentally friendly, and does not stretch excessively under load. It is widely used for agricultural baling, tree tying, warehouse bundling, scratch posts, and decorative boundary fencing.",
        "metaTitle": "Sisal Natural Fiber Rope Wholesale Karachi & Pakistan",
        "metaDescription": "Eco-friendly 3-strand sisal fiber ropes in Karachi. Biodegradable, non-slip grip, heavy-duty bundling and agricultural tying coils ready for bulk shipment.",
        "usage": "Sisal rope is manufactured from the leaf fibers of the agave plant. It has a pale blonde color and a rough, hairy texture that gives it great friction and knot-holding security. Sisal is fully biodegradable, environmentally friendly, and does not stretch excessively under load. It is widely used for agricultural baling, tree tying, warehouse bundling, scratch posts, and decorative boundary fencing.",
        "benefits": [
            "100% natural, biodegradable plant fiber",
            "Coarse texture provides non-slip grip and tight knot hold",
            "Minimal stretch under tension",
            "Safe for agricultural, animal, and landscaping use"
        ],
        "suitedFor": [
            "Agricultural baling & crop binding",
            "Warehouse parcel bundling & pallet tie-downs",
            "Pet scratching posts & cat trees",
            "Rustic interior decor & handicraft manufacturing",
            "Boundary barriers & landscape tree support"
        ],
        "notSuitedFor": [
            "Critical overhead life-support lifting where certified synthetic sling ropes are required"
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
                "question": "What makes Sisal rope suitable for cat scratch posts and pet furniture?",
                "answer": "Sisal is completely non-toxic, 100% natural, and has stiff, durable fibers that cats naturally love to scratch without exposing them to synthetic chemical toxins."
            },
            {
                "question": "What sizes of Sisal rope are available?",
                "answer": "We stock Sisal rope from thin 2mm, 3mm, 4mm, 6mm twines up to heavy 8mm, 10mm, 12mm, 14mm, 16mm, 18mm, 20mm, 24mm, 28mm, 32mm, and 36mm ropes in wholesale coils."
            },
            {
                "question": "Is Sisal rope biodegradable?",
                "answer": "Yes, Sisal is made entirely from renewable agave plant leaves and decomposes naturally in the soil, making it ideal for agricultural and gardening uses."
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
        "shortDescription": "Biodegradable natural golden jute twine and rope for industrial carton bundling, sack stitching, agriculture, and handicrafts.",
        "longDescription": "Jute twine and rope (commonly known as Patson or Sutli) are spun from natural jute fibers. It is an economical and environmentally sustainable cordage option. It is soft to work with by hand, ties firmly without slipping, and breaks down naturally in soil. Jute is widely used in warehouse carton packing, jute sack stitching, plant nursery tying, tobacco curing, and handicraft making.",
        "metaTitle": "Jute & Hessian Twine Rope Wholesale Karachi Pakistan",
        "metaDescription": "Natural jute and hessian twine ropes wholesale in Karachi. Biodegradable tying cords for agriculture, packaging, and industrial crafts at competitive rates.",
        "usage": "Jute twine and rope (commonly known as Patson or Sutli) are spun from natural jute fibers. It is an economical and environmentally sustainable cordage option. It is soft to work with by hand, ties firmly without slipping, and breaks down naturally in soil. Jute is widely used in warehouse carton packing, jute sack stitching, plant nursery tying, tobacco curing, and handicraft making.",
        "benefits": [
            "100% natural biodegradable golden jute fiber",
            "Soft on hands during fast manual tying",
            "Holds knots securely without slipping",
            "Cost-effective for high-volume commercial packaging"
        ],
        "suitedFor": [
            "Carton packaging & warehouse bundling",
            "Burlap sack stitching & bag closing",
            "Agricultural plant tying & nursery staking",
            "Craft manufacturing & macramé projects",
            "Tobacco leaf binding & parcel wrapping"
        ],
        "notSuitedFor": [
            "Continuous wet marine use or high-load industrial winching"
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
                "question": "What packaging sizes are available for Jute Sutli / Twine?",
                "answer": "We supply Jute twine in 250g, 500g, and 1kg balls/spools for retail or workstation use, as well as 20kg to 50kg bulk master bales for wholesale factory supply."
            },
            {
                "question": "What diameters are available in Jute rope?",
                "answer": "Jute is available as fine 2-ply and 3-ply twine (2mm–4mm) as well as thick 3-strand twisted rope from 6mm up to 20mm."
            },
            {
                "question": "Is Jute twine easy to cut and knot manually?",
                "answer": "Yes, Jute is soft on the hands, knots very tightly with high friction, and can be cut effortlessly with standard utility scissors or blades."
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
        "tradeAliases": "Sooti Rassa • Cotton Dori • Pure Cotton Rassi • White Cotton Cord",
        "shortDescription": "Soft, pliable 100% pure cotton twisted rope with zero synthetic irritants, gentle on hands, breathable, and easy to knot for domestic, craft, and commercial use.",
        "longDescription": "Pure Cotton Twisted Rope is made from 100% unbleached natural cotton fibers. It is soft, flexible, and comfortable to handle without causing rope burns or skin irritation. Cotton rope holds knots firmly, absorbs dyes easily, and does not generate static electricity. It is commonly used for macramé, textile crafts, awning cords, pet halters, clotheslines, and stage rigging.",
        "metaTitle": "Pure Cotton Twisted Rope Wholesale Karachi Pakistan",
        "metaDescription": "Pure cotton twisted ropes wholesale from Karachi, Pakistan. Soft-touch, high-strength natural cords for marine, textile, industrial, and decorative use.",
        "usage": "Pure Cotton Twisted Rope is made from 100% unbleached natural cotton fibers. It is soft, flexible, and comfortable to handle without causing rope burns or skin irritation. Cotton rope holds knots firmly, absorbs dyes easily, and does not generate static electricity. It is commonly used for macramé, textile crafts, awning cords, pet halters, clotheslines, and stage rigging.",
        "benefits": [
            "100% natural cotton fibers, soft and skin-friendly",
            "Easy to knot, unknot, and splice",
            "No synthetic irritants or static charge",
            "High liquid absorption and dye acceptance"
        ],
        "suitedFor": [
            "Macramé, wall hangings & textile crafts",
            "Animal halters & pet lead lines",
            "Domestic clotheslines & laundry ropes",
            "Drawstring bags & garment piping",
            "Interior decorative cordage & stage rigging"
        ],
        "notSuitedFor": [
            "Long-term outdoor exposure in damp conditions without drying"
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
                "question": "Is this cotton rope 100% pure natural cotton?",
                "answer": "Yes, our cotton ropes are twisted from 100% virgin natural cotton fibers without synthetic blends, giving a soft hand feel and excellent dye absorption."
            },
            {
                "question": "What diameters are available in Cotton rope?",
                "answer": "Diameters range from 2mm, 3mm, 4mm fine cordage up to 6mm, 8mm, 10mm, 12mm, 14mm, 16mm, 18mm, 20mm, and 25mm thick ropes in coils and spools."
            },
            {
                "question": "Can cotton rope be dyed?",
                "answer": "Yes, unbleached natural cotton fiber readily absorbs natural and synthetic textile dyes evenly."
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
        "tradeAliases": "Polyester Rassa • Terylene Rope • Low Stretch Marine Rope • PES Rigging Rope",
        "shortDescription": "High-strength, low-stretch synthetic rope offering strong resistance to UV rays, friction, and outdoor weather for marine halyards and safety lines.",
        "longDescription": "Polyester rope provides an effective balance of high tensile strength, UV stability, and low stretch. Unlike nylon, polyester maintains its full strength when wet and does not stiffen or shrink with water exposure. It offers solid resistance against friction and edge wear, making it a reliable choice for boat halyards, flagpole ropes, static safety lifelines, industrial winch lines, and shade structure rigging.",
        "metaTitle": "Polyester Industrial Rope Supplier Karachi Pakistan",
        "metaDescription": "Heavy-duty polyester industrial ropes from Karachi. Low-stretch, weather-proof, chemical-resistant performance for marine rigging and industrial operations.",
        "usage": "Polyester rope provides an effective balance of high tensile strength, UV stability, and low stretch. Unlike nylon, polyester maintains its full strength when wet and does not stiffen or shrink with water exposure. It offers solid resistance against friction and edge wear, making it a reliable choice for boat halyards, flagpole ropes, static safety lifelines, industrial winch lines, and shade structure rigging.",
        "benefits": [
            "Low elongation under load for precise positioning",
            "Retains full rated breaking strength in wet conditions",
            "High resistance to UV rays, weathering, and abrasion",
            "Smooth exterior for easy handling"
        ],
        "suitedFor": [
            "Sailboat halyards, sheets & marine rigging",
            "Flagpole ropes & banner hoisting lines",
            "Static safety lifelines & fall arrest anchors",
            "Shade sail rigging & canopy perimeter lines",
            "Industrial winch lines & crane taglines"
        ],
        "notSuitedFor": [
            "Applications requiring high dynamic stretch to absorb violent shock loads"
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
                "question": "What is the main difference between Polyester rope and Nylon rope?",
                "answer": "Polyester is low-stretch and retains 100% of its strength when wet, making it superior for static rigging and halyards. Nylon has high stretch and shock absorption, making it better for towing and anchor warps."
            },
            {
                "question": "How well does Polyester rope resist sunlight and UV degradation?",
                "answer": "Polyester has the highest UV and weathering resistance among standard synthetic fiber ropes, making it the top choice for outdoor rigging and flagpole lines."
            },
            {
                "question": "What sizes are available for Polyester rope?",
                "answer": "We stock Polyester ropes from 2mm to 36mm in 100m, 200m, and 220m coils, as well as bulk spools."
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
        "tradeAliases": "Naryal Ka Rassa • Coir Rassi • Coconut Fiber Rope • Kathya Rassa",
        "shortDescription": "Rustic natural coir fiber rope made from coconut husks, naturally resistant to rot, saltwater, and soil weathering for agriculture and erosion control.",
        "longDescription": "Coconut Coir Rope is spun from the fibrous husk of natural coconuts. It is durable, lightweight, and naturally resistant to saltwater damage and bacterial decay. The rough texture provides a firm, non-slip grip even in wet and muddy environments. Coir rope is widely used in agricultural vine support, oyster farming, soil bioengineering, erosion control logs, and rustic landscape fencing.",
        "metaTitle": "Coconut Coir Fiber Rope Wholesale Karachi Pakistan",
        "metaDescription": "Traditional coconut coir fiber ropes manufactured for marine, agricultural, and construction uses in Karachi, Pakistan. Durable, textured, and eco-friendly.",
        "usage": "Coconut Coir Rope is spun from the fibrous husk of natural coconuts. It is durable, lightweight, and naturally resistant to saltwater damage and bacterial decay. The rough texture provides a firm, non-slip grip even in wet and muddy environments. Coir rope is widely used in agricultural vine support, oyster farming, soil bioengineering, erosion control logs, and rustic landscape fencing.",
        "benefits": [
            "100% natural coconut husk fiber",
            "Naturally resistant to saltwater decay and soil rot",
            "Coarse surface gives strong grip in mud and wet conditions",
            "Biodegradable for eco-friendly landscaping and farming"
        ],
        "suitedFor": [
            "Marine aquaculture, oyster farming & fishing nets",
            "Agricultural vine support & hop growing",
            "Soil erosion control blankets & coir logs",
            "Tree root wrapping & nursery landscaping",
            "Rustic boundary fencing & outdoor decor"
        ],
        "notSuitedFor": [
            "Precision mechanical pulleys or high-speed winches"
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
                "question": "Why is Coconut Coir rope used in marine aquaculture and oyster farming?",
                "answer": "Coir fiber is naturally high in lignin, making it impervious to saltwater rot and bacterial breakdown in submerged marine environments for years."
            },
            {
                "question": "What sizes are available in Coconut Coir rope?",
                "answer": "Diameters range from 2mm, 4mm, 6mm, 8mm up to 10mm, 12mm, 16mm, 20mm, 24mm, 28mm, 32mm, and 36mm in coils, hanks, and compressed bales."
            },
            {
                "question": "Is Coir rope eco-friendly?",
                "answer": "Yes, it is made from 100% natural renewable coconut byproduct and is 100% biodegradable, making it popular in erosion control and environmental restoration."
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
        "tradeAliases": "Georgette Rassa • Marine Mooring Line • Jahazi Georgette Rope • High Tenacity Ship Rope",
        "shortDescription": "Heavy-duty marine poly-blend rope engineered for ship mooring, vessel docking, tugboat lines, and commercial fishing operations.",
        "longDescription": "Georgette Marine Rope is a heavy-duty synthetic cordage manufactured from high-tenacity poly-composite fibers. Built for marine and harbor environments, it delivers high breaking strength, balanced flexibility, and strong resistance to saltwater wear and cyclic mooring fatigue. It floats on water for safer handling around vessel hulls and propellers, making it a reliable standard for port mooring, shipyard berthing, tug lines, and commercial fishing trawlers.",
        "metaTitle": "Georgette Marine Mooring Rope Wholesale Karachi Port",
        "metaDescription": "High-tenacity georgette marine mooring ropes in Karachi Port. Engineered for container vessels, tug boats, and extreme dock berthing with high tensile strength.",
        "usage": "Georgette Marine Rope is a heavy-duty synthetic cordage manufactured from high-tenacity poly-composite fibers. Built for marine and harbor environments, it delivers high breaking strength, balanced flexibility, and strong resistance to saltwater wear and cyclic mooring fatigue. It floats on water for safer handling around vessel hulls and propellers, making it a reliable standard for port mooring, shipyard berthing, tug lines, and commercial fishing trawlers.",
        "benefits": [
            "High breaking strength built for heavy marine loads",
            "Floats on water for safer handling around docks and hulls",
            "Resists saltwater fatigue, rot, and marine weathering",
            "Flexible and easy to handle during ship berthing"
        ],
        "suitedFor": [
            "Ship mooring & commercial vessel docking",
            "Barge towing lines & harbor workboats",
            "Shipyard berthing & drydock rigging",
            "Commercial fishing trawler lines",
            "Heavy port cargo securing"
        ],
        "notSuitedFor": [
            "Direct contact with high-temperature exhaust pipes or open flames"
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
                "question": "Why is Georgette rope preferred for ship and barge mooring?",
                "answer": "Georgette rope combines high tensile breaking strength with positive buoyancy (it floats) and high resistance to cyclic marine fatigue and friction against dock bollards."
            },
            {
                "question": "What diameters and coil lengths are supplied?",
                "answer": "We supply Georgette rope from 6mm to 36mm in standard 220m marine mooring coils as well as custom lengths for ship chandlers and vessel operators."
            },
            {
                "question": "Does Georgette rope absorb water?",
                "answer": "No, the poly-composite construction does not absorb water, keeping the rope lightweight and easy to handle even during rough weather docking."
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
      metaDescription: 'Certified polyester lifting webbing slings (1T-10T), cargo ratchet tie-down belts & full body fall-arrest safety harnesses at wholesale rates in Karachi Pakistan.',
    },
    create: {
      name: 'Safety Belts & Webbing Slings',
      slug: 'safety-belts-webbing-slings',
      image: '/uploads/categories/safety-belts-webbing-slings.jpeg',
      description: 'Certified polyester duplex webbing slings (1T-10T), endless round slings (gol patta), heavy ratchet cargo lashing tie-down belts, and 5-point full-body fall-arrest safety harnesses for industrial lifting, high-rise construction, and commercial transport in Karachi.',
      metaTitle: 'Wholesale Webbing Slings & Safety Belts Karachi | Tahira Syndicate',
      metaDescription: 'Certified polyester lifting webbing slings (1T-10T), cargo ratchet tie-down belts & full body fall-arrest safety harnesses at wholesale rates in Karachi Pakistan.',
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
        tradeAliases: 'Lifting Patta, Crane Webbing Belt, Duplex Sling, Polyester Crane Patta, Double-Eye Webbing Sling, 2-Ply Cargo Sling',
        shortDescription: '100% high-tenacity polyester 2-ply flat webbing sling with reinforced becketed eye loops. Color-coded from 1 Ton (Violet) to 10 Ton (Orange) capacities for crane lifting, dockside stevedoring, and industrial machinery rigging in Karachi.',
        longDescription: 'Tahira Syndicate\'s flat woven duplex webbing slings (lifting patta) are engineered from multi-filament high-tenacity polyester yarn to deliver superior strength-to-weight ratio without damaging painted or delicate load surfaces. Featuring heavy 2-ply layered construction with anti-abrasion protective sleeves over both folded eye loops, our slings provide a reliable safety factor of 6:1. Widely utilized across Karachi Port (KPT), Port Qasim container terminals, heavy engineering workshops in SITE, and steel fabrication yards for secure vertical, choke, and basket hitch lifting.',
        metaTitle: "Flat Woven Duplex Webbing Sling Wholesale Karachi",
        metaDescription: "1T to 10T polyester duplex webbing slings (lifting patta) in Karachi. Color-coded, safety factor 7:1 for crane rigging, port cargo, and steel handling.",
        usage: 'Engineered for overhead crane hoisting, port vessel cargo stevedoring at KPT and Port Qasim, structural steel beam handling, marble slab maneuvering, and heavy industrial machinery installation across Karachi and Hub Industrial Estate.',
        benefits: [
          '100% high-tenacity polyester with low elongation (<4%) prevents hazardous load bounce during crane hoisting.',
          'Reinforced double-layer eye loops with protective cordura sleeves resist hook friction, tearing, and cutting edges.',
          'Standard international color-coded tonnage stripes allow instant visual safety auditing on industrial job sites.',
          'Flexible flat profile distributes lifting pressure evenly over delicate machinery and painted surfaces without scratching.',
        ],
        suitedFor: [
          'Overhead crane hoisting in industrial factories and steel mills',
          'Port Qasim & Karachi Port vessel cargo stevedoring and loading',
          'Structural steel beam rigging, pipe bundling, and marble handling',
          'Heavy transformer and industrial electric motor positioning',
        ],
        notSuitedFor: [
          'Direct contact with razor-sharp un-beveled steel plate edges without polyurethane corner protection pads',
          'Immersion in concentrated sulfuric acid baths or temperatures exceeding 100°C',
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
        faqs: [
          { question: 'How do I know which color corresponds to which lifting capacity?', answer: 'International standards are color coded: Violet = 1 Ton, Green = 2 Ton, Yellow = 3 Ton, Grey = 4 Ton, Red = 5 Ton, Blue = 8 Ton, Orange = 10 Ton. Each black woven stripe also represents 1 Ton.' },
          { question: 'Can these slings be used in choke hitch and basket hitch configurations?', answer: 'Yes. In straight vertical lift the capacity is 1.0× WLL; in choke hitch it is 0.8× WLL; in parallel basket hitch it safely doubles to 2.0× WLL.' },
          { question: 'What is the MOQ for wholesale purchase in Karachi?', answer: 'Minimum order is 1 piece from our Bohrapir counter; carton wholesale lots of 10–50 pieces receive direct distributor rates.' },
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
        tradeAliases: 'Gol Patta, Round Lifting Sling, Endless Polyester Sling, Tubular Crane Belt, Choke Hitch Gol Sling, Soft Round Sling',
        shortDescription: 'Seamless continuous-yarn tubular polyester round sling with protective double-wall woven sleeve. Ideal for choke hitch lifting of cylindrical pipes, marine propeller shafts, steel coils, and delicate irregular machinery in Karachi.',
        longDescription: 'Tahira Syndicate\'s endless tubular round slings (gol patta) consist of a continuous core of parallel high-tenacity 100% polyester filament yarn enclosed within a seamless woven protective tubular jacket. Because the internal load-bearing core never contacts the load directly, external jacket scuffs do not compromise structural lifting integrity. The circular endless design allows the user to rotate wear points continuously across the sling circumference, doubling the working lifespan compared to fixed-eye slings. Highly favored in Karachi shipyards, pipe mills, and oil terminals.',
        metaTitle: "Endless Tubular Round Webbing Sling Karachi | 1T-20T",
        metaDescription: "Heavy-duty endless tubular round slings (gol patta) in Karachi, Pakistan. Seamless polyester protective sleeve for delicate cylindrical loads up to 20 Tons.",
        usage: 'Widely used for choke-hitch rigging around smooth cylindrical steel pipes, oil refinery heat exchangers, marine propeller shafts at Karachi Shipyard, paper mill rollers, and heavy irregular plant machinery.',
        benefits: [
          'Continuous endless loop design allows rotating bearing points each lift, doubling overall sling service life.',
          'Seamless double-wall protective jacket shields load-bearing inner core fibers from external grime, grease, and UV.',
          'Exceptionally pliable and soft texture hugs tightly around polished cylindrical loads without surface slippage.',
          'Significantly lighter and more compact than wire rope grommets, allowing effortless transport by rigging personnel.',
        ],
        suitedFor: [
          'Choke hitch rigging around heavy steel pipes and cylindrical tanks',
          'Transformer hoisting, shipyard shaft handling, and turbine installation',
          'Electric motor lifting and pump overhaul in industrial processing plants',
          'Finished marble and polished stone positioning requiring zero surface marking',
        ],
        notSuitedFor: [
          'Direct dragging over rough concrete without protective sliding sleeves',
          'Operations where outer jacket is sliced open exposing internal load yarns',
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
        faqs: [
          { question: 'What is the advantage of an endless round sling over a flat eye-to-eye sling?', answer: 'An endless round sling conforms perfectly around cylindrical or irregular loads and allows you to shift the contact hook point each lift, preventing repetitive wear on a single spot.' },
          { question: 'How do you inspect a round sling for internal damage?', answer: 'Check the outer cover; if the outer jacket is cut through and internal core yarns are exposed or severed, the sling must be retired immediately.' },
          { question: 'Can you supply heavy 15T to 20T round slings for project lifting?', answer: 'Yes, we stock standard 1T–10T capacities and supply heavy 15T and 20T master round slings on short notice.' },
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
        tradeAliases: 'Patta Tie-Down, Ratchet Belt, Cargo Lashing Strap, Truck Belt, Container Tie-Down, Daala Lashing Belt, 2 Inch 5 Ton Ratchet Strap',
        shortDescription: 'Heavy-duty 2-inch and 3-inch polyester ratchet tie-down lashing belt with forged steel double J-hooks and quick-tensioning ratchet buckle. Engineered for truck flatbeds, container cargo, and interstate freight transport across Pakistan.',
        longDescription: 'Tahira Syndicate\'s ratchet cargo lashing tie-down belts (patta tie-down) provide high-tension cargo containment for commercial transport fleets, flatbed trailers, Mazda trucks, and shipping containers. Constructed with low-stretch, weather-resistant polyester webbing and a heat-treated zinc-plated steel ratchet tensioner, our tie-down assemblies eliminate cargo shifting and rope slack on bumpy highways. Designed with heavy forged double J-hooks that anchor securely into truck side rails, container D-rings, and trailer lashing points.',
        metaTitle: "Ratchet Cargo Lashing Tie-Down Belt Karachi | 5T",
        metaDescription: "50mm 5-Ton ratchet cargo lashing tie-down belts (truck patta) in Karachi. Heat-treated steel J-hooks with weather-proof polyester webbing for road transport.",
        usage: 'Securing flatbed truck freight, Mazda daala cargo shipments from Maripur truck stand, shipping container internal bracing, steel coil and timber bundle lashing, and heavy machinery transport on national highways.',
        benefits: [
          'High-leverage ergonomic ratchet mechanism generates over 500kg of pre-tension clamping force effortlessly.',
          'Heavy-gauge forged double J-hooks anchor firmly into trailer chassis rails, flatbed D-rings, and side pockets.',
          'Low-stretch UV-stabilized polyester webbing maintains taut tension over long-distance highway journeys.',
          'Fast single-operator tension and release mechanism reduces loading dock securing time by over 60%.',
        ],
        suitedFor: [
          'Flatbed 22-wheeler trailers carrying steel rebar, pipes, and machinery',
          'Mazda and Shehzore trucks hauling bags and crates from Maripur stand',
          'Shipping container internal cargo blocking and sea-freight lashing',
          'Heavy construction plant securing on low-bed transport trailers',
        ],
        notSuitedFor: [
          'Overhead vertical crane hoisting (strictly engineered for horizontal cargo lashing)',
          'Positioning over sharp metal cargo corners without edge protector guards',
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
        faqs: [
          { question: 'What length is standard for a 22-wheeler flatbed trailer in Pakistan?', answer: 'For 40ft flatbed trailers carrying machinery or bundled pipes, 8-meter to 10-meter 50mm ratchet belts are standard.' },
          { question: 'Does the webbing loosen when wet during monsoon rains?', answer: 'No, our 100% polyester webbing absorbs less than 1% moisture, ensuring tension remains locked even under continuous rain.' },
          { question: 'Are replacement straps available if the webbing gets damaged while the ratchet is fine?', answer: 'Yes, we sell complete ratchet assemblies as well as standalone long-end replacement webbing straps with hooks.' },
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
        tradeAliases: 'Complete Safety Belt, Full Body Harness, Scaffolding Safety Belt, High Altitude Fall Harness, 5-Point Safety Belt, Construction Harness',
        shortDescription: 'Certified full-body 5-point fall-arrest safety harness fabricated with 45mm high-tenacity polyester webbing, dorsal forged D-ring, and adjustable chest and thigh buckles for scaffolding and high-rise construction in Karachi.',
        longDescription: 'Tahira Syndicate\'s full-body fall-arrest safety harness (complete safety belt) is designed to protect industrial workers, scaffolders, tower maintenance crews, and roofing technicians against high-altitude falls. Featuring a 5-point ergonomic adjustment system (shoulder, chest, waist, and dual leg straps), the harness distributes impact deceleration forces evenly across the pelvic girdle and thighs in the event of a slip. Fitted with a heavy forged alloy-steel rear dorsal D-ring, corrosion-resistant pass-through mating buckles, and dual-color webbing for quick, mistake-free donning.',
        metaTitle: "Full Body Fall-Arrest Safety Harness Belt Karachi",
        metaDescription: "Industrial full body fall-arrest safety harness belts in Karachi, Pakistan. Certified dorsal D-rings and adjustable chest straps for high-altitude scaffolding.",
        usage: 'Mandatory personal protective equipment (PPE) for high-rise commercial building construction, exterior facade glass cleaning, scaffolding erection, telecom tower maintenance, and industrial boiler repair.',
        benefits: [
          '5-point fully adjustable geometry distributes impact deceleration forces safely across pelvic bones and shoulders.',
          'Heavy forged alloy steel dorsal D-ring provides proof-tested anchor point for shock-absorbing lanyards and lifelines.',
          'Dual-color high-contrast webbing (yellow upper / black lower) prevents twisting and ensures fast error-free donning.',
          'Tested to withstand dynamic drop impact forces exceeding 15 kN (1,500 kgf) without stitch failure or buckle slippage.',
        ],
        suitedFor: [
          'High-rise building construction and exterior painting projects',
          'Scaffolding erection and structural steel framework assembly',
          'Telecommunication tower and high-voltage transmission line maintenance',
          'Shipyard drydock hull inspection and industrial boiler servicing',
        ],
        notSuitedFor: [
          'Horizontal vehicle towing or crane load hoisting',
          'Use after sustaining an actual fall arrest event (must be retired immediately)',
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
        faqs: [
          { question: 'Does this full-body safety harness come with a lanyard?', answer: 'We supply the harness as a standalone unit or bundled with single/double shock-absorbing lanyards and scaffold hooks.' },
          { question: 'How do workers adjust the harness for proper snug fit?', answer: 'Workers adjust the pass-through thigh and shoulder buckles until two flat fingers can fit snugly between the webbing and the body.' },
          { question: 'What is the recommended service life of a polyester safety harness?', answer: 'Under regular construction use, harnesses should be inspected daily and retired within 3 to 5 years, or immediately following any fall arrest event.' },
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
        tradeAliases: 'Double Lanyard, Scaffold Hook Belt, Shock Absorber Lanyard, Y-Lanyard, Safety Belt Rassa, Fall Arrest Lanyard Set',
        shortDescription: 'Y-shaped twin-leg shock-absorbing lanyard equipped with energy dissipation pack, forged steel snap hook, and two large 55mm opening scaffolding hooks for 100% tie-off safety during high-rise scaffold traversal in Karachi.',
        longDescription: 'Tahira Syndicate\'s shock-absorbing twin-leg double lanyard is an essential lifeline connection connecting full-body harnesses to scaffolding pipes and structural steel framing. Featuring an integrated tear-webbing energy absorber pack, the lanyard limits peak deceleration arrest forces to under 6 kN, safeguarding the human spine against injury. The twin Y-arm configuration allows scaffolders and steel erectors to maintain 100% continuous tie-off safety by ensuring one hook remains anchored while transitioning to the next structure.',
        metaTitle: "Shock-Absorbing Double Lanyard Scaffold Hooks Karachi",
        metaDescription: "Twin shock-absorbing webbing lanyards with forged scaffolding hooks in Karachi. 100% tie-off fall arrest protection for construction workers and telecom towers.",
        usage: 'High-rise scaffolding erection, structural steel girder climbing, communication tower maintenance, bridge inspection, and overhead crane runway maintenance requiring continuous 100% tie-off fall protection.',
        benefits: [
          'Twin-leg Y-configuration guarantees continuous 100% tie-off protection when navigating scaffolding pipes and trusses.',
          'Progressive tear-stitch energy absorber pack cushions accidental drops, limiting arresting forces to under 6 kN.',
          'Dual forged alloy steel scaffold hooks with 55mm wide gate openings latch effortlessly onto standard scaffolding tubes.',
          'Self-locking double-action spring gates prevent accidental roll-out or opening under cyclic line movement.',
        ],
        suitedFor: [
          'High-rise construction scaffolding erection and steel girder climbing',
          'Telecommunication tower and radio mast rigging',
          'Bridge maintenance, overhead crane tracks, and industrial roofing',
          'Industrial plant maintenance shutdowns requiring mobile fall arrest',
        ],
        notSuitedFor: [
          'Attachment to standard waist positioning belts for fall arrest (must attach to full body harness dorsal D-ring)',
          'Connecting both lanyard legs to the same anchorage point simultaneously',
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
          { question: 'Why are two scaffold hooks necessary instead of a single hook lanyard?', answer: 'Double lanyards allow workers to keep one hook anchored to scaffolding while moving the second hook forward, maintaining 100% continuous fall protection.' },
          { question: 'What happens to the shock absorber after an accidental fall?', answer: 'The internal stitching tears open to cushion the body. Once deployed, the lanyard has performed its life-saving duty and must be discarded immediately.' },
          { question: 'Do the scaffold hooks fit standard 1.5" and 2" scaffolding pipes?', answer: 'Yes, our large 55mm gate scaffold hooks snap effortlessly around all standard scaffolding tubes and structural steel angle bars.' },
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
        tradeAliases: 'Recovery Patta, Towing Belt, Snatch Strap, Heavy Truck Towing Strap, Breakdown Pulling Belt, 10 Ton Tow Strap',
        shortDescription: 'High-tensile polyester recovery strap with reinforced double-stitched loop eyes for heavy vehicle recovery, commercial truck breakdown towing, and off-road plant pulling across Karachi and Superhighway transport routes.',
        longDescription: 'Tahira Syndicate\'s heavy-duty vehicle towing and recovery straps (recovery patta) provide dependable pulling power for commercial logistics fleets, breakdown crane operators, and heavy transport contractors. Manufactured with multi-layer high-tenacity synthetic webbing (typically 75mm to 100mm widths) engineered with controlled elasticity, the strap absorbs sudden kinetic snatch shocks when jerking stuck 10-wheelers, Mazda trucks, and loaded dumper trucks out of sand, mud, or roadside drainage ditches. Finished with heavy-duty reinforced eye loops that fit standard bow shackles and pintle hooks.',
        metaTitle: "Heavy-Duty Vehicle Towing & Recovery Strap Karachi",
        metaDescription: "Heavy-duty 5T to 20T vehicle towing and recovery straps (recovery patta) in Karachi. Reinforced eye loops with low-elongation polyester for emergency pullouts.",
        usage: 'Heavy commercial truck breakdown towing on the Karachi-Hyderabad M-9 Motorway and Superhighway, pulling stuck dumpers and transit mixers from mud, port chassis towing, and fleet roadside emergency kits.',
        benefits: [
          'Controlled kinetic elasticity cushions sudden snatch jerks, protecting truck chassis and towing points from snapping.',
          'Reinforced folded eye loops lined with heavy wear sleeves withstand shackle pin abrasion under extreme pulling loads.',
          'High-tonnage capacity ratings (8 Ton, 10 Ton, and 20 Ton) handle loaded commercial 6-wheeler and 10-wheeler trucks.',
          '80% lighter than heavy metal tow chains — stores compactly behind truck cabins and prevents dangerous metal recoil.',
        ],
        suitedFor: [
          'Heavy Mazda, Hino, and Bedford truck towing and roadside recovery',
          'Dumper trucks, concrete mixers, and construction plant extraction',
          'Port container trailer towing and yard recovery operations',
          'Commercial logistics fleet breakdown kits and mobile crane recovery',
        ],
        notSuitedFor: [
          'Overhead vertical crane hoisting (use certified duplex lifting slings TS-SLG-DUP-001 for vertical lifts)',
          'Dragging across sharp bumper edges without protective sliding sleeves',
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
          { question: 'Why is a recovery strap better than a heavy metal chain for pulling stuck trucks?', answer: 'Synthetic recovery straps have controlled kinetic elasticity that cushions the pull, preventing sudden chassis snapping. They are also 80% lighter and far safer if an anchor point yields.' },
          { question: 'Which shackle size is recommended for these recovery loop eyes?', answer: 'Our reinforced loop eyes easily accept standard 3.25 Ton to 6.5 Ton forged steel screw-pin bow shackles (3/4" to 7/8" pin size).' },
          { question: 'Can these tow straps withstand being dragged over gravel and tarmac?', answer: 'Yes, our webbing features dense edge-weaving that resists road abrasion, though using corner sleeves over sharp bumper edges is recommended for maximum longevity.' },
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
        tradeAliases: 'Polyester Niwar, Webbing Roll, Slotted Webbing, Sling Webbing Thaan, Industrial Tape Roll, 1 to 4 Inch Polyester Niwar',
        shortDescription: 'High-tensile 1-inch to 4-inch continuous polyester webbing and niwar rolls (50m & 100m thaan) for sling fabrication, industrial cargo binding, shade net border reinforcement, and heavy commercial harness stitching in Karachi.',
        metaTitle: "Industrial Polyester Webbing & Niwar Roll Karachi",
        metaDescription: "High-tenacity industrial polyester webbing and heavy niwar rolls (1 inch to 4 inches) in Karachi, Pakistan. Tight weave rolls for cargo lashing and fabrication.",
        usage: 'Heavy tarpaulin and canvas tent hem reinforcing, green shade net perimeter border stitching, commercial bag handle fabrication, industrial safety harness assembly, and heavy packaging bundling across Karachi.',
        benefits: [
          'Dense needle-loom woven structure with high-tenacity yarn ensures clean cuts and resists thread fraying.',
          '100% virgin polyester yarn exhibits superior resistance to UV sunlight degradation, mold, and humidity.',
          'Standard 50m and 100m continuous coils (thaan) feed smoothly into commercial walking-foot sewing machines.',
          'High tensile load capacity ranging from 500 kg to over 6,000 kg across 1" to 4" widths.',
        ],
        suitedFor: [
          'Canvas tent, shamiana, and heavy tarpaulin perimeter hem reinforcement',
          'Agricultural green shade net and cricket net border tape stitching',
          'Industrial lifting sling and cargo lashing strap fabrication',
          'Heavy-duty industrial bags, bulk sack handles, and commercial strapping',
        ],
        notSuitedFor: [
          'Direct overhead crane lifting without certified multi-ply stitching and reinforced eye terminations',
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
          { question: 'Can this webbing be stitched on standard commercial walking-foot sewing machines?', answer: 'Yes, our webbing is engineered with balanced weft density that allows smooth needle penetration using bonded nylon or polyester thread (#20 to #40).' },
          { question: 'What width is standard for reinforcing green shade net borders?', answer: 'For green shade net (hara parda) border hems, 1.5-inch (38mm) and 2-inch (50mm) polyester niwar is most commonly used.' },
          { question: 'What is the wholesale packaging format for bulk dispatch?', answer: 'Webbing is coiled into 50m or 100m rolls and packaged in 10-roll bundles or 50kg master sacks ready for immediate dispatch from Bohrapir.' },
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
        tradeAliases: 'HDPE Tirpal, Cross Laminated Tarpal, Blue Orange Sheet, Barsati Tarpal, Plastic Waterproof Sheet, Galla Tarpal, PE Tirpal',
        shortDescription: 'Multi-layer cross-laminated 100% waterproof HDPE tarpaulin with dual-side LDPE film coating, reinforced perimeter rope hem, and aluminum rust-proof eyelets every 3 feet.',
        longDescription: 'Tahira Syndicate\'s multi-color HDPE waterproof tarpaulins are manufactured using high-density virgin polyethylene woven mesh laminated on both sides with UV-stabilized low-density polyethylene. Available in reversible dual-tone colors (Blue/Orange, Blue/Silver, Green/Silver) ranging from lightweight 90 GSM temporary site coverings to rugged 250 GSM commercial transport tarpals. Engineered with heat-welded joints, corner reinforcement triangular patches, and solid aluminum eyelets every 3 feet, these sheets offer 100% waterproof protection against heavy monsoon downpours, sun degradation, and dirt in open warehouse yards across Karachi and interior Sindh.',
        metaTitle: "Multi-Color HDPE Waterproof Tarpaulin Sheet Karachi",
        metaDescription: "100% waterproof multi-color HDPE tarpaulin rolls and sheets in Karachi. Heat-sealed hems with aluminum eyelets for truck covers, logistics, and shed shelters.",
        usage: 'Open-yard cargo covering, building roof monsoon waterproofing, agricultural harvest drying, brick kiln rain protection, and temporary outdoor storage across Karachi, Sindh, and Punjab.',
        benefits: [
          '100% virgin HDPE woven mesh laminated on both sides with waterproof LDPE film.',
          'Heat-sealed ultrasonic seams guaranteed leak-proof under standing rainwater.',
          'Rust-proof aluminum grommets punched through 4-layer reinforced rope-embedded hems.',
          'High tensile and tear resistance suitable for truck transit, roofing underlayment, and grain protection.',
        ],
        suitedFor: [
          'Open-yard bulk cargo and machinery storage',
          'Monsoon building roof weatherproofing and leak control',
          'Agricultural crop harvest drying and temporary grain covering',
          'Brick kiln and cement block rain protection',
          'Pickup truck and commercial vehicle freight covering',
        ],
        notSuitedFor: [
          'Direct contact with razor-sharp jagged steel scrap without buffer underlay',
          'Covering hot industrial machinery exhaust pipes exceeding 80°C',
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
          { question: 'What is the difference between 120 GSM and 200 GSM HDPE tarpals?', answer: '120 GSM is ideal for temporary short-season rain protection and light covering, whereas 200+ GSM is a heavy-duty grade designed for repeated truck cargo hauling and year-round outdoor sun exposure.' },
          { question: 'Are the eyelets rust-proof in Karachi\'s coastal humidity?', answer: 'Yes, we use solid marine-grade aluminum and brass eyelets that do not rust or stain the tarpal fabric even in humid coastal areas like Bohrapir, Kemari, and Port Qasim.' },
          { question: 'Can you fabricate custom oversized sheets for large warehouse godowns?', answer: 'Yes, in addition to standard bundle sizes, our workshop fabricates custom heat-sealed godown sheets up to 60x100 feet with heavy rope borders.' },
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
        tradeAliases: 'Canvas Tarpal, Truck Tirpal, Khadi Tirpal, Cotton Duck Tarpal, Fauji Tirpal, Wax Proof Canvas, Maripur Truck Sheet',
        shortDescription: '100% heavy duck cotton canvas tarpal treated with water-repellent wax compounds and chemical rot-proofing. Maripur Truck Stand and National Highway fleet standard.',
        longDescription: 'Engineered specifically for commercial freight carriers, long-haul trailers, and military logistic operations, Tahira Syndicate\'s heavy-duty cotton canvas tarpals are the gold standard for truck covering in Pakistan. Woven from tight 100% duck cotton yarn in 14oz (400 GSM), 16oz (480 GSM), and 18oz (550 GSM) weights, the fabric undergoes a specialized wax and chemical waterproofing immersion process. Unlike synthetic plastic sheets that cause condensation, canvas is breathable, allowing internal cargo moisture to evaporate while repelling heavy driving rain and road abrasion on routes between Karachi, Lahore, Peshawar, and Quetta.',
        metaTitle: "Heavy-Duty Cotton Canvas Tarpal Wholesale Karachi",
        metaDescription: "Water-repellent heavy cotton canvas tirpal in Karachi, Pakistan. Breathable, heavy-duty wax-proofed canvas covers for freight trucks and industrial machinery.",
        usage: 'Long-haul flatbed trucks, Bedford trucks, cement and wheat bag transport, export container tops, and heavy machinery covers across Pakistan\'s freight corridors.',
        benefits: [
          'Heavy 100% duck cotton canvas with deep wax-immersion waterproofing.',
          'Breathable natural fabric prevents sweating, dampness, and mold damage on agricultural produce, cotton bales, and sugar bags.',
          'Heavy double-stitched flat-felled seams with rot-resistant polyester-core thread.',
          'Solid brass eyelets inserted through triple-layer hem folds for high-tension tie-down rope lashing.',
        ],
        suitedFor: [
          'Long-haul freight trucks & Bedford transport fleets',
          'Sugar, wheat, and raw cotton bale inter-city transit',
          'Open-top railway wagon and container covers',
          'Heavy industrial equipment and generator covers',
        ],
        notSuitedFor: [
          'Direct chemical acid containment',
          'Static standing water pools without sufficient pitch or drainage slope',
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
          { question: 'Why do truck drivers prefer cotton canvas over plastic HDPE tarpals?', answer: 'Canvas does not flap violently or tear easily in high-speed highway winds, provides superior puncture resistance against cargo edges, and breathes so perishable goods (wheat, sugar, cotton) do not spoil from condensation.' },
          { question: 'Does the wax coating wash off in heavy rain?', answer: 'Our canvas is pressure-impregnated with hot paraffin wax and antifungal agents, ensuring multi-season waterproofing that maintains flexibility without cracking.' },
          { question: 'What sizes are available for 10-wheeler and 22-wheeler trailers?', answer: 'We stock standard 18x24 ft and 20x30 ft sheets, and regularly custom-stitch 24x36 ft and 30x45 ft trailer covers at our Bohrapir workshop.' },
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
        tradeAliases: 'PVC Tirpal, Vinyl Tarpal, Container Tirpal, Heavy Scrim Tarpal, 650 GSM Tirpal, German Tarpal, Dumper Cover',
        shortDescription: '550–750+ GSM industrial PVC coated high-tenacity polyester scrim tarpaulin with maximum puncture resistance, 100% chemical impermeability, and flame-retardant grade.',
        longDescription: 'Tahira Syndicate\'s industrial PVC coated tarpaulins represent the ultimate in heavy-duty waterproof barrier technology. Built upon a high-tenacity 1000D polyester woven inner scrim coated on both sides with heavy polyvinyl chloride (PVC) resin paste and acrylic top-lacquer, these sheets range from 550 GSM to 750+ GSM. Featuring high-frequency hot-air welded seams that are stronger than the base fabric itself, our PVC tarpals are completely impervious to water, grease, engine oils, diesel fuel, and industrial chemical splash. Ideal for heavy open-top shipping containers, mining dumpers, Port Qasim terminal storage, and factory equipment protection.',
        metaTitle: "Industrial PVC Coated Tarpaulin 650 GSM Karachi",
        metaDescription: "Commercial grade 650 GSM PVC coated heavy tarpaulins in Karachi. Tear-proof, 100% waterproof tarpaulin fabric for transport fleet covers and export cargo.",
        usage: 'Shipping line container covers, port cargo yard storage, dumper truck rock hauling, chemical plant equipment jackets, and heavy architectural canopies.',
        benefits: [
          'High-tenacity 1000D x 1000D polyester woven base scrim for extreme tensile strength (>2500 N/5cm).',
          'High-frequency welded seams creating an unbreakable, 100% hermetic waterproof bond.',
          'Resistant to UV degradation, chemical acids, grease, oils, and industrial pollutants.',
          'Smooth lacquered surface enables easy washing, dirt repellence, and long operational lifespan (5+ years).',
        ],
        suitedFor: [
          'Shipping container top covers and marine terminal open storage',
          'Mining dumper truck rocky load coverings',
          'Chemical processing outdoor machinery jackets',
          'Heavy-duty architectural tensile canopies and sheds',
        ],
        notSuitedFor: [
          'Applications requiring ultra-lightweight manual handling where single-person folding is needed',
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
          { question: 'How durable is PVC coated tarpaulin compared to standard PE sheets?', answer: 'PVC coated tarpals have over 5 times the tear strength and life expectancy of standard PE sheets, lasting 5 to 7 years in harsh sun and industrial chemical environments.' },
          { question: 'Can damaged PVC tarpals be repaired on site?', answer: 'Yes, PVC tarpals can be easily patched using PVC adhesive solvent cement or heat gun welding patches without losing waterproof integrity.' },
          { question: 'What colors are available for fleet branding?', answer: 'We stock Blue, Yellow, Green, White, Black, and Grey in full rolls and custom-fabricated covers.' },
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
        tradeAliases: 'Fumigation Sheet, Galla Godown Sheet, Wheat Storage Tirpal, Gas-Proof Cover, Grain Protection Sheet, Pest Control Sheet',
        shortDescription: 'Gas-tight, multi-layer laminated agricultural fumigation tarpaulin sheet designed for phosphine gas containment, grain stockpile sealing, and wheat godowns in Pakistan.',
        longDescription: 'Tahira Syndicate manufactures and supplies certified gas-tight fumigation and grain storage tarpaulins for agricultural flour mills, rice processing facilities, grain storage corporations (PASSCO, Sindh Food Department), and pest control contractors. Engineered from specialized high-barrier, cross-laminated polymers with multi-layer gas-retention films, these sheets ensure zero leakage of phosphine gas (Aluminium Phosphide) during fumigation cycles. Simultaneously offering heavy waterproof and UV-blocking protection, they protect open-air grain and paddy stacks (galla mandis) from rain, morning dew condensation, rodents, and destructive insect infestation.',
        metaTitle: "Agricultural Fumigation Sheet Cover Wholesale Karachi",
        metaDescription: "Gas-tight PVC and HDPE fumigation sheets in Karachi, Pakistan. Heavy-duty containment covers for grain warehouses, rice storage silos, and pest fumigation.",
        usage: 'Wheat, rice, pulses, and tobacco warehouse fumigation, open galla mandi temporary storage, and export grain shipment sealing.',
        benefits: [
          'High gas-barrier polymer matrix ensures complete phosphine gas retention during fumigation cycles.',
          'Multi-layer laminated construction resists pin-holing, sharp grain husk punctures, and crease tearing.',
          'Heavy welded skirt borders allow effective sand-snaking and ground sealing along perimeter edges.',
          'UV-treated for open outdoor grain bunker yards in high-temperature zones (Multan, Sukkur, Hyderabad, Dadu).',
        ],
        suitedFor: [
          'Wheat & paddy stack fumigation (PASSCO / Government Godowns)',
          'Rice mill and flour mill outdoor open-yard storage',
          'Pest control contractor phosphine gas treatments',
          'Tobacco leaf curing and seasonal grain preservation covers',
        ],
        notSuitedFor: [
          'Direct abrasive dragging across rough broken concrete floors without corner edge padding',
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
          { question: 'Does this sheet meet safety standards for Aluminum Phosphide gas fumigation?', answer: 'Yes, the polymer barrier is tested for low gas permeability, ensuring required gas concentration levels are maintained throughout the 72–120 hour fumigation window.' },
          { question: 'How do we achieve an airtight ground seal?', answer: 'The sheet features an extended 2-foot border skirt designed to be weighed down with our heavy sand snakes or canvas sand tubes.' },
          { question: 'Can these sheets be reused across multiple harvest seasons?', answer: 'Yes, our tear-resistant cross-laminated film can be folded, stored, and reused across multiple agricultural seasons.' },
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
        tradeAliases: 'Canvas Tent, Relief Khemey, Tambu, Site Mess Tent, Emergency Camp Tent, Fauji Tambu, Worker Shelter Tent',
        shortDescription: 'Single and double-fly heavy waterproof canvas shelter tents complete with galvanized steel poles, guy ropes, and iron ground pegs for disaster relief and construction camps.',
        longDescription: 'Tahira Syndicate is an established manufacturer of heavy-duty waterproof canvas tents for humanitarian disaster relief operations (NDMA, PDMA, NGOs), infrastructure construction site camps, mining exploration outposts, and security force temporary accommodations. Fabricated from 100% waterproof, rot-proof duck cotton canvas with heavy PVC mud-flaps, reinforced ridge seams, and high-strength galvanized steel framework, our tents provide secure, weather-proof living and working environments. Designed for fast field erection, extreme thermal insulation against scorching summer sun and winter chill, and high wind stability across rugged terrains from Balochistan to Gilgit-Baltistan.',
        metaTitle: "Heavy Canvas Relief & Construction Tents Karachi",
        metaDescription: "Wholesale emergency relief canvas tents and military shelter marquees in Karachi, Pakistan. Heavy-duty cotton canvas for humanitarian aid and field camps.",
        usage: 'Flood & earthquake emergency relief camps, highway construction worker dormitories, military outposts, field engineering offices, and medical base camps.',
        benefits: [
          'Single-Fly and Double-Fly construction offering high thermal insulation and complete monsoon waterproofing.',
          'Heavy 14oz / 16oz cotton canvas outer fly with optional breathable inner cotton lining.',
          'Heavy-duty reinforced heavy PVC groundsheet and perimeter mud flaps to block rainwater infiltration and insects.',
          'Complete field-ready kit including heavy galvanized steel poles, high-tensile guy ropes, tensioners, and iron stakes.',
        ],
        suitedFor: [
          'Disaster relief emergency shelters (NDMA/PDMA standard)',
          'Infrastructure highway worker dormitories',
          'Mining & geological field camps',
          'Temporary medical triage and field offices',
        ],
        notSuitedFor: [
          'Permanent multi-year brick-and-mortar building replacements',
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
          { question: 'What is the difference between single-fly and double-fly tents?', answer: 'Single-fly is lighter and faster to deploy for temporary shelter, while double-fly features a second outer roof canopy that creates an insulating air gap, keeping the tent cooler in summer and warmer in winter.' },
          { question: 'Are all poles, ropes, and pegs included in the wholesale tent package?', answer: 'Yes, each tent comes packed in a heavy-duty canvas carry bag containing full galvanized steel poles, guy ropes, wooden/metal tensioners, ground pegs, and mallet.' },
          { question: 'Can you supply bulk orders for relief organizations on short notice?', answer: 'Yes, our Karachi manufacturing workshop and central warehouse maintain ready stock and can rapidly produce hundreds of standardized relief units.' },
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
        tradeAliases: 'Clear PVC Sheet, Transparent Tirpal, Shisha Tarpal, Restaurant Patio Curtain, Cold Storage Curtain, Transparent Weather Screen',
        shortDescription: '0.5mm – 2.0mm optical clear flexible PVC tarpaulin with heavy-duty reinforced colored borders, brass eyelets, and UV resistance for restaurant outdoor patios and cleanrooms.',
        longDescription: 'Tahira Syndicate\'s transparent clear PVC waterproof curtains (shisha tarpal) combine optical glass-like transparency with rugged weatherproofing. Manufactured from flexible, double-polished clear PVC film (0.5mm to 2.0mm thickness) bordered with heavy 50mm reinforced colored webbing or PVC hem strips, these curtains block wind, heavy monsoon rain, dust, and insects without obstructing ambient light or outdoor visibility. Widely installed across open-air restaurant terraces in Clifton and DHA Karachi, industrial cold-storage doorways, cleanroom partitions, and commercial retail storefronts.',
        metaTitle: "Clear Transparent PVC Tarpaulin Curtain Karachi",
        metaDescription: "Crystal-clear transparent PVC curtain sheets in Karachi. Waterproof, cold-crack resistant roll covers for industrial partitions and cold storage rooms.",
        usage: 'Commercial restaurant and cafe outdoor patio winter enclosures, food processing partitions, cold storage doorways, and car wash spray bays.',
        benefits: [
          '100% crystal-clear optical clarity (glass-like see-through visibility).',
          'Heavy 50mm perimeter webbing hem prevents edge tearing under strong coastal sea breezes.',
          'Blocks 100% wind, rain, and street dust while maintaining natural daylight illumination.',
          'Rust-resistant brass eyelets or sliding pulley track rollers for smooth opening and closing.',
        ],
        suitedFor: [
          'Restaurant & cafe outdoor winter patio weatherproofing',
          'Food processing and pharmaceutical dust partitions',
          'Cold storage warehouse doorway curtains',
          'Car wash and spray painting isolation bays',
        ],
        notSuitedFor: [
          'Direct contact with open fire braziers or high heat radiating industrial heaters',
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
          { question: 'Does the clear PVC sheet turn yellow or cloudy over time in Karachi sun?', answer: 'Our clear sheets are manufactured with anti-UV and anti-oxidant additives to maintain crystal clarity and prevent premature yellowing or embrittlement.' },
          { question: 'How can we clean transparent PVC curtains?', answer: 'Simply wipe down with mild soapy water and a soft microfiber cloth; avoid abrasive scrubbing pads to prevent surface micro-scratches.' },
          { question: 'Can zippers or sliding rollers be installed for door entry?', answer: 'Yes, we custom-fabricate clear curtains with heavy-duty commercial dual-side zippers and track rollers for effortless doorway opening and closing.' },
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
      metaDescription: 'Heavy-duty PVC garden pipes, spiral suction hoses (1.5"-8"), canvas discharge delivery pipes & conduit pipes at factory wholesale rates in Bohrapir Karachi Pakistan.',
    },
    create: {
      name: 'Building & Flexible Pipes',
      slug: 'building-flexible-pipes',
      image: '/uploads/categories/building-flexible-pipes.jpeg',
      description: 'Heavy-duty flexible PVC garden pipes, braided water suction hoses, layflat canvas discharge pipes, corrugated electrical conduit tubing, and clear PVC level tubes for construction, agricultural tubewells, and industrial fluid transfer in Pakistan.',
      metaTitle: 'Wholesale Building & Flexible Pipes Karachi | Tahira Syndicate',
      metaDescription: 'Heavy-duty PVC garden pipes, spiral suction hoses (1.5"-8"), canvas discharge delivery pipes & conduit pipes at factory wholesale rates in Bohrapir Karachi Pakistan.',
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
        tradeAliases: 'Mali Pipe, Garden Pipe, Braided Water Pipe, Nalkay Ka Pipe, Green Flexible Pipe, Car Wash Hose, 3-Ply Water Pipe',
        shortDescription: 'High-durability 3-ply cross-braided flexible PVC water hose pipe with polyester yarn reinforcement. Kink-resistant, weather-proof, and designed for heavy commercial landscaping, construction curing, and car wash stations in Karachi.',
        longDescription: 'Tahira Syndicate\'s heavy-duty braided PVC flexible garden pipes (mali pipe) are engineered for extreme durability under harsh Pakistani summer heat and high city water pressures. Constructed with a virgin PVC inner core, intermediate high-tenacity cross-woven polyester thread braiding, and an abrasion-resistant outer protective layer, this hose prevents bulging, twisting, and kinking under continuous flow. Widely used across commercial nurseries, building slab concrete curing, residential complexes in DHA and Clifton, municipal parks, and auto service stations throughout Karachi.',
        metaTitle: "Braided PVC Flexible Garden Hose Pipe Karachi | Mali",
        metaDescription: "Reinforced braided PVC flexible garden hose pipes in Karachi, Pakistan. Kink-resistant, high-pressure nylon yarn braid for landscaping and construction sites.",
        usage: 'Construction site concrete slab curing, commercial nursery landscaping, high-pressure car wash washdowns, factory floor cleaning, and residential villa water supply.',
        benefits: [
          'High-tenacity cross-braided polyester yarn reinforcement prevents pipe bursting and high-pressure ballooning.',
          'Formulated with 100% virgin flexible PVC compounds with anti-algae inner lining for clean water delivery.',
          'UV-stabilized outer skin resists cracking, brittleness, and surface stickiness under 45°C+ summer sun.',
          'Thick-wall kink-resistant design ensures uninterrupted water flow around tight building corners and garden bends.',
        ],
        suitedFor: [
          'Construction site concrete slab curing',
          'Commercial nursery landscaping and lawn irrigation',
          'High-pressure car wash and auto detailing washdowns',
          'Factory floor washing and municipal park maintenance',
        ],
        notSuitedFor: [
          'Boiling water lines exceeding 60°C',
          'Petroleum fuel, diesel, or chemical solvent transfer',
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
          { question: 'Does this garden pipe crack or stiffen during cold winter mornings or hot Karachi summers?', answer: 'No, our virgin plasticizers keep the hose soft, pliable, and crack-resistant across temperatures from -5°C up to +55°C.' },
          { question: 'Which size is recommended for building curing and motor washing?', answer: 'For concrete curing and residential pressure motors, 3/4" (19mm) provides the ideal balance between high flow volume and maneuverability.' },
          { question: 'Can standard brass nozzles and quick-connect clamps fit this pipe?', answer: 'Yes, our pipe dimensions match standard 1/2", 3/4", and 1" brass fittings, hose menders, and Jubilee worm-drive clamps.' },
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
        tradeAliases: 'Suction Pipe, Kheenchan Pipe, Green Suction Hose, Tubewell Suction Pipe, Dewatering Hose, Spiral PVC Hose, Sucker Pipe',
        shortDescription: 'Rigid PVC spiral-reinforced heavy suction hose for agricultural tubewells, construction site basement dewatering, municipal slurry pumps, and tanker water suction in Karachi.',
        longDescription: 'Tahira Syndicate\'s heavy-duty PVC spiral reinforced suction hoses (kheenchan pipe) are built to handle full vacuum suction without collapsing or ovalizing under negative pressure. Constructed from a flexible PVC wall with an embedded, crush-resistant white rigid PVC spiral helix, this hose delivers extreme structural strength while remaining flexible for swift field deployment. Highly demanded by tubewell drillers, Karachi Water & Sewerage Board contractors, municipal rainwater dewatering squads, and industrial chemical processing plants for non-corrosive fluid and slurry extraction.',
        metaTitle: 'PVC Spiral Suction Hose Pipe Karachi | 1.5"-8"',
        metaDescription: "Heavy-duty PVC spiral reinforced suction hose pipes (kheenchan pipe) in Karachi. Rigid PVC helix prevents vacuum collapse for dewatering pumps and bulk slurry.",
        usage: 'Agricultural diesel tubewell water suction, basement stormwater dewatering pumps, water bowser / tanker filling and discharge, and industrial factory slurry extraction.',
        benefits: [
          'Embedded rigid PVC spiral helix prevents vacuum collapse, hose crushing, and flow stoppage under high pump suction.',
          'Smooth mirror-finish internal bore minimizes friction losses and prevents sediment and fibrous slurry clogs.',
          'Transparent wall sections allow visual monitoring of liquid flow and rapid detection of air locks or priming issues.',
          'Chemical and abrasion resistant outer surface withstands dragging over rough gravel, mud, and construction slurry.',
        ],
        suitedFor: [
          'Agricultural diesel tubewell water suction',
          'Basement stormwater dewatering pumps (KMC / KWSB standard)',
          'Water bowser and tanker high-speed suction and delivery',
          'Industrial factory slurry and non-corrosive chemical handling',
        ],
        notSuitedFor: [
          'Direct suction of hot oils or gasoline fuels',
          'Dynamic high-pressure hydraulic lines',
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
          { question: 'Does this suction pipe collapse when connected to a heavy 16HP diesel tubewell engine?', answer: 'Absolutely not. The heavy rigid PVC spiral helix is engineered specifically to withstand full negative vacuum pressure from high-output diesel and electric pumps.' },
          { question: 'How can we connect this hose to a pump inlet or foot valve?', answer: 'Heat the pipe end gently with hot water or a heat gun to expand slightly, slip over the barbed nipple / foot valve, and secure tightly with heavy T-bolt suction clamps.' },
          { question: 'Are 6-inch and 8-inch large bore diameters available in stock in Karachi?', answer: 'Yes, we stock standard 1.5" to 4" at our Bohrapir shop and supply large 6" and 8" dewatering coils directly from our SITE warehouse.' },
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
        tradeAliases: 'Canvas Delivery Pipe, Layflat Hose, Tubewell Delivery Pipe, Canvas Water Pipe, Nikasi Pipe, Fire Hose Pipe, Khet Nikasi Pipe',
        shortDescription: 'High-strength circular woven synthetic canvas delivery hose lined with flexible rubber/PVC. Rolls completely flat for compact transport and high-volume agricultural and dewatering discharge.',
        longDescription: 'Tahira Syndicate\'s high-pressure layflat canvas delivery hoses (canvas delivery pipe) are the primary choice for agricultural flood irrigation, flood rescue dewatering, and municipal wastewater discharge across Pakistan. Manufactured with an exterior circular seamless woven jacket of high-tenacity polyester filament and an inner extruded rubber/PVC water-tight liner, this hose handles high discharge volumes without leaking. When empty, it rolls completely flat, allowing hundreds of meters to be loaded easily onto Mazdas, tractor trolleys, or Shahzores for fast redeployment across fields and project sites.',
        metaTitle: "High-Pressure Layflat Canvas Delivery Hose Karachi",
        metaDescription: 'Industrial 2" to 8" canvas layflat delivery hose pipes in Karachi, Pakistan. High pressure discharge water delivery for agriculture and flooding drainage.',
        usage: 'Agricultural tubewell field discharge, municipal flood dewatering, construction site drainage, temporary water bypass mains, and fire-fighting backup lines.',
        benefits: [
          'Seamless circular woven polyester canvas jacket provides superior tensile strength against burst pressure.',
          'Smooth synthetic rubber / PVC inner lining prevents friction head loss, maximizing pump discharge volume.',
          'Rolls 100% flat and compact — a 30m coil occupies minimal storage space compared to rigid pipes.',
          'Mildew, rot, and UV resistant fabric construction designed for mud, standing canal water, and open outdoor agricultural fields.',
        ],
        suitedFor: [
          'Agricultural tubewell field flood irrigation',
          'Municipal stormwater and flood rescue dewatering',
          'Construction site basement slurry pumping',
          'Temporary emergency water bypass lines',
        ],
        notSuitedFor: [
          'Suction pump inlet lines (collapses under vacuum; strictly for discharge)',
          'High-temperature steam lines',
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
          { question: 'Can this canvas hose withstand tractor tires driving over it in agricultural fields?', answer: 'When pressurized with water, driving heavy machinery directly over the hose should be avoided or bridged, but when unpressurized, the tough woven canvas easily withstands field abuse.' },
          { question: 'How is the canvas delivery hose connected to pump outlets?', answer: 'You can secure it over standard male barbed flanged adapters using heavy galvanized wire binding or stainless steel quick-clamp bands.' },
          { question: 'What is the benefit of canvas layflat pipe over rigid black HDPE delivery pipes?', answer: 'Canvas layflat pipe is 90% lighter, rolls flat into compact coils that one person can carry, and does not crack when folded or dragged across fields.' },
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
        tradeAliases: 'Jali Pipe, Flexible Conduit, Spring Pipe, Electrical Corrugated Pipe, Chhat Ka Jali Pipe, Wiring Pipe, PVC Flexible Conduit',
        shortDescription: 'High-impact flexible corrugated PVC conduit pipe for concrete slab electrical wiring, drywall partitions, ceiling drops, and commercial electrical cable routing across Pakistan.',
        longDescription: 'Tahira Syndicate\'s corrugated flexible PVC electrical conduit pipes (jali pipe / spring pipe) provide reliable, impact-resistant protection for power, lighting, and low-voltage telecommunication cabling. Extruded with precision annular corrugations from virgin flame-retardant PVC, this conduit bends smoothly around structural steel rebar, roof concrete beams, and tight wall recesses without kinking or collapsing the internal wire-pulling diameter. Engineered to withstand concrete pouring slurry and vibrator stress on construction slabs across high-rise residential and industrial building projects in Karachi.',
        metaTitle: "Corrugated Flexible PVC Conduit Pipe Karachi | Jali",
        metaDescription: "Heavy-duty corrugated flexible PVC conduit pipes in Karachi. Impact-resistant electrical wire protection for slab casting and building wall wiring nationwide.",
        usage: 'Concrete roof slab casting rebar wiring, gypsum board drywall wiring, false ceiling lighting drops, and switchboard distribution conduit.',
        benefits: [
          'Annular corrugation profile allows effortless 360-degree bending without cracking or heating elbows.',
          'Flame-retardant self-extinguishing PVC compound prevents electrical spark propagation.',
          'High compression strength withstands concrete slurry weight and heavy foot traffic during slab casting.',
          'Smooth internal bore allows quick pulling of multi-core electrical cables with standard fish tape.',
        ],
        suitedFor: [
          'Concrete roof slab casting and structural beam electrical ducting',
          'Gypsum board drywall partitions and electrical chasing',
          'False ceiling acoustic tile lighting cable drops',
          'Distribution panelboard and meter cabinet conduit routing',
        ],
        notSuitedFor: [
          'Pressurized liquid or plumbing water transfer (strictly an electrical conduit)',
          'Direct exposure to high-heat ovens exceeding 75°C',
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
          { question: 'Does this corrugated pipe collapse when construction labor steps on it during slab pouring?', answer: 'No, our heavy-gauge corrugated wall is engineered with high crush resistance that easily withstands concrete pour weight and site foot traffic.' },
          { question: 'Is it flame retardant for building safety regulations in Pakistan?', answer: 'Yes, it is compounded with self-extinguishing flame-retardant additives that extinguish immediately once the external flame source is removed.' },
          { question: 'What sizes are most commonly used in building wiring in Karachi?', answer: '1/2" (16mm) for lighting circuits and 3/4" (20mm) for main power lines and AC wiring are standard.' },
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
        tradeAliases: 'Level Pipe, Transparent PVC Tubing, Shisha Pipe, Mistri Level Tube, Water Level Pipe, Clear Vinyl Tubing, Masonry Level Hose',
        shortDescription: 'Crystal-clear, non-toxic flexible PVC tubing for civil construction leveling, masonry elevation alignment, medical gravity lines, and liquid dispensing in Pakistan.',
        longDescription: 'Tahira Syndicate\'s transparent clear flexible PVC water level tubings (level pipe / shisha pipe) provide optical clarity and dependable flexibility for construction craftsmen, civil surveyors, and mechanical workshops. Manufactured from 100% virgin crystal-clear plasticized PVC, this tube allows masons and contractors to visually inspect water menisci and air bubbles with absolute precision when establishing horizontal leveling across building columns, floor tiling, and foundation formwork. Resistant to atmospheric oxidation, yellowing, and kinks.',
        metaTitle: "Clear Flexible PVC Water Level Tubing Karachi",
        metaDescription: "High-clarity transparent clear flexible PVC water level tubing in Karachi, Pakistan. Smooth non-toxic bore for masonry levelling and precision liquid transfers.",
        usage: 'Construction building leveling and column height alignment (mistri level tube), aquarium aerator lines, air conditioning condensate drains, and laboratory fluid transfer.',
        benefits: [
          'Crystal-clear optical transparency allows zero-error water meniscus reading for accurate floor leveling.',
          'Highly flexible with excellent elasticity — bends without creasing or collapsing the internal fluid passage.',
          'Non-toxic, food-grade compatible virgin PVC polymer free from heavy metal stabilizers.',
          'Smooth glass-like interior and exterior resists sediment deposition and enables effortless cleaning.',
        ],
        suitedFor: [
          'Civil masonry elevation alignment and column water leveling',
          'Air conditioning condensate drainage lines',
          'Aquarium air pump aeration and fluid dosing',
          'Laboratory gravity feed and non-corrosive chemical transfer',
        ],
        notSuitedFor: [
          'High-pressure pump delivery lines',
          'Aromatic hydrocarbons, gasoline, or strong concentrated solvents',
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
          { question: 'Does this clear tube turn yellow or stiff after outdoor sun exposure?', answer: 'Our virgin compound includes anti-UV and anti-oxidant additives that resist yellowing and maintain pliability far longer than cheap reprocessed PVC tubes.' },
          { question: 'What size is the gold standard for masonry and building leveling?', answer: '5/16" (8mm) and 3/8" (10mm) inner diameter coils are the universal choice for Pakistani masons and construction surveyors.' },
          { question: 'Can this tubing be used for drinking water or beverage dispensing?', answer: 'Yes, it is fabricated from non-toxic virgin polymer and is completely odorless and safe for clean water and liquid transfer.' },
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
        tradeAliases: 'Kali Delivery Pipe, Agricultural Delivery Pipe, Polythene Delivery Pipe, Khet Ki Delivery, Layflat PE Tube, Tubewell Kali Pipe',
        shortDescription: 'Cost-effective heavy-gauge multi-layer black polyethylene layflat irrigation delivery pipe for agricultural field water conveyance, orchard flood watering, and seasonal canal dewatering.',
        longDescription: 'Tahira Syndicate\'s agricultural layflat PE irrigation delivery hoses (kali delivery pipe) represent the most cost-efficient and lightweight solution for long-distance farmland water conveyance in Sindh and Punjab. Manufactured from high-density virgin and premium recycled polyethylene polymers with heavy carbon-black UV stabilization, this layflat hose connects directly to tubewell pump outlets and rolls out across uneven agricultural fields, sugarcane furrows, and cotton acres without specialized trenching. Designed for seasonal farm operations where metal or rigid pipes are cost-prohibitive.',
        metaTitle: "Agricultural Layflat PE Delivery Hose Pipe Karachi",
        metaDescription: "Black agricultural PE layflat water delivery hose pipes in Karachi. UV-stabilized, puncture-resistant roll pipe for farm flood irrigation and pump discharge.",
        usage: 'Farmland tubewell water conveyance, wheat and sugarcane field flood irrigation, seasonal dewatering channels, and orchard watering across Sindh and Punjab.',
        benefits: [
          'Extremely lightweight and economical — provides low-cost water conveyance over hundreds of meters.',
          'Carbon black UV additive protects the polyethylene film from degrading under intense open-field sun.',
          'Layflat design rolls and unrolls in minutes; easily relocated between different crop plots and orchards.',
          'Can be easily patched, joined, or punctured for sub-furrow flood irrigation outlets.',
        ],
        suitedFor: [
          'Agricultural farmland tubewell water conveyance',
          'Wheat, sugarcane, and cotton flood furrow irrigation',
          'Seasonal canal water harvesting and orchard flood distribution',
          'Temporary open-channel dewatering across agricultural land',
        ],
        notSuitedFor: [
          'High-pressure industrial pumping exceeding 3.5 Bar',
          'Dragging over razor-sharp rocks or broken glass shards',
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
          { question: 'How does this black PE delivery pipe compare to canvas layflat pipe?', answer: 'Black PE delivery pipe is significantly more economical for wide agricultural field acreage, whereas canvas hose is thicker and designed for higher pressures and rougher construction sites.' },
          { question: 'Can it be connected directly to a diesel tubewell engine output?', answer: 'Yes, simply slip the flat hose over the pump delivery flange and secure with standard rubber strip wrapping or heavy hose clamps.' },
          { question: 'Can holes or small punctures in the field be repaired?', answer: 'Yes, farmers routinely repair field punctures using a piece of PE film and hot iron sealing or heavy waterproof duct tape.' },
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
        tradeAliases: 'Kali Shopper Roll, Black Construction Polythene, Foundation DPC Sheet, Khet Ki Plastic Sheet, Black Moisture Barrier, Raft Foundation Polythene, Ground Underlayment Film',
        shortDescription: 'High-durability black polyethylene moisture barrier sheet roll in 50 to 250 micron thickness for concrete slab curing, foundation waterproofing underlayment, and agricultural field mulching across Pakistan.',
        longDescription: 'Tahira Syndicate\'s heavy-duty black construction and agricultural polythene sheets (kali shopper roll) are the industry standard for civil engineering moisture proofing and large-scale agricultural operations in Karachi and nationwide. Formulated with high-density carbon-black UV stabilizers and tough polyethylene polymers, this heavy-gauge film creates an impermeable hydrostatic moisture barrier beneath concrete foundation rafts, basement retaining walls, and ground floor slabs. It halts capillary groundwater seepage, prevents rapid loss of concrete mix hydration during summer curing, and protects agricultural crop beds against weed proliferation and soil erosion in interior Sindh and Punjab farmlands.',
        metaTitle: "Black Construction Polythene Sheet Roll Karachi",
        metaDescription: "Heavy-duty black recycled polythene plastic sheets in Karachi, Pakistan. Reliable vapor barrier, slab casting moisture proofing, and road construction membrane.",
        usage: 'Concrete ground slab vapor barrier, basement foundation underlayment, concrete curing moisture containment, and agricultural weed barrier mulching.',
        benefits: [
          'Engineered with carbon-black masterbatch for exceptional opacity, UV light block, and moisture barrier integrity.',
          'Halts capillary rising damp in building foundations, slab bases, and flooring subgrades.',
          'Retains concrete moisture during curing, preventing surface micro-cracking and ensuring maximum PSI strength.',
          'Cost-effective continuous roll widths up to 12 feet for rapid site coverage with minimal overlaps.',
        ],
        suitedFor: [
          'Concrete ground slab and raft foundation vapor barrier underlayment',
          'High-rise building roof and slab water curing moisture containment',
          'Agricultural field weed suppression and soil solarization mulching',
          'Temporary weather protection for outdoor building materials and brick stacks',
        ],
        notSuitedFor: [
          'Permanent exposed architectural sun canopies (use heavy PVC tarpal)',
          'Puncture protection against loose sharp razor-wire or jagged uncrushed aggregate',
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
          { question: 'Which micron thickness is recommended for foundation DPC and basement raft casting?', answer: 'For standard residential and commercial foundation underlayment, 150 micron (600 gauge) to 200 micron (800 gauge) is the civil engineering standard specified by PEC and NESPAK contractors.' },
          { question: 'What roll widths and packaging weights are available in your Bohrapir warehouse?', answer: 'We stock standard 6 ft, 8 ft, 10 ft, and 12 ft unfolded widths in 20 kg, 25 kg, and 30 kg coils ready for immediate dispatch across Karachi.' },
          { question: 'Can these rolls be dispatched to construction sites outside Karachi like Gwadar or Multan?', answer: 'Yes, we dispatch full Mazda and 10-wheeler truckloads directly through Maripur and Superhighway freight terminals daily.' },
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
        tradeAliases: 'Shisha Shopper Roll, White Transparent Plastic Sheet, Virgin LDPE Sheet, Furniture Packing Plastic, Paint Dust Masking Film, Clear Greenhouse Sheet, Transparent Packaging Roll',
        shortDescription: '100% virgin crystal-clear LDPE plastic sheeting roll for industrial dust protection, showroom furniture masking, textile fabric wrapping, and temporary glass surface masking in Pakistan.',
        longDescription: 'Tahira Syndicate\'s transparent virgin clear LDPE plastic rolls (shisha shopper roll) offer superior optical clarity, smooth texture, and exceptional tear resistance. Extruded entirely from 100% prime virgin low-density polyethylene granules without fillers or recycled odors, this crystal-clear film is odorless, moisture-proof, and flexible. Widely demanded by Karachi\'s furniture manufacturers, textile finishing mills, paint contractors, and export logistics warehouses to seal finished goods against humidity, airborne sawdust, industrial soot, and monsoon rains during transit.',
        metaTitle: "Clear Transparent LDPE Plastic Sheet Roll Karachi",
        metaDescription: "100% virgin clear transparent LDPE plastic sheeting rolls in Karachi. High tensile clarity and dust protection for industrial packaging and surface shielding.",
        usage: 'Furniture and mattress dust protection, textile fabric bolt wrapping, architectural painting masking, and nursery plant frost insulation.',
        benefits: [
          'Formulated with 100% prime virgin LDPE for crystal optical clarity and high tensile elongation.',
          'Completely odorless, non-toxic, and safe for fabric, furniture, and cleanroom goods wrapping.',
          'Resists surface puncturing, tearing, and electrostatic dust accumulation.',
          'Available in single-sheet flat or continuous tubular centerfold rolls from 3 ft up to 12 ft widths.',
        ],
        suitedFor: [
          'Luxury wooden furniture, sofa sets, and mattress dust protection',
          'Textile garment rolls, yarn cones, and export fabric bolt moisture wrapping',
          'Architectural painting dust masking and floor drop cloth protection',
          'Temporary greenhouse tunnel and nursery plant frost insulation',
        ],
        notSuitedFor: [
          'Heavy-duty outdoor solarization exceeding 12 months under direct UV without UV inhibitors',
          'Heavy pallet stretch tension wrapping on automatic turntable machines (use stretch film)',
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
          { question: 'Is this film completely clear like glass or milky/cloudy?', answer: 'This is 100% virgin grade (shisha quality), providing crystal-clear transparency so product labels, wood grain, and fabric colors remain completely visible through the sheet.' },
          { question: 'Does it have any foul recycled plastic smell?', answer: 'No, zero odor. Because it is fabricated from prime virgin polymer granules, it does not release any offensive chemical or burning odor, making it safe for indoor furniture and apparel.' },
          { question: 'What is the minimum wholesale order quantity for Karachi delivery?', answer: 'Minimum order quantity is 5 commercial rolls, with same-day loading from our Bohrapir or SITE Industrial Area warehouse.' },
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
        tradeAliases: 'DPC Sheet, Damp Proof Course Membrane, Plinth Beam Plastic, Wall DPC Strip, Embossed Polyethylene DPC, Foundation Moisture Barrier, Construction Damp Barrier',
        shortDescription: 'Extra-heavy gauge, embossed damp-proof course (DPC) polyethylene barrier sheet roll engineered to permanently prevent rising damp in brick masonry walls, plinth beams, and basement foundations.',
        longDescription: 'Tahira Syndicate\'s heavy-duty construction DPC damp-proof membrane sheets provide permanent protection against capillary groundwater absorption and rising damp in building foundations across Pakistan. Extruded with a heavy textured diamond-grid embossed surface from virgin high-polymer polyethylene, this membrane bonds tenaciously with cement mortar beds along plinth beams and brick masonry courses. Engineered to resist chemical mortar alkalinity, soil sulfates, and high hydrostatic water table pressure in coastal zones like Karachi\'s Clifton, DHA, Gwadar, and riverine Punjab.',
        metaTitle: "Heavy-Duty DPC Damp-Proof Membrane Sheet Karachi",
        metaDescription: "Thick embossed DPC damp-proof membrane polythene sheets in Karachi, Pakistan. Complete rising damp protection for building foundations and brick masonry layers.",
        usage: 'Plinth beam horizontal damp proof coursing (DPC) under brickwork, basement retaining wall water isolation, and bridge abutment waterproofing.',
        benefits: [
          'Heavy 250 micron (1000 gauge) thick impermeable structure resists continuous hydrostatic ground moisture.',
          'Diamond-embossed surface texture ensures mechanical keying and non-slip adhesion with cement mortar.',
          'Chemically inert against soil salts, alkali mortar attack, and subterranean acidic moisture.',
          'Pre-slit into standard structural wall widths (4.5", 9", 13.5", and 18") as well as full foundation sheets.',
        ],
        suitedFor: [
          'Plinth beam horizontal damp proof coursing (DPC) under brickwork',
          'Basement retaining wall exterior vertical water isolation',
          'Bridge abutment and culvert subterranean waterproofing',
          'Heavy-traffic concrete paving slab underlayment',
        ],
        notSuitedFor: [
          'Exposed rooftop waterproofing without protective screed or mortar overlay',
          'Direct heat welding with open bitumen torches',
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
          { question: 'What pre-cut widths are stocked for standard Pakistani brick masonry walls?', answer: 'We stock standard 4.5-inch (single brick), 9-inch (double brick), 13.5-inch (one-and-a-half brick), and 18-inch widths in 30-meter rolls, alongside full 3 ft and 6 ft wide rolls.' },
          { question: 'Does the embossed surface prevent masonry wall cracking or slipping?', answer: 'Yes, the heavy embossed grid profile creates high frictional resistance with the mortar joint, preventing brickwork slippage under structural building loads.' },
          { question: 'How does this DPC sheet compare to traditional bitumen roofing felt (tar paper)?', answer: 'Unlike tar paper which dries out, rots, and cracks over time, heavy polyethylene DPC membranes remain flexible, rot-proof, and moisture-impermeable for the lifetime of the structure.' },
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
        tradeAliases: 'Tubular Plastic Roll, Shopper Nali Roll, Continuous LDPE Tube, Plastic Sleeve Roll, Pipe Packaging Film, Heat Sealing Tubular Plastic, Garment Poly Tube',
        shortDescription: 'Continuous seamless circular extruded LDPE tubular plastic roll for custom-length bag making, industrial pipe and rod bundling, carpet packaging, and spare parts moisture protection.',
        longDescription: 'Tahira Syndicate\'s industrial LDPE tubular roll and protective packaging film (shopper nali roll) provides continuous, seamless sleeve packaging for manufacturing plants, hardware mills, and textile operations across Pakistan. Produced via blown-film extrusion as an endless seamless tube, packaging operators can simply pull out the desired length, insert lengthy industrial goods (such as steel rods, curtain pipes, fabric rolls, or carpets), and seal both ends with a standard impulse foot heat sealer. Eliminates waste and custom bag sizing constraints.',
        metaTitle: "LDPE Tubular Roll & Plastic Sleeve Film Karachi",
        metaDescription: "Continuous LDPE tubular plastic rolls (nali roll) in Karachi, Pakistan. Extruded seamless plastic sleeve film for carpet and industrial roll packaging.",
        usage: 'Continuous sleeve packaging for metal pipes, aluminum extrusions, carpet rolls, and custom poly bag fabrication.',
        benefits: [
          'Seamless circular extrusion guarantees 100% leak-proof sides with zero longitudinal weak weld seams.',
          'Formulated for fast, strong heat sealing on standard impulse, pedal, and continuous band heat sealers.',
          'High puncture strength shields steel rods, sanitary fittings, and machinery parts against surface scratches and oxidation.',
          'Available in standard sleeve layflat widths from 2 inches up to 36 inches.',
        ],
        suitedFor: [
          'Packaging long extruded aluminum profiles, steel pipes, and curtain rods',
          'Industrial textile fabric rolls, carpet bundles, and yarn packaging',
          'Fabrication of custom-length poly bags for automotive hardware and fasteners',
          'Moisture barrier protection for machinery spare parts in humid coastal shipping',
        ],
        notSuitedFor: [
          'Boiling retort food packaging or microwave sterilization',
          'High-heat shrink oven tunnel applications requiring specialized cross-linked polyolefin',
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
          { question: 'Can this tubular plastic film be heat sealed with ordinary impulse bench sealers?', answer: 'Yes, our virgin LDPE polymer melts smoothly between 110°C to 135°C, yielding strong, airtight seal lines on standard manual and pneumatic impulse sealers.' },
          { question: 'What narrow and wide layflat tube widths can be ordered?', answer: 'We stock 4", 6", 8", 12", 18", 24", and 36" layflat sleeve widths in 15 kg and 25 kg rolls at our Bohrapir warehouse. Custom widths can also be manufactured on request.' },
          { question: 'Is this film compatible with printing for brand logos?', answer: 'Yes, corona-treated rolls for flexographic single and multi-color logo printing are available upon custom factory request.' },
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
        tradeAliases: 'Stretch Wrap, Pallet Wrapping Roll, Plastic Stretch Film, Cling Film Roll, Carton Wrapping Roll, LLDPE Stretch Film, Machine Stretch Roll',
        shortDescription: 'High-tack 5-layer cast LLDPE pallet stretch wrap film with up to 300% elongation for secure carton unitizing, export container pallet wrapping, and dust-proof cargo transport in Pakistan.',
        longDescription: 'Tahira Syndicate\'s high-clarity industrial pallet stretch wrap film rolls deliver maximum holding force, puncture resistance, and cling performance for commercial warehouses, FMCG distributors, and containerized export shippers across Pakistan. Manufactured via high-speed 5-layer co-extrusion cast film lines using premium linear low-density polyethylene (LLDPE) resins, this film stretches up to 300% without tearing around sharp carton corners or irregular pallet edges. It locks loaded shipping pallets into a rigid, unified block, preventing cargo shifts during transit on rough highways between Karachi Port, Lahore, and Faisalabad.',
        metaTitle: "Industrial Pallet Stretch Wrap Film Roll Karachi",
        metaDescription: "Cast LLDPE 500mm industrial pallet stretch wrap film rolls in Karachi. High puncture resistance with 300% pre-stretch retention for export cargo palletizing.",
        usage: 'Export container pallet stabilization, FMCG carton box unitizing, and moisture-proof cargo protection during inter-city transit.',
        benefits: [
          '5-layer cast co-extruded LLDPE construction offers superior tensile yield and high puncture resistance.',
          'Silent release and aggressive single-sided cling locks layers together without adhesive residue on carton boxes.',
          'Optical crystal clarity allows barcode scanning and shipping label verification directly through wrapped pallets.',
          'Compatible with both manual hand dispensers and high-speed semi-automatic turntable wrapping machines.',
        ],
        suitedFor: [
          'Export shipping container pallet stabilization and weather protection',
          'FMCG carton box unitizing and anti-pilferage tamper evidence',
          'Electronics, automotive battery, and chemical drum pallet wrapping',
          'Furniture, ceramic tile, and building material bundling',
        ],
        notSuitedFor: [
          'Direct heat shrink gun application (stretch film requires tension, not heat shrinking)',
          'Heavy continuous strapping replacing polyester/steel patti (use PET strapping for heavy timber/steel)',
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
          { question: 'What is the weight and core size of your standard manual hand stretch roll?', answer: 'Our popular manual hand roll weighs approximately 2.2 kg to 2.5 kg gross with a lightweight 2-inch or 3-inch inner paper core designed for fatigue-free worker handling.' },
          { question: 'Does the stretch film leave any sticky adhesive glue on our exported carton boxes?', answer: 'No. The film adheres strictly via natural molecular cling (tackifier additive) and leaves zero adhesive or chemical residue when unwrapped by the consignee.' },
          { question: 'Can we scan logistics barcodes through the stretch film?', answer: 'Absolutely. Due to cast 5-layer virgin polymer clarity, laser and optical handheld barcode scanners easily read through multiple wrapped layers.' },
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
        tradeAliases: 'Manual Strapping Band, PP Patti Roll, Packing Patti, Manual Box Strapping, Plastic Patti Roll, Corrugated Box Patti, Warehouse Strapping Band',
        shortDescription: 'High-tensile virgin & semi-virgin manual polypropylene strapping roll for carton bundling, bundle packaging, and manual tensioner sealing with metal clips across Pakistan.',
        longDescription: 'Manufactured for rigorous manual packing operations across Karachi warehouses, wholesale distribution centers, and manufacturing units. Tahira Syndicate\'s Manual PP Strapping Band offers superior tensile strength, minimal elongation, and smooth split-free edges to prevent worker hand injuries and carton corner tearing. Designed with a diamond-embossed grip surface for non-slip mechanical clamping with galvanized metal strapping seals (kundi clips) using standard manual tensioners and sealers.',
        metaTitle: "Manual PP Strapping Roll (Patti) Wholesale Karachi",
        metaDescription: "Virgin polypropylene manual strapping band rolls (patti) in Karachi, Pakistan. 12mm to 19mm embossed plastic band for manual tensioners and clip carton sealing.",
        usage: 'Manual carton bundling, corrugated box reinforcement, textile yarn packing, and master carton securing.',
        benefits: [
          'Embossed diamond grip prevents metal seal slippage under heavy transport tension.',
          'Superior tensile breaking force of 120 kg to 220 kg depending on width specification.',
          'Split-resistant formulation ensures smooth feeding through hand tensioning tools.',
          'Weatherproof, rot-proof, and humidity-resistant for local transit and sea freight.',
        ],
        suitedFor: [
          'Export carton and corrugated master box reinforcement',
          'Textile yarn carton strapping and woven fabric bundle securing',
          'Pharmaceutical, food, and FMCG wholesale distribution packaging',
          'Hardware, plastic pipe, and industrial component grouping',
        ],
        notSuitedFor: [
          'Arch-feed high-speed automated strapping machines (requires machine-grade straightness)',
          'Heavy steel ingot or sharp-edged raw sheet metal strapping without corner protectors',
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
          { question: 'What tools are required to use manual PP strapping rolls?', answer: 'Manual PP strapping requires a manual ratchet tensioner, a manual crimping sealer, and galvanized metal strapping seals (patti kundi).' },
          { question: 'What roll weights and colors are available?', answer: 'Standard roll gross weights range from 8 kg to 12 kg in White, Yellow, Blue, Green, and Black.' },
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
        tradeAliases: 'Machine Strapping Roll, Heat Seal PP Band, Semi-Auto Packing Strap, Strapping Machine Patti, Transpak Strapping Roll, Box Strapping Machine Roll',
        shortDescription: 'Precision-extruded heat-sealable machine grade polypropylene strapping roll designed for continuous jam-free cycling on semi-automatic and automatic strapping machines.',
        longDescription: 'Engineered specifically for high-speed industrial packaging lines across Pakistan. Tahira Syndicate\'s semi-automatic machine grade PP strapping features strict gauge uniformity, exceptional camber-free straightness, and an optimized melt-flow index for instant, durable heat welds without machine cutter or heater jamming. Compatible with Strapack, Transpak, Joinpack, and standard industrial packaging machines.',
        metaTitle: "Machine Grade PP Strapping Band Roll Karachi",
        metaDescription: "High-tensile semi-automatic machine grade PP strapping roll in Karachi. Consistent gauge and low camber ensuring zero jams on automatic carton packaging lines.",
        usage: 'Continuous conveyor case strapping, semi-automatic table packaging, publication bundling, and high-speed parcel processing.',
        benefits: [
          'Calibrated camber-free straightness prevents arch jamming in semi-automatic and fully automatic machines.',
          'Fast-melt polymer formula guarantees ultra-strong heat-seal joints in under 0.5 seconds.',
          'Ultra-low dust formulation protects machine heating elements and blade assemblies from residue buildup.',
          'Consistent tensile elongation absorbs transit vibration without snapping.',
        ],
        suitedFor: [
          'Automated pharmaceutical and FMCG end-of-line packaging conveyors',
          'Commercial print houses, bookbinders, and publication bundling',
          'Consumer electronics and appliance secondary carton packaging',
          'E-commerce logistics sorting hub parcel reinforcement',
        ],
        notSuitedFor: [
          'Hand tensioning with crimping pliers (not optimized for cold-seal manual buckles)',
          'Heavy 1-ton brick or raw timber pallet strapping without corner edge protection',
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
          { question: 'Will this strap jam on Taiwanese or Chinese strapping machines?', answer: 'No. Our machine-grade strapping is precision extruded with zero curvature (camber) and uniform thickness, ensuring 100% jam-free operation on Transpak, Joinpack, and Chinese machines.' },
          { question: 'What is the core size for machine rolls?', answer: 'Standard 200mm inner diameter paper core with 190mm width, fitting all standard strapping machine dispensers.' },
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
        tradeAliases: 'PET Strapping Band, Polyester Strapping, Green Plastic Steel Band, Heavy Duty Pallet Strap, Steel Strap Alternative, Plastic Steel Belt',
        shortDescription: 'Heavy-duty steel strap alternative made from high-strength polyester (PET) for heavy pallet stabilization, lumber, brick, and export cargo securing across Pakistan.',
        longDescription: 'The modern, cost-effective, and rust-free replacement for dangerous steel strapping. Tahira Syndicate\'s High-Tensile PET Strapping band retains continuous tension even under cargo shifting, timber settling, and thermal expansion. It will not scratch, stain, or rust on outdoor-stored pallets, and delivers up to 50% cost savings compared to traditional steel strapping. Designed for heavy friction weld battery tools and heavy serrated metal seals.',
        metaTitle: "High-Tensile PET Strapping Roll Wholesale Karachi",
        metaDescription: "Green embossed polyester PET strapping rolls in Karachi, Pakistan. Steel-grade tensile strength with high elasticity for heavy timber, pallet and cotton baling.",
        usage: 'Heavy pallet stabilization, ceramic tile palletizing, cotton baling, metal coil bundling, and export container cargo lashing.',
        benefits: [
          'High shock absorber elastic recovery retains tension even if pallets shift or settle during sea shipping.',
          '100% rustproof and non-staining, protecting exported goods from moisture corrosion.',
          'Zero razor-sharp edges eliminates workplace injuries common with snapped steel bands.',
          'Compatible with high-speed friction welding battery tools and heavy serrated clips.',
        ],
        suitedFor: [
          'Palletized export ceramic tiles, sanitaryware, and cement bags',
          'Compressed cotton bales, textile fabric rolls, and raw fiber baling',
          'Steel pipe bundles, aluminum extrusion profiles, and sheet metal packs',
          'Timber, plywood packs, and construction concrete block securing',
        ],
        notSuitedFor: [
          'Standard light-duty manual crimping tools designed for thin PP strapping',
          'Direct exposure to open flame cutting',
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
        faqs: [
          { question: 'Can PET strapping replace steel strapping safely?', answer: 'Yes, PET strapping offers breaking strength up to 850 kg with superior elastic recovery, meaning it absorbs transit shocks without snapping or damaging product corners.' },
          { question: 'What sealing methods work with PET strap?', answer: 'It can be sealed using battery-powered friction welding tools or manual heavy-duty tensioners with serrated galvanized metal seals.' },
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
        tradeAliases: 'BOPP Packing Tape, Brown Carton Tape, Transparent Packing Tape, Packaging Adhesive Tape, Box Sealing Tape, Shisha Packing Tape, Tan Tape',
        shortDescription: 'Industrial-grade Biaxially Oriented Polypropylene (BOPP) carton sealing tape with aggressive pressure-sensitive emulsion acrylic adhesive for corrugated boxes.',
        longDescription: 'Engineered for high-volume carton sealing across manufacturing and logistics operations. Tahira Syndicate BOPP packaging tapes feature high-shear strength acrylic adhesive coated on premium tensile polypropylene film. Provides an instantaneous bond to virgin and recycled corrugated boxes, resisting extreme temperature fluctuations and humidity without peeling.',
        metaTitle: 'BOPP Carton Packaging Tape Rolls Wholesale Karachi',
        metaDescription: 'Industrial 2" and 3" clear and brown BOPP carton packing tapes in Karachi. Strong acrylic adhesive coating for secure corrugated box sealing and freight.',
        usage: 'Corrugated carton sealing, export box packaging, courier parcel security, and cold storage container taping.',
        benefits: [
          'Instant aggressive tack adheres securely to high-recycled content corrugated cartons.',
          'High-tensile BOPP film resists edge splitting during high-speed manual dispenser application.',
          'UV and aging-resistant water-based acrylic adhesive prevents yellowing and bond failure in tropical humidity.',
          'Smooth and silent unwind suitable for factory packaging lines and distribution hubs.',
        ],
        suitedFor: [
          'Corrugated box and master carton sealing in export shipping',
          'E-commerce courier flyer and parcel reinforcement',
          'Cold storage food packaging and temperature-controlled logistics',
          'Bundling, light grouping, and protective carton lamination',
        ],
        notSuitedFor: [
          'Oily, wet, or heavily dust-coated rough timber surfaces',
          'High-temperature baking or powder coating masking',
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
          { question: 'What widths and roll lengths are supplied?', answer: 'Standard 48mm (2 inch) and 72mm (3 inch) widths in 50m, 100m, 200m, and jumbo 500m machine rolls.' },
          { question: 'Is custom company logo printing available?', answer: 'Yes, we supply custom printed BOPP tape rolls with corporate branding, logos, and warning messages in bulk lots.' },
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
        tradeAliases: 'Niwar Patti, Woven Cotton Niwar, Nylon Webbing Patti, Furniture Webbing Tape, Charpai Niwar, Truck Lashing Niwar, Cargo Binding Webbing',
        shortDescription: 'High-density tightly woven cotton and nylon niwar rolls for industrial tying, heavy machinery binding, furniture webbing, and traditional transport baling across Pakistan.',
        longDescription: 'Manufactured from premium twisted cotton yarn and high-tenacity nylon filaments on high-speed needle looms. Tahira Syndicate woven niwar rolls offer immense knot strength, soft pliable surface handling without scratching delicate polished surfaces, and reusable durability across transport, defense, and manufacturing sectors.',
        metaTitle: "Heavy Woven Cotton & Nylon Niwar Roll Karachi",
        metaDescription: "Heavy-duty woven cotton and nylon niwar rolls in Karachi, Pakistan. Tight weave strap rolls for charpai cots, furniture webbing, and industrial cargo bundling.",
        usage: 'Truck cargo securing, furniture and charpai webbing, canvas tarpaulin tie-down, and industrial machinery parts bundling.',
        benefits: [
          'Dense interlocking weave provides extreme tear and friction resistance under heavy tension.',
          'Non-abrasive textile face prevents scratching or scuffing on delicate painted surfaces.',
          'High flexibility allows effortless manual knotting, looping, and tightening.',
          'Washable, reusable, and resistant to atmospheric moisture degradation.',
        ],
        suitedFor: [
          'Truck cargo tie-down, canvas tarpaulin securing, and goods transport binding',
          'Folding beds (charpai), camp cots, garden furniture, and sofa webbing support',
          'Industrial machine component binding and pipe bundle wrapping',
          'Agricultural produce baling and heavy sack mouth reinforcement',
        ],
        notSuitedFor: [
          'High-speed automated packaging machines',
          'Direct exposure to strong chemical battery acid baths',
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
          { question: 'What widths of niwar are available in stock?', answer: 'Available in 25mm (1"), 38mm (1.5"), 50mm (2"), and 75mm (3") widths in 25m, 50m, and 100m bundles.' },
          { question: 'Is this suitable for outdoor truck cargo tie-down?', answer: 'Yes, our heavy nylon and reinforced cotton weaves withstand heavy wind vibration, sun exposure, and rough rope tie-down usage.' },
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
        tradeAliases: 'Strapping Clips, Metal Patti Kundi, Pusher Seals, Open Flange Strapping Seals, Serrated PET Strapping Clips, Steel Packing Patti Kundi',
        shortDescription: 'High-strength galvanized steel strapping seals, serrated wire buckles, and patti kundi clips designed for leak-free, non-slip joint clamping on PP and PET strapping.',
        longDescription: 'Engineered from heavy-gauge galvanized cold-rolled steel to guarantee maximum joint efficiency under high tension. Tahira Syndicate metal strapping seals and clips feature interior serrations and aggressive crimping profiles that bite firmly into manual PP and PET bands, preventing strap slippage under severe freight impacts across Pakistan.',
        metaTitle: "Galvanized Metal Strapping Seals & Patti Kundi Karachi",
        metaDescription: "Heavy-duty galvanized steel metal strapping seals and open serrated clips (patti kundi) in Karachi. Extreme crimp grip for PP and PET plastic strapping bands.",
        usage: 'Manual strapping crimp sealing, corrugated carton reinforcement, pallet cargo locking, and heavy bale closure.',
        benefits: [
          'Aggressive interior teeth bite deeply into plastic straps, preventing joint slippage under dynamic transit shock.',
          'Zinc electro-galvanized coating resists rust and prevents unsightly rust stains on export cartons.',
          'Precision pre-bent open-flange wings allow fast, one-handed placement onto tensioned straps.',
          'Tested to deliver up to 85% of parent strap breaking strength when crimped with double-notch sealers.',
        ],
        suitedFor: [
          'Manual PP strapping closure on export cartons and wooden crates',
          'Heavy PET strap clamping on brick pallets, chemical drums, and machinery',
          'Corrugated container reinforcement in sea cargo shipping',
          'Textile bale and compressed yarn bundle joint securing',
        ],
        notSuitedFor: [
          'Friction welding tools (designed strictly for manual crimping sealers)',
          'Acid vat immersion without secondary protective coating',
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
        faqs: [
          { question: 'What sizes do these seals fit?', answer: 'Manufactured for standard 12mm (1/2"), 15mm (5/8"), and 19mm (3/4") PP and PET strapping bands.' },
          { question: 'What is the packing quantity?', answer: 'Supplied in boxes of 1,000 pieces or master burlap sacks of 5,000 pieces for large industrial consumers.' },
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
        metaDescription: 'Factory direct supplier of agricultural shade nets (hara parda), construction safety nets, anti-bird netting, sports turf nets & marine fishing nets in Karachi, Pakistan.',
        description: 'Tahira Syndicate is a master wholesale distributor and fabricator of industrial, agricultural, and commercial netting in Karachi. Dispatched directly from our Bohrapir warehouse and SITE Area rigging yard, our inventory covers UV-stabilized green and multi-color shade nets (hara parda) for nurseries and car parking, certified fall-arrest construction safety nets (scaffolding jaal), translucent anti-bird pigeon netting, heavy-ply cricket practice and futsal turf nets, knotted marine fishing nets for deep-sea trawlers, and heavy synthetic cargo containment nets for transport trucks. All nets are available in standard factory rolls (2m to 6m widths) or custom-fabricated dimensions with reinforced border ropes and brass tie grommets.',
      },
      create: {
        name: 'Nets & Netting',
        slug: 'nets',
        image: '/uploads/categories/nets.jpeg',
        status: 'Active',
        metaTitle: 'Wholesale Nets & Netting Supplier Karachi | Tahira Syndicate',
        metaDescription: 'Factory direct supplier of agricultural shade nets (hara parda), construction safety nets, anti-bird netting, sports turf nets & marine fishing nets in Karachi, Pakistan.',
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
        tradeAliases: 'Hara Parda, Green Agro Net, Greenhouse Shade Jaal, Chhat Ki Jali, Nursery Shade Sheet, 75% 90% Hara Jaal, Green Greenhouse Net',
        shortDescription: 'UV-stabilized virgin HDPE green shade net manufactured in 50%, 75%, and 90% shade densities for agricultural polyhouses, commercial plant nurseries, and rooftop heat insulation across Pakistan.',
        longDescription: 'Engineered from 100% prime virgin high-density polyethylene (HDPE) compounded with ultra-violet light stabilizers. Tahira Syndicate\'s agricultural green shade nets (hara parda) protect delicate horticultural crops, vegetables, and ornamental nurseries from intense solar heat, moisture loss, and hailstorm damage. Widely deployed across Karachi, interior Sindh, and Punjab farmlands, as well as residential and commercial rooftop thermal shielding.',
        metaTitle: "Agricultural Green Shade Net Wholesale Karachi | 80%",
        metaDescription: "Heavy-duty 50% to 80% green shade nets wholesale in Karachi, Pakistan. UV-stabilized HDPE mesh for agriculture, greenhouse crops, and nursery heat protection.",
        usage: 'Greenhouse crop shading, commercial nursery protection, home terrace and rooftop heat reduction, cattle shed cooling, and building facade screening.',
        benefits: [
          'High UV stabilization guarantees multi-year outdoor durability under intense Pakistani summer sun.',
          'Knitted lock-stitch pattern prevents unraveling when cut to custom lengths.',
          'Reduces indoor and ground temperatures by up to 8°C–10°C.',
          'Protects crops against birds, hail, and high-velocity wind damage.',
        ],
        suitedFor: [
          'Agricultural polyhouses, shadehouses, and horticulture nurseries',
          'Rooftop and balcony residential heat insulation',
          'Poultry farms and dairy shed temperature management',
          'Commercial building exterior privacy shielding',
        ],
        notSuitedFor: [
          'Heavy construction personnel fall arrest (requires high-impact knotted safety nets)',
          'Sub-surface water drainage filtering',
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
        faqs: [
          { question: 'What shade densities are best for Karachi heat?', answer: '75% is standard for plant nurseries and general gardens, while 90% is recommended for rooftop heat reduction and car parking.' },
          { question: 'What standard roll widths are available?', answer: 'Supplied in 2m, 3m, 4m, and 6m widths by 50m lengths.' },
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
        tradeAliases: 'Car Parking Shade Net, Tan Beige Netting, Blue Commercial Shade Net, Striped Canopy Net, School Ground Parda, Architectural Shade Fabric',
        shortDescription: 'High-density architectural shade netting available in Tan/Beige, Royal Blue, Green/White Striped, and Terracotta colors for car parking canopies, schools, and outdoor commercial venues.',
        longDescription: 'Formulated for architectural aesthetic appeal and thermal comfort. Tahira Syndicate\'s colored shade nets deliver up to 95% UV blockage while allowing cool breezes to circulate freely. Widely specified for corporate office car parking structures, private residential carports, school sports grounds, swimming pool verandas, and outdoor restaurants across Karachi and Islamabad.',
        metaTitle: "Commercial Colored Shade Net Wholesale Karachi",
        metaDescription: "Commercial grade beige and blue shade net mesh rolls in Karachi. Heavy-duty UV sun protection for parking lots, building rooftops, and outdoor canopy venues.",
        usage: 'Automobile parking shades, school sports grounds, restaurant outdoor patios, swimming pool pergolas, and decorative privacy barriers.',
        benefits: [
          'High visual appeal matching modern architectural building exterior facades.',
          'Blocks harmful UV rays while eliminating trapped heat underneath canopies.',
          'Mildew-resistant virgin polymer that does not fade, rot, or absorb water.',
          'Available in fabricated panels with perimeter webbing and brass grommets.',
        ],
        suitedFor: [
          'Corporate and residential car parking canopies',
          'School playgrounds and assembly grounds',
          'Resort verandas and outdoor cafe dining areas',
          'Pergolas, patios, and courtyard overhead shades',
        ],
        notSuitedFor: [
          'Deep agricultural cultivation requiring specialized photosynthetic light spectrums',
          'Heavy mechanical lifting',
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
        faqs: [
          { question: 'Does colored shade net waterproof against rain?', answer: 'Shade net is a porous knitted breathable mesh designed for air circulation and sun shade. For 100% waterproof coverage, see our PVC and HDPE Tarpaulins.' },
          { question: 'What colors are in stock?', answer: 'Tan/Beige, Royal Blue, Green/White Striped, and Terracotta.' },
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
        tradeAliases: 'Construction Safety Jaal, Fall Arrest Net, Scaffolding Debris Net, Building Safety Mesh, Heavy Duty Industrial Jaal, Dhalai Safety Net',
        shortDescription: 'High-tenacity knotted polypropylene and nylon safety nets engineered for high-rise construction fall-arrest and debris containment with certified border ropes across Pakistan.',
        longDescription: 'Compliant with industrial safety standards, Tahira Syndicate\'s construction fall-arrest nets are manufactured from heavy braided polyamide nylon or high-tenacity polypropylene. Featuring knotless or double-knotted diamond mesh reinforced with 10mm to 12mm perimeter border ropes, these nets are designed to catch falling personnel and tools on high-rise building projects, bridge construction, and scaffolding towers in Karachi, Lahore, and Islamabad.',
        metaTitle: "Construction Fall-Arrest Safety Net Karachi (Jaal)",
        metaDescription: "Certified high-tenacity nylon construction safety nets in Karachi, Pakistan. Heavy-duty border ropes for multi-story fall-arrest and scaffolding protection.",
        usage: 'Scaffolding perimeter fall-arrest, floor opening edge protection, bridge construction safety containment, and falling tool/debris interception.',
        benefits: [
          'High shock energy absorption rating certified for human personnel fall arrest.',
          'Heavy 12mm boundary rope with spliced eyelets allows fast scaffolding tie-off.',
          'Resistant to UV degradation, construction mortar splash, and chemical contaminants.',
          'Available with secondary micro-debris mesh overlay to catch small hand tools and screws.',
        ],
        suitedFor: [
          'High-rise commercial and residential tower construction',
          'Flyover, bridge, and motorway infrastructure civil works',
          'Industrial warehouse roofing installation',
          'Scaffolding staging and facade renovation',
        ],
        notSuitedFor: [
          'Lightweight mosquito screening',
          'Direct contact with welding torch sparks without fire-retardant specification',
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
        faqs: [
          { question: 'What mesh size is used for human fall arrest?', answer: '100mm square mesh made with 4mm to 6mm cordage is standard for human fall arrest, combined with 12mm border rope.' },
          { question: 'Can these nets be customized to custom bay sizes?', answer: 'Yes, our SITE Karachi rigging workshop fabricates custom dimensions to exact floor opening and scaffolding measurements.' },
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
        tradeAliases: 'Kabootar Jaal, Anti-Bird Net, Pigeon Safety Net, Bird Spikes Mesh, Balcony Safety Net, Monofilament Bird Netting',
        shortDescription: 'High-transparency UV-stabilized nylon and HDPE monofilament netting engineered to permanently block pigeons, sparrows, and crows from residential balconies and commercial facades.',
        longDescription: 'The ultimate humane, durable, and unobtrusive solution to urban bird pest nuisance in Karachi. Tahira Syndicate\'s Anti-Bird Nets are extruded from crystal-clear monofilament polymer or high-tenacity black nylon yarn. Designed to resist bird pecking and clawing while maintaining almost invisible optical aesthetics from ground level, preserving the aesthetic appearance of residential flats, hotels, and corporate offices.',
        metaTitle: "Anti-Bird & Pigeon Protection Net Wholesale Karachi",
        metaDescription: "Durable HDPE anti-bird and pigeon barrier nets in Karachi. Lightweight, transparent aesthetic mesh protecting warehouses, balconies, and crops across Pakistan.",
        usage: 'Balcony pigeon exclusion, air conditioner compressor outdoor units, residential window ducts, warehouse ceiling rafters, and historical monument facade bird protection.',
        benefits: [
          'Nearly invisible optical profile preserving exterior building aesthetics.',
          'UV-treated monofilament does not crack, stretch, or degrade in seaside air.',
          'Humane barrier preventing bird nesting without harming or trapping birds.',
          'Resistant to rain, mold, and corrosive bird droppings.',
        ],
        suitedFor: [
          'Residential apartment balconies in Clifton, DHA, Gulshan, and North Nazimabad',
          'Commercial office building AC service ducts',
          'Industrial food processing plant warehouse ceilings',
          'Hospital and hotel open courtyards',
        ],
        notSuitedFor: [
          'Heavy construction personnel fall arrest',
          'Heavy freight cargo lashing',
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
        faqs: [
          { question: 'Will this net block sunlight or ventilation into my balcony?', answer: 'No, with a 15mm–25mm fine mesh, it allows 99% light and natural air circulation while completely blocking birds.' },
          { question: 'How is it mounted onto walls?', answer: 'Using stainless steel wire anchors, eyelet hooks, and cable zip-ties around the perimeter.' },
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
        tradeAliases: 'Cricket Net, Box Cricket Jaal, Futsal Turf Net, Football Goal Net, Sports Ground Netting, Golf Impact Net, Tennis Court Mesh',
        shortDescription: 'Heavy-ply braided nylon and knotted HDPE sports perimeter and practice netting engineered to withstand high-velocity cricket leather balls, futsal turf strikes, and outdoor weather across Pakistan.',
        longDescription: 'Engineered for intensive sports impacts across cricket academies, box cricket arenas, futsal artificial turfs, and school sports stadiums. Tahira Syndicate sports nets are fabricated from multi-ply braided high-tenacity nylon or high-density polyethylene. The tight knotted square mesh resists leather cricket ball seam cuts, high-velocity football impacts, and seasonal weather exposure without sagging or tearing.',
        metaTitle: "Sports Pitch & Box Turf Net Wholesale Karachi",
        metaDescription: "High-impact nylon sports netting for cricket practice pitches, box leagues, and football enclosures in Karachi, Pakistan. Knotted construction for durability.",
        usage: 'Cricket academy batting practice cages, commercial box cricket arenas, futsal and football boundary netting, and rooftop sports arena enclosures.',
        benefits: [
          'Immense impact resistance halts 140+ km/h leather cricket balls safely without yarn breakage.',
          'Square mesh geometry prevents balls from slipping through or lodging in mesh joints.',
          'UV-stabilized resin treatment allows year-round outdoor installation without brittleness.',
          'Available in continuous perimeter rolls or pre-hung boxed enclosures.',
        ],
        suitedFor: [
          'Cricket coaching academies and practice net enclosures',
          'Commercial Box Cricket turf complexes across Karachi and Lahore',
          'Futsal artificial turf arenas and football goal nets',
          'School, college, and university sports grounds',
        ],
        notSuitedFor: [
          'Fine bird exclusion (requires 15mm micro mesh)',
          'Chemical acid bath immersion',
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
        faqs: [
          { question: 'What mesh size is used for cricket practice?', answer: '45mm square mesh made from heavy braided multi-ply nylon cord is standard for leather cricket balls.' },
          { question: 'Can you supply a full 3-sided enclosed cricket box net?', answer: 'Yes, we fabricate complete ready-to-hang box enclosures with roof and side walls to your exact pitch dimensions.' },
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
        tradeAliases: 'Machli Ka Jaal, Fishing Net, Marine Trawl Net, Nylon Gill Net, Monofilament Fishing Mesh, Trawler Rigging Net, Aquaculture Net',
        shortDescription: 'Industrial-grade knotted nylon monofilament and multifilament marine fishing netting designed for deep-sea trawlers, coastal gill netting, and aquaculture fish farms in Karachi and Balochistan.',
        longDescription: 'Directly serving the coastal maritime trade across Karachi Fish Harbour, Korangi Creek, Gwadar, and Pasni. Tahira Syndicate supplies high-tenacity marine fishing netting engineered for tough ocean currents, salt water immersion, and heavy fish catch loads. Manufactured from prime double-knotted nylon multifilament or high-tensile monofilament yarn with precision mesh consistency and abrasion-resistant selvage borders.',
        metaTitle: "Commercial Marine & Fishing Net Wholesale Karachi",
        metaDescription: "Commercial marine fishing nets and trawler gill nets in Karachi. High breaking strength, knot-stabilized nylon for deep-sea fleets and aquaculture fish farming.",
        usage: 'Deep-sea trawler nets, coastal marine gill netting, aquaculture fish farming pens, harbor debris skimmers, and marine boat rigging.',
        benefits: [
          'Double-knotted diamond mesh prevents knot slippage under heavy catch weight.',
          'High saltwater and marine algae resistance prevents fiber rotting.',
          'Superior wet tensile strength maintains elasticity under turbulent waves.',
          'Available in diverse twine plies and mesh sizes matching specific fish species.',
        ],
        suitedFor: [
          'Deep-sea commercial fishing boats and trawlers',
          'Coastal marine gill netting and cast netting',
          'Aquaculture fish ponds and shrimp farm containment',
          'Maritime vessel rope and safety netting',
        ],
        notSuitedFor: [
          'High-rise building fall arrest (not certified for human fall safety loads)',
          'Agricultural nursery shade',
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
        faqs: [
          { question: 'What types of netting are available for fishermen?', answer: 'We stock nylon multifilament knotted nets, monofilament gill nets, and heavy polyethylene trawler mesh.' },
          { question: 'Do you supply lead line and floats with the netting?', answer: 'Yes, we supply complete fishing accessories including sinker lead ropes, marine floats, and rigging twines.' },
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
        tradeAliases: 'Truck Daala Jaal, Cargo Lashing Net, Container Safety Net, Truck Bed Webbing Net, Daala Cover Net, Luggage Mesh Net',
        shortDescription: 'Heavy-duty polypropylene and polyester cargo containment netting engineered to lash down loose luggage, agricultural sacks, cartons, and industrial goods on flatbed trucks and shipping containers.',
        longDescription: 'Designed for the demanding freight corridors between Karachi Port, Maripur Truck Stand, Superhighway, and nationwide logistics routes. Tahira Syndicate\'s truck bed cargo nets (daala jaal) prevent cargo spillage, load shifting, and transport loss on rough national highways. Fabricated from high-strength 4mm to 8mm polypropylene cordage or wide polyester webbing with heavy perimeter border ropes for fast, secure lashing.',
        metaTitle: "Cargo Containment & Truck Bed Net Wholesale Karachi",
        metaDescription: "Heavy-duty cargo containment and open truck bed netting in Karachi, Pakistan. Elasticated perimeter ropes secure loose freight on transit routes nationwide.",
        usage: 'Securing loose cargo on Bedford trucks, multi-axle trailers, pickup beds, logistics delivery vans, open railway wagons, and shipping containers leaving Karachi ports.',
        benefits: [
          'High tensile load containment prevents cargo loss, highway accidents, and load displacement.',
          'Heavy 8mm–12mm border cordage and reinforced tie loops allow rapid hooking to truck chassis side-hooks.',
          'Weatherproof polypropylene and polyester fibers resist monsoon moisture, diesel grime, and intense road dust.',
          'Custom manufactured to fit all standard Pakistani truck body (daala) and container dimensions.',
        ],
        suitedFor: [
          'Long-haul freight truck beds (Bedford, Hino, Isuzu)',
          'Multi-axle flatbed container trailers',
          'Commercial pickup trucks (Hilux, Shahzore, Master)',
          'Open cargo transport & railway wagon containment',
        ],
        notSuitedFor: [
          'Fine grain filtering (combine with tarpaulin covers)',
          'Sub-surface fishing',
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
        faqs: [
          { question: 'What sizes are available for commercial Bedford and Hino truck bodies?', answer: 'We stock standard 14ft × 8ft, 18ft × 8ft, and 24ft × 8ft truck bed nets, and can custom fabricate any trailer length within 24 hours.' },
          { question: 'How is the cargo net secured to the truck body hooks?', answer: 'Each net features integrated perimeter border rope with heavy-duty corner tie loops that attach directly to truck side lashing points.' },
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

