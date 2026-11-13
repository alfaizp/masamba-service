/* Latar Persona 3: tangga Tartarus, gelembung, dan jam. Dipakai semua halaman. */
(function(){
 var $=function(s){return document.querySelector(s)};
 var h='';
 for(var i=0;i<16;i++){var y=300+i*38,w=150+i*46;h+='<rect x="'+(800-w/2)+'" y="'+y+'" width="'+w+'" height="40" fill="rgba(2,24,140,'+(.16+i*.02).toFixed(2)+')" stroke="rgba(160,240,255,.18)"/>'}
 $('#stairs').innerHTML=h;
 for(var j=0;j<16;j++){var d=document.createElement('i'),s=6+Math.random()*22;
  d.style.cssText='left:'+Math.random()*100+'%;width:'+s+'px;height:'+s+'px;animation-duration:'+(9+Math.random()*12)+'s;animation-delay:-'+Math.random()*18+'s';$('#bubbles').appendChild(d)}
 var tick=function(){$('#clk').textContent=new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})};
 tick();setInterval(tick,15000);
})();
