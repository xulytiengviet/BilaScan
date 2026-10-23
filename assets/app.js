
"use strict";
var E=id=>document.getElementById(id),A='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function bytes(seed,n){var a=[],v=seed>>>0;for(var i=0;i<n;i++){v=(Math.imul(1664525,v)+1013904223)>>>0;a.push((v>>>17)&255)}return a}
function b58(b){var n=0n;for(var v of b)n=n*256n+BigInt(v);var r='';while(n>0n){r=A[Number(n%58n)]+r;n/=58n}return r||'1'}
function key(seed){return b58(bytes(seed*31+911,32))}function signature(seed){return b58(bytes(seed*81+109,64))}
var names=['Mai','Lan','Trúc','Đào','Hương','Giang','Minh','Nhật','Tâm','An','Bình','Hải','Khánh','Phúc','Thảo','Vy'];
var wallets=names.map((name,i)=>({name,address:key(i+1),genesis:(200+((i*71)%450))*1e8,balance:(200+((i*71)%450))*1e8,token:2e9+i*18e7}));
var programs=['BilaVault','BilaToken','BilaVote','BilaRegistry'].map((name,i)=>({name,id:key(i+101),functions:[['nap_tien','rut_tien','xem_so_du'],['chuyen_token','duc_token','dot_token'],['bo_phieu','dem_phieu'],['cap_nhat','tra_cuu']][i],variables:['chu_so_huu:address','so_dem:uint64','luu_tru:mapping(address=>uint64)']}));
var kinds=['Chuyển SOL','Chuyển BILA','Nạp tiền','Rút tiền','Bỏ phiếu','Cập nhật','Đúc BILA','Đốt BILA','CPI'];
var tx=[];for(var i=0;i<100;i++){var a=wallets[(i*7+2)%16],b=wallets[(i*11+5)%16];if(a===b)b=wallets[(i*11+6)%16];var k=i%9,fee=5000,amount=(8+(i*23)%220)*1e6,token=(1+(i*19)%70)*1e6,failed=[12,27,41,58,73,90].includes(i),pre=[a.balance,b.balance];a.balance-=fee;if(!failed){if(k===0){a.balance-=amount;b.balance+=amount}else if(k===1){a.token-=token;b.token+=token}else if(k===6)a.token+=token;else if(k===7)a.token-=token}var prog=programs[k%4],method=k===0||k===1?'transfer':prog.functions[i%prog.functions.length],data=bytes(i+600,8).concat(Array.from({length:8},(_,j)=>Math.floor(amount/2**(8*j))%256));tx.push({signature:signature(i+100),slot:376500000+3*i,time:1792750000+i*48,status:failed?'failed':'success',kind:kinds[k],method,from:a.address,to:b.address,fromName:a.name,toName:b.name,program:k===0?'11111111111111111111111111111111':k===1?'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':prog.id,fee,amount:k===0?amount:0,tokenAmount:[1,6,7].includes(k)?token:0,pre,post:[a.balance,b.balance],data,compute:1500+(i*617)%128000,logs:['Program invoke [1]','Program log: SIMULATED '+method,failed?'Program failed: custom error':'Program success']})}
var active='ALL',page=0,selectedProg=0,selectedTx=tx[99],output='';
var mapping={'hợp_đồng':'contract','hàm':'function','công_khai':'public','riêng_tư':'private','nội_bộ':'internal','bên_ngoài':'external','trả_về':'returns','sự_kiện':'event','phát':'emit','sửa_đổi':'modifier','yêu_cầu':'require','khẳng_định':'assert','địa_chỉ':'address','ánh_xạ':'mapping','hoàn_trả':'return','chỉ_đọc':'view','thuần':'pure','hằng':'constant'};
var reverse=Object.fromEntries(Object.entries(mapping).map(x=>[x[1],x[0]]));
function tok(s){return s.match(/\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[\p{L}_$][\p{L}\p{N}_$]*|0x[\da-fA-F]+|\d+|./gu)||[]}
function mapSource(s,m){return tok(s).map(x=>(/^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(x)?m[x]:null)||x).join('')}
function short(s){return String(s).slice(0,8)+'…'+String(s).slice(-6)}
function money(n){return (n/1e9).toLocaleString('vi-VN',{maximumFractionDigits:6})+' SOL'}
function renderWallet(){var w=wallets.find(x=>x.address===active);E('walletSelect').value=active;E('w-addr').textContent=w?w.address:'TOÀN BỘ VÍ GIẢ LẬP';E('w-bal').textContent=money(w?w.balance:wallets.reduce((a,x)=>a+x.balance,0));E('w-tok').textContent=(w?w.token:wallets.reduce((a,x)=>a+x.token,0)).toLocaleString('vi-VN')+' đơn vị nhỏ';E('w-count').textContent=w?tx.filter(t=>t.from===active||t.to===active).length:100;E('n-bal').textContent=((w?w.balance:wallets.reduce((a,x)=>a+x.balance,0))/1e9).toLocaleString('vi-VN',{maximumFractionDigits:3});E('walletgrid').innerHTML=wallets.map(x=>'<button class="wallet '+(x.address===active?'current':'')+'" data-wallet="'+x.address+'"><b>◉ Ví '+x.name+'</b><small>'+short(x.address)+'</small><b>'+money(x.balance)+'</b></button>').join('')}
function selectWallet(v){active=v;page=0;renderWallet();renderTx();mockApi()}
function renderTx(){var q=E('query').value.trim().toLowerCase(),s=E('filter').value,rows=tx.filter(t=>(active==='ALL'||t.from===active||t.to===active)&&(s==='all'||s===t.status)&&(!q||[t.signature,t.kind,t.fromName,t.toName,t.method,t.program].join(' ').toLowerCase().includes(q))).reverse(),total=Math.max(1,Math.ceil(rows.length/12));page=Math.min(page,total-1);E('pager').textContent='Trang '+(page+1)+'/'+total+' · '+rows.length+' bản ghi';E('txrows').innerHTML=rows.slice(page*12,(page+1)*12).map(t=>'<tr data-tx="'+t.signature+'"><td class="mono light">'+short(t.signature)+'</td><td><span class="badge '+(t.status==='failed'?'fail':'')+'">'+(t.status==='failed'?'Thất bại':'Thành công')+'</span></td><td>'+t.kind+'</td><td class="mono">'+t.slot+'</td><td>'+t.fromName+' → '+t.toName+'</td></tr>').join('')}
function selectTx(t){selectedTx=t;E('lens').textContent='// DỮ LIỆU MÔ PHỎNG; không phải source Solang\ngiao_dich "'+t.signature+'" {\n  slot: '+t.slot+';\n  trang_thai: '+t.status+';\n  nguon: "'+t.from+'";\n  dich: "'+t.to+'";\n  ham: "'+t.method+'";\n  phi_lamport: '+t.fee+';\n  instruction_byte: ['+t.data.join(', ')+'];\n}';E('txinfo').textContent='Program: '+t.program+' · Phí: '+t.fee+' lamport · CU (giả lập): '+t.compute+' · SOL trước/sau: '+t.pre.join('/')+' → '+t.post.join('/');E('txlog').textContent=t.logs.join('\n')+'\nHex payload:\n'+t.data.map(x=>x.toString(16).padStart(2,'0')).join('')}
function renderProg(){var p=programs[selectedProg];E('progselect').value=selectedProg;E('proggrid').innerHTML=programs.map((x,i)=>'<button class="prog '+(i===selectedProg?'current':'')+'" data-program="'+i+'"><b>'+x.name+'</b><small>'+short(x.id)+'</small><small>'+x.functions.length+' functions</small></button>').join('');E('pid').textContent=p.id;E('pmethod').textContent=p.functions.join(', ')+' | '+p.variables.join(', ');E('idl').textContent=JSON.stringify({warning:'MOCK IDL, not emitted by Solang',name:p.name,instructions:p.functions.map(f=>({name:f,accounts:[{name:'nguoi_ky',isSigner:true,isMut:true}],args:[]}))},null,2);E('binary').textContent='MOCK DATA (not SBF ELF):\n'+bytes(selectedProg+500,96).map(x=>x.toString(16).padStart(2,'0')).join(' ').match(/.{1,48}/g).join('\n')}
function compile(){var src=E('src').value,flat=tok(src).filter(x=>!(/^\s+$/.test(x)||x.startsWith('//')||x.startsWith('/*')||x.startsWith('"')||x.startsWith("'"))).join(' '),errors=[];if(/\bmsg\s*\.\s*sender\b/.test(flat))errors.push('msg.sender');for(var word of ['delegatecall','staticcall','immutable','assembly','số_nguyên_không_dấu'])if(tok(flat).includes(word))errors.push(word);if(/address\s*\(\s*0x/.test(flat))errors.push('address(0x...)');output=mapSource(src,mapping);E('solout').textContent=output;var same=JSON.stringify(tok(mapSource(output,reverse)).filter(x=>!x.startsWith('//')&&!/^\s+$/.test(x)))===JSON.stringify(tok(src).filter(x=>!x.startsWith('//')&&!/^\s+$/.test(x)));E('result').textContent=errors.length?'TỪ CHỐI: '+errors.join(', '):same?'Token round-trip: ĐẠT (không phải AST test)':'Không đạt token round-trip';E('result').style.color=errors.length?'#ff8293':'#30e4cb';var steps=['Token round-trip','AST structural equality','SBF bytecode identity','IDL/metadata identity','Instruction discriminator identity','Differential fuzzing','Compute-unit identity'];E('audit').innerHTML=steps.map((s,i)=>'<div class="check"><span>'+(i+1)+'. '+s+'</span><span style="color:'+(i===0&&!errors.length&&same?'#30e4cb':'#eab97b')+'">'+(i===0?(!errors.length&&same?'ĐẠT TOKEN':'KHÔNG ĐẠT'):'CHƯA CHẠY')+'</span></div>').join('')}
function cvnss(){if(typeof CVNSSConverter==='undefined'){E('cvnssout').textContent='Codec CVNSS4.0 chưa tải từ CDN. Vui lòng kiểm tra kết nối mạng.';return}try{E('cvnssout').textContent=CVNSSConverter.fromCqn(E('src').value).cvss+'\n\nCHỈ HIỂN THỊ: CVNSS4.0 không bảo đảm ánh xạ 1–1.'}catch(e){E('cvnssout').textContent=String(e)}}
function mockApi(){var m=E('method').value,w=wallets.find(x=>x.address===active)||wallets[0],r={};if(m==='getBalance')r={value:w.balance};else if(m==='getAccountInfo')r={value:{owner:'11111111111111111111111111111111',lamports:w.balance,executable:false}};else if(m==='getSignaturesForAddress')r=tx.filter(t=>t.from===w.address||t.to===w.address).map(x=>({signature:x.signature,slot:x.slot,err:x.status==='failed'}));else if(m==='getTransaction')r=selectedTx;else if(m==='getTokenAccountsByOwner')r={value:[{mint:programs[1].id,amount:w.token}]};else if(m==='getProgramAccounts')r=programs.map(p=>({pubkey:p.id,executable:true}));else r=tx[99].slot;E('jsonrpc').textContent=JSON.stringify({jsonrpc:'2.0',id:'mock-1',simulated:true,result:r},null,2)}
function downloadAs(name,str){var url=URL.createObjectURL(new Blob([str],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function exportData(){downloadAs('bilascan-100-transactions-demo.json',JSON.stringify({isSimulation:true,wallets,programs,transactions:tx},null,2))}
function downloadSol(){downloadAs('bilascript-generated.sol',output)}
function copyAddr(){navigator.clipboard?.writeText(E('w-addr').textContent)}
function go(id,btn){E(id).scrollIntoView({behavior:'smooth',block:'start'});document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));if(btn)btn.classList.add('active')}
E('walletSelect').innerHTML='<option value="ALL">Tất cả 100 giao dịch</option>'+wallets.map(w=>'<option value="'+w.address+'">Ví '+w.name+'</option>').join('');
E('progselect').innerHTML=programs.map((p,i)=>'<option value="'+i+'">'+p.name+'</option>').join('');
E('method').innerHTML=['getAccountInfo','getBalance','getSignaturesForAddress','getTransaction','getTokenAccountsByOwner','getProgramAccounts','getSlot'].map(m=>'<option>'+m+'</option>').join('');
E('walletgrid').addEventListener('click',e=>{var b=e.target.closest('[data-wallet]');if(b)selectWallet(b.dataset.wallet)});
E('proggrid').addEventListener('click',e=>{var b=e.target.closest('[data-program]');if(b){selectedProg=+b.dataset.program;renderProg()}});
E('txrows').addEventListener('click',e=>{var b=e.target.closest('[data-tx]');if(b)selectTx(tx.find(t=>t.signature===b.dataset.tx))});
E('src').value='// B1 chuyển từ khóa nhưng giữ nguyên tên biến, literal\nimport "solana";\n@program_id("'+programs[0].id+'")\nhợp_đồng BilaVault {\n  uint64 công_khai so_dem;\n  @signer(nguoi_ky)\n  hàm cap_nhat(uint64 gia_tri) bên_ngoài {\n    yêu_cầu(tx.accounts.nguoi_ky.is_signer, "Thiếu chữ ký");\n    so_dem = gia_tri;\n  }\n  hàm doc() công_khai chỉ_đọc trả_về (uint64) {\n    hoàn_trả so_dem;\n  }\n}';
renderWallet();renderTx();renderProg();selectTx(tx[99]);compile();mockApi();


/* Event listeners instead of inline JS handlers: usable under script-src 'self'. */
document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-go],[data-act]');
  if(!b)return;
  if(b.dataset.go){go(b.dataset.go,b);return}
  switch(b.dataset.act){
    case 'exportData':exportData();break;
    case 'copyAddr':copyAddr();break;
    case 'prev':page=Math.max(0,page-1);renderTx();break;
    case 'next':page++;renderTx();break;
    case 'compile':compile();break;
    case 'downloadSol':downloadSol();break;
    case 'cvnss':cvnss();break;
    case 'mockApi':mockApi();break;
  }
});
E('walletSelect').addEventListener('change',ev=>selectWallet(ev.target.value));
E('query').addEventListener('input',()=>{page=0;renderTx()});
E('filter').addEventListener('change',()=>{page=0;renderTx()});
E('progselect').addEventListener('change',ev=>{selectedProg=Number(ev.target.value);renderProg()});
