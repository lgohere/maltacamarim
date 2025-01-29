/* static/js/main.js */
document.addEventListener('DOMContentLoaded', function() {
    const parallaxWrapper = document.querySelector('.parallax-wrapper');
    
    parallaxWrapper.addEventListener('scroll', function() {
        const scrolled = parallaxWrapper.scrollTop;
        const video = document.querySelector('.video-background');
        video.style.transform = `translateZ(-1px) scale(2) translateY(${scrolled * 0.5}px)`;
    });
});