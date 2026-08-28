import type { MapBounds } from 'nim'

/**
 * Stand-in tiles for the gallery: a drawn street grid, not a map.
 *
 * The kit ships no tile provider and the gallery has no network, so the map
 * specimens need a picture to put in the frame. A real product passes its own
 * `<img>` or map component here — that is the whole point of the slot.
 *
 * Demo fixture. Nothing here ships in `dist/`.
 */
export const TEHRAN: MapBounds = { east: 51.44, north: 35.75, south: 35.69, west: 51.36 }

export function MapTiles() {
  return (
    <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 320 200">
      <rect fill="var(--nim-canvas-sunken)" height="200" width="320" />
      {/* Blocks */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((column) => (
          <rect
            fill="var(--nim-surface-muted)"
            height="36"
            key={`${row}-${column}`}
            rx="2"
            width="52"
            x={column * 64 + 6}
            y={row * 50 + 8}
          />
        )),
      )}
      {/* Streets */}
      {[0, 1, 2, 3, 4].map((column) => (
        <rect fill="var(--nim-canvas)" height="200" key={column} width="10" x={column * 64 + 58} />
      ))}
      {[0, 1, 2, 3].map((row) => (
        <rect fill="var(--nim-canvas)" height="12" key={row} width="320" y={row * 50 + 44} />
      ))}
      {/* A river, so the picture is not a pure grid */}
      <path
        d="M0 168 C 60 150, 110 186, 170 164 S 270 140, 320 158"
        fill="none"
        stroke="var(--nim-info)"
        strokeOpacity="0.5"
        strokeWidth="10"
      />
    </svg>
  )
}
