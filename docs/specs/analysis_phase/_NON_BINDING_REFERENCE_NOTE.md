# Non-Binding Analysis Phase Reference Note

This folder contains supplemental Analysis Phase reference material for DEC CSO capacity analysis. It is useful context, but it is not the binding DEC Learning Hub source-of-truth package.

The binding source-of-truth package remains:

```text
docs/specs/core-workflow/
```

including the revised developer-facing implementation description and Annexes 1-13. Nothing in this folder overrides `docs/specs/core-workflow/`.

For offline/import data-entry, the final workbook and its README control:

```text
docs/data-templates/DEC_Capacity_Analysis_Data_Entry_Workbook_Final.xlsx
docs/data-templates/DEC_Capacity_Analysis_Workbook_README.md
```

Where this supplemental folder conflicts with the final workbook/import model, follow the workbook README.

Workbook/import interpretation rules:

- Where older files say "sub-capacity," interpret this as "Capacity Practice Area" in workbook/import contexts.
- The workbook/import model uses one row per CSO per Capacity Practice Area.
- The main scoring model is fixed as a 1-5 Current Practice Score.
- `Priority_Capacity_Gaps` bridges the assessment dataset to K/S/M/E routing, course-fit decisions, and course pipeline planning.
- Platform workflow fields such as approval, locking, handover, audit trail, roles, and permissions remain application-level concerns, not workbook data-entry requirements.

