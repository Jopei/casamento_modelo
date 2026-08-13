import { useEffect, useState } from "react";
import { Welcome } from "../components/landing/Welcome";
import { Story } from "../components/landing/Story";
import { fetchStory } from "../api/story";
import { usePublicSettings } from "../layouts/PublicLayout";
import type { StoryItem } from "../types";

export function StoryPage() {
  const settings = usePublicSettings();
  const [story, setStory] = useState<StoryItem[]>([]);

  useEffect(() => {
    fetchStory().then(setStory);
  }, []);

  return (
    <>
      <Welcome settings={settings} />
      <Story items={story} />
    </>
  );
}
