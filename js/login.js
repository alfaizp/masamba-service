/* Halaman login: mode LOG IN / SIGN UP / RECOVER, lalu masuk ke halaman sesuai peran. */
(function(){
 var $=function(s){return document.querySelector(s)};

 var modes={login:['LOG IN','CONFIRM','current-password'],signup:['SIGN UP','REGISTER','new-password'],recover:['RECOVER','SEND LINK','']};
 var order=['login','signup','recover'],mode='login';
 var items=[].slice.call(document.querySelectorAll('.mi')),form=$('#form'),msg=$('#msg');
 function setMode(m){
  mode=m;msg.textContent='';
  $('#title').textContent=modes[m][0];$('#btnLbl').textContent=modes[m][1];
  $('#pass').autocomplete=modes[m][2]||'off';
  items.forEach(function(it){var on=it.dataset.m===m;it.classList.toggle('on',on);it.setAttribute('aria-selected',on)});
  [].forEach.call(document.querySelectorAll('[data-for]'),function(n){
   var show=n.dataset.for.split(' ').indexOf(m)>-1;n.hidden=!show;
   [].forEach.call(n.querySelectorAll('input'),function(i){i.disabled=!show});
  });
 }
 items.forEach(function(it){it.addEventListener('click',function(){setMode(it.dataset.m)})});
 $('#forgot').addEventListener('click',function(){setMode('recover')});
 $('#eye').addEventListener('click',function(){
  var p=$('#pass'),show=p.type==='password';p.type=show?'text':'password';this.textContent=show?'HIDE':'SHOW';});

 form.addEventListener('submit',function(e){
  e.preventDefault();
  if(!form.reportValidity())return;
  var d=new FormData(form);
  // TODO: ganti dengan fetch() ke backend (cek username & password)
  if(mode==='recover'){msg.textContent='RECOVERY LINK SENT';return}
  var role=String(d.get('role'));
  localStorage.setItem('servis.session',JSON.stringify({role:role,name:String(d.get('user')).trim()}));
  msg.textContent='ACCESS GRANTED · LOADING…';
  setTimeout(function(){location.href=role+'.html'},500);
 });

 addEventListener('keydown',function(e){
  var t=e.target.tagName;
  if(e.key==='Escape'){setMode('login');if(document.activeElement)document.activeElement.blur();return}
  if(/INPUT|TEXTAREA/.test(t))return;
  var k=order.indexOf(mode);
  if(e.key==='ArrowDown'){e.preventDefault();setMode(order[(k+1)%3])}
  if(e.key==='ArrowUp'){e.preventDefault();setMode(order[(k+2)%3])}
 });
 setMode('login');
})();
