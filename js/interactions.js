// ===== INTERACTIONS.JS =====
// Handles all user interactions: opening, case file, sea lion, response

const Interactions = (() => {
    // ===== OPENING INTERACTION =====
    function initOpening() {
        const openBtn = document.getElementById('open-btn');
        const envelopeWrapper = document.getElementById('envelope');
        
        if (!openBtn || !envelopeWrapper) return;

        // Button click handler
        openBtn.addEventListener('click', openLetter);
        
        // Envelope keyboard handler
        envelopeWrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLetter();
            }
        });
        
        // Envelope click handler
        envelopeWrapper.addEventListener('click', openLetter);
        
        function openLetter() {
            // Open envelope
            envelopeWrapper.classList.add('open');
            
            // Start music (if available)
            MusicManager.play();

            // Create heart particles
            createHeartParticles(openBtn);

            // After envelope animation, navigate to next page
            setTimeout(() => {
                PageManager.goTo('acknowledgement');
            }, 1000);
        }
    }

    // ===== HEART PARTICLES =====
    function createHeartParticles(element) {
        const rect = element.getBoundingClientRect();
        const hearts = ['❤️', '💕', '💗', '💖', '💝'];
        
        for (let i = 0; i < 16; i++) {
            const particle = document.createElement('span');
            particle.className = 'heart-particle';
            particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            particle.style.position = 'fixed';
            particle.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 120) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            particle.style.fontSize = (Math.random() * 18 + 14) + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '100';
            particle.style.animationDelay = (Math.random() * 0.4) + 's';
            particle.setAttribute('aria-hidden', 'true');
            document.body.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 3500);
        }
    }

    // ===== CASE FILE INTERACTION =====
    function initCaseFile() {
        const caseFile = document.getElementById('case-file');
        if (!caseFile) return;

        const caseItems = caseFile.querySelectorAll('.case-item');
        const verdict = document.getElementById('case-verdict');

        // Reveal items one by one when page becomes active
        caseItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('revealed');
            }, (index + 1) * 450);
        });

        // Stamp verdict after items
        setTimeout(() => {
            if (verdict) {
                verdict.classList.add('stamped');
            }
        }, (caseItems.length + 1) * 450 + 300);
    }

    // ===== SEA LION INTERACTION =====
    function initSeaLion() {
        const seaLionInteraction = document.getElementById('sea-lion-interaction');
        const seaLionImg = document.getElementById('sea-lion-img');
        const oghText = document.getElementById('ogh-text');
        const seaLionCharacter = document.getElementById('sea-lion-character');
        
        if (!seaLionInteraction) return;

        let oghCount = 0;
        const oghPhrases = ['Ogh.', 'Ogh ogh.', 'Ogh ogh ogh!'];
        const seaLionStates = [
            'assets/images/sea-lion/sea-lion-neutral.svg',
            'assets/images/sea-lion/sea-lion-ogh.svg',
            'assets/images/sea-lion/sea-lion-ogh.svg',
            'assets/images/sea-lion/sea-lion-happy.svg'
        ];

        function handleSeaLionTap() {
            oghCount = Math.min(oghCount + 1, 3);
            
            // Update text
            if (oghText) {
                oghText.textContent = oghPhrases[oghCount];
                oghText.classList.remove('pulse');
                void oghText.offsetWidth; // Trigger reflow
                oghText.classList.add('pulse');
            }

            // Update sea lion image
            if (seaLionImg) {
                seaLionImg.src = seaLionStates[oghCount];
                if (seaLionCharacter) {
                    seaLionCharacter.classList.add('ogh-pose');
                    setTimeout(() => {
                        seaLionCharacter.classList.remove('ogh-pose');
                    }, 400);
                }
            }

            // After full ogh, show happy state
            if (oghCount === 3) {
                setTimeout(() => {
                    if (oghText) {
                        oghText.textContent = 'Ogh ogh ogh!';
                    }
                }, 600);
            }
        }

        seaLionInteraction.addEventListener('click', handleSeaLionTap);
        
        // Keyboard handler
        seaLionInteraction.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSeaLionTap();
            }
        });
    }

    // ===== DINO REACTION =====
    function initDino() {
        const dinoImg = document.getElementById('dino-img');
        
        if (!dinoImg) return;

        // Change dino to supportive when sea lion page is active
        // We'll trigger this when the page is shown
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const page = mutation.target;
                    if (page.id === 'page-sea-lion-dino' && page.classList.contains('active')) {
                        setTimeout(() => {
                            dinoImg.src = 'assets/images/dino/dino-supportive.svg';
                        }, 500);
                    }
                }
            });
        });

        const page = document.getElementById('page-sea-lion-dino');
        if (page) {
            observer.observe(page, { attributes: true });
        }
    }

    // ===== RESPONSE INTERACTION =====
    function initResponse() {
        const btnYes = document.getElementById('btn-yes');
        const btnMad = document.getElementById('btn-mad');
        const finalYes = document.getElementById('final-yes');
        const finalMad = document.getElementById('final-mad');
        const finalLetterContent = document.getElementById('final-letter-content');

        function showFinalLetter() {
            setTimeout(() => {
                if (finalLetterContent) {
                    finalLetterContent.classList.remove('hidden');
                    finalLetterContent.classList.add('visible');
                }
            }, 1500);
        }

        if (btnYes) {
            btnYes.addEventListener('click', () => {
                // Show celebration
                createConfetti();
                
                // Show positive response
                if (finalYes) finalYes.classList.remove('hidden');
                if (finalMad) finalMad.classList.add('hidden');

                showFinalLetter();
            });
        }

        if (btnMad) {
            btnMad.addEventListener('click', () => {
                // Show respectful response
                if (finalYes) finalYes.classList.add('hidden');
                if (finalMad) finalMad.classList.remove('hidden');

                showFinalLetter();
            });
        }
    }

    // ===== CONFETTI =====
    function createConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(container);

        const colors = ['#F58FA3', '#D95D72', '#FFDDE3', '#E88B5A', '#7BA47E', '#8BA9B5'];
        const shapes = ['♥', '●', '▲', '★', '♦'];

        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('span');
            piece.className = 'confetti-piece';
            piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            piece.style.left = Math.random() * 100 + '%';
            piece.style.color = colors[Math.floor(Math.random() * colors.length)];
            piece.style.fontSize = (Math.random() * 14 + 8) + 'px';
            piece.style.animationDelay = (Math.random() * 0.6) + 's';
            piece.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
            container.appendChild(piece);
        }

        setTimeout(() => {
            container.remove();
        }, 4500);
    }

    return {
        initOpening,
        initCaseFile,
        initSeaLion,
        initDino,
        initResponse
    };
})();
