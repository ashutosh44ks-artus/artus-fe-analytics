import {
  // SiFacebook,
  SiGoogle,
  // SiInstagram,
  SiLinkedin,
  SiMeta,
  SiReddit,
} from "react-icons/si";
import { TbSpeakerphone } from "react-icons/tb";
import {
  LuBriefcase,
  LuCode,
  LuCrown,
  LuPalette,
  LuUser,
} from "react-icons/lu";
import { LucideChartPie } from "lucide-react";

export const HEAR_ABOUT_OPTIONS = [
  { value: "meta", label: "Facebook / Instagram", icon: SiMeta },
  { value: "google_search", label: "Google Search", icon: SiGoogle },
  { value: "linkedin", label: "LinkedIn", icon: SiLinkedin },
  { value: "reddit", label: "Reddit", icon: SiReddit },
  { value: "others", label: "Others", icon: TbSpeakerphone },
];

export const JOB_TITLE_OPTIONS = [
  { value: "founder", label: "Founder", icon: LuCrown },
  { value: "product_manager", label: "Product Manager", icon: LuBriefcase },
  { value: "engineer", label: "Engineer", icon: LuCode },
  { value: "ui_ux_designer", label: "UI/UX Designer", icon: LuPalette },
  { value: "analyst", label: "Analyst", icon: LucideChartPie },
  { value: "others", label: "Others", icon: LuUser },
];

export const getRatingTone = (rating: number) => {
  if (rating >= 4) {
    return {
      cardAccent: "from-emerald-500/20",
      badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
      icon: "text-emerald-300",
      label: "Positive",
    };
  }
  if (rating >= 3) {
    return {
      cardAccent: "from-amber-500/20",
      badge: "border-amber-500/40 bg-amber-500/10 text-amber-200",
      icon: "text-amber-300",
      label: "Neutral",
    };
  }
  return {
    cardAccent: "from-rose-500/20",
    badge: "border-rose-500/40 bg-rose-500/10 text-rose-200",
    icon: "text-rose-300",
    label: "Needs Attention",
  };
};
