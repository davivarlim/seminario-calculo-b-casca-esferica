# Guia Didático Passo a Passo: Casca de Esfera
**Seminário Investigativo de Cálculo B — Licenciatura em Matemática (UFPel / IFM / CLMD / UAB)**  
**Tema:** Casca de Esfera (região delimitada por duas esferas concêntricas)  
**Professor Formador:** Pedro Antonio Ourique  
**Material de Estudo Exclusivo para os Integrantes do Grupo**

---

Este guia explica **toda a lógica matemática e geométrica do seminário do zero**, exatamente alinhado aos **21 slides da apresentação** e às **exigências de avaliação da banca**.

---

## 🌐 0. Ponto de Partida: O que é uma Esfera, Semicírculo e Seu Volume? (Slide 2)

Antes de pensar em duas esferas concêntricas, entendemos **uma esfera só**:
* **Centro $C(0,0,0)$ e Raio $R$:** o centro fica bem no meio; todo ponto da superfície externa está exatamente à mesma distância $R$ dele.
* **Semicírculo gerador:** metade superior de um círculo plano de raio $R$ sobre o eixo $x$ ($[-R, R]$). Girando $360^\circ$, ele forma a esfera.
* **Volume da esfera (exemplo $R = 3\text{ cm}$):**
  $$V = \frac{4}{3}\pi R^3 = \frac{4}{3}\pi \cdot 3^3 = \frac{4}{3}\pi \cdot 27 = 36\pi \approx 113{,}10\text{ cm}^3$$
  Sabendo calcular uma esfera, a **casca esférica** será apenas $V_{\text{maior}}(R) - V_{\text{menor}}(r)$.

---

## 🧭 1. O que é o Sólido no Mundo Real e no $\mathbb{R}^3$? (Slide 3)

Imagine uma bola oca (ou a casca de uma laranja):
* Ela tem um **raio interno** ($r$), onde fica a cavidade vazia;
* Ela tem um **raio externo** ($R$), onde termina a superfície externa;
* A **espessura da parede sólida** é $e = R - r$ (no exemplo didático inicial: $R = 5, r = 3 \implies e = 2$).

### De onde vêm $d_{xy}$, $d$ e $x^2 + y^2 + z^2$? (Dois Triângulos de Pitágoras):
1. **No chão (plano $xy$):** andando $x$ para frente e $y$ para o lado, a diagonal horizontal vale $d_{xy}^2 = x^2 + y^2$ (distância no plano da base).
2. **Subindo na altura $z$ ($d$ em 3D):** da ponta de $d_{xy}$, subimos $z$ em $90^\circ$ e aplicamos Pitágoras de novo:
   $$d^2 = d_{xy}^2 + z^2 = x^2 + y^2 + z^2 \implies d = \sqrt{x^2 + y^2 + z^2}$$
3. Como qualquer ponto da parede sólida tem distância $d$ entre $r$ e $R$ ($r \le d \le R$), **elevamos todos os membros ao quadrado para eliminar a raiz**:
   $$\mathcal{S} = \left\{(x,y,z) \in \mathbb{R}^3 \;\middle|\; r^2 \le x^2 + y^2 + z^2 \le R^2\right\} \quad (0 < r < R)$$

---

## 🔄 2. Por Que Isolar $y$ (e Não $x$ ou $z$)? + Região Geradora (Slides 4 e 5)

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

## 📈 3. Da Soma de Riemann à Integral Definida (Slide 8)

Antes de escrever a integral pronta, justificamos de onde ela vem:
1. Dividimos o intervalo $[-R, R]$ do eixo $x$ em $n$ fatias bem finas de largura $\Delta x = \frac{2R}{n}$.
2. Cada fatia funciona como um disco fino de raio $y(x_i^*)$ e volume aproximado:
   $$\Delta V_i \approx \pi \left[y(x_i^*)\right]^2 \Delta x$$
3. Somando as $n$ fatias, temos a **Soma de Riemann**:
   $$V_n = \sum_{i=1}^{n} \pi \left[y(x_i^*)\right]^2 \Delta x$$
4. Fazendo as fatias ficarem infinitamente finas ($\Delta x \to 0$, $n \to \infty$), a soma converge para a **Integral Definida**:
   $$V = \lim_{n \to \infty} \sum_{i=1}^{n} \pi \left[y(x_i^*)\right]^2 \Delta x = \int_{-R}^{R} \pi \left[y(x)\right]^2 dx$$

*(No Slide 8 da apresentação, você pode arrastar o slider de $n = 4$ até $40$ para mostrar visualmente $V_n$ se aproximando do volume exato $523{,}60$!)*

---

## 🔪 4. Por que Discos/Arruelas e NÃO Cascas Cilíndricas? (Slide 9)

* **Vantagem dos Discos no eixo $x$:** como o raio é $y = \sqrt{R^2 - x^2}$, a fórmula eleva ao quadrado ($\pi y^2$), **cancelando a raiz na hora**: $\pi(R^2 - x^2)$.
* **Por que não Cascas Cilíndricas?** Girando no eixo $x$, teríamos de integrar em $dy$ com $2\pi y \sqrt{R^2 - y^2}$ (a raiz não some) e dividir em $[0, r]$ e $[r, R]$.
* **Detalhe da animação 3D do Slide 9:**
  * No miolo ($|x| < r$), a fatia é uma **arruela** com área:
    $$A(x) = \pi(R^2 - x^2) - \pi(r^2 - x^2) = \mathbf{\pi(R^2 - r^2)}$$
    O $-x^2$ cancela com $+x^2$: **todas as arruelas do miolo têm exatamente a mesma área!**
  * Nas pontas ($r \le |x| \le R$), a fatia é um disco maciço de área $\pi(R^2 - x^2)$.

---

## ✍️ 5. A Dedução Algébrica Completa (Slides 10 a 13)

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

## 🔬 6. Por que a Derivada do Volume é a Área Superficial? (Slide 13)

Fatoramos a diferença de cubos com $e = R - r$:
$$R^3 - r^3 = (R - r)(R^2 + Rr + r^2) = e(R^2 + Rr + r^2)$$
Quando a casca é muito fina ($e \to 0$, logo $r \to R$), temos $R^2 + Rr + r^2 \to 3R^2$:
$$V_{\text{casca}} \approx \frac{4}{3}\pi \cdot e \cdot 3R^2 = 4\pi R^2 \cdot e \implies \mathbf{\frac{dV}{dR} = 4\pi R^2}$$
Isso mostra que o volume de uma casca finíssima é a **área da esfera ($4\pi R^2$) vezes a espessura ($e$)**.

---

## 🚀 7. Os Dois Problemas Práticos (Slides 14 a 20)

### Parte III — Problema Industrial: Flutuador de Aço (Slides 14 e 15)
* **Dados:** $R = 10\text{ cm}$ e espessura $e = 2\text{ cm}$.
* **Raio interno:** pela definição de espessura ($e = R - r$), temos $r = 10 - 2 = 8\text{ cm}$.
* **Volume:**
  $$V = \frac{4}{3}\pi (10^3 - 8^3) = \frac{4}{3}\pi (1000 - 512) = \frac{1952\pi}{3}\text{ cm}^3 \approx 2044{,}13\text{ cm}^3$$
* **Conversão ao SI:** como $1\text{ m} = 100\text{ cm}$, então $1\text{ m}^3 = 100^3 = 1.000.000\text{ cm}^3$:
  $$V \approx \frac{2044{,}13}{1.000.000}\text{ m}^3 = 0{,}002044\text{ m}^3$$
* **Interpretação geométrica:** são cerca de **$2{,}04\text{ L}$ de aço** formando a parede de $2\text{ cm}$ ao redor de uma cavidade vazia de raio $8\text{ cm}$ ($\approx 2{,}14\text{ L}$).

### Parte IV — Problema Inédito: Tanque Criogênico de $LH_2$ (Slides 16 a 20)
* **Contexto:** armazenamento de Hidrogênio Líquido a $-253^\circ\text{C}$ ($20\text{ K}$).
* **Por que esfera?** Pelo Teorema Isoperimétrico, a esfera tem a **menor área externa por volume** ($A/V = 3/R$), minimizando a entrada de calor.
* **Dimensões:** vaso interno $r = 2{,}0\text{ m}$, blindagem externa $R = 2{,}5\text{ m}$, espessura de perlita expandida $e = 0{,}5\text{ m}$.
* **Resolução pelo Cálculo Integral:**
  $$V = \pi\int_{-2{,}5}^{2{,}5} (6{,}25 - x^2)\,dx - \pi\int_{-2{,}0}^{2{,}0} (4 - x^2)\,dx = \frac{4}{3}\pi (2{,}5^3 - 2{,}0^3) = \frac{30{,}5\pi}{3} \approx 31{,}94\text{ m}^3$$
* **Massa estimada:** com densidade da perlita $\rho = 120\text{ kg/m}^3$, temos $M = V \times \rho = 31{,}94 \times 120 \approx 3.832{,}8\text{ kg}$ ($\approx 3{,}83\text{ toneladas}$).
* **Discussão crítica:** na prática, tubulações de abastecimento, sensores e válvulas perfuram a parede (reduzindo ligeiramente o volume contínuo ideal), e a variação térmica ($+30^\circ\text{C}$ a $-253^\circ\text{C}$) exige projeto estrutural contra contração diferencial.
