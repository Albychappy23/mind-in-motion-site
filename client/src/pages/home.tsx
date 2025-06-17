import Header from "@/components/header";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ResourcesSection from "@/components/resources-section";
import Resources from "@/components/resources-list";
import StoriesSection from "@/components/stories-section";
import StoryForm from "@/components/story-form";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import AdminModal from "@/components/admin-modal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Resource } from "@shared/schema";

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);

  const { data: resources = [] } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onAdminClick={() => setShowAdmin(true)} />
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <ResourcesSection />
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 text-center">
            Quick Resource Search
          </h2>
          <Resources resources={resources} />
        </div>
        <StoriesSection />
        <StoryForm />
        <ContactSection />
      </main>
      <Footer />
      <AdminModal open={showAdmin} onOpenChange={setShowAdmin} />
    </div>
  );
}
