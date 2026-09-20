import type { Metadata } from 'next'
import { ServicesPage } from '@/components/site-pages'
import { getCompanySettings, getProducts, getCategories } from '@/lib/api/crm'


export const metadata: Metadata = {
  title: 'Manufacturing, Custom Supply & Installation Services Shahra-e-Liaquat Road Karachi | Tahira Syndicate',
  description: 'Custom polythene film manufacturing, sports netting, construction safety nets, anti-bird mesh, agro shade nets (hara parda), rope ladders & tarpaulin canopy installation across Shahra-e-Liaquat Road, Bolton Market, Jodia Bazaar, SITE Area Karachi and Pakistan.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Manufacturing, Custom Supply & Installation Services Shahra-e-Liaquat Road Karachi | Tahira Syndicate',
    description: 'Custom polythene roll manufacturing, safety nets, sports nets, rope ladders, tarpaulin canopies, and on-site rigging across Shahra-e-Liaquat Road, Bolton Market, and Karachi, Pakistan.',
    type: 'website',
    url: 'https://tahirasyndicate.com/services',
    siteName: 'Tahira Syndicate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manufacturing, Custom Supply & Installation Services Shahra-e-Liaquat Road Karachi | Tahira Syndicate',
    description: 'B2B polythene film extrusion, netting manufacturing, rope ladders, tarpaulins, and installation for construction, sports, and industrial packing in Shahra-e-Liaquat Road & SITE Area Karachi.',
  },
}

export default async function Page() {
  const [settings, products, categories] = await Promise.all([
    getCompanySettings(),
    getProducts(),
    getCategories(),
  ])

  const serviceCatalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://tahirasyndicate.com/services#net-services',
    serviceType: 'Industrial Manufacturing, Net Fabrication & On-Site Installation',
    provider: {
      '@type': ['WholesaleStore', 'LocalBusiness', 'Manufacturer'],
      name: settings.name || 'Tahira Syndicate',
      telephone: settings.phone,
      url: 'https://tahirasyndicate.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressLocality: 'Karachi',
        postalCode: '74000',
        addressCountry: 'PK',
      },
    },
    areaServed: [
      { '@type': 'Place', name: 'Shahra-e-Liaquat Road' },
      { '@type': 'Place', name: 'Bolton Market' },
      { '@type': 'Place', name: 'Jodia Bazaar' },
      { '@type': 'Place', name: 'Saddar' },
      { '@type': 'Place', name: 'SITE Industrial Area' },
      { '@type': 'City', name: 'Karachi' },
      { '@type': 'AdministrativeArea', name: 'Sindh' },
      { '@type': 'Country', name: 'Pakistan' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Manufacturing, Netting Fabrication and Rigging Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Polythene & Plastic Film Manufacturing',
            alternateName: ['Chhat Ka Plastic', 'Dhalai Plastic Roll', 'Shopper Ka Thaan', 'Doodhia Polythene Sheet'],
            description: 'Direct blown-film extrusion and custom gauge polythene roll manufacturing (Chhat / Dhalai ka plastic, shopper roll, doodhia sheet) for industrial packaging, construction moisture barriers, and heavy-duty liner bags in Karachi.',
            keywords: 'chhat ka plastic, dhalai plastic roll, doodhia polythene sheet, construction vapor barrier, shopper roll',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tarpaulin / Canopy Installation',
            alternateName: ['Tarpal Shed', 'Godown Waterproof Canopy', 'Loading Bay Tarpal Parda'],
            description: 'Heavy-duty waterproof tarpaulin canopies (Tarpal Shed & Parda) fitted and rigged for loading docks, sheds, and open storage areas across Karachi.',
            keywords: 'tarpal parda, godown shed canopy, waterproof tarpaulin cover, tirpal',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Canvas Relief Tents & Heavy-Duty Tarpaulin Fabrication',
            alternateName: ['Tarpal Sheet', 'Moom Jama', 'Relief Tambu', 'Disaster Khaima', 'Truck Tirpal'],
            description: 'Direct fabrication and bulk supply of heavy cotton canvas emergency relief tents (Relief Tambu / Khaima), army field shelters, and waterproof truck tarpaulins (Tarpal / Moom Jama) across Pakistan.',
            keywords: 'tarpal, tirpal, moom jama, emergency relief tent, truck tarpaulin karachi, canvas tambu',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Industrial Rope & Custom Cordage Manufacturing',
            alternateName: ['Jahazi Rassa', 'Kaath Seerhi', 'Pilot Rope Ladder', 'Plastic Rassi', 'Sootli'],
            description: 'Direct in-house manufacturing of 3-strand hawser (Jahazi Rassa), braided polypropylene, nylon cords, sootli, and custom rope ladders (Kaath Seerhi) with wooden rungs for marine, industrial access, and rescue use in Karachi.',
            keywords: 'jahazi rassa, hawser rope, kaath seerhi, pilot ladder, nylon rassi, sootli',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Green & Blue Shade Net Supply & Installation',
            alternateName: ['Hara Parda', 'Sabz Shade Jali', 'Agro Shade Mesh', '50% 75% 90% Dhoop Net'],
            description: '50% to 90% density agro-shade mesh (Hara Parda & Sabz Jali) and garden patio canopy fabrication with reinforced webbing and brass eyelets.',
            keywords: 'hara parda, sabz jali, 75 percent shade net, dhoop net, garden shade canopy',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Anti-Bird Net Installation & Balcony Protection',
            alternateName: ['Kabootar Jali', 'Chiriya Net', 'Balcony Pigeon Net Karachi', 'Rooftop Bird Net'],
            description: 'UV-stabilized anti-pigeon and bird control netting (Kabootar Jali & Chiriya Net) fixed with stainless steel anchors for balconies, factory rafters, and air shafts.',
            keywords: 'kabootar jali, pigeon net, balcony protection mesh, chiriya net',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sports Net Manufacturing & Ground Supply',
            alternateName: ['Cricket Pitch Jaal', 'Futsal Ground Net', 'Goalpost Netting', 'Sports Divider Net'],
            description: 'Custom ply braided nylon and HDPE netting (Cricket Jaal & Futsal Ground Net) for cricket batting pitches, futsal turf grounds, and sports hall divider curtains.',
            keywords: 'cricket jaal, futsal net, batting pitch cage net, sports divider net',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Safety Net Manufacturing & Site Installation',
            alternateName: ['Safety Jaal', 'Scaffolding Net', 'Debris Mesh', 'Fall Protection Net Karachi'],
            description: 'Scaffolding debris containment, high-rise fall protection netting, and elevator shaft safety netting (Safety Jaal) fabricated and installed in Karachi.',
            keywords: 'safety jaal, scaffolding net, debris net, building safety net karachi',
          },
        },
      ],
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tahirasyndicate.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services & Installation',
        item: 'https://tahirasyndicate.com/services',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceCatalogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServicesPage initialSettings={settings} initialProducts={products} initialCategories={categories} />
    </>
  )
}

