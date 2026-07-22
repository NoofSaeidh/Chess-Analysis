<script setup lang="ts">
import type { OpeningStats } from '@/types/analysis'
import { formatPercentage } from '@/utils/format'

defineOptions({ name: 'OpeningsTable' })

withDefaults(
  defineProps<{
    openings: OpeningStats[]
    title?: string
  }>(),
  {
    title: 'Top Openings',
  },
)

function winRateClass(rate: number): string {
  if (rate >= 60) {
    return 'win-rate--high'
  }
  if (rate >= 40) {
    return 'win-rate--mid'
  }
  return 'win-rate--low'
}
</script>

<template>
  <div class="openings-table">
    <h3 class="table-title">{{ title }}</h3>
    <div v-if="openings.length === 0" class="empty-state">No opening data available.</div>
    <table v-else class="table">
      <thead>
        <tr>
          <th scope="col">ECO</th>
          <th scope="col">Opening</th>
          <th scope="col">Games</th>
          <th scope="col">Wins</th>
          <th scope="col">Losses</th>
          <th scope="col">Draws</th>
          <th scope="col">Win %</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="opening in openings" :key="opening.eco">
          <td class="eco-code">{{ opening.eco }}</td>
          <td class="opening-name">{{ opening.name }}</td>
          <td class="text-right">{{ opening.games }}</td>
          <td class="text-right text--win">{{ opening.wins }}</td>
          <td class="text-right text--loss">{{ opening.losses }}</td>
          <td class="text-right">{{ opening.draws }}</td>
          <td class="text-right">
            <span :class="['win-rate', winRateClass(opening.winRate)]">
              {{ formatPercentage(opening.winRate) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.openings-table {
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

.eco-code {
  font-weight: 600;
  font-family: monospace;
  color: #1d4ed8;
}

.opening-name {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.win-rate {
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.win-rate--high {
  background: #dcfce7;
  color: #15803d;
}

.win-rate--mid {
  background: #fef9c3;
  color: #854d0e;
}

.win-rate--low {
  background: #fee2e2;
  color: #b91c1c;
}
</style>
