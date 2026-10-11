# Guia Didático Passo a Passo: Casca de Esfera
**Seminário Investigativo de Cálculo B — Licenciatura em Matemática (UFPel)**  
**Tema:** Casca de Esfera (região delimitada por duas esferas concêntricas)  
**Professor Formador:** Pedro Antonio Ourique  
**Material de Estudo Exclusivo para os Integrantes do Grupo**

---

Este guia foi elaborado para que **você e seus colegas compreendam profundamente cada detalhe matemático e geométrico do trabalho**. Se você entender estes 6 passos, você conseguirá explicar o seminário com total naturalidade, sem precisar decorar nada.

---

## 🧭 1. O que é o Sólido no Mundo Real e no $\mathbb{R}^3$?

Imagine uma bola de futebol oca ou a casca de uma laranja:
* Ela tem um **raio interno** ($r$), que é onde fica o ar ou o vazio;
* Ela tem um **raio externo** ($R$), que é a superfície externa;
* A **espessura da parede sólida** é $e = R - r$.

### Definição Matemática Rigorosa:
A distância de qualquer ponto $(x,y,z)$ até o centro $(0,0,0)$ é dada por $\sqrt{x^2 + y^2 + z^2}$.  
Como o sólido é a região entre a esfera interna de raio $r$ e a externa de raio $R$:
$$r \le \sqrt{x^2 + y^2 + z^2} \le R \iff r^2 \le x^2 + y^2 + z^2 \le R^2$$

---

## 🔄 2. Como a Casca Nasce por Rotação no $\mathbb{R}^2$?

No Cálculo B, volumes são calculados como **sólidos de revolução**.
1. Pegamos uma folha plana no plano cartesiano $xy$.
2. Desenhamos duas semicircunferências no semiplano superior ($y \ge 0$):
   * Curva de fora: $y = \sqrt{R^2 - x^2}$, com $x \in [-R, R]$;
   * Curva de dentro: $y = \sqrt{r^2 - x^2}$, com $x \in [-r, r]$.
3. A região entre essas duas curvas é uma **semi-coroa circular** (uma meia-lua oca).
4. **O Giro:** Giramos essa região $360^\circ$ em torno do **eixo $x$**. O rastro que ela deixa no espaço tridimensional gera perfeitamente a nossa casca de esfera!

> **Pergunta da Banca:** *"Por que usamos apenas $y \ge 0$ e não o anel inteiro?"*  
> **Sua Resposta:** *"Porque se girássemos o anel inteiro, a metade de cima e a metade de baixo varreriam o mesmo espaço tridimensional, contando o volume duas vezes."*

---

## 🔪 3. O Fatiamento: Por que a Área Central é Constante? (O Pulo do Gato!)

Imagine colocar a casca de esfera sobre uma tábua e fatiá-la perpendicularmente ao eixo $x$ (como fatiar um queijo):

### Regime 1: Quando a faca corta no meio (intervalo $[-r, r]$)
A faca corta a cavidade oca! A fatia que sai na sua mão é uma **arruela (coroa circular)**:
* Raio de fora da arruela: $R(x) = \sqrt{R^2 - x^2}$;
* Raio do buraco de dentro: $r(x) = \sqrt{r^2 - x^2}$.

A área da arruela é a área do círculo de fora menos a do buraco:
$$A(x) = \pi [R(x)]^2 - \pi [r(x)]^2 = \pi(R^2 - x^2) - \pi(r^2 - x^2)$$
$$A(x) = \pi R^2 - \pi x^2 - \pi r^2 + \pi x^2 = \mathbf{\pi(R^2 - r^2)}$$

**Veja que espetacular:** o termo $-x^2$ cancelou com $+x^2$!  
Isso significa que **todas as arruelas no meio do sólido têm exatamente a mesma área**, não importa a posição $x$ onde você cortou!

### Regime 2: Quando a faca corta nas pontas (calotas, onde $r < |x| \le R$)
A faca passa por fora da cavidade interna. A fatia é um **disco maciço cheio**, sem buraco:
* Raio do disco: $R(x) = \sqrt{R^2 - x^2}$;
* Área do disco: $A(x) = \pi [R(x)]^2 = \mathbf{\pi(R^2 - x^2)}$.

---

## 📈 4. Das Fatias para a Integral (Somas de Riemann)

* Cada fatia tem uma espessura fininha chamada $\Delta x$.
* O volume de uma fatia é: $\Delta V \approx A(x) \cdot \Delta x$.
* Se somarmos as $n$ fatias, temos a **Soma de Riemann**: $V_n \approx \sum_{i=1}^n A(x_i^*) \Delta x$.
* Quando a espessura fica infinitamente fina ($\Delta x \to 0$, ou seja, $n \to \infty$), essa soma converge exatamente para a **Integral Definida**:
$$V = \int_{-R}^{R} A(x)\,dx$$

---

## ✍️ 5. A Dedução Algébrica Completa (Passo a Passo sem Medo)

Como o lado esquerdo é idêntico ao lado direito (função par $A(-x) = A(x)$), podemos calcular apenas de $0$ a $R$ e dobrar ($2 \times$):
$$V = 2 \left[ \underbrace{\int_0^r \pi(R^2 - r^2)\,dx}_{I_1 \text{ (Arruelas)}} + \underbrace{\int_r^R \pi(R^2 - x^2)\,dx}_{I_2 \text{ (Discos)}} \right]$$

### Calculando a Parcela $I_1$ (de $0$ a $r$):
Como $\pi(R^2 - r^2)$ é uma constante em relação a $x$, sua integral é simplesmente a constante vezes $x$:
$$I_1 = \pi(R^2 - r^2) [x]_0^r = \pi(R^2 - r^2)(r - 0) = \mathbf{\pi(R^2 r - r^3)}$$

### Calculando a Parcela $I_2$ (de $r$ a $R$):
Aqui usamos a regra da potência ($\int x^2 dx = \frac{x^3}{3}$):
$$I_2 = \pi \left[ R^2 x - \frac{x^3}{3} \right]_r^R = \pi \left[ \left(R^3 - \frac{R^3}{3}\right) - \left(R^2 r - \frac{r^3}{3}\right) \right] = \mathbf{\pi \left( \frac{2}{3}R^3 - R^2 r + \frac{1}{3}r^3 \right)}$$

### Somando as Duas Parcelas ($I_1 + I_2$):
Junte tudo dentro do colchete:
$$I_1 + I_2 = \pi \left[ (\mathbf{R^2 r} - r^3) + \left( \frac{2}{3}R^3 - \mathbf{R^2 r} + \frac{1}{3}r^3 \right) \right]$$
Veja o milagre algébrico acontecendo:
* O termo $+R^2 r$ corta com $-R^2 r$!
* E $-r^3 + \frac{1}{3}r^3 = -\frac{2}{3}r^3$!
Sobrou apenas:
$$I_1 + I_2 = \pi \left( \frac{2}{3}R^3 - \frac{2}{3}r^3 \right) = \frac{2}{3}\pi (R^3 - r^3)$$

### Finalizando o Volume:
Lembre que tínhamos o fator 2 da simetria:
$$V = 2 \cdot (I_1 + I_2) = 2 \cdot \frac{2}{3}\pi (R^3 - r^3) = \mathbf{\frac{4}{3}\pi (R^3 - r^3)}$$
Fórmula deduzida com $100\%$ de perfeição analítica!

---

## 🔬 6. Por que a Derivada do Volume é a Área Superficial?

Se a casca for muito fininha (como uma bexiga ou casca de ovo), a espessura é $e = dR$.  
O volume da parede é simplesmente a área da superfície ($4\pi R^2$) vezes a espessura ($dR$):
$$dV \approx 4\pi R^2 \cdot dR \implies \mathbf{\frac{dV}{dR} = 4\pi R^2}$$
Isso prova que a taxa de crescimento do volume de uma esfera é a sua área externa!

---

## 🚀 7. Os Dois Problemas Práticos

### Problema de Livro (Parte III):
* Vaso esférico de titânio com diâmetro $2{,}40\text{ m}$ ($R = 1{,}20\text{ m}$) e parede de $60\text{ mm}$ ($r = 1{,}14\text{ m}$).
* Volume da casca: $1{,}0323\text{ m}^3$ | Massa: $4{,}65\text{ toneladas}$.
* Se usássemos a fórmula simplificada de casca fina ($4\pi R^2 e$), o volume calculado seria $1{,}0857\text{ m}^3$ (+5,17% de erro). Isso erraria em mais de $240\text{ kg}$ de titânio, justificando porque engenheiros utilizam o Cálculo exato!

### Problema Inédito de Criogenia (Parte IV):
* Tanque esférico para Hidrogênio Verde Líquido a $-253^\circ\text{C}$ ($20\text{ K}$).
* Por que a esfera? Porque ela tem a menor área externa para um determinado volume ($\frac{A}{V} = \frac{3}{R}$), minimizando a entrada de calor do ambiente.
* A casca oca é preenchida com isolamento a vácuo com perlita expandida ($167{,}75\text{ m}^3$), garantindo que o hidrogênio não evapore durante a viagem naval.
