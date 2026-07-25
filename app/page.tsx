import HeroIntro from "@/components/HeroIntro";
import ScrollReveal from "@/components/ScrollReveal";
import Marquee from "@/components/Marquee";
import MagneticButton from "@/components/MagneticButton";
import TiltCard from "@/components/TiltCard";
import ProjectVessel, { type VesselType } from "@/components/ProjectVessel";

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
  },
  {
    title: "Rendering & Shader",
    tags: ["ShaderLab", "HLSL", "URP Custom Shaders", "SpriteMask & Stencil", "Post-processing"],
  },
  {
    title: "Tooling & Workflow",
    tags: ["Odin Inspector", "Easy Save 3", "Spine-Unity", "Editor Tooling", "Obi Rope"],
  },
  {
    title: "Native & Monetization",
    tags: ["AppLovin MAX", "Android / iOS Native Bridge", "ANR & Performance Profiling", "Objective-C"],
  },
];

const projects: {
  tag: string;
  title: string;
  desc: string;
  stack: string[];
  vessel: { type: VesselType; layers: { h: number; c: string }[]; pulse?: boolean; shimmer?: boolean };
}[] = [
  {
    tag: "Puzzle Game · Shader",
    title: "Water Sort Puzzle Color Master",
    desc: "Xây dựng shader chất lỏng nhiều lớp cho chai nước (URP/HLSL): mặt cong meniscus, nghiêng chai theo góc thực (tan), preview WebGL đồng bộ với bản Unity.",
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
    desc: "Thiết kế shader shine/shimmer cho URP, cùng chuỗi animation scale + đếm số tuần tự dùng UniTask và CancellationTokenSource, đồng bộ âm thanh qua AudioController.",
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
    desc: "Xây hệ thống quảng cáo interstitial nhiều tầng bid floor bằng Objective-C, mở rộng từ 2 lên 9 đơn vị quảng cáo, cấu hình linh hoạt qua Info.plist.",
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
            <li><a href="#projects">Dự án</a></li>
            <li><a href="#skills">Kỹ năng</a></li>
            <li><a href="#about">Giới thiệu</a></li>
            <li><a href="#contact">Liên hệ</a></li>
          </ul>
        </div>
      </nav>

      <Marquee items={marqueeItems} />

      <main id="top">
        <section className="hero-wrap">
          <span className="hero-watermark" aria-hidden="true">RYDER</span>
          <div className="container hero">
            <HeroIntro>
              <p className="eyebrow">unity game developer · mobile</p>
              <h1>
                Biến gameplay thành <span className="accent">chuyển động mượt</span> và mãn nhãn.
              </h1>
              <p>
                Mình là Ryder — lập trình game Unity tập trung vào mobile: từ gameplay logic,
                shader URP/HLSL, cho đến tối ưu hiệu năng và tích hợp quảng cáo ở tầng native.
                Đang tìm cơ hội freelance hoặc full-time cho các dự án cần độ chỉn chu về kỹ thuật.
              </p>
              <div className="cta-row">
                <MagneticButton href="#projects" className="btn btn-primary">
                  Xem dự án
                </MagneticButton>
                <MagneticButton href="#contact" className="btn btn-ghost">
                  Liên hệ hợp tác
                </MagneticButton>
              </div>
            </HeroIntro>
          </div>
        </section>

        <section id="skills" className="container section">
          <div className="section-head">
            <p className="eyebrow">bộ công cụ</p>
            <h2>Kỹ năng & công cụ làm việc</h2>
          </div>
          <ScrollReveal className="skill-groups">
            {skillGroups.map((g, i) => (
              <TiltCard as="div" className="skill-card" key={g.title} maxTilt={7} glare>
                <span className="skill-index">{String(i + 1).padStart(2, "0")}</span>
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

        <section id="projects" className="container section">
          <div className="section-head">
            <p className="eyebrow">đã triển khai</p>
            <h2>Dự án nổi bật</h2>
          </div>
          <ScrollReveal className="projects" stagger={0.06}>
            {projects.map((p, i) => (
              <div className="project-row" key={p.title}>
                <span className="project-index">{String(i + 1).padStart(2, "0")}</span>
                <div className="project-main">
                  <span className="project-tag">{p.tag}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="project-stack">
                    {p.stack.map((s) => (
                      <span className="chip" key={s}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="project-swatch">
                  <ProjectVessel type={p.vessel.type} layers={p.vessel.layers} pulse={p.vessel.pulse} shimmer={p.vessel.shimmer} />
                </div>
              </div>
            ))}
          </ScrollReveal>
        </section>

        <section id="about" className="container section about-section">
          <div className="about-porthole" aria-hidden="true" />
          <div className="section-head">
            <p className="eyebrow">giới thiệu</p>
            <h2>Về mình</h2>
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
                Mình làm việc chủ yếu trên Unity URP — từ gameplay logic bằng C#,
                đến shader ShaderLab/HLSL cho các hiệu ứng đặc thù như chất lỏng
                nhiều lớp hay shimmer sự kiện trong game.
              </p>
              <p>
                Ngoài gameplay, mình cũng trực tiếp xử lý phần <strong>tích hợp quảng cáo
                native</strong> (AppLovin MAX mediation) trên cả Android và iOS, cũng như
                debug các vấn đề hiệu năng khó như ANR do xung đột giữa WebView ad creative
                và RenderThread của Unity.
              </p>
              <p>
                Cách làm việc của mình: code gọn, comment tiếng Anh rõ ràng, ưu tiên giải
                pháp production-ready thay vì demo minh hoạ dài dòng.
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
