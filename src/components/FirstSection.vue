<script lang="ts" setup>
import { createPulseStyle, createRotationStyle } from './decorationShared';
import type { DecorationPulseStyle, DecorationRotationStyle } from './decorationShared';

interface CubeSeed {
  readonly id: string;
  readonly top: string;
  readonly left: string;
  readonly size: string;
  readonly color: string;
  readonly rotationIndex: number;
}

type CubeStyle = DecorationPulseStyle &
  DecorationRotationStyle & {
    '--cube-size': string;
    '--cube-top': string;
    '--cube-left': string;
    '--cube-color': string;
  };

interface CubeDecoration extends CubeSeed {
  readonly style: CubeStyle;
}

const cubeFaces = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const;
const cubeSeeds = [
  {
    id: 'top-left',
    top: '18%',
    left: '18%',
    size: 'clamp(3.45rem, 6vw, 5.25rem)',
    color: 'var(--color-theme)',
    rotationIndex: 0
  },
  {
    id: 'top-right',
    top: '15%',
    left: '80%',
    size: 'clamp(3.05rem, 5vw, 4.7rem)',
    color: '#0356ec',
    rotationIndex: 1
  },
  {
    id: 'middle-left',
    top: '50%',
    left: '13%',
    size: 'clamp(3rem, 5.2vw, 4.45rem)',
    color: '#cf2200',
    rotationIndex: 2
  },
  {
    id: 'bottom-right',
    top: '82%',
    left: '84%',
    size: 'clamp(3.3rem, 5.5vw, 5rem)',
    color: 'var(--color-theme)',
    rotationIndex: 3
  },
  {
    id: 'bottom-left',
    top: '86%',
    left: '24%',
    size: 'clamp(3rem, 5vw, 4.35rem)',
    color: '#0356ec',
    rotationIndex: 4
  }
] satisfies readonly CubeSeed[];

function createCubeDecorations(seeds: readonly CubeSeed[]): CubeDecoration[] {
  return seeds.map((seed) => ({
    ...seed,
    style: {
      '--cube-size': seed.size,
      '--cube-top': seed.top,
      '--cube-left': seed.left,
      '--cube-color': seed.color,
      ...createRotationStyle(seed.rotationIndex, {
        rotateXJitter: 2.5,
        rotateYJitter: 3.5,
        rotateZJitter: 1.5
      }),
      ...createPulseStyle([4.4, 6.2], [-3.2, -0.4])
    }
  }));
}

const cubes = createCubeDecorations(cubeSeeds);
</script>

<template>
  <section style="--color-theme: #ddf2ff">
    <img
      src="https://cdn.hsieh-dev.us.ci/photos/unlockture-first.webp"
      alt="First photo"
      class="image"
      loading="lazy"
      decoding="async"
    />
    <div class="decoration cube-decoration" aria-hidden="true">
      <div v-for="cube in cubes" :key="cube.id" class="cube" :style="cube.style">
        <div class="cube-core">
          <div
            v-for="face in cubeFaces"
            :key="`${cube.id}-${face}`"
            class="cube-face"
            :class="`cube-face--${face}`"
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

.cube-decoration {
  pointer-events: none;
  z-index: 0;
  overflow: visible;
  perspective: 52rem;
  perspective-origin: center center;
}

.cube {
  position: absolute;
  top: var(--cube-top);
  left: var(--cube-left);
  width: var(--cube-size);
  height: var(--cube-size);
  overflow: visible;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
  mix-blend-mode: screen;
  animation: cube-fade var(--pulse-duration) ease-in-out infinite;
  animation-delay: var(--pulse-delay);

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &::before {
    inset: -10%;
    border-radius: clamp(1rem, 24%, 1.5rem);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.16) 0%,
      rgba(255, 255, 255, 0.05) 30%,
      transparent 66%
    );
    filter: blur(0.16rem);
    opacity: 0.52;
  }

  &::after {
    inset: -28%;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.22) 0%,
      var(--cube-color) 34%,
      transparent 78%
    );
    transform: translateZ(-0.9rem);
    filter: blur(1rem);
    opacity: 0.56;
  }
}

.cube-core {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: rotateX(var(--rotation-x)) rotateY(var(--rotation-y)) rotateZ(var(--rotation-z));
}

.cube-face {
  position: absolute;
  inset: -0.05rem;
  overflow: hidden;
  border-radius: clamp(0.95rem, 24%, 1.45rem);
  backface-visibility: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  outline: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow:
    inset 0 0 0.9rem rgba(255, 255, 255, 0.14),
    inset 0 0 1.45rem rgba(255, 255, 255, 0.12),
    0 0 0.9rem rgba(255, 255, 255, 0.06),
    0 0 1.1rem var(--cube-color);

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: inherit;
    pointer-events: none;
  }

  &::before {
    inset: 5%;
    border: 1px solid rgba(255, 255, 255, 0.09);
    filter: blur(0.12rem);
    opacity: 0.72;
  }

  &::after {
    inset: 0;
    background: radial-gradient(circle at 50% 52%, transparent 54%, rgba(255, 255, 255, 0.14) 100%);
    filter: blur(0.22rem);
    opacity: 0.5;
  }
}

.cube-face--front,
.cube-face--back {
  background:
    radial-gradient(
      circle at 30% 24%,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(255, 255, 255, 0.38) 18%,
      transparent 42%
    ),
    linear-gradient(
      148deg,
      rgba(255, 255, 255, 0.22) 0%,
      var(--cube-color) 24%,
      var(--cube-color) 76%,
      rgba(2, 8, 24, 0.9) 100%
    );
}

.cube-face--front {
  transform: translateZ(calc(var(--cube-size) / 2));
  box-shadow:
    inset 0 0 1.25rem rgba(255, 255, 255, 0.2),
    0 0 1.5rem rgba(255, 255, 255, 0.08),
    0 0 1.15rem var(--cube-color);
}

.cube-face--back {
  transform: rotateY(180deg) translateZ(calc(var(--cube-size) / 2));
  opacity: 0.34;
  background: linear-gradient(
    155deg,
    rgba(255, 255, 255, 0.06) 0%,
    var(--cube-color) 20%,
    rgba(4, 10, 26, 0.97) 100%
  );
}

.cube-face--left,
.cube-face--right {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.13) 0%, transparent 32%),
    linear-gradient(
      132deg,
      rgba(255, 255, 255, 0.08) 0%,
      var(--cube-color) 28%,
      rgba(2, 8, 24, 0.94) 100%
    );
  opacity: 0.82;
}

.cube-face--left {
  transform: rotateY(-90deg) translateZ(calc(var(--cube-size) / 2));
}

.cube-face--right {
  transform: rotateY(90deg) translateZ(calc(var(--cube-size) / 2));
}

.cube-face--top,
.cube-face--bottom {
  background:
    radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.34) 0%, transparent 48%),
    linear-gradient(
      140deg,
      rgba(255, 255, 255, 0.16) 0%,
      var(--cube-color) 28%,
      rgba(2, 8, 24, 0.92) 100%
    );
}

.cube-face--top {
  transform: rotateX(90deg) translateZ(calc(var(--cube-size) / 2));
  opacity: 0.9;
}

.cube-face--bottom {
  transform: rotateX(-90deg) translateZ(calc(var(--cube-size) / 2));
  opacity: 0.5;
  background:
    radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.14) 0%, transparent 42%),
    linear-gradient(
      140deg,
      rgba(255, 255, 255, 0.07) 0%,
      var(--cube-color) 22%,
      rgba(2, 8, 24, 0.96) 100%
    );
}

@keyframes cube-fade {
  0%,
  100% {
    opacity: 0.46;
    filter: saturate(1.08) brightness(0.94) drop-shadow(0 0 0.85rem var(--cube-color))
      drop-shadow(0 0 2rem var(--cube-color));
  }

  50% {
    opacity: 1;
    filter: saturate(1.3) brightness(1.15) drop-shadow(0 0 1.3rem var(--cube-color))
      drop-shadow(0 0 3rem var(--cube-color));
  }
}

@media (max-width: 900px) {
  .cube-face {
    border-radius: 1rem;
  }
}
</style>
