<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import BaseDialog from 'src/shared/ui/base/BaseDialog.vue'
import AppButton from 'src/shared/ui/base/AppButton.vue'
import AppChip from 'src/shared/ui/base/AppChip.vue'
import AppCard from 'src/shared/ui/base/AppCard.vue'
import AppIconButton from 'src/shared/ui/base/AppIconButton.vue'
import CardGrid from 'src/shared/ui/data-display/CardGrid.vue'

import { useCreateTrade } from '../composables/useCreateTrade'

const $q = useQuasar()
const isMobile = computed(() => $q.screen.lt.md)

const props = defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created'): void
}>()

const activeTab = ref<'offering' | 'receiving'>('offering')

const offeringPage = ref(1)
const receivingPage = ref(1)

const cols = computed(() => (isMobile.value ? 2 : 4))
const rows = computed(() => 2)
const pageSize = computed(() => cols.value * rows.value)

const {
  myCards,
  availableCards,
  loadingMyCards,
  loadingAvailable,
  myCardsError,
  availableError,
  selectedOfferingIds,
  selectedReceivingIds,
  creatingTrade,
  isTradeValid,
  fetchMyCardsForTrade,
  fetchAvailableCardsForTrade,
  toggleOffering,
  toggleReceiving,
  handleCreateTrade,
  resetSelection,
} = useCreateTrade({
  onSuccess: () => {
    emit('created')
    emit('update:modelValue', false)
    resetSelection()
    activeTab.value = 'offering'
    offeringPage.value = 1
    receivingPage.value = 1
  },
})

const offeringCount = computed(() => selectedOfferingIds.value.length)
const receivingCount = computed(() => selectedReceivingIds.value.length)

const myCardsTotalPages = computed(() => Math.max(1, Math.ceil((myCards.value?.length ?? 0) / pageSize.value)))
const availableTotalPages = computed(() => Math.max(1, Math.ceil((availableCards.value?.length ?? 0) / pageSize.value)))

const myCardsPageSlice = computed(() => {
  const start = (offeringPage.value - 1) * pageSize.value
  return myCards.value.slice(start, start + pageSize.value)
})

const availablePageSlice = computed(() => {
  const start = (receivingPage.value - 1) * pageSize.value
  return availableCards.value.slice(start, start + pageSize.value)
})

function setOpen(value: boolean) {
  emit('update:modelValue', value)
  if (!value) {
    resetSelection()
    activeTab.value = 'offering'
    offeringPage.value = 1
    receivingPage.value = 1
  }
}

function close() {
  setOpen(false)
}

async function handleSubmit() {
  if (!isTradeValid.value || creatingTrade.value) return
  await handleCreateTrade()
}

function clampPages() {
  offeringPage.value = Math.min(offeringPage.value, myCardsTotalPages.value)
  receivingPage.value = Math.min(receivingPage.value, availableTotalPages.value)
  if (offeringPage.value < 1) offeringPage.value = 1
  if (receivingPage.value < 1) receivingPage.value = 1
}

watch([myCardsTotalPages, availableTotalPages], clampPages)

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return

    resetSelection()
    activeTab.value = 'offering'
    offeringPage.value = 1
    receivingPage.value = 1

    void fetchMyCardsForTrade({ silent: true })
    void fetchAvailableCardsForTrade({ silent: true })
  }
)
</script>

<template>
  <BaseDialog :model-value="modelValue" title="Criar nova troca" subtitle="Escolha cartas para oferecer e receber"
    width="1120px" :body-scrollable="false" @update:modelValue="setOpen">
    <div class="create-trade">
      <div class="topbar">
        <div class="tabs" role="tablist" aria-label="Etapas da troca">
          <AppChip size="sm" :label="`OFERECENDO • ${offeringCount}`"
            :variant="activeTab === 'offering' ? 'primary' : 'default'" clickable role="tab"
            :aria-selected="activeTab === 'offering' ? 'true' : 'false'" @click="activeTab = 'offering'" />

          <AppChip size="sm" :label="`RECEBENDO • ${receivingCount}`"
            :variant="activeTab === 'receiving' ? 'info' : 'default'" clickable role="tab"
            :aria-selected="activeTab === 'receiving' ? 'true' : 'false'" @click="activeTab = 'receiving'" />
        </div>

        <div class="hint">Selecione pelo menos 1 carta de cada lado</div>
      </div>

      <div class="content" :class="{ 'content--mobile': isMobile }">
        <AppCard v-show="!isMobile || activeTab === 'offering'" class="panel" padding="md" variant="subtle">
          <div class="panel-head">
            <div class="panel-title">SUAS CARTAS</div>
            <div class="panel-sub">Oferecendo • <strong>{{ offeringCount }}</strong></div>
          </div>

          <CardGrid :cards="myCardsPageSlice" :loading="loadingMyCards" :error="myCardsError" selectable
            :selected-ids="selectedOfferingIds" :max-items="pageSize" empty-title="Nenhuma carta disponível"
            empty-description="Você não possui cartas para oferecer." @select="({ id }) => toggleOffering(id)" />

          <div v-if="myCardsTotalPages > 1" class="pager">
            <AppIconButton icon="chevron_left" variant="ghost" size="sm" :disabled="offeringPage <= 1"
              @click="offeringPage = Math.max(1, offeringPage - 1)" />
            <div class="pager-text">
              Página <strong>{{ offeringPage }}</strong> de <strong>{{ myCardsTotalPages }}</strong>
            </div>
            <AppIconButton icon="chevron_right" variant="ghost" size="sm" :disabled="offeringPage >= myCardsTotalPages"
              @click="offeringPage = Math.min(myCardsTotalPages, offeringPage + 1)" />
          </div>
        </AppCard>

        <div class="mid" aria-hidden="true">
          <div class="mid-icon">⇄</div>
          <div class="mid-line" />
        </div>

        <AppCard v-show="!isMobile || activeTab === 'receiving'" class="panel" padding="md" variant="subtle">
          <div class="panel-head">
            <div class="panel-title receiving">TODAS AS CARTAS</div>
            <div class="panel-sub">Recebendo • <strong>{{ receivingCount }}</strong></div>
          </div>

          <CardGrid :cards="availablePageSlice" :loading="loadingAvailable" :error="availableError" selectable
            :selected-ids="selectedReceivingIds" :disabled-ids="myCards.map(c => c.id)" :max-items="pageSize"
            empty-title="Nenhuma carta disponível" empty-description="Não há cartas disponíveis para receber."
            @select="({ id }) => toggleReceiving(id)" />

          <div v-if="availableTotalPages > 1" class="pager">
            <AppIconButton icon="chevron_left" variant="ghost" size="sm" :disabled="receivingPage <= 1"
              @click="receivingPage = Math.max(1, receivingPage - 1)" />
            <div class="pager-text">
              Página <strong>{{ receivingPage }}</strong> de <strong>{{ availableTotalPages }}</strong>
            </div>
            <AppIconButton icon="chevron_right" variant="ghost" size="sm"
              :disabled="receivingPage >= availableTotalPages"
              @click="receivingPage = Math.min(availableTotalPages, receivingPage + 1)" />
          </div>
        </AppCard>
      </div>
    </div>

    <template #footer>
      <AppButton label="Cancelar" variant="ghost" :disabled="creatingTrade" @click="close" />
      <AppButton label="Criar troca" icon="add" :disabled="!isTradeValid || creatingTrade" :loading="creatingTrade"
        @click="handleSubmit" />
    </template>
  </BaseDialog>
</template>

<style scoped lang="scss">
:deep(.dialog-body) {
  overflow: hidden !important;
  padding: 0 !important;
}

.create-trade {
  height: 100%;
  max-height: 100%;
  overflow: auto;
  padding: var(--space-6);

  display: flex;
  flex-direction: column;
  gap: 14px;

  background:
    radial-gradient(circle at 18% 0%, rgba(139, 92, 246, 0.10), transparent 60%),
    radial-gradient(circle at 90% 8%, rgba(30, 144, 255, 0.08), transparent 55%);
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 3;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);

  padding: 12px 12px;
  margin: -6px -6px 6px;

  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 15, 26, 0.55);
  backdrop-filter: blur(12px);
  border-radius: 16px;

  box-shadow:
    0 14px 36px rgba(0, 0, 0, 0.28),
    0 0 18px rgba(139, 92, 246, 0.10);
}

.tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 0;
}

.hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  text-align: right;
}

.content {
  display: grid;
  grid-template-columns: 1fr 86px 1fr;
  gap: 16px;
  align-items: start;
}

.content--mobile {
  grid-template-columns: 1fr;
}

.panel {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  min-height: 100%;
}

.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.panel-title {
  font-weight: 900;
  letter-spacing: 1px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.70);
}

.panel-title.receiving {
  color: rgba(30, 144, 255, 0.92);
}

.panel-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
}

.pager {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 10px 12px;
  border-radius: 14px;

  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.pager-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
}

.mid {
  position: relative;
  height: 100%;
  display: grid;
  place-items: center;
  padding-top: 28px;
}

.mid-icon {
  font-size: 20px;
  opacity: 0.85;
  color: rgba(138, 43, 226, 0.95);
  filter: drop-shadow(0 0 16px rgba(138, 43, 226, 0.18));
}

.mid-line {
  position: absolute;
  width: 2px;
  height: 240px;
  border-radius: 999px;
  background: linear-gradient(to bottom,
      rgba(255, 255, 255, 0.04),
      rgba(138, 43, 226, 0.22),
      rgba(255, 255, 255, 0.04));
  opacity: 0.7;
}

@media (max-width: 740px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .hint {
    text-align: left;
  }

  .mid {
    display: none;
  }

  .create-trade {
    --grid-card-min: 0px;
  }

  :deep(.app-cardGrid) {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

@media (min-width: 741px) {
  :deep(.app-cardGrid) {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  }
}
</style>
