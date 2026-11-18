# Roteiro de Apresentação e Guia de Arguição da Banca
**Seminário de Cálculo B — Casca de Esfera (UFPel / IFM / CLMD / UAB)**  
**Tema Sorteado:** Região delimitada por duas esferas concêntricas  
**Professor Formador:** Prof. Pedro Antonio Ourique  
**Data:** 02 de dezembro de 2026, às 19h  
**Equipe:** Ariane Teixeira Pereira, Daniel Cemin Militão e Davi Vargas Limeira

---

## ⏱️ Roteiro de Fala Objetivo — 19 Slides (15 a 20 Minutos)

> **Dica para a apresentação presencial:** os slides agora são limpos e visuais de propósito — **não leia a tela**. Use os 2 ou 3 tópicos de cada slide apenas como guia visual para falar com naturalidade, como em uma aula. A barra `REFERÊNCIAS:` no topo explica cada letra antes mesmo de começar a fórmula.

### SLIDE 01: Capa Oficial
* **Fala:** *"Boa noite ao professor Pedro Antonio Ourique, tutores e colegas. Somos Ariane Teixeira Pereira, Daniel Cemin Militão e Davi Vargas Limeira, da Licenciatura em Matemática a Distância (UFPel / IFM / CLMD / UAB). Nosso seminário trata da **Casca de Esfera** — região delimitada por duas esferas concêntricas — cobrindo fundamentação formal, dedução integral, problema numérico e aplicação contextualizada."*  
*(Clique em `Iniciar Apresentação →`)*

### SLIDE 02 (PARTE 1): Definição Formal no $\mathbb{R}^3$ e Pitágoras 3D
* **Fala:** *"Uma casca esférica é como uma bola oca: tem parede sólida por fora e vazio por dentro. No espaço $\mathbb{R}^3$, ela é o conjunto $\mathcal{S}$ dos pontos cuja distância à origem está entre o raio interno $r$ e o externo $R$. E de onde vem $x^2 + y^2 + z^2$? Pelo Teorema de Pitágoras duas vezes: primeiro a diagonal da base vale $p^2 = x^2 + y^2$, e ao subir na altura $z$, a distância em linha reta até a origem vale $d = \sqrt{x^2 + y^2 + z^2}$. Elevando $r \le d \le R$ ao quadrado, eliminamos a raiz e ficamos com $r^2 \le x^2 + y^2 + z^2 \le R^2$."*  
*(Aponte no diagrama à direita para os catetos $x, y, z$, a hipotenusa $d$ e a régua inferior entre $r=3$ e $R=5$)*

### SLIDE 03 (PARTE 1): Do Círculo de Pitágoras à Região Geradora $\mathcal{R}$
* **Fala:** *"Para construir esse sólido no Cálculo B por revolução, desenhamos uma fatia plana no gráfico 2D e giramos em torno do eixo $x$. Todo ponto da circunferência perfeita forma um triângulo retângulo com catetos $x, y$ e raio $R$: $x^2 + y^2 = R^2$. Quando isolamos o $y$, aparece a raiz quadrada: $y = \pm\sqrt{R^2 - x^2}$. Ficamos só com a metade de cima, $y \ge 0$, porque ao girar $360^\circ$ ela já varre o volume inteiro sem duplicar. Temos então a curva externa $f(x)$ no intervalo $[-R, R]$ (aqui $[-5, 5]$) e a curva interna $g(x)$ em $[-r, r]$ (aqui $[-3, 3]$), formando a região geradora $\mathcal{R}$."*  
*(Aponte para o triângulo retângulo no gráfico 2D, os intervalos $[-r, r]$ e $[-R, R]$, e clique em `Gerar Rotação`)*

### SLIDE 04 (PARTE 1): Elementos Constituintes e Simetrias ($R=5, r=3$)
* **Fala:** *"Usando os parâmetros didáticos $R=5\text{ cm}$ e $r=3\text{ cm}$, isolamos os 5 elementos: (1) o centro comum $C(0,0,0)$; (2) o raio externo $R$; (3) o raio interno da cavidade $r$; (4) a espessura $e = R - r = 2\text{ cm}$; e (5) a simetria esférica plena $O(3)$ — qualquer rotação ou plano que passe pelo centro preserva a forma do sólido."*  
*(Clique nos botões dos cards para destacar cada elemento se desejar)*

### SLIDE 05 (PARTE 1): Modelagem no GeoGebra ($R=5, r=3$)
* **Fala:** *"No GeoGebra, construímos à esquerda as funções limitantes $f(x)=\sqrt{25-x^2}$ em $[-5,5]$ e $g(x)=\sqrt{9-x^2}$ em $[-3,3]$, delimitando a região $9 \le x^2+y^2 \le 25$ com $y \ge 0$. À direita, vemos a revolução completa de $360^\circ$ no eixo $x$ gerando a casca em 3D."*

### SLIDE 06 (PARTE 2): Da Soma de Riemann à Integral Definida
* **Fala:** *"Agora entramos na dedução do volume. Fatiando o sólido perpendicularmente ao eixo $x$ em $n$ discos finos de largura $\Delta x = 2R/n$, cada fatia tem volume aproximado $\pi[y(x_i^*)]^2 \Delta x$. Somando todas as fatias temos a Soma de Riemann. Ao fazer $\Delta x \to 0$ e $n \to \infty$, essa soma converge exatamente para a integral definida $\int_{-R}^{R} \pi[y(x)]^2 dx$."*  
*(Arraste o slider de $n = 8$ para $n = 30$ ou $40$ para mostrar a convergência numérica para $523{,}60$!)*

### SLIDE 07 (PARTE 2): Método dos Discos (Arruelas) vs. Cascas Cilíndricas
* **Fala:** *"Escolhemos o Método dos Discos (com subtração de cavidade) porque $y = \sqrt{R^2 - x^2}$ e, ao elevar ao quadrado na fórmula $\pi y^2$, a raiz quadrada é eliminada na hora. Pelas Cascas Cilíndricas no eixo $x$, integraríamos em $dy$ com $2\pi y\sqrt{R^2-y^2}$, mantendo a raiz e exigindo dividir a integral em dois intervalos no eixo $y$. Na animação 3D, notem que no miolo ($|x| < r$) as seções são arruelas de área constante $\pi(R^2 - r^2)$, pois o $-x^2$ cancela."*  
*(Mostre o `Corte 90°` no visualizador 3D)*

### SLIDE 08 (PARTE 2): Montagem da Integral e Propriedades Operatórias
* **Fala:** *"Montamos o volume da casca como a diferença entre o volume da esfera externa em $[-R, R]$ e o da cavidade interna em $[-r, r]$. Ao cancelar $(\sqrt{u})^2 = u$, aplicamos duas propriedades operatórias: retiramos a constante $\pi$ da integral e usamos a linearidade para separar a integral da diferença."*

### SLIDE 09 (PARTE 2): Antiderivada (Primitiva)
* **Fala:** *"Como $x$ é a variável de integração, $R^2$ e $r^2$ são constantes: $\int R^2 dx = R^2 x$. Pela regra da potência, $\int x^2 dx = \frac{x^3}{3}$. Logo, a primitiva é $P(x) = R^2 x - \frac{x^3}{3}$ (e analogamente com $r$ para a esfera interna)."*

### SLIDE 10 (PARTE 2): Teorema Fundamental do Cálculo
* **Fala:** *"Aplicando o Teorema Fundamental do Cálculo $P(b) - P(a)$ nos limites $[-R, R]$, obtemos $\frac{2R^3}{3} - \left(-\frac{2R^3}{3}\right) = \frac{4R^3}{3}$, dando $V_{\text{ext}} = \frac{4}{3}\pi R^3$. Pelo mesmo processo em $[-r, r]$, chegamos a $V_{\text{int}} = \frac{4}{3}\pi r^3$."*

### SLIDE 11 (PARTE 2): Fórmula Final e Interpretação Geométrica
* **Fala:** *"Subtraindo os volumes, deduzimos $V_{\text{casca}} = \frac{4}{3}\pi(R^3 - r^3)$, que corresponde diretamente à diferença entre duas esferas da Geometria Euclidiana. Fatorando $R^3 - r^3 = e(R^2 + Rr + r^2)$, quando a espessura $e \to 0$ temos $V \approx 4\pi R^2 \cdot e$: o volume de uma casca fina é área superficial vezes espessura, confirmando que $\frac{dV}{dR} = 4\pi R^2$."*

### SLIDE 12 (PARTE 3): Flutuador Industrial de Aço (Enunciado)
* **Fala:** *"Na Parte 3, aplicamos a fórmula a um flutuador mecânico de aço inoxidável para controle de nível em caldeira, com raio externo $R = 10\text{ cm}$ e espessura $e = 2\text{ cm}$. Pela relação $e = R - r$, determinamos o raio da cavidade oca interna: $r = 8\text{ cm}$."*  
*(Use `Explodir` ou `Raio-X` no modelo 3D)*

### SLIDE 13 (PARTE 3): Resolução Numérica, Unidades SI e Interpretação
* **Fala:** *"Calculamos $10^3 - 8^3 = 1000 - 512 = 488\text{ cm}^3$, obtendo $V = \frac{1952\pi}{3}\text{ cm}^3 \approx 2044{,}13\text{ cm}^3$. Como $1\text{ m}^3 = (100\text{ cm})^3 = 10^6\text{ cm}^3$, no Sistema Internacional temos $V \approx 0{,}002044\text{ m}^3$. Geometricamente, são cerca de $2{,}04\text{ L}$ de aço maciço formando uma parede de $2\text{ cm}$ ao redor de uma cavidade oca de $\approx 2{,}14\text{ L}$."*  
*(Mova o slider de corte no modelo 3D)*

### SLIDE 14 (PARTE 4): Tanque Criogênico de Hidrogênio Líquido ($LH_2$)
* **Fala:** *"Para a aplicação inédita, projetamos um tanque criogênico para armazenar hidrogênio líquido a $-253^\circ\text{C}$. Escolhemos a esfera porque ela oferece a menor área externa para um mesmo volume ($A/V = 3/R$), reduzindo a entrada de calor. O vaso interno tem $r = 2{,}0\text{ m}$ e a blindagem externa tem $R = 2{,}5\text{ m}$, formando uma casca isolante de perlita expandida com $e = 0{,}5\text{ m}$."*  
*(Mostre a vista explodida das 3 camadas em 3D)*

### SLIDE 15 (PARTE 4): GeoGebra (1/2) — Curvas 2D e Seção $180^\circ$
* **Fala:** *"Aqui temos a modelagem do tanque no GeoGebra: as curvas geradoras $f(x)=\sqrt{6{,}25-x^2}$ e $g(x)=\sqrt{4-x^2}$ no semiplano $y \ge 0$, e à direita a meia-revolução de $180^\circ$ exibindo a espessura isolante."*

### SLIDE 16 (PARTE 4): GeoGebra (2/2) — 3D Paramétrico e Casca Translúcida
* **Fala:** *"No segundo conjunto do GeoGebra, implementamos as superfícies paramétricas completas no 3D (usando $u$ na coordenada vertical $z$ por simetria esférica para visualizar o tanque em pé) e a versão translúcida destacando a cavidade interna do $LH_2$."*

### SLIDE 17 (PARTE 4): Volume do Isolamento via Integral Definida
* **Fala:** *"Aplicando o Cálculo Integral diretamente ao tanque: montamos $\pi\int_{-2{,}5}^{2{,}5}(6{,}25-x^2)\,dx - \pi\int_{-2{,}0}^{2{,}0}(4-x^2)\,dx$, avaliamos pelo TFC e obtemos $\frac{4}{3}\pi(15{,}625 - 8) = \frac{30{,}5\pi}{3} \approx 31{,}94\text{ m}^3$ de perlita. Pela fórmula $M = V \times \rho$ com $\rho = 120\text{ kg/m}^3$, chegamos a $\approx 3.832{,}8\text{ kg}$ ($\approx 3{,}83\text{ toneladas}$)."*

### SLIDE 18 (PARTE 4): Discussão Crítica e Limitações do Modelo
* **Fala:** *"Por fim, analisamos criticamente o resultado: as $3{,}83\text{ toneladas}$ de perlita e a variação térmica até $-253^\circ\text{C}$ exigem suportes estruturais reforçados. Além disso, a integral assume uma casca fechada ideal — na prática, tubulações de abastecimento, alívio e sensores perfuram as paredes, quebram a simetria perfeita e reduzem ligeiramente o volume real de isolante."*  
*(Clique em `2. Perlita` e depois em `3. Limitações` no visualizador 3D)*

### SLIDE 19: Conclusão e Considerações Finais
* **Fala:** *"Concluímos integrando rigor analítico, visualizações geométricas em GeoGebra e 3D e análise crítica de engenharia. Agradecemos e ficamos à disposição da banca para arguição."*

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

5. **Por que no GeoGebra 3D (Slide 16) a variável $u$ ficou no eixo $z$ em vez do eixo $x$?**  
   Pela simetria esférica $O(3)$ centrada na origem, girar em torno de $x$, $y$ ou $z$ gera exatamente a mesma casca esférica; usamos o eixo $z$ na parametrização para deixar o tanque alinhado verticalmente na janela 3D.

6. **Por que escolher esfera no tanque criogênico e qual a limitação do cálculo?**  
   A esfera minimiza a área superficial para um dado volume ($A/V = 3/R$), reduzindo a entrada de calor. Porém, a integral supõe casca contínua e perfeita, enquanto o tanque real possui perfurações de dutos e válvulas que subtraem parte do volume teórico.
