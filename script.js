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

  const ICONS = {
    PLAYING: '<div class="sound-wave"><span></span><span></span><span></span><span></span></div>',
    PAUSED: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>'
  };

  const updateIcon = () => {
    btn.innerHTML = audio.paused ? ICONS.PAUSED : ICONS.PLAYING;
  };

  const playBgm = async () => {
    try {
      await audio.play();
      updateIcon();
    } catch (e) {
      console.log('자동 재생이 제한되었습니다. 사용자 상호작용이 필요합니다.');
      updateIcon();
    }
  };

  btn.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
      updateIcon();
    } catch (e) {
      console.error('BGM 재생 오류:', e);
    }
  });

  // 초기 상태 설정
  updateIcon();

  // 페이지 첫 상호작용 시 재생 시도 (브라우저 정책 대응)
  document.addEventListener('click', playBgm, { once: true });
})();

// 벚꽃 애니메이션
(function initSakura() {
  const canvas = document.getElementById('sakuraCanvas');
  const btn = document.getElementById('sakuraBtn');
  if (!canvas || !btn) return;

  const ctx = canvas.getContext('2d');
  let width, height, animationId;
  let particles = [];
  let isRunning = true;

  const petalCount = 30;
  const petalImages = [];

  // 벚꽃잎 이미지 생성 (Canvas로 그리기)
  const createPetalCanvas = () => {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 20;
    pCanvas.height = 20;
    const pCtx = pCanvas.getContext('2d');
    
    // 심플한 벚꽃잎 하트 모양
    pCtx.fillStyle = '#ffb7c5';
    pCtx.beginPath();
    pCtx.moveTo(10, 6);
    pCtx.bezierCurveTo(10, 0, 0, 0, 0, 6);
    pCtx.bezierCurveTo(0, 12, 10, 20, 10, 20);
    pCtx.bezierCurveTo(10, 20, 20, 12, 20, 6);
    pCtx.bezierCurveTo(20, 0, 10, 0, 10, 6);
    pCtx.fill();
    
    return pCanvas;
  };

  const petalCanvas = createPetalCanvas();

  class Petal {
    constructor() {
      this.init();
    }

    init() {
      this.x = Math.random() * width;
      this.y = Math.random() * height - height;
      this.size = Math.random() * 10 + 5;
      this.speedX = Math.random() * 2 - 1 + 1; // 기본적으로 오른쪽으로 살짝 흐름
      this.speedY = Math.random() * 1 + 1;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.5 + 0.5;
    }

    update() {
      this.x += this.speedX + Math.sin(this.y / 50);
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      if (this.y > height) {
        this.init();
        this.y = -20;
      }
      if (this.x > width) this.x = -20;
      if (this.x < -20) this.x = width;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(petalCanvas, -this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  const createParticles = () => {
    particles = [];
    for (let i = 0; i < petalCount; i++) {
      particles.push(new Petal());
    }
  };

  const animate = () => {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    animationId = requestAnimationFrame(animate);
  };

  const toggle = () => {
    isRunning = !isRunning;
    if (isRunning) {
      btn.classList.remove('off');
      animate();
    } else {
      btn.classList.add('off');
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, width, height);
    }
  };

  window.addEventListener('resize', resize);
  btn.addEventListener('click', toggle);

  resize();
  createParticles();
  animate();
})();