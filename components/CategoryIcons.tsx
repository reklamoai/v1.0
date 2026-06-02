"use client";
import { useRouter } from "next/navigation";
import {
  Utensils, Stethoscope, Coffee, Wine, Sparkles,
  Building2, Car, Shirt, Scissors, ShoppingBag,
} from "lucide-react";

const CATEGORIES = [
  { name: "Restaurants", slug: "restaurants", Icon: Utensils },
  { name: "Dental", slug: "dental", Icon: Stethoscope },
  { name: "Coffee", slug: "coffee", Icon: Coffee },
  { name: "Drinks", slug: "drinks", Icon: Wine },
  { name: "Beauty", slug: "beauty", Icon: Sparkles },
  { name: "Real Estate", slug: "real-estate", Icon: Building2 },
  { name: "Automotive", slug: "automotive", Icon: Car },
  { name: "Fashion", slug: "fashion", Icon: Shirt },
  { name: "Barber", slug: "barber", Icon: Scissors },
  { name: "Shoes", slug: "shoes", Icon: ShoppingBag },
];

export default function CategoryIcons({ active }: { active?: string }) {
  const router = useRouter();

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "32px",
      flexWrap: "wrap",
      padding: "16px 24px",
    }}>
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.slug;
        return (
          <button
            key={cat.slug}
            onClick={() => router.push(`/prompts?category=${cat.slug}`)}
            title={cat.name}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              color: isActive ? "var(--accent)" : "var(--text-muted)",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.color = "var(--accent)";
              const tooltip = el.querySelector(".cat-tooltip") as HTMLElement;
              if (tooltip) tooltip.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              if (!isActive) el.style.color = "var(--text-muted)";
              const tooltip = el.querySelector(".cat-tooltip") as HTMLElement;
              if (tooltip) tooltip.style.opacity = "0";
            }}
          >
            <cat.Icon size={28} strokeWidth={1.5} />
            <span
              className="cat-tooltip"
              style={{
                position: "absolute",
                bottom: "-32px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "var(--accent)",
                color: "white",
                fontSize: "11px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.15s",
                pointerEvents: "none",
              }}
            >
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}