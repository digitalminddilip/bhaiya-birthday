const canvas=document.getElementById('confetti');const ctx=canvas.getContext('2d');let pieces=[],running=false;
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}addEventListener('resize',resize);resize();
function burst(){pieces=Array.from({length:190},()=>({x:Math.random()*innerWidth,y:-20-Math.random()*innerHeight*.6,vx:(Math.random()-.5)*5,vy:2+Math.random()*5,size:3+Math.random()*5,rot:Math.random()*6,spin:(Math.random()-.5)*.2,color:['#f7ce7a','#ff8bc7','#a98bff','#ffffff','#9cffc1'][Math.floor(Math.random()*5)]}));if(!running){running=true;animate()}}
function animate(){ctx.clearRect(0,0,innerWidth,innerHeight);pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.rot+=p.spin;p.vy+=.025;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*1.6);ctx.restore()});pieces=pieces.filter(p=>p.y<innerHeight+30);if(pieces.length)requestAnimationFrame(animate);else{running=false;ctx.clearRect(0,0,innerWidth,innerHeight)}}
// Synthesize a pleasant celebration chime using Web Audio API
function playGiftChime(){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    if(!AudioCtx)return;
    const actx=new AudioCtx();
    const notes=[523.25,659.25,783.99,1046.50,1318.51];
    notes.forEach((freq,idx)=>{
      const osc=actx.createOscillator();
      const gain=actx.createGain();
      osc.type='triangle';
      osc.frequency.setValueAtTime(freq,actx.currentTime+idx*.07);
      gain.gain.setValueAtTime(.001,actx.currentTime+idx*.07);
      gain.gain.exponentialRampToValueAtTime(.22,actx.currentTime+idx*.07+.03);
      gain.gain.exponentialRampToValueAtTime(.001,actx.currentTime+idx*.07+.4);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(actx.currentTime+idx*.07);
      osc.stop(actx.currentTime+idx*.07+.45);
    });
  }catch(e){}
}

const giftMemories=[
  {
    img:'assets/bhaiya-special.png',
    title:"World's Best Brother 🌟",
    desc:"हर मुश्किल में सहारा, हर खुशी की वजह — आप जैसा भाई भगवान सबको दे! जन्मदिन की ढेर सारी शुभकामनाएँ भैया ❤️"
  }
];

let currentGiftIndex=0;
let isGiftOpen=false;

function openGift(){
  if(isGiftOpen)return;
  isGiftOpen=true;
  if(!isMusicPlaying)startMusic();
  const stage=document.getElementById('giftStage');
  const hint=document.getElementById('giftHint');
  if(stage)stage.classList.add('gift-open');
  if(hint)hint.innerHTML='<span class="hint-sparkle">🎉</span> Gift Unwrapped! Happy Birthday! <span class="hint-sparkle">🎉</span>';
  playGiftChime();
  burst();
  setTimeout(()=>burst(),300);
  setTimeout(()=>{
    const card=document.getElementById('giftCardWrap');
    if(card)card.scrollIntoView({behavior:'smooth',block:'center'});
  },200);
}

function closeGift(){
  if(!isGiftOpen)return;
  isGiftOpen=false;
  const stage=document.getElementById('giftStage');
  const hint=document.getElementById('giftHint');
  const giftFrameEl=document.querySelector('.gift-img-frame');
  if(giftFrameEl)giftFrameEl.classList.remove('photo-zoomed');
  if(stage)stage.classList.remove('gift-open');
  if(hint)hint.innerHTML='<span class="hint-sparkle">✨</span> Tap the gift box to open! <span class="hint-sparkle">✨</span>';
  setTimeout(()=>{
    if(stage)stage.scrollIntoView({behavior:'smooth',block:'center'});
  },250);
}

function nextGiftMemory(e){
  if(e)e.stopPropagation();
  currentGiftIndex=(currentGiftIndex+1)%giftMemories.length;
  const memory=giftMemories[currentGiftIndex];
  const imgEl=document.getElementById('giftCardImg');
  const titleEl=document.getElementById('giftCardTitle');
  const descEl=document.getElementById('giftCardDesc');
  const card=document.querySelector('.gift-card');
  if(card)card.classList.add('card-flip');
  setTimeout(()=>{
    if(imgEl)imgEl.src=memory.img;
    if(titleEl)titleEl.textContent=memory.title;
    if(descEl)descEl.textContent=memory.desc;
    if(card)card.classList.remove('card-flip');
    burst();
  },200);
}

const giftBoxEl=document.getElementById('giftBox');
if(giftBoxEl){
  giftBoxEl.addEventListener('click',()=>openGift());
  giftBoxEl.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'||e.key===' ') {
      e.preventDefault();
      openGift();
    }
  });
}

const giftHintEl=document.getElementById('giftHint');
if(giftHintEl){
  giftHintEl.addEventListener('click',()=>{
    if(isGiftOpen)closeGift();
    else openGift();
  });
}

const nextBtn=document.getElementById('giftNextBtn');
if(nextBtn)nextBtn.addEventListener('click',nextGiftMemory);

const rewrapBtn=document.getElementById('giftRewrapBtn');
if(rewrapBtn)rewrapBtn.addEventListener('click',(e)=>{
  e.stopPropagation();
  closeGift();
});

const giftFrameEl=document.querySelector('.gift-img-frame');
if(giftFrameEl){
  giftFrameEl.addEventListener('click',(e)=>{
    e.stopPropagation();
    giftFrameEl.classList.toggle('photo-zoomed');
  });
}

// ==========================================
// Birthday Rap Music & Audio Player System (Unified)
// ==========================================
const rapAudio = document.getElementById('rapAudio');
const bgMusic = document.getElementById('bgMusic');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicLabel = document.getElementById('musicLabel');

// Rap Player UI elements in Make a Wish section
const rapPlayerCard = document.getElementById('rapPlayerCard');
const rapPlayBtn = document.getElementById('rapPlayBtn');
const rapPlayIcon = document.getElementById('rapPlayIcon');
const rapPlayText = document.getElementById('rapPlayText');
const rapProgressTrack = document.getElementById('rapProgressTrack');
const rapProgressFill = document.getElementById('rapProgressFill');
const rapProgressThumb = document.getElementById('rapProgressThumb');
const rapCurrentTime = document.getElementById('rapCurrentTime');
const rapDuration = document.getElementById('rapDuration');
const rapVolBtn = document.getElementById('rapVolBtn');
const rapVolRange = document.getElementById('rapVolRange');
const rapLyricsToggle = document.getElementById('rapLyricsToggle');
const rapLyricsDrawer = document.getElementById('rapLyricsDrawer');

let isMusicPlaying = false;
let userHasInteracted = false;

function formatAudioTime(secs){
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function syncPlayerUI(playing){
  isMusicPlaying = playing;

  if (rapPlayerCard) {
    if (playing) rapPlayerCard.classList.add('is-playing');
    else rapPlayerCard.classList.remove('is-playing');
  }
  if (rapPlayIcon) rapPlayIcon.textContent = playing ? '⏸' : '▶';
  if (rapPlayText) rapPlayText.textContent = playing ? 'Pause Rap' : 'Play Rap Song';

  // Synchronize floating music controller
  if (musicToggleBtn) {
    if (playing) {
      musicToggleBtn.classList.add('is-playing');
      if (musicLabel) musicLabel.textContent = 'Rap: ON';
      musicToggleBtn.setAttribute('title', 'Pause Birthday Rap Song');
    } else {
      musicToggleBtn.classList.remove('is-playing');
      if (musicLabel) musicLabel.textContent = 'Play Rap Song';
      musicToggleBtn.setAttribute('title', 'Play Birthday Rap Song');
    }
  }
}

function startMusic(){
  playRapSong();
}

function pauseMusic(){
  pauseRapSong();
}

function playRapSong(){
  if (!rapAudio) return;
  // If tone audio was running, stop it so vocal rap is clean
  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
  }

  const promise = rapAudio.play();
  if (promise !== undefined) {
    promise.then(() => {
      syncPlayerUI(true);
      removeInteractionListeners();
    }).catch(err => {
      console.log('Audio autoplay prevented by browser policy:', err);
    });
  }
}

function pauseRapSong(){
  if (!rapAudio) return;
  rapAudio.pause();
  syncPlayerUI(false);
}

function toggleRapSong(){
  if (rapAudio && !rapAudio.paused) {
    pauseRapSong();
  } else {
    playRapSong();
  }
}

function toggleMusic(){
  toggleRapSong();
}

// Attach event listeners for audio player
if (rapPlayBtn) {
  rapPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userHasInteracted = true;
    toggleRapSong();
  });
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userHasInteracted = true;
    toggleRapSong();
  });
}

if (rapAudio) {
  rapAudio.addEventListener('loadedmetadata', () => {
    if (rapDuration) rapDuration.textContent = formatAudioTime(rapAudio.duration);
  });
  rapAudio.addEventListener('timeupdate', () => {
    if (!rapAudio.duration) return;
    const progress = (rapAudio.currentTime / rapAudio.duration) * 100;
    if (rapProgressFill) rapProgressFill.style.width = progress + '%';
    if (rapProgressThumb) rapProgressThumb.style.left = progress + '%';
    if (rapCurrentTime) rapCurrentTime.textContent = formatAudioTime(rapAudio.currentTime);
  });
  rapAudio.addEventListener('play', () => syncPlayerUI(true));
  rapAudio.addEventListener('pause', () => syncPlayerUI(false));
  rapAudio.addEventListener('ended', () => {
    syncPlayerUI(false);
    if (rapProgressFill) rapProgressFill.style.width = '0%';
    if (rapProgressThumb) rapProgressThumb.style.left = '0%';
  });
}

if (rapProgressTrack) {
  rapProgressTrack.addEventListener('click', (e) => {
    if (!rapAudio || !rapAudio.duration) return;
    const rect = rapProgressTrack.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    rapAudio.currentTime = pos * rapAudio.duration;
    if (rapAudio.paused) playRapSong();
  });
}

if (rapVolRange && rapAudio) {
  rapVolRange.addEventListener('input', (e) => {
    rapAudio.volume = parseFloat(e.target.value);
    if (rapVolBtn) {
      rapVolBtn.textContent = rapAudio.volume === 0 ? '🔇' : (rapAudio.volume < 0.5 ? '🔉' : '🔊');
    }
  });
}

if (rapVolBtn && rapAudio) {
  rapVolBtn.addEventListener('click', () => {
    if (rapAudio.volume > 0) {
      rapAudio.dataset.prevVol = rapAudio.volume;
      rapAudio.volume = 0;
      if (rapVolRange) rapVolRange.value = 0;
      rapVolBtn.textContent = '🔇';
    } else {
      const prev = parseFloat(rapAudio.dataset.prevVol || '0.9');
      rapAudio.volume = prev;
      if (rapVolRange) rapVolRange.value = prev;
      rapVolBtn.textContent = '🔊';
    }
  });
}

if (rapLyricsToggle && rapLyricsDrawer) {
  rapLyricsToggle.addEventListener('click', () => {
    rapLyricsDrawer.classList.toggle('open');
    if (rapLyricsDrawer.classList.contains('open')) {
      rapLyricsToggle.textContent = '📜 Hide Rap Lyrics';
    } else {
      rapLyricsToggle.textContent = '📜 View Rap Lyrics';
    }
  });
}

const interactionEvents = ['click','touchstart','pointerdown','keydown'];
function onUserInteraction(){
  if (!isMusicPlaying && userHasInteracted) {
    startMusic();
  }
}
function removeInteractionListeners(){
  interactionEvents.forEach(evt => {
    window.removeEventListener(evt, onUserInteraction);
  });
}
interactionEvents.forEach(evt => {
  window.addEventListener(evt, onUserInteraction, { passive: true });
});

document.getElementById('revealBtn').addEventListener('click', () => {
  burst();
  userHasInteracted = true;
  if (!isMusicPlaying) startMusic();
  const giftEl = document.getElementById('gift');
  if (giftEl) {
    giftEl.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      openGift();
    }, 500);
  } else {
    document.getElementById('message').scrollIntoView({ behavior: 'smooth' });
  }
  document.querySelectorAll('.letter').forEach((el, i) => {
    el.classList.remove('reveal');
    setTimeout(() => el.classList.add('reveal'), i * 180);
  });
});

// Make a Wish Button click -> triggers confetti, wish message, and plays the Birthday Rap Song!
document.getElementById('celebrateBtn').addEventListener('click', () => {
  burst();
  setTimeout(() => burst(), 320);
  userHasInteracted = true;

  // Play the Hindi Rap Voice Song!
  playRapSong();

  // Open the lyrics drawer
  if (rapLyricsDrawer) {
    rapLyricsDrawer.classList.add('open');
    if (rapLyricsToggle) rapLyricsToggle.textContent = '📜 Hide Rap Lyrics';
  }

  const el = document.getElementById('wishResult');
  if (el) {
    el.textContent = '✨ Wish activated! Happy Birthday Harishchandra Bhaiya! Playing your special rap song! ✨';
    el.classList.add('reveal');
  }

  // Highlight and scroll to the Rap Player
  if (rapPlayerCard) {
    rapPlayerCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

// ==========================================
// Midnight Countdown Popup Gate & Surprise Unlock
// ==========================================
(function initMidnightCountdownGate(){
  // Target Date: 08 November 2026, 12:00 AM (Midnight)
  const DEFAULT_TARGET_ISO = '2026-11-08T00:00:00';

  function getTargetDate(){
    const stored = localStorage.getItem('bhaiya_target_date_v2');
    if (stored) {
      const parsed = new Date(stored);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    const defaultDate = new Date(DEFAULT_TARGET_ISO);
    const now = new Date();
    if (now.getTime() - defaultDate.getTime() > 2 * 24 * 60 * 60 * 1000) {
      return new Date(now.getFullYear() + 1, defaultDate.getMonth(), defaultDate.getDate(), defaultDate.getHours(), defaultDate.getMinutes());
    }
    return defaultDate;
  }

  let currentTargetDate = getTargetDate();

  const modalOverlay = document.getElementById('countdownModalOverlay');
  const modalLockIcon = document.getElementById('modalLockIcon');
  const modalLockStatus = document.getElementById('modalLockStatus');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const mTargetDisplay = document.getElementById('mTargetDisplay');
  const mLiveTimeDisplay = document.getElementById('mLiveTimeDisplay');

  const mCdDays = document.getElementById('mCdDays');
  const mCdHours = document.getElementById('mCdHours');
  const mCdMins = document.getElementById('mCdMins');
  const mCdSecs = document.getElementById('mCdSecs');

  function formatDateTimeNice(date){
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  if (mTargetDisplay) {
    mTargetDisplay.textContent = formatDateTimeNice(currentTargetDate);
  }

  let isUnlocked = false;

  function triggerUnlockAndSurprise(){
    if (isUnlocked) return;
    isUnlocked = true;

    if (modalLockIcon) modalLockIcon.textContent = '🎉';
    if (modalLockStatus) modalLockStatus.textContent = "IT'S CELEBRATION TIME!";
    if (modalSubtitle) {
      modalSubtitle.innerHTML = '<strong style="color:#f7ce7a;font-size:16px;">Happy Birthday, Harishchandra Bhaiya! ❤️</strong><br>Unlocking your surprise right now...';
    }

    if (typeof playGiftChime === 'function') playGiftChime();
    if (typeof burst === 'function') {
      burst();
      setTimeout(() => burst(), 300);
    }

    setTimeout(() => {
      if (modalOverlay) {
        modalOverlay.classList.add('unlocking');
      }
      document.body.classList.remove('modal-locked');

      playRapSong();

      setTimeout(() => {
        if (modalOverlay) modalOverlay.style.display = 'none';

        const giftSection = document.getElementById('gift');
        if (giftSection) {
          giftSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
          if (typeof openGift === 'function') openGift();
        }, 550);
      }, 750);
    }, 1200);
  }

  // Secret bypass for testing: double-click lock icon unlocks immediately
  if (modalLockIcon) {
    modalLockIcon.style.cursor = 'pointer';
    modalLockIcon.addEventListener('dblclick', () => {
      triggerUnlockAndSurprise();
    });
  }

  function updateTick(){
    const now = new Date();
    const liveTimeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    if (mLiveTimeDisplay) mLiveTimeDisplay.textContent = liveTimeStr;

    const diff = currentTargetDate.getTime() - now.getTime();

    if (diff <= 0) {
      const zeroes = '00';
      if (mCdDays) mCdDays.textContent = zeroes;
      if (mCdHours) mCdHours.textContent = zeroes;
      if (mCdMins) mCdMins.textContent = zeroes;
      if (mCdSecs) mCdSecs.textContent = zeroes;

      if (!isUnlocked) {
        triggerUnlockAndSurprise();
      }
    } else {
      if (!isUnlocked && modalOverlay && modalOverlay.style.display !== 'none') {
        document.body.classList.add('modal-locked');
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const pad = (n) => String(n).padStart(2, '0');
      if (mCdDays) mCdDays.textContent = pad(days);
      if (mCdHours) mCdHours.textContent = pad(hours);
      if (mCdMins) mCdMins.textContent = pad(minutes);
      if (mCdSecs) mCdSecs.textContent = pad(seconds);
    }
  }

  updateTick();
  setInterval(updateTick, 1000);
})();
