"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pirateBayWorld } from "@/content/pirateBay";
import { MissionStep } from "@/lib/schema";
import { SceneFrame } from "@/components/scene/SceneFrame";
import { stepFx } from "@/lib/animation";

const STEPS: MissionStep[] = ["SEE", "HEAR", "DO", "SAY"];
const PROGRESS_KEY = "spokenAdventureProgressV1";

type WorldMeta = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

const WORLDS: WorldMeta[] = [
  { id: "pirate-bay", name: "Pirate Bay", emoji: "🏴‍☠️", description: "Treasure clues and brave pirate talk." },
  { id: "dino-jungle", name: "Dino Jungle", emoji: "🦖", description: "Coming soon" },
  { id: "space-lab", name: "Space Lab", emoji: "🚀", description: "Coming soon" },
  { id: "magic-castle", name: "Magic Castle", emoji: "🏰", description: "Coming soon" },
];

type Progress = {
  unlocked: string[];
  completed: string[];
};

function speakEn(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

const initialProgress: Progress = { unlocked: ["pirate-bay"], completed: [] };

export default function Home() {
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>(initialProgress);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Progress;
      if (Array.isArray(parsed.unlocked) && Array.isArray(parsed.completed)) {
        setProgress(parsed);
      }
    } catch {
      setProgress(initialProgress);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  if (!selectedWorldId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-200 to-indigo-100 p-4 text-slate-800">
        <main className="mx-auto max-w-5xl rounded-3xl border-4 border-sky-300 bg-white p-6 shadow-xl md:p-8">
          <header className="mb-5">
            <p className="text-sm font-extrabold uppercase tracking-wide text-indigo-700">Spoken Adventure</p>
            <h1 className="text-3xl font-black md:text-4xl">🌍 World Map</h1>
            <p className="text-slate-600">Pick a world and practice SEE → HEAR → DO → SAY in story scenes.</p>
          </header>

          <section className="grid gap-4 md:grid-cols-2">
            {WORLDS.map((world) => {
              const unlocked = progress.unlocked.includes(world.id);
              const completed = progress.completed.includes(world.id);
              return (
                <button
                  key={world.id}
                  disabled={!unlocked}
                  onClick={() => setSelectedWorldId(world.id)}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    unlocked
                      ? "border-cyan-200 bg-cyan-50 hover:-translate-y-1 hover:shadow-lg"
                      : "cursor-not-allowed border-slate-200 bg-slate-100 opacity-70"
                  }`}
                >
                  <p className="text-4xl">{world.emoji}</p>
                  <h2 className="mt-1 text-2xl font-black">{world.name}</h2>
                  <p className="text-slate-600">{world.description}</p>
                  <p className="mt-2 font-bold text-indigo-700">
                    {completed ? "✅ Completed" : unlocked ? "▶ Start Adventure" : "🔒 Locked"}
                  </p>
                </button>
              );
            })}
          </section>
        </main>
      </div>
    );
  }

  if (selectedWorldId !== "pirate-bay") {
    return (
      <div className="min-h-screen bg-indigo-50 p-4">
        <main className="mx-auto max-w-3xl rounded-3xl border-4 border-indigo-200 bg-white p-8 text-center">
          <p className="text-6xl">🛠️</p>
          <h1 className="text-3xl font-black">{WORLDS.find((w) => w.id === selectedWorldId)?.name}</h1>
          <p className="mt-2 text-slate-600">This world is under construction. Pirate Bay is ready now.</p>
          <button onClick={() => setSelectedWorldId(null)} className="mt-4 rounded-xl bg-indigo-500 px-4 py-2 font-bold text-white">
            Back to Map
          </button>
        </main>
      </div>
    );
  }

  return <PirateBayScene onBack={() => setSelectedWorldId(null)} onComplete={() => setProgress((prev) => ({ ...prev, completed: Array.from(new Set([...prev.completed, "pirate-bay"])), unlocked: Array.from(new Set([...prev.unlocked, "dino-jungle"])) }))} />;
}

function PirateBayScene({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const world = pirateBayWorld;
  const [missionIndex, setMissionIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [doResult, setDoResult] = useState("");
  const [sayAnimate, setSayAnimate] = useState(false);

  const [hasKey, setHasKey] = useState(false);
  const [chestOpen, setChestOpen] = useState(false);
  const [pathSteps, setPathSteps] = useState<number[]>([]);
  const [draggingKey, setDraggingKey] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const tryPlay = () => {
      void el.play().catch(() => {});
    };
    tryPlay();
    const unlock = () => {
      tryPlay();
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  const mission = useMemo(() => world.missions[missionIndex], [missionIndex, world.missions]);
  const step = STEPS[stepIndex];
  const done = missionIndex === world.missions.length - 1 && stepIndex === STEPS.length - 1;

  const nextStep = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((x) => x + 1);
      return;
    }
    if (missionIndex < world.missions.length - 1) {
      setMissionIndex((x) => x + 1);
      setStepIndex(0);
      setDoResult("");
      setSayAnimate(false);
      setPathSteps([]);
    }
  };

  const onDoAction = (actionId: string, line: string) => {
    setDoResult(line);
    if (actionId === mission.correctActionId) {
      setTimeout(() => setStepIndex(3), 650);
    }
  };

  const playSayAnimation = () => {
    setSayAnimate(true);
    speakEn(mission.say.line);
    setTimeout(() => setSayAnimate(false), 1200);
  };

  const interactiveBoard = (
    <div className="relative min-h-[240px] rounded-2xl bg-gradient-to-b from-sky-200 to-teal-200 p-4">
      <div className="absolute left-4 top-4 rounded-full bg-yellow-200 px-3 py-1 text-xs font-black text-amber-800">{step}</div>

      {mission.id === "find-key" && (
        <>
          <button
            onClick={() => {
              setHasKey(true);
              onDoAction("key", "You found the golden key! ✨");
            }}
            className={`absolute left-[62%] top-[58%] text-4xl ${hasKey ? "anim-sparkles" : "anim-spotlight"}`}
            aria-label="Golden key hotspot"
          >
            🔑
          </button>
          <div className="absolute left-[22%] top-[62%] text-3xl">🦀</div>
          <div className="absolute left-[10%] top-[25%] text-5xl">🌴</div>
        </>
      )}

      {mission.id === "open-chest" && (
        <>
          {hasKey && !chestOpen && (
            <button
              draggable
              onDragStart={() => setDraggingKey(true)}
              onDragEnd={() => setDraggingKey(false)}
              className={`absolute left-[10%] top-[18%] rounded-xl bg-yellow-100 p-2 text-4xl ${draggingKey ? "anim-bounce-soft" : ""}`}
            >
              🔑
            </button>
          )}
          <button
            onClick={() => {
              if (hasKey) {
                setChestOpen(true);
                onDoAction("key", "Click! The chest is open and full of gems!");
              } else {
                onDoAction("kick", "Need a key first, matey.");
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (hasKey) {
                setChestOpen(true);
                onDoAction("key", "Perfect drop! The chest popped open.");
              }
            }}
            className={`absolute left-[52%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-7xl ${
              chestOpen ? "anim-sparkles" : "anim-shake"
            }`}
          >
            {chestOpen ? "💎" : "🧰"}
          </button>
        </>
      )}

      {mission.id === "follow-me" && (
        <>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => {
                const expected = pathSteps.length + 1;
                if (n === expected) {
                  const next = [...pathSteps, n];
                  setPathSteps(next);
                  if (next.length === 3) {
                    onDoAction("ship", "Great route! You followed Captain Echo to the ship.");
                  }
                } else {
                  setPathSteps([]);
                  onDoAction("cave", "Oops, wrong step order. Start from footprint 1.");
                }
              }}
              className={`absolute rounded-full border-2 border-white bg-white/80 px-3 py-1 font-black ${
                n === 1 ? "left-[18%] top-[70%]" : n === 2 ? "left-[42%] top-[58%]" : "left-[68%] top-[42%]"
              } ${pathSteps.includes(n) ? "anim-sparkles" : ""}`}
            >
              👣 {n}
            </button>
          ))}
          <div className="absolute right-4 top-5 text-6xl anim-bounce-soft">🚢</div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-indigo-100 p-4 text-slate-800">
      <main className="mx-auto max-w-4xl space-y-4">
        <audio ref={audioRef} loop autoPlay preload="auto" src="https://cdn.pixabay.com/audio/2022/03/15/audio_93f18fc629.mp3" />

        <div className="rounded-2xl bg-white/90 p-4 shadow">
          <button onClick={onBack} className="rounded-lg bg-slate-200 px-3 py-1 text-sm font-bold">
            ← World Map
          </button>
          <p className="mt-2 text-sm font-bold uppercase tracking-wide text-sky-700">{world.emoji} {world.name}</p>
          <h1 className="text-2xl font-black">{mission.title}</h1>
          <p>{mission.see}</p>
        </div>

        <SceneFrame title={mission.title} subtitle={`Mission ${missionIndex + 1}/${world.missions.length}`} fxClass={stepFx(step)} talking={step === "SAY"}>
          {interactiveBoard}
          <div className="mt-4 space-y-3 rounded-xl bg-white/70 p-4">
            {step === "SEE" && <p>👀 {mission.see}</p>}
            {step === "HEAR" && (
              <div className="space-y-2">
                <p>👂 {mission.hear}</p>
                <button onClick={() => speakEn(mission.hear)} className="rounded-xl bg-fuchsia-500 px-4 py-2 font-bold text-white">Play Voice</button>
              </div>
            )}
            {step === "DO" && <p>🕹️ {mission.doPrompt}</p>}
            {step === "SAY" && (
              <div className={`rounded-xl bg-pink-100 p-3 ${sayAnimate ? "anim-bounce-soft" : ""}`}>
                <p className="font-bold">🗣️ {mission.say.coachLine}</p>
                <p className="text-2xl font-black">“{mission.say.line}”</p>
              </div>
            )}

            {doResult && <p className="rounded-xl bg-amber-100 p-2 font-semibold">{doResult}</p>}

            <div className="flex flex-wrap gap-2">
              {step !== "SAY" && (
                <button onClick={nextStep} className="rounded-xl bg-blue-500 px-4 py-2 font-bold text-white">Continue</button>
              )}
              {step === "SAY" && (
                <>
                  <button onClick={playSayAnimation} className="rounded-xl bg-pink-500 px-4 py-2 font-bold text-white">Replay SAY</button>
                  {!done && <button onClick={nextStep} className="rounded-xl bg-blue-500 px-4 py-2 font-bold text-white">Next Mission</button>}
                </>
              )}
            </div>
          </div>
        </SceneFrame>

        {done && (
          <section className="rounded-2xl bg-green-100 p-4 text-center">
            <p className="text-2xl font-black">🎉 Pirate Bay complete!</p>
            <p className="font-semibold">You finished all missions.</p>
            <button
              onClick={() => {
                onComplete();
                onBack();
              }}
              className="mt-3 rounded-xl bg-green-600 px-4 py-2 font-bold text-white"
            >
              Back to Map + Unlock Next World
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
