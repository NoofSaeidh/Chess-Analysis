import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'
import {
  buildGameAnalyses,
  buildRatingHistory,
  computeOpeningStats,
  computeOpponentStats,
  computeSpeedStats,
  computeWinLossDraw,
} from '@/utils/analysis'
import type { AnalysisSummary, GameAnalysis } from '@/types/analysis'
import type { GameColor, PerfType } from '@/types/lichess'

export const useAnalysisStore = defineStore('analysis', () => {
  const userStore = useUserStore()

  const selectedPerfType = ref<PerfType | null>(null)
  const maxOpenings = ref(10)
  const maxOpponents = ref(10)

  const analyses = computed<GameAnalysis[]>(() => {
    const username = userStore.user?.username
    if (username === undefined) {
      return []
    }
    const games = selectedPerfType.value
      ? userStore.games.filter((g) => g.perf === selectedPerfType.value)
      : userStore.games
    return buildGameAnalyses(games, username)
  })

  const summary = computed<AnalysisSummary | null>(() => {
    const username = userStore.user?.username
    if (username === undefined || analyses.value.length === 0) {
      return null
    }

    const whiteAnalyses = analyses.value.filter(
      (a): a is GameAnalysis & { playerColor: GameColor } => a.playerColor === 'white',
    )
    const blackAnalyses = analyses.value.filter(
      (a): a is GameAnalysis & { playerColor: GameColor } => a.playerColor === 'black',
    )

    return {
      username,
      totalGames: analyses.value.length,
      overall: computeWinLossDraw(analyses.value),
      byColor: {
        white: computeWinLossDraw(whiteAnalyses),
        black: computeWinLossDraw(blackAnalyses),
      },
      bySpeed: computeSpeedStats(analyses.value),
      topOpenings: computeOpeningStats(analyses.value, maxOpenings.value),
      topOpponents: computeOpponentStats(analyses.value, maxOpponents.value),
      ratingHistory: buildRatingHistory(analyses.value),
      perfType: selectedPerfType.value,
    }
  })

  function selectPerfType(perfType: PerfType | null): void {
    selectedPerfType.value = perfType
  }

  function reset(): void {
    selectedPerfType.value = null
    maxOpenings.value = 10
    maxOpponents.value = 10
  }

  return {
    analyses,
    summary,
    selectedPerfType,
    maxOpenings,
    maxOpponents,
    selectPerfType,
    reset,
  }
})
