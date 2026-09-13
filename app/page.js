"use client";

import { useEffect } from "react";

const FB_URL = "https://www.facebook.com/profile.php?id=61573794730980";
const IG_URL = "https://instagram.com/mind2matterph";

function LogoMark() {
  return <img src="/logo.png" alt="Mind2Matter" className="logo-img" />;
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12" />
    </svg>
  );
}

const SWATCHES = [
  { bg: "#ff5a1f", label: "PLA Orange" },
  { bg: "#0f8b8d", label: "Deep Teal" },
  { bg: "#191410", label: "Matte Black" },
  { bg: "#ffc93c", label: "Sunbeam Gold" },
  { bg: "#e7e0d2", label: "Bone White" },
  { bg: "#7c5cff", label: "Galaxy Purple" },
];

const SERVICES = [
  {
    num: "01",
    cls: "bg-orange",
    title: "Custom 3D Prints",
    desc: "Send an STL or a rough sketch — we model, slice, and print it to spec.",
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
    desc: "Names, mascots, tiny logos — durable little keepsakes people actually keep.",
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
    desc: "Planters, trays, desk organizers — practical pieces built to fit your space.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 10h16M4 14h16" stroke="currentColor" strokeWidth="1.8" />
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    num: "04",
    cls: "bg-orange",
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
    cls: "bg-teal",
    title: "Personalized Gifts",
    desc: "Birthdays, giveaways, souvenirs — one-off pieces made for the occasion.",
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
    cls: "bg-gold",
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
  { n: "1", title: "Send your idea", desc: "A file, a photo, or just a description — message us on Facebook." },
  { n: "2", title: "We quote & slice", desc: "We confirm size, color, and material, then prep the print." },
  { n: "3", title: "Layer by layer", desc: "Your object gets printed on our bed, one pass at a time." },
  { n: "4", title: "Pickup or delivery", desc: "Grab it in Caloocan or have it sent your way." },
];

export default function Home() {
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

      <main className="wrap">
        <section className="hero">
          <div>
            <h1>
              Where Ideas
              <br />
              Become{" "}
              <span className="hl">
                Physical.
                <svg viewBox="0 0 220 16" preserveAspectRatio="none">
                  <path d="M2 10 Q55 2 110 8 T218 6" stroke="var(--hero-accent)" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="lead">
              Mind2Matter is a Caloocan-based 3D printing studio. Send us your design — or just an idea — and
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
                    <path
                      d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4z"
                      stroke="#8a6a00"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
                Multi-color filaments
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="mascot-glow" />
            <div className="float-badge">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5z" fill="var(--ink)" />
              </svg>
            </div>
            <div className="mascot-wrap">
              <img src="/mascot.png" alt="Mind2Matter mascot" className="mascot-img" />
            </div>
          </div>
        </section>
      </main>

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

      <main className="wrap">
        <section id="services">
          <div className="sec-head reveal">
            <div>
              <h2>One studio, every kind of layer.</h2>
            </div>
            <p>From a single replacement part to a full run of gifts — if it can be modeled, we can print it in Caloocan.</p>
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
              <p className="desc">No modeling experience needed — tell us what you&apos;re picturing and we&apos;ll take it from there.</p>
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
            <p>A running sample of finishes we keep in stock — more shades available on request.</p>
          </div>
          <div className="swatch-grid">
            {SWATCHES.map((sw) => (
              <div className="swatch reveal" style={{ background: sw.bg }} key={sw.label}>
                <span>{sw.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="about">
          <div className="about">
            <div className="about-visual reveal">
              <svg viewBox="0 0 240 260" fill="none">
                <rect x="20" y="20" width="200" height="220" rx="24" fill="rgba(246,239,226,.12)" />
                <path d="M60 190 L60 120 L120 70 L180 120 L180 190 Z" stroke="var(--cream)" strokeWidth="4" fill="none" strokeLinejoin="round" />
                <path d="M60 120 L120 170 L180 120" stroke="var(--cream)" strokeWidth="4" fill="none" strokeLinejoin="round" />
                <path d="M120 170 L120 70" stroke="var(--cream)" strokeWidth="4" />
              </svg>
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
                business prototype — we print it with care, one layer at a time.
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
              <p>Reach out with your design, reference photo, or just a description of what you need — we&apos;ll reply with a quote and timeline.</p>
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
                  <span>facebook.com — send a message</span>
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
