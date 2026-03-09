"use client";

import { useMemo, useState } from "react";
import { pirateBayWorld } from "@/content/pirateBay";
import { MissionStep } from "@/lib/schema";

const STEPS: MissionStep[] = ["SEE", "HEAR", "DO", "SAY"];

function speakEn(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function Home() {
  const world = pirateBayWorld;
  const [missionIndex, setMissionIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [doResult, setDoResult] = useState<string>("");
  const [sayAnimate, setSayAnimate] = useState(false);

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
    }
  };

  const onDoAction = (actionId: string, line: string) => {
    setDoResult(line);
    if (actionId === mission.correctActionId) {
      setTimeout(() => setStepIndex(3), 700);
    }
  };

  const playSayAnimation = () => {
    setSayAnimate(true);
    speakEn(mission.say.line);
    setTimeout(() => setSayAnimate(false), 1200);
  };

  return (
    <div className="min-h-screen bg-sky-100 p-4 text-slate-800">
      <main className="mx-auto max-w-4xl rounded-3xl border-4 border-sky-300 bg-white p-6 shadow-xl md:p-8">
        <header className="mb-6 rounded-2xl bg-gradient-to-r from-cyan-200 to-blue-200 p-4">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Spoken Adventure MVP</p>
          <h1 className="text-3xl font-black">
            {world.emoji} {world.name}
          </h1>
          <p className="mt-1 text-base">{world.intro}</p>
        </header>

        <section className="mb-4 grid gap-3 rounded-2xl bg-amber-50 p-4 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`rounded-xl p-3 text-center font-bold ${
                i === stepIndex ? "bg-amber-300" : "bg-white"
              }`}
            >
              {s}
            </div>
          ))}
        </section>

        <section className="rounded-2xl border-2 border-slate-100 p-5">
          <p className="text-sm font-bold text-slate-500">
            Mission {missionIndex + 1}/{world.missions.length}
          </p>
          <h2 className="mb-3 text-2xl font-extrabold">{mission.title}</h2>

          {step === "SEE" && (
            <div className="space-y-3">
              <p className="text-lg">👀 {mission.see}</p>
              <button onClick={nextStep} className="rounded-xl bg-blue-500 px-4 py-2 font-bold text-white">
                I saw it!
              </button>
            </div>
          )}

          {step === "HEAR" && (
            <div className="space-y-3">
              <p className="text-lg">👂 {mission.hear}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => speakEn(mission.hear)}
                  className="rounded-xl bg-fuchsia-500 px-4 py-2 font-bold text-white"
                >
                  Play Voice
                </button>
                <button onClick={nextStep} className="rounded-xl bg-blue-500 px-4 py-2 font-bold text-white">
                  I heard it!
                </button>
              </div>
            </div>
          )}

          {step === "DO" && (
            <div className="space-y-3">
              <p className="text-lg">🕹️ {mission.doPrompt}</p>
              <div className="grid gap-2 md:grid-cols-3">
                {mission.actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => onDoAction(action.id, action.successLine)}
                    className="rounded-xl border-2 border-cyan-200 bg-cyan-50 p-3 text-left font-semibold hover:bg-cyan-100"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              {doResult && <p className="rounded-xl bg-yellow-100 p-3 font-semibold">{doResult}</p>}
            </div>
          )}

          {step === "SAY" && (
            <div className="space-y-3">
              <p className="text-lg">🗣️ {mission.say.coachLine}</p>
              <div className={`rounded-2xl bg-pink-100 p-5 text-center ${sayAnimate ? "animate-bounce" : ""}`}>
                <p className="text-2xl font-black">“{mission.say.line}”</p>
                <p className="mt-2 text-sm">No mic for MVP — say it out loud and tap replay ✨</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={playSayAnimation}
                  className="rounded-xl bg-pink-500 px-4 py-2 font-bold text-white"
                >
                  Replay SAY
                </button>
                {!done && (
                  <button onClick={nextStep} className="rounded-xl bg-blue-500 px-4 py-2 font-bold text-white">
                    Next Mission
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {done && (
          <section className="mt-5 rounded-2xl bg-green-100 p-4 text-center">
            <p className="text-2xl font-black">🎉 Pirate Bay complete!</p>
            <p className="font-semibold">You finished all 4 micro-missions: key, chest, follow me, surprise.</p>
          </section>
        )}
      </main>
    </div>
  );
}
