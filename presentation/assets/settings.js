/* Shared settings for the Nuvo decks, saved in localStorage['nuvo-settings']. Used by the picker page and the deck (press S).
   API: NuvoSettings.get() / set(patch) / onChange(fn) / render(el, opts). Defaults are in DEF. See docs/OPERATING.md. */
(function () {
  const KEY = 'nuvo-settings', BASE_WPS = 3.0, BASE_TOTAL = 180, SHARE_A = 0.53;
  const DEF = { pace: 1, auto: true, countdown: 3, adapt: true, paceA: 1, paceS: 1, perf: 'auto', energy: 'balanced', confetti: true, ambient: true, mode: 'present' };
  const subs = [];
  const get = () => { try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return Object.assign({}, DEF); } };
  const set = p => { const s = Object.assign(get(), p); try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} subs.forEach(f => f(s, p)); return s; };
  const onChange = f => subs.push(f);
  const mmss = t => { t = Math.round(t); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
  const SAMPLE = 'Three weeks. That’s how long the average person sticks to a goal before they quit. We know, because we were those people. I’m Akshay. I’m Akaash. And we didn’t set out to build a company. We just got sick of quitting on ourselves.';

  const css = document.createElement('style');
  css.textContent = `
  .nvs{font-family:"Barlow",system-ui,sans-serif;color:#0c1320}
  .nvs h4{font:900 30px "Barlow Condensed","Arial Narrow",sans-serif;text-transform:uppercase;letter-spacing:.04em;margin:0 0 4px}
  .nvs .nvr{display:flex;flex-direction:column;gap:8px;padding:16px 0;border-top:2px solid #e2e8f2}
  .nvs .nvr:first-child{border-top:0;padding-top:0}
  .nvs .nvhd{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
  .nvs .hint{font-size:15px;color:#5a6b82;line-height:1.35}
  .nvs .nvnum{display:inline-flex;align-items:center;gap:4px;font:800 26px "Barlow Condensed",sans-serif;color:#1268ff}
  .nvs .nvnum input{width:84px;height:40px;border:3px solid #07152b;border-radius:10px;padding:0 8px;font:800 24px "Barlow Condensed",sans-serif;text-align:center;color:#07152b;background:#fff}
  .nvs .nvnum input:focus{outline:3px solid #1268ff}
  .nvs .val{white-space:nowrap;font:800 26px "Barlow Condensed",sans-serif;letter-spacing:.06em;color:#1268ff}
  .nvs .nvseg{display:flex;gap:8px;flex-wrap:wrap}
  .nvs button{font:800 22px "Barlow Condensed","Arial Narrow",sans-serif;letter-spacing:.08em;text-transform:uppercase;min-height:44px;padding:0 18px;border-radius:999px;border:3px solid #07152b;background:#fff;color:#07152b;box-shadow:3px 3px 0 #07152b;cursor:pointer}
  .nvs button:hover{transform:translate(-1px,-1px)}
  .nvs button.on{background:#1268ff;color:#fff}
  .nvs button.nvgo{background:#27c947}
  .nvs input[type=range]{width:100%;accent-color:#1268ff;height:32px}
  .nvs .nvtg{display:flex;align-items:center;justify-content:space-between;gap:14px}
  .nvs .nvsw{position:relative;width:62px;height:34px;flex:none}
  .nvs .nvsw input{position:absolute;inset:0;opacity:0;cursor:pointer;margin:0;z-index:1}
  .nvs .nvsw i{position:absolute;inset:0;border-radius:999px;border:3px solid #07152b;background:#e2e8f2;transition:background .15s}
  .nvs .nvsw i:after{content:"";position:absolute;left:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#07152b;transition:transform .15s}
  .nvs .nvsw input:checked+i{background:#27c947}.nvs .nvsw input:checked+i:after{transform:translateX(28px)}
  .nvs .cal{background:#f1f5ff;border:3px solid #07152b;border-radius:14px;padding:14px 16px;display:none;gap:10px;flex-direction:column}
  .nvs .cal.open{display:flex}
  .nvs .cal p{font-size:19px;line-height:1.4;margin:0}.nvs .cal .res{font:800 24px "Barlow Condensed",sans-serif;color:#0755dd}
  .nvs .cal .acts{display:flex;gap:10px;flex-wrap:wrap}
  `;
  document.head.appendChild(css);

  function render(root, opts) {
    opts = opts || {}; const total = () => (opts.total ? opts.total() : BASE_TOTAL);
    root.classList.add('nvs');
    root.innerHTML = `
      <div class="nvr"><div class="nvhd"><h4>How to run it</h4></div>
        <div class="nvseg" data-k="mode"><button data-v="present">Present</button><button data-v="practice">Practice</button><button data-v="run">Run-through</button></div>
        <div class="hint">Present is the clean audience view. Practice adds a coaching bar. Run-through shows the full script next to the slides.</div></div>
      <div class="nvr"><div class="nvhd"><h4>Speaking speed</h4><span class="nvnum"><input type="number" id="pn" min="0.5" max="1.8" step="0.01" inputmode="decimal">×</span></div><div class="hint" id="pv"></div>
        <input type="range" id="ps" min="0.6" max="1.6" step="0.05">
        <div class="nvseg" data-k="pace"><button data-v="0.85">Slower</button><button data-v="1">Normal</button><button data-v="1.15">Faster</button></div>
        <div class="hint">Everything is timed to your script. Faster = the visuals move on sooner. Ahead or behind on stage? <b>→</b> re-syncs and <b>Space</b> pauses.</div>
        <button type="button" id="cb">Calibrate by reading aloud</button>
        <div class="cal" id="cal"><p>${SAMPLE}</p><div class="res" id="cres">Press start, read this out loud at your normal speed, then press done.</div>
          <div class="acts"><button type="button" class="nvgo" id="cgo">Start</button><button type="button" id="cap" style="display:none">Use this speed</button></div></div></div>
      <div class="nvr"><div class="nvhd"><h4>Speed for each person</h4></div>
        <div class="nvhd" style="margin-top:6px"><h4 style="font-size:24px;color:#1268ff">Akaash</h4><span class="nvnum"><input type="number" id="pan" min="0.5" max="1.8" step="0.01" inputmode="decimal">×</span></div><input type="range" id="pas" min="0.6" max="1.6" step="0.05">
        <div class="nvhd"><h4 style="font-size:24px;color:#0a7a2f">Akshay / Shaurya</h4><span class="nvnum"><input type="number" id="psn" min="0.5" max="1.8" step="0.01" inputmode="decimal">×</span></div><input type="range" id="pss" min="0.6" max="1.6" step="0.05">
                <div class="hint">Each speaker gets their own speed on top of the main one. 1.00× is the script's normal pace.</div></div>
      <div class="nvr"><div class="nvhd"><h4>Countdown</h4></div>
        <div class="nvseg" data-k="countdown"><button data-v="0">None</button><button data-v="3">3 sec</button><button data-v="5">5 sec</button></div>
        <div class="hint">Time to breathe between pressing → and the first line.</div></div>
      <div class="nvr"><label class="nvtg"><span><h4>Auto-run</h4><span class="hint">Beats fire by themselves on the clock. Off = click for every beat.</span></span><span class="nvsw"><input type="checkbox" data-t="auto"><i></i></span></label></div>
      <div class="nvr"><label class="nvtg"><span><h4>Adapt to my pace</h4><span class="hint">Each time you press → early or late, the clock learns how fast you really talk and re-times the rest.</span></span><span class="nvsw"><input type="checkbox" data-t="adapt"><i></i></span></label></div>
      <div class="nvr"><div class="nvhd"><h4>Energy</h4></div>
        <div class="nvseg" data-k="energy"><button data-v="calm">Calm</button><button data-v="balanced">Balanced</button><button data-v="lively">Lively</button></div>
        <div class="hint">How busy the visuals feel. Calm = softer, slower, fewer wobbles. Balanced = big moments pop, the rest breathe. Lively = everything punchy.</div></div>
      <div class="nvr"><div class="nvhd"><h4>Performance</h4></div>
        <div class="nvseg" data-k="perf" data-str="1"><button data-v="auto">Auto</button><button data-v="on">Lite</button><button data-v="off">Full</button></div>
        <div class="hint">Lite turns off the floating shapes, confetti and glow. Auto switches to Lite by itself if your computer is struggling.</div></div>
      <div class="nvr"><label class="nvtg"><span><h4>Confetti</h4><span class="hint">Bursts on the big moments.</span></span><span class="nvsw"><input type="checkbox" data-t="confetti"><i></i></span></label></div>
      <div class="nvr"><label class="nvtg"><span><h4>Background motion</h4><span class="hint">Turn off if the projector computer is slow.</span></span><span class="nvsw"><input type="checkbox" data-t="ambient"><i></i></span></label></div>`;
    const q = s => root.querySelector(s), qa = s => [...root.querySelectorAll(s)];
    function refresh() {
      const s = get();
      qa('[data-k="energy"] button').forEach(b => b.classList.toggle('on', b.dataset.v === s.energy));
      qa('[data-k="perf"] button').forEach(b => b.classList.toggle('on', b.dataset.v === s.perf));
      qa('[data-k="mode"] button').forEach(b => b.classList.toggle('on', b.dataset.v === s.mode));
      qa('[data-k="countdown"] button').forEach(b => b.classList.toggle('on', +b.dataset.v === +s.countdown));
      qa('[data-k="pace"] button').forEach(b => b.classList.toggle('on', Math.abs(+b.dataset.v - s.pace) < .001));
      q('#ps').value = s.pace; const est = opts.total ? total() : BASE_TOTAL * (SHARE_A / s.paceA + (1 - SHARE_A) / s.paceS); q('#pv').textContent = 'Talk length about ' + mmss(est / s.pace);
      const put = (id, v) => { const e = q(id); if (e !== root.ownerDocument.activeElement) e.value = (+v).toFixed(2); };
      put('#pn', s.pace);
      q('#pas').value = s.paceA; q('#pss').value = s.paceS; put('#pan', s.paceA); put('#psn', s.paceS);
      qa('[data-t]').forEach(i => { i.checked = !!s[i.dataset.t]; });
    }
    qa('[data-k] button').forEach(b => b.onclick = () => { const k = b.parentNode.dataset.k; set({ [k]: (k === 'mode' || k === 'perf' || k === 'energy') ? b.dataset.v : +b.dataset.v }); refresh(); });
    q('#ps').oninput = e => { set({ pace: +e.target.value }); refresh(); };
    q('#pas').oninput = e => { set({ paceA: +e.target.value }); refresh(); };
    q('#pss').oninput = e => { set({ paceS: +e.target.value }); refresh(); };
    // typed values: apply as you type (when valid), tidy up on leave. Range .50 to 1.80; the slider shows 0.60 to 1.60.
    [['#pn', 'pace'], ['#pan', 'paceA'], ['#psn', 'paceS']].forEach(([id, key]) => {
      const e = q(id);
      e.oninput = () => { const v = parseFloat(e.value); if (v >= .5 && v <= 1.8) { set({ [key]: Math.round(v * 100) / 100 }); const s = get(); q('#ps').value = s.pace; q('#pas').value = s.paceA; q('#pss').value = s.paceS; q('#pv').textContent = 'Talk length about ' + mmss((opts.total ? total() : BASE_TOTAL * (SHARE_A / s.paceA + (1 - SHARE_A) / s.paceS)) / s.pace); } };
      e.onchange = () => { let v = parseFloat(e.value); if (!(v >= .5)) v = get()[key]; v = Math.min(1.8, Math.max(.5, v)); set({ [key]: Math.round(v * 100) / 100 }); refresh(); };
      e.onkeydown = ev => { ev.stopPropagation(); if (ev.key === 'Enter') e.blur(); };
    });
    qa('[data-t]').forEach(i => i.onchange = () => { set({ [i.dataset.t]: i.checked }); refresh(); });
    let t0 = 0, newPace = null;
    q('#cb').onclick = () => q('#cal').classList.toggle('open');
    q('#cgo').onclick = () => {
      if (!t0) { t0 = Date.now(); q('#cgo').textContent = 'Done'; q('#cres').textContent = 'Reading… press done as you finish the last word.'; q('#cap').style.display = 'none'; }
      else { const sec = (Date.now() - t0) / 1000, wps = SAMPLE.split(/\s+/).length / sec; t0 = 0; q('#cgo').textContent = 'Try again';
        newPace = Math.max(.6, Math.min(1.6, Math.round(wps / BASE_WPS * 20) / 20)); q('#cres').textContent = wps.toFixed(1) + ' words per second  →  speed ' + newPace.toFixed(2) + '×'; q('#cap').style.display = ''; }
    };
    q('#cap').onclick = () => { if (newPace) { set({ pace: newPace }); refresh(); q('#cres').textContent = 'Saved. Speed set to ' + newPace.toFixed(2) + '×'; q('#cap').style.display = 'none'; } };
    onChange(refresh); refresh();
    return { refresh };
  }
  window.NuvoSettings = { get, set, onChange, render, BASE_WPS, BASE_TOTAL };
})();
