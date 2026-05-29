import { useMemo, useState, type CSSProperties } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  DollarSign,
  ExternalLink,
  Filter,
  Hammer,
  LifeBuoy,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  WalletCards,
} from "lucide-react";
import { calculateMetrics, currency, filterRecords, nextBestAction, type WorkItem, type WorkStatus } from "./domain";
import { buildLeadIssueUrl, calculateRoi, recommendPlan, resolveCheckoutTarget, type PricingPlan } from "./monetization";
import { stripeLinksByPlan } from "./stripeLinks";
import { initialRecords, product } from "./data";

const icons = {
  Hammer,
  LifeBuoy,
  ShieldCheck,
  Stethoscope,
  WalletCards,
};

const statuses: Array<WorkStatus | "All"> = ["All", "Queued", "In review", "Ready", "Resolved"];
const pricingPlans = product.pricingPlans as PricingPlan[];

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function PriorityBadge({ item }: { item: WorkItem }) {
  return <span className={`priority priority-${item.priority.toLowerCase()}`}>{item.priority}</span>;
}

function App() {
  const [records, setRecords] = useState(initialRecords);
  const [status, setStatus] = useState<WorkStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(records[0]?.id ?? "");
  const [assistantText, setAssistantText] = useState(nextBestAction(records));
  const [monthlyPain, setMonthlyPain] = useState(product.money.defaultMonthlyPain);
  const [improvementPercent, setImprovementPercent] = useState(Math.round(product.money.defaultImprovementRate * 100));
  const [selectedPlanName, setSelectedPlanName] = useState(pricingPlans[0].name);

  const metrics = useMemo(() => calculateMetrics(records), [records]);
  const filteredRecords = useMemo(() => filterRecords(records, status, query), [records, status, query]);
  const selected = records.find((item) => item.id === selectedId) ?? filteredRecords[0] ?? records[0];
  const selectedPlan = pricingPlans.find((plan) => plan.name === selectedPlanName) ?? pricingPlans[0];
  const improvementRate = improvementPercent / 100;
  const roi = calculateRoi({ monthlyPain, improvementRate, annualPrice: selectedPlan.annualPrice });
  const recommendedPlan = recommendPlan(pricingPlans, roi.annualSavings);
  const leadUrl = buildLeadIssueUrl({
    owner: "P4ND4907",
    repo: product.repo,
    productName: product.name,
    buyer: product.buyer,
    planName: selectedPlan.name,
    annualSavings: roi.annualSavings,
  });
  const checkoutTarget = resolveCheckoutTarget({
    stripeUrl: stripeLinksByPlan[selectedPlan.name],
    fallbackUrl: leadUrl,
  });
  const Icon = icons[product.icon as keyof typeof icons];
  const maxValue = Math.max(...records.map((item) => item.value));

  function advanceSelected() {
    if (!selected) return;

    setRecords((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status: "Resolved",
              stage: "Closed loop",
              signal: `Completed from the ${product.short} command center.`,
            }
          : item,
      ),
    );
    setAssistantText(`${selected.id} moved to resolved. Refresh the dashboard to review the next highest-risk open item.`);
  }

  function draftAssistantMessage() {
    setAssistantText(nextBestAction(records));
  }

  return (
    <main className="app-shell" style={{ "--accent": product.accent, "--accent-soft": product.accentSoft, "--accent-dark": product.accentDark } as CSSProperties}>
      <aside className="sidebar" aria-label="Workspace navigation">
        <div className="brand">
          <span className="brand-mark">
            <Icon size={22} />
          </span>
          <div>
            <strong>{product.name}</strong>
            <small>{product.tagline}</small>
          </div>
        </div>
        <nav>
          <a className="active" href="#command"><Activity size={18} /> Command</a>
          <a href="#money"><DollarSign size={18} /> Money</a>
          <a href="#queue"><ClipboardCheck size={18} /> Work queue</a>
          <a href="#signals"><BarChart3 size={18} /> Signals</a>
          <a href="#actions"><Sparkles size={18} /> Assistant</a>
        </nav>
        <div className="buyer-panel">
          <span>Initial buyer</span>
          <strong>{product.buyer}</strong>
        </div>
      </aside>

      <section className="workspace" id="command">
        <header className="topbar">
          <div>
            <p className="section-label">Live workflow system</p>
            <h1>{product.tagline}</h1>
            <p>{product.mission}</p>
          </div>
          <a className="primary-button" href={checkoutTarget.href} target="_blank" rel="noreferrer">
            <DollarSign size={18} />
            {checkoutTarget.label}
          </a>
        </header>

        <section className="stats-grid" aria-label="Workflow metrics">
          <StatCard label="Open work" value={String(metrics.open)} detail={`${metrics.total} tracked records`} />
          <StatCard label="Urgent" value={String(metrics.urgent)} detail="Priority or SLA risk" />
          <StatCard label="Value covered" value={currency(metrics.totalValue)} detail={product.heroStat} />
          <StatCard label="Completion" value={`${metrics.completionRate}%`} detail="Closed-loop progress" />
        </section>

        <section className="money-grid" id="money">
          <div className="pricing-panel">
            <div className="panel-heading compact">
              <div>
                <p className="section-label">Revenue offer</p>
                <h2>Package the pilot so buyers can say yes</h2>
              </div>
              <Target size={21} />
            </div>
            <div className="offer-list">
              {pricingPlans.map((plan) => (
                <button
                  key={plan.name}
                  className={plan.name === selectedPlan.name ? "offer-row selected" : "offer-row"}
                  onClick={() => setSelectedPlanName(plan.name)}
                >
                  <span>
                    <strong>{plan.name}</strong>
                    <small>{plan.bestFor}</small>
                  </span>
                  <span>
                    <strong>{currency(plan.monthlyPrice)}/mo</strong>
                    <small>{currency(plan.annualPrice)} annual</small>
                  </span>
                </button>
              ))}
            </div>
            <p className="proof-copy">{selectedPlan.promise}</p>
            <ul className="feature-list">
              {selectedPlan.features.map((feature) => (
                <li key={feature}><CheckCircle2 size={15} /> {feature}</li>
              ))}
            </ul>
          </div>

          <div className="roi-panel">
            <div className="panel-heading compact">
              <div>
                <p className="section-label">ROI calculator</p>
                <h2>Show the money before the demo</h2>
              </div>
              <Calculator size={21} />
            </div>
            <label className="range-control">
              <span>{product.money.painLabel}</span>
              <strong>{currency(monthlyPain)}</strong>
              <input
                type="range"
                min={product.money.minMonthlyPain}
                max={product.money.maxMonthlyPain}
                step={product.money.painStep}
                value={monthlyPain}
                onChange={(event) => setMonthlyPain(Number(event.target.value))}
              />
            </label>
            <label className="range-control">
              <span>{product.money.improvementLabel}</span>
              <strong>{improvementPercent}%</strong>
              <input
                type="range"
                min={5}
                max={60}
                step={1}
                value={improvementPercent}
                onChange={(event) => setImprovementPercent(Number(event.target.value))}
              />
            </label>
            <div className="roi-output">
              <div><span>Annual savings</span><strong>{currency(roi.annualSavings)}</strong></div>
              <div><span>Net return</span><strong>{currency(roi.netReturn)}</strong></div>
              <div><span>Payback</span><strong>{roi.paybackMonths} mo</strong></div>
              <div><span>ROI</span><strong>{roi.roiPercent}%</strong></div>
            </div>
            <p className="proof-copy">{product.money.proof}</p>
            <a className="secondary-link" href={checkoutTarget.href} target="_blank" rel="noreferrer">
              {checkoutTarget.isStripe ? "Open Stripe checkout" : "Open paid pilot request"} <ExternalLink size={16} />
            </a>
            {recommendedPlan ? <small className="recommendation">Suggested package: {recommendedPlan.name}</small> : null}
          </div>
        </section>

        <section className="commercial-strip">
          <strong>Pilot close script</strong>
          <span>{product.money.guarantee}</span>
        </section>

        <section className="content-grid">
          <div className="queue-panel" id="queue">
            <div className="panel-heading">
              <div>
                <p className="section-label">Prioritized queue</p>
                <h2>Work that needs a decision</h2>
              </div>
              <div className="search-box">
                <Search size={17} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records" />
              </div>
            </div>

            <div className="filter-row" aria-label="Status filters">
              <Filter size={17} />
              {statuses.map((entry) => (
                <button
                  key={entry}
                  className={entry === status ? "selected" : ""}
                  onClick={() => setStatus(entry)}
                >
                  {entry}
                </button>
              ))}
            </div>

            <div className="record-list">
              {filteredRecords.map((item) => (
                <button
                  key={item.id}
                  className={item.id === selected?.id ? "record-row selected" : "record-row"}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className="record-main">
                    <strong>{item.title}</strong>
                    <small>{item.id} - {item.channel} - {item.stage}</small>
                  </span>
                  <span className="record-meta">
                    <PriorityBadge item={item} />
                    <small>{item.status}</small>
                    <strong>{currency(item.value)}</strong>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <aside className="detail-panel" id="actions">
            {selected ? (
              <>
                <div className="detail-header">
                  <span className="detail-icon"><AlertTriangle size={20} /></span>
                  <div>
                    <p className="section-label">Selected record</p>
                    <h2>{selected.id}</h2>
                  </div>
                </div>
                <h3>{selected.title}</h3>
                <p>{selected.signal}</p>
                <dl>
                  <div><dt>Owner</dt><dd>{selected.owner}</dd></div>
                  <div><dt>Age</dt><dd>{selected.ageHours}h</dd></div>
                  <div><dt>Value</dt><dd>{currency(selected.value)}</dd></div>
                  <div><dt>Status</dt><dd>{selected.status}</dd></div>
                </dl>
                <button className="secondary-button" onClick={advanceSelected}>
                  <CheckCircle2 size={18} />
                  Mark resolved
                </button>
              </>
            ) : null}
          </aside>
        </section>

        <section className="bottom-grid" id="signals">
          <div className="signals-panel">
            <div className="panel-heading compact">
              <div>
                <p className="section-label">Operating signals</p>
                <h2>Where the next dollar or hour is hiding</h2>
              </div>
              <ArrowUpRight size={21} />
            </div>
            <div className="bar-list">
              {records.map((item) => (
                <div className="bar-row" key={item.id}>
                  <span>{item.id}</span>
                  <div className="bar-track"><span style={{ width: `${Math.max(12, (item.value / maxValue) * 100)}%` }} /></div>
                  <strong>{currency(item.value)}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="assistant-panel">
            <div className="panel-heading compact">
              <div>
                <p className="section-label">Assistant draft</p>
                <h2>Next best action</h2>
              </div>
              <Clock3 size={21} />
            </div>
            <p className="assistant-copy">{assistantText}</p>
            <div className="insight-list">
              {product.insights.map((insight) => (
                <span key={insight}>{insight}</span>
              ))}
            </div>
            <div className="assistant-input">
              <input
                value={assistantText}
                onChange={(event) => setAssistantText(event.target.value)}
                aria-label="Assistant draft"
              />
              <button onClick={draftAssistantMessage} aria-label="Refresh assistant draft">
                <Send size={18} />
              </button>
            </div>
          </div>
        </section>

        <footer>
          <span>Connectors</span>
          {product.integrations.map((integration) => (
            <strong key={integration}>{integration}</strong>
          ))}
        </footer>
      </section>
    </main>
  );
}

export default App;
