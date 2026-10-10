import Hero from "@/components/Hero";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedCostumes from "@/components/FeaturedCostumes";
import HowItWorks from "@/components/HowItWorks";
import OccasionsSection from "@/components/OccasionsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <CategoriesSection />
      <FeaturedCostumes />
      <HowItWorks />
      <OccasionsSection />
      <WhyChooseUs />
      <FAQSection />
      <ContactSection />
    </div>
  );
}
