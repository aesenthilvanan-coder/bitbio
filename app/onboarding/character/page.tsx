"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import AvatarRenderer from "@/components/avatar/AvatarRenderer";
import type { AvatarConfig } from "@/lib/types";
import { DEFAULT_AVATAR } from "@/lib/types";
import {
  SKIN_TONES,
  EYE_COLORS,
  HAIR_COLORS,
  HAIR_STYLE_NAMES,
  EYE_NAMES,
  MOUTH_NAMES,
  EYEBROW_NAMES,
  NOSE_NAMES,
  GLASSES_NAMES,
  FACIAL_HAIR_NAMES,
  CLOTHING_NAMES,
  HEADWEAR_NAMES,
  SHOES_NAMES,
  BACKPACK_NAMES,
  AURA_NAMES,
  SKIN_MARKINGS_NAMES,
  EXPRESSION_NAMES,
} from "@/lib/avatar/avatarOptions";

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
function buildRandom(name: string): AvatarConfig {
  return {
    ...DEFAULT_AVATAR,
    skinTone: randomFrom(SKIN_TONES),
    eyeShape: randomInt(EYE_NAMES.length),
    eyeColor: randomFrom(EYE_COLORS),
    eyebrow: randomInt(EYEBROW_NAMES.length),
    nose: randomInt(NOSE_NAMES.length),
    mouth: randomInt(MOUTH_NAMES.length),
    hairStyle: randomInt(HAIR_STYLE_NAMES.length),
    hairColor: randomFrom(HAIR_COLORS),
    glasses: randomInt(GLASSES_NAMES.length),
    facialHair: randomInt(FACIAL_HAIR_NAMES.length),
    clothing: randomInt(CLOTHING_NAMES.length),
    clothingColorPrimary: randomFrom(["#1f2937","#2d1b69","#1a1a2e","#0f3460","#1b1b2f","#16213e","#7f1d1d","#14532d"]),
    clothingColorSecondary: randomFrom(["#374151","#4c1d95","#2d2d44","#0e4f6f","#2e2e4e","#1d2d50"]),
    headwear: randomInt(HEADWEAR_NAMES.length),
    headwearColor: randomFrom(["#333333","#8b1a1a","#1a4a8b","#2d5a1b"]),
    shoes: randomInt(SHOES_NAMES.length),
    shoesColor: randomFrom(["#333333","#1a1a1a","#8b4513","#f5f5f5"]),
    backpackType: randomInt(BACKPACK_NAMES.length),
    backpackColor: randomFrom(["#1a1a2e","#2d1b69","#1b2d1b","#2d2d2d"]),
    auraEffect: randomInt(AURA_NAMES.length),
    skinMarkings: randomInt(SKIN_MARKINGS_NAMES.length),
    expression: randomInt(EXPRESSION_NAMES.length),
    bodyType: randomInt(3),
    characterName: name,
  };
}

// ─── Compact swatch row ───────────────────────────────────────────────────────
function Swatches({ colors, value, onChange }: { colors: string[]; value: string; onChange: (c: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {colors.map((c) => (
        <button key={c} onClick={() => onChange(c)} style={{ width: 24, height: 24, background: c, border: `2px solid ${value === c ? "#00ffcc" : "#222"}`, borderRadius: "50%", cursor: "pointer", boxShadow: value === c ? `0 0 8px ${c}` : "none", flexShrink: 0 }} />
      ))}
    </div>
  );
}

// ─── Cycle control ────────────────────────────────────────────────────────────
function Cycle({ value, labels, onChange }: { value: number; labels: string[]; onChange: (v: number) => void }) {
  const max = labels.length;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button onClick={() => onChange((value - 1 + max) % max)} style={{ background: "#111", border: "1px solid #333", color: "#888", width: 28, height: 28, cursor: "pointer", fontSize: 16, fontFamily: "monospace", flexShrink: 0 }}>‹</button>
      <span style={{ flex: 1, textAlign: "center", color: "#00ffcc", fontSize: 11, fontFamily: "'Press Start 2P', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{labels[value] ?? `${value}`}</span>
      <button onClick={() => onChange((value + 1) % max)} style={{ background: "#111", border: "1px solid #333", color: "#888", width: 28, height: 28, cursor: "pointer", fontSize: 16, fontFamily: "monospace", flexShrink: 0 }}>›</button>
    </div>
  );
}

// ─── Color picker with preview swatch + native input ─────────────────────────
const PRESET_COLORS = [
  "#1f2937","#7f1d1d","#14532d","#1e3a5f","#3b0764","#431407",
  "#374151","#991b1b","#166534","#1e40af","#6d28d9","#92400e",
  "#6b7280","#dc2626","#16a34a","#2563eb","#7c3aed","#d97706",
  "#f59e0b","#ef4444","#22c55e","#3b82f6","#a855f7","#f97316",
  "#000000","#1a1a1a","#ffffff","#cccccc","#888888","#444444",
];

function ColorPick({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div>
      {/* Preset swatches */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
        {PRESET_COLORS.map((c) => (
          <button key={c} onClick={() => onChange(c)} style={{ width: 22, height: 22, background: c, border: `2px solid ${value === c ? "#00ffcc" : "#222"}`, cursor: "pointer", flexShrink: 0, boxShadow: value === c ? `0 0 6px ${c}` : "none" }} />
        ))}
      </div>
      {/* Custom color row: big visible swatch + native input */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, background: value, border: "2px solid #333", flexShrink: 0 }} />
        <span style={{ color: "#555", fontSize: 10, fontFamily: "monospace", flex: 1 }}>{value}</span>
        <label style={{ background: "#1a1a2a", border: "1px solid #00ffcc44", color: "#00ffcc", fontFamily: "'Press Start 2P', monospace", fontSize: 8, padding: "8px 12px", cursor: "pointer", position: "relative" }}>
          PICK COLOR
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", top: 0, left: 0, cursor: "pointer" }} />
        </label>
      </div>
    </div>
  );
}

// ─── Label wrapper ────────────────────────────────────────────────────────────
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 8, color: "#555", fontFamily: "'Press Start 2P', monospace", marginBottom: 6, letterSpacing: "0.1em" }}>{label}</div>
      {children}
    </div>
  );
}

type Tab = "face" | "hair" | "outfit" | "extras";

export default function CharacterCreator() {
  const router = useRouter();
  const { avatar: storeAvatar, setAvatar } = useGameStore();
  const [cfg, setCfg] = useState<AvatarConfig>(() => storeAvatar);
  const [tab, setTab] = useState<Tab>("face");
  const [previewSize, setPreviewSize] = useState(400);

  const upd = (p: Partial<AvatarConfig>) => setCfg((prev) => ({ ...prev, ...p }));

  useEffect(() => {
    const update = () => {
      const h = window.innerHeight;
      // Fill most of the left panel
      setPreviewSize(Math.min(Math.floor(h * 0.75), 600));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleDone = () => {
    const name = (cfg.characterName ?? "").trim() || "Explorer";
    setAvatar({ ...cfg, characterName: name });
    router.push("/intro");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#030008", display: "flex", overflow: "hidden" }}>

      {/* ── LEFT: Fullscreen character preview ── */}
      <div style={{ flex: "0 0 55%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#030008", position: "relative", borderRight: "1px solid #0a0a18" }}>
        {/* Ambient glow behind character */}
        <div style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle, #00ffcc0a 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        {/* Title */}
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#00ffcc", letterSpacing: "0.2em", marginBottom: 24, opacity: 0.7 }}>CREATE YOUR EXPLORER</div>

        {/* Character — CSS-scaled to fill preview area */}
        <div style={{ position: "relative" }}>
          <AvatarRenderer config={cfg} size={previewSize} animate />
        </div>

        {/* Name input below character */}
        <div style={{ marginTop: 24, width: "60%", maxWidth: 280 }}>
          <div style={{ fontSize: 8, color: "#555", fontFamily: "'Press Start 2P', monospace", marginBottom: 8 }}>YOUR NAME</div>
          <input
            type="text"
            maxLength={12}
            value={cfg.characterName || ""}
            onChange={(e) => upd({ characterName: e.target.value })}
            placeholder="Explorer"
            style={{ width: "100%", background: "#0a0a18", border: "2px solid #00ffcc44", color: "#00ffcc", fontFamily: "'Press Start 2P', monospace", fontSize: 12, padding: "10px 14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button onClick={() => setCfg(buildRandom(cfg.characterName ?? ""))} style={{ background: "#111", border: "1px solid #333", color: "#888", fontFamily: "'Press Start 2P', monospace", fontSize: 8, padding: "10px 16px", cursor: "pointer" }}>
            🎲 RANDOM
          </button>
          <button onClick={handleDone} style={{ background: "#00ffcc", color: "#000", border: "none", fontFamily: "'Press Start 2P', monospace", fontSize: 10, padding: "12px 24px", cursor: "pointer", boxShadow: "0 0 30px #00ffcc44" }}>
            THAT&apos;S ME! →
          </button>
        </div>
      </div>

      {/* ── RIGHT: Controls panel ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#04000a", overflow: "hidden" }}>
        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: "1px solid #0a0a18" }}>
          {(["face","hair","outfit","extras"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "16px 8px", fontFamily: "'Press Start 2P', monospace", fontSize: 8, background: tab === t ? "#00ffcc12" : "transparent", color: tab === t ? "#00ffcc" : "#444", border: "none", borderBottom: tab === t ? "2px solid #00ffcc" : "2px solid transparent", cursor: "pointer", letterSpacing: "0.1em" }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Scrollable options */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px", scrollbarWidth: "thin", scrollbarColor: "#1a1a2a transparent" }}>

          {tab === "face" && (
            <>
              <Row label="SKIN TONE">
                <Swatches colors={SKIN_TONES} value={cfg.skinTone} onChange={(v) => upd({ skinTone: v })} />
              </Row>
              <Row label="EYE SHAPE">
                <Cycle value={cfg.eyeShape} labels={EYE_NAMES} onChange={(v) => upd({ eyeShape: v })} />
              </Row>
              <Row label="EYE COLOR">
                <Swatches colors={EYE_COLORS} value={cfg.eyeColor} onChange={(v) => upd({ eyeColor: v })} />
              </Row>
              <Row label="EYEBROWS">
                <Cycle value={cfg.eyebrow} labels={EYEBROW_NAMES} onChange={(v) => upd({ eyebrow: v })} />
              </Row>
              <Row label="NOSE">
                <Cycle value={cfg.nose} labels={NOSE_NAMES} onChange={(v) => upd({ nose: v })} />
              </Row>
              <Row label="MOUTH">
                <Cycle value={cfg.mouth} labels={MOUTH_NAMES} onChange={(v) => upd({ mouth: v })} />
              </Row>
              <Row label="GLASSES">
                <Cycle value={cfg.glasses} labels={GLASSES_NAMES} onChange={(v) => upd({ glasses: v })} />
              </Row>
              <Row label="FACIAL HAIR">
                <Cycle value={cfg.facialHair} labels={FACIAL_HAIR_NAMES} onChange={(v) => upd({ facialHair: v })} />
              </Row>
              <Row label="EXPRESSION">
                <Cycle value={cfg.expression ?? 0} labels={EXPRESSION_NAMES} onChange={(v) => upd({ expression: v })} />
              </Row>
              <Row label="SKIN MARKINGS">
                <Cycle value={cfg.skinMarkings ?? 0} labels={SKIN_MARKINGS_NAMES} onChange={(v) => upd({ skinMarkings: v })} />
              </Row>
            </>
          )}

          {tab === "hair" && (
            <>
              <Row label="HAIR STYLE">
                <Cycle value={cfg.hairStyle} labels={HAIR_STYLE_NAMES} onChange={(v) => upd({ hairStyle: v })} />
              </Row>
              <Row label="NATURAL COLORS">
                <Swatches colors={HAIR_COLORS.slice(0, 10)} value={cfg.hairColor} onChange={(v) => upd({ hairColor: v })} />
              </Row>
              <Row label="FANTASY COLORS">
                <Swatches colors={HAIR_COLORS.slice(10)} value={cfg.hairColor} onChange={(v) => upd({ hairColor: v })} />
              </Row>
              <Row label="CUSTOM COLOR">
                <ColorPick value={cfg.hairColor} onChange={(v) => upd({ hairColor: v })} />
              </Row>
            </>
          )}

          {tab === "outfit" && (
            <>
              <Row label="CLOTHING">
                <Cycle value={cfg.clothing} labels={CLOTHING_NAMES} onChange={(v) => upd({ clothing: v })} />
              </Row>
              <Row label="PRIMARY COLOR">
                <ColorPick value={cfg.clothingColorPrimary} onChange={(v) => upd({ clothingColorPrimary: v })} />
              </Row>
              <Row label="SECONDARY COLOR">
                <ColorPick value={cfg.clothingColorSecondary} onChange={(v) => upd({ clothingColorSecondary: v })} />
              </Row>
              <Row label="SHOES">
                <Cycle value={cfg.shoes} labels={SHOES_NAMES} onChange={(v) => upd({ shoes: v })} />
              </Row>
              <Row label="SHOES COLOR">
                <ColorPick value={cfg.shoesColor} onChange={(v) => upd({ shoesColor: v })} />
              </Row>
              <Row label="BODY TYPE">
                <div style={{ display: "flex", gap: 8 }}>
                  {["Slim","Average","Wide"].map((bt, i) => (
                    <button key={bt} onClick={() => upd({ bodyType: i })} style={{ flex: 1, padding: "10px 4px", fontFamily: "'Press Start 2P', monospace", fontSize: 8, background: cfg.bodyType === i ? "#00ffcc12" : "#0a0a18", color: cfg.bodyType === i ? "#00ffcc" : "#444", border: `1px solid ${cfg.bodyType === i ? "#00ffcc" : "#222"}`, cursor: "pointer" }}>{bt}</button>
                  ))}
                </div>
              </Row>
            </>
          )}

          {tab === "extras" && (
            <>
              <Row label="HEADWEAR">
                <Cycle value={cfg.headwear ?? 0} labels={HEADWEAR_NAMES} onChange={(v) => upd({ headwear: v })} />
              </Row>
              <Row label="HEADWEAR COLOR">
                <ColorPick value={cfg.headwearColor ?? "#333333"} onChange={(v) => upd({ headwearColor: v })} />
              </Row>
              <Row label="BAG / BACKPACK">
                <Cycle value={cfg.backpackType ?? 0} labels={BACKPACK_NAMES} onChange={(v) => upd({ backpackType: v })} />
              </Row>
              <Row label="BAG COLOR">
                <ColorPick value={cfg.backpackColor ?? "#1a1a2e"} onChange={(v) => upd({ backpackColor: v })} />
              </Row>
              <Row label="AURA EFFECT">
                <Cycle value={cfg.auraEffect ?? 0} labels={AURA_NAMES} onChange={(v) => upd({ auraEffect: v })} />
              </Row>
              <Row label="ACCESSORIES">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {(["backpack","headphones","badge","earrings"] as const).map((acc) => (
                    <button key={acc} onClick={() => upd({ accessories: { ...cfg.accessories, [acc]: !cfg.accessories[acc] } })} style={{ padding: "10px 4px", fontFamily: "'Press Start 2P', monospace", fontSize: 7, background: cfg.accessories[acc] ? "#00ffcc12" : "#0a0a18", color: cfg.accessories[acc] ? "#00ffcc" : "#444", border: `1px solid ${cfg.accessories[acc] ? "#00ffcc" : "#222"}`, cursor: "pointer" }}>
                      {acc} {cfg.accessories[acc] ? "✓" : "○"}
                    </button>
                  ))}
                </div>
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
