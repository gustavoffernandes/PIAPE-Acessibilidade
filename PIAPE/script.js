document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // 1. ELEMENTOS GERAIS DO DOM
    // ==========================================================================
    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('.topico-manual');
    const noResults = document.getElementById('noResults');
    const profileCards = document.querySelectorAll('.profile-card');

    // ==========================================================================
    // 2. FUNÇÃO DE BUSCA INTELIGENTE
    // ==========================================================================
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            const termo = e.target.value.toLowerCase().trim();
            let encontrouGeral = false;

            if(termo.length > 0) {
                resetProfileFilterVisual(); 
            }

            sections.forEach(section => {
                let sectionVisible = false;
                const items = section.querySelectorAll('.accordion-item');
                
                items.forEach(item => {
                    const titulo = item.querySelector('.accordion-button').textContent.toLowerCase();
                    const corpo = item.querySelector('.accordion-body').textContent.toLowerCase();
                    
                    if(titulo.includes(termo) || corpo.includes(termo)) {
                        item.classList.remove('d-none');
                        
                        // Abre automaticamente se a busca for específica
                        if(termo.length > 2) {
                            const collapseElement = item.querySelector('.accordion-collapse');
                            if (collapseElement && !collapseElement.classList.contains('show')) {
                                new bootstrap.Collapse(collapseElement, { toggle: false }).show();
                            }
                        }
                        sectionVisible = true;
                        encontrouGeral = true;
                    } else {
                        item.classList.add('d-none');
                    }
                });

                if(sectionVisible) {
                    section.classList.remove('d-none');
                } else {
                    section.classList.add('d-none');
                }
            });

            if(!encontrouGeral) {
                noResults.classList.remove('d-none');
            } else {
                noResults.classList.add('d-none');
            }
        });
    }

    // ==========================================================================
    // 3. FILTRO POR PERFIL (LOGICA GLOBAL)
    // ==========================================================================
    window.filtrarPerfil = function(perfil, elemento) {
        
        // A. Atualiza visual dos cards (Active state)
        profileCards.forEach(card => card.classList.remove('active'));
        if (elemento) elemento.classList.add('active');
        else if (perfil === 'gestor') profileCards[1].classList.add('active');
        else if (perfil === 'coordenador') profileCards[2].classList.add('active');
        else if (perfil === 'docente') profileCards[3].classList.add('active');
        else if (perfil === 'discente') profileCards[4].classList.add('active');
        
        // B. Limpa a barra de busca
        if (searchInput) searchInput.value = '';
        if (noResults) noResults.classList.add('d-none');

        // C. Lógica Especial para Coordenador (Esconder Vídeos)
        const videoAccordion = document.getElementById('cMateriais1');
        if (videoAccordion) {
            if (perfil === 'coordenador') {
                videoAccordion.classList.add('d-none');
            } else {
                videoAccordion.classList.remove('d-none');
            }
        }

        // D. Lógica de mostrar/esconder seções
        sections.forEach(section => {
            const items = section.querySelectorAll('.accordion-item');
            items.forEach(i => {
                // Remove d-none, exceto se for o vídeo para coordenador
                if(i.id !== 'cMateriais1' || perfil !== 'coordenador') {
                    i.classList.remove('d-none');
                }
                
                // Fecha os acordeões para limpar a visão
                const collapseElement = i.querySelector('.accordion-collapse');
                if (collapseElement && collapseElement.classList.contains('show')) {
                    new bootstrap.Collapse(collapseElement, { toggle: false }).hide();
                }
            });

            if(perfil === 'todos') {
                section.classList.remove('d-none');
            } else {
                if(section.classList.contains('perfil-' + perfil)) {
                    section.classList.remove('d-none');
                } else {
                    section.classList.add('d-none');
                }
            }
        });

        // E. Filtro Fino para Materiais (Cards de Download/Vídeo)
        const materiais = document.querySelectorAll('.material-filter');
        materiais.forEach(item => {
            if(perfil === 'todos') {
                item.classList.remove('d-none');
            } else {
                if(item.classList.contains('material-' + perfil)) {
                    item.classList.remove('d-none');
                } else {
                    item.classList.add('d-none');
                }
            }
        });
    };

    function resetProfileFilterVisual() {
        profileCards.forEach(card => card.classList.remove('active'));
        if(profileCards.length > 0) profileCards[0].classList.add('active');
    }

    // ==========================================================================
    // 4. LIGHTBOX DE IMAGENS
    // ==========================================================================
    const modalHTML = `
        <div id="imageModal" class="lightbox-modal" role="dialog" aria-modal="true" aria-label="Visualização de Imagem Ampliada" tabindex="-1">
            <button class="lightbox-close" aria-label="Fechar visualização">&times;</button>
            <img class="lightbox-content" id="imgExpanded" alt="">
            <div id="caption" class="lightbox-caption"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const lightboxModal = document.getElementById("imageModal");
    const lightboxImg = document.getElementById("imgExpanded");
    const captionText = document.getElementById("caption");
    const closeLightboxBtn = lightboxModal.querySelector(".lightbox-close");
    const prints = document.querySelectorAll('.manual-print');
    let lastFocusedElement;

    prints.forEach(img => {
        img.addEventListener('click', function() {
            lastFocusedElement = document.activeElement;
            
            lightboxModal.classList.add('show');
            lightboxModal.style.display = "flex";
            
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
            captionText.innerHTML = this.alt || ''; 
            
            // Foca no botão de fechar
            closeLightboxBtn.focus();
        });
        
        // Suporte a teclado para abrir imagem (Enter)
        img.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    function fecharLightbox() {
        lightboxModal.classList.remove('show');
        setTimeout(() => { lightboxModal.style.display = "none"; }, 300);
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    if (closeLightboxBtn) closeLightboxBtn.onclick = function() { fecharLightbox(); };
    
    lightboxModal.onclick = function(event) {
        if (event.target === lightboxModal) fecharLightbox();
    };
    
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && lightboxModal.classList.contains('show')) {
            fecharLightbox();
        }
        // Focus trap simples para o lightbox
        if (lightboxModal.classList.contains('show') && event.key === 'Tab') {
            event.preventDefault();
            closeLightboxBtn.focus();
        }
    });

    // ==========================================================================
    // 5. ACESSIBILIDADE (ALTO CONTRASTE & FONTE)
    // ==========================================================================
    const btnAltoContraste = document.getElementById('btnAltoContraste');
    const btnAumentar = document.getElementById('btnAumentarFonte');
    const btnDiminuir = document.getElementById('btnDiminuirFonte');
    const btnRestaurar = document.getElementById('btnRestaurarFonte');
    const body = document.body;

    let fontSizeAtual = 100;
    const minFont = 75;
    const maxFont = 150;

    function toggleAltoContraste() {
        body.classList.toggle('alto-contraste');
        const isAtivado = body.classList.contains('alto-contraste');
        
        if(isAtivado){
            btnAltoContraste.classList.replace('btn-outline-dark', 'btn-light');
            localStorage.setItem('acessibilidade_contraste', 'ativado');
        } else {
            btnAltoContraste.classList.replace('btn-light', 'btn-outline-dark');
            localStorage.setItem('acessibilidade_contraste', 'desativado');
        }
        if(btnAltoContraste) btnAltoContraste.setAttribute('aria-pressed', isAtivado);
    }

    if(btnAltoContraste) {
        btnAltoContraste.addEventListener('click', toggleAltoContraste);
        if(localStorage.getItem('acessibilidade_contraste') === 'ativado') {
            toggleAltoContraste();
        }
    }

    function atualizarFonte() {
        document.documentElement.style.fontSize = fontSizeAtual + '%';
        localStorage.setItem('acessibilidade_fonte', fontSizeAtual);
    }

    if(btnAumentar) {
        btnAumentar.addEventListener('click', function() {
            if(fontSizeAtual < maxFont) { fontSizeAtual += 10; atualizarFonte(); }
        });
    }
    if(btnDiminuir) {
        btnDiminuir.addEventListener('click', function() {
            if(fontSizeAtual > minFont) { fontSizeAtual -= 10; atualizarFonte(); }
        });
    }
    if(btnRestaurar) {
        btnRestaurar.addEventListener('click', function() {
            fontSizeAtual = 100; atualizarFonte();
        });
    }

    const fonteSalva = localStorage.getItem('acessibilidade_fonte');
    if(fonteSalva) {
        fontSizeAtual = parseInt(fonteSalva);
        atualizarFonte();
    }

    // ==========================================================================
    // 6. FEEDBACK DE ENVIO (URL PARAMETERS)
    // ==========================================================================
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    if (status) {
        const modalElement = document.getElementById('feedbackModal');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');

        window.history.replaceState({}, document.title, window.location.pathname);

        if (modalElement) {
            if (status === 'success') {
                modalIcon.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>';
                modalTitle.textContent = 'Mensagem Enviada!';
                modalMessage.textContent = 'Recebemos sua dúvida com sucesso. Em breve a equipe de acessibilidade entrará em contato.';
            } else {
                modalIcon.innerHTML = '<i class="bi bi-exclamation-triangle-fill text-danger"></i>';
                modalTitle.textContent = 'Erro no Envio';
                modalMessage.textContent = 'Não foi possível enviar sua mensagem no momento. Por favor, verifique sua conexão ou tente novamente mais tarde.';
            }
            const feedbackModal = new bootstrap.Modal(modalElement);
            feedbackModal.show();
        }
    }

    // ==========================================================================
    // 7. LINKS INTERNOS (NAVEGAÇÃO DO MAPA DO SITE E MENU)
    // ==========================================================================
    const internalLinks = document.querySelectorAll('.link-interno');

    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetItem = document.getElementById(targetId);

            if (targetItem) {
                // 1. Fecha o Menu Lateral
                const offcanvasEl = document.getElementById('menuLateral');
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                if (bsOffcanvas) bsOffcanvas.hide();

                // 2. Fecha o Mapa do Site (Modal)
                const modalMapa = document.getElementById('mapaSiteModal');
                const bsModal = bootstrap.Modal.getInstance(modalMapa);
                if (bsModal) bsModal.hide();

                // 3. Abre o acordeão
                const collapseElement = targetItem.querySelector('.accordion-collapse');
                if (collapseElement) {
                    new bootstrap.Collapse(collapseElement, { toggle: false }).show();
                }

                // 4. Rolagem e Foco
                setTimeout(() => {
                    targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    targetItem.classList.add('bg-light', 'border-success');
                    setTimeout(() => { targetItem.classList.remove('bg-light', 'border-success'); }, 2000);

                    // --- ACESSIBILIDADE: Mover foco para o título ---
                    const focusTarget = targetItem.querySelector('button.accordion-button') || targetItem;
                    focusTarget.focus({ preventScroll: true }); 
                    
                }, 300);
            }
        });
    });

    // ==========================================================================
    // 8. FOCUS TRAP & LOOPS (ACESSIBILIDADE AVANÇADA)
    // ==========================================================================
    
    function setupFocusTrap(containerElement, closeElement) {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const elements = containerElement.querySelectorAll(focusableElements);
        const firstElement = elements[0];
        const lastElement = elements[elements.length - 1];

        containerElement.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
        
        setTimeout(() => firstElement.focus(), 100);
    }

    // A. Focus Trap do Menu Lateral
    const menuLateral = document.getElementById('menuLateral');
    if (menuLateral) {
        menuLateral.addEventListener('shown.bs.offcanvas', function () {
            const btnClose = menuLateral.querySelector('.btn-close');
            if(btnClose) setupFocusTrap(menuLateral, btnClose);
        });
    }

    // B. Focus Loop do MAPA DO SITE
    const mapaModalEl = document.getElementById('mapaSiteModal');
    
    if (mapaModalEl) {
        // Função dedicada para controlar o ciclo do Tab
        const handleModalTab = function(e) {
            const focusableEls = mapaModalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            
            if (focusableEls.length === 0) return;

            const firstEl = focusableEls[0]; // Botão 'X'
            const lastEl = focusableEls[focusableEls.length - 1]; // Último link

            const isTab = (e.key === 'Tab' || e.keyCode === 9);

            if (!isTab) return;

            if (e.shiftKey) { // SHIFT + TAB (Voltar)
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else { // TAB (Avançar)
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus(); // VOLTA PARA O INÍCIO
                }
            }
        };

        mapaModalEl.addEventListener('shown.bs.modal', function () {
            const closeBtn = mapaModalEl.querySelector('.btn-close');
            if(closeBtn) closeBtn.focus();
            mapaModalEl.addEventListener('keydown', handleModalTab);
        });

        mapaModalEl.addEventListener('hidden.bs.modal', function () {
            mapaModalEl.removeEventListener('keydown', handleModalTab);
        });
        
        const btnAbrirMapa = document.getElementById('btnAbrirMapa');
        if (btnAbrirMapa) {
            const mapaModalObj = new bootstrap.Modal(mapaModalEl);
            btnAbrirMapa.addEventListener('click', () => mapaModalObj.show());
        }
    }

    // ==========================================================================
    // 9. AJUSTE DE LEITURA (CORREÇÃO: FOCAR TEXTO, NÃO IMAGEM)
    // ==========================================================================
    
    const allCollapses = document.querySelectorAll('.accordion-collapse');
    allCollapses.forEach(collapseEl => {
        collapseEl.addEventListener('shown.bs.collapse', function () {
            
            // Procura o primeiro título (h3 a h6) ou parágrafo (p) dentro da área expandida
            const firstContent = this.querySelector('h3, h4, h5, h6, p');
            
            if (firstContent) {
                // Torna o elemento focável temporariamente via atributo
                firstContent.setAttribute('tabindex', '-1');
                
                // Pequeno delay para garantir renderização e scroll
                setTimeout(() => {
                    firstContent.focus({ preventScroll: true });
                    // Remove o tabindex quando o usuário sair do elemento
                    firstContent.addEventListener('blur', () => {
                        firstContent.removeAttribute('tabindex');
                    }, { once: true });
                }, 100);
            }
        });
    });

});