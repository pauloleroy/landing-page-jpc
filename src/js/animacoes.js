const botoes = document.querySelectorAll('.btn-contato');
const conteudo = document.getElementById('conteudo');

const textos = {
  abrir: {
    titulo: "Torne o início leve, seguro e sem erros",
    texto: "Te ajudamos a definir o melhor tipo de empresa, CNPJ, natureza jurídica e regime tributário — com clareza desde o primeiro passo."
  },
  regularizar: {
    titulo: "Saia da irregularidade com confiança e sem surpresas",
    texto: "Analisamos sua situação, cuidamos das pendências com Receita, prefeitura ou juntas e te orientamos em cada etapa"
  },
  trocar: {
    titulo: "É mais simples do que parece",
    texto: "A gente cuida da parte chata, entra em contato com o contador atual (se quiser), e garante sigilo e respeito ao seu histórico"
  },
  duvidas: {
    titulo: "Fala com a gente sem compromisso",
    texto: "Seja qual for sua situação, vamos ouvir com atenção e te ajudar a entender seus direitos, obrigações e opções"
  }
};

const chaves = Object.keys(textos);
let currentIndex = 0;
let autoTimer;

// Função para atualizar o conteúdo e destacar botão ativo
function atualizarConteudo(chave) {
  botoes.forEach(b => b.classList.remove('ativo'));
  const botaoAtual = Array.from(botoes).find(b => b.dataset.key === chave);
  if (botaoAtual) botaoAtual.classList.add('ativo');

  conteudo.innerHTML = `
    <h3 class="text-xl md:text-2xl lg:text-3xl text-secondary font-bold font-family-montserrat mb-1 md:mb-2 lg:mb-5">${textos[chave].titulo}</h3>
    <p class="text-base md:text-lg lg:text-xl text-secondary font-family-karla">${textos[chave].texto}</p>
  `;
}

// Função para avançar automaticamente
function avancarAutomatico() {
  currentIndex = (currentIndex + 1) % chaves.length;
  atualizarConteudo(chaves[currentIndex]);
  iniciarTimer(); // reinicia o timer
}

// Timer automático
function iniciarTimer() {
  clearTimeout(autoTimer);
  autoTimer = setTimeout(avancarAutomatico, 7000); // troca a cada 7 segundos
}

// Eventos de clique
botoes.forEach(botao => {
  botao.addEventListener('click', () => {
    const chave = botao.dataset.key; // pega do data-key
    currentIndex = chaves.indexOf(chave);
    atualizarConteudo(chave);
    iniciarTimer(); // reinicia o timer ao clicar
  });
});

// Inicializa
atualizarConteudo(chaves[0]);
iniciarTimer();


//Animação LOOP de profissoes
const textosAnim = [
  "PROFISSIONAIS PJ",
  "PEQUENAS EMPRESAS",
  "MÉDICOS PJ",
  "PSICÓLOGOS PJ",
  "DENTISTAS PJ",
  "ARQUITETOS PJ",
  "ENGENHEIROS PJ",
  "TERAPEUTAS PJ",
  "PERSONAL TRAINERS PJ",
  "ESTETICISTAS PJ",
  "NUTRICIONISTAS PJ",
  "DESENVOLVEDORES PJ",
  "CORRETORES PJ"
];

const animText = document.getElementById("anim-text");
let index = 0;
let animationStarted = false;

// Função da animação letra a letra
function animateText() {
  const currentText = textosAnim[index];
  animText.innerHTML = "";

  currentText.split("").forEach((char, i) => {
    const span = document.createElement("span");
    // Espaços ficam visíveis com &nbsp;
    span.innerHTML = char === " " ? "&nbsp;" : char;
    span.style.opacity = 0;
    span.style.display = "inline-block";
    span.style.transform = "translateY(-10px)";
    span.style.transition = "all 0.3s ease";
    animText.appendChild(span);

    setTimeout(() => {
      span.style.opacity = 1;
      span.style.transform = "translateY(0)";
    }, i * 50);
  });

  index = (index + 1) % textosAnim.length;
  setTimeout(animateText, 3000);
}

// Intersection Observer para iniciar animação só quando aparecer na tela
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animationStarted) {
        animateText();
        animationStarted = true;
      }
    });
  },
  { threshold: 0.1 } // começa quando 10% do texto estiver visível
);

observer.observe(animText);

//Animação FAQ
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const chevron = item.querySelector('svg');
  const answer = item.querySelector('.faq-answer');
  const pergunta = item.querySelector('.faq-pergunta'); // <-- faltava

  item.addEventListener('click', () => {
    // Fecha todos os outros
    faqItems.forEach(i => {
      if(i !== item){
        i.querySelector('.faq-answer').style.maxHeight = null;
        i.querySelector('svg').classList.remove('rotate-180'); // rotação seta
        i.querySelector('.faq-pergunta').classList.remove('font-semibold'); // remove bold
      }
    });

    // Alterna o item clicado
    if(answer.style.maxHeight){
      answer.style.maxHeight = null;
      chevron.classList.remove('rotate-180');
      pergunta.classList.remove('font-semibold');
    } else {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      chevron.classList.add('rotate-180');
      pergunta.classList.add('font-semibold'); 
    }
  });
});



//Animação card serviços
// Seleciona container e botões
const container = document.getElementById('cardsContainer');
const btnPrev = document.getElementById('prevCard');
const btnNext = document.getElementById('nextCard');

// Função para calcular a largura do card + gap
function getCardWidth() {
  const firstCard = container.querySelector('.card');
  const nextCard = firstCard.nextElementSibling;
  if (!nextCard) return firstCard.offsetWidth;
  return nextCard.offsetLeft - firstCard.offsetLeft;
}

// Botão próximo
btnNext.addEventListener('click', () => {
  const scrollAmount = getCardWidth();
  container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

// Botão anterior
btnPrev.addEventListener('click', () => {
  const scrollAmount = getCardWidth();
  container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});


//animaçao imagens quem somos
const animContainers = document.querySelectorAll('.anim-container');

const animObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if(window.innerWidth < 768){ // só mobile
        if(entry.isIntersecting){
          entry.target.classList.add('animado'); // entra na tela → anima
        } else {
          entry.target.classList.remove('animado'); // sai da tela → volta ao estado inicial
        }
      }
    });
  },
  { threshold: 0.1 } // 10% visível
);

animContainers.forEach(c => animObserver.observe(c));