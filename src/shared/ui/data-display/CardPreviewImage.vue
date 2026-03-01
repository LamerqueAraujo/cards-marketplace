<script setup lang="ts">
withDefaults(defineProps<{
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md'
})
</script>

<template>
  <div class="preview-image" :class="`preview-image--${size}`">
    <div class="preview-image__frame">
      <img v-if="imageUrl" :src="imageUrl" class="preview-image__img" alt="Imagem da carta" />
      <div v-else class="preview-image__placeholder" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.preview-image {
  width: 100%;
  display: flex;
  justify-content: center;
}

.preview-image__frame {
  width: var(--preview-card-width);
  aspect-ratio: 421 / 614;

  border-radius: var(--radius-lg);
  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);

  box-shadow:
    0 26px 70px rgba(0, 0, 0, 0.85),
    0 0 0 1px rgba(255, 255, 255, 0.04);

  transition:
    transform 220ms var(--ease-smooth),
    box-shadow 220ms var(--ease-smooth),
    border-color 220ms var(--ease-smooth);
}

.preview-image__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.preview-image__placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.04);
}

.preview-image__frame:hover {
  transform: translateY(-2px) scale(1.02);
  border-color: rgba(139, 92, 246, 0.35);
  box-shadow:
    0 32px 80px rgba(0, 0, 0, 0.88),
    0 0 22px rgba(139, 92, 246, 0.18);
}

.preview-image--sm {
  --preview-card-width: 220px;
}

.preview-image--md {
  --preview-card-width: 260px;
}

.preview-image--lg {
  --preview-card-width: 300px;
}

@media (prefers-reduced-motion: reduce) {
  .preview-image__frame {
    transition: none;
  }

  .preview-image__frame:hover {
    transform: none;
  }
}
</style>
