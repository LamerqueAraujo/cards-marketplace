<script setup lang="ts">
import AppPageLayout from 'src/shared/layout/AppPageLayout.vue'
import AppCard from 'src/shared/ui/base/AppCard.vue'
import AppButton from 'src/shared/ui/base/AppButton.vue'
import LoadingState from 'src/shared/ui/feedback/LoadingState.vue'
import ErrorState from 'src/shared/ui/feedback/ErrorState.vue'
import EmptyState from 'src/shared/ui/feedback/EmptyState.vue'
import CreateTradeDialog from 'src/modules/trades/components/TradeCreateDialog.vue'
import TradeDetailsDialog from 'src/modules/trades/components/TradeDetailsDialog.vue'
import TradeCard from 'src/modules/trades/components/TradeCard.vue'
import { useHomeMarketplace } from '../composables/useHomeMarketplace'

const {
  trades,
  loading,
  error,
  isAuthenticated,
  subtitle,
  fetchTrades,
  goLogin,
  goRegister,
  goTrades,
  goMyCards,
  goCreateTrade,
  createTradeOpen,
  onTradeCreated,
  detailsOpen,
  selectedTrade,
  openTradeDetails,
  closeTradeDetails,
} = useHomeMarketplace()
</script>

<template>
  <AppPageLayout title="Marketplace" :subtitle="subtitle">
    <template #actions>
      <template v-if="isAuthenticated">
        <AppButton label="Criar troca" icon="add" @click="goCreateTrade" />
        <AppButton label="Minhas cartas" icon="style" variant="ghost" @click="goMyCards" />
      </template>

      <template v-else>
        <AppButton label="Entrar" icon="login" @click="goLogin" />
        <AppButton label="Criar conta" icon="person_add" variant="ghost" @click="goRegister" />
      </template>
    </template>

    <div class="app-home">
      <AppCard class="app-home__hero" padding="lg" variant="elevated">
        <div class="app-home__heroGrid">
          <div class="app-home__heroMain">
            <div class="app-home__heroTitle text-display">Trocas abertas agora</div>

            <div class="app-home__heroSubtitle">
              Escolha o que deseja receber, compare ofertas e negocie como um duelista.
            </div>

            <div class="app-home__heroActions">
              <AppButton label="Ver todas as trocas" icon="swap_horiz" @click="() => goTrades()" />
            </div>
          </div>

          <div class="app-home__heroAside" aria-label="Dicas rápidas">
            <div class="app-home__asideTitle">Dica rápida</div>
            <div class="app-home__asideText">
              Para criar uma troca, selecione cartas da sua coleção para <b>oferecer</b> e escolha o que deseja
              <b>receber</b> entre todas as cartas do sistema.
            </div>

            <div class="app-home__asideDivider" />

            <div class="app-home__asideActions">
              <AppButton v-if="isAuthenticated" label="Criar troca" icon="add" variant="ghost" @click="goCreateTrade" />
              <AppButton v-else label="Criar conta" icon="person_add" variant="ghost" @click="goRegister" />
            </div>
          </div>
        </div>
      </AppCard>

      <section class="app-home__section">
        <header class="app-home__sectionHeader">
          <div class="app-home__sectionTitles">
            <div class="app-home__sectionTitle">Ultimas trocas adicionadas</div>
            <div class="app-home__sectionHint">
              {{ loading ? 'Carregando…' : `${trades.length} listadas` }}
            </div>
          </div>

          <div class="app-home__sectionActions">
            <AppButton label="Ver todas" icon="swap_horiz" variant="ghost" @click="() => goTrades()" />
          </div>
        </header>

        <LoadingState v-if="loading && trades.length === 0" type="grid" />

        <ErrorState v-else-if="error && trades.length === 0" title="Não foi possível carregar as trocas"
          description="Tente novamente em instantes.">
          <template #actions>
            <AppButton label="Tentar novamente" icon="refresh" @click="fetchTrades(true)" />
          </template>
        </ErrorState>

        <EmptyState v-else-if="!loading && trades.length === 0" icon="swap_horiz"
          title="Nenhuma troca aberta no momento"
          description="Volte em alguns minutos — novas trocas podem aparecer a qualquer momento." />

        <div v-else class="app-home__grid">
          <TradeCard v-for="trade in trades" :key="trade.id" :trade="trade" @open-details="openTradeDetails" />
        </div>

        <ErrorState v-if="error && trades.length > 0" title="Algumas trocas não puderam ser carregadas"
          description="Você pode tentar novamente.">
          <template #actions>
            <AppButton label="Tentar novamente" icon="refresh" @click="fetchTrades(false)" />
          </template>
        </ErrorState>
      </section>
    </div>

    <CreateTradeDialog v-model="createTradeOpen" @created="onTradeCreated" />

    <TradeDetailsDialog v-model="detailsOpen" :trade="selectedTrade"
      @update:modelValue="(v) => !v && closeTradeDetails()" />
  </AppPageLayout>
</template>

<style scoped lang="scss">
.app-home {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.app-home__hero {
  background:
    radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.16), transparent 55%),
    radial-gradient(circle at 80% 80%, rgba(30, 144, 255, 0.10), transparent 50%),
    linear-gradient(135deg, rgba(20, 20, 39, 0.88), rgba(15, 15, 26, 0.94));
}

.app-home__heroGrid {
  display: grid;
  gap: var(--space-5);
}

@media (min-width: 1100px) {
  .app-home__heroGrid {
    grid-template-columns: 1.25fr 0.75fr;
    align-items: center;
  }
}

.app-home__heroMain {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.app-home__heroTitle {
  font-size: var(--text-title);
  font-weight: 800;
  letter-spacing: 0.08em;
}

.app-home__heroSubtitle {
  color: var(--text-muted);
  font-size: var(--text-body);
  line-height: 1.65;
  max-width: 64ch;
}

.app-home__heroActions {
  margin-top: var(--space-2);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.app-home__heroAside {
  border-radius: var(--radius-lg);
  padding: var(--space-5);

  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);

  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);
}

.app-home__asideTitle {
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.82);
}

.app-home__asideText {
  margin-top: var(--space-3);
  color: var(--text-muted);
  font-size: var(--text-body);
  line-height: 1.65;
}

.app-home__asideDivider {
  height: 1px;
  margin: var(--space-4) 0;
  background: rgba(255, 255, 255, 0.06);
}

.app-home__asideActions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.app-home__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.app-home__sectionHeader {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
}

.app-home__sectionTitles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-home__sectionTitle {
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.82);
}

.app-home__sectionHint {
  font-size: var(--text-caption);
  color: var(--text-muted);
}

.app-home__sectionActions {
  display: flex;
  gap: var(--space-3);
}

.app-home__grid {
  display: grid;
  gap: var(--space-5);
}

@media (min-width: 900px) {
  .app-home__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .app-home__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .hero-content {
    align-items: center;
    text-align: center;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: var(--space-3);
  }

  .app-home__heroActions {
    flex-wrap: nowrap;
  }

  .app-home__heroMain {
    align-items: center;
    text-align: center;
  }

  .app-home__heroSubtitle {
    max-width: 34ch;
  }

  .app-home__heroActions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    /* um por linha */
    gap: var(--space-3);
    justify-items: center;
  }

  .app-home__heroActions :deep(.q-btn),
  .app-home__heroActions :deep(button) {
    width: 100%;
    max-width: 360px;
  }

  .app-home__heroAside {
    text-align: center;
  }

  .app-home__asideActions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-3);
    justify-items: center;
  }

  .app-home__asideActions :deep(.q-btn),
  .app-home__asideActions :deep(button) {
    width: 100%;
    max-width: 360px;
  }

  .hero-actions>* {
    width: 100%;
    max-width: 360px;
  }
}
</style>
