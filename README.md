# Seminário de Cálculo B — Casca de Esfera (UFPel)
**Universidade Federal de Pelotas &bull; Instituto de Física e Matemática**  
**Departamento de Matemática e Estatística (DEMAT) &bull; Licenciatura em Matemática a Distância (CLMD / UAB)**  
**Tema Sorteado:** Casca de Esfera (Região delimitada por duas esferas concêntricas)  
**Professor Formador:** Prof. Pedro Antonio Ourique  
**Equipe de Apresentação:**
1. Ariane Teixeira Pereira
2. Daniel Cemin Militão
3. Davi Vargas Limeira

> 🌐 **Apresentação Interativa Online (GitHub Pages):**  
> ### 👉 **[https://davivarlim.github.io/seminario-calculo-b-casca-esferica/](https://davivarlim.github.io/seminario-calculo-b-casca-esferica/)**

---

## 🌟 Estrutura da Apresentação Didática (17 Slides de Ecrã Inteiro)

Para garantir máxima clareza, respiração visual e permitir o desenvolvimento das contas passo a passo sem sobrecarregar a tela nem exigir rolagem vertical, o seminário foi estruturado em **17 slides interativos**:

1. **Slide 01 — Capa Oficial:** Banner oficial institucional UFPel/IFM/DEMAT/CLMD em alta resolução, dados do curso, professor e alunos.
2. **Slide 02 — PARTE 1: Definição Formal no $\mathbb{R}^3$ ($R=5, r=3$):** Região plana geradora $\mathcal{R}$ no semiplano $y \ge 0$, canvas 2D interativo e rotação $360^\circ$ no espaço 3D.
3. **Slide 03 — PARTE 1: Propriedades Geométricas (5 Desenhos Dedicados):**
   * Desenho 1: Centro $C(0,0,0)$ com ondas de radar
   * Desenho 2: Raio Externo ($R = 5\text{ cm}$)
   * Desenho 3: Raio Interno ($r = 3\text{ cm}$)
   * Desenho 4: Espessura de Parede Sólida ($e = R - r = 2\text{ cm}$)
   * Desenho 5: Simetria Radial Plena e Eixos Axiais com Rotação Contínua 360°
4. **Slide 04 — PARTE 1: Modelagem no GeoGebra ($R=5, r=3$):** Prints autorais em alta definição com gráficos 2D e revolução 3D.
5. **Slide 05 — PARTE 2: Método dos Discos vs. Cascas Cilíndricas:** Justificativa da escolha (teto e piso imediatos) e visualização 3D com fatiamento dinâmico.
6. **Slide 06 — PARTE 2: Passos 3.1 & 3.2: Montagem e Simplificação:** Aplicação da fórmula geral de revolução e cancelamento algébrico $(\sqrt{u})^2 = u$.
7. **Slide 07 — PARTE 2: Passo 3.3: Primitiva da Integral:** Regra da constante ($\int R^2 dx = R^2 x$) e regra da potência ($\int x^2 dx = x^3/3$).
8. **Slide 08 — PARTE 2: Passo 3.4: Teorema Fundamental do Cálculo:** Avaliação nos limites $[-R, R]$ e $[-r, r]$ com cada fração e troca de sinal detalhada.
9. **Slide 09 — PARTE 2: Passo 3.5: Fórmula Final Deduzida:** Subtração $V = \frac{4}{3}\pi (R^3 - r^3)$, fatoração por diferença de cubos, conexão infinitesimal com a derivada ($\frac{dV}{dR} = 4\pi R^2$) e modelo 3D com corte técnico 90°.
10. **Slide 10 — PARTE 3: Problema Industrial (Flutuador Mecânico de Aço):** Esfera oca de aço inoxidável sob alta pressão ($R = 10\text{ cm}, e = 2\text{ cm} \implies r = 8\text{ cm}$) e modelo 3D polido em corte.
11. **Slide 11 — PARTE 3: Resolução Numérica Passo a Passo e Conversão ao SI:** Cálculos das potências ($1000 - 512 = 488$), resultado em $\text{cm}^3$ ($2044,13\text{ cm}^3$), conversão ao SI ($0{,}002044\text{ m}^3$) e slider 3D dinâmico de inspeção de espessura.
12. **Slide 12 — PARTE 4: Tanque Criogênico Aeroespacial ($LH_2$ a $-253^\circ\text{C}$):** Contexto tecnológico aeroespacial, raios $r = 2{,}0\text{ m}$ e $R = 2{,}5\text{ m}$ e modelo 3D industrial com 3 camadas concêntricas entrelaçadas.
13. **Slide 13 — PARTE 4: GeoGebra Proposto — Curvas 2D e Seção $180^\circ$:** Curvas geradoras e meia-casca oca modeladas no software matemático.
14. **Slide 14 — PARTE 4: GeoGebra Proposto — 3D Paramétrico e Casca Translúcida:** Superfícies analíticas e transparência da cavidade de combustível.
15. **Slide 15 — PARTE 4: Cálculo do Volume de Isolamento de Perlita:** Diferença de cubos ($15{,}625 - 8 = 7{,}625$), volume da casca de perlita ($31{,}94\text{ m}^3$) e estimativa de massa (~3,8 toneladas).
16. **Slide 16 — PARTE 4: Discussão Crítica e Limitações do Modelo:** Viabilidade física vs furos por tubulações de abastecimento, com alternância de camadas no visualizador 3D.
17. **Slide 17 — Conclusão e Considerações Finais:** Síntese pedagógica do seminário, agradecimentos e abertura para a banca examinadora.

---

## 🚀 Tecnologias Utilizadas
* **HTML5 Semântico & CSS3 Puro:** Design responsivo, zero rolagem vertical, tipografia moderna (*Inter* e *Fira Code*).
* **KaTeX (CDN):** Renderização matemática LaTeX ultrarrápida.
* **Three.js (r128) & OrbitControls:** Cenas 3D interativas em tempo real com controle de órbita, materiais metálicos PBR e planos de corte (*clipping planes*).
* **GeoGebra:** Modelagem geométrica analítica e paramétrica.

---

## ⌨️ Navegação
* **Setas $\leftarrow$ / $\rightarrow$ ou Barra de Espaço:** Navegar entre os slides.
* **Teclas `Home` / `End`:** Ir diretamente para a Capa ou para a Conclusão.
* **Barra Superior (Pílulas):** Acesso em 1 clique a qualquer slide (Capa, P1, P2, P3, P4, Fim).
* **Cards do Roteiro (Capa):** Clique nas etapas para ir diretamente para a seção desejada.
* **Tecla `F`:** Alternar Modo Tela Cheia (*Fullscreen*).
