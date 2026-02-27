<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getDashboardSummary } from '../services/dashboard.service'
import SurfaceCard from 'src/shared/ui/components/SurfaceCard.vue'
import StatCard from 'src/shared/ui/components/StatCard.vue'
import LoadingState from 'src/shared/ui/components/LoadingState.vue'
import ErrorState from 'src/shared/ui/components/ErrorState.vue'

const router = useRouter()
const summary = ref({
  totalCards: 0,
  activeTrades: 0,
  completedTrades: 0,
  rareCards: 0
})
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    error.value = false

    const data = await getDashboardSummary()
    summary.value = data

  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <q-page class="home-page">

    <section class="kpi-grid">

      <LoadingState v-if="loading" type="grid" />

      <ErrorState v-else-if="error" title="Não foi possível carregar o dashboard">
        <q-btn label="Tentar novamente" color="primary" />
      </ErrorState>

      <template v-else>
        <StatCard :value="summary.totalCards" label="Cartas na coleção" />
        <StatCard :value="summary.activeTrades" label="Trocas ativas" highlight />
        <StatCard :value="summary.completedTrades" label="Trocas concluídas" />
        <StatCard :value="summary.rareCards" label="Cartas raras" />
      </template>

    </section>

    <SurfaceCard padding="lg" class="home-hero">

      <div class="hero-content">
        <div class="hero-title">
          Construa seu deck. Negocie com estratégia.
        </div>

        <div class="hero-subtitle">
          Gerencie suas cartas, crie trocas e explore o marketplace.
        </div>

        <div class="hero-actions">
          <q-btn label="Explorar trocas" color="primary" @click="router.push({ name: 'trades' })" />

          <q-btn outline label="Minhas cartas" color="primary" @click="router.push({ name: 'my-cards' })" />
        </div>
      </div>

    </SurfaceCard>

    <section class="home-sections">

      <SurfaceCard clickable padding="md">

        <div>
          <div class="section-title">
            Trocas recentes
          </div>

          <div class="section-subtitle">
            Acompanhe sua atividade mais recente
          </div>
        </div>

        <q-btn flat label="Ver todas" color="primary" @click="router.push({ name: 'trades' })" />

      </SurfaceCard>

      <SurfaceCard clickable padding="md">

        <div>
          <div class="section-title">
            Minha coleção
          </div>

          <div class="section-subtitle">
            Gerencie e organize suas cartas
          </div>
        </div>

        <q-btn flat label="Abrir inventário" color="primary" @click="router.push({ name: 'my-cards' })" />

      </SurfaceCard>

    </section>

  </q-page>
</template>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.home-hero {
  background:
    radial-gradient(circle at 30% 30%, rgba(75, 0, 130, 0.15), transparent 60%),
    linear-gradient(135deg, #141427, #0f0f1a);
}

.hero-title {
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
}

.hero-subtitle {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
}

.hero-actions {
  margin-top: 18px;
  display: flex;
  gap: 12px;
}

.home-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.section-subtitle {
  font-size: 12px;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
