import { Invite } from "../components/landing/Invite";
import { Location } from "../components/landing/Location";
import { usePublicSettings } from "../layouts/PublicLayout";

export function LocationPage() {
  const settings = usePublicSettings();

  return (
    <>
      <Invite settings={settings} />
      <Location settings={settings} />
    </>
  );
}
