"""Cooling of an SLS build by a new powder layer (benchtop SLS printer, public data).

Every number in the writeup comes from this file. Run with Python 3 and NumPy, SciPy, matplotlib:

    python fresh_layer.py          prints the numbers, checks the analytic solution, writes the figures

Model: 1-D conduction in depth. A fresh powder layer of thickness L lands at a temperature
dT below a powder cake at the bed temperature. Same properties above and below the interface.
Without heat from above, the top surface is insulated, and the exact solution (method of images) is

    theta(x, t) / dT = -1/2 [ erf((L - x) / (2 sqrt(a t))) + erf((L + x) / (2 sqrt(a t))) ]

with x the depth from the new surface and theta the deficit below bed temperature.
A finite-difference solve checks it and adds a heater on the top surface.
"""
import numpy as np
from scipy.special import erf
from scipy.sparse import diags
from scipy.sparse.linalg import splu
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle, FancyArrowPatch

# ---- inputs, each with its source and status --------------------------------------------
BED = 0.165          # m, square build area side           Formlabs Fuse 1/1+ tech specs (spec)
L = 110e-6           # m, layer thickness                    Formlabs Fuse tech specs (spec)
P_LASER = 30.0       # W, Fuse 1+ 30W laser                  Formlabs Fuse tech specs (spec)
RHO = 456.0          # kg/m3, PA12 powder bulk density       Yuan, Bourell, Diller 2011, lowest packing (literature)
CP = 2470.0          # J/kg K, PA12 at 400 K                 Yuan et al. 2011 (literature; higher at 450 K)
K = 0.10             # W/m K, PA12 powder                    Yuan et al. 2011, room temperature (literature; rises with T)
H_MELT = 115e3       # J/kg, PA12 melting enthalpy           EOS PA2200 data sheet (literature, another PA12)
FILL = 0.20          # fraction of a layer sintered           assumed
T_BUILD = 168.0      # C, typical PA12 build temperature     NETZSCH application note 2020 (literature, generic PA12)
T_CRYST = 153.4      # C, crystallization onset, 10 K/min    NETZSCH 2020
T_MELT = 181.0       # C, melting onset, 10 K/min            NETZSCH 2020
BAND = 2.0           # K, "controlled within 2 C"             Formlabs SLS guide (vendor statement)
DT = 30.0            # K, how far below the bed the powder lands   assumed, the unknown this page is about
K_PART = 0.26        # W/m K, laser-sintered PA12 (bulk)      Yuan et al. 2011 (literature)
RHO_PART = 990.0     # kg/m3, printed Nylon 12                Formlabs Nylon 12 TDS (vendor)

ALPHA = K / (RHO * CP)
AREA = BED ** 2


def deficit(x, t, dT=DT):
    """Exact deficit below bed temperature (K, positive = colder) at depth x (m), time t (s)."""
    s = 2.0 * np.sqrt(ALPHA * t)
    return 0.5 * dT * (erf((L - x) / s) + erf((L + x) / s))


def fd_solve(t_end, flux=0.0, t_heat=0.0, depth=3e-3, dz=2.5e-6, dt=1e-3, dT=DT, probe=L):
    """Implicit finite-difference deficit. flux (W/m2) enters the top surface for t < t_heat.
    Bottom held at bed temperature. Returns times and the deficit at depth `probe`."""
    n = int(round(depth / dz)) + 1
    z = np.arange(n) * dz
    th = np.where(z < L - 1e-12, dT, 0.0)
    th[np.isclose(z, L)] = dT / 2
    r = ALPHA * dt / dz ** 2
    main = np.full(n, 1 + 2 * r)
    up = np.full(n - 1, -r)
    lo = np.full(n - 1, -r)
    up[0] = -2 * r                     # insulated top, ghost node
    main[-1], lo[-1] = 1.0, 0.0        # fixed bottom
    A = splu(diags([lo, main, up], [-1, 0, 1], format="csc"))
    i_probe = int(round(probe / dz))
    ts, out = [0.0], [th[i_probe]]
    steps = int(round(t_end / dt))
    for k in range(steps):
        t = (k + 1) * dt
        b = th.copy()
        if t <= t_heat + 1e-12:
            b[0] -= 2 * r * flux * dz / K   # flux in lowers the deficit
        b[-1] = 0.0
        th = A.solve(b)
        ts.append(t)
        out.append(th[i_probe])
    return np.array(ts), np.array(out), z, th


def numbers():
    m_layer = RHO * AREA * L
    c_layer = m_layer * CP
    e_melt = FILL * m_layer * H_MELT
    t_laser = e_melt / P_LASER
    t_through = L ** 2 / ALPHA
    margin = T_BUILD - T_CRYST
    q_1s = RHO * CP * L * DT / 1.0
    print(f"diffusivity                 {ALPHA:.3e} m2/s")
    print(f"layer mass                  {m_layer*1e3:.2f} g")
    print(f"layer heat capacity         {c_layer:.2f} J/K")
    print(f"layer deficit at {DT:.0f} K       {c_layer*DT:.0f} J")
    print(f"melt energy at {FILL:.0%} fill     {e_melt:.1f} J  = {t_laser:.2f} s of laser at full absorption")
    print(f"K of shortfall = melt energy {e_melt/c_layer:.1f} K")
    print(f"through-layer time L^2/a    {t_through:.3f} s")
    for t in (0.1, 1, 10):
        print(f"penetration sqrt(a t), {t:>4} s  {np.sqrt(ALPHA*t)*1e3:.2f} mm")
    print(f"crystallization margin      {margin:.1f} K  -> interface reaches onset if dT > {2*margin:.0f} K")
    for t in (1e-3, 0.1, 1, 3, 10):
        print(f"interface deficit, {t:>6} s  {deficit(L, t):.1f} K   (ratio to band {deficit(L, t)/BAND:.1f})")
    # time for the interface deficit to fall back to the band
    from scipy.optimize import brentq
    t_b = brentq(lambda t: deficit(L, t) - BAND, 1e-4, 1e4)
    print(f"interface back inside band  {t_b:.1f} s")
    print(f"heater flux to restore {DT:.0f} K in 1 s  {q_1s/1e3:.2f} kW/m2 = {q_1s*AREA:.0f} W over the bed")
    print(f"share of the deficit that heater delivers in 10 ms: {0.01/1.0:.0%}")
    # over a sintered part instead of loose powder: contact temperature weighted by effusivity sqrt(k rho c)
    e_pow = np.sqrt(K * RHO * CP)
    e_part = np.sqrt(K_PART * RHO_PART * CP)
    print(f"effusivity powder {e_pow:.0f}, part {e_part:.0f} W s^0.5/m2 K (ratio {e_part/e_pow:.2f})")
    print(f"instant dip over a part     {DT*e_pow/(e_pow+e_part):.1f} K  (over loose powder {DT/2:.1f} K)")
    return dict(t_band=t_b, q_1s=q_1s)


def check():
    """Finite difference against the exact solution, and energy conservation."""
    ts, fd, z, th = fd_solve(2.0)
    ex = deficit(L, ts[1:])
    err = np.max(np.abs(fd[1:] - ex)[ts[1:] > 0.01])
    print(f"FD vs exact at interface, max error after 10 ms: {err:.3f} K")
    assert err < 0.2
    e0 = DT * L
    e1 = np.trapezoid(th, z)
    print(f"energy (deficit x depth) kept: {e1/e0:.4f}")
    assert abs(e1 / e0 - 1) < 0.01


INK = "#1f1f1f"
BLUE = "#2a6f97"
RED = "#c0392b"
GREY = "#8a8a8a"


def fig_profiles(path, q_1s):
    fig, (a, b) = plt.subplots(1, 2, figsize=(12.8, 5.6), dpi=100)
    x = np.linspace(0, 1.2e-3, 600)
    for t, c in ((0.01, RED), (0.1, "#d4774a"), (1, BLUE), (10, "#6a9fc0")):
        a.plot(x * 1e3, -deficit(x, t), color=c, lw=2, label=f"{t:g} s later")
    a.plot([0, L * 1e3, L * 1e3, 1.2], [-DT, -DT, 0, 0], color=GREY, lw=1.2, ls="--", label="at the start")
    for j in range(1, 11):
        a.axvline(j * L * 1e3, color="#e2e2e2", lw=0.8, zorder=0)
    a.axhline(-BAND, color=GREY, lw=0.8, ls=":")
    a.text(1.18, -BAND - 0.4, "2 K limit", ha="right", va="top", color=GREY, fontsize=10)
    a.set_xlim(0, 1.2)
    a.set_ylim(-DT - 1, 1)
    a.set_xlabel("depth below the new surface, mm (grey lines: 110 µm layers)")
    a.set_ylabel("temperature relative to the bed, K")
    a.set_title(f"New layer {DT:.0f} K below bed temperature, no heat from above", fontsize=12)
    a.legend(frameon=False, fontsize=10, loc="lower right")

    t = np.logspace(np.log10(2e-3), 1, 400)
    for dT, c in ((30, RED), (20, "#d4774a"), (10, BLUE)):
        b.semilogx(t, -deficit(L, t, dT), color=c, lw=2, label=f"new layer {dT} K cold")
    margin = T_BUILD - T_CRYST
    b.axhline(-margin, color=GREY, lw=1, ls="--")
    b.text(0.0021, -margin + 0.4, f"crystallization onset, {margin:.1f} K below a {T_BUILD:.0f} °C bed", color=GREY, fontsize=10, va="bottom")
    b.axhline(-BAND, color=GREY, lw=0.8, ls=":")
    b.text(0.0021, -BAND + 0.3, "2 K limit", color=GREY, fontsize=10, va="bottom")
    b.set_xlim(2e-3, 10)
    b.set_ylim(-DT / 2 - 2, 1)
    b.set_xlabel("time after spreading, s")
    b.set_ylabel("top of the previous layer, relative to the bed, K")
    b.set_title("Top of the previous layer, no heat from above", fontsize=12)
    b.legend(frameon=False, fontsize=10, loc="lower right", bbox_to_anchor=(1, 0.17))
    for ax in (a, b):
        ax.grid(alpha=0.25)
        for s in ("top", "right"):
            ax.spines[s].set_visible(False)
    fig.tight_layout()
    fig.savefig(path, facecolor="white")
    plt.close(fig)


def fig_section(path):
    """Schematic section through the bed during a recoat. Not to scale."""
    fig, ax = plt.subplots(figsize=(12.8, 5.2), dpi=100)
    ax.set_xlim(0, 12.8)
    ax.set_ylim(0, 5.2)
    ax.axis("off")
    # cake and parts
    ax.add_patch(Rectangle((0.6, 0.4), 11.6, 2.2, fc="#efe9df", ec=INK, lw=1.2))
    ax.add_patch(Rectangle((2.2, 1.0), 2.4, 1.6, fc="#cdbfa6", ec=INK, lw=1))
    ax.add_patch(Rectangle((9.4, 0.7), 1.6, 1.9, fc="#cdbfa6", ec=INK, lw=1))
    ax.text(1.0, 0.75, "loose powder at bed temperature", fontsize=11, color=INK)
    ax.text(3.4, 1.7, "printed\npart", ha="center", fontsize=11, color=INK)
    ax.text(10.2, 1.5, "printed\npart", ha="center", fontsize=11, color=INK)
    # fresh layer left behind the roller, which moves to the right pushing a heap of powder
    ax.add_patch(Rectangle((0.6, 2.6), 5.9, 0.28, fc="#9cc3dc", ec=INK, lw=1))
    ax.text(0.7, 2.95, "new layer, 110 µm, ΔT below bed temperature", fontsize=11, color=BLUE)
    ax.add_patch(Circle((6.85, 3.15), 0.32, fc="white", ec=INK, lw=1.4))
    ax.text(6.85, 3.65, "roller", ha="center", fontsize=11)
    ax.annotate("", xy=(8.1, 3.6), xytext=(7.3, 3.6), arrowprops=dict(arrowstyle="-|>", color=INK, lw=1.2))
    ax.add_patch(Rectangle((7.2, 2.6), 0.9, 0.22, fc="#9cc3dc", ec=INK, lw=0.8))
    ax.text(8.25, 2.71, "powder pushed ahead", fontsize=10, color=BLUE, va="center")
    # heaters
    for xh in (2.0, 5.0, 8.0, 11.0):
        ax.add_patch(Rectangle((xh - 0.9, 4.6), 1.8, 0.16, fc="white", ec=RED, lw=1.4))
        ax.add_artist(FancyArrowPatch((xh, 4.5), (xh, 3.3), arrowstyle="-|>", mutation_scale=14, color=RED, lw=1.2))
    ax.text(12.2, 4.9, "radiant heaters", ha="right", fontsize=11, color=RED)
    # heat from below
    for xb in (1.6, 3.4, 5.0):
        ax.add_artist(FancyArrowPatch((xb, 2.25), (xb, 2.62), arrowstyle="-|>", mutation_scale=12, color=BLUE, lw=1.2))
    ax.text(5.3, 2.2, "or heat drawn from\nthe powder and parts below", fontsize=11, color=BLUE, va="center")
    ax.text(12.2, 0.1, "schematic, not to scale", ha="right", fontsize=10, color=GREY)
    fig.savefig(path, facecolor="white", bbox_inches="tight")
    plt.close(fig)


if __name__ == "__main__":
    check()
    n = numbers()
    fig_section("freshlayer_section.png")
    fig_profiles("freshlayer_profiles.png", n["q_1s"])
    print("wrote freshlayer_section.png, freshlayer_profiles.png")
