<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header class="app-header">
      <nav class="nav">
        <RouterLink to="/" class="nav-logo">♟ Chess Analysis</RouterLink>
        <a
          href="https://lichess.org"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-link"
        >
          Lichess ↗
        </a>
      </nav>
    </header>
    <RouterView />
    <footer class="app-footer">
      <p>Powered by the <a href="https://lichess.org/api" target="_blank" rel="noopener noreferrer">Lichess API</a></p>
    </footer>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
  background: #f9fafb;
  color: #111827;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<style scoped>
.app-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  text-decoration: none;
}

.nav-logo:hover {
  color: #3b82f6;
}

.nav-link {
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
}

.nav-link:hover {
  color: #3b82f6;
}

.app-footer {
  margin-top: auto;
  padding: 1.5rem 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.8rem;
}

.app-footer a {
  color: #6b7280;
}
</style>
