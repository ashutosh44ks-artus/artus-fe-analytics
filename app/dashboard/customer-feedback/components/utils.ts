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
