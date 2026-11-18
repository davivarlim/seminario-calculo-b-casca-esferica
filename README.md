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

## 🌟 Estrutura da Apresentação Didática (19 Slides)

Estruturada com visual limpo e objetivo ("bater o olho e explicar"), barras de referência no topo de cada slide, dedução completa a partir do Teorema de Pitágoras e todas as visualizações interativas:

1. **Slide 01 — Capa Oficial:** Cabeçalho institucional UFPel / IFM / CLMD / UAB, dados da disciplina e roteiro das 4 etapas.
2. **Slide 02 — PARTE 1: Definição Formal no $\mathbb{R}^3$ e Pitágoras 3D:** Conjunto $\mathcal{S} = \{(x,y,z) \in \mathbb{R}^3 \mid r^2 \le x^2 + y^2 + z^2 \le R^2\}$, dedução da distância $d = \sqrt{x^2 + y^2 + z^2}$ e diagrama interativo 3D ($R=5, r=3$).
3. **Slide 03 — PARTE 1: Do Círculo de Pitágoras à Região Geradora $\mathcal{R}$ ($R=5, r=3$):** Origem da raiz em $x^2 + y^2 = R^2 \implies y = \pm\sqrt{R^2 - x^2}$, escolha de $y \ge 0$, intervalos $[-R, R]$ e $[-r, r]$, gráfico 2D didático e revolução $360^\circ$ em 3D.
4. **Slide 04 — PARTE 1: Elementos Constituintes (5 Desenhos):** Centro $C(0,0,0)$, Raio Externo $R$, Raio Interno $r$, Espessura $e=R-r$ e Simetria $O(3)$ com animações.
5. **Slide 05 — PARTE 1: Modelagem no GeoGebra ($R=5, r=3$):** Região 2D e sólido de revolução 3D.
6. **Slide 06 — PARTE 2: Da Soma de Riemann à Integral Definida:** Fatiamento em $n$ discos, passagem ao limite ($\Delta x \to 0$) e canvas interativo com slider de $n = 4$ a $40$ fatias.
7. **Slide 07 — PARTE 2: Método dos Discos (Arruelas) vs. Cascas Cilíndricas:** Justificativa da escolha e fatiamento 3D animado ($A(x) = \pi(R^2 - r^2)$ no miolo).
8. **Slide 08 — PARTE 2: Montagem e Propriedades Operatórias:** Subtração de volumes, cancelamento $(\sqrt{u})^2 = u$ e linearidade da integral.
9. **Slide 09 — PARTE 2: Antiderivada (Primitiva):** Regra da constante ($\int R^2 dx = R^2 x$) e regra da potência ($\int x^2 dx = x^3/3$).
10. **Slide 10 — PARTE 2: Teorema Fundamental do Cálculo:** Avaliação em $[-R, R]$ e $[-r, r]$ até $\frac{4}{3}\pi R^3$ e $\frac{4}{3}\pi r^3$.
11. **Slide 11 — PARTE 2: Fórmula Final e Interpretação Geométrica:** $V_{\text{casca}} = \frac{4}{3}\pi (R^3 - r^3)$, conexão com $\frac{dV}{dR} = 4\pi R^2$ e corte 3D 90°.
12. **Slide 12 — PARTE 3: Problema Industrial (Flutuador de Aço):** Enunciado ($R = 10\text{ cm}, e = 2\text{ cm} \implies r = 8\text{ cm}$) e modelo 3D em corte/raio-X/vista explodida.
13. **Slide 13 — PARTE 3: Resolução Passo a Passo, Unidades SI e Interpretação:** $V \approx 2044{,}13\text{ cm}^3 = 0{,}002044\text{ m}^3$ ($\approx 2{,}04\text{ L}$ de aço) e slider 3D de corte.
14. **Slide 14 — PARTE 4: Tanque Criogênico Aeroespacial ($LH_2$ a $-253^\circ\text{C}$):** Modelagem ($r = 2{,}0\text{ m}, R = 2{,}5\text{ m}, e = 0{,}5\text{ m}$) e tanque 3D em 3 camadas concêntricas.
15. **Slide 15 — PARTE 4: GeoGebra (1/2) — Curvas 2D e Seção $180^\circ$:** Curvas geradoras e meia-casca do tanque.
16. **Slide 16 — PARTE 4: GeoGebra (2/2) — 3D Paramétrico e Casca Translúcida:** Parametrização analítica e cavidade interna de $LH_2$.
17. **Slide 17 — PARTE 4: Volume da Casca de Perlita via Integral Definida:** Resolução integral analítica ($V \approx 31{,}94\text{ m}^3$) e massa estimada ($\approx 3.833\text{ kg} \approx 3{,}83\text{ t}$).
18. **Slide 18 — PARTE 4: Discussão Crítica e Limitações do Modelo:** Carga estrutural, contração térmica e perfurações por tubulações no visualizador 3D.
19. **Slide 19 — Conclusão e Considerações Finais:** Síntese da jornada do seminário e abertura para arguição da banca.

---

## 🚀 Tecnologias Utilizadas
* **HTML5 Semântico & CSS3 Responsivo:** Sem etapa de build, layout limpo de tela inteira em desktop e adaptável em janelas menores.
* **KaTeX (CDN):** Renderização matemática LaTeX.
* **Canvas 2D & Three.js (r128) + OrbitControls:** Gráficos interativos (Soma de Riemann e região geradora 2D) e cenas 3D em tempo real.
* **GeoGebra:** Modelagem geométrica analítica e paramétrica.

---

## ⌨️ Navegação
* **Setas $\leftarrow$ / $\rightarrow$ ou Barra de Espaço:** Navegar entre os slides.
* **Teclas `Home` / `End`:** Ir para a Capa ou para a Conclusão.
* **Barra Superior (Pílulas):** Acesso direto em 1 clique a qualquer slide.
* **Tecla `F`:** Alternar Modo Tela Cheia.
