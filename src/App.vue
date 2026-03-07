<script lang="ts" setup>
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import HeroSection from './components/HeroSection.vue';
import FirstSection from './components/FirstSection.vue';
import SecondSection from './components/SecondSection.vue';
import CardSection from './components/CardSection.vue';
import ExitSection from './components/ExitSection.vue';

const mainRef = useTemplateRef('main-ref');
const proxyRef = useTemplateRef('proxy-ref');
const neutralPoint = 1000;
const threshold = 30;
const transitionDurationMs = 1500;
const keyScrollDelta = 180;
let sections: Element[] | null = null;
let currentIndex = 0;
let isScrolling = false;
let touchClientY: number | null = null;
let scrollTimeout: number | null = null;

function getMainElement(): HTMLElement {
  if (!mainRef.value) {
    throw new Error('Main Ref unavailable');
  }
  return mainRef.value;
}

function getProxyElement(): HTMLDivElement {
  if (!proxyRef.value) {
    throw new Error('Proxy Ref unavailable');
  }
  return proxyRef.value;
}

function getSections(): Element[] {
  if (!sections) {
    throw new Error('Sections unavailable');
  }
  return sections;
}

function resetProxyScrollPosition(): void {
  getProxyElement().scrollTop = neutralPoint;
}

function queueProxyScroll(delta: number): void {
  getProxyElement().scrollTop += delta;
}

function clearScrollTimeout(): void {
  if (scrollTimeout === null) {
    return;
  }

  window.clearTimeout(scrollTimeout);
  scrollTimeout = null;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    target.closest('button, a, input, select, textarea, [contenteditable="true"]') !== null
  );
}

function handleScroll(): void {
  const proxy = getProxyElement();
  const availableSections = getSections();

  if (isScrolling) {
    resetProxyScrollPosition();
    return;
  }

  const currentScroll = proxy.scrollTop;
  const delta = currentScroll - neutralPoint;

  if (Math.abs(delta) < threshold) {
    return;
  }

  const direction = delta > 0 ? 1 : -1;
  const nextIndex = currentIndex + direction;

  if (nextIndex >= 0 && nextIndex < availableSections.length) {
    performMove(nextIndex);
  }

  resetProxyScrollPosition();
}

function performMove(index: number): void {
  isScrolling = true;
  currentIndex = index;
  getMainElement().style.transform = `translateY(-${currentIndex * 100}dvh)`;
  clearScrollTimeout();
  scrollTimeout = window.setTimeout(() => {
    isScrolling = false;
    scrollTimeout = null;
  }, transitionDurationMs);
}

function handleWheel(event: WheelEvent): void {
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
    return;
  }

  event.preventDefault();
  queueProxyScroll(event.deltaY);
}

function handleKeydown(event: KeyboardEvent): void {
  if (isInteractiveTarget(event.target)) {
    return;
  }

  const deltaByKey: Partial<Record<KeyboardEvent['key'], number>> = {
    ArrowDown: keyScrollDelta,
    ArrowUp: -keyScrollDelta,
    PageDown: keyScrollDelta * 2,
    PageUp: -keyScrollDelta * 2
  };
  const delta = deltaByKey[event.key];

  if (delta === undefined) {
    return;
  }

  event.preventDefault();
  queueProxyScroll(delta);
}

function handleTouchStart(event: TouchEvent): void {
  const touch = event.touches[0];

  if (!touch) {
    touchClientY = null;
    return;
  }

  touchClientY = touch.clientY;
}

function handleTouchMove(event: TouchEvent): void {
  const touch = event.touches[0];

  if (!touch || touchClientY === null) {
    return;
  }

  const delta = touchClientY - touch.clientY;

  if (Math.abs(delta) < 4) {
    return;
  }

  event.preventDefault();
  touchClientY = touch.clientY;
  queueProxyScroll(delta * 3);
}

function clearTouchTracking(): void {
  touchClientY = null;
}

onMounted(() => {
  sections = Array.from(getMainElement().querySelectorAll('section'));
  resetProxyScrollPosition();
  getProxyElement().addEventListener('scroll', handleScroll);
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', clearTouchTracking);
  window.addEventListener('touchcancel', clearTouchTracking);
});

onUnmounted(() => {
  clearScrollTimeout();
  proxyRef.value?.removeEventListener('scroll', handleScroll);
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', clearTouchTracking);
  window.removeEventListener('touchcancel', clearTouchTracking);
});
</script>

<template>
  <main ref="main-ref">
    <HeroSection />
    <FirstSection />
    <SecondSection />
    <CardSection />
    <ExitSection />
  </main>

  <div class="scroll-proxy" ref="proxy-ref" aria-hidden="true">
    <div class="filler"></div>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  scrollbar-width: none;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    display: none;
  }
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100dvw;
  min-height: 100dvh;
  background-color: black;
  color: #f5f5f5;
  overflow: hidden;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto;
  transition: transform 1.5s cubic-bezier(0.65, 0, 0.35, 1);
  will-change: transform;
}

.scroll-proxy {
  position: fixed;
  inset: 0;
  overflow-y: auto;
  z-index: 0;
  opacity: 0;
  pointer-events: none;
  overscroll-behavior: none;

  .filler {
    height: 4000px;
  }
}

section {
  position: relative;
  isolation: isolate;
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;

  .image {
    max-height: 75%;
    max-width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 0;
    box-shadow: 0 0 4rem 1.25rem var(--color-theme);
    -webkit-box-shadow: 0 0 4rem 1.25rem var(--color-theme);
    -moz-box-shadow: 0 0 4rem 1.25rem var(--color-theme);
  }

  .decoration {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    transform-style: preserve-3d;
    perspective: 20rem;
  }
}

@keyframes sway {
  0% {
    transform: rotateX(var(--rotate-x)) rotateZ(-12deg) rotateY(-4deg);
  }

  100% {
    transform: rotateX(var(--rotate-x)) rotateZ(12deg) rotateY(4deg);
  }
}
</style>
