
function formatNumberBR(value){return Math.floor(value).toLocaleString('pt-BR')}
function animateCounter(el){
  const target=Number(el.dataset.target||0),suffix=el.dataset.suffix||'',duration=1800,start=performance.now();
  function step(now){
    const p=Math.min((now-start)/duration,1),eased=1-Math.pow(1-p,3);
    el.textContent=formatNumberBR(target*eased)+suffix;
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function startCounters(){
  const counters=document.querySelectorAll('.counter');
  const observer=new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{if(entry.isIntersecting){animateCounter(entry.target);obs.unobserve(entry.target)}})
  },{threshold:.45});
  counters.forEach(c=>observer.observe(c));
}
function submitContact(event){
  event.preventDefault();
  alert('Mensagem enviada com sucesso. Em breve entraremos em contato.');
  event.target.reset();
}
function startOnboarding(event){
  event.preventDefault();
  window.location.href='onboarding.html';
}
function simulateOnboarding(){
  const el=document.getElementById('syncText');
  if(!el)return;
  const messages=['Validando dados profissionais...','Localizando processos vinculados...','Organizando movimentações...','Preparando seu painel...'];
  let i=0;
  const timer=setInterval(()=>{i++;if(i<messages.length)el.textContent=messages[i]},700);
  setTimeout(()=>{clearInterval(timer);window.location.href='dashboard.html'},3200);
}
document.addEventListener('DOMContentLoaded',()=>{
  startCounters();
  simulateOnboarding();
});

function playLoginVideo(event){
  event.preventDefault();
  const overlay=document.getElementById('loginVideoOverlay');
  const video=document.getElementById('loginVideo');
  if(!overlay){window.location.href='dashboard.html';return;}
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden','false');
  if(video){
    video.currentTime=0;
    const promise=video.play();
    if(promise&&promise.catch)promise.catch(()=>{});
  }
  setTimeout(()=>{window.location.href='dashboard.html'},3200);
}
