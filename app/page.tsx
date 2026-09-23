import HeroPinned from "@/components/HeroPinned";

const skillsRingItems = ["Unity", "Shader", "Animation", "Game Architecture"];

// One full-screen scene for now: the hero poster, which contracts to the left
// half of the screen on scroll (see HeroPinned.tsx). The other sections
// (projects, skills, about, contact), the nav and the footer are pulled until
// there's a direction for them — the page is exactly one pinned transition
// tall, nothing scrolls past it.
export default function Home() {
  return (
    <main>
      <HeroPinned
        skillsItems={skillsRingItems}
        copy={
          // Agent-reveal poster composition: character centered, name only as
          // the vertical edge lockups (see HeroPinned.tsx). The page still
          // needs exactly one <h1> for accessibility/SEO, so it stays in the
          // DOM, visually hidden.
          <h1 className="sr-only">Gameplay that ships. Shaders I write myself.</h1>
        }
      />
    </main>
  );
}
