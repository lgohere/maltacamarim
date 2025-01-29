document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const parallaxWrapper = document.querySelector('.parallax-wrapper');
    const video = document.getElementById('myVideo');
    const form = document.getElementById('registration-form');
    const formContent = document.getElementById('form-content');
    const successContent = document.getElementById('success-content');
    const phoneInput = document.querySelector("#phone");

    // Configuração do intl-tel-input
    const iti = window.intlTelInput(phoneInput, {
        initialCountry: "br",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        customContainer: "iti-container",
        dropdownContainer: document.body,
        formatOnDisplay: false,
        autoHideDialCode: false,
        nationalMode: false,
        placeholderNumberType: 'MOBILE',
        preferredCountries: ['br'],
        sortBy: 'dialCode'
    });

    // Tratamento de eventos do campo de telefone
    phoneInput.addEventListener('focus', function() {
        if (phoneInput.value.trim() === '') {
            phoneInput.placeholder = '';
        }
    });

    phoneInput.addEventListener('blur', function() {
        if (phoneInput.value.trim() === '') {
            phoneInput.placeholder = 'Seu WhatsApp';
        }
        validatePhoneNumber();
    });

    // Função para validar número de telefone
    function validatePhoneNumber() {
        if (phoneInput.value.trim()) {
            if (iti.isValidNumber()) {
                phoneInput.classList.remove("error");
                return true;
            } else {
                phoneInput.classList.add("error");
                return false;
            }
        }
        return false;
    }

    // Ordenação dos países no dropdown
    function sortCountries() {
        var countryData = window.intlTelInputGlobals.getCountryData();
        var sortedCountries = countryData.sort((a, b) => {
            var aCode = parseInt(a.dialCode);
            var bCode = parseInt(b.dialCode);
            
            if (aCode === bCode) return 0;
            return aCode - bCode;
        });

        // Move o Brasil para o topo da lista
        var brIndex = sortedCountries.findIndex(c => c.iso2 === 'br');
        if (brIndex > -1) {
            var br = sortedCountries.splice(brIndex, 1)[0];
            sortedCountries.unshift(br);
        }

        iti.updateCountries(sortedCountries);
    }

    // Inicializa a ordenação dos países após carregar o intl-tel-input
    iti.promise.then(sortCountries);

    // Tratamento do envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Valida o número de telefone antes do envio
        if (!validatePhoneNumber()) {
            alert('Por favor, insira um número de WhatsApp válido.');
            return;
        }

        try {
            console.log('Iniciando envio do formulário');
            const formData = new FormData(this);
            
            // Atualiza o valor do campo de telefone com o número completo
            formData.set('phone', iti.getNumber());
            
            // Log dos dados do formulário
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await fetch('', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Resposta completa:', data);

            if (response.ok && data.success) {
                console.log('Sucesso no envio');
                
                // Animação de transição
                formContent.style.animation = 'fadeOut 0.5s forwards';
                
                setTimeout(() => {
                    formContent.style.display = 'none';
                    successContent.style.display = 'flex';
                    successContent.style.animation = 'fadeIn 0.5s forwards';
                }, 500);

                // Atualiza a URL sem recarregar a página
                history.pushState({}, '', '/success');
            } else {
                console.error('Erro na resposta:', data);
                let errorMessage = data.message || 'Erro desconhecido';
                if (data.errors) {
                    errorMessage += '\n' + Object.entries(data.errors)
                        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
                        .join('\n');
                }
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao enviar o formulário: ' + error.message);
        }
    });

    // Tratamento de erro do vídeo
    video.addEventListener('error', function(e) {
        console.error('Erro no carregamento do vídeo:', e);
        this.style.display = 'none';
        document.querySelector('.video-background').style.backgroundColor = '#1F4352';
    });

    // Tratamento de buffer do vídeo
    video.addEventListener('waiting', function() {
        document.querySelector('.overlay').style.opacity = '1';
    });

    // Quando o vídeo começa a tocar
    video.addEventListener('playing', function() {
        document.querySelector('.overlay').style.opacity = '0.85';
    });

    // Otimização do carregamento do vídeo
    video.addEventListener('loadedmetadata', function() {
        video.play().catch(function(error) {
            console.log("Reprodução automática falhou:", error);
        });
    });

    // Verifica a conexão e ajusta a qualidade do vídeo se necessário
    if (navigator.connection) {
        const connection = navigator.connection;
        if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            video.setAttribute('preload', 'none');
        }
    }

    // Tratamento do efeito parallax
    let ticking = false;
    parallaxWrapper.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = parallaxWrapper.scrollTop;
                const video = document.querySelector('.video-background');
                video.style.transform = `translateY(${scrolled * 0.5}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Detecta se está em modo paisagem em dispositivo móvel
    function checkOrientation() {
        if (window.matchMedia("(max-width: 768px) and (orientation: landscape)").matches) {
            document.body.classList.add('landscape');
        } else {
            document.body.classList.remove('landscape');
        }
    }

    // Monitora mudanças de orientação
    window.addEventListener('resize', checkOrientation);
    checkOrientation();
});