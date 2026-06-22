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

// ─── Deterministic star particles ─────────────────────────────────────────────
const STARS = Array.from({ length: 120 }, (_, i) => ({
  left: `${(((i * 127 + 17) * 31) % 10000) / 100}%`,
  top: `${(((i * 97 + 43) * 53) % 10000) / 100}%`,
  size: 1 + (i % 3),
  delay: `${((i * 13) % 50) / 10}s`,
  duration: `${1.5 + (i % 5) * 0.5}s`,
  opacity: 0.2 + (i % 5) * 0.1,
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

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, marginTop:14 }}>
      <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,#00ffcc33)" }} />
      <span style={{
        fontFamily:"monospace", fontSize:9,
        color:"#00ffcc44", letterSpacing:"0.25em", textTransform:"uppercase",
      }}>{children}</span>
      <div style={{ flex:1, height:1, background:"linear-gradient(90deg,#00ffcc33,transparent)" }} />
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{
        fontSize:7, color:"#00ffcc55",
        fontFamily:"monospace",
        marginBottom:6, letterSpacing:"0.18em", textTransform:"uppercase",
      }}>{label}</div>
      {children}
    </div>
  );
}

function BigCycle({ value, labels, onChange }: { value:number; labels:string[]; onChange:(v:number)=>void }) {
  const max = labels.length;
  return (
    <div style={{ display:"flex", alignItems:"stretch", gap:0 }}>
      <button
        onClick={() => onChange((value - 1 + max) % max)}
        className="cycle-arrow"
        style={{
          width:36, background:"#070012",
          border:"1px solid #00ffcc22", borderRight:"none", color:"#00ffcc66",
          fontSize:16, cursor:"pointer", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.1s",
        }}
      >◀</button>
      <div style={{
        flex:1, background:"#070012", border:"1px solid #00ffcc22",
        padding:"9px 10px", textAlign:"center",
        fontFamily:"monospace", fontSize:10,
        color:"#00ffcc", letterSpacing:"0.05em",
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
        minWidth:0,
      }}>
        {labels[value] ?? `${value}`}
        <span style={{ color:"#00ffcc33", fontSize:8, marginLeft:6 }}>
          [{value+1}/{max}]
        </span>
      </div>
      <button
        onClick={() => onChange((value + 1) % max)}
        className="cycle-arrow"
        style={{
          width:36, background:"#070012",
          border:"1px solid #00ffcc22", borderLeft:"none", color:"#00ffcc66",
          fontSize:16, cursor:"pointer", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.1s",
        }}
      >▶</button>
    </div>
  );
}

function SwatchGrid({ colors, value, onChange }: { colors:string[]; value:string; onChange:(c:string)=>void }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{
          width:28, height:28, background:value, flexShrink:0,
          border:"2px solid #00ffcc44",
          boxShadow:`0 0 12px ${value}66, 0 0 4px ${value}`,
        }} />
        <span style={{ fontFamily:"monospace", fontSize:9, color:"#00ffcc66", letterSpacing:"0.1em" }}>
          {value.toUpperCase()}
        </span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, 28px)", gap:3 }}>
        {colors.map((c) => (
          <button
            key={c}
            className="swatch-btn"
            onClick={() => onChange(c)}
            style={{
              width:28, height:28, background:c,
              border:`2px solid ${value === c ? "#ffffff" : "#1a1a1a"}`,
              cursor:"pointer",
              boxShadow:value === c ? `0 0 8px ${c}, 0 0 16px ${c}44` : "none",
              transition:"transform 0.1s",
              outline:value === c ? `1px solid ${c}88` : "none",
              outlineOffset:2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ColorPick({ value, onChange }: { value:string; onChange:(c:string)=>void }) {
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
        <div style={{
          width:44, height:44, background:value, flexShrink:0,
          border:`2px solid ${value}88`, boxShadow:`0 0 14px ${value}66`,
        }} />
        <div>
          <div style={{ fontFamily:"monospace", fontSize:9, color:"#00ffcc66", marginBottom:6 }}>
            {value.toUpperCase()}
          </div>
          <label style={{
            background:"#0a001a", border:"1px solid #00ffcc33",
            color:"#00ffcc88", fontFamily:"monospace", fontSize:8,
            padding:"6px 10px", cursor:"pointer", position:"relative", display:"inline-block",
            letterSpacing:"0.1em",
          }}>
            PICK
            <input
              type="color" value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{ position:"absolute", opacity:0, width:"100%", height:"100%", top:0, left:0, cursor:"pointer" }}
            />
          </label>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, 24px)", gap:3 }}>
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            className="swatch-btn"
            onClick={() => onChange(c)}
            style={{
              width:24, height:24, background:c,
              border:`2px solid ${value === c ? "#fff" : "#222"}`,
              cursor:"pointer",
              boxShadow:value === c ? `0 0 6px ${c}` : "none",
              transition:"transform 0.1s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Pixel-art window frame ───────────────────────────────────────────────────
function PixelFrame({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position:"relative", ...style }}>
      {/* corners */}
      <div style={{ position:"absolute", top:0,  left:0,  width:8, height:8, borderTop:"2px solid #00ffcc", borderLeft:"2px solid #00ffcc" }} />
      <div style={{ position:"absolute", top:0,  right:0, width:8, height:8, borderTop:"2px solid #00ffcc", borderRight:"2px solid #00ffcc" }} />
      <div style={{ position:"absolute", bottom:0, left:0,  width:8, height:8, borderBottom:"2px solid #00ffcc", borderLeft:"2px solid #00ffcc" }} />
      <div style={{ position:"absolute", bottom:0, right:0, width:8, height:8, borderBottom:"2px solid #00ffcc", borderRight:"2px solid #00ffcc" }} />
      {children}
    </div>
  );
}

type Tab = "face" | "hair" | "outfit" | "extras";
const TABS: { id: Tab; label: string; key: string }[] = [
  { id:"face",   label:"FACE",   key:"F" },
  { id:"hair",   label:"HAIR",   key:"H" },
  { id:"outfit", label:"OUTFIT", key:"O" },
  { id:"extras", label:"EXTRAS", key:"E" },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function CharacterCreator() {
  const router = useRouter();
  const { avatar: storeAvatar, setAvatar } = useGameStore();
  const [cfg, setCfg] = useState<AvatarConfig>(() => storeAvatar);
  const [tab, setTab] = useState<Tab>("face");
  const [previewSize, setPreviewSize] = useState(220);
  const [confirmPending, setConfirmPending] = useState(false);
  const [randSpinning, setRandSpinning] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");
  const [glowIdx, setGlowIdx] = useState(0);

  const REALM_COLORS = ["#00ffaa","#52b788","#a855f7","#c0a0ff"];

  const upd = (p: Partial<AvatarConfig>) => setCfg((prev) => ({ ...prev, ...p }));

  useEffect(() => {
    const update = () => setPreviewSize(Math.min(Math.floor(window.innerHeight * 0.36), 260));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setGlowIdx((i) => (i + 1) % REALM_COLORS.length), 2000);
    return () => clearInterval(id);
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

  const glowColor = REALM_COLORS[glowIdx];

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000", display:"flex", flexDirection:"column", overflow:"hidden" }}>

      <style>{`
        @keyframes starTwinkle {
          0%,100% { opacity:.1; transform:scale(1); }
          50%      { opacity:1; transform:scale(2); }
        }
        @keyframes spinOnce {
          0%   { transform:rotate(0deg)   scale(1);   }
          50%  { transform:rotate(180deg) scale(1.1); }
          100% { transform:rotate(360deg) scale(1);   }
        }
        @keyframes flashWhite {
          0%  { opacity:0; }
          15% { opacity:0.95; }
          100%{ opacity:0; }
        }
        @keyframes loadingPulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.3; }
        }
        @keyframes cursorBlink {
          0%,100% { opacity:1; }
          50%      { opacity:0; }
        }
        @keyframes scanline {
          0%  { transform:translateY(0); }
          100%{ transform:translateY(4px); }
        }
        .char-input { caret-color:#00ffcc; }
        .char-input::placeholder { color:#1a2a1a; }
        .char-input:focus { outline:none; border-color:#00ffcc88 !important; box-shadow:0 0 12px #00ffcc33 !important; }
        .rand-btn:hover   { border-color:#c084fc !important; box-shadow:0 0 24px #a855f788 !important; background:#1a0030 !important; }
        .confirm-btn:hover{ box-shadow:0 0 40px #00ffcc99 !important; transform:scale(1.02); }
        .tab-btn:hover    { background:#00ffcc10 !important; color:#00ffccaa !important; }
        .swatch-btn:hover { transform:scale(1.4) !important; position:relative; z-index:2; }
        .cycle-arrow:hover{ background:#00ffcc15 !important; color:#00ffcc !important; border-color:#00ffcc55 !important; }
        .opt-btn:hover    { border-color:#00ffcc55 !important; color:#00ffcccc !important; background:#00ffcc0a !important; }
        ::-webkit-scrollbar        { width:4px; }
        ::-webkit-scrollbar-track  { background:#030308; }
        ::-webkit-scrollbar-thumb  { background:#00ffcc22; }
        ::-webkit-scrollbar-thumb:hover { background:#00ffcc55; }
      `}</style>

      {/* scanlines */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)",
        animation:"scanline 0.1s linear infinite",
      }} />

      {/* stars */}
      {STARS.map((star, i) => (
        <div key={i} style={{
          position:"fixed", left:star.left, top:star.top,
          width:star.size, height:star.size,
          background:"#ffffff", borderRadius:"50%",
          animation:`starTwinkle ${star.duration} ${star.delay} ease-in-out infinite`,
          pointerEvents:"none", zIndex:0, opacity:star.opacity,
        }} />
      ))}

      {/* ── HEADER BAR ── */}
      <div style={{
        position:"relative", zIndex:2, flexShrink:0,
        background:"#000000",
        borderBottom:`1px solid ${glowColor}33`,
        padding:"10px 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        transition:"border-color 1s",
      }}>
        <div style={{
          fontFamily:"monospace", fontSize:9, letterSpacing:"0.5em",
          color:glowColor, textShadow:`0 0 16px ${glowColor}88`,
          transition:"color 1s, text-shadow 1s",
        }}>
          ▸ DESIGN YOUR EXPLORER ◂
        </div>
        <div style={{ fontFamily:"monospace", fontSize:7, color:"#00ffcc22", letterSpacing:"0.2em" }}>
          BITBIO v1.0 // CHARACTER SELECT
        </div>
      </div>

      {/* ── MAIN SPLIT ── */}
      <div style={{ position:"relative", zIndex:1, display:"flex", flex:1, overflow:"hidden" }}>

        {/* ════ LEFT PANEL — Avatar + stats ════ */}
        <div style={{
          flex:"0 0 340px", display:"flex", flexDirection:"column",
          alignItems:"center", padding:"20px 16px",
          borderRight:`1px solid #00ffcc0a`,
          background:"#010108",
          overflowY:"auto",
        }}>

          {/* Avatar frame */}
          <PixelFrame style={{ marginBottom:14 }}>
            <div style={{
              background:"#030310",
              border:`1px solid ${glowColor}44`,
              boxShadow:`0 0 30px ${glowColor}22, inset 0 0 20px #00000088`,
              padding:12,
              transition:"border-color 1s, box-shadow 1s",
            }}>
              <div style={{ filter:`drop-shadow(0 0 16px ${glowColor}55)`, transition:"filter 1s" }}>
                <AvatarRenderer config={cfg} size={previewSize} animate />
              </div>
            </div>
          </PixelFrame>

          {/* Realm indicator dots */}
          <div style={{ display:"flex", gap:6, marginBottom:14 }}>
            {REALM_COLORS.map((c, i) => (
              <div key={c} style={{
                width:8, height:8,
                background: i === glowIdx ? c : "#111",
                boxShadow: i === glowIdx ? `0 0 8px ${c}` : "none",
                border:`1px solid ${c}44`,
                transition:"background 1s, box-shadow 1s",
              }} />
            ))}
          </div>

          {/* Name input */}
          <div style={{ width:"100%", marginBottom:12 }}>
            <div style={{
              fontFamily:"monospace", fontSize:7, color:"#00ffcc44",
              marginBottom:5, letterSpacing:"0.2em",
            }}>YOUR NAME</div>
            <div style={{ position:"relative" }}>
              <span style={{
                position:"absolute", left:10, top:"50%", transform:"translateY(-50%)",
                color:"#00ffcc44", fontFamily:"monospace", fontSize:10, pointerEvents:"none",
              }}>▶</span>
              <input
                className="char-input"
                type="text" maxLength={12}
                value={cfg.characterName || ""}
                onChange={(e) => upd({ characterName: e.target.value })}
                placeholder="Explorer"
                style={{
                  width:"100%", boxSizing:"border-box",
                  background:"#030310", border:"1px solid #00ffcc22",
                  color:"#00ffcc",
                  fontFamily:"monospace", fontSize:13,
                  padding:"9px 10px 9px 28px",
                  letterSpacing:"0.08em",
                  transition:"border-color 0.2s, box-shadow 0.2s",
                }}
              />
            </div>
          </div>

          {/* Pixel-art stat bars */}
          <div style={{ width:"100%", marginBottom:16 }}>
            <div style={{ fontFamily:"monospace", fontSize:7, color:"#00ffcc22", letterSpacing:"0.2em", marginBottom:8 }}>
              ── STATS ──────────────
            </div>
            {STAT_LIST.map(({ label, value, color }) => (
              <div key={label} style={{ marginBottom:7 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontFamily:"monospace", fontSize:7, color, textShadow:`0 0 8px ${color}66`, letterSpacing:"0.1em" }}>
                    {label}
                  </span>
                  <span style={{ fontFamily:"monospace", fontSize:7, color:`${color}88` }}>{value}/10</span>
                </div>
                <div style={{ display:"flex", gap:2 }}>
                  {Array.from({ length:10 }, (_, i) => (
                    <div key={i} style={{
                      flex:1, height:6,
                      background: i < value ? color : "#0a0a0a",
                      border:`1px solid ${i < value ? color+"44" : "#111"}`,
                      boxShadow: i < value ? `0 0 4px ${color}44` : "none",
                    }} />
                  ))}
                </div>
              </div>
            ))}
            <div style={{
              fontFamily:"monospace", fontSize:6, color:"#00ffcc18",
              textAlign:"right", marginTop:4, letterSpacing:"0.1em",
            }}>* true scientist&apos;s potential</div>
          </div>

          {/* Buttons */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, width:"100%" }}>
            <button
              className="rand-btn"
              onClick={handleRandomize}
              style={{
                width:"100%", background:"#0d0020", border:"1px solid #a855f755",
                color:"#a855f7", fontFamily:"monospace",
                fontSize:10, padding:"10px 0", cursor:"pointer",
                boxShadow:"0 0 12px #a855f733",
                transition:"all 0.15s", letterSpacing:"0.15em",
                animation: randSpinning ? "spinOnce 0.65s ease-out" : "none",
              }}
            >
              ⟳ RANDOMIZE
            </button>
            <button
              className="confirm-btn"
              onClick={handleDone}
              style={{
                width:"100%",
                background:`linear-gradient(135deg, #00ffcc, #00ddaa)`,
                color:"#000000", border:"none",
                fontFamily:"monospace", fontSize:11,
                padding:"12px 0", cursor:"pointer",
                boxShadow:"0 0 20px #00ffcc55, 0 0 40px #00ffcc22",
                transition:"all 0.15s", letterSpacing:"0.2em", fontWeight:"bold",
              }}
            >
              ▶ CONFIRM ▶
            </button>
          </div>
        </div>

        {/* ════ RIGHT PANEL — Options ════ */}
        <div style={{
          flex:1, display:"flex", flexDirection:"column",
          background:"#010108", overflow:"hidden",
        }}>

          {/* Tab bar */}
          <div style={{
            display:"flex", borderBottom:"1px solid #00ffcc0d",
            flexShrink:0, background:"#000000",
          }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className="tab-btn"
                onClick={() => setTab(t.id)}
                style={{
                  flex:1, padding:"14px 4px",
                  fontFamily:"monospace", fontSize:9, letterSpacing:"0.15em",
                  background: tab === t.id ? "#00ffcc08" : "transparent",
                  color: tab === t.id ? "#00ffcc" : "#333333",
                  border:"none",
                  borderBottom: tab === t.id ? "2px solid #00ffcc" : "2px solid transparent",
                  cursor:"pointer",
                  textShadow: tab === t.id ? "0 0 10px #00ffcc88" : "none",
                  transition:"all 0.15s",
                }}
              >
                [{t.key}] {t.label}
              </button>
            ))}
          </div>

          {/* Scrollable options */}
          <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>

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
                <SectionHeader>EXPRESSION</SectionHeader>
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
                <Row label="NATURAL TONES">
                  <SwatchGrid colors={HAIR_COLORS.slice(0, 10)} value={cfg.hairColor} onChange={(v) => upd({ hairColor: v })} />
                </Row>
                <Row label="FANTASY TONES">
                  <SwatchGrid colors={HAIR_COLORS.slice(10)} value={cfg.hairColor} onChange={(v) => upd({ hairColor: v })} />
                </Row>
                <Row label="CUSTOM COLOR">
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
                  <div style={{ display:"flex", gap:6 }}>
                    {["SLIM","AVERAGE","WIDE"].map((bt, i) => (
                      <button key={bt} onClick={() => upd({ bodyType: i })}
                        className="opt-btn"
                        style={{
                          flex:1, padding:"10px 4px",
                          fontFamily:"monospace", fontSize:8, letterSpacing:"0.1em",
                          background: cfg.bodyType === i ? "#00ffcc0d" : "#030310",
                          color: cfg.bodyType === i ? "#00ffcc" : "#333",
                          border:`1px solid ${cfg.bodyType === i ? "#00ffcc44" : "#111"}`,
                          cursor:"pointer",
                          boxShadow: cfg.bodyType === i ? "0 0 8px #00ffcc22" : "none",
                          transition:"all 0.15s",
                        }}
                      >{bt}</button>
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
                <SectionHeader>BACKPACK</SectionHeader>
                <Row label="STYLE">
                  <BigCycle value={cfg.backpackType ?? 0} labels={BACKPACK_NAMES} onChange={(v) => upd({ backpackType: v })} />
                </Row>
                <Row label="COLOR">
                  <ColorPick value={cfg.backpackColor ?? "#1a1a2e"} onChange={(v) => upd({ backpackColor: v })} />
                </Row>
                <SectionHeader>AURA</SectionHeader>
                <Row label="AURA EFFECT">
                  <BigCycle value={cfg.auraEffect ?? 0} labels={AURA_NAMES} onChange={(v) => upd({ auraEffect: v })} />
                </Row>
                <SectionHeader>ACCESSORIES</SectionHeader>
                <Row label="TOGGLE ON/OFF">
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                    {(["backpack","headphones","badge","earrings"] as const).map((acc) => (
                      <button key={acc}
                        className="opt-btn"
                        onClick={() => upd({ accessories: { ...cfg.accessories, [acc]: !cfg.accessories[acc] } })}
                        style={{
                          padding:"10px 8px",
                          fontFamily:"monospace", fontSize:8, letterSpacing:"0.08em",
                          background: cfg.accessories[acc] ? "#00ffcc0d" : "#030310",
                          color: cfg.accessories[acc] ? "#00ffcc" : "#333",
                          border:`1px solid ${cfg.accessories[acc] ? "#00ffcc44" : "#111"}`,
                          cursor:"pointer",
                          boxShadow: cfg.accessories[acc] ? "0 0 6px #00ffcc22" : "none",
                          transition:"all 0.15s", textTransform:"uppercase",
                        }}
                      >
                        {cfg.accessories[acc] ? "▪" : "▫"} {acc}
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
          <div style={{
            position:"absolute", inset:0, background:"white",
            animation:"flashWhite 0.6s ease-out forwards",
            pointerEvents:"none", zIndex:0,
          }} />
          <div style={{
            fontFamily:"monospace",
            fontSize:14, color:"#00ffcc",
            textShadow:"0 0 20px #00ffcc, 0 0 40px #00ffcc88",
            animation:"loadingPulse 0.8s ease-in-out infinite",
            position:"relative", zIndex:1, textAlign:"center",
            letterSpacing:"0.3em",
          }}>
            ▶ ENTERING BITBIO{loadingDots} ◀
          </div>
        </div>
      )}
    </div>
  );
}
