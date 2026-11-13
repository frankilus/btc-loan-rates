import { ImageResponse } from "next/og";
import { formatUsd, rankLenders } from "@/lib/calc";
import { SCENARIO } from "@/lib/lenders";

export const alt =
  "BTC Loan Rates ranks the true all-in first-year cost of a $10,000, 12-month Bitcoin-backed loan at 50% LTV";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const rows = rankLenders(SCENARIO.principalUsd, SCENARIO.termMonths, SCENARIO.ltvPct, {
    group: "fixed",
  }).slice(0, 6);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 12,
            height: "100%",
            backgroundColor: "#fbbf24",
            display: "flex",
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            padding: "48px 56px",
            gap: 48,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 36,
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                }}
              >
                <span>BTC Loan</span>
                <span style={{ color: "#fbbf24" }}>Rates</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 36,
                  fontSize: 48,
                  fontWeight: 650,
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                }}
              >
                <span>The real all-in cost</span>
                <span>of a Bitcoin-backed loan</span>
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 24,
                  fontSize: 22,
                  color: "#a1a1aa",
                }}
              >
                $10,000 · 12 months · 50% LTV
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 18, color: "#71717a" }}>
              Official sources · Estimates labeled · No affiliate links
            </div>
          </div>
          <div
            style={{
              width: 420,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {rows.map((r, i) => (
              <div
                key={r.lender.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 16px",
                  backgroundColor: "#18181b",
                  borderRadius: 10,
                  fontSize: 22,
                }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: "#71717a", width: 24 }}>{i + 1}</span>
                  <span>{r.lender.name}</span>
                </div>
                <div style={{ display: "flex", color: "#fbbf24", fontWeight: 600 }}>
                  {formatUsd(r.cost.allInUsd, 0)}
                  {r.cost.confidence === "estimate" ? (
                    <span style={{ color: "#a1a1aa", fontWeight: 400, marginLeft: 8, fontSize: 16 }}>
                      est.
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
