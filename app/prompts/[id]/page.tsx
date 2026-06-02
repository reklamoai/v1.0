import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import FreePromptClient from "./free-client";
import PremiumPromptClient from "./premium-client";
import PricingSection from "@/components/PricingSection";

export default async function PromptPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await auth();

  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: { category: true, tags: true },
  });

  if (!prompt) notFound();

  const isPremiumUser = (session?.user as any)?.isPremium || (session?.user as any)?.role === "ADMIN";

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {prompt.tier === "free" ? (
        <FreePromptClient prompt={prompt as any} session={session} />
      ) : isPremiumUser ? (
        <PremiumPromptClient prompt={prompt as any} session={session} />
      ) : (
        <LockedPromptView prompt={prompt as any} />
      )}
      <PricingSection />
    </div>
  );
}

function LockedPromptView({ prompt }: { prompt: any }) {
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
      {prompt.imageUrl && (
        <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", marginBottom: "32px", maxWidth: "320px", margin: "0 auto 32px", aspectRatio: "3/4" }}>
          <img src={prompt.imageUrl} alt={prompt.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(8px)", transform: "scale(1.05)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div style={{ textAlign: "center", color: "white" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>PREMIUM</p>
              <p style={{ fontSize: "12px", opacity: 0.7 }}>Kërkon akses premium</p>
            </div>
          </div>
        </div>
      )}
      <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Ky prompt kërkon akses premium.</p>
    </div>
  );
}