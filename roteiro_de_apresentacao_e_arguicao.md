# Roteiro de Apresentação e Guia de Arguição da Banca
**Seminário de Cálculo B — Casca de Esfera (UFPel / IFM / CLMD / UAB)**  
**Tema Sorteado:** Região delimitada por duas esferas concêntricas  
**Professor Formador:** Prof. Pedro Antonio Ourique  
**Data:** 02 de dezembro de 2026, às 19h  
**Equipe:** Ariane Teixeira Pereira, Daniel Cemin Militão e Davi Vargas Limeira

---

## 👥 Sugestão de Divisão Entre os 3 Integrantes (5 Partes)
* **Integrante 1 — PARTE 1 + Início da PARTE 2 (Slides 1 a 4):** Círculo ($\mathbb{R}^2$) $\to$ Rotação ($360^\circ \to$ Esfera) $\to$ Riemann & Discos $\to$ Dedução completa de $V_{\text{esfera}} = \frac{4}{3}\pi R^3$.
* **Integrante 2 — Conclusão da PARTE 2 + PARTE 3 (Slides 5 a 10):** Construção da Casca ($R, r, \mathbb{R}^3$, Revolução, GeoGebra) $\to$ Volume da Casca ($V_{\text{ext}} - V_{\text{int}}$ e $\frac{dV}{dR}=4\pi R^2$) $\to$ Problema 1 (ENEM PPL 2023).
* **Integrante 3 — PARTE 4 + PARTE 5 (Slides 11 a 15):** Problema 2 Autoral (Reservatório + GeoGebra 2×2 + Integral do concreto + Limitações) $\to$ Conclusão e Encerramento.

---

## ⏱️ Roteiro de Fala — Sequência Contínua (16 Telas, 15–18 Minutos)

### TELA 00 (1/16) — Capa Oficial
* **Fala:** *"Boa noite ao professor Pedro Antonio Ourique, tutores e colegas. Nosso seminário estuda a **Casca de Esfera**. Seguimos uma trilha contínua em 5 partes: primeiro construímos o círculo e geramos uma esfera deduzindo seu volume via integral; depois relacionamos duas esferas concêntricas para deduzir o volume da casca; e encerramos com dois problemas práticos e análise crítica."*

### SLIDE 01 (2/16 — PARTE 1 / Etapa 1): Círculo, Semicírculo e Propriedades ($\mathbb{R}^2$)
* **Fala:** *"Começamos pelo bloco mais simples: no plano $\mathbb{R}^2$, um ponto $(x,y)$ do círculo de raio $R$ forma um triângulo retângulo de hipotenusa $R$, logo $x^2 + y^2 = R^2$. Mas a circunferência completa **não é uma função**, pois cada $x$ tem duas imagens ($+y$ e $-y$). Escolhendo só o arco superior ($y \ge 0$), surge a função $f(x) = \sqrt{R^2-x^2}$, que girando em $360^\circ$ no eixo $x$ já varre toda a esfera sem duplicar o volume."*  
*(Alterne `1. Triângulo → f(x)`, `2. Eixo x ⇒ f(x)`, `3. Só y ≥ 0`)*

### SLIDE 02 (3/16 — PARTE 1 / Etapa 2): Rotação $360^\circ$ do Semicírculo: Surge a Esfera
* **Fala:** *"Ao girar a função $f(x) = \sqrt{R^2-x^2}$ em $360^\circ$ ao redor do eixo $x$, nasce a **esfera sólida no $\mathbb{R}^3$**. Para achar seu volume, imaginamos cortar a esfera em fatias finíssimas como se fossem **moedas (cilindros finos)** de raio $f(x)$ e espessura $\Delta x$, onde cada moeda vale aproximadamente $\Delta V \approx \pi[f(x)]^2\Delta x$."*  
*(Mostre a esfera única se formando em 3D)*

### SLIDE 03 (4/16 — PARTE 2 / Etapa 3a): Substituir $f(x)$, Cancelar a Raiz e Somar os Discos
* **Fala:** *"Abrindo a Parte 2, anunciamos no topo o objetivo: **deduzir $V_{\text{esfera}} = \frac{4}{3}\pi R^3$**. Substituímos $f(x) = \sqrt{R^2-x^2}$ na moeda $\pi[f(x)]^2\Delta x$ e o quadrado **cancela a raiz na hora**: $\pi(R^2-x^2)\Delta x$. Somando todas as fatias com $\Delta x \to 0$ e tirando a constante $\pi$ da integral, chegamos a $\pi\int_{-R}^R (R^2-x^2)\,dx$."*  
*(Arraste `Fatias n` de `8` a `40` e mostre o disco varrendo a esfera 3D)*

### SLIDE 04 (5/16 — PARTE 2 / Etapa 3b): Dedução do Volume da Esfera ($\frac{4}{3}\pi R^3$)
* **Fala:** *"Partindo direto da integral já simplificada do Slide 3, integramos termo a termo chegando na primitiva $P(x) = R^2x - \frac{x^3}{3}$. No Passo 2, substituímos os limites $R$ e $-R$, transformamos $R^3$ em $\frac{3R^3}{3}$ para igualar os denominadores e somamos $\frac{2R^3}{3} + \frac{2R^3}{3}$, fechando no **quadro verde em destaque: $V_{\text{esfera}} = \frac{4}{3}\pi R^3$**."*

### SLIDE 05 (6/16 — PARTE 2 / Etapa 4a): Construção da Casca Esférica ($R, r, \mathbb{R}^3$)
* **Fala:** *"Com a esfera cheia deduzida, anunciamos a **próxima dedução no topo: a fórmula da casca esférica, $V_{\text{casca}} = \frac{4}{3}\pi(R^3-r^3)$**. Relacionamos duas esferas concêntricas: externa ($R=5$) e cavidade oca ($r=3$), de espessura $e = R - r = 2$ e conjunto $\mathcal{S}$ com $r^2 \le x^2 + y^2 + z^2 \le R^2$."*  
*(Alterne `1. Esfera − Miolo`, `2. Do 2D ao 3D`, `3. Casca`)*

### SLIDE 06 (7/16 — PARTE 2 / Etapa 4b): Região Geradora $\mathcal{R}$ e Revolução $360^\circ$
* **Fala:** *"Voltando ao plano $\mathbb{R}^2$ com os dois raios $R=5$ e $r=3$, a faixa azul $\mathcal{R}$ entre $f(x)=\sqrt{25-x^2}$ e $g(x)=\sqrt{9-x^2}$ gira $360^\circ$ no eixo $x$ e gera a casca sólida tridimensional com o miolo oco preservado."*

### SLIDE 07 (8/16 — PARTE 2 / Etapa 4c): Modelagem no GeoGebra ($R=5,\; r=3$)
* **Fala:** *"No GeoGebra declaramos exatamente $f(x)=\sqrt{R^2-x^2}\xrightarrow{R=5}\sqrt{25-x^2}$ e $g(x)=\sqrt{r^2-x^2}\xrightarrow{r=3}\sqrt{9-x^2}$ (visto no bloco azul acima do gráfico) e confirmamos à direita o sólido de revolução em 3D."*

### SLIDE 08 (9/16 — PARTE 2 / Etapa 5): Fórmula Final da Casca ($V_{\text{ext}} - V_{\text{int}}$)
* **Fala:** *"Agora fechamos a **segunda dedução anunciada ($V_{\text{casca}} = \frac{4}{3}\pi(R^3-r^3)$)**: usando o resultado do Slide 4 para $R$ e para $r$, subtraímos $V_{\text{ext}} - V_{\text{int}}$ e obtemos a **fórmula em destaque no quadro verde: $V_{\text{casca}} = \frac{4}{3}\pi(R^3-r^3)$**. Testando com o modelo $R=5,\; r=3$, obtemos $\frac{392\pi}{3} \approx 410{,}50$ — fórmula pronta para resolver os dois problemas práticos!"*

### SLIDE 09 (10/16 — PARTE 3): Problema 1: Bola de Chocolate Oca (ENEM PPL 2023)
* **Fala:** *"Aplicamos a fórmula do Slide 8 na Questão 159 do ENEM PPL 2023 (Caderno Azul / INEP): diâmetro $20\text{ cm} \implies R = 10\text{ cm}$, espessura $e = 1\text{ cm} \implies r = 9\text{ cm}$."*  
*(Alterne `Corte 90°` / `Raio-X` no modelo 3D)*

### SLIDE 10 (11/16 — PARTE 3): Resolução: Volume, SI e Massa
* **Fala:** *"Substituindo $R=10$ e $r=9$: $10^3 - 9^3 = 271$, logo $V = \frac{1.084\pi}{3}\text{ cm}^3 \approx 1.135{,}16\text{ cm}^3$ ($\approx 0{,}001135\text{ m}^3$ no SI). Usando $1\text{ g} \leftrightarrow 0{,}75\text{ cm}^3$, achamos $M = \frac{4.336\pi}{9}\text{ g} \approx 1.513{,}55\text{ g}$ (Gabarito C)."*

### SLIDE 11 (12/16 — PARTE 4): Problema 2: Reservatório Esférico de Água
* **Fala:** *"Na aplicação inédita, projetamos um reservatório esférico de concreto armado (menor área externa para o mesmo volume de água) com câmara de água $r = 2{,}0\text{ m}$ e parede $e = 0{,}5\text{ m}$ ($R = 2{,}5\text{ m}$), pedindo o volume de concreto via integral definida."*

### SLIDE 12 (13/16 — PARTE 4): GeoGebra 4-em-1 do Reservatório
* **Fala:** *"Reunimos as 4 vistas do GeoGebra: curvas 2D ($f(x)=\sqrt{6{,}25-x^2}$ e $g(x)=\sqrt{4-x^2}$), seção $180^\circ$, superfície paramétrica 3D e casca translúcida."*

### SLIDE 13 (14/16 — PARTE 4): Volume de Concreto via Integral Definida
* **Fala:** *"Resolvendo a integral de $[-2{,}5; 2{,}5]$ menos $[-2{,}0; 2{,}0]$, chegamos em $V_{\text{concreto}} = \frac{30{,}5\pi}{3} \approx 31{,}94\text{ m}^3$ — cerca de 4 caminhões-betoneira para comportar $33.510\text{ litros}$ de água."*

### SLIDE 14 (15/16 — PARTE 4): Viabilidade Prática e Limitações
* **Fala:** *"Destacamos as limitações práticas: base estrutural reforçada para suportar a casca carregada e perfurações de canos e tampa de inspeção que quebram a casca contínua ideal."*  
*(Clique em `2. Parede e Água` e `3. Limitações (Canos)`)*

### TELA 15 (16/16 — PARTE 5): Conclusão e Encerramento
* **Fala:** *"Encerramos conectando toda a trilha: Círculo $\to$ Rotação $\to$ Esfera $\to$ Casca $\to$ Volume da Casca $\to$ Aplicações reais. Obrigado pela atenção, estamos à disposição para arguição!"*

---

## 🛡️ Guia Rápido de Arguição (Perguntas Prováveis da Banca)
1. **Por que restringir ao semiplano $y \ge 0$?** Primeiro porque a circunferência completa $x^2+y^2=R^2$ **não é uma função** (cada $x$ tem duas imagens $\pm y$), surgindo $f(x)=\sqrt{R^2-x^2}$; além disso, o giro de $360^\circ$ com apenas a metade superior não duplica o volume.
2. **Por que usar Discos duas vezes e não Arruelas diretamente?** Arruelas exigiriam quebrar em 3 integrais ($[-R,-r]$ discos, $[-r,r]$ arruelas, $[r,R]$ discos). Usar Discos em $f(x)$ e $g(x)$ e subtrair cancela a raiz $\sqrt{\cdot}$ e resolve em uma única expressão.
3. **Limitações do modelo no reservatório real?** Canos de entrada/saída, tampa de visita e fundação quebram a casca ideal contínua modelada pela integral.
