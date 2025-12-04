<template>
  <div class="contrast-checker">
    <h3>🔍 Проверка контраста (WCAG)</h3>
    
    <div class="color-inputs">
      <div class="color-input">
        <label>Цвет текста:</label>
        <input type="color" v-model="foregroundColor" />
        <input type="text" v-model="foregroundColor" class="color-text" />
      </div>
      
      <div class="color-input">
        <label>Цвет фона:</label>
        <input type="color" v-model="backgroundColor" />
        <input type="text" v-model="backgroundColor" class="color-text" />
      </div>
    </div>
    
    <div class="preview" :style="{ backgroundColor }">
      <p :style="{ color: foregroundColor }">
        Пример текста для проверки контраста
      </p>
    </div>
    
    <div class="results">
      <div class="result-item" :class="getContrastClass(ratio)">
        <strong>Коэффициент контраста:</strong>
        <span>{{ ratio.toFixed(2) }}:1</span>
      </div>
      
      <div class="result-item" :class="getLevelClass('normal')">
        <strong>Обычный текст (≥ 4.5):</strong>
        <span>{{ normalTextPassed ? '✅ Проходит' : '❌ Не проходит' }}</span>
      </div>
      
      <div class="result-item" :class="getLevelClass('large')">
        <strong>Крупный текст (≥ 3):</strong>
        <span>{{ largeTextPassed ? '✅ Проходит' : '❌ Не проходит' }}</span>
      </div>
      
      <div class="result-item" :class="getLevelClass('aa')">
        <strong>Уровень AA (≥ 4.5):</strong>
        <span>{{ aaPassed ? '✅ Проходит' : '❌ Не проходит' }}</span>
      </div>
      
      <div class="result-item" :class="getLevelClass('aaa')">
        <strong>Уровень AAA (≥ 7):</strong>
        <span>{{ aaaPassed ? '✅ Проходит' : '❌ Не проходит' }}</span>
      </div>
    </div>
    
    <div class="recommendations" v-if="!normalTextPassed">
      <h4>Рекомендации:</h4>
      <p>Попробуйте сделать текст темнее или фон светлее для улучшения контраста.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { getContrastRatio } from '../utils/colorUtils'

export default {
  name: 'ContrastChecker',
  
  setup() {
    const foregroundColor = ref('#000000')
    const backgroundColor = ref('#ffffff')
    
    const ratio = computed(() => {
      return getContrastRatio(foregroundColor.value, backgroundColor.value)
    })
    
    const normalTextPassed = computed(() => ratio.value >= 4.5)
    const largeTextPassed = computed(() => ratio.value >= 3)
    const aaPassed = computed(() => ratio.value >= 4.5)
    const aaaPassed = computed(() => ratio.value >= 7)
    
    const getContrastClass = (value) => {
      if (value >= 7) return 'excellent'
      if (value >= 4.5) return 'good'
      if (value >= 3) return 'moderate'
      return 'poor'
    }
    
    const getLevelClass = (type) => {
      if (type === 'normal') return normalTextPassed.value ? 'passed' : 'failed'
      if (type === 'large') return largeTextPassed.value ? 'passed' : 'failed'
      if (type === 'aa') return aaPassed.value ? 'passed' : 'failed'
      if (type === 'aaa') return aaaPassed.value ? 'passed' : 'failed'
      return ''
    }
    
    return {
      foregroundColor,
      backgroundColor,
      ratio,
      normalTextPassed,
      largeTextPassed,
      aaPassed,
      aaaPassed,
      getContrastClass,
      getLevelClass
    }
  }
}
</script>

<style scoped>
.contrast-checker {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-default);
  border: 1px solid var(--border);
  color: var(--text-primary);
}

.contrast-checker h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.color-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.color-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-input label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

.color-input input[type="color"] {
  width: 60px;
  height: 40px;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  padding: 0;
  background: transparent;
}

.color-text {
  padding: 0.5rem 0.75rem;
  background: var(--bg-input);
  color: var(--text-primary);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.color-text:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.preview {
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin: 1.5rem 0;
  text-align: center;
}

.preview p {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.results {
  display: grid;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.result-item strong {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

.result-item span {
  font-weight: 600;
  font-size: 0.875rem;
}

.result-item.excellent,
.result-item.passed {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #065f46;
}

.result-item.good {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #1e40af;
}

.result-item.moderate {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
  color: #92400e;
}

.result-item.poor,
.result-item.failed {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #991b1b;
}

.dark-theme .result-item.excellent,
.dark-theme .result-item.passed {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.dark-theme .result-item.good {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.dark-theme .result-item.moderate {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.dark-theme .result-item.poor,
.dark-theme .result-item.failed {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.recommendations {
  padding: 1rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--radius-md);
  color: #92400e;
  margin-top: 1rem;
}

.dark-theme .recommendations {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.recommendations h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.recommendations p {
  margin: 0;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .color-inputs {
    grid-template-columns: 1fr;
  }
  
  .color-input input[type="color"] {
    width: 100%;
  }
}
</style>