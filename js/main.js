// ===== MAIN.JS =====
// Page-based navigation system with hash routing

const PageManager = (() => {
    // Define page order
    const pages = [
        'opening',
        'acknowledgement',
        'padel-video',
        'no-excuses',
        'two-years',
        'things-i-love',
        'sea-lion-dino',
        'the-apology',
        'the-promise',
        'response',
        'final-letter'
    ];

    let currentPage = 'opening';
    let isTransitioning = false;

    // ===== INITIALIZATION =====
    function init() {
        // Set up navigation buttons
        initNavButtons();
        
        // Set up restart button
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                goTo('opening');
            });
        }

        // Handle browser back/forward
        window.addEventListener('hashchange', handleHashChange);

        // Handle initial hash
        const initialHash = window.location.hash.slice(1);
        if (initialHash && pages.includes(initialHash)) {
            goTo(initialHash, false);
        } else {
            // Set initial hash
            window.location.hash = 'opening';
        }
    }

    // ===== NAVIGATION =====
    function goTo(pageId, updateHash = true) {
        if (isTransitioning) return;
        if (!pages.includes(pageId)) return;
        if (pageId === currentPage) return;

        isTransitioning = true;

        const currentEl = document.getElementById('page-' + currentPage);
        const nextEl = document.getElementById('page-' + pageId);

        if (!currentEl || !nextEl) {
            isTransitioning = false;
            return;
        }

        // Determine direction
        const currentIndex = pages.indexOf(currentPage);
        const nextIndex = pages.indexOf(pageId);
        const direction = nextIndex > currentIndex ? 'forward' : 'backward';

        // Set exit class on current page
        if (direction === 'forward') {
            currentEl.classList.add('exit-left');
        } else {
            currentEl.classList.add('exit-right');
        }

        // Prepare next page
        if (direction === 'forward') {
            nextEl.style.transform = 'translateX(30px)';
        } else {
            nextEl.style.transform = 'translateX(-30px)';
        }

        // Force reflow
        nextEl.offsetHeight;

        // Activate next page
        nextEl.classList.add('active');
        nextEl.style.transform = 'translateX(0)';

        // Update hash
        if (updateHash) {
            window.location.hash = pageId;
        }

        // Show footer only on final page
        const footer = document.getElementById('site-footer');
        if (footer) {
            if (pageId === 'final-letter') {
                footer.classList.add('visible');
            } else {
                footer.classList.remove('visible');
            }
        }

        // After transition, clean up
        setTimeout(() => {
            currentEl.classList.remove('active', 'exit-left', 'exit-right');
            nextEl.style.transform = '';
            currentPage = pageId;
            isTransitioning = false;

            // Scroll to top of new page
            nextEl.scrollTop = 0;

            // Trigger page-specific animations
            onPageShown(pageId);
        }, 500);
    }

    // ===== PAGE SHOWN CALLBACKS =====
    function onPageShown(pageId) {
        switch (pageId) {
            case 'padel-video':
                // Trigger case file reveal
                Interactions.initCaseFile();
                break;
            case 'sea-lion-dino':
                // Reset sea lion interaction
                resetSeaLion();
                break;
            case 'response':
                // Reset response state
                resetResponse();
                break;
        }
    }

    // ===== RESET SEA LION =====
    function resetSeaLion() {
        const seaLionImg = document.getElementById('sea-lion-img');
        const oghText = document.getElementById('ogh-text');
        const dinoImg = document.getElementById('dino-img');
        
        if (seaLionImg) {
            seaLionImg.src = 'assets/images/sea-lion/sea-lion-neutral.svg';
        }
        if (oghText) {
            oghText.textContent = 'Tap the sea lion';
        }
        if (dinoImg) {
            dinoImg.src = 'assets/images/dino/dino-sad.svg';
        }
    }

    // ===== RESET RESPONSE =====
    function resetResponse() {
        const finalYes = document.getElementById('final-yes');
        const finalMad = document.getElementById('final-mad');
        const finalLetterContent = document.getElementById('final-letter-content');
        
        if (finalYes) finalYes.classList.add('hidden');
        if (finalMad) finalMad.classList.add('hidden');
        if (finalLetterContent) {
            finalLetterContent.classList.add('hidden');
            finalLetterContent.classList.remove('visible');
        }
    }

    // ===== NAV BUTTONS =====
    function initNavButtons() {
        document.querySelectorAll('[data-nav]').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-nav');
                goTo(target);
            });
        });
    }

    // ===== HASH CHANGE =====
    function handleHashChange() {
        const hash = window.location.hash.slice(1);
        if (hash && pages.includes(hash) && hash !== currentPage) {
            goTo(hash, false);
        }
    }

    return {
        init,
        goTo,
        get currentPage() { return currentPage; }
    };
})();

// ===== DOM CONTENT LOADED =====
(function() {
    'use strict';

    function init() {
        // Initialize music manager
        MusicManager.init();

        // Initialize all interactions
        Interactions.initOpening();
        Interactions.initCaseFile();
        Interactions.initSeaLion();
        Interactions.initDino();
        Interactions.initResponse();

        // Initialize page manager
        PageManager.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
