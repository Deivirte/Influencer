/* =========================
   CONFIG
========================= */
const API_URL = "http://localhost:3001/api";
let token = localStorage.getItem("token");
let campoAtual = null;

/* =========================
   CROP / IMAGEM
========================= */
let imagemOriginal = null;
let cropScale = 1;
let cropX = 0;
let cropY = 0;
let dragging = false;
let startX = 0;
let startY = 0;
let imgStartX = 0;
let imgStartY = 0;

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", function() {
    configurarLeadCookie();
    configurarVideoBanner();
    configurarWhatsappTooltip();
    configurarFAQ();
    configurarMenuHamburguer();
    aplicarConteudoLocal();
    configurarAdmin();
    configurarCropImagem();
});

/* =========================
   LEAD COOKIE
========================= */
function configurarLeadCookie() {
    const cookieBox = document.getElementById("leadCookie");
    const nameInput = document.getElementById("leadName");
    const phoneInput = document.getElementById("leadPhone");
    const saveBtn = document.getElementById("leadSave");
    const skipBtn = document.getElementById("leadSkip");

    if (!cookieBox || !nameInput || !phoneInput || !saveBtn || !skipBtn) {
        console.log("Elementos do leadCookie não encontrados.");
        return;
    }

    if (localStorage.getItem("lead_cookie")) {
        cookieBox.style.display = "none";
    } else {
        cookieBox.style.display = "block";
    }

    function normalizePhone(value) {
        return value.replace(/\D/g, "");
    }

    saveBtn.addEventListener("click", async function() {
        const nome = nameInput.value.trim();
        const telefone = normalizePhone(phoneInput.value);

        if (nome.length < 2) {
            alert("Digite seu nome.");
            nameInput.focus();
            return;
        }

        if (telefone.length < 10) {
            alert("Digite um WhatsApp válido com DDD.");
            phoneInput.focus();
            return;
        }

        try {
            const response = await fetch(API_URL + "/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome,
                    telefone: telefone
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Erro ao enviar lead.");
                return;
            }

            localStorage.setItem("lead_cookie", "ok");
            cookieBox.style.display = "none";
            alert("Dados enviados com sucesso.");
        } catch (error) {
            console.error("Erro ao enviar lead:", error);
            alert("Não foi possível enviar agora.");
        }
    });

    skipBtn.addEventListener("click", function() {
        localStorage.setItem("lead_cookie", "skip");
        cookieBox.style.display = "none";
    });
}

/* =========================
   VIDEO BANNER
========================= */
function configurarVideoBanner() {
    const video = document.getElementById("heroVideo");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const muteBtn = document.getElementById("muteBtn");
    const volumeControl = document.getElementById("volumeControl");

    if (!video || !playPauseBtn || !muteBtn || !volumeControl) {
        return;
    }

    playPauseBtn.addEventListener("click", function() {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = "❚❚";
        } else {
            video.pause();
            playPauseBtn.textContent = "▶";
        }
    });

    muteBtn.addEventListener("click", function() {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? "🔇" : "🔊";
    });

    volumeControl.addEventListener("input", function() {
        video.volume = volumeControl.value;

        if (video.volume == 0) {
            video.muted = true;
            muteBtn.textContent = "🔇";
        } else {
            video.muted = false;
            muteBtn.textContent = "🔊";
        }
    });

    video.addEventListener("play", function() {
        playPauseBtn.textContent = "❚❚";
    });

    video.addEventListener("pause", function() {
        playPauseBtn.textContent = "▶";
    });
}

/* =========================
   WHATSAPP FLUTUANTE
========================= */
function configurarWhatsappTooltip() {
    const tooltip = document.getElementById("whatsappTooltip");

    setTimeout(function() {
        if (tooltip) {
            tooltip.classList.add("show");
        }
    }, 15000);
}

/* =========================
   FAQ
========================= */
function configurarFAQ() {
    const faqCards = document.querySelectorAll(".faq-card");

    faqCards.forEach(function(card) {
        const button = card.querySelector(".faq-btn");
        const content = card.querySelector(".faq-content");

        if (!button || !content) return;

        button.addEventListener("click", function() {
            const isActive = card.classList.contains("active");

            faqCards.forEach(function(item) {
                item.classList.remove("active");
                const itemContent = item.querySelector(".faq-content");
                if (itemContent) {
                    itemContent.style.maxHeight = null;
                }
            });

            if (!isActive) {
                card.classList.add("active");
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}

/* =========================
   MENU HAMBURGUER
========================= */
function configurarMenuHamburguer() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuToggle || !navLinks) return;

    const navAnchors = navLinks.querySelectorAll("a");

    menuToggle.addEventListener("click", function() {
        const isOpen = navLinks.classList.contains("active");

        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    navAnchors.forEach(function(link) {
        link.addEventListener("click", function() {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", function(event) {
        const clickedOutsideMenu = !navLinks.contains(event.target);
        const clickedOutsideButton = !menuToggle.contains(event.target);

        if (clickedOutsideMenu && clickedOutsideButton) {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}

/* =========================
   CONTEÚDO PADRÃO LOCAL
========================= */
function aplicarConteudoLocal() {
    const dadosInfluencer = {
        sobre_titulo: "Sobre Sophie",
        sobre_paragrafo_1: "Sophie Varnel é criadora de conteúdo e influencer, conhecida por compartilhar sua rotina, bastidores e visão sobre o universo dos reality shows e da presença digital.",
        sobre_paragrafo_2: "Com um estilo autêntico e natural, Sophie aborda temas como lifestyle, comportamento e posicionamento, mostrando na prática como pequenas atitudes fazem diferença na forma como você é visto e lembrado.",
        sobre_paragrafo_3: "Seu conteúdo conecta pessoas que buscam se expressar melhor, se destacar e entender mais sobre o mundo digital de forma leve, real e sem filtros.",
        sobre_imagem: "/img/banner.png"
    };

    const conteudoInfluencer = {
        conteudo_titulo: "Conteúdos da Sophie",
        conteudo_texto_1: "Sophie compartilha conteúdos sobre lifestyle, rotina e bastidores do universo digital, mostrando na prática como presença e posicionamento fazem diferença.",
        conteudo_texto_2: "Seus conteúdos abordam comportamento, autenticidade e visão estratégica de imagem, trazendo reflexões reais sobre o mundo dos reality shows e da influência digital.",
        card_1_titulo: "Lifestyle",
        card_1_texto: "Compartilhamento da rotina, hábitos e estilo de vida no dia a dia.",
        card_2_titulo: "Bastidores",
        card_2_texto: "Mostrando o que acontece por trás das câmeras e do mundo digital.",
        card_3_titulo: "Posicionamento",
        card_3_texto: "Reflexões sobre como se expressar, se destacar e construir presença.",
        card_4_titulo: "Realidade Digital",
        card_4_texto: "Insights sobre o universo dos reality shows e influência online.",
        etapas_titulo: "O que você encontra por aqui",
        etapa_1: "Rotina e lifestyle real.",
        etapa_2: "Bastidores do mundo digital.",
        etapa_3: "Posicionamento e presença.",
        etapa_4: "Visão sobre reality shows.",
        cta_texto: "Acompanhar conteúdo"
    };

    const depoimentosInfluencer = {
        depoimentos_titulo: "O que dizem sobre Sophie",
        depoimentos_texto: "Mensagens e feedbacks de pessoas que acompanham os conteúdos, se identificam com a rotina compartilhada e gostam da forma leve e autêntica como Sophie se comunica.",
        depoimento_destaque_imagem: "/img/barba.png",
        depoimento_destaque_tag: "Feedback em destaque",
        depoimento_destaque_titulo: "Conteúdo que conecta de verdade",
        depoimento_destaque_texto: "O jeito natural da Sophie faz com que o público se identifique com facilidade. Seu conteúdo transmite proximidade, autenticidade e presença de forma espontânea.",
        depoimento_destaque_citacao: "“Acompanho você quietinha faz tempo e adoro a forma como você compartilha tudo de um jeito tão real e leve 🤍”",
        depoimento_destaque_autor: "— Juliana Martins",
        depoimento_card_1_texto: "Gosto porque parece tudo muito real. Não passa aquela sensação forçada, e isso faz toda diferença.",
        depoimento_card_1_autor: "Mariana Alves — seguidora",
        depoimento_card_2_texto: "O conteúdo da Sophie tem personalidade. É bonito, leve e ao mesmo tempo passa muita verdade.",
        depoimento_card_2_autor: "Rafael Costa — seguidor",
        depoimento_card_3_texto: "Ela consegue falar de rotina, presença e lifestyle de um jeito que prende. Dá vontade de acompanhar mais.",
        depoimento_card_3_autor: "Camila Rocha — seguidora",
        depoimento_card_4_texto: "Um perfil que inspira sem parecer distante. Tem autenticidade e isso chama muita atenção.",
        depoimento_card_4_autor: "Lucas Ferreira — seguidor"
    };

    const instagramDados = {
        instagram_titulo: "Conteúdos no Instagram",
        instagram_texto: "Acompanhe alguns conteúdos compartilhados por Sophie, com momentos do dia a dia, lifestyle e bastidores do universo digital.",
        instagram_post_1: "https://www.instagram.com/p/DVgvVsoGnP4/",
        instagram_post_2: "https://www.instagram.com/reel/DVq_JBBiQDf/",
        instagram_post_3: "https://www.instagram.com/p/DUWbN4fD4JM/"
    };

    const produtosDados = {
        produtos_titulo: "Produtos Digitais",
        produtos_texto: "Materiais e conteúdos criados por Sophie para compartilhar referências, experiências e conteúdos exclusivos sobre lifestyle, presença digital e bastidores.",
        produto_1_badge: "🔥 DESTAQUE",
        produto_1_imagem: "/img/cursos.jpg",
        produto_1_titulo: "Guia de Presença Digital",
        produto_1_texto: "Um material exclusivo com referências, visão de posicionamento e dicas para fortalecer sua presença no digital de forma mais autêntica.",
        produto_1_botao: "Quero acessar",
        produto_1_link: "#",
        produto_2_imagem: "/img/curso2.jpg",
        produto_2_titulo: "Lifestyle & Rotina",
        produto_2_texto: "Conteúdos com inspirações sobre rotina, imagem e estilo de vida.",
        produto_2_botao: "Acessar",
        produto_2_link: "#",
        produto_3_imagem: "/img/curso3.jpg",
        produto_3_titulo: "Posicionamento",
        produto_3_texto: "Reflexões e referências sobre presença, autenticidade e construção de imagem.",
        produto_3_botao: "Acessar",
        produto_3_link: "#",
        produto_4_imagem: "/img/curso4.jpg",
        produto_4_titulo: "Bastidores",
        produto_4_texto: "Um olhar mais próximo sobre o que acontece por trás do conteúdo e da rotina digital.",
        produto_4_botao: "Acessar",
        produto_4_link: "#",
        produto_5_imagem: "/img/curso5.jpg",
        produto_5_titulo: "Conteúdo Exclusivo",
        produto_5_texto: "Materiais especiais para quem quer acompanhar Sophie mais de perto.",
        produto_5_botao: "Acessar",
        produto_5_link: "#"
    };

    const faqDados = {
        faq_titulo: "Perguntas Frequentes",
        faq_subtitulo: "Algumas dúvidas comuns sobre Sophie, seus conteúdos, parcerias e presença nas redes sociais.",
        faq_1_pergunta: "Quem é Sophie Varnel?",
        faq_1_resposta: "Sophie Varnel é influencer e criadora de conteúdo, conhecida por compartilhar lifestyle, bastidores e conteúdos sobre presença digital de forma leve, autêntica e próxima do público.",
        faq_2_pergunta: "Que tipo de conteúdo Sophie compartilha?",
        faq_2_resposta: "Sophie compartilha conteúdos sobre rotina, lifestyle, bastidores, comportamento, imagem e momentos do universo digital, sempre com uma comunicação natural e envolvente.",
        faq_3_pergunta: "Onde posso acompanhar os conteúdos da Sophie?",
        faq_3_resposta: "Você pode acompanhar os conteúdos pelo Instagram, além deste site, onde estão reunidas informações, destaques e materiais exclusivos.",
        faq_4_pergunta: "Sophie faz parcerias com marcas?",
        faq_4_resposta: "Sim. O perfil pode ser aberto para campanhas, ações publicitárias, publis e colaborações com marcas alinhadas ao estilo e posicionamento da creator.",
        faq_5_pergunta: "É possível entrar em contato para trabalhos e projetos?",
        faq_5_resposta: "Sim. Marcas, agências e parceiros podem entrar em contato pela área de contato do site para propostas comerciais e oportunidades de colaboração.",
        faq_6_pergunta: "Este site pode receber atualizações no futuro?",
        faq_6_resposta: "Sim. A estrutura foi preparada para permitir alterações futuras de textos, imagens, links e outras informações de forma dinâmica."
    };

    const contatoDados = {
        contato_titulo: "Fale com a Sophie",
        contato_texto: "Para parcerias, projetos, campanhas ou outras oportunidades, preencha o formulário ou entre em contato diretamente.",
        label_nome: "Nome",
        label_whatsapp: "WhatsApp",
        label_email: "E-mail",
        label_interesse: "Tipo de contato",
        label_mensagem: "Mensagem",
        btn_enviar: "Enviar mensagem",
        btn_email: "Falar por e-mail",
        email_link: "contato@sophievarnel.com"
    };

    const leadDados = {
        lead_texto: "Quer falar com a equipe da Sophie? Deixe seu WhatsApp para receber contato, novidades e informações sobre parcerias.",
        lead_btn_enviar: "Enviar",
        lead_btn_skip: "Agora não"
    };

    function aplicarObjeto(obj) {
        document.querySelectorAll("[data-field]").forEach(function(el) {
            const campo = el.dataset.field;

            if (!obj[campo]) return;

            if (el.tagName === "IMG") {
                el.src = obj[campo];
                return;
            }

            if (el.classList.contains("instagram-media")) {
                el.setAttribute("data-instgrm-permalink", obj[campo]);
                return;
            }

            if (el.tagName === "A") {
                const campoLink = campo.replace("_botao", "_link");
                el.textContent = obj[campo];

                if (obj[campoLink]) {
                    el.href = obj[campoLink];
                }
                return;
            }

            el.textContent = obj[campo];
        });
    }

    aplicarObjeto(dadosInfluencer);
    aplicarObjeto(conteudoInfluencer);
    aplicarObjeto(depoimentosInfluencer);
    aplicarObjeto(instagramDados);
    aplicarObjeto(produtosDados);
    aplicarObjeto(faqDados);
    aplicarObjeto(contatoDados);
    aplicarObjeto(leadDados);

    const emailBtn = document.querySelector("a[data-field='btn_email']");
    if (emailBtn && contatoDados.email_link) {
        emailBtn.href = "mailto:" + contatoDados.email_link;
    }

    if (window.instgrm) {
        window.instgrm.Embeds.process();
    }
}

/* =========================
   LOGIN + BANCO
========================= */
function configurarAdmin() {
    if (token) {
        document.body.classList.add("admin-logado");

        const toolbar = document.getElementById("adminToolbar");
        if (toolbar) {
            toolbar.style.display = "flex";
        }
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            const emailInput = document.getElementById("loginEmail");
            const senhaInput = document.getElementById("loginSenha");

            const email = emailInput ? emailInput.value.trim() : "";
            const senha = senhaInput ? senhaInput.value.trim() : "";

            if (!email || !senha) {
                alert("Preencha e-mail e senha.");
                return;
            }

            try {
                const res = await fetch(API_URL + "/admin/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message || "Erro ao fazer login.");
                    return;
                }

                token = data.token;
                localStorage.setItem("token", token);

                document.body.classList.add("admin-logado");

                const toolbar = document.getElementById("adminToolbar");
                if (toolbar) {
                    toolbar.style.display = "flex";
                }

                fecharLogin();
                alert("Login realizado com sucesso.");
            } catch (error) {
                console.error("Erro no login:", error);
                alert("Não foi possível conectar ao backend.");
            }
        });
    }

    const btnSalvarAdmin = document.getElementById("btnSalvarAdmin");
    if (btnSalvarAdmin) {
        btnSalvarAdmin.addEventListener("click", salvarConteudo);
    }

    const btnLogoutAdmin = document.getElementById("btnLogoutAdmin");
    if (btnLogoutAdmin) {
        btnLogoutAdmin.addEventListener("click", logoutAdmin);
    }

    const btnAplicarEditor = document.getElementById("btnAplicarEditor");
    if (btnAplicarEditor) {
        btnAplicarEditor.addEventListener("click", aplicarEdicao);
    }

    const btnCancelarEditor = document.getElementById("btnCancelarEditor");
    if (btnCancelarEditor) {
        btnCancelarEditor.addEventListener("click", fecharEditor);
    }

    carregarConteudoBanco();

    document.addEventListener("keydown", function(e) {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;

        if (isCtrlOrCmd && e.key.toLowerCase() === "r") {
            e.preventDefault();
            e.stopPropagation();
            abrirLogin();
        }

        if (e.key === "Escape") {
            fecharLogin();
            fecharEditor();
            fecharCropModal();
        }
    });

    const loginModal = document.getElementById("loginModal");
    if (loginModal) {
        loginModal.addEventListener("click", function(e) {
            if (e.target === this) {
                fecharLogin();
            }
        });
    }

    document.addEventListener("click", function(e) {
        const campo = e.target.closest("[data-field]");

        if (!document.body.classList.contains("admin-logado")) return;
        if (!campo) return;

        const ignorar = e.target.closest("#adminToolbar, #editorFlutuante, #loginModal, #cropModal, .faq-btn, .menu-toggle");
        if (ignorar) return;

        e.preventDefault();
        e.stopPropagation();

        abrirEditor(campo);
    });
}

function abrirLogin() {
    const modal = document.getElementById("loginModal");
    if (modal) {
        modal.classList.add("ativo");
        document.body.style.overflow = "hidden";
    }
}

function fecharLogin() {
    const modal = document.getElementById("loginModal");
    if (modal) {
        modal.classList.remove("ativo");
        document.body.style.overflow = "";
    }
}

function logoutAdmin() {
    localStorage.removeItem("token");
    token = null;
    document.body.classList.remove("admin-logado");

    const toolbar = document.getElementById("adminToolbar");
    if (toolbar) {
        toolbar.style.display = "none";
    }

    fecharEditor();
}

function abrirEditor(elemento) {
    campoAtual = elemento;

    document.querySelectorAll("[data-field].editando").forEach(function(el) {
        el.classList.remove("editando");
    });

    campoAtual.classList.add("editando");

    const editor = document.getElementById("editorFlutuante");
    const input = document.getElementById("editorInput");
    const uploadImagem = document.getElementById("uploadImagem");

    if (!editor || !input) return;

    if (campoAtual.tagName === "IMG") {
        input.value = campoAtual.getAttribute("src") || "";

        if (uploadImagem) {
            uploadImagem.style.display = "block";
            uploadImagem.value = "";
        }
    } else {
        input.value = campoAtual.textContent.trim();

        if (uploadImagem) {
            uploadImagem.style.display = "none";
            uploadImagem.value = "";
        }
    }

    const rect = campoAtual.getBoundingClientRect();
    editor.style.top = Math.min(window.innerHeight - 260, rect.bottom + window.scrollY + 10) + "px";
    editor.style.left = Math.min(window.innerWidth - 440, rect.left + window.scrollX) + "px";
    editor.classList.add("ativo");
}

function fecharEditor() {
    const editor = document.getElementById("editorFlutuante");
    if (editor) editor.classList.remove("ativo");

    document.querySelectorAll("[data-field].editando").forEach(function(el) {
        el.classList.remove("editando");
    });

    campoAtual = null;
}

function aplicarEdicao() {
    if (!campoAtual) return;

    const input = document.getElementById("editorInput");
    if (!input) return;

    if (campoAtual.tagName === "IMG") {
        campoAtual.src = input.value.trim();
    } else {
        campoAtual.textContent = input.value.trim();
    }

    fecharEditor();
}

async function salvarConteudo() {
    if (!token) {
        alert("Você precisa estar logado.");
        return;
    }

    const dados = {};

    document.querySelectorAll("[data-field]").forEach(function(el) {
        const key = el.dataset.field;

        if (el.tagName === "IMG") {
            dados[key] = el.getAttribute("src") || "";
        } else {
            dados[key] = el.textContent.trim();
        }
    });

    try {
        const res = await fetch(API_URL + "/site-content", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(dados)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Erro ao salvar conteúdo.");
            return;
        }

        alert("Conteúdo salvo com sucesso.");
    } catch (error) {
        console.error("Erro ao salvar conteúdo:", error);
        alert("Erro ao salvar conteúdo.");
    }
}

async function carregarConteudoBanco() {
    try {
        const res = await fetch(API_URL + "/site-content");
        const data = await res.json();

        if (!res.ok || !data) return;

        document.querySelectorAll("[data-field]").forEach(function(el) {
            const key = el.dataset.field;
            if (!data[key]) return;

            if (el.tagName === "IMG") {
                el.src = data[key];
            } else {
                el.textContent = data[key];
            }
        });
    } catch (error) {
        console.warn("Conteúdo dinâmico não carregado. Mantendo conteúdo padrão.");
    }
}

/* =========================
   CROP DE IMAGEM
========================= */
function configurarCropImagem() {
    const uploadImagem = document.getElementById("uploadImagem");
    const cropModal = document.getElementById("cropModal");
    const cropImage = document.getElementById("cropImage");
    const zoomRange = document.getElementById("zoomRange");
    const cancelCrop = document.getElementById("cancelCrop");
    const applyCrop = document.getElementById("applyCrop");
    const cropFrame = document.querySelector(".crop-frame");

    if (!uploadImagem || !cropModal || !cropImage || !zoomRange || !cancelCrop || !applyCrop || !cropFrame) {
        return;
    }

    uploadImagem.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function(ev) {
            imagemOriginal = new Image();

            imagemOriginal.onload = function() {
                cropImage.src = ev.target.result;
                cropScale = 1;
                zoomRange.value = 1;

                const frameSize = 320;
                const baseScale = Math.max(
                    frameSize / imagemOriginal.width,
                    frameSize / imagemOriginal.height
                );

                cropImage.dataset.baseScale = String(baseScale);

                const renderWidth = imagemOriginal.width * baseScale;
                const renderHeight = imagemOriginal.height * baseScale;

                cropX = (frameSize - renderWidth) / 2;
                cropY = (frameSize - renderHeight) / 2;

                atualizarCropImage();
                cropModal.classList.add("ativo");
            };

            imagemOriginal.src = ev.target.result;
        };

        reader.readAsDataURL(file);
    });

    zoomRange.addEventListener("input", function() {
        cropScale = Number(zoomRange.value);
        atualizarCropImage();
    });

    cancelCrop.addEventListener("click", function() {
        fecharCropModal();
    });

    cropFrame.addEventListener("mousedown", function(e) {
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        imgStartX = cropX;
        imgStartY = cropY;
        cropFrame.style.cursor = "grabbing";
    });

    document.addEventListener("mouseup", function() {
        dragging = false;
        if (cropFrame) {
            cropFrame.style.cursor = "grab";
        }
    });

    document.addEventListener("mousemove", function(e) {
        if (!dragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        cropX = imgStartX + dx;
        cropY = imgStartY + dy;

        atualizarCropImage();
    });

    cropFrame.addEventListener("touchstart", function(e) {
        const touch = e.touches[0];
        dragging = true;
        startX = touch.clientX;
        startY = touch.clientY;
        imgStartX = cropX;
        imgStartY = cropY;
    });

    document.addEventListener("touchend", function() {
        dragging = false;
    });

    document.addEventListener("touchmove", function(e) {
        if (!dragging) return;

        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        cropX = imgStartX + dx;
        cropY = imgStartY + dy;

        atualizarCropImage();
    });

    applyCrop.addEventListener("click", function() {
        if (!imagemOriginal) return;

        const frameSize = 320;
        const baseScale = Number(cropImage.dataset.baseScale);
        const finalScale = baseScale * cropScale;

        const canvas = document.createElement("canvas");
        canvas.width = frameSize;
        canvas.height = frameSize;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            imagemOriginal,
            (-cropX) / finalScale,
            (-cropY) / finalScale,
            frameSize / finalScale,
            frameSize / finalScale,
            0,
            0,
            frameSize,
            frameSize
        );

        const croppedDataUrl = canvas.toDataURL("image/png");

        const input = document.getElementById("editorInput");
        if (input) {
            input.value = croppedDataUrl;
        }

        if (campoAtual && campoAtual.tagName === "IMG") {
            campoAtual.src = croppedDataUrl;
        }

        fecharCropModal();
    });
}

function atualizarCropImage() {
    const cropImage = document.getElementById("cropImage");

    if (!imagemOriginal || !cropImage) return;

    const baseScale = Number(cropImage.dataset.baseScale);
    const finalScale = baseScale * cropScale;

    const width = imagemOriginal.width * finalScale;
    const height = imagemOriginal.height * finalScale;

    cropImage.style.width = width + "px";
    cropImage.style.height = height + "px";
    cropImage.style.left = cropX + "px";
    cropImage.style.top = cropY + "px";
}

function fecharCropModal() {
    const cropModal = document.getElementById("cropModal");
    const uploadImagem = document.getElementById("uploadImagem");

    if (cropModal) {
        cropModal.classList.remove("ativo");
    }

    if (uploadImagem) {
        uploadImagem.value = "";
    }

    imagemOriginal = null;
    dragging = false;
}