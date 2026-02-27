<script setup lang="ts">
import type { UserCard } from '../types/cards.types'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  card: UserCard | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const formattedDescription = computed(() => {
  if (!props.card?.description) return ''

  return props.card.description
    .replace(/\. (?=[A-Z])/g, '.\n\n')
})
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" transition-show="fade"
    transition-hide="fade">
    <div class="preview-wrapper">
      <div class="preview-card">

        <q-btn round dense icon="close" class="close-btn" @click="emit('update:modelValue', false)" />

        <div class="preview-image">
          <img :src="card?.imageUrl" :alt="card?.name" />
        </div>

        <div class="preview-info">

          <div class="title-block">
            <h2 class="card-title">
              {{ card?.name }}
            </h2>
            <div class="title-divider" />
          </div>

          <div class="description-wrapper">
            <div class="card-description">
              {{ formattedDescription }}
            </div>
          </div>

        </div>

      </div>
    </div>
  </q-dialog>
</template>

<style scoped lang="scss">
.preview-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.preview-card {
  position: relative;
  width: 1200px;
  max-height: 465px;
  max-width: 120vw;
  background: #121226;
  padding: 28px;
  display: flex;
  gap: 28px;
  box-shadow:
    0 40px 90px rgba(0, 0, 0, .9),
    inset 0 0 0 1px rgba(255, 255, 255, .04);
}

.preview-image img {
  width: 280px;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, .8);
}

.preview-info {
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 380px;
  height: 100%;
}

/* título */
.title-block {
  margin-bottom: 18px;
}

.card-title {
  font-size: clamp(22px, 2vw, 28px);
  font-weight: 700;
  line-height: 1.25;
  background: linear-gradient(90deg, #ffffff, #cfcfff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  word-break: break-word;
}

.title-divider {
  width: 64px;
  height: 3px;
  margin-top: 10px;
  border-radius: 2px;

  background: linear-gradient(to right, #4B0082, #1E90FF);
}

/* descrição */
.description-wrapper {
  margin-top: 20px;
  max-height: 170px;
  overflow-y: auto;
  padding-right: 6px;
}

.description-wrapper::-webkit-scrollbar {
  width: 4px;
}

.description-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.description-wrapper::-webkit-scrollbar-thumb {
  background: rgba(75, 0, 130, .6);
  border-radius: 4px;
}

.card-description {
  font-size: 15px;
  line-height: 1.85;
  color: rgba(255, 255, 255, .78);
  letter-spacing: .2px;
  white-space: pre-line;
}

.card-description::-webkit-scrollbar {
  width: 4px;
}

.card-description::-webkit-scrollbar-thumb {
  background: rgba(75, 0, 130, .6);
  border-radius: 4px;
}

.close-btn {
  position: absolute;
  top: -14px;
  right: -14px;
  background: rgba(0, 0, 0, .6);
  backdrop-filter: blur(4px);
}
</style>
