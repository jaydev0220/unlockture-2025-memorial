<script lang="ts" setup>
import { createRandomPercent, createRotationStyle } from './decorationShared';
import type { DecorationRotationStyle } from './decorationShared';

interface LanternSeed {
  readonly id: string;
  readonly topRange: readonly [number, number];
  readonly leftRange: readonly [number, number];
  readonly size: string;
  readonly height: string;
  readonly rotationIndex: number;
}

type LanternStyle = DecorationRotationStyle & {
  '--lantern-top': string;
  '--lantern-left': string;
  '--lantern-size': string;
  '--lantern-height': string;
};

interface LanternDecoration extends LanternSeed {
  readonly style: LanternStyle;
}

const lanternFaces = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const;
type LanternFace = (typeof lanternFaces)[number];
const sharedLanternSize = 'clamp(3rem, 5vw, 4.5rem)';
const sharedLanternHeight = 'clamp(5.4rem, 6.8vw, 6.2rem)';
const lanternSeeds = [
  {
    id: 'lantern-a',
    topRange: [16, 22],
    leftRange: [18, 26],
    size: sharedLanternSize,
    height: sharedLanternHeight,
    rotationIndex: 0
  },
  {
    id: 'lantern-c',
    topRange: [17, 24],
    leftRange: [76, 84],
    size: sharedLanternSize,
    height: sharedLanternHeight,
    rotationIndex: 2
  },
  {
    id: 'lantern-d',
    topRange: [42, 50],
    leftRange: [10, 16],
    size: sharedLanternSize,
    height: sharedLanternHeight,
    rotationIndex: 3
  },
  {
    id: 'lantern-e',
    topRange: [44, 52],
    leftRange: [84, 90],
    size: sharedLanternSize,
    height: sharedLanternHeight,
    rotationIndex: 4
  },
  {
    id: 'lantern-f',
    topRange: [78, 85],
    leftRange: [22, 30],
    size: sharedLanternSize,
    height: sharedLanternHeight,
    rotationIndex: 1
  },
  {
    id: 'lantern-g',
    topRange: [80, 87],
    leftRange: [72, 81],
    size: sharedLanternSize,
    height: sharedLanternHeight,
    rotationIndex: 0
  }
] satisfies readonly LanternSeed[];

function isLanternWallFace(face: LanternFace): boolean {
  return face !== 'top' && face !== 'bottom';
}

function createLanternDecorations(seeds: readonly LanternSeed[]): LanternDecoration[] {
  return seeds.map((seed) => ({
    ...seed,
    style: {
      '--lantern-top': createRandomPercent(seed.topRange),
      '--lantern-left': createRandomPercent(seed.leftRange),
      '--lantern-size': seed.size,
      '--lantern-height': seed.height,
      ...createRotationStyle(seed.rotationIndex, {
        rotateXJitter: 2.2,
        rotateYJitter: 3.1,
        rotateZJitter: 1.2
      })
    }
  }));
}

const lanterns = createLanternDecorations(lanternSeeds);
</script>

<template>
  <section style="--color-theme: #e00200">
    <img
      src="https://cdn.hsieh-dev.us.ci/photos/unlockture-second.webp"
      srcset="
        https://cdn.hsieh-dev.us.ci/photos/unlockture-second-medium.webp 332w,
        https://cdn.hsieh-dev.us.ci/photos/unlockture-second.webp        485w
      "
      sizes="(max-width: 1024px) 100dvw, 100dvw"
      alt="Second photo"
      class="image"
      loading="lazy"
      decoding="async"
    />
    <div class="decoration lantern-decoration" aria-hidden="true">
      <div v-for="lantern in lanterns" :key="lantern.id" class="lantern" :style="lantern.style">
        <div class="lantern-core">
          <div
            v-for="face in lanternFaces"
            :key="`${lantern.id}-${face}`"
            class="lantern-face"
            :class="[`lantern-face--${face}`, { 'lantern-face--wall': isLanternWallFace(face) }]"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.image {
  position: relative;
  z-index: 1;
}

.lantern-decoration {
  pointer-events: none;
  z-index: 0;
  overflow: visible;
  perspective: 52rem;
  perspective-origin: center center;
}

.lantern {
  position: absolute;
  top: var(--lantern-top);
  left: var(--lantern-left);
  width: var(--lantern-size);
  height: var(--lantern-height);
  overflow: visible;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
}

.lantern-core {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.lantern-face {
  position: absolute;
  inset: -0.125rem;
  overflow: hidden;
  backface-visibility: hidden;
  border: 0.125rem solid #3b0304;
}

.lantern-face--wall {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.4) 0%,
    #ffffec 20%,
    #ffffec 74%,
    rgba(255, 255, 236, 0.96) 100%
  );
  box-shadow:
    inset 0 0 1rem var(--color-theme),
    inset 0 0 1.55rem rgba(255, 255, 236, 0.9),
    0 0 1.5rem var(--color-theme),
    0 0 3rem rgba(255, 255, 236, 0.24);

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: inherit;
    pointer-events: none;
  }

  &::before {
    left: 10%;
    right: 10%;
    top: 16%;
    height: 0.125rem;
    border-radius: 0;
    background: #3b0304;
    box-shadow: 0 0 0.3rem rgba(255, 255, 236, 0.32);
  }

  &::after {
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.12) 0%,
      transparent 32%,
      transparent 100%
    );
    opacity: 0.55;
  }
}

.lantern-face--front,
.lantern-face--back {
  inset: -0.125rem;
}

.lantern-face--front {
  transform: translateZ(calc(var(--lantern-size) / 2));
}

.lantern-face--back {
  transform: rotateY(180deg) translateZ(calc(var(--lantern-size) / 2));
  opacity: 0.58;
}

.lantern-face--left,
.lantern-face--right {
  top: -0.125rem;
  bottom: -0.125rem;
  left: calc(50% - (var(--lantern-size) / 2) - 0.125rem);
  width: calc(var(--lantern-size) + 0.25rem);
}

.lantern-face--left {
  transform: rotateY(-90deg) translateZ(calc(var(--lantern-size) / 2));
}

.lantern-face--right {
  transform: rotateY(90deg) translateZ(calc(var(--lantern-size) / 2));
}

.lantern-face--top,
.lantern-face--bottom {
  left: 50%;
  width: calc(var(--lantern-size) + 0.25rem);
  top: calc(50% - (var(--lantern-size) / 2) - 0.125rem);
  height: calc(var(--lantern-size) + 0.25rem);
  margin-left: calc((var(--lantern-size) + 0.25rem) / -2);
  background: #3b0304;
  box-shadow:
    inset 0 0 0.4rem rgba(255, 255, 255, 0.16),
    inset 0 0 0.95rem rgba(123, 71, 29, 0.18);
}

.lantern-face--top {
  transform: rotateX(90deg) translateZ(calc(var(--lantern-height) / 2));
}

.lantern-face--bottom {
  transform: rotateX(-90deg) translateZ(calc(var(--lantern-height) / 2));
}
</style>
