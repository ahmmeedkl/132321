/* ==========================================================================
   أحمد عبد الله - طالب بالصف الثالث الثانوي ومطور برمجيات | Script Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       0. Interactive Particle Canvas Background (ذكاء اصطناعي تفاعلي)
       ---------------------------------------------------------------------- */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(x, y, dx, dy, size, color) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                    this.dx = -this.dx;
                }
                if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                    this.dy = -this.dy;
                }
                this.x += this.dx;
                this.y += this.dy;

                // Mouse interactivity
                if (mouse.x !== null && mouse.y !== null) {
                    let xs = mouse.x - this.x;
                    let ys = mouse.y - this.y;
                    let distance = Math.sqrt(xs * xs + ys * ys);
                    if (distance < mouse.radius) {
                        this.x -= xs * 0.015;
                        this.y -= ys * 0.015;
                    }
                }

                this.draw();
            }
        }

        function initParticles() {
            particles = [];
            const numberOfParticles = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
            const colors = ['rgba(0, 242, 254, 0.4)', 'rgba(217, 70, 239, 0.4)', 'rgba(79, 172, 254, 0.4)'];
            for (let i = 0; i < numberOfParticles; i++) {
                let size = Math.random() * 2 + 1;
                let x = Math.random() * (canvas.width - size * 2) + size;
                let y = Math.random() * (canvas.height - size * 2) + size;
                let dx = (Math.random() - 0.5) * 0.4;
                let dy = (Math.random() - 0.5) * 0.4;
                let color = colors[Math.floor(Math.random() * colors.length)];
                particles.push(new Particle(x, y, dx, dy, size, color));
            }
        }

        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let xs = particles[a].x - particles[b].x;
                    let ys = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(xs * xs + ys * ys);

                    if (distance < 110) {
                        opacityValue = 1 - (distance / 110);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${opacityValue * 0.12})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null && mouse.y !== null) {
                    let xs = particles[a].x - mouse.x;
                    let ys = particles[a].y - mouse.y;
                    let distance = Math.sqrt(xs * xs + ys * ys);
                    if (distance < mouse.radius) {
                        opacityValue = 1 - (distance / mouse.radius);
                        ctx.strokeStyle = `rgba(217, 70, 239, ${opacityValue * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connectParticles();
            requestAnimationFrame(animate);
        }

        resizeCanvas();
        animate();
    }

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

    const whatsappSendBtn = document.getElementById('whatsapp-send-btn');

    // 1. Real Working Email Sending (Fail-proof AJAX + Direct Gmail Web / Mailto fallback)
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('sender-name')?.value.trim();
            const email = document.getElementById('sender-email')?.value.trim();
            const subject = document.getElementById('sender-subject')?.value.trim() || 'رسالة جديدة من الموقع الشخصي';
            const message = document.getElementById('sender-message')?.value.trim();

            if (!name || !email || !message) {
                showFormAlert('error', '⚠️ يرجى ملء جميع الحقول المطلوبة أولاً.');
                return;
            }

            // Set Loading UI
            if (submitBtn) submitBtn.disabled = true;
            if (btnText) btnText.classList.add('hidden');
            if (btnSpinner) btnSpinner.classList.remove('hidden');

            const targetEmail = 'ahmed.abdullah.fci@gmail.com';
            const emailBody = `الاسم: ${name}\nالبريد الإلكتروني للراسل: ${email}\nالموضوع: ${subject}\n\nنص الرسالة:\n${message}`;

            // Check if page is running on web server (http/https) vs local file (file://)
            if (window.location.protocol.startsWith('http')) {
                try {
                    const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            _subject: `رسالة جديدة من موقع أحمد عبد الله: ${subject}`,
                            الاسم: name,
                            البريد: email,
                            الموضوع: subject,
                            الرسالة: message
                        })
                    });

                    const data = await response.json();
                    if (response.ok || data.success === "true" || data.success === true) {
                        showFormAlert('success', '🎉 تم إرسال رسالتك بنجاح ووصلت فوراً إلى بريد أحمد عبد الله!');
                        contactForm.reset();
                    } else {
                        // Fallback to Gmail Web compose
                        openGmailCompose(targetEmail, subject, emailBody);
                    }
                } catch (err) {
                    openGmailCompose(targetEmail, subject, emailBody);
                }
            } else {
                // When opened locally from disk (file:///), open Gmail Web or Mail client directly without any FormSubmit error!
                openGmailCompose(targetEmail, subject, emailBody);
            }

            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.classList.remove('hidden');
            if (btnSpinner) btnSpinner.classList.add('hidden');
        });
    }

    function openGmailCompose(targetEmail, subject, body) {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open Gmail Web in new tab
        const win = window.open(gmailUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
            window.location.href = mailtoUrl;
        }

        showFormAlert('success', '🎉 تم تجهيز الرسالة وفتح بريدك الإلكتروني لإرسالها مباشرة إلى أحمد عبد الله بنجاح!');
        contactForm.reset();
    }

    // 2. Real Instant WhatsApp Messaging Button
    if (whatsappSendBtn) {
        whatsappSendBtn.addEventListener('click', () => {
            const name = document.getElementById('sender-name')?.value.trim() || 'زائر الموقع';
            const email = document.getElementById('sender-email')?.value.trim() || 'غير محدد';
            const subject = document.getElementById('sender-subject')?.value.trim() || 'استفسار من الموقع الشخصي';
            const message = document.getElementById('sender-message')?.value.trim();

            if (!message) {
                showFormAlert('error', '⚠️ يرجى كتابة نص الرسالة في المربع أعلاه أولاً قبل الإرسال عبر واتساب.');
                document.getElementById('sender-message')?.focus();
                return;
            }

            const formattedText = `👋 *رسالة جديدة من زائر موقعك الشخصي*\n\n` +
                                  `👤 *الاسم:* ${name}\n` +
                                  `📧 *البريد:* ${email}\n` +
                                  `📌 *الموضوع:* ${subject}\n\n` +
                                  `💬 *نص الرسالة:*\n${message}`;

            const phone = '201102289174';
            const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(formattedText)}`;
            window.open(whatsappURL, '_blank');
            showFormAlert('success', '🚀 تم فتح واتساب بنجاح! اضغط إرسال داخل واتساب لتصل رسالتك إلى أحمد فوراً.');
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

    // Bento card mouse glow tracking
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

});
