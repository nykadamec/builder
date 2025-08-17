import * as React from "react";

export interface UseTypewriterOptions {
  phrases?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
  active?: boolean; // whether the typewriter should run
}

export const DEFAULT_PHRASES = [
  "Design a landing page",
  "Generate a responsive header",
  "Create a REST API endpoint",
  "Write a unit test for this component",
  "Refine my prompt for better results",
];

export const DEFAULT_TYPING_SPEED = 150;
export const DEFAULT_DELETING_SPEED = 100;
export const DEFAULT_PAUSE = 3000;

export function useTypewriter(opts: UseTypewriterOptions) {
  const {
    phrases = DEFAULT_PHRASES,
    typingSpeed = DEFAULT_TYPING_SPEED,
    deletingSpeed = DEFAULT_DELETING_SPEED,
    pause = DEFAULT_PAUSE,
    active = true,
  } = opts || {};

  const [loopNum, setLoopNum] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [charIndex, setCharIndex] = React.useState(0);
  const [displayed, setDisplayed] = React.useState("");

  React.useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;
    const i = loopNum % phrases.length;
    const fullText = phrases[i];

    if (!isDeleting && charIndex <= fullText.length) {
      setDisplayed(fullText.substring(0, charIndex));
      if (charIndex === fullText.length) {
        timer = setTimeout(() => setIsDeleting(true), pause);
      } else {
        timer = setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
      }
    } else if (isDeleting) {
      if (charIndex > 0) {
        timer = setTimeout(() => setCharIndex((c) => c - 1), deletingSpeed);
      } else {
        setIsDeleting(false);
        setLoopNum((n) => n + 1);
        setCharIndex(0);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [charIndex, isDeleting, loopNum, active, phrases, typingSpeed, deletingSpeed, pause]);

  return { displayed, isDeleting, loopNum } as const;
}
