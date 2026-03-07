<script lang="ts" setup>
function exit(): void {
  window.location.assign(import.meta.env.BASE_URL);
}
</script>

<template>
  <section style="--color-theme: #08e600">
    <div class="exit">
      <div id="notice">
        <img
          src="https://cdn.hsieh-dev.us.ci/icons/exit.svg"
          alt="Exit sign"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div id="door">
        <div class="door-frame">
          <button type="button" class="door-panel" @click="exit" aria-label="Exit"></button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.exit {
  width: 40%;
  max-width: 36rem;
  height: 90%;
  max-height: 52rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;

  #notice {
    width: 50%;
    filter: drop-shadow(0 0 2rem var(--color-theme));
  }

  #door {
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    .door-frame {
      width: 60%;
      height: 90%;
      border: 2px solid #111;
      border-bottom: none;
      background: #000;
      position: relative;
      perspective: 75rem;
    }

    .door-panel {
      appearance: none;
      cursor: pointer;
      width: 100%;
      height: 100%;
      background: #080808;
      padding: 0;
      border: 1px solid #1a1a1a;
      border-left: 2px solid #000;
      border-bottom: none;
      transform-origin: left;
      transition:
        transform 1.3s cubic-bezier(0.25, 1, 0.5, 1),
        box-shadow 1.3s ease;
      position: relative;
      z-index: 2;
    }

    &:hover {
      .door-panel {
        transform: rotateY(-18deg);
        box-shadow: 20px 0 40px -10px rgba(255, 250, 200, 0.6);
      }
    }
  }
}
</style>
