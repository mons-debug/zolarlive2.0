import LoadingScreen from "@/components/LoadingScreen";
import OriginSection from "@/components/OriginSection";
import MaterialFocus from "@/components/MaterialFocus";
import LookbookStrip from "@/components/LookbookStrip";
import OutroCinematic from "@/components/OutroCinematic";
import ZolarShowcase from "@/components/ZolarShowcase";
import Footer from "@/components/Footer";

import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <LoadingScreen />
      {/* Make Origin the first section */}
      <OriginSection />
      {/* ScrollStage: positioned to overlap hero section for cross-fade */}
      <div id="scroll-stage" className="relative -mt-[100vh] min-h-[100vh]">
        <ZolarShowcase />
      </div>
      <OutroCinematic />
      <MaterialFocus />
      <LookbookStrip />
      <Testimonials />
      <Footer />
    </div>
  );
}
