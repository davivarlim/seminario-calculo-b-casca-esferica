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

## 🌟 Estrutura da Apresentação Didática (23 Slides — 1 Tópico por Slide)

Estruturada de forma progressiva, visual e intuitiva ("bater o olho e explicar"), mantendo o rigor algébrico concentrado na **dedução (Parte 2)** e nos **dois problemas passo a passo (Partes 3 e 4)**:

1. **Slide 01 — Capa Oficial:** Cabeçalho institucional UFPel / IFM / CLMD / UAB, dados da disciplina e roteiro das 4 etapas.
2. **Slide 02 — PARTE 1: O que é um Semicírculo e seu Giro Gerador ($360^\circ$):**
   * *Tópico 1:* Partes do semicírculo (centro $C$, raio $R$, diâmetro $2R$ e arco $y = \sqrt{R^2-x^2} \ge 0$) em desenho 2D.
   * *Tópico 2:* Semicírculo gerador girando $360^\circ$ em torno do eixo $x$ até formar a esfera completa em 3D.
3. **Slide 03 — PARTE 1: De Onde Vem $V = \frac{4}{3}\pi R^3$? (Sem $\rho$):** Animação interativa em 7 etapas reproduzindo fatiamento em discos ($\Delta x \to 0$), giro horizontal do eixo $x$, Pitágoras com a altura $y$ ($x^2 + y^2 = R^2 \implies y^2 = R^2 - x^2$), integral em $[-R, R]$ e soma $\frac{2}{3} + \frac{2}{3} = \frac{4}{3}$.
4. **Slide 04 — PARTE 1: Da Esfera Cheia à Casca Esférica ($R$ e $r$):** Subtração visual `Esfera(R=5) − Cavidade(r=3) = Casca(e=2)`.
5. **Slide 05 — PARTE 1: Definição no $\mathbb{R}^3$ e Origem de $d_{xy}$ e $d$:** Distância no plano da base ($d_{xy}^2 = x^2 + y^2$), subida em $z$ ($d^2 = x^2 + y^2 + z^2$) e etapas interativas no diagrama 3D.
6. **Slide 06 — PARTE 1: Por Que Isolar $y$ (e Não $x$ ou $z$)?** Papel do eixo de rotação $x$, por que $y$ vira o raio do disco ($y = f(x)$), ausência de $z$ no plano 2D e escolha do sinal positivo $y \ge 0$.
7. **Slide 07 — PARTE 1: Região Geradora $\mathcal{R}$ e Revolução $360^\circ$ ($R=5, r=3$):** Intervalos $[-R, R]$ e $[-r, r]$, curvas $f(x)$ e $g(x)$, gráfico 2D e revolução $360^\circ$ em 3D.
8. **Slide 08 — PARTE 1: Elementos Constituintes (5 Desenhos):** Centro $C(0,0,0)$, Raio Externo $R$, Raio Interno $r$, Espessura $e = R - r$ e Simetria $O(3)$.
9. **Slide 09 — PARTE 1: Modelagem no GeoGebra ($R=5, r=3$):** Região 2D e sólido de revolução 3D.
10. **Slide 10 — PARTE 2: Da Soma de Riemann à Integral Definida:** Fatiamento em $n$ discos, limite ($\Delta x \to 0$) e canvas interativo ($n = 4$ a $40$ fatias).
11. **Slide 11 — PARTE 2: Método dos Discos (Arruelas) vs. Cascas Cilíndricas:** Justificativa da escolha e fatiamento 3D animado ($A(x) = \pi(R^2 - r^2)$ no miolo).
12. **Slide 12 — PARTE 2: Montagem e Propriedades Operatórias:** Subtração de volumes, cancelamento $(\sqrt{u})^2 = u$ e linearidade da integral.
13. **Slide 13 — PARTE 2: Antiderivada (Primitiva):** Regra da constante ($\int R^2 dx = R^2 x$) e regra da potência ($\int x^2 dx = x^3/3$).
14. **Slide 14 — PARTE 2: Teorema Fundamental do Cálculo:** Avaliação em $[-R, R]$ e $[-r, r]$ até $\frac{4}{3}\pi R^3$ e $\frac{4}{3}\pi r^3$.
15. **Slide 15 — PARTE 2: Fórmula Final e Interpretação Geométrica:** $V_{\text{casca}} = \frac{4}{3}\pi(R^3 - r^3)$, conexão com $\frac{dV}{dR} = 4\pi R^2$ e corte 3D 90°.
16. **Slide 16 — PARTE 3: Problema Referenciado — Bola de Chocolate (ENEM PPL 2023, Q. 159 / INEP):** Enunciado real citado ($d = 20\text{ cm} \implies R = 10\text{ cm}$, $e = 1\text{ cm} \implies r = 9\text{ cm}$, $1\text{ g} \leftrightarrow 0{,}75\text{ cm}^3$) e modelo 3D em corte/raio-X.
17. **Slide 17 — PARTE 3: Resolução Passo a Passo, Massa e Unidades SI:** $V = \frac{1084\pi}{3}\text{ cm}^3 \approx 1.135{,}16\text{ cm}^3 \approx 0{,}001135\text{ m}^3$, massa $\frac{4336\pi}{9}\text{ g} \approx 1.513{,}55\text{ g}$ (Gabarito C) e slider 3D de corte.
18. **Slide 18 — PARTE 4: Problema Autoral — Reservatório Esférico de Água em Concreto:** Modelagem ($r = 2{,}0\text{ m}$ água, $e = 0{,}5\text{ m}$ parede de concreto, $R = 2{,}5\text{ m}$) e visualizador 3D em corte/raio-X.
19. **Slide 19 — PARTE 4: GeoGebra (1/2) — Curvas 2D e Seção $180^\circ$:** Curvas geradoras e meia-casca do reservatório.
20. **Slide 20 — PARTE 4: GeoGebra (2/2) — 3D Paramétrico e Casca Translúcida:** Parametrização analítica e cavidade interna de água.
21. **Slide 21 — PARTE 4: Volume de Concreto e Massa via Integral Definida:** Resolução analítica completa ($V_{\text{concreto}} \approx 31{,}94\text{ m}^3$), massa ($M \approx 76{,}7\text{ t}$) e capacidade interna ($33.510\text{ L}$).
22. **Slide 22 — PARTE 4: Discussão Crítica e Limitações do Modelo:** Fundação, peso de $\approx 76{,}7\text{ toneladas}$ e perfurações de canos/tampa no visualizador 3D.
23. **Slide 23 — Conclusão e Considerações Finais:** Síntese da jornada do seminário e abertura para arguição da banca.

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
