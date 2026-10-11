# Roteiro de Apresentação e Guia de Arguição da Banca
**Seminário de Cálculo B — Casca de Esfera (UFPel)**  
**Tema Sorteado:** Região delimitada por duas esferas concêntricas  
**Professor Formador:** Prof. Pedro Antonio Ourique  
**Equipe de Apresentação:**
1. Ariane Teixeira Pereira
2. Daniel Cemin Militão
3. Davi Vargas Limeira

---

## ⏱️ Roteiro de Fala Slide a Slide (15 a 20 Minutos)

### SLIDE 01: Capa Oficial da Apresentação
* **Fala do Apresentador:**  
  *"Cumprimentamos o professor Pedro Antonio Ourique, os tutores avaliadores e todos os colegas. Somos os discentes Ariane Teixeira Pereira, Daniel Cemin Militão e Davi Vargas Limeira, do curso de Licenciatura em Matemática a Distância da Universidade Federal de Pelotas (UFPel / IFM / DEMAT / CLMD). Apresentamos hoje o seminário sobre o tema 'Casca de Esfera — Região Delimitada por Duas Esferas Concêntricas'. Desenvolvemos uma aplicação interativa dedicada para apresentar o rigor formal, a dedução analítica pelo Método dos Discos e aplicações industriais e criogênicas."*  
  *(Avançar para o Slide 02).*

---

### SLIDE 02 (PARTE 1): Definição Formal no $\mathbb{R}^3$
* **Fala do Apresentador:**  
  *"Iniciamos com a fundamentação matemática: a casca esférica (ou coroa esférica) é um sólido de revolução tridimensional gerado pela rotação de uma região plana $\mathcal{R}$, contida no plano cartesiano $\mathbb{R}^2$, em torno do eixo das abcissas (eixo $x$). Essa região plana $\mathcal{R}$ é a área compreendida entre dois semicírculos concêntricos centrados na origem $(0,0)$ no semiplano superior $y \ge 0$."*  
* **Demonstração Interativa:**  
  *(Aponte para o gráfico 2D à esquerda e clique em 'Gerar Rotação' à direita)*:  
  *"Notem que consideramos apenas $y \ge 0$ para evitar que a rotação completa de $360^\circ$ sobreponha volume redundante. Ao acionarmos o giro, vemos a casca tridimensional surgir com transparência azul na casca externa e cavidade oca interna."*

---

### SLIDE 03 (PARTE 1): Propriedades Geométricas e Elementos Constituintes (5 Desenhos)
* **Fala do Apresentador:**  
  *"Para uma compreensão visual exaustiva, isolamos os 5 elementos geométricos em desenhos técnicos individuais:*  
  *1. **Centro $C(0,0,0)$:** Origem do sistema tridimensional de onde emanam todas as retas radiais.*  
  *2. **Raio Externo ($R$):** Distância radial do centro à superfície externa da esfera maior (exemplo: $R = 5\text{ cm}$).*  
  *3. **Raio Interno ($r$):** Raio da cavidade oca interior (exemplo: $r = 3\text{ cm}$).*  
  *4. **Espessura ($e = R - r$):** Diferença direta entre os raios, representando a espessura da parede sólida de material ($e = 5 - 3 = 2\text{ cm}$).*  
  *5. **Simetria Radial e Axial:** O sólido possui simetria esférica plena $O(3)$, sendo invariante sob rotação contínua em qualquer eixo que passe pela origem."*

---

### SLIDE 04 (PARTE 1): Modelagem Computacional no GeoGebra (Fundamentação $R=5, r=3$)
* **Fala do Apresentador:**  
  *"Atendendo rigorosamente às orientações da disciplina e do professor Pedro Antonio Ourique, construímos a modelagem autoral no GeoGebra para os parâmetros didáticos iniciais:*  
  *Exibimos as funções semicirculares $f(x) = \sqrt{25 - x^2}$, $g(x) = \sqrt{9 - x^2}$ e a inequação conjuntiva $a: 9 \le x^2 + y^2 \le 25 \wedge y \ge 0$. No painel 3D ao lado, demonstramos a revolução de $360^\circ$ em torno do eixo $x$, evidenciando a casca exterior translúcida e a cavidade oca interior perfeitamente gerada pelo software matemático."*

---

### SLIDE 05 (PARTE 2): Método dos Discos vs. Cascas Cilíndricas
* **Fala do Apresentador (Ponto Fundamental de Arguição):**  
  *"Entramos na dedução analítica do volume, onde um dos pontos centrais avaliados pela banca é: por que escolhemos o Método dos Discos e NÃO o Método das Cascas Cilíndricas?*  
  *1. **Função Teto e Função Piso Imediatas:** No Método dos Discos, fatiamos perpendicularmente ao eixo de rotação (eixo $x$). Para a esfera externa, a função teto é diretamente $y = \sqrt{R^2 - x^2}$ e a função piso é o eixo $y = 0$. Para a interna, o teto é $y = \sqrt{r^2 - x^2}$ e o piso é $y = 0$.*  
  *2. **Cancelamento Algébrico Direto:** Como o raio do disco é $y(x)$, a área da seção é $\pi [y(x)]^2 = \pi (\sqrt{R^2 - x^2})^2 = \pi(R^2 - x^2)$. O quadrado elimina a raiz na hora, gerando integrais de polinômios simples de segundo grau.*  
  *3. **Por que Cascas Cilíndricas complicaria?** Se usássemos cascas cilíndricas ao redor do eixo $x$, teríamos que integrar em $dy$, obtendo $2\pi \int y \sqrt{R^2 - y^2} dy$, e seríamos obrigados a fatiar a região em dois intervalos no eixo $y$: de $0$ a $r$ (diferença de esferas) e de $r$ a $R$ (apenas esfera externa). O Método dos Discos é, portanto, imensamente mais limpo, direto e elegante!"*  
* **Demonstração Interativa:**  
  *(Aponte para o visualizador 3D à direita e destaque a animação contínua)*:  
  *"Vejam no modelo 3D as duas esferas concêntricas e a animação do disco fatiador dourado deslizando pelo eixo $x$. Quando $|x| < 3$, o disco é anular (com furo interno vermelho), e quando $|x| \ge 3$, o disco se torna maciço. Cliquem em 'Corte 90°' para expor a cavidade interior ou 'Pausar' para fixar um valor específico de $x$."*

---

### SLIDE 06 (PARTE 2): Passos 3.1 & 3.2: Montagem da Equação e Simplificação
* **Fala do Apresentador:**  
  *"No Passo 3.1, aplicamos a fórmula geral de revolução $V = \pi \int [y(x)]^2 dx$:*  
  $$V = \pi \int_{-R}^{R} \left(\sqrt{R^2 - x^2}\right)^2 dx - \pi \int_{-r}^{r} \left(\sqrt{r^2 - x^2}\right)^2 dx$$  
  *No Passo 3.2, simplificamos os integrandos cancelando a raiz quadrada com a potência $(\sqrt{u})^2 = u$, obtendo polinômios simples de segundo grau:*  
  $$V = \pi \int_{-R}^{R} (R^2 - x^2) dx - \pi \int_{-r}^{r} (r^2 - x^2) dx$$"

---

### SLIDE 07 (PARTE 2): Passo 3.3: Primitiva da Integral
* **Fala do Apresentador:**  
  *"No Passo 3.3, calculamos a antiderivada (primitiva). Como $R$ é constante em relação a $x$, $\int R^2 dx = R^2 x$. Pela regra da potência, $\int x^2 dx = \frac{x^3}{3}$. Assim, a primitiva elementar é:*  
  $$P(x) = R^2 x - \frac{x^3}{3}$$  
  *E para o raio interno, analogamente: $P_{\text{int}}(x) = r^2 x - \frac{x^3}{3}$."*

---

### SLIDE 08 (PARTE 2): Passo 3.4: Teorema Fundamental do Cálculo
* **Fala do Apresentador:**  
  *"No Passo 3.4, aplicamos o Teorema Fundamental do Cálculo avaliando nos limites simétricos $[-R, R]$:*  
  *Substituindo o limite superior $R$: $R^3 - \frac{R^3}{3} = \frac{2R^3}{3}$.*  
  *Substituindo o limite inferior $-R$: $-R^3 + \frac{R^3}{3} = -\frac{2R^3}{3}$.*  
  *Subtraindo os dois termos: $\frac{2R^3}{3} - \left(-\frac{2R^3}{3}\right) = \frac{4R^3}{3}$, o que resulta em $V_{\text{ext}} = \frac{4}{3}\pi R^3$.*  
  *De maneira idêntica para o raio interno nos limites $[-r, r]$, obtemos $V_{\text{int}} = \frac{4}{3}\pi r^3$."*

---

### SLIDE 09 (PARTE 2): Passo 3.5: Fórmula Final Deduzida e Interpretação
* **Fala do Apresentador:**  
  *"Subtraindo os volumes, concluímos a fórmula final:*  
  $$V_{\text{casca}} = \frac{4}{3}\pi (R^3 - r^3)$$  
  *Destacamos ainda uma belíssima propriedade infinitesimal: fatorando a diferença de cubos por $e = R - r$, no limite em que a espessura $e \to 0$, o volume da casca se aproxima de $4\pi R^2 \cdot e$, demonstrando que a derivada do volume em relação ao raio é a área superficial da esfera: $\frac{dV}{dR} = 4\pi R^2$."*  
* **Demonstração Interativa:**  
  *(Aponte para o modelo 3D à direita)*:  
  *"No modelo 3D, vemos a casca em corte de 90° com a borda de corte em âmbar destacando a espessura maciça $e = 2$ e a cavidade escura interior. Podemos alternar para o modo 'Raio-X' para ver a transparência total."*

---

### SLIDE 10 (PARTE 3): Problema Industrial (Enunciado do Flutuador)
* **Fala do Apresentador:**  
  *"Na Parte 3, aplicamos a fórmula a um caso real de engenharia mecânica: o fabrico de flutuadores esféricos ocos em aço inoxidável para controle de nível em caldeiras sob alta pressão.*  
  *O problema fornece raio externo $R = 10\text{ cm}$ e espessura de parede $e = 2\text{ cm}$. Daí deduzimos o raio interno útil: $r = R - e = 10 - 2 = 8\text{ cm}$."*  
* **Demonstração Interativa:**  
  *(Mostre o flutuador 3D em rotação)*:  
  *"Vejam o flutuador flutuando suavemente em 3D: a parede maciça de 2 cm de aço inoxidável está cortada em 90° com chanfro dourado, revelando a cavidade oca interior iluminada em azul. Cliquem em 'Explodir' para ver o afastamento da casca e 'Raio-X' para a visão translúcida da cavidade."*

---

### SLIDE 11 (PARTE 3): Resolução Numérica Passo a Passo e Conversão ao SI
* **Fala do Apresentador:**  
  *"Substituindo na fórmula: $10^3 = 1000$ e $8^3 = 512$. A diferença de cubos é $1000 - 512 = 488\text{ cm}^3$. Multiplicando por $\frac{4}{3}\pi$, encontramos $V = \frac{1952\pi}{3}\text{ cm}^3 \approx 2044,13\text{ cm}^3$.*  
  *Convertendo rigorosamente para o Sistema Internacional ($1\text{ m}^3 = 1.000.000\text{ cm}^3$), obtemos $V \approx 0{,}002044\text{ m}^3$ de aço por flutuador.*  
  *(Use o slider de corte para 50% no modelo 3D para exibir a espessura de 2 cm e o interior oco)."*

---

### SLIDE 12 (PARTE 4): Tanque Criogênico Aeroespacial ($LH_2$ a $-253^\circ\text{C}$)
* **Fala do Apresentador:**  
  *"Na Parte 4, desenvolvemos uma aplicação inédita e autoral do grupo: o armazenamento aeroespacial de hidrogênio líquido a $-253^\circ\text{C}$ (apenas 20 K acima do zero absoluto).*  
  *Para impedir a evaporação rápida, o recipiente esférico de raio $r = 2{,}0\text{ m}$ é envolvido por uma casca envoltória com blindagem de $R = 2{,}5\text{ m}$, criando um espaço isolante sob vácuo preenchido com perlita expandida com espessura de $e = 0{,}5\text{ m}$."*  
* **Demonstração Interativa:**  
  *(Aponte para o modelo 3D do tanque criogênico)*:  
  *"Observem as 3 camadas concêntricas e entrelaçadas em corte de 90°: a capa externa de aço titânio, o manto intermediário de perlita expandida dourada ($50\text{ cm}$) e o núcleo criogênico de hidrogênio líquido a $-253^\circ\text{C}$ em ciano brilhante, com as tubulações atravessando as camadas. Acionem 'Vista Explodida' para ver as 3 cascas se expandindo radialmente de forma espetacular!"*

---

### SLIDE 13 (PARTE 4): GeoGebra Exclusivo (1/2) — Curvas 2D e Seção $180^\circ$
* **Fala do Apresentador:**  
  *"Apresentamos aqui o primeiro slide exclusivo com a modelagem do Problema Proposto no GeoGebra:*  
  *1. **No Print GEO-01 (à esquerda):** Exibimos as curvas geradoras $f(x) = \sqrt{6{,}25 - x^2}$ (para $x \in [-2{,}5; 2{,}5]$) e $g(x) = \sqrt{4 - x^2}$ (para $x \in [-2{,}0; 2{,}0]$), definindo rigorosamente as fronteiras semicirculares no semiplano superior $y \ge 0$.*  
  *2. **No Print GEO-02 (à direita):** Mostramos a região anelar sombreada pela inequação $a: 4 \le x^2 + y^2 \le 6{,}25 \wedge y \ge 0$ e realizamos um corte parcial de revolução de $180^\circ$ no espaço tridimensional. Isso comprova didaticamente como a meia-casca oca se desenvolve antes do fechamento total."*

---

### SLIDE 14 (PARTE 4): GeoGebra Exclusivo (2/2) — Álgebra Paramétrica 3D e Casca Translúcida
* **Fala do Apresentador:**  
  *"No segundo slide exclusivo de modelagem computacional:*  
  *1. **No Print GEO-03 (à esquerda):** Demonstramos as equações paramétricas clássicas implementadas no painel algébrico do GeoGebra 3D:*  
  $$b = \text{Superfície}\left(\sqrt{6{,}25 - u^2}\cos(v), \sqrt{6{,}25 - u^2}\sin(v), u, u, -2{,}5, 2{,}5, v, 0, 2\pi\right)$$  
  $$c = \text{Superfície}\left(\sqrt{4 - u^2}\cos(v), \sqrt{4 - u^2}\sin(v), u, u, -2, 2, v, 0, 2\pi\right)$$  
  *2. **No Print GEO-04 (à direita):** Ajustamos a transparência para evidenciar a cavidade oca interior ($r = 2{,}0\text{ m}$) onde fica armazenado o $LH_2$, e a espessura de $0{,}5\text{ m}$ que receberá a blindagem isolante de perlita."*

---

### SLIDE 15 (PARTE 4): Cálculo do Volume de Isolamento e Estimativa de Massa
* **Fala do Apresentador:**  
  *"Aplicando o Cálculo Integral de Riemann para a camada isolante:*  
  *$$V = \pi \int_{-2{,}5}^{2{,}5} (2{,}5^2 - x^2)dx - \pi \int_{-2{,}0}^{2{,}0} (2{,}0^2 - x^2)dx = \frac{4}{3}\pi (2{,}5^3 - 2{,}0^3)$$*  
  *$2{,}5^3 = 15{,}625$ e $2{,}0^3 = 8{,}000$. A diferença é $7{,}625\text{ m}^3$. Multiplicando por $\frac{4}{3}\pi$, obtemos $V = \frac{30{,}5\pi}{3}\text{ m}^3 \approx 31{,}94\text{ m}^3$.*  
  *Pela densidade da perlita expandida ($\rho \approx 120\text{ kg/m}^3$), encontramos uma massa de aproximadamente $3.832\text{ kg}$ (cerca de 3,8 toneladas de material)."*

---

### SLIDE 16 (PARTE 4): Discussão Crítica e Limitações do Modelo Físico-Matemático
* **Fala do Apresentador:**  
  *"Como futuros educadores matemáticos, realizamos a análise crítica exigida pela disciplina:*  
  *1. **Viabilidade Física:** As 3,8 toneladas de perlita exigem bases estruturais robustas nas sapatas de fundação da base aeroespacial, além de dimensionamento mecânico para a contração térmica extrema (de $+30^\circ\text{C}$ para $-253^\circ\text{C}$).*  
  *2. **Limitações do Modelo:** O cálculo integral assume uma casca suave, contínua e fechada. Na prática, o tanque possui tubulações de abastecimento, alívio e sensores que perfuram as paredes. Essas perfurações quebram a simetria perfeita e subtraem ligeiramente o volume contínuo de isolamento.*  
  *(Use o botão '3. Limitação do Modelo' para exibir as tubulações vermelhas perfurando a casca no modelo 3D)."*

---

### SLIDE 17: Conclusão e Considerações Finais
* **Fala do Apresentador:**  
  *"Concluímos o nosso seminário integrando o rigor algébrico do Cálculo B, a modelagem geométrica 3D no GeoGebra e Three.js, e o pensamento crítico em engenharia. Agradecemos ao professor Pedro Antonio Ourique e aos colegas, e colocamo-nos à disposição para a arguição da banca examinadora."*

---

## 🛡️ Guia de Arguição da Banca: Respostas Prontas para os Avaliadores

### Pergunta 1: *"Por que restringimos a região plana geradora ao semiplano superior $y \ge 0$?"*
**Resposta:**  
*"Se utilizássemos o anel circular completo com $y$ positivo e negativo e aplicássemos uma rotação completa de $360^\circ$ ($2\pi$ rad) em torno do eixo $x$, a metade inferior varreria exatamente o mesmo espaço físico tridimensional que a metade superior já varreu. Isso geraria uma dupla contagem de volume (equivalente a uma rotação de $720^\circ$). A restrição a $y \ge 0$ garante a bijetividade geométrica da revolução."*

---

### Pergunta 2: *"Qual é a vantagem do Método dos Discos em relação ao Método das Cascas Cilíndricas para este problema?"*
**Resposta:**  
*"Pelo Método dos Discos com fatiamento perpendicular ao eixo de rotação (eixo $x$), a geometria das seções é diretamente circular com raio $y = \sqrt{R^2 - x^2}$, eliminando a raiz quadrada ao elevar ao quadrado na integral $(\sqrt{R^2 - x^2})^2 = R^2 - x^2$. Pelo método das cascas cilíndricas com elementos verticais de espessura $dy$, teríamos que dividir a integração em intervalos e usar substituição trigonométrica para lidar com $\sqrt{R^2 - y^2}$, tornando o processo algébrico mais extenso, embora convergente para o mesmo resultado."*

---

### Pergunta 3: *"O que acontece quando a espessura da casca $e = R - r$ tende a zero? Qual é a conexão com a derivada?"*
**Resposta:**  
*"Quando a espessura $e$ tende a zero, fatoramos a diferença de cubos: $R^3 - r^3 = (R - r)(R^2 + Rr + r^2) = e(R^2 + Rr + r^2)$. Fazendo $r \to R$, temos $(R^2 + Rr + r^2) \to 3R^2$. Portanto, $V \approx \frac{4}{3}\pi \cdot e \cdot 3R^2 = 4\pi R^2 \cdot e$, que é exatamente a **área superficial da esfera multiplicada pela espessura infinitesimal**. Isso comprova que a derivada do volume da esfera em relação ao raio é a área da sua superfície: $\frac{dV}{dR} = 4\pi R^2$."*

---

### Pergunta 4: *"Na aplicação criogénica, por que foi escolhida a forma esférica para o tanque em vez de um cilindro?"*
**Resposta:**  
*"Pelo Teorema Isoperimétrico no espaço $\mathbb{R}^3$, a esfera é a forma geométrica que possui a menor área superficial externa para um dado volume interno ($A/V = 3/R$). Em criogenia extrema a $-253^\circ\text{C}$, uma menor área superficial em contacto com o ambiente reduz drasticamente a taxa de condução de calor (conforme a Lei de Fourier), minimizando a evaporação natural do hidrogénio (*boil-off*)."*

---

### Pergunta 5: *"Por que o cálculo integral puro superestima o volume real na engenharia?"*
**Resposta:**  
*"A integral de Riemann assume um sólido contínuo, simplesmente conexo e delimitado por superfícies suaves ideais. Na engenharia prática, o reservatório necessita de orifícios de entrada para tubulações de carga, tubos de medição de nível, sensores de pressão e válvulas de alívio criogênicas. Esses elementos subtraem volume da casca de isolamento e quebram a simetria perfeita."*
