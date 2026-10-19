import type { Metadata } from 'next'
import { ProjectsPage } from '@/components/site-pages'
import { getCompanySettings, getCategories } from '@/lib/api/crm'

import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Canopy & Netting Projects in Karachi',
  description:
    'Documented tensile canopies, sports netting, and industrial shade installations for Beaconhouse School, Karachi Grammar School, SLM Tyres Nooriabad, and commercial rooftops across Shahra-e-Liaquat Road, Bolton Market, Saddar, and SITE Area Karachi.',
  path: '/projects',
})

export default async function Page() {
  const [settings, categories] = await Promise.all([
    getCompanySettings(),
    getCategories(),
  ])

  const projectsJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
            name: 'Projects & Case Studies',
            item: 'https://tahirasyndicate.com/projects',
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Verified Supply & Installation Projects | Tahira Syndicate',
        description:
          'Documented tensile canopies, sports netting, and industrial shade installations across Karachi and Sindh.',
        url: 'https://tahirasyndicate.com/projects',
        hasPart: [
          {
            '@type': 'CreativeWork',
            name: 'High Wind-Pressure Canopy Shed (No Center Column)',
            creator: {
              '@type': 'Organization',
              name: 'Tahira Syndicate',
            },
            locationCreated: {
              '@type': 'Place',
              name: 'Beaconhouse School Johar Campus, Karachi',
            },
            description:
              'Engineered 72ft x 56ft wide-span canopy shed with zero center columns designed for coastal wind resistance.',
          },
          {
            '@type': 'CreativeWork',
            name: 'School Entrance Walkway Canopy Shed',
            creator: {
              '@type': 'Organization',
              name: 'Tahira Syndicate',
            },
            locationCreated: {
              '@type': 'Place',
              name: 'Beaconhouse School Johar Campus Entrance, Karachi',
            },
            description: '20ft x 120ft curved arch steel walkway canopy for all-weather student protection.',
          },
          {
            '@type': 'CreativeWork',
            name: 'Covered Basketball Court & College Campus Canopy',
            creator: {
              '@type': 'Organization',
              name: 'Tahira Syndicate',
            },
            locationCreated: {
              '@type': 'Place',
              name: 'Karachi Grammar School Saddar & Boat Basin Campuses, Karachi',
            },
            description:
              '70ft x 105ft covered basketball court canopy and 72ft x 120ft Boat Basin campus canopy with sports netting.',
          },
          {
            '@type': 'CreativeWork',
            name: '10,000 Sq Ft Cantilever Commercial Parking Shed',
            creator: {
              '@type': 'Organization',
              name: 'Tahira Syndicate',
            },
            locationCreated: {
              '@type': 'Place',
              name: 'Service Long March Tyres (SLM), Nooriabad, Jamshoro',
            },
            description: '500ft length x 20ft cantilever industrial vehicle parking canopy structure.',
          },
          {
            '@type': 'CreativeWork',
            name: 'Outdoor Play Area Canopy & Shade Structure',
            creator: {
              '@type': 'Organization',
              name: 'Tahira Syndicate',
            },
            locationCreated: {
              '@type': 'Place',
              name: 'Beaconhouse School Maymar Campus, Karachi',
            },
            description: 'Combined 40ft x 30ft and 16ft x 16ft shade canopy for primary school outdoor play area.',
          },
          {
            '@type': 'CreativeWork',
            name: 'High-Density Agro & Commercial Rooftop Shade Netting',
            creator: {
              '@type': 'Organization',
              name: 'Tahira Syndicate',
            },
            locationCreated: {
              '@type': 'Place',
              name: 'Karachi, Sindh',
            },
            description: '90% UV-treated virgin HDPE green shade netting on arched steel framing.',
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      <ProjectsPage initialSettings={settings} initialCategories={categories} />
    </>
  )
}

