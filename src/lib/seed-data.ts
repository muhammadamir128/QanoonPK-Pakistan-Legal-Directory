// QanoonPK seed data — 5 categories, 40+ laws with sections & amendments
// This is a TypeScript module exporting structured data.

export type SeedCategory = {
  name: string
  nameUrdu: string
  slug: string
  icon: string
  color: string
  description: string
  descriptionUrdu: string
}

export type SeedSection = {
  sectionNumber: string
  title?: string
  content: string
  contentUrdu?: string
}

export type SeedAmendment = {
  amendmentYear: number
  amendmentTitle: string
  description: string
  gazetteReference?: string
}

export type SeedLaw = {
  title: string
  titleUrdu: string
  slug: string
  categorySlug: string
  yearEnacted: number
  jurisdiction: string
  status: string
  summary: string
  summaryUrdu: string
  gazetteReference?: string
  promulgatingAuthority?: string
  applicabilityTags: string[]
  sections: SeedSection[]
  amendments: SeedAmendment[]
}

export const categories: SeedCategory[] = [
  {
    name: 'Criminal Law',
    nameUrdu: 'فوجداری قانون',
    slug: 'criminal-law',
    icon: 'Gavel',
    color: '#0d9488',
    description: 'Laws governing offences, criminal procedure, evidence, punishment and investigation in Pakistan.',
    descriptionUrdu: 'پاکستان میں جرائم، فوجداری عمل، ثبوت، سزا اور تفتیش سے متعلق قوانین۔',
  },
  {
    name: 'Family Law',
    nameUrdu: 'خاندانی قانون',
    slug: 'family-law',
    icon: 'Users',
    color: '#db2777',
    description: 'Laws governing marriage, divorce, custody, guardianship, inheritance and family disputes.',
    descriptionUrdu: 'نکاح، طلاق، حضانت، ولایت، وراثت اور خاندانی تنازعات سے متعلق قوانین۔',
  },
  {
    name: 'Cyber & IT Law',
    nameUrdu: 'سائبر و آئی ٹی قانون',
    slug: 'cyber-it-law',
    icon: 'ShieldCheck',
    color: '#9333ea',
    description: 'Laws governing electronic crimes, digital transactions, data protection and cyber security.',
    descriptionUrdu: 'الیکٹرانک جرائم، ڈیجیٹل لین دین، ڈیٹا تحفظ اور سائبر سیکیورٹی سے متعلق قوانین۔',
  },
  {
    name: 'Labor & Employment Law',
    nameUrdu: 'محنت و روزگار قانون',
    slug: 'labor-employment-law',
    icon: 'HardHat',
    color: '#ea580c',
    description: 'Laws governing employment relations, wages, workplace safety, industrial disputes and worker welfare.',
    descriptionUrdu: 'ملازمت کے تعلقات، اجرت، ورک پلیس سیفٹی، صنعتی تنازعات اور مزدوروں کی بہبود سے متعلق قوانین۔',
  },
  {
    name: 'Tax Law',
    nameUrdu: 'ٹیکس قانون',
    slug: 'tax-law',
    icon: 'Receipt',
    color: '#0891b2',
    description: 'Laws governing income tax, sales tax, federal excise, customs duties and revenue collection.',
    descriptionUrdu: 'انکم ٹیکس، سیلز ٹیکس، فیڈرل ایکسائز، کسٹم ڈیوٹی اور ریونیو وصولی سے متعلق قوانین۔',
  },
  {
    name: 'Constitutional Law',
    nameUrdu: 'آئینی قانون',
    slug: 'constitutional-law',
    icon: 'Landmark',
    color: '#7c3aed',
    description: 'The Constitution of Pakistan 1973, its amendments, fundamental rights, and the structure of the state.',
    descriptionUrdu: 'پاکستان کا آئین 1973، اس کی ترامیم، بنیادی حقوق، اور ریاست کا ڈھانچہ۔',
  },
  {
    name: 'Civil Law',
    nameUrdu: 'دیوانی قانون',
    slug: 'civil-law',
    icon: 'Scale',
    color: '#9333ea',
    description: 'Civil procedure, contracts, limitations, and specific relief — the law of private disputes.',
    descriptionUrdu: 'دیوانی عمل، معاہدے، عدالتوں کی حدود، اور مخصوص چارہ جوئی — نجی تنازعات کا قانون۔',
  },
  {
    name: 'Property & Land Law',
    nameUrdu: 'جائداد و اراضی قانون',
    slug: 'property-land-law',
    icon: 'Home',
    color: '#16a34a',
    description: 'Laws governing transfer, registration and revenue of immovable property and land.',
    descriptionUrdu: 'غیر منقولہ جائداد اور زمین کی منتقلی، اندراج اور ریونیو سے متعلق قوانین۔',
  },
  {
    name: 'Consumer Protection Law',
    nameUrdu: 'صارفین کے تحفظ کا قانون',
    slug: 'consumer-protection-law',
    icon: 'ShoppingCart',
    color: '#d97706',
    description: 'Provincial laws protecting consumers against unfair trade practices, defective goods, and deficient services.',
    descriptionUrdu: 'ناشفاف تجارتی عمل، معیب اشیاء، اور ناقص خدمات سے صارفین کے تحفظ کے صوبائی قوانین۔',
  },
  {
    name: "Women's Rights Law",
    nameUrdu: 'خواتین کے حقوق کا قانون',
    slug: 'womens-rights-law',
    icon: 'HeartHandshake',
    color: '#be185d',
    description: 'Laws protecting women against harassment, domestic violence, acid attacks, and gender discrimination.',
    descriptionUrdu: 'ہراسانی، گھریلو تشدد، تیزاب کے حملوں، اور صنفی امتیاز سے خواتین کے تحفظ کے قوانین۔',
  },
  {
    name: 'Environmental Law',
    nameUrdu: 'ماحولیاتی قانون',
    slug: 'environmental-law',
    icon: 'Leaf',
    color: '#059669',
    description: 'Laws protecting Pakistan\'s environment — pollution control, climate change, and ecological conservation.',
    descriptionUrdu: 'پاکستان کے ماحول کے تحفظ کے قوانین — آلودگی کنٹرول، موسمیاتی تبدیلی، اور ماحولیاتی تحفظ۔',
  },
  {
    name: 'Corporate & Company Law',
    nameUrdu: 'کارپوریٹ و کمپنی قانون',
    slug: 'corporate-company-law',
    icon: 'Building2',
    color: '#0369a1',
    description: 'Laws governing companies, partnerships, SECP regulations, and corporate governance in Pakistan.',
    descriptionUrdu: 'پاکستان میں کمپنیوں، شراکت داری، SECP ریگولیشنز، اور کارپوریٹ گورننس سے متعلق قوانین۔',
  },
  {
    name: 'Election Law',
    nameUrdu: 'الیکشن قانون',
    slug: 'election-law',
    icon: 'Vote',
    color: '#c026d3',
    description: 'Laws governing elections, voter registration, political parties, and the Election Commission of Pakistan.',
    descriptionUrdu: 'الیکشن، ووٹر رجسٹریشن، سیاسی جماعتوں، اور الیکشن کمیشن آف پاکستان سے متعلق قوانین۔',
  },
  {
    name: 'Intellectual Property Law',
    nameUrdu: 'دانش містانی قانون',
    slug: 'intellectual-property-law',
    icon: 'Lightbulb',
    color: '#ca8a04',
    description: 'Copyright, trademarks, patents and designs — protecting creative and innovative works in Pakistan.',
    descriptionUrdu: 'کاپی رائٹ، ٹریڈ مارکس، پیٹنٹس اور ڈیزائنز — پاکستان میں تخلیقی و جدت طراز کاموں کا تحفظ۔',
  },
  {
    name: 'Banking & Finance Law',
    nameUrdu: 'بینکنگ و مالیہ قانون',
    slug: 'banking-finance-law',
    icon: 'Landmark',
    color: '#1e40af',
    description: 'Laws governing banks, financial institutions, negotiable instruments, and banking regulation in Pakistan.',
    descriptionUrdu: 'بینکوں، مالیاتی اداروں، قابلِ تبادلہ آلات، اور بینکنگ ریگولیشن سے متعلق پاکستان کے قوانین۔',
  },
  {
    name: 'Immigration & Citizenship Law',
    nameUrdu: 'امہراجن و شہریت قانون',
    slug: 'immigration-citizenship-law',
    icon: 'Plane',
    color: '#0891b2',
    description: 'Laws governing citizenship, passports, visas, foreigners, and immigration in Pakistan.',
    descriptionUrdu: 'شہریت، پاسپورٹ، ویزا، غیر ملکیوں، اور امہراجن سے متعلق پاکستان کے قوانین۔',
  },
  {
    name: 'Health Law',
    nameUrdu: 'صحت قانون',
    slug: 'health-law',
    icon: 'HeartPulse',
    color: '#dc2626',
    description: 'Laws governing drugs, medical practice, healthcare regulation, and patient rights in Pakistan.',
    descriptionUrdu: 'ادویات، طبی پریکٹس، صحت کی ریگولیشن، اور مریضوں کے حقوق سے متعلق پاکستان کے قوانین۔',
  },
  {
    name: 'Education Law',
    nameUrdu: 'تعلیم قانون',
    slug: 'education-law',
    icon: 'GraduationCap',
    color: '#7c3aed',
    description: 'Laws governing education, universities, HEC regulations, and academic standards in Pakistan.',
    descriptionUrdu: 'تعلیم، یونیورسٹیاں، HEC ریگولیشنز، اور تعلیمی معیار سے متعلق پاکستان کے قوانین۔',
  },
  {
    name: 'Traffic & Motor Vehicle Law',
    nameUrdu: 'ٹریفک و موٹر گاڑی قانون',
    slug: 'traffic-motor-vehicle-law',
    icon: 'Car',
    color: '#ea580c',
    description: 'Laws governing traffic, motor vehicles, driving licenses, and road safety in Pakistan.',
    descriptionUrdu: 'ٹریفک، موٹر گاڑیاں، ڈرائیونگ لائسنس، اور سڑک کی حفاظت سے متعلق پاکستان کے قوانین۔',
  },
  {
    name: 'Insurance Law',
    nameUrdu: 'انشورنس قانون',
    slug: 'insurance-law',
    icon: 'Shield',
    color: '#0891b2',
    description: 'Laws governing insurance companies, policies, claims, and the SECP insurance division in Pakistan.',
    descriptionUrdu: 'انشورنس کمپنیوں، پالیسیوں، دعوؤں، اور SECP انشورنس ڈویژن سے متعلق پاکستان کے قوانین۔',
  },
  {
    name: 'Anti-Corruption Law',
    nameUrdu: 'اینٹی کرپشن قانون',
    slug: 'anti-corruption-law',
    icon: 'ShieldAlert',
    color: '#991b1b',
    description: 'Laws governing accountability, anti-corruption, NAB, and recovery of ill-gotten wealth in Pakistan.',
    descriptionUrdu: 'جواب دہی، اینٹی کرپشن، NAB، اور غیر قانونی دولت کی وصولی سے متعلق پاکستان کے قوانین۔',
  },
  {
    name: 'Arbitration & Dispute Resolution',
    nameUrdu: 'ثالثی و تنازعات کا حل',
    slug: 'arbitration-dispute-resolution',
    icon: 'Handshake',
    color: '#15803d',
    description: 'Laws governing arbitration, mediation, and alternate dispute resolution mechanisms in Pakistan.',
    descriptionUrdu: 'ثالثی، ثالثی، اور متبادل تنازعات کے حل کے طریقوں سے متعلق پاکستان کے قوانین۔',
  },
  {
    name: 'Media & Press Law',
    nameUrdu: 'میڈیا و پریس قانون',
    slug: 'media-press-law',
    icon: 'Newspaper',
    color: '#be123c',
    description: 'Laws governing media, press, broadcasting, PEMRA, and freedom of expression in Pakistan.',
    descriptionUrdu: 'میڈیا، پریس، نشریات، PEMRA، اور اظہارِ رائے کی آزادی سے متعلق پاکستان کے قوانین۔',
  },
  {
    name: 'Human Rights & Minority Law',
    nameUrdu: 'انسانی حقوق و اقلیتی قانون',
    slug: 'human-rights-minority-law',
    icon: 'HeartHandshake',
    color: '#7c3aed',
    description: 'Laws protecting human rights, minority rights, and vulnerable groups in Pakistan.',
    descriptionUrdu: 'انسانی حقوق، اقلیتی حقوق، اور کمزور گروہوں کے تحفظ سے متعلق پاکستان کے قوانین۔',
  },
  {
    name: 'Provincial-Specific Law',
    nameUrdu: 'صوبائی مخصوص قانون',
    slug: 'provincial-specific-law',
    icon: 'Map',
    color: '#0e7490',
    description: 'Laws specific to individual provinces — Punjab, Sindh, KPK, Balochistan — covering local government, revenue, and provincial subjects.',
    descriptionUrdu: 'انفرادی صوبوں کے لیے مخصوص قوانین — پنجاب، سندھ، کے پی، بلوچستان — مقامی حکومت، ریونیو، اور صوبائی مضامین پر محیط۔',
  },
  {
    name: 'Police Law',
    nameUrdu: 'پولیس قانون',
    slug: 'police-law',
    icon: 'Shield',
    color: '#1e40af',
    description: 'Laws governing police organization, powers, and accountability in Pakistan — including Police Order 2002 and provincial police acts.',
    descriptionUrdu: 'پاکستان میں پولیس کی تنظیم، اختیارات، اور جواب دہی سے متعلق قوانین — بشمول پولیس آرڈر 2002 اور صوبائی پولیس ایکٹس۔',
  },
  {
    name: 'Government / Civil Servant Law',
    nameUrdu: 'حکومت / سول سرونٹ قانون',
    slug: 'government-civil-servant-law',
    icon: 'Building',
    color: '#475569',
    description: 'Laws governing civil servants, government employment, service rules, and bureaucratic administration in Pakistan.',
    descriptionUrdu: 'سول سرونٹس، حکومتی ملازمت، سروس رولز، اور بیوروکریٹک انتظامیہ سے متعلق پاکستان کے قوانین۔',
  },
  {
    name: 'Agriculture Law',
    nameUrdu: 'زرعی قانون',
    slug: 'agriculture-law',
    icon: 'Wheat',
    color: '#65a30d',
    description: 'Laws governing agriculture, seeds, pesticides, land reforms, and farming regulation in Pakistan.',
    descriptionUrdu: 'زراعت، بیج، کیڑے مار ادویات، زمینی اصلاحات، اور کاشتکاری کی ریگولیشن سے متعلق پاکستان کے قوانین۔',
  },
]

export const laws: SeedLaw[] = [
  // ===================== CRIMINAL LAW =====================
  {
    title: 'Pakistan Penal Code 1860',
    titleUrdu: 'پاکستان پینل کوڈ 1860',
    slug: 'pakistan-penal-code-1860',
    categorySlug: 'criminal-law',
    yearEnacted: 1860,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'The Pakistan Penal Code (PPC) is the principal criminal code of Pakistan defining all major criminal offences — from murder and theft to defamation and public nuisance — along with their punishments. Originally drafted in British India, it remains the backbone of substantive criminal law.',
    summaryUrdu:
      'پاکستان پینل کوڈ (PPC) پاکستان کا بنیادی فوجداری کوڈ ہے جو تمام اہم جرائم — قتل، چوری، تخریب، عزت آبری وغیرہ — اور ان کی سزاؤں کی تعریف کرتا ہے۔ اصل میں برطانوی ہند میں مرتب ہوا، یہ آج بھی فوجداری قانون کا مرکز ہے۔',
    gazetteReference: 'Act XLV of 1860',
    promulgatingAuthority: 'Government of British India (in force in Pakistan)',
    applicabilityTags: ['Individuals', 'Lawyers', 'Students', 'General Public'],
    sections: [
      {
        sectionNumber: '302',
        title: 'Punishment for murder',
        content:
          'Whoever commits murder shall be punished with death as qisas or imprisonment for life as ta\'zir, and shall also be liable to diyat. Where the offence is committed in the name of honour, the court may impose the maximum punishment.',
        contentUrdu:
          'جو کوئی قتل کرے گا وہ قصاص کے طور پر سزائے موت یا تعزیر کے طور پر قیدِ بامشقت کا مستحق ہوگا اور دیت کا بھی ذمہ دار ہوگا۔',
      },
      {
        sectionNumber: '304-A',
        title: 'Qatl-i-Khatâ (accidental murder)',
        content:
          'Whoever commits qatl-i-khatâ shall be liable to diyat and, where applicable, imprisonment for up to ten years as ta\'zir.',
        contentUrdu:
          'جو کوئی خطا کے ساتھ قتل کرے گا وہ دیت کا ذمہ دار ہوگا اور جہاں لاگو ہو تعزیر کے طور پر دس سال تک قید کی سزا پائے گا۔',
      },
      {
        sectionNumber: '378',
        title: 'Theft',
        content:
          'Whoever, intending to take dishonestly any movable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft.',
        contentUrdu:
          'جو کوئی بے ایمانی سے کسی متحرک جائداد کو کسی شخص کی ملکیت سے اس کی رضامندی کے بغیر لے لینے کی نیت سے ہٹائے، وہ چوری کرتا ہے۔',
      },
      {
        sectionNumber: '379',
        title: 'Punishment for theft',
        content: 'Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.',
        contentUrdu: 'جو کوئی چوری کرے گا وہ تین سال تک قید یا جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔',
      },
      {
        sectionNumber: '415',
        title: 'Cheating',
        content:
          'Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, or intentionally induces the person so deceived to do or omit to do anything which he would not do or omit if he were not so deceived, is said to "cheat".',
        contentUrdu:
          'جو کوئی دھوکے سے کسی شخص کو پراپرٹی دینے پر آمادہ کرے یا کسی ایسے کام کرنے پر آمادہ کرے جو وہ دھوکے کے بغیر نہ کرتا، وہ دھوکہ دیتا ہے۔',
      },
      {
        sectionNumber: '420',
        title: 'Cheating and dishonestly inducing delivery of property',
        content: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
        contentUrdu:
          'جو کوئی دھوکہ دے کر کسی شخص سے پراپرٹی حاصل کرے وہ سات سال تک قید اور جرمانے کا مستحق ہوگا۔',
      },
      {
        sectionNumber: '499',
        title: 'Defamation',
        content:
          'Whoever, by words either spoken or intended to be read, or by signs or by visible representations, makes or publishes any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said, except in certain cases, to defame that person.',
        contentUrdu:
          'جو کوئی کسی شخص کی شہرت کو نقصان پہنچانے کی نیت سے کسی الزام کی اشاعت کرے وہ اس شخص کی عزت آبری کرتا ہے۔',
      },
      {
        sectionNumber: '500',
        title: 'Punishment for defamation',
        content: 'Whoever defames another shall be punished with simple imprisonment for a term which may extend to two years, or with fine, or with both.',
        contentUrdu: 'جو کوئی دوسرے کی عزت آبری کرے وہ دو سال تک سادی قید یا جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔',
      },
    ],
    amendments: [
      { amendmentYear: 1979, amendmentTitle: 'Hudood Ordinances integration', description: 'PPC amended to align with the Offences Against Property (Enforcement of Hudood) Ordinance 1979.', gazetteReference: 'Ordinance VI of 1979' },
      { amendmentYear: 1986, amendmentTitle: 'Blasphemy law addition', description: 'Sections 295-B and 295-C added criminalizing desecration of the Quran and derogatory remarks about the Prophet (PBUH).', gazetteReference: 'Act III of 1986' },
      { amendmentYear: 2016, amendmentTitle: 'Anti-Rape and Honour-Killing amendments', description: 'Sections 311 and 316-A amended to close the "forgiveness" loophole in honour killing cases.', gazetteReference: 'Act XX of 2016' },
    ],
  },
  {
    title: 'Code of Criminal Procedure 1898',
    titleUrdu: 'کرمنل پروسیجر کوڈ 1898',
    slug: 'code-of-criminal-procedure-1898',
    categorySlug: 'criminal-law',
    yearEnacted: 1898,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'The CrPC is the procedural manual for the substantive criminal law (PPC). It defines the procedure for FIR registration, arrest, investigation, bail, trial, evidence, sentencing, appeals and execution of sentences.',
    summaryUrdu:
      'CrPC فوجداری عمل کا دستورالعمل ہے — FIR درج کرنا، گرفتاری، تفتیش، ضمانت، مقدمہ، ثبوت، سزا، اپیل اور سزاؤں کی تکمیل کا طریقہ کار مقرر کرتا ہے۔',
    gazetteReference: 'Act V of 1898',
    promulgatingAuthority: 'Government of British India (in force in Pakistan)',
    applicabilityTags: ['Lawyers', 'Judges', 'Police', 'Students'],
    sections: [
      { sectionNumber: '154', title: 'Information in cognizable cases (FIR)', content: 'Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be entered in a book to be kept by such officer in such form as the Provincial Government may prescribe.', contentUrdu: 'تقصیر کے قابل جرائم کی اطلاع، اگر زبانی تھانے کے افسر کو دی جائے، تحریر میں تبدیل کر کے دہندہ کو پڑھ کر سنائی جائے گی اور ایک خاص رجسٹر میں درج کی جائے گی۔' },
      { sectionNumber: '167', title: 'Procedure when investigation cannot be completed in 24 hours', content: 'Whenever the investigation cannot be completed within twenty-four hours, the officer in charge of the police station shall forward the accused in custody to a Magistrate with a report, and seek police remand for further investigation.', contentUrdu: 'اگر تفتیش 24 گھنٹوں میں مکمل نہ ہو، تفتیشی افسر ملزم کو مجسٹریٹ کے پاس بھیجے اور پولیس ریمانڈ کی درخواست کرے۔' },
      { sectionNumber: '449', title: 'Bail in bailable offences', content: 'In the case of a bailable offence, the accused person shall be released on bail by the officer in charge of the police station or by the Court before which he is brought.', contentUrdu: 'ضمانت کے قابل جرم میں، ملزم کو تھانے کے انچارج یا عدالت ضمانت پر رہا کرے۔' },
      { sectionNumber: '497', title: 'Bail in non-bailable offences', content: 'In a non-bailable offence, the Court may grant bail, but shall not grant bail where there are reasonable grounds for believing that the accused is guilty of an offence punishable with death or imprisonment for life.', contentUrdu: 'غیر ضمانت کے قابل جرم میں عدالت ضمانت دے سکتی ہے، مگر اگر موت یا قیدِ بامشقت کی سزا کے مواقع ہوں تو ضمانت نہ دی جائے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Qanun-e-Shahadat Order 1984',
    titleUrdu: 'قانونِ شہادت آرڈیننس 1984',
    slug: 'qanun-e-shahadat-order-1984',
    categorySlug: 'criminal-law',
    yearEnacted: 1984,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'The Qanun-e-Shahadat Order 1984 is the law of evidence in Pakistan, replacing the Evidence Act 1872. It regulates how evidence (oral, documentary, electronic) is presented in courts, including admissibility, relevance, weight and the testimonial competence of witnesses.',
    summaryUrdu:
      'قانونِ شہادت آرڈیننس 1984 پاکستان کا ثبوت کا قانون ہے، جو ثبوت کی پیشکش، قابلِ قبولیت، اہمیت اور گواہوں کی اہلیت کا تعین کرتا ہے۔',
    gazetteReference: 'President\'s Order No. 10 of 1984',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Lawyers', 'Judges', 'Students'],
    sections: [
      { sectionNumber: 'Art. 3', title: 'Evidence may be given of facts in issue and relevant facts', content: 'Evidence may be given in any suit or proceeding of the existence or non-existence of every fact in issue and of such other facts as are hereinafter declared to be relevant, and of no others.', contentUrdu: 'کسی بھی مقدمے میں صرف متنازعہ حقائق اور متعلقہ حقائق کے وجود یا عدم وجود کا ثبوت دیا جا سکتا ہے۔' },
      { sectionNumber: 'Art. 17', title: 'Competence of witnesses', content: 'Every person is competent to testify unless the Court considers him incapable of understanding the questions put to him, or of giving rational answers due to tender years, extreme old age, disease, or other cause.', contentUrdu: 'ہر شخص گواہی کا اہل ہے، جب تک عدالت اسے سوال سمجھنے یا معقول جواب دینے سے قاصر نہ سمجھے۔' },
      { sectionNumber: 'Art. 164-A', title: 'Proof of electronic document', content: 'Information contained in an electronic document, if admissible, shall be proved in accordance with the Electronic Transactions Ordinance 2002.', contentUrdu: 'الیکٹرانک دستاویز میں موجود معلومات قابلِ قبول ہونے کی صورت میں الیکٹرانک ٹرانزیکشنز آرڈیننس 2002 کے مطابق ثابت کی جائے گی۔' },
    ],
    amendments: [
      { amendmentYear: 2002, amendmentTitle: 'Electronic Transactions Ordinance compatibility', description: 'Articles amended to recognize electronic documents and digital signatures as evidence.', gazetteReference: 'ETO 2002' },
    ],
  },
  {
    title: 'Anti-Terrorism Act 1997',
    titleUrdu: 'اینٹی ٹیرورزم ایکٹ 1997',
    slug: 'anti-terrorism-act-1997',
    categorySlug: 'criminal-law',
    yearEnacted: 1997,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'The Anti-Terrorism Act 1997 establishes special Anti-Terrorism Courts (ATCs) and defines terrorism, terrorist acts and extremist acts, with stricter procedures and harsher penalties including the death penalty for terrorism-related murders.',
    summaryUrdu:
      'اینٹی ٹیرورزم ایکٹ 1997 خصوصی اینٹی ٹیرورزم کورٹس (ATCs) قائم کرتا ہے اور دہشت گردی، دہشت گردانہ acts اور انتہا پسندانہ acts کی تعریف کرتا ہے، سخت طریقہ کار اور سخت سزاؤں کے ساتھ۔',
    gazetteReference: 'Act XXVII of 1997',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Individuals', 'Lawyers', 'Security Agencies'],
    sections: [
      { sectionNumber: '6', title: 'Definition of terrorism', content: 'In this Act, "terrorism" means the use or threat of action designed to coerce the Government or intimidate the public or a section of the public, where the use or threat is designed to advance a religious, sectarian or ethnic cause.', contentUrdu: 'اس ایکٹ میں "دہشت گردی" کا مطلب ایسا عمل یا اس کی دھمکی ہے جس کا مقصد حکومت یا عوام کو دبانا ہو، مذہبی، فرقہ وارانہ یا نسلی مقصد کے لیے۔' },
      { sectionNumber: '7', title: 'Punishment for terrorism', content: 'A person who commits a terrorist act shall be liable to punishment which may include death, imprisonment for life, or imprisonment for up to twenty years, and fine.', contentUrdu: 'دہشت گردانہ عمل کرنے والا موت، قیدِ بامشقت، یا بیس سال تک قید اور جرمانے کا مستحق ہوگا۔' },
      { sectionNumber: '14', title: 'Anti-Terrorism Courts', content: 'The Federal Government shall establish Anti-Terrorism Courts for the trial of terrorist cases, with judges appointed by the Federal Government in consultation with the Chief Justice of the relevant High Court.', contentUrdu: 'وفاقی حکومت دہشت گردی کے مقدمات کے لیے خصوصی کورٹس قائم کرے گی۔' },
    ],
    amendments: [
      { amendmentYear: 1999, amendmentTitle: 'ATC jurisdiction expansion', description: 'Schedule expanded to include more serious offences.', gazetteReference: 'Ordinance XIII of 1999' },
      { amendmentYear: 2014, amendmentTitle: '21st Constitutional Amendment compliance', description: 'Amendments to allow trial of hardcore terrorists in military courts during the war on terror.', gazetteReference: 'Act I of 2015' },
    ],
  },
  {
    title: 'Hudood Ordinances 1979',
    titleUrdu: 'حدود آرڈیننس 1979',
    slug: 'hudood-ordinances-1979',
    categorySlug: 'criminal-law',
    yearEnacted: 1979,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'A set of five ordinances promulgated by General Zia-ul-Haq in 1979 to bring criminal law in line with Islamic Sharia. They cover offences against property (theft, robbery), prohibition (alcohol, drugs), zina (rape/adultery), qazf (false accusation of zina), and whipped punishments.',
    summaryUrdu:
      'پانچ آرڈیننس جو 1979 میں جنرل ضیاء الحق نافذ کیے تاکہ فوجداری قانون کو اسلامی شریعت کے مطابق کیا جائے۔ چوری، شراب، زنا، قذف اور حدود کی سزاؤں پر مشتمل ہیں۔',
    gazetteReference: 'Ordinance VI of 1979 (and companion ordinances)',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Individuals', 'Lawyers', 'Religious Scholars'],
    sections: [
      { sectionNumber: '15', title: 'Sariqah (theft) — amputation', content: 'Whoever commits sariqah of property valuing not less than the nisab shall be liable to amputation of the right hand from the joint of the wrist.', contentUrdu: 'جو کوئی نصاب کے برابر یا اس سے زیادہ مال کی ساریقہ کرے، اس کا دایاں ہاتھ کلائی سے کاٹ دیا جائے گا۔' },
      { sectionNumber: '8', title: 'Zina — punishment for married offender (rajm)', content: 'A married offender convicted of zina shall be stoned to death at a public place.', contentUrdu: 'شادی شدہ مجرم، اگر زنا کا قصوروار ثابت ہو، عوامی جگہ پر سنگسار کر کے موت کی سزا پائے گا۔' },
    ],
    amendments: [
      { amendmentYear: 2006, amendmentTitle: 'Protection of Women Act', description: 'Zina cases moved from Hudood to ordinary criminal courts; rape redefined.', gazetteReference: 'Act VIII of 2006' },
    ],
  },
  {
    title: 'Control of Narcotic Substances Act 1997',
    titleUrdu: 'منشیات کنٹرول ایکٹ 1997',
    slug: 'control-of-narcotic-substances-act-1997',
    categorySlug: 'criminal-law',
    yearEnacted: 1997,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Consolidates and amends the law relating to narcotic substances. Defines offences related to cultivation, production, manufacture, trafficking and abuse of narcotics. Establishes special courts and sets severe punishments including life imprisonment and the death penalty for large-scale smuggling.',
    summaryUrdu:
      'منشیات سے متعلق قانون کا اختصاص۔ منشیات کی کاشت، پیداوار، اسمگلنگ اور استعمال سے متعلق جرائم کی تعریف اور سخت سزاؤں کا تعین۔',
    gazetteReference: 'Act XX of 1997',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Individuals', 'Lawyers', 'ANF'],
    sections: [
      { sectionNumber: '9', title: 'Punishment for trafficking', content: 'Whoever contravenes the provisions of section 6 or 7 shall be punishable with death or imprisonment for life or imprisonment for up to fourteen years and shall also be liable to fine.', contentUrdu: 'جو کوئی منشیات کی اسمگلنگ کرے، وہ موت، قیدِ بامشقت یا چودہ سال تک قید اور جرمانے کا مستحق ہوگا۔' },
    ],
    amendments: [],
  },
  {
    title: 'Prevention of Electronic Crimes Act 2016 (PECA)',
    titleUrdu: 'پری وینشن آف الیکٹرانک کرائمز ایکٹ 2016 (PECA)',
    slug: 'prevention-of-electronic-crimes-act-2016',
    categorySlug: 'cyber-it-law',
    yearEnacted: 2016,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'PECA 2016 is Pakistan\'s principal cybercrime law. It criminalizes unauthorized access to information systems, cyber terrorism, electronic fraud, identity theft, cyber-stalking, hate speech online, and child pornography. Establishes the Federal Investigation Agency (FIA) Cyber Crime Wing as the primary enforcement body.',
    summaryUrdu:
      'PECA 2016 پاکستان کا بنیادی سائبر کرائم قانون ہے۔ یہ معلومات کے نظام تک غیر مجاز رسائی، سائبر دہشت گردی، الیکٹرانک فراڈ، شناخت کی چوری، سائبر اسٹاکنگ، آن لائن نفرت کی تقریر اور بچوں کی فحشیت کو جرم قرار دیتا ہے۔',
    gazetteReference: 'Act XL of 2016',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Individuals', 'Businesses', 'IT Professionals', 'Social Media Users'],
    sections: [
      { sectionNumber: '3', title: 'Unauthorized access to information systems', content: 'Whoever with dishonest intention gains unauthorized access to any information system or data shall be punished with imprisonment for a term which may extend to three months or with fine up to fifty thousand rupees or with both.', contentUrdu: 'جو کوئی بے ایمانی سے کسی معلوماتی نظام یا ڈیٹا تک غیر مجاز رسائی حاصل کرے وہ تین ماہ تک قید یا پچاس ہزار روپے تک جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
      { sectionNumber: '4', title: 'Unauthorized copying or transfer of data', content: 'Whoever with dishonest intention copies or transfers data shall be punished with imprisonment for up to six months or fine up to one hundred thousand rupees or both.', contentUrdu: 'جو کوئی بے ایمانی سے ڈیٹا کاپی یا منتقل کرے وہ چھ ماہ تک قید یا ایک لاکھ روپے تک جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
      { sectionNumber: '10', title: 'Cyber terrorism', content: 'Whoever commits cyber terrorism shall be punished with imprisonment for up to fourteen years or fine up to fifty million rupees or both.', contentUrdu: 'جو کوئی سائبر دہشت گردی کرے وہ چودہ سال تک قید یا پانچ کروڑ روپے تک جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
      { sectionNumber: '13', title: 'Electronic forgery', content: 'Whoever commits electronic forgery shall be punished with imprisonment for up to three years or fine up to three hundred thousand rupees or both.', contentUrdu: 'جو کوئی الیکٹرانک جعلی کاری کرے وہ تین سال تک قید یا تین لاکھ روپے تک جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
      { sectionNumber: '16', title: 'Cyber stalking (including women)', content: 'Whoever commits cyber stalking shall be punished with imprisonment for up to three years or fine up to one million rupees or both; if victim is a minor, up to seven years or fine up to ten million rupees.', contentUrdu: 'جو کوئی سائبر اسٹاکنگ کرے وہ تین سال تک قید یا دس لاکھ روپے تک جرمانے یا دونوں سزاؤں کا مستحق ہوگا؛ اگر متاثرہ نابالغ ہو تو سات سال تک قید۔' },
      { sectionNumber: '17', title: 'Spreading hate speech online', content: 'Whoever prepares or disseminates electronic content that advances religious, sectarian or ethnic hate shall be punished with imprisonment for up to seven years or fine up to ten million rupees or both.', contentUrdu: 'جو کوئی مذہبی، فرقہ وارانہ یا نسلی نفرت بھرا مواد پھیلائے وہ سات سال تک قید یا ایک کروڑ روپے تک جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
      { sectionNumber: '20', title: 'Offence against the dignity of a person (defamation)', content: 'Whoever intentionally and publicly insults another person through an information system shall be punished with imprisonment for up to two years or fine up to one million rupees or both.', contentUrdu: 'جو کوئی کسی شخص کی تذلیل جان بوجھ کر پبلک پلیٹ فارم پر کرے وہ دو سال تک قید یا دس لاکھ روپے تک جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
      { sectionNumber: '22', title: 'Child pornography', content: 'Whoever commits child pornography shall be punished with imprisonment for up to seven years or fine up to ten million rupees or both.', contentUrdu: 'جو کوئی بچوں کی فحش نگاری کرے وہ سات سال تک قید یا ایک کروڑ روپے تک جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [
      { amendmentYear: 2022, amendmentTitle: 'PECA Amendment Ordinance', description: 'Created the Federal Investigation Agency (FIA) tribunals and a digital rights agency for content regulation; widely criticized.', gazetteReference: 'Ordinance I of 2022' },
      { amendmentYear: 2023, amendmentTitle: 'Restoration & revision of Section 20', description: 'Section 20 (defamation) restored after Supreme Court ruling; safeguards for journalists added.', gazetteReference: 'Act II of 2023' },
    ],
  },
  {
    title: 'Electronic Transactions Ordinance 2002',
    titleUrdu: 'الیکٹرانک ٹرانزیکشنز آرڈیننس 2002',
    slug: 'electronic-transactions-ordinance-2002',
    categorySlug: 'cyber-it-law',
    yearEnacted: 2002,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Recognizes and validates electronic documents, contracts, signatures, and payments. Establishes the legal framework for e-commerce, electronic record-keeping and digital signatures in Pakistan. Initially an ordinance, made permanent by the federal legislature.',
    summaryUrdu:
      'الیکٹرانک دستاویزات، معاہدوں، دستخط اور ادائیگیوں کو قانونی حیثیت دیتا ہے۔ ای کامرس، الیکٹرانک ریکارڈ اور ڈیجیٹل دستخط کا قانونی فریم ورک مقرر کرتا ہے۔',
    gazetteReference: 'Ordinance LXXVIII of 2002',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Businesses', 'E-commerce', 'Banks', 'Individuals'],
    sections: [
      { sectionNumber: '13', title: 'Recognition of electronic documents', content: 'Where any law requires information or any other matter to be in writing, in typewritten or printed form, then notwithstanding anything contained in such law, such requirement shall be deemed to have been satisfied where such information or matter is rendered or made available in an electronic form and is accessible so as to be usable for a subsequent reference.', contentUrdu: 'جہاں کسی قانون کے تحت تحریری شکل کی شرط ہو، وہ الیکٹرانک شکل میں بھی پوری ہو گی، اگر وہ بعد میں دستیاب ہو۔' },
      { sectionNumber: '28', title: 'Electronic signatures', content: 'Where any law requires a signature, an electronic signature shall be deemed to satisfy that requirement.', contentUrdu: 'جہاں دستخط کی شرط ہو، وہ الیکٹرانک دستخط سے پوری ہو گی۔' },
      { sectionNumber: '35', title: 'Recognition of electronic contracts', content: 'A contract shall not be denied legal effect, validity or enforceability merely on the ground that it is in electronic form.', contentUrdu: 'کوئی معاہدہ صرف اس بنیاد پر قانونی حیثیت سے انکار نہیں ہوگا کہ وہ الیکٹرانک شکل میں ہے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Personal Data Protection Bill 2023',
    titleUrdu: 'ذاتی ڈیٹا پروٹیکشن بل 2023',
    slug: 'personal-data-protection-bill-2023',
    categorySlug: 'cyber-it-law',
    yearEnacted: 2023,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Draft legislation (in 2023 form) to regulate the processing, storage and international transfer of personal data of Pakistani citizens. Establishes the National Commission for Personal Data Protection and mandates data controller obligations, consent requirements and breach notification.',
    summaryUrdu:
      'پاکستانی شہریوں کے ذاتی ڈیٹا کی پروسیسنگ، ذخیرہ کاری اور بین الاقوامی منتقلی کو منظم کرنے کا مسودہ۔ نیشنل کمیشن برائے ذاتی ڈیٹا پروٹیکشن قائم کرتا ہے۔',
    gazetteReference: 'Bill introduced 2023',
    promulgatingAuthority: 'Ministry of IT & Telecom',
    applicabilityTags: ['Businesses', 'IT Professionals', 'Individuals'],
    sections: [
      { sectionNumber: '9', title: 'Lawful basis for processing', content: 'A data controller may process personal data only if at least one of the lawful bases applies: consent, contract, legal obligation, vital interests, public task, or legitimate interests.', contentUrdu: 'ڈیٹا کنٹرولر صرف اس صورت میں ذاتی ڈیٹا پراسیس کر سکتا ہے جب آٹھ میں سے کوئی ایک قانونی بنیاد موجود ہو۔' },
      { sectionNumber: '18', title: 'Breach notification', content: 'In the event of a personal data breach, the data controller shall, within 72 hours, notify the Commission and the affected data subjects.', contentUrdu: 'ذاتی ڈیٹا کی خلاف ورزی کی صورت میں ڈیٹا کنٹرولر 72 گھنٹوں کے اندر کمیشن اور متاثرہ افراد کو مطلع کرے۔' },
    ],
    amendments: [],
  },
  {
    title: 'National Cyber Security Policy 2021',
    titleUrdu: 'نیشنل سائبر سیکیورٹی پالیسی 2021',
    slug: 'national-cyber-security-policy-2021',
    categorySlug: 'cyber-it-law',
    yearEnacted: 2021,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Policy framework (not strictly a statute) for protecting Pakistan\'s cyberspace, critical information infrastructure, and digital economy. Mandates sectoral CERTs, incident reporting, capacity building and international cooperation on cyber threats.',
    summaryUrdu:
      'پاکستان کے سائبر اسپیس، اہم معلوماتی انفراسٹرکچر اور ڈیجیٹل اکنومی کے تحفظ کا پالیسی فریم ورک۔ سیکٹرل CERTs، واقعات کی اطلاع، اور بین الاقوامی تعاون کی ہدایت کرتا ہے۔',
    gazetteReference: 'MoITT Notification 2021',
    promulgatingAuthority: 'Ministry of IT & Telecom',
    applicabilityTags: ['Government', 'Businesses', 'IT Professionals'],
    sections: [
      { sectionNumber: '5.1', title: 'Governance', content: 'Establishment of Cyber Governance Committee chaired by the Prime Minister to oversee national cyber security posture.', contentUrdu: 'وزیر اعظم کی سربراہی میں سائبر گورننس کمیٹی قائم کرنا۔' },
    ],
    amendments: [],
  },
  {
    title: 'Right to Access to Information Act 2017',
    titleUrdu: 'حقِ رسائی معلومات ایکٹ 2017',
    slug: 'right-to-access-to-information-act-2017',
    categorySlug: 'cyber-it-law',
    yearEnacted: 2017,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Grants citizens the right to obtain information from public bodies, with limited exemptions. Establishes the Federal Information Commission. Supports transparency and accountability of government data and decisions.',
    summaryUrdu:
      'شہریوں کو حکومتی اداروں سے معلومات حاصل کرنے کا حق دیتا ہے، مخصوص استثنا کے ساتھ۔ وفاقی معلومات کمیشن قائم کرتا ہے۔',
    gazetteReference: 'Act XXVI of 2017',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Individuals', 'Journalists', 'Civil Society'],
    sections: [
      { sectionNumber: '5', title: 'Right of access to information', content: 'Every citizen shall have the right to obtain information from a public body, subject to reasonable restrictions.', contentUrdu: 'ہر شہری کو کسی پبلک باڈی سے معلومات حاصل کرنے کا حق ہوگا، مناسب پابندیوں کے تابع۔' },
    ],
    amendments: [],
  },

  // ===================== FAMILY LAW =====================
  {
    title: 'Muslim Family Laws Ordinance 1961',
    titleUrdu: 'مسلم فیملی لاز آرڈیننس 1961',
    slug: 'muslim-family-laws-ordinance-1961',
    categorySlug: 'family-law',
    yearEnacted: 1961,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'The most important family law statute for Muslims in Pakistan. Regulates marriage registration (nikahnama), polygamy (requiring arbitration council permission), talaq procedure (90-day notice period), inheritance of orphans, and dower (haq mehr).',
    summaryUrdu:
      'پاکستان کے مسلمانوں کے لیے سب سے اہم خاندانی قانون۔ نکاح کی رجسٹری، ایک سے زیادہ شادیاں، طلاق کا طریقہ، یتیموں کی وراثت اور مہر کو منظم کرتا ہے۔',
    gazetteReference: 'Ordinance VIII of 1961',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Individuals', 'Muslim Families', 'Lawyers', 'Nikah Registrars'],
    sections: [
      { sectionNumber: '3', title: 'Registration of marriage', content: 'Every marriage solemnized under Muslim Law shall be registered in accordance with the provisions of this Ordinance. Failure to register does not invalidate the marriage but is punishable.', contentUrdu: 'مسلم قانون کے تحت ہونے والی ہر شادی کو رجسٹر کیا جائے۔ غیر رجسٹری شادی کالعدم نہیں ہوتی مگر قابل سزا ہے۔' },
      { sectionNumber: '4', title: 'Polygamy (second marriage)', content: 'No man, during the subsistence of an existing marriage, shall contract another marriage except with the prior permission in writing of the Arbitration Council. Violation is punishable with simple imprisonment up to one year and fine.', contentUrdu: 'کوئی مرد، پہلی بیوی کے زندہ رہتے ہوئے، پہلے سے رضا مندی کونسل کی تحریری اجازت کے بغیر دوسری شادی نہیں کر سکتا۔ خلاف ورزی ایک سال تک قید اور جرمانے کی سزا رکھتی ہے۔' },
      { sectionNumber: '7', title: 'Talaq (divorce by husband)', content: 'Any man who wishes to divorce his wife shall, as soon as may be after pronouncement of talaq, give the Chairman of the Union Council notice in writing of his having done so, and shall supply a copy thereof to the wife. Ninety days shall expire before the talaq takes effect, unless the wife is pregnant.', contentUrdu: 'طلاق کے بعد شوہر کو یونین کونسل کے چیئرمین کو تحریری اطلاع دینی ہوگی، اور بیوی کو کاپی فراہم کرنا ہوگی۔ نواحی دن گزرنے کے بعد طلاق نافذ ہو گی، جب تک عورت حاملہ نہ ہو۔' },
      { sectionNumber: '8', title: 'Dower (mahr)', content: 'Where, in any case, the dower has not been fixed at the time of the marriage, it shall be presumed to have been fixed at the proper rate, having regard to the status of the parties.', contentUrdu: 'جہاں نکاح کے وقت مہر مقرر نہ ہو، فریقین کے رتبے کے لحاظ سے مناسب مہر مقرر سمجھا جائے گا۔' },
    ],
    amendments: [
      { amendmentYear: 2015, amendmentTitle: 'Punjab amendment on khula', description: 'Provincial amendments to simplify khula procedure in family courts.', gazetteReference: 'Punjab Act' },
    ],
  },
  {
    title: 'Family Courts Act 1964',
    titleUrdu: 'فیملی کورٹس ایکٹ 1964',
    slug: 'family-courts-act-1964',
    categorySlug: 'family-law',
    yearEnacted: 1964,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Establishes Family Courts to adjudicate disputes related to marriage, dower, maintenance, divorce, khula, restitution of conjugal rights, and custody of children. Aimed at simplifying and expediting family justice.',
    summaryUrdu:
      'فیملی کورٹس قائم کرتا ہے جو نکاح، مہر، نان نفقہ، طلاق، خلع، اور بچوں کی حضانت کے تنازعات کا فیصلہ کرتی ہیں۔',
    gazetteReference: 'Act XXXV of 1964',
    promulgatingAuthority: 'National Assembly of Pakistan',
    applicabilityTags: ['Lawyers', 'Judges', 'Individuals'],
    sections: [
      { sectionNumber: '4', title: 'Jurisdiction of Family Courts', content: 'A Family Court shall have exclusive jurisdiction over matters relating to dissolution of marriage, dower, maintenance, restitution of conjugal rights, custody of children, and guardianship.', contentUrdu: 'فیملی کورٹ کا خصوصی اختیار طلاق، مہر، نان نفقہ، مراجعت، بچوں کی حضانت اور ولایت کے معاملات پر ہے۔' },
      { sectionNumber: '10', title: 'Pre-trial reconciliation', content: 'Before framing issues, the Court shall attempt reconciliation between the parties. If reconciliation fails, the Court shall proceed with the case.', contentUrdu: 'مسائل کی تشکیل سے پہلے عدالت فریقین میں مصالحت کی کوشش کرے گی۔ اگر ناکام ہو تو مقدمہ آگے بڑھائے گی۔' },
      { sectionNumber: '14', title: 'Khula (judicial divorce on wife\'s request)', content: 'The wife may seek khula from the Family Court if she is willing to return the dower. The Court shall, after due proceedings, dissolve the marriage.', contentUrdu: 'بیوی مہر واپس کرنے کی پیشکش پر فیملی کورٹ سے خلع طلب کر سکتی ہے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Guardian and Wards Act 1890',
    titleUrdu: 'گارڈین اینڈ وارڈز ایکٹ 1890',
    slug: 'guardian-and-wards-act-1890',
    categorySlug: 'family-law',
    yearEnacted: 1890,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Governs the appointment and removal of guardians for minors and their property. Best interest of the child is the paramount consideration. Distinguishes between guardian of the person (custody) and guardian of the property.',
    summaryUrdu:
      'نابالغوں اور ان کی جائداد کے سرپرستوں کی تقرری اور برخاستگی کو منظم کرتا ہے۔ بچے کی بہترین دلچسپی بنیادی خیال ہے۔',
    gazetteReference: 'Act XII of 1890',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Lawyers', 'Parents', 'Judges'],
    sections: [
      { sectionNumber: '17', title: 'Appointed guardian\'s powers', content: 'A guardian appointed by will has power over the person of the minor, including maintenance, education and custody.', contentUrdu: 'وصیت کے تحت مقرر سرپرست کا اختیار نابالغ کی پرورش، تعلیم اور حضانت پر ہے۔' },
      { sectionNumber: '25', title: 'Guardianship of minor\'s person', content: 'Where the Court is satisfied that it is necessary for the welfare of the minor to appoint a guardian, it may do so, and may remove an existing guardian whose conduct is contrary to the welfare of the minor.', contentUrdu: 'عدالت نابالغ کی بھلائی کے لیے سرپرست مقرر یا برخاست کر سکتی ہے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Child Marriage Restraint Act 1929',
    titleUrdu: 'چائلڈ میریج ریسترینٹ ایکٹ 1929',
    slug: 'child-marriage-restraint-act-1929',
    categorySlug: 'family-law',
    yearEnacted: 1929,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Restricts marriage of minors. Originally set minimum ages at 18 for boys and 14 for girls; in Sindh, amended to 18 for both. Other provinces retain 18/16. Penalties include imprisonment up to one month and fine.',
    summaryUrdu:
      'نابالغوں کی شادی پر پابندی لگاتا ہے۔ صوبہ سندھ میں دونوں جنسوں کے لیے 18 سال مقرر؛ دیگر صوبوں میں لڑکوں کے لیے 18 اور لڑکیوں کے لیے 16۔',
    gazetteReference: 'Act XIX of 1929',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Parents', 'Individuals', 'NGOs'],
    sections: [
      { sectionNumber: '4', title: 'Punishment for male adult above 18 marrying a child', content: 'Whoever, being a male above eighteen years of age, contracts child marriage shall be punishable with simple imprisonment up to one month, or fine up to one thousand rupees, or both.', contentUrdu: 'اٹھارہ سال سے زیادہ عمر کا لڑکا جو بچوں کی شادی کرے وہ ایک ماہ تک قید یا ہزار روپے جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
      { sectionNumber: '5', title: 'Punishment for solemnizing a child marriage', content: 'Whoever performs, conducts or directs any ceremony for child marriage shall be punishable with simple imprisonment up to one month, or fine, or both.', contentUrdu: 'جو کوئی بچوں کی شادی کی رسم ادا کرے وہ ایک ماہ تک قید یا جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [
      { amendmentYear: 2014, amendmentTitle: 'Sindh Child Marriage Restraint Act', description: 'Sindh raised the minimum age to 18 for both genders; the provincial law overrides the federal Act for Sindh.', gazetteReference: 'Sindh Act' },
    ],
  },
  {
    title: 'Dissolution of Muslim Marriages Act 1939',
    titleUrdu: 'ڈائیلیوشن آف مسلم میریجز ایکٹ 1939',
    slug: 'dissolution-of-muslim-marriages-act-1939',
    categorySlug: 'family-law',
    yearEnacted: 1939,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Enumerates the grounds on which a Muslim woman may seek judicial divorce (faskh) through the court, including husband\'s disappearance, imprisonment, failure to maintain, cruelty, desertion, and impotency. Predates the khula procedure under the Family Courts Act.',
    summaryUrdu:
      'مسلم عورت کے ان بنیادوں کی فہرست دیتا ہے جن کی بنیاد پر وہ عدالت کے ذریعے فسخ نکاح حاصل کر سکتی ہے — شوہر کا لاپتہ ہونا، قید، نان نفقہ نہ دینا، ظلم، ترک، اور نامردی۔',
    gazetteReference: 'Act VIII of 1939',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Muslim Women', 'Lawyers', 'Judges'],
    sections: [
      { sectionNumber: '2', title: 'Grounds for decree', content: 'A woman married under Muslim Law shall be entitled to obtain a decree for dissolution of marriage on any of the following grounds: (i) whereabouts of husband unknown for four years; (ii) husband sentenced to imprisonment for seven years or upward; (iii) husband failing to provide maintenance for two years; (iv) husband insane for two years; (v) husband impotent; (vi) cruelty; (vii) any other ground recognized under Muslim Law.', contentUrdu: 'مسلم عورت مندرجہ ذیل بنیادوں پر فسخ نکاح حاصل کر سکتی ہے: شوہر کا چار سال لاپتہ ہونا، سات سال قید، دو سال نان نفقہ نہ دینا، دو سال دیوانگی، نامردی، ظلم، یا مسلم قانون کے تحت کوئی اور بنیاد۔' },
    ],
    amendments: [],
  },
  {
    title: 'Enforcement of Muslim Family Laws Ordinance Rules 1961',
    titleUrdu: 'مسلم فیملی لاز آرڈیننس رولز 1961',
    slug: 'enforcement-of-muslim-family-laws-rules-1961',
    categorySlug: 'family-law',
    yearEnacted: 1961,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'The Rules made under the Muslim Family Laws Ordinance. Prescribe the nikahnama form (Form I, Form II, etc.), the procedure for talaq notices, Arbitration Council constitution, and maintenance calculation.',
    summaryUrdu:
      'مسلم فیملی لاز آرڈیننس کے تحت مرتب کردہ رولز — نکاح نامہ فارم، طلاق اطلاع کا طریقہ، ثالثی کونسل اور نان نفقہ کا حساب مقرر کرتے ہیں۔',
    gazetteReference: 'S.R.O. 2487(K)/61',
    promulgatingAuthority: 'Government of Pakistan',
    applicabilityTags: ['Nikah Registrars', 'Union Councils', 'Lawyers'],
    sections: [
      { sectionNumber: 'Rule 5', title: 'Nikahnama form', content: 'The nikahnama shall be in the form prescribed as Form I, with seven copies distributed to parties, Chairman Union Council, etc.', contentUrdu: 'نکاح نامہ فارم I کی شکل میں ہو گا، سات کاپیاں فریقین اور یونین کونسل کو دے دی جائیں گی۔' },
    ],
    amendments: [],
  },
  {
    title: 'Hindu Marriage Act 2017',
    titleUrdu: 'ہندو میریج ایکٹ 2017',
    slug: 'hindu-marriage-act-2017',
    categorySlug: 'family-law',
    yearEnacted: 2017,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Provides the first formal legal framework for the registration and dissolution of Hindu marriages in Pakistan. Allows Hindu women to seek divorce on grounds of cruelty, desertion, conversion, or impotency. Codifies marriage conditions.',
    summaryUrdu:
      'پاکستان میں ہندو شادیوں کی رجسٹری اور تحلیل کا پہلا باقاعدہ قانونی فریم ورک۔ ہندو خواتین کو ظلم، ترک، تبدیلی مذہب یا نامردی کی بنیاد پر طلاق طلب کرنے کا حق دیتا ہے۔',
    gazetteReference: 'Act XIII of 2017',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Hindu Community', 'Lawyers'],
    sections: [
      { sectionNumber: '5', title: 'Conditions for marriage', content: 'A marriage between two Hindus shall be solemnized if neither party has a spouse living at the time of marriage; both are of sound mind and capable of valid consent.', contentUrdu: 'دو ہندوں کے درمیان شادی اس وقت ہو گی جب فریقین میں سے کسی کا پہلے سے شوہر/بیوی زندہ نہ ہو اور دونوں صحت مند دماغ ہوں۔' },
      { sectionNumber: '12', title: 'Right of wife to separate residence and maintenance', content: 'Where the husband is guilty of cruel treatment, the wife may obtain a decree for separate residence and maintenance.', contentUrdu: 'اگر شوہر ظلم کرے تو بیوی الگ رہائش اور نان نفقہ کا حکم حاصل کر سکتی ہے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Christian Marriage Act 1872',
    titleUrdu: 'کرسچن میریج ایک 1872',
    slug: 'christian-marriage-act-1872',
    categorySlug: 'family-law',
    yearEnacted: 1872,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Colonial-era statute that governs the solemnization of Christian marriages in Pakistan. Requires presence of a licensed minister and registration. Recently supplemented by the Christian Marriage and Divorce (Amendment) Act 2025 for divorce procedures.',
    summaryUrdu:
      'برطانوی دور کا قانون جو پاکستان میں کرسچن شادیوں کی رسم کو منظم کرتا ہے۔ لائسنس یافتہ پادری اور رجسٹری لازم ہے۔',
    gazetteReference: 'Act V of 1872',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Christian Community', 'Priests', 'Lawyers'],
    sections: [
      { sectionNumber: '4', title: 'License to solemnize marriages', content: 'Marriages may be solemnized only by a person licensed under this Act, or by a clergyman of the Church of Scotland, or by a Minister of Religion.', contentUrdu: 'شادیاں صرف اس ایکٹ کے تحت لائسنس یافتہ شخص یا چرچ آف اسکاٹ لینڈ کے پادری یا مذہبی وزیر کر سکتے ہیں۔' },
    ],
    amendments: [
      { amendmentYear: 2025, amendmentTitle: 'Christian Marriage and Divorce Amendment Act', description: 'Streamlined divorce procedures for Christian couples; replaced earlier colonial procedure.', gazetteReference: 'Act of 2025' },
    ],
  },

  // ===================== LABOR & EMPLOYMENT =====================
  {
    title: 'Industrial Relations Act 2012',
    titleUrdu: 'انڈسٹریل ریلیشنز ایکٹ 2012',
    slug: 'industrial-relations-act-2012',
    categorySlug: 'labor-employment-law',
    yearEnacted: 2012,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Consolidates and amends the law relating to trade unions, collective bargaining, strikes and dispute resolution between workers and employers in the Islamabad Capital Territory. Provides for the National Industrial Relations Commission (NIRC).',
    summaryUrdu:
      'ٹریڈ یونین، اجتماعی سودے بازی، ہڑتال اور مزدور و آجر کے درمیان تنازعات کے قانون کا اختصاص۔ این آئی آر سی قائم کرتا ہے۔',
    gazetteReference: 'Act XLI of 2012',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Workers', 'Employers', 'Trade Unions', 'HR Professionals'],
    sections: [
      { sectionNumber: '13', title: 'Right to form trade union', content: 'Every worker has the right to form or become a member of a trade union and to engage in collective bargaining.', contentUrdu: 'ہر مزدور کو ٹریڈ یونین بنانے یا اس کا رکن بننے اور اجتماعی سودے بازی میں حصہ لینے کا حق ہے۔' },
      { sectionNumber: '25', title: 'Collective bargaining agent', content: 'A trade union representing at least 51% of the workers in an establishment shall be the collective bargaining agent for that establishment.', contentUrdu: 'جس ٹریڈ یونین کی نمائندگی 51% یا اس سے زائد ہو وہ اجتماعی سودے کار بنے گی۔' },
      { sectionNumber: '35', title: 'Conciliation of disputes', content: 'Where an industrial dispute arises, the parties shall attempt conciliation; failing which, the dispute may be referred to the Labour Court.', contentUrdu: 'صنعتی تنازعہ کی صورت میں فریقین مصالحت کی کوشش کریں؛ ناکامی پر لیبر کورٹ سے رجوع کریں۔' },
    ],
    amendments: [],
  },
  {
    title: 'Factories Act 1934',
    titleUrdu: 'فیکٹریز ایکٹ 1934',
    slug: 'factories-act-1934',
    categorySlug: 'labor-employment-law',
    yearEnacted: 1934,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Regulates working conditions in factories: working hours (max 9/day, 48/week), rest intervals, weekly holidays, overtime, leave with wages, occupational safety, child labour and women\'s labour restrictions.',
    summaryUrdu:
      'فیکٹریوں میں کام کے حالات کو منظم کرتا ہے: کام کے اوقات، آرام کے وقفے، ہفتہ وار چھٹیاں، اوور ٹائم، تنخواہ کے ساتھ چھٹی، پیشہ ورانہ تحفظ اور بچوں و خواتین کے کام پر پابندیاں۔',
    gazetteReference: 'Act XXV of 1934',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Workers', 'Factory Owners', 'Inspectors'],
    sections: [
      { sectionNumber: '34', title: 'Weekly holidays', content: 'No adult worker shall be required or allowed to work in a factory for more than six days in any week; every worker shall be given a holiday of one whole day in every week.', contentUrdu: 'کوئی بالغ مزدور ہفتے میں چھ دن سے زیادہ فیکٹری میں کام نہ کرے؛ ہر مزدور کو ہفتے میں ایک پورا دن چھٹی ملے۔' },
      { sectionNumber: '36', title: 'Working hours for adults', content: 'No adult worker shall be required or allowed to work in a factory for more than nine hours in any day or forty-eight hours in any week.', contentUrdu: 'کوئی بالغ مزدور ایک دن میں نو گھنٹے یا ہفتے میں اڑتالیس گھنٹے سے زیادہ نہ کام کرے۔' },
      { sectionNumber: '51', title: 'Prohibition of child labour', content: 'No child who has not completed his fourteenth year shall be allowed to work in any factory.', contentUrdu: 'چودہ سال مکمل نہ کرنے والا بچہ فیکٹری میں کام نہ کر سکے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Payment of Wages Act 1936',
    titleUrdu: 'پیمنٹ آف ویجز ایکٹ 1936',
    slug: 'payment-of-wages-act-1936',
    categorySlug: 'labor-employment-law',
    yearEnacted: 1936,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Ensures timely payment of wages to workers employed in factories and railways. Mandates wage payment within 7 days (for fewer than 1000 workers) or 10 days (for larger establishments). Restricts wage deductions.',
    summaryUrdu:
      'فیکٹریوں اور ریلوے میں کام کرنے والوں کو وقت پر تنخواہ کی ادائیگی یقینی بناتا ہے۔ ادائیگی کا وقت 7 یا 10 دن مقرر۔',
    gazetteReference: 'Act IV of 1936',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Workers', 'Employers', 'HR'],
    sections: [
      { sectionNumber: '5', title: 'Time of payment of wages', content: 'The wages of every person employed in a factory employing less than one thousand persons shall be paid before the expiry of the seventh day after the last day of the wage period.', contentUrdu: 'ایک ہزار سے کم مزدور والی فیکٹری میں تنخواہ ساتویں دن تک ادا کی جائے۔' },
      { sectionNumber: '7', title: 'Deductions', content: 'Deductions may be made only on grounds prescribed: fines, absence, damage, recovery of advances, income tax, etc. Total deductions shall not exceed 50% of wages (75% when payments to cooperative societies are involved).', contentUrdu: 'کٹوتیاں صرف مخصوص بنیادوں پر ہوں، اور کل کٹوتیاں 50% سے زیادہ نہ ہوں۔' },
    ],
    amendments: [],
  },
  {
    title: 'Employees\' Old-Age Benefits Institution Act 1976 (EOBI)',
    titleUrdu: 'ایمپلویز اولڈ ایج بینیفٹس ایکٹ 1976 (EOBI)',
    slug: 'eobi-act-1976',
    categorySlug: 'labor-employment-law',
    yearEnacted: 1976,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Establishes EOBI to provide old-age pensions, invalidity pensions and survivors\' pensions to workers in the formal sector. Both employer and employee contribute to the EOBI fund.',
    summaryUrdu:
      'EOBI قائم کرتا ہے جو رسمی شعبے کے مزدوروں کو بڑھاپے کی پنشن، معذوری کی پنشن اور ورثاء کی پنشن فراہم کرتا ہے۔',
    gazetteReference: 'Act XIV of 1976',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Workers', 'Employers', 'HR', 'Accountants'],
    sections: [
      { sectionNumber: '6', title: 'Insured person contributions', content: 'Every employer in respect of every person in his insurable employment shall pay a monthly contribution equal to 5% of the wages; the employee shall pay 1% of wages; the Federal Government contributes a matching amount.', contentUrdu: 'ہر آجر اجرت کا 5% ماہانہ بطور شراکت ادا کرے؛ مزدور 1% ادا کرے؛ وفاقی حکومت بھی مساوی رقم ادا کرے۔' },
      { sectionNumber: '22-B', title: 'Old-age pension', content: 'An insured person who has attained the age of retirement (60 years male / 55 years female) and has paid contributions for at least 15 years shall be entitled to an old-age pension.', contentUrdu: 'ریٹائرمنٹ کی عمر کو پہنچنے والا اور 15 سال کی شراکت کرنے والا بیمہ شدہ بڑھاپے کی پنشن کا مستحق ہوگا۔' },
    ],
    amendments: [
      { amendmentYear: 2005, amendmentTitle: 'EOBI Amendment Act', description: 'Raised minimum pension amount and redefined insurable employment.', gazetteReference: 'Act V of 2005' },
    ],
  },
  {
    title: 'Minimum Wages Ordinance 1961',
    titleUrdu: 'مینی مم ویجز آرڈیننس 1961',
    slug: 'minimum-wages-ordinance-1961',
    categorySlug: 'labor-employment-law',
    yearEnacted: 1961,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Provides for the fixation of minimum wages for workers in certain industrial and commercial undertakings. Provincial Minimum Wages Boards set the rate; non-payment is a criminal offence.',
    summaryUrdu:
      'صنعتی اور تجارتی اداروں میں مزدوروں کے لیے کم سے کم اجرت کی مقرری کا انتظام کرتا ہے۔ صوبائی ویجز بورڈز کی شرح کا تعین۔',
    gazetteReference: 'Ordinance XXIV of 1961',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Workers', 'Employers', 'HR'],
    sections: [
      { sectionNumber: '3', title: 'Minimum wages', content: 'The Provincial Government may, by notification in the official Gazette, fix the minimum rates of wages for employees in specified industries.', contentUrdu: 'صوبائی حکومت گزٹ میں نوٹیفکیشن کے ذریعے کم سے کم اجرت کی شرح مقرر کر سکتی ہے۔' },
      { sectionNumber: '8', title: 'Penalty for underpayment', content: 'An employer who pays less than the minimum rate of wages shall be punishable with imprisonment for up to six months or fine or both.', contentUrdu: 'جو آجر کم سے کم شرح سے کم ادا کرے وہ چھ ماہ تک قید یا جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [],
  },
  {
    title: 'Bonded Labour System (Abolition) Act 1992',
    titleUrdu: 'بانڈڈ لیبر سسٹم (ابولیشن) ایکٹ 1992',
    slug: 'bonded-labour-system-abolition-act-1992',
    categorySlug: 'labor-employment-law',
    yearEnacted: 1992,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Abolishes the bonded labour system in Pakistan, including the custom of "peshgi" (advances) that trap workers in debt bondage. Nullifies debts and criminalizes enforcement. Establishes Vigilance Committees at the district level.',
    summaryUrdu:
      'پاکستان میں بانڈڈ لیبر سسٹم اور پیشگی روایت کا خاتمہ کرتا ہے جو مزدوروں کو قرض کے جال میں پھنساتی ہے۔ تمام قرضے کالعدم اور ان کی وصولی جرم۔',
    gazetteReference: 'Act IV of 1992',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Workers', 'Employers', 'District Administration', 'NGOs'],
    sections: [
      { sectionNumber: '4', title: 'Abolition of bonded labour system', content: 'On the commencement of this Act, the bonded labour system shall stand abolished and every bonded labourer shall stand freed and discharged from any obligation to render any bonded labour.', contentUrdu: 'اس ایکٹ کے آغاز پر بانڈڈ لیبر سسٹم کالعدم قرار دیا گیا اور ہر بانڈڈ لیبر آزاد ہو گی۔' },
      { sectionNumber: '11', title: 'Punishment for enforcing bonded labour', content: 'Whoever enforces any bonded labour shall be punishable with imprisonment for a term not less than two years and not more than five years, or fine, or both.', contentUrdu: 'جو کوئی بانڈڈ لیبر نافذ کرے وہ دو سے پانچ سال تک قید یا جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [],
  },
  {
    title: 'Prohibition of Employment of Children Act 2017 (Punjab)',
    titleUrdu: 'بچوں کی ملازمت پر پابندی ایکٹ 2017 (پنجاب)',
    slug: 'prohibition-of-employment-of-children-act-2017-punjab',
    categorySlug: 'labor-employment-law',
    yearEnacted: 2017,
    jurisdiction: 'punjab',
    status: 'active',
    summary:
      'Punjab-specific child labour law. Prohibits employment of children below 14 years in any establishment, and below 15 years in hazardous occupations. Sets daily/weekly hour limits for adolescents.',
    summaryUrdu:
      'پنجاب کا خصوصی بچوں کے کام کا قانون۔ 14 سال سے کم عمر بچوں کی ملازمت کی ممانعت اور خطرناک پیشوں میں 15 سال سے کم۔',
    gazetteReference: 'Punjab Act XXX of 2017',
    promulgatingAuthority: 'Provincial Assembly of Punjab',
    applicabilityTags: ['Children', 'Employers', 'NGOs', 'Inspectors'],
    sections: [
      { sectionNumber: '3', title: 'Prohibition of child employment', content: 'No child shall be employed or permitted to work in any establishment.', contentUrdu: 'کوئی بچہ کسی بھی ادارے میں ملازم نہ رکھا جائے۔' },
      { sectionNumber: '5', title: 'Hazardous occupations', content: 'No adolescent shall be employed or permitted to work in any hazardous occupation listed in the Schedule.', contentUrdu: 'کوئی نوعمر Schedule میں درج خطرناک پیشے میں ملازم نہ رکھا جائے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Workers\' Welfare Fund Ordinance 1971',
    titleUrdu: 'ورکرز ویلفیر فنڈ آرڈیننس 1971',
    slug: 'workers-welfare-fund-ordinance-1971',
    categorySlug: 'labor-employment-law',
    yearEnacted: 1971,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Establishes the Workers\' Welfare Fund, financed by employers contributing 2% of their profits above PKR 500,000. Funds are used for housing, education, health and other welfare measures for industrial workers.',
    summaryUrdu:
      'ورکرز ویلفیر فنڈ قائم کرتا ہے، جسے آجروں کے منافع کا 2% (پانچ لاکھ سے زائد منافع پر) فراہم کرتے ہیں۔ مزدوروں کے رہائش، تعلیم، صحت اور دیگر فلاحی کاموں پر خرچ۔',
    gazetteReference: 'Ordinance XLI of 1971',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Employers', 'Workers', 'HR'],
    sections: [
      { sectionNumber: '4', title: 'Employer contribution', content: 'Every industrial establishment where the total income exceeds five hundred thousand rupees shall contribute to the Workers\' Welfare Fund two per cent of its total income.', contentUrdu: 'ہر صنعتی ادارہ جس کی کل آمدنی پانچ لاکھ سے زیادہ ہو، اپنی کل آمدنی کا 2% ویلفیر فنڈ میں ادا کرے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Protection Against Harassment of Women at Workplace Act 2010',
    titleUrdu: 'کام کی جگہ پر خواتین کو ہراسانی سے تحفظ ایکٹ 2010',
    slug: 'protection-against-harassment-of-women-at-workplace-act-2010',
    categorySlug: 'labor-employment-law',
    yearEnacted: 2010,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Defines and criminalizes workplace sexual harassment. Mandates Inquiry Committees in every organization with 25+ employees, and Code of Conduct enforcement. Ombudsperson appointed at federal and provincial levels to hear appeals.',
    summaryUrdu:
      'کام کی جگہ پر جنسی ہراسانی کو جرم قرار دیتا ہے۔ 25 سے زیادہ ملازمین والے ہر ادارے میں انکوائری کمیٹی کی تشکیل لازم۔ وفاقی اور صوبائی سمچاسپرس مقرر۔',
    gazetteReference: 'Act IV of 2010',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Women', 'Employers', 'HR', 'Organizations'],
    sections: [
      { sectionNumber: '2', title: 'Definitions of harassment', content: '"Harassment" includes any unwelcome sexual advance, request for sexual favour or other verbal or physical conduct of a sexual nature, whether directly or by implication.', contentUrdu: '"ہراسانی" میں کوئی بھی غیر مرغوب جنسی پیش قدمی، جنسی تعلق کی درخواست یا جنسی نوعیت کی زبانی/جسمانی حرکت شامل ہے۔' },
      { sectionNumber: '3', title: 'Inquiry Committee', content: 'Each organization shall constitute an Inquiry Committee within thirty days of the commencement of this Act, comprising at least three members, one of whom shall be a woman.', contentUrdu: 'ہر ادارے میں ایک انکوائری کمیٹی تشکیل دی جائے جس میں کم سے کم ایک خاتون رکن ہو۔' },
      { sectionNumber: '4', title: 'Penalties', content: 'Major penalties include dismissal, reduction in rank, compulsory retirement, fine up to PKR 500,000.', contentUrdu: 'بڑی سزاؤں میں برطرفی، رینک میں کمی، لازمی ریٹائرمنٹ، 5 لاکھ تک جرمانہ شامل ہیں۔' },
    ],
    amendments: [
      { amendmentYear: 2022, amendmentTitle: 'Harassment Act Amendment 2022', description: 'Broadened definition; addressed harassment through digital means; expanded Ombudsperson powers.', gazetteReference: 'Act of 2022' },
    ],
  },

  // ===================== TAX LAW =====================
  {
    title: 'Income Tax Ordinance 2001',
    titleUrdu: 'انکم ٹیکس آرڈیننس 2001',
    slug: 'income-tax-ordinance-2001',
    categorySlug: 'tax-law',
    yearEnacted: 2001,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'The principal federal statute imposing income tax in Pakistan on individuals, AOPs (associations of persons) and companies. Defines heads of income (salary, business, property, capital gains, other sources), tax rates (in annual Finance Act), exemptions, deductions, withholding tax and the filing/assessment procedure.',
    summaryUrdu:
      'پاکستان کا بنیادی وفاقی انکم ٹیکس قانون، افراد، AOPs اور کمپنیوں پر لاگو۔ آمدنی کے منابع، شرح، استثنے، کٹوتیاں، وِلڈنگ ٹیکس اور اندراج/جائزے کا طریقہ۔',
    gazetteReference: 'Ordinance XLIX of 2001',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Individuals', 'Businesses', 'Tax Professionals', 'FBR'],
    sections: [
      { sectionNumber: '11', title: 'Salary income', content: 'Salary income shall be Pakistan-source income if the employment is performed in Pakistan, regardless of where the salary is received. Salary includes pay, wages, bonus, commission, gratuity, perquisites, allowances and prerequisite.', contentUrdu: 'تنخواہ کی آمدنی پاکستانی ماخذ سمجھی جائے گی اگر ملازمت پاکستان میں انجام پائے، خواہ تنخواہ کہاں وصول ہو۔' },
      { sectionNumber: '15', title: 'Income from business', content: 'Income from business includes profits and gains from any trade, manufacture, profession or vocation, any income from the hire of movable or immovable property, and any profit on debt.', contentUrdu: 'کاروباری آمدنی میں تجارت، صنعت، پیشہ یا روزگار سے منافع شامل ہے۔' },
      { sectionNumber: '113', title: 'Tax on companies (corporate tax)', content: 'The tax payable by a company for a tax year shall be calculated by applying the rate specified in the First Schedule against the company\'s taxable income for the year. Standard corporate rate 29%, reduced for IT/telecom exporters and small companies.', contentUrdu: 'کمپنی کی قابلِ ٹیکس آمدنی پر First Schedule میں درج شرح (معمول 29%) کا اطلاق ہو گا۔' },
      { sectionNumber: '149', title: 'Withholding tax on salary', content: 'Every person paying salary to an employee shall deduct tax from the salary at the average rate of tax estimated for the employee for the year.', contentUrdu: 'تنخواہ ادا کرنے والا ملازم سے معدل شرح پر ٹیکس کٹوتی کرے۔' },
      { sectionNumber: '154', title: 'Withholding tax on exports and imports', content: 'Every exporter shall be subject to withholding tax on the export proceeds at the rate specified in the First Schedule.', contentUrdu: 'ہر ایکسپورٹر پر ایکسپورٹ کی آمدنی پر وِلڈنگ ٹیکس لاگو ہوگا۔' },
    ],
    amendments: [
      { amendmentYear: 2002, amendmentTitle: 'Income Tax Rules 2002', description: 'Detailed rules issued to operationalize the Ordinance, including forms, withholding tables.', gazetteReference: 'S.R.O. 1103(I)/2002' },
      { amendmentYear: 2022, amendmentTitle: 'Finance Act 2022 amendments', description: 'Multiple amendments including new exemptions, real estate CGT changes, and IT exporter reduced rates.', gazetteReference: 'Finance Act 2022' },
      { amendmentYear: 2024, amendmentTitle: 'Finance Act 2024 amendments', description: 'Slab changes for salaried individuals, additional taxes on non-filers, and SME presumptive tax changes.', gazetteReference: 'Finance Act 2024' },
    ],
  },
  {
    title: 'Sales Tax Act 1990',
    titleUrdu: 'سیلز ٹیکس ایکٹ 1990',
    slug: 'sales-tax-act-1990',
    categorySlug: 'tax-law',
    yearEnacted: 1990,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Imposes federal sales tax (VAT-model) on the supply of goods and certain services at the import, manufacturing, and trade stages. Standard rate 17% (varies by province and sector). Administered by FBR federally and SRB/PRAL provincially for services.',
    summaryUrdu:
      'مال اور مخصوص خدمات کی فراہمی پر وفاقی سیلز ٹیکس (VAT ماڈل) لاگز۔ معیاری شرح 17%۔ FBR وفاقی اور SRB صوبائی طور پر خدمات کے لیے۔',
    gazetteReference: 'Act XIII of 1990',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Businesses', 'Traders', 'Manufacturers', 'FBR'],
    sections: [
      { sectionNumber: '3', title: 'Charge of sales tax', content: 'There shall be charged, levied and paid a sales tax at the rate of seventeen percent on the value of taxable supplies.', contentUrdu: 'قابل ٹیکس فراہمی کی قیمت پر سترہ فیصد کی شرح سے سیلز ٹیکس عائد ہوگا۔' },
      { sectionNumber: '7', title: 'Zero-rated and exempt supplies', content: 'The Federal Government may specify supplies to be charged to tax at the rate of zero per cent or supplies to be exempt from tax.', contentUrdu: 'وفاقی حکومت مخصوص فراہمی کو صفر فیصد یا مستثنیٰ قرار دے سکتی ہے۔' },
      { sectionNumber: '13', title: 'Tax invoices', content: 'A registered person making a taxable supply shall issue a serially-numbered tax invoice at the time of supply.', contentUrdu: 'قابلِ ٹیکس فراہمی کرنے والا رجسٹرڈ شخص ٹیکس انوائس جاری کرے۔' },
    ],
    amendments: [
      { amendmentYear: 2024, amendmentTitle: 'Finance Act 2024 amendments', description: 'Tiered sales tax rates (18%, 25%, 10%, 5%) on various items, tighter input tax adjustments.', gazetteReference: 'Finance Act 2024' },
    ],
  },
  {
    title: 'Federal Excise Act 2005',
    titleUrdu: 'فیڈرل ایکسائز ایکٹ 2005',
    slug: 'federal-excise-act-2005',
    categorySlug: 'tax-law',
    yearEnacted: 2005,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Imposes federal excise duty (FED) on specific goods and services — typically luxury goods, cement, sugar, beverages, tobacco, and certain banking/insurance services. Now operates alongside sales tax.',
    summaryUrdu:
      'خصوصی مال اور خدمات — عموماً لگژری اشیاء، سیمنٹ، چینی، مشروبات، تمباکو اور بڑے بینکنگ/انشورنس خدمات — پر فیڈرل ایکسائز ڈیوٹی (FED) عائد۔',
    gazetteReference: 'Act I of 2005',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Manufacturers', 'Service Providers', 'FBR'],
    sections: [
      { sectionNumber: '3', title: 'Charge of duty', content: 'There shall be levied and collected a duty of excise on the goods specified in the First Schedule and services specified in the Second Schedule.', contentUrdu: 'First و Second Schedule میں مخصوص مال اور خدمات پر ایکسائز ڈیوٹی عائد ہوگی۔' },
    ],
    amendments: [],
  },
  {
    title: 'Customs Act 1969',
    titleUrdu: 'کسٹمز ایکٹ 1969',
    slug: 'customs-act-1969',
    categorySlug: 'tax-law',
    yearEnacted: 1969,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Consolidates and amends the law relating to customs duties on imports and exports in Pakistan. Covers classification (HS codes), valuation, anti-dumping, smuggling, customs procedures and the authority of Pakistan Customs.',
    summaryUrdu:
      'پاکستان میں درآمد و برآمد پر کسٹم ڈیوٹی کے قانون کا اختصاص۔ درجہ بندی، اندراج، اینٹی ڈمپنگ، اسمگلنگ اور کسٹم کے طریقے۔',
    gazetteReference: 'Act IV of 1969',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Importers', 'Exporters', 'Customs Agents', 'FBR'],
    sections: [
      { sectionNumber: '16', title: 'Levy of customs duty', content: 'There shall be levied and collected on all goods imported into Pakistan, or exported from Pakistan, customs duty at the rates specified in the First Schedule.', contentUrdu: 'درآمد یا برآمد ہونے والی تمام اشیاء پر First Schedule کی شرح پر کسٹم ڈیوٹی عائد ہوگی۔' },
      { sectionNumber: '32', title: 'Smuggling penalties', content: 'Any person engaged in smuggling shall be liable to penalty not exceeding the value of the goods, and the goods shall be liable to confiscation.', contentUrdu: 'اسمگلنگ میں ملوث شخص پر اشیاء کی قیمت کے برابر جرمانہ اور اشیاء ضبطی کا اختیار ہے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Federal Board of Revenue Act 2007',
    titleUrdu: 'فیڈرل بورڈ آف ریونیو ایکٹ 2007',
    slug: 'federal-board-of-revenue-act-2007',
    categorySlug: 'tax-law',
    yearEnacted: 2007,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Establishes the Federal Board of Revenue (FBR) as the apex federal tax authority for administration of income tax, sales tax, federal excise and customs. Defines FBR\'s autonomy, structure, and powers including the Inland Revenue Intelligence.',
    summaryUrdu:
      'فیڈرل بورڈ آف ریونیو (FBR) کا قیام بطور وفاقی ٹیکس اتھارٹی — انکم ٹیکس، سیلز ٹیکس، فیڈرل ایکسائز اور کسٹمز کی انتظامیہ۔',
    gazetteReference: 'Act III of 2007',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Tax Professionals', 'Businesses', 'FBR'],
    sections: [
      { sectionNumber: '4', title: 'Functions of Board', content: 'The Board shall take such measures as may be necessary to organize, structure and reform the federal taxation system, including policy and enforcement.', contentUrdu: 'بورڈ وفاقی ٹیکسیشن سسٹم کی تنظیم اور اصلاح کے لیے ضروری اقدامات کرے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Provincial Finance Acts (Sales Tax on Services)',
    titleUrdu: 'صوبائی فنانس ایکٹس (خدمات پر سیلز ٹیکس)',
    slug: 'provincial-finance-acts-sales-tax-on-services',
    categorySlug: 'tax-law',
    yearEnacted: 2011,
    jurisdiction: 'punjab',
    status: 'active',
    summary:
      'After the 2010 18th Amendment, services were devolved to the provinces. Each province enacted its own Sales Tax on Services Act: Punjab (PRA), Sindh (SRB), KPK (KPRA), Balochistan (BRA). Rates vary (typically 13% to 16%).',
    summaryUrdu:
      '2010 کی 18ویں ترمیم کے بعد خدمات صوبوں کے زیرِ انتظام آ گئیں۔ ہر صوبے کا اپنا سیلز ٹیکس آن سروسزز ایکٹ: PRA، SRB، KPRA، BRA۔ شرح 13-16%۔',
    gazetteReference: 'Various provincial acts',
    promulgatingAuthority: 'Provincial Assemblies',
    applicabilityTags: ['Service Providers', 'Businesses'],
    sections: [
      { sectionNumber: '—', title: 'Provincial service tax rates', content: 'Sindh (16%), Punjab (16% standard), KPK (15%), Balochistan (13%). Rates revised by annual Finance Acts.', contentUrdu: 'سندھ 16%، پنجاب 16%، کے پی 15%، بلوچستان 13%۔' },
    ],
    amendments: [],
  },
  {
    title: 'Capital Gains Tax (Sister provisions in Income Tax Ordinance)',
    titleUrdu: 'کیپٹل گینز ٹیکس (ITO کی متعلقہ شقوط)',
    slug: 'capital-gains-tax-provisions',
    categorySlug: 'tax-law',
    yearEnacted: 2010,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Capital gains tax on disposal of securities (stocks, mutual funds) and immovable property in Pakistan, embedded within the Income Tax Ordinance 2001 (sections 37, 37A, 113, and others). Rates and holding periods revised annually.',
    summaryUrdu:
      'پاکستان میں سیکیورٹیز (اسٹاک، میوچل فنڈز) اور غیر منقولہ جائداد کی فروخت پر کیپٹل گینز ٹیکس، جو ITO 2001 میں شامل ہے۔',
    gazetteReference: 'Sections 37, 37A of ITO 2001',
    promulgatingAuthority: 'Federal Government',
    applicabilityTags: ['Investors', 'Property Owners', 'Tax Professionals'],
    sections: [
      { sectionNumber: '37', title: 'Capital gains on securities', content: 'Capital gain on disposal of securities shall be chargeable to tax at rates specified, differentiated by holding period (less than 1 year, 1-2 years, more than 2 years).', contentUrdu: 'سیکیورٹیز کی فروخت پر کیپٹل گین ٹیکس ہولڈنگ پیریڈ کے حساب سے عائد۔' },
      { sectionNumber: '37A', title: 'Capital gains on immovable property', content: 'Capital gain on disposal of immovable property shall be chargeable at the rate specified, with differential treatment for filers and non-filers.', contentUrdu: 'غیر منقولہ جائداد کی فروخت پر کیپٹل گین، فائلر اور نان فائلر کے لیے الگ الگ۔' },
    ],
    amendments: [],
  },
  {
    title: 'Wealth Tax Abolished (reference: Wealth Tax Act 1963)',
    titleUrdu: 'ویلتھ ٹیکس منسوخ (حوالہ: ویلتھ ٹیکس ایکٹ 1963)',
    slug: 'wealth-tax-act-1963',
    categorySlug: 'tax-law',
    yearEnacted: 1963,
    jurisdiction: 'federal',
    status: 'repealed',
    summary:
      'Originally imposed a tax on net wealth of individuals above a threshold. Repealed in 2001 with the introduction of the Income Tax Ordinance 2001. Listed here as historical reference — useful for understanding how Pakistan shifted from wealth to income taxation.',
    summaryUrdu:
      'اصل میں افراد کی خالص دولت پر ٹیکس عائد کرتا تھا۔ 2001 میں ITO متعارف ہونے پر منسوخ کر دیا گیا۔ یہاں تاریخی حوالہ کے طور پر درج ہے۔',
    gazetteReference: 'Act XV of 1963 (repealed)',
    promulgatingAuthority: 'Federal Government',
    applicabilityTags: ['Historical Reference', 'Tax Students'],
    sections: [
      { sectionNumber: '—', title: 'Repeal', content: 'The Wealth Tax Act 1963 was repealed by the Income Tax Ordinance 2001, marking the abolition of net-wealth taxation in Pakistan.', contentUrdu: 'ویلتھ ٹیکس ایکٹ 1963 کو ITO 2001 کے ذریعے منسوخ کر دیا گیا۔' },
    ],
    amendments: [],
  },

  // ===================== CONSTITUTIONAL LAW =====================
  {
    title: 'Constitution of the Islamic Republic of Pakistan 1973',
    titleUrdu: 'اسلامی جمہوریہ پاکستان کا آئین 1973',
    slug: 'constitution-of-pakistan-1973',
    categorySlug: 'constitutional-law',
    yearEnacted: 1973,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'The supreme law of Pakistan. Establishes a federal parliamentary republic, separates the executive, legislature and judiciary, and guarantees fundamental rights to all citizens. Consists of a Preamble, 280 Articles, and 7 Schedules. Replaced the 1956 and 1962 constitutions.',
    summaryUrdu:
      'پاکستان کا اعلیٰ ترین قانون۔ وفاقی پارلیمانی جمہوریہ قائم کرتا ہے، انتظامیہ، مقننہ اور عدلیہ کو الگ کرتا ہے، اور تمام شہریوں کو بنیادی حقوق کی ضمانت دیتا ہے۔ ایک تمہید، 280 آرٹیکلز، اور 7 شیڈولز پر مشتمل ہے۔',
    gazetteReference: 'Act XLVIII of 1973',
    promulgatingAuthority: 'Constituent Assembly of Pakistan',
    applicabilityTags: ['Individuals', 'Lawyers', 'Students', 'Government'],
    sections: [
      { sectionNumber: 'Art. 4', title: 'Right of individuals to be dealt with in accordance with law', content: 'To enjoy the protection of law and to be treated in accordance with law is the inalienable right of every citizen, wherever he may be, and of every other person for the time being within Pakistan.', contentUrdu: 'قانون کے تحفظ سے لطف اندوز ہونا اور قانون کے مطابق سلوک پانا ہر شہر کا غیر قابلِ تنازع حق ہے، جہاں وہ ہو، اور پاکستان میں موجود ہر شخص کا۔' },
      { sectionNumber: 'Art. 9', title: 'Security of person', content: 'No person shall be deprived of life or liberty save in accordance with law.', contentUrdu: 'کسی شخص سے قانون کے مطابق ہوئے بغیر زندگی یا آزادی نہ چھینی جائے گی۔' },
      { sectionNumber: 'Art. 14', title: 'Inviolability of human dignity', content: 'The dignity of man and, subject to law, the privacy of home, shall be inviolable.', contentUrdu: 'انسان کی عزت اور قانون کے تابع، گھر کی نجیت، ناقابلِ خلاف ورزی ہوگی۔' },
      { sectionNumber: 'Art. 19', title: 'Freedom of speech, etc.', content: 'Every citizen shall have the right to freedom of speech and expression, and there shall be freedom of the press, subject to any reasonable restrictions imposed by law.', contentUrdu: 'ہر شہر کو تقریر اور اظہار کی آزادی کا حق ہوگا، اور قانون کے تحت کسی مناسب پابندی کے تابع پریس کی آزاد مزاج ہوگی۔' },
      { sectionNumber: 'Art. 19-A', title: 'Right to information', content: 'Every citizen shall have the right to have access to information in all matters of public importance subject to regulation and reasonable restrictions imposed by law.', contentUrdu: 'ہر شہر کو عوامی اہمیت کے تمام معاملات میں معلومات تک رسائی کا حق ہوگا۔' },
      { sectionNumber: 'Art. 25', title: 'Equality of citizens', content: 'All citizens are equal before law and are entitled to equal protection of law. There shall be no discrimination on the basis of sex alone.', contentUrdu: 'تمام شہری قانون کے سامنے مساوی ہیں اور مساوی قانونی تحفظ کے حقدار ہیں۔ صرف جنس کی بنیاد پر کوئی امتیاز نہیں ہوگا۔' },
      { sectionNumber: 'Art. 184(3)', title: 'Original jurisdiction of Supreme Court', content: 'The Supreme Court shall have the jurisdiction to pronounce declaratory judgments in matters of public importance relating to the enforcement of any of the Fundamental Rights.', contentUrdu: 'سپریم کورٹ کے پاس بنیادی حقوق کے نفاذ سے متعلق عوامی اہمیت کے معاملات میں اعلانیہ فیصلے دینے کا اختیار ہے۔' },
      { sectionNumber: 'Art. 199', title: 'Extraordinary jurisdiction of High Courts (writ)', content: 'A High Court may make an order directing a person performing functions in connection with the affairs of the Federation, a Province, or a local authority to do or not to do a certain act.', contentUrdu: 'ہائی کورٹ کسی ایسے شخص کو جو وفاق، صوبہ یا مقامی حکومت کے امور سے متعلق فرائض انجام دے رہا ہو، کسی خاص عمل کے کرنے یا نہ کرنے کا حکم دے سکتی ہے۔' },
    ],
    amendments: [
      { amendmentYear: 1985, amendmentTitle: '8th Amendment', description: 'Inserted Article 58(2)(b) giving the President power to dissolve the National Assembly. Largely nullified by later amendments.', gazetteReference: 'Act XVIII of 1985' },
      { amendmentYear: 2010, amendmentTitle: '18th Amendment', description: 'Removed the President\'s power to dissolve Parliament; devolved significant subjects to provinces; renamed NWFP to KPK.', gazetteReference: 'Act X of 2010' },
      { amendmentYear: 2012, amendmentTitle: '20th Amendment', description: 'Provided for the caretaker government system during elections.', gazetteReference: 'Act V of 2012' },
      { amendmentYear: 2017, amendmentTitle: '25th Amendment', description: 'Merged the Federally Administered Tribal Areas (FATA) into Khyber Pakhtunkhwa province.', gazetteReference: 'Act XIV of 2018' },
    ],
  },
  {
    title: '18th Constitutional Amendment Act 2010',
    titleUrdu: 'آئینی ترمیم 18 ایکٹ 2010',
    slug: '18th-constitutional-amendment-2010',
    categorySlug: 'constitutional-law',
    yearEnacted: 2010,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Landmark constitutional reform that dismantled the 17th Amendment, removed the President\'s power to dissolve the National Assembly, renamed NWFP to Khyber Pakhtunkhwa, devolved 17 federal subjects to the provinces (including health, education, environment), and strengthened the Council of Common Interests.',
    summaryUrdu:
      'اہم آئینی اصلاح جس نے 17ویں ترمیم کا خاتمہ کیا، صدر کی قومی اسمبلی توڑنے کا اختیار ختم کیا، NWFP کا نام کے پی کے رکھا، 17 وفاقی مضامین صوبوں کو منتقل کیے، اور مشترکہ مفادات کونسل کو مضبوط کیا۔',
    gazetteReference: 'Act X of 2010',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Government', 'Lawyers', 'Students'],
    sections: [
      { sectionNumber: '—', title: 'Devolution of subjects', content: 'Subjects devolved to provinces include health, education, environment, agriculture, labor, tourism, population welfare, and local government, among others — eliminating the Concurrent Legislative List.', contentUrdu: 'صوبوں کو منتقل مضامین میں صحت، تعلیم، ماحول، زراعت، محنت، سیاحت، آبادی بہبود، اور مقامی حکومت شامل ہیں۔' },
      { sectionNumber: '—', title: 'Removal of 58(2)(b)', content: 'Article 58(2)(b) — which gave the President discretionary power to dissolve the National Assembly — was deleted.', contentUrdu: 'آرٹیکل 58(2)(b) — جو صدر کو قومی اسمبلی توڑنے کا صوابدیدی اختیار دیتا تھا — خارج کر دیا گیا۔' },
      { sectionNumber: '—', title: 'Naming of NWFP', content: 'The North-West Frontier Province was renamed Khyber Pakhtunkhwa via Article 51(3) amendment.', contentUrdu: 'شمال مغربی سرحدی صوبے کا نام خیبر پختونخوا رکھا گیا۔' },
    ],
    amendments: [],
  },

  // ===================== CIVIL LAW =====================
  {
    title: 'Code of Civil Procedure 1908',
    titleUrdu: 'دیوانی آئینِ عدالت 1908',
    slug: 'code-of-civil-procedure-1908',
    categorySlug: 'civil-law',
    yearEnacted: 1908,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'The CPC 1908 is the procedural manual for civil courts in Pakistan. Governs the filing of suits, issuance of summons, examination of witnesses, interim orders, judgments, decrees, execution, and appeals. Comprises 158 sections and 11 appendices.',
    summaryUrdu:
      'CPC 1908 پاکستان کی دیوانی عدالتوں کا طریقِ کار مینول ہے۔ دعووں کی داخل derегистion، سمنس، گواہوں کی سماعت، عارضی احکامات، فیصلے، حکم نامے، عمل درآمد، اور اپیلیں منظم کرتا ہے۔ 158 شقیں اور 11 اپینڈسز۔',
    gazetteReference: 'Act V of 1908',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Lawyers', 'Judges', 'Civil Litigants'],
    sections: [
      { sectionNumber: 'O. 6 R. 17', title: 'Amendment of pleadings', content: 'The court may at any stage of the proceedings allow either party to alter or amend his pleadings in such manner and on such terms as may be just.', contentUrdu: 'عدالت کارروائی کے کسی بھی مرحلے پر کسی فریق کو مناسب شرائط پر اپنی درخواست میں ترمیم کی اجازت دے سکتی ہے۔' },
      { sectionNumber: 'O. 7 R. 11', title: 'Rejection of plaint', content: 'The court may reject a plaint if it does not disclose a cause of action, or is undervalued, or is insufficiently stamped.', contentUrdu: 'عدالت دعوے کی درخواست رد کر سکتی ہے اگر وہ وسببِ دعوا نہیں بتاتی، یا کم قیمت درج ہے، یا وافی سٹیمپ نہیں۔' },
      { sectionNumber: 'O. 39', title: 'Temporary injunctions', content: 'The court may grant a temporary injunction to prevent the opposing party from causing injury to the applicant during the pendency of the suit.', contentUrdu: 'عدالت مقدمے کی سماعت کے دوران مت opposing فریق کو دعوا دہندہ کو نقصان پہنچانے سے روکنے کے لیے عارضی حائل احکام دے سکتی ہے۔' },
      { sectionNumber: 'O. 41', title: 'Appeals from original decrees', content: 'An appeal shall lie from every decree passed by any court exercising original jurisdiction to the court authorized to hear appeals from the decisions of that court.', contentUrdu: 'اصل ڈگری پاس کرنے والی ہر عدالت کے فیصلے سے اپیل ہو سکتی ہے۔' },
    ],
    amendments: [
      { amendmentYear: 2020, amendmentTitle: 'Punjab CPC Amendment', description: 'Punjab introduced pre-trial mediation and case-management reforms to reduce pendency.', gazetteReference: 'Punjab Act' },
    ],
  },
  {
    title: 'Contract Act 1872',
    titleUrdu: 'معاہدہ ایکٹ 1872',
    slug: 'contract-act-1872',
    categorySlug: 'civil-law',
    yearEnacted: 1872,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Defines and regulates contracts in Pakistan. Covers offer and acceptance, consideration, capacity of parties, free consent, legality of object, performance, breach and remedies. Foundation of commercial and personal contractual relationships.',
    summaryUrdu:
      'پاکستان میں معاہدوں کی تعریف اور تنظیم کرتا ہے۔ پیشکش و قبولیت، غور، فریقین کی اہلیت، آزاد رضا، مقصد کی قانونی حیثیت، عمل درآمد، خلاف ورزی اور چارہ جوئی۔ تجارتی و ذاتی معاہدات کی بنیاد۔',
    gazetteReference: 'Act IX of 1872',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Businesses', 'Individuals', 'Lawyers'],
    sections: [
      { sectionNumber: '2(h)', title: 'Definition of contract', content: 'An agreement enforceable by law is a contract.', contentUrdu: 'قانون کے ذریعے قابلِ نفاذ معاہدہ ایک کنٹریکٹ ہے۔' },
      { sectionNumber: '10', title: 'What agreements are contracts', content: 'All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and a lawful object, and not hereby expressly declared to be void.', contentUrdu: 'تمام معاہدے کنٹریکٹ ہیں اگر آزاد رضا سے بنائے جائیں، قانونی غور و قانونی مقصد کے ساتھ، اور یہاں باقاعدہ کالعدم نہ قرار دیے گئے ہوں۔' },
      { sectionNumber: '14', title: 'Free consent', content: 'Consent is said to be free when it is not caused by coercion, undue influence, fraud, misrepresentation, or mistake.', contentUrdu: 'رضا اس وقت آزاد سمجھی جاتی ہے جب وہ جبر، غیر موزوں اثر، دھوکہ، غلط بیانی، یا غلطی سے نہ ہو۔' },
      { sectionNumber: '73', title: 'Compensation for loss or damage caused by breach', content: 'When a contract has been broken, the party who suffers by such breach is entitled to receive compensation for any loss or damage caused to him thereby which naturally arose in the usual course of things.', contentUrdu: 'جب معاہدہ ٹوٹ جائے، متاثرہ فریق اس نقصان یا کمی کا معاوضہ حاصل کرنے کا حقدار ہے جو معمول کے سلسلے میں قدرتی طور پر پیدا ہوا۔' },
    ],
    amendments: [],
  },
  {
    title: 'Limitation Act 1908',
    titleUrdu: 'عدالتوں کی حدود ایکٹ 1908',
    slug: 'limitation-act-1908',
    categorySlug: 'civil-law',
    yearEnacted: 1908,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Sets the maximum time limits within which a civil suit or other legal proceeding must be filed. Once the period expires, the claim is "time-barred" and the court cannot hear it. Different limitations apply to different types of claims (e.g., 3 years for recovery of money, 12 years for possession of immovable property).',
    summaryUrdu:
      'زیادہ سے زیادہ وقت کی حد مقرر کرتا ہے جس کے اندر کوئی دیوانی دعوا یا قانونی کارروائی دائر کی جائے۔ ایک بار مدت ختم ہونے کے بعد دعوا "وقت سے بند" ہو جاتا ہے۔ مختلف دعوؤں کے لیے مختلف حدود (مثلاً رقم وصولی کے لیے 3 سال، غیر منقولہ جائداد کی قبضے کے لیے 12 سال)۔',
    gazetteReference: 'Act IX of 1908',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Lawyers', 'Civil Litigants'],
    sections: [
      { sectionNumber: '3', title: 'Bar of suit after limitation period', content: 'Every suit instituted, appeal preferred, and application made after the period of limitation prescribed therefor by the Schedule shall be dismissed, although limitation has not been set up as a defence.', contentUrdu: 'شیڈول کے تحت مقررہ وقت کے بعد دائر کیا جانے والا ہر دعوا، اپیل، یا درخواست مسترد کی جائے گی۔' },
      { sectionNumber: '5', title: 'Extension in case of appeals', content: 'Any appeal preferred after the period of limitation may be admitted if the appellant satisfies the court that he had sufficient cause for not preferring it within such period.', contentUrdu: 'وقت کی مدت کے بعد کی گئی کوئی اپیل قبول کی جا سکتی ہے اگر اپیلنٹ عدالت کو مطمئن کرے کہ اس کے پاس مناسب وجہ تھی۔' },
    ],
    amendments: [],
  },
  {
    title: 'Specific Relief Act 1877',
    titleUrdu: 'مخصوص چارہ جوئی ایکٹ 1877',
    slug: 'specific-relief-act-1877',
    categorySlug: 'civil-law',
    yearEnacted: 1877,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Provides for the grant of specific relief (as opposed to monetary damages) — including specific performance of contracts, injunctions, declaratory decrees, and possession of property. Complements the Contract Act 1872 by enabling court-ordered enforcement.',
    summaryUrdu:
      'مخصوص چارہ جوئی (مالی نقصان کے متبادل) فراہم کرتا ہے — بشمول معاہدوں کی مخصوص انجام، حائل احکامات، اعلانیہ فیصلے، اور جائداد کی قبضہ۔ کنٹریکٹ ایکٹ 1872 کی تکمیل عدالتی نفاذ کے ذریعے۔',
    gazetteReference: 'Act I of 1877',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Lawyers', 'Civil Litigants', 'Property Owners'],
    sections: [
      { sectionNumber: '12', title: 'Specific performance of contracts', content: 'The specific performance of any contract may, in the discretion of the court, be enforced when the actual damage caused by non-performance cannot be adequately compensated by damages.', contentUrdu: 'عدالت کے اختیار کے تحت کسی بھی معاہدے کی مخصوص انجام نافذ کی جا سکتی ہے جب عدم انجام کے نقصان کا مناسب معاوضہ ممکن نہ ہو۔' },
      { sectionNumber: '42', title: 'Declaratory decrees', content: 'Any person entitled to any legal character or right may institute a suit against any person denying such character or right, to obtain a declaratory decree.', contentUrdu: 'کوئی بھی شخص جسے کوئی قانونی حیثیت یا حق حاصل ہو، کسی ایسے شخص کے خلاف دعویٰ دائر کر سکتا ہے جو اس حیثیت یا حق کا انکار کرتا ہے۔' },
      { sectionNumber: '53', title: 'Perpetual injunctions', content: 'A perpetual injunction may be granted to prevent the breach of an obligation existing in favor of the plaintiff.', contentUrdu: 'مدعی کے حق میں موجود کسی پابندی کی خلاف ورزی سے روکنے کے لیے مستقل حائل حکم دیا جا سکتا ہے۔' },
    ],
    amendments: [],
  },

  // ===================== PROPERTY & LAND LAW =====================
  {
    title: 'Transfer of Property Act 1882',
    titleUrdu: 'جائداد کی منتقلی ایکٹ 1882',
    slug: 'transfer-of-property-act-1882',
    categorySlug: 'property-land-law',
    yearEnacted: 1882,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Governs the transfer of property by act of parties (sale, mortgage, lease, gift, exchange). Defines what constitutes a valid transfer and the rights and obligations of transferor and transferee.',
    summaryUrdu:
      'فریقین کے عمل کے ذریعے جائداد کی منتقلی (بیع، رہن، لیز، ہبہ، تبادلہ) منظم کرتا ہے۔ قابلِ منتقلی شرائط اور منتقل کرنے والے اور منتقلی پانے والے کے حقوق و ذمہ داریاں۔',
    gazetteReference: 'Act IV of 1882',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Property Owners', 'Buyers', 'Lawyers'],
    sections: [
      { sectionNumber: '5', title: 'Definition of "transfer of property"', content: 'In the following sections "transfer of property" means an act by which a living person conveys property to one or more other living persons, or to himself and one or more other living persons.', contentUrdu: '"جائداد کی منتقلی" کا مطلب ایک ایسا عمل ہے جس کے ذریعے زندہ شخص جائداد ایک یا زیادہ دوسرے زندہ اشخاص کو منتقل کرتا ہے۔' },
      { sectionNumber: '54', title: 'Sale', content: 'Sale is a transfer of ownership in exchange for a price paid or promised or part-paid and part-promised.', contentUrdu: 'بیع مال کی ملکیت کی منتقلی ہے قیمت کے بدلے میں، جو ادا کی گئی یا وعدہ شدہ یا جزوی ادا و جزوی وعدہ۔' },
      { sectionNumber: '58', title: 'Mortgage', content: 'A mortgage is the transfer of an interest in specific immovable property for the purpose of securing the payment of money advanced or to be advanced.', contentUrdu: 'رهن کسی مخصوص غیر منقولہ جائداد میں مفاد کی منتقلی ہے ادا شدہ یا ادا کی جانے والی رقم کی ضمانت کے مقصد سے۔' },
      { sectionNumber: '122', title: 'Gift', content: 'A gift is the transfer of certain existing movable or immovable property made voluntarily and without consideration, by one person, called the donor, to another, called the donee.', contentUrdu: 'ہبہ کسی موجودہ متحرک یا غیر منقولہ جائداد کی منتقلی ہے، بغیر غور کے رضاکارانہ طور پر ایک شخص (دہندہ) سے دوسرے (دریافت کنندہ) کو۔' },
    ],
    amendments: [],
  },
  {
    title: 'Registration Act 1908',
    titleUrdu: 'رجسٹریشن ایکٹ 1908',
    slug: 'registration-act-1908',
    categorySlug: 'property-land-law',
    yearEnacted: 1908,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Governs the registration of documents (especially property transactions) with the Sub-Registrar. Registration provides legal validity and creates a public record. Mandatory for certain documents (e.g., sale of immovable property above Rs. 100).',
    summaryUrdu:
      'دستاویزات کے اندراج (خاص طور پر جائداد کے لین دین) کو سب رجسٹرار کے ساتھ منظم کرتا ہے۔ اندراج قانونی حیثیت فراہم کرتا ہے اور عوامی ریکارڈ بنا دیتا ہے۔ مخصوص دستاویزات (مثلاً 100 روپے سے زیادہ غیر منقولہ جائداد کی بیع) کے لیے لازمی۔',
    gazetteReference: 'Act XVI of 1908',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Property Owners', 'Buyers', 'Lawyers'],
    sections: [
      { sectionNumber: '17', title: 'Documents of which registration is compulsory', content: 'Documents of which registration is compulsory include: instruments of gift of immovable property; other non-testamentary instruments which purport or operate to create, declare, assign, limit or extinguish any right, title or interest in immovable property.', contentUrdu: 'لازمی رجسٹریشن دستاویزات میں شامل ہیں: غیر منقولہ جائداد کے ہبہ کے آلات؛ دیگر غیر وصیتی دستاویزات جو غیر منقولہ جائداد میں کوئی حق، عنوان یا مفاد قائم کرتی ہیں۔' },
      { sectionNumber: '23', title: 'Time for presenting documents', content: 'Subject to certain exceptions, every document other than a will must be presented for registration within four months from the date of its execution.', contentUrdu: 'کچھ استثنات کے تابع، وصیت کے علاوہ ہر دستاویز اپنی توثیق کی تاریخ سے چار ماہ کے اندر اندراج کے لیے پیش کی جائے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Land Revenue Act 1967',
    titleUrdu: 'زمین ریونیو ایکٹ 1967',
    slug: 'land-revenue-act-1967',
    categorySlug: 'property-land-law',
    yearEnacted: 1967,
    jurisdiction: 'punjab',
    status: 'amended',
    summary:
      'Provincial-level law governing the assessment and collection of land revenue, the maintenance of revenue records, and the role of patwari, tehsildar, and other revenue officials. Each province has its own version (Punjab, Sindh, KPK, Balochistan).',
    summaryUrdu:
      'صوبائی سطح کا قانون جو زمین کے ریونیو کی تشخیص و وصولی، ریونیو ریکارڈز کی دیکھ بھال، اور پٹواری، تحصیلدار اور دیگر ریونیو عہدیداروں کے کردار کو منظم کرتا ہے۔ ہر صوبے کا اپنا ورژن ہے۔',
    gazetteReference: 'West Pakistan Land Revenue Act 1967',
    promulgatingAuthority: 'Provincial Government',
    applicabilityTags: ['Land Owners', 'Farmers', 'Revenue Officials'],
    sections: [
      { sectionNumber: '32', title: 'Mutation of rights', content: 'Where the rights of any person are transferred, recorded, divided, increased, decreased, or extinguished by any means other than death, the patwari shall make the appropriate entry in the register of mutations.', contentUrdu: 'جہاں کسی شخص کے حقوق منتقل، درج، تقسیم، بڑھائے، کم یا ختم ہوتے ہیں (موت کے علاوہ)، پٹواری رجسٹرِ منتقلی میں مناسب اندراج کرے گا۔' },
      { sectionNumber: '42', title: 'Record of rights', content: 'The record of rights shall include: a map of the estate; field map; register of mutations; list of rights.', contentUrdu: 'حقوق کا ریکارڈ شامل ہوگا: اسٹیٹ کا نقشہ؛ فیلڈ میپ؛ رجسٹرِ منتقلی؛ حقوق کی فہرست۔' },
    ],
    amendments: [],
  },
  {
    title: 'Stamp Act 1899',
    titleUrdu: 'سٹیمپ ایکٹ 1899',
    slug: 'stamp-act-1899',
    categorySlug: 'property-land-law',
    yearEnacted: 1899,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Governs the stamping of instruments (documents) to make them legally admissible as evidence and to charge stamp duty — a tax on transactions. Unstamped or under-stamped documents cannot be admitted by courts. Stamp duty on property transactions is a major source of provincial revenue.',
    summaryUrdu:
      'دستاویزات پر سٹیمپ لگانے کو منظم کرتا ہے تاکہ وہ عدالت میں قانونی طور پر قابلِ قبول ہوں اور سٹیمپ ڈیوٹی — لین دین پر ایک ٹیکس — وصول کی جائے۔ بغیر سٹیمپ یا کم سٹیمپ دستاویزات عدالتوں میں قابلِ قبول نہیں۔ جائداد لین دین پر سٹیمپ ڈیوٹی صوبائی ریونیو کا بڑا ذریعہ ہے۔',
    gazetteReference: 'Act II of 1899',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Property Owners', 'Buyers', 'Lawyers'],
    sections: [
      { sectionNumber: '10', title: 'Duties payable by stamps', content: 'All duties with which any instrument is chargeable shall be paid by means of stamps.', contentUrdu: 'جن دستاویزات پر ڈیوٹی عائد ہوتی ہے وہ سٹیمپ کے ذریعے ادا کی جائے گی۔' },
      { sectionNumber: '35', title: 'Instruments not duly stamped inadmissible in evidence', content: 'No instrument chargeable with duty shall be admitted in evidence for any purpose by any person having authority to receive evidence, unless it is duly stamped.', contentUrdu: 'کوئی ڈیوٹی قابل دستاویز ثبوت کے طور پر قابلِ قبول نہیں ہو گی جب تک وہ وافی سٹیمپ نہ ہو۔' },
    ],
    amendments: [],
  },

  // ===================== CONSUMER PROTECTION =====================
  {
    title: 'Punjab Consumer Protection Act 2005',
    titleUrdu: 'پنجاب کنزیومر پروٹیکشن ایکٹ 2005',
    slug: 'punjab-consumer-protection-act-2005',
    categorySlug: 'consumer-protection-law',
    yearEnacted: 2005,
    jurisdiction: 'punjab',
    status: 'active',
    summary:
      'Provincial law protecting consumers in Punjab against unfair trade practices, defective goods, false advertising, and deficient services. Establishes Consumer Courts with the power to award damages and impose fines.',
    summaryUrdu:
      'پنجاب میں صارفین کو ناشفاف تجارتی عمل، معیب اشیاء، جعلی اشتہار بندی، اور ناقص خدمات سے بچانے کا صوبائی قانون۔ کنزیومر کورٹس قائم کرتا ہے جو نقصان کا معاوضہ اور جرمانے عائد کر سکتی ہیں۔',
    gazetteReference: 'Punjab Act XIV of 2005',
    promulgatingAuthority: 'Provincial Assembly of Punjab',
    applicabilityTags: ['Consumers', 'Businesses', 'Traders'],
    sections: [
      { sectionNumber: '10', title: 'Unfair trade practices', content: 'A manufacturer or trader shall not engage in any unfair trade practice, including: false or misleading advertisement; offering gifts or prizes with intent not to provide them; making false statements about goods.', contentUrdu: 'کوئی مینوفیکچرر یا تاجر کوئی ناشفاف تجارتی عمل نہ کرے، بشمول: جعلی یا گمراہ کن اشتہار؛ تحائف یا انعامات پیش کرنا بغیر دینے کی نیت سے؛ اشیاء کے بارے میں جعلی بیانات۔' },
      { sectionNumber: '14', title: 'Powers of Consumer Court', content: 'The Consumer Court may: direct replacement of goods; refund of price; removal of defects; payment of compensation; and imposition of fine.', contentUrdu: 'کنزیومر کورٹ اشیاء کی تبدیلی؛ قیمت کی واپسی؛ خامیوں کے خاتمے؛ معاوضے کی ادائیگی؛ اور جرمانے کا حکم دے سکتی ہے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Sindh Consumer Protection Act 2014',
    titleUrdu: 'سندھ کنزیومر پروٹیکشن ایکٹ 2014',
    slug: 'sindh-consumer-protection-act-2014',
    categorySlug: 'consumer-protection-law',
    yearEnacted: 2014,
    jurisdiction: 'sindh',
    status: 'active',
    summary:
      'Sindh province\'s consumer protection statute, modeled on the Punjab Act but with province-specific procedures. Establishes Consumer Courts and protects against unfair trade practices and defective goods in Sindh.',
    summaryUrdu:
      'سندھ صوبے کا کنزیومر پروٹیکشن قانون، پنجاب ایکٹ کی طرز پر مگر صوبائی طریقوں کے ساتھ۔ کنزیومر کورٹس قائم کرتا ہے اور سندھ میں ناشفاف تجارتی عمل اور معیب اشیاء سے تحفظ فراہم کرتا ہے۔',
    gazetteReference: 'Sindh Act XII of 2014',
    promulgatingAuthority: 'Provincial Assembly of Sindh',
    applicabilityTags: ['Consumers', 'Businesses'],
    sections: [
      { sectionNumber: '12', title: 'Complaint to Consumer Court', content: 'A consumer may file a complaint before the Consumer Court within two years from the date of cause of action.', contentUrdu: 'صارف دو سال کے اندر کنزیومر کورٹ میں شکایت دائر کر سکتا ہے۔' },
    ],
    amendments: [],
  },

  // ===================== WOMEN'S RIGHTS =====================
  {
    title: 'Acid Control and Acid Crime Prevention Act 2011',
    titleUrdu: 'ایسڈ کنٹرول اور ایسڈ کرائم پری وینشن ایکٹ 2011',
    slug: 'acid-control-and-acid-crime-prevention-act-2011',
    categorySlug: 'womens-rights-law',
    yearEnacted: 2011,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Criminalizes acid violence — punishing anyone who uses or throws acid on another person with imprisonment for life or up to 14 years and a fine of at least Rs. 1 million payable to the victim. Also regulates the sale, purchase and storage of acid.',
    summaryUrdu:
      'ایسڈ پرتشددت کو جرم قرار دیتا ہے — کسی دوسرے شخص پر ایسڈ استعمال یا پھینکنے والے کو قیدِ بامشقت یا 14 سال تک قید اور کم سے کم 10 لاکھ روپے جرمانے کی سزا (متاثرہ کو ادا کرنے کے لیے)۔ ایسڈ کی فروخت و ذخیرہ کاری کو بھی منظم کرتا ہے۔',
    gazetteReference: 'Act XXIV of 2011',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Women', 'Individuals', 'Medical Practitioners'],
    sections: [
      { sectionNumber: '336-A', title: 'Punishment for acid throwing (PPC amendment)', content: 'Whoever causes hurt by any means with the intention of causing hurt to any person by means of a corrosive substance or an acid shall be punished with imprisonment for life or imprisonment of either description which shall not be less than fourteen years and a minimum fine of one million rupees.', contentUrdu: 'جو کوئی ایسڈ یا تیزاب سے کسی کو نقصان پہنچائے وہ قیدِ بامشقت یا کم سے کم چودہ سال قید اور کم سے کم دس لاکھ روپے جرمانے کا مستحق ہوگا۔' },
      { sectionNumber: '336-B', title: 'Punishment for disfigurement by acid', content: 'Whoever with the intention or knowing it to be likely to disfigure, deface or disable any person, throws or applies acid on that person, shall be punished with imprisonment for life or not less than fourteen years and a minimum fine of one million rupees.', contentUrdu: 'جو کوئی نیت یا علم کے ساتھ کسی کے چہرے کو بگاڑنے، معذور کرنے کے لیے ایسڈ پھینکے وہ قیدِ بامشقت یا 14 سال سے کم نہ ہو اور دس لاکھ روپے جرمانے کا مستحق ہوگا۔' },
    ],
    amendments: [],
  },
  {
    title: 'Punjab Protection of Women Against Violence Act 2016',
    titleUrdu: 'پنجاب خواتین کو تشدد سے تحفظ ایکٹ 2016',
    slug: 'punjab-protection-of-women-against-violence-act-2016',
    categorySlug: 'womens-rights-law',
    yearEnacted: 2016,
    jurisdiction: 'punjab',
    status: 'active',
    summary:
      'Comprehensive Punjab legislation to protect women from domestic, psychological, economic and sexual violence. Establishes Women Protection Centers, a universal helpline, protection committees, and provides for protection orders, residence orders, and interim monetary relief for victims.',
    summaryUrdu:
      'پنجاب میں خواتین کو گھریلو، نفسیاتی، معاشی اور جنسی تشدد سے بچانے کا جامع قانون۔ ویمن پروٹیکشن سینٹرز، ہیلپ لائن، تحفظ کمیٹیاں قائم کرتا ہے، اور تحفظی احکامات، رہائشی احکامات، اور متاثرہ خواتین کے لیے عارضی مالی مدد فراہم کرتا ہے۔',
    gazetteReference: 'Punjab Act XVII of 2016',
    promulgatingAuthority: 'Provincial Assembly of Punjab',
    applicabilityTags: ['Women', 'Families', 'NGOs'],
    sections: [
      { sectionNumber: '7', title: 'Protection orders', content: 'The Court may pass a protection order to restrain the defendant from committing an act of violence against the aggrieved person.', contentUrdu: 'عدالت متاثرہ کے خلاف تشدد کے عمل سے مدعی علیہ کو روکنے کا تحفظی حکم پاس کر سکتی ہے۔' },
      { sectionNumber: '8', title: 'Residence orders', content: 'The Court may pass a residence order restraining the defendant from entering the place of residence of the aggrieved person, even if it is jointly owned.', contentUrdu: 'عدالت مدعی علیہ کو متاثرہ کی رہائش گاہ میں داخل ہونے سے روک سکتی ہے، حتیٰ اگر مشترکہ ملکیت ہو۔' },
      { sectionNumber: '17', title: 'Women Protection Centers', content: 'The Government shall establish Women Protection Centers to provide shelter, medical treatment, psychological counseling, and legal aid to aggrieved persons.', contentUrdu: 'حکومت ویمن پروٹیکشن سینٹرز قائم کرے گی جو پناہ، طبی علاج، نفسیاتی مشاورت، اور قانونی امداد فراہم کریں گے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Sindh Hindu Marriage Registration Act 2016',
    titleUrdu: 'سندھ ہندو میریج رجسٹریشن ایکٹ 2016',
    slug: 'sindh-hindu-marriage-registration-act-2016',
    categorySlug: 'womens-rights-law',
    yearEnacted: 2016,
    jurisdiction: 'sindh',
    status: 'active',
    summary:
      'Sindh-specific legislation enabling formal registration of Hindu marriages in the province, providing legal identity and rights to Hindu women and children. Closely related to the federal Hindu Marriage Act 2017.',
    summaryUrdu:
      'سندھ میں ہندو شادیوں کے باقاعدہ اندراج کا قانون، ہندو خواتین اور بچوں کو قانونی شناخت اور حقوق فراہم کرتا ہے۔ فیڈرل ہندو میریج ایکٹ 2017 کے قریب متعلق۔',
    gazetteReference: 'Sindh Act VIII of 2016',
    promulgatingAuthority: 'Provincial Assembly of Sindh',
    applicabilityTags: ['Hindu Community', 'Minorities'],
    sections: [
      { sectionNumber: '5', title: 'Marriage registration', content: 'A marriage between two Hindus may be solemnized under this Act and registered with the Marriage Registration Officer within 45 days.', contentUrdu: 'دو ہندوں کے درمیان شادی اس ایکٹ کے تحت ادا کی جا سکتی ہے اور 45 دن کے اندر میریج رجسٹریشن افسر کے پاس رجسٹر کی جائے۔' },
    ],
    amendments: [],
  },

  // ===================== ENVIRONMENTAL LAW =====================
  {
    title: 'Pakistan Environmental Protection Act 1997',
    titleUrdu: 'پاکستان انوائرمنٹل پروٹیکشن ایکٹ 1997',
    slug: 'pakistan-environmental-protection-act-1997',
    categorySlug: 'environmental-law',
    yearEnacted: 1997,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Federal umbrella law for environmental protection in Pakistan. Establishes the Pakistan Environmental Protection Agency (EPA), provides for Environmental Impact Assessments (EIA), and prohibits discharge of harmful substances. Penalties include fines and imprisonment.',
    summaryUrdu:
      'پاکستان میں ماحولیاتی تحفظ کا وفاقی چھتر قانون۔ پاکستان انوائرمنٹل پروٹیکشن ایجنسی (EPA) قائم کرتا ہے، ماحولیاتی اثر تشخیص (EIA) فراہم کرتا ہے، اور نقصان دہ مادوں کے اخراج پر پابندی عائد کرتا ہے۔ سزاؤں میں جرمانہ اور قید شامل ہیں۔',
    gazetteReference: 'Act XXXIV of 1997',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Businesses', 'Industries', 'Individuals', 'Government'],
    sections: [
      { sectionNumber: '11', title: 'Prohibition of discharging harmful substances', content: 'No person shall discharge or emit any effluent, waste, air pollutant or noise in excess of the National Environmental Quality Standards.', contentUrdu: 'کوئی شخص نیشنل انوائرمنٹل کوالٹی سٹینڈرڈز سے زیادہ کوئی افلونٹ، فضلہ، ہوا آلودہ کرنے والا، یا شور خارج نہ کرے۔' },
      { sectionNumber: '12', title: 'Initial Environmental Examination (IEE) and EIA', content: 'No person shall commence construction or operation of any project that is likely to have an adverse environmental impact without filing an IEE or EIA and obtaining approval from the EPA.', contentUrdu: 'کوئی شخص کسی ایسے منصوبے کی تعمیر یا عمل شروع نہ کرے جس کے ماحولیاتی اثرات منفی ہو سکتے ہیں، بغیر IEE یا EIA EPA سے منظور کیے۔' },
      { sectionNumber: '17', title: 'Penalties', content: 'Whoever contravenes any provision of this Act or fails to comply with an order shall be punished with imprisonment for a term which may extend to two years, or with fine, or both.', contentUrdu: 'جو کوئی اس ایکٹ کی کسی شق کی خلاف ورزی کرے یا کسی حکم کی پابندی نہ کرے وہ دو سال تک قید یا جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [
      { amendmentYear: 2012, amendmentTitle: 'Amendment for hazardous substances', description: 'Schedule expanded to include electronic waste and chemical effluents.', gazetteReference: 'Notification' },
    ],
  },
  {
    title: 'Pakistan Climate Change Act 2017',
    titleUrdu: 'پاکستان کلائمیٹ چینج ایکٹ 2017',
    slug: 'pakistan-climate-change-act-2017',
    categorySlug: 'environmental-law',
    yearEnacted: 2017,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Establishes the Climate Change Council and the Climate Change Authority to coordinate Pakistan\'s response to climate change. Implements international climate commitments (Paris Agreement), promotes adaptation, and oversees carbon reduction efforts.',
    summaryUrdu:
      'کلائمیٹ چینج کونسل اور کلائمیٹ چینج اتھارٹی قائم کرتا ہے تاکہ موسمیاتی تبدیلی کے جواب میں پاکستان کا ردعمل ہم آہنگ ہو۔ بین الاقوامی موسمیاتی وعدوں (پیرس معاہدہ) پر عمل، مطابقت کو فروغ، اور کاربن میں کمی کی نگرانی۔',
    gazetteReference: 'Act XXV of 2017',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Government', 'Businesses', 'Civil Society'],
    sections: [
      { sectionNumber: '4', title: 'Climate Change Council', content: 'The Federal Government shall establish a Climate Change Council, chaired by the Prime Minister, to coordinate national climate change policy.', contentUrdu: 'وفاقی حکومت کلائمیٹ چینج کونسل قائم کرے گی، جس کی سربراہی وزیر اعظم کرے گی۔' },
      { sectionNumber: '5', title: 'Functions of the Council', content: 'The Council shall approve and monitor the National Climate Change Policy, integrate climate considerations into development planning, and oversee international commitments.', contentUrdu: 'کونسل نیشنل کلائمیٹ چینج پالیسی منظور اور نگرانی کرے گی، موسمیاتی غور کو ترقیاتی منصوبہ بندی میں ضم کرے گی، اور بین الاقوامی وعدوں کی نگرانی کرے گی۔' },
    ],
    amendments: [],
  },
  {
    title: 'Islamabad Capital Territory (ICT) Solid Waste Management Bye-laws 2018',
    titleUrdu: 'اسلام آباد سولڈ ویسٹ مینجمنٹ بائی لاز 2018',
    slug: 'ict-solid-waste-management-bye-laws-2018',
    categorySlug: 'environmental-law',
    yearEnacted: 2018,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Municipal bye-laws governing the segregation, collection, transportation, treatment, and disposal of solid waste in Islamabad. Provides penalties for littering, illegal dumping, and non-segregation of waste.',
    summaryUrdu:
      'اسلام آباد میں سولڈ ویسٹ کی علیحدگی، جمع کاری، نقل و حمل، علاج، اور ختم کرنے کے بلدیاتی بائی لاز۔ کچرا پھینکنے، غیر قانونی ڈمپنگ، اور کچرے کی عدم علیحدگی پر سزاؤں کا تعین۔',
    gazetteReference: 'ICT Notification 2018',
    promulgatingAuthority: 'Islamabad Capital Territory Administration',
    applicabilityTags: ['Residents', 'Businesses', 'Municipal Authorities'],
    sections: [
      { sectionNumber: '6', title: 'Segregation of waste', content: 'All generators of solid waste shall segregate their waste into biodegradable and non-biodegradable fractions at source.', contentUrdu: 'سولڈ ویسٹ بنانے والے تمام افراد اپنے کچرے کو حیاتیاتی طور پر گھلنے والے اور نہ گھلنے والے حصوں میں الگ کریں گے۔' },
    ],
    amendments: [],
  },

  // ===================== CORPORATE & COMPANY LAW =====================
  {
    title: 'Companies Act 2017',
    titleUrdu: 'کمپنیز ایکٹ 2017',
    slug: 'companies-act-2017',
    categorySlug: 'corporate-company-law',
    yearEnacted: 2017,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Modern statute governing the incorporation, regulation, and winding up of companies in Pakistan. Replaced the Companies Ordinance 1984. Administered by the Securities and Exchange Commission of Pakistan (SECP). Provides for single-member companies, director duties, audit requirements, and minority shareholder protections.',
    summaryUrdu:
      'پاکستان میں کمپنیوں کے قیام، تنظیم، اور ختم کرنے کا جدید قانون۔ کمپنیز آرڈیننس 1984 کی جگہ۔ سیکیورٹیز اینڈ ایکسچینج کمیشن آف پاکستان (SECP) کے زیرِ انتظام۔ سنگل ممبر کمپنیاں، ڈائریکٹرز کی ذمہ داریاں، آڈٹ کی شرائط، اور اقلیتی شیئر ہولڈرز کے تحفظات۔',
    gazetteReference: 'Act XIX of 2017',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Companies', 'Directors', 'Investors', 'Accountants'],
    sections: [
      { sectionNumber: '16', title: 'Single member company', content: 'A company may be formed as a single member company. The member may be a natural person, an artificial person, or a body corporate.', contentUrdu: 'کمپنی سنگل ممبر کمپنی کے طور پر قائم کی جا سکتی ہے۔ ممبر ایک قدرتی شخص، مصنوعی شخص، یا کارپوریٹ باڈی ہو سکتی ہے۔' },
      { sectionNumber: '173', title: 'Duties of directors', content: 'A director of a company shall act honestly and in good faith with a view to the best interests of the company, and exercise the care, diligence and skill that a reasonably prudent person would exercise in comparable circumstances.', contentUrdu: 'کمپنی کا ڈائریکٹر ایمانداری اور خیر سلوکی سے کمپنی کے بہترین مفادات کے پیشِ نظر کام کرے گا، اور احتیاط، احتیاط، اور مہارت کا استعمال کرے گا جو ایک معقول محتاط شخص استعمال کرتا۔' },
      { sectionNumber: '223', title: 'Audit requirements', content: 'Every company shall appoint an auditor within 90 days of incorporation. The auditor shall be a chartered accountant within the meaning of the Chartered Accountants Ordinance 1961.', contentUrdu: 'ہر کمپنی قیام کے 90 دن کے اندر آڈیٹر مقرر کرے۔ آڈیٹر چارٹرڈ اکاؤنٹنٹس آرڈیننس 1961 کے تحت چارٹرڈ اکاؤنٹنٹ ہو۔' },
    ],
    amendments: [],
  },
  {
    title: 'Partnership Act 1932',
    titleUrdu: 'پارٹنرشپ ایکٹ 1932',
    slug: 'partnership-act-1932',
    categorySlug: 'corporate-company-law',
    yearEnacted: 1932,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Governs partnership firms in Pakistan. Defines partnership as the relation between persons sharing profits of a business carried on by all or any of them acting for all. Requires registration with the Registrar of Firms for full legal protections.',
    summaryUrdu:
      'پاکستان میں شراکت داری فرموں کو منظم کرتا ہے۔ شراکت داری کی تعریف اشخاص کے درمیان کاروبار کے منافع کی تقسیم کا رشتہ، جسے سب یا کوئی ایک سب کی طرف سے چلائے۔ مکمل قانونی تحفظات کے لیے رجسٹرار آف فرمز کے ساتھ رجسٹری لازم۔',
    gazetteReference: 'Act VIII of 1932',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Partners', 'Small Businesses', 'Lawyers'],
    sections: [
      { sectionNumber: '4', title: 'Definition of partnership', content: '"Partnership" is the relation between persons who have agreed to share the profits of a business carried on by all or any of them acting for all.', contentUrdu: '"شراکت داری" ان اشخاص کے درمیان رشتہ ہے جو کسی کاروبار کے منافع کی تقسیم پر متفق ہوئے، جسے سب یا کوئی ایک سب کی طرف سے چلائے۔' },
      { sectionNumber: '7', title: 'Rules for partnership conduct', content: 'Partners are bound to render true accounts and full information of all things affecting the partnership to any partner or his legal representative.', contentUrdu: 'شراکت دار شرکت کو متاثر کرنے والی تمام باتوں کے سچے حسابات اور مکمل معلومات فراہم کرنے کے پابند ہیں۔' },
      { sectionNumber: '26', title: 'Liability of partners', content: 'Every partner is liable jointly with all other partners for all debts of the firm incurred while he is a partner.', contentUrdu: 'ہر شراکت دار جب وہ شراکت دار ہو، فرم کے تمام دوسرے شراکت داروں کے ساتھ اجتماعی طور پر فرم کے تمام قرضوں کا ذمہ دار ہے۔' },
    ],
    amendments: [],
  },

  // ===================== ELECTION LAW =====================
  {
    title: 'Elections Act 2017',
    titleUrdu: 'الیکشنز ایکٹ 2017',
    slug: 'elections-act-2017',
    categorySlug: 'election-law',
    yearEnacted: 2017,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Consolidates the law relating to the conduct of elections in Pakistan. Establishes the Election Commission of Pakistan (ECP), defines voter eligibility, candidate qualifications, election disputes, and the procedure for general, local, and by-elections. Provides for delimitation of constituencies and results consolidation.',
    summaryUrdu:
      'پاکستان میں الیکشن کے انعقاد سے متعلق قانون کا اختصاص۔ الیکشن کمیشن آف پاکستان (ECP) قائم کرتا ہے، ووٹر اہلیت، امیدوار کی قابلیت، الیکشن تنازعات، اور عام، مقامی، اور ضمنی الیکشن کے طریقہ کار کا تعین کرتا ہے۔ حلقہ بندی اور نتائج کی تشکیل کے انتظام۔',
    gazetteReference: 'Act XXXIII of 2017',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Voters', 'Candidates', 'Political Parties', 'ECP Officials'],
    sections: [
      { sectionNumber: '27', title: 'Qualifications of voters', content: 'A person shall be entitled to be enrolled as a voter in an electoral area if he is a citizen of Pakistan, is not less than 18 years of age, and is not declared by a competent court to be of unsound mind.', contentUrdu: 'ایک شخص ووٹر کے طور پر اندراج کا حقدار ہوگا اگر وہ پاکستان کا شہری ہو، 18 سال سے کم نہ ہو، اور عدالت اسے ذہنی طور پر غیر معتبر قرار نہ دے۔' },
      { sectionNumber: '99', title: 'Disqualification of candidates', content: 'A person is disqualified from being elected as a member of an Assembly if he is not a citizen of Pakistan, is of unsound mind, is undischarged insolvent, has been convicted for offences involving moral turpitude, or holds any office of profit.', contentUrdu: 'کوئی شخص اسمبلی کے رکن کے طور پر منتخب ہونے سے نااہل ہے اگر وہ پاکستان کا شہری نہ ہو، ذہنی طور پر غیر معتبر ہو، ادائیگی شدہ دیوالہ نہ ہو، اخلاقی بے راستے کے جرائم میں سزا یافتہ ہو، یا منافع کا عہدہ رکھتا ہو۔' },
      { sectionNumber: '215', title: 'Election Commission of Pakistan', content: 'The Election Commission shall consist of the Chief Election Commissioner and four members, one from each province, appointed by the President in consultation with the parliamentary committee.', contentUrdu: 'الیکشن کمیشن کا سربراہ چیف الیکشن کمشنر اور چار ممبران پر مشتمل ہوگا، ایک فی صوبہ، صدر کی طرف سے پارلیمانی کمیٹی سے مشاورت سے مقرر۔' },
    ],
    amendments: [
      { amendmentYear: 2023, amendmentTitle: 'Elections (Amendment) Act 2023', description: 'Reserved seats for women and minorities revised; electronic voting machine provisions adjusted.', gazetteReference: 'Act of 2023' },
    ],
  },

  // ===================== INTELLECTUAL PROPERTY =====================
  {
    title: 'Copyright Ordinance 1962',
    titleUrdu: 'کاپی رائٹ آرڈیننس 1962',
    slug: 'copyright-ordinance-1962',
    categorySlug: 'intellectual-property-law',
    yearEnacted: 1962,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Protects original literary, dramatic, musical, and artistic works, cinematographic films, and sound recordings. Grants authors exclusive rights to reproduce, publish, perform, and adapt their works. Administered by the Copyright Office under IPO Pakistan.',
    summaryUrdu:
      'اصل ادبی، ڈرامائی، موسیقی، اور فن کارانہ کاموں، سینماٹوگرافک فلموں، اور آواز کی ریکارڈنگز کا تحفظ۔ مصنفین کو اپنے کاموں کو دوبارہ پیدا کرنے، شائع کرنے، پیش کرنے، اور ڈھالنے کا خصوصی حق دیتا ہے۔ آئی پی او پاکستان کے تحت کاپی رائٹ آفس کے زیرِ انتظام۔',
    gazetteReference: 'Ordinance XXXIV of 1962',
    promulgatingAuthority: 'Government of Pakistan',
    applicabilityTags: ['Authors', 'Artists', 'Musicians', 'Publishers', 'Software Developers'],
    sections: [
      { sectionNumber: '10', title: 'Term of copyright', content: 'Copyright in a work shall subsist during the lifetime of the author and for fifty years after the death of the author.', contentUrdu: 'کاپی رائٹ کسی کام میں مصنف کی زندگی کے دوران اور موت کے بعد پچاس سال تک قائم رہے گا۔' },
      { sectionNumber: '13', title: 'Acts constituting infringement', content: 'Copyright is infringed by any person who, without the consent of the owner of the copyright, does or authorizes the doing of any act the exclusive right to do which is by this Ordinance conferred upon the owner of the copyright.', contentUrdu: 'کاپی رائٹ کی خلاف ورزی اس شخص کرتا ہے جو، کاپی رائٹ مالک کی اجازت کے بغیر، کسی ایسے عمل کا کرتا ہے یا کرنے کی اجازت دیتا ہے جس کا خصوصی حق اس آرڈیننس کے تحت مالک کو حاصل ہے۔' },
      { sectionNumber: '50', title: 'Penalty for infringement', content: 'Any person who knowingly infringes or abets the infringement of copyright shall be punishable with imprisonment which may extend to three years, or with fine, or both.', contentUrdu: 'کوئی شخص جو جان بوجھ کر کاپی رائٹ کی خلاف ورزی کرے یا اس کی خلاف ورزی میں مدد کرے وہ تین سال تک قید یا جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [
      { amendmentYear: 2000, amendmentTitle: 'Copyright (Amendment) Ordinance 2000', description: 'Added provisions for digital content and software protection.', gazetteReference: 'Ordinance of 2000' },
      { amendmentYear: 2010, amendmentTitle: 'Copyright (Amendment) Act 2010', description: 'Extended copyright protection to internet/digital works and increased penalties.', gazetteReference: 'Act of 2010' },
    ],
  },
  {
    title: 'Trademarks Ordinance 2001',
    titleUrdu: 'ٹریڈ مارکس آرڈیننس 2001',
    slug: 'trademarks-ordinance-2001',
    categorySlug: 'intellectual-property-law',
    yearEnacted: 2001,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Modern law for the registration and protection of trademarks in Pakistan. Allows registration of marks for goods and services, three-dimensional marks, collective marks, and certification marks. Provides opposition proceedings and infringement remedies.',
    summaryUrdu:
      'پاکستان میں ٹریڈ مارکس کے رجسٹریشن اور تحفظ کا جدید قانون۔ مال اور خدمات کے لیے نشانات، تھری ڈائمینشنل مارکس، اجتماعی مارکس، اور تصدیقی مارکس کے رجسٹریشن کی اجازت دیتا ہے۔ اعتراضی کارروائی اور خلاف ورزی کی چارہ جوئی فراہم کرتا ہے۔',
    gazetteReference: 'Ordinance XIX of 2001',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Businesses', 'Brand Owners', 'Lawyers'],
    sections: [
      { sectionNumber: '4', title: 'Registration of trademarks', content: 'A trademark may be registered in the Register of Trademarks in respect of particular goods or classes of goods or services in the manner provided in this Ordinance.', contentUrdu: 'کوئی ٹریڈ مارک اس آرڈیننس کے طریقہ کار کے مطابق مخصوص مال یا مال کی اقسام یا خدمات کے لحاظ سے ٹریڈ مارکس رجسٹر میں درج کیا جا سکے گا۔' },
      { sectionNumber: '34', title: 'Duration and renewal of registration', content: 'The registration of a trademark shall be for a period of ten years and may be renewed for further periods of ten years.', contentUrdu: 'ٹریڈ مارک کا رجسٹریشن دس سال کی مدت کے لیے ہوگا اور مزید دس سال کی مدت کے لیے تجدید کیا جا سکے گا۔' },
      { sectionNumber: '40', title: 'Infringement of trademarks', content: 'A registered trademark is infringed by a person who, not being a registered proprietor or a registered user using by way of permitted use, uses in the course of trade a mark which is identical with or deceptively similar to the trademark.', contentUrdu: 'رجسٹرڈ ٹریڈ مارک کی خلاف ورزی اس شخص کرتا ہے جو، رجسٹرڈ مالک یا مجاز استعمال کرنے والا رجسٹرڈ صارف نہ ہوتے ہوئے، تجارت کے دوران ایسا نشان استعمال کرے جو ٹریڈ مارک کے مماثل یا دھوکے سے ملتا ہو۔' },
    ],
    amendments: [],
  },
  {
    title: 'Patents Ordinance 2000',
    titleUrdu: 'پیٹنٹس آرڈیننس 2000',
    slug: 'patents-ordinance-2000',
    categorySlug: 'intellectual-property-law',
    yearEnacted: 2000,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Governs the grant of patents for inventions in Pakistan. Provides for the criteria of novelty, inventive step, and industrial application. Patent protection lasts 20 years from filing. Administered by the Patent Office under IPO Pakistan.',
    summaryUrdu:
      'پاکستان میں ایجادات کے لیے پیٹنٹس کے عطا کے قانون۔ نئائیت، ایجاداتی قدم، اور صنعتی اطلاق کے معیارات فراہم کرتا ہے۔ پیٹنٹ تحفظ داخلہ سے 20 سال تک رہتا ہے۔ آئی پی او پاکستان کے تحت پیٹنٹ آفس کے زیرِ انتظام۔',
    gazetteReference: 'Ordinance LXI of 2000',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Inventors', 'Tech Companies', 'Researchers', 'Patent Agents'],
    sections: [
      { sectionNumber: '9', title: 'Patentable inventions', content: 'An invention is patentable if it is new, involves an inventive step, and is capable of industrial application. An invention may be a product or a process.', contentUrdu: 'کوئی ایجاد پیٹنٹ کے قابل ہے اگر وہ نئی ہو، ایجاداتی قدم رکھتی ہو، اور صنعتی اطلاق کے قابل ہو۔ ایجاد کوئی مصنوع یا عمل ہو سکتی ہے۔' },
      { sectionNumber: '30', title: 'Term of patent', content: 'The term of a patent shall be twenty years from the date of filing of the application for the patent.', contentUrdu: 'پیٹنٹ کی مدت درخواست داخل کرنے کی تاریخ سے بیس سال ہوگی۔' },
      { sectionNumber: '43', title: 'Rights of patentee', content: 'A patentee has the exclusive right to prevent third parties from making, using, offering for sale, selling, or importing the patented product or process without consent.', contentUrdu: 'پیٹنٹی کا خصوصی حق ہے کہ وہ تیسری جماعتوں کو پیٹنٹ شدہ مصنوعات یا عمل بنانے، استعمال کرنے، فروخت کے لیے پیش کرنے، فروخت کرنے، یا درآمد کرنے سے اجازت کے بغیر روکے۔' },
    ],
    amendments: [],
  },

  // ===================== BANKING & FINANCE LAW =====================
  {
    title: 'Banking Companies Ordinance 1962',
    titleUrdu: 'بینکنگ کمپنیز آرڈیننس 1962',
    slug: 'banking-companies-ordinance-1962',
    categorySlug: 'banking-finance-law',
    yearEnacted: 1962,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Principal statute regulating banking companies in Pakistan. Covers licensing, capital requirements, reserve requirements, restrictions on loans, accounts and audit, and liquidation. Administered by the State Bank of Pakistan (SBP).',
    summaryUrdu:
      'پاکستان میں بینکنگ کمپنیوں کو منظم کرنے کا بنیادی قانون۔ لائسنسنگ، سرمائے کی ضروریات، ریزرو ضروریات، قرضوں پر پابندیاں، حسابات اور آڈٹ، اور ختم شدگی۔ اسٹیٹ بینک آف پاکستان (SBP) کے زیرِ انتظام۔',
    gazetteReference: 'Ordinance LVII of 1962',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Banks', 'Financial Institutions', 'Accountants', 'Investors'],
    sections: [
      { sectionNumber: '28', title: 'Restrictions on loans', content: 'No banking company shall grant loans or advances against the security of its own shares, or against the security of any shares of its subsidiary or holding company.', contentUrdu: 'کوئی بینکنگ کمپنی اپنے شیئرز کی حفاظت پر یا اپنی ذیلی یا ہولڈنگ کمپنی کے کسی شیئرز کی حفاظت پر قرض نہ دے۔' },
      { sectionNumber: '31', title: 'Submission of returns', content: 'Every banking company shall submit to the State Bank a monthly return showing its assets and liabilities in Pakistan and at its principal place of business.', contentUrdu: 'ہر بینکنگ کمپنی اسٹیٹ بینک کو ماہانہ رپورٹ پیش کرے جس میں پاکستان اور مرکزی کاروباری جگہ پر اس کے اثاثے اور ذمہ داریاں دکھائی جائیں۔' },
      { sectionNumber: '37', title: 'Audit', content: 'The annual accounts and balance sheet of every banking company shall be audited by a qualified auditor.', contentUrdu: 'ہر بینکنگ کمپنی کے سالانہ حسابات اور بیلنس شیٹ کو قابل آڈیٹر کے ذریعے آڈٹ کیا جائے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Negotiable Instruments Act 1881',
    titleUrdu: 'قابلِ تبادلہ آلات ایکٹ 1881',
    slug: 'negotiable-instruments-act-1881',
    categorySlug: 'banking-finance-law',
    yearEnacted: 1881,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Governs negotiable instruments in Pakistan — primarily promissory notes, bills of exchange, and cheques. Famous for Section 138 which criminalizes cheque dishonor (bouncing) — punishable with imprisonment up to 2 years or fine up to twice the cheque amount.',
    summaryUrdu:
      'پاکستان میں قابلِ تبادلہ آلات کو منظم کرتا ہے — بنیادی طور پر پرومیسری نوٹس، بلز آف ایکسچینج، اور چیکس۔ شق 138 مشہور ہے جو چیک باؤنس کو جرم قرار دیتی ہے — 2 سال قید یا چیک رقم کے دوگنے جرمانے کی سزا۔',
    gazetteReference: 'Act XXVI of 1881',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Businesses', 'Individuals', 'Banks', 'Lawyers'],
    sections: [
      { sectionNumber: '6', title: 'Cheque definition', content: 'A "cheque" is a bill of exchange drawn on a specified banker and not expressed to be payable otherwise than on demand.', contentUrdu: '"چیک" ایک بل آف ایکسچینج ہے جو مخصوص بینکر پر کھینچا گیا ہو اور ڈیمانڈ پر قابلِ ادا ظاہر نہ ہو۔' },
      { sectionNumber: '138', title: 'Dishonor of cheque', content: 'Whoever draws a cheque for discharge of any debt and the cheque is dishonored on presentation shall be punishable with imprisonment up to two years, or with fine up to twice the amount of the cheque, or with both.', contentUrdu: 'جو کوئی قرض کی ادائیگی کے لیے چیک بھرتا ہے اور وہ پیش کرنے پر باؤنس ہو جائے وہ دو سال قید یا چیک رقم کے دوگنے جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [],
  },

  // ===================== IMMIGRATION & CITIZENSHIP LAW =====================
  {
    title: 'Citizenship Act 1951',
    titleUrdu: 'شہریت ایکٹ 1951',
    slug: 'citizenship-act-1951',
    categorySlug: 'immigration-citizenship-law',
    yearEnacted: 1951,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Governs the acquisition, termination, and deprivation of Pakistani citizenship. Provides for citizenship by birth, descent, migration, naturalization, and marriage. Administered by the Federal Government through the Directorate General of Immigration & Passports.',
    summaryUrdu:
      'پاکستانی شہریت کے حصول، ختم ہونے، اور چھین لینے کو منظم کرتا ہے۔ پیدائش، نسب، امہراجن، قدرسازی، اور شادی کے ذریعے شہریت فراہم کرتا ہے۔ ڈائریکٹوریٹ جنرل آف امہراجن و پاسپورٹس کے زیرِ انتظام۔',
    gazetteReference: 'Act II of 1951',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Individuals', 'Foreign Nationals', 'Immigration Officials'],
    sections: [
      { sectionNumber: '4', title: 'Citizenship by birth', content: 'Every person born in Pakistan after the commencement of this Act shall be a citizen of Pakistan by birth, except where the father possesses diplomatic immunity.', contentUrdu: 'اس ایکٹ کے آغاز کے بعد پاکستان میں پیدا ہونے والا ہر شخص پیدائش کے لحاظ سے پاکستان کا شہری ہوگا، جب تک والد کو سفارتکاری استثنا حاصل نہ ہو۔' },
      { sectionNumber: '5', title: 'Citizenship by descent', content: 'A person born outside Pakistan whose father is a citizen of Pakistan shall be a citizen of Pakistan by descent, provided the birth is registered with the Pakistan consulate within one year.', contentUrdu: 'پاکستان کے باہر پیدا ہونے والا شخص جس کے والد پاکستانی شہری ہوں، نسب کے لحاظ سے پاکستانی شہری ہوگا، بشرطیکہ پیدائش ایک سال کے اندر پاکستانی قونصل خانے میں درج ہو۔' },
      { sectionNumber: '10', title: 'Citizenship by naturalization', content: 'The Federal Government may grant a certificate of naturalization to a person who has resided in Pakistan for at least one year immediately before application and has resided in Pakistan for at least four years out of the previous seven years.', contentUrdu: 'وفاقی حکومت قدرسازی کا سرٹیفکیٹ اس شخص کو دے سکتی ہے جو درخواست سے فوراً پہلے کم از کم ایک سال پاکستان میں مقیم رہا ہو اور پچھلے سات سال میں سے کم از کم چار سال پاکستان میں مقیم رہا ہو۔' },
    ],
    amendments: [],
  },
  {
    title: 'Passport Act 1974',
    titleUrdu: 'پاسپورٹ ایکٹ 1974',
    slug: 'passport-act-1974',
    categorySlug: 'immigration-citizenship-law',
    yearEnacted: 1974,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Regulates the issuance, refusal, and confiscation of Pakistani passports. Makes it an offence to travel without a valid passport, forge a passport, or use another person\'s passport. Penalties include imprisonment up to 3 years.',
    summaryUrdu:
      'پاکستانی پاسپورٹ کی جاری، انکار، اور ضبطی کو منظم کرتا ہے۔ بغیر قابل پاسپورٹ سفر کرنا، پاسپورٹ جعلی بنانا، یا کسی اور کا پاسپورٹ استعمال کرنا جرم ہے۔ سزاؤں میں 3 سال تک قید شامل ہے۔',
    gazetteReference: 'Act XX of 1974',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Individuals', 'Travelers', 'Immigration Officials'],
    sections: [
      { sectionNumber: '3', title: 'Issue of passports', content: 'The Federal Government may issue passports to citizens of Pakistan on application and payment of the prescribed fee.', contentUrdu: 'وفاقی حکومت درخواست اور مقررہ فیس ادا کرنے پر پاکستانی شہریوں کو پاسپورٹ جاری کر سکتی ہے۔' },
      { sectionNumber: '7', title: 'Penalty for travel without passport', content: 'Whoever travels from Pakistan to any country outside Pakistan without a valid passport shall be punishable with imprisonment up to three years or fine or both.', contentUrdu: 'جو کوئی قابل پاسپورٹ کے بغیر پاکستان سے کسی غیر ملک کا سفر کرے وہ تین سال تک قید یا جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [],
  },
  {
    title: 'Foreigners Act 1946',
    titleUrdu: 'غیر ملکی ایکٹ 1946',
    slug: 'foreigners-act-1946',
    categorySlug: 'immigration-citizenship-law',
    yearEnacted: 1946,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Empowers the Federal Government to regulate the entry, presence, and departure of foreigners in Pakistan. Provides for visas, registration with police, restricted areas, and deportation of foreigners who violate conditions.',
    summaryUrdu:
      'وفاقی حکومت کو پاکستان میں غیر ملکیوں کی داخلہ، موجودگی، اور روانگی کو منظم کرنے کا اختیار دیتا ہے۔ ویزا، پولیس کے ساتھ رجسٹریشن، محدود علاقوں، اور شرائط کی خلاف ورزی کرنے والے غیر ملکیوں کی ملک بدرگی فراہم کرتا ہے۔',
    gazetteReference: 'Act XXXI of 1946',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Foreign Nationals', 'Immigration Officials', 'Border Authorities'],
    sections: [
      { sectionNumber: '3', title: 'Power to regulate entry', content: 'The Federal Government may by order regulate the entry into Pakistan of foreigners and the conditions of their stay.', contentUrdu: 'وفاقی حکومت حکم کے ذریعے پاکستان میں غیر ملکیوں کی داخلہ اور ان کے قیام کی شرائط کو منظم کر سکتی ہے۔' },
      { sectionNumber: '14', title: 'Penalties', content: 'A foreigner who enters Pakistan without a valid passport or visa, or remains in Pakistan beyond the authorized period, shall be punishable with imprisonment up to three years and a fine.', contentUrdu: 'کوئی غیر ملکی جو قابل پاسپورٹ یا ویزا کے بغیر پاکستان میں داخل ہو یا مجاز مدت سے زیادہ رہے وہ تین سال قید اور جرمانے کا مستحق ہوگا۔' },
    ],
    amendments: [],
  },

  // ===================== HEALTH LAW =====================
  {
    title: 'Drug Act 1976',
    titleUrdu: 'ڈرگ ایکٹ 1976',
    slug: 'drug-act-1976',
    categorySlug: 'health-law',
    yearEnacted: 1976,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Governs the import, export, manufacture, storage, distribution, and sale of drugs in Pakistan. Establishes the Drug Regulatory Authority of Pakistan (DRAP). Provides for registration of drugs, licensing of manufacturers, and quality control. Violations carry imprisonment and fines.',
    summaryUrdu:
      'پاکستان میں ادویات کی درآمد، برآمد، پیداوار، ذخیرہ، تقسیم، اور فروخت کو منظم کرتا ہے۔ ڈرگ ریگولیٹری اتھارٹی آف پاکستان (DRAP) قائم کرتا ہے۔ ادویات کی رجسٹری، مینوفیکچررز کی لائسنسنگ، اور معیار کنٹرول فراہم کرتا ہے۔ خلاف ورزیوں پر قید اور جرمانے کی سزا۔',
    gazetteReference: 'Act XXXI of 1976',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Pharmaceutical Companies', 'Pharmacists', 'Doctors', 'Patients'],
    sections: [
      { sectionNumber: '7', title: 'Registration of drugs', content: 'No drug shall be imported, manufactured, or sold in Pakistan unless it is registered with the Registration Board of DRAP.', contentUrdu: 'کوئی دوا DRAP کی رجسٹریشن بورڈ کے ساتھ رجسٹر ہونے کے بغیر پاکستان میں درآمد، پیداوار، یا فروخت نہ ہو۔' },
      { sectionNumber: '23', title: 'Penalties for manufacture of counterfeit drugs', content: 'Whoever manufactures, sells, or distributes a counterfeit or spurious drug shall be punishable with imprisonment up to ten years and fine up to one million rupees.', contentUrdu: 'جو کوئی جعلی یا ناقابل اعتماد دوا بنائے، فروخت کرے، یا تقسیم کرے وہ دس سال تک قید اور دس لاکھ روپے جرمانے کا مستحق ہوگا۔' },
    ],
    amendments: [
      { amendmentYear: 2012, amendmentTitle: 'DRAP Act 2012', description: 'Established the Drug Regulatory Authority of Pakistan as an autonomous body.', gazetteReference: 'Act XXI of 2012' },
    ],
  },
  {
    title: 'Pakistan Medical & Dental Council Ordinance 1962',
    titleUrdu: 'پاکستان میڈیکل و ڈینٹل کونسل آرڈیننس 1962',
    slug: 'pakistan-medical-dental-council-ordinance-1962',
    categorySlug: 'health-law',
    yearEnacted: 1962,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Establishes the Pakistan Medical & Dental Council (PMDC) to regulate medical and dental education, register medical practitioners, and maintain professional standards. Renamed to PMC in 2022 via ordinance. Doctors must be registered to practice.',
    summaryUrdu:
      'پاکستان میڈیکل و ڈینٹل کونسل (PMDC) قائم کرتا ہے جو طبی و دانتانی تعلیم، طبی پریکٹیشنرز کی رجسٹری، اور پیشہ ورانہ معیار کو منظم کرتا ہے۔ 2022 میں آرڈیننس کے ذریعے PMC کا نام دیا گیا۔ پریکٹس کے لیے ڈاکٹرز کی رجسٹری لازم۔',
    gazetteReference: 'Ordinance XXXII of 1962',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Doctors', 'Dentists', 'Medical Students', 'Hospitals'],
    sections: [
      { sectionNumber: '22', title: 'Registration of medical practitioners', content: 'No person shall practice as a medical practitioner unless registered with the Council.', contentUrdu: 'کوئی شخص کونسل کے ساتھ رجسٹر ہونے کے بغیر طبی پریکٹیشنر کے طور پر پریکٹس نہ کرے۔' },
      { sectionNumber: '25-A', title: 'Penalty for false registration', content: 'Whoever willfully makes a false entry in the register shall be punishable with imprisonment up to two years, or fine, or both.', contentUrdu: 'جو کوئی جان بوجھ کر رجسٹر میں جھوٹا اندراج کرے وہ دو سال تک قید یا جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [
      { amendmentYear: 2022, amendmentTitle: 'PMC Ordinance 2022', description: 'Reconstituted PMDC as Pakistan Medical Commission (PMC) with enhanced powers.', gazetteReference: 'Ordinance of 2022' },
    ],
  },

  // ===================== EDUCATION LAW =====================
  {
    title: 'Higher Education Commission Ordinance 2002',
    titleUrdu: 'ہائیر ایجوکیشن کمیشن آرڈیننس 2002',
    slug: 'higher-education-commission-ordinance-2002',
    categorySlug: 'education-law',
    yearEnacted: 2002,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Establishes the Higher Education Commission (HEC) of Pakistan. HEC regulates, accredits, and funds universities and degree-awarding institutions. Sets standards for faculty qualifications, curricula, and research. Also verifies degrees for employment.',
    summaryUrdu:
      'پاکستان کا ہائیر ایجوکیشن کمیشن (HEC) قائم کرتا ہے۔ HEC یونیورسٹیز اور ڈگری دینے والے اداروں کو منظم، تصدیق، اور فنڈ کرتا ہے۔ فیکلٹی کی قابلیت، نصاب، اور تحقیق کے معیارات مقرر کرتا ہے۔ ملازمت کے لیے ڈگریز کی تصدیق بھی کرتا ہے۔',
    gazetteReference: 'Ordinance LIII of 2002',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Universities', 'Students', 'Faculty', 'Researchers'],
    sections: [
      { sectionNumber: '10', title: 'Functions of the Commission', content: 'The Commission shall formulate policies, set standards, evaluate and accredit degree programs, and allocate funds to universities.', contentUrdu: 'کمیشن پالیسیاں بنائے، معیارات مقرر کرے، ڈگری پروگراموں کی تشخیص اور تصدیق کرے، اور یونیورسٹیز کو فنڈ مختص کرے۔' },
      { sectionNumber: '16', title: 'Power to recognize degrees', content: 'The Commission shall have the power to recognize degrees and diplomas awarded by universities and degree-awarding institutions.', contentUrdu: 'کمیشن یونیورسٹیز اور ڈگری دینے والے اداروں کی طرف سے دی گئی ڈگریوں اور ڈپلوموں کو تسلیم کرنے کا اختیار رکھتا ہے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Right to Free and Compulsory Education Act 2012',
    titleUrdu: 'مفت و لازمی تعلیم کا حق ایکٹ 2012',
    slug: 'right-to-free-compulsory-education-act-2012',
    categorySlug: 'education-law',
    yearEnacted: 2012,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Implements Article 25-A of the Constitution (added by 18th Amendment) — guarantees free and compulsory education to all children aged 5-16 in the Islamabad Capital Territory. Provincial versions exist for each province.',
    summaryUrdu:
      'آئین کے آرٹیکل 25-A (18ویں ترمیم کے تحت شامل) کا نفاذ — اسلام آباد دارالحکومت علاقے میں 5-16 سال کے تمام بچوں کو مفت اور لازمی تعلیم کی ضمانت دیتا ہے۔ ہر صوبے کا اپنا ورژن موجود ہے۔',
    gazetteReference: 'Act XIV of 2012',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Children', 'Parents', 'Schools', 'Teachers'],
    sections: [
      { sectionNumber: '3', title: 'Right to education', content: 'Every child, regardless of sex, caste, creed, or religion, shall have a fundamental right to free and compulsory education in a neighborhood school.', contentUrdu: 'ہر بچہ، قطعِ نظر جنس، ذات، عقیدے، یا مذہب، قریبی اسکول میں مفت اور لازمی تعلیم کا بنیادی حق رکھتا ہے۔' },
      { sectionNumber: '5', title: 'Duty of government', content: 'The Federal Government shall ensure that every child receives free and compulsory education.', contentUrdu: 'وفاقی حکومت یقینی بنائے گی کہ ہر بچہ مفت اور لازمی تعلیم حاصل کرے۔' },
    ],
    amendments: [],
  },

  // ===================== TRAFFIC & MOTOR VEHICLE LAW =====================
  {
    title: 'Motor Vehicles Ordinance 1965',
    titleUrdu: 'موٹر گاڑیاں آرڈیننس 1965',
    slug: 'motor-vehicles-ordinance-1965',
    categorySlug: 'traffic-motor-vehicle-law',
    yearEnacted: 1965,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Governs the registration, licensing, and operation of motor vehicles in Pakistan. Requires driving licenses, vehicle fitness certificates, compulsory third-party insurance, and compliance with traffic rules. Provincial versions exist for traffic police enforcement.',
    summaryUrdu:
      'پاکستان میں موٹر گاڑیوں کی رجسٹری، لائسنسنگ، اور عمل کو منظم کرتا ہے۔ ڈرائیونگ لائسنس، گاڑی کی فٹنس سرٹیفکیٹ، لازمی تھرڈ پارٹی انشورنس، اور ٹریفک اصولوں کی پابندی ضروری۔ ٹریفک پولیس کے نفاذ کے لیے صوبائی ورژن موجود ہیں۔',
    gazetteReference: 'Ordinance XXXIX of 1965',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Drivers', 'Vehicle Owners', 'Traffic Police', 'Insurance Companies'],
    sections: [
      { sectionNumber: '23', title: 'Registration of motor vehicles', content: 'No motor vehicle shall be used in a public place unless registered under this Ordinance.', contentUrdu: 'کوئی موٹر گاڑی اس آرڈیننس کے تحت رجسٹر ہونے کے بغیر عوامی جگہ پر استعمال نہ ہو۔' },
      { sectionNumber: '33', title: 'Driving license', content: 'No person shall drive a motor vehicle in a public place unless he holds an effective driving license issued under this Ordinance.', contentUrdu: 'کوئی شخص اس آرڈیننس کے تحت جاری کردہ قابل ڈرائیونگ لائسنس کے بغیر موٹر گاڑی عوامی جگہ پر نہ چلائے۔' },
      { sectionNumber: '76', title: 'Penalty for driving without license', content: 'Whoever drives a motor vehicle without a valid driving license shall be punishable with imprisonment up to one month, or fine up to Rs. 1,000, or both.', contentUrdu: 'جو کوئی قابل ڈرائیونگ لائسنس کے بغیر موٹر گاڑی چلائے وہ ایک ماہ قید یا 1,000 روپے جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [],
  },
  {
    title: 'National Highway Safety Ordinance 2000',
    titleUrdu: 'نیشنل ہائی وے سیفٹی آرڈیننس 2000',
    slug: 'national-highway-safety-ordinance-2000',
    categorySlug: 'traffic-motor-vehicle-law',
    yearEnacted: 2000,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Establishes the National Highway Authority (NHA) and sets safety standards for national highways and motorways in Pakistan. Covers speed limits, vehicle specifications, weigh stations, and accident reporting.',
    summaryUrdu:
      'نیشنل ہائی وے اتھارٹی (NHA) قائم کرتا ہے اور پاکستان کی قومی شاہراہوں اور موٹرویز کے لیے حفاظتی معیارات مقرر کرتا ہے۔ اسپیڈ لیمٹس، گاڑیوں کی تفصیلات، وے اسٹیشنز، اور حادثے کی رپورٹنگ پر محیط۔',
    gazetteReference: 'Ordinance XL of 2000',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Drivers', 'NHA Officials', 'Transport Companies'],
    sections: [
      { sectionNumber: '12', title: 'Speed limits', content: 'No person shall drive a motor vehicle on a national highway at a speed exceeding the maximum speed limit prescribed by the NHA.', contentUrdu: 'کوئی شخص قومی شاہراہ پر NHA کے مقرر کردہ زیادہ سے زیادہ اسپیڈ لیمٹ سے زیادہ اسپیڈ پر موٹر گاڑی نہ چلائے۔' },
    ],
    amendments: [],
  },

  // ===================== INSURANCE LAW =====================
  {
    title: 'Insurance Ordinance 2000',
    titleUrdu: 'انشورنس آرڈیننس 2000',
    slug: 'insurance-ordinance-2000',
    categorySlug: 'insurance-law',
    yearEnacted: 2000,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Comprehensive law regulating the insurance industry in Pakistan. Replaced the Insurance Act 1938. Establishes the SECP as the insurance regulator, sets registration requirements for insurers, defines policyholder protections, and provides for the resolution of insurance disputes.',
    summaryUrdu:
      'پاکستان میں انشورنس انڈسٹری کو منظم کرنے کا جامع قانون۔ انشورنس ایکٹ 1938 کی جگہ۔ SECP کو انشورنس ریگولیٹر کے طور پر قائم کرتا ہے، انشوررز کے لیے رجسٹریشن کی ضروریات مقرر کرتا ہے، پالیسی ہولڈرز کے تحفظات کی تعریف کرتا ہے، اور انشورنس تنازعات کے حل کے لیے فراہم کرتا ہے۔',
    gazetteReference: 'Ordinance XXXIX of 2000',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Insurance Companies', 'Policyholders', 'Insurance Agents', 'SECP'],
    sections: [
      { sectionNumber: '6', title: 'Registration of insurers', content: 'No insurer shall commence or carry on insurance business in Pakistan unless registered under this Ordinance by the Commission.', contentUrdu: 'کوئی انشورر اس آرڈیننس کے تحت کمیشن کے ذریعے رجسٹر ہونے کے بغیر پاکستان میں انشورنس بزنس شروع یا جاری نہ کرے۔' },
      { sectionNumber: '40', title: 'Policyholder protection', content: 'The Commission may, in the interest of policyholders, issue directions to insurers regarding investments, management of funds, and submission of accounts.', contentUrdu: 'کمیشن پالیسی ہولڈرز کے مفاد میں انشوررز کو سرمایہ کاری، فنڈز کے انتظام، اور حسابات کی پیشکش کے حوالے سے ہدایات جاری کر سکتا ہے۔' },
      { sectionNumber: '135', title: 'Insurance Mohtasib', content: 'The Federal Government may establish the Insurance Mohtasib for resolution of disputes between insurers and policyholders.', contentUrdu: 'وفاقی حکومت انشوررز اور پالیسی ہولڈرز کے درمیان تنازعات کے حل کے لیے انشورنس محتسب قائم کر سکتی ہے۔' },
    ],
    amendments: [
      { amendmentYear: 2018, amendmentTitle: 'Insurance (Amendment) Act 2018', description: 'Enhanced SECP powers, introduced Takaful (Islamic insurance) regulations.', gazetteReference: 'Act of 2018' },
    ],
  },

  // ===================== ANTI-CORRUPTION LAW =====================
  {
    title: 'National Accountability Ordinance 1999 (NAB)',
    titleUrdu: 'نیشنل اکاؤنٹیبلٹی آرڈیننس 1999 (NAB)',
    slug: 'national-accountability-ordinance-1999',
    categorySlug: 'anti-corruption-law',
    yearEnacted: 1999,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Establishes the National Accountability Bureau (NAB) — Pakistan\'s primary anti-corruption agency. Defines corruption offences including misappropriation, kickbacks, and misuse of authority. Provides for confiscation of assets, plea bargain, and accountability courts. Controversial for its broad powers and use against political opponents.',
    summaryUrdu:
      'نیشنل اکاؤنٹیبلٹی بیورو (NAB) قائم کرتا ہے — پاکستان کی بنیادی اینٹی کرپشن ایجنسی۔ بدعنوانی کے جرائم کی تعریف کرتا ہے بشمول غبن، کک بیکس، اور اختیار کا استعمال۔ اثاثوں کی ضبطی، پلی بارگین، اور جواب دہی کورٹس فراہم کرتا ہے۔ سیاسی مخالفین کے خلاف استعمال کے لیے متنازعہ۔',
    gazetteReference: 'Ordinance XVIII of 1999',
    promulgatingAuthority: 'President of Pakistan (Gen. Pervez Musharraf)',
    applicabilityTags: ['Government Officials', 'Public Servants', 'Businesses', 'Citizens'],
    sections: [
      { sectionNumber: '9', title: 'Offence of corruption', content: 'A person shall be guilty of corruption if he is found in possession of assets disproportionate to his known sources of income, or if he misappropriates property entrusted to him.', contentUrdu: 'ایک شخص بدعنوانی کا مجرم ہوگا اگر وہ اپنی معروف آمدنی کے ذرائع سے زیادہ اثاثوں کی ملکیت میں پائے جائیں، یا اس کے سپرد کی گئی جائداد غبن کرے۔' },
      { sectionNumber: '10', title: 'Punishment', content: 'An accused convicted of corruption shall be punishable with imprisonment for a term which may extend to 14 years, and shall be liable to fine and confiscation of property.', contentUrdu: 'بدعنوانی میں سزا یافتہ ملزم 14 سال تک قید کی سزا کا مستحق ہوگا، اور جرمانے اور جائداد کی ضبطی کا ذمہ دار ہوگا۔' },
      { sectionNumber: '25', title: 'Plea bargain', content: 'An accused may offer to return the amount involved in the offence, and the Chairman NAB may accept such offer and discharge the accused.', contentUrdu: 'ملزم جرم میں ملوث رقم واپس کرنے کی پیشکش کر سکتا ہے، اور چیئرمین NAB ایسی پیشکش قبول کر سکتا ہے اور ملزم کو بری کر سکتا ہے۔' },
    ],
    amendments: [
      { amendmentYear: 2022, amendmentTitle: 'NAB (Amendment) Act 2022', description: 'Reduced NAB\'s jurisdiction, limited to cases involving Rs. 500 million+, transferred some cases to FIA.', gazetteReference: 'Act of 2022' },
    ],
  },

  // ===================== ARBITRATION & DISPUTE RESOLUTION =====================
  {
    title: 'Arbitration Act 1940',
    titleUrdu: 'ثالثی ایکٹ 1940',
    slug: 'arbitration-act-1940',
    categorySlug: 'arbitration-dispute-resolution',
    yearEnacted: 1940,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Governs arbitration proceedings in Pakistan — both domestic and international. Provides for the appointment of arbitrators, conduct of proceedings, making of awards, and enforcement. Often chosen for commercial disputes as faster alternative to court litigation.',
    summaryUrdu:
      'پاکستان میں ثالثی کی کارروائیوں کو منظم کرتا ہے — گھریلو اور بین الاقوامی دونوں۔ ثالثوں کی تقرری، کارروائی کا انعقاد، ایوارڈ کی ساخت، اور نفاذ فراہم کرتا ہے۔ اکثر تجارتی تنازعات کے لیے عدالتی مقدمے کے تیز متبادل کے طور پر منتخب کیا جاتا ہے۔',
    gazetteReference: 'Act X of 1940',
    promulgatingAuthority: 'British India (in force in Pakistan)',
    applicabilityTags: ['Businesses', 'Contractors', 'Lawyers', 'Arbitrators'],
    sections: [
      { sectionNumber: '8', title: 'Appointment of arbitrators', content: 'Where an arbitration agreement provides for the appointment of an arbitrator, the parties shall appoint the arbitrator in accordance with the agreement.', contentUrdu: 'جہاں ثالثی معاہدہ ثالث کی تقرری کی فراہم کرتا ہے، فریقین معاہدے کے مطابق ثالث مقرر کریں گے۔' },
      { sectionNumber: '14', title: 'Arbitration award', content: 'The arbitrators shall make their award in writing and sign it, and shall give notice to the parties of the making and signing of the award.', contentUrdu: 'ثالثین اپنا ایوارڈ تحریری شکل میں بنائیں اور اس پر دستخط کریں، اور فریقین کو ایوارڈ کی ساخت اور دستخط کا اطلاع دیں۔' },
      { sectionNumber: '30', title: 'Enforcement of award', content: 'The court may, on application by a party, file the arbitration award in court, and the award so filed shall be enforceable as if it were a decree of the court.', contentUrdu: 'عدالت کسی فریق کی درخواست پر ثالثی ایوارڈ عدالت میں دائر کر سکتی ہے، اور اس طرح دائر شدہ ایوارڈ گویا عدالت کا حکم ہو، نافذ ہوگا۔' },
    ],
    amendments: [],
  },
  {
    title: 'Alternate Dispute Resolution Act 2017',
    titleUrdu: 'متبادل تنازعات کا حل ایکٹ 2017',
    slug: 'alternate-dispute-resolution-act-2017',
    categorySlug: 'arbitration-dispute-resolution',
    yearEnacted: 2017,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Establishes ADR centers across Pakistan for mediation, conciliation, and negotiation outside the formal court system. Aims to reduce court pendency by encouraging settlement before trained mediators. Awards/decisions can be enforced through courts.',
    summaryUrdu:
      'پاکستان بھر میں رسمی عدالتی نظام سے باہر ثالثی، صلح، اور مذاکرات کے لیے ADR سینٹرز قائم کرتا ہے۔ تربیت یافتہ ثالثوں کے سامنے مصالحت کی حوصلہ افزائی سے عدالتوں کے بوجھ کو کم کرنے کا مقصد۔ ایوارڈ/فیصلے عدالتوں کے ذریعے نافذ کیے جا سکتے ہیں۔',
    gazetteReference: 'Act I of 2017',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Citizens', 'Businesses', 'Mediators', 'Courts'],
    sections: [
      { sectionNumber: '6', title: 'ADR centers', content: 'The Federal Government shall establish Alternate Dispute Resolution Centers for the resolution of disputes through mediation, conciliation, or arbitration.', contentUrdu: 'وفاقی حکومت ثالثی، صلح، یا ثالثی کے ذریعے تنازعات کے حل کے لیے متبادل تنازعات کے حل کے سینٹرز قائم کرے گی۔' },
      { sectionNumber: '10', title: 'Voluntary participation', content: 'Participation in ADR proceedings shall be voluntary, and parties may withdraw from the proceedings at any stage.', contentUrdu: 'ADR کارروائی میں شرکت رضاکارانہ ہوگی، اور فریقین کسی بھی مرحلے پر کارروائی سے دستبردار ہو سکتے ہیں۔' },
    ],
    amendments: [],
  },

  // ===================== MEDIA & PRESS LAW =====================
  {
    title: 'PEMRA Ordinance 2002',
    titleUrdu: 'PEMRA آرڈیننس 2002',
    slug: 'pemra-ordinance-2002',
    categorySlug: 'media-press-law',
    yearEnacted: 2002,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Establishes the Pakistan Electronic Media Regulatory Authority (PEMRA) to regulate electronic media (TV channels, radio stations, OTT platforms). Issues broadcast licenses, sets content standards, and can impose fines or suspend licenses for violations.',
    summaryUrdu:
      'پاکستان الیکٹرانک میڈیا ریگولیٹری اتھارٹی (PEMRA) قائم کرتا ہے جو الیکٹرانک میڈیا (ٹی وی چینلز، ریڈیو اسٹیشنز، OTT پلیٹ فارمز) کو منظم کرتا ہے۔ نشریاتی لائسنس جاری کرتا ہے، مواد کے معیارات مقرر کرتا ہے، اور خلاف ورزیوں پر جرمانے یا لائسنس معطل کر سکتا ہے۔',
    gazetteReference: 'Ordinance XIII of 2002',
    promulgatingAuthority: 'President of Pakistan (Gen. Pervez Musharraf)',
    applicabilityTags: ['TV Channels', 'Radio Stations', 'Journalists', 'Content Creators'],
    sections: [
      { sectionNumber: '20', title: 'Broadcasting standards', content: 'Broadcasting shall adhere to standards of morality, public order, and national security as prescribed by the Authority.', contentUrdu: 'نشریات اتھارٹی کے مقرر کردہ اخلاقیات، عوامی نظم و ضبط، اور قومی سلامتی کے معیار کی پابندی کرے گی۔' },
      { sectionNumber: '27', title: 'Powers of Authority', content: 'The Authority may suspend or revoke a license if the licensee contravenes any provision of this Ordinance or any rule or regulation made thereunder.', contentUrdu: 'اتھارٹی لائسنس معطل یا منسوخ کر سکتی ہے اگر لائسنس یافتہ اس آرڈیننس کی کسی شق یا اس کے تحت بنائے گئے کسی اصول یا ریگولیشن کی خلاف ورزی کرے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Press Council of Pakistan Ordinance 2002',
    titleUrdu: 'پریس کونسل آف پاکستان آرڈیننس 2002',
    slug: 'press-council-of-pakistan-ordinance-2002',
    categorySlug: 'media-press-law',
    yearEnacted: 2002,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Establishes the Press Council of Pakistan (PCP) as an independent body to regulate print media, protect press freedom, and handle complaints against newspapers. Includes an Ethical Code of Practice for journalists.',
    summaryUrdu:
      'پریس کونسل آف پاکستان (PCP) ایک آزاد ادارہ کے طور پر قائم کرتا ہے جو پرنٹ میڈیا کو منظم کرتا ہے، پریس کی آزادی کا تحفظ کرتا ہے، اور اخبارات کے خلاف شکایات سنبھالتا ہے۔ صحافیوں کے لیے اخلاقی ضابطہ عمل شامل ہے۔',
    gazetteReference: 'Ordinance XLII of 2002',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Newspapers', 'Journalists', 'Editors', 'Citizens'],
    sections: [
      { sectionNumber: '15', title: 'Complaints', content: 'Any person may file a complaint before the Council against a newspaper for publication of any matter that violates the Ethical Code of Practice.', contentUrdu: 'کوئی بھی شخص اخبار کے خلاف کونسل میں شکایت دائر کر سکتا ہے اخلاقی ضابطہ عمل کی خلاف ورزی کرنے والے کسی مواد کی اشاعت کے لیے۔' },
    ],
    amendments: [],
  },

  // ===================== HUMAN RIGHTS & MINORITY LAW =====================
  {
    title: 'National Commission for Human Rights Act 2012',
    titleUrdu: 'نیشنل کمیشن برائے انسانی حقوق ایکٹ 2012',
    slug: 'national-commission-for-human-rights-act-2012',
    categorySlug: 'human-rights-minority-law',
    yearEnacted: 2012,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Establishes the National Commission for Human Rights (NCHR) as an independent statutory body to promote and protect human rights in Pakistan. Investigates violations, reviews laws, and advises the government. Modeled on the UN Paris Principles.',
    summaryUrdu:
      'نیشنل کمیشن برائے انسانی حقوق (NCHR) ایک آزاد قانونی ادارہ کے طور پر قائم کرتا ہے جو پاکستان میں انسانی حقوق کی تشہیر اور تحفظ کرتا ہے۔ خلاف ورزیوں کی تفتیش، قوانین کا جائزہ، اور حکومت کو مشورہ دیتا ہے۔ اقوام متحدہ کے پیرس اصولوں پر مبنی۔',
    gazetteReference: 'Act XXVIII of 2012',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Citizens', 'NGOs', 'Government', 'Vulnerable Groups'],
    sections: [
      { sectionNumber: '9', title: 'Functions of the Commission', content: 'The Commission shall inquire into complaints of human rights violations, visit jails, review laws, and spread human rights literacy.', contentUrdu: 'کمیشن انسانی حقوق کی خلاف ورزیوں کی شکایات کی تفتیش، جیلوں کا دورہ، قوانین کا جائزہ، اور انسانی حقوق کی تعلیم پھیلائے گا۔' },
      { sectionNumber: '14', title: 'Inquiry powers', content: 'The Commission shall have all the powers of a civil court trying a suit under the Code of Civil Procedure 1908.', contentUrdu: 'کمیشن کے پاس دیوانی آئینِ عدالت 1908 کے تحت مقدمہ چلانے والی دیوانی عدالت کے تمام اختیارات ہوں گے۔' },
    ],
    amendments: [],
  },
  {
    title: 'Hindu Marriage Act 2017',
    titleUrdu: 'ہندو میریج ایکٹ 2017',
    slug: 'hindu-marriage-act-2017',
    categorySlug: 'human-rights-minority-law',
    yearEnacted: 2017,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Provides the first formal legal framework for Hindu marriages in Pakistan. Allows registration of Hindu marriages, sets conditions for valid marriage (age, consent, prohibited degrees), and provides for dissolution on grounds of cruelty, desertion, conversion, or impotency.',
    summaryUrdu:
      'پاکستان میں ہندو شادیوں کا پہلا باقاعدہ قانونی فریم ورک فراہم کرتا ہے۔ ہندو شادیوں کی رجسٹری کی اجازت دیتا ہے، قابلِ شادی شرائط (عمر، رضامندی، ممنوع درجات) مقرر کرتا ہے، اور ظلم، ترک، تبدیلی مذہب، یا نامردی کی بنیاد پر تحلیل فراہم کرتا ہے۔',
    gazetteReference: 'Act XIII of 2017',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Hindu Community', 'Minorities', 'Lawyers'],
    sections: [
      { sectionNumber: '5', title: 'Conditions for marriage', content: 'A marriage between two Hindus shall be solemnized if neither party has a spouse living, both are of sound mind, the groom is at least 18 and the bride at least 16 years of age.', contentUrdu: 'دو ہندوؤں کے درمیان شادی اس وقت ہو گی جب فریقین میں سے کسی کا پہلے سے شوہر/بیوی زندہ نہ ہو، دونوں صحت مند دماغ ہوں، دولہا کم از کم 18 اور دلہن کم از کم 16 سال کی ہو۔' },
      { sectionNumber: '12', title: 'Dissolution of marriage', content: 'A wife may file for dissolution on grounds of cruelty, desertion for 2+ years, conversion to another religion, or impotency of the husband.', contentUrdu: 'بیوی تحلیل کی درخواست ظلم، 2+ سال ترک، دوسرے مذہب میں تبدیلی، یا شوہر کی نامردی کی بنیاد پر دائر کر سکتی ہے۔' },
    ],
    amendments: [],
  },

  // ===================== PROVINCIAL-SPECIFIC LAW =====================
  {
    title: 'Punjab Local Government Act 2013',
    titleUrdu: 'پنجاب لوکل گورنمنٹ ایکٹ 2013',
    slug: 'punjab-local-government-act-2013',
    categorySlug: 'provincial-specific-law',
    yearEnacted: 2013,
    jurisdiction: 'punjab',
    status: 'active',
    summary:
      'Establishes the local government system in Punjab — Metropolitan Corporations, Municipal Corporations, District Councils, Union Councils, and town committees. Provides for elected representatives, devolution of powers, and local service delivery.',
    summaryUrdu:
      'پنجاب میں لوکل گورنمنٹ سسٹم قائم کرتا ہے — میٹروپولیٹن کارپوریشنز، میونسپل کارپوریشنز، ضلع کونسلس، یونین کونسلس، اور ٹاؤن کمیٹیاں۔ منتخب نمائندوں، اختیارات کی منتقلی، اور مقامی خدمت فراہمی فراہم کرتا ہے۔',
    gazetteReference: 'Punjab Act XVIII of 2013',
    promulgatingAuthority: 'Provincial Assembly of Punjab',
    applicabilityTags: ['Citizens of Punjab', 'Local Government Officials', 'Government'],
    sections: [
      { sectionNumber: '12', title: 'Constitution of local governments', content: 'There shall be a local government for each district, comprising the Zila Council, Union Councils, and other local areas as specified.', contentUrdu: 'ہر ضلع کے لیے ایک لوکل گورنمنٹ ہوگی جس میں ضلع کونسل، یونین کونسلس، اور دیگر مقامی علاقے شامل ہوں گے۔' },
      { sectionNumber: '29', title: 'Devolution of powers', content: 'The Government shall devolve to the local governments the political, administrative, and financial responsibilities for local matters including primary education, basic health, sanitation, and infrastructure.', contentUrdu: 'حکومت لوکل گورنمنٹس کو سیاسی، انتظامی، اور مالی ذمہ داریاں منتقل کرے گی بشمول ابتدائی تعلیم، بنیادی صحت، صفائی، اور انفراسٹرکچر۔' },
    ],
    amendments: [],
  },
  {
    title: 'Sindh Local Government Act 2013',
    titleUrdu: 'سندھ لوکل گورنمنٹ ایکٹ 2013',
    slug: 'sindh-local-government-act-2013',
    categorySlug: 'provincial-specific-law',
    yearEnacted: 2013,
    jurisdiction: 'sindh',
    status: 'amended',
    summary:
      'Establishes local government system in Sindh — Karachi Metropolitan Corporation, district councils, municipal committees, and union councils. Provides for devolution and local elections.',
    summaryUrdu:
      'سندھ میں لوکل گورنمنٹ سسٹم قائم کرتا ہے — کراچی میٹروپولیٹن کارپوریشن، ضلع کونسلس، میونسپل کمیٹیاں، اور یونین کونسلس۔ منتقلی اور مقامی الیکشن فراہم کرتا ہے۔',
    gazetteReference: 'Sindh Act XXXI of 2013',
    promulgatingAuthority: 'Provincial Assembly of Sindh',
    applicabilityTags: ['Citizens of Sindh', 'Local Government Officials'],
    sections: [
      { sectionNumber: '11', title: 'Constitution of local councils', content: 'There shall be a Metropolitan Corporation for Karachi, District Councils, Municipal Committees, and Union Committees for the local areas of Sindh.', contentUrdu: 'کراچی کے لیے میٹروپولیٹن کارپوریشن، ضلع کونسلس، میونسپل کمیٹیاں، اور سندھ کے مقامی علاقوں کے لیے یونین کمیٹیاں ہوں گی۔' },
    ],
    amendments: [
      { amendmentYear: 2021, amendmentTitle: 'Sindh Local Government (Amendment) Act 2021', description: 'Reintroduced direct mayor elections and restructured wards.', gazetteReference: 'Sindh Act of 2021' },
    ],
  },
  {
    title: 'KPK Local Government Act 2013',
    titleUrdu: 'کے پی لوکل گورنمنٹ ایکٹ 2013',
    slug: 'kpk-local-government-act-2013',
    categorySlug: 'provincial-specific-law',
    yearEnacted: 2013,
    jurisdiction: 'kpk',
    status: 'amended',
    summary:
      'Establishes local government in Khyber Pakhtunkhwa — City District Governments, District Councils, Tehsil Councils, and Village Councils. Known for strong devolution provisions including village-level governance.',
    summaryUrdu:
      'خیبر پختونخوا میں لوکل گورنمنٹ قائم کرتا ہے — سٹی ڈسٹرکٹ گورنمنٹس، ضلع کونسلس، تحصیل کونسلس، اور گاؤں کونسلس۔ گاؤں سطح کی گورننس سمیت مضبوط منتقلی کی دفعات کے لیے جانا جاتا ہے۔',
    gazetteReference: 'KPK Act XXIII of 2013',
    promulgatingAuthority: 'Provincial Assembly of KPK',
    applicabilityTags: ['Citizens of KPK', 'Local Government Officials'],
    sections: [
      { sectionNumber: '6', title: 'Village and Neighborhood Councils', content: 'There shall be a Village Council for each village and a Neighborhood Council for each neighborhood in urban areas, with elected representatives.', contentUrdu: 'ہر گاؤں کے لیے ایک گاؤں کونسل اور شہری علاقوں میں ہر محلے کے لیے ایک محلہ کونسل ہوگی، منتخب نمائندوں کے ساتھ۔' },
    ],
    amendments: [
      { amendmentYear: 2019, amendmentTitle: 'KPK Local Government (Amendment) Act 2019', description: 'Reintroduced district-level mayor system.', gazetteReference: 'KPK Act of 2019' },
    ],
  },
  {
    title: 'Balochistan Local Government Act 2010',
    titleUrdu: 'بلوچستان لوکل گورنمنٹ ایکٹ 2010',
    slug: 'balochistan-local-government-act-2010',
    categorySlug: 'provincial-specific-law',
    yearEnacted: 2010,
    jurisdiction: 'balochistan',
    status: 'active',
    summary:
      'Establishes local government system in Balochistan — Metropolitan Corporations, Municipal Committees, District Councils, and Union Councils. Tailored to the large, sparsely-populated province.',
    summaryUrdu:
      'بلوچستان میں لوکل گورنمنٹ سسٹم قائم کرتا ہے — میٹروپولیٹن کارپوریشنز، میونسپل کمیٹیاں، ضلع کونسلس، اور یونین کونسلس۔ بڑے، کم آبادی والے صوبے کے لیے مخصوص۔',
    gazetteReference: 'Balochistan Act XV of 2010',
    promulgatingAuthority: 'Provincial Assembly of Balochistan',
    applicabilityTags: ['Citizens of Balochistan', 'Local Government Officials'],
    sections: [
      { sectionNumber: '8', title: 'Constitution of local councils', content: 'There shall be a Metropolitan Corporation for Quetta, Municipal Committees for towns, and Union Councils for rural areas of Balochistan.', contentUrdu: 'کوئٹہ کے لیے میٹروپولیٹن کارپوریشن، قصبوں کے لیے میونسپل کمیٹیاں، اور بلوچستان کے دیہی علاقوں کے لیے یونین کونسلس ہوں گی۔' },
    ],
    amendments: [],
  },
  {
    title: 'Punjab Revenue Act 1967 (Land Revenue)',
    titleUrdu: 'پنجاب ریونیو ایکٹ 1967 (زمین ریونیو)',
    slug: 'punjab-revenue-act-1967',
    categorySlug: 'provincial-specific-law',
    yearEnacted: 1967,
    jurisdiction: 'punjab',
    status: 'amended',
    summary:
      'Punjab-specific revenue law governing the assessment and collection of land revenue, maintenance of revenue records, and the role of patwari, tehsildar, and other revenue officials in Punjab. Each province has its own version.',
    summaryUrdu:
      'پنجاب کا مخصوص ریونیو قانون جو زمین کے ریونیو کی تشخیص و وصولی، ریونیو ریکارڈز کی دیکھ بھال، اور پنجاب میں پٹواری، تحصیلدار، اور دیگر ریونیو عہدیداروں کے کردار کو منظم کرتا ہے۔ ہر صوبے کا اپنا ورژن ہے۔',
    gazetteReference: 'West Pakistan Land Revenue Act 1967',
    promulgatingAuthority: 'Provincial Government',
    applicabilityTags: ['Land Owners', 'Farmers', 'Revenue Officials', 'Punjab'],
    sections: [
      { sectionNumber: '32', title: 'Mutation of rights', content: 'Where the rights of any person are transferred, recorded, divided, increased, decreased, or extinguished by any means other than death, the patwari shall make the appropriate entry in the register of mutations.', contentUrdu: 'جہاں کسی شخص کے حقوق منتقل، درج، تقسیم، بڑھائے، کم یا ختم ہوتے ہیں (موت کے علاوہ)، پٹواری رجسٹرِ منتقلی میں مناسب اندراج کرے گا۔' },
    ],
    amendments: [],
  },
  {
    title: 'Gilgit-Baltistan Governance Order 2018',
    titleUrdu: 'گلگت بلتستان گورننس آرڈر 2018',
    slug: 'gilgit-baltistan-governance-order-2018',
    categorySlug: 'provincial-specific-law',
    yearEnacted: 2018,
    jurisdiction: 'gilgit_baltistan',
    status: 'active',
    summary:
      'Provides the constitutional framework for governance of Gilgit-Baltistan. Establishes the GB Assembly, GB Council, and the office of the Governor. Grants GB province-like status with legislative powers on certain subjects.',
    summaryUrdu:
      'گلگت بلتستان کی گورننس کے لیے آئینی فریم ورک فراہم کرتا ہے۔ جی بی اسمبلی، جی بی کونسل، اور گورنر کا دفتر قائم کرتا ہے۔ جی بی کو صوبے جیسی حیثیت دیتا ہے جس میں مخصوص مضامین پر قانون سازی کا اختیار ہے۔',
    gazetteReference: 'President\'s Order 2018',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Citizens of GB', 'Government', 'Legislators'],
    sections: [
      { sectionNumber: '19', title: 'Legislative powers', content: 'The GB Assembly shall have the power to make laws for GB on subjects in the Legislative List, except those reserved for the Federal Government.', contentUrdu: 'جی بی اسمبلی کے پاس قانون سازی کا اختیار ہوگا، قانونی فہرست میں مذکور مضامین پر، سوائے وفاقی حکومت کے لیے محفوظ کردہ کے۔' },
      { sectionNumber: '33', title: 'GB Council', content: 'There shall be a GB Council, chaired by the Prime Minister of Pakistan, to oversee matters of strategic importance and federal subjects.', contentUrdu: 'ایک جی بی کونسل ہوگی، جس کی سربراہی پاکستان کے وزیر اعظم کریں گے، جو حکمت عملاتی اہمیت اور وفاقی مضامین کی نگرانی کرے گی۔' },
    ],
    amendments: [],
  },

  // ===================== POLICE LAW =====================
  {
    title: 'Police Order 2002',
    titleUrdu: 'پولیس آرڈر 2002',
    slug: 'police-order-2002',
    categorySlug: 'police-law',
    yearEnacted: 2002,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Comprehensive reform of the police system in Pakistan, replacing the Police Act 1861. Establishes independent Police Complaints Authorities, separates investigation from prosecution, introduces public safety commissions, and defines police powers and accountability mechanisms.',
    summaryUrdu:
      'پاکستان میں پولیس سسٹم کی جامع اصلاح، پولیس ایکٹ 1861 کی جگہ۔ آزاد پولیس شکایات اتھاریٹیز قائم کرتا ہے، تحقیقات کو مقدمہ بازی سے الگ کرتا ہے، عوامی حفاظت کمیشن متعارف کراتا ہے، اور پولیس کے اختیارات اور جواب دہی کے طریقے کی تعریف کرتا ہے۔',
    gazetteReference: 'Ordinance XXII of 2002',
    promulgatingAuthority: 'President of Pakistan (Gen. Pervez Musharraf)',
    applicabilityTags: ['Police', 'Government', 'Citizens', 'Lawyers'],
    sections: [
      { sectionNumber: '4', title: 'Provincial Police Officer', content: 'The Provincial Police Officer shall be head of the provincial police, appointed by the Provincial Government with the consent of the National Public Safety Commission.', contentUrdu: 'صوبائی پولیس افسر صوبائی پولیس کا سربراہ ہوگا، صوبائی حکومت کی طرف سے نیشنل پبلک سیفٹی کمیشن کی رضامندی سے مقرر۔' },
      { sectionNumber: '18', title: 'Police Complaints Authority', content: 'There shall be a Police Complaints Authority at the federal and provincial levels to investigate complaints against police officers.', contentUrdu: 'وفاقی اور صوبائی سطح پر پولیس شکایات اتھارٹی ہوگی جو پولیس افسران کے خلاف شکایات کی تفتیش کرے گی۔' },
      { sectionNumber: '156', title: 'Duties of police officers', content: 'It shall be the duty of every police officer to maintain public order, prevent crime, detect and apprehend offenders, preserve peace, and protect life and property.', contentUrdu: 'ہر پولیس افسر کا فرض ہوگا عوامی نظم و ضبط برقرار رکھنا، جرائم سے بچاؤ، مجرمانہ افراد کو پکڑنا، امن برقرار رکھنا، اور جان و مال کی حفاظت کرنا۔' },
    ],
    amendments: [
      { amendmentYear: 2011, amendmentTitle: 'Police Order (Amendment) 2011', description: 'Restored certain powers to provincial governments; modified Public Safety Commission composition.', gazetteReference: 'Act of 2011' },
      { amendmentYear: 2017, amendmentTitle: 'Police Act 2017 (Punjab)', description: 'Punjab enacted its own Police Act, repealing Police Order 2002 within Punjab.', gazetteReference: 'Punjab Act of 2017' },
    ],
  },
  {
    title: 'Punjab Police Act 2017',
    titleUrdu: 'پنجاب پولیس ایکٹ 2017',
    slug: 'punjab-police-act-2017',
    categorySlug: 'police-law',
    yearEnacted: 2017,
    jurisdiction: 'punjab',
    status: 'active',
    summary:
      'Provincial-level police law for Punjab, replacing the Police Order 2002. Establishes the Punjab Police, defines its hierarchy, powers, and accountability mechanisms including the Provincial Police Complaints Authority. Introduces community policing and modern investigation techniques.',
    summaryUrdu:
      'پنجاب کے لیے صوبائی سطح کا پولیس قانون، پولیس آرڈر 2002 کی جگہ۔ پنجاب پولیس قائم کرتا ہے، اس کی تدرج، اختیارات، اور جواب دہی کے طریقے کی تعریف کرتا ہے بشمول صوبائی پولیس شکایات اتھارٹی۔ کمیونٹی پولیسنگ اور جدید تفتیشی طریقے متعارف کراتا ہے۔',
    gazetteReference: 'Punjab Act V of 2017',
    promulgatingAuthority: 'Provincial Assembly of Punjab',
    applicabilityTags: ['Citizens of Punjab', 'Police', 'Government'],
    sections: [
      { sectionNumber: '7', title: 'Constitution of the Punjab Police', content: 'The Punjab Police shall consist of the Inspector General of Police, Additional Inspectors General, Deputy Inspectors General, Senior Superintendents, Superintendents, and other ranks.', contentUrdu: 'پنجاب پولیس میں انسپکٹر جنرل پولیس، ایڈیشنل انسپکٹرز جنرل، ڈپٹی انسپکٹرز جنرل، سینئر سپرنٹنڈنٹس، سپرنٹنڈنٹس، اور دیگر درجے کے افسران شامل ہوں گے۔' },
      { sectionNumber: '36', title: 'Punjab Police Complaints Authority', content: 'There shall be a Provincial Police Complaints Authority to investigate serious complaints against police officers.', contentUrdu: 'ایک صوبائی پولیس شکایات اتھارٹی ہوگی جو پولیس افسران کے خلاف سنگین شکایات کی تفتیش کرے گی۔' },
    ],
    amendments: [],
  },

  // ===================== GOVERNMENT / CIVIL SERVANT LAW =====================
  {
    title: 'Civil Servants Act 1973',
    titleUrdu: 'سول سرونٹس ایکٹ 1973',
    slug: 'civil-servants-act-1973',
    categorySlug: 'government-civil-servant-law',
    yearEnacted: 1973,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'The foundational law governing the civil service of Pakistan. Defines the appointment, promotion, termination, and terms of service for federal civil servants. Establishes the Civil Service of Pakistan, defines its structure, and sets rules for efficiency and discipline.',
    summaryUrdu:
      'پاکستان کی سول سروس کو منظم کرنے کا بنیادی قانون۔ وفاقی سول سرونٹس کی تقرری، ترقی، برطرفی، اور سروس کی شرائط کی تعریف کرتا ہے۔ سول سروس آف پاکستان قائم کرتا ہے، اس کے ڈھانچے کی تعریف کرتا ہے، اور کارکردگی اور نظم و ضبط کے اصول مقرر کرتا ہے۔',
    gazetteReference: 'Act XIX of 1973',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Civil Servants', 'Government', 'Bureaucracy'],
    sections: [
      { sectionNumber: '5', title: 'Appointments', content: 'Appointments to the Civil Service of Pakistan shall be made by the Federal Government on the recommendations of the Federal Public Service Commission.', contentUrdu: 'سول سروس آف پاکستان میں تقرریاں وفاقی حکومت کی طرف سے فیڈرل پبلک سروس کمیشن کی سفارشات پر کی جائیں گی۔' },
      { sectionNumber: '9', title: 'Termination of service', content: 'The service of a civil servant may be terminated by the Federal Government by giving him one month\'s notice or one month\'s pay in lieu thereof.', contentUrdu: 'ایک سول سرونٹ کی سروس وفاقی حکومت ایک ماہ کا نوٹس یا اس کے بدلے میں ایک ماہ کی تنخواہ دے کر ختم کر سکتی ہے۔' },
      { sectionNumber: '10', title: 'Efficiency and Discipline', content: 'The Federal Government may, by rules, prescribe the procedure for proceedings against civil servants on grounds of inefficiency, misconduct, or corruption.', contentUrdu: 'وفاقی حکومت رولز کے ذریعے کارکردگی، برا رویت، یا بدعنوانی کی بنیاد پر سول سرونٹس کے خلاف کارروائی کا طریقہ کار مقرر کر سکتی ہے۔' },
    ],
    amendments: [
      { amendmentYear: 2008, amendmentTitle: 'Civil Servans (Amendment) Act 2008', description: 'Enhanced job security provisions; restricted arbitrary terminations.', gazetteReference: 'Act of 2008' },
    ],
  },
  {
    title: 'Federal Public Service Commission Ordinance 1977',
    titleUrdu: 'فیڈرل پبلک سروس کمیشن آرڈیننس 1977',
    slug: 'federal-public-service-commission-ordinance-1977',
    categorySlug: 'government-civil-servant-law',
    yearEnacted: 1977,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Establishes the Federal Public Service Commission (FPSC) — the constitutional body responsible for recruiting civil servants for the Federal Government. Conducts CSS examinations and recommends candidates for appointment. Independent and impartial.',
    summaryUrdu:
      'فیڈرل پبلک سروس کمیشن (FPSC) قائم کرتا ہے — وفاقی حکومت کے لیے سول سرونٹس کی بھرتی کا ذمہ دار آئینی ادارہ۔ سی ایس ایس امتحانات منعقد کرتا ہے اور تقرری کے لیے امیدواروں کی سفارش کرتا ہے۔ آزاد اور غیر جانبدار۔',
    gazetteReference: 'Ordinance XLVIII of 1977',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Civil Servants', 'Government', 'CSS Candidates'],
    sections: [
      { sectionNumber: '6', title: 'Functions of the Commission', content: 'The Commission shall conduct examinations for recruitment to the civil service, advise the Government on matters of recruitment, and ensure merit-based appointments.', contentUrdu: 'کمیشن سول سروس کی بھرتی کے لیے امتحانات منعقد کرے، حکومت کو بھرتی کے امور پر مشورہ دے، اور میرٹ کی بنیاد پر تقرریاں یقینی بنائے۔' },
      { sectionNumber: '7', title: 'Independence', content: 'The Commission shall not be subject to the direction or control of any person or authority in the performance of its functions.', contentUrdu: 'کمیشن اپنے فرائض کی انجام دہی میں کسی شخص یا اتھارٹی کی ہدایت یا کنٹرول کا تابع نہیں ہوگا۔' },
    ],
    amendments: [],
  },

  // ===================== AGRICULTURE LAW =====================
  {
    title: 'Seed Act 1976',
    titleUrdu: 'بیج ایکٹ 1976',
    slug: 'seed-act-1976',
    categorySlug: 'agriculture-law',
    yearEnacted: 1976,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Regulates the seed industry in Pakistan — registration of seed varieties, certification, quality control, and marketing. Establishes the Federal Seed Certification Agency. Aims to ensure availability of high-quality seeds to farmers.',
    summaryUrdu:
      'پاکستان میں بیج انڈسٹری کو منظم کرتا ہے — بیج varieties کی رجسٹری، تصدیق، معیار کنٹرول، اور مارکیٹنگ۔ فیڈرل بیج تصدیقی ادارہ قائم کرتا ہے۔ کسانوں کو اعلیٰ معیار کے بیج فراہم کرنے کا مقصد۔',
    gazetteReference: 'Act XXIX of 1976',
    promulgatingAuthority: 'Parliament of Pakistan',
    applicabilityTags: ['Farmers', 'Seed Companies', 'Agriculture Department'],
    sections: [
      { sectionNumber: '5', title: 'Registration of seed varieties', content: 'No person shall sell, offer for sale, or advertise any seed of a variety unless the variety is registered under this Act.', contentUrdu: 'کوئی شخص کسی variety کا بیج بیچ نہیں سکے گا، فروخت کے لیے پیش نہیں کر سکے گا، یا مشتہر نہیں کر سکے گا، جب تک وہ variety اس ایکٹ کے تحت رجسٹر نہ ہو۔' },
      { sectionNumber: '17', title: 'Penalties', content: 'Whoever contravenes any provision of this Act shall be punishable with imprisonment up to six months, or fine up to Rs. 10,000, or both.', contentUrdu: 'جو کوئی اس ایکٹ کی کسی شق کی خلاف ورزی کرے وہ چھ ماہ تک قید یا 10,000 روپے جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [
      { amendmentYear: 2015, amendmentTitle: 'Seed (Amendment) Act 2015', description: 'Updated to include biotech/GM seeds, enhanced penalties, and strengthened FSCA powers.', gazetteReference: 'Act of 2015' },
    ],
  },
  {
    title: 'Agricultural Pesticides Ordinance 1971',
    titleUrdu: 'زرعی کیڑے مار ادویات آرڈیننس 1971',
    slug: 'agricultural-pesticides-ordinance-1971',
    categorySlug: 'agriculture-law',
    yearEnacted: 1971,
    jurisdiction: 'federal',
    status: 'active',
    summary:
      'Regulates the import, manufacture, formulation, sale, and use of agricultural pesticides in Pakistan. Requires registration of pesticides, licensing of dealers, and establishes quality control standards to protect farmers and the environment.',
    summaryUrdu:
      'پاکستان میں زرعی کیڑے مار ادویات کی درآمد، پیداوار، تیاری، فروخت، اور استعمال کو منظم کرتا ہے۔ کیڑے مار ادویات کی رجسٹری، ڈیلرز کی لائسنسنگ، اور معیار کنٹرول کے معیارات قائم کرتا ہے تاکہ کسانوں اور ماحول کا تحفظ ہو۔',
    gazetteReference: 'Ordinance V of 1971',
    promulgatingAuthority: 'President of Pakistan',
    applicabilityTags: ['Farmers', 'Pesticide Companies', 'Agriculture Department'],
    sections: [
      { sectionNumber: '7', title: 'Registration of pesticides', content: 'No pesticide shall be imported, manufactured, formulated, or sold unless it is registered with the registration authority.', contentUrdu: 'کوئی کیڑے مار دوا درآمد، پیداوار، تیاری، یا فروخت نہ ہو، جب تک وہ رجسٹریشن اتھارٹی کے ساتھ رجسٹر نہ ہو۔' },
      { sectionNumber: '29', title: 'Penalties', content: 'Whoever contravenes this Ordinance shall be punishable with imprisonment up to two years, or fine, or both.', contentUrdu: 'جو کوئی اس آرڈیننس کی خلاف ورزی کرے وہ دو سال تک قید یا جرمانے یا دونوں سزاؤں کا مستحق ہوگا۔' },
    ],
    amendments: [],
  },
  {
    title: 'Land Reforms Regulation 1972',
    titleUrdu: 'زمینی اصلاحات ریگولیشن 1972',
    slug: 'land-reforms-regulation-1972',
    categorySlug: 'agriculture-law',
    yearEnacted: 1972,
    jurisdiction: 'federal',
    status: 'amended',
    summary:
      'Introduced major land reforms under the Martial Law Regulation. Ceiled landholdings at 150 acres irrigated / 300 acres unirrigated. Excess land was resumed and redistributed to landless peasants. Later challenged and partially invalidated by the Shariat Appellate Bench.',
    summaryUrdu:
      'مارشل لا ریگولیشن کے تحت بڑی زمینی اصلاحات متعارف کرائیں۔ زمین کی ملکیت کی حد 150 ایکڑ سیراب / 300 ایکڑ غیر سیراب پر مقرر۔ زائد زمین ضبط کر کے بے زمین کسانوں میں تقسیم کی گئی۔ بعد میں شریعت اپیلٹ بنچ کے ذریعے چیلنج اور جزوی طور پر کالعدم۔',
    gazetteReference: 'Martial Law Regulation 115 of 1972',
    promulgatingAuthority: 'President of Pakistan (Zulfiqar Ali Bhutto)',
    applicabilityTags: ['Land Owners', 'Farmers', 'Government'],
    sections: [
      { sectionNumber: '3', title: 'Ceiling on landholdings', content: 'No person shall own more than 150 acres of irrigated land or 300 acres of unirrigated land, or land producing more than 12,000 produce index units.', contentUrdu: 'کوئی شخص 150 ایکڑ سیراب زمین یا 300 ایکڑ غیر سیراب زمین، یا 12,000 پروڈیوس انڈیکس یونٹس سے زیادہ پیداوار والی زمین کا مالک نہیں ہوگا۔' },
      { sectionNumber: '8', title: 'Resumption and redistribution', content: 'Land in excess of the ceiling shall be resumed by the Government and redistributed to landless tenants and small farmers.', contentUrdu: 'حد سے زیادہ زمین حکومت کے ذریعے ضبط کر کے بے زمین کاشتکاروں اور چھوٹے کسانوں میں تقسیم کی جائے گی۔' },
    ],
    amendments: [],
  },
]

// Tags to attach (cross-cutting)
export const lawTags: Record<string, string[]> = {
  'pakistan-penal-code-1860': ['individuals', 'students', 'general-public'],
  'prevention-of-electronic-crimes-act-2016': ['individuals', 'businesses', 'digital', 'women'],
  'muslim-family-laws-ordinance-1961': ['individuals', 'women', 'muslim-families'],
  'income-tax-ordinance-2001': ['individuals', 'businesses', 'tax-professionals'],
  'protection-against-harassment-of-women-at-workplace-act-2010': ['women', 'employers', 'workplace'],
  'constitution-of-pakistan-1973': ['individuals', 'students', 'government', 'lawyers'],
  'contract-act-1872': ['businesses', 'individuals', 'lawyers'],
  'transfer-of-property-act-1882': ['property-owners', 'buyers', 'lawyers'],
  'punjab-consumer-protection-act-2005': ['consumers', 'businesses', 'punjab'],
  'acid-control-and-acid-crime-prevention-act-2011': ['women', 'individuals', 'criminal-justice'],
  'punjab-protection-of-women-against-violence-act-2016': ['women', 'families', 'punjab'],
  'pakistan-environmental-protection-act-1997': ['businesses', 'industries', 'government'],
  'pakistan-climate-change-act-2017': ['government', 'businesses', 'climate'],
  'limitation-act-1908': ['lawyers', 'civil-litigants'],
  'code-of-civil-procedure-1908': ['lawyers', 'judges', 'civil-litigants'],
}
