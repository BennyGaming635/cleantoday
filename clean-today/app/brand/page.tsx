import Navbar from '@/components/navbar/Navbar'

export default function BrandPage() {
    return (
        <>
            <Navbar />
            <div
                style={{
                    padding: 60,
                    fontFamily: "sans-serif",
                    background: "#f6f6f6",
                    minHeight: "100vh",
                }}
            >
                <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 40 }}>
                    Brand Assets
                </h1>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: 24,
                    }}
                >
                    <BrandCard title="Logo (B/W)">
                        <img src="/brand/logo-bw.png" style={{ width: "100%" }} />
                    </BrandCard>
                    <BrandCard title="Logo (B/W Inverse)">
                        <img src="/brand/logo-bwi.png" style={{ width: "100%" }} />
                    </BrandCard>
                </div> 
            </div>
        </>
    )
}

function BrandCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  )
}