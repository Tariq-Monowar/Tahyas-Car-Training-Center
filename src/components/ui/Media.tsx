import Image from "next/image";
import { Illustration, type SceneName } from "@/components/illustrations/Scenes";
import { realPhoto } from "@/lib/photos";

type Props = {
  slot: SceneName;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Keep the subject inside the crop, e.g. "center 70%". */
  objectPosition?: string;
};

/**
 * Shows the owner's real photo for this slot (public/images/real/<slot>.jpg) when it exists,
 * otherwise the matching hand-drawn illustration. Fill the parent box (parent must be position:relative).
 */
export function Media({ slot, alt, sizes, priority, className, objectPosition }: Props) {
  const photo = realPhoto(slot);
  if (photo) {
    return (
      <Image
        src={photo.src} alt={alt} fill sizes={sizes} quality={72} className={className}
        style={objectPosition ? { objectPosition } : undefined}
        priority={priority} fetchPriority={priority ? "high" : undefined}
      />
    );
  }
  return (
    <div className={className} style={{ position: "absolute", inset: 0 }}>
      <Illustration name={slot} />
    </div>
  );
}
