'use strict';

/* ═══════════════════════════════════════════
   PRODUCTS
═══════════════════════════════════════════ */
const PRODUCTS = [
  {
    id: 'classic-polo',
    name: 'Classic Polo',
    category: 'Polos',
    price: 42,
    sizes: ['S','M','L','XL','XXL'],
    colors: [
      { name: 'White', hex: '#f4f0e6' },
      { name: 'Black', hex: '#141414' },
      { name: 'Navy',  hex: '#1c2436' },
    ],
  },
  {
    id: 'pique-polo',
    name: 'Piqué Polo',
    category: 'Polos',
    price: 46,
    sizes: ['S','M','L','XL','XXL'],
    colors: [
      { name: 'Ivory',   hex: '#ede6d1' },
      { name: 'Forest',  hex: '#2f3a26' },
      { name: 'Camel',   hex: '#b48a5c' },
    ],
  },
  {
    id: 'zip-polo',
    name: 'Zip Polo',
    category: 'Polos',
    price: 52,
    sizes: ['S','M','L','XL'],
    colors: [
      { name: 'Emerald', hex: '#1f4a36' },
      { name: 'Black',   hex: '#141414' },
      { name: 'Cream',   hex: '#e8ddc4' },
    ],
  },
  {
    id: 'long-sleeve-polo',
    name: 'Long-Sleeve Polo',
    category: 'Polos',
    price: 48,
    sizes: ['S','M','L','XL','XXL'],
    colors: [
      { name: 'Charcoal', hex: '#2c2c2c' },
      { name: 'Wine',     hex: '#5a2028' },
      { name: 'Sand',     hex: '#c6b493' },
    ],
  },
  {
    id: 'oxford-shirt',
    name: 'Oxford Shirt',
    category: 'Shirts',
    price: 54,
    sizes: ['S','M','L','XL','XXL'],
    colors: [
      { name: 'White',      hex: '#f4f0e6' },
      { name: 'Sky',        hex: '#b3c8db' },
      { name: 'Stone',      hex: '#c7bfa8' },
    ],
  },
  {
    id: 'linen-shirt',
    name: 'Linen Shirt',
    category: 'Shirts',
    price: 58,
    sizes: ['S','M','L','XL'],
    colors: [
      { name: 'Ivory', hex: '#ede6d1' },
      { name: 'Olive', hex: '#5a5c3a' },
      { name: 'Beige', hex: '#c8b898' },
    ],
  },
  {
    id: 'essential-tee',
    name: 'Essential Tee',
    category: 'T-Shirts',
    price: 26,
    sizes: ['S','M','L','XL','XXL'],
    colors: [
      { name: 'White', hex: '#f4f0e6' },
      { name: 'Black', hex: '#141414' },
      { name: 'Grey',  hex: '#8a8a82' },
    ],
  },
  {
    id: 'heavyweight-tee',
    name: 'Heavyweight Tee',
    category: 'T-Shirts',
    price: 32,
    sizes: ['S','M','L','XL','XXL'],
    colors: [
      { name: 'Bone',    hex: '#e8ddc4' },
      { name: 'Espresso', hex: '#3a2a1e' },
      { name: 'Navy',    hex: '#1c2436' },
    ],
  },
];

/* ═══════════════════════════════════════════
   CART STATE
═══════════════════════════════════════════ */
let cart = [];

function itemKey(product, color, size) {
  return `${product.id}||${color}||${size}`;
}

function saveCart() {
  // Persist cart to sessionStorage so checkout.html can read it
  const serialisable = cart.map(i => ({
    id:    i.product.id,
    name:  i.product.name,
    price: i.product.price,
    color: i.color,
    hex:   i.colorHex,
    size:  i.size,
    qty:   i.qty,
  }));
  sessionStorage.setItem('wc_cart', JSON.stringify(serialisable));
}

/* ═══════════════════════════════════════════
   EXTRA STYLES (not in style.css)
═══════════════════════════════════════════ */
function injectStyles() {
  const s = document.createElement('style');
  s.textContent = `
    /* ── filter pills ── */
    .filter-pills { display:flex; flex-wrap:wrap; gap:8px; }
    .filter-pill {
      font-family:var(--font-mono); font-size:.7rem; letter-spacing:.1em;
      text-transform:uppercase; padding:7px 16px;
      border:1px solid var(--line); background:none; color:var(--muted);
      border-radius:2px; cursor:pointer;
      transition:border-color .2s,color .2s,background .2s;
    }
    .filter-pill:hover  { border-color:var(--cream); color:var(--cream); }
    .filter-pill.active { border-color:var(--sheen); background:var(--sheen); color:var(--ink); }

    /* ── toolbar ── */
    .shop-toolbar { display:flex; flex-wrap:wrap; align-items:center; gap:16px; margin-bottom:36px; }
    .search-box {
      display:flex; align-items:center; gap:10px;
      border:1px solid var(--line); background:rgba(255,255,255,.05);
      padding:9px 14px; border-radius:2px; transition:border-color .2s; flex:0 0 220px;
    }
    .search-box:focus-within { border-color:var(--cream); }
    .search-box svg  { color:var(--muted); flex-shrink:0; }
    .search-input {
      background:none; border:none; outline:none;
      color:var(--cream); font-family:var(--font-body); font-size:.88rem; width:100%;
    }
    .search-input::placeholder { color:var(--muted); opacity:.7; }

    /* ── card extras ── */
    .color-label {
      font-family:var(--font-mono); font-size:.7rem;
      color:var(--muted); margin-top:5px; letter-spacing:.06em; min-height:1.1em;
    }
    .size-hint {
      font-family:var(--font-mono); font-size:.68rem;
      color:var(--muted); margin-top:5px; min-height:1em; transition:color .2s;
    }

    /* ── product sizes wrap on small cards ── */
    .product-sizes { flex-wrap:wrap; }

    /* ── qty controls ── */
    .qty-row { display:flex; align-items:center; margin-top:8px; }
    .qty-btn {
      background:none; border:1px solid var(--line); color:var(--cream);
      width:26px; height:26px; border-radius:2px; font-size:1rem; line-height:1;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; transition:border-color .15s,background .15s;
    }
    .qty-btn:hover { border-color:var(--cream); background:rgba(255,255,255,.07); }
    .qty-num { font-family:var(--font-mono); font-size:.85rem; min-width:32px; text-align:center; }

    /* ── cart total ── */
    .cart-total-row {
      display:flex; justify-content:space-between; align-items:center;
      padding:16px 0 4px; border-top:1px solid var(--line); margin-top:8px;
    }
    .cart-total-label { font-family:var(--font-mono); font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
    .cart-total-price { font-family:var(--font-mono); font-size:1.05rem; color:var(--sheen); font-weight:500; }

    /* ── checkout button in cart ── */
    .cart-checkout-btn {
      display:block; width:100%; margin-top:12px;
      font-family:var(--font-mono); font-size:.78rem; letter-spacing:.08em;
      text-transform:uppercase; padding:15px; border-radius:2px;
      background:var(--cream); color:var(--ink); border:1px solid var(--cream);
      font-weight:500; cursor:pointer; text-align:center;
      transition:background .2s,border-color .2s,transform .15s;
      text-decoration:none;
    }
    .cart-checkout-btn:hover { background:var(--sheen); border-color:var(--sheen); transform:translateY(-1px); }

    /* ── shake ── */
    @keyframes shake {
      0%,100%{ transform:translateX(0); }
      25%    { transform:translateX(-5px); }
      75%    { transform:translateX(5px); }
    }
    .shake { animation:shake .35s ease; }

    @media(max-width:600px){
      .shop-toolbar { flex-direction:column; align-items:stretch; }
      .search-box   { flex:1 1 auto; }
    }
  `;
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════
   BUILD PRODUCT CARD
═══════════════════════════════════════════ */
function buildCard(product) {
  const card = document.createElement('div');
  // ⚠️  NO 'reveal' class — we force visibility immediately so items always show
  card.className = 'product-card';
  card.style.opacity = '1';
  card.style.transform = 'none';

  const first = product.colors[0];

  card.innerHTML = `
    <div class="product-preview">
      <div class="preview-swatch" style="background:${first.hex};"></div>
    </div>
    <div class="product-info">
      <span class="eyebrow" style="font-size:.65rem;letter-spacing:.18em;">${product.category}</span>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">$${product.price} USD</p>

      <div class="product-colors" role="group" aria-label="Colour">
        ${product.colors.map((c, i) => `
          <button
            class="color-dot${i === 0 ? ' active' : ''}"
            style="background:${c.hex};"
            data-color="${c.name}"
            data-hex="${c.hex}"
            title="${c.name}"
            aria-label="${c.name}"
            aria-pressed="${i === 0}"
          ></button>`).join('')}
      </div>
      <p class="color-label">${first.name}</p>

      <div class="product-sizes" role="group" aria-label="Size">
        ${product.sizes.map(s => `
          <button class="size-pill" data-size="${s}" aria-pressed="false">${s}</button>`).join('')}
      </div>
      <p class="size-hint"></p>

      <button class="add-btn">Add to Cart</button>
    </div>
  `;

  /* colour */
  const swatch     = card.querySelector('.preview-swatch');
  const colorLabel = card.querySelector('.color-label');
  card.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      card.querySelectorAll('.color-dot').forEach(d => { d.classList.remove('active'); d.setAttribute('aria-pressed','false'); });
      dot.classList.add('active');
      dot.setAttribute('aria-pressed','true');
      swatch.style.background = dot.dataset.hex;
      colorLabel.textContent  = dot.dataset.color;
    });
  });

  /* size */
  const sizeHint = card.querySelector('.size-hint');
  card.querySelectorAll('.size-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      card.querySelectorAll('.size-pill').forEach(p => { p.classList.remove('active'); p.setAttribute('aria-pressed','false'); });
      pill.classList.add('active');
      pill.setAttribute('aria-pressed','true');
      sizeHint.style.color = '';
      sizeHint.textContent = `Size ${pill.dataset.size} selected`;
    });
  });

  /* add to cart */
  const addBtn = card.querySelector('.add-btn');
  addBtn.addEventListener('click', () => {
    const activeColor = card.querySelector('.color-dot.active');
    const activeSize  = card.querySelector('.size-pill.active');

    if (!activeSize) {
      sizeHint.textContent = '← Pick a size first';
      sizeHint.style.color = '#e8c98a';
      sizeHint.classList.add('shake');
      setTimeout(() => {
        sizeHint.classList.remove('shake');
        if (!card.querySelector('.size-pill.active')) { sizeHint.style.color = ''; sizeHint.textContent = ''; }
      }, 600);
      return;
    }

    const color    = activeColor.dataset.color;
    const colorHex = activeColor.dataset.hex;
    const size     = activeSize.dataset.size;
    const key      = itemKey(product, color, size);
    const existing = cart.find(i => itemKey(i.product, i.color, i.size) === key);

    if (existing) { existing.qty += 1; }
    else { cart.push({ product, color, colorHex, size, qty: 1 }); }

    saveCart();
    renderCart();
    openCart();

    addBtn.textContent = '✓ Added';
    addBtn.classList.add('added');
    setTimeout(() => { addBtn.textContent = 'Add to Cart'; addBtn.classList.remove('added'); }, 1500);
  });

  return card;
}

/* ═══════════════════════════════════════════
   RENDER PRODUCT GRID
═══════════════════════════════════════════ */
function renderGrid(list) {
  const grid  = document.getElementById('productGrid');
  const empty = document.getElementById('shopEmpty');
  grid.innerHTML = '';

  if (!list.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  list.forEach(p => grid.appendChild(buildCard(p)));
}

/* ═══════════════════════════════════════════
   FILTER PILLS
═══════════════════════════════════════════ */
const CATEGORIES = ['All', ...new Set(PRODUCTS.map(p => p.category))];

function buildFilterPills() {
  const container = document.getElementById('filterPills');
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
    container.appendChild(btn);
  });
}

function applyFilters() {
  const query  = document.getElementById('searchInput').value.trim().toLowerCase();
  const catBtn = document.querySelector('.filter-pill.active');
  const cat    = catBtn ? catBtn.textContent : 'All';
  const filtered = PRODUCTS.filter(p => {
    const okCat   = cat === 'All' || p.category === cat;
    const okQuery = !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    return okCat && okQuery;
  });
  renderGrid(filtered);
}

/* ═══════════════════════════════════════════
   RENDER CART DRAWER
═══════════════════════════════════════════ */
function renderCart() {
  const body   = document.getElementById('cartBody');
  const empty  = document.getElementById('cartEmpty');
  const footer = document.getElementById('cartFooter');
  const count  = document.getElementById('cartCount');

  count.textContent = cart.reduce((n, i) => n + i.qty, 0);

  // Remove only the item rows + total row from a previous render.
  // Never touch #cartEmpty — wiping innerHTML destroys it, and the next
  // renderCart() call crashes when it tries to read empty.style.
  body.querySelectorAll('.cart-item, .cart-total-row').forEach(el => el.remove());

  if (!cart.length) {
    empty.style.display = 'block';
    footer.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  footer.style.display = 'block';

  cart.forEach(item => {
    const key  = itemKey(item.product, item.color, item.size);
    const line = item.product.price * item.qty;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-info">
        <p class="cart-item-name">${item.product.name}</p>
        <p class="cart-item-details">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.colorHex};margin-right:5px;vertical-align:middle;border:1px solid rgba(255,255,255,.2);"></span>
          ${item.color} · Size ${item.size}
        </p>
        <p class="cart-item-price">$${line} USD</p>
        <div class="qty-row">
          <button class="qty-btn qty-minus" data-key="${key}">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn qty-plus"  data-key="${key}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-key="${key}" aria-label="Remove">✕</button>
    `;

    body.appendChild(row);
  });

  // Total
  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const totalRow = document.createElement('div');
  totalRow.className = 'cart-total-row';
  totalRow.innerHTML = `
    <span class="cart-total-label">Order Total</span>
    <span class="cart-total-price">$${total} USD</span>
  `;
  body.appendChild(totalRow);
}

function removeFromCart(key) {
  cart = cart.filter(i => itemKey(i.product, i.color, i.size) !== key);
  saveCart();
  renderCart();
}

function adjustQty(key, delta) {
  const item = cart.find(i => itemKey(i.product, i.color, i.size) === key);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
}

/* ═══════════════════════════════════════════
   CART OPEN / CLOSE
═══════════════════════════════════════════ */
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL (static elements only)
═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  injectStyles();

  document.getElementById('fine').textContent =
    '© ' + new Date().getFullYear() + ' WEAR CORNER. Delivery across Lebanon.';

  // Reveal static page sections (hero, standard, reviews etc.)
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  buildFilterPills();
  renderGrid(PRODUCTS);

  document.getElementById('searchInput').addEventListener('input', applyFilters);

  document.getElementById('cartToggle').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);

  // Delegated cart controls — one listener handles every +, −, and × click,
  // so re-renders can't break the buttons.
  document.getElementById('cartBody').addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.cart-item-remove');
    const minusBtn  = e.target.closest('.qty-minus');
    const plusBtn   = e.target.closest('.qty-plus');
    if (removeBtn) { removeFromCart(removeBtn.dataset.key); return; }
    if (minusBtn)  { adjustQty(minusBtn.dataset.key, -1); return; }
    if (plusBtn)   { adjustQty(plusBtn.dataset.key, +1); return; }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  // "Proceed to Checkout" button — go to checkout.html
  document.getElementById('cartSend').addEventListener('click', () => {
    if (!cart.length) return;
    saveCart();
    window.location.href = 'checkout.html';
  });
});