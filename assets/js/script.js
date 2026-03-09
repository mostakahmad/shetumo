document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS - Optimized for performance
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        disable: window.innerWidth < 768 // Disable on mobile to fix scrolling lag
    });

    // 2. Preloader
    // 2. Preloader - Shorter delay for better UX
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                initTypewriter();
            }, 300);
        }, 800);
    });

    // 3. Typewriter Effect
    function initTypewriter() {
        const textElement = document.getElementById('typewriter');
        const textContent = textElement.textContent.trim();
        textElement.textContent = '';
        let i = 0;

        function type() {
            if (i < textContent.length) {
                textElement.textContent += textContent.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        type();
    }

    // 4. Love Counter
    // Marriage: 5 Nov 2021
    const marriageDate = new Date('2021-11-05T00:00:00');

    function updateCounter() {
        const now = new Date();
        const diff = now - marriageDate;

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        document.getElementById('years').innerText = years;
        document.getElementById('months').innerText = months;
        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours;
    }

    setInterval(updateCounter, 1000);
    updateCounter();

    // 5. Floating Hearts Animation
    const heartsContainer = document.createElement('div');
    heartsContainer.id = 'hearts-container';
    document.body.appendChild(heartsContainer);

    function createHeart() {
        const heart = document.createElement('i');
        heart.className = Math.random() > 0.5 ? 'bi bi-heart-fill floating-heart' : 'bi bi-suit-heart-fill floating-heart';

        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
        heart.style.color = Math.random() > 0.5 ? '#af904c' : '#8b0000';
        heart.style.opacity = Math.random() * 0.5 + 0.2;

        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 8000);
    }

    setInterval(createHeart, 2000); // Less frequent hearts for performance

    // 6. Web Audio API Background Music (Subtle Ambient Pad)
    let audioContext;
    let audioStarted = false;
    let isMuted = true;
    let gainNode;

    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = musicToggle.querySelector('i');

    function initAudio() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.connect(audioContext.destination);

            playRomanticPad();
            audioStarted = true;
            isMuted = false;
            musicIcon.className = 'bi bi-volume-up';
            gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 3);
        } catch (e) {
            console.error("Audio failed", e);
        }
    }

    function createOscillator(freq, type, startTime, duration) {
        if (!audioContext) return;
        const osc = audioContext.createOscillator();
        const oscGain = audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        oscGain.gain.setValueAtTime(0, startTime);
        oscGain.gain.linearRampToValueAtTime(0.03, startTime + 1.5);
        oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(oscGain);
        oscGain.connect(gainNode);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    function playRomanticPad() {
        const notes = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
        let time = audioContext.currentTime;

        function loop() {
            if (!audioStarted) return;
            notes.forEach(note => {
                createOscillator(note, 'sine', time, 8);
            });
            time += 6;
            setTimeout(loop, 6000);
        }
        loop();
    }

    musicToggle.addEventListener('click', () => {
        if (!audioStarted) {
            initAudio();
            return;
        }

        if (isMuted) {
            gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 1);
            musicIcon.className = 'bi bi-volume-up';
        } else {
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
            musicIcon.className = 'bi bi-volume-mute';
        }
        isMuted = !isMuted;
    });

    // 7. Surprise Button with Enhanced Confetti
    const finalSurpriseBtn = document.getElementById('finalSurprise');
    const letterModal = new bootstrap.Modal(document.getElementById('letterModal'));

    finalSurpriseBtn.addEventListener('click', () => {
        const duration = 6 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#8b0000', '#af904c', '#5a082d', '#fffdf5'];

        (function frame() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return;

            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            requestAnimationFrame(frame);
        }());

        setTimeout(() => {
            letterModal.show();
        }, 1500);
    });

    // 8. Scroll Smoothness
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
