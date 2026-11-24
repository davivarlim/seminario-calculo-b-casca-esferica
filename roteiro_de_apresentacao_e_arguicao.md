# Roteiro de Apresentação e Guia de Arguição da Banca
**Seminário de Cálculo B — Casca de Esfera (UFPel / IFM / CLMD / UAB)**  
**Tema Sorteado:** Região delimitada por duas esferas concêntricas  
**Professor Formador:** Prof. Pedro Antonio Ourique  
**Data:** 02 de dezembro de 2026, às 19h  
**Equipe:** Ariane Teixeira Pereira, Daniel Cemin Militão e Davi Vargas Limeira

---

## ⏱️ Roteiro de Fala Objetivo — 23 Slides (15 a 20 Minutos)

> **Dica para a apresentação presencial:** cada slide traz um tópico claro e visual — **não leia a tela**. Use os blocos curtos como apoio para falar com naturalidade, como em uma aula. A barra `REFERÊNCIAS:` no topo explica cada letra antes mesmo de começar a fórmula.

### SLIDE 01: Capa Oficial
* **Fala:** *"Boa noite ao professor Pedro Antonio Ourique, tutores e colegas. Somos Ariane Teixeira Pereira, Daniel Cemin Militão e Davi Vargas Limeira, da Licenciatura em Matemática a Distância (UFPel / IFM / CLMD / UAB). Nosso seminário trata da **Casca de Esfera** — partindo da base geométrica mais simples até a dedução pela integral e duas aplicações práticas."*  
*(Clique em `Iniciar Apresentação →`)*

### SLIDE 02 (PARTE 1): O que é um Semicírculo e seu Giro Gerador ($360^\circ$)
* **Fala:** *"Começamos pelo bloco mais simples: no Tópico 1 à esquerda vemos as partes de um **semicírculo** — centro $C(0,0)$, diâmetro $2R$ sobre o eixo $x$, raio $R$ e o arco superior $y = \sqrt{R^2-x^2} \ge 0$. No Tópico 2, ao clicarmos em `Girar Semicírculo`, esse arco gira $360^\circ$ em torno do eixo $x$ e gera a **esfera completa**."*  
*(Clique em `🔄 Girar Semicírculo`)*

### SLIDE 03 (PARTE 1): De Onde Vem o Volume da Esfera ($V = \frac{4}{3}\pi R^3$)?
* **Fala:** *"Agora explicamos de onde surgiu o $4/3$ na fórmula da esfera: cortamos a esfera em discos finos ($\Delta x \to 0$) e giramos o eixo $x$ para a horizontal. Em cada fatia, o raio da esfera é $R$ e o raio do disco é a altura $y$, logo por Pitágoras $x^2 + y^2 = R^2 \implies y^2 = R^2 - x^2$. Integrando $\pi(R^2-x^2)$ de $-R$ até $R$, avaliamos nos extremos e somamos $\frac{2}{3} - \left(-\frac{2}{3}\right) = \frac{4}{3}$, obtendo $V = \frac{4}{3}\pi R^3$."*  
*(Use os botões `1` a `7` para destacar cada etapa)*

### SLIDE 04 (PARTE 1): Da Esfera Cheia à Casca Esférica ($R$ e $r$)
* **Fala:** *"Sabendo calcular uma esfera cheia de raio $R$, basta retirar de dentro uma esfera menor (miolo oco de raio $r$). O que sobra ao redor é a **Casca Esférica** de espessura $e = R - r$ e volume $V(R) - V(r)$."*

### SLIDE 05 (PARTE 1): Definição no $\mathbb{R}^3$ e Origem de $d_{xy}$ e $d$
* **Fala:** *"Formalizando no espaço $\mathbb{R}^3$, aplicamos Pitágoras duas vezes: no chão temos $d_{xy}^2 = x^2 + y^2$, e subindo $z$ na vertical obtemos a distância 3D $d^2 = x^2 + y^2 + z^2$. Para pertencer à parede sólida, $r \le d \le R$, ou sem raiz: $r^2 \le x^2 + y^2 + z^2 \le R^2$."*  
*(Use os botões `1. Chão dₓᵧ`, `2. Subida z` e `3. Casca`)*

### SLIDE 06 (PARTE 1): Por Que Isolar $y$ (e Não $x$ ou $z$)?
* **Fala:** *"Como giramos em torno do eixo horizontal $x$, a distância até esse eixo é a coordenada $y$ — que se torna o raio de cada disco! Além disso, escolhemos só o sinal positivo $y \ge 0$ para que o giro de $360^\circ$ não conte o volume duas vezes."*

### SLIDE 07 (PARTE 1): Região Geradora $\mathcal{R}$ e Revolução $360^\circ$
* **Fala:** *"Com os arcos $f(x)=\sqrt{R^2-x^2}$ em $[-5,5]$ e $g(x)=\sqrt{r^2-x^2}$ em $[-3,3]$, giramos apenas a semi-coroa hachurada $\mathcal{R}$ em $360^\circ$ para construir a casca sólida em 3D."*  
*(Clique em `🔄 Gerar Rotação`)*

### SLIDE 08 (PARTE 1): Elementos Constituintes e Simetrias ($R=5, r=3$)
* **Fala:** *"Com $R=5$ e $r=3$, vemos os 5 elementos: centro $C(0,0,0)$, raio externo $R$, raio interno $r$, espessura $e=R-r=2$ e simetria esférica $O(3)$."*

### SLIDE 09 (PARTE 1): Modelagem no GeoGebra ($R=5, r=3$)
* **Fala:** *"Aqui estão os registros do GeoGebra mostrando as curvas 2D $f(x)$ e $g(x)$ e a casca gerada pela revolução em 3D."*

### SLIDE 10 (PARTE 2): Da Soma de Riemann à Integral Definida
* **Fala:** *"Iniciamos a dedução rigorosa: dividimos $[-R, R]$ em $n$ discos de largura $\Delta x = 2R/n$ e somamos $\pi[y(x_i^*)]^2\Delta x$. No limite $\Delta x \to 0$, chegamos à integral definida."*  
*(Arraste o slider de $n = 8$ até $40$)*

### SLIDE 11 (PARTE 2): Método dos Discos (Arruelas) vs. Cascas Cilíndricas
* **Fala:** *"Preferimos Discos ao longo de $x$ porque elevar $y = \sqrt{R^2 - x^2}$ ao quadrado cancela a raiz imediatamente. Na fatia central ($|x|<r$), a área da arruela é constante: $\pi(R^2 - r^2)$."*

### SLIDE 12 (PARTE 2): Montagem da Integral e Propriedades Operatórias
* **Fala:** *"Subtraímos as duas integrais, cancelamos $(\sqrt{u})^2 = u$, retiramos $\pi$ e separamos pela linearidade."*

### SLIDE 13 (PARTE 2): Antiderivada (Primitiva)
* **Fala:** *"Integramos termo a termo: a constante $R^2$ vira $R^2x$ e $x^2$ vira $x^3/3$, resultando na primitiva $P(x) = R^2x - \frac{x^3}{3}$."*

### SLIDE 14 (PARTE 2): Teorema Fundamental do Cálculo
* **Fala:** *"Avaliando $P(R) - P(-R)$ obtemos $\frac{4R^3}{3}$ para a esfera externa e, analogamente, $\frac{4r^3}{3}$ para a cavidade interna."*

### SLIDE 15 (PARTE 2): Fórmula Final e Interpretação Geométrica
* **Fala:** *"Concluímos $V_{\text{casca}} = \frac{4}{3}\pi(R^3 - r^3)$ e mostramos que, quando $e \to 0$, $V \approx 4\pi R^2 e$, confirmando $\frac{dV}{dR} = 4\pi R^2$."*

### SLIDE 16 (PARTE 3): Problema Referenciado — Bola de Chocolate (ENEM PPL 2023)
* **Fala:** *"No Problema 1, escolhemos uma questão oficial do **ENEM PPL 2023 (Questão 159 — Caderno Azul / INEP)**: uma bola oca de chocolate com diâmetro externo $20\text{ cm}$ ($R = 10\text{ cm}$) e espessura $e = 1\text{ cm}$ ($r = 9\text{ cm}$), em que $1\text{ g}$ equivale a $0{,}75\text{ cm}^3$."*  
*(Alterne `Corte 90°` / `Raio-X` no modelo 3D)*

### SLIDE 17 (PARTE 3): Resolução Passo a Passo, Massa e SI
* **Fala:** *"Substituindo na fórmula deduzida, $10^3 - 9^3 = 1000 - 729 = 271$, logo o volume de chocolate vale $V = \frac{1084\pi}{3}\text{ cm}^3 \approx 1.135{,}16\text{ cm}^3$ ($\approx 0{,}001135\text{ m}^3$ no SI). Dividindo por $0{,}75\text{ cm}^3/\text{g}$, obtemos $\frac{4336\pi}{9}\text{ g} \approx 1.513{,}55\text{ g}$, que é exatamente a alternativa C do gabarito oficial do INEP!"*  
*(Deslize o plano de corte no 3D)*

### SLIDE 18 (PARTE 4): Reservatório Esférico de Água em Concreto
* **Fala:** *"Para o problema autoral mais simples e intuitivo, projetamos um **reservatório esférico de água em concreto armado**. A esfera é ideal porque tem a menor área externa para guardar o mesmo volume de água. O interior para a água tem $r = 2{,}0\text{ m}$ e a parede tem espessura $e = 0{,}5\text{ m}$ ($R = 2{,}5\text{ m}$)."*  
*(Mostre o corte 3D concreto + água)*

### SLIDE 19 (PARTE 4): GeoGebra (1/2) — Curvas 2D e Seção $180^\circ$
* **Fala:** *"Modelamos no GeoGebra as funções $f(x)=\sqrt{6{,}25-x^2}$ e $g(x)=\sqrt{4-x^2}$ no semiplano $y \ge 0$, além da meia-revolução de $180^\circ$ mostrando a espessura da parede de concreto."*

### SLIDE 20 (PARTE 4): GeoGebra (2/2) — 3D Paramétrico e Casca Translúcida
* **Fala:** *"Vemos aqui a superfície paramétrica completa no GeoGebra 3D e a casca translúcida destacando a câmara interna de armazenamento de água."*

### SLIDE 21 (PARTE 4): Integral do Concreto, Massa e Capacidade
* **Fala:** *"Montando e resolvendo a integral definida passo a passo de $[-2{,}5; 2{,}5]$ e $[-2{,}0; 2{,}0]$, obtemos $V_{\text{concreto}} = \frac{30{,}5\pi}{3} \approx 31{,}94\text{ m}^3$. Multiplicando pela densidade do concreto armado ($\rho = 2.400\text{ kg/m}^3$), a parede pesa $\approx 76{,}7\text{ toneladas}$ e guarda $33.510\text{ litros}$ de água."*

### SLIDE 22 (PARTE 4): Discussão Crítica e Limitações do Modelo
* **Fala:** *"Na análise crítica, destacamos dois pontos reais: primeiro, $76{,}7\text{ toneladas}$ exigem sapata estrutural reforçada; segundo, os canos de entrada e saída mais a tampa de visita perfuram a parede, quebrando ligeiramente a simetria perfeita da integral."*  
*(Clique em `2. Parede e Água` e `3. Limitações (Canos)`)*

### SLIDE 23: Conclusão e Considerações Finais
* **Fala:** *"Concluímos conectando intuição geométrica simples, dedução rigorosa pela integral, modelagem em GeoGebra e dois problemas completos com revisão passo a passo. Obrigado a todos!"*

---

## 🛡️ Guia Rápido de Arguição (Perguntas Prováveis da Banca)

1. **Por que restringir a região geradora ao semiplano $y \ge 0$?**  
   Porque girar $360^\circ$ com $y \ge 0$ e $y < 0$ ao mesmo tempo faria a metade inferior varrer o mesmo espaço tridimensional que a superior já ocupou, duplicando o volume.

2. **Como você sai da Soma de Riemann para a Integral?**  
   Dividimos $[-R, R]$ em $n$ discos de largura $\Delta x$ e volume aproximado $\pi[y(x_i^*)]^2 \Delta x$; somamos as $n$ fatias ($\sum \pi[y(x_i^*)]^2 \Delta x$) e tomamos o limite quando $\Delta x \to 0$ ($n \to \infty$), chegando à integral definida $\int_{-R}^R \pi[y(x)]^2 dx$.

3. **Por que usaram Discos (subtração) e não Cascas Cilíndricas?**  
   No método dos discos ao redor do eixo $x$, elevar $y = \sqrt{R^2 - x^2}$ ao quadrado cancela a raiz imediatamente, gerando um polinômio simples. Cascas cilíndricas ao redor do eixo $x$ exigiriam integrar $2\pi y\sqrt{R^2-y^2}\,dy$ e quebrar o domínio de $y$ em $[0, r]$ e $[r, R]$.

4. **Por que o volume da casca fina tende a $4\pi R^2 e$?**  
   Fatorando $R^3 - r^3 = (R - r)(R^2 + Rr + r^2) = e(R^2 + Rr + r^2)$, quando $e \to 0$ temos $r \to R$, então $V \approx \frac{4}{3}\pi \cdot e \cdot 3R^2 = 4\pi R^2 e$. Isso comprova que $\frac{dV}{dR} = 4\pi R^2$.

5. **Por que no GeoGebra 3D (Slide 20) a variável $u$ ficou no eixo $z$ em vez do eixo $x$?**  
   Pela simetria esférica $O(3)$ centrada na origem, girar em torno de $x$, $y$ ou $z$ gera exatamente a mesma casca esférica; usamos o eixo $z$ na parametrização para deixar o reservatório alinhado verticalmente na janela 3D.

6. **Por que escolher esfera para o reservatório de água e qual a limitação do cálculo?**  
   A esfera tem a menor razão área/volume ($A/V = 3/R$), gastando menos concreto para guardar o mesmo volume de água e distribuindo melhor a pressão interna. Porém, a integral supõe casca fechada e contínua, enquanto o reservatório real possui canos e tampa de visita que perfuram a parede.
