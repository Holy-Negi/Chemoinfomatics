def compute_equivalents(reaction, scale_mmol):
    """反応と律速量(mmol)から、各成分の物質量・質量・体積を計算する"""
    rows = []
    for comp in reaction.components:
        cpd = comp.compound
        row = {
            "name": cpd.name, "role": comp.role.value, "equiv": comp.equiv,
            "mmol": None, "mass_g": None, "volume_ml": None,
        }

        if comp.role.value == "solvent":
            # 溶媒：当量でなく反応濃度から体積を逆算  V[mL] = S / C
            if reaction.conc:
                row["volume_ml"] = scale_mmol / reaction.conc
        else:
            if comp.equiv is not None:
                n = scale_mmol * comp.equiv            # n = S·e [mmol]
                row["mmol"] = n
                if cpd.mw is not None:
                    m = n * cpd.mw / 1000.0            # m = S·e·M / 1000 [g]
                    row["mass_g"] = m
                    if cpd.density:                    # 液体なら体積も  V = m/d [mL]
                        row["volume_ml"] = m / cpd.density
        rows.append(row)
    return rows