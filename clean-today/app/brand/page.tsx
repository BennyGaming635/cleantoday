import Navbar from '@/components/navbar/Navbar'

export default function BrandPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
        <div>
          <h1 className="text-4xl font-bold text-green-800">
            Brand Assets
          </h1>
          <p className="text-gray-600 mt-2">
            Official Clean Today identity assets for councils, partners, and developers.
          </p>
        </div>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Logos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BrandCard title="Black/White Logo (Light)">
              <img
                src="/brand/logo-bw.png"
                className="w-full max-h-40 object-contain"
              />
            </BrandCard>

            <BrandCard title="Black/White Logo (Inverse)">
              <img
                src="/brand/logo-bwi.png"
                className="w-full max-h-40 object-contain bg-black p-6 rounded-lg"
              />
            </BrandCard>
            
            <BrandCard title="Primary Logo (Light)">
              <img
                src="/brand/logo-c.png"
                className="w-full max-h-40 object-contain"
              />
            </BrandCard>

            <BrandCard title="Secondary Logo (Inverse)">
              <img
                src="/brand/logo-ci.png"
                className="w-full max-h-40 object-contain p-6 rounded-lg bg-gradient-to-b from-[#169f48] to-[#14532d]"
              />
            </BrandCard>

            <BrandCard title="Clean Today Name (B/W)">
              <img
                src="/brand/name-bw.png"
                className="w-full max-h-40 object-contain"
              />
            </BrandCard>

            <BrandCard title="Clean Today Name (B/W & Inverse)">
              <img
                src="/brand/name-bwi.png"
                className="w-full max-h-40 object-contain bg-black p-6 rounded-lg"
              />
            </BrandCard>

            <BrandCard title="Clean Today Name (Primary)">
              <img
                src="/brand/name-c.png"
                className="w-full max-h-40 object-contain"
              />
            </BrandCard>

            <BrandCard title="Clean Today Name (Secondary)">
              <img
                src="/brand/name-ci.png"
                className="w-full max-h-40 object-contain p-6 rounded-lg bg-gradient-to-br from-[#169f48] to-[#14532d]"
              />
            </BrandCard>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Brand Colours
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ColorCard name="Clean Green" hex="#14532d" />
            <ColorCard name="Soft Green" hex="#16a34a" />
            <ColorCard name="Background" hex="#f6f6f6" />
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Usage Guidelines
          </h2>

          <div className="bg-white rounded-2xl border p-6 text-gray-700 space-y-2">
            <p>• Do not distort or recolour logos</p>
            <p>• Maintain clear spacing around the logo</p>
            <p>• Use inverse logo only on dark backgrounds</p>
            <p>• Do not modify or recreate brand assets</p>
          </div>
        </section>
      </div>
    </div>
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
    <div className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-5">
      <div className="text-sm font-semibold text-gray-700 mb-4">
        {title}
      </div>
      {children}
    </div>
  )
}

function ColorCard({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-3">
      <div
        className="h-16 rounded-xl"
        style={{ background: hex }}
      />
      <div>
        <div className="font-semibold text-gray-800">{name}</div>
        <div className="text-sm text-gray-500">{hex}</div>
      </div>
    </div>
  )
}