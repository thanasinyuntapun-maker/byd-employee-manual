// Local encryptor — keeps plaintext OUT of the repo. Re-run to change the password:
//   node encrypt.js "your-new-password"   (reads /tmp/byd_inline.html, writes dist/index.html)
const crypto = require('crypto');
const fs = require('fs');

const password = process.argv[2];
if (!password) { console.error('usage: node encrypt.js "<password>"'); process.exit(1); }
const plain = fs.readFileSync(process.argv[3] || '/tmp/byd_inline.html');

const ITER = 250000;
const salt = crypto.randomBytes(16);
const iv   = crypto.randomBytes(12);
const key  = crypto.pbkdf2Sync(password, salt, ITER, 32, 'sha256');
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const enc = Buffer.concat([cipher.update(plain), cipher.final()]);
const tag = cipher.getAuthTag();
const ct  = Buffer.concat([enc, tag]);            // ciphertext || tag (matches Web Crypto)

const b64 = b => b.toString('base64');
const payload = { salt: b64(salt), iv: b64(iv), ct: b64(ct), iter: ITER };

const loader = `<!DOCTYPE html>
<html lang="th"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow">
<title>BYD Employee Manual — เข้าสู่ระบบ</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;background:#0b0d10;color:#e6edf3;
    min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
  .card{width:100%;max-width:380px;background:#13161b;border:1px solid #262b33;border-radius:14px;
    padding:34px 28px;box-shadow:0 18px 50px rgba(0,0,0,.5);text-align:center}
  .logo{width:54px;height:54px;border-radius:12px;background:linear-gradient(135deg,#e23744,#ff6b3d);
    margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:22px;color:#fff}
  h1{font-size:18px;font-weight:600;margin-bottom:4px}
  p.sub{font-size:13px;color:#8b949e;margin-bottom:22px}
  input{width:100%;background:#0b0d10;border:1px solid #30363d;border-radius:9px;color:#e6edf3;
    font-size:15px;padding:12px 14px;outline:none;transition:border-color .15s}
  input:focus{border-color:#e23744}
  button{width:100%;margin-top:12px;background:#e23744;color:#fff;border:none;border-radius:9px;
    font-size:15px;font-weight:600;padding:12px;cursor:pointer;transition:background .15s}
  button:hover{background:#ff4954} button:disabled{opacity:.6;cursor:wait}
  .err{color:#f85149;font-size:13px;margin-top:12px;min-height:18px}
  .foot{margin-top:18px;font-size:11px;color:#5a626c}
</style></head>
<body>
  <div class="card">
    <div class="logo">BYD</div>
    <h1>คู่มือพนักงาน BYD</h1>
    <p class="sub">เอกสารภายใน — กรุณาใส่รหัสผ่านเพื่อเข้าอ่าน</p>
    <form id="f">
      <input id="pw" type="password" placeholder="รหัสผ่าน" autocomplete="current-password" autofocus>
      <button id="btn" type="submit">เข้าสู่ระบบ</button>
    </form>
    <div class="err" id="err"></div>
    <div class="foot">เข้ารหัส AES-256-GCM · เข้าถึงเฉพาะผู้มีรหัส</div>
  </div>
<script>
const DATA = ${JSON.stringify(payload)};
const b64d = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const f=document.getElementById('f'), pw=document.getElementById('pw'),
      btn=document.getElementById('btn'), err=document.getElementById('err');
f.addEventListener('submit', async e => {
  e.preventDefault(); err.textContent=''; btn.disabled=true; btn.textContent='กำลังถอดรหัส…';
  try{
    const enc=new TextEncoder();
    const baseKey=await crypto.subtle.importKey('raw',enc.encode(pw.value),'PBKDF2',false,['deriveKey']);
    const key=await crypto.subtle.deriveKey(
      {name:'PBKDF2',salt:b64d(DATA.salt),iterations:DATA.iter,hash:'SHA-256'},
      baseKey,{name:'AES-GCM',length:256},false,['decrypt']);
    const ptBuf=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64d(DATA.iv)},key,b64d(DATA.ct));
    const html=new TextDecoder().decode(ptBuf);
    try{sessionStorage.setItem('byd_ok','1');}catch(_){}
    document.open(); document.write(html); document.close();
  }catch(ex){
    btn.disabled=false; btn.textContent='เข้าสู่ระบบ';
    err.textContent='รหัสผ่านไม่ถูกต้อง'; pw.select();
  }
});
</script>
</body></html>`;

fs.mkdirSync('dist', {recursive:true});
fs.writeFileSync('dist/index.html', loader);
console.log('wrote dist/index.html  (', (loader.length/1e6).toFixed(2), 'MB )  iter=', ITER);
