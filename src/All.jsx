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
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1800);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setIdx(i => i + 1);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed]);

  return display;
}

function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 80 }, () => ({
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
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "#4f8ef7";
            ctx.globalAlpha = (1 - d / 120) * 0.12;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 0 }} />;
}

function GlowOrb({ x, y, color, size = 300 }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size,
      borderRadius: "50%",
      background: color,
      filter: "blur(80px)",
      opacity: 0.12,
      pointerEvents: "none",
    }} />
  );
}

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(5,5,16,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,245,255,0.08)" : "none",
      transition: "all 0.3s ease",
      padding: "0 2rem",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          OH.
        </span>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="desktop-nav">
          {NAV_ITEMS.map(item => (
            <button key={item} onClick={() => scrollTo(item)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: active === item.toLowerCase() ? COLORS.cyan : "rgba(255,255,255,0.6)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14, fontWeight: 500,
                transition: "color 0.2s",
                borderBottom: active === item.toLowerCase() ? `2px solid ${COLORS.cyan}` : "2px solid transparent",
                paddingBottom: 2,
              }}>{item}</button>
          ))}
          <a href="mailto:hamadellahotman13@gmail.com" style={{
            background: "linear-gradient(135deg, #00f5ff, #4f8ef7)",
            color: "#000", padding: "8px 20px",
            borderRadius: 6, fontSize: 13, fontWeight: 600,
            textDecoration: "none", fontFamily: "'Space Grotesk', sans-serif",
          }}>Hire Me</a>
        </div>
        <button onClick={() => setMenuOpen(m => !m)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 24 }} className="hamburger">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      {menuOpen && (
        <div style={{ background: "rgba(5,5,16,0.98)", padding: "1rem 2rem 2rem", borderTop: "1px solid rgba(0,245,255,0.1)" }}>
          {NAV_ITEMS.map(item => (
            <button key={item} onClick={() => scrollTo(item)} style={{
              display: "block", width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.8)", fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 16, padding: "10px 0",
            }}>{item}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const typed = useTypingEffect(["Infrastructure Engineer", "Web Developer", "PHP/Laravel Expert", "Network Specialist", "Problem Solver"]);
  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "0 2rem" }}>
      <GlowOrb x="-100px" y="10%" color={COLORS.cyan} size={500} />
      <GlowOrb x="60%" y="20%" color={COLORS.purple} size={400} />
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 20, padding: "6px 16px", marginBottom: "1.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ color: COLORS.cyan, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>Available for opportunities</span>
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 1rem", fontFamily: "'Space Grotesk', sans-serif", color: "#fff" }}>
            Hi, I'm <span style={{ background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Othmane</span>
          </h1>
          <div style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 600, minHeight: 48, marginBottom: "1.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>I'm a </span>
            <span style={{ color: COLORS.cyan }}>{typed}</span>
            <span style={{ color: COLORS.cyan, animation: "blink 1s infinite" }}>|</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: 480, marginBottom: "2.5rem", fontSize: 16, fontFamily: "'Space Grotesk', sans-serif" }}>
            Specialized in digital infrastructure & web development. Building secure, scalable, and elegant solutions from the network layer up to the application layer.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} style={{
              background: "linear-gradient(135deg, #00f5ff, #4f8ef7)",
              color: "#000", padding: "14px 32px", borderRadius: 8,
              border: "none", cursor: "pointer", fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 15,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,245,255,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              View Projects →
            </button>
            <a href="mailto:hamadellahotman13@gmail.com" style={{
              background: "transparent", color: COLORS.cyan, padding: "14px 32px", borderRadius: 8,
              border: `1px solid ${COLORS.cyan}`, cursor: "pointer", fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 15,
              textDecoration: "none", display: "inline-block",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,245,255,0.1)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,245,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}>
              Get In Touch
            </a>
          </div>
          <div style={{ display: "flex", gap: "2rem", marginTop: "3rem" }}>
            {[["2+", "Years Exp."], ["10+", "Projects"], ["2", "CCNA Certs"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Space Grotesk', sans-serif" }}>{n}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "relative", width: 360, height: 360 }}>
            <div style={{
              position: "absolute", inset: -3, borderRadius: "50%",
              background: "linear-gradient(135deg, #00f5ff, #b855ff, #4f8ef7)",
              animation: "spin 8s linear infinite",
            }} />
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: COLORS.dark,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              <div style={{
                width: "100%", height: "100%",
                background: "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(184,85,255,0.15))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 80,
              }}>
                <img 
  src={myImage} 
  style={{ width: '400px', height: '400px', objectFit: 'cover',marginTop:'49px' }} 
  alt="Othmane" 
/>
              </div>
            </div>
            {[{ top: "5%", right: "5%", label: "Laravel", icon: "⚡" }, { bottom: "10%", left: "0%", label: "CCNA", icon: "🌐" }, { top: "40%", right: "-5%", label: "Linux", icon: "🐧" }].map(({ top, right, bottom, left, label, icon }) => (
              <div key={label} style={{
                position: "absolute", top, right, bottom, left,
                background: "rgba(10,10,26,0.9)",
                border: "1px solid rgba(0,245,255,0.2)",
                backdropFilter: "blur(10px)",
                borderRadius: 12, padding: "8px 14px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" style={{ padding: "100px 2rem", position: "relative" }}>
      <GlowOrb x="70%" y="50%" color={COLORS.blue} size={400} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="01. About Me" title="Who I Am" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.9, fontSize: 16, marginBottom: "1.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>
              I'm a recently graduated specialist in Digital Infrastructure and Web Development from ISTA NTIC Beni Mellal. My passion lies at the intersection of robust networking systems and elegant web applications.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.9, fontSize: 16, marginBottom: "2rem", fontFamily: "'Space Grotesk', sans-serif" }}>
              With a solid foundation in TCP/IP networking, Windows Server, Linux administration, and PHP/Laravel development, I bridge the gap between infrastructure and application layers — delivering complete, secure digital solutions.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[["📍", "Beni Mellal, Morocco"], ["📧", "hamadellahotman13@gmail.com"], ["📱", "+212 688082991"], ["🌐", "Arabic, French, English"]].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {[{ icon: "🌐", title: "Networking", desc: "CCNA certified with expertise in TCP/IP, VLAN, Routing & Switching", color: "#00f5ff" },
              { icon: "🖥️", title: "Systems", desc: "Windows Server & Linux administration, VMware & Hyper-V virtualization", color: "#4f8ef7" },
              { icon: "🔐", title: "Security", desc: "Firewall configuration, IDS/IPS concepts and network security", color: "#b855ff" },
              { icon: "⚡", title: "Development", desc: "PHP/Laravel, HTML, CSS, JavaScript — full stack web applications", color: "#00ff88" },
            ].map(({ icon, title, desc, color }) => (
              <GlassCard key={title} accentColor={color}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6, fontFamily: "'Space Grotesk', sans-serif" }}>{desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GlassCard({ children, accentColor = COLORS.cyan, style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${hovered ? accentColor + "44" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16,
        padding: "1.5rem",
        transition: "all 0.3s ease",
        boxShadow: hovered ? `0 0 30px ${accentColor}22` : "none",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        ...style,
      }}>
      {children}
    </div>
  );
}

function SectionHeader({ tag, title, center = false }) {
  return (
    <div style={{ marginBottom: "4rem", textAlign: center ? "center" : "left" }}>
      <span style={{ color: COLORS.cyan, fontSize: 13, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>{tag}</span>
      <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0.5rem 0 0", fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.purple})`, borderRadius: 2, marginTop: "1rem", marginLeft: center ? "auto" : 0, marginRight: center ? "auto" : 0 }} />
    </div>
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "'Space Grotesk', sans-serif" }}>{name}</span>
        <span style={{ fontSize: 12, color, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{lvl}%</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          width: animated ? `${lvl}%` : "0%",
          transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  );
}

function SkillsSection() {
  return (
    <section id="skills" style={{ padding: "100px 2rem", position: "relative" }}>
      <GlowOrb x="-5%" y="30%" color={COLORS.purple} size={400} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="02. Skills" title="Technical Arsenal" center />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {SKILLS.map(({ cat, color, icon, items }) => (
            <GlassCard key={cat} accentColor={color}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{cat}</h3>
              </div>
              {items.map(({ name, lvl }) => <SkillBar key={name} name={name} lvl={lvl} color={color} />)}
            </GlassCard>
          ))}
        </div>
        <div style={{ marginTop: "3rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
          {["PHP", "Laravel", "HTML5", "CSS3", "JavaScript", "TCP/IP", "VLAN", "Windows Server", "Linux", "VMware", "Hyper-V", "Firewalls", "CCNAv7", "Git", "MySQL"].map(tag => (
            <span key={tag} style={{
              padding: "6px 16px", borderRadius: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              fontSize: 13, fontFamily: "'Space Grotesk', sans-serif",
              transition: "all 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,245,255,0.1)"; e.currentTarget.style.borderColor = "rgba(0,245,255,0.3)"; e.currentTarget.style.color = COLORS.cyan; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROJECTS = [
  { title: "Network Infrastructure", desc: "Enterprise-grade LAN/WAN architecture with VLANs, inter-VLAN routing, and Cisco hardware configuration. Implemented redundancy and failover mechanisms.", tags: ["Cisco", "VLAN", "TCP/IP", "Switching"], color: "#00f5ff", emoji: "🌐" },
  { title: "Laravel Web Application", desc: "Full-stack PHP/Laravel application with authentication, RESTful API, and MySQL database. MVC architecture with Blade templating and secure middleware.", tags: ["PHP", "Laravel", "MySQL", "Blade"], color: "#b855ff", emoji: "⚡" },
  { title: "Windows Server Setup", desc: "Active Directory domain setup with Group Policy, DNS/DHCP services, user management, and remote desktop gateway for enterprise environment.", tags: ["Windows Server", "AD", "DNS", "DHCP"], color: "#4f8ef7", emoji: "🖥️" },
  { title: "Firewall Configuration", desc: "pfSense firewall deployment with IDS/IPS rules, VPN tunnels, traffic shaping, and comprehensive security audit logging.", tags: ["pfSense", "Firewall", "VPN", "IDS"], color: "#00ff88", emoji: "🔐" },
  { title: "Virtualization Lab", desc: "Multi-VM lab environment with VMware ESXi/Hyper-V. Configured snapshots, live migration, high availability, and resource pooling.", tags: ["VMware", "Hyper-V", "ESXi", "VM"], color: "#ff6b6b", emoji: "☁️" },
  { title: "Responsive Web Portfolio", desc: "Modern, responsive portfolio website built with HTML5, CSS3, and JavaScript. Featuring smooth animations, dark mode, and optimized performance.", tags: ["HTML5", "CSS3", "JavaScript"], color: "#ffd700", emoji: "🎨" },
];

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? project.color + "55" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 16, overflow: "hidden",
        transition: "all 0.35s ease",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 60px ${project.color}22` : "none",
        cursor: "pointer",
      }}>
      <div style={{
        height: 180, position: "relative", overflow: "hidden",
        background: `linear-gradient(135deg, ${project.color}22, ${project.color}08)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 72, opacity: hovered ? 1 : 0.7, transition: "all 0.3s", transform: hovered ? "scale(1.1)" : "scale(1)" }}>
          {project.emoji}
        </div>
        <div style={{
          position: "absolute", inset: 0,
          background: hovered ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.3)",
          transition: "background 0.3s",
        }} />
        {hovered && (
          <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", gap: 8 }}>
            <button style={{ background: project.color, color: "#000", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" }}>
              View Project ↗
            </button>
          </div>
        )}
      </div>
      <div style={{ padding: "1.25rem 1.5rem" }}>
        <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>{project.title}</h3>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7, marginBottom: "1rem", fontFamily: "'Space Grotesk', sans-serif" }}>{project.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.tags.map(t => (
            <span key={t} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 4, background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}33`, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" style={{ padding: "100px 2rem", position: "relative" }}>
      <GlowOrb x="50%" y="20%" color={COLORS.cyan} size={400} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="03. Projects" title="Featured Work" center />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {PROJECTS.map(p => <ProjectCard key={p.title} project={p} />)}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const items = [
    { year: "2022 – 2024", title: "Technicien Spécialisé en Infrastructure Digitale", org: "ISTA NTIC Beni Mellal", desc: "Specialized diploma in digital infrastructure. Studied networking, systems administration, cybersecurity, virtualization, and PHP/Laravel web development. CCNA certified.", color: COLORS.cyan, icon: "🎓" },
    { year: "2022", title: "Baccalauréat en Sciences Physiques (Option Français)", org: "Lycée Taghzirt", desc: "High school diploma with a strong foundation in physics and sciences, taught in French — reinforcing analytical thinking and bilingual technical communication.", color: COLORS.purple, icon: "📚" },
    { year: "2023", title: "CCNAv7 – Introduction to Networks", org: "Cisco Networking Academy", desc: "Mastered fundamentals of networking: OSI model, TCP/IP, basic routing and switching, IPv4/IPv6 addressing, and Ethernet technologies.", color: COLORS.blue, icon: "🌐" },
    { year: "2023", title: "CCNAv7 – Enterprise Networking, Security & Automation", org: "Cisco Networking Academy", desc: "Advanced networking: OSPF, BGP, network security concepts, ACLs, VPNs, and automation with Python and Ansible fundamentals.", color: "#00ff88", icon: "🔒" },
  ];
  return (
    <section id="experience" style={{ padding: "100px 2rem", position: "relative" }}>
      <GlowOrb x="-5%" y="50%" color={COLORS.cyan} size={300} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionHeader tag="04. Experience & Education" title="My Journey" center />
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(0,245,255,0.3), transparent)", transform: "translateX(-50%)" }} />
          {items.map((item, i) => (
            <div key={item.title} style={{ display: "flex", gap: "2rem", marginBottom: "3rem", flexDirection: i % 2 === 0 ? "row" : "row-reverse", alignItems: "flex-start" }}>
              <div style={{ flex: 1, textAlign: i % 2 === 0 ? "right" : "left" }}>
                <GlassCard accentColor={item.color}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                  <span style={{ fontSize: 12, color: item.color, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 1 }}>{item.year}</span>
                  <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: "6px 0", fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                  <div style={{ fontSize: 13, color: item.color, marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>{item.org}</div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>{item.desc}</p>
                </GlassCard>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: 20, boxShadow: `0 0 20px ${item.color}`, zIndex: 1 }} />
              <div style={{ flex: 1 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  { icon: "🌐", title: "Network Design", desc: "Full LAN/WAN architecture, VLAN setup, routing protocols, and network documentation for enterprise environments.", color: "#00f5ff" },
  { icon: "🖥️", title: "Server Administration", desc: "Windows Server & Linux setup, Active Directory, DNS/DHCP, remote access, and maintenance.", color: "#4f8ef7" },
  { icon: "☁️", title: "Virtualization", desc: "VMware & Hyper-V lab setup, VM deployment, snapshots, HA, and resource optimization.", color: "#b855ff" },
  { icon: "🔐", title: "Security Auditing", desc: "Firewall configuration, VPN tunnels, IDS/IPS deployment, and security policy enforcement.", color: "#00ff88" },
  { icon: "⚡", title: "Web Development", desc: "PHP/Laravel web applications with clean code, MVC architecture, database design, and RESTful APIs.", color: "#ff6b6b" },
  { icon: "📊", title: "IT Consulting", desc: "Infrastructure planning, technology evaluation, and digital transformation roadmaps for SMEs.", color: "#ffd700" },
];

function ServicesSection() {
  return (
    <section id="services" style={{ padding: "100px 2rem", position: "relative" }}>
      <GlowOrb x="80%" y="40%" color={COLORS.purple} size={400} />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="05. Services" title="What I Offer" center />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {SERVICES.map(s => (
            <GlassCard key={s.title} accentColor={s.color}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: "1.25rem" }}>{s.icon}</div>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 10, fontFamily: "'Space Grotesk', sans-serif" }}>{s.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7, fontFamily: "'Space Grotesk', sans-serif" }}>{s.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <section id="contact" style={{ padding: "100px 2rem", position: "relative" }}>
      <GlowOrb x="20%" y="30%" color={COLORS.cyan} size={350} />
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionHeader tag="06. Contact" title="Let's Connect" center />
        <GlassCard accentColor={COLORS.cyan} style={{ padding: "2.5rem" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: 60, marginBottom: "1rem" }}>✅</div>
              <h3 style={{ color: COLORS.cyan, fontSize: 24, fontFamily: "'Space Grotesk', sans-serif" }}>Message sent!</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Space Grotesk', sans-serif" }}>I'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>Name</label>
                  <input value={form.name} onChange={handle("name")} placeholder="Your name" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = COLORS.cyan} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>Email</label>
                  <input value={form.email} onChange={handle("email")} placeholder="your@email.com" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = COLORS.cyan} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>Message</label>
                <textarea value={form.msg} onChange={handle("msg")} placeholder="Tell me about your project..." rows={5} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 16px", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = COLORS.cyan} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <button onClick={() => setSent(true)} style={{
                width: "100%", background: "linear-gradient(135deg, #00f5ff, #4f8ef7)",
                color: "#000", padding: "14px 32px", borderRadius: 8,
                border: "none", cursor: "pointer", fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 15,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,245,255,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                Send Message ✉️
              </button>
              <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {[["📧", "Email", "hamadellahotman13@gmail.com", "mailto:hamadellahotman13@gmail.com"],
                  ["💼", "LinkedIn", "othmane-hamadellah", "https://www.linkedin.com/in/othmane-hamadellah-83924b310"],
                  ["🐙", "GitHub", "Hamadellah", "https://github.com/Hamadellah"]
                ].map(([icon, label, val, href]) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ textAlign: "center", textDecoration: "none", transition: "transform 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'Space Grotesk', sans-serif" }}>{label}</div>
                    <div style={{ fontSize: 12, color: COLORS.cyan, fontFamily: "'Space Grotesk', sans-serif" }}>{val}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "3rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "0.75rem" }}>OH.</div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "1.5rem" }}>
          Othmane Hamadellah — Infrastructure Engineer & Web Developer
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {[["💼", "https://www.linkedin.com/in/othmane-hamadellah-83924b310"], ["🐙", "https://github.com/Hamadellah"], ["📧", "mailto:hamadellahotman13@gmail.com"], ["📱", "tel:+212688082991"]].map(([icon, href]) => (
            <a key={href} href={href} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, textDecoration: "none", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,245,255,0.15)"; e.currentTarget.style.borderColor = "rgba(0,245,255,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              {icon}
            </a>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "'Space Grotesk', sans-serif" }}>
          © 2024 Othmane Hamadellah. Crafted with passion.
        </p>
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
      <div style={{ fontSize: 48, fontWeight: 900, background: "linear-gradient(135deg, #00f5ff, #b855ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "2rem" }}>OH.</div>
      <div style={{ width: 200, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 1, overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ height: "100%", width: `${prog}%`, background: "linear-gradient(90deg, #00f5ff, #b855ff)", transition: "width 0.05s linear" }} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'Space Grotesk', sans-serif" }}>Loading portfolio... {prog}%</span>
    </div>
  );
}

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = NAV_ITEMS.map(n => n.toLowerCase());
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.4 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [loaded]);

  if (!loaded) return <Loader onDone={() => setLoaded(true)} />;

  return (
    <div style={{ background: "#050510", minHeight: "100vh", color: "#fff", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #050510; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050510; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#00f5ff, #b855ff); border-radius: 2px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.9)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @media (max-width:768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (max-width:900px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
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
