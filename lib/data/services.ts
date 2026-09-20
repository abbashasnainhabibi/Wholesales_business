export interface ServiceMedia {
  src: string
  alt: string
  poster?: string
  isVideo?: boolean
}

export interface ServiceSpec {
  label: string
  value: string
}

export interface ServiceFaq {
  question: string
  answer: string
}

export interface ServiceApplication {
  title: string
  description: string
}

export interface InstallationService {
  id: string
  slug: string
  eyebrow: string
  title: string
  tradeAlias: string
  description: string
  longDescription: string
  bullets: string[]
  specs: ServiceSpec[]
  inquiryText: string
  images: ServiceMedia[]
  applications: ServiceApplication[]
  processSteps: { title: string; description: string }[]
  faqs: ServiceFaq[]
  moqOrLeadTime?: string
  serviceArea?: string
}

export const installationServices: InstallationService[] = [
  {
    id: 'polythene-manufacturing',
    slug: 'polythene-manufacturing',
    eyebrow: 'Industrial Film & Packaging Extrusion',
    title: 'Custom Polythene & Plastic Film Manufacturing',
    tradeAlias: 'Chhat Ka Plastic • Dhalai Plastic Roll • Shopper Ka Thaan • Doodhia Sheet',
    description:
      'Direct blown-film extrusion and custom gauge polythene roll manufacturing (Chhat / Dhalai ka plastic roll, shopper thaan, and doodhia plastic sheeting) for industrial packaging, construction slab concrete underlay, moisture vapor barriers, and heavy-duty liner bags. Produced in virgin LDPE/LLDPE and high-tensile recycled blends in Karachi.',
    longDescription:
      'Tahira Syndicate operates advanced blown-film plastic extrusion lines in Karachi, manufacturing a wide spectrum of low-density polyethylene (LDPE), linear low-density (LLDPE), and high-density (HDPE) plastic rolls. From heavy-gauge construction concrete casting underlay (Dhalai / Chhat ka Plastic) that prevents moisture leaching into structural slabs, to continuous tubular packaging rolls, shopper thaan, and doodhia opaque sheeting, we supply commercial converters and construction contractors with certified micrometer gauge consistency and high puncture resistance.',
    bullets: [
      'Construction slab vapor & moisture barriers (Dhalai / Chhat ka Plastic)',
      'Custom gauge thickness from 100 gauge (25 micron) to 1200 gauge (300 micron)',
      'Continuous tubular rolls, shopper roll thaan & flat single-wound sheets',
      'Bulk pallet & jumbo roll dispatch with verified weighbridge slips',
    ],
    specs: [
      { label: 'Market & Trade Names', value: 'Chhat / Dhalai Ka Plastic Roll / Shopper Ka Thaan / Doodhia Polythene Sheet' },
      { label: 'Polymer Resin', value: '100% Virgin LDPE / LLDPE / High-Strength Recycled Blends' },
      { label: 'Roll Width Range', value: '1 Foot to 12 Feet (Up to 3.6m Continuous Width)' },
      { label: 'Gauge / Thickness', value: '100 Gauge (25 Micron) to 1200 Gauge (300 Micron)' },
      { label: 'Form Factors', value: 'Continuous Tubular Roll, Single-Wound Flat, Center-Fold (Gusseted)' },
      { label: 'Color / Transparency', value: 'Natural Crystal Clear, Doodhia Milky White & Heavy Black Carbon' },
      { label: 'Application Grade', value: 'Construction Concrete Underlay, Pallet Shrink Wrap & Heavy Liner Sacks' },
      { label: 'Packaging Format', value: '25kg, 50kg Rolls & Jumbo Master Rolls' },
    ],
    inquiryText: 'Hi Tahira Syndicate, I would like to get a quote for Custom Polythene & Plastic Film manufacturing in Karachi.',
    images: [
      {
        src: '/services/polythene-sheeting/polythene-sheeting-production-line-karachi.mp4',
        poster: '/services/polythene-sheeting/polythene-sheeting-production-line-karachi-poster.jpg',
        alt: 'Tahira Syndicate continuous polythene film and plastic sheeting extrusion production line in Karachi',
        isVideo: true,
      },
      {
        src: '/services/polythene-sheeting/blown-film-plastic-extrusion-line-karachi.mp4',
        poster: '/services/polythene-sheeting/blown-film-plastic-extrusion-line-karachi-poster.jpg',
        alt: 'Blown film extrusion machine manufacturing high-density plastic rolls and tubular sheets in Karachi',
        isVideo: true,
      },
    ],
    applications: [
      {
        title: 'Building Roof & Slab Concrete Casting (Dhalai Plastic)',
        description: 'Laid over roof shuttering before concrete pouring to lock in cement slurry hydration and create a permanent moisture barrier.',
      },
      {
        title: 'Industrial Pallet Wrapping & Export Cargo Liners',
        description: 'Tough tubular and flat plastic sheeting protecting palletized cartons from moisture and dust during transit.',
      },
      {
        title: 'Agricultural Mulching & Greenhouse Liners',
        description: 'UV-treated plastic sheeting to retain soil moisture, suppress weeds, and accelerate crop growth.',
      },
      {
        title: 'Chemical & Fertilizer Heavy Duty Liner Bags',
        description: 'Seamless tubular polythene sleeves converted into moisture-proof inner bags for 50kg woven sacks.',
      },
    ],
    processSteps: [
      { title: 'Polymer Formulation & Daana Blending', description: 'Formulating exact virgin and grade-A recycled polymer granules to meet tensile and gauge specs.' },
      { title: 'Blown-Film Extrusion & Gauge Control', description: 'Extruding molten polymer through precision annular circular dies with real-time micrometer thickness control.' },
      { title: 'Cooling, Corona Treatment & Slitting', description: 'Air-ring bubble stabilization, continuous cooling, and precision edge slitting.' },
      { title: 'Core Winding & Certified Weighing', description: 'Winding onto heavy kraft paper cores with verified gross/tare weight marking on every roll.' },
    ],
    faqs: [
      {
        question: 'What gauge is standard for construction roof dhalai / concrete casting in Karachi?',
        answer: 'For building roofs and ground floor foundation slabs, 300 gauge to 600 gauge black or doodhia polythene rolls are standard. They prevent cement water leakage and block underground rising dampness.',
      },
      {
        question: 'Can you produce custom widths and thicknesses to order?',
        answer: 'Yes! We manufacture custom widths from 12 inches up to 12 feet (single or center-folded) and thicknesses from 100 gauge (25 micron) up to 1200 gauge (300 micron) in our Karachi factory.',
      },
      {
        question: 'Do you provide certified weighbridge slips for bulk wholesale rolls?',
        answer: 'Yes. Every roll and consignment dispatched from our Shahra-e-Liaquat Road counter or SITE warehouse is weighed on calibrated electronic scales with gross, tare, and net weights certified.',
      },
    ],
    moqOrLeadTime: 'Standard Dhalai rolls in stock for immediate dispatch; custom extrusion runs in 2–4 business days.',
    serviceArea: 'Shahra-e-Liaquat Road, Bolton Market, SITE Area, Korangi, Landhi & all commercial centers across Pakistan.',
  },
  {
    id: 'tarpaulin-canopy',
    slug: 'tarpaulin-canopy',
    eyebrow: 'Industrial Sheds & Storage Coverage',
    title: 'Tarpaulin / Canopy Installation',
    tradeAlias: 'Tarpal Shed • Waterproof Godown Canopy • Loading Bay Parda • Tarpal Cover',
    description:
      'Heavy-duty waterproof tarpaulin canopies (Tarpal Shed & Godown Parda) fitted for loading docks, factory sheds, and open yard storage areas. Supplied and installed to size, built to hold up against heavy monsoon rains and daily loading traffic in Karachi.',
    longDescription:
      'Tahira Syndicate designs, custom-fabricates, and installs industrial-grade waterproof tarpaulin canopies and retractable side curtains (Tarpal Parda) across factory yards, loading docks, container staging zones, and commercial godowns in Karachi. Made from high-GSM multi-layer PVC-coated polyester and cross-laminated HDPE tarpaulin fabrics, our canopies provide cost-effective, rapid, and weather-proof storage cover without the massive expense and lead time of permanent civil construction.',
    bullets: [
      'Warehouse loading docks & dispatch bays (Tarpal Parda)',
      'Open factory storage yards & raw material godowns',
      'Heavy-duty 100% waterproof PVC / HDPE tarpaulin fabric',
      'Rigid steel frame anchoring & cable tension rigging',
    ],
    specs: [
      { label: 'Market & Trade Names', value: 'Waterproof Tarpal Shed / Godown Canopy / Loading Bay Parda' },
      { label: 'Material Grade', value: '100% Waterproof Heavy PVC Coated / HDPE Cross-Laminated' },
      { label: 'Fabric GSM', value: '350 GSM to 750+ GSM Heavy Commercial Grade' },
      { label: 'Reinforcement', value: 'Heat-Sealed Welded Seams & Heavy Nylon Hemmed Webbing' },
      { label: 'Eyelet Spacing', value: 'Heavy Brass / Aluminum Eyelets every 1 to 2 Feet' },
      { label: 'UV & Weathering', value: '100% Water Resistant with Anti-UV and Mold Stabilizers' },
      { label: 'Installation Rigging', value: 'Steel Cable Tensioning, Turnbuckles, Anchor Hooks & Clamps' },
      { label: 'Curtain Movement', value: 'Sliding Track Roller Hooks or Fixed Heavy Tension Rigging' },
    ],
    inquiryText: 'Hi Tahira Syndicate, I would like to get a quote for Tarpaulin / Canopy supply and installation in Karachi.',
    images: [
      {
        src: '/services/tarpaulin-canopy/tarpaulin-canopy-installation-karachi.mp4',
        poster: '/services/tarpaulin-canopy/tarpaulin-canopy-installation-karachi-poster.jpg',
        alt: 'Waterproof tarpaulin canopy installation and rigging for loading dock and storage yard in Karachi',
        isVideo: true,
      },
      {
        src: '/services/tarpaulin-canopy/waterproof-tarpaulin-canopy-shed-installation-karachi.jpg',
        alt: 'Heavy-duty waterproof tarpaulin canopy installed on commercial warehouse loading dock in Karachi',
      },
    ],
    applications: [
      {
        title: 'Factory Loading & Unloading Bays',
        description: 'Weatherproof drop curtains and overhead canopies keeping goods dry during active truck loading in heavy rains.',
      },
      {
        title: 'Temporary Godown Storage Expansions',
        description: 'Converting open concrete yards into dry, protected storage for corrugated boxes, plastic resins, and drums.',
      },
      {
        title: 'Commercial Plant Machine Covers',
        description: 'Custom fitted tarpaulin hoods protecting expensive outdoor industrial machinery from dust and rain.',
      },
      {
        title: 'Agricultural Crop Procurement Yards',
        description: 'Large-span canopy shelters over grain sorting, cotton ginning, and weighbridge areas.',
      },
    ],
    processSteps: [
      { title: 'Site Survey & Span Measurement', description: 'Evaluating wind exposure, drainage slope, support structures, and clearance heights.' },
      { title: 'High-Frequency Seam Welding', description: 'Thermal-welding multi-width tarpaulin panels for 100% leak-proof seam integrity.' },
      { title: 'Cable & Track Infrastructure Setup', description: 'Fixing heavy galvanized steel guide cables, pully rollers, or framework anchors.' },
      { title: 'Canopy Tensioning & Final Waterproof Check', description: 'Rigging and tensioning the tarpaulin sheet to prevent water pooling.' },
    ],
    faqs: [
      {
        question: 'How do you prevent rainwater from pooling on large tarpaulin canopies?',
        answer: 'Our installation crew designs proper gradient slope angles and tensions internal cross-cable support webbing so rainwater drains instantly without sagging the fabric.',
      },
      {
        question: 'Can you install sliding curtains (Tarpal Parda) that open and close for trucks?',
        answer: 'Yes! We fabricate sliding curtain track systems equipped with heavy-duty metal rollers, allowing warehouse staff to effortlessly slide the tarpaulin open during loading and lock it shut after hours.',
      },
      {
        question: 'What is the life expectancy of heavy PVC tarpaulin in Karachi?',
        answer: 'Our commercial 550+ GSM PVC tarpaulin canopies have an outdoor working life of 4 to 7+ years under continuous Karachi sun and monsoon conditions.',
      },
    ],
    moqOrLeadTime: 'Custom sheets ready in 24–48 hours; on-site canopy rigging scheduled within 48 hours.',
    serviceArea: 'Karachi (SITE, Korangi, Landhi, FB Area, Port Qasim, Hub) & Sindh industrial estates.',
  },
  {
    id: 'canvas-tents-tarpaulins',
    slug: 'canvas-tents-tarpaulins',
    eyebrow: 'Emergency Relief & Heavy Canvas Fabrication',
    title: 'Canvas Relief Tents & Heavy-Duty Tarpaulin Fabrication',
    tradeAlias: 'Heavy Tarpal Sheet • Moom Jama • Relief Tambu • Khaima • Truck Tirpal',
    description:
      'Direct fabrication and bulk supply of heavy cotton canvas emergency relief tents (Relief Tambu / Khaima), army field shelters, and waterproof truck tarpaulins (Tarpal / Moom Jama). Manufactured with double-stitched reinforced seams, heavy brass eyelets, guy ropes, and durable PVC groundsheets for disaster relief, camps, and logistics across Pakistan.',
    longDescription:
      'Tahira Syndicate specializes in large-scale fabrication and wholesale supply of heavy cotton duck canvas tents, disaster relief shelters (Tambu / Khaima), and commercial waterproof truck tarpaulins (Moom Jama). Engineered for NGOs, government disaster management authorities, military field operations, and interstate freight fleets, our tents provide robust shelter against harsh weather, heavy rain, and extreme temperature variations.',
    bullets: [
      'Disaster & emergency relief tents (Relief Tambu / Khaima)',
      '100% waterproof cotton canvas & waxed Moom Jama duck fabric',
      'Heavy-duty truck & trailer waterproof Tarpal sheets',
      'Complete steel frame structures, center poles & guy ropes',
    ],
    specs: [
      { label: 'Market & Trade Names', value: 'Heavy Truck Tarpal / Moom Jama (Waxed Canvas) / Relief Tambu / Disaster Khaima' },
      { label: 'Fabric Material', value: '100% Heavy Cotton Duck Canvas / PVC Rubberized Fabric' },
      { label: 'Fabric Weight / GSM', value: '350 GSM to 650 GSM Water & Rot Resistant Canvas' },
      { label: 'Tent Dimensions', value: 'Standard 4m × 4m, 5m × 4m Relief Tents / Custom Marquees' },
      { label: 'Groundsheet Liner', value: 'Heavy-Duty Waterproof PE / PVC Floor Underlay' },
      { label: 'Hardware & Guy Ropes', value: 'High-Tenacity PP Guy Ropes, Steel Ground Stakes & Center Poles' },
      { label: 'Weather Protection', value: 'Water-Repellent, Mildew-Resistant & UV-Treated' },
      { label: 'Seam Construction', value: 'Double-Stitched Heavy Nylon Thread with Water-Seal Taping' },
    ],
    inquiryText: 'Hi Tahira Syndicate, I would like to get a quote for Canvas Relief Tents and Waterproof Tarpaulin fabrication in Karachi.',
    images: [
      {
        src: '/services/tents-tarpaulins/canvas-tent-stitching-workshop-karachi.mp4',
        poster: '/services/tents-tarpaulins/canvas-tent-stitching-workshop-karachi-poster.jpg',
        alt: 'Industrial heavy canvas tent stitching workshop and waterproof relief shelter fabrication in Karachi - Tahira Syndicate',
        isVideo: true,
      },
      {
        src: '/services/tents-tarpaulins/relief-canvas-emergency-tent-pitched-karachi-1.jpg',
        alt: 'Heavy-duty A-frame canvas emergency relief tent pitched with guy ropes in Pakistan - Tahira Syndicate',
      },
      {
        src: '/services/tents-tarpaulins/waterproof-canvas-tarpaulin-bundles-karachi-2.jpg',
        alt: 'Folded green waterproof cotton canvas tarpaulin bundles ready for wholesale dispatch Karachi',
      },
      {
        src: '/services/tents-tarpaulins/heavy-duty-truck-tarpaulin-sheets-karachi-3.jpg',
        alt: 'Heavy black rubberized waterproof canvas tarpaulin sheets loaded for truck transport in Karachi',
      },
      {
        src: '/services/tents-tarpaulins/army-field-canvas-shelter-tent-karachi-4.jpg',
        alt: 'Military green and red heavy canvas field relief shelter tent fabricated in Karachi',
      },
    ],
    applications: [
      {
        title: 'Flood & Disaster Emergency Relief Camps',
        description: 'Rapid-deployment family relief tents (Khaima / Tambu) supplied in bulk to NGOs and relief agencies.',
      },
      {
        title: 'Long-Haul Freight Truck Cargo Tarpal',
        description: 'Heavy waterproof waxed canvas and PVC Moom Jama sheets to protect wheat, cement, and cargo on national highways.',
      },
      {
        title: 'Military & Security Field Base Camps',
        description: 'Durable multi-person tactical shelter tents with mosquito net windows and chimney outlets.',
      },
      {
        title: 'Agricultural & Grain Bulk Godown Covers',
        description: 'Heavy protective canvas tarpaulins covering outdoor wheat and cotton bails during seasonal storage.',
      },
    ],
    processSteps: [
      { title: 'Canvas Grading & Waterproof Proofing', description: 'Selecting heavy cotton duck fabric treated with water-repellent wax or PVC coating.' },
      { title: 'Pattern Cutting & Heavy Stitching', description: 'Precision cutting and double-stitching with rot-resistant bonded nylon threads.' },
      { title: 'Hardware & Eyelet Installation', description: 'Installing solid brass grommets, guy rope corner brackets, and pole socket reinforcements.' },
      { title: 'Inspection & Bulk Packing', description: 'Complete pitching test, bundling with steel pegs and poles, and protective bale wrapping.' },
    ],
    faqs: [
      {
        question: 'What is the standard family size relief tent specification?',
        answer: 'Our standard relief tent is 4m × 4m (160 sq ft) or 5m × 4m, accommodating 6 to 8 people. It features a center ridge pole, side walls, mosquito-net mesh windows, and a heavy waterproof groundsheet.',
      },
      {
        question: 'Can Tahira Syndicate handle bulk NGO emergency supply orders?',
        answer: 'Yes. With extensive inventory and scalable production in Karachi, we can fulfill emergency disaster response orders of 500 to 5,000+ relief tents on expedited schedules.',
      },
      {
        question: 'What is the difference between Cotton Canvas Moom Jama and PVC Tarpal?',
        answer: 'Waxed cotton canvas (Moom Jama) is breathable, heavy-duty, and tear-resistant, ideal for long-term tents and dry grain transport. PVC Tarpal is 100% impermeable plastic-coated fabric, ideal for harsh torrential rains.',
      },
    ],
    moqOrLeadTime: 'Standard truck tarpaulins in stock; relief tent batches produced in 3–7 business days.',
    serviceArea: 'Karachi, Sindh, Balochistan, KPK, Punjab & nationwide relief distribution points.',
  },
  {
    id: 'rope-products',
    slug: 'rope-products',
    eyebrow: 'Marine, Industrial & Rescue Access',
    title: 'Industrial Rope & Custom Cordage Manufacturing',
    tradeAlias: 'Jahazi Rassa • Kaath Seerhi • Pilot Rope Ladder • Plastic Rassi • Sootli',
    description:
      'Direct in-house manufacturing of 3-strand Jahazi Rassa (hawser rope), braided polypropylene cord, nylon plastic rassi, sootli twines, and custom Kaath Seerhi (rope ladders with seasoned wooden rungs) for marine pilot boarding, industrial silos, construction scaffolding, and rescue operations in Karachi.',
    longDescription:
      'Tahira Syndicate is a premier cordage and rope manufacturer headquartered in Shahra-e-Liaquat Road, Karachi. Operating high-speed yarn twisting, strand winding, and rope braiding machinery in our Karachi production facility, we produce industrial 3-strand hawser ropes (Jahazi Rassa), virgin polypropylene plastic rassi, nylon cords, and high-tensile packaging sootli. We also hand-craft certified marine pilot boarding ladders and industrial access rope ladders (Kaath Seerhi) featuring seasoned hardwood rungs, non-slip grooving, and reinforced spliced thimbles.',
    bullets: [
      'Custom 3-strand Jahazi Rassa & braided cordage',
      'Marine pilot boarding & Kaath Seerhi (rope ladders)',
      'Industrial silo, scaffolding & marine vessel access',
      'Hardwood seasoned rungs with non-slip grooved tread',
    ],
    specs: [
      { label: 'Market & Trade Names', value: 'Jahazi Rassa (Hawser) / Kaath Seerhi (Pilot Ladder) / Plastic Rassi / Sootli / Niwar' },
      { label: 'Rope Grade', value: 'High-Tenacity Virgin PP / Manila / Braided Polyamide Nylon 6' },
      { label: 'Rope Diameter', value: '6mm to 32mm 3-Strand Hawser / Heavy Braided Cord' },
      { label: 'Rung Material', value: 'Seasoned Hardwood / Treated Timber / Marine Grade Aluminum' },
      { label: 'Rung Spacing', value: '12 inches (300mm) Standard / Custom Pitch BOQ' },
      { label: 'Hardware & Clamps', value: 'Galvanized / Stainless Steel Thimbles, Shackles & Clamps' },
      { label: 'Load Capacity', value: 'Heavy-Duty Industrial Rating (Certified Up to 300+ kg Safe Working Load)' },
      { label: 'Coil Packaging', value: '100m, 200m, 300m Bundled Coils or Custom Cut-Lengths' },
    ],
    inquiryText: 'Hi Tahira Syndicate, I would like to get a quote for Custom Rope and Cordage manufacturing in Karachi.',
    images: [
      {
        src: '/services/rope-products/rope-yarn-spinning-spooling-karachi.mp4',
        poster: '/services/rope-products/rope-yarn-spinning-spooling-karachi-poster.jpg',
        alt: 'Direct factory rope yarn spinning, winding and cordage manufacturing in Karachi facility - Tahira Syndicate',
        isVideo: true,
      },
      {
        src: '/services/rope-products/rope-twisting-coiling-karachi.mp4',
        poster: '/services/rope-products/rope-twisting-coiling-karachi-poster.jpg',
        alt: 'Industrial 3-strand hawser rope twisting and coiling machine in Karachi facility - Tahira Syndicate',
        isVideo: true,
      },
      {
        src: '/services/rope-products/rope-ladder-assembly-karachi.mp4',
        poster: '/services/rope-products/rope-ladder-assembly-karachi-poster.jpg',
        alt: 'Hand assembly and knotting of heavy-duty rope ladder with wooden rungs in Karachi workshop',
        isVideo: true,
      },
    ],
    applications: [
      {
        title: 'Port & Marine Vessel Pilot Boarding',
        description: 'Certified marine pilot ladders (Kaath Seerhi) for safe vessel embarkation at Karachi Port (KPT) and Port Qasim.',
      },
      {
        title: 'Industrial Grain Silos & Chemical Tank Inspection',
        description: 'Flexible drop-down rope ladders allowing maintenance engineers to enter and inspect deep vertical storage tanks.',
      },
      {
        title: 'High-Rise Construction Scaffolding Access',
        description: 'Rapid-deployment secondary emergency escape ladders for facade scaffolding structures.',
      },
      {
        title: 'Heavy Logistics Mooring & Cargo Lashing',
        description: '3-strand Jahazi Rassa coils for truck freight tying, port barge mooring, and heavy crane slinging.',
      },
    ],
    processSteps: [
      { title: 'Polymer Extrusion & Yarn Twisting', description: 'Extruding high-tenacity polypropylene or nylon filament yarn into continuous strands.' },
      { title: 'Hawser 3-Strand Twisting', description: 'Precision machine-twisting strands into balanced, kink-free rope coils.' },
      { title: 'Hardwood Rung Milling & Grooving', description: 'Machining hardwood steps with non-slip grooves and counter-sunk rope holes.' },
      { title: 'Master Splicing & Hand Binding', description: 'Experienced craftsmen hand-knot and seize each rung with heavy whipping cord.' },
    ],
    faqs: [
      {
        question: 'What is the standard length and rung spacing for Kaath Seerhi (rope ladders)?',
        answer: 'Standard rope ladders are produced in 20ft, 30ft, 50ft, and 100ft lengths with 12-inch (300mm) rung pitch. We also fabricate custom lengths to match specific ship freeboards or industrial silo depths.',
      },
      {
        question: 'What type of wood is used for the ladder rungs?',
        answer: 'We use high-density seasoned hardwood (such as Shisham / Acacia) treated with protective sealant to ensure zero cracking under heavy industrial load.',
      },
      {
        question: 'Can you supply bulk rope coils directly to ship chandlers and logistics fleets?',
        answer: 'Yes. We supply 100m, 200m, and 500m coils of 6mm to 32mm Jahazi Rassa on same-day notice from our Shahra-e-Liaquat Road warehouse to Karachi Port, Port Qasim, and trucking terminals.',
      },
    ],
    moqOrLeadTime: 'Rope coils in stock for immediate dispatch; custom Kaath Seerhi ladders assembled in 24–48 hours.',
    serviceArea: 'Karachi Port, Port Qasim, SITE Area, Korangi, Hub & nationwide across Pakistan.',
  },
  {
    id: 'shade-nets',
    slug: 'shade-nets',
    eyebrow: 'Gardens, Farms & Shade Canopies',
    title: 'Green & Blue Shade Net Supply & Installation',
    tradeAlias: 'Hara Parda • Sabz Shade Jali • 50% 75% 90% Dhoop Net • Agro Mesh',
    description:
      '50% to 90% density UV-treated shade netting (Hara Parda & Sabz Jali) installed over garden nurseries, outdoor cafes, car parking sheds, and rooftop lawns. Supplied in full factory rolls or custom-stitched with reinforced webbing and brass eyelets to block harsh Karachi summer heat.',
    longDescription:
      'Tahira Syndicate manufactures and supplies commercial agro-shade mesh (popularly known as Hara Parda or Sabz Jali) in 50%, 75%, and 90% sun-blocking densities. Crafted from 100% virgin high-density polyethylene (HDPE) with heavy-duty UV stabilizers, our shade cloth cools ambient temperatures by 5°C to 10°C, protects crops from scorching heat and hail, and provides outdoor privacy for residential compounds, rooftop lounges, and commercial car parking shades across Karachi.',
    bullets: [
      '50%, 75% & 90% sun block density options (Hara Parda)',
      'Agricultural nursery, greenhouse & vegetable patch shading',
      'Car parking sheds, rooftop lawns & outdoor restaurant canopies',
      'Full roll supply or custom hemmed edges with brass eyelets',
    ],
    specs: [
      { label: 'Market & Trade Names', value: 'Hara Parda (50%, 75%, 90%) / Sabz Shade Jali / Agro Mesh / Dhoop Net' },
      { label: 'Material Grade', value: '100% Virgin HDPE Knitted Monofilament / Tape Yarn' },
      { label: 'Shade Factor', value: '50%, 75%, 85%, and 90% Sun & Light Block' },
      { label: 'Standard Roll Sizing', value: '3m, 4m, 5m & 6m Widths × 50m Lengths (Custom Lengths Available)' },
      { label: 'GSM / Weight', value: '90 GSM to 250 GSM Heavy Knitted Cloth' },
      { label: 'Fabrication Service', value: 'Custom Hemmed Edge Webbing with Heavy Brass / Aluminum Eyelets' },
      { label: 'Temperature Relief', value: '5°C to 10°C Ambient Heat & Radiation Reduction' },
      { label: 'Color Options', value: 'Forest Green, Deep Blue, Sand Beige, Black' },
    ],
    inquiryText: 'Hi Tahira Syndicate, I would like to inquire about Green & Blue Shade Net supply and installation.',
    images: [
      {
        src: '/services/shade-nets/green-shade-net-garden-canopy-karachi-1.jpg',
        alt: 'Green shade net canopy installed over garden patio and lawn Karachi',
      },
      {
        src: '/services/shade-nets/shade-net-reinforced-eyelets-karachi-2.jpg',
        alt: 'Folded green shade netting with reinforced black webbing and brass eyelets',
      },
      {
        src: '/services/shade-nets/agro-shade-net-factory-roll-karachi-3.jpg',
        alt: 'Factory roll of 75 percent green agro shade net for nursery protection',
      },
      {
        src: '/services/shade-nets/blue-shade-net-canopy-karachi-4.jpg',
        alt: 'Bundled UV-treated HDPE shade mesh nets ready for wholesale dispatch Karachi',
      },
    ],
    applications: [
      {
        title: 'Agricultural Nurseries & Greenhouses',
        description: 'Protecting delicate plants, ornamental saplings, and vegetable crops from scorching summer sun and heat stress.',
      },
      {
        title: 'Commercial & Residential Car Parking Sheds',
        description: 'Tensioned car parking canopies that protect vehicle paint and reduce interior cockpit temperatures.',
      },
      {
        title: 'Rooftop Lounges & Swimming Pools',
        description: 'Creating cool, shaded outdoor living areas on terrace roofs and poolside recreational decks.',
      },
      {
        title: 'Construction Site Dust & Visual Screening',
        description: 'Boundary perimeter fence wrapping for privacy and dust containment on urban development sites.',
      },
    ],
    processSteps: [
      { title: 'Density & Sizing Selection', description: 'Selecting appropriate shading factor (50%, 75%, 90%) and taking precise framework measurements.' },
      { title: 'Edge Webbing & Eyelet Fabrication', description: 'Stitching heavy black polyester perimeter webbing and crimping heavy brass eyelets.' },
      { title: 'Framework Rigging', description: 'Attaching shade netting to MS iron frames, pergola beams, or steel wire spans using UV-treated tie cords.' },
      { title: 'Tension Adjustment', description: 'Tensioning to ensure a taut, wrinkle-free canopy that sheds rainwater and resists wind flutter.' },
    ],
    faqs: [
      {
        question: 'Which shade percentage should I choose for plants versus car parking?',
        answer: 'For plants, nursery saplings, and agriculture, 50% to 75% shade is recommended. For car parking sheds, outdoor cafe seating, and rooftop lawns, 90% high-density Hara Parda provides maximum cooling and UV relief.',
      },
      {
        question: 'Can you supply custom-stitched shade net sheets with rings/eyelets?',
        answer: 'Yes! We custom-cut, hem the borders with heavy-duty black webbing tape, and install brass grommets/eyelets at 1-foot or 2-foot intervals to your exact BOQ dimensions.',
      },
      {
        question: 'What is the wholesale roll size of Hara Parda?',
        answer: 'Standard factory rolls are 3 meters, 4 meters, or 5 meters wide by 50 meters long. We also supply custom sliced widths and bulk contractor bundles.',
      },
    ],
    moqOrLeadTime: 'Full factory rolls dispatched same-day from Shahra-e-Liaquat Road; custom stitched sheets ready in 24 hours.',
    serviceArea: 'Karachi, interior Sindh, Balochistan, Punjab & all agro hubs across Pakistan.',
  },
  {
    id: 'bird-nets',
    slug: 'bird-nets',
    eyebrow: 'Commercial & Residential Pest Control',
    title: 'Anti-Bird Net Installation & Balcony Protection',
    tradeAlias: 'Kabootar Jali • Chiriya Net • Balcony Pigeon Mesh • Rooftop Parda',
    description:
      'Durable UV-stabilized nylon anti-bird mesh (Kabootar Jali & Chiriya Net) installed across apartment balconies, factory roofs, warehouse rafters, and duct shafts. Fixed firmly using stainless steel anchor hooks and tension wire to keep pigeons and birds out without blocking sunlight or ventilation.',
    longDescription:
      'Tahira Syndicate provides discreet, high-tensile anti-bird and pigeon exclusion netting systems for residential buildings, commercial plazas, hotels, food processing facilities, and industrial godowns across Karachi. Pigeons and birds cause significant property damage, health hazards, and aesthetic fouling in building light wells, AC compressor ledges, balcony railings, and warehouse steel trusses. Our Kabootar Jali is virtually invisible from a distance, highly durable, and installed with non-corrosive stainless steel fixtures.',
    bullets: [
      'Balcony Kabootar Jali & apartment duct shafts',
      'Industrial warehouse rafter & godown protection',
      'Rust-proof SS anchor hooks, wire rope & turnbuckles',
      'Discreet, 95% light transmission with zero ventilation loss',
    ],
    specs: [
      { label: 'Market & Trade Names', value: 'Kabootar Jali / Chiriya Net / Balcony Pigeon Parda' },
      { label: 'Material Grade', value: 'High-Density UV-Stabilized Monofilament Nylon / Polyethylene' },
      { label: 'Mesh Aperture', value: '19mm × 19mm (Sparrow/Small Birds) / 25mm × 25mm to 40mm (Pigeon)' },
      { label: 'Twine Thickness', value: '0.8mm to 1.5mm High-Transparency Monofilament' },
      { label: 'Anchoring Hardware', value: '304 Stainless Steel Hooks, Wire Cable & Aluminum Ferrules' },
      { label: 'Visibility', value: 'Discreet High-Clarity / 95% Natural Daylight Transmission' },
      { label: 'Service Life', value: '5+ Years Outdoor UV & Weather Durability' },
      { label: 'Cleaning & Washability', value: '100% Washable, Weather-Proof & Rot-Resistant' },
    ],
    inquiryText: 'Hi Tahira Syndicate, I would like to inquire about Bird Net installation in Karachi.',
    images: [
      {
        src: '/services/bird-nets/bird-net-installation-karachi-1.jpg',
        alt: 'White anti-bird protective net installed on high-rise apartment balcony Karachi',
      },
      {
        src: '/services/bird-nets/bird-net-balcony-protection-karachi-2.jpg',
        alt: 'Balcony railing with fine anti-bird mesh protecting against pigeons',
      },
      {
        src: '/services/bird-nets/bird-net-balcony-mesh-karachi-3.jpg',
        alt: 'High-rise balcony safety and bird protection mesh installed on outdoor railing',
      },
      {
        src: '/services/bird-nets/bird-net-building-structure-karachi-4.jpg',
        alt: 'Pigeon exclusion netting structure installed across building apartment facade',
      },
    ],
    applications: [
      {
        title: 'Residential Balconies & Terraces',
        description: 'Protecting home balconies from pigeon nesting, droppings, and bad odors while maintaining an open outdoor view.',
      },
      {
        title: 'Building Duct Shafts & AC Ledges',
        description: 'Sealing off deep vertical light shafts and air conditioning compressor niches where birds congregate.',
      },
      {
        title: 'Industrial Warehouse Steel Trusses',
        description: 'Horizontal rafter netting to prevent birds from perching above finished goods and food manufacturing lines.',
      },
      {
        title: 'Commercial Office Facades & Signage',
        description: 'Netting behind architectural cladding and billboard structures to preserve building facade cleanliness.',
      },
    ],
    processSteps: [
      { title: 'Balcony & Shaft Inspection', description: 'Measuring dimensions, assessing drilling substrates (concrete, marble, metal), and selecting mesh size.' },
      { title: 'Stainless Steel Frame Anchoring', description: 'Installing stainless steel anchor hooks along the perimeter at 1-foot intervals.' },
      { title: 'Cable Tensioning', description: 'Running a 304 SS perimeter wire rope and tensioning it with miniature turnbuckles.' },
      { title: 'Net Fastening & Trimming', description: 'Fixing the anti-bird mesh to the cable with stainless rings and trimming for a tight, invisible finish.' },
    ],
    faqs: [
      {
        question: 'Will anti-bird netting block fresh air or daylight in my balcony?',
        answer: 'No. Our high-transparency monofilament mesh has a 95% open area, allowing complete natural airflow and sunlight while remaining nearly invisible from street level.',
      },
      {
        question: 'Do your installation fixtures rust in Karachi’s humid coastal climate?',
        answer: 'We exclusively use grade-304 stainless steel anchor hooks, plastic plugs, and coated stainless perimeter wire to guarantee zero rusting and zero wall staining.',
      },
      {
        question: 'Can birds get trapped or injured in the net?',
        answer: 'Our nets are tightly tensioned during installation, creating a solid barrier that birds bounce off harmlessly without getting tangled.',
      },
    ],
    moqOrLeadTime: 'Immediate roll dispatch from Shahra-e-Liaquat Road; Karachi balcony installation within 24–48 hours.',
    serviceArea: 'Karachi (DHA, Clifton, Gulshan, PECHS, North Nazimabad, Bahria Town) & Sindh commercial zones.',
  },
  {
    id: 'sport-nets',
    slug: 'sport-nets',
    eyebrow: 'Sports Facilities & Turf Grounds',
    title: 'Sports Net Manufacturing & Ground Supply',
    tradeAlias: 'Cricket Pitch Jaal • Futsal Turf Ground Net • Goalpost Net',
    description:
      'Braided nylon and high-density HDPE netting (Cricket Jaal & Futsal Ground Net) manufactured in custom ply and mesh sizes for cricket practice pitches, futsal grounds, football goal cages, and indoor sports complexes. Built to withstand continuous hard ball impact and Karachi coastal weather.',
    longDescription:
      'Tahira Syndicate is Karachi’s trusted manufacturer and supplier of heavy-duty sports netting systems. From private rooftop cricket pitches and commercial futsal turf arenas to school sports complexes and sports club academies, we fabricate knotted and knotless sports nets engineered to absorb high-velocity ball impacts. We manufacture complete 3D batting practice cages, overhead roof containment nets, perimeter boundary barriers, and indoor gymnasium divider curtains.',
    bullets: [
      'Cricket batting pitch cages & boundary nets (Cricket Jaal)',
      'Futsal turf arena boundary & overhead ceiling nets',
      'Football, hockey & handball goalpost netting',
      'Heavy-duty nylon divider curtains with canvas weighted base',
    ],
    specs: [
      { label: 'Market & Trade Names', value: 'Cricket Pitch Jaal / Futsal Ground Net / Goalpost Netting' },
      { label: 'Material Grade', value: '100% Virgin High-Density HDPE / Braided Nylon 6' },
      { label: 'Mesh Aperture', value: '40mm × 40mm (Cricket/Futsal) & 100mm × 100mm (Goalpost)' },
      { label: 'Twine / Ply', value: '18 Ply (1.5mm) to 48 Ply (3.5mm) Braided' },
      { label: 'UV Stabilization', value: '5-Year Weather & Sun Exposure Rating' },
      { label: 'Roll / Cage Sizing', value: 'Standard 10ft × 10ft × 70ft Practice Pitch / Custom BOQ' },
      { label: 'Impact Durability', value: 'Fast Bowling & Hard Leather Ball Impact Tested' },
      { label: 'Edge Reinforcement', value: '8mm – 10mm Overlocked Border Cord on all edges' },
    ],
    inquiryText: 'Hi Tahira Syndicate, I would like to get a quote for Sports Netting manufacturing and supply in Karachi.',
    images: [
      {
        src: '/services/sport-nets/sports-net-futsal-turf-court-karachi-1.jpg',
        alt: 'Knotted green sports netting installed on futsal turf court Karachi',
      },
      {
        src: '/services/sport-nets/braided-sports-goal-net-ply-karachi-2.jpg',
        alt: 'Heavy white braided nylon sports goal net ply and knots inspection',
      },
      {
        src: '/services/sport-nets/football-ground-perimeter-netting-karachi-3.jpg',
        alt: 'Green sports perimeter boundary netting enclosing football ground',
      },
      {
        src: '/services/sport-nets/blue-indoor-sports-divider-net-karachi-5.jpg',
        alt: 'Blue indoor gymnasium divider curtain net with canvas skirt',
      },
    ],
    applications: [
      {
        title: 'Commercial Futsal Turf Arenas',
        description: 'Complete ceiling, sidewall, and goal cage netting that withstands non-stop ball rebounds without sagging.',
      },
      {
        title: 'Rooftop & Ground Cricket Practice Cages',
        description: 'Tunnel-style enclosed batting cages with dense mesh to ensure leather cricket balls never escape the practice zone.',
      },
      {
        title: 'School & University Sports Complexes',
        description: 'Perimeter barrier nets for multi-purpose basketball, tennis, and volleyball courts.',
      },
      {
        title: 'Indoor Sports Hall Divider Curtains',
        description: 'Track-mounted retractable divider curtains that split large sports arenas into independent practice zones.',
      },
    ],
    processSteps: [
      { title: 'Ground Measurement & Height Planning', description: 'Determining exact cage length, height, post span, and cable sag allowances.' },
      { title: 'Net Extrusion & Knotting', description: 'Braiding high-ply nylon or HDPE cordage with reinforced perimeter edges.' },
      { title: 'Steel Post & Wire Suspension Setup', description: 'Installing guy wire cables, turnbuckles, and carabiner clip attachments.' },
      { title: 'Net Rigging & Tension Tuning', description: 'Hanging and tensioning the net to eliminate loose sagging and ground gaps.' },
    ],
    faqs: [
      {
        question: 'Which ply is recommended for leather cricket ball batting cages?',
        answer: 'We recommend 30-ply to 48-ply braided nylon or HDPE cordage with a 40mm (1.5 inch) square mesh. This easily absorbs 140+ km/h fast bowling leather ball strikes without breaking.',
      },
      {
        question: 'Do you provide complete turnkey installation with steel pole structures?',
        answer: 'Yes, we supply complete turn-key solutions including steel pole fabrication, suspension wire rigging, and netting installation across Karachi and nearby cities.',
      },
      {
        question: 'Are your futsal nets water-resistant for outdoor rooftop venues?',
        answer: 'Our virgin HDPE and treated nylon nets are 100% waterproof and UV-stabilized, preventing water absorption, rot, and sun brittleness.',
      },
    ],
    moqOrLeadTime: 'Standard pitch kits in stock; custom ground layouts fabricated in 2–4 working days.',
    serviceArea: 'Karachi, Hyderabad, Sukkur, Hub, Quetta & nationwide across Pakistan.',
  },
  {
    id: 'safety-nets',
    slug: 'safety-nets',
    eyebrow: 'Construction & Building Safety',
    title: 'Safety Net Manufacturing & Site Installation',
    tradeAlias: 'Safety Jaal • Scaffolding Debris Net • Building Fall Protection Jaal',
    description:
      'High-tenacity polypropylene and polyamide nylon safety nets (Safety Jaal) manufactured for high-rise scaffolding, debris containment, and worker fall protection. Supplied in factory rolls or installed on site by our experienced rigging crew with heavy-duty anchors across Karachi.',
    longDescription:
      'Tahira Syndicate manufactures certified industrial safety netting engineered specifically for high-rise construction, civil engineering projects, elevator shafts, and structural renovation works across Karachi and Sindh industrial corridors. Produced with high-tenacity polypropylene (PP) and high-tensile polyamide nylon, our safety jaal provides dependable debris containment and worker fall protection in compliance with international safety protocols. We supply direct factory rolls or deploy our certified rigging team equipped with heavy-duty galvanized anchor brackets, tensioning wire ropes, and perimeter border cords.',
    bullets: [
      'Scaffolding debris containment (Safety Jaal)',
      'High-altitude fall protection & worker safety',
      'Elevator shaft, stairwell & light well coverage',
      'Heavy-duty border ropes & galvanized anchors',
    ],
    specs: [
      { label: 'Market & Trade Names', value: 'Safety Jaal / Scaffolding Debris Net / Building Protection Net' },
      { label: 'Material Grade', value: 'High-Tenacity Virgin Polypropylene (PP) / Polyamide Nylon' },
      { label: 'Mesh Aperture', value: '25mm × 25mm to 100mm × 100mm (Square Mesh)' },
      { label: 'Twine / Ply', value: '3.0mm – 6.0mm Braided Cord (45 to 90 Ply)' },
      { label: 'UV Resistance', value: '300–500 KLY UV Treated (Karachi Coastal Weather Tested)' },
      { label: 'Border Rope', value: '12mm – 16mm PP/Nylon Core Border Tie Rope' },
      { label: 'Tensile Capacity', value: 'Heavy Debris & Fall Containment Certified' },
      { label: 'Installation Hardware', value: 'Galvanized Expansion Bolts, Steel Wire Ropes, Turnbuckles' },
    ],
    inquiryText: 'Hi Tahira Syndicate, I would like to inquire about Safety Net manufacturing and installation in Karachi.',
    images: [
      {
        src: '/services/safety-nets/construction-scaffolding-safety-net-karachi-1.jpg',
        alt: 'Cantilevered construction scaffolding safety net on high-rise building Karachi',
      },
      {
        src: '/services/safety-nets/safety-net-installation-crane-team-karachi-2.jpg',
        alt: 'Installation crew rigging industrial safety net with crane lift in Karachi',
      },
      {
        src: '/services/safety-nets/industrial-canopy-safety-net-installation-karachi-3.jpg',
        alt: 'Worker in crane man-basket installing safety net under factory canopy',
      },
      {
        src: '/services/safety-nets/balcony-safety-containment-net-karachi-4.jpg',
        alt: 'Balcony safety net installation on stainless steel railing Karachi',
      },
    ],
    applications: [
      {
        title: 'High-Rise Scaffolding Debris Containment',
        description: 'Enclosing external facade scaffolding to catch falling plaster, brick chips, and construction tools.',
      },
      {
        title: 'Elevator Shaft & Stairwell Void Protection',
        description: 'Horizontal catch nets installed inside internal building voids to prevent fatal falls during core construction.',
      },
      {
        title: 'Industrial Warehouse Ceiling Protection',
        description: 'Under-roof net installations in production plants and godowns to protect personnel and inventory from falling tiles or fixtures.',
      },
      {
        title: 'Bridge & Flyover Cantilever Protection',
        description: 'Heavy perimeter net structures extended outward over active vehicular roadways during bridge construction.',
      },
    ],
    processSteps: [
      { title: 'Site Inspection & BOQ Assessment', description: 'Our engineering crew assesses height, wind loads, anchor points, and net aperture requirements.' },
      { title: 'Custom Netting Fabrication', description: 'Nets are knotted or braided in our factory with heavy perimeter boundary ropes.' },
      { title: 'Anchor Rigging & Tensioning', description: 'Riggers install galvanized expansion anchors, stainless wire ropes, and tension turnbuckles.' },
      { title: 'Load Test & Handover', description: 'Final tension check and safety certification inspection before project sign-off.' },
    ],
    faqs: [
      {
        question: 'What is the standard mesh size for construction scaffolding safety nets in Pakistan?',
        answer: 'For scaffolding debris containment, a 25mm × 25mm to 50mm × 50mm square mesh is standard. For heavy personnel fall-arrest catch nets, a 75mm to 100mm knotted mesh braided with 4mm to 6mm high-tenacity cords is used.',
      },
      {
        question: 'Can Tahira Syndicate provide both material supply and on-site rigging in Karachi?',
        answer: 'Yes. We provide both bulk roll/fabricated net delivery across Pakistan and turnkey on-site rigging services with experienced height-certified teams in Karachi and Sindh industrial zones.',
      },
      {
        question: 'How does coastal Karachi weather affect safety net lifespan?',
        answer: 'Our nets are manufactured with virgin UV-stabilized polymer resins containing 300 to 500 KLY stabilizers, resisting saline humidity and harsh sunlight for 3 to 5+ continuous years.',
      },
    ],
    moqOrLeadTime: 'Custom sizes dispatched in 24–48 hours; on-site installation scheduled within 48 hours.',
    serviceArea: 'Karachi (Shahra-e-Liaquat Road, SITE, Korangi, Port Qasim, Clifton, Bahria Town) & all Sindh / Balochistan industrial zones.',
  },
]

export function getServices(): InstallationService[] {
  return installationServices
}

export function getServiceBySlug(slug: string): InstallationService | undefined {
  return installationServices.find((s) => s.id === slug || s.slug === slug)
}

export function getRelatedServices(currentSlug: string, limit = 3): InstallationService[] {
  return installationServices.filter((s) => s.id !== currentSlug && s.slug !== currentSlug).slice(0, limit)
}
