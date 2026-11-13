/* Controller + View: menu halaman, tabel/kartu, dan popup chat. Peran dibaca dari <body data-role>. */
(function(){
 var $=function(s){return document.querySelector(s)};
 var e=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
 var rp=function(n){return n?'Rp'+n.toLocaleString('id-ID'):'—'};
 var SN=['Menunggu','Diproses','Selesai'];
 var T=DATA.T,J=DATA.J;
 try{var sv=JSON.parse(localStorage.getItem('servis.jobs'));if(sv&&sv.length===J.length)J=sv}catch(x){}
 var ses=null;try{ses=JSON.parse(localStorage.getItem('servis.session'))}catch(x){}
 var role=document.body.dataset.role;
 if(!ses||ses.role!==role){location.replace('index.html');return}
 var me=J.some(function(j){return j.p===ses.name})?ses.name:'Raka Pratama',page='beranda',q='';
 var PG={teknisi:[['beranda','Beranda'],['riwayat','Riwayat Pembeli'],['daftar','Daftar Teknisi']],pembeli:[['beranda','Beranda'],['chat','Chat']]};

 function rows(){var k=q.toLowerCase();
  return J.filter(function(j){return (j.p+j.d+j.k+j.t).toLowerCase().indexOf(k)>-1}).map(function(j){
   return '<tr><td>'+e(j.tgl)+'</td><td><b>'+e(j.p)+'</b></td><td>'+e(j.d)+'<br>'+e(j.k)+'</td><td>'+e(j.t)+'</td><td>'+rp(j.b)+'</td><td><span class="chp s'+j.s+'">'+SN[j.s]+'</span></td></tr>'}).join('')||'<tr><td colspan="6">Tidak ada data.</td></tr>'}
 var V={
  teknisi:{
   beranda:function(){
    var c=[0,1,2].map(function(s){return J.filter(function(j){return j.s===s}).length});
    var inc=J.filter(function(j){return j.s===2}).reduce(function(a,j){return a+j.b},0);
    var st=[['Menunggu',c[0]],['Diproses',c[1]],['Selesai',c[2]],['Pendapatan',rp(inc)]].map(function(x){return '<div class="st"><b>'+x[1]+'</b><span>'+x[0]+'</span></div>'}).join('');
    var q2=J.filter(function(j){return j.s<2}).map(function(j){
     return '<tr><td>'+j.id+'</td><td><b>'+e(j.p)+'</b></td><td>'+e(j.d)+'<br>'+e(j.k)+'</td><td><button class="chp s'+j.s+'" data-job="'+j.id+'" title="Klik untuk ubah status">'+SN[j.s]+'</button></td><td><button class="sm" data-chat="'+e(j.p)+'">CHAT</button></td></tr>'}).join('');
    return '<h2>BERANDA TEKNISI</h2><p class="sub">ANTRIAN SERVIS · KLIK STATUS UNTUK MENGUBAH</p><div class="stats">'+st+'</div><div class="tw"><table><tr><th>ID</th><th>Pembeli</th><th>Unit / Keluhan</th><th>Status</th><th></th></tr>'+q2+'</table></div>'},
   riwayat:function(){
    return '<h2>RIWAYAT PEMBELI</h2><p class="sub">SEMUA SERVIS YANG PERNAH MASUK</p><input class="srch" id="q" placeholder="Cari pembeli, unit, atau teknisi…" value="'+e(q)+'" aria-label="Cari"><div class="tw"><table><tr><th>Tanggal</th><th>Pembeli</th><th>Unit / Keluhan</th><th>Teknisi</th><th>Biaya</th><th>Status</th></tr><tbody id="rows">'+rows()+'</tbody></table></div>'},
   daftar:function(){
    return '<h2>DAFTAR TEKNISI</h2><p class="sub">TIM YANG BERTUGAS</p><div class="grid">'+T.map(function(t){
     var n=J.filter(function(j){return j.t===t.n}).length;
     return '<div class="tc"><span class="dot'+(t.on?' on':'')+'">'+(t.on?'ONLINE':'SIBUK')+'</span><div class="av">'+e(t.n.split(' ').map(function(w){return w[0]}).join(''))+'</div><h3>'+e(t.n)+'</h3><p>'+e(t.sp)+'</p><p>★ '+t.r+' · '+n+' servis</p></div>'}).join('')+'</div>'}
  },
  pembeli:{
   beranda:function(){
    var L=J.filter(function(j){return j.p===me});
    return '<h2>BERANDA</h2><p class="sub">HALO, '+e(me.toUpperCase())+' · RIWAYAT SERVICE ANDA</p>'+L.map(function(j){
     return '<div class="job"><div class="jh"><div><b>'+e(j.d)+'</b><br><small>'+j.id+' · '+e(j.tgl)+' · '+e(j.t)+'</small></div><span class="chp s'+j.s+'">'+SN[j.s]+'</span></div><p>'+e(j.k)+'</p><div class="steps">'+[0,1,2].map(function(i){return '<i class="'+(i<=j.s?'f':'')+'"></i>'}).join('')+'</div><div class="slbl"><span>Diterima</span><span>Diproses</span><span>Selesai</span></div><div class="jh"><b>'+rp(j.b)+'</b><button class="sm" data-chat="'+e(j.t)+'">CHAT TEKNISI</button></div></div>'}).join('')}
  }
 };
 function render(){
  $('#menu').innerHTML=PG[role].map(function(p){return '<button class="mi'+(p[0]===page?' on':'')+'" role="tab" aria-selected="'+(p[0]===page)+'" data-p="'+p[0]+'">'+p[1]+'</button>'}).join('');
  $('#view').innerHTML=V[role][page]();
  [].forEach.call(document.querySelectorAll('.roles button'),function(b){b.classList.toggle('on',b.dataset.r===role)});
 }

 // ---- chat ----
 var logs={},cw=null;
 var RT=['Baik, unit Anda sedang kami cek. Kabar terbarunya kami sampaikan hari ini ya.','Estimasi selesai besok sore. Nanti kami hubungi lagi.','Penyebabnya sudah ketemu, kami butuh persetujuan biaya ya.'];
 var RP=['Oke, terima kasih. Saya tunggu kabarnya.','Baik, silakan dilanjutkan.','Berapa estimasi biayanya?'];
 var hm=function(){return new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})};
 var contacts=function(){return role==='pembeli'?T.map(function(t){return t.n}):J.map(function(j){return j.p}).filter(function(v,i,a){return a.indexOf(v)===i})};
 var key=function(){return role+'|'+cw};
 function draw(){
  var k=key();
  if(!logs[k])logs[k]=[{me:0,t:role==='pembeli'?'Halo, ada yang bisa kami bantu terkait servis Anda?':'Halo, unit saya sudah ada kabar?',h:hm()}];
  var box=$('#log');box.textContent='';
  logs[k].forEach(function(m){var d=document.createElement('div');d.className='m '+(m.me?'me':'ot');d.textContent=m.t;var s=document.createElement('small');s.textContent=m.h;d.appendChild(s);box.appendChild(d)});
  box.scrollTop=box.scrollHeight;
 }
 function openChat(w){
  var c=contacts();cw=w&&c.indexOf(w)>-1?w:(cw&&c.indexOf(cw)>-1?cw:c[0]);
  $('#who').innerHTML=c.map(function(n){return '<option'+(n===cw?' selected':'')+'>'+e(n)+'</option>'}).join('');
  $('#cw').hidden=false;$('#fab').hidden=true;draw();$('#msg').focus();
 }
 function closeChat(){$('#cw').hidden=true;$('#fab').hidden=false}
 $('#who').addEventListener('change',function(){cw=this.value;draw()});
 $('#x').addEventListener('click',closeChat);
 $('#fab').addEventListener('click',function(){openChat()});
 $('#cf').addEventListener('submit',function(ev){
  ev.preventDefault();
  var i=$('#msg'),t=i.value.trim();if(!t)return;
  var k=key();logs[k].push({me:1,t:t,h:hm()});i.value='';draw();
  setTimeout(function(){var R=role==='pembeli'?RT:RP;logs[k].push({me:0,t:R[Math.floor(Math.random()*R.length)],h:hm()});if(key()===k&&!$('#cw').hidden)draw()},1100);
 });

 // ---- events ----
 document.addEventListener('click',function(ev){
  var b=ev.target.closest('[data-p],[data-r],[data-job],[data-chat]');if(!b)return;
  if(b.dataset.p){if(b.dataset.p==='chat'){openChat();return}page=b.dataset.p;render()}
  else if(b.dataset.r){role=b.dataset.r;page='beranda';closeChat();cw=null;render()}
  else if(b.dataset.job){var j=J.filter(function(x){return x.id===b.dataset.job})[0];j.s=(j.s+1)%3;try{localStorage.setItem('servis.jobs',JSON.stringify(J))}catch(x){}render()}
  else if(b.dataset.chat){openChat(b.dataset.chat)}
 });
 document.addEventListener('input',function(ev){if(ev.target.id==='q'){q=ev.target.value;$('#rows').innerHTML=rows()}});
 addEventListener('keydown',function(ev){
  if(ev.key==='Escape'){closeChat();return}
  if(/INPUT|SELECT|TEXTAREA/.test(ev.target.tagName))return;
  var ids=PG[role].map(function(p){return p[0]}).filter(function(p){return p!=='chat'}),k=ids.indexOf(page);
  if(ev.key==='ArrowDown'){ev.preventDefault();page=ids[(k+1)%ids.length];render()}
  if(ev.key==='ArrowUp'){ev.preventDefault();page=ids[(k+ids.length-1)%ids.length];render()}
 });
 $('#logout').addEventListener('click',function(){localStorage.removeItem('servis.session');location.href='index.html'});
 render();
})();
