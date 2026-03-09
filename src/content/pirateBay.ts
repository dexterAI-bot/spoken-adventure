import { World } from "@/lib/schema";

export const pirateBayWorld: World = {
  id: "pirate-bay",
  name: "Pirate Bay",
  emoji: "🏴‍☠️",
  narratorName: "Captain Echo",
  intro:
    "Ahoy matey! We train brave explorers in four tiny missions. Watch, listen, do, then say it loud!",
  missions: [
    {
      id: "find-key",
      title: "Find the Golden Key",
      see: "You spot a shiny key near a wiggly crab and a palm tree.",
      hear: "Can you find the key? Point to the GOLDEN key!",
      doPrompt: "Tap the right choice.",
      actions: [
        { id: "shell", label: "Pick shell", successLine: "Oops! That's a shell." },
        { id: "key", label: "Pick golden key", successLine: "Yes! You found the key!" },
        { id: "crab", label: "Pick crab", successLine: "The crab pinched your finger. Try again!" },
      ],
      correctActionId: "key",
      say: {
        line: "I found the key!",
        coachLine: "Great! Say: I found the key!",
      },
    },
    {
      id: "open-chest",
      title: "Open the Treasure Chest",
      see: "A big chest waits on the dock. It has a lock shaped like a star.",
      hear: "Use the key and open the chest.",
      doPrompt: "Choose what to do first.",
      actions: [
        { id: "kick", label: "Kick chest", successLine: "Boom! Too rough. Let's use the key." },
        { id: "key", label: "Use key", successLine: "Click! The chest is open and full of gems!" },
        { id: "sleep", label: "Take a nap", successLine: "No naps on pirate duty!" },
      ],
      correctActionId: "key",
      say: {
        line: "Open the chest, please!",
        coachLine: "Captain voice: Open the chest, please!",
      },
    },
    {
      id: "follow-me",
      title: "Follow Me to the Ship",
      see: "Captain Echo walks to the ship and waves his hat.",
      hear: "Follow me! Step step step to the ship!",
      doPrompt: "Pick the path to follow.",
      actions: [
        { id: "cave", label: "Go to cave", successLine: "Dark cave! Wrong way." },
        { id: "ship", label: "Follow to ship", successLine: "Nice! You followed the captain." },
        { id: "water", label: "Jump in water", successLine: "Splash! Let's stay dry for now." },
      ],
      correctActionId: "ship",
      say: {
        line: "I can follow you!",
        coachLine: "Say it proudly: I can follow you!",
      },
    },
    {
      id: "surprise",
      title: "Surprise the Parrot",
      see: "A sleepy parrot sits on a barrel with one eye closed.",
      hear: "Shhh... then shout surprise!",
      doPrompt: "Choose your surprise move.",
      actions: [
        { id: "whistle", label: "Whistle quietly", successLine: "The parrot snores... keep trying!" },
        { id: "surprise", label: "Wave and shout surprise", successLine: "Surprise! The parrot laughs and flaps!" },
        { id: "hide", label: "Hide behind barrel", successLine: "Now nobody can hear you." },
      ],
      correctActionId: "surprise",
      say: {
        line: "Surprise!",
        coachLine: "Big smile voice: Surprise!",
      },
    },
  ],
};
