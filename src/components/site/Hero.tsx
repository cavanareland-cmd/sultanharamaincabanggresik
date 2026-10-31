import { ArrowRight, Plane, Play, ShieldCheck, Sparkles } from "lucide-react";

import heroImage from "@/assets/hero-haramain.jpg";
import { Button } from "@/components/ui/button";
import { SITE, waLink } from "@/lib/site";

type HeroProps = { title: string; subtitle: string; children?: React.ReactNode };

export function Hero({ title, subtitle, children }: HeroProps) {
  return (
    <section id="beranda" className="sh-hero relative isolate overflow-hidden">
      <img src={heroImage} alt="Suasana Masjidil Haram dan Tanah Suci" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,10,18,.94)_0%,rgba(5,10,18,.78)_34%,rgba(5,10,18,.25)_70%,rgba(5,10,18,.08)_100%),linear-gradient(0deg,#0b1018_0%,transparent_34%,rgba(5,10,18,.18)_100%)]" />
      <div className="mx-auto flex min-h-[590px] max-w-[1500px] items-center px-5 pb-20 pt-20 sm:px-8 lg:min-h-[650px] lg:px-12 lg:pb-28">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-black/35 px-4 py-2 text-xs font-semibold tracking-wide text-gold shadow-lg backdrop-blur-md sm:text-sm"><Sparkles className="size-4" /> Sultan Haramain Elegance</p>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[.98] tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:text-[clamp(4rem,6.2vw,6.2rem)]">{title.split("&").length > 1 ? <>{title.split("&")[0]}<span className="text-gold">&amp;{title.split("&").slice(1).join("&")}</span></> : title}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">{subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="gold" size="lg" className="h-12 rounded-full px-7 text-sm font-bold shadow-[0_12px_35px_rgba(211,157,62,.25)]"><a href="#paket"><Plane className="mr-2 size-4" /> Lihat Paket Umrah <ArrowRight className="ml-2 size-4" /></a></Button>
            <Button asChild variant="outlineGold" size="lg" className="h-12 rounded-full border-white/35 bg-black/25 px-6 text-white backdrop-blur-md hover:bg-white/10"><a href={waLink("profil dan layanan Sultan Haramain")} target="_blank" rel="noreferrer"><Play className="mr-2 size-4 fill-current" /> Konsultasi Kami</a></Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-white/60"><ShieldCheck className="size-4 text-gold" /> Resmi berizin PPIU {SITE.ppiu} <span className="text-white/30">•</span> {SITE.address}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
