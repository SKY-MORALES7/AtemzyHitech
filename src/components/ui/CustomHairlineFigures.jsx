import React, { useEffect, useRef, useState } from 'react';

/* ============================================================================
 * HAIRLINE KERNEL (HL) — Exact @lucasmarkes/hairline core for the CCTV figure
 * ============================================================================ */
const HL = (() => {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rad = (d) => (d * Math.PI) / 180;
  const r2 = (n) => Math.round(n * 100) / 100;
  const poly = (pts) => 'M' + pts.map((p) => r2(p[0]) + ' ' + r2(p[1])).join('L') + 'Z';
  const seg = (a, b) => `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`;
  const open = (pts) =>
    pts.length < 2 ? '' : 'M' + pts.map((p) => r2(p[0]) + ' ' + r2(p[1])).join('L');
  const Cam = (azDeg, k, S) => ({ az: rad(azDeg), k, S, ox: 0, oy: 0 });

  function proj(C) {
    const c = Math.cos(C.az),
      s = Math.sin(C.az),
      zf = Math.sqrt(1 - C.k * C.k);
    return (x, y, z) => {
      const X = x * c - y * s,
        Y = x * s + y * c;
      return [C.ox + C.S * X, C.oy + C.S * (Y * C.k - z * zf)];
    };
  }

  function unproj(C, sx, sy, z) {
    const c = Math.cos(C.az),
      s = Math.sin(C.az),
      zf = Math.sqrt(1 - C.k * C.k);
    const X = (sx - C.ox) / C.S,
      Y = ((sy - C.oy) / C.S + z * zf) / C.k;
    return [X * c + Y * s, -X * s + Y * c];
  }

  function fit(C, pts, cx, cy) {
    C.ox = 0;
    C.oy = 0;
    const P = proj(C);
    let a = 1e9,
      b = -1e9,
      c = 1e9,
      d = -1e9;
    for (const p of pts) {
      const q = P(p[0], p[1], p[2]);
      a = Math.min(a, q[0]);
      b = Math.max(b, q[0]);
      c = Math.min(c, q[1]);
      d = Math.max(d, q[1]);
    }
    C.ox = cx - (a + b) / 2;
    C.oy = cy - (c + d) / 2;
  }

  function circ(R, n = 96) {
    const out = [];
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2,
        ca = Math.cos(a),
        sa = Math.sin(a);
      out.push({ u: R * ca, v: R * sa, nu: ca, nv: sa });
    }
    return out;
  }

  function hull(input) {
    const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const x = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [],
      up = [];
    for (const p of pts) {
      while (lo.length > 1 && x(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
      lo.push(p);
    }
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i];
      while (up.length > 1 && x(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
      up.push(p);
    }
    lo.pop();
    up.pop();
    return lo.concat(up);
  }

  const ringAt = (P, ring, z) => ring.map((q) => P(q.u, q.v, z));
  const facing = (C) => {
    const s = Math.sin(C.az),
      c = Math.cos(C.az);
    return (q) => q.nu * s + q.nv * c >= -1e-6;
  };

  function run(ring, keep) {
    const n = ring.length;
    let s = -1;
    for (let i = 0; i < n; i++)
      if (keep(ring[i]) && !keep(ring[(i + n - 1) % n])) {
        s = i;
        break;
      }
    if (s < 0) return keep(ring[0]) ? ring.slice() : [];
    const out = [];
    for (let k = 0; k < n && keep(ring[(s + k) % n]); k++) out.push(ring[(s + k) % n]);
    return out;
  }

  function prism(P, front, ring, inner, z0, z1) {
    return {
      sil: poly(hull(ringAt(P, ring, z1).concat(ringAt(P, ring, z0)))),
      crease: inner ? open(ringAt(P, run(inner, front), z1)) : ''
    };
  }

  let reduced = false;
  const setReducedMotion = (on) => {
    reduced = on;
  };
  const reducedMotion = () => reduced;

  function spring(x, o = {}) {
    return {
      x,
      v: 0,
      t: x,
      k: o.k ?? 100,
      c: o.c ?? 18,
      m: o.m ?? 1,
      eps: o.eps ?? 0.01
    };
  }

  function stepS(sp, dt) {
    if (reduced) {
      sp.x = sp.t;
      sp.v = 0;
      return false;
    }
    const n = Math.max(1, Math.ceil(dt * 240)),
      h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = (-sp.k * (sp.x - sp.t) - sp.c * sp.v) / sp.m;
      sp.v += a * h;
      sp.x += sp.v * h;
    }
    if (Math.abs(sp.x - sp.t) < sp.eps && Math.abs(sp.v) < sp.eps * 10) {
      sp.x = sp.t;
      sp.v = 0;
      return false;
    }
    return true;
  }

  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1,
      bx = 3 * (x2 - x1) - cx,
      ax = 1 - cx - bx;
    const cy = 3 * y1,
      by = 3 * (y2 - y1) - cy,
      ay = 1 - cy - by;
    const X = (u) => ((ax * u + bx) * u + cx) * u;
    const Y = (u) => ((ay * u + by) * u + cy) * u;
    const dX = (u) => (3 * ax * u + 2 * bx) * u + cx;
    return (t) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      let u = t;
      for (let i = 0; i < 8; i++) {
        const e = X(u) - t;
        if (Math.abs(e) < 1e-5) break;
        const d = dX(u);
        if (Math.abs(d) < 1e-6) break;
        u -= e / d;
      }
      if (!(u >= 0 && u <= 1) || Math.abs(X(u) - t) > 1e-4) {
        let lo = 0,
          hi = 1;
        u = t;
        for (let i = 0; i < 24; i++) {
          if (X(u) < t) lo = u;
          else hi = u;
          u = (lo + hi) / 2;
        }
      }
      return Y(u);
    };
  }

  const EASE_LIFT = bezier(0.32, 0.72, 0, 1);

  const NS = 'http://www.w3.org/2000/svg';
  function mk(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, String(attrs[k]));
    if (parent) parent.appendChild(e);
    return e;
  }

  function solid(parent) {
    const g = mk('g', {}, parent);
    return {
      g,
      sil: mk('path', { class: 'sil' }, g),
      cr: mk('path', { class: 'nf lo' }, g)
    };
  }

  const put = (el, s) => {
    el.sil.setAttribute('d', s.sil);
    el.cr.setAttribute('d', s.crease);
  };

  const flatDot = (parent, C, r, cls) =>
    mk('ellipse', { rx: r2(r * C.S), ry: r2(r * C.S * C.k), class: cls }, parent);

  const place = (el, q) => {
    el.setAttribute('cx', String(r2(q[0])));
    el.setAttribute('cy', String(r2(q[1])));
  };

  let boards = [];
  const byStage = new Map();
  let raf = 0;
  let last = 0;
  let io = null;
  let rm = null;

  function frame() {
    const now = performance.now();
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1e3));
    last = now;
    let any = false;
    for (const b of boards.slice())
      if (b.vis && b.awake) {
        try {
          b.awake = !!b.tick(dt, now);
        } catch (err) {
          b.awake = false;
          setTimeout(() => {
            throw err;
          });
        }
        any = any || b.awake;
      }
    raf = any ? requestAnimationFrame(frame) : 0;
  }

  function wake(b) {
    b.awake = true;
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  const onMotion = () => {
    setReducedMotion(!!rm?.matches);
    boards.forEach(wake);
  };

  function start() {
    if (io) return;
    io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          const set = byStage.get(e.target);
          if (!set) continue;
          for (const b of set) {
            b.vis = e.isIntersecting;
            if (b.vis) wake(b);
          }
        }
      },
      { rootMargin: '80px' }
    );
    rm = matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(rm.matches);
    rm.addEventListener('change', onMotion);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    io?.disconnect();
    io = null;
    rm?.removeEventListener('change', onMotion);
    rm = null;
  }

  function register(stage, tick) {
    start();
    const b = { stage, tick, vis: false, awake: true };
    boards.push(b);
    const peers = byStage.get(stage);
    if (peers) {
      for (const p of peers) b.vis = p.vis;
      peers.add(b);
      if (b.vis) wake(b);
    } else {
      byStage.set(stage, new Set([b]));
      io.observe(stage);
    }
    tick(0, performance.now());
    let gone = false;
    return {
      wake: () => {
        if (!gone) wake(b);
      },
      unregister: () => {
        if (gone) return;
        gone = true;
        boards = boards.filter((x) => x !== b);
        const set = byStage.get(stage);
        if (set) {
          set.delete(b);
          if (!set.size) {
            byStage.delete(stage);
            io?.unobserve(stage);
          }
        }
        if (!boards.length) stop();
      }
    };
  }

  const handlers = new WeakMap();
  const touring = new WeakMap();

  function pointer(stage, on) {
    handlers.set(stage, on);
    let tm = 0;
    const pt = (e) => {
      const r = stage.getBoundingClientRect();
      return [((e.clientX - r.left) / r.width) * 400, ((e.clientY - r.top) / r.height) * 320];
    };
    const move = (e) => {
      clearTimeout(tm);
      touring.get(stage)?.hold();
      on.move(pt(e), e);
    };
    const down = (e) => {
      clearTimeout(tm);
      touring.get(stage)?.hold();
      if (e.pointerType !== 'mouse') stage.releasePointerCapture?.(e.pointerId);
      if (on.down) on.down(pt(e), e);
      else on.move(pt(e), e);
    };
    const leave = (e) => {
      clearTimeout(tm);
      tm = window.setTimeout(
        () => {
          on.leave(e);
          touring.get(stage)?.release();
        },
        e.pointerType === 'mouse' ? 0 : 1400
      );
    };
    stage.addEventListener('pointermove', move);
    stage.addEventListener('pointerdown', down);
    stage.addEventListener('pointerleave', leave);
    return () => {
      clearTimeout(tm);
      if (handlers.get(stage) === on) handlers.delete(stage);
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerdown', down);
      stage.removeEventListener('pointerleave', leave);
    };
  }

  const LAP = [
    [128, 150],
    [200, 118],
    [272, 150],
    [200, 206],
    null
  ];
  const TRAVEL = 900;
  const DWELL = 1200;
  const REST = 1800;
  const RESUME = 1200;
  const STAGGER = 450;
  const GHOST = { pointerType: 'ghost' };
  let started = 0;

  function entry([x, y]) {
    const dx = x - 200,
      dy = y - 160;
    if (!dx && !dy) return [200, 320];
    const k = Math.min(
      dx ? (dx > 0 ? 200 : -200) / dx : Infinity,
      dy ? (dy > 0 ? 160 : -160) / dy : Infinity
    );
    return [200 + dx * k, 160 + dy * k];
  }

  function tour(stage, stops, onStop) {
    let i = 0;
    let wait = RESUME + STAGGER * (started++ % 4);
    let t = -1;
    let at = null;
    let origin = [200, 320];
    let hand = false,
      keys = stage.contains(stage.ownerDocument.activeElement);
    let gone = false;
    const leave = () => {
      at = null;
      t = -1;
      handlers.get(stage)?.leave(GHOST);
    };
    const tick = (dt) => {
      if (hand || keys || !stops.length) return false;
      if (reducedMotion()) {
        if (at) leave();
        return false;
      }
      if (wait > 0) {
        wait -= dt * 1e3;
        return true;
      }
      const stop2 = stops[i];
      if (stop2 === null) {
        if (at) leave();
        onStop?.(i);
        i = (i + 1) % stops.length;
        wait = REST;
        return true;
      }
      const h = handlers.get(stage);
      if (!h) return true;
      if (t < 0) {
        origin = at ?? entry(stop2);
        t = 0;
      }
      t = Math.min(TRAVEL, t + dt * 1e3);
      const k = EASE_LIFT(t / TRAVEL);
      at = [origin[0] + (stop2[0] - origin[0]) * k, origin[1] + (stop2[1] - origin[1]) * k];
      h.move(at, GHOST);
      if (t < TRAVEL) return true;
      onStop?.(i);
      i = (i + 1) % stops.length;
      t = -1;
      wait = DWELL;
      return true;
    };
    const take = () => {
      at = null;
      t = -1;
    };
    const give = () => {
      if (hand || keys) return;
      i = 0;
      t = -1;
      wait = RESUME;
      board.wake();
    };
    const me = {
      hold: () => {
        hand = true;
        take();
      },
      release: () => {
        if (!hand) return;
        hand = false;
        give();
      }
    };
    const focusIn = () => {
      keys = true;
      take();
    };
    const focusOut = (e) => {
      if (keys && !stage.contains(e.relatedTarget)) {
        keys = false;
        give();
      }
    };
    stage.addEventListener('focusin', focusIn);
    stage.addEventListener('focusout', focusOut);
    touring.set(stage, me);
    const board = register(stage, tick);
    return {
      stop: () => {
        if (gone) return;
        gone = true;
        board.unregister();
        stage.removeEventListener('focusin', focusIn);
        stage.removeEventListener('focusout', focusOut);
        if (touring.get(stage) === me) touring.delete(stage);
        if (at) leave();
      }
    };
  }

  function disposer() {
    let fns = [];
    return {
      add: (fn) => {
        fns.push(fn);
      },
      on: (target, type, fn, opts) => {
        const h = fn;
        target.addEventListener(type, h, opts);
        fns.push(() => target.removeEventListener(type, h, opts));
      },
      dispose: () => {
        const run2 = fns;
        fns = [];
        for (let i = run2.length - 1; i >= 0; i--) run2[i]();
      }
    };
  }

  const LIGHT = { plate: '#ffffff', hi: '#232327', edge: '#a4a4ac', mid: '#c3c3c9', lo: '#e0e0e4' };
  const DARK = { plate: '#08090a', hi: '#d0d6e0', edge: '#5b5d64', mid: '#3e3e44', lo: '#29292d' };
  const KEYS = ['plate', 'hi', 'edge', 'mid', 'lo'];
  const vars = (p) => KEYS.map((k) => `--hl-${k}:var(--hairline-${k},${p[k]});`).join('');
  const EASE = 'cubic-bezier(0.5,0,0.1,1)';
  const SVG = ':where([data-hairline]>svg)';

  function css(lightDark) {
    const both = Object.fromEntries(KEYS.map((k) => [k, `light-dark(${LIGHT[k]},${DARK[k]})`]));
    return [
      `:where([data-hairline]){display:block;position:relative;aspect-ratio:5/4;touch-action:pan-y;user-select:none;-webkit-user-select:none;--hl-sw:var(--hairline-stroke,0.9);${vars(LIGHT)}}`,
      lightDark ? `:where([data-hairline]){${vars(both)}}` : '',
      `:where(.dark,[data-theme="dark"]) :where([data-hairline]){${vars(DARK)}}`,
      `:where([data-hairline][data-hairline-theme="light"]){${vars(LIGHT)}}`,
      `:where([data-hairline][data-hairline-theme="dark"]){${vars(DARK)}}`,
      `:where([data-hairline]:focus-visible){outline:1.5px solid var(--hl-hi);outline-offset:2px}`,
      `${SVG}{position:absolute;inset:0;width:100%;height:100%;display:block}`,
      `:where([data-hairline]>[data-hairline-live]){position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`,
      `${SVG} :where(path,polygon,ellipse,line){fill:var(--hl-plate);stroke:var(--hl-mid);stroke-width:var(--hl-sw);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round;transition:stroke 260ms ${EASE}}`,
      `${SVG} :where(.nf){fill:none}`,
      `${SVG} :where(.fo){stroke:none}`,
      `${SVG} :where(.sil){stroke:var(--hl-edge)}`,
      `${SVG} :where(.hi){stroke:var(--hl-hi)}`,
      `${SVG} :where(.lo){stroke:var(--hl-lo)}`,
      `${SVG} :where(.dash){stroke-dasharray:1 3}`,
      `${SVG} :where(.dot){stroke:none;fill:var(--hl-hi);transition:fill 260ms ${EASE}}`,
      `${SVG} :where(.dot.m){fill:var(--hl-edge)}`,
      `${SVG} :where(.dot.off){fill:var(--hl-lo)}`,
      `${SVG} :where(.ghost path){fill:none;stroke:var(--hl-mid)}`
    ].join('');
  }

  const done = new WeakSet();
  function inject(root) {
    if (done.has(root)) return;
    done.add(root);
    const doc = root.nodeType === 9 ? root : root.ownerDocument;
    const win = doc.defaultView;
    const text = css(!!win?.CSS?.supports?.('color', 'light-dark(#000,#fff)'));
    if (win && 'adoptedStyleSheets' in root) {
      try {
        const sheet = new win.CSSStyleSheet();
        sheet.replaceSync(text);
        root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
        return;
      } catch {
        // Fallback to style tag
      }
    }
    const style = doc.createElement('style');
    style.setAttribute('data-hairline-style', '');
    style.textContent = text;
    (root.nodeType === 9 ? doc.head ?? doc.documentElement : root).appendChild(style);
  }

  return {
    Cam,
    LAP,
    circ,
    clamp,
    disposer,
    facing,
    fit,
    flatDot,
    hull,
    inject,
    lerp,
    mk,
    open,
    place,
    pointer,
    poly,
    prism,
    proj,
    put,
    r2,
    rad,
    register,
    ringAt,
    run,
    seg,
    solid,
    spring,
    stepS,
    tour,
    unproj
  };
})();

/* ============================================================================
 * 1. CctvCamera — Exact Hairline "cctv" Figure provided by user
 *    A bullet camera on a post, on a round plinth. The pointer is projected
 *    onto the ground, and the camera swivels to look at that spot on two springs.
 * ============================================================================ */
const CCTV_RANGE = [40, 85, 130];
const CCTV_TOUR = [
  [207, 129],
  [101, 189],
  [207, 242],
  [299, 189],
  null
];
const HP = 36,
  R = 8,
  LEN = 34,
  BACK = 11,
  REST = HL.rad(10),
  PIT = HL.rad(38);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

function mountCctv({ stage, svg, read }, value) {
  const {
    Cam,
    circ,
    clamp,
    facing,
    fit,
    hull,
    open,
    poly,
    prism,
    proj,
    rad,
    seg,
    spring,
    stepS,
    unproj,
    disposer,
    flatDot,
    mk,
    place,
    pointer,
    put,
    register,
    solid
  } = HL;

  const bag = disposer();
  let lim = rad(value),
    over = null;
  const C = Cam(45, 0.5, 2.0);
  fit(
    C,
    [
      [-64, -64, -4],
      [64, -64, -4],
      [64, 64, -4],
      [-64, 64, -4],
      [0, 0, HP + 34]
    ],
    200,
    170
  );
  const P = proj(C),
    front = facing(C),
    zf = Math.sqrt(1 - C.k * C.k);
  const V = [Math.sin(C.az) * zf, Math.cos(C.az) * zf, C.k];

  const g = mk('g', {}, svg);
  put(solid(g), prism(P, front, circ(64, 64), circ(62.2, 64), -4, 0));
  const dash = mk('path', { class: 'nf dash' }, g);
  const spot = flatDot(g, C, 2.4, 'dot off');
  put(solid(g), prism(P, front, circ(11, 28), circ(9.4, 28), 0, 3));
  for (let k = 0; k < 4; k++)
    place(
      flatDot(g, C, 0.8, 'dot off'),
      P(8 * Math.cos((k * Math.PI) / 2 + 0.8), 8 * Math.sin((k * Math.PI) / 2 + 0.8), 3)
    );
  put(solid(g), prism(P, front, circ(3, 16), null, 3, HP));
  put(solid(g), prism(P, front, circ(5.5, 20), circ(3.9, 20), HP - 4, HP));
  const body = mk('path', { class: 'sil' }, g),
    bands = mk('path', { class: 'nf lo' }, g);
  const visor = mk('path', { class: 'sil' }, g),
    edge = mk('path', { class: 'nf lo' }, g),
    cap = mk('path', { class: 'nf lo' }, g);
  const lens = mk('path', { class: 'sil hi' }, g),
    pupil = mk('circle', { r: 1.6, class: 'dot m' }, g),
    led = mk('circle', { r: 1.4, class: 'dot off' }, g);

  const yaw = spring(REST),
    pit = spring(PIT);
  const OZ = HP + 1.5;

  function pose() {
    const cy = Math.cos(yaw.x),
      sy = Math.sin(yaw.x),
      cp = Math.cos(pit.x),
      sp = Math.sin(pit.x);
    const d = [cy * cp, sy * cp, -sp],
      u = [-sy, cy, 0],
      w = [u[1] * d[2], -u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
      uV = dot3(u, V),
      wV = dot3(w, V),
      tf = LEN - BACK;
    const at = (t, Rr, a) => {
      const c = Math.cos(a) * Rr,
        s = Math.sin(a) * Rr;
      return P(
        d[0] * t + c * u[0] + s * w[0],
        d[1] * t + c * u[1] + s * w[1],
        OZ + d[2] * t + c * u[2] + s * w[2]
      );
    };
    const ring = (t, Rr) =>
      Array.from({ length: 20 }, (_, j) => at(t, Rr, (j * Math.PI) / 10));
    const arc = (t, Rr) => {
      const vis = Array.from(
        { length: 20 },
        (_, j) => Math.cos((j * Math.PI) / 10) * uV + Math.sin((j * Math.PI) / 10) * wV > 0
      );
      const s0 = vis.findIndex((v, j) => v && !vis[(j + 19) % 20]),
        out = [];
      for (let k = 0; s0 >= 0 && k < 20 && vis[(s0 + k) % 20]; k++)
        out.push(at(t, Rr, (((s0 + k) % 20) * Math.PI) / 10));
      return open(out);
    };
    const seen = dot3(d, V) > 0;
    body.setAttribute(
      'd',
      poly(
        hull(
          ring(-BACK, R).concat(
            ring(tf, R),
            ring(-BACK - 6, 2.5),
            ring(-2.5, R * 1.08),
            ring(2.5, R * 1.08)
          )
        )
      )
    );
    bands.setAttribute(
      'd',
      [
        [tf - 5, R],
        [tf - 8, R],
        [-2.5, R * 1.08],
        [2.5, R * 1.08],
        [-BACK + 3.5, R]
      ]
        .map(([t, r]) => arc(t, r))
        .join('')
    );
    const top = (t, sd) =>
      P(
        d[0] * t + sd * R * 1.15 * u[0] - w[0] * R * 1.05,
        d[1] * t + sd * R * 1.15 * u[1] - w[1] * R * 1.05,
        OZ + d[2] * t - w[2] * R * 1.05
      );
    visor.setAttribute(
      'd',
      poly([top(-BACK + 2, -1), top(tf + 6, -1), top(tf + 6, 1), top(-BACK + 2, 1)])
    );
    edge.setAttribute(
      'd',
      poly([top(-BACK + 4, -0.7), top(tf + 4, -0.7), top(tf + 4, 0.7), top(-BACK + 4, 0.7)])
    );
    cap.setAttribute('d', poly(seen ? ring(tf, R) : ring(-BACK, R)));
    lens.setAttribute(
      'd',
      seen ? poly(ring(tf + 0.8, R * 0.55)) + poly(ring(tf + 0.8, R * 0.3)) : ''
    );
    pupil.setAttribute('r', seen ? 1.6 : 0);
    place(pupil, at(tf + 0.8, 0, 0));
    const sg = uV >= 0 ? 1 : -1;
    place(led, at(tf - 12, R, sg > 0 ? 0 : Math.PI));
    const tg = OZ / sp,
      gx = d[0] * tg,
      gy = d[1] * tg;
    dash.setAttribute('d', seg(P(d[0] * tf, d[1] * tf, OZ + d[2] * tf), P(gx, gy, 0)));
    place(spot, P(gx, gy, 0));
  }

  const B = register(stage, (dt) => {
    const a = stepS(yaw, dt),
      b = stepS(pit, dt);
    pose();
    return a || b;
  });
  bag.add(B.unregister);

  function aim(p) {
    over = p;
    if (p) {
      const dl = clamp(wrap(Math.atan2(p[1], p[0]) - REST), -lim, lim);
      yaw.t = REST + dl;
      pit.t = Math.atan2(OZ, clamp(Math.hypot(p[0], p[1]), 14, 56));
      read.textContent = `pan ${Math.round((dl * 180) / Math.PI)}`;
    } else {
      yaw.t = REST;
      pit.t = PIT;
      read.textContent = 'rest';
    }
    lens.classList.toggle('hi', !p);
    spot.setAttribute('class', p ? 'dot' : 'dot off');
    led.setAttribute('class', p ? 'dot m' : 'dot off');
    B.wake();
  }

  bag.add(
    pointer(stage, {
      move: (p) => aim(unproj(C, p[0], p[1], 0)),
      leave: () => aim(null)
    })
  );
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => {
      lim = rad(v);
      if (over) aim(over);
    },
    destroy: bag.dispose
  };
}

export const CctvCamera = ({
  intensity = 0.7,
  play = true,
  theme = 'dark',
  label = 'A camera on a post turns to watch the pointer, and a dashed sight line shows the spot it is looking at.',
  onRead,
  className = ''
}) => {
  const stageRef = useRef(null);
  const handleRef = useRef(null);
  const tourRef = useRef(null);
  const onReadRef = useRef(onRead);

  useEffect(() => {
    onReadRef.current = onRead;
  }, [onRead]);

  const computeValue = (i) => {
    const [lo, mid, hi] = CCTV_RANGE;
    const clamped = Math.min(1, Math.max(0, Number(i) || 0.5));
    return (
      Math.round(
        (clamped <= 0.5
          ? lo + (clamped / 0.5) * (mid - lo)
          : mid + ((clamped - 0.5) / 0.5) * (hi - mid)) * 1000
      ) / 1000
    );
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    HL.inject(document);
    stage.setAttribute('data-hairline', 'cctv');
    stage.setAttribute('data-hairline-theme', theme);
    stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', label);

    const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
    const readProxy = {
      get textContent() {
        return '';
      },
      set textContent(val) {
        if (onReadRef.current) onReadRef.current(val == null ? '' : String(val));
      }
    };

    const handle = mountCctv({ stage, svg, read: readProxy }, computeValue(intensity));
    handleRef.current = handle;

    return () => {
      if (tourRef.current) {
        tourRef.current.stop();
        tourRef.current = null;
      }
      handle.destroy();
      handleRef.current = null;
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.setAttribute('data-hairline-theme', theme);
    stage.setAttribute('aria-label', label);
    if (handleRef.current) {
      handleRef.current.set(computeValue(intensity));
    }
  }, [intensity, theme, label]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (play) {
      if (!tourRef.current) {
        tourRef.current = HL.tour(stage, CCTV_TOUR);
      }
    } else if (tourRef.current) {
      tourRef.current.stop();
      tourRef.current = null;
    }
    return () => {
      if (tourRef.current) {
        tourRef.current.stop();
        tourRef.current = null;
      }
    };
  }, [play]);

  return (
    <div
      ref={stageRef}
      style={{ aspectRatio: '5 / 4' }}
      className={`w-full h-full select-none cursor-crosshair ${className}`}
    />
  );
};

/* ============================================================================
 * 2. WalkieTalkie — Interactive Isometric Figure
 *    - Desktop: Signal appears on hover and disappears immediately when pointer leaves.
 *    - Mobile / Touch: When tapped, the signal appears and pulses for 2.6 seconds
 *      before automatically disappearing!
 * ============================================================================ */
function createProjector(azDeg, k, scale, ox = 120, oy = 102) {
  const az = HL.rad(azDeg);
  const c = Math.cos(az);
  const s = Math.sin(az);
  const zf = Math.sqrt(Math.max(0.05, 1 - k * k));
  return (x, y, z) => {
    const X = x * c - y * s;
    const Y = x * s + y * c;
    return [ox + scale * X, oy + scale * (Y * k - z * zf)];
  };
}

function buildIsoBox(P, x0, y0, z0, x1, y1, z1, azDeg = -35) {
  const normAz = ((azDeg % 360) + 360) % 360;
  const showFrontX = normAz > 180 || normAz < 90;
  const showFrontY = normAz < 180;
  const faces = [];

  faces.push({
    kind: 'bottom',
    d: HL.poly([P(x0, y0, z0), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0)])
  });

  if (showFrontX) {
    faces.push({
      kind: 'backX',
      d: HL.poly([P(x0, y0, z0), P(x0, y1, z0), P(x0, y1, z1), P(x0, y0, z1)])
    });
  } else {
    faces.push({
      kind: 'backX',
      d: HL.poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)])
    });
  }

  if (showFrontY) {
    faces.push({
      kind: 'backY',
      d: HL.poly([P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1)])
    });
  } else {
    faces.push({
      kind: 'backY',
      d: HL.poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)])
    });
  }

  if (showFrontY) {
    faces.push({
      kind: 'frontY',
      d: HL.poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)])
    });
  } else {
    faces.push({
      kind: 'frontY',
      d: HL.poly([P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1)])
    });
  }

  if (showFrontX) {
    faces.push({
      kind: 'frontX',
      d: HL.poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)])
    });
  } else {
    faces.push({
      kind: 'frontX',
      d: HL.poly([P(x0, y0, z0), P(x0, y1, z0), P(x0, y1, z1), P(x0, y0, z1)])
    });
  }

  faces.push({
    kind: 'top',
    d: HL.poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)])
  });

  return faces;
}

export const WalkieTalkie = ({
  intensity = 0.8,
  play = true,
  label = 'Interactive isometric walkie-talkie two-way radio schematic',
  onRead,
  className = ''
}) => {
  const svgRef = useRef(null);
  const touchTimerRef = useRef(null);
  const [pointerState, setPointerState] = useState({ x: 0, y: 0, active: false });
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!play && !pointerState.active) return;
    let rafId;
    let start = performance.now();

    const tick = (now) => {
      const dt = (now - start) / 1000;
      setPulsePhase(dt);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [play, pointerState.active]);

  const updateFromEvent = (e, isTapOrTouch = false) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches?.[0]?.clientX ?? e.clientX ?? rect.left + rect.width / 2;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY ?? rect.top + rect.height / 2;
    const nx = ((clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
    const ny = ((clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
    const clampedX = Math.max(-1, Math.min(1, nx));
    const clampedY = Math.max(-1, Math.min(1, ny));

    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }

    setPointerState({ x: clampedX, y: clampedY, active: true });

    if (onRead) {
      const ch = Math.max(1, Math.min(16, Math.round(8 + clampedX * 7)));
      const freq = (446.00625 + ch * 0.0125).toFixed(4);
      const dbm = Math.round(32 + (1 - Math.abs(clampedY)) * 6);
      onRead(`UHF ${freq} MHz • CH-${String(ch).padStart(2, '0')} • +${dbm}dBm`);
    }

    // If tapped on mobile/touch, keep the signal active for 2.6 seconds before disappearing!
    if (isTapOrTouch || e.pointerType === 'touch' || e.pointerType === 'pen') {
      touchTimerRef.current = setTimeout(() => {
        setPointerState({ x: 0, y: 0, active: false });
        if (onRead) onRead('');
      }, 2600);
    }
  };

  const handlePointerDown = (e) => {
    const isTouch = e.pointerType !== 'mouse';
    updateFromEvent(e, isTouch);
  };

  const handlePointerMove = (e) => {
    const isTouch = e.pointerType && e.pointerType !== 'mouse';
    updateFromEvent(e, isTouch);
  };

  const handlePointerLeave = (e) => {
    // On desktop mouse leave, hide the signal immediately.
    // On mobile tap/touch, let the 2.6-second timer keep the signal visible before disappearing!
    if (e.pointerType && e.pointerType !== 'mouse') {
      if (!touchTimerRef.current) {
        touchTimerRef.current = setTimeout(() => {
          setPointerState({ x: 0, y: 0, active: false });
          if (onRead) onRead('');
        }, 2600);
      }
      return;
    }
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    setPointerState({ x: 0, y: 0, active: false });
    if (onRead) onRead('');
  };

  const activeX = pointerState.active ? pointerState.x : 0;
  const activeY = pointerState.active ? pointerState.y : 0;
  const azDeg = -36 + activeX * 26 * intensity;
  const k = Math.max(0.38, Math.min(0.68, 0.5 + activeY * 0.14 * intensity));
  const P = createProjector(azDeg, k, 1.56, 120, 102);

  // Compact Base Reference Grid Plate (stays well inside the border)
  const basePlate = HL.poly([
    P(-25, -22, -22),
    P(25, -22, -22),
    P(25, 22, -22),
    P(-25, 22, -22)
  ]);

  const gridLines = [];
  for (let g = -16; g <= 16; g += 8) {
    gridLines.push(HL.seg(P(g, -22, -22), P(g, 22, -22)));
    gridLines.push(HL.seg(P(-25, g, -22), P(25, g, -22)));
  }

  const bodyFaces = buildIsoBox(P, -13, -8, -22, 13, 8, 14, azDeg);
  const pttFaces = buildIsoBox(P, -16, -4.5, -3, -13, 4.5, 10, azDeg);
  const knobFaces = buildIsoBox(P, 3, -3.5, 14, 8.5, 3.5, 20.5, azDeg);
  const antBaseFaces = buildIsoBox(P, -10.5, -3.5, 14, -5, 3.5, 21.5, azDeg);
  const antMidFaces = buildIsoBox(P, -9.3, -2.4, 21.5, -6.1, 2.4, 41, azDeg);
  const antTipPt = P(-7.7, 0, 42.5);

  const lcdScreen = HL.poly([
    P(-9.5, 8.2, -1),
    P(9.5, 8.2, -1),
    P(9.5, 8.2, 10),
    P(-9.5, 8.2, 10)
  ]);

  const speakerSlats = [];
  for (let z = -17.5; z <= -5.5; z += 2.4) {
    speakerSlats.push(HL.seg(P(-8.5, 8.3, z), P(8.5, 8.3, z)));
  }

  const rfWaves = pointerState.active
    ? [0, 1, 2].map((idx) => {
        const progress = (pulsePhase * 0.85 + idx / 3) % 1;
        const radius = 6 + progress * 26;
        const pts = [];
        const steps = 28;
        const driftX = pointerState.x * 10 * progress;
        const driftY = pointerState.y * 10 * progress;
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          pts.push(
            P(
              -7.7 + driftX + Math.cos(a) * radius,
              driftY + Math.sin(a) * radius,
              42.5 + progress * 3
            )
          );
        }
        return {
          d: HL.open(pts),
          isHi: idx === 0
        };
      })
    : [];

  const targetPt = P(-7.7 + activeX * 26, activeY * 22, 43.5);
  const vectorBeam = HL.seg(antTipPt, targetPt);

  const plateColor = 'var(--hairline-plate, #0f172a)';
  const hiColor = 'var(--hairline-hi, #38bdf8)';
  const edgeColor = 'var(--hairline-edge, #7dd3fc)';
  const midColor = 'var(--hairline-mid, #0284c7)';
  const loColor = 'var(--hairline-lo, #1e3a8a)';
  const strokeW = 'var(--hairline-stroke, 1.25)';

  return (
    <div
      data-hairline=""
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ aspectRatio: '5 / 4', position: 'relative' }}
      className={`w-full h-full select-none cursor-crosshair overflow-hidden ${className}`}
      aria-label={label}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 240 192"
        className="w-full h-full block overflow-hidden"
        style={{
          strokeWidth: strokeW,
          strokeLinejoin: 'round',
          strokeLinecap: 'round'
        }}
      >
        <path d={basePlate} fill={plateColor} stroke={loColor} />
        {gridLines.map((d, i) => (
          <path key={`g-${i}`} d={d} fill="none" stroke={loColor} strokeDasharray="1 3" />
        ))}

        {pttFaces.map((f, i) => (
          <path
            key={`ptt-${i}`}
            d={f.d}
            fill={plateColor}
            stroke={pointerState.active ? hiColor : edgeColor}
          />
        ))}

        {bodyFaces.map((f, i) => (
          <path
            key={`b-${i}`}
            d={f.d}
            fill={plateColor}
            stroke={f.kind === 'top' || f.kind === 'frontY' ? edgeColor : midColor}
          />
        ))}

        <path d={lcdScreen} fill={plateColor} stroke={hiColor} />
        <path
          d={HL.seg(P(-6.5, 8.4, 4.5), P(6.5, 8.4, 4.5 + activeX * 2.2))}
          fill="none"
          stroke={hiColor}
        />
        <circle
          cx={P(7, 8.4, 7.5)[0]}
          cy={P(7, 8.4, 7.5)[1]}
          r="1.8"
          fill={pointerState.active ? hiColor : midColor}
        />

        {speakerSlats.map((d, i) => (
          <path key={`sp-${i}`} d={d} fill="none" stroke={midColor} />
        ))}

        {knobFaces.map((f, i) => (
          <path key={`k-${i}`} d={f.d} fill={plateColor} stroke={edgeColor} />
        ))}

        {antBaseFaces.map((f, i) => (
          <path key={`ab-${i}`} d={f.d} fill={plateColor} stroke={edgeColor} />
        ))}
        {antMidFaces.map((f, i) => (
          <path key={`am-${i}`} d={f.d} fill={plateColor} stroke={hiColor} />
        ))}

        {pointerState.active &&
          rfWaves.map((w, i) => (
            <path
              key={`rf-${i}`}
              d={w.d}
              fill="none"
              stroke={w.isHi ? hiColor : midColor}
              strokeDasharray={w.isHi ? undefined : '2 3'}
            />
          ))}

        {pointerState.active && (
          <>
            <path d={vectorBeam} fill="none" stroke={hiColor} strokeDasharray="2 3" />
            <circle cx={targetPt[0]} cy={targetPt[1]} r="2.2" fill={edgeColor} />
          </>
        )}
        <circle cx={antTipPt[0]} cy={antTipPt[1]} r="2.4" fill={hiColor} />
      </svg>
    </div>
  );
};
