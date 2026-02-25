import { HeroSection } from '@/components/hero-section'
import { BentoGrid } from '@/components/bento-grid'
import { ResourcesSection } from '@/components/resources-section'
import { CampusMap } from '@/components/campus-map'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BentoGrid />
      <ResourcesSection />
      <CampusMap />
    </main>
  )
}
