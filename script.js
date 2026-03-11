"use strict";

gsap.registerPlugin(ScrollTrigger);

// --- 1. LENIS SMOOTH SCROLL ENGINE ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  smoothWheel: true
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// --- 2. THEATRICAL CURTAIN & HERO REVEAL ---
window.addEventListener("load", () => {
  const tl = gsap.timeline();
  tl.to("#loadingCurtain", { yPercent: -100, duration: 1.5, ease: "power4.inOut", delay: 0.3 })
    .to(".title-text", { y: "0%", duration: 1.2, stagger: 0.2, ease: "power3.out" }, "-=0.5");
});

// --- 3. HERO PARALLAX & DIMMING ---
gsap.to('.hero-content', {
  y: "-30vh", opacity: 0, ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
});
gsap.to('.hero-overlay', {
  backgroundColor: "rgba(0, 0, 0, 0.85)", ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
});

// --- 4. HEADER & MENU LOGIC ---
const menuToggle = document.getElementById('menuToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
const header = document.getElementById('header');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation(); 
  menuToggle.classList.toggle('active');
  dropdownMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!dropdownMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    menuToggle.classList.remove('active');
    dropdownMenu.classList.remove('active');
  }
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// --- 5. STICKY BACKGROUND SCALES & CINEMATIC DIMMING ---
const scaleSections = gsap.utils.toArray('.scale-intro-section');
scaleSections.forEach(section => {
  const container = section.querySelector('.scale-intro-container');
  const img = section.querySelector('.scale-intro-img');
  const introTl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top bottom", end: "top top", scrub: 1 }});

  introTl.fromTo(container, { scale: 0.85, borderRadius: "40px" }, { scale: 1, borderRadius: "0px", ease: "none" })
  .fromTo(img, { scale: 1.2 }, { scale: 1, ease: "none" }, "<");
});

// Hotlines Layer Dimming
gsap.to('#hotlines-intro .section-dimmer', { opacity: 0.8, ease: "none", scrollTrigger: { trigger: '#services-intro', start: "top bottom", end: "top top", scrub: true }});
gsap.to('#hotlines-intro .hotlines-section', { y: "-20vh", ease: "none", scrollTrigger: { trigger: '#services-intro', start: "top bottom", end: "top top", scrub: true }});

// Services Layer Dimming
gsap.to('#services-intro .section-dimmer', { opacity: 0.8, ease: "none", scrollTrigger: { trigger: '#history', start: "top bottom", end: "top top", scrub: true }});
gsap.to('#services-intro .services-section', { y: "-20vh", ease: "none", scrollTrigger: { trigger: '#history', start: "top bottom", end: "top top", scrub: true }});

// --- 6. CENTERED HOTLINES REVEAL ---
const hotlinesSection = document.querySelector('.hotlines-section');
if (hotlinesSection) {
  const hotlineTl = gsap.timeline({ scrollTrigger: { trigger: hotlinesSection, start: "top 75%", toggleActions: "play none none reverse" }});
  gsap.set('.hotlines-grid', { perspective: 1500 });
  hotlineTl.fromTo('.hotlines-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
  .fromTo('.hotline-card', { y: 100, opacity: 0, rotationX: -25, scale: 0.9 }, { y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)" }, "-=0.7");
}

// --- 7. SERVICES GRID REVEAL ---
const servicesSection = document.querySelector('.services-section');
if (servicesSection) {
  const servicesTl = gsap.timeline({ scrollTrigger: { trigger: servicesSection, start: "top 80%", toggleActions: "play none none reverse" }});
  servicesTl.fromTo('.services-main-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
  .fromTo('.sc-wrapper', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.6");
}

// --- 8. STAGGERED REVEALS FOR MAGAZINE SECTIONS ---
const sections = gsap.utils.toArray('.content-section');
sections.forEach(section => {
  const imgWrapper = section.querySelector('.reveal-wrapper');
  const textElements = section.querySelectorAll('.slide-text');
  const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" }});

  if (imgWrapper) tl.fromTo(imgWrapper, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" });
  if (textElements.length > 0) tl.fromTo(textElements, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }, "-=0.8");
});

// Inner Image Masking Parallax
const parallaxImages = gsap.utils.toArray('.content-section .reveal-img');
parallaxImages.forEach(img => {
  gsap.fromTo(img, { y: "-15%" }, { y: "15%", ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }});
});

// --- 9. 3D CURVED CAROUSEL WITH DETAILED SPLIT-MODAL ---
(function() {
  const cards = Array.from(document.querySelectorAll('.carousel-card'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  
  const modal = document.getElementById('touristModal');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalMap = document.getElementById('modalMap');

  const touristData =[
    { title: "Museo de Cainta", img: "url('pics/tourist_spots/museocainta.avif')", desc: "Discover the rich historical tapestry of Cainta. The museum houses century-old artifacts, traditional costumes, and documents that trace the municipality's heritage from its early settlements to its modern achievements.", embed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.370606408147!2d121.11403817590416!3d14.577945877629315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c7002bc4fbc5%3A0xd6cc6421d2d0fbbc!2sMuseo%20Cainta!5e0!3m2!1sen!2sph!4v1773239952789!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` },
    { title: "One Cainta Arena", img: "url('pics/tourist_spots/onearena.jpg')", desc: "A premier multipurpose venue hosting major sports events, grand concerts, and large municipal gatherings. It stands tall as a modern symbol of Cainta's vibrant community spirit and dedication to athleticism.", embed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.3582964944576!2d121.1192686!3d14.5786482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c79b5e17b169%3A0xa96f358323c8784!2sOne%20Arena!5e0!3m2!1sen!2sph!4v1773239593229!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` },
    { title: "Oval Park", img: "url('pics/tourist_spots/ovalpark.webp')", desc: "The green heart of the municipality. Oval park is a favorite, secure spot for morning jogs, family picnics, and community events, offering a refreshing escape within the urban landscape. It features running tracks, a dog park, and open grassy areas perfect for outdoor relaxation.", embed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.308121700438!2d121.1221384!3d14.581510499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c7cb9894b079%3A0x72d90463fbe8726e!2sOne%20Cainta%20Oval%20Park!5e0!3m2!1sen!2sph!4v1773239693201!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` },
    { title: "ROTC Grounds", img: "url('pics/tourist_spots/rotc.jpg')", desc: "A historic open space originally dedicated to military training and outdoor municipal activities. Today, it serves as a meaningful tribute and monument to the bravery and sacrifice of the Filipino soldiers and Hunters ROTC guerillas who fought for freedom during World War II.", embed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.351821625038!2d121.12028919999999!3d14.579017599999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c79cbb44588f%3A0xae4ba58b5ac00b11!2sHunters%20ROTC%20Guerillas%20Monument!5e0!3m2!1sen!2sph!4v1773239836071!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` },
    { title: "Sta. Lucia Mall", img: "url('pics/tourist_spots/stalucia.jpg')", desc: "One of the pioneering and most iconic shopping destinations in Rizal. Sta. Lucia Mall offers comprehensive retail, dining, and entertainment experiences for residents and visitors alike, maintaining its status as a central commercial hub.", embed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1930.3280658564324!2d121.09870228881259!3d14.618654441847191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b910e4e40d03%3A0x5b85edc8e9248ba1!2sSta.%20Lucia%20Mall!5e0!3m2!1sen!2sph!4v1773239912458!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` }
  ];

  let current = 2; 

  function updateCarousel(newIndex, animate = true) {
    if (newIndex < 0) newIndex = cards.length - 1;
    if (newIndex >= cards.length) newIndex = 0;
    current = newIndex;

    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    const isMobile = window.innerWidth <= 768;
    const xSpread = isMobile ? 180 : 300; 
    const scaleDrop = isMobile ? 0.2 : 0.15; 
    const zDrop = isMobile ? 80 : 130; 

    cards.forEach((card, i) => {
      let offset = i - current;

      if (offset < -2) offset += 5;
      if (offset > 2) offset -= 5;

      const distance = Math.abs(offset);
      const scale = distance === 0 ? 1.05 : 1 - (scaleDrop * distance); 
      const z = distance === 0 ? 50 : -distance * zDrop; 
      const x = offset * xSpread; 
      const rotateY = -offset * 18; 

      card.classList.toggle('active', distance === 0);
      card.style.zIndex = 10 - distance;

      if (animate) {
        gsap.to(card, { x: x, z: z, rotateY: rotateY, scale: scale, duration: 0.65, ease: "power3.out" });
      } else {
        gsap.set(card, { x, z, rotateY, scale });
      }
    });
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (card.classList.contains('active')) {
        const data = touristData[i];
        modalImage.style.backgroundImage = data.img;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalMap.innerHTML = data.embed;
        modal.classList.add('active');
        lenis.stop(); 
      } else {
        updateCarousel(i);
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modalMap.innerHTML = ''; 
    lenis.start(); 
  };
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  document.getElementById('carouselPrev')?.addEventListener('click', () => updateCarousel(current - 1));
  document.getElementById('carouselNext')?.addEventListener('click', () => updateCarousel(current + 1));
  dots.forEach(d => d.addEventListener('click', () => updateCarousel(+d.dataset.dot)));

  updateCarousel(2, false);
  window.addEventListener('resize', () => updateCarousel(current, false));

  gsap.fromTo('.tourist-header .slide-text', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: '.tourist-section', start: 'top 80%', toggleActions: 'play none none reverse' }});
  gsap.fromTo('.carousel-card', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.carousel-viewport', start: 'top 85%', toggleActions: 'play none none reverse' }});
})();

// --- 10. NEWS REVEALS ---
gsap.fromTo('.news-main-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.news-section', start: 'top 80%', toggleActions: 'play none none reverse' }});
gsap.fromTo('.news-img-cell, .news-text-cell', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.news-grid', start: 'top 85%', toggleActions: 'play none none reverse' }});
gsap.fromTo('.video-thumb', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.videos-row', start: 'top 95%', toggleActions: 'play none none reverse' }});

// --- 11. VIDEO FULLSCREEN MODAL LOGIC ---
(function() {
  const videoThumbs = document.querySelectorAll('.video-thumb');
  const videoModal = document.getElementById('videoModal');
  const vmPlayer = document.getElementById('vmPlayer');
  const vmTitle = document.getElementById('vmTitle');
  const vmLink = document.getElementById('vmLink');
  const vmClose = document.getElementById('vmClose');
  const vmExpand = document.getElementById('vmExpand');

  // Open Video Modal
  videoThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.getAttribute('data-video');
      const title = thumb.getAttribute('data-title');
      const linkText = thumb.getAttribute('data-link');

      vmPlayer.src = src;
      vmTitle.textContent = title;
      vmLink.textContent = linkText;

      videoModal.classList.add('active');
      lenis.stop(); // Prevent background scrolling
      vmPlayer.play();
    });
  });

  // Close Video Modal
  vmClose.addEventListener('click', () => {
    videoModal.classList.remove('active');
    vmPlayer.pause();
    vmPlayer.currentTime = 0; // reset video
    lenis.start(); // Resume scrolling
  });

  // Custom Fullscreen Button handling the entire Modal Overlay
  vmExpand.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      videoModal.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });

})();