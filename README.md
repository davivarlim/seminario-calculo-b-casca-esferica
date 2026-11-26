# Seminário de Cálculo B — Casca de Esfera (UFPel)
**Universidade Federal de Pelotas &bull; Instituto de Física e Matemática**  
**Curso de Licenciatura em Matemática a Distância (CLMD / UAB)**  
**Tema Sorteado:** Casca de Esfera (Região delimitada por duas esferas concêntricas)  
**Professor Formador:** Prof. Pedro Antonio Ourique  
**Data do Seminário Presencial:** 02 de dezembro de 2026, às 19h  
**Equipe de Apresentação:**
1. Ariane Teixeira Pereira
2. Daniel Cemin Militão
3. Davi Vargas Limeira

> 🌐 **Apresentação Interativa Online (GitHub Pages):**  
> ### 👉 **[https://davivarlim.github.io/seminario-calculo-b-casca-esferica/](https://davivarlim.github.io/seminario-calculo-b-casca-esferica/)**

---

## 🌟 Sequência Lógica em 5 Partes / 6 Etapas (16 Telas)

Construída para seguir o raciocínio contínuo **1. Círculo $\to$ 2. Rotação do Círculo $\to$ 3. Dedução do Volume da Esfera $\to$ 4. Construção da Casca Esférica $\to$ 5. Dedução do Volume da Casca $\to$ 6. Aplicações e Conclusão**:

0. **Capa (`1 de 16`) — Abertura Institucional:** Dados da UFPel / IFM / CLMD / UAB, equipe e mapa das 5 Partes.
1. **Slide 1 (`2 de 16`) — PARTE 1 (Etapa 1): Círculo, Semicírculo e Propriedades ($\mathbb{R}^2$):** Do triângulo retângulo ($x^2 + y^2 = R^2$) à função $f(x) = \sqrt{R^2 - x^2}$ ($y \ge 0$), explicando por que a circunferência completa não é função e como o giro evita duplicação.
2. **Slide 2 (`3 de 16`) — PARTE 1 (Etapa 2): Rotação $360^\circ$ do Semicírculo: Surge a Esfera:** Rotação contínua de $f(x) = \sqrt{R^2-x^2}$ no eixo $x$ formando a esfera no $\mathbb{R}^3$ e aproximação por fatia cilíndrica ($\Delta V \approx \pi[f(x)]^2\Delta x$).
3. **Slide 3 (`4 de 16`) — PARTE 2 (Etapa 3a): Volume da Esfera — Cancelamento da Raiz e Riemann:** Substituição de $f(x)$ para cancelar a raiz na hora ($\pi(R^2-x^2)\Delta x$) e passagem ao limite até $V_{\text{esfera}} = \pi\int_{-R}^R (R^2-x^2)\,dx$.
4. **Slide 4 (`5 de 16`) — PARTE 2 (Etapa 3b): Dedução do Volume da Esfera ($V_{\text{esfera}} = \frac{4}{3}\pi R^3$):** Integração termo a termo ($P(x) = R^2x - \frac{x^3}{3}$), Teorema Fundamental do Cálculo e denominador comum $3$ ($\frac{3R^3}{3} - \frac{R^3}{3}$) demonstrando a origem do $\frac{4}{3}\pi R^3$.
5. **Slide 5 (`6 de 16`) — PARTE 2 (Etapa 4a): Construção da Casca Esférica ($R, r, \mathbb{R}^3$):** Relação entre duas esferas concêntricas ($R=5$, $r=3$, $e=R-r=2$), conjunto $\mathcal{S} = \{(x,y,z)\in\mathbb{R}^3 \mid r^2 \le x^2+y^2+z^2 \le R^2\}$ e ponte $V_{\text{casca}} = V_{\text{esfera}}(R) - V_{\text{esfera}}(r)$.
6. **Slide 6 (`7 de 16`) — PARTE 2 (Etapa 4b): Região Geradora $\mathcal{R}$ e Revolução $360^\circ$ ($R=5, r=3$):** Curvas $f(x)=\sqrt{R^2-x^2}$ e $g(x)=\sqrt{r^2-x^2}$ no plano $\mathbb{R}^2$ girando para formar a casca em 3D.
7. **Slide 7 (`8 de 16`) — PARTE 2 (Etapa 4c): Modelagem da Casca no GeoGebra ($R=5, r=3$):** Declaração explícita de $f(x)=\sqrt{R^2-x^2}\to\sqrt{25-x^2}$ e $g(x)=\sqrt{r^2-x^2}\to\sqrt{9-x^2}$ acima dos gráficos 2D e 3D.
8. **Slide 8 (`9 de 16`) — PARTE 2 (Etapa 5): Fórmula Final da Casca Esférica ($V_{\text{ext}} - V_{\text{int}}$):** Aplicação do Método dos Discos em $[-R, R]$ e $[-r, r]$, destacando $V_{\text{casca}} = \frac{4}{3}\pi(R^3 - r^3)$, exemplo numérico ($R=5, r=3 \implies \approx 410{,}50$) e ponte direta para as aplicações.
9. **Slide 9 (`10 de 16`) — PARTE 3 (Etapa 6): Problema 1 — Bola de Chocolate Oca (ENEM PPL 2023):** Questão 159 (Caderno Azul / INEP), extração de $R=10\text{ cm}$ e $r=9\text{ cm}$ ($e=1\text{ cm}$) e modelo 3D.
10. **Slide 10 (`11 de 16`) — PARTE 3: Resolução: Volume, Unidades SI e Massa:** $V = \frac{1.084\pi}{3}\text{ cm}^3 \approx 1.135{,}16\text{ cm}^3 \approx 0{,}001135\text{ m}^3$ e $M = \frac{4.336\pi}{9}\text{ g} \approx 1.513{,}55\text{ g}$ (Gabarito C) com slider 3D.
11. **Slide 11 (`12 de 16`) — PARTE 4 (Etapa 6): Problema 2 — Reservatório Esférico de Água:** Problema autoral ($r = 2{,}0\text{ m}$ água, $e = 0{,}5\text{ m} \implies R = 2{,}5\text{ m}$), solicitando o **volume de concreto ($V_{\text{concreto}}$)**.
12. **Slide 12 (`13 de 16`) — PARTE 4: Modelagem no GeoGebra (Grade 2×2):** Curvas 2D, seção $180^\circ$, 3D paramétrico e casca translúcida com a câmara de água.
13. **Slide 13 (`14 de 16`) — PARTE 4: Volume de Concreto via Integral Definida:** Resolução analítica completa até $V_{\text{concreto}} \approx 31{,}94\text{ m}^3$ ($\approx 4$ betoneiras de $8\text{ m}^3$) com referência comparativa da capacidade interna ($33.510\text{ L}$).
14. **Slide 14 (`15 de 16`) — PARTE 4: Viabilidade Prática e Limitações do Modelo:** Discussão sobre fundação estrutural e perfurações reais (canos/tampa) em 3D.
15. **Tela 15 (`16 de 16`) — PARTE 5: Conclusão e Encerramento:** Retomada da jornada completa, relação entre Geometria Espacial e Cálculo Integral e abertura para arguição.

---

## 🚀 Tecnologias Utilizadas
* **HTML5 Semântico & CSS3 Responsivo:** Sem etapa de build, layout limpo de tela inteira (`1280×680`+) sem overflow.
* **KaTeX (CDN):** Renderização matemática LaTeX em fonte ampliada para projeção.
* **Canvas 2D & Three.js (r128) + OrbitControls:** Diagramas 2D interativos e cenas 3D em tempo real.
* **GeoGebra:** Modelagem geométrica analítica e paramétrica.

---

## ⌨️ Navegação
* **Setas $\leftarrow$ / $\rightarrow$ ou Barra de Espaço:** Navegar entre os 16 slides.
* **Teclas `Home` / `End`:** Ir para a Capa ou para a Conclusão.
* **Barra Superior (Pílulas `★ Capa`, `P1: 1–2`, `P2: 3–8`, `P3: 9–10`, `P4: 11–14`, `✔ Fim`):** Acesso direto em 1 clique.
* **Tecla `F`:** Alternar Modo Tela Cheia.
