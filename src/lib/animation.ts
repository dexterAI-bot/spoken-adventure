export type AnimationName = "spotlight" | "bounce-soft" | "shake" | "sparkles";

export const animationClass: Record<AnimationName, string> = {
  spotlight: "anim-spotlight",
  "bounce-soft": "anim-bounce-soft",
  shake: "anim-shake",
  sparkles: "anim-sparkles",
};

export function stepFx(step: "SEE" | "HEAR" | "DO" | "SAY") {
  switch (step) {
    case "SEE":
      return animationClass.spotlight;
    case "HEAR":
      return animationClass["bounce-soft"];
    case "DO":
      return animationClass.shake;
    case "SAY":
      return animationClass.sparkles;
    default:
      return "";
  }
}
