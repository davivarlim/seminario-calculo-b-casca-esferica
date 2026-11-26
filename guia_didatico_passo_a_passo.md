# Guia Didático Passo a Passo: Casca de Esfera
**Seminário Investigativo de Cálculo B — Licenciatura em Matemática (UFPel / IFM / CLMD / UAB)**  
**Tema:** Casca de Esfera (região delimitada por duas esferas concêntricas)  
**Professor Formador:** Pedro Antonio Ourique  
**Material de Estudo Exclusivo para os Integrantes do Grupo**

---

Este guia segue a **sequência progressiva recomendada** (5 Partes / 6 Etapas): primeiro entendemos **uma esfera** do zero ($\text{Círculo} \to \text{Rotação} \to \text{Integral da Esfera} = \frac{4}{3}\pi R^3$) e só depois juntamos **duas esferas concêntricas** para construir a **Casca Esférica** e deduzir $V_{\text{casca}} = \frac{4}{3}\pi(R^3 - r^3)$.

---

## 🌓 Etapa 1 & 2 — Círculo e Rotação Formando a Esfera (PARTE 1 — Slides 1 e 2)

### Slide 1 — Círculo, Semicírculo e Propriedades ($\mathbb{R}^2$)
1. Todo ponto $(x,y)$ do círculo centrado na origem de raio $R$ forma com os eixos um **triângulo retângulo** de catetos $x, y$ e hipotenusa $R$, obedecendo Pitágoras:
   $$x^2 + y^2 = R^2$$
2. **Por que isolar $y \ge 0$?** A circunferência completa **não é uma função** (cada $x$ possui duas imagens: $\pm\sqrt{R^2-x^2}$). Mantendo apenas o arco superior ($y \ge 0$), surge a função:
   $$f(x) = \sqrt{R^2 - x^2}, \quad x \in [-R, R]$$
   Além disso, girar apenas essa metade superior em $360^\circ$ já varre toda a esfera sem duplicar o volume.

### Slide 2 — Rotação $360^\circ$ do Semicírculo: Surge a Esfera ($\mathbb{R}^2 \to \mathbb{R}^3$)
* Giramos $f(x) = \sqrt{R^2-x^2}$ em $360^\circ$ ao redor do eixo $x$, gerando a **esfera sólida completa no $\mathbb{R}^3$**.
* **Ideia da "moeda" (cilindro fino):** cada fatia vertical bem fina funciona como uma moeda de raio $f(x)$ e espessura/altura $\Delta x$, logo seu volume aproximado é:
  $$\Delta V \approx \pi\left[f(x)\right]^2 \Delta x$$
* **Pergunta que puxa a Parte 2:** *como somar infinitas moedas de $-R$ até $R$ sem depender de fórmula pronta?*

---

## 📈 Etapa 3 — Dedução do Volume de Uma Esfera (PARTE 2 — Slides 3 e 4)

### Slide 3 — Substituir $f(x)$, Cancelar a Raiz e Somar os Discos
1. **Cancelamento imediato da raiz:** substituindo $f(x)=\sqrt{R^2-x^2}$ na fórmula da moeda $\Delta V \approx \pi[f(x)]^2\Delta x$:
   $$\Delta V \approx \pi\left(\sqrt{R^2-x^2}\right)^2\Delta x = \pi\left(R^2 - x^2\right)\Delta x$$
2. **Soma de Riemann $\to$ Integral Definida:** somamos as $n$ fatias ($\Delta x = \frac{2R}{n}$), tomamos o limite $\Delta x \to 0$ e colocamos a constante $\pi$ fora da integral:
   $$V_{\text{esfera}} = \lim_{n \to \infty} \sum_{i=1}^{n} \pi \left(R^2 - (x_i^*)^2\right) \Delta x = \pi \int_{-R}^{R} \left(R^2 - x^2\right) dx$$
3. **Por que Método dos Discos (e NÃO Cascas)?** Elevar $f(x)$ ao quadrado elimina a raiz $\sqrt{R^2-x^2}$ antes mesmo de integrar; Cascas no eixo $x$ manteriam a raiz quadrada.

### Slide 4 — Integral Definida, Primitiva e Denominador Comum ($V_{\text{esfera}} = \frac{4}{3}\pi R^3$)
1. **Linearidade (partindo do Slide 3):**
   $$V_{\text{esfera}} = \pi \int_{-R}^{R} (R^2 - x^2)\,dx = \pi\left[\int_{-R}^{R} R^2\,dx - \int_{-R}^{R} x^2\,dx\right]$$
2. **Primitiva:** pela regra da constante ($\int R^2\,dx = R^2 x$) e da potência ($\int x^2\,dx = \frac{x^3}{3}$):
   $$P(x) = R^2 x - \frac{x^3}{3}$$
3. **Teorema Fundamental do Cálculo e denominador comum $3$ ($R^3 = \frac{3R^3}{3}$):**
   $$V_{\text{esfera}} = \pi\left[\left(\frac{3R^3}{3} - \frac{R^3}{3}\right) - \left(\frac{-3R^3}{3} + \frac{R^3}{3}\right)\right] = \pi\left[\frac{2R^3}{3} - \left(-\frac{2R^3}{3}\right)\right] = \mathbf{\frac{4}{3}\pi R^3}$$

---

## 🌐 Etapa 4 — Construção da Casca Esférica: Duas Esferas Concêntricas (PARTE 2 — Slides 5, 6 e 7)

### Slide 5 — Definição no $\mathbb{R}^3$ e Ligação $V_{\text{ext}} - V_{\text{int}}$
* Agora relacionamos **duas esferas concêntricas** centradas em $C(0,0,0)$: a **externa** ($R$) e o **miolo vazio** ($r$), formando uma parede de **espessura $e = R - r$** (ex.: $R=5,\; r=3 \implies e=2$).
* Definição formal no $\mathbb{R}^3$:
  $$\mathcal{S} = \left\{(x,y,z) \in \mathbb{R}^3 \;\middle|\; r^2 \le x^2 + y^2 + z^2 \le R^2\right\}$$
* Ponte para a Etapa 5: $V_{\text{casca}} = V_{\text{esfera}}(R) - V_{\text{esfera}}(r)$.

### Slide 6 — Região Geradora $\mathcal{R}$ e Revolução $360^\circ$ ($R=5,\; r=3$)
* Unimos $f(x)=\sqrt{R^2-x^2}$ ($[-5,5]$) e $g(x)=\sqrt{r^2-x^2}$ ($[-3,3]$) na faixa $\mathcal{R} = \{(x,y)\in\mathbb{R}^2 \mid r^2 \le x^2+y^2 \le R^2,\; y \ge 0\}$ e giramos $360^\circ$ no eixo $x$ formando a casca oca em 3D.

### Slide 7 — Modelagem no GeoGebra ($R=5,\; r=3$)
* No painel azul acima das imagens: declaramos $f(x)=\sqrt{R^2-x^2} \xrightarrow{R=5} \sqrt{25-x^2}$ e $g(x)=\sqrt{r^2-x^2} \xrightarrow{r=3} \sqrt{9-x^2}$ e validamos o sólido de revolução no GeoGebra 2D e 3D.

---

## 🔬 Etapa 5 — Fórmula Final da Casca Esférica (PARTE 2 — Slide 8)

* Pelo resultado da Etapa 3 aplicado aos raios $R$ e $r$ (Método dos Discos duas vezes — sem precisar quebrar em 3 intervalos como ocorreria com Arruelas):
  $$V_{\text{ext}} = \pi\int_{-R}^{R}(R^2-x^2)\,dx = \frac{4}{3}\pi R^3, \qquad V_{\text{int}} = \pi\int_{-r}^{r}(r^2-x^2)\,dx = \frac{4}{3}\pi r^3$$
* Subtraindo os volumes, chegamos à **fórmula deduzida em destaque**:
  $$V_{\text{casca}} = \frac{4}{3}\pi R^3 - \frac{4}{3}\pi r^3 = \mathbf{\frac{4}{3}\pi(R^3 - r^3)}$$
  *(Com $R=5,\; r=3 \implies V = \frac{4}{3}\pi(125 - 27) = \frac{392\pi}{3} \approx 410{,}50$, pronto para aplicar nos dois problemas!)*

---

## 🚀 Etapa 6 — Aplicações Práticas e Conclusão (PARTES 3, 4 e 5 — Slides 9 a 15)

### Parte 3 — Aplicação Matemática: Bola de Chocolate Oca / ENEM PPL 2023 (Slides 9 e 10)
* **Fonte:** INEP — **ENEM PPL 2023**, Questão 159 (Caderno Azul): $d = 20\text{ cm} \implies R = 10\text{ cm}$, $e = 1\text{ cm} \implies r = 9\text{ cm}$, $1\text{ g} \leftrightarrow 0{,}75\text{ cm}^3$.
* **Volume:** $V = \frac{4}{3}\pi(10^3-9^3) = \frac{1.084\pi}{3}\text{ cm}^3 \approx 1.135{,}16\text{ cm}^3 \approx 0{,}001135\text{ m}^3$.
* **Massa (Gabarito C):** $M = \frac{V}{0{,}75} = \frac{4.336\pi}{9}\text{ g} \approx 1.513{,}55\text{ g}$.

### Parte 4 — Aplicação Inédita: Reservatório Esférico de Concreto (Slides 11 a 14)
* **Dados:** câmara interna de água $r = 2{,}0\text{ m}$, parede $e = 0{,}5\text{ m} \implies R = 2{,}5\text{ m}$, solicitando apenas o **volume de concreto ($V_{\text{concreto}}$)** após modelagem 4-em-1 no GeoGebra (Slide 12).
* **Integral definida (Slide 13):**
  $$V_{\text{concreto}} = \pi\int_{-2{,}5}^{2{,}5}(6{,}25-x^2)\,dx - \pi\int_{-2{,}0}^{2{,}0}(4-x^2)\,dx = \frac{30{,}5\pi}{3}\text{ m}^3 \approx 31{,}94\text{ m}^3 \;\;(\approx 4\text{ betoneiras de }8\text{ m}^3)$$
  *(Referência interna: $V_{\text{água}} = \frac{4}{3}\pi(2{,}0)^3 \approx 33{,}51\text{ m}^3 = 33.510\text{ L}$.)*
* **Limitações (Slide 14):** fundação estrutural e aberturas reais de canos/tampa que perfuram a casca contínua.

### Parte 5 — Conclusão e Encerramento (Tela 15)
* Retomada da jornada completa e arguição da banca.
