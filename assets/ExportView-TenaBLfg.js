import{_ as S,a as p,b as a,d as w,i as f,w as m,h as y,v as C,F as j,l as h,t as u,r as b,g as $,c as k,o as v,n as T}from"./index-D7J79gy1.js";import{u as _}from"./useColorPalette-CldLezVu.js";const F={name:"ExportView",setup(){const{colors:i}=_(),o=b("css"),d=b("color-");$(()=>{const e=localStorage.getItem("exportFormat");e&&(o.value=e);const s=localStorage.getItem("exportPrefix");s&&(d.value=s)});const t=k(()=>{const e=i.value.length>0?i.value:["#667eea","#764ba2","#f56565","#48bb78","#ed8936"];switch(o.value){case"css":return`:root {
`+e.map((l,n)=>`  --${d.value}${n+1}: ${l};`).join(`
`)+`
}

/* Использование: */
/* .element { color: var(--${d.value}1); } */`;case"scss":return e.map((l,n)=>`$${d.value}${n+1}: ${l};`).join(`
`)+`

// Использование:
// .element { color: $${d.value}1; }`;case"tailwind":const s=e.reduce((l,n,c)=>(l[`${d.value}${c+1}`]=n,l),{});return`module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(s,null,6)}
    }
  }
}

// Использование в Tailwind: bg-${d.value}1`;case"json":return JSON.stringify({name:"Color Palette",colors:e,paletteType:localStorage.getItem("paletteType")||"harmonious",baseColor:localStorage.getItem("baseColor")||"#667eea",generated:new Date().toISOString(),exportDate:new Date().toLocaleString("ru-RU")},null,2);case"palette-types":return`/*
 * ТИПЫ ЦВЕТОВЫХ ПАЛИТР
 * 
 * 1. Аналогичная (Analogous) - ${e.slice(0,3).join(", ")}
 *    - Цвета рядом на цветовом круге (±30°)
 *    - Гармоничные, спокойные сочетания
 *    - Идеально для: фонов, градиентов, мягких интерфейсов
 * 
 * 2. Триада (Triadic) - ${e.slice(0,3).join(", ")}
 *    - Три равноудаленных цвета (120° разница)
 *    - Контрастные, сбалансированные сочетания
 *    - Идеально для: акцентов, кнопок, важных элементов
 * 
 * 3. Комплементарная (Complementary) - ${e.slice(0,2).join(" и ")}
 *    - Противоположные цвета (180° разница)
 *    - Максимальный контраст, внимание
 *    - Идеально для: CTA-кнопок, предупреждений, выделения
 * 
 * 4. Монохромная (Monochromatic) - ${e.slice(0,4).join(", ")}
 *    - Оттенки одного цвета
 *    - Единообразный, профессиональный вид
 *    - Идеально для: брендинга, корпоративных сайтов
 * 
 * 5. По настроению (Mood-based)
 *    - Спокойные: пастельные синие/зеленые (#a8d8ea, #aa96da)
 *    - Энергичные: яркие красные/оранжевые (#ff165d, #ff9a00)
 *    - Профессиональные: приглушенные синие/серые (#2d4059, #ea5455)
 */
`;case"mood-guide":return`/*
 * ГИД ПО ЦВЕТОВЫМ НАСТРОЕНИЯМ
 * 
 * 🎭 СПОКОЙНЫЕ ПАЛИТРЫ
 * Характеристики:
 *   - Низкая насыщенность (20-60%)
 *   - Высокая светлота (50-80%)
 *   - Тона: синие, зеленые, пастельные
 * Использование:
 *   - Медитативные приложения
 *   - Сайты здоровья и wellness
 *   - Образовательные платформы
 * Пример: ${["#a8d8ea","#aa96da","#fcbad3","#ffffd2"].join(", ")}
 * 
 * ⚡ ЭНЕРГИЧНЫЕ ПАЛИТРЫ
 * Характеристики:
 *   - Высокая насыщенность (70-100%)
 *   - Средняя светлота (40-60%)
 *   - Тона: красные, оранжевые, яркие
 * Использование:
 *   - Спортивные приложения
 *   - Развлекательные платформы
 *   - Детские сайты
 * Пример: ${["#ff165d","#ff9a00","#ffde00","#08ffc8"].join(", ")}
 * 
 * 💼 ПРОФЕССИОНАЛЬНЫЕ ПАЛИТРЫ
 * Характеристики:
 *   - Низкая насыщенность (10-40%)
 *   - Темные тона (20-50%)
 *   - Тона: синие, серые, приглушенные
 * Использование:
 *   - Корпоративные сайты
 *   - Банковские приложения
 *   - Юридические фирмы
 * Пример: ${["#2d4059","#ea5455","#f07b3f","#ffd460"].join(", ")}
 * 
 * 🎨 КРЕАТИВНЫЕ ПАЛИТРЫ
 * Характеристики:
 *   - Высокая контрастность
 *   - Разнообразие цветов
 *   - Неожиданные сочетания
 * Использование:
 *   - Дизайн-студии
 *   - Художественные проекты
 *   - Креативные агентства
 * Пример: ${["#ff6b6b","#4ecdc4","#ffe66d","#1a535c"].join(", ")}
 */
`;default:return e.join(`
`)}});return{colors:i,exportFormat:o,prefix:d,exportResult:t,copyToClipboard:async()=>{try{await navigator.clipboard.writeText(t.value),localStorage.setItem("exportFormat",o.value),localStorage.setItem("exportPrefix",d.value),alert("Код скопирован в буфер обмена!")}catch(e){console.error("Ошибка копирования:",e),alert("Не удалось скопировать код")}},downloadFile:()=>{let e="txt",s="text/plain",l="palette-export";switch(o.value){case"css":e="css",l="colors";break;case"scss":e="scss",l="_colors";break;case"tailwind":e="js",s="application/javascript",l="tailwind.config.colors";break;case"json":e="json",s="application/json",l="palette";break;case"palette-types":e="md",l="palette-types-guide";break;case"mood-guide":e="md",l="color-mood-guide";break}const n=new Blob([t.value],{type:s}),c=URL.createObjectURL(n),r=document.createElement("a");r.href=c,r.download=`${l}.${e}`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(c),localStorage.setItem("exportFormat",o.value),localStorage.setItem("exportPrefix",d.value)}}}},V={class:"export-view"},I={class:"export-controls"},N={class:"control-group"},R={class:"control-group"},U={key:0,class:"current-palette-info"},L={class:"palette-preview"},O=["title"],P={class:"color-index"},D={class:"color-value"},M={class:"export-preview"},B={class:"code-block"},E={class:"export-actions"};function J(i,o,d,t,g,x){return v(),p("div",V,[o[9]||(o[9]=a("h2",null,"📤 Экспорт цветов",-1)),a("div",I,[a("div",N,[o[5]||(o[5]=a("label",null,"Формат экспорта:",-1)),m(a("select",{"onUpdate:modelValue":o[0]||(o[0]=e=>t.exportFormat=e),class:"format-select"},[...o[4]||(o[4]=[f('<option value="css" data-v-7ed450ad>CSS Variables</option><option value="scss" data-v-7ed450ad>SCSS Variables</option><option value="tailwind" data-v-7ed450ad>Tailwind Config</option><option value="json" data-v-7ed450ad>JSON</option><option value="plain" data-v-7ed450ad>Простой список</option><option value="palette-types" data-v-7ed450ad>Типы палитр (объяснение)</option><option value="mood-guide" data-v-7ed450ad>Гид по настроениям</option>',7)])],512),[[y,t.exportFormat]])]),a("div",R,[o[6]||(o[6]=a("label",null,"Имя префикса:",-1)),m(a("input",{"onUpdate:modelValue":o[1]||(o[1]=e=>t.prefix=e),placeholder:"color-",class:"prefix-input"},null,512),[[C,t.prefix]])])]),t.colors.length>0?(v(),p("div",U,[o[7]||(o[7]=a("h3",null,"Текущая палитра:",-1)),a("div",L,[(v(!0),p(j,null,h(t.colors,(e,s)=>(v(),p("div",{key:s,class:"preview-color",style:T({backgroundColor:e}),title:e},[a("span",P,u(s+1),1),a("span",D,u(e),1)],12,O))),128))])])):w("",!0),a("div",M,[o[8]||(o[8]=a("h3",null,"Предпросмотр:",-1)),a("pre",B,u(t.exportResult),1)]),a("div",E,[a("button",{onClick:o[2]||(o[2]=(...e)=>t.copyToClipboard&&t.copyToClipboard(...e)),class:"copy-btn"}," 📋 Копировать код "),a("button",{onClick:o[3]||(o[3]=(...e)=>t.downloadFile&&t.downloadFile(...e)),class:"download-btn"}," ⬇️ Скачать файл ")]),o[10]||(o[10]=f('<div class="export-info" data-v-7ed450ad><h3 data-v-7ed450ad>📝 Информация для экспорта</h3><div class="info-grid" data-v-7ed450ad><div class="info-card" data-v-7ed450ad><h4 data-v-7ed450ad>CSS Variables</h4><p data-v-7ed450ad>Используйте для веб-проектов. Совместимо со всеми современными браузерами.</p></div><div class="info-card" data-v-7ed450ad><h4 data-v-7ed450ad>SCSS Variables</h4><p data-v-7ed450ad>Для проектов на Sass/SCSS. Поддерживает миксины и функции.</p></div><div class="info-card" data-v-7ed450ad><h4 data-v-7ed450ad>Tailwind Config</h4><p data-v-7ed450ad>Готовый конфиг для Tailwind CSS. Просто скопируйте в tailwind.config.js</p></div><div class="info-card" data-v-7ed450ad><h4 data-v-7ed450ad>Типы палитр</h4><p data-v-7ed450ad>Подробное объяснение различных типов цветовых схем с примерами.</p></div></div></div>',1))])}const q=S(F,[["render",J],["__scopeId","data-v-7ed450ad"]]);export{q as default};
