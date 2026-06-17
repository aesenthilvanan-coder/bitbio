"use client";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
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

// ─── Deterministic star particles (avoids SSR hydration mismatch) ─────────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  left: `${(((i * 127 + 17) * 31) % 10000) / 100}%`,
  top: `${(((i * 97 + 43) * 53) % 10000) / 100}%`,
  size: 1 + (i % 3),
  delay: `${((i * 13) % 50) / 10}s`,
  duration: `${1.5 + (i % 5) * 0.5}s`,
}));

const PRESET_COLORS = [
  "#1f2937","#7f1d1d","#14532d","#1e3a5f","#3b0764","#431407",
  "#374151","#991b1b","#166534","#1e40af","#6d28d9","#92400e",
  "#6b7280","#dc2626","#16a34a","#2563eb","#7c3aed","#d97706",
  "#f59e0b","#ef4444","#22c55e","#3b82f6","#a855f7","#f97316",
  "#000000","#1a1a1a","#ffffff","#cccccc","#888888","#444444",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// ─── Section divider ──────────────────────────────────────────────────────────
function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, marginTop:8 }}>
      <div style={{ flex:1, height:1, background:"#00ffcc22" }} />
      <span style={{
        fontFamily:"'Press Start 2P', monospace", fontSize:6,
        color:"#00ffcc55", letterSpacing:"0.2em",
      }}>{children}</span>
      <div style={{ flex:1, height:1, background:"#00ffcc22" }} />
    </div>
  );
}

// ─── Label row ────────────────────────────────────────────────────────────────
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{
        fontSize:7, color:"#444",
        fontFamily:"'Press Start 2P', monospace",
        marginBottom:6, letterSpacing:"0.12em",
      }}>{label}</div>
      {children}
    </div>
  );
}

// ─── Big cycle arrows ─────────────────────────────────────────────────────────
function BigCycle({ value, labels, onChange }: { value:number; labels:string[]; onChange:(v:number)=>void }) {
  const max = labels.length;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <button
        onClick={() => onChange((value - 1 + max) % max)}
        className="cycle-arrow"
        style={{
          width:40, height:40, background:"#0a0a18",
          border:"2px solid #00ffcc33", color:"#00ffcc88",
          fontSize:20, cursor:"pointer", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.1s",
        }}
      >‹</button>
      <div style={{
        flex:1, background:"#0a0a18", border:"1px solid #00ffcc22",
        padding:"10px 8px", textAlign:"center",
        fontFamily:"'Press Start 2P', monospace", fontSize:9,
        color:"#00ffcc", textShadow:"0 0 8px #00ffcc66",
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
      }}>
        {labels[value] ?? `${value}`}
      </div>
      <button
        onClick={() => onChange((value + 1) % max)}
        className="cycle-arrow"
        style={{
          width:40, height:40, background:"#0a0a18",
          border:"2px solid #00ffcc33", color:"#00ffcc88",
          fontSize:20, cursor:"pointer", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.1s",
        }}
      >›</button>
    </div>
  );
}

// ─── Swatch grid (32×32 per swatch) ──────────────────────────────────────────
function SwatchGrid({ colors, value, onChange }: { colors:string[]; value:string; onChange:(c:string)=>void }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{
          width:40, height:40, background:value,
          border:"2px solid #333",
          boxShadow:`0 0 10px ${value}88`, flexShrink:0,
        }} />
        <span style={{ fontFamily:"'Press Start 2P', monospace", fontSize:6, color:"#333" }}>SELECTED</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(8, 32px)", gap:4 }}>
        {colors.map((c) => (
          <button
            key={c}
            className="swatch-btn"
            onClick={() => onChange(c)}
            style={{
              width:32, height:32, background:c,
              border:`2px solid ${value === c ? "#ffffff" : "#111111"}`,
              cursor:"pointer",
              boxShadow:value === c ? `0 0 10px ${c}, 0 0 20px ${c}44` : "none",
              transition:"transform 0.1s",
              outline:value === c ? `2px solid ${c}88` : "none",
              outlineOffset:2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Color picker (60×60 preview + preset grid + native input) ────────────────
function ColorPick({ value, onChange }: { value:string; onChange:(c:string)=>void }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <div style={{
          width:60, height:60, background:value, flexShrink:0,
          border:`2px solid ${value}88`, boxShadow:`0 0 16px ${value}66`,
        }} />
        <div>
          <div style={{ fontFamily:"'Press Start 2P', monospace", fontSize:7, color:"#444", marginBottom:6 }}>{value}</div>
          <label style={{
            background:"#1a1a2a", border:"1px solid #00ffcc44",
            color:"#00ffcc", fontFamily:"'Press Start 2P', monospace", fontSize:7,
            padding:"8px 12px", cursor:"pointer", position:"relative", display:"inline-block",
          }}>
            PICK COLOR
            <input
              type="color" value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{ position:"absolute", opacity:0, width:"100%", height:"100%", top:0, left:0, cursor:"pointer" }}
            />
          </label>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(8, 28px)", gap:3 }}>
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            className="swatch-btn"
            onClick={() => onChange(c)}
            style={{
              width:28, height:28, background:c,
              border:`2px solid ${value === c ? "#fff" : "#222"}`,
              cursor:"pointer",
              boxShadow:value === c ? `0 0 8px ${c}` : "none",
              transition:"transform 0.1s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
type Tab = "face" | "hair" | "outfit" | "extras";

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id:"face",   icon:"👤", label:"FACE"   },
  { id:"hair",   icon:"💇", label:"HAIR"   },
  { id:"outfit", icon:"👔", label:"OUTFIT" },
  { id:"extras", icon:"✨", label:"EXTRAS" },
];

// ─── Corner bracket decoration ────────────────────────────────────────────────
const CORNERS = [
  { top:-6, left:-6,  borderTop:"3px solid #00ffcc", borderLeft:"3px solid #00ffcc"   },
  { top:-6, right:-6, borderTop:"3px solid #00ffcc", borderRight:"3px solid #00ffcc"  },
  { bottom:-6, left:-6,  borderBottom:"3px solid #00ffcc", borderLeft:"3px solid #00ffcc"  },
  { bottom:-6, right:-6, borderBottom:"3px solid #00ffcc", borderRight:"3px solid #00ffcc" },
] as const;

// ─── Main component ───────────────────────────────────────────────────────────
export default function CharacterCreator() {
  const router = useRouter();
  const { avatar: storeAvatar, setAvatar } = useGameStore();
  const [cfg, setCfg] = useState<AvatarConfig>(() => storeAvatar);
  const [tab, setTab] = useState<Tab>("face");
  const [previewSize, setPreviewSize] = useState(300);
  const [confirmPending, setConfirmPending] = useState(false);
  const [randSpinning, setRandSpinning] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");

  const upd = (p: Partial<AvatarConfig>) => setCfg((prev) => ({ ...prev, ...p }));

  useEffect(() => {
    const update = () => setPreviewSize(Math.min(Math.floor(window.innerHeight * 0.52), 400));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!confirmPending) return;
    const id = setInterval(() => setLoadingDots((d) => (d.length >= 3 ? "" : d + ".")), 400);
    return () => clearInterval(id);
  }, [confirmPending]);

  const handleRandomize = () => {
    setCfg(buildRandom(cfg.characterName ?? ""));
    setRandSpinning(true);
    setTimeout(() => setRandSpinning(false), 650);
  };

  const handleDone = () => {
    if (confirmPending) return;
    const name = (cfg.characterName ?? "").trim() || "Explorer";
    setAvatar({ ...cfg, characterName: name });
    setConfirmPending(true);
    setTimeout(() => router.push("/intro"), 1500);
  };

  // ── Stat computations ──────────────────────────────────────────────────────
  const styleScore  = Math.min(10, Math.round((cfg.clothing / 19) * 10));
  let   brainScore  = 0;
  if (cfg.glasses > 0)             brainScore += 4;
  if (cfg.accessories.headphones)  brainScore += 2;
  if (cfg.accessories.badge)       brainScore += 2;
  if ((cfg.backpackType ?? 0) > 0) brainScore += 2;
  brainScore = Math.min(10, brainScore);
  const swagScore    = (cfg.auraEffect ?? 0) > 0
    ? Math.min(10, 3 + Math.round(((cfg.auraEffect ?? 0) / 9) * 7))
    : 0;
  const scienceScore = 10;

  const STAT_LIST = [
    { label:"STYLE",   value:styleScore,   color:"#f59e0b" },
    { label:"BRAIN",   value:brainScore,   color:"#3b82f6" },
    { label:"SWAG",    value:swagScore,    color:"#a855f7" },
    { label:"SCIENCE", value:scienceScore, color:"#00ffcc" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000", display:"flex", overflow:"hidden" }}>

      {/* ── Global CSS ── */}
      <style>{`
        @keyframes starTwinkle {
          0%,100% { opacity:.15; transform:scale(1); }
          50%      { opacity:1;   transform:scale(1.8); }
        }
        @keyframes ringGlow {
          0%   { border-color:#00ffaa; box-shadow:0 0 22px #00ffaa55,inset 0 0 20px #00ffaa08; }
          25%  { border-color:#52b788; box-shadow:0 0 22px #52b78855,inset 0 0 20px #52b78808; }
          50%  { border-color:#a855f7; box-shadow:0 0 22px #a855f755,inset 0 0 20px #a855f708; }
          75%  { border-color:#c0a0ff; box-shadow:0 0 22px #c0a0ff55,inset 0 0 20px #c0a0ff08; }
          100% { border-color:#00ffaa; box-shadow:0 0 22px #00ffaa55,inset 0 0 20px #00ffaa08; }
        }
        @keyframes nameGlow {
          0%,100% { text-shadow:0 0 8px #00ffcc66; }
          50%      { text-shadow:0 0 18px #00ffccbb,0 0 32px #00ffcc44; }
        }
        @keyframes spinOnce {
          0%   { transform:rotate(0deg)   scale(1);   }
          50%  { transform:rotate(180deg) scale(1.1); }
          100% { transform:rotate(360deg) scale(1);   }
        }
        @keyframes flashWhite {
          0%  { opacity:0;    }
          15% { opacity:0.95; }
          100%{ opacity:0;    }
        }
        @keyframes loadingPulse {
          0%,100% { opacity:1;   }
          50%      { opacity:0.3; }
        }
        .char-input::placeholder { color:#1a1a1a; }
        .rand-btn:hover   { border-color:#c084fc !important; box-shadow:0 0 28px #a855f788 !important; }
        .confirm-btn:hover{ box-shadow:0 0 50px #00ffccaa !important; }
        .tab-btn:hover    { background:#00ffcc0a !important; }
        .swatch-btn:hover { transform:scale(1.3) !important; position:relative; z-index:2; }
        .cycle-arrow:hover{ background:#00ffcc18 !important; color:#00ffcc !important; border-color:#00ffcc88 !important; }
        ::-webkit-scrollbar        { width:5px; }
        ::-webkit-scrollbar-track  { background:#050505; }
        ::-webkit-scrollbar-thumb  { background:#00ffcc33; border-radius:2px; }
        ::-webkit-scrollbar-thumb:hover { background:#00ffcc77; }
      `}</style>

      {/* ── Scanlines ── */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 3px)",
      }} />

      {/* ── Star particles ── */}
      {STARS.map((star, i) => (
        <div key={i} style={{
          position:"fixed", left:star.left, top:star.top,
          width:star.size, height:star.size,
          background:"#ffffff", borderRadius:"50%",
          animation:`starTwinkle ${star.duration} ${star.delay} ease-in-out infinite`,
          pointerEvents:"none", zIndex:0,
        }} />
      ))}

      {/* ── Main split layout ── */}
      <div style={{ position:"relative", zIndex:1, display:"flex", width:"100%", height:"100%" }}>

        {/* ════ LEFT PANEL ════ */}
        <div style={{
          flex:"0 0 55%", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          position:"relative", borderRight:"1px solid #0a0a18",
        }}>
          {/* Radial spotlight */}
          <div style={{
            position:"absolute", width:520, height:520,
            background:"radial-gradient(circle,#00ffcc08 0%,transparent 70%)",
            borderRadius:"50%", pointerEvents:"none",
            top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          }} />

          {/* Title */}
          <div style={{
            fontFamily:"'Press Start 2P', monospace", fontSize:8,
            color:"#00ffcc", letterSpacing:"0.25em",
            marginBottom:18, opacity:0.75, textShadow:"0 0 12px #00ffcc66",
          }}>
            [ CREATE YOUR EXPLORER ]
          </div>

          {/* Character frame with animated ring */}
          <div style={{
            position:"relative", display:"inline-block",
            borderRadius:"50%", border:"3px solid #00ffaa",
            animation:"ringGlow 4s linear infinite", padding:10,
          }}>
            {CORNERS.map((s, i) => (
              <div key={i} style={{ position:"absolute", width:16, height:16, ...s }} />
            ))}
            <div style={{ filter:"drop-shadow(0 0 20px #00ffcc44)" }}>
              <AvatarRenderer config={cfg} size={previewSize} animate />
            </div>
          </div>

          {/* Name input */}
          <div style={{ marginTop:18, width:"62%", maxWidth:300 }}>
            <div style={{
              fontSize:7, color:"#00ffcc66",
              fontFamily:"'Press Start 2P', monospace",
              marginBottom:5, letterSpacing:"0.2em",
            }}>YOUR NAME</div>
            <input
              className="char-input"
              type="text" maxLength={12}
              value={cfg.characterName || ""}
              onChange={(e) => upd({ characterName: e.target.value })}
              placeholder="Explorer"
              style={{
                width:"100%", boxSizing:"border-box",
                background:"#050510", border:"none",
                borderBottom:"2px solid #00ffcc55",
                color:"#00ffcc",
                fontFamily:"'Press Start 2P', monospace", fontSize:14,
                padding:"10px 12px", outline:"none",
                animation:"nameGlow 2.5s ease-in-out infinite",
              }}
            />
          </div>

          {/* Stat bars */}
          <div style={{ marginTop:14, width:"62%", maxWidth:300 }}>
            {STAT_LIST.map(({ label, value, color }) => (
              <div key={label} style={{ marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{
                  fontFamily:"'Press Start 2P', monospace", fontSize:5,
                  color, width:52, flexShrink:0, textShadow:`0 0 6px ${color}88`,
                }}>{label}</span>
                <div style={{ display:"flex", gap:2, flex:1 }}>
                  {Array.from({ length:10 }, (_, i) => (
                    <div key={i} style={{
                      flex:1, height:7,
                      background: i < value ? color : "#111111",
                      border:`1px solid ${i < value ? color+"55" : "#1a1a1a"}`,
                      boxShadow: i < value ? `0 0 4px ${color}55` : "none",
                    }} />
                  ))}
                </div>
                <span style={{
                  fontFamily:"'Press Start 2P', monospace", fontSize:5,
                  color:color+"99", width:22, textAlign:"right", flexShrink:0,
                }}>{value}/10</span>
              </div>
            ))}
            <div style={{
              fontFamily:"'Press Start 2P', monospace", fontSize:5,
              color:"#00ffcc33", textAlign:"right", marginTop:3,
            }}>* a true scientist&apos;s potential</div>
          </div>

          {/* Buttons */}
          <div style={{ display:"flex", gap:12, marginTop:20 }}>
            <button
              className="rand-btn"
              onClick={handleRandomize}
              style={{
                background:"#0d0020", border:"2px solid #a855f7",
                color:"#a855f7", fontFamily:"'Press Start 2P', monospace",
                fontSize:8, padding:"12px 16px", cursor:"pointer",
                boxShadow:"0 0 16px #a855f744",
                transition:"border-color 0.15s,box-shadow 0.15s",
                animation: randSpinning ? "spinOnce 0.65s ease-out" : "none",
              }}
            >
              🎲 RANDOMIZE
            </button>
            <button
              className="confirm-btn"
              onClick={handleDone}
              style={{
                background:"#00ffcc", color:"#000000", border:"none",
                fontFamily:"'Press Start 2P', monospace", fontSize:9,
                padding:"12px 24px", cursor:"pointer",
                boxShadow:"0 0 30px #00ffcc66,0 0 60px #00ffcc22",
                transition:"box-shadow 0.15s",
              }}
            >
              CONFIRM →
            </button>
          </div>
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div style={{
          flex:1, display:"flex", flexDirection:"column",
          background:"#04000a", overflow:"hidden",
        }}>

          {/* Tab bar */}
          <div style={{ display:"flex", borderBottom:"2px solid #0a0a18", flexShrink:0 }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className="tab-btn"
                onClick={() => setTab(t.id)}
                style={{
                  flex:1, padding:"14px 4px 10px",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:5,
                  fontFamily:"'Press Start 2P', monospace", fontSize:7,
                  background: tab === t.id ? "#00ffcc0d" : "transparent",
                  color: tab === t.id ? "#00ffcc" : "#333",
                  border:"none",
                  borderBottom: tab === t.id ? "3px solid #00ffcc" : "3px solid transparent",
                  cursor:"pointer", letterSpacing:"0.08em",
                  transition:"all 0.15s",
                  textShadow: tab === t.id ? "0 0 8px #00ffcc77" : "none",
                }}
              >
                <span style={{ fontSize:22 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Scrollable option area */}
          <div style={{ flex:1, overflowY:"auto", padding:"18px" }}>

            {tab === "face" && (
              <>
                <SectionHeader>COMPLEXION</SectionHeader>
                <Row label="SKIN TONE">
                  <SwatchGrid colors={SKIN_TONES} value={cfg.skinTone} onChange={(v) => upd({ skinTone: v })} />
                </Row>
                <SectionHeader>EYES</SectionHeader>
                <Row label="EYE SHAPE">
                  <BigCycle value={cfg.eyeShape} labels={EYE_NAMES} onChange={(v) => upd({ eyeShape: v })} />
                </Row>
                <Row label="EYE COLOR">
                  <SwatchGrid colors={EYE_COLORS} value={cfg.eyeColor} onChange={(v) => upd({ eyeColor: v })} />
                </Row>
                <Row label="EYEBROWS">
                  <BigCycle value={cfg.eyebrow} labels={EYEBROW_NAMES} onChange={(v) => upd({ eyebrow: v })} />
                </Row>
                <SectionHeader>FEATURES</SectionHeader>
                <Row label="NOSE">
                  <BigCycle value={cfg.nose} labels={NOSE_NAMES} onChange={(v) => upd({ nose: v })} />
                </Row>
                <Row label="MOUTH">
                  <BigCycle value={cfg.mouth} labels={MOUTH_NAMES} onChange={(v) => upd({ mouth: v })} />
                </Row>
                <Row label="GLASSES">
                  <BigCycle value={cfg.glasses} labels={GLASSES_NAMES} onChange={(v) => upd({ glasses: v })} />
                </Row>
                <Row label="FACIAL HAIR">
                  <BigCycle value={cfg.facialHair} labels={FACIAL_HAIR_NAMES} onChange={(v) => upd({ facialHair: v })} />
                </Row>
                <SectionHeader>DETAILS</SectionHeader>
                <Row label="EXPRESSION">
                  <BigCycle value={cfg.expression ?? 0} labels={EXPRESSION_NAMES} onChange={(v) => upd({ expression: v })} />
                </Row>
                <Row label="SKIN MARKINGS">
                  <BigCycle value={cfg.skinMarkings ?? 0} labels={SKIN_MARKINGS_NAMES} onChange={(v) => upd({ skinMarkings: v })} />
                </Row>
              </>
            )}

            {tab === "hair" && (
              <>
                <SectionHeader>STYLE</SectionHeader>
                <Row label="HAIR STYLE">
                  <BigCycle value={cfg.hairStyle} labels={HAIR_STYLE_NAMES} onChange={(v) => upd({ hairStyle: v })} />
                </Row>
                <SectionHeader>COLOR</SectionHeader>
                <Row label="NATURAL">
                  <SwatchGrid colors={HAIR_COLORS.slice(0, 10)} value={cfg.hairColor} onChange={(v) => upd({ hairColor: v })} />
                </Row>
                <Row label="FANTASY">
                  <SwatchGrid colors={HAIR_COLORS.slice(10)} value={cfg.hairColor} onChange={(v) => upd({ hairColor: v })} />
                </Row>
                <Row label="CUSTOM">
                  <ColorPick value={cfg.hairColor} onChange={(v) => upd({ hairColor: v })} />
                </Row>
              </>
            )}

            {tab === "outfit" && (
              <>
                <SectionHeader>CLOTHING</SectionHeader>
                <Row label="STYLE">
                  <BigCycle value={cfg.clothing} labels={CLOTHING_NAMES} onChange={(v) => upd({ clothing: v })} />
                </Row>
                <Row label="PRIMARY COLOR">
                  <ColorPick value={cfg.clothingColorPrimary} onChange={(v) => upd({ clothingColorPrimary: v })} />
                </Row>
                <Row label="SECONDARY COLOR">
                  <ColorPick value={cfg.clothingColorSecondary} onChange={(v) => upd({ clothingColorSecondary: v })} />
                </Row>
                <SectionHeader>FOOTWEAR</SectionHeader>
                <Row label="SHOES">
                  <BigCycle value={cfg.shoes} labels={SHOES_NAMES} onChange={(v) => upd({ shoes: v })} />
                </Row>
                <Row label="SHOE COLOR">
                  <ColorPick value={cfg.shoesColor} onChange={(v) => upd({ shoesColor: v })} />
                </Row>
                <SectionHeader>BUILD</SectionHeader>
                <Row label="BODY TYPE">
                  <div style={{ display:"flex", gap:8 }}>
                    {["Slim","Average","Wide"].map((bt, i) => (
                      <button key={bt} onClick={() => upd({ bodyType: i })} style={{
                        flex:1, padding:"10px 4px",
                        fontFamily:"'Press Start 2P', monospace", fontSize:7,
                        background: cfg.bodyType === i ? "#00ffcc12" : "#0a0a18",
                        color: cfg.bodyType === i ? "#00ffcc" : "#444",
                        border:`2px solid ${cfg.bodyType === i ? "#00ffcc66" : "#1a1a1a"}`,
                        cursor:"pointer",
                        boxShadow: cfg.bodyType === i ? "0 0 10px #00ffcc33" : "none",
                        transition:"all 0.15s",
                      }}>{bt}</button>
                    ))}
                  </div>
                </Row>
              </>
            )}

            {tab === "extras" && (
              <>
                <SectionHeader>HEADWEAR</SectionHeader>
                <Row label="STYLE">
                  <BigCycle value={cfg.headwear ?? 0} labels={HEADWEAR_NAMES} onChange={(v) => upd({ headwear: v })} />
                </Row>
                <Row label="COLOR">
                  <ColorPick value={cfg.headwearColor ?? "#333333"} onChange={(v) => upd({ headwearColor: v })} />
                </Row>
                <SectionHeader>BAG</SectionHeader>
                <Row label="BACKPACK">
                  <BigCycle value={cfg.backpackType ?? 0} labels={BACKPACK_NAMES} onChange={(v) => upd({ backpackType: v })} />
                </Row>
                <Row label="BAG COLOR">
                  <ColorPick value={cfg.backpackColor ?? "#1a1a2e"} onChange={(v) => upd({ backpackColor: v })} />
                </Row>
                <SectionHeader>AURA</SectionHeader>
                <Row label="AURA EFFECT">
                  <BigCycle value={cfg.auraEffect ?? 0} labels={AURA_NAMES} onChange={(v) => upd({ auraEffect: v })} />
                </Row>
                <SectionHeader>ACCESSORIES</SectionHeader>
                <Row label="TOGGLE">
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {(["backpack","headphones","badge","earrings"] as const).map((acc) => (
                      <button key={acc}
                        onClick={() => upd({ accessories: { ...cfg.accessories, [acc]: !cfg.accessories[acc] } })}
                        style={{
                          padding:"10px 4px",
                          fontFamily:"'Press Start 2P', monospace", fontSize:7,
                          background: cfg.accessories[acc] ? "#00ffcc12" : "#0a0a18",
                          color: cfg.accessories[acc] ? "#00ffcc" : "#444",
                          border:`2px solid ${cfg.accessories[acc] ? "#00ffcc55" : "#1a1a1a"}`,
                          cursor:"pointer",
                          boxShadow: cfg.accessories[acc] ? "0 0 8px #00ffcc33" : "none",
                          transition:"all 0.15s",
                        }}
                      >
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

      {/* ── Confirm overlay ── */}
      {confirmPending && (
        <div style={{
          position:"fixed", inset:0, zIndex:200,
          display:"flex", alignItems:"center", justifyContent:"center",
          background:"#000000ee",
        }}>
          {/* White flash */}
          <div style={{
            position:"absolute", inset:0, background:"white",
            animation:"flashWhite 0.6s ease-out forwards",
            pointerEvents:"none", zIndex:0,
          }} />
          {/* Loading text */}
          <div style={{
            fontFamily:"'Press Start 2P', monospace",
            fontSize:13, color:"#00ffcc",
            textShadow:"0 0 20px #00ffcc,0 0 40px #00ffcc88",
            animation:"loadingPulse 0.8s ease-in-out infinite",
            position:"relative", zIndex:1, textAlign:"center",
          }}>
            [ LOADING YOUR WORLD{loadingDots} ]
          </div>
        </div>
      )}
    </div>
  );
}
