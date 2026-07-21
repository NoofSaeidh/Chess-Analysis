<script setup lang="ts">
import type { WinLossDrawStats } from '@/types/analysis'
import { formatPercentage } from '@/utils/format'

defineOptions({ name: 'StatsOverview' })

defineProps<{
  stats: WinLossDrawStats
  title?: string
}>()
</script>

<template>
  <div class="stats-overview">
    <h3 v-if="title" class="overview-title">{{ title }}</h3>
    <div class="stats-grid">
      <div class="stat-card stat-card--win">
        <span class="stat-label">Wins</span>
        <span class="stat-count">{{ stats.wins }}</span>
        <span class="stat-pct">{{ formatPercentage(stats.winRate) }}</span>
      </div>
      <div class="stat-card stat-card--loss">
        <span class="stat-label">Losses</span>
        <span class="stat-count">{{ stats.losses }}</span>
        <span class="stat-pct">{{ formatPercentage(stats.lossRate) }}</span>
      </div>
      <div class="stat-card stat-card--draw">
        <span class="stat-label">Draws</span>
        <span class="stat-count">{{ stats.draws }}</span>
        <span class="stat-pct">{{ formatPercentage(stats.drawRate) }}</span>
      </div>
      <div class="stat-card stat-card--total">
        <span class="stat-label">Total</span>
        <span class="stat-count">{{ stats.total }}</span>
        <span class="stat-pct">&nbsp;</span>
      </div>
    </div>
    <div class="progress-bar" role="presentation">
      <div
        class="progress-segment progress-segment--win"
        :style="{ width: `${stats.winRate}%` }"
        :title="`Wins: ${formatPercentage(stats.winRate)}`"
      />
      <div
        class="progress-segment progress-segment--draw"
        :style="{ width: `${stats.drawRate}%` }"
        :title="`Draws: ${formatPercentage(stats.drawRate)}`"
      />
      <div
        class="progress-segment progress-segment--loss"
        :style="{ width: `${stats.lossRate}%` }"
        :title="`Losses: ${formatPercentage(stats.lossRate)}`"
      />
    </div>
  </div>
</template>

<style scoped>
.stats-overview {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
}

.overview-title {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
}

.stat-card--win {
  background: #f0fdf4;
}

.stat-card--loss {
  background: #fef2f2;
}

.stat-card--draw {
  background: #f8fafc;
}

.stat-card--total {
  background: #eff6ff;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.stat-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.stat-pct {
  font-size: 0.75rem;
  color: #6b7280;
}

.progress-bar {
  height: 0.5rem;
  border-radius: 9999px;
  overflow: hidden;
  display: flex;
  background: #e5e7eb;
}

.progress-segment {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-segment--win {
  background: #22c55e;
}

.progress-segment--draw {
  background: #94a3b8;
}

.progress-segment--loss {
  background: #ef4444;
}
</style>
