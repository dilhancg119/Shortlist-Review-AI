"use client";

import Image from "next/image";
import { useState } from "react";
import type { PhotoFocus } from "@/lib/companies";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * A team member's photo, loaded from the company's own site. Initials sit
 * underneath, so a missing or blocked photo still leaves a usable tile.
 *
 * Head-and-shoulders photos are simply cropped to the tile. A wider shot
 * passes `focus`, which zooms the photo and centres the tile on the face.
 */
export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => /^[A-Za-z]/.test(part))
    .map((part) => part[0])
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .join("")
    .toUpperCase();
}

export function Portrait({ src, name, focus }: { src?: string; name: string; focus?: PhotoFocus }) {
  const [failed, setFailed] = useState(false);
  const initials = initialsOf(name);

  return (
    <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-wash text-[0.8125rem] font-semibold tracking-wide text-ink-2">
      <span aria-hidden>{initials}</span>
      {src && !failed ? (
        focus ? (
          <FocusedPhoto src={src} focus={focus} onError={() => setFailed(true)} />
        ) : (
          <Image
            src={src}
            alt=""
            fill
            sizes="56px"
            className="object-cover object-[50%_22%]"
            onError={() => setFailed(true)}
          />
        )
      ) : null}
    </span>
  );
}

/**
 * The photo at reading size, for the profile dialog. Fills its parent, which
 * sets the frame; `frame` is that frame's width divided by its height. A wide
 * shot is zoomed half as far as its tile, so the person stays the subject.
 */
export function LargePhoto({
  src,
  focus,
  frame,
  onError,
}: {
  src: string;
  focus?: PhotoFocus;
  frame: number;
  onError: () => void;
}) {
  const sizes = "(max-width: 640px) 90vw, 384px";
  if (focus) {
    return (
      <FocusedPhoto
        src={src}
        focus={{ ...focus, zoom: Math.max(1, focus.zoom / 2) }}
        frame={frame}
        sizes={sizes}
        onError={onError}
      />
    );
  }
  return <Image src={src} alt="" fill sizes={sizes} className="object-cover object-[50%_22%]" onError={onError} />;
}

/** Scales the photo up and slides it so the face sits in the middle of the frame. */
function FocusedPhoto({
  src,
  focus,
  onError,
  frame = 1,
  sizes = "180px",
}: {
  src: string;
  focus: PhotoFocus;
  onError: () => void;
  /** Frame width divided by height. The tile is square. */
  frame?: number;
  sizes?: string;
}) {
  const ratio = focus.ratio ?? 3 / 4;
  // Sizes below are in frame widths: the frame is 1 wide and `tall` high.
  const tall = 1 / frame;
  const width = Math.max(focus.zoom, ratio / frame);
  const height = width / ratio;
  const left = clamp(0.5 - focus.x * width, 1 - width, 0);
  const top = clamp(tall / 2 - focus.y * height, tall - height, 0);

  return (
    <Image
      src={src}
      alt=""
      width={480}
      height={Math.round(480 / ratio)}
      sizes={sizes}
      onError={onError}
      style={{
        position: "absolute",
        maxWidth: "none",
        width: `${width * 100}%`,
        height: "auto",
        left: `${left * 100}%`,
        top: `${(top / tall) * 100}%`,
      }}
    />
  );
}
