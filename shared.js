/* ===================================================================
   Nawabs - Shared Data & Sync Engine
   Provides: GunturDB (data + live sync), GunturUtils, GunturSound
   Live sync: changes sync via ntfy.sh + BroadcastChannel across devices
   =================================================================== */
(function (global) {
  'use strict';
  const CFG = { server: 'https://ntfy.sh', topic: 'gunturgongura-1660b6320315', storeKey: 'GUNTUR_DB_V3', since: '12h' };
  const IMG = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80';
  const M = (id, name, category, price, isVeg, spice, emoji, desc, image) =>
    ({ id, name, category, price, isVeg, spice, emoji, desc, image: image || IMG, available: true, u: 0 });

  // Official Menu Cards Metadata
  const MENU_CARDS = [
    { id: 1, file: 'menu/menu_card_1.webp', title: 'Non-Veg Curries & Seafood', category: 'Main Course', subtitle: 'Chicken, Mutton, Fish & Prawn Curries' },
    { id: 2, file: 'menu/menu_card_2.webp', title: 'Soups & Veg Starters', category: 'Starters', subtitle: 'Manchow, Sweet Corn, Manchurian & 65' },
    { id: 4, file: 'menu/menu_card_4.webp', title: 'Breads, Baskets & Fried Rice', category: 'Breads & Rice', subtitle: 'Pulka, Naan, Kulcha & Chef Fried Rice' },
    { id: 5, file: 'menu/menu_card_5.webp', title: 'Chef Specials & Starters', category: 'Starters', subtitle: 'Chicken 555, Majestic, Lollipops & Wings' },
    { id: 6, file: 'menu/menu_card_6.webp', title: 'Tandoori & Kebabs', category: 'Tandoori', subtitle: 'Tandoori Chicken, Tikka & Veg Kebabs' },
    { id: 7, file: 'menu/menu_card_7.webp', title: 'Main Course Veg', category: 'Main Course', subtitle: 'Paneer, Kaju, Mushroom & Andhra Curries' }
  ];

  // Authentic Dishes from Guntur Gongura Menu Cards
  const DEFAULT_MENU = [
    // Biryani & Rice
    M(1, 'Guntur Chicken Biryani', 'Biryani', 320, false, 4, '🍗', 'Dum-cooked fragrant basmati with fiery Guntur chilli masala and boiled egg.'),
    M(2, 'Mutton Biryani', 'Biryani', 420, false, 3, '🍖', 'Tender slow-cooked mutton layered with saffron basmati rice and mirchi ka salan.'),
    M(3, 'Veg Fried Rice', 'Breads & Rice', 219, true, 2, '🍚', 'Wok-tossed basmati with crisp garden vegetables and spring onions.'),
    M(4, 'Corn Kaju Fried Rice', 'Breads & Rice', 269, true, 2, '🍚', 'Golden sweet corn and roasted whole cashews tossed in aromatic rice.'),
    M(5, 'Veg Schezwan Rice', 'Breads & Rice', 249, true, 3, '🌶️', 'Fiery wok-tossed basmati rice infused with Schezwan peppers and vegetables.'),

    // Starters - Non-Veg (Card 5 & Card 1)
    M(6, 'Guntur Chilli Chicken', 'Starters', 260, false, 4, '🌶️', 'Signature fiery Andhra-style dry chicken fry with roasted Guntur red chillies.'),
    M(7, 'Chicken 555', 'Starters', 329, false, 3, '🍗', 'Crispy spiced chicken strips tossed in chef special tangy garlic sauce.'),
    M(8, 'Chicken Majestic', 'Starters', 329, false, 3, '🍗', 'Tender fried chicken tossed with curd, curry leaves, ginger and green chillies.'),
    M(9, 'Chicken Lollipops', 'Starters', 339, false, 3, '🍗', 'Frenched chicken drumettes coated in spicy marinade, fried crisp.'),
    M(10, 'Drums of Heaven', 'Starters', 339, false, 3, '🍗', 'Crispy chicken lollipops tossed in a zesty sweet-and-spicy garlic glaze.'),
    M(11, 'Barbeque Chicken Wings', 'Starters', 349, false, 3, '🍗', 'Succulent wings charred with smoky sweet barbeque glaze.'),
    M(12, 'Fish 65 / Chilli', 'Starters', 339, false, 3, '🐟', 'Crisp fish fillets coated in seasoned batter and tossed with curry leaves.'),
    M(13, 'Prawns Chilli / Manchuria', 'Starters', 349, false, 3, '🍤', 'Tender prawns tossed with bell peppers, spring onions and crushed chillies.'),

    // Starters - Veg (Card 2 & Card 5)
    M(14, 'Paneer Majestic', 'Starters', 289, true, 3, '🧀', 'Crispy paneer fingers tossed in creamy mint and curry-leaf masala.'),
    M(15, 'Veg Manchurian', 'Starters', 269, true, 2, '🥦', 'Fried vegetable dumplings tossed in rich soy-garlic Manchurian gravy.'),
    M(16, 'Gobi 65 / Chilli', 'Starters', 269, true, 3, '🥦', 'Crisp cauliflower florets spiced with red chillies, ginger and curry leaves.'),
    M(17, 'Crispy Corn', 'Starters', 269, true, 2, '🌽', 'Crunchy American corn kernels tossed with onions and chaat masala.'),
    M(18, 'Baby Corn Salt & Pepper', 'Starters', 279, true, 2, '🌽', 'Golden fried baby corn seasoned with crushed black pepper and scallions.'),
    M(19, 'Veg Bullets', 'Starters', 269, true, 2, '🧆', 'Crisp minced vegetable and spiced potato croquettes fried to perfection.'),

    // Tandoori & Kebabs (Card 6)
    M(20, 'Chicken Half Tandoori', 'Tandoori', 349, false, 3, '🍗', 'Classic clay-oven roasted chicken marinated in spiced yogurt and mustard oil.'),
    M(21, 'Chicken Full Tandoori', 'Tandoori', 569, false, 3, '🍗', 'Whole chicken roasted over hot charcoal with authentic tandoori spices.'),
    M(22, 'Tangdi Kabab', 'Tandoori', 319, false, 3, '🍗', 'Juicy marinated chicken drumsticks charred in tandoor with aromatic herbs.'),
    M(23, 'Chicken Tikka', 'Tandoori', 319, false, 3, '🍢', 'Boneless chicken cubes grilled with smoky tandoori marinade.'),
    M(24, 'Chicken Banjara Kabab', 'Tandoori', 329, false, 3, '🍢', 'Chicken skewers infused with crushed coriander, ginger, garlic and mint.'),
    M(25, 'Paneer Tikka', 'Tandoori', 309, true, 2, '🧀', 'Fresh cottage cheese cubes and bell peppers roasted in tandoor.'),
    M(26, 'Mushroom Tikka', 'Tandoori', 309, true, 2, '🍄', 'Button mushrooms marinated in spiced hung curd and skewered.'),

    // Main Course - Non-Veg (Card 1)
    M(27, 'Gongura Chicken Curry', 'Main Course', 339, false, 3, '🥘', 'Authentic Andhra chicken cooked in tangy gongura (sorrel leaf) gravy.'),
    M(28, 'Gongura Mutton Curry', 'Main Course', 399, false, 3, '🥘', 'Tender slow-cooked mutton in iconic sorrel leaf paste and spices.'),
    M(29, 'Andhra Chicken Curry', 'Main Course', 319, false, 4, '🥘', 'Traditional spicy home-style chicken curry with freshly roasted spices.'),
    M(30, 'Butter Chicken', 'Main Course', 349, false, 2, '🥘', 'Tender tandoori chicken simmered in rich creamy tomato butter gravy.'),
    M(31, 'Kadai Chicken', 'Main Course', 339, false, 3, '🥘', 'Chicken cooked with bell peppers, onions, and freshly ground kadai spices.'),
    M(32, 'Mutton Rogan Josh', 'Main Course', 389, false, 3, '🥘', 'Kashmiri-style rich mutton curry with aromatic Kashmiri spices.'),
    M(33, 'Mutton Fry', 'Main Course', 399, false, 4, '🥘', 'Dry-roasted spicy mutton pieces tossed with caramelized onions and curry leaves.'),
    M(34, 'Fish Curry', 'Main Course', 369, false, 3, '🐟', 'Traditional Andhra fish curry stewed in a tangy tamarind and spice gravy.'),
    M(35, 'Prawn Curry', 'Main Course', 399, false, 3, '🍤', 'Succulent prawns cooked in fragrant coconut-tomato curry.'),

    // Main Course - Veg (Card 7)
    M(36, 'Gongura Pappu', 'Main Course', 160, true, 2, '🍲', 'Comforting toor dal cooked with sorrel leaves and garlic ghee tadka.'),
    M(37, 'Gutti Vankaya Curry', 'Main Course', 190, true, 3, '🍆', 'Baby brinjals stuffed with peanut, sesame, and dry-coconut masala.'),
    M(38, 'Paneer Butter Masala', 'Main Course', 289, true, 2, '🧀', 'Soft paneer cubes in a velvety tomato-butter cream gravy.'),
    M(39, 'Kaju Paneer Curry', 'Main Course', 309, true, 2, '🧀', 'Rich royal curry with whole cashews and cottage cheese cubes.'),
    M(40, 'Palak Paneer', 'Main Course', 279, true, 2, '🥬', 'Fresh spinach puree tempered with garlic and soft paneer cubes.'),
    M(41, 'Kaju Tomato Curry', 'Main Course', 279, true, 2, '🍅', 'Roasted cashew nuts simmered in rich tangy tomato gravy.'),
    M(42, 'Veg Kolhapuri', 'Main Course', 289, true, 4, '🥘', 'Mixed garden vegetables in a fiery red Kolhapuri spiced masala.'),

    // Breads & Baskets (Card 4)
    M(43, 'Pulka (2 pcs)', 'Breads & Rice', 29, true, 1, '🫓', 'Soft whole-wheat phulkas puffed on flame.'),
    M(44, 'Butter Naan', 'Breads & Rice', 59, true, 1, '🫓', 'Tandoor-baked leavened bread glazed with fresh butter.'),
    M(45, 'Garlic Naan', 'Breads & Rice', 69, true, 1, '🫓', 'Tandoori naan topped with minced garlic and coriander.'),
    M(46, 'Tandoori Roti', 'Breads & Rice', 39, true, 1, '🫓', 'Classic whole-wheat tandoori flatbread.'),
    M(47, 'Masala Kulcha', 'Breads & Rice', 89, true, 2, '🫓', 'Stuffed kulcha filled with spiced potato and herbs.'),

    // Soups (Card 2)
    M(48, 'Tomato Rasam', 'Soups', 90, true, 2, '🥣', 'Peppery tamarind-tomato broth tempered with curry leaves and mustard.'),
    M(49, 'Veg Manchow Soup', 'Soups', 139, true, 2, '🥣', 'Hot and spicy thick vegetable soup topped with crispy fried noodles.'),
    M(50, 'Sweet Corn Soup', 'Soups', 119, true, 1, '🌽', 'Comforting creamy corn broth with tender sweet corn kernels.'),
    M(51, 'Chicken Manchow Soup', 'Soups', 149, false, 2, '🥣', 'Hearty chicken and vegetable soup with crispy fried noodles.'),
    M(52, 'Chicken Tom Yum Soup', 'Soups', 149, false, 3, '🥣', 'Zesty Thai-inspired soup with lemongrass, galangal and chicken.'),
    M(53, 'Mutton Soup', 'Soups', 189, false, 3, '🥣', 'Rich bone-marrow broth infused with crushed black pepper.'),

    // Beverages & Desserts
    M(54, 'Masala Buttermilk', 'Beverages', 60, true, 1, '🥛', 'Chilled spiced buttermilk with ginger, green chilli, and coriander.'),
    M(55, 'Fresh Lime Soda', 'Beverages', 70, true, 1, '🍋', 'Refreshing fizz with sweet or salted freshly squeezed lime juice.'),
    M(56, 'Bobbatlu with Ghee', 'Desserts', 110, true, 1, '🥞', 'Warm sweet stuffed flatbread made with chana dal, jaggery and desi ghee.'),
    M(57, 'Double Ka Meetha', 'Desserts', 130, true, 1, '🍮', 'Hyderabadi royal fried bread soaked in saffron-cardamom thickened milk.')
  ];

  const DEFAULT_SETTINGS = {
    name: 'Nawabs',
    tagline: 'Royal Mughlai & Andhra Cuisine',
    wifiSSID: 'Nawabs_Dining_5G',
    wifiPassword: 'Nawabs@2026',
    phone: '+91 00000 00000',
    gstRate: 5,
    u: 0
  };

  const DEFAULT_STAFF = [
    { email: 'staff@restaurant.com', password: 'password123', name: 'Standard Staff', role: 'Staff', created_at: '2026-01-01T00:00:00.000Z' },
    { email: 'admin@restaurant.com', password: 'admin123', name: 'Restaurant Admin', role: 'Manager', created_at: '2026-01-01T00:00:00.000Z' }
  ];

  function fresh() {
    return {
      menu: JSON.parse(JSON.stringify(DEFAULT_MENU)),
      orders: [],
      serviceRequests: [],
      feedbacks: [],
      staff: JSON.parse(JSON.stringify(DEFAULT_STAFF)),
      settings: { ...DEFAULT_SETTINGS },
      sessions: {},
      tomb: {},
      resetAt: 0
    };
  }

  const persist = () => {
    try {
      localStorage.setItem(CFG.storeKey, JSON.stringify(S));
    } catch (e) {}
  };

  let S;
  try {
    S = JSON.parse(localStorage.getItem(CFG.storeKey));
  } catch (e) {
    S = null;
  }
  if (!S || !S.menu || !Array.isArray(S.menu) || S.menu.length < 20) {
    S = fresh();
  }
  if (S.settings && (S.settings.name === 'The Guntur Gongura' || S.settings.name === 'Guntur Gongura' || !S.settings.name)) {
    S.settings.name = 'Nawabs';
    S.settings.tagline = 'Royal Mughlai & Andhra Cuisine';
    S.settings.wifiSSID = 'Nawabs_Dining_5G';
    S.settings.wifiPassword = 'Nawabs@2026';
    persist();
  }
  if (!Array.isArray(S.feedbacks)) S.feedbacks = [];
  if (!Array.isArray(S.staff) || !S.staff.length) S.staff = JSON.parse(JSON.stringify(DEFAULT_STAFF));

  const subs = new Set();
  const notify = meta => subs.forEach(fn => {
    try {
      fn(S, meta || { type: 'SYNC' });
    } catch (e) {
      console.error(e);
    }
  });
  const now = () => Date.now();
  const byNew = (a, b) => (b.createdAt || 0) - (a.createdAt || 0);

  /* ---------- Apply event (local or remote) ---------- */
  function apply(op) {
    const i = op && op.i;
    if (!i) return null;

    if (op.k === 'reset') {
      if (i.u <= S.resetAt) return null;
      S.resetAt = i.u;
      S.orders = [];
      S.serviceRequests = [];
      S.sessions = {};
      S.feedbacks = [];
      return { type: 'RESET' };
    }

    if (['order', 'sr', 'session'].includes(op.k) && (i.u || 0) <= S.resetAt) return null;

    if (op.k === 'order' || op.k === 'sr') {
      const L = op.k === 'order' ? S.orders : S.serviceRequests;
      const j = L.findIndex(x => x.id === i.id);
      if (j >= 0 && (i.u || 0) <= (L[j].u || 0)) return null;
      const prev = j >= 0 ? L[j] : null;
      if (j >= 0) L[j] = i;
      else L.push(i);
      L.sort(byNew);

      if (op.k === 'order') {
        if (!prev) return { type: 'ORDER_CREATED', orderId: i.id, tableId: i.tableId, newStatus: i.status };
        if (prev.status !== i.status) return { type: 'ORDER_STATUS_CHANGED', orderId: i.id, tableId: i.tableId, newStatus: i.status, oldStatus: prev.status };
        return { type: 'ORDER_UPDATED', orderId: i.id };
      }
      if (!prev) return { type: 'SERVICE_REQUEST_CREATED', requestId: i.id, tableId: i.tableId, reqType: i.type };
      if (prev.status === 'PENDING' && i.status === 'RESOLVED') return { type: 'SERVICE_REQUEST_RESOLVED', requestId: i.id, tableId: i.tableId };
      return { type: 'SERVICE_REQUEST_UPDATED', requestId: i.id };
    }

    if (op.k === 'menu') {
      const t = S.tomb[i.id] || 0;
      if ((i.u || 0) <= t) return null;
      const j = S.menu.findIndex(x => x.id === i.id);
      if (i.deleted) {
        S.tomb[i.id] = i.u;
        if (j < 0) return null;
        S.menu.splice(j, 1);
        return { type: 'MENU_CHANGED' };
      }
      if (j >= 0) {
        if ((i.u || 0) <= (S.menu[j].u || 0)) return null;
        S.menu[j] = i;
      } else {
        S.menu.push(i);
      }
      return { type: 'MENU_CHANGED' };
    }

    if (op.k === 'settings') {
      if ((i.u || 0) <= (S.settings.u || 0)) return null;
      S.settings = { ...S.settings, ...i };
      return { type: 'SETTINGS_CHANGED' };
    }

    if (op.k === 'session') {
      const cur = S.sessions[i.tableId];
      if (cur && (i.u || 0) <= (cur.u || 0)) return null;
      S.sessions[i.tableId] = i;
      return { type: 'SESSION' };
    }

    if (op.k === 'feedback') {
      S.feedbacks = S.feedbacks || [];
      const j = S.feedbacks.findIndex(x => x.id === i.id);
      if (j >= 0) S.feedbacks[j] = i;
      else S.feedbacks.unshift(i);
      return { type: 'FEEDBACK_RECEIVED', feedback: i };
    }

    if (op.k === 'staff') {
      S.staff = Array.isArray(i) ? i : (S.staff || JSON.parse(JSON.stringify(DEFAULT_STAFF)));
      return { type: 'STAFF_CHANGED' };
    }

    return null;
  }

  /* ---------- Networking: ntfy (all devices) + BroadcastChannel (same browser) ---------- */
  const bc = ('BroadcastChannel' in global) ? new BroadcastChannel(CFG.topic) : null;
  let lastId = '';

  function publish(op) {
    let body = JSON.stringify(op);
    if (body.length > 3900 && op.k === 'order') {
      op = JSON.parse(body);
      op.i.items.forEach(x => delete x.emoji);
      body = JSON.stringify(op);
    }
    try { bc && bc.postMessage(body); } catch (e) {}
    try { fetch(CFG.server + '/' + CFG.topic, { method: 'POST', body }).catch(() => {}); } catch (e) {}
  }

  function remote(op, quiet) {
    const m = apply(op);
    if (m) {
      persist();
      if (!quiet) notify(m);
    }
    return !!m;
  }

  function got(msg, quiet) {
    if (msg.id) lastId = msg.id;
    if (msg.event === 'message' && msg.message) {
      try { return remote(JSON.parse(msg.message), quiet); } catch (e) {}
    }
    return false;
  }

  if (bc) bc.onmessage = e => {
    try { remote(JSON.parse(e.data), false); } catch (x) {}
  };

  async function pull(since, quiet) {
    try {
      const r = await fetch(CFG.server + '/' + CFG.topic + '/json?poll=1&since=' + since);
      const lines = (await r.text()).split('\n').filter(Boolean);
      let changed = false;
      lines.forEach(l => {
        try { if (got(JSON.parse(l), quiet)) changed = true; } catch (e) {}
      });
      if (quiet && changed) notify({ type: 'SYNC' });
    } catch (e) {}
  }

  function live() {
    try {
      const es = new EventSource(CFG.server + '/' + CFG.topic + '/sse' + (lastId ? '?since=' + lastId : ''));
      es.onmessage = e => {
        try { got(JSON.parse(e.data), false); } catch (x) {}
      };
    } catch (e) {}
  }

  pull(CFG.since, true).then(live);
  setInterval(() => { if (lastId) pull(lastId, false); }, 20000);

  /* ---------- Local mutations ---------- */
  function mutate(op) {
    const m = apply(op);
    persist();
    publish(op);
    notify(m || { type: 'SYNC' });
    return m;
  }

  const rid = () => String(Math.floor(10000 + Math.random() * 89999));
  const uid = () => {
    let id;
    do { id = rid(); } while (S.orders.some(o => o.id === id));
    return id;
  };

  const DB = {
    get state() { return S; },
    get menuCards() { return MENU_CARDS; },
    subscribe(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },

    createOrder(d) {
      const t = now();
      const o = {
        id: uid(),
        tableId: d.tableId,
        guestName: d.guestName || 'Guest',
        items: d.items || [],
        notes: d.notes || '',
        subtotal: d.subtotal || 0,
        tax: d.tax || 0,
        total: d.total || 0,
        sessionToken: d.sessionToken || '',
        status: 'PLACED',
        createdAt: t,
        updatedAt: t,
        u: t
      };
      mutate({ k: 'order', i: o });
      return o;
    },

    updateOrderStatus(id, status, extra) {
      const o = S.orders.find(x => x.id === id);
      if (!o) return null;
      const t = now();
      const n = { ...o, ...(extra || {}), status, updatedAt: t, u: Math.max(t, (o.u || 0) + 1) };
      n[status.toLowerCase() + 'At'] = t;
      mutate({ k: 'order', i: n });
      return n;
    },

    createServiceRequest(tableId, type) {
      const t = now();
      const r = { id: 'SR' + rid(), tableId, type: type || 'Assistance', status: 'PENDING', createdAt: t, u: t };
      mutate({ k: 'sr', i: r });
      return r;
    },

    resolveServiceRequest(id) {
      const r = S.serviceRequests.find(x => x.id === id);
      if (!r) return null;
      const t = now();
      const n = { ...r, status: 'RESOLVED', resolvedAt: t, u: Math.max(t, (r.u || 0) + 1) };
      mutate({ k: 'sr', i: n });
      return n;
    },

    addMenuItem(it) {
      const t = now();
      const n = { available: true, ...it, id: t, u: t };
      mutate({ k: 'menu', i: n });
      return n;
    },

    toggleMenuAvailability(id) {
      const it = S.menu.find(x => x.id == id);
      if (!it) return;
      mutate({ k: 'menu', i: { ...it, available: it.available === false, u: Math.max(now(), (it.u || 0) + 1) } });
    },

    deleteMenuItem(id) {
      mutate({ k: 'menu', i: { id: S.menu.find(x => x.id == id)?.id ?? id, deleted: true, u: now() } });
    },

    updateSettings(s) {
      mutate({ k: 'settings', i: { ...s, u: Math.max(now(), (S.settings.u || 0) + 1) } });
    },

    getOrCreateTableSession(tableId, guestName) {
      const cur = S.sessions[tableId];
      if (cur && cur.token && cur.status !== 'FREE') {
        if (guestName && !cur.guestName) {
          cur.guestName = guestName;
          mutate({ k: 'session', i: cur });
        }
        return cur.token;
      }
      const token = 'S-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      const sess = {
        tableId,
        token,
        guestName: (guestName || '').trim(),
        status: 'OCCUPIED',
        startedAt: now(),
        u: now()
      };
      mutate({ k: 'session', i: sess });
      return token;
    },

    registerTableSession(tableId, guestName) {
      const cur = S.sessions[tableId];
      const token = cur && cur.token ? cur.token : ('S-' + Math.random().toString(36).slice(2, 6).toUpperCase());
      const sess = {
        tableId,
        token,
        guestName: (guestName || 'Guest').trim(),
        status: 'OCCUPIED',
        startedAt: now(),
        u: now()
      };
      mutate({ k: 'session', i: sess });
      return sess;
    },

    clearTableSession(tableId) {
      const sess = {
        tableId,
        token: '',
        guestName: '',
        status: 'FREE',
        clearedAt: now(),
        u: now()
      };
      mutate({ k: 'session', i: sess });
      return sess;
    },

    isTableOccupied(tableId) {
      const hasActiveOrder = S.orders.some(o => o.tableId === tableId && !['COMPLETED', 'REJECTED'].includes(o.status));
      const sess = S.sessions[tableId];
      const hasActiveSession = sess && sess.status === 'OCCUPIED';
      return hasActiveOrder || hasActiveSession;
    },

    getTableDetails(tableId) {
      const activeOrders = S.orders.filter(o => o.tableId === tableId && !['COMPLETED', 'REJECTED'].includes(o.status));
      const sess = S.sessions[tableId] || {};
      const isOccupied = activeOrders.length > 0 || sess.status === 'OCCUPIED';
      const total = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      let guestName = sess.guestName;
      if (!guestName && activeOrders.length > 0) {
        guestName = activeOrders[0].guestName;
      }
      return {
        tableId,
        isOccupied,
        guestName: isOccupied ? (guestName || 'Guest') : '',
        activeOrders,
        total,
        sessionToken: sess.token || ''
      };
    },

    settleTable(tableId) {
      const activeOrders = S.orders.filter(o => o.tableId === tableId && !['COMPLETED', 'REJECTED'].includes(o.status));
      activeOrders.forEach(o => {
        DB.updateOrderStatus(o.id, 'COMPLETED');
      });
      const srs = S.serviceRequests.filter(r => r.tableId === tableId && r.status === 'PENDING');
      srs.forEach(r => DB.resolveServiceRequest(r.id));
      DB.clearTableSession(tableId);
      return activeOrders;
    },

    resetToDefaults() {
      S.menu = JSON.parse(JSON.stringify(DEFAULT_MENU));
      mutate({ k: 'reset', i: { u: now() } });
    },

    saveFeedback(data) {
      const t = now();
      const fb = {
        id: 'FB' + rid(),
        tableId: data.tableId,
        guestName: data.guestName || 'Guest',
        rating: data.rating || 5,
        tags: data.tags || [],
        comment: data.comment || '',
        paymentMethod: data.paymentMethod || 'UPI',
        createdAt: t,
        u: t
      };
      S.feedbacks = S.feedbacks || [];
      mutate({ k: 'feedback', i: fb });
      return fb;
    },

    getFeedbacks() {
      return (S.feedbacks || []).slice().sort(byNew);
    },

    getCombinedTableBill(tableId) {
      const orders = S.orders.filter(o => o.tableId === tableId && o.status !== 'REJECTED');
      const activeOrders = orders.filter(o => o.status !== 'COMPLETED');
      const previousOrders = orders.filter(o => o.status === 'COMPLETED');

      const allItems = [];
      const itemMap = {};
      orders.forEach(o => {
        (o.items || []).forEach(it => {
          const key = (it.id || '') + '_' + it.name;
          if (!itemMap[key]) {
            itemMap[key] = { ...it, qty: 0 };
            allItems.push(itemMap[key]);
          }
          itemMap[key].qty += it.qty;
        });
      });

      const subtotal = orders.reduce((sum, o) => sum + (o.subtotal || (o.total - (o.tax || 0))), 0);
      const tax = orders.reduce((sum, o) => sum + (o.tax || 0), 0);
      const total = orders.reduce((sum, o) => sum + (o.total || 0), 0);

      return {
        tableId,
        orders,
        activeOrders,
        previousOrders,
        combinedItems: allItems,
        subtotal,
        tax,
        total,
        grandTotal: total,
        orderCount: orders.length,
        ordersCount: orders.length
      };
    },

    getStats() {
      const valid = S.orders.filter(o => o.status !== 'REJECTED');
      const counts = {};
      valid.forEach(o => o.items.forEach(it => {
        counts[it.name] = (counts[it.name] || 0) + it.qty;
      }));
      const occupiedSet = new Set(S.orders.filter(o => !['COMPLETED', 'REJECTED'].includes(o.status)).map(o => o.tableId));
      Object.keys(S.sessions || {}).forEach(tid => {
        if (S.sessions[tid] && S.sessions[tid].status === 'OCCUPIED') {
          occupiedSet.add(tid);
        }
      });
      return {
        totalRevenue: valid.reduce((a, o) => a + (o.total || 0), 0),
        totalOrders: valid.length,
        occupiedTables: occupiedSet.size,
        popularItems: Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6)
      };
    },

    async authenticateStaff(email, password) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPw = (password || '').trim();
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: cleanPw })
        });
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('application/json')) {
          return await res.json();
        }
      } catch (e) {
        // Fallback when deployed statically (e.g., Vercel without Node server.js)
      }

      const list = Array.isArray(S.staff) && S.staff.length ? S.staff : DEFAULT_STAFF;
      const match = list.find(s => (s.email || '').toLowerCase() === cleanEmail && s.password === cleanPw);
      if (match) {
        return { ok: true, staff: { email: match.email, name: match.name, role: match.role } };
      }
      return { ok: false, error: 'Invalid email or password.' };
    },

    async getStaffList() {
      try {
        const res = await fetch('/api/staff');
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (res.ok && ct.includes('application/json')) {
          const data = await res.json();
          if (data.ok && Array.isArray(data.staff)) return data.staff;
        }
      } catch (e) {}
      return Array.isArray(S.staff) && S.staff.length ? S.staff : DEFAULT_STAFF;
    },

    async addStaffAccount({ name, email, password, role }) {
      const cleanEmail = (email || '').trim();
      const cleanPw = (password || '').trim();
      const cleanName = (name || cleanEmail.split('@')[0]).trim();
      const cleanRole = (role || 'Staff').trim();
      try {
        const res = await fetch('/api/staff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cleanName, email: cleanEmail, password: cleanPw, role: cleanRole })
        });
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('application/json')) {
          const data = await res.json();
          return { ok: res.ok, ...data };
        }
      } catch (e) {}

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return { ok: false, error: 'Please enter a valid email address' };
      }
      S.staff = Array.isArray(S.staff) && S.staff.length ? S.staff : JSON.parse(JSON.stringify(DEFAULT_STAFF));
      if (S.staff.some(s => (s.email || '').toLowerCase() === cleanEmail.toLowerCase())) {
        return { ok: false, error: `Staff email "${cleanEmail}" already exists!` };
      }
      S.staff.push({ email: cleanEmail, password: cleanPw, name: cleanName, role: cleanRole, created_at: new Date().toISOString() });
      persist();
      publish({ k: 'staff', i: S.staff });
      notify({ type: 'STAFF_CHANGED' });
      return { ok: true, msg: 'Staff account created!' };
    },

    async updateStaffPassword(email, password) {
      const cleanPw = (password || '').trim();
      try {
        const res = await fetch(`/api/staff/${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: cleanPw })
        });
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('application/json')) {
          const data = await res.json();
          return { ok: res.ok, ...data };
        }
      } catch (e) {}

      S.staff = Array.isArray(S.staff) && S.staff.length ? S.staff : JSON.parse(JSON.stringify(DEFAULT_STAFF));
      const idx = S.staff.findIndex(s => (s.email || '').toLowerCase() === email.toLowerCase());
      if (idx >= 0) {
        S.staff[idx].password = cleanPw;
        persist();
        publish({ k: 'staff', i: S.staff });
        return { ok: true, msg: 'Password updated!' };
      }
      return { ok: false, error: 'Staff account not found' };
    },

    async deleteStaffAccount(email) {
      try {
        const res = await fetch(`/api/staff/${encodeURIComponent(email)}`, { method: 'DELETE' });
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('application/json')) {
          const data = await res.json();
          return { ok: res.ok, ...data };
        }
      } catch (e) {}

      S.staff = Array.isArray(S.staff) && S.staff.length ? S.staff : JSON.parse(JSON.stringify(DEFAULT_STAFF));
      if (S.staff.length <= 1) {
        return { ok: false, error: 'Cannot delete the only remaining staff account!' };
      }
      S.staff = S.staff.filter(s => (s.email || '').toLowerCase() !== email.toLowerCase());
      persist();
      publish({ k: 'staff', i: S.staff });
      notify({ type: 'STAFF_CHANGED' });
      return { ok: true, msg: 'Staff account deleted' };
    }
  };

  /* ---------- Utilities ---------- */
  const pad = n => String(n).padStart(2, '0');
  const Utils = {
    formatCurrency: n => '₹' + Number(n || 0).toLocaleString('en-IN'),
    formatTime: ts => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    getElapsedMMSS(ts) {
      const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
      return pad(Math.floor(s / 60)) + ':' + pad(s % 60);
    },
    getUrgencyColor(ts) {
      const m = (Date.now() - ts) / 60000;
      if (m < 8) return { status: 'green', border: 'border-emerald-500/40', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' };
      if (m <= 15) return { status: 'amber', border: 'border-amber-500/60', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/40' };
      return { status: 'red', border: 'border-rose-500/80', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/50' };
    },
    toast(msg, type = 'success', dur = 3000) {
      const colors = { success: '#15803d', info: '#1d4ed8', error: '#b91c1c', warning: '#b45309' };
      let box = document.getElementById('gg-toasts');
      if (!box) {
        box = document.createElement('div');
        box.id = 'gg-toasts';
        box.style.cssText = 'position:fixed;top:16px;right:16px;z-index:99999;display:flex;flex-direction:column;gap:8px;max-width:340px';
        document.body.appendChild(box);
      }
      const t = document.createElement('div');
      t.textContent = msg;
      t.style.cssText = 'padding:12px 16px;border-radius:12px;color:#fff;font:600 13px Inter,system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4);background:' + (colors[type] || colors.info);
      box.appendChild(t);
      setTimeout(() => t.remove(), dur);
    },
    generateSimpleSVGQR(url, size = 200) {
      return 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size + '&margin=4&data=' + encodeURIComponent(url);
    }
  };

  /* ---------- Web Audio Sounds ---------- */
  let ac = null;
  function ctx() {
    try {
      ac = ac || new (global.AudioContext || global.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      return ac;
    } catch (e) {
      return null;
    }
  }

  function tone(freqs, dur = 0.15, gap = 0.17, vol = 0.15, type = 'sine') {
    const c = ctx();
    if (!c) return;
    freqs.forEach((f, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.value = vol;
      o.connect(g);
      g.connect(c.destination);
      const t = c.currentTime + i * gap;
      o.start(t);
      o.stop(t + dur);
    });
  }

  document.addEventListener('pointerdown', ctx, { once: true });
  const Sound = {
    click: () => tone([660], 0.05, 0, 0.06),
    chimeReady: () => tone([660, 880, 1100], 0.18, 0.15),
    chimeKitchen: () => tone([520, 660], 0.2, 0.2),
    chimeReception: () => tone([880, 660, 880], 0.15, 0.18),
    alarm: () => tone([980, 780, 980, 780, 980], 0.18, 0.2, 0.2, 'square')
  };

  global.GunturDB = DB;
  global.GunturUtils = Utils;
  global.GunturSound = Sound;
  global.GUNTUR_CONFIG = CFG;
  global.MENU_CARDS = MENU_CARDS;
})(window);
