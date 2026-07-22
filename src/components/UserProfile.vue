<script setup lang="ts">
import { computed } from 'vue'
import type { LichessUser } from '@/types/lichess'
import { formatPlayTime, formatTimestamp } from '@/utils/format'

defineOptions({ name: 'UserProfile' })

const props = defineProps<{
  user: LichessUser
}>()

const displayName = computed(() => {
  const { profile, username } = props.user
  if (profile?.firstName !== undefined && profile.lastName !== undefined) {
    return `${profile.firstName} ${profile.lastName}`
  }
  return profile?.firstName ?? username
})

const totalPlayTime = computed(() => {
  const seconds = props.user.playTime?.total
  return seconds !== undefined ? formatPlayTime(seconds) : null
})

const joinDate = computed(() => formatTimestamp(props.user.createdAt))
const lastSeen = computed(() => formatTimestamp(props.user.seenAt))

const lichessUrl = computed(() => `https://lichess.org/@/${props.user.username}`)
</script>

<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="username-row">
        <span v-if="user.title" class="title-badge">{{ user.title }}</span>
        <h2 class="username">
          <a :href="lichessUrl" target="_blank" rel="noopener noreferrer">
            {{ user.username }}
          </a>
        </h2>
        <span v-if="user.online === true" class="online-badge" title="Online">●</span>
        <span v-if="user.patron === true" class="patron-badge" title="Patron">♞</span>
      </div>
      <p v-if="displayName !== user.username" class="display-name">{{ displayName }}</p>
      <p v-if="user.profile?.bio" class="bio">{{ user.profile.bio }}</p>
    </div>

    <dl class="profile-stats">
      <div class="stat-item">
        <dt>Games</dt>
        <dd>{{ user.count.all.toLocaleString() }}</dd>
      </div>
      <div class="stat-item">
        <dt>Wins</dt>
        <dd class="stat--win">{{ user.count.win.toLocaleString() }}</dd>
      </div>
      <div class="stat-item">
        <dt>Losses</dt>
        <dd class="stat--loss">{{ user.count.loss.toLocaleString() }}</dd>
      </div>
      <div class="stat-item">
        <dt>Draws</dt>
        <dd>{{ user.count.draw.toLocaleString() }}</dd>
      </div>
      <div v-if="totalPlayTime !== null" class="stat-item">
        <dt>Play Time</dt>
        <dd>{{ totalPlayTime }}</dd>
      </div>
      <div class="stat-item">
        <dt>Member Since</dt>
        <dd>{{ joinDate }}</dd>
      </div>
      <div class="stat-item">
        <dt>Last Seen</dt>
        <dd>{{ lastSeen }}</dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
.user-profile {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.profile-header {
  margin-bottom: 1rem;
}

.username-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.title-badge {
  background: #fef3c7;
  color: #92400e;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.username {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.username a {
  color: #1d4ed8;
  text-decoration: none;
}

.username a:hover {
  text-decoration: underline;
}

.online-badge {
  color: #22c55e;
  font-size: 0.875rem;
}

.patron-badge {
  color: #a855f7;
}

.display-name {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.bio {
  margin: 0.5rem 0 0;
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.5;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin: 0;
}

.stat-item {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  text-align: center;
}

.stat-item dt {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-item dd {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.stat--win {
  color: #16a34a;
}

.stat--loss {
  color: #dc2626;
}
</style>
