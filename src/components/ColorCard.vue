<template>
  <div 
    class="color-card"
    :style="{ backgroundColor: color }"
    @click="$emit('click', color)"
    :title="`Нажмите, чтобы скопировать ${formatValue}`"
  >
    <div class="color-info">
      <div class="color-values">
        <span class="value">{{ formatValue }}</span>
        <span v-if="showContrast" class="contrast" :class="getContrastClass()">
          {{ contrastLevel }}
        </span>
      </div>
      <div class="color-actions">
        <button 
          v-if="showPin"
          @click.stop="$emit('toggle-pin')"
          :class="{ pinned: isPinned }"
          class="action-btn pin-btn"
          :title="isPinned ? 'Открепить цвет' : 'Закрепить цвет'"
        >
          <span class="pin-icon">📌</span>
        </button>
        <button 
          @click.stop="$emit('copy')"
          class="action-btn copy-btn"
          title="Скопировать цвет"
        >
          <span class="copy-icon">📋</span>
        </button>
      </div>
    </div>
    
    <!-- Индикатор состояния -->
    <div v-if="isPinned" class="pinned-indicator" title="Цвет закреплен">
      ⭐
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { hexToRgb, getContrastRatio } from '../utils/colorUtils'

export default {
  name: 'ColorCard',
  
  props: {
    color: {
      type: String,
      required: true,
      validator: (value) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
    },
    format: {
      type: String,
      default: 'hex',
      validator: (value) => ['hex', 'rgb'].includes(value)
    },
    showContrast: {
      type: Boolean,
      default: false
    },
    showPin: {
      type: Boolean,
      default: true
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    showLabels: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['click', 'copy', 'toggle-pin'],
  
  setup(props) {
    const formatValue = computed(() => {
      if (props.format === 'rgb') {
        const rgb = hexToRgb(props.color)
        return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : props.color
      }
      return props.color.toUpperCase()
    })
    
    const contrastRatio = computed(() => {
      if (!props.showContrast) return 0
      return getContrastRatio(props.color, props.backgroundColor)
    })
    
    const contrastLevel = computed(() => {
      if (!props.showContrast) return ''
      
      const ratio = contrastRatio.value
      
      if (ratio >= 7) return 'AAA'
      if (ratio >= 4.5) return 'AA'
      if (ratio >= 3) return 'A'
      return 'Low'
    })
    
    const getContrastClass = () => {
      if (!props.showContrast) return ''
      
      const ratio = contrastRatio.value
      
      if (ratio >= 7) return 'contrast-excellent'
      if (ratio >= 4.5) return 'contrast-good'
      if (ratio >= 3) return 'contrast-moderate'
      return 'contrast-poor'
    }
    
    const getTextColor = computed(() => {
      // Автоматически определяем лучший цвет текста для этого фона
      const rgb = hexToRgb(props.color)
      if (!rgb) return '#000000'
      
      // Простая формула для определения яркости
      const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
      return brightness > 128 ? '#000000' : '#ffffff'
    })
    
    return {
      formatValue,
      contrastRatio,
      contrastLevel,
      getContrastClass,
      getTextColor
    }
  }
}
</script>

<style scoped>
.color-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  height: 160px;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border: 2px solid transparent;
}

.color-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 12px 24px -4px rgba(0, 0, 0, 0.15),
    0 6px 12px -2px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.color-card:active {
  transform: translateY(-1px) scale(0.98);
  transition: transform 0.1s;
}

.color-info {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  color: white;
  padding: 12px 16px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.color-values {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.value {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  opacity: 0.95;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  user-select: all;
  transition: opacity 0.3s;
}

.color-card:hover .value {
  opacity: 1;
}

.contrast {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.contrast-excellent {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.contrast-good {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.contrast-moderate {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.contrast-poor {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.color-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.action-btn:active {
  transform: scale(0.95);
}

.pin-btn.pinned {
  background: rgba(255, 215, 0, 0.3);
  border-color: rgba(255, 215, 0, 0.5);
  color: #ffd700;
}

.pin-btn.pinned:hover {
  background: rgba(255, 215, 0, 0.4);
  border-color: rgba(255, 215, 0, 0.7);
}

.copy-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
}

.pin-icon, .copy-icon {
  display: block;
  line-height: 1;
  font-size: 14px;
}

.pinned-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 215, 0, 0.9);
  color: #333;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  animation: pulse 2s infinite;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
}

/* Стили для тёмной темы */
:global(.dark-theme) .color-card {
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

:global(.dark-theme) .color-card:hover {
  box-shadow: 
    0 12px 24px -4px rgba(0, 0, 0, 0.4),
    0 6px 12px -2px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

:global(.dark-theme) .color-info {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.75) 50%,
    rgba(0, 0, 0, 0.5) 100%
  );
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

:global(.dark-theme) .action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

:global(.dark-theme) .action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.25);
}

/* Адаптивность */
@media (max-width: 768px) {
  .color-card {
    height: 140px;
    min-width: 120px;
  }
  
  .color-info {
    padding: 10px 12px;
  }
  
  .value {
    font-size: 11px;
  }
  
  .contrast {
    font-size: 9px;
    padding: 1px 4px;
  }
  
  .action-btn {
    width: 28px;
    height: 28px;
    padding: 4px;
    font-size: 12px;
  }
  
  .pinned-indicator {
    width: 24px;
    height: 24px;
    font-size: 12px;
    top: 8px;
    right: 8px;
  }
}

@media (max-width: 480px) {
  .color-card {
    height: 120px;
    min-width: 100px;
  }
  
  .color-info {
    padding: 8px 10px;
  }
  
  .value {
    font-size: 10px;
  }
  
  .color-actions {
    gap: 6px;
  }
  
  .action-btn {
    width: 24px;
    height: 24px;
    padding: 3px;
    font-size: 11px;
  }
}
</style>