// AOS (Animate On Scroll) 라이브러리 초기화
AOS.init({
    once: true, // 한 번만 애니메이션 실행
    duration: 800, // 0.8초 동안 애니메이션
    easing: 'ease-in-out', // 부드러운 효과
});

// Lightbox2 옵션 (선택 사항)
lightbox.option({
  'resizeDuration': 200,
  'wrapAround': true // 갤러리 사진 반복
});