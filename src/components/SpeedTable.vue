<script setup lang="ts">
import { computed } from 'vue'
import type { SpeedStats } from '@/types/analysis'
import { capitalize, formatPercentage } from '@/utils/format'

defineOptions({ name: 'SpeedTable' })

const props = withDefaults(
  defineProps<{
    speeds: SpeedStats[]
    title?: string
  }>(),
  {
    title: 'Performance by Time Control',
  },
)

const speedOrder = [
  'ultraBullet',
  'bullet',
  'blitz',
  'rapid',
  'classical',
  'correspondence',
] as const

const sortedSpeeds = computed(() =>
  [...props.speeds].sort(
    (a: SpeedStats, b: SpeedStats) =>
      speedOrder.indexOf(a.speed as (typeof speedOrder)[number]) -
      speedOrder.indexOf(b.speed as (typeof speedOrder)[number]),
  ),
)
</script>

<template>
  <div class="speed-table">
    <h3 class="table-title">{{ title }}</h3>
    <div v-if="speeds.length === 0" class="empty-state">No data available.</div>
    <table v-else class="table">
      <thead>
        <tr>
          <th scope="col">Time Control</th>
          <th scope="col">Games</th>
          <th scope="col">Wins</th>
          <th scope="col">Losses</th>
          <th scope="col">Draws</th>
          <th scope="col">Win %</th>
          <th scope="col">Avg Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stat in sortedSpeeds" :key="stat.speed">
          <td class="speed-name">{{ capitalize(stat.speed) }}</td>
          <td class="text-right">{{ stat.games }}</td>
          <td class="text-right text--win">{{ stat.wins }}</td>
          <td class="text-right text--loss">{{ stat.losses }}</td>
          <td class="text-right">{{ stat.draws }}</td>
          <td class="text-right">{{ formatPercentage(stat.winRate) }}</td>
          <td class="text-right">{{ stat.averageRating ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.speed-table {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  overflow-x: auto;
}

.table-title {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.empty-state {
  color: #6b7280;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem 0;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.table th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}

.table tr:last-child td {
  border-bottom: none;
}

.table tr:hover td {
  background: #f9fafb;
}

.speed-name {
  font-weight: 600;
}

.text-right {
  text-align: right;
}

.text--win {
  color: #16a34a;
  font-weight: 600;
}

.text--loss {
  color: #dc2626;
  font-weight: 600;
}
</style>
