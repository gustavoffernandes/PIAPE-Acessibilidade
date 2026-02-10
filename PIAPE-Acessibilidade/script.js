document.addEventListener('DOMContentLoaded', function() {
    
    // ELEMENTOS DO DOM
    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('.topico-manual');
    const accordionItems = document.querySelectorAll('.accordion-item');
    const noResults = document.getElementById('noResults');
    const profileCards = document.querySelectorAll('.profile-card');

    // --- FUNÇÃO 1: BUSCA INTELIGENTE ---
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

    // --- FUNÇÃO 2: FILTRO POR PERFIL ---
    window.filtrarPerfil = function(perfil, elemento) {
        
        // 1. Atualiza visual dos cards (Active state)
        profileCards.forEach(card => card.classList.remove('active'));
        if (elemento) elemento.classList.add('active');
        else if (perfil === 'gestor') profileCards[1].classList.add('active'); // Fallback para links do menu lateral
        else if (perfil === 'coordenador') profileCards[2].classList.add('active');
        else if (perfil === 'docente') profileCards[3].classList.add('active');
        else if (perfil === 'discente') profileCards[4].classList.add('active');
        
        // 2. Limpa a barra de busca
        if (searchInput) searchInput.value = '';
        if (noResults) noResults.classList.add('d-none');

        // 3. Lógica de mostrar/esconder seções
        sections.forEach(section => {
            // Reseta itens internos (caso venha de uma busca)
            const items = section.querySelectorAll('.accordion-item');
            items.forEach(i => {
                i.classList.remove('d-none');
                // Fecha os acordeões para manter organizado
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
    };

    function resetProfileFilterVisual() {
        profileCards.forEach(card => card.classList.remove('active'));
        if(profileCards.length > 0) profileCards[0].classList.add('active');
    }

    // --- FUNÇÃO 3: LIGHTBOX DE IMAGENS ---
    const modalHTML = `
        <div id="imageModal" class="lightbox-modal">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" id="imgExpanded">
            <div id="caption" class="lightbox-caption"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("imgExpanded");
    const captionText = document.getElementById("caption");
    const span = document.getElementsByClassName("lightbox-close")[0];
    const prints = document.querySelectorAll('.manual-print');

    prints.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "flex";
            modal.style.flexDirection = "column";
            modal.style.alignItems = "center";
            modal.style.justifyContent = "center";
            
            setTimeout(() => { modal.classList.add('show'); }, 10);
            
            modalImg.src = this.src;
            captionText.innerHTML = this.alt || ''; 
        });
    });

    function fecharModal() {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = "none"; }, 300);
    }

    if (span) {
        span.onclick = function() { fecharModal(); }
    }

    if (modal) {
        modal.onclick = function(event) {
            if (event.target === modal) { fecharModal(); }
        }
    }
    
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal && modal.style.display !== "none") {
            fecharModal();
        }
    });

    // --- FUNÇÃO 4: ACESSIBILIDADE (ALTO CONTRASTE & FONTE) ---
    
    // Elementos
    const btnAltoContraste = document.getElementById('btnAltoContraste');
    const btnAumentar = document.getElementById('btnAumentarFonte');
    const btnDiminuir = document.getElementById('btnDiminuirFonte');
    const btnRestaurar = document.getElementById('btnRestaurarFonte');
    const body = document.body;

    // Configurações de Fonte
    let fontSizeAtual = 100; // Porcentagem
    const minFont = 75;
    const maxFont = 150;

    // 1. Lógica do Alto Contraste
    function toggleAltoContraste() {
        body.classList.toggle('alto-contraste');
        // Atualiza o ícone/texto do botão para feedback visual
        if(body.classList.contains('alto-contraste')){
            btnAltoContraste.classList.replace('btn-outline-dark', 'btn-light');
            localStorage.setItem('acessibilidade_contraste', 'ativado');
        } else {
            btnAltoContraste.classList.replace('btn-light', 'btn-outline-dark');
            localStorage.setItem('acessibilidade_contraste', 'desativado');
        }
    }

    if(btnAltoContraste) {
        btnAltoContraste.addEventListener('click', toggleAltoContraste);
        
        // Verifica preferência salva
        if(localStorage.getItem('acessibilidade_contraste') === 'ativado') {
            toggleAltoContraste();
        }
    }

    // 2. Lógica do Tamanho da Fonte
    // Alteramos a fonte no elemento <html> (root) para usar a medida REM do CSS
    function atualizarFonte() {
        document.documentElement.style.fontSize = fontSizeAtual + '%';
        localStorage.setItem('acessibilidade_fonte', fontSizeAtual);
    }

    if(btnAumentar) {
        btnAumentar.addEventListener('click', function() {
            if(fontSizeAtual < maxFont) {
                fontSizeAtual += 10; // Aumenta 10%
                atualizarFonte();
            }
        });
    }

    if(btnDiminuir) {
        btnDiminuir.addEventListener('click', function() {
            if(fontSizeAtual > minFont) {
                fontSizeAtual -= 10; // Diminui 10%
                atualizarFonte();
            }
        });
    }

    if(btnRestaurar) {
        btnRestaurar.addEventListener('click', function() {
            fontSizeAtual = 100; // Volta ao padrão
            atualizarFonte();
        });
    }

    // Carrega tamanho salvo
    const fonteSalva = localStorage.getItem('acessibilidade_fonte');
    if(fonteSalva) {
        fontSizeAtual = parseInt(fonteSalva);
        atualizarFonte();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    if (status) {
        const modalElement = document.getElementById('feedbackModal');
        const modalIcon = document.getElementById('modalIcon');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');

        // Limpa a URL para que o popup não apareça de novo se a pessoa der F5
        window.history.replaceState({}, document.title, window.location.pathname);

        if (modalElement) {
            // Configura o conteúdo baseada no sucesso ou erro
            if (status === 'success') {
                modalIcon.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i>'; // Ícone Verde
                modalTitle.textContent = 'Mensagem Enviada!';
                modalMessage.textContent = 'Recebemos sua dúvida com sucesso. Em breve a equipe de acessibilidade entrará em contato.';
            } else {
                modalIcon.innerHTML = '<i class="bi bi-exclamation-triangle-fill text-danger"></i>'; // Ícone Vermelho
                modalTitle.textContent = 'Erro no Envio';
                modalMessage.textContent = 'Não foi possível enviar sua mensagem no momento. Por favor, verifique sua conexão ou tente novamente mais tarde.';
            }

            // Abre o Modal usando o Bootstrap
            const feedbackModal = new bootstrap.Modal(modalElement);
            feedbackModal.show();
        }
    }

    const internalLinks = document.querySelectorAll('.link-interno');

    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Evita o pulo padrão abrupto do navegador

            const targetId = this.getAttribute('href').substring(1); // Pega o ID (ex: "tabAdmin")
            const targetItem = document.getElementById(targetId);

            if (targetItem) {
                // 1. Fecha o Menu Lateral (Offcanvas) se estiver aberto (para mobile)
                const offcanvasEl = document.getElementById('menuLateral');
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }

                // 2. Busca o conteúdo colapsável dentro do item alvo
                const collapseElement = targetItem.querySelector('.accordion-collapse');
                
                if (collapseElement) {
                    // Usa a API do Bootstrap para abrir este item especificamente
                    const bsCollapse = new bootstrap.Collapse(collapseElement, {
                        toggle: false // Garante que não feche se já estiver aberto
                    });
                    bsCollapse.show();
                }

                // 3. Rolagem suave até o elemento
                // Damos um pequeno atraso para garantir que a animação de abertura comece
                setTimeout(() => {
                    targetItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center' // Tenta centralizar o item na tela
                    });
                    
                    // Opcional: Adiciona um destaque visual temporário
                    targetItem.classList.add('bg-light', 'border-success');
                    setTimeout(() => {
                        targetItem.classList.remove('bg-light', 'border-success');
                    }, 2000);
                    
                }, 300);
            }
        });
    });

    window.filtrarPerfil = function(perfil, elemento) {
        
        // 1. Atualiza visual dos cards (Active state)
        profileCards.forEach(card => card.classList.remove('active'));
        if (elemento) elemento.classList.add('active');
        else if (perfil === 'gestor') profileCards[1].classList.add('active');
        else if (perfil === 'coordenador') profileCards[2].classList.add('active');
        else if (perfil === 'docente') profileCards[3].classList.add('active');
        else if (perfil === 'discente') profileCards[4].classList.add('active');
        
        // 2. Limpa a barra de busca e reseta visuais
        if (searchInput) searchInput.value = '';
        if (noResults) noResults.classList.add('d-none');

        // 3. Lógica para Ocultar/Mostrar a ABA DE VÍDEOS inteira
        // Se for Coordenador, a gente esconde o accordion 'cMateriais1' (Vídeos)
        const videoAccordion = document.getElementById('cMateriais1');
        if (videoAccordion) {
            if (perfil === 'coordenador') {
                videoAccordion.classList.add('d-none');
            } else {
                videoAccordion.classList.remove('d-none');
            }
        }

        // 4. Lógica de mostrar/esconder seções PRINCIPAIS (Tópicos do Manual)
        sections.forEach(section => {
            // Reseta itens internos
            const items = section.querySelectorAll('.accordion-item');
            items.forEach(i => {
                // Só removemos o d-none se NÃO for o item de vídeo que acabamos de tratar
                if(i.id !== 'cMateriais1') {
                    i.classList.remove('d-none');
                } else if (perfil !== 'coordenador') {
                    i.classList.remove('d-none');
                }
                
                // Fecha os acordeões para manter a organização
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

        // 5. Filtro Fino para Materiais (Vídeos e PDFs individuais)
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

        document.addEventListener('DOMContentLoaded', function() {
            // Localiza o botão e o modal pelos IDs
            const btnAbrirMapa = document.getElementById('btnAbrirMapa');
            const modalElement = document.getElementById('mapaSiteModal');

            // Verifica se ambos existem na página antes de configurar
            if (btnAbrirMapa && modalElement) {
                // Inicializa o componente Modal do Bootstrap
                const mapaModal = new bootstrap.Modal(modalElement);

                btnAbrirMapa.addEventListener('click', function() {
                    mapaModal.show(); // Abre a tela do mapa
                });
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            
            // --- 1. GESTÃO DE FOCO (FOCUS TRAP) ---
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
                
                // Focar o primeiro elemento ao abrir
                setTimeout(() => firstElement.focus(), 100);
            }

            // --- 2. LIGHTBOX COM ACESSIBILIDADE ---
            const modalHTML = `
                <div id="imageModal" class="lightbox-modal" role="dialog" aria-modal="true" aria-label="Visualização de Imagem Ampliada">
                    <button class="lightbox-close" aria-label="Fechar visualização">&times;</button>
                    <img class="lightbox-content" id="imgExpanded" alt="">
                    <div id="caption" class="lightbox-caption" style="color: white; margin-top: 15px;"></div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            const modal = document.getElementById("imageModal");
            const modalImg = document.getElementById("imgExpanded");
            const captionText = document.getElementById("caption");
            const closeBtn = modal.querySelector(".lightbox-close");
            let lastFocusedElement;

            // Abrir Lightbox
            document.querySelectorAll('.btn-img-manual').forEach(btn => {
                btn.addEventListener('click', function() {
                    lastFocusedElement = document.activeElement;
                    const img = this.querySelector('img');
                    modal.classList.add('show');
                    modalImg.src = img.src;
                    captionText.innerText = img.alt;
                    setupFocusTrap(modal, closeBtn);
                });
            });

            function fecharLightbox() {
                modal.classList.remove('show');
                if (lastFocusedElement) lastFocusedElement.focus();
            }

            closeBtn.addEventListener('click', fecharLightbox);

            // Fechar com ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('show')) fecharLightbox();
            });

            // --- 3. OFF-CANVAS FOCUS TRAP ---
            const menuLateral = document.getElementById('menuLateral');
            menuLateral.addEventListener('shown.bs.offcanvas', function () {
                setupFocusTrap(menuLateral, menuLateral.querySelector('.btn-close'));
            });



            // --- 4. BUSCA E FILTROS (MELHORIA DE FEEDBACK) ---
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('input', function() {
                    // Lógica de busca existente...
                    // Feedback para leitor de tela (opcional)
                    const resultsCount = document.querySelectorAll('.accordion-item:not(.d-none)').length;
                    // Aqui você poderia atualizar um elemento com aria-live="polite"
                });
            }

            // --- 5. ACORDEÕES: SUPORTE A TECLADO (Nativo do Bootstrap 5) ---
            // O Bootstrap 5 já suporta Enter/Space em botões de acordeão.
            // Garantimos apenas que o aria-expanded seja atualizado (o BS já faz isso via data-attributes).

            // --- 6. ALTO CONTRASTE ---
            const btnAltoContraste = document.getElementById('btnAltoContraste');
            if(btnAltoContraste) {
                btnAltoContraste.addEventListener('click', () => {
                    document.body.classList.toggle('alto-contraste');
                    const isAtivado = document.body.classList.contains('alto-contraste');
                    localStorage.setItem('acessibilidade_contraste', isAtivado ? 'ativado' : 'desativado');
                    btnAltoContraste.setAttribute('aria-pressed', isAtivado);
                });
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            
            // Captura todos os elementos de colapso (acordeões)
            const allCollapses = document.querySelectorAll('.accordion-collapse');

            allCollapses.forEach(collapseEl => {
                // Evento do Bootstrap disparado quando a animação de abertura termina
                collapseEl.addEventListener('shown.bs.collapse', function () {
                    
                    // Busca a primeira imagem com a classe focus-image dentro deste painel aberto
                    const firstImage = this.querySelector('.focus-image');
                    
                    if (firstImage) {
                        // Pequeno delay para garantir que o scroll do navegador não interfira
                        setTimeout(() => {
                            firstImage.focus();
                            
                            // Opcional: Centraliza a imagem na tela para o usuário visual
                            firstImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                    }
                });
            });

            // Ajuste nos links internos (Sumário Lateral)
            const internalLinks = document.querySelectorAll('.sidebar-link, .sidebar-btn');
            internalLinks.forEach(link => {
                link.addEventListener('click', function() {
                    const targetId = this.getAttribute('href')?.substring(1) || this.getAttribute('data-bs-target')?.substring(1);
                    const targetEl = document.getElementById(targetId);
                    
                    if (targetEl) {
                        const collapse = targetEl.querySelector('.accordion-collapse') || targetEl;
                        if (collapse && typeof bootstrap !== 'undefined') {
                            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
                            bsCollapse.show();
                        }
                    }
                });
            });
        });
        
    };

});