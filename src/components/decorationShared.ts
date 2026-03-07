import type { CSSProperties, useTemplateRef } from 'vue';

interface RotationPreset {
  readonly rotateX: number;
  readonly rotateY: number;
  readonly rotateZ: number;
}

interface RotationOptions {
  readonly rotateXJitter?: number;
  readonly rotateYJitter?: number;
  readonly rotateZJitter?: number;
}

export type DecorationRotationStyle = CSSProperties & {
  '--rotation-x': string;
  '--rotation-y': string;
  '--rotation-z': string;
};

export type DecorationPulseStyle = CSSProperties & {
  '--pulse-duration': string;
  '--pulse-delay': string;
};

const spotlightSides = ['front', 'rear', 'left', 'right'] as const;
const decorationRotationPresets = [
  { rotateX: -12, rotateY: 42, rotateZ: -2 },
  { rotateX: -10, rotateY: -44, rotateZ: 2 },
  { rotateX: 12, rotateY: 44, rotateZ: -1 },
  { rotateX: 10, rotateY: -42, rotateZ: 1 },
  { rotateX: 8, rotateY: 40, rotateZ: -2 }
] as const satisfies readonly RotationPreset[];

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function formatDegrees(value: number): string {
  return `${value.toFixed(1)}deg`;
}

function formatSeconds(value: number): string {
  return `${value.toFixed(2)}s`;
}

function createSpotlight(
  x: number,
  y: number,
  direction: 'up' | 'down',
  reverse: boolean = false,
  spotlightContainer: HTMLDivElement
) {
  const rotateX = direction === 'down' ? 0 : 180;
  const spotlight = document.createElement('div');
  const panes: HTMLDivElement[] = [];

  for (const side of spotlightSides) {
    const pane = document.createElement('div');

    pane.classList.add('pane', side);
    panes.push(pane);
  }

  spotlight.setAttribute(
    'style',
    `left:${x}px;top:${y}px;--rotate-x:${rotateX}deg;--anim-dir:${reverse ? 'alternate-reverse' : 'alternate'};`
  );
  spotlight.classList.add('spotlight');
  spotlight.append(...panes);
  spotlightContainer.appendChild(spotlight);
}

export function renderSpotlights(
  imageRef: ReturnType<typeof useTemplateRef<HTMLImageElement>>,
  decorationRef: ReturnType<typeof useTemplateRef<HTMLDivElement>>
) {
  const image = imageRef.value;
  const decoration = decorationRef.value;

  if (!image || !decoration) {
    return;
  }

  decoration.replaceChildren();

  const imageRect = image.getBoundingClientRect();
  const spotlightsRect = decoration.getBoundingClientRect();
  const left = imageRect.left - spotlightsRect.left;
  const right = imageRect.right - spotlightsRect.left;
  const top = imageRect.top - spotlightsRect.top;
  const bottom = imageRect.bottom - spotlightsRect.top;
  const quarterWidth = imageRect.width / 4;

  createSpotlight(left, top, 'down', true, decoration);
  createSpotlight(left + quarterWidth, top, 'down', true, decoration);
  createSpotlight(right - quarterWidth, top, 'down', false, decoration);
  createSpotlight(right, top, 'down', false, decoration);
  createSpotlight(right, bottom, 'up', false, decoration);
  createSpotlight(right - quarterWidth, bottom, 'up', false, decoration);
  createSpotlight(left + quarterWidth, bottom, 'up', true, decoration);
  createSpotlight(left, bottom, 'up', true, decoration);
}

export function createRotationStyle(
  presetIndex: number,
  options: RotationOptions = {}
): DecorationRotationStyle {
  const preset = decorationRotationPresets[presetIndex % decorationRotationPresets.length];

  if (!preset) {
    throw new Error(`Rotation preset unavailable for index ${presetIndex}`);
  }
  const { rotateXJitter = 0, rotateYJitter = 0, rotateZJitter = 0 } = options;
  return {
    '--rotation-x': formatDegrees(preset.rotateX + randomBetween(-rotateXJitter, rotateXJitter)),
    '--rotation-y': formatDegrees(preset.rotateY + randomBetween(-rotateYJitter, rotateYJitter)),
    '--rotation-z': formatDegrees(preset.rotateZ + randomBetween(-rotateZJitter, rotateZJitter))
  };
}

export function createPulseStyle(
  durationRange: readonly [number, number],
  delayRange: readonly [number, number]
): DecorationPulseStyle {
  const [minDuration, maxDuration] = durationRange;
  const [minDelay, maxDelay] = delayRange;
  return {
    '--pulse-duration': formatSeconds(randomBetween(minDuration, maxDuration)),
    '--pulse-delay': formatSeconds(randomBetween(minDelay, maxDelay))
  };
}

export function createRandomPercent(range: readonly [number, number]): string {
  const [min, max] = range;
  return `${randomBetween(min, max).toFixed(1)}%`;
}
