def compute_equivalents(reaction, scale_mmol):
    rows = []
    for comp in reaction.components:
        cpd = comp.compound
        row = {
            "name": cpd.name, "mw": cpd.mw, "role": comp.role.value, "equiv": comp.equiv,
            "mmol": None, "mass_g": None, "volume_ml": None,
        }
        if comp.role.value == "solvent":
            if reaction.conc:
                row["volume_ml"] = scale_mmol / reaction.conc
        else:
            if comp.equiv is not None:
                n = scale_mmol * comp.equiv
                row["mmol"] = n
                if cpd.mw is not None:
                    m = n * cpd.mw / 1000.0
                    row["mass_g"] = m
                    if cpd.density:
                        row["volume_ml"] = m / cpd.density
        rows.append(row)
    return rows
