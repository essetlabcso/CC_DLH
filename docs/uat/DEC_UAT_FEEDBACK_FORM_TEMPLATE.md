# DEC User Acceptance Testing (UAT) Feedback Form Template

This feedback template is used by ESSET and DEC testers to report issues, suggest enhancements, and evaluate the usability of the Course Creator Portal during User Acceptance Testing (UAT).

---

## 1. Staging UAT Feedback Log

Testers should complete one row in the table below for each unique observation or issue encountered:

| Tester Name & Role | Test Date | Tested Role (Admin/Creator/Reviewer/Learner) | Task Tested | What Worked Well | Issue / Bug Encountered | Severity (Critical/Major/Minor/Suggestion) | Expected Behavior | Actual Behavior | Recommended Improvement | Decision (Fix Now/Fix Later/Not in Scope) |
|---|---|---|---|---|---|---|---|---|---|---|
| *Example: Chala K. (Reviewer)* | *2026-05-06* | *Reviewer* | *Inspect Handover & Approve* | *The checklist loaded instantly with 0 blockers.* | *Typos found in required text block description.* | *Minor* | *Block title and purpose should be free of typos.* | *Title read 'Introdution' instead of 'Introduction'.* | *Correct typo in the database seed script.* | *Fix Now* |
| | | | | | | | | | | |
| | | | | | | | | | | |
| | | | | | | | | | | |

---

## 2. Role-Specific Usability & Feedback Prompts

To help gather high-quality, structured feedback, please consider the following guiding prompts during your evaluation:

### A. Admin Reference Configuration & Lookups
- Did the Ethiopian geographic regions and capacity indicators render correctly on the lookups page?
- Was it clear that core platform governance constraints (like the strict 80% score threshold) are locked and unalterable by administrators?
- Was the navigation inside `/admin` intuitive?

### B. Creator Studio Workflow & Gates
- Did the progression through the analysis, mapping, and storyboard gates feel smooth and logical?
- Was it clear that all design storyboards must be completed and locked before starting lesson building?
- Did the required block purpose and justification fields feel clear and useful, rather than an administrative burden?

### C. Reviewer Queue & Handover Assessment
- Did the `/review/queue` card successfully summarize the submitted course version's anchors and block counts?
- Did the pre-seeded Build-to-Review Handover Checklist correctly display the course's readiness status (with 0 blocking warnings)?
- Did the approval form correctly enforce the 20-character comment minimum and require all checkboxes to be checked before submitting?

### D. Admin Publishing Handoff
- Was the separation of roles clear—specifically that a Course Creator or Reviewer cannot publish a course, and only a DEC Admin has access to the `/review/publishing` dashboard?
- Did the status transition from `APPROVED` to `PUBLISHED` succeed seamlessly with one click?

### E. Learner Experience & Certificate Rigor
- Did the course catalog list only `PUBLISHED` active courses?
- Was the lesson workstation layout clean and readable?
- Did taking the final test successfully enforce the strict 80% pass threshold (issuing a certificate only on scores $\ge 80\%$ and failing on $\le 79\%$)?
- Did the issued certificate prominently render the **Governance Notice** regarding academic completion vs. field organizational change?

### F. Optional Practical Proof & separation
- Was the Practical Proof section clearly marked as optional and separate from the academic certificate?
- Did the proof submission successfully default to `PRIVATE` to protect citizen and CSO privacy?
- Was the separate review flow for practical proof clear and easy to navigate?

### G. Monitoring & Aggregate Reporting
- Did the monitoring dashboard successfully present progress, certificates, and practical proofs as separate, independent metrics?
- Was the organizational transformation warning banner clearly visible at the top of the monitoring pages?
- Did the dashboard successfully mask all raw practical proof text to ensure data safety?

### H. Accessibility & Usability under Constraints
- Did the application render correctly on mobile browsers (accessibility/mobile responsiveness)?
- Did pages load quickly under simulated slow connections (representing low-bandwidth regional offices)?
- Was the product terminology culturally appropriate and free of internal software development jargon?
