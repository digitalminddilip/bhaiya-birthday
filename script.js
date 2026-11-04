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
}

function closeGift(){
  if(!isGiftOpen)return;
  isGiftOpen=false;
  const stage=document.getElementById('giftStage');
  const hint=document.getElementById('giftHint');
  if(stage)stage.classList.remove('gift-open');
  if(hint)hint.innerHTML='<span class="hint-sparkle">✨</span> Tap the gift box to open! <span class="hint-sparkle">✨</span>';
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
    }).catch(err=>{
      console.log('Audio autoplay prevented:',err);
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

function handleFirstInteraction(){
  if(!userHasInteracted&&!isMusicPlaying){
    userHasInteracted=true;
    startMusic();
  }
}
window.addEventListener('click',handleFirstInteraction,{once:true});
window.addEventListener('touchstart',handleFirstInteraction,{once:true});

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
