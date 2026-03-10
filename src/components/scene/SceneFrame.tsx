import { ReactNode } from "react";
import { CharacterSprite } from "./CharacterSprite";

type SceneFrameProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  talking?: boolean;
  fxClass?: string;
};

export function SceneFrame({ title, subtitle, children, footer, talking, fxClass }: SceneFrameProps) {
  return (
    <section className="rounded-3xl border-4 border-sky-200 bg-gradient-to-b from-sky-50 to-amber-50 p-4 md:p-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-wide text-sky-700">Pirate Bay Scene</p>
          <h2 className="text-2xl font-black text-slate-800">{title}</h2>
          <p className="text-slate-600">{subtitle}</p>
        </div>
        <CharacterSprite className="h-24 w-24" talking={talking} />
      </header>
      <div className={`relative overflow-hidden rounded-2xl border-2 border-white/70 bg-cyan-100 p-4 md:p-6 ${fxClass ?? ""}`}>
        {children}
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </section>
  );
}
