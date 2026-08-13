import { DressCode } from "../components/landing/DressCode";
import { usePublicSettings } from "../layouts/PublicLayout";

export function DressCodePage() {
  const settings = usePublicSettings();

  return <DressCode settings={settings} />;
}
