"""Whole-build simulation for the fresh-layer note: how long each new layer takes to be ready
for the laser, and whether the build drifts colder.

Run after fresh_layer.py, from the same folder:

    python fresh_layer_build.py     prints the numbers, writes freshlayer_build.png and freshlayer_wait.png

A 1-D column of loose powder grows by one 110 um layer every T_LAYER seconds. Each new layer
arrives dT below bed temperature. A radiant heater on the top surface is driven by a PI
controller on the surface temperature (what an infrared sensor sees), limited to q_max. The
bottom of the column is insulated, so every joule the new layers lack comes from the heater or
from the layers below. Left out: the laser (it only adds heat), heat lost to the enclosure (so
q_max is only the share of heater power that warms new powder), and the powder's particle scale
(the continuum model is not meaningful below about 0.1 s and one layer).

"Ready" means the top surface is back within BAND of bed temperature and stays there.
"""
import numpy as np
from scipy.sparse import diags
from scipy.sparse.linalg import splu
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from fresh_layer import L, RHO, CP, K, AREA, BAND, DT, BLUE, RED, GREY

T_LAYER = 10.0       # s between layers                       assumed (not published for the Fuse)
KP, KI = 300.0, 30.0 # W/m2 K and W/m2 K s, PI gains on surface temperature   assumed
NODES = 6            # grid nodes per layer
DTIME = 5e-3         # s, time step (implicit)
BASE = 30            # layers of starting powder at bed temperature


def build(dT=DT, q_max=2000.0, n_layers=60, t_layer=T_LAYER, keep_last=3):
    """theta is the deficit below bed temperature (K, positive = colder).
    Returns per-layer ready time and top-millimetre deficit, and the surface history
    over the last `keep_last` layers."""
    dz = L / NODES
    cv = RHO * CP
    th = np.zeros(BASE * NODES)
    integ = 0.0
    steps = int(round(t_layer / DTIME))
    a = K / dz ** 2
    ready, top_mm, hist_t, hist_s = [], [], [], []
    A = None
    for n in range(n_layers):
        th = np.concatenate([np.full(NODES, dT), th])
        m = th.size
        main = np.full(m, cv / DTIME + 2 * a)
        main[0] = main[-1] = cv / DTIME + a
        A = splu(diags([np.full(m - 1, -a), main, np.full(m - 1, -a)], [-1, 0, 1], format="csc"))
        last_out = 0.0
        for s in range(steps):
            q = KP * th[0] + integ
            if 0.0 < q < q_max:
                integ += KI * th[0] * DTIME
            q = min(max(q, 0.0), q_max)
            b = cv / DTIME * th
            b[0] -= q / dz
            th = A.solve(b)
            t = (s + 1) * DTIME
            if th[0] > BAND:
                last_out = t
            if n >= n_layers - keep_last and s % 4 == 0:
                hist_t.append(n * t_layer + t)
                hist_s.append(th[0])
        ready.append(last_out if last_out < t_layer - DTIME else np.inf)
        top_mm.append(th[: int(round(1e-3 / dz))].mean())
    return dict(ready=np.array(ready), top_mm=np.array(top_mm), t=np.array(hist_t), s=np.array(hist_s))


def main():
    q_mean = RHO * CP * L * DT / T_LAYER
    print(f"mean flux to warm new powder, dT {DT:.0f} K, {T_LAYER:.0f} s layers: {q_mean:.0f} W/m2 = {q_mean*AREA:.1f} W")

    # ready time with no heater, from the exact solution at the surface: dT erf(L / (2 sqrt(a t)))
    from scipy.special import erfinv
    from fresh_layer import ALPHA
    for dT in (30, 75):
        z = erfinv(BAND / dT)
        print(f"no heater, dT {dT} K: surface within {BAND:.0f} K after {(L/(2*z))**2/ALPHA:.1f} s")

    # surface history and drift
    lines = {}
    for qm in (1000.0, 2000.0, 4000.0):
        r = build(dT=DT, q_max=qm, n_layers=20)
        lines[qm] = r
        print(f"q_max {qm/1e3:.0f} kW/m2 ({qm*AREA:.0f} W), dT {DT:.0f} K: ready after {r['ready'][-1]:.2f} s")
    drift = {}
    for qm in (250.0, 370.0, 500.0, 1000.0, 2000.0):
        r = build(dT=DT, q_max=qm, n_layers=100, keep_last=0)
        drift[qm] = r
        print(f"q_max {qm:5.0f} W/m2 ({qm*AREA:3.0f} W): top mm at layer 100 {r['top_mm'][-1]:6.2f} K below bed, "
              f"change over last 50 layers {r['top_mm'][-1]-r['top_mm'][49]:+.2f} K")

    # ready time against arrival shortfall and heater limit
    dTs = np.array([5, 10, 20, 30, 45, 60, 75], float)
    qms = (1000.0, 2000.0, 4000.0, 8000.0)
    wait = {}
    for qm in qms:
        w = []
        for dT in dTs:
            r = build(dT=dT, q_max=qm, n_layers=6, keep_last=0)
            w.append(r["ready"][-1])
        wait[qm] = np.array(w)
        print(f"q_max {qm/1e3:.0f} kW/m2 ({qm*AREA:3.0f} W): ready times " +
              ", ".join(f"{d:.0f} K {x:.2f} s" for d, x in zip(dTs, w)))

    # ---- figure: surface over three layers, and drift -----------------------------------
    fig, (a, b) = plt.subplots(1, 2, figsize=(12.8, 5.6), dpi=100)
    for qm, colr in zip(lines, (RED, "#d4774a", BLUE)):
        r = lines[qm]
        t0 = r["t"][0] - (r["t"][0] % T_LAYER)
        a.plot(r["t"] - t0, -r["s"], color=colr, lw=1.8, label=f"heater limit {qm/1e3:.0f} kW/m² ({qm*AREA:.0f} W)")
    a.axhline(-BAND, color=GREY, lw=0.8, ls=":")
    a.text(29.6, -BAND + 0.3, "2 K", ha="right", color=GREY, fontsize=10)
    a.set_xlim(0, 30)
    a.set_ylim(-DT - 1, 3)
    a.set_xlabel("time over three layers, s")
    a.set_ylabel("surface of the newest layer, relative to the bed, K")
    a.set_title(f"New layers {DT:.0f} K cold, one every {T_LAYER:.0f} s", fontsize=12)
    a.legend(frameon=False, fontsize=9.5, loc="lower right")
    layers = np.arange(1, 101)
    for qm, colr in zip(drift, ("#7a1f17", RED, "#d4774a", "#6a9fc0", BLUE)):
        b.plot(layers, -drift[qm]["top_mm"], color=colr, lw=1.8, label=f"{qm/1e3:.2f} kW/m² ({qm*AREA:.0f} W)")
    b.axhline(-BAND, color=GREY, lw=0.8, ls=":")
    b.set_xlabel("layer number")
    b.set_ylabel("top 1 mm at the end of each layer, relative to the bed, K")
    b.set_title(f"Heater limit, new layers {DT:.0f} K cold", fontsize=12)
    b.legend(frameon=False, fontsize=9.5, loc="lower left", title="heater limit", title_fontsize=9.5)
    for ax in (a, b):
        ax.grid(alpha=0.25)
        for s_ in ("top", "right"):
            ax.spines[s_].set_visible(False)
    fig.tight_layout()
    fig.savefig("freshlayer_build.png", facecolor="white")
    plt.close(fig)

    # ---- figure: ready time ---------------------------------------------------------------
    fig, ax = plt.subplots(figsize=(12.8, 5.0), dpi=100)
    for qm, colr in zip(qms, (RED, "#d4774a", "#6a9fc0", BLUE)):
        ax.plot(dTs, wait[qm], "o-", color=colr, lw=2, label=f"heater limit {qm/1e3:.0f} kW/m² ({qm*AREA:.0f} W)")
    ax.axvline(75, color=GREY, lw=1, ls="--")
    ax.text(74, 0.15, "feed gap measured on\na Sinterstation 2500", ha="right", va="bottom", color=GREY, fontsize=10)
    ax.set_xlabel("how far below bed temperature the new layer arrives, K")
    ax.set_ylabel("time until its surface is within 2 K, s")
    ax.set_title("When the new layer is ready for the laser", fontsize=12)
    ax.legend(frameon=False, fontsize=10, loc="upper left")
    ax.set_xlim(0, 80)
    ax.set_ylim(0, None)
    ax.grid(alpha=0.25)
    for s_ in ("top", "right"):
        ax.spines[s_].set_visible(False)
    fig.tight_layout()
    fig.savefig("freshlayer_wait.png", facecolor="white")
    plt.close(fig)
    print("wrote freshlayer_build.png, freshlayer_wait.png")


if __name__ == "__main__":
    main()
