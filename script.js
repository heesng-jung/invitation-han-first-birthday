// 모션 최소화 설정 감지 후 AOS 초기화
(function initAOS() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  AOS.init({
    once: true,
    duration: prefersReduced ? 0 : 800,
    easing: 'ease-in-out',
    disable: prefersReduced
  });
})();

// Lightbox2 옵션
lightbox.option({
  resizeDuration: 200,
  wrapAround: true
});

// 카운트다운 (D-day)
(function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const eventTime = new Date('2026-03-28T16:30:00+09:00').getTime();
  const update = () => {
    const now = Date.now();
    let diff = eventTime - now;
    if (diff < 0) diff = 0;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    el.textContent = `D-${d} | ${h}시간 ${m}분 ${s}초`;
  };
  update();
  setInterval(update, 1000);
})();

// 주소 복사
(function initCopyAddress() {
  const btn = document.getElementById('copyAddr');
  if (!btn) return;
  const addr = '경기 용인시 처인구 양지면 새실로75번길 2-8 EMMA Mansion';
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(addr);
      alert('주소가 복사되었습니다!');
    } catch (e) {
      prompt('복사에 실패했습니다. 아래 주소를 복사해주세요:', addr);
    }
  });
})();

// 공유하기
(function initShare() {
  const btn = document.getElementById('share');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const url = location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('링크가 복사되었습니다!');
      }
    } catch (e) {
      // 사용자가 공유를 취소하거나 오류 발생 시 무시
    }
  });
})();

// BGM 토글
(function initBgm() {
  const audio = document.getElementById('bgm');
  const btn = document.getElementById('bgmBtn');
  if (!audio || !btn) return;
  let playing = false;
  btn.addEventListener('click', async () => {
    try {
      if (!playing) {
        await audio.play();
        btn.textContent = '일시정지';
      } else {
        audio.pause();
        btn.textContent = 'BGM ♪';
      }
      playing = !playing;
    } catch (e) {
      // 자동재생 제한 등 오류는 무시
    }
  });
})();