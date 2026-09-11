// ===== MUSIC.JS =====
// Handles background music initialization, play/pause, and mute/unmute

const MusicManager = (() => {
    let audio = null;
    let isMuted = true; // Start muted - no audio file yet
    let isInitialized = false;

    function init() {
        audio = document.getElementById('bg-music');
        if (!audio) return;

        const toggleBtn = document.getElementById('music-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggle);
        }

        isInitialized = true;
    }

    function toggle() {
        if (!audio) return;

        if (isMuted) {
            play();
        } else {
            pause();
        }
    }

    function play() {
        if (!audio) return;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isMuted = false;
                updateUI();
            }).catch((error) => {
                // Audio failed to play (no file, browser policy, etc.)
                console.log('Audio playback failed:', error.message);
                isMuted = true;
                updateUI();
            });
        }
    }

    function pause() {
        if (!audio) return;
        audio.pause();
        isMuted = true;
        updateUI();
    }

    function updateUI() {
        const toggleBtn = document.getElementById('music-toggle');
        if (!toggleBtn) return;

        if (isMuted) {
            toggleBtn.classList.add('muted');
            toggleBtn.setAttribute('aria-label', 'Unmute music');
        } else {
            toggleBtn.classList.remove('muted');
            toggleBtn.setAttribute('aria-label', 'Mute music');
        }
    }

    return {
        init,
        play,
        pause,
        toggle,
        get isMuted() { return isMuted; }
    };
})();
