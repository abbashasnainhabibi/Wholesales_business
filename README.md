# 🏢 Tahira Syndicate — B2B Wholesale Platform & Stealth Management Portal

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![SEO Score](https://img.shields.io/badge/SEO-100%2F100-success)](https://web.dev/learn/seo/)

A high-performance, enterprise-grade B2B wholesale platform and unified management suite built for **Tahira Syndicate** — an industrial distributor and wholesaler specializing in high-density polyethylene (HDPE) ropes, agricultural nets, heavy-duty tarpaulins, PVC pipes, polymers, industrial strapping, and synthetic webbing.

---

## 📑 Table of Contents

- [Key Highlights & Architectural Principles](#-key-highlights--architectural-principles)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Directory Structure](#-directory-structure)
- [Database Schema (Prisma ORM)](#-database-schema-prisma-orm)
- [API Reference](#-api-reference)
- [Media Management & Lifecycle](#-media-management--lifecycle)
- [SEO, Accessibility & Design Standards](#-seo-accessibility--design-standards)
- [Environment Variables](#-environment-variables)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Production Build & Deployment](#-production-build--deployment)
- [License](#-license)

---

## 🌟 Key Highlights & Architectural Principles

1. **Unified Monolith Architecture**:
   - Single, tightly coupled Next.js application housing the public customer-facing B2B catalog, dynamic quotation engine, REST API layer, and secure stealth admin portal (`/ts-portal`).
   - Direct database access via Prisma Client (`@/lib/prisma`) on all server components and route handlers for instant sub-millisecond query execution and zero network hop overhead.

2. **B2B Trade Quotation Model (Zero Numeric Frontend Prices)**:
   - Built specifically for wholesale & bulk procurement. All public listings display **"Trade Price on Request"** or **"Contact for Bulk Pricing"** with 1-click dynamic WhatsApp & Phone RFQ modals, preventing fixed retail pricing while maximizing lead generation.

3. **100/100 SEO & Semantic HTML Engine**:
   - Strictly enforced semantic markup: exactly 1 `<h1>` per route, structured `<section>` landmarks, character-perfect Google Business Profile NAP (Name, Address, Phone) consistency.
   - Automated Schema.org JSON-LD generation (`LocalBusiness`, `Product`, `BreadcrumbList`, `FAQPage`).

4. **Automated Media Pipeline with Zero Disk Waste**:
   - Uploaded assets undergo automated WebP conversion and compression via `sharp`.
   - Media lifecycle hooks guarantee that deleting any product, category, or customer review automatically purges the corresponding image files from disk.

5. **Stealth Admin Management Portal (`/ts-portal`)**:
   - Complete inventory, catalog, and attribute mapping management.
   - Built-in 9-point SEO health checker validating metadata length, image alt tags, SKU, barcode, usage instructions, and attribute associations.
   - Customer review moderation queue (Approve, Reject, or Delete with instant asset cleanup).

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16.3 (App Router)](https://nextjs.org/), [React 19](https://react.dev/) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) |
| **Database & ORM** | [MySQL](https://www.mysql.com/), [Prisma ORM 6.19](https://www.prisma.io/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/), [Base UI](https://base-ui.com/) |
| **Authentication & Security** | [NextAuth v5 (Auth.js beta)](https://authjs.dev/), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| **Image Processing** | [Sharp](https://sharp.pixelplumbing.com/) (Lossless/Lossy WebP optimization) |
| **Validation** | [Zod 4](https://zod.dev/) |
| **Typography** | Google Fonts ([`Outfit`](https://fonts.google.com/specimen/Outfit)), Centralized Token System (`@/lib/typography`) |

---

## 🏗 System Architecture

```mermaid
flowchart TD
    subgraph Client["Client Layer (Browsers & Devices)"]
        A[Public Storefront / B2B Catalog]
        B[Stealth Management Portal /ts-portal]
        C[WhatsApp & Direct RFQ Modals]
    end

    subgraph NextServer["Next.js 16 App Router Monolith"]
        D[Server Components / ISR / Static HTML]
        E[API Route Handlers /api/*]
        F[Auth & RBAC Middleware]
        G[Sharp Media Processing Engine]
    end

    subgraph DataStorage["Data & Asset Storage"]
        H[(MySQL Database)]
        I[Prisma ORM Client]
        J[Disk Storage: /public/uploads/]
    end

    A -->|SSR / Hydration| D
    B -->|Authenticated REST Requests| E
    C -->|Direct WhatsApp Deep-links| A
    E -->|Session & Role Check| F
    E -->|Direct Queries| I
    D -->|Direct Queries| I
    I --> H
    E -->|Image Uploads & WebP Conversion| G
    G -->|Write WebP Files| J
    E -->|Delete Records & Media File Purge| J
```

---

## 📂 Directory Structure

```plaintext
Frontend_website/
├── app/
│   ├── (public routes)
│   │   ├── about/                    # About Us & Company Profile
│   │   ├── categories/               # Category listing & [slug] dynamic pages
│   │   ├── contact/                  # Contact & Location with Interactive Maps
│   │   ├── products/                 # Product catalog & [slug] B2B spec pages
│   │   ├── projects/                 # Industrial Projects & Case Studies
│   │   ├── services/                 # B2B Industrial Services & [slug] routes
│   │   ├── layout.tsx                # Root layout with Schema.org & Header/Footer
│   │   ├── page.tsx                  # Home landing page with Hero video & stats
│   │   ├── manifest.ts               # Web app manifest
│   │   ├── robots.ts                 # Automated search engine robots.txt
│   │   └── sitemap.xml/route.ts      # Dynamic XML sitemap generator
│   ├── api/
│   │   ├── attributes/               # Attributes CRUD API (/api/attributes)
│   │   │   └── [id]/route.ts         # Attribute update/delete handler
│   │   ├── auth/[...nextauth]/       # NextAuth credential authentication
│   │   ├── catalog-routes.ts         # Shared catalog controller & image sanitizers
│   │   ├── categories/               # Categories CRUD API (/api/categories)
│   │   │   └── [id]/route.ts         # Category dynamic update/delete handler
│   │   ├── products/                 # Products CRUD API (/api/products)
│   │   │   └── [id]/route.ts         # Product dynamic update/delete handler
│   │   ├── reviews/                  # Customer reviews API & review submission
│   │   │   └── [id]/route.ts         # Review moderation & delete with file unlink
│   │   ├── settings/                 # Company & SEO Settings API
│   │   └── upload/                   # Sharp WebP file upload endpoint
│   └── ts-portal/                    # Stealth Admin Management Portal & Login
├── components/                       # Shared UI components (Navigation, Modals, Cards)
├── lib/                              # Utility libraries, typography tokens, Prisma client
│   ├── api/                          # Server API helpers & client-side SDKs
│   ├── prisma.ts                     # Global Prisma database client singleton
│   ├── seo-score.ts                  # 100/100 SEO validation score engine
│   ├── typography.ts                 # Centralized Outfit font design tokens
│   └── utils.ts                      # Class-variance authority & Tailwind helpers
├── prisma/
│   ├── schema.prisma                 # MySQL Prisma database schema definition
│   └── seed.ts                       # Database seeder with categories & products
├── public/
│   ├── uploads/                      # Optimized WebP assets (categories, products, reviews)
│   └── videos/                       # Industrial showcase hero background videos
├── package.json                      # Project dependencies and run scripts
└── next.config.mjs                   # Next.js build & image optimization settings
```

---

## 🗄 Database Schema (Prisma ORM)

The relational schema is configured in [`prisma/schema.prisma`](file:///d:/Projects/Nextjs/Wholesale_business/Frontend_website/prisma/schema.prisma) with MySQL:

### Core Data Models:

| Model | Table Name | Purpose | Key Relations |
| :--- | :--- | :--- | :--- |
| `User` | `user` | Admin accounts with bcrypt password hashes & role checks | `Account`, `Session`, `LoginAttempt` |
| `Category` | `category` | Product categories with slug, banner, and metadata | Has many `CategoryAttribute`, `Product` |
| `Attribute` | `attribute` | Global technical specs (e.g., GSM, Diameter, Color) | Has many `CategoryAttribute`, `ProductAttributeValue` |
| `CategoryAttribute` | `categoryattribute` | Pivot table linking attributes required for a category | Links `Category` and `Attribute` |
| `Product` | `product` | Complete B2B product specifications, MOQ, and SEO fields | Belongs to `Category`, has many `ProductImage`, `ProductFaq`, `ProductAttributeValue`, `Review` |
| `ProductImage` | `productimage` | Product gallery WebP images with ordering | Belongs to `Product` (Cascade delete) |
| `ProductFaq` | `productfaq` | Accordion FAQs for products (Schema.org ready) | Belongs to `Product` (Cascade delete) |
| `ProductAttributeValue` | `productattributevalue`| Concrete values assigned to a product for an attribute | Links `Product` and `Attribute` |
| `Review` | `review` | User submitted ratings, messages, and uploaded photos | Optionally belongs to `Product` |
| `CompanySettings`| `companysettings`| NAP data, contact info, social links, and working hours | Single record (id: 1) |
| `SeoSettings` | `seosettings` | Global meta title templates, OpenGraph tags, and notes | Single record (id: 1) |
| `LoginAttempt` | `loginattempt` | Rate limiting & brute-force audit logging | Linked to `User` |

---

## 🔌 API Reference

### Catalog & Administration Endpoints:

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/categories` | `GET` | Public | List all categories with pagination & product counts |
| `/api/categories` | `POST` | Admin | Create a new category with slug auto-generation |
| `/api/categories/[id]` | `GET` | Public | Get single category details with attribute schema |
| `/api/categories/[id]` | `PUT`/`PATCH` | Admin | Update category metadata, attributes, or banner image |
| `/api/categories/[id]` | `DELETE` | Admin | Delete category (guards against active products, unlinks banner file) |
| `/api/products` | `GET` | Public | Search and filter products by category, status, or search query |
| `/api/products` | `POST` | Admin | Create a product with gallery, specs, FAQs, and SEO scoring |
| `/api/products/[id]` | `GET` | Public | Retrieve product by numeric ID or URL slug |
| `/api/products/[id]` | `PUT`/`PATCH` | Admin | Update product details, images, FAQs, and attribute values |
| `/api/products/[id]` | `DELETE` | Admin | Delete product and permanently purge all associated gallery image files |
| `/api/attributes` | `GET` / `POST` | Public/Admin | List or create technical specification attributes |
| `/api/attributes/[id]` | `PUT`/`DELETE` | Admin | Update or delete attributes (safely unlinks pivot tables) |
| `/api/reviews` | `GET` | Public | List approved reviews (or all reviews for admin) |
| `/api/reviews` | `POST` | Public | Submit new customer review with optional media attachment |
| `/api/reviews/[id]` | `PUT`/`PATCH` | Admin | Approve or reject submitted reviews |
| `/api/reviews/[id]` | `DELETE` | Admin | Permanently delete review and its attached media file |
| `/api/upload` | `POST` | Admin/Public | Sharp-powered WebP image compression and storage |
| `/api/settings/company` | `GET` / `PUT` | Public/Admin | Retrieve or update Google Business NAP company info |
| `/api/settings/seo` | `GET` / `PUT` | Public/Admin | Retrieve or update global SEO & OpenGraph configurations |

---

## 🖼 Media Management & Lifecycle

All media processing is automated using **Sharp**:

1. **Upload & WebP Conversion**:
   - Images uploaded via `/api/upload` or JSON Base64 payloads are compressed into modern `.webp` format and saved directly to `/public/uploads/<folder>/`.
   - **Review Media Naming**: Automatically named based on customer name, review message snippet, and a random hash (e.g. `john-doe-great-experience-123456.webp`).
2. **Permanent Deletion Protocol**:
   - Whenever an entity containing media is deleted (Product, Category, or Customer Review), the backend resolves the file path and unlinks it from disk.
   - **No Orphaned Media**: Eliminates storage bloat and avoids manual file cleanup.

---

## 📐 SEO, Accessibility & Design Standards

- **Typography System**: Powered by Google Fonts **`Outfit`** with standardized scale tokens in `@/lib/typography`:
  - `typography.heading.hero`: Heavy high-impact headings (`text-4xl sm:text-5xl lg:text-6xl font-extrabold`)
  - `typography.heading.section`: Section titles (`text-2xl sm:text-3xl font-bold`)
  - `typography.body.standard`: Readable high-contrast body text (`text-slate-600 dark:text-slate-300`)
- **Semantic HTML**: Exactly one `<h1>` per view, proper `<header>`, `<main>`, `<section>`, `<footer>`, and `<nav>` landmarks.
- **Accessibility (A11y)**: All form controls have associated `<label htmlFor="...">` and descriptive `aria-label` tags for 100/100 accessibility audits.
- **Video Performance**:
  - Desktop viewports autoplay muted loop videos with `<track kind="captions">`.
  - Mobile viewports (< 768px) utilize `preload="none"` with lightweight WebP posters to protect mobile bandwidth.

---

## 🔐 Environment Variables

Create a `.env` file in the root of `Frontend_website/` with the following keys:

```env
# MySQL Database Connection String
DATABASE_URL="mysql://username:password@localhost:3306/wholesale_business_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-32-character-secret-key"

# Admin Initial Seed Credentials
ADMIN_EMAIL="admin@tahirasyndicate.com"
ADMIN_PASSWORD="SecureAdminPasswordHere!"

# Public Website URL (for dynamic sitemaps & OpenGraph metadata)
NEXT_PUBLIC_SITE_URL="https://www.tahirasyndicate.com"
```

---

## 🚀 Getting Started & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/abbashasnainhabibi/Wholesales_business.git
cd Wholesales_business/Frontend_website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup the database
```bash
# Generate Prisma Client types
npx prisma generate

# Push database schema to MySQL
npx prisma db push

# (Optional) Seed the database with initial categories, attributes, and products
npm run seed
```

### 4. Run the local development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Access the admin portal at [http://localhost:3000/ts-portal](http://localhost:3000/ts-portal).

---

## 📦 Production Build & Deployment

To verify and produce an optimized production build:

```bash
# Build the Next.js application
npm run build

# Start the production server on port 3000
npm run start
```

---

## 📄 License

Proprietary © **Tahira Syndicate**. All rights reserved.
