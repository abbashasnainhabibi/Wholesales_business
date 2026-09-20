import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'

export const alt = 'Tahira Syndicate — Direct Manufacturer & Master Wholesale Distributor Karachi'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  // Load real shopfront photo, TS logo, and official Outfit font
  let shopImageBase64 = ''
  let logoBase64 = ''
  let fontData: Buffer | ArrayBuffer | null = null

  try {
    const shopPath = path.join(
      process.cwd(),
      'public',
      'about',
      'tahira-syndicate-shahra-e-liaquat-wholesale-shopfront-karachi.jpg'
    )
    if (fs.existsSync(shopPath)) {
      const buffer = fs.readFileSync(shopPath)
      shopImageBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`
    }

    const logoPath = path.join(process.cwd(), 'public', 'icon-192.png')
    if (fs.existsSync(logoPath)) {
      const logoBuf = fs.readFileSync(logoPath)
      logoBase64 = `data:image/png;base64,${logoBuf.toString('base64')}`
    }

    const boldFontPath = path.join(process.cwd(), 'public', 'fonts', 'Outfit-Bold.ttf')
    const regularFontPath = path.join(process.cwd(), 'public', 'fonts', 'Outfit-Regular.ttf')

    let boldFontData: ArrayBuffer | null = null
    let regularFontData: ArrayBuffer | null = null

    if (fs.existsSync(boldFontPath)) {
      const buffer = fs.readFileSync(boldFontPath)
      boldFontData = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
    }

    if (fs.existsSync(regularFontPath)) {
      const buffer = fs.readFileSync(regularFontPath)
      regularFontData = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
    }

    const categories = [
      {
        title: '1. Ropes & Twines (Jahazi Rassa)',
        desc: 'Nylon, PP, Danline, Braided & Manila',
      },
      {
        title: '5. Polythene Sheets & Films',
        desc: 'Virgin LDPE Rolls & Construction Films',
      },
      {
        title: '2. Nets & Netting (Hara Parda)',
        desc: 'Debris Safety, Agro Shade & Bird Nets',
      },
      {
        title: '6. Safety Belts & Webbing Slings',
        desc: 'Lifting Slings & Full Body Harnesses',
      },
      {
        title: '3. Tarpaulins & Canvas (Tirpal)',
        desc: 'Waterproof HDPE, Heavy PVC & Canvas Tents',
      },
      {
        title: '7. Packaging & Strapping Materials',
        desc: 'PET/PP Strapping, Clips & Stretch Film',
      },
      {
        title: '4. Building & Flexible Pipes',
        desc: 'PVC Suction, Braided & Delivery Hoses',
      },
      {
        title: 'Direct B2B Factory Dispatch',
        desc: 'Custom Sizing & Fast Karachi/Pakistan Delivery',
        highlight: true,
      },
    ]

    const fonts = []
    if (regularFontData) {
      fonts.push({
        name: 'Outfit',
        data: regularFontData,
        style: 'normal' as const,
        weight: 400 as const,
      })
    }
    if (boldFontData) {
      fonts.push({
        name: 'Outfit',
        data: boldFontData,
        style: 'normal' as const,
        weight: 700 as const,
      })
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            backgroundColor: '#FFFFFF',
            padding: '36px 42px',
            fontFamily: fonts.length > 0 ? 'Outfit, sans-serif' : 'system-ui, sans-serif',
            boxSizing: 'border-box',
            gap: '32px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left Side: Brand Logo, Headline & All 7 Official Categories with Subtitles */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              width: '690px',
            }}
          >
            {/* Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {logoBase64 ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoBase64}
                  alt="TS Logo"
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '58px',
                    height: '58px',
                    backgroundColor: '#1877F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '26px',
                    borderRadius: '4px',
                  }}
                >
                  TS
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '34px',
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      color: '#0F172A',
                      lineHeight: 1,
                    }}
                  >
                    TAHIRA
                  </span>
                  <span
                    style={{
                      fontSize: '34px',
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      color: '#1877F2',
                      lineHeight: 1,
                    }}
                  >
                    SYNDICATE
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    color: '#64748B',
                    textTransform: 'uppercase',
                    marginTop: '3px',
                  }}
                >
                  Plastics · Extrusion · Wholesale
                </span>
              </div>
            </div>

            {/* Eyebrow & Main Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', margin: '6px 0 2px' }}>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: '#1877F2',
                  textTransform: 'uppercase',
                }}
              >
                Direct Manufacturer &amp; Master Wholesale Distributor
              </span>

              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  color: '#0F172A',
                  margin: 0,
                }}
              >
                Industrial Ropes, Nets, Tarpaulins, Pipes &amp; Polymers
              </h1>
            </div>

            {/* All 7 Official Categories with larger size, clean hierarchy & descriptions */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px 18px',
                padding: '6px 0',
              }}
            >
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '330px',
                    gap: '2px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: cat.highlight ? '#25D366' : '#1877F2',
                        flexShrink: 0,
                        borderRadius: '1px',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '16.5px',
                        fontWeight: 700,
                        color: cat.highlight ? '#1877F2' : '#0F172A',
                        lineHeight: 1.2,
                      }}
                    >
                      {cat.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 400,
                      color: '#64748B',
                      paddingLeft: '14px',
                      lineHeight: 1.2,
                    }}
                  >
                    {cat.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Bar: Full Official Address & Landmarks + WhatsApp CTA */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #E2E8F0',
                paddingTop: '12px',
                width: '100%',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '460px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  📍 Shop # 1, Thakurdwara Ln, Main Shahra-e-Liaquat Rd
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>
                  Serai Quarters • opp. Sindh Madarsa-tul-Islam • near KCCI, Karachi
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#25D366',
                  color: '#0F172A',
                  padding: '8px 14px',
                  fontSize: '14px',
                  fontWeight: 700,
                  borderRadius: '4px',
                  flexShrink: 0,
                }}
              >
                <span>WhatsApp: +92 321 2043552</span>
              </div>
            </div>
          </div>

          {/* Right Side: Authentic Shopfront Photo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '380px',
              height: '100%',
              position: 'relative',
              backgroundColor: '#F8FAFC',
              border: '2px solid #E2E8F0',
              overflow: 'hidden',
            }}
          >
            {shopImageBase64 ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={shopImageBase64}
                alt="Tahira Syndicate Shahra-e-Liaquat Shopfront"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                Shopfront Counter
              </div>
            )}

            {/* Clean Light Overlay Tag on Shop Photo */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                padding: '9px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                border: '1px solid #E2E8F0',
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#1877F2', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Walk-In Trade Counter
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                Shahra-e-Liaquat (opp. Sindh Madarsa)
              </span>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: fonts.length > 0 ? fonts : undefined,
      }
    )
  } catch (err) {
    console.error('Failed to load local OG assets:', err)
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#FFFFFF', padding: '40px' }}>
          <h1>Tahira Syndicate Karachi</h1>
        </div>
      ),
      { ...size }
    )
  }
}

