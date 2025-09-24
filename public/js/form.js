document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('orcamentoForm');
  const objetivoRadios = Array.from(document.querySelectorAll('input[name="objetivo"]'));
  const sectionAbrir = document.querySelector('[data-fluxo="abrir"]');
  const sectionTrocar = document.querySelector('[data-fluxo="trocar"]');
  const sectionOutros = document.querySelector('[data-fluxo="outros"]');

  // elementos condicionais
  const notasAbrirWrapper = document.getElementById('notas_abrir_wrapper');
  const notasAbrir = document.getElementById('notas_abrir');
  const notasTrocarWrapper = document.getElementById('notas_trocar_wrapper');
  const notasTrocar = document.getElementById('notas_trocar');

  const faturamentoAbrir = document.getElementById('faturamento_abrir');
  const faturamentoAbrirOutro = document.getElementById('faturamento_abrir_outro');
  const faturamentoTrocar = document.getElementById('faturamento_trocar');
  const faturamentoTrocarOutro = document.getElementById('faturamento_trocar_outro');

  // máscaras
  const whatsapp = document.getElementById('whatsapp');
  const telefone = document.getElementById('telefone');
  const cnpjTrocar = document.getElementById('cnpj_trocar');

  // salva estado original de 'required' para inputs (ajustamos depois)
  Array.from(form.querySelectorAll('input, select, textarea')).forEach(el => {
    el.dataset.origRequired = el.required ? 'true' : 'false';
  });


  function hideAllSections() {
      // Função para limpar uma seção específica
      function limparSecao(secao) {
          if (!secao) return;
          
          // Limpa todos os inputs, selects e textareas da seção
          const campos = secao.querySelectorAll('input, select, textarea');
          campos.forEach(campo => {
              if (campo.type === 'radio' || campo.type === 'checkbox') {
                  campo.checked = false;
              } else if (campo.tagName === 'SELECT') {
                  campo.selectedIndex = 0; // Volta para a primeira opção
              } else {
                  campo.value = ''; // Limpa inputs e textareas
              }
              
              // Remove classes de erro se houver
              campo.classList.remove('erro-campo');
          });
          
          // Esconde a seção
          secao.classList.add('hidden');
          
          // Remove o required dos campos da seção oculta
          Array.from(secao.querySelectorAll('input, select, textarea')).forEach(i => {
              i.required = false;
          });
      }
      
      // Limpa e esconde todas as seções
      limparSecao(sectionAbrir);
      limparSecao(sectionTrocar);
      limparSecao(sectionOutros);
  }

  function showSection(name) {
    hideAllSections();
    if (name === 'abrir') {
      sectionAbrir.classList.remove('hidden');
      // restaurar required onde originalmente true
      Array.from(sectionAbrir.querySelectorAll('input, select, textarea')).forEach(i => {
        if (i.dataset.origRequired === 'true') i.required = true;
      });
    } else if (name === 'trocar') {
      sectionTrocar.classList.remove('hidden');
      Array.from(sectionTrocar.querySelectorAll('input, select, textarea')).forEach(i => {
        if (i.dataset.origRequired === 'true') i.required = true;
      });
    } else if (name === 'outros') {
      sectionOutros.classList.remove('hidden');
      Array.from(sectionOutros.querySelectorAll('input, select, textarea')).forEach(i => {
        if (i.dataset.origRequired === 'true') i.required = true;
      });
    }
    // atualizar displays condicionais internos
    toggleNotasFields();
    toggleFaturamentoOutro();
  }

  objetivoRadios.forEach(r => r.addEventListener('change', e => {
    showSection(e.target.value);
    window.scrollTo({ top: form.offsetTop - 80, behavior: 'smooth' });
  }));

  // Emissão de notes listeners (delegation)
  form.addEventListener('change', function (e) {
    if (e.target.name === 'emissao_abrir' || e.target.name === 'emissao_trocar') {
      toggleNotasFields();
    }
    if (e.target.id === 'faturamento_abrir') toggleFaturamentoOutro();
    if (e.target.id === 'faturamento_trocar') toggleFaturamentoOutro();
  });

  function toggleNotasFields() {
    const emitirAbrir = form.querySelector('input[name="emissao_abrir"]:checked');
    if (emitirAbrir && emitirAbrir.value === 'contabilidade') {
      notasAbrirWrapper.classList.remove('hidden');
      notasAbrir.required = true;
    } else {
      notasAbrirWrapper.classList.add('hidden');
      notasAbrir.required = false;
      notasAbrir.value = '';
    }

    const emitirTrocar = form.querySelector('input[name="emissao_trocar"]:checked');
    if (emitirTrocar && emitirTrocar.value === 'contabilidade') {
      notasTrocarWrapper.classList.remove('hidden');
      notasTrocar.required = true;
    } else {
      notasTrocarWrapper.classList.add('hidden');
      notasTrocar.required = false;
      notasTrocar.value = '';
    }
  }

  function toggleFaturamentoOutro() {
    if (faturamentoAbrir && faturamentoAbrir.value === 'Outro') {
      faturamentoAbrirOutro.classList.remove('hidden');
      faturamentoAbrirOutro.required = true;
    } else if (faturamentoAbrir) {
      faturamentoAbrirOutro.classList.add('hidden');
      faturamentoAbrirOutro.required = false;
      faturamentoAbrirOutro.value = '';
    }

    if (faturamentoTrocar && faturamentoTrocar.value === 'Outro') {
      faturamentoTrocarOutro.classList.remove('hidden');
      faturamentoTrocarOutro.required = true;
    } else if (faturamentoTrocar) {
      faturamentoTrocarOutro.classList.add('hidden');
      faturamentoTrocarOutro.required = false;
      faturamentoTrocarOutro.value = '';
    }
  }

  // Máscaras simples (telefone / whatsapp)
  function maskPhone(v) {
    const d = v.replace(/\D/g,'');
    if (d.length <= 10) {
      // (00) 0000-0000
      return d.replace(/^(\d{2})(\d{0,4})(\d{0,4}).*/,'($1) $2' + (d.length>6?'-$3':''));
    } else {
      // (00) 00000-0000
      return d.replace(/^(\d{2})(\d{0,5})(\d{0,4}).*/,'($1) $2' + (d.length>7?'-$3':''));
    }
  }

  function maskCNPJ(v){
    const d = v.replace(/\D/g,'').slice(0,14);
    return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, function(_,a,b,c,d,e){
      return a + (b?'.'+b:'') + (c?'.'+c:'') + (d?'/'+d:'') + (e?'-'+e:'');
    });
  }

  if (whatsapp) whatsapp.addEventListener('input', e => {
    const pos = whatsapp.selectionStart;
    whatsapp.value = maskPhone(whatsapp.value);
  });
  if (telefone) telefone.addEventListener('input', e => {
    telefone.value = maskPhone(telefone.value);
  });
  if (cnpjTrocar) cnpjTrocar.addEventListener('input', e => {
    cnpjTrocar.value = maskCNPJ(cnpjTrocar.value);
  });

// ✅ VERSÃO CORRIGIDA PARA FIREFOX E TODOS BROWSERS
form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    
    // 🔥 VALIDAÇÃO QUE RESPEITA SUAS SEÇÕES DINÂMICAS
    let isValid = true;
    let primeiroCampoInvalido = null;
    
    // Remove classes de erro anteriores
    form.querySelectorAll('.erro-campo').forEach(el => {
        el.classList.remove('erro-campo');
    });
    
    // 1. Valida campos COMUNS (sempre visíveis)
    const camposComuns = ['nome', 'email', 'whatsapp', 'cidade', 'estado', 'meio_contato', 'horario'];
    
    camposComuns.forEach(fieldName => {
        const campo = form.querySelector(`[name="${fieldName}"]`);
        if (campo && campo.required && !campo.value.trim()) {
            campo.classList.add('erro-campo');
            isValid = false;
            if (!primeiroCampoInvalido) primeiroCampoInvalido = campo;
        }
    });
    
    // 2. Valida OBJETIVO (radio button)
    const objetivoSelecionado = form.querySelector('input[name="objetivo"]:checked');
    if (!objetivoSelecionado) {
        isValid = false;
        // Marca visualmente os radios de objetivo
        document.querySelectorAll('input[name="objetivo"]').forEach(radio => {
            radio.closest('label').style.color = '#ef4444';
        });
        if (!primeiroCampoInvalido) primeiroCampoInvalido = document.querySelector('input[name="objetivo"]');
    } else {
        // Remove marcação se estiver ok
        document.querySelectorAll('input[name="objetivo"]').forEach(radio => {
            radio.closest('label').style.color = '';
        });
    }
    
    // 3. Valida campos da SEÇÃO ATIVA (dinâmica)
    const secaoAtiva = document.querySelector('[data-fluxo]:not(.hidden)');
    if (secaoAtiva && objetivoSelecionado) {
        const camposSecao = secaoAtiva.querySelectorAll('input, select, textarea');
        
        camposSecao.forEach(campo => {
            if (campo.required && !campo.value.trim()) {
                // Validação especial para grupos de radio
                if (campo.type === 'radio') {
                    const grupoRadio = form.querySelectorAll(`input[name="${campo.name}"]`);
                    const algumSelecionado = Array.from(grupoRadio).some(radio => radio.checked);
                    
                    if (!algumSelecionado) {
                        isValid = false;
                        grupoRadio[0].classList.add('erro-campo');
                        if (!primeiroCampoInvalido) primeiroCampoInvalido = grupoRadio[0];
                    }
                } else {
                    // Campos normais (input, select, textarea)
                    campo.classList.add('erro-campo');
                    isValid = false;
                    if (!primeiroCampoInvalido) primeiroCampoInvalido = campo;
                }
            }
        });
    }
    
    // 4. FEEDBACK PARA O USUÁRIO
    if (!isValid) {
        // 🔥 FEEDBACK MOBILE-FRIENDLY
        alert('Por favor, preencha todos os campos obrigatórios antes de enviar.');
        
        // 🔥 SCROLL para Firefox mobile (compatível)
        if (primeiroCampoInvalido) {
            setTimeout(() => {
                const rect = primeiroCampoInvalido.getBoundingClientRect();
                const scrollTop = window.pageYOffset + rect.top - 100;
                
                window.scrollTo({
                    top: scrollTop,
                    behavior: 'auto' // Mais compatível que 'smooth'
                });
                
                // Tenta focar, mas não é essencial
                try {
                    primeiroCampoInvalido.focus();
                } catch (e) {
                    // Ignora erro no Firefox mobile
                }
            }, 300);
        }
        
        return false;
    }
    
    // 5. SE VÁLIDO, ENVIA
    document.getElementById('btnEnviar').disabled = true;
    document.getElementById('btnEnviar').textContent = 'Enviando...';
    
    setTimeout(() => {
        form.submit();
    }, 1000);
    
    return true;
});

  // início: se foi pré-selecionado algum objetivo (ex: volta do navegador), mostra
  const pre = document.querySelector('input[name="objetivo"]:checked');
  if (pre) showSection(pre.value);
});
