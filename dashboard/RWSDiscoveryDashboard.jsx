import { useState, useEffect } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const CATEGORIES = {
  programme: { label: "Programme Rules", color: "#ff4d6d", bg: "rgba(255,77,109,.1)", dot: "#ff4d6d" },
  member:     { label: "Member Services", color: "#38bdf8", bg: "rgba(56,189,248,.1)",  dot: "#38bdf8" },
  data:       { label: "Data",            color: "#2dd4bf", bg: "rgba(45,212,191,.1)",  dot: "#2dd4bf" },
  campaigns:  { label: "Campaigns",       color: "#c084fc", bg: "rgba(192,132,252,.1)", dot: "#c084fc" },
  bulk:       { label: "Bulk Issuance",   color: "#fbbf24", bg: "rgba(251,191,36,.1)",  dot: "#fbbf24" },
  gamification:{ label: "Gamification",  color: "#fb7185", bg: "rgba(251,113,133,.1)", dot: "#fb7185" },
  marketing:  { label: "Marketing Comms",color: "#f97316", bg: "rgba(249,115,22,.1)",  dot: "#f97316" },
  referral:   { label: "Referral",        color: "#a78bfa", bg: "rgba(167,139,250,.1)", dot: "#a78bfa" },
};

const STATUS = {
  in:      { label: "In BRD",      color: "#4ade80", bg: "rgba(74,222,128,.12)",  icon: "✓" },
  partial: { label: "Partial",     color: "#fb923c", bg: "rgba(251,146,60,.12)",  icon: "⚠" },
  missing: { label: "Not in BRD",  color: "#f87171", bg: "rgba(248,113,113,.12)", icon: "✗" },
  conflict:{ label: "CONFLICT",    color: "#ff4d6d", bg: "rgba(255,77,109,.15)",  icon: "⚡" },
};

const WISHLIST = [
  { id:1, cat:"programme", icon:"🛡️", title:"Fraud Detection & Prevention",
    desc:"Real-time anomaly detection for member accounts & transactions. Customisable thresholds per store group (retail, F&B, ticketing, hotels) and spend channel. Pre-set alerts, notifications, and suspension actions. Configurable dashboard with custom timespan and export.",
    status:"missing", brdRef:"Not in BRD", gap:"Add new §9.1.X Fraud Detection section + NFR targets", defaultPri:"must", severity:"critical" },
  { id:2, cat:"programme", icon:"💳", title:"Points Earning — Payment Mode Eligibility Config",
    desc:"Points earned on cash/credit/debit only. Certain stores award tier-qualifying points only (no spendable points). Eligible payment modes for points earning and tier eligibility must be configurable per store group.",
    status:"partial", brdRef:"FR 9.1.6.01 covers earn rate only", gap:"Add payment mode restriction + store-level earn config to §9.1.6", defaultPri:"must", severity:"high" },
  { id:3, cat:"programme", icon:"🏪", title:"New Store Creation — Extended Fields",
    desc:"Store fields required: RWS/3P flag · Store Name · Store Type · Store Location Group · OU/CC & GL information · Unique identifier for reports. Active/inactive store differentiation.",
    status:"partial", brdRef:"FR 9.1.4.01 exists — GL/OU fields missing", gap:"Update §9.1.4.01 store field spec with GL, OU/CC, active/inactive flag", defaultPri:"must", severity:"high" },
  { id:4, cat:"programme", icon:"🔄", title:"Void Transactions",
    desc:"Voided earn/redemption transactions reversed to original point source. All voids reflected in Finance reports. Same-day void restriction only.",
    status:"conflict", brdRef:"§7.03 — EXPLICITLY OUT OF SCOPE", gap:"⚡ SPONSOR DECISION REQUIRED — BRD says OOS but BU includes in wishlist", defaultPri:"must", severity:"critical" },
  { id:5, cat:"programme", icon:"⚡", title:"Fast Track & Partner Tier Match",
    desc:"Fast track members between non-adjacent tiers (e.g. Tier A → C). Real-time tier upgrade/downgrade based on eligible spend over duration. Tier match with partner programs (KrisFlyer). Partner fast-track with minimum spend.",
    status:"missing", brdRef:"Not in BRD", gap:"Add FR to §9.1.6 — partner integration API required", defaultPri:"should", severity:"medium" },
  { id:6, cat:"programme", icon:"⛔", title:"Member Suspension vs Deletion (Two States)",
    desc:"Suspended: app content accessible, no transactions, cannot re-register with same credentials. Deleted: no app login, previous credentials released for re-use. Two distinct business states.",
    status:"missing", brdRef:"active_status 0/1/2 defined but logic incomplete", gap:"Expand §9.1.5 with suspension/deletion business rules", defaultPri:"must", severity:"high" },
  { id:7, cat:"programme", icon:"👤", title:"Pre-created Staff Accounts (Default Password Flow)",
    desc:"Pre-create staff accounts so new employees simply download the app and sign in with a default password — eliminating self-registration. Bulk employee account provisioning at onboarding.",
    status:"missing", brdRef:"Not in BRD", gap:"Add FR to §9.1.5 employee section for bulk provisioning", defaultPri:"should", severity:"medium" },
  { id:8, cat:"member", icon:"🖥️", title:"Concierge Portal — Points Adjustment + Reason Code",
    desc:"Simplified concierge view with full point history (store, type, amount, points earned). Point adjustments with reason code field and notes for audit records. Finance report integration for reconciliation verification.",
    status:"partial", brdRef:"FR 9.1.5.18, 9.1.5.12 — reason code + finance export missing", gap:"Add reason code field and finance export linkage to §9.1.5.18", defaultPri:"must", severity:"high" },
  { id:9, cat:"member", icon:"✏️", title:"Member Profile Update via Concierge Portal",
    desc:"Concierge staff can update member information via standalone portal without requiring member app access.",
    status:"in", brdRef:"FR 9.1.5.03 (edit profile via API)", gap:"Confirm if concierge portal is a separate UI or SessionM admin panel", defaultPri:"must", severity:"none" },
  { id:10, cat:"member", icon:"➕", title:"Member Account Creation via Concierge Portal",
    desc:"Concierge staff can create member accounts on behalf of walk-in members without requiring the member app.",
    status:"partial", brdRef:"FR 9.1.5.01 (API creation) — no concierge portal UI specified", gap:"Add concierge portal UI requirement for walk-in registration", defaultPri:"must", severity:"medium" },
  { id:11, cat:"member", icon:"🏅", title:"Tier Adjustment — Add TQP Without Resetting Expiry",
    desc:"Add tier-qualifying points (TQP) to a user's account for missing transactions without resetting the existing TQP expiry date. Expiry window must be preserved.",
    status:"partial", brdRef:"FR 9.1.5.19 — TQP expiry preservation not specified", gap:"Add rule to §9.1.5.19 that manual TQP addition preserves original expiry window", defaultPri:"must", severity:"medium" },
  { id:12, cat:"data", icon:"📊", title:"Real-time In-Platform Dashboard (No SQL)",
    desc:"Self-serve real-time analytics within SessionM UI. BU currently must write SQL code to extract data from Data Cloud — wants in-platform dashboard capabilities.",
    status:"missing", brdRef:"§9.1.15 covers S3/Data Cloud — no UI dashboard specified", gap:"Add real-time dashboard requirement to §9.1.16 or new section; confirm SessionM UI capability", defaultPri:"should", severity:"medium" },
  { id:13, cat:"campaigns", icon:"🔀", title:"Mutually Exclusive / Either-Or Campaign Setup",
    desc:"Allow either/or promotion logic with mutual exclusion — customer qualifies for only one. Example: Spend $25 single receipt OR spend $288 with 3 receipts. Rollover quantity cap per day.",
    status:"missing", brdRef:"§9.1.8 — no mutual exclusion logic", gap:"Add mutual exclusion campaign FR to §9.1.8 — check SessionM native capability", defaultPri:"must", severity:"critical" },
  { id:14, cat:"campaigns", icon:"🔢", title:"Decimal Point Cap on Point Source Restriction",
    desc:"Allow decimal point values in campaign-level point source caps (e.g. 0.5x multiplier restriction).",
    status:"missing", brdRef:"§9.1.7 — no decimal cap specification", gap:"Add decimal cap FR to §9.1.7 or §9.1.8; confirm SessionM support", defaultPri:"should", severity:"low" },
  { id:15, cat:"campaigns", icon:"🎟️", title:"Promo Codes — Custom Prefix, Cap & Redemption Report",
    desc:"Custom promo code naming prefix (points vs promo). Max points per user capped at campaign level for unique and generic codes. View report of successful redemptions — currently unavailable.",
    status:"missing", brdRef:"Not in BRD — no promo code section exists", gap:"Add new §9.1.X Promo Codes section", defaultPri:"must", severity:"critical" },
  { id:16, cat:"campaigns", icon:"🔗", title:"Referral Codes — Multi-criteria Referrer & Referee Rewards",
    desc:"Customised outcomes for referrer and referee. Referrer gets points + vouchers on signup + $X spend or N referrals. Cannot currently layer multiple conditions simultaneously.",
    status:"missing", brdRef:"Not in BRD — referral not mentioned anywhere", gap:"Add new §9.1.X Referral Program section", defaultPri:"should", severity:"critical" },
  { id:17, cat:"bulk", icon:"📦", title:"Mass Issuance of Points/Vouchers by Member ID List",
    desc:"Self-serve bulk issuance of points or vouchers to a specific set of Membership IDs via CSV upload. Currently requires individual credits or SessionM Support Team involvement.",
    status:"missing", brdRef:"§9.1.3 covers bulk ingestion (stores/tags) — not points/vouchers", gap:"Add mass issuance FR to §9.1.2 or new section", defaultPri:"must", severity:"high" },
  { id:18, cat:"gamification", icon:"🎮", title:"In-App Gamification, Lucky Draw & Scratch Cards",
    desc:"In-app gamification mechanics. Lucky draw capability. Random reward issuance (scratch cards). Requires integration with member app frontend.",
    status:"missing", brdRef:"Not in BRD", gap:"Architecture assessment required — likely custom dev beyond SessionM OOB; Phase 2 candidate", defaultPri:"nice", severity:"low" },
  { id:19, cat:"marketing", icon:"📣", title:"Push Notifications & eDM Blast to Members",
    desc:"Modules to support push notification and email direct mail (eDM) blast to loyalty members.",
    status:"in", brdRef:"§9.1.10 Messaging — 10 triggers covered", gap:"Confirm downstream messaging platform (Braze / SendGrid / custom)", defaultPri:"must", severity:"none" },
  { id:20, cat:"referral", icon:"🔗", title:"Referral Codes (Duplicate Entry — Merge or Separate?)",
    desc:"Same requirement as Campaign item #16. Confirm if this should be a separate FR section or merged into the Campaigns referral section.",
    status:"missing", brdRef:"Duplicate of item #16", gap:"Decide: merge into §9.1.X Referral or keep separate section", defaultPri:"should", severity:"low" },
  { id:21, cat:"campaigns", icon:"📢", title:"Referral — Min Spend Multi-criteria Layering",
    desc:"Unable to layer multiple criteria for a referral condition to reward both referrer and referee simultaneously (e.g. min spend of $30 within 30 days).",
    status:"missing", brdRef:"Not in BRD", gap:"Include in new §9.1.X Referral Program section", defaultPri:"should", severity:"high" },
];

const GAPS = WISHLIST.filter(w => w.status !== "in");
const CRITICAL_GAPS = GAPS.filter(w => w.severity === "critical");
const IN_BRD = WISHLIST.filter(w => w.status === "in");
const PARTIAL = WISHLIST.filter(w => w.status === "partial");
const MISSING = WISHLIST.filter(w => w.status === "missing" || w.status === "conflict");

// ── COMPONENTS ────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.missing;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      padding:"2px 9px", borderRadius:20,
      background:s.bg, color:s.color,
      border:`1px solid ${s.color}40`,
      fontSize:10, fontWeight:800, letterSpacing:.3,
      fontFamily:"'DM Mono', monospace"
    }}>{s.icon} {s.label}</span>
  );
};

const SevDot = ({ sev }) => {
  const cols = { critical:"#ff4d6d", high:"#fb923c", medium:"#fbbf24", low:"#a3e635", none:"#4ade80" };
  const c = cols[sev] || cols.none;
  return <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:c, marginRight:5, boxShadow:`0 0 6px ${c}` }} />;
};

const PriorityBadge = ({ pri }) => {
  const map = {
    must:   { label:"Must Have",    color:"#ff4d6d", bg:"rgba(255,77,109,.12)" },
    should: { label:"Should Have",  color:"#fb923c", bg:"rgba(251,146,60,.12)" },
    nice:   { label:"Nice to Have", color:"#fbbf24", bg:"rgba(251,191,36,.12)" },
    oos:    { label:"Out of Scope", color:"#64748b", bg:"rgba(100,116,139,.12)" },
  };
  const p = map[pri] || map.should;
  return (
    <span style={{ padding:"2px 8px", borderRadius:12, background:p.bg, color:p.color,
      border:`1px solid ${p.color}40`, fontSize:10, fontWeight:800 }}>{p.label}</span>
  );
};

// ── OVERVIEW TAB ──────────────────────────────────────────────────────────────
const OverviewTab = () => {
  const catBreakdown = Object.entries(CATEGORIES).map(([key, cat]) => {
    const items = WISHLIST.filter(w => w.cat === key);
    const inBrd = items.filter(w => w.status === "in").length;
    const partial = items.filter(w => w.status === "partial").length;
    const missing = items.filter(w => w.status === "missing" || w.status === "conflict").length;
    return { key, cat, items: items.length, inBrd, partial, missing };
  }).filter(c => c.items > 0);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Stat row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
        {[
          { n:21, label:"Total Wishlist", color:"#38bdf8" },
          { n:7,  label:"Categories",    color:"#c084fc" },
          { n:IN_BRD.length, label:"In BRD ✓", color:"#4ade80" },
          { n:PARTIAL.length, label:"Partial ⚠", color:"#fb923c" },
          { n:MISSING.length, label:"Not in BRD ✗", color:"#f87171" },
          { n:"38%", label:"BRD Coverage", color:"#fbbf24" },
        ].map((s,i) => (
          <div key={i} style={{ background:"#162433", border:"1px solid #1e3450", borderRadius:10,
            padding:"12px 10px", textAlign:"center" }}>
            <div style={{ fontSize:26, fontWeight:900, color:s.color, fontFamily:"'DM Mono',monospace", lineHeight:1 }}>{s.n}</div>
            <div style={{ fontSize:9.5, color:"#8fa3b8", marginTop:4, fontFamily:"'DM Sans',sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {/* Category table */}
        <div style={{ background:"#162433", border:"1px solid #1e3450", borderRadius:10, padding:"14px 16px" }}>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#8fa3b8", marginBottom:10 }}>Category Breakdown</div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10.5 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid #1e3450" }}>
                {["Category","Items","In BRD","Partial","Gaps"].map(h => (
                  <th key={h} style={{ textAlign:"left", padding:"4px 8px", color:"#38bdf8", fontWeight:800, fontSize:10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {catBreakdown.map(c => (
                <tr key={c.key} style={{ borderBottom:"1px solid #0d1b2a" }}>
                  <td style={{ padding:"5px 8px" }}>
                    <span style={{ color:c.cat.color, fontWeight:700 }}>
                      <SevDot sev="none" />{c.cat.label}
                    </span>
                  </td>
                  <td style={{ padding:"5px 8px", textAlign:"center" }}>{c.items}</td>
                  <td style={{ padding:"5px 8px", textAlign:"center", color:"#4ade80" }}>{c.inBrd || "—"}</td>
                  <td style={{ padding:"5px 8px", textAlign:"center", color:"#fb923c" }}>{c.partial || "—"}</td>
                  <td style={{ padding:"5px 8px", textAlign:"center", color:"#f87171", fontWeight:700 }}>{c.missing || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Critical gaps */}
        <div style={{ background:"#162433", border:"1px solid #1e3450", borderRadius:10, padding:"14px 16px" }}>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:2, textTransform:"uppercase", color:"#8fa3b8", marginBottom:10 }}>Critical Gaps — Not in Current BRD</div>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {[
              { title:"Fraud Detection & Prevention", desc:"Real-time anomaly detection, suspension, configurable dashboard", color:"#ff4d6d" },
              { title:"Void Transactions — SCOPE CONFLICT", desc:"Explicitly OOS in BRD §7.03 — BU requires it at launch", color:"#ff4d6d" },
              { title:"Mutually Exclusive Campaign Logic", desc:"Either/or promotions — SessionM capability check needed", color:"#ff4d6d" },
              { title:"Promo Codes — Entirely Missing", desc:"Custom prefix, caps, redemption report — no section in BRD", color:"#ff4d6d" },
              { title:"Mass Points/Voucher Issuance", desc:"BU wants self-serve, currently needs SessionM Support Team", color:"#fb923c" },
              { title:"Real-time In-Platform Dashboard", desc:"BU wants UI dashboards, not SQL on S3/Data Cloud", color:"#fb923c" },
            ].map((g, i) => (
              <div key={i} style={{ background:`${g.color}10`, borderLeft:`3px solid ${g.color}`,
                borderRadius:5, padding:"6px 10px" }}>
                <div style={{ fontSize:10.5, fontWeight:700, color:g.color }}>{g.title}</div>
                <div style={{ fontSize:10, color:"#8fa3b8", marginTop:1 }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div style={{ background:"rgba(251,191,36,.07)", border:"1px solid rgba(251,191,36,.3)",
        borderRadius:10, padding:"12px 16px" }}>
        <div style={{ fontSize:11, fontWeight:800, color:"#fbbf24", marginBottom:8 }}>⚡ Recommended Next Steps</div>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
          {[
            "1. Use Quick Confirm tab to get Yes/No from RWS stakeholders on all 21 items",
            "2. Review Gap Register — 13 items need BRD update or explicit scope decision",
            "3. Decide on Void Transactions — BU needs it, BRD scopes it out (sponsor call)",
            "4. Add Fraud Detection as new BRD section + NFR with measurable targets",
          ].map((s,i) => (
            <div key={i} style={{ fontSize:10.5, color:"#8fa3b8", flex:1, minWidth:200 }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── WISHLIST TAB ──────────────────────────────────────────────────────────────
const WishlistTab = () => {
  const [priorities, setPriorities] = useState(() =>
    Object.fromEntries(WISHLIST.map(w => [w.id, w.defaultPri]))
  );
  const [notes, setNotes] = useState({});
  const [filter, setFilter] = useState("all");

  const setPri = (id, pri) => setPriorities(p => ({ ...p, [id]: pri }));

  const grouped = Object.entries(CATEGORIES).map(([key, cat]) => ({
    key, cat,
    items: WISHLIST.filter(w => w.cat === key && (filter === "all" || w.status === filter))
  })).filter(g => g.items.length > 0);

  const priColors = {
    must:   { active:"#ff4d6d", bg:"rgba(255,77,109,.15)", border:"rgba(255,77,109,.4)" },
    should: { active:"#fb923c", bg:"rgba(251,146,60,.15)", border:"rgba(251,146,60,.4)" },
    nice:   { active:"#fbbf24", bg:"rgba(251,191,36,.15)", border:"rgba(251,191,36,.4)" },
    oos:    { active:"#64748b", bg:"rgba(100,116,139,.15)", border:"rgba(100,116,139,.4)" },
  };

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {[
          { val:"all", label:"All 21", color:"#38bdf8" },
          { val:"in", label:"✓ In BRD", color:"#4ade80" },
          { val:"partial", label:"⚠ Partial", color:"#fb923c" },
          { val:"missing", label:"✗ Not in BRD", color:"#f87171" },
          { val:"conflict", label:"⚡ Conflict", color:"#ff4d6d" },
        ].map(f => (
          <button key={f.val} onClick={() => setFilter(f.val)} style={{
            padding:"5px 14px", borderRadius:20, border:`1px solid ${filter===f.val ? f.color : "#1e3450"}`,
            background: filter===f.val ? `${f.color}15` : "transparent",
            color: filter===f.val ? f.color : "#8fa3b8",
            fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
            transition:"all .15s"
          }}>{f.label}</button>
        ))}
      </div>

      {grouped.map(({ key, cat, items }) => (
        <div key={key} style={{ marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:cat.color, boxShadow:`0 0 8px ${cat.color}` }} />
            <span style={{ fontSize:13, fontWeight:800, color:cat.color }}>{cat.label}</span>
            <span style={{ fontSize:10, background:"#162433", border:"1px solid #1e3450",
              borderRadius:10, padding:"1px 8px", color:"#8fa3b8" }}>{items.length}</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {items.map(w => (
              <div key={w.id} style={{
                background:"#162433",
                border:`1px solid ${w.status==="conflict" ? "#ff4d6d60" : w.status==="missing" ? "#f8717130" : w.status==="partial" ? "#fb923c30" : "#4ade8030"}`,
                borderRadius:10, padding:"12px 14px",
                transition:"border-color .2s"
              }}>
                {/* Card header */}
                <div style={{ display:"flex", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{w.icon}</span>
                  <div style={{ fontSize:11.5, fontWeight:800, lineHeight:1.35, flex:1, color:"#e8edf2" }}>{w.title}</div>
                </div>
                <div style={{ fontSize:10.5, color:"#8fa3b8", lineHeight:1.6, marginBottom:8 }}>{w.desc}</div>

                {/* Status + BRD ref */}
                <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:6 }}>
                  <StatusBadge status={w.status} />
                  <span style={{ fontSize:10, color:"#8fa3b8", fontStyle:"italic" }}>{w.brdRef}</span>
                </div>

                {/* Gap note */}
                {w.gap && (
                  <div style={{ fontSize:10, color: w.status==="conflict" ? "#ff4d6d" : "#fb923c",
                    background: w.status==="conflict" ? "rgba(255,77,109,.08)" : "rgba(251,146,60,.08)",
                    borderRadius:5, padding:"4px 8px", marginBottom:8, lineHeight:1.4 }}>
                    → {w.gap}
                  </div>
                )}

                {/* Priority selector */}
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  {["must","should","nice","oos"].map(p => {
                    const pc = priColors[p];
                    const isActive = priorities[w.id] === p;
                    return (
                      <button key={p} onClick={() => setPri(w.id, p)} style={{
                        padding:"3px 9px", borderRadius:6,
                        border: `1px solid ${isActive ? pc.border : "#1e3450"}`,
                        background: isActive ? pc.bg : "transparent",
                        color: isActive ? pc.active : "#64748b",
                        fontSize:9.5, fontWeight:700, cursor:"pointer",
                        fontFamily:"'DM Mono',monospace", transition:"all .15s"
                      }}>
                        {p==="must"?"Must Have":p==="should"?"Should Have":p==="nice"?"Nice to Have":"Out of Scope"}
                      </button>
                    );
                  })}
                </div>

                {/* Notes */}
                <textarea
                  value={notes[w.id] || ""}
                  onChange={e => setNotes(n => ({ ...n, [w.id]: e.target.value }))}
                  placeholder="Add discovery notes..."
                  rows={2}
                  style={{
                    width:"100%", marginTop:7,
                    background:"#0d1b2a", border:"1px solid #1e3450", borderRadius:6,
                    padding:"6px 9px", color:"#e8edf2", fontSize:10.5,
                    fontFamily:"'DM Sans',sans-serif", resize:"vertical",
                    outline:"none", lineHeight:1.5
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── QUICK CONFIRM TAB ─────────────────────────────────────────────────────────
const QuickConfirmTab = ({ answers, setAnswers }) => {
  const grouped = Object.entries(CATEGORIES).map(([key, cat]) => ({
    key, cat,
    items: WISHLIST.filter(w => w.cat === key)
  })).filter(g => g.items.length > 0);

  const answered = Object.keys(answers).length;
  const total = WISHLIST.length;
  const pct = Math.round((answered / total) * 100);

  const setAns = (id, val) => setAnswers(a => ({ ...a, [id]: val }));

  const btnStyle = (id, val) => {
    const isActive = answers[id] === val;
    const cols = {
      yes:     { active:"#4ade80", bg:"rgba(74,222,128,.15)", border:"rgba(74,222,128,.4)" },
      partial: { active:"#fb923c", bg:"rgba(251,146,60,.15)", border:"rgba(251,146,60,.4)" },
      no:      { active:"#f87171", bg:"rgba(248,113,113,.15)", border:"rgba(248,113,113,.4)" },
    };
    const c = cols[val];
    return {
      padding:"4px 14px", borderRadius:7, fontSize:10.5, fontWeight:800,
      border: `1px solid ${isActive ? c.border : "#1e3450"}`,
      background: isActive ? c.bg : "transparent",
      color: isActive ? c.active : "#64748b",
      cursor:"pointer", fontFamily:"'DM Mono',monospace", transition:"all .15s"
    };
  };

  return (
    <div>
      {/* Progress bar */}
      <div style={{ background:"#162433", border:"1px solid #1e3450", borderRadius:10, padding:"12px 16px", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:11, fontWeight:800, color:"#e8edf2" }}>Session Confirmation Progress</span>
          <span style={{ fontSize:13, fontWeight:900, color: pct<40?"#f87171":pct<75?"#fbbf24":"#4ade80",
            fontFamily:"'DM Mono',monospace" }}>{pct}% ({answered}/{total})</span>
        </div>
        <div style={{ background:"#0d1b2a", borderRadius:10, height:8, overflow:"hidden" }}>
          <div style={{ width:`${pct}%`, height:"100%", borderRadius:10,
            background:`linear-gradient(90deg, ${pct<40?"#f87171":pct<75?"#fbbf24":"#4ade80"}, ${pct<40?"#fb923c":pct<75?"#a3e635":"#38bdf8"})`,
            transition:"width .4s ease" }} />
        </div>
        <div style={{ display:"flex", gap:16, marginTop:8, fontSize:10 }}>
          <span style={{ color:"#4ade80", fontWeight:700 }}>✓ YES = Include in BRD / Build</span>
          <span style={{ color:"#fb923c", fontWeight:700 }}>~ PARTIAL = Phase 2 / Scope further</span>
          <span style={{ color:"#f87171", fontWeight:700 }}>✗ NO = Out of scope</span>
        </div>
      </div>

      {grouped.map(({ key, cat, items }) => (
        <div key={key} style={{ marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase",
            color:cat.color, marginBottom:7, display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:cat.color, boxShadow:`0 0 6px ${cat.color}` }} />
            {cat.label}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {items.map(w => (
              <div key={w.id} style={{
                display:"flex", alignItems:"center", gap:12, padding:"9px 12px",
                borderRadius:8, background: w.status==="conflict" ? "rgba(255,77,109,.06)" : "#162433",
                border: `1px solid ${w.status==="conflict" ? "#ff4d6d40" : "#1e3450"}`,
                transition:"background .15s"
              }}>
                <span style={{ fontSize:13, flexShrink:0 }}>{w.icon}</span>
                <div style={{ flex:1, fontSize:10.5, lineHeight:1.4 }}>
                  <span style={{ fontWeight:700, color: w.status==="conflict" ? "#ff4d6d" : "#e8edf2" }}>{w.title}</span>
                  {w.status==="conflict" && <span style={{ marginLeft:8, fontSize:9.5, color:"#ff4d6d", fontWeight:800 }}>⚡ SCOPE CONFLICT — Needs sponsor decision</span>}
                  <div style={{ fontSize:10, color:"#8fa3b8", marginTop:1 }}>{w.brdRef}</div>
                </div>
                <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                  <button style={btnStyle(w.id, "yes")} onClick={() => setAns(w.id, "yes")}>✓ Yes</button>
                  <button style={btnStyle(w.id, "partial")} onClick={() => setAns(w.id, "partial")}>~ Partial</button>
                  <button style={btnStyle(w.id, "no")} onClick={() => setAns(w.id, "no")}>✗ No</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── GAP REGISTER TAB ──────────────────────────────────────────────────────────
const GapRegisterTab = () => {
  const sevOrder = { critical:0, high:1, medium:2, low:3, none:4 };
  const gaps = [...GAPS].sort((a,b) => sevOrder[a.severity] - sevOrder[b.severity]);

  const sevConfig = {
    critical: { label:"Critical", color:"#ff4d6d", bg:"rgba(255,77,109,.12)" },
    high:     { label:"High",     color:"#fb923c", bg:"rgba(251,146,60,.12)" },
    medium:   { label:"Medium",   color:"#fbbf24", bg:"rgba(251,191,36,.12)" },
    low:      { label:"Low",      color:"#a3e635", bg:"rgba(163,230,53,.12)" },
  };

  return (
    <div>
      {/* Summary pills */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {Object.entries(sevConfig).map(([k,v]) => {
          const n = gaps.filter(g => g.severity===k).length;
          return n > 0 ? (
            <div key={k} style={{ background:v.bg, border:`1px solid ${v.color}50`,
              borderRadius:8, padding:"6px 14px", display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:18, fontWeight:900, color:v.color, fontFamily:"'DM Mono',monospace" }}>{n}</span>
              <span style={{ fontSize:10, color:v.color, fontWeight:700 }}>{v.label}</span>
            </div>
          ) : null;
        })}
        <div style={{ marginLeft:"auto", fontSize:10.5, color:"#8fa3b8", display:"flex", alignItems:"center" }}>
          {gaps.length} total gaps across {Object.keys(CATEGORIES).length} categories
        </div>
      </div>

      {/* Column headers */}
      <div style={{ display:"grid", gridTemplateColumns:"28px 1fr 110px 90px 1fr",
        gap:8, padding:"5px 12px", fontSize:9.5, fontWeight:800, color:"#8fa3b8",
        borderBottom:"1px solid #1e3450", marginBottom:4 }}>
        <div>#</div><div>Gap / Wishlist Item</div><div>Category</div><div>Severity</div><div>BRD Action Required</div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        {gaps.map((w, i) => {
          const sev = sevConfig[w.severity] || sevConfig.low;
          const cat = CATEGORIES[w.cat];
          const borderColor = w.severity==="critical"?"#ff4d6d":w.severity==="high"?"#fb923c":w.severity==="medium"?"#fbbf24":"#a3e635";
          return (
            <div key={w.id} style={{
              display:"grid", gridTemplateColumns:"28px 1fr 110px 90px 1fr",
              gap:8, alignItems:"start", padding:"9px 12px",
              background: "#162433",
              borderRadius:8, borderLeft:`3px solid ${borderColor}`,
              border:`1px solid #1e3450`
            }}>
              {/* Number */}
              <div style={{ width:22, height:22, borderRadius:"50%", background:`${borderColor}25`,
                border:`1px solid ${borderColor}60`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:9.5, fontWeight:800, color:borderColor }}>
                {i+1}
              </div>
              {/* Title + desc */}
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                  <span style={{ fontSize:13 }}>{w.icon}</span>
                  <span style={{ fontSize:10.5, fontWeight:800, color:"#e8edf2" }}>{w.title}</span>
                </div>
                <div style={{ fontSize:10, color:"#8fa3b8", lineHeight:1.4 }}>{w.desc.substring(0,120)}...</div>
              </div>
              {/* Category */}
              <div>
                <span style={{ padding:"2px 8px", borderRadius:10, background:cat.bg,
                  color:cat.color, fontSize:9.5, fontWeight:700, border:`1px solid ${cat.color}30` }}>
                  {cat.label}
                </span>
              </div>
              {/* Severity */}
              <div>
                <span style={{ padding:"2px 8px", borderRadius:10, background:sev.bg,
                  color:sev.color, fontSize:9.5, fontWeight:800, border:`1px solid ${sev.color}40`,
                  fontFamily:"'DM Mono',monospace" }}>
                  <SevDot sev={w.severity} />{sev.label}
                </span>
              </div>
              {/* Action */}
              <div style={{ fontSize:10, color:"#8fa3b8", lineHeight:1.4, paddingTop:2 }}>→ {w.gap}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── BRD COVERAGE MAP TAB ──────────────────────────────────────────────────────
const BRDCoverageTab = () => {
  const sections = [
    { ref:"§9.1.4 Catalog & Stores", status:"partial", covered:"Store creation (3 FRs)", action:"Add OU/CC, GL, RWS/3P flag, active/inactive fields to §9.1.4.01" },
    { ref:"§9.1.5 Customers", status:"partial", covered:"Profile update, create, tier adjust", action:"Add suspension/deletion logic, pre-provisioned employee accounts, TQP expiry preservation" },
    { ref:"§9.1.6 Loyalty", status:"partial", covered:"Tier rules, earn rules", action:"Add payment mode eligibility per store group, fast-track / partner tier match FRs" },
    { ref:"§9.1.7 Points", status:"partial", covered:"Point accounts, expiry", action:"Add decimal point cap on campaign-level point source restriction" },
    { ref:"§9.1.8 Campaigns", status:"partial", covered:"22 campaign FRs", action:"Add mutual exclusion logic, promo code rules, referral code rules, daily rollover cap" },
    { ref:"§9.1.10 Messaging", status:"in", covered:"Push + eDM (10 triggers)", action:"Confirm downstream messaging platform name (Braze/SendGrid/other)" },
    { ref:"§9.1.15 Data Cloud", status:"partial", covered:"S3 export, queries", action:"Add real-time in-platform dashboard capability requirement" },
    { ref:"§9.1.2 Data Ingestion", status:"partial", covered:"Bulk store/tag ingestion only", action:"Add bulk point/voucher mass issuance to named member ID list" },
    { ref:"NEW §9.1.X — Fraud Detection", status:"missing", covered:"—", action:"New section required: detection, thresholds, alerts, suspension, dashboard, export" },
    { ref:"NEW §9.1.X — Void Transactions", status:"conflict", covered:"—", action:"Sponsor decision needed. If YES: same-day void + finance report section" },
    { ref:"NEW §9.1.X — Promo Codes", status:"missing", covered:"—", action:"New section: custom prefix, per-user cap, unique/generic config, redemption report" },
    { ref:"NEW §9.1.X — Referral Program", status:"missing", covered:"—", action:"New section: referrer/referee reward config, multi-criteria, min spend triggers" },
    { ref:"NEW §9.1.X — Gamification", status:"missing", covered:"—", action:"Architecture assessment first — likely Phase 2 custom dev; lucky draw, scratch card" },
    { ref:"§9.2 Non-Functional Requirements", status:"missing", covered:"Only 2 NFRs (incomplete)", action:"Add fraud NFR, performance ≤500ms, availability ≥99.9%, PDPA, DR targets" },
  ];

  const rowBg = { in:"rgba(74,222,128,.04)", partial:"rgba(251,146,60,.04)", missing:"rgba(248,113,113,.04)", conflict:"rgba(255,77,109,.07)" };

  return (
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:"#8fa3b8", marginBottom:12 }}>
        Mapping all wishlist gaps to the exact BRD sections that need updating — and new sections to create.
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ background:"#1a3a5c" }}>
            {["BRD Section","Status","Wishlist Coverage","Gap / Action Required"].map(h => (
              <th key={h} style={{ padding:"7px 12px", textAlign:"left", color:"#38bdf8", fontSize:10.5, fontWeight:800 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((s, i) => (
            <tr key={i} style={{ background: i%2===0 ? rowBg[s.status] : "transparent",
              borderBottom:"1px solid #1e3450" }}>
              <td style={{ padding:"7px 12px", fontSize:10.5, fontWeight:700,
                color: s.status==="in"?"#4ade80":s.status==="partial"?"#fb923c":s.status==="conflict"?"#ff4d6d":"#f87171" }}>
                {s.ref}
              </td>
              <td style={{ padding:"7px 12px" }}><StatusBadge status={s.status} /></td>
              <td style={{ padding:"7px 12px", fontSize:10.5, color:"#8fa3b8" }}>{s.covered}</td>
              <td style={{ padding:"7px 12px", fontSize:10.5, color:"#e8edf2", lineHeight:1.4 }}>{s.action}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Recommended changes */}
      <div style={{ marginTop:16, background:"rgba(251,191,36,.07)", border:"1px solid rgba(251,191,36,.3)",
        borderRadius:10, padding:"14px 18px" }}>
        <div style={{ fontSize:11, fontWeight:800, color:"#fbbf24", marginBottom:10 }}>
          📋 Recommended BRD v1.4 Change List
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:"#f87171", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>🔴 New Sections to Add</div>
            {["§9.1.X Fraud Detection & Prevention","§9.1.X Promo Codes","§9.1.X Referral Program","§9.1.X Void Transactions (if sponsor approves)"].map((s,i) => (
              <div key={i} style={{ fontSize:10.5, color:"#8fa3b8", marginBottom:4 }}>→ {s}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:800, color:"#fb923c", marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>🟠 Existing Sections to Update</div>
            {["§9.1.4 Store fields (GL, OU/CC, active/inactive)","§9.1.5 Suspension/deletion + staff provisioning","§9.1.6 Payment mode config + partner tier match","§9.1.8 Mutual exclusion + rollover daily cap","§9.2 NFRs — add 5+ measurable targets"].map((s,i) => (
              <div key={i} style={{ fontSize:10.5, color:"#8fa3b8", marginBottom:4 }}>→ {s}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function RWSDiscoveryDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [qcAnswers, setQcAnswers] = useState({});

  const answered = Object.keys(qcAnswers).length;
  const pct = Math.round((answered / WISHLIST.length) * 100);

  const tabs = [
    { id:"overview",     label:"📊 Overview" },
    { id:"wishlist",     label:"📋 Wishlist (21)" },
    { id:"quickconfirm", label:"⚡ Quick Confirm" },
    { id:"gaps",         label:"🚨 Gap Register" },
    { id:"brd",          label:"📄 BRD Coverage" },
  ];

  return (
    <div style={{
      minHeight:"100vh", background:"#0d1b2a", color:"#e8edf2",
      fontFamily:"'DM Sans', 'Segoe UI', system-ui, sans-serif",
    }}>
      {/* ── Top nav ── */}
      <div style={{
        position:"sticky", top:0, zIndex:300,
        background:"rgba(13,27,42,.97)", backdropFilter:"blur(12px)",
        borderBottom:"1px solid #1e3450",
        display:"flex", alignItems:"center", gap:0, padding:"0 22px",
      }}>
        <div style={{ fontSize:12, fontWeight:900, color:"#38bdf8",
          letterSpacing:1, padding:"14px 0", marginRight:20,
          fontFamily:"'DM Mono', monospace", whiteSpace:"nowrap" }}>
          🏝 RWS XploreRWS · Discovery
        </div>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding:"14px 13px", fontSize:11, fontWeight:700, cursor:"pointer",
            borderBottom:`2.5px solid ${activeTab===t.id ? "#38bdf8" : "transparent"}`,
            color: activeTab===t.id ? "#38bdf8" : "#8fa3b8",
            background:"transparent", border:"none",
            borderBottom:`2.5px solid ${activeTab===t.id ? "#38bdf8" : "transparent"}`,
            whiteSpace:"nowrap", transition:"color .2s",
          }}>{t.label}</button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ background:"#162433", border:"1px solid #1e3450", borderRadius:20,
            padding:"5px 12px", display:"flex", alignItems:"center", gap:8, fontSize:10.5 }}>
            <span style={{ color:"#8fa3b8" }}>Confirmed</span>
            <div style={{ width:70, height:5, background:"#0d1b2a", borderRadius:3, overflow:"hidden" }}>
              <div style={{ width:`${pct}%`, height:"100%", borderRadius:3,
                background:`linear-gradient(90deg,${pct<40?"#f87171":pct<75?"#fbbf24":"#4ade80"},${pct<40?"#fb923c":"#38bdf8"})`,
                transition:"width .4s" }} />
            </div>
            <span style={{ fontWeight:900, fontFamily:"'DM Mono',monospace",
              color: pct<40?"#f87171":pct<75?"#fbbf24":"#4ade80" }}>{pct}%</span>
          </div>
          <div style={{ background:"rgba(248,113,113,.1)", border:"1px solid rgba(248,113,113,.3)",
            borderRadius:8, padding:"4px 10px", fontSize:10.5, fontWeight:700, color:"#f87171" }}>
            ⚠ {MISSING.length} Gaps
          </div>
        </div>
      </div>

      {/* ── Page header ── */}
      <div style={{ padding:"18px 26px 0", display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase",
            color:"#8fa3b8", marginBottom:3, fontFamily:"'DM Mono',monospace" }}>
            Resort World Sentosa · Non-Gaming Loyalty · SessionM Platform · v1.0
          </div>
          <h1 style={{ fontSize:22, fontWeight:900, lineHeight:1.1 }}>Wishlist Discovery Dashboard</h1>
          <p style={{ fontSize:10.5, color:"#8fa3b8", marginTop:4 }}>
            21 wishlist items · 7 categories · Pre-filled from RWS_Wishlist.xlsx · {MISSING.length} gaps identified
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {[
            { n:IN_BRD.length, label:"In BRD", color:"#4ade80" },
            { n:PARTIAL.length, label:"Partial", color:"#fb923c" },
            { n:MISSING.length, label:"Gaps", color:"#f87171" },
          ].map(s => (
            <div key={s.label} style={{ background:`${s.color}10`, border:`1px solid ${s.color}40`,
              borderRadius:9, padding:"8px 16px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color:s.color, fontFamily:"'DM Mono',monospace" }}>{s.n}</div>
              <div style={{ fontSize:9.5, color:"#8fa3b8" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div style={{ padding:"16px 26px 40px" }}>
        {activeTab === "overview"     && <OverviewTab />}
        {activeTab === "wishlist"     && <WishlistTab />}
        {activeTab === "quickconfirm" && <QuickConfirmTab answers={qcAnswers} setAnswers={setQcAnswers} />}
        {activeTab === "gaps"         && <GapRegisterTab />}
        {activeTab === "brd"          && <BRDCoverageTab />}
      </div>
    </div>
  );
}
