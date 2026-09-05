// RapidShield self-contained demo data layer (localStorage).
// Implements the full data model: users, cases, evidence, statusHistory, adminNotes, auditLog.
// Deterministic rules engine — no AI.

const KEYS = {
  users: 'rapidshield-users',
  cases: 'rapidshield-cases',
  evidence: 'rapidshield-evidence',
  history: 'rapidshield-status-history',
  notes: 'rapidshield-admin-notes',
  audit: 'rapidshield-audit-log',
  seeded: 'rapidshield-seeded-v1',
};

export const STATUSES = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REPORT_PREPARED: 'Report Prepared',
  USER_ACTION_REQUIRED: 'User Action Required',
  PLATFORM_SUBMITTED: 'Platform Report Submitted',
  UNDER_PLATFORM_REVIEW: 'Under Platform Review',
  RESOLVED: 'Resolved',
  NEEDS_INFO: 'Needs More Information',
  REJECTED: 'Rejected',
};

// Main forward flow for progress indicator
export const STATUS_FLOW = [
  STATUSES.SUBMITTED,
  STATUSES.UNDER_REVIEW,
  STATUSES.APPROVED,
  STATUSES.REPORT_PREPARED,
  STATUSES.USER_ACTION_REQUIRED,
  STATUSES.PLATFORM_SUBMITTED,
  STATUSES.UNDER_PLATFORM_REVIEW,
  STATUSES.RESOLVED,
];

export const ALL_STATUSES = Object.values(STATUSES);

export const INCIDENT_TYPES = [
  { id: 'threat', label: 'Someone is threatening to share intimate content', desc: 'A person is threatening to release intimate images or videos of you.' },
  { id: 'shared', label: 'Intimate content has already been shared', desc: 'Intimate content of you has been posted or sent without your consent.' },
  { id: 'manipulated', label: 'I believe an intimate image/video was manipulated', desc: 'Content appears to be edited, deepfaked, or fabricated to look like you.' },
  { id: 'sextortion', label: 'Someone is demanding money or more content', desc: 'A person is extorting you for money, more images, or other demands.' },
  { id: 'other', label: 'Something else related to intimate-image abuse', desc: 'Another form of intimate-image abuse or related cyber abuse.' },
];

export const PLATFORMS = [
  'Instagram', 'Facebook', 'Snapchat', 'TikTok', 'X (Twitter)',
  'WhatsApp', 'Telegram', 'Reddit', 'Discord', 'Google Drive', 'Other / Unknown',
];

export const HELPLINES = {
  emergency: { number: '112', label: 'Call 112', name: 'Emergency / Police', desc: 'National emergency and police assistance.' },
  cyber: { number: '1930', label: 'Call 1930', name: 'Cybercrime Helpline', desc: 'National cybercrime reporting helpline.' },
  women: { number: '181', label: 'Call 181', name: 'Women Helpline', desc: 'Support and assistance for women.' },
  child: { number: '1098', label: 'Call 1098', name: 'Child Helpline', desc: 'Child helpline for minors and concerned adults.' },
  legal: { number: '15100', label: 'Call 15100', name: 'NALSA Legal Aid', desc: 'Free legal-aid helpline.' },
};

const CYBERCRIME_PORTAL = 'https://www.cybercrime.gov.in/';
export { CYBERCRIME_PORTAL };

// ---------- storage helpers ----------
function read(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function uid(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
}

// ---------- seeding ----------
export function ensureSeed() {
  if (localStorage.getItem(KEYS.seeded)) return;
  const now = Date.now();
  const adminId = uid('U');
  const demoUserId = uid('U');
  const users = [
    { id: adminId, name: 'RapidShield Admin', email: 'admin@rapidshield.demo', password: 'admin123', role: 'admin', createdAt: new Date(now - 86400000 * 3).toISOString() },
    { id: demoUserId, name: 'Demo User', email: 'demo@rapidshield.demo', password: 'demo123', role: 'user', createdAt: new Date(now - 86400000 * 2).toISOString() },
  ];
  const caseId = 'RS-DEMO01';
  const demoCase = {
    id: caseId,
    userId: demoUserId,
    userName: 'Demo User',
    userEmail: 'demo@rapidshield.demo',
    incidentType: 'sextortion',
    platform: 'Instagram',
    incidentDate: new Date(now - 86400000).toISOString(),
    moneyDemanded: true,
    contentPosted: false,
    accountInfo: '@anon_extorter_99',
    url: 'https://instagram.com/direct/inbox',
    description: 'A messaging account threatened to release private images unless I pay. They demanded money through a payment app and sent repeated threats.',
    immediateDanger: false,
    isMinor: false,
    wantsWomenSupport: false,
    wantsLegal: true,
    status: STATUSES.USER_ACTION_REQUIRED,
    priority: 'High',
    adminMessage: 'Your case has been reviewed and approved. A report has been prepared for you. Please review it and submit it through the official cybercrime portal. Let us know once submitted.',
    originalSubmission: null,
    createdAt: new Date(now - 3600000 * 5).toISOString(),
    updatedAt: new Date(now - 3600000 * 1).toISOString(),
  };
  demoCase.originalSubmission = {
    incidentType: demoCase.incidentType,
    platform: demoCase.platform,
    incidentDate: demoCase.incidentDate,
    description: demoCase.description,
    accountInfo: demoCase.accountInfo,
    url: '',
  };
  const evidence = [
    {
      id: uid('E'),
      caseId,
      sha256Hash: 'a3f5901c7d2e8b4a9f6c1d0e2b3a4f5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
      filename: 'evidence_screenshot.png',
      fileSize: 248500,
      createdAt: new Date(now - 3600000 * 5).toISOString(),
    },
  ];
  const history = [
    { id: uid('H'), caseId, status: STATUSES.SUBMITTED, changedBy: 'Demo User', changedByRole: 'user', visibleToUser: true, message: 'Case submitted by user.', timestamp: new Date(now - 3600000 * 5).toISOString() },
    { id: uid('H'), caseId, status: STATUSES.SUBMITTED, changedBy: 'Demo User', changedByRole: 'user', visibleToUser: true, message: 'Evidence hash generated locally (SHA-256).', timestamp: new Date(now - 3600000 * 4.9).toISOString() },
    { id: uid('H'), caseId, status: STATUSES.UNDER_REVIEW, changedBy: 'RapidShield Admin', changedByRole: 'admin', visibleToUser: true, message: 'Case is under review.', timestamp: new Date(now - 3600000 * 4).toISOString() },
    { id: uid('H'), caseId, status: STATUSES.NEEDS_INFO, changedBy: 'RapidShield Admin', changedByRole: 'admin', visibleToUser: true, message: 'Please provide the relevant platform URL so we can complete your report.', timestamp: new Date(now - 3600000 * 3.5).toISOString() },
    { id: uid('H'), caseId, status: STATUSES.UNDER_REVIEW, changedBy: 'Demo User', changedByRole: 'user', visibleToUser: true, message: 'Additional information submitted — Platform URL added.', timestamp: new Date(now - 3600000 * 3).toISOString() },
    { id: uid('H'), caseId, status: STATUSES.APPROVED, changedBy: 'RapidShield Admin', changedByRole: 'admin', visibleToUser: true, message: 'Case approved.', timestamp: new Date(now - 3600000 * 2).toISOString() },
    { id: uid('H'), caseId, status: STATUSES.REPORT_PREPARED, changedBy: 'RapidShield Admin', changedByRole: 'admin', visibleToUser: true, message: 'Report prepared and ready for your review.', timestamp: new Date(now - 3600000 * 1.5).toISOString() },
    { id: uid('H'), caseId, status: STATUSES.USER_ACTION_REQUIRED, changedBy: 'RapidShield Admin', changedByRole: 'admin', visibleToUser: true, message: 'Please review your report and submit it through the official cybercrime portal.', timestamp: new Date(now - 3600000 * 1).toISOString() },
  ];
  const notes = [
    { id: uid('N'), caseId, adminId, adminName: 'RapidShield Admin', note: 'User confirmed threats via DM. Money demanded via payment app. Prioritize review.', visibleToUser: false, timestamp: new Date(now - 3600000 * 4).toISOString() },
    { id: uid('N'), caseId, adminId, adminName: 'RapidShield Admin', note: 'Verified evidence hash and incident details. Information complete after URL provided.', visibleToUser: false, timestamp: new Date(now - 3600000 * 2).toISOString() },
  ];
  const audit = [
    { id: uid('A'), adminId, adminName: 'RapidShield Admin', action: 'Opened case', caseId, timestamp: new Date(now - 3600000 * 4).toISOString(), details: '' },
    { id: uid('A'), adminId, adminName: 'RapidShield Admin', action: 'Changed status to Needs More Information', caseId, timestamp: new Date(now - 3600000 * 3.5).toISOString(), details: 'Requested platform URL' },
    { id: uid('A'), adminId, adminName: 'RapidShield Admin', action: 'Changed status to Approved', caseId, timestamp: new Date(now - 3600000 * 2).toISOString(), details: '' },
    { id: uid('A'), adminId, adminName: 'RapidShield Admin', action: 'Marked Report Prepared', caseId, timestamp: new Date(now - 3600000 * 1.5).toISOString(), details: '' },
    { id: uid('A'), adminId, adminName: 'RapidShield Admin', action: 'Added victim-visible message', caseId, timestamp: new Date(now - 3600000 * 1).toISOString(), details: '' },
  ];

  write(KEYS.users, users);
  write(KEYS.cases, [demoCase]);
  write(KEYS.evidence, evidence);
  write(KEYS.history, history);
  write(KEYS.notes, notes);
  write(KEYS.audit, audit);
  localStorage.setItem(KEYS.seeded, '1');
}

// ---------- users ----------
export function getUsers() { return read(KEYS.users, []); }
export function findUserByEmail(email) { return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()); }
export function getUser(id) { return getUsers().find((u) => u.id === id); }
export function saveUser({ name, email, password, role = 'user' }) {
  const users = getUsers();
  const u = { id: uid('U'), name, email, password, role, createdAt: new Date().toISOString() };
  users.push(u);
  write(KEYS.users, users);
  return u;
}

// ---------- cases ----------
export function getCases() { return read(KEYS.cases, []).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); }
export function getCase(id) { return read(KEYS.cases, []).find((c) => c.id === id); }
export function getUserCases(userId) { return getCases().filter((c) => c.userId === userId); }
export function getAdminCases() { return getCases(); }

export function createCase(user, data) {
  const cases = read(KEYS.cases, []);
  const id = uid('RS');
  const now = new Date().toISOString();
  const caseRecord = {
    id,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    incidentType: data.incidentType,
    platform: data.platform,
    incidentDate: data.incidentDate,
    moneyDemanded: data.moneyDemanded,
    contentPosted: data.contentPosted,
    accountInfo: data.accountInfo,
    url: data.url,
    description: data.description,
    immediateDanger: data.immediateDanger,
    isMinor: data.isMinor,
    wantsWomenSupport: data.wantsWomenSupport,
    wantsLegal: data.wantsLegal,
    status: STATUSES.SUBMITTED,
    priority: computePriority(data),
    adminMessage: '',
    originalSubmission: {
      incidentType: data.incidentType,
      platform: data.platform,
      incidentDate: data.incidentDate,
      description: data.description,
      accountInfo: data.accountInfo,
      url: data.url,
    },
    createdAt: now,
    updatedAt: now,
  };
  cases.push(caseRecord);
  write(KEYS.cases, cases);

  addStatusHistory({
    caseId: id,
    status: STATUSES.SUBMITTED,
    changedBy: user.name,
    changedByRole: 'user',
    visibleToUser: true,
    message: 'Case submitted by user.',
    timestamp: now,
  });
  if (data.evidenceHash) {
    addEvidenceRecord(id, data.evidenceHash, data.evidenceFileName, data.evidenceFileSize);
    addStatusHistory({
      caseId: id,
      status: STATUSES.SUBMITTED,
      changedBy: user.name,
      changedByRole: 'user',
      visibleToUser: true,
      message: 'Evidence fingerprint generated locally (SHA-256). Original media not uploaded.',
      timestamp: new Date().toISOString(),
    });
  }
  return caseRecord;
}

export function updateCaseFields(id, fields) {
  const cases = read(KEYS.cases, []).map((c) => (c.id === id ? { ...c, ...fields, updatedAt: new Date().toISOString() } : c));
  write(KEYS.cases, cases);
}

// ---------- evidence ----------
export function addEvidenceRecord(caseId, sha256Hash, filename, fileSize) {
  const evidence = read(KEYS.evidence, []);
  evidence.push({ id: uid('E'), caseId, sha256Hash, filename, fileSize, createdAt: new Date().toISOString() });
  write(KEYS.evidence, evidence);
}
export function getEvidenceByCase(caseId) { return read(KEYS.evidence, []).filter((e) => e.caseId === caseId); }

// ---------- status history ----------
export function addStatusHistory(entry) {
  const history = read(KEYS.history, []);
  history.push({ id: uid('H'), ...entry });
  write(KEYS.history, history);
}
export function getCaseHistory(caseId) {
  return read(KEYS.history, []).filter((h) => h.caseId === caseId).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}
export function getVisibleHistory(caseId) {
  return getCaseHistory(caseId).filter((h) => h.visibleToUser);
}

// ---------- admin notes ----------
export function addAdminNote(caseId, admin, note, visibleToUser) {
  const notes = read(KEYS.notes, []);
  const entry = { id: uid('N'), caseId, adminId: admin.id, adminName: admin.name, note, visibleToUser, timestamp: new Date().toISOString() };
  notes.push(entry);
  write(KEYS.notes, notes);
  if (visibleToUser) {
    updateCaseFields(caseId, { adminMessage: note });
    addStatusHistory({ caseId, status: getCase(caseId)?.status || STATUSES.SUBMITTED, changedBy: admin.name, changedByRole: 'admin', visibleToUser: true, message: note, timestamp: entry.timestamp });
  }
  return entry;
}
export function getCaseNotes(caseId) { return read(KEYS.notes, []).filter((n) => n.caseId === caseId).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); }
export function getVisibleNotes(caseId) { return getCaseNotes(caseId).filter((n) => n.visibleToUser); }

// ---------- audit log (admin actions) ----------
export function addAuditLog(admin, action, caseId, details = '') {
  const audit = read(KEYS.audit, []);
  audit.push({ id: uid('A'), adminId: admin.id, adminName: admin.name, action, caseId, timestamp: new Date().toISOString(), details });
  write(KEYS.audit, audit);
}
export function getCaseAudit(caseId) { return read(KEYS.audit, []).filter((a) => a.caseId === caseId).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); }

// ---------- admin actions ----------
export function adminChangeStatus(caseId, admin, newStatus, message, visibleToUser = true) {
  updateCaseFields(caseId, { status: newStatus });
  addStatusHistory({ caseId, status: newStatus, changedBy: admin.name, changedByRole: 'admin', visibleToUser, message, timestamp: new Date().toISOString() });
  addAuditLog(admin, `Changed status to ${newStatus}`, caseId, message);
}
export function adminAddNote(caseId, admin, note, visibleToUser) {
  addAdminNote(caseId, admin, note, visibleToUser);
  addAuditLog(admin, visibleToUser ? 'Added victim-visible message' : 'Added internal note', caseId, note);
}
export function adminApprove(caseId, admin, message = 'Your case has been approved.') {
  adminChangeStatus(caseId, admin, STATUSES.APPROVED, message, true);
}
export function adminRequestInfo(caseId, admin, message) {
  adminChangeStatus(caseId, admin, STATUSES.NEEDS_INFO, message, true);
}
export function adminReject(caseId, admin, message) {
  adminChangeStatus(caseId, admin, STATUSES.REJECTED, message, true);
}
export function adminMarkReportPrepared(caseId, admin, message = 'Your report has been prepared and is ready for review.') {
  adminChangeStatus(caseId, admin, STATUSES.REPORT_PREPARED, message, true);
}
export function adminMarkPlatformSubmitted(caseId, admin, message = 'Platform report submitted. Awaiting platform review.') {
  adminChangeStatus(caseId, admin, STATUSES.PLATFORM_SUBMITTED, message, true);
}
export function adminMarkResolved(caseId, admin, message = 'Case marked as resolved.') {
  adminChangeStatus(caseId, admin, STATUSES.RESOLVED, message, true);
}

// ---------- user action: add info ----------
export function userAddInfo(caseId, user, info) {
  const c = getCase(caseId);
  if (!c || c.userId !== user.id) return;
  const fields = {};
  if (info.url !== undefined) fields.url = info.url;
  if (info.accountInfo !== undefined) fields.accountInfo = info.accountInfo;
  if (info.descriptionAddendum) {
    fields.description = (c.description ? c.description + '\n\n[Update] ' : '') + info.descriptionAddendum;
  }
  fields.status = STATUSES.UNDER_REVIEW;
  updateCaseFields(caseId, fields);
  let msg = 'Additional information submitted by user.';
  if (info.url) msg += ` Platform URL added.`;
  if (info.accountInfo) msg += ` Account info updated.`;
  if (info.descriptionAddendum) msg += ` Additional details added.`;
  addStatusHistory({ caseId, status: STATUSES.UNDER_REVIEW, changedBy: user.name, changedByRole: 'user', visibleToUser: true, message: msg, timestamp: new Date().toISOString() });
}

// ---------- rules engine (deterministic, no AI) ----------
export function getGuidance(data) {
  const items = [];
  if (data.immediateDanger) {
    items.push({
      key: 'emergency',
      priority: true,
      title: 'Immediate physical danger',
      body: 'If you are in immediate physical danger, contact emergency services right now rather than waiting.',
      helplines: ['emergency'],
    });
  }
  if (data.incidentType === 'sextortion' || data.moneyDemanded) {
    items.push({
      key: 'financial',
      title: 'Financial / cybercrime reporting',
      body: 'Money is being demanded. Do not pay — payment rarely stops extortion and often escalates it. Report this as cyber extortion.',
      helplines: ['cyber'],
    });
  }
  if (data.incidentType === 'shared' || data.contentPosted) {
    items.push({
      key: 'takedown',
      title: 'Platform reporting & takedown',
      body: 'Intimate content has been shared. Use the platform’s non-consensual intimate imagery reporting tool and submit a takedown request for each URL.',
      helplines: ['cyber'],
    });
  }
  if (data.incidentType === 'manipulated') {
    items.push({
      key: 'preservation',
      title: 'Evidence preservation (manipulated content)',
      body: 'Preserve evidence of the manipulation and any claims being made. When reporting, state clearly that the content is fabricated or altered.',
      helplines: ['cyber'],
    });
  }
  if (data.incidentType === 'threat') {
    items.push({
      key: 'threat',
      title: 'Threat response',
      body: 'Save all threat messages with timestamps. Do not engage or send more content. Report the account on the platform where threats were made.',
      helplines: ['cyber'],
    });
  }
  if (data.isMinor) {
    items.push({
      key: 'child',
      title: 'Support for minors',
      body: 'If you are under 18, involve a trusted adult and contact the child helpline for professional support.',
      helplines: ['child'],
    });
  }
  if (data.wantsWomenSupport) {
    items.push({
      key: 'women',
      title: 'Women-specific support',
      body: 'Women-specific support resources are available through the women helpline.',
      helplines: ['women'],
    });
  }
  if (data.wantsLegal) {
    items.push({
      key: 'legal',
      title: 'Free legal aid',
      body: 'Free legal aid is available. The NALSA legal-aid helpline can help you understand your options.',
      helplines: ['legal'],
    });
  }
  return items;
}

// ---------- recommended steps (deterministic, victim-facing) ----------
export function recommendedSteps(incidentType) {
  const base = [
    'Preserve all evidence: screenshots of messages, posts, URLs, and account profiles with timestamps. Do not delete original messages yet.',
    'Do not re-share or forward the content to anyone, even to show what happened.',
    'Record the exact URLs where the content appears and the usernames/handles involved.',
  ];
  const specific = {
    threat: [
      'Avoid paying or sending more content — this rarely stops the demands and often escalates them.',
      'Save all threat messages with timestamps.',
      'Report the account on the platform where threats were made.',
      'Consider filing a report with the national cybercrime portal (NCRP in India) yourself, and local police if there is immediate danger.',
    ],
    shared: [
      'Use the platform’s report/remove tool for non-consensual intimate imagery.',
      'Submit a takedown request through the platform’s official reporting channels with the URLs you recorded.',
      'File a report with the national cybercrime portal (NCRP in India) yourself, attaching your evidence summary and hash.',
      'If content appears on multiple sites, repeat the takedown request for each URL.',
    ],
    manipulated: [
      'Clearly note that the content is fabricated/manipulated when you report it.',
      'Collect evidence of the original source and any claims being made.',
      'Report on the platform hosting the manipulated content, selecting the “fake/manipulated” option where available.',
      'File a report with the national cybercrime portal (NCRP in India) yourself, describing the fabrication.',
    ],
    sextortion: [
      'Do not pay and do not send more content. Stop all communication with the extortionist.',
      'Block the account after you have saved screenshots of every message and demand.',
      'Report the account on the platform where the extortion occurred.',
      'File a report with the national cybercrime portal (NCRP in India) yourself, and contact local police — sextortion is a crime.',
      'If you are feeling overwhelmed, reach out to a trusted person or a crisis support line now.',
    ],
    other: [
      'Document everything that happened with dates, platforms, and the people/accounts involved.',
      'Report through the relevant platform’s reporting tools.',
      'File a report with the national cybercrime portal (NCRP in India) yourself if a crime may have occurred.',
    ],
  };
  return [...base, ...(specific[incidentType] || specific.other)];
}

// ---------- priority ----------
function computePriority(data) {
  if (data.immediateDanger || data.incidentType === 'sextortion' || data.moneyDemanded) return 'High';
  if (data.incidentType === 'shared' || data.incidentType === 'manipulated') return 'Medium';
  return 'Medium';
}

// ---------- report builder ----------
export function buildReport(c) {
  const evidence = getEvidenceByCase(c.id);
  const ev = evidence[0];
  const lines = [
    'RapidShield — Prepared Case Report',
    '==================================',
    '',
    `Case ID: ${c.id}`,
    `Incident Type: ${INCIDENT_TYPES.find((t) => t.id === c.incidentType)?.label || c.incidentType}`,
    `Platform: ${c.platform || 'Not specified'}`,
    `Approximate Date/Time: ${c.incidentDate ? new Date(c.incidentDate).toLocaleString() : 'Not specified'}`,
    `Money Demanded: ${c.moneyDemanded ? 'Yes' : 'No'}`,
    `Content Already Posted: ${c.contentPosted ? 'Yes' : 'No'}`,
    `Account / Profile / Phone: ${c.accountInfo || 'Not provided'}`,
    `Relevant URL: ${c.url || 'Not provided'}`,
    '',
    'Description:',
    c.description || 'Not provided',
    '',
    'Evidence Protection',
    '-------------------',
    ev ? `Evidence status: Hash generated` : `Evidence status: No evidence hashed`,
    ev ? `SHA-256 fingerprint: ${ev.sha256Hash}` : '',
    ev ? `Evidence file name: ${ev.filename}` : '',
    'Processing: Local (in-browser) using Web Crypto API.',
    'Original media uploaded: NO',
    'Note: A hash demonstrates file integrity. It does not prove whether an image is real or fake.',
    '',
    `Submission Timestamp: ${new Date(c.createdAt).toLocaleString()}`,
    `Current Status: ${c.status}`,
    '',
    '----------------------------------',
    'RapidShield prepares and organizes information for you to review and submit.',
    'It does NOT automatically file a complaint with NCRP, does NOT guarantee platform',
    'takedown, and does NOT replace police, emergency services, counsellors, or legal',
    'professionals. You remain responsible for final submission through official channels.',
  ].filter((l) => l !== '' || true);
  return lines.join('\n');
}

// ---------- SHA-256 (local) ----------
export async function sha256(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------- progress ----------
export function progressIndex(status) {
  const i = STATUS_FLOW.indexOf(status);
  return i === -1 ? 0 : i;
}
export function progressPercent(status) {
  if (status === STATUSES.RESOLVED) return 100;
  if (status === STATUSES.REJECTED) return 100;
  const i = progressIndex(status);
  return Math.round(((i + 1) / STATUS_FLOW.length) * 100);
}