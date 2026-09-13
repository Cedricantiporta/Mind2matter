"use client";

import { useEffect, useState } from "react";

const FB_URL = "https://www.facebook.com/profile.php?id=61573794730980";
const IG_URL = "https://instagram.com/mind2matterph";

// Synthesized mechanical-keyboard switch sounds: a filtered noise burst (the
// "click" transient) layered with a short tonal thump, tuned per variant to
// evoke a distinct real switch type (clicky/tactile/linear/etc). No sample
// files needed, so nothing to license — six clearly different characters.
let audioCtx;
let noiseBuffer;
function getNoiseBuffer(ctx) {
  if (!noiseBuffer) {
    const len = Math.floor(ctx.sampleRate * 0.05);
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}
const MECH_VARIANTS = [
  { filter: "bandpass", freq: 3200, q: 6, dur: 0.02, noiseGain: 0.5, tone: 1800, toneGain: 0.12, double: true }, // blue — clicky
  { filter: "bandpass", freq: 1600, q: 3, dur: 0.03, noiseGain: 0.35, tone: 320, toneGain: 0.18, double: false }, // brown — tactile
  { filter: "lowpass", freq: 900, q: 1, dur: 0.045, noiseGain: 0.18, tone: 150, toneGain: 0.22, double: false }, // red — linear
  { filter: "lowpass", freq: 600, q: 1, dur: 0.05, noiseGain: 0.22, tone: 105, toneGain: 0.26, double: false }, // black — heavy linear
  { filter: "highpass", freq: 3800, q: 4, dur: 0.015, noiseGain: 0.55, tone: 2400, toneGain: 0.08, double: true }, // clear — stiff click
  { filter: "lowpass", freq: 380, q: 0.8, dur: 0.055, noiseGain: 0.12, tone: 90, toneGain: 0.3, double: false }, // silent — creamy thump
  { filter: "lowpass", freq: 220, q: 0.6, dur: 0.07, noiseGain: 0.1, tone: 65, toneGain: 0.34, double: false }, // topre — deep capacitive thock
  { filter: "bandpass", freq: 2200, q: 8, dur: 0.018, noiseGain: 0.6, tone: 1400, toneGain: 0.14, double: true }, // buckling spring — vintage clack
];

// Named real-world switch types a visitor can pick from, each mapped to one
// of the synthesized MECH_VARIANTS above (index into that array).
const SWITCH_LIB = [
  { label: "Cherry MX Blue — Clicky", variant: 0 },
  { label: "Cherry MX Brown — Tactile", variant: 1 },
  { label: "Cherry MX Red — Linear", variant: 2 },
  { label: "Cherry MX Black — Heavy Linear", variant: 3 },
  { label: "Gateron Clear — Stiff Click", variant: 4 },
  { label: "Gateron Yellow — Creamy Thock", variant: 5 },
  { label: "Topre — Deep Thock", variant: 6 },
  { label: "Buckling Spring — Vintage Clack", variant: 7 },
];
function fireClickBurst(ctx, v, when) {
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer(ctx);
  const filt = ctx.createBiquadFilter();
  filt.type = v.filter;
  filt.frequency.value = v.freq;
  filt.Q.value = v.q;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(v.noiseGain, when);
  ng.gain.exponentialRampToValueAtTime(0.001, when + v.dur);
  noise.connect(filt).connect(ng).connect(ctx.destination);
  noise.start(when);
  noise.stop(when + v.dur + 0.01);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(v.tone, when);
  const og = ctx.createGain();
  og.gain.setValueAtTime(v.toneGain, when);
  og.gain.exponentialRampToValueAtTime(0.001, when + v.dur * 1.4);
  osc.connect(og).connect(ctx.destination);
  osc.start(when);
  osc.stop(when + v.dur * 1.5 + 0.01);
}
function playMechClick(variant = 0) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  const v = MECH_VARIANTS[variant % MECH_VARIANTS.length];
  const now = audioCtx.currentTime;
  fireClickBurst(audioCtx, v, now);
  if (v.double) {
    fireClickBurst(audioCtx, { ...v, noiseGain: v.noiseGain * 0.6, toneGain: v.toneGain * 0.6 }, now + 0.014);
  }
}

function handleSwatchClick(e, variant, effect) {
  playMechClick(variant);
  const el = e.currentTarget;
  const cls = effect === "rotate" ? "swatch-spin" : "swatch-bounce";
  el.classList.remove("swatch-spin", "swatch-bounce");
  void el.offsetWidth;
  el.classList.add(cls);
}

function LogoMark() {
  return <img src="/logo.png" alt="Mind2Matter" className="logo-img" />;
}

// Generates a smooth scalloped "cookie" blob path (Material-You-style shape):
// alternating outer/inner control points sit on a circle; the curve passes
// through the MIDPOINT of each pair of neighboring points, bulging toward the
// point itself via a quadratic bezier — soft rounded lobes, no sharp corners.
function cookiePath(count, outerR, innerR, cx = 50, cy = 50) {
  const n = count * 2;
  const step = (Math.PI * 2) / n;
  const V = [];
  for (let i = 0; i < n; i++) {
    const a = i * step - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    V.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  const M = V.map((v, i) => {
    const next = V[(i + 1) % n];
    return [(v[0] + next[0]) / 2, (v[1] + next[1]) / 2];
  });
  let d = `M ${M[0][0].toFixed(2)} ${M[0][1].toFixed(2)} `;
  for (let i = 0; i < n; i++) {
    const v = V[(i + 1) % n];
    const m = M[(i + 1) % n];
    d += `Q ${v[0].toFixed(2)} ${v[1].toFixed(2)} ${m[0].toFixed(2)} ${m[1].toFixed(2)} `;
  }
  return d + "Z";
}
const COOKIE_PATHS = {
  clover4: cookiePath(4, 46, 18),
  cookie6: cookiePath(6, 44, 33),
  cookie7: cookiePath(7, 43, 34),
  cookie9: cookiePath(9, 42, 35),
  sunny12: cookiePath(12, 44, 27),
};

const DECOR_SHAPES = [
  { top: "-8%", right: "-6%", size: 190, color: "var(--pastel-lilac)", cookie: "clover4", spin: 0.4 },
  { top: "-6%", left: "-8%", size: 190, color: "var(--pastel-pink)", cookie: "cookie7", spin: -0.45 },
  { top: "34%", left: "4%", size: 200, color: "var(--pastel-peach)", radius: "48% 52% 38% 62% / 60% 42% 58% 40%", spin: -0.5 },
  { top: "42%", right: "18%", size: 170, color: "var(--pastel-lilac)", cookie: "sunny12", spin: -0.7 },
  { top: "48%", right: "5%", size: 140, color: "var(--pastel-pink)", cookie: "cookie9", spin: 1.1 },
  { top: "60%", left: "6%", size: 110, color: "var(--pastel-lilac)", radius: "55% 45% 60% 40% / 45% 55% 45% 55%", spin: 0.8 },
  { top: "72%", right: "8%", size: 160, color: "var(--pastel-peach)", cookie: "clover4", spin: -1.0 },
  { top: "82%", left: "3%", size: 220, color: "var(--pastel-pink)", cookie: "cookie7", spin: 0.6 },
  { top: "94%", right: "6%", size: 175, color: "var(--pastel-lilac)", cookie: "cookie6", spin: -0.65 },
];

// Sit inside .hero-art itself, in DOM order before the mascot image, so they
// tuck naturally behind the cat (normal stacking) without needing any
// pointer-events overrides on ancestor sections.
const MASCOT_SHAPES = [
  { top: "2%", left: "-2%", size: 210, color: "var(--pastel-pink)", cookie: "cookie6", spin: 1.3 },
  { top: "58%", right: "-10%", size: 240, color: "var(--pastel-lilac)", cookie: "cookie9", spin: 0.9 },
];

function handleShapeClick(e, spin) {
  const el = e.currentTarget;
  const baseDuration = 26 / Math.abs(spin);
  const fastDuration = Math.max(1.2, baseDuration / 10);
  el.style.animationDuration = `${fastDuration.toFixed(1)}s`;
  if (el._spinResetTimer) clearTimeout(el._spinResetTimer);
  el._spinResetTimer = setTimeout(() => {
    el.style.animationDuration = `${baseDuration.toFixed(1)}s`;
  }, 2200);
}

function Shape({ s }) {
  const spinStyle = {
    animationDuration: `${(26 / Math.abs(s.spin)).toFixed(1)}s`,
    animationDirection: s.spin < 0 ? "reverse" : "normal",
  };
  return s.cookie ? (
    <svg
      viewBox="0 0 100 100"
      className="decor-shape"
      onClick={(e) => handleShapeClick(e, s.spin)}
      style={{ top: s.top, left: s.left, right: s.right, width: s.size, height: s.size, ...spinStyle }}
    >
      <path d={COOKIE_PATHS[s.cookie]} fill={s.color} />
    </svg>
  ) : (
    <div
      className="decor-shape"
      onClick={(e) => handleShapeClick(e, s.spin)}
      style={{
        top: s.top,
        left: s.left,
        right: s.right,
        width: s.size,
        height: s.size,
        background: s.color,
        borderRadius: s.radius,
        ...spinStyle,
      }}
    />
  );
}

function DecorShapes() {
  return (
    <div className="decor-layer" aria-hidden="true">
      {DECOR_SHAPES.map((s, i) => (
        <Shape s={s} key={i} />
      ))}
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12" />
    </svg>
  );
}

const SWATCHES = [
  { bg: "#ff5a1f", label: "PLA Orange", shape: "square", effect: "bounce", sound: 0 },
  { bg: "#0f8b8d", label: "Deep Teal", shape: "cookie6", effect: "rotate", sound: 1 },
  { bg: "#191410", label: "Matte Black", shape: "clover4", effect: "bounce", sound: 2 },
  { bg: "#ffc93c", label: "Sunbeam Gold", shape: "cookie7", effect: "rotate", sound: 3 },
  { bg: "#e7e0d2", label: "Bone White", shape: "cookie9", effect: "bounce", sound: 4 },
  { bg: "#7c5cff", label: "Galaxy Purple", shape: "sunny12", effect: "rotate", sound: 5 },
];
// Normalized (objectBoundingBox, 0-1) versions of the cookie shapes for use
// as <clipPath> on the swatch buttons, so they scale with the button's own
// responsive size instead of a fixed pixel path.
const SWATCH_CLIPS = {
  cookie6: cookiePath(6, 0.44, 0.33, 0.5, 0.5),
  clover4: cookiePath(4, 0.47, 0.18, 0.5, 0.5),
  cookie7: cookiePath(7, 0.43, 0.34, 0.5, 0.5),
  cookie9: cookiePath(9, 0.42, 0.35, 0.5, 0.5),
  sunny12: cookiePath(12, 0.44, 0.27, 0.5, 0.5),
};

const SERVICES = [
  {
    num: "01",
    cls: "bg-orange",
    title: "Custom 3D Prints",
    desc: "Send an STL or a rough sketch, and we model, slice, and print it to spec.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2l9 5v10l-9 5-9-5V7z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 7l9 5 9-5M12 12v10" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    num: "02",
    cls: "bg-teal",
    title: "Keychains & Accessories",
    desc: "Names, mascots, tiny logos: durable little keepsakes people actually keep.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    num: "03",
    cls: "bg-gold",
    title: "Home Decor & Organizers",
    desc: "Planters, trays, desk organizers: practical pieces built to fit your space.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 10h16M4 14h16" stroke="currentColor" strokeWidth="1.8" />
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    num: "04",
    cls: "bg-pink",
    title: "Prototyping",
    desc: "Iterate fast on functional parts before you commit to production.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    num: "05",
    cls: "bg-lilac",
    title: "Personalized Gifts",
    desc: "Birthdays, giveaways, souvenirs: one-off pieces made for the occasion.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M20 7l-8-4-8 4m16 0v10l-8 4m0-14v14m0-14L4 7m8 14l-8-4V7"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    num: "06",
    cls: "bg-peach",
    title: "Cosplay & Props",
    desc: "Armor bits, badges, and props printed to hold up under a full con day.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21l2-7.5L2 9h7z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
];

const STEPS = [
  { n: "1", title: "Send your idea", desc: "A file, a photo, or just a description. Message us on Facebook." },
  { n: "2", title: "We quote & slice", desc: "We confirm size, color, and material, then prep the print." },
  { n: "3", title: "Layer by layer", desc: "Your object gets printed on our bed, one pass at a time." },
  { n: "4", title: "Pickup or delivery", desc: "Grab it in Caloocan or have it sent your way." },
];

export default function Home() {
  const [switchIdx, setSwitchIdx] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <DecorShapes />
      <header>
        <div className="wrap">
          <div className="navbar">
            <div className="brand">
              <div className="brand-mark">
                <LogoMark />
              </div>
            </div>
            <nav className="links">
              <a href="#services">Services</a>
              <a href="#process">Process</a>
              <a href="#colors">Colors</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </nav>
            <a className="cta-pill" href="#contact">
              Get a Quote
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main className="wrap hero-main">
        <section className="hero">
          <div className="hero-copy">
            <h1>
              Where Ideas
              <br />
              Become{" "}
              <span className="hl">
                Physical.
                <svg viewBox="0 0 220 16" preserveAspectRatio="none">
                  <path d="M2 10 Q55 2 110 8 T218 6" stroke="var(--orange)" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="lead">
              Mind2Matter is a Caloocan-based 3D printing studio. Send us your design, or just an idea, and
              we&apos;ll slice, print, and hand you something you can actually hold.
            </p>
            <div className="hero-ctas">
              <a href="#contact" className="btn btn-solid">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 20V10L12 4l8 6v10M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Request a Print
              </a>
              <a href={FB_URL} target="_blank" rel="noopener" className="btn btn-outline">
                <FacebookIcon />
                Message Us
              </a>
            </div>
            <div className="feat-row">
              <div className="f">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v18M3 12h18" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                Custom designs welcome
              </div>
              <div className="f">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" stroke="var(--teal)" strokeWidth="2" />
                    <path d="M12 8v4l3 2" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                Quick turnaround
              </div>
              <div className="f">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="8" cy="9" r="6.2" fill="var(--pastel-pink)" />
                    <circle cx="16" cy="9" r="6.2" fill="var(--teal)" opacity="0.9" />
                    <circle cx="12" cy="16.5" r="6.2" fill="var(--pastel-peach)" />
                  </svg>
                </span>
                Multi-color filaments
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="mascot-glow" />
            {MASCOT_SHAPES.map((s, i) => (
              <Shape s={s} key={i} />
            ))}
            <div className="mascot-wrap">
              <img src="/mascot.png" alt="Mind2Matter mascot" className="mascot-img" />
            </div>
          </div>
        </section>
      </main>

      <div className="marquee-clip">
      <div className="marquee-strip">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>CUSTOM 3D PRINTS</span>
          ))}
          {["KEYCHAINS & ACCESSORIES", "HOME DECOR", "PROTOTYPES", "PERSONALIZED GIFTS", "COSPLAY PROPS", "CUSTOM 3D PRINTS", "KEYCHAINS & ACCESSORIES", "HOME DECOR", "PROTOTYPES", "PERSONALIZED GIFTS", "COSPLAY PROPS"].map(
            (t, i) => (
              <span key={`b-${i}`}>{t}</span>
            )
          )}
        </div>
      </div>
      </div>

      <main className="wrap">
        <section id="services">
          <div className="sec-head reveal">
            <div>
              <h2>One studio, every kind of layer.</h2>
            </div>
            <p>From a single replacement part to a full run of gifts, if it can be modeled, we can print it in Caloocan.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <div className="service-card reveal" key={s.num}>
                <div className={`service-icon ${s.cls}`}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="process">
          <div className="process reveal">
            <div className="process-inner">
              <h2>Idea to object, four steps.</h2>
              <p className="desc">No modeling experience needed. Tell us what you&apos;re picturing and we&apos;ll take it from there.</p>
              <div className="steps">
                {STEPS.map((s) => (
                  <div className="step" key={s.n}>
                    <div className="step-num">{s.n}</div>
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="colors">
          <div className="sec-head reveal">
            <div>
              <h2>Pick a color, we&apos;ll load the spool.</h2>
            </div>
            <p>A running sample of finishes we keep in stock. More shades available on request.</p>
          </div>
          <div className="type-tester reveal">
            <span className="type-tester-label">Type to hear the switches</span>
            <select
              className="type-tester-select"
              value={switchIdx}
              onChange={(e) => {
                const idx = Number(e.target.value);
                setSwitchIdx(idx);
                playMechClick(SWITCH_LIB[idx].variant);
              }}
              aria-label="Pick a switch type"
            >
              {SWITCH_LIB.map((sw, i) => (
                <option value={i} key={sw.label}>
                  {sw.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="type-tester-input"
              placeholder="Try it — start typing..."
              autoComplete="off"
              spellCheck="false"
              onKeyDown={() => playMechClick(SWITCH_LIB[switchIdx].variant)}
            />
          </div>
          <div className="swatch-grid">
            {SWATCHES.map((sw) => (
              <div className="swatch-item reveal" key={sw.label}>
                <button
                  type="button"
                  className={`swatch${sw.shape === "square" ? " swatch-square" : ""}`}
                  style={{
                    background: sw.bg,
                    clipPath: sw.shape === "square" ? undefined : `url(#swatch-clip-${sw.shape})`,
                  }}
                  onClick={(e) => handleSwatchClick(e, sw.sound, sw.effect)}
                  aria-label={`${sw.label}: click for a mechanical-switch click sound`}
                >
                  <span className="swatch-click">Click Me</span>
                </button>
                <span className="swatch-label">{sw.label}</span>
              </div>
            ))}
          </div>
          <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
            <defs>
              {Object.entries(SWATCH_CLIPS).map(([name, d]) => (
                <clipPath id={`swatch-clip-${name}`} clipPathUnits="objectBoundingBox" key={name}>
                  <path d={d} />
                </clipPath>
              ))}
            </defs>
          </svg>
        </section>

        <section id="about">
          <div className="about">
            <div className="about-visual reveal">
              <img src="/about.jpg" alt="Mind2Matter at a market booth" className="about-photo" />
              <div className="about-badge">
                <div>
                  <strong>M2M</strong>Studio
                </div>
                <div>
                  <strong>Caloocan</strong>Philippines
                </div>
              </div>
            </div>
            <div className="reveal">
              <h2>Where ideas in mind take form as matter.</h2>
              <p>
                Mind2Matter started as a small Caloocan print shop with one simple belief: everyone has an idea
                worth holding in their hands. Whether it&apos;s a gift, a prop, a fix for something broken, or a
                business prototype, we print it with care, one layer at a time.
              </p>
              <p>Every order is handled directly by us, from slicing to finishing, so what you get back looks like what you asked for.</p>
              <div className="about-stats">
                <div>
                  <strong>100%</strong>
                  <span>CUSTOM ORDERS</span>
                </div>
                <div>
                  <strong>PH</strong>
                  <span>MADE IN CALOOCAN</span>
                </div>
                <div>
                  <strong>1:1</strong>
                  <span>DIRECT COMMUNICATION</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="contact-panel reveal">
            <div>
              <h2>Let&apos;s print your idea.</h2>
              <p>Reach out with your design, reference photo, or just a description of what you need. We&apos;ll reply with a quote and timeline.</p>
              <div className="hours-card">
                <div className="hours-row">
                  <span>Mon – Sat</span>
                  <span>By appointment / message</span>
                </div>
                <div className="hours-row">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
            <div className="contact-list">
              <a className="contact-item" href="tel:+639369937108">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2.2Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>
                <div>
                  <strong>0936 993 7108</strong>
                  <span>Tap to call</span>
                </div>
              </a>
              <a className="contact-item" href="mailto:mind2matterph@gmail.com">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18v12H3z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="m3 7 9 6 9-6" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                <div>
                  <strong>mind2matterph@gmail.com</strong>
                  <span>Email us your files</span>
                </div>
              </a>
              <a className="contact-item" href={FB_URL} target="_blank" rel="noopener">
                <span className="ico">
                  <FacebookIcon />
                </span>
                <div>
                  <strong>Mind2Matter</strong>
                  <span>facebook.com · send a message</span>
                </div>
              </a>
              <a className="contact-item" href={IG_URL} target="_blank" rel="noopener">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </span>
                <div>
                  <strong>@mind2matterph</strong>
                  <span>Follow for prints in progress</span>
                </div>
              </a>
              <div className="contact-item">
                <span className="ico">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11Z" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                <div>
                  <strong>Caloocan City</strong>
                  <span>Metro Manila, Philippines</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap">
        <div className="footer-top">
          <div className="brand">
            <div className="brand-mark">
              <LogoMark />
            </div>
          </div>
          <div className="footer-links">
            <a href="#services">Services</a>
            <a href="#process">Process</a>
            <a href="#colors">Colors</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="socials">
            <a href={FB_URL} target="_blank" rel="noopener">
              <FacebookIcon />
            </a>
            <a href={IG_URL} target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </a>
            <a href="mailto:mind2matterph@gmail.com">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18v12H3z" stroke="currentColor" strokeWidth="1.8" />
                <path d="m3 7 9 6 9-6" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Mind2Matter · Caloocan, Philippines</span>
          <span className="mono">Where ideas in mind take form as matter.</span>
        </div>
      </footer>

      <a className="float-msg" href={FB_URL} target="_blank" rel="noopener">
        <FacebookIcon />
        <span>Message Us</span>
      </a>
    </>
  );
}
