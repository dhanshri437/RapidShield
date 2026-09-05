import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Lock, Fingerprint, ShieldCheck, CheckCircle2, Loader2,
  FileCheck2, AlertTriangle, Megaphone, ClipboardList, LifeBuoy, ExternalLink,
} from 'lucide-react';
import {
  INCIDENT_TYPES, PLATFORMS, getGuidance, sha256, createCase, CYBERCRIME_PORTAL,
} from '@/lib/store';
import { useAuth } from '@/lib/rsAuth';
import { HelplineButton, CybercrimePortalButton, EmergencyBanner } from '@/components/HelplineButtons';
import { cn } from '@/lib/utils';

const STEPS = ['What happened', 'Incident details', 'Support needs', 'Evidence', 'Review & submit'];

export default function Flow() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    incidentType: '',
    platform: '',
    incidentDate: '',
    moneyDemanded: false,
    contentPosted: false,
    accountInfo: '',
    url: '',
    description: '',
    immediateDanger: false,
    isMinor: false,
    wantsWomenSupport: false,
    wantsLegal: false,
  });
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidenceHash, setEvidenceHash] = useState('');
  const [hashing, setHashing] = useState(false);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const canAdvance =
    step === 0 ? !!data.incidentType :
    step === 1 ? !!data.platform :
    true;

  const handleFile = async (file) => {
    if (!file) return;
    setEvidenceFile(file);
    setHashing(true);
    setEvidenceHash('');
    try {
      const hash = await sha256(file);
      setEvidenceHash(hash);
    } catch {
      setEvidenceHash('Error: hashing failed');
    } finally {
      setHashing(false);
    }
  };

  const submit = () => {
    const payload = { ...data, evidenceHash, evidenceFileName: evidenceFile?.name, evidenceFileSize: evidenceFile?.size };
    createCase(user, payload);
    navigate('/my-case');
  };

  const guidance = getGuidance(data);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  i < step ? 'border-primary bg-primary text-primary-foreground'
                    : i === step ? 'border-primary bg-card text-primary'
                    : 'border-border bg-card text-muted-foreground'
                )}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn('mt-1.5 hidden text-xs font-medium sm:block', i === step ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={cn('mx-2 h-0.5 flex-1 rounded-full', i < step ? 'bg-primary' : 'bg-border')} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 0 */}
      {step === 0 && (
        <div>
          <StepHeader icon={ClipboardList} title="What happened?" subtitle="Select the option that best describes your situation. You can change this later." />
          <div className="mt-6 space-y-3">
            {INCIDENT_TYPES.map((t) => (
              <button key={t.id} onClick={() => set('incidentType', t.id)} className={cn(
                'flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all',
                data.incidentType === t.id ? 'border-primary bg-primary-muted ring-1 ring-primary' : 'border-border bg-card hover:border-primary/40 hover:bg-muted'
              )}>
                <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', data.incidentType === t.id ? 'border-primary bg-primary' : 'border-border')}>
                  {data.incidentType === t.id && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{t.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <StepHeader icon={FileCheck2} title="Incident information" subtitle="A few basic details. Do not paste intimate content — a brief factual summary is enough." />
          <div className="mt-6 space-y-5">
            {data.immediateDanger && <EmergencyBanner />}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Platform</label>
                <select value={data.platform} onChange={(e) => set('platform', e.target.value)} className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Select…</option>
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Approximate date/time</label>
                <input type="datetime-local" value={data.incidentDate} onChange={(e) => set('incidentDate', e.target.value)} className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <YesNo label="Was money demanded?" value={data.moneyDemanded} onChange={(v) => set('moneyDemanded', v)} />
              <YesNo label="Has content already been posted/shared?" value={data.contentPosted} onChange={(v) => set('contentPosted', v)} />
            </div>
            <YesNo label="Are you in immediate physical danger right now?" value={data.immediateDanger} onChange={(v) => set('immediateDanger', v)} danger />
            <div>
              <label className="mb-1.5 block text-sm font-medium">Account / profile / phone number involved</label>
              <input type="text" value={data.accountInfo} onChange={(e) => set('accountInfo', e.target.value)} className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="@username or phone number (optional)" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Relevant URL <span className="text-muted-foreground">(if available)</span></label>
              <input type="url" value={data.url} onChange={(e) => set('url', e.target.value)} className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="https://…" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Short description <span className="text-muted-foreground">(no sensitive content)</span></label>
              <textarea value={data.description} onChange={(e) => set('description', e.target.value)} rows={4} maxLength={600} placeholder="Brief factual summary of what happened." className="w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              <p className="mt-1 text-right text-xs text-muted-foreground">{data.description.length}/600</p>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <p className="text-xs text-muted-foreground">Do not describe explicit details or paste links to the intimate content itself.</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <StepHeader icon={LifeBuoy} title="Support needs" subtitle="Optional — this helps us show relevant official helplines. You can skip any of these." />
          <div className="mt-6 space-y-3">
            <ToggleRow label="I am under 18 (minor)" desc="Show child helpline and professional support guidance." checked={data.isMinor} onChange={(v) => set('isMinor', v)} />
            <ToggleRow label="I would like women-specific support resources" desc="Show the women helpline." checked={data.wantsWomenSupport} onChange={(v) => set('wantsWomenSupport', v)} />
            <ToggleRow label="I would like free legal aid resources" desc="Show the NALSA legal-aid helpline." checked={data.wantsLegal} onChange={(v) => set('wantsLegal', v)} />
          </div>
          {guidance.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-card p-5">
              <p className="text-sm font-semibold">Relevant resources based on your answers</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {guidance.flatMap((g) => g.helplines).filter((v, i, a) => a.indexOf(v) === i).map((h) => (
                  <HelplineButton key={h} type={h} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <StepHeader icon={Fingerprint} title="Evidence protection" subtitle="Generate a SHA-256 fingerprint of your evidence. The file is processed locally and never uploaded." />
          <div className="mt-6 rounded-xl border border-border bg-card p-5">
            <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            {!evidenceFile ? (
              <button onClick={() => fileInputRef.current?.click()} className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border py-10 transition-colors hover:border-primary/50 hover:bg-muted">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-muted text-primary"><FileCheck2 className="h-6 w-6" /></span>
                <span className="text-sm font-medium">Select a sample evidence file</span>
                <span className="text-xs text-muted-foreground">Processed locally · no upload</span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success"><FileCheck2 className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{evidenceFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(evidenceFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => { setEvidenceFile(null); setEvidenceHash(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-xs font-medium text-muted-foreground hover:text-foreground">Remove</button>
                </div>
                {hashing ? (
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Generating SHA-256 hash…</div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-success"><CheckCircle2 className="h-4 w-4" /> Evidence protected · SHA-256 fingerprint</div>
                    <div className="mt-2 break-all rounded-lg bg-muted px-4 py-3 font-mono text-xs text-muted-foreground">{evidenceHash}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-3 py-2.5"><ShieldCheck className="h-4 w-4 text-success" /><span className="text-xs font-medium">Processed locally ✓</span></div>
            <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-3 py-2.5"><Lock className="h-4 w-4 text-success" /><span className="text-xs font-medium">Original media uploaded: NO</span></div>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <Fingerprint className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-medium">What is a SHA-256 hash?</p>
                <p className="mt-1 text-xs text-muted-foreground">A hash is a digital fingerprint of the selected file. It can help demonstrate file integrity without storing the original sensitive media on RapidShield's server. A hash does not prove whether an image is real or fake.</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">You can continue without selecting a file — evidence hashing is optional.</p>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div>
          <StepHeader icon={Megaphone} title="Guided reporting & support" subtitle="Review your organized case and the recommended next steps before submitting." />

          {data.immediateDanger && <div className="mt-6"><EmergencyBanner /></div>}

          <div className="mt-6 rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Case summary</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Incident type" value={INCIDENT_TYPES.find((t) => t.id === data.incidentType)?.label} />
              <Row label="Platform" value={data.platform || 'Not specified'} />
              <Row label="Date/time" value={data.incidentDate ? new Date(data.incidentDate).toLocaleString() : 'Not specified'} />
              <Row label="Money demanded" value={data.moneyDemanded ? 'Yes' : 'No'} />
              <Row label="Content posted" value={data.contentPosted ? 'Yes' : 'No'} />
              <Row label="Account" value={data.accountInfo || 'Not provided'} />
              <Row label="URL" value={data.url || 'Not provided'} />
              <Row label="Evidence hash" value={evidenceHash ? `${evidenceHash.slice(0, 24)}…` : 'No evidence hashed'} />
            </dl>
          </div>

          {guidance.length > 0 && (
            <div className="mt-4 rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold">Recommended next steps</h3>
              <div className="mt-3 space-y-3">
                {guidance.map((g) => (
                  <div key={g.key} className={cn('rounded-lg border p-3', g.priority ? 'border-red-300/60 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10' : 'border-border bg-muted/40')}>
                    <p className="text-sm font-semibold">{g.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{g.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Official helplines</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {guidance.flatMap((g) => g.helplines).filter((v, i, a) => a.indexOf(v) === i).map((h) => (
                <HelplineButton key={h} type={h} />
              ))}
            </div>
            <div className="mt-4">
              <CybercrimePortalButton />
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <p className="text-xs text-muted-foreground">
              RapidShield prepares and organizes information for you to review and submit. It does <strong>not</strong> automatically file a complaint with NCRP and does not guarantee platform takedown. You remain responsible for final submission through official channels.
            </p>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="mt-10 flex items-center justify-between">
        <button onClick={() => (step === 0 ? navigate('/') : setStep((s) => s - 1))} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < 4 ? (
          <button onClick={() => canAdvance && setStep((s) => s + 1)} disabled={!canAdvance} className={cn('inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors', canAdvance ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'cursor-not-allowed bg-muted text-muted-foreground')}>
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={submit} className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <CheckCircle2 className="h-4 w-4" /> Submit case
          </button>
        )}
      </div>
    </div>
  );
}

function StepHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-muted text-primary"><Icon className="h-5 w-5" /></span>
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
function Row({ label, value }) {
  return <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3"><dt className="w-32 shrink-0 text-muted-foreground">{label}</dt><dd className="font-medium">{value}</dd></div>;
}
function YesNo({ label, value, onChange, danger }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        {[{ v: true, l: 'Yes' }, { v: false, l: 'No' }].map((o) => (
          <button key={o.l} type="button" onClick={() => onChange(o.v)} className={cn(
            'flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
            value === o.v
              ? (danger && o.v ? 'border-red-400 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-300' : 'border-primary bg-primary-muted text-primary')
              : 'border-border bg-card text-muted-foreground hover:bg-muted'
          )}>{o.l}</button>
        ))}
      </div>
    </div>
  );
}
function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={cn('flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all', checked ? 'border-primary bg-primary-muted' : 'border-border bg-card hover:bg-muted')}>
      <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2', checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
        {checked && <CheckCircle2 className="h-3.5 w-3.5" />}
      </span>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}