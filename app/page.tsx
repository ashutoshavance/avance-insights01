import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import ServicesSection from '@/components/home/ServicesSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import ClientsSection from '@/components/home/ClientsSection'
import FeaturedInsights from '@/components/home/FeaturedInsights'
import CTASection from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FeaturedInsights />
      <TestimonialsSection />
      <ClientsSection />
      <CTASection />
    </>
  )
}
