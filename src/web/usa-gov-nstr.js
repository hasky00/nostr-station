(() => {
  const publicStaticPage = window.location.protocol === 'file:' || window.location.hostname.endsWith('.github.io');
  if (publicStaticPage) {
    for (const link of document.querySelectorAll('[data-workstation-link]')) {
      link.href = 'https://github.com/hasky00/nostr-station/tree/codex/usa-gov-nstr-workstation';
      link.textContent = 'View repository';
    }
  }

  const map = (title, authority, root, source, intro, boundary, groups) => ({
    title, authority, root, source, intro, boundary, groups
  });

  const serviceMaps = {
    passportstr: map('Passportstr', 'U.S. Department of State', 'Passport Services', 'https://travel.state.gov/en/passports.html',
      'Passportstr is the parent service identity. Each node is a distinct passport workflow with its own proofing, authorization, privacy, and signing policy.',
      'Passportstr v1 models only the first-time adult passport-book workflow. Every other node remains a future synthetic experiment.', [
        ['Apply', [['First-time adult', 'Passportstr v1', true], ['Child under 16', 'In-person process'], ['Age 16-17', 'Separate requirements']]],
        ['Renew or replace', [['Renew online', 'Eligible adults'], ['Renew by mail', 'Eligibility required'], ['Lost or stolen', 'Report immediately'], ['Change or correct', 'Name or data update']]],
        ['Timing and access', [['Get it fast', 'Expedited or urgent travel'], ['Where to apply', 'Facility or agency'], ['Fees and options', 'Book, card, delivery']]],
        ['Case support', [['Application status', 'Track an existing case'], ['Forms', 'Choose the correct form'], ['Contact and help', 'Official support channels']]]
      ]),
    taxstr: map('Taxstr', 'Internal Revenue Service', 'Individual Tax Services', 'https://www.irs.gov/help/tools',
      'Taxstr separates filing, payments, records, and support into independently authorized taxpayer workflows.',
      'Taxstr v1 models only an individual tax transcript request. It does not file returns, move money, decide liability, or place tax data on a relay.', [
        ['File', [['File a return', 'Electronic or paper'], ['Amend a return', 'Correct a filed return'], ['Identity protection PIN', 'Protect future filings']]],
        ['Pay and refund', [['Make a payment', 'Balance or estimated tax'], ['Payment plan', 'Manage an amount owed'], ['Refund status', 'Track a filed return']]],
        ['Records', [['Tax transcript', 'Taxstr v1', true], ['Online account', 'Balance and history'], ['Notices and letters', 'Official response channel']]],
        ['Help', [['Upload documents', 'Reply to a notice'], ['Tax assistance', 'Online, phone, or in person'], ['Identity theft', 'Report and recover']]]
      ]),
    socialstr: map('Socialstr', 'Social Security Administration', 'Social Security Services', 'https://www.ssa.gov/onlineservices/',
      'Socialstr maps identity-card, benefit, Medicare, record, and account-management services without treating one key as a universal identity.',
      'Socialstr v1 models only a replacement Social Security card request. Benefit decisions and records remain authoritative only in SSA systems.', [
        ['Number and card', [['Replacement card', 'Socialstr v1', true], ['First number', 'Evidence and eligibility'], ['Name correction', 'Update official record']]],
        ['Benefits', [['Retirement', 'Estimate, apply, manage'], ['Disability and SSI', 'Apply and track'], ['Appeals', 'Challenge a decision']]],
        ['Medicare and records', [['Medicare enrollment', 'Apply or track'], ['Social Security Statement', 'Earnings and estimates'], ['Benefit verification', 'Official proof letter']]],
        ['Manage account', [['Application status', 'Track a request'], ['Direct deposit', 'Update payment destination'], ['Address and contact', 'Maintain details']]]
      ]),
    educationstr: map('Educationstr', 'Department of Education / Federal Student Aid', 'Federal Student Aid', 'https://studentaid.gov/',
      'Educationstr separates the FAFSA, aid records, school offers, and federal loan lifecycle into case-scoped workflows.',
      'Educationstr v1 tracks one already-submitted FAFSA and its next actions. It does not submit or correct the form, calculate eligibility, award aid, or disburse funds.', [
        ['FAFSA', [['Start and submit', 'Student and contributors'], ['Submitted status', 'Educationstr v1', true], ['Correct or verify', 'Protected follow-up']]],
        ['Aid', [['Submission Summary', 'Review processed form'], ['School aid offers', 'School-controlled decision'], ['Grants and work-study', 'Review awarded aid']]],
        ['Federal loans', [['Counseling and agreements', 'Borrower obligations'], ['Repayment plans', 'Choose and maintain'], ['Forgiveness and consolidation', 'Apply and track']]],
        ['Account', [['Aid dashboard', 'Loans and grants'], ['Records and documents', 'Protected history'], ['Notifications', 'Required next actions']]]
      ]),
    dmvstr: map('DMVstr', 'State or territorial motor vehicle agency', 'Motor Vehicle Services', 'https://www.usa.gov/state-motor-vehicle-services',
      'DMVstr is jurisdiction-aware: each state or territory keeps its own legal rules while exposing a common service-map shape.',
      'DMVstr v1 models one eligible adult license renewal. Requirements, fees, REAL ID rules, and records remain with the responsible jurisdiction.', [
        ['Driver credential', [['First license', 'Test and proofing'], ['Renew license', 'DMVstr v1', true], ['Replace license', 'Lost or damaged']]],
        ['Identity changes', [['REAL ID', 'Jurisdiction requirements'], ['Name change', 'Supporting evidence'], ['Address change', 'Update official record']]],
        ['Vehicle', [['Register vehicle', 'Initial registration'], ['Title services', 'Ownership record'], ['Renew registration', 'Periodic renewal']]],
        ['Records and access', [['Driving record', 'Protected request'], ['Appointments', 'Office scheduling'], ['Fees and status', 'Payment and tracking']]]
      ]),
    immigrationstr: map('Immigrationstr', 'U.S. Citizenship and Immigration Services', 'Immigration Services', 'https://www.uscis.gov/tools',
      'Immigrationstr divides filing, case management, appointments, and citizenship resources into separately authorized workflows.',
      'Immigrationstr v1 privately tracks an already-filed case. It does not file forms, give legal advice, decide eligibility, or reveal immigration categories on a relay.', [
        ['File', [['Explore options', 'Find the correct process'], ['Forms and fees', 'Prepare an application'], ['File online', 'Submit through USCIS']]],
        ['Manage case', [['Case status', 'Immigrationstr v1', true], ['Processing times', 'Office estimates'], ['Case inquiry', 'Request assistance']]],
        ['Identity and appointments', [['Biometrics', 'Scheduled evidence'], ['Interview or appointment', 'Official notice controls'], ['Address change', 'Maintain correspondence']]],
        ['Citizenship and help', [['Naturalization', 'Eligibility and filing'], ['Find an office', 'Local or international'], ['Avoid scams', 'Authorized help only']]]
      ]),
    healthstr: map('Healthstr', 'State or local public-health authority', 'Public Health Services', 'https://www.cdc.gov/vaccines-adults/recommended-vaccines/immunization-records.html',
      'Healthstr maps record access, vaccination, community-health, and public-notice functions while preserving local authority and medical privacy.',
      'Healthstr v1 models an official immunization-record request. It does not diagnose, prescribe, decide coverage, or place medical information on a relay.', [
        ['Immunization records', [['Request official record', 'Healthstr v1', true], ['Correct a record', 'Jurisdiction review'], ['Share a record', 'Purpose-limited consent']]],
        ['Vaccination', [['Find a clinic', 'Authorized provider'], ['Routine vaccination', 'Age and risk guidance'], ['Travel vaccination', 'Destination guidance']]],
        ['Community health', [['Clinic services', 'Local directory'], ['Testing services', 'Jurisdiction programs'], ['Disease reporting', 'Authorized channels']]],
        ['Public information', [['Health notices', 'Signed local guidance'], ['Outbreak updates', 'Time-bounded notices'], ['Accessible information', 'Language and disability access']]]
      ]),
    alertstr: map('Alertstr', 'Authorized public alerting authority', 'Emergency Alerting', 'https://www.fema.gov/emergency-managers/practitioners/integrated-public-alert-warning-system',
      'Alertstr maps the public-warning lifecycle from authorized creation through delivery, update, cancellation, and audit.',
      'Alertstr v1 models publication of a synthetic verified emergency alert. It cannot replace IPAWS authorization, operational approval, or life-safety delivery systems.', [
        ['Alert lifecycle', [['Issue verified alert', 'Alertstr v1', true], ['Update alert', 'Correct or extend'], ['Cancel or all-clear', 'Close active warning']]],
        ['Delivery channels', [['Wireless alerts', 'WEA delivery'], ['Broadcast alerts', 'EAS delivery'], ['Local opt-in alerts', 'Jurisdiction channel']]],
        ['Authority operations', [['Authorize sender', 'Registered role'], ['Approve content', 'Operational quorum'], ['Geographic targeting', 'Affected area only']]],
        ['Public trust', [['Verify origin', 'Agency signature'], ['Accessible message', 'Language and disability access'], ['Public archive', 'Accountable record']]]
      ]),
    votestr: map('Votestr', 'State or local election authority', 'Election Information Services', 'https://vote.gov/',
      'Votestr organizes registration and public election information without carrying a ballot, vote choice, or election-system credential.',
      'Votestr v1 models registration-status and polling-information access. It never casts, stores, transmits, or proves a vote.', [
        ['Registration', [['Register to vote', 'Jurisdiction process'], ['Update registration', 'Name or address'], ['Check registration', 'Votestr v1', true]]],
        ['Ways to vote', [['Vote in person', 'Election-day process'], ['Early voting', 'Where available'], ['Absentee or mail', 'Jurisdiction rules']]],
        ['Election information', [['Polling place', 'Votestr v1', true], ['Dates and deadlines', 'Signed public notice'], ['ID requirements', 'Jurisdiction-specific']]],
        ['Voter help', [['Military and overseas', 'Federal assistance'], ['Accessibility', 'Voting accommodations'], ['Election office', 'Official local contact']]]
      ]),
    courtstr: map('Courtstr', 'Federal district court', 'Federal Jury Services', 'https://www.uscourts.gov/court-programs/jury-service',
      'Courtstr maps the juror journey while keeping questionnaire answers, qualification facts, and court instructions private.',
      'Courtstr v1 models verification and response to one federal jury summons. The issuing district court remains authoritative for every instruction.', [
        ['Summons', [['Verify summons', 'Confirm issuing court'], ['Qualification response', 'Courtstr v1', true], ['Attendance instructions', 'Court-controlled notice']]],
        ['Requests', [['Excuse or deferral', 'District review'], ['Accommodation', 'Accessibility support'], ['Contact jury office', 'Official channel']]],
        ['Service', [['Check-in and status', 'Appearance workflow'], ['Schedule changes', 'Signed court update'], ['Pay and reimbursement', 'Court record controls']]],
        ['Protection', [['Jury scam warning', 'No coercive payment'], ['Employment protection', 'Federal law information'], ['Juror guidance', 'Duties and conduct']]]
      ]),
    benefitstr: map('Benefitstr', 'State SNAP administering agency', 'SNAP Services', 'https://www.fns.usda.gov/snap/state-directory',
      'Benefitstr separates application, ongoing case management, benefit access, and review under the responsible state agency.',
      'Benefitstr v1 models SNAP recertification only. It does not determine eligibility, calculate benefits, issue EBT value, or automate an adverse decision.', [
        ['Apply', [['Find state agency', 'Correct jurisdiction'], ['Submit application', 'Protected evidence'], ['Interview', 'Agency verification']]],
        ['Manage case', [['Recertification', 'Benefitstr v1', true], ['Report changes', 'Household circumstances'], ['Provide documents', 'Protected upload']]],
        ['Use benefits', [['EBT card support', 'State or issuer'], ['Balance and transactions', 'Protected account data'], ['Replacement card', 'Loss or theft']]],
        ['Decisions', [['Eligibility notice', 'Official agency record'], ['Fair hearing or appeal', 'Human review'], ['Report fraud', 'Protected reporting']]]
      ]),
    licensestr: map('Licensestr', 'City or county licensing authority', 'Local Business Licensing', 'https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits',
      'Licensestr is a jurisdiction-aware map for discovering, applying for, maintaining, and closing local business permissions.',
      'Licensestr v1 models renewal of one low-risk general business license. Zoning, professional, environmental, and regulated-industry permissions remain separate.', [
        ['Discover', [['Find jurisdiction', 'City or county'], ['License requirements', 'Activity and location'], ['Zoning and permits', 'Separate approvals']]],
        ['Apply', [['New license', 'Evidence and fees'], ['Application status', 'Track review'], ['Certificate delivery', 'Official result']]],
        ['Maintain', [['Renew license', 'Licensestr v1', true], ['Update business details', 'Ownership or address'], ['Close or surrender', 'End authorization']]],
        ['Compliance', [['Inspection', 'Where required'], ['Correct a violation', 'Agency review'], ['Appeal or hearing', 'Due-process channel']]]
      ]),
    foiastr: map('FOIAstr', 'Responsible federal agency component', 'Freedom of Information Act', 'https://www.foia.gov/how-to.html',
      'FOIAstr maps request preparation, agency processing, release, and administrative review while preserving each component’s legal responsibility.',
      'FOIAstr v1 models submission and tracking of a synthetic request. It does not guarantee release, bypass exemptions, or publish responsive records automatically.', [
        ['Prepare', [['Identify agency', 'Find record owner'], ['Describe records', 'Specific scope'], ['Fees and category', 'Requester context']]],
        ['Request', [['Submit request', 'FOIAstr v1', true], ['Identity certification', 'Privacy Act records'], ['Expedited processing', 'Agency decision']]],
        ['Process', [['Track status', 'FOIAstr v1', true], ['Clarify scope', 'Agency-requester exchange'], ['Fees and timing', 'Estimate or agreement']]],
        ['Result and review', [['Records release', 'Protected or public'], ['Redactions or no records', 'Agency determination'], ['Appeal or mediation', 'Administrative review']]]
      ])
  };

  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const services = Array.from(document.querySelectorAll('[data-scope]'));
  const serviceButtons = Array.from(document.querySelectorAll('[data-service]'));
  const explorer = document.querySelector('#service-explorer');
  const fields = {
    authority: document.querySelector('#explorer-authority'),
    title: document.querySelector('#explorer-title'),
    intro: document.querySelector('#explorer-intro'),
    root: document.querySelector('#explorer-root'),
    rootAuthority: document.querySelector('#explorer-root-authority'),
    groups: document.querySelector('#explorer-groups'),
    boundary: document.querySelector('#explorer-boundary'),
    source: document.querySelector('#explorer-source')
  };

  const closeExplorer = () => {
    if (explorer) explorer.hidden = true;
    for (const candidate of serviceButtons) candidate.setAttribute('aria-expanded', 'false');
  };

  const renderExplorer = (key) => {
    const service = serviceMaps[key];
    if (!service || Object.values(fields).some((field) => !field)) return;

    fields.authority.textContent = `Selected branch / ${service.authority}`;
    fields.title.textContent = `${service.title} service map`;
    fields.intro.textContent = service.intro;
    fields.root.textContent = service.root;
    fields.rootAuthority.textContent = service.authority;
    fields.boundary.textContent = service.boundary;
    fields.source.href = service.source;
    fields.groups.replaceChildren();

    for (const [groupTitle, nodes] of service.groups) {
      const group = document.createElement('section');
      group.className = 'graph-group';
      const heading = document.createElement('h4');
      heading.textContent = groupTitle;
      group.append(heading);

      for (const [nodeTitle, note, modeled = false] of nodes) {
        const node = document.createElement('a');
        node.className = `graph-node${modeled ? ' modeled-node' : ''}`;
        node.href = service.source;
        node.target = '_blank';
        node.rel = 'noreferrer';
        const strong = document.createElement('strong');
        strong.textContent = nodeTitle;
        const span = document.createElement('span');
        span.textContent = note;
        node.append(strong, span);
        group.append(node);
      }

      fields.groups.append(group);
    }
  };

  for (const button of filterButtons) {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      for (const candidate of filterButtons) {
        const selected = candidate === button;
        candidate.classList.toggle('active', selected);
        candidate.setAttribute('aria-pressed', selected ? 'true' : 'false');
      }
      for (const service of services) service.hidden = filter !== 'all' && service.dataset.scope !== filter;
      closeExplorer();
    });
  }

  for (const serviceButton of serviceButtons) {
    serviceButton.addEventListener('click', () => {
      if (!explorer) return;
      const willOpen = explorer.hidden || serviceButton.getAttribute('aria-expanded') !== 'true';
      for (const candidate of serviceButtons) {
        candidate.setAttribute('aria-expanded', candidate === serviceButton && willOpen ? 'true' : 'false');
      }
      explorer.hidden = !willOpen;
      if (!willOpen) return;
      renderExplorer(serviceButton.dataset.service);
      explorer.focus({ preventScroll: true });
      explorer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();
