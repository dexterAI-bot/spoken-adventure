export type MissionStep = "SEE" | "HEAR" | "DO" | "SAY";

export type DoAction = {
  id: string;
  label: string;
  successLine: string;
};

export type Mission = {
  id: string;
  title: string;
  see: string;
  hear: string;
  doPrompt: string;
  actions: DoAction[];
  correctActionId: string;
  say: {
    line: string;
    coachLine: string;
  };
};

export type World = {
  id: string;
  name: string;
  emoji: string;
  narratorName: string;
  intro: string;
  missions: Mission[];
};
