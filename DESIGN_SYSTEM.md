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
O design utiliza cores elegantes e arquitetônicas focadas em tons terra e creme.

### ☀️ Light Mode
O tema claro foca em minimalismo puro e alto contraste elegante.

| Elemento | Variável CSS | Código Hex / RGBA | Onde é usado |
| :--- | :--- | :--- | :--- |
| **Fundo** | `--bg` / `--surface` | `#f5f4f0` | Background da página e containers. |
| **Texto Principal** | `--ink` | `#1d1c1a` | Textos gerais e títulos. |
| **Texto Secundário** | `--text` / `--muted`| `#474440` / `#6d6a63` | Parágrafos e descrições. |
| **Destaque (Gold)** | `--accent` | `#9c7c3a` | Kickers, botões primários. |
| **Bordas** | `--hair` / `--hair2` | `#e3e0d8` / `#eae7df` | Bordas e linhas de separação. |

### 🌙 Dark Mode (Padrão)
O tema escuro foca em contraste sofisticado sem uso de neon.

| Elemento | Variável CSS | Código Hex / RGBA | Onde é usado |
| :--- | :--- | :--- | :--- |
| **Fundo** | `--bg` / `--surface` | `#26262a` | Background da página e containers. |
| **Texto Principal** | `--ink` | `#f1eee7` | Textos gerais e títulos. |
| **Texto Secundário** | `--text` / `--muted`| `#c5c1ba` / `#979489` | Parágrafos e descrições. |
| **Destaque (Gold)** | `--accent` | `#cda24e` | Kickers, botões primários. |
| **Bordas** | `--hair` / `--hair2` | `#3c3c42` / `#343439` | Bordas e linhas de separação. |

---

## 3. Botões e Componentes Interativos

**Regra Global DARA:** Para garantir uma interface "Premium", os elementos horizontais obedecem a linhas retas e blocos sólidos, sem arredondamentos extremos. A altura padrão interativa é de `48px`.

### 1. Botão Primário (Gold)
O botão principal (Call to Action).
- **Classe:** `.btn-primary`
- **Fundo:** `var(--accent)`
- **Cor do Texto:** `var(--bg)` (com override via `!important` para manter contraste)
- **Borda:** `1px solid var(--accent)`
- **Padding:** `16px 26px`
- **Altura:** `48px`
- **Tipografia:** `12px`, `font-weight: 600`, `letter-spacing: .13em`, Maiúsculas, fonte `var(--font-sans)`.
- **Interação (Hover):** Fundo e borda mudam para `var(--accentD)` com transição suave (`0.3s ease`).

### 2. Botão Secundário (Outline)
- **Classe:** `.btn-outline`
- **Fundo:** `none`
- **Cor do Texto:** `var(--ink)`
- **Borda:** `1px solid var(--ink)`
- **Altura:** `48px`
- **Interação (Hover):** Fundo muda para `var(--ink)` e texto para `var(--bg)` (efeito inverso).

### 3. Botões de Navegação e Pílulas (Pill / Sharp)
- **Pill Button (`.pill-button`):** Fundo `.glass-bg`, borda `.glass-border`, altura `40px`, padding `0 16px`, raio `4px` (única exceção levemente arredondada).
- **Sharp Portal Button (`.sharp-portal-btn`):** Fundo Gold constante, sem arredondamento, letras maiúsculas espaçadas (`letter-spacing: 0.1em`), altura `40px`. Usado no header.

### 4. Entradas de Texto (Inputs e Textareas)
- **Regras:** Todos os inputs possuem `height: 48px !important`.
- **Classes base:** `.glass-input`
- **Fundo:** `var(--surface2)`
- **Borda:** `var(--hair)`.
- **Foco:** Ao focar (`:focus`), a borda assume `var(--accent)` (`outline: none`).

---

## 4. Cards e Layout (Dimensões e Estrutura)

Os cards na plataforma seguem uma estrutura limpa e ortogonal, focando em separação de áreas através de bordas finas ao invés de sombras projetadas.

- **Fundo do Card:** Usar `var(--surface)` ou `var(--surface2)`.
- **Bordas do Card:** `1px solid var(--hair)`. Evite bordas duplas sem necessidade.
- **Paddings Padrão:** Internos devem oscilar entre `24px` e `32px` para garantir respiro (breathing room).
- **Service Boxes:** 
  - **Incluído (`.service-box-green`):** Borda verde sutil `rgba(16, 185, 129, 0.2)`.
  - **Excluído (`.service-box-red`):** Borda vermelha sutil `rgba(239, 68, 68, 0.2)`.
- **Background Stripe (`.bg-stripe`):** Usado para preencher áreas vazias ou destacar containers estéticos (usa um repeating-linear-gradient de `11px`).

---

## 5. Efeitos e Transições

O portal utiliza animações discretas (micro-interações) para reforçar a sensação de luxo e responsividade, sem sobrecarregar o usuário.

- **Transição Padrão:** `transition: all 0.3s ease;` em quase todos os hovers (botões, links).
- **Hover de Texto:** Links e navbars ganham `transform: translateY(-1px);` ou `scale(1.02)` e cor `var(--accent)` (Gold).
- **Animações (Keyframes):**
  - `@keyframes floatUp`: Transição vertical (`transform: translateY(18px)`) até `0` acompanhada de `opacity: 0` até `1`.
  - `@keyframes fadeIn`: Entrada limpa com opacidade.
  - `@keyframes drawLine`: Usado em separadores visuais crescendo horizontalmente (`scaleX(0)` to `1`).

---

## 6. Glassmorphism e Estilos de Superfície

Para integrar componentes ao fundo, especialmente modais ou overlays:

- **Premium Glass (`.glass-premium`):** 
  - Fundo sólido baseado no tema: `var(--surface)`
  - Borda discreta: `var(--hair)`
  - *Nota:* O glassmorphism clássico com blur foi achatado (flat) nas atualizações recentes para reforçar o minimalismo arquitetônico. Evitar `backdrop-filter` pesado, preferir cores sólidas do tema escuro/claro.

---

## 7. Como Replicar no Código

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
  background-color: var(--bg);
  color: var(--ink);
  border: 1px solid var(--hair);
}
```

Para aplicar os botões corretamente no React/HTML, chame apenas as classes globais já configuradas no `index.css`:
```html
<!-- Primário Gold -->
<button class="btn-primary">Agendar Reunião</button>

<!-- Secundário Outline -->
<button class="btn-outline">Ver Portfólio</button>
```

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
