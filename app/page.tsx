import { ChatHero } from "@/components/chat/chat-hero";
import { SelectedWork } from "@/components/selected-work";

export default function HomePage() {
  return (
    <main id="content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
      <ChatHero />
      <SelectedWork />
    </main>
  );
}
