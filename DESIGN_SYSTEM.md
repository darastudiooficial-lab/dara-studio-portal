# DARA Studio — Design System & Style Guide

Este documento contém o guia completo de estilos do DARA Studio Portal (SaaS). Ele descreve os tokens de design (fontes, tamanhos, paleta de cores) e especificações dos componentes (botões, glassmorphism) divididos por temas (Light e Dark Mode), para que a identidade visual seja padronizada e replicada em qualquer outro arquivo ou aplicação DARA.

---

## 1. Tipografia (Fontes e Tamanhos)

O sistema utiliza a biblioteca Google Fonts para entregar uma aparência premium que intercala o modernismo (Sans-Serif) com o luxo arquitetônico (Serif).

### Famílias de Fontes
- **Sans-Serif Principal:** `var(--font-sans)`
  - Famílias: `'Century Gothic'`, `sans-serif`
  - **Onde é usado:** Corpo de texto, parágrafos, inputs, botões, barras de navegação, tooltips e tabelas.
- **Serif Principal:** `var(--font-serif)`
  - Famílias: `'Playfair Display'`, `Georgia`, `serif`
  - **Onde é usado:** Títulos principais (Headings) e ênfases estéticas.

### Tamanhos e Pesos
- **Headings (Títulos Grandes):** 
  - `clamp(52px, 8vw, 80px)`
  - Variantes: Normal (`.heading-normal`) e Itálico (`.heading-italic`).
- **Botões e Navegação:** `13px`, peso `600` (Semi-Bold), letter-spacing `0.12em` (Maiúsculas).
- **Badges / Textos Pequenos:** `10px` a `11px`, peso `500`-`800`, letter-spacing `0.1em` a `0.18em`.
- **Accent Color:** `--color-sage: #7D9F85` (usado para títulos em destaque e interações hover).

---

## 2. Paleta de Cores e Temas

O sistema é gerido pela raiz do CSS (`:root` e `[data-theme='light']`), alternando automaticamente baseado na escolha do usuário.

### Cores de Marca (Brand Colors)
Estas cores são **imutáveis** e persistem em ambos os temas.
- **Brand Purple (Roxo Primário):** `#7B1FA2` (usado em hover states e ícones)
- **Brand Pink (Rosa Magenta):** `#E91E63`
- **Gradiente Principal da Marca:** `linear-gradient(135deg, #7B1FA2, #E91E63)` (usado nos botões principais e textos em destaque).

### 🌙 Dark Mode (Padrão)
O tema escuro foca em contraste brilhante com *neon glow* (brilho difuso roxo).

| Elemento | Variável CSS | Código Hex / RGBA | Onde é usado |
| :--- | :--- | :--- | :--- |
| **Fundo Principal** | `--bg-primary` | `#050505` | Background da página (body, LP, admin). |
| **Texto Secundário** | N/A | `#020203` | Fundo do Footer. |
| **Cor do Texto** | `--text-color` | `#ffffff` | Textos gerais, títulos e ícones. |
| **Vidro (Fundo)** | `--glass-bg` | `rgba(255, 255, 255, 0.05)` | Fundo de botões e cartões (glassmorphism). |
| **Vidro (Borda)** | `--glass-border` | `rgba(255, 255, 255, 0.1)` | Bordas de botões e cartões. |
| **Brilho Neon** | `--neon-glow` | `rgba(123, 31, 162, 0.4)` | Sombras de botões premium e estados de hover. |

### ☀️ Light Mode
O tema claro foca em minimalismo puro, alto contraste de leitura e redução da intensidade neon para garantir conforto ocular.

| Elemento | Variável CSS | Código Hex / RGBA | Onde é usado |
| :--- | :--- | :--- | :--- |
| **Fundo Principal** | `--bg-primary` | `#F8F8F7` | Background da página (body, LP, admin). |
| **Fundo Secundário**| `--bg-secondary` | `#FFFFFF` | Cartões ou containers superpostos. |
| **Cor do Texto** | `--text-color` | `#1A1A1A` | Textos gerais, títulos e ícones (forçado via CSS). |
| **Vidro (Fundo)** | `--glass-bg` | `rgba(0, 0, 0, 0.05)` | Fundo de botões e cartões (glassmorphism). |
| **Vidro (Borda)** | `--glass-border` | `rgba(0, 0, 0, 0.1)` | Bordas de botões e cartões. |
| **Brilho Neon** | `--neon-glow` | `rgba(123, 31, 162, 0.15)` | Sombras muito sutis. |

---

## 3. Botões e Componentes Interativos

**Regra Global DARA:** Para garantir uma interface perfeitamente alinhada e "Premium", todos os elementos interativos horizontais (Inputs, Selects, Botões primários e secundários) obedecem estritamente à mesma altura.
- **Altura Padrão:** `--interactive-height: 48px;`

### 1. Botão Primário Glow (`.btn-glow`)
O botão mais importante (Call to Action principal).
- **Fundo:** `linear-gradient(to right, #7B1FA2, #E91E63)`
- **Texto:** `#ffffff` (sempre branco, independente do tema).
- **Forma:** Arredondamento extremo (`border-radius: 999px`), altura `48px`, padding horizontal `32px`.
- **Efeito Visual:** Sombra neon (`box-shadow: 0 0 25px rgba(123, 31, 162, 0.5)`).
- **Interação (Hover):** O botão ganha um pequeno pulo geométrico (`transform: scale(1.05)`) e o glow aumenta (`box-shadow: 0 0 45px rgba(168, 85, 247, 0.9)`).

### 2. Botão Secundário Glass (`.glass-pill`)
Botão elegante para ações auxiliares (ex: ver portfólio, serviços).
- **Fundo:** `--glass-bg` (varia de acordo com Dark/Light).
- **Borda:** `1px solid var(--glass-border)`
- **Efeito Visual:** Desfoque de fundo (`backdrop-filter: blur(12px)`).
- **Interação (Hover):** Crescimento geométrico (`scale(1.02)`), borda assume a cor roxa primária (`border-color: var(--color-neon-purple)`) e altera opacidade para `0.9`. No modo claro, recebe uma leve camada preta adicional (`rgba(0,0,0,0.08)`).

### 3. Links de Navegação (`.glass-nav-link`)
Usados no cabeçalho e rodapé.
- **Cor Base:** `rgba(255, 255, 255, 0.6)` (Dark) ou `#1A1A1A` (Light).
- **Interação (Hover):** Mudança de cor para `#7B1FA2` (Purple), pequeno salto (`translateY(-1px)`) e sombra de texto sutil simulando glow (no Dark mode).

### 4. Entradas de Texto (`.glass-input`)
- **Altura:** `48px`
- **Raio da Borda:** `12px` (levemente mais quadrados que os botões).
- **Interação (Focus):** A borda acende na cor roxa (`border-color: var(--brand-purple)`) e reflete uma sombra roxa para sinalizar ao usuário a digitação ativa.

---

## 4. Como Replicar no Código

Ao criar novos componentes ou páginas, **NÃO** utilize cores hexadecimais *hardcoded* (fixas no código) para cenários onde a cor muda no fundo (branco/preto). 

Sempre utilize as variáveis nativas para que os modos Light/Dark sejam herdados de forma natural:

```css
/* Errado: */
.meu-card {
  background-color: #050505;
  color: #ffffff;
}

/* Certo: */
.meu-card {
  background-color: var(--bg-primary);
  color: var(--text-color);
  border: 1px solid var(--glass-border);
}
```

Para aplicar os botões corretamente no React/HTML, chame apenas as classes globais já configuradas no `index.css`:
```html
<!-- Primário Glow -->
<button class="btn-glow">Agendar Reunião</button>

<!-- Secundário Glass -->
<button class="glass-pill">Ver Portfólio</button>
```


### Custom Service Boxes
- **Green Box (`.service-box-green`)**: Used for included services. Border `rgba(16, 185, 129, 0.2)`. Title class `.service-box-green-title`.
- **Red Box (`.service-box-red`)**: Used for excluded services. Border `rgba(239, 68, 68, 0.2)`. Title class `.service-box-red-title`.

---

## ⚠️ CSS Safety Rules — PERMANENT (applies to every task)

Before AND after any CSS or styling change, verify all of the following:

1. **Import Check** — `index.css` must be imported in `client/src/main.jsx`. If missing, add it immediately.
2. **Variable Completeness** — All CSS variables used across the project (`var(--anything)`) must be defined in the `:root {}` block in `index.css`. No orphaned references.
3. **Fallback Integrity** — Every `var()` call must have a defined value or a fallback. If a variable is undefined, add it to `:root` or replace with the literal value.
4. **Visual Render Check** — The dev server must render the page visibly after any CSS change. A white screen or black screen means the task is NOT complete.

### Forbidden in this project forever
- ❌ Using `echo >> file.css` or any PowerShell redirect (`>>`) to append to CSS or Markdown files — this writes UTF-16 LE encoding and **corrupts the file**.
- ✅ Always use the `write_to_file`, `replace_file_content`, or `multi_replace_file_content` tools, or PowerShell `[System.IO.File]::WriteAllLines(..., UTF8Encoding(false))`.
