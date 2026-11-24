# Guia Didático Passo a Passo: Casca de Esfera
**Seminário Investigativo de Cálculo B — Licenciatura em Matemática (UFPel / IFM / CLMD / UAB)**  
**Tema:** Casca de Esfera (região delimitada por duas esferas concêntricas)  
**Professor Formador:** Pedro Antonio Ourique  
**Material de Estudo Exclusivo para os Integrantes do Grupo**

---

Este guia explica **toda a lógica matemática e geométrica do seminário do zero**, exatamente alinhado aos **23 slides da apresentação (1 tópico por slide)** e às **exigências de avaliação da banca**.

---

## 🌓 0. Semicírculo, Giro Gerador e Origem de $V = \frac{4}{3}\pi R^3$ (Slides 2 e 3)

### Slide 2 — O que é um Semicírculo e seu Giro Gerador ($360^\circ$)
* **Tópico 1 (Partes do Semicírculo):** É a metade de um círculo ($y = \sqrt{R^2 - x^2} \ge 0$), formada pelo **centro $C(0,0)$**, **diâmetro $2R$** (de $-R$ até $+R$ no eixo $x$), **raio $R$** e pelo arco superior.
* **Tópico 2 (Semicírculo Gerador):** Ao girar esse semicírculo $360^\circ$ em torno do eixo $x$, cada ponto do arco traça um círculo ao redor do eixo, formando uma **esfera completa**.

### Slide 3 — De Onde Vem $V = \frac{4}{3}\pi R^3$? (Sem $\rho$)
Antes de pensar em duas esferas concêntricas, respondemos de onde vem o fator $\frac{4}{3}$ no volume de **uma esfera**:
* **Fatiamento e giro:** cortamos a esfera em discos finos ($\Delta x \to 0$) e giramos para alinhar o eixo $x$ na horizontal (de $-R$ até $R$).
* **Pitágoras na fatia:** entre o raio fixo da esfera $R$, a posição $x$ e a altura vertical **$y$** (raio do disco) vale $x^2 + y^2 = R^2 \implies y^2 = R^2 - x^2$.
* **De onde vem $\frac{4}{3}$:** somando as fatias de $-R$ a $R$, temos $\pi\left[R^2x - \frac{x^3}{3}\right]_{-R}^{R} = \pi\left[\frac{2R^3}{3} - \left(-\frac{2R^3}{3}\right)\right]$; logo $\frac{2}{3} + \frac{2}{3} = \mathbf{\frac{4}{3}}$, chegando em $V = \frac{4}{3}\pi R^3$.

---

## 🧭 1. Da Esfera Cheia à Casca no $\mathbb{R}^3$ (Slides 4 e 5)

Imagine uma bola oca (ou a casca de uma laranja):
* Ela tem um **raio interno** ($r$), onde fica a cavidade vazia;
* Ela tem um **raio externo** ($R$), onde termina a superfície externa;
* A **espessura da parede sólida** é $e = R - r$ (no exemplo didático inicial: $R = 5, r = 3 \implies e = 2$), e seu volume é $V_{\text{casca}} = V_{\text{maior}}(R) - V_{\text{menor}}(r)$.

### De onde vêm $d_{xy}$, $d$ e $x^2 + y^2 + z^2$? (Dois Triângulos de Pitágoras):
1. **No chão (plano $xy$):** andando $x$ para frente e $y$ para o lado, a diagonal horizontal vale $d_{xy}^2 = x^2 + y^2$ (distância no plano da base).
2. **Subindo na altura $z$ ($d$ em 3D):** da ponta de $d_{xy}$, subimos $z$ em $90^\circ$ e aplicamos Pitágoras de novo:
   $$d^2 = d_{xy}^2 + z^2 = x^2 + y^2 + z^2 \implies d = \sqrt{x^2 + y^2 + z^2}$$
3. Como qualquer ponto da parede sólida tem distância $d$ entre $r$ e $R$ ($r \le d \le R$), **elevamos todos os membros ao quadrado para eliminar a raiz**:
   $$\mathcal{S} = \left\{(x,y,z) \in \mathbb{R}^3 \;\middle|\; r^2 \le x^2 + y^2 + z^2 \le R^2\right\} \quad (0 < r < R)$$

---

## 🔄 2. Por Que Isolar $y$ (e Não $x$ ou $z$)? + Região Geradora (Slides 6 e 7)

No Cálculo B, volumes são gerados como **sólidos de revolução**:
1. **Por que sem $z$ no 2D?** Na folha plana inicial não há profundidade ($z=0$); a 3ª dimensão $z$ surge ao girar.
2. **Por que isolar $y$ (e não $x$)?** Escolhemos girar em torno do **eixo $x$**. A distância vertical até esse eixo é justamente **$y$**, que se torna o **raio** de cada fatia circular! (Só isolaríamos $x$ se o giro fosse no eixo vertical $y$.)
3. **De Pitágoras no $\mathbb{R}^2$ até $y \ge 0$:** todo ponto da circunferência satisfaz $x^2 + y^2 = R^2 \implies y = \pm\sqrt{R^2 - x^2}$. Ficamos só com $y \ge 0$ para não duplicar o volume ao girar $360^\circ$:
   * Curva externa: $f(x) = \sqrt{R^2 - x^2}$, definida no intervalo $[-R, R]$ (no exemplo: $[-5, 5]$);
   * Curva interna: $g(x) = \sqrt{r^2 - x^2}$, definida no intervalo $[-r, r]$ (no exemplo: $[-3, 3]$).
4. A região plana entre essas duas curvas é a **região geradora $\mathcal{R}$** (semi-coroa circular):
   $$\mathcal{R} = \left\{ (x,y) \in \mathbb{R}^2 \;\middle|\; r^2 \le x^2 + y^2 \le R^2,\; y \ge 0 \right\}$$

> **Pergunta da Banca:** *"Por que restringimos a $y \ge 0$ e não giramos o anel inteiro?"*  
> **Sua Resposta:** *"Porque, numa rotação completa de $360^\circ$, a metade de cima já varre todo o espaço tridimensional. Se girássemos o anel inteiro, a metade inferior varreria o mesmo volume que a superior já ocupou, contando o volume duas vezes."*

---

## 📈 3. Da Soma de Riemann à Integral Definida (Slide 10)

Antes de escrever a integral pronta, justificamos de onde ela vem:
1. Dividimos o intervalo $[-R, R]$ do eixo $x$ em $n$ fatias bem finas de largura $\Delta x = \frac{2R}{n}$.
2. Cada fatia funciona como um disco fino de raio $y(x_i^*)$ e volume aproximado:
   $$\Delta V_i \approx \pi \left[y(x_i^*)\right]^2 \Delta x$$
3. Somando as $n$ fatias, temos a **Soma de Riemann**:
   $$V_n = \sum_{i=1}^{n} \pi \left[y(x_i^*)\right]^2 \Delta x$$
4. Fazendo as fatias ficarem infinitamente finas ($\Delta x \to 0$, $n \to \infty$), a soma converge para a **Integral Definida**:
   $$V = \lim_{n \to \infty} \sum_{i=1}^{n} \pi \left[y(x_i^*)\right]^2 \Delta x = \int_{-R}^{R} \pi \left[y(x)\right]^2 dx$$

*(No Slide 10 da apresentação, você pode arrastar o slider de $n = 4$ até $40$ para mostrar visualmente $V_n$ se aproximando do volume exato $523{,}60$!)*

---

## 🔪 4. Por que Discos/Arruelas e NÃO Cascas Cilíndricas? (Slide 11)

* **Vantagem dos Discos no eixo $x$:** como o raio é $y = \sqrt{R^2 - x^2}$, a fórmula eleva ao quadrado ($\pi y^2$), **cancelando a raiz na hora**: $\pi(R^2 - x^2)$.
* **Por que não Cascas Cilíndricas?** Girando no eixo $x$, teríamos de integrar em $dy$ com $2\pi y \sqrt{R^2 - y^2}$ (a raiz não some) e dividir em $[0, r]$ e $[r, R]$.
* **Detalhe da animação 3D do Slide 11:**
  * No miolo ($|x| < r$), a fatia é uma **arruela** com área:
    $$A(x) = \pi(R^2 - x^2) - \pi(r^2 - x^2) = \mathbf{\pi(R^2 - r^2)}$$
    O $-x^2$ cancela com $+x^2$: **todas as arruelas do miolo têm exatamente a mesma área!**
  * Nas pontas ($r \le |x| \le R$), a fatia é um disco maciço de área $\pi(R^2 - x^2)$.

---

## ✍️ 5. A Dedução Algébrica Completa (Slides 12 a 15)

A forma mais limpa de integrar é subtrair o volume da esfera interna do volume da externa:
$$V = \pi \int_{-R}^{R} \left(\sqrt{R^2 - x^2}\right)^2 dx - \pi \int_{-r}^{r} \left(\sqrt{r^2 - x^2}\right)^2 dx$$

1. **Simplificação e Propriedades Operatórias:** cancelamos $(\sqrt{u})^2 = u$ e aplicamos a propriedade da **constante multiplicativa** ($\pi$) e da **linearidade** (integral da diferença):
   $$V_{\text{ext}} = \pi \left[ \int_{-R}^{R} R^2\,dx - \int_{-R}^{R} x^2\,dx \right]$$
2. **Antiderivada (Primitiva):** como $R$ é constante em relação a $x$, $\int R^2\,dx = R^2 x$ e, pela regra da potência, $\int x^2\,dx = \frac{x^3}{3}$. Assim:
   $$P(x) = R^2 x - \frac{x^3}{3}$$
3. **Teorema Fundamental do Cálculo ($P(R) - P(-R)$):**
   * $P(R) = R^3 - \frac{R^3}{3} = \frac{2R^3}{3}$
   * $P(-R) = -R^3 + \frac{R^3}{3} = -\frac{2R^3}{3}$
   * Subtraindo: $\frac{2R^3}{3} - \left(-\frac{2R^3}{3}\right) = \frac{4R^3}{3} \implies V_{\text{ext}} = \frac{4}{3}\pi R^3$.
4. **Analogamente para $r$ em $[-r, r]$:** $V_{\text{int}} = \frac{4}{3}\pi r^3$.
5. **Fórmula Final:**
   $$V_{\text{casca}} = \frac{4}{3}\pi R^3 - \frac{4}{3}\pi r^3 = \mathbf{\frac{4}{3}\pi (R^3 - r^3)}$$

---

## 🔬 6. Por que a Derivada do Volume é a Área Superficial? (Slide 15)

Fatoramos a diferença de cubos com $e = R - r$:
$$R^3 - r^3 = (R - r)(R^2 + Rr + r^2) = e(R^2 + Rr + r^2)$$
Quando a casca é muito fina ($e \to 0$, logo $r \to R$), temos $R^2 + Rr + r^2 \to 3R^2$:
$$V_{\text{casca}} \approx \frac{4}{3}\pi \cdot e \cdot 3R^2 = 4\pi R^2 \cdot e \implies \mathbf{\frac{dV}{dR} = 4\pi R^2}$$
Isso mostra que o volume de uma casca finíssima é a **área da esfera ($4\pi R^2$) vezes a espessura ($e$)**.

---

## 🚀 7. Os Dois Problemas Práticos (Slides 16 a 22)

### Parte III — Problema Referenciado: Bola de Chocolate Oca (Slides 16 e 17)
* **Fonte Oficial:** **ENEM PPL 2023 — Prova de Matemática, Questão 159 (Caderno Azul / INEP)**.
* **Dados:** diâmetro $d = 20\text{ cm} \implies R = 10\text{ cm}$; espessura uniforme $e = 1\text{ cm} \implies r = 10 - 1 = 9\text{ cm}$; correspondência $1\text{ g} \leftrightarrow 0{,}75\text{ cm}^3$.
* **Volume de chocolate:**
  $$V = \frac{4}{3}\pi (10^3 - 9^3) = \frac{4}{3}\pi (1000 - 729) = \frac{1084\pi}{3}\text{ cm}^3 \approx 1.135{,}16\text{ cm}^3$$
* **Conversão ao SI:** $V \approx \frac{1135{,}16}{1.000.000} \approx 0{,}001135\text{ m}^3$ ($\approx 1{,}14\text{ L}$).
* **Massa da bola (resposta do ENEM):**
  $$M = \frac{V}{0{,}75} = \frac{4}{3} \cdot \frac{1084\pi}{3} = \mathbf{\frac{4336\pi}{9}\text{ g}} \approx 1.513{,}55\text{ g} \quad (\text{Gabarito C})$$

### Parte IV — Problema Autoral: Reservatório Esférico de Água em Concreto (Slides 18 a 22)
* **Contexto simples do cotidiano:** armazenar água para irrigação reduzindo o material externo, porque a esfera tem a **menor área de parede por volume de água** ($A/V = 3/R$).
* **Dimensões:** câmara interna de água $r = 2{,}0\text{ m}$, espessura de concreto $e = 0{,}5\text{ m}$, raio externo $R = 2{,}5\text{ m}$.
* **Resolução pelo Cálculo Integral:**
  $$V_{\text{concreto}} = \pi\int_{-2{,}5}^{2{,}5} (6{,}25 - x^2)\,dx - \pi\int_{-2{,}0}^{2{,}0} (4 - x^2)\,dx = \frac{4}{3}\pi (2{,}5^3 - 2{,}0^3) = \frac{30{,}5\pi}{3} \approx 31{,}94\text{ m}^3$$
* **Massa e capacidade:** com concreto armado $\rho = 2.400\text{ kg/m}^3$, temos $M = 31{,}94 \times 2.400 \approx 76.654{,}9\text{ kg}$ ($\approx 76{,}7\text{ toneladas}$); e a capacidade interna é $V_{\text{água}} = \frac{4}{3}\pi(2{,}0)^3 \approx 33{,}51\text{ m}^3 = 33.510\text{ L}$.
* **Discussão crítica:** na prática, o peso elevado exige sapata/base reforçada, e os canos de entrada/saída mais a tampa de visita perfuram a parede contínua prevista na integral.
