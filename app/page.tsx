import HeroIntro from "@/components/HeroIntro";
import HeroScope from "@/components/HeroScope";
import HeroPinned from "@/components/HeroPinned";
import ScrollReveal from "@/components/ScrollReveal";
import SplitReveal from "@/components/SplitReveal";
import Marquee from "@/components/Marquee";
import MagneticButton from "@/components/MagneticButton";
import TiltCard from "@/components/TiltCard";
import ProjectGallery, { type Project } from "@/components/ProjectGallery";

const marqueeItems = [
  "Unity Engine",
  "URP Shaders",
  "Gameplay Systems",
  "Mobile Games",
  "HLSL / ShaderLab",
  "AppLovin MAX",
];

const skillGroups = [
  {
    title: "Gameplay & Engine",
    tags: ["C#", "Unity URP", "DOTween / LMotion", "UniTask", "Jobs & Burst", "R3 / VitalRouter"],
    tick: "var(--teal)",
  },
  {
    title: "Rendering & Shader",
    tags: ["ShaderLab", "HLSL", "URP Custom Shaders", "SpriteMask & Stencil", "Post-processing"],
    tick: "var(--gold)",
  },
  {
    title: "Tooling & Workflow",
    tags: ["Odin Inspector", "Easy Save 3", "Spine-Unity", "Editor Tooling", "Obi Rope"],
    tick: "var(--coral)",
  },
  {
    title: "Native & Monetization",
    tags: ["AppLovin MAX", "Android / iOS Native Bridge", "ANR & Performance Profiling", "Objective-C"],
    tick: "var(--teal)",
  },
];

const projects: Project[] = [
  {
    tag: "Puzzle Game · Shader",
    title: "Water Sort Puzzle Color Master",
    desc: "Shader chất lỏng nhiều lớp cho chai nước (URP/HLSL): mặt cong meniscus, nghiêng chai theo góc thực (tan), preview WebGL đồng bộ với bản Unity.",
    stack: ["HLSL", "ShaderLab", "URP", "WebGL"],
    vessel: {
      type: "bottle",
      layers: [
        { h: 34, c: "#4fd1c5" },
        { h: 33, c: "#ffd166" },
        { h: 33, c: "#ff6b6b" },
      ],
    },
  },
  {
    tag: "Live Event · Animation",
    title: "WinStreakEvent1",
    desc: "Shader shine/shimmer cho URP, cùng chuỗi animation scale + đếm số tuần tự dùng UniTask và CancellationTokenSource, đồng bộ âm thanh qua AudioController.",
    stack: ["UniTask", "URP Shader", "AudioController"],
    vessel: {
      type: "orb",
      layers: [{ h: 50, c: "#ffd166" }, { h: 50, c: "#4fd1c5" }],
      shimmer: true,
    },
  },
  {
    tag: "Performance · Diagnostics",
    title: "Android ANR Root-Cause",
    desc: "Phân tích log ANR từ Google Play Console, xác định nguyên nhân do GPU fence stall khi WebView ad creative (Pangle/ByteDance) chặn RenderThread của Unity.",
    stack: ["Android", "Profiling", "AppLovin MAX"],
    vessel: {
      type: "orb",
      layers: [{ h: 100, c: "#ff6b6b" }],
      pulse: true,
    },
  },
  {
    tag: "Monetization System",
    title: "Bid Floor Interstitial (iOS)",
    desc: "Hệ thống quảng cáo interstitial nhiều tầng bid floor bằng Objective-C, mở rộng từ 2 lên 9 đơn vị quảng cáo, cấu hình linh hoạt qua Info.plist.",
    stack: ["Objective-C", "AppLovin MAX", "iOS"],
    vessel: {
      type: "bottle",
      layers: [{ h: 50, c: "#ffd166" }, { h: 50, c: "#ff6b6b" }],
    },
  },
];

export default function Home() {
  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <a href="#top" className="logo">
            <span className="logo-dot" />
            RYDER
          </a>
          <ul className="nav-links">
            <li><a href="#skills">Kỹ năng</a></li>
            <li><a href="#projects">Dự án</a></li>
            <li><a href="#about">Giới thiệu</a></li>
            <li><a href="#contact">Liên hệ</a></li>
          </ul>
        </div>
      </nav>

      <Marquee items={marqueeItems} />

      <main id="top">
        <HeroPinned
          copy={
            <HeroIntro>
              <div className="hero-copy">
                <p className="eyebrow">unity game developer · mobile</p>
                <h1>
                  Gameplay chắc tay, shader tự viết, và không né phần khó của mobile game.
                </h1>
                <p>
                  Mình là Ryder — Unity developer tập trung vào mobile: gameplay logic bằng C#,
                  shader URP/HLSL cho hiệu ứng đặc thù (chất lỏng nhiều lớp, shimmer sự kiện), và
                  phần ít người nhận làm — tích hợp quảng cáo native (AppLovin MAX) trên Android/iOS,
                  debug hiệu năng tới tận RenderThread. Đang nhận dự án freelance ngắn hạn, và mở cho
                  cơ hội full-time.
                </p>
                <div className="cta-row">
                  <MagneticButton href="#projects" className="btn btn-primary">
                    Xem case study
                  </MagneticButton>
                  <MagneticButton href="#contact" className="btn btn-ghost">
                    Liên hệ hợp tác
                  </MagneticButton>
                </div>
              </div>
            </HeroIntro>
          }
          scope={<HeroScope />}
        />

        <section id="skills" className="container section">
          <div className="section-head">
            <p className="eyebrow">bộ công cụ</p>
            <SplitReveal as="h2">Công cụ đang dùng hằng ngày</SplitReveal>
          </div>
          <ScrollReveal className="skill-groups">
            {skillGroups.map((g) => (
              <TiltCard as="div" className="skill-card" key={g.title} maxTilt={6} glare>
                <span className="skill-tick" style={{ "--skill-c": g.tick } as React.CSSProperties} />
                <h3>{g.title}</h3>
                <div className="tag-row">
                  {g.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </TiltCard>
            ))}
          </ScrollReveal>
        </section>

        <ProjectGallery projects={projects} />

        <section id="about" className="container section about-section">
          <div className="section-head">
            <p className="eyebrow">giới thiệu</p>
            <SplitReveal as="h2">Về mình</SplitReveal>
          </div>
          <ScrollReveal className="about" stagger={0.15}>
            <div className="about-card">
              <div><span>Vai trò</span><span>Unity Developer</span></div>
              <div><span>Mảng chính</span><span>Mobile games</span></div>
              <div><span>Thế mạnh</span><span>Gameplay + Shader</span></div>
              <div><span>Domain</span><span>rydlands.com</span></div>
            </div>
            <div>
              <p className="pull">
                Ở Unity URP, mình đi từ gameplay logic bằng C# đến tự viết shader
                ShaderLab/HLSL cho hiệu ứng riêng — chất lỏng nhiều lớp, shimmer sự kiện.
              </p>
              <p>
                Ngoài phần gameplay, mình trực tiếp làm luôn <strong>tích hợp quảng cáo
                native</strong> (AppLovin MAX mediation) trên cả Android và iOS, và từng debug
                một ca ANR khó do WebView ad creative chặn RenderThread của Unity.
              </p>
              <p>
                Cách làm việc: code gọn, comment tiếng Anh rõ ràng, ưu tiên giải pháp
                production-ready hơn là demo minh hoạ dài dòng.
              </p>
            </div>
          </ScrollReveal>
        </section>

        <section id="contact" className="container section">
          <ScrollReveal>
            <div className="contact-panel">
              <h2>Có dự án cần một Unity dev chỉn chu?</h2>
              <p>Trả lời trong vòng 24h. Nhận cả dự án freelance ngắn hạn và hợp tác dài hạn.</p>
              <div className="contact-links">
                <MagneticButton href="mailto:hello@rydlands.com" className="btn btn-primary">
                  hello@rydlands.com
                </MagneticButton>
                <MagneticButton href="#" className="btn btn-ghost">GitHub</MagneticButton>
                <MagneticButton href="#" className="btn btn-ghost">LinkedIn</MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} rydlands.com</span>
          <span>built with Next.js · Three.js · GSAP</span>
        </div>
      </footer>
    </>
  );
}
