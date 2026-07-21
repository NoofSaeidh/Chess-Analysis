<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useAnalysisStore } from '@/stores/analysisStore'
import UserProfile from '@/components/UserProfile.vue'
import UserSearch from '@/components/UserSearch.vue'
import StatsOverview from '@/components/StatsOverview.vue'
import OpeningsTable from '@/components/OpeningsTable.vue'
import SpeedTable from '@/components/SpeedTable.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorDisplay from '@/components/ErrorDisplay.vue'

defineOptions({ name: 'AnalysisView' })

const props = defineProps<{
  username: string
}>()

const userStore = useUserStore()
const analysisStore = useAnalysisStore()

function hasCachedDataForUsername(username: string): boolean {
  const normalizedUsername = username.trim().toLowerCase()
  const loadedUsername = userStore.gamesUsername
  const currentUsername = userStore.user?.username.toLowerCase()

  return (
    loadedUsername === normalizedUsername &&
    currentUsername === normalizedUsername &&
    userStore.userError === null &&
    userStore.gamesError === null
  )
}

async function loadData(username: string): Promise<void> {
  if (hasCachedDataForUsername(username)) {
    return
  }
  analysisStore.reset()
  await userStore.fetchUser(username)
  if (userStore.userError === null) {
    await userStore.fetchGames(username)
  }
}

onMounted(async () => {
  await loadData(props.username)
})

watch(
  () => props.username,
  async (newUsername) => {
    await loadData(newUsername)
  },
)

async function handleRetry(): Promise<void> {
  await loadData(props.username)
}
</script>

<template>
  <main class="analysis-view">
    <div class="analysis-header">
      <UserSearch :initial-username="username" />
    </div>

    <section v-if="userStore.isLoadingUser || userStore.isLoadingGames" class="loading-section">
      <LoadingSpinner size="lg" label="Loading analysis…" />
      <p class="loading-text">
        {{ userStore.isLoadingUser ? 'Fetching user…' : 'Fetching games…' }}
      </p>
    </section>

    <template v-else-if="userStore.userError !== null">
      <ErrorDisplay
        :message="userStore.userError"
        title="Failed to load user"
        @retry="handleRetry"
      />
    </template>

    <template v-else-if="userStore.user !== null">
      <div class="analysis-grid">
        <section class="profile-section">
          <UserProfile :user="userStore.user" />
        </section>

        <template v-if="analysisStore.summary !== null">
          <section class="stats-section">
            <StatsOverview :stats="analysisStore.summary.overall" title="Overall Performance" />
          </section>

          <section class="color-stats-section">
            <div class="color-stats-grid">
              <StatsOverview
                :stats="analysisStore.summary.byColor.white"
                title="As White"
              />
              <StatsOverview
                :stats="analysisStore.summary.byColor.black"
                title="As Black"
              />
            </div>
          </section>

          <section class="speed-section">
            <SpeedTable :speeds="analysisStore.summary.bySpeed" />
          </section>

          <section class="openings-section">
            <OpeningsTable :openings="analysisStore.summary.topOpenings" />
          </section>
        </template>

        <div v-else-if="userStore.gamesError !== null" class="games-error">
          <ErrorDisplay
            :message="userStore.gamesError"
            title="Failed to load games"
            @retry="handleRetry"
          />
        </div>

        <div v-else class="no-games">
          <p>No games found for <strong>{{ username }}</strong>.</p>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.analysis-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.analysis-header {
  margin-bottom: 1.5rem;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 4rem 0;
}

.loading-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.analysis-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.color-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.no-games {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

@media (max-width: 640px) {
  .color-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
