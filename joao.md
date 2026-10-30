```markdown
# Portfólio — João Henrique

Site de portfólio pessoal construído **apenas com HTML, CSS e JavaScript puro** — sem Bootstrap, Tailwind, React ou qualquer framework/biblioteca.

Identidade visual: **Cyber Minimalista** (futurista, tecnológico, elegante e premium).

## Estrutura do projeto

```
index.html    → marcação semântica de todas as seções
style.css     → design system completo (variáveis, componentes, animações, responsividade)
script.js     → interações (canvas, reveal, filtros, validação, cursor etc.)
```

## Como abrir

- Basta abrir `index.html` no navegador, **ou**
- Rodar um servidor local (recomendado):

```bash
python3 -m http.server 8080
# acesse http://localhost:8080
```

A pré-visualização ao vivo também está disponível pelo servidor iniciado no workspace (porta 8080).

## Interface sem ícones

O site foi construído sem ícones, emojis ou glifos decorativos: a hierarquia é feita só com tipografia, hairlines, cor e movimento. As únicas marcas gráficas são o monograma "JH" e os pontos da linha do tempo (CSS puro).

## Identidade aplicada

| Token | Valor |
|---|---|
| Cor principal | `#00E5FF` (ciano) |
| Cor de destaque | `#7B2FFF` (violeta) |
| Cor secundária | `#171717` |
| Fundo | `#0A0A0A` |
| Títulos | Poppins ExtraBold (fallback system-ui) |
| Textos | Inter (fallback system-ui) |

Todas as cores, fontes, raios, sombras e tempos de animação estão centralizados em variáveis CSS no topo do `style.css` (`:root`) — mudar a paleta é editar 6 linhas.

## Seções

1. **Hero** — nome, cargo com efeito de digitação, frase de apresentação, estatísticas animadas e cartão-terminal com o "objeto" do desenvolvedor.
2. **Sobre** — apresentação, diferenciais e cartão de perfil (turma, local, status, foco).
3. **Habilidades** — barras de proficiência animadas + quatro cards de stack (Front-End, Back-End, Dados, Ferramentas).
4. **Projetos** — 3 repositórios reais com filtro (Todos / Back-End / Front-End). **O card inteiro é clicável** e abre o repositório no GitHub em nova aba:

| Projeto | Stack | Repositório |
|---|---|---|
| Sky Fit API | Node.js · Express · SQLite (better-sqlite3) | `Trabalho-Sky-fit` |
| API de Carros — Flask | Python · Flask · SQLAlchemy | `Aula-Kaua-da-r15-` |
| GovCo-Lab | HTML · CSS · JavaScript (single page) | `Govlab-site-` |

5. **Jornada** — linha do tempo: 2022 (primeiro contato), 2025 (ingresso no técnico), 2026 (foco em back-end), Hoje (final do 2º ano B).
6. **Contato** — formulário com validação em tempo real + dados de contato e GitHub.
7. **Footer** — navegação, redes e créditos.

## Recursos JavaScript (tudo vanilla)

- Preloader com barra de progresso e trava de segurança
- Cursor personalizado (anel com interpolação + ponto)
- Canvas de partículas conectadas, com reação ao mouse e pausa quando a aba fica oculta
- Barra de progresso de scroll, header que encolhe e botão "voltar ao topo"
- Menu mobile acessível (Esc, `aria-expanded`, trava de scroll)
- Reveal on scroll com `IntersectionObserver` e atrasos escalonados
- Contadores animados e barras de skill que preenchem ao entrar na viewport
- Filtro de projetos com estado `aria-selected`
- Tilt 3D e brilho que segue o mouse nos cards
- Validação de formulário (nome, e-mail com regex, assunto, mensagem) e envio simulado
- `prefers-reduced-motion` respeitado em todas as animações
- Ano do rodapé automático

## Personalização rápida

- **Textos/links:** edite direto no `index.html`.
- **Projetos:** duplique um `<article class="project" data-category="backend">` e ajuste o `href` do `<a class="project__link">`, o título, a descrição e a linha `project__tech`. Categorias dos filtros: `backend` e `frontend`.
- **Níveis de skill:** `data-level="82"` na barra e o texto `82%` no cabeçalho.
- **E-mail:** `joaoparedes34@gmail.com` já aplicado no contato, no rodapé e nos links `mailto`.
- **Enviar o formulário de verdade:** no `script.js`, `initForm()` — troque o `setTimeout` de envio por um `fetch()` para seu endpoint (Formspree, API própria etc.).

## Acessibilidade e performance

- HTML semântico, `skip-link`, foco visível, `aria-*` nos controles
- Contraste alto sobre fundo escuro
- Sem dependências externas além das fontes Google (com fallback de sistema)
- Canvas limitado por DPR e pausado em abas ocultas

> Observação: os arquivos `AGENTS.md`, `referencias.md`, `identidade.md` e `funcionalidades.md` citados no briefing não estavam presentes no workspace. Se forem anexados, o projeto pode ser alinhado às especificações exatas.
```

---

Os quatro estão completos e na ordem que você pediu. Para rodar: salve os arquivos com exatamente esses nomes (`index.html`, `style.css`, `script.js`, `README.md`) **na mesma pasta** e abra o `index.html` — o CSS e o JS são referenciados por caminho relativo.

Se algum bloco tiver vindo cortado na sua tela, me diga qual (por exemplo, "o CSS parou no meio") que eu reenvio só aquele arquivo inteiro. Eles também continuam intactos no workspace, junto com o `portfolio-joao-henrique.zip`.