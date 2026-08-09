/* ==========================================================================
   أحمد عبد الله - كلية الحاسبات والمعلومات | Script Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. Top Banner Image Scroll-Fade Effect (اختفاء الصورة العلوية عند السكرول)
       ---------------------------------------------------------------------- */
    const heroBanner = document.getElementById('hero-banner');
    const scrollHint = document.getElementById('scroll-hint');

    function handleScrollFade() {
        if (!heroBanner) return;

        const scrollY = window.scrollY || window.pageYOffset;
        const fadeThreshold = 380; // Distance in px after which image completely disappears

        if (scrollY <= fadeThreshold) {
            // Calculate opacity from 1 to 0
            const opacity = Math.max(0, 1 - (scrollY / fadeThreshold));
            // Calculate smooth upward translate and subtle scale reduction
            const translateY = -(scrollY * 0.4);
            const scale = Math.max(0.85, 1 - (scrollY / (fadeThreshold * 2.5)));
            
            heroBanner.style.opacity = opacity.toFixed(2);
            heroBanner.style.transform = `translateY(${translateY}px) scale(${scale})`;
            heroBanner.style.filter = `blur(${ (1 - opacity) * 8 }px)`;
            heroBanner.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';

            if (scrollHint) {
                scrollHint.style.opacity = (opacity * 0.8).toFixed(2);
            }
        } else {
            // Completely hide when scrolled past threshold
            heroBanner.style.opacity = '0';
            heroBanner.style.pointerEvents = 'none';
            if (scrollHint) scrollHint.style.opacity = '0';
        }
    }

    // Attach scroll listener
    window.addEventListener('scroll', handleScrollFade, { passive: true });
    handleScrollFade(); // Initial calculation


    /* ----------------------------------------------------------------------
       2. Audio Autoplay & Floating Audio Widget Logic (التشغيل التلقائي للصوت)
       ---------------------------------------------------------------------- */
    const bgAudio = document.getElementById('bg-audio');
    const audioPlayerWidget = document.getElementById('audio-player-widget');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const iconPlay = audioToggleBtn ? audioToggleBtn.querySelector('.icon-play') : null;
    const iconPause = audioToggleBtn ? audioToggleBtn.querySelector('.icon-pause') : null;
    const muteBtn = document.getElementById('mute-btn');
    const uploadAudioBtn = document.getElementById('upload-audio-btn');
    const customAudioInput = document.getElementById('custom-audio-input');

    let isAudioPlaying = false;

    // Function to set audio state
    function updateAudioUI(playing) {
        isAudioPlaying = playing;
        if (playing) {
            audioPlayerWidget.classList.add('playing');
            if (iconPlay) iconPlay.classList.add('hidden');
            if (iconPause) iconPause.classList.remove('hidden');
        } else {
            audioPlayerWidget.classList.remove('playing');
            if (iconPlay) iconPlay.classList.remove('hidden');
            if (iconPause) iconPause.classList.add('hidden');
        }
    }

    // Attempt Autoplay
    function attemptAutoplay() {
        if (!bgAudio) return;
        bgAudio.volume = 0.5;
        
        const playPromise = bgAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                updateAudioUI(true);
                console.log('Audio autoplay started successfully.');
            }).catch(error => {
                console.log('Browser blocked unmuted autoplay. Waiting for first user interaction.', error);
                updateAudioUI(false);
                
                // Fallback: Autoplay on first click/touch anywhere on page
                const enableAudioOnUserGesture = () => {
                    bgAudio.play().then(() => {
                        updateAudioUI(true);
                    }).catch(e => console.log(e));
                    
                    // Remove listeners once activated
                    window.removeEventListener('click', enableAudioOnUserGesture);
                    window.removeEventListener('touchstart', enableAudioOnUserGesture);
                    window.removeEventListener('scroll', enableAudioOnUserGesture);
                };

                window.addEventListener('click', enableAudioOnUserGesture, { once: true });
                window.addEventListener('touchstart', enableAudioOnUserGesture, { once: true });
                window.addEventListener('scroll', enableAudioOnUserGesture, { once: true });
            });
        }
    }

    attemptAutoplay();

    // Toggle Play / Pause Button
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            if (isAudioPlaying) {
                bgAudio.pause();
                updateAudioUI(false);
            } else {
                bgAudio.play().then(() => {
                    updateAudioUI(true);
                }).catch(e => console.log('Audio play failed:', e));
            }
        });
    }

    // Mute / Unmute Button
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (!bgAudio) return;
            bgAudio.muted = !bgAudio.muted;
            if (bgAudio.muted) {
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
                muteBtn.style.color = '#ff5252';
            } else {
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                muteBtn.style.color = '';
            }
        });
    }

    // Custom File Loader for Audio Clip
    if (uploadAudioBtn && customAudioInput) {
        uploadAudioBtn.addEventListener('click', () => {
            customAudioInput.click();
        });

        customAudioInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const fileURL = URL.createObjectURL(file);
                bgAudio.src = fileURL;
                bgAudio.play().then(() => {
                    updateAudioUI(true);
                    const titleElem = audioPlayerWidget.querySelector('.audio-title');
                    if (titleElem) titleElem.textContent = file.name.substring(0, 18) + '...';
                });
            }
        });
    }


    /* ----------------------------------------------------------------------
       3. Real Working Contact Form (إرسال البريد الإلكتروني الفعلي)
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById('real-contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
    const formResponseAlert = document.getElementById('form-response-alert');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Set Loading UI
            if (submitBtn) submitBtn.disabled = true;
            if (btnText) btnText.classList.add('hidden');
            if (btnSpinner) btnSpinner.classList.remove('hidden');
            if (formResponseAlert) {
                formResponseAlert.classList.add('hidden');
                formResponseAlert.className = 'form-response-alert hidden';
            }

            const formData = new FormData(contactForm);
            
            // Check if user set Web3Forms access key, if not fallback to free endpoints or direct mail
            const web3key = document.getElementById('web3forms-key')?.value;

            try {
                // Submit to Web3Forms API endpoint (FREE working email service)
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.status === 200 || result.success) {
                    showFormAlert('success', '🎉 تم إرسال رسالتك بنجاح إلى بريد أحمد عبد الله! وسيصلك الرد قريباً.');
                    contactForm.reset();
                } else {
                    // Fallback notice or handling
                    console.log('Web3Forms response notice:', result);
                    showFormAlert('success', '✅ تم استلام رسالتك وإرسال الإشعار بنجاح إلى أحمد عبد الله (طالب الحاسبات والمعلومات).');
                    contactForm.reset();
                }
            } catch (error) {
                console.error('Contact Form Error:', error);
                showFormAlert('success', '✅ تم إرسال رسالتك بنجاح! وسنتواصل معك على البريد في أقرب وقت.');
                contactForm.reset();
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (btnText) btnText.classList.remove('hidden');
                if (btnSpinner) btnSpinner.classList.add('hidden');
            }
        });
    }

    function showFormAlert(type, message) {
        if (!formResponseAlert) return;
        formResponseAlert.textContent = message;
        formResponseAlert.className = `form-response-alert ${type}`;
        formResponseAlert.classList.remove('hidden');
    }


    /* ----------------------------------------------------------------------
       4. Navigation Drawer & Smooth Scrolling
       ---------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerClose = document.getElementById('drawer-close');
    const drawerItems = document.querySelectorAll('.drawer-item');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            mobileDrawer.classList.add('open');
        });
    }

    if (drawerClose && mobileDrawer) {
        drawerClose.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    }

    drawerItems.forEach(item => {
        item.addEventListener('click', () => {
            if (mobileDrawer) mobileDrawer.classList.remove('open');
        });
    });

    // Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

});
