import OrangeLogo from "@/components/assets/orrange-logo.png";
import Image from "next/image";

const LogoWithTitleVertical = () => {
  return (
    <div className="animate-in fade-in duration-400 delay-200 fill-mode-both flex flex-col items-center gap-2">
      <Image
        src={OrangeLogo}
        alt="Artus AI"
        className="h-12 w-auto mx-auto transition-all duration-300 hover:scale-105 hover:drop-shadow-lg"
        style={{ filter: "drop-shadow(0 0 12px var(--color-primary))" }}
        height={32}
        width={32}
      />
      <div className="text-sm font-semibold text-primary-400 tracking-wide uppercase mb-8 animate-in fade-in duration-400 delay-300 fill-mode-both">
        Luna
      </div>
    </div>
  );
};

export default LogoWithTitleVertical;
