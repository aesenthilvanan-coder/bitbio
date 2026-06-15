"use client";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "neon" | "dark" | "red" | "amber" | "blue" | "purple" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  neon: "pixel-btn-neon",
  dark: "pixel-btn-dark",
  red: "pixel-btn-red",
  amber: "pixel-btn-amber",
  blue: "pixel-btn-blue",
  purple: "pixel-btn-purple",
  ghost: "bg-transparent text-[#39ff14] border-2 border-[#39ff14] hover:bg-[#39ff1410]",
};

const sizeClass = {
  sm: "text-[8px] py-2 px-3 gap-1",
  md: "text-[10px] py-3 px-5 gap-2",
  lg: "text-[12px] py-4 px-8 gap-2",
};

export default function PixelButton({
  variant = "neon",
  size = "md",
  children,
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`pixel-btn ${variantClass[variant]} ${sizeClass[size]} ${className} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } flex items-center justify-center font-pixel`}
    >
      {loading ? (
        <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
