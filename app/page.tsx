import HeroIntro from "@/components/HeroIntro";
import HeroScope from "@/components/HeroScope";
import HeroPinned from "@/components/HeroPinned";
import PinnedScene from "@/components/PinnedScene";
import ScrollReveal from "@/components/ScrollReveal";
import SplitReveal from "@/components/SplitReveal";
import Marquee from "@/components/Marquee";
import MagneticButton from "@/components/MagneticButton";
import SiteNav from "@/components/SiteNav";
import SkillGrid from "@/components/SkillGrid";
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
    tag: "Puzzle game · Shader",
    title: "Water Sort Puzzle Color Master",
    desc: "A multi-layer liquid shader written in URP/HLSL: meniscus curvature at the surface, bottle tilt driven by the real tangent angle, and a WebGL preview kept in sync with the Unity build.",
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
    tag: "Live event · Animation",
    title: "WinStreakEvent1",
    desc: "A shine/shimmer URP shader paired with a sequential scale-and-count animation built on UniTask and CancellationTokenSource, synced to AudioController for the win-streak payoff.",
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
    desc: "Traced Google Play Console ANR logs back to a GPU fence stall caused by a WebView ad creative (Pangle/ByteDance) blocking Unity's RenderThread.",
    stack: ["Android", "Profiling", "AppLovin MAX"],
    vessel: {
      type: "orb",
      layers: [{ h: 100, c: "#ff6b6b" }],
      pulse: true,
    },
  },
  {
    tag: "Monetization system",
    title: "Bid Floor Interstitial (iOS)",
    desc: "A multi-tier bid-floor interstitial ad system built in Objective-C, expanded from 2 to 9 ad units and configured through Info.plist.",
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
      <SiteNav />
      <Marquee items={marqueeItems} />

      <main id="top">
        <HeroPinned
          copy={
            <HeroIntro>
              <div className="hero-wordmark" aria-hidden="true">RYDER</div>
              <div className="hero-copy">
                <SplitReveal as="h1">
                  Gameplay that ships. Shaders I write myself.
                </SplitReveal>
                <p>
                  Unity developer focused on mobile: C# gameplay systems, hand-written
                  URP/HLSL shaders for signature effects — multi-layer liquid materials,
                  event shimmer — and the parts most portfolios skip: native
                  ad-mediation integration on Android/iOS, and root-causing hard
                  performance bugs. Open to freelance engagements and full-time roles.
                </p>
                <div className="cta-row">
                  <MagneticButton href="#projects" className="btn btn-primary">
                    View case studies
                  </MagneticButton>
                  <MagneticButton href="#contact" className="btn btn-ghost">
                    Get in touch
                  </MagneticButton>
                </div>
              </div>
            </HeroIntro>
          }
          scope={<HeroScope />}
        />

        <ProjectGallery projects={projects} />

        <PinnedScene id="skills" className="container section">
          <ScrollReveal className="section-head" pinOwned>
            <h2>Tools I reach for daily</h2>
            <p className="section-sub">
              The stack behind the case studies above — gameplay, rendering, tooling,
              and the native/monetization layer.
            </p>
          </ScrollReveal>
          <SkillGrid groups={skillGroups} pinOwned />
        </PinnedScene>

        <PinnedScene id="about" className="container section about-section">
          <ScrollReveal focusPull stagger={0.18} pinOwned>
            <div className="section-head">
              <h2>About</h2>
            </div>
            <div className="about">
              <div className="about-card">
                <div><span>Role</span><span>Unity Developer</span></div>
                <div><span>Focus</span><span>Mobile games</span></div>
                <div><span>Core strength</span><span>Gameplay + shaders</span></div>
                <div><span>Domain</span><span>rydlands.com</span></div>
              </div>
              <div>
                <p className="pull">
                  In Unity URP, I go from gameplay logic in C# to hand-written
                  ShaderLab/HLSL for effects nobody else on the team can build —
                  multi-layer liquids, event shimmer.
                </p>
                <p>
                  Beyond gameplay, I own <strong>native ad-mediation integration</strong>{" "}
                  (AppLovin MAX) on both Android and iOS, and once root-caused a hard
                  ANR down to a WebView ad creative blocking Unity's RenderThread.
                </p>
                <p>
                  How I work: lean code, clear English comments, production-ready
                  solutions over long illustrative demos.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </PinnedScene>

        <PinnedScene id="contact" className="container section">
          <ScrollReveal focusPull pinOwned>
            <div className="contact-panel">
              <h2>Got a project that needs a careful Unity dev?</h2>
              <p>I reply within 24 hours. Open to short-term freelance work and longer full-time roles.</p>
              <div className="contact-links">
                <MagneticButton href="mailto:hello@rydlands.com" className="btn btn-primary">
                  hello@rydlands.com
                </MagneticButton>
                <MagneticButton href="#" className="btn btn-ghost">GitHub</MagneticButton>
                <MagneticButton href="#" className="btn btn-ghost">LinkedIn</MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        </PinnedScene>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} rydlands.com</span>
          <span>built with Next.js · Three.js · GSAP · Motion · anime.js</span>
        </div>
      </footer>
    </>
  );
}
