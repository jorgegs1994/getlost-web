/* Guest guide (mobile) — vanilla port of the "Guest Guide" Claude Design file.
   Map-first layout: Leaflet map behind a bottom sheet with "The house" / "The area". */
(() => {
  const CATS = ['All', 'Food & Drink', 'Shopping', 'Attractions', 'Services', 'Emergency'];
  const HUES = { 'Food & Drink': 55, Shopping: 300, Attractions: 150, Services: 230, Emergency: 28 };
  const PLACES = [
    { name: 'Mercadona', cat: 'Shopping', type: 'Supermarket', dist: '565 m', walk: '7 min walk', rating: '4.3', reviews: '2,118', hours: '09:00–21:30', open: true, addr: 'Av. de Gran Canaria 12, El Tablero', note: 'Biggest supermarket nearby, with a good fresh fish and bakery counter. Parking is free. It gets busy after 18:00, so go in the morning.', photos: ['storefront', 'bakery counter', 'fresh produce'], rv: [['Marta R.', '2 weeks ago', 5, 'Large, clean and well stocked. Good selection of local products.'], ['Tom B.', '1 month ago', 4, 'Everything you need for a week in the villa. Busy in the evenings.']] },
    { name: 'La Vicaría Sonnenland', cat: 'Food & Drink', type: 'Italian restaurant', dist: '711 m', walk: '9 min walk', rating: '5.0', reviews: '312', hours: '13:00–23:00', open: true, addr: 'Calle Alcalde Enrique Jorge 7, Sonnenland', note: 'My go-to for dinner. Homemade pasta and a proper tiramisu. Ask for a table on the terrace and book ahead on Fridays and Saturdays.', photos: ['dining room', 'tiramisu', 'terrace'], rv: [['Sophie L.', '3 days ago', 5, 'Best Italian we found in the south. The owner is lovely and the tiramisu is unreal.'], ['Jan de V.', '2 weeks ago', 5, 'Fresh pasta, friendly staff, fair prices. We came back twice.']] },
    { name: 'HiperDino El Tablero', cat: 'Shopping', type: 'Supermarket', dist: '1.3 km', walk: '4 min drive', rating: '4.2', reviews: '1,540', hours: '08:30–21:30', open: true, addr: 'Calle Bentayga 5, El Tablero', note: 'Cheaper option for drinks, snacks and sun cream. Good Canarian wine section.', photos: ['storefront', 'wine aisle'], rv: [['Luis P.', '1 month ago', 4, 'Good prices and friendly staff. Parking can be tight.']] },
    { name: 'Holidayworld Maspalomas', cat: 'Attractions', type: 'Amusement park', dist: '1.4 km', walk: '5 min drive', rating: '4.1', reviews: '6,804', hours: '17:00–00:00', open: false, addr: 'Av. Touroperador Tui, Maspalomas', note: 'Bowling and rides for a rainy day or an evening with the kids. The go-karts are the highlight.', photos: ['bowling alley', 'ferris wheel', 'go-karts'], rv: [['Emma K.', '1 week ago', 4, 'Fun evening with the kids. Bowling was great, rides a bit pricey.']] },
    { name: 'Faro de Maspalomas', cat: 'Attractions', type: 'Lighthouse & beach', dist: '3.2 km', walk: '8 min drive', rating: '4.6', reviews: '14,210', hours: 'Open 24 h', open: true, addr: 'Paseo del Faro, Maspalomas', note: 'Go for the sunset. Walk along the dunes from the lighthouse, then dinner at one of the terraces on the promenade.', photos: ['lighthouse', 'dunes at sunset', 'promenade'], rv: [['Anna S.', '4 days ago', 5, 'Stunning sunset and the walk through the dunes is a must.'], ['Pedro M.', '3 weeks ago', 4, 'Beautiful spot, busy at sunset. Arrive early for parking.']] },
    { name: 'Time Restaurant', cat: 'Food & Drink', type: 'Tapas bar', dist: '2.1 km', walk: '6 min drive', rating: '4.7', reviews: '891', hours: '12:00–23:30', open: true, addr: 'CC El Tablero, local 14', note: 'Good tapas, terrace in the sun. Try the papas arrugadas and the grilled octopus.', photos: ['terrace', 'tapas selection'], rv: [['Nina H.', '1 week ago', 5, 'Great tapas and a sunny terrace. The octopus was perfect.']] },
    { name: 'Farmacia Sonnenland', cat: 'Services', type: 'Pharmacy', dist: '900 m', walk: '11 min walk', rating: '4.5', reviews: '96', hours: '09:00–22:00', open: true, addr: 'Calle Alcalde Enrique Jorge 2, Sonnenland', note: 'Open until 22:00 and English is spoken. For after-hours needs, check the duty pharmacy sign on the door.', photos: ['storefront'], rv: [['Claire D.', '2 months ago', 5, 'Helpful staff who speak English. Had what we needed.']] },
    { name: 'Hospital San Roque', cat: 'Emergency', type: 'Private hospital', dist: '1.8 km', walk: '5 min drive', rating: '3.9', reviews: '1,203', hours: 'Open 24 h', open: true, addr: 'Calle Mar de Siberia 1, Meloneras', note: 'Nearest 24-hour emergency room. Bring your passport and travel insurance details. For life-threatening emergencies call 112 first.', photos: ['entrance'], rv: [['Mark T.', '1 month ago', 4, 'Seen quickly in the ER, English-speaking doctors.']] }
  ];
  const TOPICS = {
    arrival: ['Arrival instructions', [['From the airport', 'Take the GC-1 south towards Maspalomas, exit Sonnenland. It is 33 km, about 30 minutes.'], ['Finding the villa', 'Modern white villa with palm trees at the front. Look for the number on the gate.'], ['Parking', 'Park in the driveway behind the gate.'], ['Getting in', 'The key box is to the right of the gate. Ilse sends the code before your stay.']]],
    kitchen: ['Kitchen & laundry', [['Nespresso', 'Capsules are in the drawer under the machine. A starter pack is included.'], ['Dishwasher', 'Tablets are under the sink. The eco programme takes about 3 hours.'], ['Washing machine', 'In the utility room. Detergent is on the shelf above.'], ['Tap water', 'Safe to drink but chlorinated. Bottled water is in the pantry.']]],
    comfort: ['Comfort', [['Air conditioning', 'The remotes are in the bedside drawers. Please switch it off when the terrace doors are open.'], ['TV', 'Netflix is logged in. Press Input to switch to HDMI.']]],
    pool: ['Pool & outdoor', [['Hours', '08:00–21:00. Please keep it quiet after 22:00.'], ['Heating', 'The pool can be heated on request, for an extra fee. Ask Ilse before your stay.'], ['Towels', 'Pool towels are in the chest on the terrace. Please use these, not the bath towels.'], ['Roof terraces', 'Sun beds and an outdoor shower upstairs. Please no glass up there.']]],
    cleaning: ['Cleaning & waste', [['Waste & recycling', 'Containers are at the end of the street. Yellow for plastic, blue for paper, green for glass.'], ['Linen', 'Fresh linen and towels every 7 days.'], ["What's included", 'Final cleaning, linen, towels and a starter kit of coffee, soap and dish tablets.']]],
    rules: ['House rules', [['Quiet hours', '22:00–08:00. The neighbours are close.'], ['Smoking', 'Only outside on the terrace.'], ['Parties & events', 'Not allowed.'], ['Pets', 'Not allowed.']]],
    checkout: ['Check-out', [['Time', 'By 11:00. Ask Ilse if you need a late check-out.'], ['Before you leave', 'Run the dishwasher, take the rubbish to the containers, switch off the AC and lights.'], ['Keys', 'Put the keys back in the key box and close the gate.']]]
  };
  const VILLA = [27.75593, -15.60642];
  const COORDS = [[27.7612, -15.5998], [27.7580, -15.6035], [27.7655, -15.6045], [27.7598, -15.5832], [27.7357, -15.5993], [27.7520, -15.5940], [27.7572, -15.6068], [27.7668, -15.5868]];
  const U = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;
  const PHOTO = { storefront: U('photo-1604719312566-8912e9227c6a'), 'bakery counter': U('photo-1509440159596-0249088772ff'), 'fresh produce': U('photo-1542838132-92c53300491e'), 'dining room': U('photo-1517248135467-4c7edcad34c4'), tiramisu: U('photo-1571877227200-a0d98ea607e9'), terrace: U('photo-1559339352-11d035aa65de'), 'wine aisle': U('photo-1510812431401-41d2bd2722f3'), 'bowling alley': U('photo-1545232979-8bf68ee9b1af'), 'ferris wheel': U('photo-1513889961551-628c1e5e2ee9'), 'go-karts': U('photo-1552072092-7f9b8d63efcb'), lighthouse: U('photo-1507525428034-b723cf961d3e'), 'dunes at sunset': U('photo-1473496169904-658ba7c44d8a'), promenade: U('photo-1534008757030-27299c4371b6'), 'tapas selection': U('photo-1515443961218-a51367888e4b'), entrance: U('photo-1519494026892-80bbd2d6fd0d') };
  const pimg = (p, label) => (p.cat === 'Services' && label === 'storefront') ? U('photo-1576602976047-174e57a47881') : (PHOTO[label] || PHOTO.terrace);
  const B = 'https://www.ilsewissink.com/_images/sites/ilse-wissink675/img/';
  const VILLA_IMG = { pool: B + 'IMG_4552--1037.jpeg?w=1200&h=1200&c=0', terrace: B + 'IMG20231104101643.jpeg?w=600&h=600&c=0', living: B + 'IMG_4559.jpeg?w=600&h=600&c=0' };
  const DET_IMG = { 'Getting in': U('photo-1558618666-fcd25c85cd64'), 'Air conditioning': U('photo-1585338107529-13afc5f02586'), Heating: U('photo-1572331165267-854da2b10ccc'), Dishwasher: U('photo-1584622650111-993a426fbf0a'), 'Waste & recycling': U('photo-1532996122724-e3c354a0b15b'), 'Washing machine': U('photo-1626806787461-102c1bfaaea1'), TV: U('photo-1593784991095-a205069470b6'), 'Roof terraces': U('photo-1600585154340-be6161a56a0c') };
  const DET_REAL = { 'Finding the villa': B + 'IMG_4552--1037.jpeg?w=900&h=900&c=0', Hours: B + 'IMG20231104101643.jpeg?w=900&h=900&c=0', Towels: B + 'IMG_4559.jpeg?w=900&h=900&c=0', Nespresso: B + '234--6522.jpg?w=900&h=900&c=0' };
  const THEMES = {
    dark: { bg: '#14130f', fg: '#f2efe6', card: '#1b1a15', sub: '#26241e', pop: '#1f1d18', line: '#2a2822', line2: '#4a463c', mute: '#a8a291', body: '#d6d1c3', btn: '#f2efe6', btnFg: '#14130f', accent: 'oklch(0.78 0.12 175)', accentFg: '#14130f', accentSoft: 'oklch(0.28 0.04 175)', accentLine: 'oklch(0.36 0.06 175)' },
    light: { bg: '#fbfaf7', fg: '#1a1916', card: '#ffffff', sub: '#ecebe6', pop: '#ffffff', line: '#e4e1d9', line2: '#cfcac0', mute: '#6b675f', body: '#3d3a34', btn: '#1a1916', btnFg: '#fbfaf7', accent: 'oklch(0.62 0.12 175)', accentFg: '#ffffff', accentSoft: 'oklch(0.95 0.03 175)', accentLine: 'oklch(0.88 0.05 175)' }
  };
  const dot = cat => `oklch(0.64 0.15 ${HUES[cat]})`;
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

  function mount(root, opts = {}) {
    let st = { tab: 'house', sel: null, det: null, sos: false, copied: false, map: false, cat: 'All' };
    let theme = opts.theme || 'light';
    let map = null, markers = [], L = null;

    root.classList.add('gg');
    root.innerHTML = `
      <div class="gg-map"></div>
      <div class="gg-shade"></div>
      <div class="gg-top">
        <img class="gg-logo" src="assets/img/guide/ilse-wissink-logo.png" alt="Ilse Wissink">
        <div class="gg-top-r">
          <div class="gg-row">
            <button type="button" class="gg-sos" data-gg="sos" aria-expanded="false">SOS</button>
            <span class="gg-lang">EN <i>▾</i></span>
          </div>
          <div class="gg-sos-pop" hidden></div>
        </div>
      </div>
      <div class="gg-chips-map" hidden></div>
      <div class="gg-ctrl"><button type="button" class="gg-toggle" data-gg="toggle"></button></div>
      <div class="gg-sheet">
        <button type="button" class="gg-handle" data-gg="toggle" aria-label="Expand or collapse"><span></span></button>
        <div class="gg-body"></div>
      </div>`;
    const $ = s => root.querySelector(s);

    const H = () => root.clientHeight || 760;
    const topM = s => s.map ? H() - 204 : (s.sel != null ? 300 : 200);

    function set(o) {
      const prev = st;
      st = { ...st, ...(typeof o === 'function' ? o(st) : o) };
      render();
      afterChange(prev);
    }

    // ---------- Rendering
    function render() {
      const c = THEMES[theme];
      for (const [k, v] of Object.entries(c)) root.style.setProperty('--' + k, v);
      root.dataset.theme = theme;
      const top = topM(st);
      $('.gg-sheet').style.top = top + 'px';
      $('.gg-ctrl').style.top = (top - 56) + 'px';
      $('.gg-toggle').innerHTML = `<span>${st.map ? '⤡' : '⤢'}</span>${st.map ? 'Guide' : 'Map'}`;
      $('.gg-sos').setAttribute('aria-expanded', st.sos);
      const pop = $('.gg-sos-pop');
      pop.hidden = !st.sos;
      pop.innerHTML = [
        ['Emergency', 'Police, ambulance, fire', '112', true],
        ['Hospital San Roque', '1.8 km · open 24 h', '↗'],
        ['Call Ilse (urgent)', '+34 600 000 000', '✆']
      ].map(([t, s, v, hot]) => `<div class="gg-sos-row${hot ? ' hot' : ''}"><div><b>${t}</b><span>${s}</span></div><strong>${v}</strong></div>`).join('');
      const chipsMap = $('.gg-chips-map');
      chipsMap.hidden = !st.map;
      chipsMap.innerHTML = chips('map');
      $('.gg-body').innerHTML = body();
      $('.gg-body').scrollTop = 0;
    }

    function chips(variant) {
      return CATS.map(v => `<button type="button" class="gg-chip${variant === 'map' ? ' on-map' : ''}${st.cat === v ? ' on' : ''}" data-gg="cat" data-v="${v}">${v}</button>`).join('');
    }

    function body() {
      const sp = st.sel != null ? PLACES[st.sel] : null;
      if (sp && st.map) return peek(sp);
      if (sp) return placeFull(sp);
      return `
        <div class="gg-head"><div><h1>Villa Palm Breeze</h1><div class="gg-mute">Sonnenland · Hosted by Ilse</div></div>
          <div class="gg-thumb"><img src="${VILLA_IMG.terrace}" alt="Villa Palm Breeze"><span>28</span></div></div>
        <div class="gg-seg">
          <button type="button" data-gg="tab" data-v="house" class="${st.tab === 'house' ? 'on' : ''}">The house</button>
          <button type="button" data-gg="tab" data-v="area" class="${st.tab === 'area' ? 'on' : ''}">The area</button>
        </div>
        <div class="gg-scroll">${st.tab === 'house' ? house() : area()}</div>`;
    }

    function house() {
      if (st.det) {
        const [title, items] = TOPICS[st.det];
        return `<button type="button" class="gg-back" data-gg="back">‹ Back</button>
          <div class="gg-det-title">${title}</div>
          ${items.map(([q, a]) => `<div class="gg-det"><b>${q}</b><p>${a}</p>${
            DET_REAL[q] ? `<img class="gg-det-img" src="${DET_REAL[q]}" alt="${esc(q)}" loading="lazy">` :
            DET_IMG[q] ? `<div class="gg-det-ph"><img src="${DET_IMG[q]}" alt="${esc(q)}" loading="lazy"><span>placeholder · host's own photo</span></div>` : ''}</div>`).join('')}
          ${ask()}`;
      }
      return `
        <div class="gg-card">
          <div class="gg-wifi"><div><div class="gg-mute sm">WiFi · PalmBreeze_5G</div><div class="gg-mono">sunny-patio-42</div></div>
            <button type="button" class="gg-copy" data-gg="copy">${st.copied ? 'Copied ✓' : 'Copy'}</button></div>
          <div class="gg-times"><div><div class="gg-mute sm">Check-in</div><b>From 15:00</b></div><div><div class="gg-mute sm">Check-out</div><b>By 11:00</b></div></div>
        </div>
        <div class="gg-card pad">
          <div class="gg-mute sm">Address</div>
          <div class="gg-addr">Calle Las Palmas 14, Sonnenland</div>
          <div class="gg-stack">
            <button type="button" class="gg-btn dark" data-gg="note" data-v="Opens the address in the guest's maps app.">Open in Maps ↗</button>
            <button type="button" class="gg-btn line" data-gg="arrival">Arrival instructions</button>
          </div>
        </div>
        <div class="gg-label">HOUSE MANUAL</div>
        <div>${['kitchen', 'comfort', 'pool', 'cleaning', 'rules', 'checkout'].map(t => `
          <button type="button" class="gg-topic" data-gg="det" data-v="${t}"><div><b>${TOPICS[t][0]}</b><span>${TOPICS[t][1].map(x => x[0]).join(', ')}</span></div><i>›</i></button>`).join('')}</div>
        ${ask()}`;
    }

    const ask = () => `<div class="gg-ask"><div><b>Didn't find it?</b><span>Ilse usually replies within an hour</span></div><button type="button" class="gg-btn line sm" data-gg="note" data-v="Opens a message to the host.">Message</button></div>`;

    function area() {
      const list = PLACES.map((p, i) => ({ p, i })).filter(({ p }) => st.cat === 'All' || p.cat === st.cat);
      return `<div class="gg-chips">${chips()}</div>
        <div class="gg-mute" style="margin-bottom:4px">Ilse's picks · ${list.length === 1 ? '1 place' : list.length + ' places'}</div>
        ${list.map(({ p, i }) => `<button type="button" class="gg-place" data-gg="sel" data-v="${i}">
          <img src="${pimg(p, p.photos[0])}" alt="${esc(p.name)}" loading="lazy">
          <div><b>${p.name}</b><span>${p.type} · ${p.dist}</span></div>
          <i style="background:${dot(p.cat)}">${i + 1}</i></button>`).join('')}`;
    }

    function placeFull(p) {
      return `<div class="gg-place-nav"><button type="button" class="gg-back" data-gg="clear">‹ All places</button><button type="button" class="gg-x" data-gg="clear" aria-label="Close">✕</button></div>
        <div class="gg-scroll">
          <div class="gg-cat"><i style="background:${dot(p.cat)}">${st.sel + 1}</i><span>${p.cat}</span></div>
          <h2 class="gg-pname">${p.name}</h2>
          <div class="gg-pmeta"><b>★ ${p.rating}</b><span>${p.reviews} Google reviews</span><span>·</span><span>${p.dist}</span><span>·</span><span>${p.walk}</span></div>
          <div class="gg-photos">${p.photos.map(l => `<div><img src="${pimg(p, l)}" alt="${esc(l)}" loading="lazy"><span>Google</span></div>`).join('')}</div>
          <div class="gg-tip"><div><img src="assets/img/guide/ilse-avatar.jpg" alt="Ilse"><b>Ilse's tip</b></div><p>${p.note}</p></div>
          <div class="gg-actions">
            <button type="button" class="gg-btn sq dark" data-gg="note" data-v="Opens directions in the guest's maps app.">Directions</button>
            <button type="button" class="gg-btn sq soft" data-gg="note" data-v="Calls the place.">Call</button>
            <button type="button" class="gg-btn sq soft" data-gg="note" data-v="Opens the place's website.">Website</button>
          </div>
          <div class="gg-card gg-hours">
            <div><span class="gg-mute">Today</span><b style="color:${p.open ? 'oklch(0.55 0.14 150)' : 'oklch(0.55 0.17 28)'}">${p.open ? 'Open' : 'Closed'}</b><span>${p.hours}</span></div>
            <div><span class="gg-mute">Address</span><span style="text-align:right">${p.addr}</span></div>
          </div>
          <div class="gg-label">GOOGLE REVIEWS</div>
          ${p.rv.map(([who, when, n, text]) => `<div class="gg-review"><div><b>${who}</b><span>${when}</span></div><div class="gg-stars">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</div><p>${text}</p></div>`).join('')}
          <div class="gg-mute sm" style="margin-top:12px">Photos, rating and reviews from Google.</div>
        </div>`;
    }

    function peek(p) {
      return `<div class="gg-peek">
        <div class="gg-peek-head"><div><b>${p.name}</b><span>${p.cat} · ${p.type} · ${p.dist}</span></div><button type="button" class="gg-x" data-gg="clear" aria-label="Close">✕</button></div>
        <p>“${p.note}” – Ilse</p>
        <button type="button" class="gg-btn dark" data-gg="note" data-v="Opens directions in the guest's maps app.">Directions ↗</button>
      </div>`;
    }

    // ---------- Events
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-gg]');
      if (!b) { if (st.sos && !e.target.closest('.gg-sos-pop')) set({ sos: false }); return; }
      const v = b.dataset.v;
      switch (b.dataset.gg) {
        case 'sos': set(s => ({ sos: !s.sos })); break;
        case 'toggle': set(s => ({ map: !s.map, det: null, sel: s.map ? null : s.sel, sos: false })); break;
        case 'tab': set({ tab: v, det: null }); break;
        case 'cat': set({ cat: v, sel: null }); break;
        case 'sel': set({ sel: +v, tab: 'area', map: false }); break;
        case 'clear': set({ sel: null }); break;
        case 'det': set({ det: v }); break;
        case 'back': set({ det: null }); break;
        case 'arrival': set({ det: 'arrival', tab: 'house', map: false }); break;
        case 'copy':
          navigator.clipboard?.writeText('sunny-patio-42').catch(() => {});
          set({ copied: true }); setTimeout(() => set({ copied: false }), 1500); break;
        case 'note': opts.onNote?.(v); break;
      }
    });

    // ---------- Map
    function icon(i, on) {
      const p = PLACES[i], s = on ? 34 : 26;
      return L.divIcon({ className: '', iconSize: [s, s], iconAnchor: [s / 2, s / 2], html: `<div class="gg-pin" style="width:${s}px;height:${s}px;background:oklch(0.62 0.15 ${HUES[p.cat]});border-color:${on ? THEMES[theme].fg : '#fff'}">${i + 1}</div>` });
    }
    function initMap() {
      if (map || !window.L || !root.clientWidth) return;
      L = window.L;
      map = L.map($('.gg-map'), { zoomControl: false, attributionControl: true, fadeAnimation: false, zoomSnap: 0.25, scrollWheelZoom: false });
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles © Esri', maxZoom: 19, crossOrigin: true }).addTo(map);
      L.marker(VILLA, { icon: L.divIcon({ className: '', html: '<div class="gg-villa"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }), zIndexOffset: 500 }).addTo(map);
      markers = PLACES.map((p, i) => L.marker(COORDS[i]).on('click', () => set(s => ({ sel: i, tab: 'area', map: s.map }))));
      map.setView(VILLA, 14);
      sync();
      const refit = () => { try { map.invalidateSize(); fit(); } catch (_) {} };
      requestAnimationFrame(refit); setTimeout(refit, 300);
    }
    function sync() {
      if (!map) return;
      const showAll = st.tab === 'area' || st.map;
      markers.forEach((m, i) => {
        const show = showAll && (st.cat === 'All' || PLACES[i].cat === st.cat);
        if (show && !map.hasLayer(m)) m.addTo(map);
        if (!show && map.hasLayer(m)) m.remove();
        const on = i === st.sel;
        if (m.__sel !== on || !m._icon || m.__theme !== theme) { m.setIcon(icon(i, on)); m.setZIndexOffset(on ? 1000 : 0); m.__sel = on; m.__theme = theme; }
      });
    }
    function centerOffset() { return H() / 2 - (64 + topM(st)) / 2; }
    function fit() {
      if (!map) return;
      const vis = COORDS.filter((_, i) => st.cat === 'All' || PLACES[i].cat === st.cat);
      const pts = (!st.map && st.tab !== 'area') ? [VILLA] : [VILLA, ...vis];
      if (pts.length === 1) {
        map.setView(VILLA, 16, { animate: false });
        map.panBy([0, centerOffset()], { animate: false });
      } else {
        map.fitBounds(pts, { paddingTopLeft: [24, 70], paddingBottomRight: [24, H() - topM(st) + 24], animate: false, maxZoom: 15 });
      }
    }
    function focus(i) {
      map.setView(COORDS[i], Math.max(map.getZoom(), 15), { animate: true });
      setTimeout(() => map.panBy([0, centerOffset()]), 300);
    }
    function afterChange(a) {
      if (!map) return initMap();
      sync();
      const b = st;
      if (a.map !== b.map || a.tab !== b.tab || (a.sel == null) !== (b.sel == null)) {
        setTimeout(() => { map.invalidateSize(); sync(); b.sel != null ? focus(b.sel) : fit(); }, 380);
      } else if (b.sel != null && a.sel !== b.sel) focus(b.sel);
      else if (a.cat !== b.cat) fit();
    }

    new ResizeObserver(() => { if (!map) initMap(); else { map.invalidateSize(); } }).observe(root);
    render();

    return {
      set,
      get state() { return st; },
      setTheme(t) { theme = t; render(); sync(); },
      // Deep links: arrival | house | area
      go(name) {
        if (name === 'arrival') set({ tab: 'house', det: 'arrival', sel: null, map: false, sos: false });
        else if (name === 'area' || name === 'around') set({ tab: 'area', det: null, sel: null, map: false, sos: false });
        else set({ tab: 'house', det: null, sel: null, map: false, sos: false });
      },
      ready: initMap
    };
  }

  window.GuestGuide = { mount };
})();
