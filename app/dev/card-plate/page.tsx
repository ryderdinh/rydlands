import { notFound } from "next/navigation";
import CardPlateEditorPage from "@/components/CardPlateEditorPage";

// A standalone host for the card, outside HeroPinned's scroll/scene machinery, so
// hand-shaping a ribbon in CardPlateEditor doesn't need scrolling into scene two (and
// re-triggering its entrance) every time you reload. Dev only: process.env.NODE_ENV is
// inlined at build time, so `notFound()` here bakes a static 404 for this route into
// `pnpm build`'s output — the page (and its editor) only exists under `pnpm dev`.
export default function CardPlateDevPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <CardPlateEditorPage />;
}
