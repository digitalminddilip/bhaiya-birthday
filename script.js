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

// Background Music System
const bgMusic=document.getElementById('bgMusic');
const musicToggleBtn=document.getElementById('musicToggleBtn');
const musicLabel=document.getElementById('musicLabel');
let isMusicPlaying=false;
let userHasInteracted=false;

function setMusicUI(playing){
  isMusicPlaying=playing;
  if(musicToggleBtn){
    if(playing){
      musicToggleBtn.classList.add('is-playing');
      if(musicLabel)musicLabel.textContent='Music: ON';
      musicToggleBtn.setAttribute('title','Pause Birthday Music');
    }else{
      musicToggleBtn.classList.remove('is-playing');
      if(musicLabel)musicLabel.textContent='Play Music';
      musicToggleBtn.setAttribute('title','Play Birthday Music');
    }
  }
}

function startMusic(){
  if(!bgMusic)return;
  bgMusic.volume=0.6;
  const promise=bgMusic.play();
  if(promise!==undefined){
    promise.then(()=>{
      setMusicUI(true);
      removeInteractionListeners();
    }).catch(err=>{
      console.log('Audio autoplay prevented by browser policy, waiting for first interaction:',err);
    });
  }
}

function pauseMusic(){
  if(!bgMusic)return;
  bgMusic.pause();
  setMusicUI(false);
}

function toggleMusic(){
  if(isMusicPlaying){
    pauseMusic();
  }else{
    startMusic();
  }
}

if(musicToggleBtn){
  musicToggleBtn.addEventListener('click',(e)=>{
    e.stopPropagation();
    userHasInteracted=true;
    toggleMusic();
  });
}

const interactionEvents=['click','touchstart','pointerdown','scroll','keydown'];
function onUserInteraction(){
  if(!isMusicPlaying){
    userHasInteracted=true;
    startMusic();
  }
}
function removeInteractionListeners(){
  interactionEvents.forEach(evt=>{
    window.removeEventListener(evt,onUserInteraction);
  });
}
interactionEvents.forEach(evt=>{
  window.addEventListener(evt,onUserInteraction,{passive:true});
});

// Attempt autoplay immediately on load
startMusic();
window.addEventListener('DOMContentLoaded',startMusic);
window.addEventListener('load',startMusic);

document.getElementById('revealBtn').addEventListener('click',()=>{
  burst();
  if(!isMusicPlaying)startMusic();
  const giftEl=document.getElementById('gift');
  if(giftEl){
    giftEl.scrollIntoView({behavior:'smooth'});
    setTimeout(()=>{
      openGift();
    },500);
  }else{
    document.getElementById('message').scrollIntoView({behavior:'smooth'});
  }
  document.querySelectorAll('.letter').forEach((el,i)=>{
    el.classList.remove('reveal');
    setTimeout(()=>el.classList.add('reveal'),i*180);
  });
});
document.getElementById('celebrateBtn').addEventListener('click',()=>{
  burst();
  setTimeout(()=>burst(),320);
  if(!isMusicPlaying)startMusic();
  const el=document.getElementById('wishResult');
  el.textContent='✨ Wish activated! May every good thing find its way to you, Bhaiya. ✨';
  el.classList.add('reveal');
});

// ==========================================
// Midnight Countdown Popup Gate & Surprise Unlock
// ==========================================
(function initMidnightCountdownGate(){
  // Default Target Date: 08 November 2026, 12:00 AM (Can be customized via the UI "Change Date" button)
  const DEFAULT_TARGET_ISO = '2026-11-08T00:00:00';

  function getTargetDate(){
    const stored = localStorage.getItem('bhaiya_target_date_v2');
    if (stored) {
      const parsed = new Date(stored);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    const defaultDate = new Date(DEFAULT_TARGET_ISO);
    const now = new Date();
    // If default target date has passed by more than 2 days and no saved date, roll over to next year
    if (now.getTime() - defaultDate.getTime() > 2 * 24 * 60 * 60 * 1000) {
      return new Date(now.getFullYear() + 1, defaultDate.getMonth(), defaultDate.getDate(), defaultDate.getHours(), defaultDate.getMinutes());
    }
    return defaultDate;
  }

  let currentTargetDate = getTargetDate();

  // Modal elements
  const modalOverlay = document.getElementById('countdownModalOverlay');
  const modalLockIcon = document.getElementById('modalLockIcon');
  const modalLockStatus = document.getElementById('modalLockStatus');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const mTargetDisplay = document.getElementById('mTargetDisplay');
  const mLiveTimeDisplay = document.getElementById('mLiveTimeDisplay');
  const btnTestUnlock = document.getElementById('btnTestUnlock');
  const btnModalEditDate = document.getElementById('btnModalEditDate');
  const modalPickerDrawer = document.getElementById('modalPickerDrawer');
  const mTargetDateInput = document.getElementById('mTargetDateInput');
  const btnModalSaveDate = document.getElementById('btnModalSaveDate');
  const btnModalResetDate = document.getElementById('btnModalResetDate');

  const mCdDays = document.getElementById('mCdDays');
  const mCdHours = document.getElementById('mCdHours');
  const mCdMins = document.getElementById('mCdMins');
  const mCdSecs = document.getElementById('mCdSecs');

  // Page countdown elements
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  const liveDateText = document.getElementById('liveDateText');
  const liveTimeText = document.getElementById('liveTimeText');
  const targetDateDisplay = document.getElementById('targetDateDisplay');
  const countdownStatusText = document.getElementById('countdownStatusText');
  const celebrationBanner = document.getElementById('celebrationBanner');
  const btnDateToggle = document.getElementById('btnDateToggle');
  const countdownPickerDrawer = document.getElementById('countdownPickerDrawer');
  const targetDateInput = document.getElementById('targetDateInput');
  const btnSaveTargetDate = document.getElementById('btnSaveTargetDate');
  const btnResetTargetDate = document.getElementById('btnResetTargetDate');
  const cdConfettiBtn = document.getElementById('cdConfettiBtn');

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

  function updateTargetDisplays(){
    const formatted = formatDateTimeNice(currentTargetDate);
    if (mTargetDisplay) mTargetDisplay.textContent = formatted;
    if (targetDateDisplay) targetDateDisplay.textContent = formatted;

    const pad = (n) => String(n).padStart(2, '0');
    const localISO = `${currentTargetDate.getFullYear()}-${pad(currentTargetDate.getMonth() + 1)}-${pad(currentTargetDate.getDate())}T${pad(currentTargetDate.getHours())}:${pad(currentTargetDate.getMinutes())}`;
    if (mTargetDateInput) mTargetDateInput.value = localISO;
    if (targetDateInput) targetDateInput.value = localISO;
  }

  let isUnlocked = false;

  function triggerUnlockAndSurprise(){
    if (isUnlocked) return;
    isUnlocked = true;

    // 1. Update Modal Visuals to Celebration
    if (modalLockIcon) modalLockIcon.textContent = '🎉';
    if (modalLockStatus) modalLockStatus.textContent = "IT'S CELEBRATION TIME!";
    if (modalSubtitle) {
      modalSubtitle.innerHTML = '<strong style="color:#f7ce7a;font-size:16px;">Happy Birthday, Harishchandra Bhaiya! ❤️</strong><br>Unlocking your surprise gift right now...';
    }

    if (typeof playGiftChime === 'function') playGiftChime();
    if (typeof burst === 'function') {
      burst();
      setTimeout(() => burst(), 300);
    }

    // 2. Animate and remove modal
    setTimeout(() => {
      if (modalOverlay) {
        modalOverlay.classList.add('unlocking');
      }
      document.body.classList.remove('modal-locked');

      if (typeof startMusic === 'function') startMusic();

      setTimeout(() => {
        if (modalOverlay) modalOverlay.style.display = 'none';

        // 3. Scroll to surprise gift section and open gift automatically!
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

  function updateTick(){
    const now = new Date();
    const liveTimeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const liveDateStr = now.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    if (mLiveTimeDisplay) mLiveTimeDisplay.textContent = liveTimeStr;
    if (liveTimeText) liveTimeText.textContent = liveTimeStr;
    if (liveDateText) liveDateText.textContent = liveDateStr;

    const diff = currentTargetDate.getTime() - now.getTime();

    if (diff <= 0) {
      // Reached 00:00:00:00!
      const zeroes = '00';
      if (mCdDays) mCdDays.textContent = zeroes;
      if (mCdHours) mCdHours.textContent = zeroes;
      if (mCdMins) mCdMins.textContent = zeroes;
      if (mCdSecs) mCdSecs.textContent = zeroes;

      if (cdDays) cdDays.textContent = zeroes;
      if (cdHours) cdHours.textContent = zeroes;
      if (cdMins) cdMins.textContent = zeroes;
      if (cdSecs) cdSecs.textContent = zeroes;

      if (celebrationBanner) celebrationBanner.style.display = 'block';
      if (countdownStatusText) countdownStatusText.textContent = "🎉 IT'S CELEBRATION TIME!";

      if (!isUnlocked) {
        triggerUnlockAndSurprise();
      }
    } else {
      // Still locked in countdown popup
      if (!isUnlocked && modalOverlay && modalOverlay.style.display !== 'none') {
        document.body.classList.add('modal-locked');
      }

      if (celebrationBanner) celebrationBanner.style.display = 'none';
      if (countdownStatusText) countdownStatusText.textContent = 'LIVE COUNTDOWN';

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const pad = (n) => String(n).padStart(2, '0');
      const dStr = pad(days), hStr = pad(hours), mStr = pad(minutes), sStr = pad(seconds);

      if (mCdDays) mCdDays.textContent = dStr;
      if (mCdHours) mCdHours.textContent = hStr;
      if (mCdMins) mCdMins.textContent = mStr;
      if (mCdSecs) mCdSecs.textContent = sStr;

      if (cdDays) cdDays.textContent = dStr;
      if (cdHours) cdHours.textContent = hStr;
      if (cdMins) cdMins.textContent = mStr;
      if (cdSecs) cdSecs.textContent = sStr;
    }
  }

  // Interactive controls for modal
  if (btnTestUnlock) {
    btnTestUnlock.addEventListener('click', () => {
      triggerUnlockAndSurprise();
    });
  }

  if (btnModalEditDate) {
    btnModalEditDate.addEventListener('click', () => {
      if (modalPickerDrawer) modalPickerDrawer.classList.toggle('open');
    });
  }

  if (btnModalSaveDate) {
    btnModalSaveDate.addEventListener('click', () => {
      if (!mTargetDateInput || !mTargetDateInput.value) return;
      const selected = new Date(mTargetDateInput.value);
      if (!isNaN(selected.getTime())) {
        currentTargetDate = selected;
        localStorage.setItem('bhaiya_target_date_v2', selected.toISOString());
        updateTargetDisplays();
        isUnlocked = false;
        if (modalOverlay) {
          modalOverlay.style.display = 'flex';
          modalOverlay.classList.remove('unlocking');
          document.body.classList.add('modal-locked');
        }
        if (modalPickerDrawer) modalPickerDrawer.classList.remove('open');
        updateTick();
      }
    });
  }

  if (btnModalResetDate) {
    btnModalResetDate.addEventListener('click', () => {
      localStorage.removeItem('bhaiya_target_date_v2');
      currentTargetDate = new Date(DEFAULT_TARGET_ISO);
      updateTargetDisplays();
      isUnlocked = false;
      if (modalOverlay) {
        modalOverlay.style.display = 'flex';
        modalOverlay.classList.remove('unlocking');
        document.body.classList.add('modal-locked');
      }
      if (modalPickerDrawer) modalPickerDrawer.classList.remove('open');
      updateTick();
    });
  }

  // Page countdown controls (if modified on page)
  if (btnDateToggle) {
    btnDateToggle.addEventListener('click', () => {
      if (countdownPickerDrawer) countdownPickerDrawer.classList.toggle('open');
    });
  }

  if (btnSaveTargetDate) {
    btnSaveTargetDate.addEventListener('click', () => {
      if (!targetDateInput || !targetDateInput.value) return;
      const selected = new Date(targetDateInput.value);
      if (!isNaN(selected.getTime())) {
        currentTargetDate = selected;
        localStorage.setItem('bhaiya_target_date_v2', selected.toISOString());
        updateTargetDisplays();
        isUnlocked = false;
        updateTick();
        if (countdownPickerDrawer) countdownPickerDrawer.classList.remove('open');
      }
    });
  }

  if (btnResetTargetDate) {
    btnResetTargetDate.addEventListener('click', () => {
      localStorage.removeItem('bhaiya_target_date_v2');
      currentTargetDate = new Date(DEFAULT_TARGET_ISO);
      updateTargetDisplays();
      isUnlocked = false;
      updateTick();
      if (countdownPickerDrawer) countdownPickerDrawer.classList.remove('open');
    });
  }

  if (cdConfettiBtn) {
    cdConfettiBtn.addEventListener('click', () => {
      if (typeof burst === 'function') {
        burst();
        setTimeout(() => burst(), 300);
      }
    });
  }

  updateTargetDisplays();
  updateTick();
  setInterval(updateTick, 1000);
})();
