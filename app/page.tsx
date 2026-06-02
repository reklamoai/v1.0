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
          paddingTop: "200px",
          paddingBottom: "0px",
          paddingLeft: "24px",
          paddingRight: "24px",
          textAlign: "center",
        }}
      >
        <div className="grid-bg" />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              fontSize: "clamp(42px, 5.5vw, 68px)",
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              marginBottom: "20px",
            }}
          >
            Reklamo me{" "}
            <AIWordCycler />
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "var(--text-muted)",
              maxWidth: "440px",
              margin: "0 auto 32px",
              lineHeight: 1.6,
            }}
          >
            Bibliotekë me prompts për reklama moderne, të ndara sipas kategorive reale të bizneseve.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "56px",
            }}
          >
            <HeroButtons />
          </div>
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