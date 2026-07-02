// admin-supabase.jsx — data layer s service_role klíčem (obchází RLS, vidí vše)
//
// ⚠️  BEZPEČNOST: service_role klíč dává plný přístup k databázi.
//     Admin panel nesmí být veřejně dostupný — chraň ho heslem nebo privátní URL.
//     V produkci zvažte přesun dotazů na backend API.
//
// Jak získat klíč: Supabase Dashboard → Settings → API → service_role (secret)

const ADMIN_SB_URL         = 'https://cxegfwfbgcgpwerfbvra.supabase.co';
const ADMIN_SERVICE_ROLE_KEY = 'REPLACE_WITH_YOUR_SERVICE_ROLE_KEY';

const adminSb = supabase.createClient(ADMIN_SB_URL, ADMIN_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Globální data — mutována in-place (stejný pattern jako employer dashboard)
const A_COMPANIES = [];
const A_WORKERS   = [];
const A_JOBS      = [];
const A_MATCHES   = [];
const A_STATS     = {
  totalCompanies:   0,
  totalWorkers:     0,
  totalJobs:        0,
  totalMatches:     0,
  totalHired:       0,
  newCompaniesMonth: 0,
  newWorkersMonth:   0,
};

function _loadMockData() {
  const mock_companies = [
    { id: 'c1', company_name: 'Kafe Punkt', name: 'Anna Nováková', email: 'anna@kafepunkt.cz', role: 'employer', created_at: '2026-05-01T10:00:00Z', location: 'Brno' },
    { id: 'c2', company_name: 'Pizza Roma',  name: 'Petr Dvořák',   email: 'petr@pizzaroma.cz',  role: 'employer', created_at: '2026-05-12T14:30:00Z', location: 'Praha' },
    { id: 'c3', company_name: 'Sklad CZ',    name: 'Jana Horáková', email: 'jana@skladcz.cz',    role: 'employer', created_at: '2026-06-03T09:15:00Z', location: 'Ostrava' },
  ];
  const mock_workers = [
    { id: 'w1', name: 'Tomáš Marek',    email: 'tomas@email.cz',   role: 'worker', jobs_done: 23, rating: 4.9, level: 7, created_at: '2026-04-15T08:00:00Z' },
    { id: 'w2', name: 'Klára Novotná',  email: 'klara@email.cz',   role: 'worker', jobs_done: 11, rating: 4.7, level: 4, created_at: '2026-05-20T11:00:00Z' },
    { id: 'w3', name: 'Petr Hájek',     email: 'petr@email.cz',    role: 'worker', jobs_done: 47, rating: 4.6, level: 9, created_at: '2026-05-28T16:00:00Z' },
    { id: 'w4', name: 'Eliška Šimková', email: 'eliska@email.cz',  role: 'worker', jobs_done: 8,  rating: 5.0, level: 3, created_at: '2026-06-10T09:30:00Z' },
    { id: 'w5', name: 'Adam Procházka', email: 'adam@email.cz',    role: 'worker', jobs_done: 19, rating: 4.8, level: 6, created_at: '2026-06-15T14:00:00Z' },
  ];
  const mock_jobs = [
    { id: 'j1', employer_id: 'c1', title: 'Barista do specialty kavárny', status: 'active',  pay: 180, pay_unit: 'Kč/h', location: 'Brno centrum',  date: '2026-07-01', description: 'Hledáme zkušeného baristu na ranní směny.', tags: ['Gastro','Latte art'], created_at: '2026-06-01T08:00:00Z' },
    { id: 'j2', employer_id: 'c1', title: 'Servírka — víkendová směna',   status: 'active',  pay: 165, pay_unit: 'Kč/h', location: 'Brno',          date: '2026-07-05', description: 'Víkendové brigády, pružná pracovní doba.', tags: ['Gastro'], created_at: '2026-06-05T10:00:00Z' },
    { id: 'j3', employer_id: 'c2', title: 'Rozvozce pizzy',               status: 'urgent',  pay: 200, pay_unit: 'Kč/h', location: 'Praha 2',       date: '2026-06-30', description: 'Nutné vlastní kolo nebo motorka.', tags: ['Auto','Doprava'], created_at: '2026-06-10T09:00:00Z' },
    { id: 'j4', employer_id: 'c2', title: 'Pomocník do kuchyně',          status: 'filled',  pay: 170, pay_unit: 'Kč/h', location: 'Praha',         date: '2026-06-20', description: '', tags: [], created_at: '2026-05-25T11:00:00Z' },
    { id: 'j5', employer_id: 'c3', title: 'Skladník — noční směna',       status: 'active',  pay: 220, pay_unit: 'Kč/h', location: 'Ostrava',       date: '2026-07-10', description: 'Hledáme spolehlivého skladníka na noční.', tags: ['Sklad','Fyzická práce'], created_at: '2026-06-12T07:00:00Z' },
    { id: 'j6', employer_id: 'c3', title: 'Řidič vysokozdvižného vozíku', status: 'paused',  pay: 250, pay_unit: 'Kč/h', location: 'Ostrava',       date: '2026-07-15', description: 'Požadován průkaz VZV.', tags: ['VZV','Sklad'], created_at: '2026-06-01T13:00:00Z' },
  ];
  const mock_matches = [
    { id: 'm1', job_id: 'j1', worker_id: 'w1', status: 'accepted', created_at: '2026-06-20T10:00:00Z' },
    { id: 'm2', job_id: 'j1', worker_id: 'w2', status: 'pending',  created_at: '2026-06-21T11:00:00Z' },
    { id: 'm3', job_id: 'j3', worker_id: 'w3', status: 'pending',  created_at: '2026-06-22T09:00:00Z' },
    { id: 'm4', job_id: 'j5', worker_id: 'w4', status: 'accepted', created_at: '2026-06-23T14:00:00Z' },
    { id: 'm5', job_id: 'j2', worker_id: 'w5', status: 'pending',  created_at: '2026-06-24T16:00:00Z' },
  ];

  const companyMap = {};
  mock_companies.forEach(c => { companyMap[c.id] = c; });

  const companiesEnriched = mock_companies.map(c => {
    const cJobs    = mock_jobs.filter(j => j.employer_id === c.id);
    const jobIds   = new Set(cJobs.map(j => j.id));
    const cMatches = mock_matches.filter(m => jobIds.has(m.job_id));
    return { ...c, _jobs: cJobs, _jobCount: cJobs.length, _matchCount: cMatches.length, _hiredCount: cMatches.filter(m => m.status === 'accepted').length, _lastActivity: cMatches[0]?.created_at || c.created_at };
  });

  const jobsEnriched = mock_jobs.map(j => ({ ...j, _companyName: companyMap[j.employer_id]?.company_name || '—' }));

  A_COMPANIES.length = 0; companiesEnriched.forEach(c => A_COMPANIES.push(c));
  A_WORKERS.length   = 0; mock_workers.forEach(w => A_WORKERS.push(w));
  A_JOBS.length      = 0; jobsEnriched.forEach(j => A_JOBS.push(j));
  A_MATCHES.length   = 0; mock_matches.forEach(m => A_MATCHES.push(m));

  Object.assign(A_STATS, { totalCompanies: 3, totalWorkers: 5, totalJobs: 6, totalMatches: 5, totalHired: 2, newCompaniesMonth: 1, newWorkersMonth: 2 });
}

async function fetchAllData() {
  if (ADMIN_SERVICE_ROLE_KEY === 'REPLACE_WITH_YOUR_SERVICE_ROLE_KEY') {
    _loadMockData();
    return;
  }

  const [companiesRes, workersRes, jobsRes, matchesRes] = await Promise.all([
    adminSb.from('profiles').select('*').eq('role', 'employer').order('created_at', { ascending: false }),
    adminSb.from('profiles').select('*').eq('role', 'worker').order('created_at', { ascending: false }),
    adminSb.from('jobs').select('*').order('created_at', { ascending: false }),
    adminSb.from('matches')
      .select('*, worker:profiles!matches_worker_id_fkey(id,name), job:jobs(id,title,employer_id)')
      .order('created_at', { ascending: false })
      .limit(5000),
  ]);

  const companies = companiesRes.data || [];
  const workers   = workersRes.data   || [];
  const jobs      = jobsRes.data      || [];
  const matches   = matchesRes.data   || [];

  const now        = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Per-company computed stats
  const companyMap = {};
  companies.forEach(c => { companyMap[c.id] = c; });

  const companiesEnriched = companies.map(c => {
    const cJobs      = jobs.filter(j => j.employer_id === c.id);
    const jobIds     = new Set(cJobs.map(j => j.id));
    const cMatches   = matches.filter(m => jobIds.has(m.job_id));
    const hiredCount = cMatches.filter(m => m.status === 'accepted').length;
    const lastAct    = cMatches.length > 0 ? cMatches[0].created_at : c.created_at;
    return {
      ...c,
      _jobs:         cJobs,
      _jobCount:     cJobs.length,
      _matchCount:   cMatches.length,
      _hiredCount:   hiredCount,
      _lastActivity: lastAct,
    };
  });

  // Jobs enriched with company name
  const jobsEnriched = jobs.map(j => ({
    ...j,
    _companyName: companyMap[j.employer_id]?.company_name || companyMap[j.employer_id]?.name || '—',
  }));

  // Populate globals
  A_COMPANIES.length = 0; companiesEnriched.forEach(c => A_COMPANIES.push(c));
  A_WORKERS.length   = 0; workers.forEach(w => A_WORKERS.push(w));
  A_JOBS.length      = 0; jobsEnriched.forEach(j => A_JOBS.push(j));
  A_MATCHES.length   = 0; matches.forEach(m => A_MATCHES.push(m));

  Object.assign(A_STATS, {
    totalCompanies:    companies.length,
    totalWorkers:      workers.length,
    totalJobs:         jobs.length,
    totalMatches:      matches.length,
    totalHired:        matches.filter(m => m.status === 'accepted').length,
    newCompaniesMonth: companies.filter(c => new Date(c.created_at) >= monthStart).length,
    newWorkersMonth:   workers.filter(w => new Date(w.created_at) >= monthStart).length,
  });
}

async function adminPauseJob(jobId) {
  const { error } = await adminSb.from('jobs').update({ status: 'paused' }).eq('id', jobId);
  if (error) console.error('adminPauseJob:', error);
  return !error;
}

async function adminDeleteJob(jobId) {
  const { error } = await adminSb.from('jobs').delete().eq('id', jobId);
  if (error) console.error('adminDeleteJob:', error);
  return !error;
}

async function adminBanUser(userId) {
  const { error } = await adminSb.auth.admin.updateUserById(userId, { ban_duration: '876600h' });
  if (error) console.error('adminBanUser:', error);
  return !error;
}

Object.assign(window, {
  adminSb, A_COMPANIES, A_WORKERS, A_JOBS, A_MATCHES, A_STATS,
  fetchAllData, adminPauseJob, adminDeleteJob, adminBanUser,
});
