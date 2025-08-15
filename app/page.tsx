import LoadingScreen from "@/components/LoadingScreen";
import OriginSection from "@/components/OriginSection";
import MaterialFocus from "@/components/MaterialFocus";
import LookbookStrip from "@/components/LookbookStrip";
import OutroCinematic from "@/components/OutroCinematic";
import ZolarShowcase from "@/components/ZolarShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <LoadingScreen />
      {/* Make Origin the first section */}
      <OriginSection />
      {/* ScrollStage: keep existing gradient stage and cards */}
      <div id="scroll-stage" className="relative">
        <ZolarShowcase />
        </div>
      <MaterialFocus />
      <LookbookStrip />
      <OutroCinematic />
      <Footer />
    </div>
  );
}
