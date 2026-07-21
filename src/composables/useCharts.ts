import { computed } from 'vue'
import { useAnalysisStore } from '@/stores/analysisStore'
import type { OpeningStats, SpeedStats } from '@/types/analysis'
import type { GameColor } from '@/types/lichess'

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor: string[]
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

const WIN_COLOR = 'rgba(74, 222, 128, 0.8)'
const LOSS_COLOR = 'rgba(248, 113, 113, 0.8)'
const DRAW_COLOR = 'rgba(148, 163, 184, 0.8)'

export function useCharts(): {
  overallChartData: ReturnType<typeof computed<ChartData | null>>
  colorChartData: (color: GameColor) => ChartData | null
  speedChartData: ReturnType<typeof computed<ChartData | null>>
  openingsChartData: ReturnType<typeof computed<ChartData | null>>
  ratingChartData: ReturnType<typeof computed<ChartData | null>>
} {
  const analysisStore = useAnalysisStore()

  const overallChartData = computed<ChartData | null>(() => {
    const summary = analysisStore.summary
    if (summary === null) {
      return null
    }
    return {
      labels: ['Wins', 'Losses', 'Draws'],
      datasets: [
        {
          label: 'Overall Results',
          data: [summary.overall.wins, summary.overall.losses, summary.overall.draws],
          backgroundColor: [WIN_COLOR, LOSS_COLOR, DRAW_COLOR],
        },
      ],
    }
  })

  function colorChartData(color: GameColor): ChartData | null {
    const summary = analysisStore.summary
    if (summary === null) {
      return null
    }
    const stats = summary.byColor[color]
    return {
      labels: ['Wins', 'Losses', 'Draws'],
      datasets: [
        {
          label: `${color.charAt(0).toUpperCase() + color.slice(1)} Results`,
          data: [stats.wins, stats.losses, stats.draws],
          backgroundColor: [WIN_COLOR, LOSS_COLOR, DRAW_COLOR],
        },
      ],
    }
  }

  const speedChartData = computed<ChartData | null>(() => {
    const summary = analysisStore.summary
    if (summary === null || summary.bySpeed.length === 0) {
      return null
    }
    const sorted = [...summary.bySpeed].sort((a: SpeedStats, b: SpeedStats) => b.games - a.games)
    return {
      labels: sorted.map((s) => s.speed),
      datasets: [
        {
          label: 'Wins',
          data: sorted.map((s) => s.wins),
          backgroundColor: sorted.map(() => WIN_COLOR),
        },
        {
          label: 'Losses',
          data: sorted.map((s) => s.losses),
          backgroundColor: sorted.map(() => LOSS_COLOR),
        },
        {
          label: 'Draws',
          data: sorted.map((s) => s.draws),
          backgroundColor: sorted.map(() => DRAW_COLOR),
        },
      ],
    }
  })

  const openingsChartData = computed<ChartData | null>(() => {
    const summary = analysisStore.summary
    if (summary === null || summary.topOpenings.length === 0) {
      return null
    }
    const openings = summary.topOpenings.slice(0, 8) as OpeningStats[]
    return {
      labels: openings.map((o) => o.eco),
      datasets: [
        {
          label: 'Wins',
          data: openings.map((o) => o.wins),
          backgroundColor: openings.map(() => WIN_COLOR),
        },
        {
          label: 'Losses',
          data: openings.map((o) => o.losses),
          backgroundColor: openings.map(() => LOSS_COLOR),
        },
        {
          label: 'Draws',
          data: openings.map((o) => o.draws),
          backgroundColor: openings.map(() => DRAW_COLOR),
        },
      ],
    }
  })

  const ratingChartData = computed<ChartData | null>(() => {
    const summary = analysisStore.summary
    if (summary === null || summary.ratingHistory.length === 0) {
      return null
    }
    return {
      labels: summary.ratingHistory.map((r) =>
        new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      ),
      datasets: [
        {
          label: 'Rating',
          data: summary.ratingHistory.map((r) => r.rating),
          backgroundColor: summary.ratingHistory.map(() => 'rgba(96, 165, 250, 0.8)'),
        },
      ],
    }
  })

  return { overallChartData, colorChartData, speedChartData, openingsChartData, ratingChartData }
}
