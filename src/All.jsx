import { useState, useEffect, useRef } from "react";
import myImage from './IMG_9524.webp';
const COLORS = {
  cyan: "#00f5ff",
  purple: "#b855ff",
  blue: "#4f8ef7",
  dark: "#050510",
  darkCard: "#0a0a1a",
  darkBorder: "#1a1a35",
};

const NAV_ITEMS = ["Home","About","Skills","Projects","Experience","Services","Contact"];

function useTypingEffect(texts, speed = 80) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = texts[idx % texts.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), 1800);
        else setCharIdx(c => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) { setDeleting(false); setIdx(i => i + 1); setCharIdx(0); }
        else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed]);
  return display;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

// Hook: returns true once element enters viewport
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// Wrapper: animates children into view with a chosen effect
function Reveal({ children, effect = "fadeUp", delay = 0, style = {} }) {
  const [ref, visible] = useReveal(0.1);
  const base = { transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`, willChange: "opacity, transform" };
  const hidden = {
    fadeUp:    { opacity: 0, transform: "translateY(48px)" },
    fadeLeft:  { opacity: 0, transform: "translateX(-60px)" },
    fadeRight: { opacity: 0, transform: "translateX(60px)" },
    fadeIn:    { opacity: 0, transform: "scale(0.94)" },
    slideUp:   { opacity: 0, transform: "translateY(80px) scale(0.97)" },
  }[effect] || { opacity: 0 };
  const shown = { opacity: 1, transform: "translateY(0) translateX(0) scale(1)" };
  return (
    <div ref={ref} style={{ ...base, ...(visible ? shown : hidden), ...style }}>
      {children}
    </div>
  );
}

// Stagger wrapper: each child gets an increasing delay
function RevealGroup({ children, effect = "fadeUp", stagger = 100, baseDelay = 0 }) {
  return (
    <>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <Reveal key={i} effect={effect} delay={baseDelay + i * stagger}>{child}</Reveal>
          ))
        : <Reveal effect={effect} delay={baseDelay}>{children}</Reveal>}
    </>
  );
}

// Glowing divider between sections
function SectionDivider({ color1 = "#00f5ff", color2 = "#b855ff" }) {
  const [ref, visible] = useReveal(0.5);
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2rem", overflow: "hidden" }}>
      <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${color1}44)`, transition: "opacity 1s ease", opacity: visible ? 1 : 0 }} />
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color1, margin: "0 12px", boxShadow: `0 0 12px ${color1}`, transition: "opacity 0.8s 0.3s ease, transform 0.8s 0.3s cubic-bezier(0.22,1,0.36,1)", opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0)" }} />
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: color2, margin: "0 8px", boxShadow: `0 0 10px ${color2}`, transition: "opacity 0.8s 0.45s ease, transform 0.8s 0.45s cubic-bezier(0.22,1,0.36,1)", opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0)" }} />
      <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#fff", margin: "0 8px", transition: "opacity 0.8s 0.55s ease, transform 0.8s 0.55s cubic-bezier(0.22,1,0.36,1)", opacity: visible ? 0.4 : 0, transform: visible ? "scale(1)" : "scale(0)" }} />
      <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color2}44, transparent)`, transition: "opacity 1s ease", opacity: visible ? 1 : 0 }} />
    </div>
  );
}

function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = window.innerWidth < 768 ? 40 : 80;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? "#00f5ff" : "#b855ff",
    }));
    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "#4f8ef7"; ctx.globalAlpha = (1 - d / 100) * 0.1;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 0 }} />;
}

function GlowOrb({ x, y, color, size = 300 }) {
  return <div style={{ position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, filter: "blur(80px)", opacity: 0.1, pointerEvents: "none" }} />;
}

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled || menuOpen ? "rgba(5,5,16,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(0,245,255,0.08)" : "none", transition: "all 0.3s ease" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, padding: "0 1.25rem" }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>OH.</span>
        {/* Desktop nav */}
        <div id="desktop-nav" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {NAV_ITEMS.map(item => (
            <button key={item} onClick={() => scrollTo(item)} style={{ background: "none", border: "none", cursor: "pointer", color: active === item.toLowerCase() ? COLORS.cyan : "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 500, transition: "color 0.2s", borderBottom: active === item.toLowerCase() ? `2px solid ${COLORS.cyan}` : "2px solid transparent", paddingBottom: 2 }}>{item}</button>
          ))}
          <a href="mailto:hamadellahotman13@gmail.com" style={{ background: "linear-gradient(135deg, #00f5ff, #4f8ef7)", color: "#000", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "'Space Grotesk', sans-serif", whiteSpace: "nowrap" }}>Hire Me</a>
        </div>
        {/* Hamburger */}
        <button id="hamburger-btn" onClick={() => setMenuOpen(m => !m)} style={{ display: "none", background: "none", border: "1px solid rgba(0,245,255,0.3)", borderRadius: 8, cursor: "pointer", color: "#fff", fontSize: 20, width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: "rgba(5,5,16,0.98)", padding: "0.5rem 1.25rem 1.5rem", borderTop: "1px solid rgba(0,245,255,0.1)" }}>
          {NAV_ITEMS.map(item => (
            <button key={item} onClick={() => scrollTo(item)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", color: active === item.toLowerCase() ? COLORS.cyan : "rgba(255,255,255,0.8)", fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, padding: "14px 0" }}>{item}</button>
          ))}
          <a href="mailto:hamadellahotman13@gmail.com" style={{ display: "block", marginTop: "1rem", background: "linear-gradient(135deg, #00f5ff, #4f8ef7)", color: "#000", padding: "12px", borderRadius: 8, textAlign: "center", fontWeight: 700, textDecoration: "none", fontFamily: "'Space Grotesk', sans-serif" }}>Hire Me</a>
        </div>
      )}
    </nav>
  );
}

function GlassCard({ children, accentColor = COLORS.cyan, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)", border: `1px solid ${hovered ? accentColor + "44" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "1.25rem", transition: "all 0.3s ease", boxShadow: hovered ? `0 0 30px ${accentColor}22` : "none", transform: hovered ? "translateY(-4px)" : "translateY(0)", ...style }}>
      {children}
    </div>
  );
}

function SectionHeader({ tag, title, center = false }) {
  return (
    <Reveal effect="fadeUp" delay={0}>
    <div style={{ marginBottom: "3rem", textAlign: center ? "center" : "left" }}>
      <span style={{ color: COLORS.cyan, fontSize: 12, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>{tag}</span>
      <h2 style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0.5rem 0 0", fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.purple})`, borderRadius: 2, marginTop: "1rem", marginLeft: center ? "auto" : 0, marginRight: center ? "auto" : 0 }} />
    </div>
    </Reveal>
  );
}

function HeroSection() {
  const typed = useTypingEffect(["Infrastructure Engineer", "Web Developer", "PHP/Laravel Expert", "Network Specialist", "Problem Solver"]);
  const isMobile = useIsMobile();
  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: isMobile ? "80px 1.25rem 3rem" : "0 2rem" }}>
      <GlowOrb x="-100px" y="10%" color={COLORS.cyan} size={isMobile ? 250 : 500} />
      <GlowOrb x="60%" y="20%" color={COLORS.purple} size={isMobile ? 200 : 400} />
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "3rem" : "4rem", alignItems: "center" }}>
        {/* Text side */}
        <div style={{ order: isMobile ? 2 : 1 }}>
          <Reveal effect="fadeLeft" delay={100}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 20, padding: "6px 14px", marginBottom: "1.25rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ff88", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ color: COLORS.cyan, fontSize: 12, fontFamily: "'Space Grotesk', sans-serif" }}>Available for opportunities</span>
          </div>
          </Reveal>
          <Reveal effect="fadeLeft" delay={220}>
          <h1 style={{ fontSize: "clamp(2rem, 8vw, 4rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 1rem", fontFamily: "'Space Grotesk', sans-serif", color: "#fff" }}>
            Hi, I'm <span style={{ background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Othmane</span>
          </h1>
          </Reveal>
          <Reveal effect="fadeLeft" delay={340}>
          <div style={{ fontSize: "clamp(1rem, 4vw, 1.8rem)", fontWeight: 600, minHeight: 44, marginBottom: "1.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>I'm a </span>
            <span style={{ color: COLORS.cyan }}>{typed}</span>
            <span style={{ color: COLORS.cyan, animation: "blink 1s infinite" }}>|</span>
          </div>
          </Reveal>
          <Reveal effect="fadeLeft" delay={440}>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 480, marginBottom: "2rem", fontSize: 15, fontFamily: "'Space Grotesk', sans-serif" }}>
            Specialized in digital infrastructure & web development. Building secure, scalable, and elegant solutions from the network layer up to the application layer.
          </p>
          </Reveal>
          <Reveal effect="fadeUp" delay={560}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "linear-gradient(135deg, #00f5ff, #4f8ef7)", color: "#000", padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14 }}>View Projects →</button>
            <a href="mailto:hamadellahotman13@gmail.com" style={{ background: "transparent", color: COLORS.cyan, padding: "12px 24px", borderRadius: 8, border: `1px solid ${COLORS.cyan}`, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, textDecoration: "none", display: "inline-block" }}>Get In Touch</a>
          </div>
          </Reveal>
          <Reveal effect="fadeUp" delay={700}>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "2.5rem" }}>
            {[["2+", "Years Exp."], ["10+", "Projects"], ["2", "CCNA Certs"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Space Grotesk', sans-serif" }}>{n}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>{l}</div>
              </div>
            ))}
          </div>
          </Reveal>
        </div>
        {/* Avatar side */}
        <div style={{ display: "flex", justifyContent: "center", order: isMobile ? 1 : 2 }}>
          <Reveal effect="fadeRight" delay={300}>
          <div style={{ position: "relative", width: isMobile ? 240 : 320, height: isMobile ? 240 : 320 }}>
            <div style={{ position: "absolute", inset: -3, borderRadius: "50%", background: "linear-gradient(135deg, #00f5ff, #b855ff, #4f8ef7)", animation: "spin 8s linear infinite" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: COLORS.dark, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(0,245,255,0.1), rgba(184,85,255,0.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 56 : 72 }}>
               <img src={myImage} width="330" height="330" alt="Othmane" />
              </div>
            </div>
            {!isMobile && [{ top: "5%", right: "0%", label: "Laravel", icon: "⚡" }, { bottom: "10%", left: "-5%", label: "CCNA", icon: "🌐" }, { top: "40%", right: "-8%", label: "Linux", icon: "🐧" }].map(({ top, right, bottom, left, label, icon }) => (
              <div key={label} style={{ position: "absolute", top, right, bottom, left, background: "rgba(10,10,26,0.9)", border: "1px solid rgba(0,245,255,0.2)", backdropFilter: "blur(10px)", borderRadius: 12, padding: "7px 12px", display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#00f5ff" color2="#4f8ef7" />
    <section id="about" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="70%" y="50%" color={COLORS.blue} size={300} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="01. About Me" title="Who I Am" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "2rem" : "4rem", alignItems: "center" }}>
          <Reveal effect="fadeLeft" delay={100}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.9, fontSize: 15, marginBottom: "1.25rem", fontFamily: "'Space Grotesk', sans-serif" }}>
              I'm a recently graduated specialist in Digital Infrastructure and Web Development from ISTA NTIC Beni Mellal. My passion lies at the intersection of robust networking systems and elegant web applications.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.9, fontSize: 15, marginBottom: "1.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>
              With a solid foundation in TCP/IP networking, Windows Server, Linux administration, and PHP/Laravel development, I bridge the gap between infrastructure and application layers — delivering complete, secure digital solutions.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem" }}>
              {[["📍", "Beni Mellal, Morocco"], ["📧", "hamadellahotman13@gmail.com"], ["📱", "+212 688082991"], ["🌐", "Arabic, French, English"]].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif", wordBreak: "break-all" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[{ icon: "🌐", title: "Networking", desc: "CCNA certified with expertise in TCP/IP, VLAN, Routing & Switching", color: "#00f5ff" },
              { icon: "🖥️", title: "Systems", desc: "Windows Server & Linux administration, VMware & Hyper-V virtualization", color: "#4f8ef7" },
              { icon: "🔐", title: "Security", desc: "Firewall configuration, IDS/IPS concepts and network security", color: "#b855ff" },
              { icon: "⚡", title: "Development", desc: "PHP/Laravel, HTML, CSS, JavaScript — full stack web apps", color: "#00ff88" },
            ].map(({ icon, title, desc, color }, i) => (
              <Reveal key={title} effect="fadeIn" delay={150 + i * 100}>
              <GlassCard accentColor={color} style={{ padding: "1rem" }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
                <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6, fontFamily: "'Space Grotesk', sans-serif" }}>{desc}</p>
              </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
const SKILLS = [
  { cat: "Networking", color: "#00f5ff", icon: "🌐", items: [{ name: "TCP/IP", lvl: 90 }, { name: "VLAN", lvl: 85 }, { name: "Routing", lvl: 82 }, { name: "Switching", lvl: 80 }] },
  { cat: "Systems", color: "#4f8ef7", icon: "🖥️", items: [{ name: "Windows Server", lvl: 85 }, { name: "Linux", lvl: 80 }, { name: "VMware", lvl: 75 }, { name: "Hyper-V", lvl: 72 }] },
  { cat: "Security", color: "#b855ff", icon: "🔐", items: [{ name: "Firewalls", lvl: 80 }, { name: "IDS/IPS", lvl: 70 }, { name: "VPN", lvl: 72 }, { name: "Network Hardening", lvl: 75 }] },
  { cat: "Development", color: "#00ff88", icon: "⚡", items: [{ name: "PHP", lvl: 85 }, { name: "Laravel", lvl: 82 }, { name: "JavaScript", lvl: 75 }, { name: "HTML/CSS", lvl: 90 }] },
];

function SkillBar({ name, lvl, color }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "'Space Grotesk', sans-serif" }}>{name}</span>
        <span style={{ fontSize: 12, color, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{lvl}%</span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${color}, ${color}88)`, width: animated ? `${lvl}%` : "0%", transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 6px ${color}66` }} />
      </div>
    </div>
  );
}

function SkillsSection() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#b855ff" color2="#00f5ff" />
    <section id="skills" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="-5%" y="30%" color={COLORS.purple} size={300} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="02. Skills" title="Technical Arsenal" center />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {SKILLS.map(({ cat, color, icon, items }, i) => (
            <Reveal key={cat} effect="slideUp" delay={i * 120}>
            <GlassCard accentColor={color}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{cat}</h3>
              </div>
              {items.map(({ name, lvl }) => <SkillBar key={name} name={name} lvl={lvl} color={color} />)}
            </GlassCard>
            </Reveal>
          ))}
        </div>
        <Reveal effect="fadeUp" delay={200}>
        <div style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "0.6rem", justifyContent: "center" }}>
          {["PHP", "Laravel", "HTML5", "CSS3", "JavaScript", "TCP/IP", "VLAN", "Windows Server", "Linux", "VMware", "Hyper-V", "Firewalls", "CCNAv7", "Git", "MySQL"].map(tag => (
            <span key={tag} style={{ padding: "5px 14px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "'Space Grotesk', sans-serif", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,245,255,0.1)"; e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)"; e.currentTarget.style.color = COLORS.cyan; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
              {tag}
            </span>
          ))}
        </div>
        </Reveal>
      </div>
    </section>
    </>
  );
}

const PROJECTS = [
  { title: "Network Infrastructure", desc: "Enterprise-grade LAN/WAN architecture with VLANs, inter-VLAN routing, and Cisco hardware configuration.", tags: ["Cisco", "VLAN", "TCP/IP", "Switching"], color: "#00f5ff", emoji: "🌐" },
  { title: "Laravel Web Application", desc: "Full-stack PHP/Laravel app with authentication, RESTful API, MySQL. MVC architecture with Blade templating.", tags: ["PHP", "Laravel", "MySQL", "Blade"], color: "#b855ff", emoji: "⚡" },
  { title: "Windows Server Setup", desc: "Active Directory domain with Group Policy, DNS/DHCP services, user management, and remote desktop gateway.", tags: ["Windows Server", "AD", "DNS", "DHCP"], color: "#4f8ef7", emoji: "🖥️" },
  { title: "Firewall Configuration", desc: "pfSense firewall with IDS/IPS rules, VPN tunnels, traffic shaping, and comprehensive security logging.", tags: ["pfSense", "Firewall", "VPN", "IDS"], color: "#00ff88", emoji: "🔐" },
  { title: "Virtualization Lab", desc: "Multi-VM environment with VMware ESXi/Hyper-V. Snapshots, live migration, HA, and resource pooling.", tags: ["VMware", "Hyper-V", "ESXi", "VM"], color: "#ff6b6b", emoji: "☁️" },
  { title: "Responsive Web Portfolio", desc: "Modern portfolio built with HTML5, CSS3, JavaScript. Smooth animations, dark mode, optimized performance.", tags: ["HTML5", "CSS3", "JavaScript"], color: "#ffd700", emoji: "🎨" },
];

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${hovered ? project.color + "55" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.35s ease", transform: hovered ? "translateY(-6px)" : "translateY(0)", boxShadow: hovered ? `0 16px 50px ${project.color}22` : "none", cursor: "pointer" }}>
      <div style={{ height: 150, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${project.color}22, ${project.color}08)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 60, opacity: hovered ? 1 : 0.7, transition: "all 0.3s", transform: hovered ? "scale(1.1)" : "scale(1)" }}>{project.emoji}</div>
        <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.25)", transition: "background 0.3s" }} />
        {hovered && (
          <div style={{ position: "absolute", bottom: 10, right: 10 }}>
            <button style={{ background: project.color, color: "#000", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>View ↗</button>
          </div>
        )}
      </div>
      <div style={{ padding: "1rem 1.25rem" }}>
        <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>{project.title}</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6, marginBottom: "0.75rem", fontFamily: "'Space Grotesk', sans-serif" }}>{project.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {project.tags.map(t => (
            <span key={t} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}33`, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#00f5ff" color2="#b855ff" />
    <section id="projects" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="50%" y="20%" color={COLORS.cyan} size={300} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="03. Projects" title="Featured Work" center />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} effect="slideUp" delay={i * 100}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

function ExperienceSection() {
  const isMobile = useIsMobile();
  const items = [
    { year: "2022–2024", title: "Technicien Spécialisé en Infrastructure Digitale", org: "ISTA NTIC Beni Mellal", desc: "Specialized diploma in digital infrastructure. Networking, sysadmin, cybersecurity, virtualization, and PHP/Laravel. CCNA certified.", color: COLORS.cyan, icon: "🎓" },
    { year: "2022", title: "Baccalauréat en Sciences Physiques (Option Français)", org: "Lycée Taghzirt", desc: "High school diploma with a strong foundation in physics and sciences, taught in French.", color: COLORS.purple, icon: "📚" },
    { year: "2023", title: "CCNAv7 – Introduction to Networks", org: "Cisco Networking Academy", desc: "OSI model, TCP/IP, basic routing and switching, IPv4/IPv6 addressing, and Ethernet technologies.", color: COLORS.blue, icon: "🌐" },
    { year: "2023", title: "CCNAv7 – Enterprise Networking, Security & Automation", org: "Cisco Networking Academy", desc: "OSPF, BGP, ACLs, VPNs, network security concepts, and automation fundamentals.", color: "#00ff88", icon: "🔒" },
  ];

  if (isMobile) {
    return (
      <>
      <SectionDivider color1="#4f8ef7" color2="#b855ff" />
      <section id="experience" style={{ padding: "70px 1.25rem", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionHeader tag="04. Experience & Education" title="My Journey" />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", paddingLeft: "1.5rem", borderLeft: `2px solid rgba(0,245,255,0.2)` }}>
            {items.map((item, i) => (
              <Reveal key={item.title} effect="fadeLeft" delay={i * 120}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: -28, top: 18, width: 14, height: 14, borderRadius: "50%", background: item.color, boxShadow: `0 0 12px ${item.color}` }} />
                <GlassCard accentColor={item.color} style={{ padding: "1rem" }}>
                  <span style={{ fontSize: 20, marginBottom: 6, display: "block" }}>{item.icon}</span>
                  <span style={{ fontSize: 11, color: item.color, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 1 }}>{item.year}</span>
                  <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "5px 0", fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                  <div style={{ fontSize: 12, color: item.color, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>{item.org}</div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>{item.desc}</p>
                </GlassCard>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </>
    );
  }

  return (
    <>
    <SectionDivider color1="#4f8ef7" color2="#b855ff" />
    <section id="experience" style={{ padding: "100px 2rem", position: "relative" }}>
      <GlowOrb x="-5%" y="50%" color={COLORS.cyan} size={300} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionHeader tag="04. Experience & Education" title="My Journey" center />
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(0,245,255,0.3), transparent)", transform: "translateX(-50%)" }} />
          {items.map((item, i) => (
            <Reveal key={item.title} effect={i % 2 === 0 ? "fadeLeft" : "fadeRight"} delay={i * 100}>
            <div style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem", flexDirection: i % 2 === 0 ? "row" : "row-reverse", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <GlassCard accentColor={item.color}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                  <span style={{ fontSize: 11, color: item.color, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 1 }}>{item.year}</span>
                  <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "5px 0", fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                  <div style={{ fontSize: 12, color: item.color, marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>{item.org}</div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>{item.desc}</p>
                </GlassCard>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 18, boxShadow: `0 0 16px ${item.color}`, zIndex: 1 }} />
              <div style={{ flex: 1 }} />
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

const SERVICES = [
  { icon: "🌐", title: "Network Design", desc: "Full LAN/WAN architecture, VLAN setup, routing protocols, and network documentation.", color: "#00f5ff" },
  { icon: "🖥️", title: "Server Admin", desc: "Windows Server & Linux setup, Active Directory, DNS/DHCP, and maintenance.", color: "#4f8ef7" },
  { icon: "☁️", title: "Virtualization", desc: "VMware & Hyper-V setup, VM deployment, snapshots, HA, and optimization.", color: "#b855ff" },
  { icon: "🔐", title: "Security Auditing", desc: "Firewall configuration, VPN tunnels, IDS/IPS deployment, and policy enforcement.", color: "#00ff88" },
  { icon: "⚡", title: "Web Development", desc: "PHP/Laravel apps with clean code, MVC architecture, database design, and APIs.", color: "#ff6b6b" },
  { icon: "📊", title: "IT Consulting", desc: "Infrastructure planning, tech evaluation, and digital transformation roadmaps.", color: "#ffd700" },
];

function ServicesSection() {
  const isMobile = useIsMobile();
  return (
    <>
    <SectionDivider color1="#b855ff" color2="#00ff88" />
    <section id="services" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="80%" y="40%" color={COLORS.purple} size={300} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="05. Services" title="What I Offer" center />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} effect="slideUp" delay={i * 100}>
            <GlassCard accentColor={s.color}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: "1rem" }}>{s.icon}</div>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>{s.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7, fontFamily: "'Space Grotesk', sans-serif" }}>{s.desc}</p>
            </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const isMobile = useIsMobile();
  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <>
    <SectionDivider color1="#00f5ff" color2="#4f8ef7" />
    <section id="contact" style={{ padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative" }}>
      <GlowOrb x="20%" y="30%" color={COLORS.cyan} size={300} />
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <SectionHeader tag="06. Contact" title="Let's Connect" center />
        <Reveal effect="fadeIn" delay={100}>
        <GlassCard accentColor={COLORS.cyan} style={{ padding: isMobile ? "1.5rem" : "2.5rem" }}>          {sent ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: 56, marginBottom: "1rem" }}>✅</div>
              <h3 style={{ color: COLORS.cyan, fontSize: 22, fontFamily: "'Space Grotesk', sans-serif" }}>Message sent!</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif" }}>I'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                {[["name", "Name", "Your name"], ["email", "Email", "your@email.com"]].map(([k, label, placeholder]) => (
                  <div key={k}>
                    <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontFamily: "'Space Grotesk', sans-serif" }}>{label}</label>
                    <input value={form[k]} onChange={handle(k)} placeholder={placeholder} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "11px 14px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = COLORS.cyan} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5, fontFamily: "'Space Grotesk', sans-serif" }}>Message</label>
                <textarea value={form.msg} onChange={handle("msg")} placeholder="Tell me about your project..." rows={5} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "11px 14px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = COLORS.cyan} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <button onClick={() => setSent(true)} style={{ width: "100%", background: "linear-gradient(135deg, #00f5ff, #4f8ef7)", color: "#000", padding: "14px 32px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", fontSize: 15 }}>Send Message ✉️</button>
              <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? "1.25rem" : "2rem", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
                {[["📧", "Email", "hamadellahotman13@gmail.com", "mailto:hamadellahotman13@gmail.com"],
                  ["💼", "LinkedIn", "othmane-hamadellah", "https://www.linkedin.com/in/othmane-hamadellah-83924b310"],
                  ["🐙", "GitHub", "Hamadellah", "https://github.com/Hamadellah"]
                ].map(([icon, label, val, href]) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textAlign: "center", textDecoration: "none" }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>{label}</div>
                    <div style={{ fontSize: 11, color: COLORS.cyan, fontFamily: "'Space Grotesk', sans-serif", wordBreak: "break-all" }}>{val}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
        </Reveal>
      </div>
    </section>
    </>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "2.5rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "0.5rem" }}>OH.</div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.25rem" }}>Othmane Hamadellah — Infrastructure Engineer & Web Developer</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.25rem" }}>
          {[["💼", "https://www.linkedin.com/in/othmane-hamadellah-83924b310"], ["🐙", "https://github.com/Hamadellah"], ["📧", "mailto:hamadellahotman13@gmail.com"], ["📱", "tel:+212688082991"]].map(([icon, href]) => (
            <a key={href} href={href} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,245,255,0.15)"; e.currentTarget.style.borderColor = "rgba(0,245,255,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              {icon}
            </a>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "'Space Grotesk', sans-serif" }}>© 2024 Othmane Hamadellah. Crafted with passion.</p>
      </div>
    </footer>
  );
}

function Loader({ onDone }) {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setProg(p => { if (p >= 100) { clearInterval(t); setTimeout(onDone, 300); return 100; } return p + 2; }), 30);
    return () => clearInterval(t);
  }, [onDone]);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#050510", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ fontSize: 44, fontWeight: 900, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "2rem" }}>OH.</div>
      <div style={{ width: 180, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 1, overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ height: "100%", width: `${prog}%`, background: "linear-gradient(90deg, #00f5ff, #b855ff)", transition: "width 0.05s linear" }} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>Loading... {prog}%</span>
    </div>
  );
}

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const sections = NAV_ITEMS.map(n => n.toLowerCase());
    const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); }, { threshold: 0.3 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [loaded]);

  if (!loaded) return <Loader onDone={() => setLoaded(true)} />;

  return (
    <div style={{ background: "#050510", minHeight: "100vh", color: "#fff", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #050510; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #050510; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#00f5ff, #b855ff); border-radius: 2px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.9)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (min-width: 769px) { #hamburger-btn { display: none !important; } }
        @media (max-width: 768px) { #desktop-nav { display: none !important; } #hamburger-btn { display: flex !important; } }
      `}</style>
      <Particles />
      <Navbar active={active} />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}