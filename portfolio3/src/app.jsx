import React, { useEffect, useState } from "react";

export default function App() {
  const phrases = [
    "Rakhi Vellanki",
    "a problem solver",
    "a cool guy",
    "a family guy",
    "a the simpson",
  ];

  const [prefixDone, setPrefixDone] = useState(false);
  const [display, setDisplay] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  // Type the prefix "I am ("
  useEffect(() => {
    let mounted = true;
    const prefix = "I am (";
    let pIdx = 0;
    if (!prefixDone) {
      const step = () => {
        if (!mounted) return;
        pIdx++;
        setDisplay(prefix.slice(0, pIdx));
        if (pIdx < prefix.length) {
          setTimeout(step, 120);
        } else {
          setPrefixDone(true);
        }
      };
      step();
    }
    return () => (mounted = false);
  }, []);

  // Handle typing of rotating phrases
  useEffect(() => {
    if (!prefixDone) return;
    let mounted = true;

    const currentPhrase = phrases[phraseIndex];

    const tick = () => {
      if (!mounted) return;

      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setCharIndex((c) => c + 1);
          setDisplay(
            (prev) =>
              prev.slice(0, prev.lastIndexOf("(") + 1) +
              currentPhrase.slice(0, charIndex + 1)
          );
          setTimeout(tick, 100 + Math.random() * 80);
        } else {
          setTimeout(() => {
            setIsDeleting(true);
            setTimeout(tick, 200);
          }, 1200);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((c) => c - 1);
          setDisplay(
            (prev) =>
              prev.slice(0, prev.lastIndexOf("(") + 1) +
              currentPhrase.slice(0, charIndex - 1)
          );
          setTimeout(tick, 60 + Math.random() * 40);
        } else {
          setIsDeleting(false);
          setPhraseIndex((i) => (i + 1) % phrases.length);
          setTimeout(() => {
            setCharIndex(0);
            tick();
          }, 200);
        }
      }
    };

    if (!display.startsWith("I am (")) setDisplay("I am (");
    const starter = setTimeout(tick, 250);
    return () => {
      mounted = false;
      clearTimeout(starter);
    };
  }, [prefixDone, phraseIndex, isDeleting, charIndex]);

  const PixelPanel = ({ open }) => {
    const cols = 12;
    const rows = 18;
    const total = cols * rows;
    const pixelArray = Array.from({ length: total });

    return (
      <div className={`pixel-panel ${open ? "open" : ""}`} aria-hidden={!open}>
        <div
          className="pixel-grid"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {pixelArray.map((_, i) => (
            <div
              key={i}
              className={`pixel ${open ? "enter" : "exit"}`}
              style={{
                transitionDelay: `${
                  (i % cols) * 15 + Math.floor(i / cols) * 25
                }ms`,
              }}
            />
          ))}
        </div>
        <div className="panel-content" aria-hidden={!open}>
          <button className="close-btn" onClick={() => setPanelOpen(false)}>
            Close
          </button>
          <div className="panel-inner">
            <h2>More about Rakhi</h2>
            <p>
              This is a playful pixel takeover panel. Put your links, projects,
              or contact form here.
            </p>
            <ul>
              <li>Projects</li>
              <li>Experience</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-root">
      <main className="hero">
        <div className="content">
          <h1 className="headline">
            <span className="typed">{display}</span>
            <span className="cursor" aria-hidden>
              │
            </span>
          </h1>
          <p className="sub">
            Welcome to my portfolio — scroll or open the pixel menu for more.
          </p>
          <div className="controls">
            <button className="btn" onClick={() => setPanelOpen(true)}>
              Open Pixel Page
            </button>
            <a className="btn ghost" href="#projects">
              View Projects
            </a>
          </div>
        </div>
      </main>
      <PixelPanel open={panelOpen} />
    </div>
  );
}
