<script lang="ts" setup>
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { renderSpotlights } from './decorationShared';

const imageRef = useTemplateRef('img-ref');
const decorationRef = useTemplateRef('decoration-ref');

function handleImageLoad(): void {
  renderSpotlights(imageRef, decorationRef);
}

function handleResize(): void {
  handleImageLoad();
}

onMounted(() => {
  if (imageRef.value?.complete) {
    handleImageLoad();
  }

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <section style="--color-theme: #0356ec; --color-alt: #ddf2ff">
    <img
      src="https://cdn.hsieh-dev.us.ci/photos/unlockture-card.webp"
      alt="Thanks card"
      class="image"
      loading="lazy"
      decoding="async"
      ref="img-ref"
      @load="handleImageLoad"
    />
    <div class="decoration" ref="decoration-ref"></div>
  </section>
</template>

<style lang="scss" scoped>
$beam-width: 3.4rem;
$half-width: 1.7rem;
$spotlight-size: 5rem;

:deep(.decoration) {
  :nth-child(odd) .pane {
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.9) 0%,
      var(--color-theme) 15%,
      transparent 90%
    );
    box-shadow: 0 0 30px var(--color-theme);
  }

  :nth-child(even) .pane {
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.9) 0%,
      var(--color-alt) 15%,
      transparent 90%
    );
    box-shadow: 0 0 30px var(--color-alt);
  }
}

:deep(.spotlight) {
  position: absolute;
  margin-top: calc($spotlight-size * -0.5);
  margin-left: calc($spotlight-size * -0.5);
  transform-origin: center center;
  transform-style: preserve-3d;
  width: $spotlight-size;
  height: $spotlight-size;
  overflow: visible;
  animation: sway 2s ease-in-out infinite var(--anim-dir, alternate);

  .pane {
    position: absolute;
    left: calc(50% - #{$half-width});
    top: 50%;
    width: $beam-width;
    height: 50dvh;
    max-height: 3rem;
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
    filter: blur(4px);
    mix-blend-mode: screen;
    transform-origin: 50% 0%;

    &.rear {
      transform: rotateY(45deg);
    }

    &.left {
      transform: rotateY(90deg);
    }

    &.right {
      transform: rotateY(135deg);
    }

    @media (min-width: 1024px) {
      max-height: 16rem;
    }
  }
}
</style>
