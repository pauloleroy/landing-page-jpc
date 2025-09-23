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
    sectionAbrir.classList.add('hidden');
    sectionTrocar.classList.add('hidden');
    sectionOutros.classList.add('hidden');
    // remove requisitos dos inputs internos
    Array.from(sectionAbrir.querySelectorAll('input, select, textarea')).forEach(i => i.required = false);
    Array.from(sectionTrocar.querySelectorAll('input, select, textarea')).forEach(i => i.required = false);
    Array.from(sectionOutros.querySelectorAll('input, select, textarea')).forEach(i => i.required = false);
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

// ✅ FUNÇÃO DE SUBMIT CORRIGIDA - EVITA CAMPOS OCULTOS
form.addEventListener('submit', function (ev) {
    // browser native validity
    if (!form.checkValidity()) {
        ev.preventDefault();
        
        // 🔥 CORREÇÃO: Encontra apenas campos inválidos VISÍVEIS
        const allInvalid = form.querySelectorAll(':invalid');
        let primeiroInvalidoVisivel = null;
        
        // Filtra apenas campos que estão visíveis na tela
        allInvalid.forEach(campo => {
            // Verifica se o campo está visível (não está em elemento hidden)
            if (campo.offsetParent !== null && !campo.closest('.hidden')) {
                if (!primeiroInvalidoVisivel) {
                    primeiroInvalidoVisivel = campo;
                }
            }
        });
        
        // Se encontrou um campo inválido visível, foca nele
        if (primeiroInvalidoVisivel) {
            primeiroInvalidoVisivel.classList.add('border-red-500');
            primeiroInvalidoVisivel.focus();
            
            // 🔥 MELHORIA MOBILE: Scroll mais compatível
            if (primeiroInvalidoVisivel.scrollIntoView) {
                setTimeout(() => {
                    primeiroInvalidoVisivel.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest',
                        inline: 'nearest'
                    });
                }, 100);
            }
        } else {
            // Fallback: Se não encontrou visível, mostra alerta
            alert('Por favor, preencha todos os campos obrigatórios antes de enviar.');
        }
        
        return false;
    }
    
    // Se passou na validação, desabilita botão
    document.getElementById('btnEnviar').setAttribute('disabled','disabled');
    document.getElementById('btnEnviar').textContent = 'Enviando...';
    
    // ✅ Netlify vai cuidar do envio e redirecionamento
    return true;
});

  // início: se foi pré-selecionado algum objetivo (ex: volta do navegador), mostra
  const pre = document.querySelector('input[name="objetivo"]:checked');
  if (pre) showSection(pre.value);
});
