// Minimal JS to render product list and detail from JSON
async function getProducts(){
  const r = await fetch('data/products.json'); 
  return r.json();
}
function slugify(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}

function renderList(items){
  const grid = document.getElementById('grid');
  if(!grid) return;
  grid.innerHTML = '';
  items.forEach(p=>{
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <div class="ratio"><div class="txt">${p.equipment}</div></div>
      <div class="pad">
        <span class="badge">${p.category}</span>
        <h3 class="mt-2">${p.name}</h3>
        <p class="muted">${p.tagline}</p>
        <div class="mt-4 flex gap-4">
          <a class="btn" href="product.html?slug=${p.slug}">Details</a>
          <a class="btn ghost" target="_blank" rel="noopener" href="${p.oem_url}">Official</a>
        </div>
      </div>`;
    grid.appendChild(el);
  });
}

function renderFilters(items){
  const eq = document.getElementById('equip');
  const cat = document.getElementById('category');
  if(!eq || !cat) return;
  const cats = Array.from(new Set(items.map(p=>p.category))).sort();
  cats.forEach(c=>{ const o=document.createElement('option'); o.textContent=c; cat.appendChild(o); });

  const doFilter = () => {
    const q = document.getElementById('search').value.toLowerCase();
    const e = eq.value;
    const c = cat.value;
    const filtered = items.filter(p => 
      (!e || p.equipment===e) &&
      (!c || p.category===c) &&
      (!q || (p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)))
    );
    renderList(filtered);
  };

  document.getElementById('search').addEventListener('input', doFilter);
  eq.addEventListener('change', doFilter);
  cat.addEventListener('change', doFilter);
  document.getElementById('clear').addEventListener('click', ()=>{
    document.getElementById('search').value=''; eq.value=''; cat.value=''; doFilter();
  });
  doFilter();
}

function renderDetail(items){
  const params = new URLSearchParams(location.search);
  const slug = params.get('slug');
  if(!slug) return;
  const p = items.find(x=>x.slug===slug);
  if(!p) return;
  document.getElementById('equipKicker').textContent = p.equipment;
  document.getElementById('productTitle').textContent = p.name;
  document.getElementById('productTagline').textContent = p.tagline;
  document.getElementById('oemLink').href = p.oem_url;
  const h = document.getElementById('highlights');
  p.highlights.forEach(t=>{ const li=document.createElement('li'); li.textContent=t; h.appendChild(li); });
  const w = document.getElementById('worksWith');
  p.works_with.forEach(t=>{ const li=document.createElement('li'); li.textContent=t; w.appendChild(li); });
}

// Copy lead helper
function copyLead(){
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const equip = document.getElementById('equip').value;
  const msg = document.getElementById('msg').value.trim();
  const text = `Lead Request\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nEquipment: ${equip}\nMessage: ${msg}`;
  navigator.clipboard.writeText(text).then(()=>{
    const t=document.getElementById('toast'); t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2000);
  });
}

// Page boot
document.addEventListener('DOMContentLoaded', async()=>{
  if(!window.PAGE) return;
  const items = await getProducts();
  if(window.PAGE==='list'){ renderFilters(items); }
  if(window.PAGE==='detail'){ renderDetail(items); }
});