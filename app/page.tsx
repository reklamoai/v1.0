import Link from "next/link";
import CategoryIcons from "@/components/CategoryIcons";
import PricingSection from "@/components/PricingSection";
import PromptMarquee from "@/components/PromptMarquee";
import HomepageGrid from "@/components/HomepageGrid";
import { prisma } from "@/lib/prisma";
import AIWordCycler from "@/components/AIWordCycler";
import HeroButtons from "@/components/HeroButtons";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const marqueePrompts = await prisma.prompt.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const gridPrompts = await prisma.prompt.findMany({
    take: 12,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "clamp(130px, 20vw, 210px)",
          paddingBottom: "0px",
          paddingLeft: "clamp(20px, 5vw, 24px)",
          paddingRight: "clamp(20px, 5vw, 24px)",
          textAlign: "center",
        }}
      >
        <div className="grid-bg" />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            className="h-display"
            style={{
              color: "var(--text)",
              marginBottom: "clamp(16px, 3vw, 24px)",
            }}
          >
            Reklamo me{" "}
            <AIWordCycler />
          </h1>

          <p
            className="lead"
            style={{
              maxWidth: "560px",
              margin: "0 auto clamp(28px, 5vw, 40px)",
            }}
          >
            Bibliotekë me prompts për reklama moderne, të ndara sipas kategorive reale të bizneseve.
          </p>

          <HeroButtons />
        </div>

        {/* Marquee */}
        <div style={{ position: "relative", zIndex: 1, marginLeft: "-24px", marginRight: "-24px" }}>
          <PromptMarquee prompts={marqueePrompts as any[]} />
        </div>

        {/* Category Icons */}
        <div style={{ position: "relative", zIndex: 1, paddingBottom: "64px" }}>
          <CategoryIcons />
        </div>
      </section>

      {/* Filter bar + Grid */}
      <HomepageGrid
        prompts={gridPrompts as any[]}
        categories={categories}
      />

      <PricingSection />

      <Footer />
    </div>
  );
}