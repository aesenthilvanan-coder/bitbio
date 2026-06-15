"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import AvatarRenderer from "@/components/avatar/AvatarRenderer";
import PixelButton from "@/components/ui/PixelButton";
import MatrixRain from "@/components/effects/MatrixRain";
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function SwatchRow({
  colors,
  value,
  onChange,
  label,
}: {
  colors: string[];
  value: string;
  onChange: (c: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <label className="font-pixel text-[7px] text-gray-400 block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            title={c}
            className="w-7 h-7 border-2 transition-transform hover:scale-110"
            style={{
              background: c,
              borderColor: value === c ? "#39ff14" : "#374151",
              boxShadow: value === c ? `0 0 8px ${c}` : "none",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ColorWheel({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (c: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <label className="font-pixel text-[7px] text-gray-400 block">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8 cursor-pointer rounded-none border-2 border-[#374151] bg-transparent"
      />
    </div>
  );
}

function StyleGrid({
  value,
  labels,
  onChange,
  label,
  cols = 4,
}: {
  value: number;
  labels: string[];
  onChange: (v: number) => void;
  label: string;
  cols?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="font-pixel text-[7px] text-gray-400 block">{label}</label>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {labels.map((name, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            title={name}
            className="py-2 px-1 border-2 transition-all text-center overflow-hidden"
            style={{
              borderColor: value === i ? "#39ff14" : "#374151",
              background: value === i ? "#39ff1410" : "#111",
              boxShadow: value === i ? "0 0 8px #39ff1440" : "none",
            }}
          >
            <span
              className="font-pixel block"
              style={{ fontSize: 9, color: value === i ? "#39ff14" : "#6b7280" }}
            >
              {i}
            </span>
            <p
              className="font-pixel leading-tight mt-0.5 truncate"
              style={{ fontSize: 5, color: value === i ? "#39ff1480" : "#374151" }}
            >
              {name.split(" ")[0]}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CycleControl({
  value,
  labels,
  label,
  onChange,
}: {
  value: number;
  labels: string[];
  label: string;
  onChange: (v: number) => void;
}) {
  const max = labels.length;
  return (
    <div className="space-y-1">
      <label className="font-pixel text-[7px] text-gray-400 block">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange((value - 1 + max) % max)}
          className="pixel-btn pixel-btn-dark text-[8px] py-1 px-2"
        >
          ‹
        </button>
        <span className="flex-1 text-center font-pixel text-[8px] text-[#39ff14]">
          {labels[value] ?? String(value)}
        </span>
        <button
          onClick={() => onChange((value + 1) % max)}
          className="pixel-btn pixel-btn-dark text-[8px] py-1 px-2"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ─── Randomize Helper ─────────────────────────────────────────────────────────

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function buildRandomAvatar(currentName: string): AvatarConfig {
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
    clothingColorPrimary: randomFrom([
      "#1f2937", "#2d1b69", "#1a1a2e", "#0f3460", "#1b1b2f", "#16213e",
    ]),
    clothingColorSecondary: randomFrom([
      "#374151", "#4c1d95", "#2d2d44", "#0e4f6f", "#2e2e4e", "#1d2d50",
    ]),
    headwear: randomInt(HEADWEAR_NAMES.length),
    headwearColor: randomFrom(["#333333", "#8b1a1a", "#1a4a8b", "#2d5a1b"]),
    shoes: randomInt(SHOES_NAMES.length),
    shoesColor: randomFrom(["#333333", "#1a1a1a", "#8b4513", "#f5f5f5"]),
    backpackType: randomInt(BACKPACK_NAMES.length),
    backpackColor: randomFrom(["#1a1a2e", "#2d1b69", "#1b2d1b", "#2d2d2d"]),
    auraEffect: randomInt(AURA_NAMES.length),
    skinMarkings: randomInt(SKIN_MARKINGS_NAMES.length),
    expression: randomInt(EXPRESSION_NAMES.length),
    bodyType: randomInt(3),
    characterName: currentName,
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "face" | "hair" | "outfit" | "extras";

const TABS: { key: Tab; label: string }[] = [
  { key: "face", label: "FACE" },
  { key: "hair", label: "HAIR" },
  { key: "outfit", label: "OUTFIT" },
  { key: "extras", label: "EXTRAS" },
];

export default function CharacterCustomizer() {
  const router = useRouter();
  const { avatar: storeAvatar, setAvatar } = useGameStore();
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(() => storeAvatar);
  const [tab, setTab] = useState<Tab>("face");

  const upd = (partial: Partial<AvatarConfig>) =>
    setAvatarConfig((prev) => ({
      ...prev,
      accessories: { ...prev.accessories, ...(partial.accessories ?? {}) },
      ...partial,
    }));

  const handleRandomize = () => {
    setAvatarConfig(buildRandomAvatar(avatarConfig.characterName));
  };

  const handleDone = () => {
    const name = (avatarConfig.characterName ?? "").trim() || "Explorer";
    const final: AvatarConfig = { ...avatarConfig, characterName: name };
    setAvatar(final);
    router.push("/intro");
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a14] flex flex-col">
      <MatrixRain color="#00ff88" density={0.3} opacity={0.06} />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="font-pixel text-[12px] text-[#39ff14] glow-neon tracking-widest">
            CREATE YOUR EXPLORER
          </h1>
          <p className="font-pixel text-[7px] text-gray-500 mt-2">
            Customize your pixel avatar
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 px-4 pb-8 max-w-5xl mx-auto w-full flex-1">
          {/* ── Left: Avatar Preview ────────────────────────────────────── */}
          <div className="lg:w-[40%] flex flex-col items-center gap-4 shrink-0">
            {/* Randomize button */}
            <button
              onClick={handleRandomize}
              className="font-pixel text-[7px] text-gray-400 border border-[#374151] px-3 py-1 hover:border-[#39ff14] hover:text-[#39ff14] transition-all"
            >
              🎲 RANDOMIZE
            </button>

            {/* Game Boy-style frame */}
            <div
              className="relative p-1 scanlines"
              style={{
                background: "#1a1a1a",
                border: "4px solid #374151",
                boxShadow: "0 0 30px #39ff1430, inset 0 0 20px #00000080",
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{ background: "#050505", width: 220, height: 280 }}
              >
                <AvatarRenderer config={avatarConfig} size={200} animate={true} />
              </div>
              {["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"].map(
                (pos, i) => (
                  <div key={i} className={`absolute ${pos} w-2 h-2 bg-[#374151]`} />
                )
              )}
            </div>

            {/* Character name input */}
            <div className="w-full">
              <p className="font-pixel text-[7px] text-gray-400 mb-2">YOUR NAME</p>
              <input
                type="text"
                maxLength={12}
                value={avatarConfig.characterName || ""}
                onChange={(e) => upd({ characterName: e.target.value })}
                placeholder="Explorer"
                style={{
                  background: "#111",
                  border: "2px solid #39ff14",
                  color: "#39ff14",
                  fontFamily: "monospace",
                  fontSize: 16,
                  padding: "8px 12px",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>

            {/* Submit */}
            <PixelButton variant="neon" size="lg" onClick={handleDone} className="w-full">
              THAT&apos;S ME! →
            </PixelButton>

            <p className="font-pixel text-[5px] text-gray-600 text-center">
              PREVIEW — LIVE UPDATE
            </p>
          </div>

          {/* ── Right: Controls ─────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: "80vh" }}>
            {/* Tabs (sticky) */}
            <div
              className="flex gap-1 mb-4 py-1"
              style={{ position: "sticky", top: 0, zIndex: 10, background: "#0a0a14" }}
            >
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 font-pixel text-[7px] py-2 border-2 transition-all ${
                    tab === t.key
                      ? "border-[#39ff14] text-[#39ff14] bg-[#39ff1410]"
                      : "border-[#374151] text-gray-500 hover:border-gray-500"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="space-y-5 pb-4">
              {/* ── FACE ─────────────────────────────────────────────────── */}
              {tab === "face" && (
                <>
                  <SwatchRow
                    colors={SKIN_TONES}
                    value={avatarConfig.skinTone}
                    onChange={(v) => upd({ skinTone: v })}
                    label="SKIN TONE"
                  />
                  <StyleGrid
                    value={avatarConfig.eyeShape}
                    labels={EYE_NAMES}
                    onChange={(v) => upd({ eyeShape: v })}
                    label="EYE SHAPE"
                    cols={4}
                  />
                  <SwatchRow
                    colors={EYE_COLORS}
                    value={avatarConfig.eyeColor}
                    onChange={(v) => upd({ eyeColor: v })}
                    label="EYE COLOR"
                  />
                  <StyleGrid
                    value={avatarConfig.eyebrow}
                    labels={EYEBROW_NAMES}
                    onChange={(v) => upd({ eyebrow: v })}
                    label="EYEBROWS"
                    cols={4}
                  />
                  <StyleGrid
                    value={avatarConfig.nose}
                    labels={NOSE_NAMES}
                    onChange={(v) => upd({ nose: v })}
                    label="NOSE"
                    cols={5}
                  />
                  <StyleGrid
                    value={avatarConfig.mouth}
                    labels={MOUTH_NAMES}
                    onChange={(v) => upd({ mouth: v })}
                    label="MOUTH"
                    cols={4}
                  />
                  <StyleGrid
                    value={avatarConfig.glasses}
                    labels={GLASSES_NAMES}
                    onChange={(v) => upd({ glasses: v })}
                    label="GLASSES"
                    cols={4}
                  />
                  <StyleGrid
                    value={avatarConfig.facialHair}
                    labels={FACIAL_HAIR_NAMES}
                    onChange={(v) => upd({ facialHair: v })}
                    label="FACIAL HAIR"
                    cols={4}
                  />
                  <CycleControl
                    value={avatarConfig.skinMarkings}
                    labels={SKIN_MARKINGS_NAMES}
                    onChange={(v) => upd({ skinMarkings: v })}
                    label="SKIN MARKINGS"
                  />
                  <CycleControl
                    value={avatarConfig.expression}
                    labels={EXPRESSION_NAMES}
                    onChange={(v) => upd({ expression: v })}
                    label="EXPRESSION"
                  />
                </>
              )}

              {/* ── HAIR ─────────────────────────────────────────────────── */}
              {tab === "hair" && (
                <>
                  <StyleGrid
                    value={avatarConfig.hairStyle}
                    labels={HAIR_STYLE_NAMES}
                    onChange={(v) => upd({ hairStyle: v })}
                    label="HAIR STYLE"
                    cols={5}
                  />
                  <SwatchRow
                    colors={HAIR_COLORS.slice(0, 10)}
                    value={avatarConfig.hairColor}
                    onChange={(v) => upd({ hairColor: v })}
                    label="NATURAL TONES"
                  />
                  <SwatchRow
                    colors={HAIR_COLORS.slice(10)}
                    value={avatarConfig.hairColor}
                    onChange={(v) => upd({ hairColor: v })}
                    label="FANTASY COLORS"
                  />
                  <ColorWheel
                    value={avatarConfig.hairColor}
                    onChange={(v) => upd({ hairColor: v })}
                    label="CUSTOM COLOR"
                  />
                </>
              )}

              {/* ── OUTFIT ───────────────────────────────────────────────── */}
              {tab === "outfit" && (
                <>
                  <StyleGrid
                    value={avatarConfig.clothing}
                    labels={CLOTHING_NAMES}
                    onChange={(v) => upd({ clothing: v })}
                    label="CLOTHING"
                    cols={4}
                  />
                  <ColorWheel
                    value={avatarConfig.clothingColorPrimary}
                    onChange={(v) => upd({ clothingColorPrimary: v })}
                    label="PRIMARY COLOR"
                  />
                  <ColorWheel
                    value={avatarConfig.clothingColorSecondary}
                    onChange={(v) => upd({ clothingColorSecondary: v })}
                    label="SECONDARY COLOR"
                  />
                  <StyleGrid
                    value={avatarConfig.shoes}
                    labels={SHOES_NAMES}
                    onChange={(v) => upd({ shoes: v })}
                    label="SHOES"
                    cols={5}
                  />
                  <ColorWheel
                    value={avatarConfig.shoesColor}
                    onChange={(v) => upd({ shoesColor: v })}
                    label="SHOES COLOR"
                  />
                  <div className="space-y-1">
                    <label className="font-pixel text-[7px] text-gray-400 block">BODY TYPE</label>
                    <div className="flex gap-2">
                      {["Slim", "Average", "Wide"].map((bt, i) => (
                        <button
                          key={bt}
                          onClick={() => upd({ bodyType: i })}
                          className={`flex-1 py-2 font-pixel text-[7px] border-2 transition-all ${
                            avatarConfig.bodyType === i
                              ? "border-[#39ff14] text-[#39ff14]"
                              : "border-[#374151] text-gray-500"
                          }`}
                        >
                          {bt}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── EXTRAS ───────────────────────────────────────────────── */}
              {tab === "extras" && (
                <>
                  <StyleGrid
                    value={avatarConfig.headwear}
                    labels={HEADWEAR_NAMES}
                    onChange={(v) => upd({ headwear: v })}
                    label="HEADWEAR"
                    cols={4}
                  />
                  <ColorWheel
                    value={avatarConfig.headwearColor}
                    onChange={(v) => upd({ headwearColor: v })}
                    label="HEADWEAR COLOR"
                  />
                  <StyleGrid
                    value={avatarConfig.backpackType}
                    labels={BACKPACK_NAMES}
                    onChange={(v) => upd({ backpackType: v })}
                    label="BAG / BACKPACK"
                    cols={4}
                  />
                  <ColorWheel
                    value={avatarConfig.backpackColor}
                    onChange={(v) => upd({ backpackColor: v })}
                    label="BAG COLOR"
                  />
                  <CycleControl
                    value={avatarConfig.auraEffect}
                    labels={AURA_NAMES}
                    onChange={(v) => upd({ auraEffect: v })}
                    label="AURA EFFECT"
                  />
                  <div className="space-y-1">
                    <label className="font-pixel text-[7px] text-gray-400 block">
                      ACCESSORIES
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["backpack", "headphones", "badge", "earrings"] as const).map((acc) => (
                        <button
                          key={acc}
                          onClick={() =>
                            upd({
                              accessories: {
                                ...avatarConfig.accessories,
                                [acc]: !avatarConfig.accessories[acc],
                              },
                            })
                          }
                          className={`py-3 font-pixel text-[7px] border-2 transition-all ${
                            avatarConfig.accessories[acc]
                              ? "border-[#39ff14] text-[#39ff14] bg-[#39ff1410]"
                              : "border-[#374151] text-gray-500"
                          }`}
                        >
                          {acc.charAt(0).toUpperCase() + acc.slice(1)}{" "}
                          {avatarConfig.accessories[acc] ? "✓" : "○"}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
