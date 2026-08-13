import { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

interface HeroSlideshowProps {
  images: string[];
}

const Page = forwardRef<HTMLDivElement, { src: string }>(({ src }, ref) => (
  <div ref={ref} className="relative h-full w-full overflow-hidden bg-brown">
    <img
      src={src}
      alt="Momento do casal"
      className="h-full w-full object-cover"
      draggable={false}
    />
  </div>
));
Page.displayName = "HeroSlideshowPage";

export function HeroSlideshow({ images }: HeroSlideshowProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const measure = () => {
      const { offsetWidth: width, offsetHeight: height } = el;
      if (width > 0 && height > 0) {
        setSize({ width, height });
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (images.length === 0) return null;

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full overflow-hidden rounded-[36px] shadow-xl"
    >
      {size && (
        <HTMLFlipBook
          key={`${size.width}x${size.height}`}
          className="hero-flipbook"
          style={{}}
          size="stretch"
          width={size.width}
          height={size.height}
          minWidth={size.width}
          minHeight={size.height}
          maxWidth={Math.max(size.width, 2000)}
          maxHeight={Math.max(size.height, 1400)}
          startPage={0}
          drawShadow
          flippingTime={800}
          usePortrait
          startZIndex={10}
          autoSize={false}
          maxShadowOpacity={0.6}
          showCover={false}
          mobileScrollSupport={false}
          clickEventForward
          useMouseEvents
          swipeDistance={10}
          showPageCorners
          disableFlipByClick={false}
          renderOnlyPageLengthChange={false}
        >
          {images.map((src) => (
            <Page key={src} src={src} />
          ))}
        </HTMLFlipBook>
      )}

      {images.length > 1 && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-offwhite/80 drop-shadow">
          Arraste para ver mais fotos
        </div>
      )}
    </div>
  );
}
