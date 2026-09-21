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
      'We extrude polythene rolls at our Karachi plant. If you are casting a roof slab or laying basement flooring, our heavy Dhalai Plastic stops cement slurry from leaking through shuttering and seals out ground dampness. We also run packaging shopper thaan, milky doodhia sheets, and thick black liners to order.',
    longDescription:
      'When concrete is poured on wooden shuttering, wet cement slurry tends to seep out through gaps, weakening the cured slab. Putting down 300 to 600 gauge dhalai plastic first seals every gap and locks the moisture inside the mix where it belongs. We blow LDPE, LLDPE, and HDPE film from 1 foot up to 12 feet wide. Need 100 gauge for carton wrapping or 1200 gauge for basement foundations? We run both. Every roll gets weighed on calibrated electronic scales before leaving our Shahra-e-Liaquat shop or SITE warehouse.',
    bullets: [
      'Roof concrete casting & moisture barrier rolls (Dhalai / Chhat ka Plastic)',
      'Thickness made to order from 100 gauge (25 micron) to 1200 gauge (300 micron)',
      'Continuous tubular packaging rolls, shopper thaan & flat single-wound sheets',
      'Clear electronic weight slips stamped on every bundle before dispatch',
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
        description: 'Spread over shuttering before pouring concrete to keep cement slurry inside the slab and seal out moisture.',
      },
      {
        title: 'Pallet Wrapping & Warehouse Cargo Protection',
        description: 'Heavy plastic wrap and sheets that keep carton boxes dry and clean in transit and warehouse storage.',
      },
      {
        title: 'Agricultural Mulching & Farm Liners',
        description: 'UV-treated sheets spread over soil to hold moisture around plant roots and protect crops from harsh heat.',
      },
      {
        title: 'Chemical & Fertilizer Liner Bags',
        description: 'Tubular plastic sleeves heat-sealed into moisture-proof inner liners for 50kg fertilizer and chemical sacks.',
      },
    ],
    processSteps: [
      { title: 'Resin Selection', description: 'We weigh out virgin LDPE granules or high-strength recycled polymer blends to match your required gauge and flexibility.' },
      { title: 'Film Blowing & Gauge Control', description: 'The extruder melts and blows molten plastic into a continuous tubular bubble, checking wall thickness across the roll.' },
      { title: 'Cooling & Edge Slitting', description: 'High-velocity air rings cool the bubble before rotary blades slit the sides to make flat sheets or center-fold rolls.' },
      { title: 'Core Winding & Scale Check', description: 'The film winds tightly onto heavy paper cores. We weigh each roll on digital scales and stamp the exact weight slip.' },
    ],
    faqs: [
      {
        question: 'What gauge plastic is normally used for roof dhalai in Karachi?',
        answer: 'Most local contractors use 300 to 600 gauge black or doodhia sheets. It is thick enough that walking laborers will not puncture it, and it keeps cement water from draining through shuttering planks.',
      },
      {
        question: 'Can you extrude custom widths and gauges for our factory?',
        answer: 'Yes. We run custom widths from 12 inches up to 12 feet wide, in thicknesses from 100 gauge (25 micron) up to 1200 gauge (300 micron) at our Karachi plant.',
      },
      {
        question: 'Do you give certified weight slips with wholesale roll orders?',
        answer: 'Always. We weigh every roll on electronic scales at our Shahra-e-Liaquat Road counter or SITE warehouse so your invoice reflects exact scale weight.',
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
      'We fabricate and rig heavy waterproof tarpaulin canopies and sliding parda for factory yards, godowns, and truck bays. Karachi monsoons ruin cardboard packaging fast — our PVC and HDPE covers keep goods dry without the cost and delay of building permanent roofs.',
    longDescription:
      'Pouring concrete roofs over loading docks takes months and costs a fortune. Our waterproof tarpaulin canopies get the job done in days. We use 350 to 750+ GSM PVC fabric and cross-laminated HDPE with heat-welded seams so water cannot leak through. Our riggers set up steel wire ropes, turnbuckles, and sliding track curtains that your warehouse crew can pull open whenever cargo trucks pull in.',
    bullets: [
      'Loading bays & warehouse truck docks (Sliding Tarpal Parda)',
      'Open factory yards & raw material storage godowns',
      'Heavy-duty 100% waterproof PVC & cross-laminated HDPE sheets',
      'Rigid steel frame anchoring, cable rigging & turnbuckle tensioning',
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
        description: 'Drop curtains and overhead canopies that keep goods dry while staff load and unload trucks in the rain.',
      },
      {
        title: 'Extra Godown & Yard Storage',
        description: 'Turning open factory yards into dry, protected storage for boxes, polymer sacks, and steel drums.',
      },
      {
        title: 'Outdoor Machinery Covers',
        description: 'Custom-tailored tarpaulins protecting plant equipment and generator sets from sun and heavy rain.',
      },
      {
        title: 'Grain & Crop Procurement Yards',
        description: 'Wide canopy covers over grain sorting yards, cotton ginning setups, and truck weighbridge scales.',
      },
    ],
    processSteps: [
      { title: 'Site Survey & Sizing', description: 'Our team checks your wall anchors, roof slope, wind direction, and the clearance needed for cargo trucks.' },
      { title: 'Thermal Seam Welding', description: 'We heat-fuse wide tarpaulin sections using high-frequency welders so seams are 100% waterproof and will not pull apart.' },
      { title: 'Cable & Track Rigging', description: 'We anchor galvanized steel cables, pulleys, and overhead sliding tracks along the building structure.' },
      { title: 'Tensioning & Water Flow Test', description: 'We pull the canopy taut with heavy turnbuckles, checking that rainwater drains off freely without pooling.' },
    ],
    faqs: [
      {
        question: 'How do you stop rainwater from gathering on large flat canopies?',
        answer: 'We build a noticeable slope into the frame and run tight cross-cables under the tarpal. Water slides off immediately instead of collecting in heavy puddles.',
      },
      {
        question: 'Can you make sliding curtains that staff can pull aside for loading?',
        answer: 'Yes. We fit steel roller tracks with heavy-duty metal pulleys. Your staff can slide the parda back in seconds when a truck arrives and pull it shut when loading is finished.',
      },
      {
        question: 'How long does heavy PVC tarpaulin last under the Karachi sun?',
        answer: 'Our 550+ GSM commercial PVC fabric usually lasts 4 to 7+ years under direct sunlight and Karachi coastal weather.',
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
      'We stitch cotton canvas relief tents (tambus and khaimas) and heavy waxed moom jama tarpaulins in volume. Complete with double-stitched seams, solid brass eyelets, steel poles, and ground sheets for NGO relief missions, security checkpoints, and highway cargo trucks.',
    longDescription:
      'When floods or emergencies hit, relief camps need tough canvas shelters that will not tear in rough weather. We cut and stitch heavy cotton duck canvas and waxed moom jama right in our Karachi workshop. Our standard 4m × 4m and 5m × 4m family tents come ready with center poles, tie ropes, and ground pegs. For transport fleets, our moom jama covers keep open truckloads of wheat and cement completely dry on the highway.',
    bullets: [
      'Emergency relief tents for families (Relief Tambu / Khaima)',
      '100% waterproof cotton duck canvas & waxed Moom Jama sheets',
      'Heavy-duty truck & trailer cargo tarpaulins',
      'Supplied complete with steel center poles, ground pegs & tie ropes',
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
        title: 'Flood & Disaster Relief Camps',
        description: 'Family relief tents (khaima / tambu) supplied in bulk for disaster relief work and charity aid setups.',
      },
      {
        title: 'Long-Haul Truck Cargo Tarpal',
        description: 'Tough waxed canvas and moom jama sheets protecting grain, cement, and goods on highway trucks.',
      },
      {
        title: 'Field & Security Work Camps',
        description: 'Multi-person canvas tents with mosquito-mesh windows for remote construction and guard posts.',
      },
      {
        title: 'Outdoor Grain & Cotton Godown Covers',
        description: 'Breathable canvas tarpaulins covering outdoor wheat and cotton bails during harvest seasons.',
      },
    ],
    processSteps: [
      { title: 'Fabric Selection & Wax Inspection', description: 'We inspect heavy cotton duck canvas treated with water-resistant wax or rubberized PVC.' },
      { title: 'Pattern Cutting & Double-Stitching', description: 'Our tailors cut panels to size and double-lock every seam using heavy bonded nylon thread.' },
      { title: 'Eyelets & Guy Rope Points', description: 'We stamp solid brass eyelets and add reinforced canvas patches at all corner tension points.' },
      { title: 'Assembly Check & Packing', description: 'We test-pitch sample tents, pack the steel poles and ground stakes, and bundle them into durable carry bags.' },
    ],
    faqs: [
      {
        question: 'What are the standard dimensions for an emergency relief tent?',
        answer: 'Our most popular family tents are 4m × 4m (160 sq ft) and 5m × 4m, easily fitting 6 to 8 people. They include a steel ridge pole, sidewalls, mosquito-mesh windows, and a waterproof ground sheet.',
      },
      {
        question: 'Can you handle bulk orders for NGOs on short notice?',
        answer: 'Yes. We have our own stitching floor and large canvas rolls in Karachi, allowing us to deliver batches of 500 to 5,000+ relief tents quickly.',
      },
      {
        question: 'What is the practical difference between Moom Jama and PVC Tarpal?',
        answer: 'Moom Jama is waxed cotton canvas that breathes naturally, preventing moisture buildup inside grain sacks and tents. PVC tarpal is rubberized plastic that is completely impenetrable to driving rain.',
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
      'We spin and twist 3-strand Jahazi Rassa, nylon rassi, and packing sootli at our Karachi factory. We also hand-build wooden-rung rope ladders (Kaath Seerhi) for cargo ships, grain silos, and high-rise scaffolding access.',
    longDescription:
      'Our shop on Shahra-e-Liaquat Road has supplied ropes to Karachi maritime and industrial markets for over a decade. We twist 6mm to 32mm 3-strand polypropylene and nylon hawser coils right on our own machines. For ships docking at KPT or maintenance workers descending into industrial silos, our craftsmen hand-splice Kaath Seerhi ladders using grooved, non-slip hardwood rungs bound securely with marine cordage.',
    bullets: [
      '3-strand Jahazi Rassa (hawser) & braided nylon cordage',
      'Marine pilot boarding & Kaath Seerhi (wooden rope ladders)',
      'Access ladders for industrial silos, ship holds & scaffolding',
      'Seasoned hardwood rungs with grooved non-slip tread',
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
        title: 'Port & Ship Pilot Boarding',
        description: 'Handmade marine pilot ladders (Kaath Seerhi) for pilots and crew boarding cargo ships at KPT and Port Qasim.',
      },
      {
        title: 'Grain Silos & Storage Tank Inspection',
        description: 'Flexible drop-down rope ladders for engineers inspecting deep cement, flour, and chemical storage tanks.',
      },
      {
        title: 'Scaffolding & Emergency Exit Ladders',
        description: 'Quick-hanging rope ladders for building scaffolding access and emergency escape routes on job sites.',
      },
      {
        title: 'Truck Cargo Lashing & Mooring',
        description: 'Thick 3-strand Jahazi Rassa coils for tying heavy cargo on trucks and securing harbor barges.',
      },
    ],
    processSteps: [
      { title: 'Polymer Yarn Spinning', description: 'We extrude and spin high-tenacity polypropylene and nylon into balanced, high-strength yarns.' },
      { title: '3-Strand Rope Twisting', description: 'Yarns are twisted into even 3-strand hawser coils that resist kinking under heavy pulling loads.' },
      { title: 'Hardwood Step Milling', description: 'We cut seasoned hardwood rungs, drill counter-sunk rope holes, and carve anti-slip grooves on the stepping surface.' },
      { title: 'Hand Splicing & Whipping', description: 'Our craftsmen thread the rope, tie secure marine knots, and hand-whip each step tightly so it cannot shift.' },
    ],
    faqs: [
      {
        question: 'What lengths and step spacing do you make for Kaath Seerhi (rope ladders)?',
        answer: 'Standard ladders come in 20ft, 30ft, 50ft, and 100ft lengths with 12-inch (300mm) rung spacing. We can also custom-build exact lengths to match your ship freeboard or tank depth.',
      },
      {
        question: 'What wood do you use for the ladder rungs?',
        answer: 'We use seasoned hardwood (Shisham or Acacia) treated to resist moisture and rot, ensuring the rungs will not crack under heavy worker loads.',
      },
      {
        question: 'Do you keep full rope coils in stock for immediate dispatch?',
        answer: 'Yes. We keep 100m, 200m, and 500m coils of 6mm to 32mm Jahazi Rassa ready at our shop for same-day delivery to Karachi Port, Port Qasim, or trucking terminals.',
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
      'We stock 50%, 75%, and 90% green shade net (Hara Parda) in 50-meter master rolls and custom-stitched sheets with border webbing and brass eyelets. Cuts ambient heat by 5°C to 10°C over plant nurseries, rooftop terraces, and car parking sheds.',
    longDescription:
      'Karachi summer heat can be brutal. Installing 90% green agro mesh (Hara Parda) blocks harsh sun radiation and makes open rooftops and driveways comfortable again. For agricultural nurseries and farm tunnels, 50% to 75% density lets through just the right amount of sunlight for crops to thrive. We sell full rolls from our Shahra-e-Liaquat Road counter and stitch custom sheets with heavy black border tape and brass eyelets for quick hanging.',
    bullets: [
      '50%, 75% & 90% sun-blocking density options (Hara Parda)',
      'Shade covers for plant nurseries, farm tunnels & vegetable patches',
      'Cooling canopies for car parking, rooftop lawns & outdoor cafes',
      'Full 50m factory rolls or custom-stitched sheets with brass eyelets',
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
        title: 'Plant Nurseries & Greenhouses',
        description: 'Shielding saplings, flowers, and vegetables from burning summer sun so they do not dry out.',
      },
      {
        title: 'Car Parking Sheds & Driveways',
        description: 'Tensioned parking canopies that protect vehicle paint and keep car interiors noticeably cooler.',
      },
      {
        title: 'Rooftops & Garden Seating',
        description: 'Creating cool, breezy shade over open terrace lawns, pool decks, and cafe sitting spaces.',
      },
      {
        title: 'Construction Site Dust Screening',
        description: 'Wrapping boundary fences around building sites to contain dust and provide privacy.',
      },
    ],
    processSteps: [
      { title: 'Density & Sizing Check', description: 'We help you choose 50%, 75%, or 90% density depending on whether you are shading crops or people, then take exact measurements.' },
      { title: 'Border Webbing & Eyelet Pressing', description: 'We stitch heavy-duty black webbing along the entire perimeter and punch solid brass eyelets every 1 to 2 feet.' },
      { title: 'Frame & Cable Rigging', description: 'Our team ties the net securely to iron pergolas, pipes, or guide wire cables using UV-resistant rope.' },
      { title: 'Tensioning', description: 'We pull the sheet taut so it looks clean, lets wind pass without violent flapping, and will not sag over time.' },
    ],
    faqs: [
      {
        question: 'Which shade density is best for plants versus car parking?',
        answer: 'For plant nurseries and crops, 50% to 75% shade gives plants the light they need without burning them. For car parking sheds, open rooftops, and outdoor seating, 90% density offers the best heat and UV reduction.',
      },
      {
        question: 'Can you stitch custom sheets with eyelets to match our frame?',
        answer: 'Yes. Give us your frame dimensions and we will cut the net, stitch reinforced black border tape all around, and press brass eyelets at 1-foot or 2-foot intervals.',
      },
      {
        question: 'What are the standard factory roll dimensions for Hara Parda?',
        answer: 'Standard rolls are 3 meters, 4 meters, 5 meters, or 6 meters wide by 50 meters long. We also cut custom lengths for contractors.',
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
      'We install durable nylon anti-bird net (Kabootar Jali) across apartment balconies, building duct shafts, and warehouse roofs. We use grade-304 stainless steel hooks and perimeter tension wires so pigeons stay out without rusting your walls or blocking fresh air.',
    longDescription:
      'Pigeons nesting on balcony railings and AC units create constant mess, bad odors, and health hazards. Our Kabootar Jali is made from thin, transparent monofilament that is barely noticeable from the ground, yet strong enough that birds cannot push through. Our crew drills grade-304 stainless steel anchor hooks, pulls a tight perimeter wire with mini turnbuckles, and fixes the net neatly so it stays taut for years.',
    bullets: [
      'Balcony Kabootar Jali & apartment ventilation duct shafts',
      'Warehouse rafter & factory roof pigeon exclusion',
      'Rust-free grade-304 stainless steel hooks, cable & turnbuckles',
      'Almost invisible from below with 95% light and airflow transmission',
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
        title: 'Home Balconies & Terraces',
        description: 'Keeping pigeons off balcony railings, ending bird mess and droppings while keeping your outdoor view clear.',
      },
      {
        title: 'Building Duct Shafts & AC Ledges',
        description: 'Sealing off ventilation shafts and AC outdoor unit ledges where pigeons roost and build nests.',
      },
      {
        title: 'Warehouse Steel Trusses & Rafters',
        description: 'Horizontal rafter netting that keeps birds from perching above finished goods and food storage bags.',
      },
      {
        title: 'Plaza Facades & Signage Cladding',
        description: 'Netting behind architectural exterior panels and billboard signs to keep building fronts clean.',
      },
    ],
    processSteps: [
      { title: 'Balcony Inspection & Measurement', description: 'We measure the opening and check the surface (concrete, tile, or marble) to select the right drill bits and plugs.' },
      { title: 'Stainless Anchor Installation', description: 'We drill and fit grade-304 stainless steel anchor hooks every 12 inches around the perimeter.' },
      { title: 'Perimeter Wire Tensioning', description: 'We string a stainless steel wire rope through the hooks and tighten it with turnbuckles until completely rigid.' },
      { title: 'Net Fixing & Clean Trim', description: 'We clip the mesh to the wire using stainless steel hog rings and trim off any excess netting for a clean finish.' },
    ],
    faqs: [
      {
        question: 'Will bird netting make my balcony dark or block the breeze?',
        answer: 'Not at all. The monofilament twine is ultra-thin and has a 95% open mesh area, so sunlight and natural air flow through freely while birds stay out.',
      },
      {
        question: 'Will the hooks and hardware rust in Karachi humid air?',
        answer: 'No. We strictly use grade-304 stainless steel hooks, coated wire, and nylon wall plugs. They will not rust or leave ugly stains on your walls.',
      },
      {
        question: 'Can pigeons get tangled or hurt in the netting?',
        answer: 'No. Because our crew pulls the net tight against a rigid perimeter cable, birds simply bounce off harmlessly and fly away.',
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
      'We manufacture 18 to 48 ply braided nylon and HDPE sports nets for cricket practice pitches, futsal turf grounds, and goal cages. Built thick and UV-treated so hard leather cricket balls and powerful kicks will not tear the mesh.',
    longDescription:
      'A hard leather cricket ball hit at pace will rip through cheap, thin netting in no time. That is why we weave 30 to 48 ply braided nylon and high-density HDPE netting with a tight 40mm mesh. We have supplied and installed practice tunnels and boundary nets for schools like Karachi Grammar School and private rooftop sports arenas across Karachi, complete with steel posts and suspension wire rigging.',
    bullets: [
      'Cricket batting practice cages & boundary nets (Cricket Jaal)',
      'Futsal turf arena perimeter & overhead ceiling netting',
      'Football, hockey & handball goalpost nets',
      'Heavy-duty gym divider curtains with weighted bottoms',
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
        title: 'Commercial Futsal Arenas',
        description: 'Complete ceiling, perimeter, and goal netting built to withstand continuous ball impacts without sagging.',
      },
      {
        title: 'Rooftop & Ground Cricket Practice Cages',
        description: 'Enclosed batting tunnels with dense 40mm mesh so fast leather balls stay safely contained.',
      },
      {
        title: 'School & College Sports Grounds',
        description: 'High boundary nets around basketball, volleyball, tennis courts, and football pitches.',
      },
      {
        title: 'Sports Hall Divider Curtains',
        description: 'Sliding track netting that divides large indoor multi-sport halls into separate play zones.',
      },
    ],
    processSteps: [
      { title: 'Ground Layout & Sizing', description: 'We measure cage dimensions, support pole positions, and suspension cable heights to plan the layout.' },
      { title: 'Net Weaving & Border Roping', description: 'We braid the net to your required ply and stitch a thick 8mm to 10mm border rope all around the edges.' },
      { title: 'Support Poles & Cable Setup', description: 'We install steel support posts, tension the galvanized overhead guide cables, and attach snap hooks.' },
      { title: 'Net Hanging & Tuning', description: 'We hang the net and adjust the tension so balls drop cleanly without bouncing dangerously back into the batsman.' },
    ],
    faqs: [
      {
        question: 'What ply do you recommend for leather cricket ball batting cages?',
        answer: 'We recommend 30-ply to 48-ply braided nylon or HDPE with a 40mm (1.5 inch) mesh. It easily takes repeated hits from fast bowlers without breaking.',
      },
      {
        question: 'Do you provide complete turnkey installation with steel pole structures?',
        answer: 'Yes. We take care of the entire job — from fabricating steel posts and stringing guide cables to hanging and securing the net across Karachi.',
      },
      {
        question: 'Can your futsal nets handle outdoor rooftop weather?',
        answer: 'Yes. Our virgin HDPE and treated nylon nets are completely waterproof and UV-stabilized, so they will not rot, absorb rain, or get brittle in the sun.',
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
      'We make heavy polypropylene and nylon safety nets (Safety Jaal) for high-rise scaffolding, elevator shafts, and worker fall protection. Available in factory rolls or installed on site by our experienced height rigging crew in Karachi.',
    longDescription:
      'Falling tools, brick pieces, and plaster chunks from high scaffolding are a major hazard on building sites. Our high-tenacity polypropylene and nylon safety jaal catches falling debris and protects workers on the ground. We weave custom sizes with thick 12mm to 16mm border tie ropes and provide heavy galvanized anchor bolts and turnbuckles so the net stays rigged tight and secure.',
    bullets: [
      'Scaffolding debris containment & worker protection (Safety Jaal)',
      'High-rise building fall protection & perimeter barrier nets',
      'Elevator shaft, stairwell & light well catch nets',
      'Heavy 12mm–16mm border tie ropes with galvanized anchors',
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
        title: 'Scaffolding & Facade Debris Catching',
        description: 'Wrapping external scaffolding to stop falling plaster chips, bricks, and tools from hitting pedestrians.',
      },
      {
        title: 'Elevator Shafts & Internal Voids',
        description: 'Catch nets placed inside elevator shafts and stair openings to protect workers during high-rise construction.',
      },
      {
        title: 'Factory & Warehouse Ceiling Protection',
        description: 'Under-roof net installations that protect floor workers and inventory from falling roof tiles or loose fittings.',
      },
      {
        title: 'Bridge & Flyover Cantilever Nets',
        description: 'Heavy netting extended outward over active roads during bridge and flyover construction.',
      },
    ],
    processSteps: [
      { title: 'Site Inspection & BOQ Review', description: 'We inspect the building elevation, anchor points, wind exposure, and required mesh density.' },
      { title: 'Custom Net Fabrication', description: 'We knot the net to size at our factory and stitch thick 12mm to 16mm boundary ropes on all four sides.' },
      { title: 'Anchor Bolting & Cable Rigging', description: 'Our riggers drill galvanized expansion bolts, string heavy steel guide cables, and tension them with turnbuckles.' },
      { title: 'Load Inspection & Handover', description: 'We conduct a thorough tension check and safety inspection before signing off on the installation.' },
    ],
    faqs: [
      {
        question: 'What mesh size is standard for scaffolding safety nets in Pakistan?',
        answer: 'For debris containment, 25mm × 25mm to 50mm × 50mm square mesh is standard. For heavier fall-arrest nets, we use a 75mm to 100mm knotted mesh made with 4mm to 6mm heavy cord.',
      },
      {
        question: 'Can you supply materials across Pakistan as well as install in Karachi?',
        answer: 'Yes. We ship safety net rolls and custom stitched sizes to contractors nationwide, and our rigging team handles on-site installations throughout Karachi and Sindh.',
      },
      {
        question: 'How do your nets hold up against Karachi salty coastal air?',
        answer: 'Our nets are made with UV-stabilized virgin polymer resin (300 to 500 KLY) that resists humid, salty sea air and harsh sunlight for 3 to 5+ years.',
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
