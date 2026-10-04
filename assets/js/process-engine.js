(function(){
  'use strict';
  const CNJ='https://comunicaapi.pje.jus.br/api/v1/comunicacao';
  const PROFILE_KEY='fluxolegal.profile';
  const CACHE_KEY='fluxolegal.processes';
  const CACHE_META='fluxolegal.processes.meta';
  const clean=t=>String(t||'').replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\{[^{}]*\}/g,' ').replace(/&nbsp;/gi,' ').replace(/\s+/g,' ').trim();
  const norm=t=>clean(t).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
  const rules=[
    [/sentenc|julgamento do merito|julgo proced|julgo improced/,'Saiu a decisão principal (sentença)','O juiz julgou o processo.','A decisão principal foi publicada.','Seu advogado avaliará eventual recurso e os próximos prazos.'],
    [/conclus/,'Processo com o juiz, para decidir','O processo foi enviado ao juiz.','Agora o processo aguarda análise judicial.','A próxima atualização pode ser despacho, decisão ou sentença.'],
    [/\bcitac|\bcitad|mandado de citac/,'Citação realizada','Uma parte foi oficialmente chamada ao processo.','Pode ter começado um prazo processual.','Seu advogado acompanhará o prazo e a resposta necessária.'],
    [/intimac|intimad/,'Intimação publicada','Foi publicada uma intimação.','A comunicação pode exigir providência dentro de prazo.','Seu advogado verificará o conteúdo e o prazo.'],
    [/audiencia/,'Movimentação de audiência','Houve atualização relacionada a audiência.','A audiência pode ter sido marcada, alterada ou realizada.','Confirme os detalhes com seu advogado.'],
    [/penhora|bloqueio|bacenjud|sisbajud|arresto/,'Bloqueio ou penhora','Houve movimentação relacionada a bens ou valores.','Pode existir medida de constrição patrimonial.','Seu advogado deve avaliar a medida e eventual providência.'],
    [/agravo|apelac|recurso|embargos|contrarraz/,'Movimentação de recurso','Foi registrada movimentação recursal.','Uma decisão pode estar sendo reavaliada.','Acompanhe o julgamento e os prazos com seu advogado.'],
    [/pericia|perito|laudo/,'Movimentação de perícia','Houve atualização relacionada a perícia.','Pode ser necessário exame técnico ou apresentação de documentos.','Seu advogado confirmará eventual providência.'],
    [/juntada|peticao|petic|manifestac/,'Documento anexado','Foi juntada uma petição ou documento.','O documento passa a integrar o processo.','Aguarde a análise ou nova manifestação.'],
    [/despacho/,'Despacho publicado','O juiz determinou um passo do processo.','Pode existir providência a ser cumprida.','Seu advogado verificará o teor do despacho.'],
    [/decis/,'Decisão publicada','Foi publicada uma decisão.','Uma questão do processo foi apreciada.','Seu advogado avaliará os efeitos e os próximos passos.'],
    [/arquiv|baixa definitiva|transito em julgado|transitou/,'Processo encerrado ou arquivado','Foi registrada movimentação de encerramento.','O processo pode ter chegado ao fim nessa fase.','Seu advogado confirmará se ainda existe alguma providência.']
  ];
  function explain(tipo,texto){const base=norm((tipo||'')+' '+(texto||''));for(const [re,t,a,s,p] of rules)if(re.test(base))return{titulo:t,aconteceu:a,significa:s,proximo:p};return{titulo:'Nova movimentação no processo',aconteceu:'Houve uma atualização processual.',significa:'É um novo andamento registrado na fonte consultada.',proximo:'Acompanhe os próximos passos pelo painel.'};}
  function getProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY))||null}catch{return null}}
  function saveProfile(p){const profile={name:String(p.name||'').trim(),cpf:String(p.cpf||'').trim(),email:String(p.email||'').trim(),oab:String(p.oab||'').replace(/\D/g,''),uf:String(p.uf||'').toUpperCase()};localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));return profile}
  function getCache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY))||[]}catch{return[]}}
  async function searchByOab(oab,uf){const digits=String(oab||'').replace(/\D/g,'');if(!digits||!/^[A-Z]{2}$/.test(uf||''))throw new Error('OAB/UF inválida.');let items=[];for(let page=1;page<=3;page++){const url=CNJ+'?numeroOab='+encodeURIComponent(digits)+'&ufOab='+encodeURIComponent(uf)+'&itensPorPagina=100&pagina='+page;const r=await fetch(url,{headers:{accept:'application/json'}});if(!r.ok)throw new Error('CNJ respondeu HTTP '+r.status);const d=await r.json();const its=d.items||[];items=items.concat(its);if(its.length<100)break}const map={};for(const it of items){const num=it.numeroprocessocommascara||it.numero_processo||'?';if(!map[num])map[num]={numero:num,tribunal:it.siglaTribunal||'—',classe:it.nomeClasse||it.tipoComunicacao||'',movs:[]};map[num].movs.push({data:it.data_disponibilizacao||'',tipo:it.tipoComunicacao||'Comunicação',orgao:it.nomeOrgao||'',texto:clean(it.texto).slice(0,600)})}const list=Object.values(map);list.forEach(p=>p.movs.sort((a,b)=>(b.data||'').localeCompare(a.data||'')));list.sort((a,b)=>(b.movs[0]?.data||'').localeCompare(a.movs[0]?.data||''));localStorage.setItem(CACHE_KEY,JSON.stringify(list));localStorage.setItem(CACHE_META,JSON.stringify({oab:digits,uf,updatedAt:new Date().toISOString()}));return list}
  async function sync(){const p=getProfile();if(!p||!p.oab||!p.uf)throw new Error('Cadastre e valide sua OAB antes de sincronizar.');return searchByOab(p.oab,p.uf)}
  function fmtDate(iso){if(!iso)return'—';const d=new Date(iso+'T12:00:00');return Number.isNaN(d.getTime())?iso:d.toLocaleDateString('pt-BR')}
  window.FluxoLegalProcess={getProfile,saveProfile,getCache,searchByOab,sync,fmtDate,explain};
})();
