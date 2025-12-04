<template>
  <div id="app" :class="{ 'dark-theme': isDarkTheme }">
    <header class="app-header">
      <h1>🎨 Vue Color Palette Generator</h1>
      <p>Практическое занятие 27-28 | Vue 3 + Vite</p>
      
      <!-- Переключатель темы в шапке -->
      <div class="theme-toggle-header">
        <button @click="toggleTheme" class="theme-toggle-btn">
          <span v-if="isDarkTheme">☀️</span>
          <span v-else>🌙</span>
          {{ isDarkTheme ? 'Светлая тема' : 'Тёмная тема' }}
        </button>
      </div>
    </header>
    
    <nav class="navigation">
      <router-link to="/" class="nav-button">Главная</router-link>
      <router-link to="/generator" class="nav-button">Генератор</router-link>
      <router-link to="/library" class="nav-button">Библиотека</router-link>
      <router-link to="/export" class="nav-button">Экспорт</router-link>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>Vue 3 + Vite • Практика 27-28 • 2025/2026 учебный год</p>
      <p class="theme-info">
        Текущая тема: {{ isDarkTheme ? 'Тёмная' : 'Светлая' }}
      </p>
    </footer>
  </div>
</template>

<script>
import { useTheme } from './composables/useTheme'

export default {
  name: 'App',
  
  setup() {
    const { isDarkTheme, toggleTheme } = useTheme()
    
    return {
      isDarkTheme,
      toggleTheme
    }
  }
}
</script>

<style>
/* Основные стили App.vue */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--gradient-primary);
  color: white;
  padding: 2rem;
  text-align: center;
  position: relative;
}

.app-header h1 {
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.app-header p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.theme-toggle-header {
  position: absolute;
  top: 20px;
  right: 20px;
}

.theme-toggle-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.theme-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  box-shadow: var(--shadow-default);
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border);
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid transparent;
  background: transparent;
  color: var(--text-primary);
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-button:hover,
.nav-button.router-link-active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: translateY(-2px);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background: var(--bg-secondary);
  color: var(--text-primary);
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
  border-top: 1px solid var(--border);
}

.theme-info {
  margin-top: 10px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .app-header p {
    font-size: 1rem;
  }
  
  .theme-toggle-header {
    position: static;
    margin-top: 1rem;
  }
  
  .theme-toggle-btn {
    margin: 0 auto;
  }
  
  .navigation {
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .nav-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>