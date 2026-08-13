import { useEffect, useState } from "react";
import { Hero } from "../components/landing/Hero";
import { Gallery } from "../components/landing/Gallery";
import { fetchGallery, commentOnPhoto, downloadPhoto, likePhoto, unlikePhoto } from "../api/gallery";
import { useGuestAuth } from "../context/GuestAuthContext";
import { usePublicSettings } from "../layouts/PublicLayout";
import type { Photo } from "../types";

export function HomePage() {
  const settings = usePublicSettings();
  const { ensureIdentified } = useGuestAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    fetchGallery().then(setPhotos);
  }, []);

  /** false quando o convidado fecha o modal sem se identificar. */
  const identify = async () => {
    try {
      await ensureIdentified();
      return true;
    } catch {
      return false;
    }
  };

  const handleToggleLike = async (photo: Photo) => {
    if (!(await identify())) return;

    const wasLiked = photo.liked_by_me;
    setPhotos((current) =>
      current.map((item) =>
        item.id === photo.id
          ? {
              ...item,
              liked_by_me: !wasLiked,
              likes_count: wasLiked ? item.likes_count - 1 : item.likes_count + 1,
            }
          : item,
      ),
    );

    try {
      const result = wasLiked
        ? await unlikePhoto(photo.id)
        : await likePhoto(photo.id);

      setPhotos((current) =>
        current.map((item) =>
          item.id === photo.id
            ? { ...item, likes_count: result.likes_count }
            : item,
        ),
      );
    } catch {
      setPhotos((current) =>
        current.map((item) => (item.id === photo.id ? photo : item)),
      );
    }
  };

  const handleDownload = async (photo: Photo) => {
    if (!(await identify())) return;
    await downloadPhoto(photo.id);
  };

  const handleComment = async (photo: Photo, body: string) => {
    if (!(await identify())) return;
    const comment = await commentOnPhoto(photo.id, body);
    setPhotos((current) =>
      current.map((item) =>
        item.id === photo.id
          ? { ...item, comments: [...item.comments, comment] }
          : item,
      ),
    );
  };

  const heroImages = [
    settings.hero_image_url,
    ...photos.map((photo) => photo.url),
  ].filter((url): url is string => Boolean(url));

  return (
    <>
      <Hero settings={settings} images={heroImages} />
      <Gallery
        photos={photos}
        onToggleLike={handleToggleLike}
        onDownload={handleDownload}
        onComment={handleComment}
      />
    </>
  );
}
