// QanoonPK seed data — Lawyers & Document Templates

export type SeedLawyer = {
  name: string
  nameUrdu?: string
  slug: string
  bio?: string
  bioUrdu?: string
  specialization: string[] // category slugs
  city: string
  cityUrdu?: string
  province: string
  licenseNumber?: string
  experienceYears?: number
  education?: string
  educationUrdu?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  addressUrdu?: string
  languages: string[]
  rating?: number
  reviewCount?: number
  verified?: boolean
  featured?: boolean
  acceptingCases?: boolean
  imageColor?: string
}

export const lawyers: SeedLawyer[] = [
  {
    name: 'Barrister Ayesha Khan',
    nameUrdu: 'بیرسٹر عائشہ خان',
    slug: 'barrister-ayesha-khan',
    bio: 'Senior advocate specializing in family law, women\'s rights, and domestic violence cases. 15+ years of experience representing clients in Lahore High Court and Supreme Court. Founder of Women\'s Legal Aid Society.',
    bioUrdu: 'بیرسٹر عائشہ خان خاندانی قانون، خواتین کے حقوق، اور گھریلو تشدد کے مقدمات میں مہارت رکھنے والی سینئر وکیل ہیں۔ لاہور ہائی کورٹ اور سپریم کورٹ میں 15 سال سے زیادہ تجربہ۔ خواتین کی قانونی امداد سوسائٹی کی بانی۔',
    specialization: ['family-law', 'womens-rights-law'],
    city: 'Lahore',
    cityUrdu: 'لاہور',
    province: 'punjab',
    licenseNumber: 'PBC/LH/2008/0421',
    experienceYears: 15,
    education: 'LL.B (Hons) University of Punjab, LL.M Cambridge University',
    educationUrdu: 'ایل ایل بی (آنرز) پنجاب یونیورسٹی، ایل ایل ایم کیمبرج یونیورسٹی',
    email: 'ayesha.khan@lawfirm.pk',
    phone: '+92-300-1234567',
    website: 'www.ayeshakhanlaw.com',
    address: '52-A, Gulberg III, Lahore, Punjab',
    addressUrdu: '52-اے، گلبرگ III، لاہور، پنجاب',
    languages: ['English', 'Urdu', 'Punjabi'],
    rating: 4.8,
    reviewCount: 24,
    verified: true,
    featured: true,
    acceptingCases: true,
    imageColor: '#be185d',
  },
  {
    name: 'Advocate Muhammad Imran',
    nameUrdu: 'ایڈوکیٹ محمد عمران',
    slug: 'advocate-muhammad-imran',
    bio: 'Corporate and tax law expert. Advises multinational companies on FBR compliance, tax planning, and corporate structuring. Former tax consultant at Big 4 firm.',
    bioUrdu: 'کارپوریٹ اور ٹیکس قانون کے ماہر۔ ملٹی نیشنل کمپنیوں کو FBR کی پابندی، ٹیکس پلاننگ، اور کارپوریٹ ڈھانچے پر مشورہ دیتے ہیں۔ سابق ٹیکس کنسلٹنٹ Big 4 فرم میں۔',
    specialization: ['tax-law'],
    city: 'Islamabad',
    cityUrdu: 'اسلام آباد',
    province: 'federal',
    licenseNumber: 'PBC/ISB/2010/0892',
    experienceYears: 12,
    education: 'LL.B International Islamic University, CA (ICAP)',
    educationUrdu: 'ایل ایل بی بین الاقوامی اسلامی یونیورسٹی، سی اے (آئی کیپ)',
    email: 'm.imran@corptax.pk',
    phone: '+92-333-9876543',
    website: 'www.corptax.pk',
    address: 'Office #14, Blue Area, Islamabad',
    addressUrdu: 'دفتر #14، بلیو ایریا، اسلام آباد',
    languages: ['English', 'Urdu'],
    rating: 4.6,
    reviewCount: 18,
    verified: true,
    featured: true,
    acceptingCases: true,
    imageColor: '#0891b2',
  },
  {
    name: 'Barrister Usman Ali',
    nameUrdu: 'بیرسٹر عثمان علی',
    slug: 'barrister-usman-ali',
    bio: 'Criminal defense lawyer with 18 years of experience. Handles murder, terrorism (ATC), and white-collar crime cases. Frequently appears on national media for legal commentary.',
    bioUrdu: 'فوجداری دفاعی وکیل 18 سال کے تجربے کے ساتھ۔ قتل، دہشت گردی (ATC)، اور وائٹ کالر کرائم کے مقدمات سنبھالتے ہیں۔ قومی میڈیا پر قانونی تبصرے کے لیے مستقل موجود۔',
    specialization: ['criminal-law'],
    city: 'Karachi',
    cityUrdu: 'کراچی',
    province: 'sindh',
    licenseNumber: 'PBC/KHI/2005/0156',
    experienceYears: 18,
    education: 'LL.B University of Karachi, Barrister-at-Law (Lincoln\'s Inn)',
    educationUrdu: 'ایل ایل بی کراچی یونیورسٹی، بیرسٹر اٹ لا (لنکنز ان)',
    email: 'usman@crimdefence.pk',
    phone: '+92-321-5555777',
    address: 'Suite 7, Clifton, Karachi',
    addressUrdu: 'سوئٹ 7، کلفتن، کراچی',
    languages: ['English', 'Urdu', 'Sindhi'],
    rating: 4.9,
    reviewCount: 31,
    verified: true,
    featured: true,
    acceptingCases: true,
    imageColor: '#dc2626',
  },
  {
    name: 'Advocate Sana Malik',
    nameUrdu: 'ایڈوکیٹ ثناء ملک',
    slug: 'advocate-sana-malik',
    bio: 'Cyber law and IT lawyer. Specializes in PECA cases, data protection advisory, and digital fraud litigation. Helps tech startups with regulatory compliance.',
    bioUrdu: 'سائبر قانون اور آئی ٹی وکیل۔ PECA کے مقدمات، ڈیٹا تحفظ کے مشورے، اور ڈیجیٹل فراڈ کی مقدمہ بازی میں مہارت۔ ٹیک سٹارٹ اپس کو ریگولیٹری پابندی میں مدد کرتی ہیں۔',
    specialization: ['cyber-it-law'],
    city: 'Islamabad',
    cityUrdu: 'اسلام آباد',
    province: 'federal',
    licenseNumber: 'PBC/ISB/2016/2103',
    experienceYears: 8,
    education: 'LL.B Quaid-i-Azam University, MSc Cybersecurity (RHUL)',
    educationUrdu: 'ایل ایل بی قائد اعظم یونیورسٹی، ایم ایس سی سائبر سیکیورٹی (RHUL)',
    email: 'sana@cyberlaw.pk',
    phone: '+92-345-1112233',
    website: 'www.cyberlaw.pk',
    address: 'Plot 12, F-11 Markaz, Islamabad',
    addressUrdu: 'پلاٹ 12، ایف 11 مرکز، اسلام آباد',
    languages: ['English', 'Urdu'],
    rating: 4.7,
    reviewCount: 12,
    verified: true,
    featured: false,
    acceptingCases: true,
    imageColor: '#6366f1',
  },
  {
    name: 'Advocate Tariq Mehmood',
    nameUrdu: 'ایڈوکیٹ طارق محمود',
    slug: 'advocate-tariq-mehmood',
    bio: 'Property and land law specialist. Handles mutation disputes, partition suits, and registration cases. 20+ years experience in Lahore and Punjab revenue courts.',
    bioUrdu: 'جائداد اور اراضی قانون کے ماہر۔ منتقلی کے تنازعات، تقسیم کے دعوے، اور رجسٹریشن کے مقدمات۔ لاہور اور پنجاب ریونیو کورٹس میں 20 سال سے زیادہ تجربہ۔',
    specialization: ['property-land-law', 'civil-law'],
    city: 'Lahore',
    cityUrdu: 'لاہور',
    province: 'punjab',
    licenseNumber: 'PBC/LH/2003/0078',
    experienceYears: 20,
    education: 'LL.B University of the Punjab',
    educationUrdu: 'ایل ایل بی پنجاب یونیورسٹی',
    email: 'tariq@propertylaw.pk',
    phone: '+92-300-9998888',
    address: '99-C, Model Town, Lahore',
    addressUrdu: '99-سی، ماڈل ٹاؤن، لاہور',
    languages: ['English', 'Urdu', 'Punjabi'],
    rating: 4.5,
    reviewCount: 28,
    verified: true,
    featured: false,
    acceptingCases: true,
    imageColor: '#16a34a',
  },
  {
    name: 'Advocate Fatima Bibi',
    nameUrdu: 'ایڈوکیٹ فاطمہ بی بی',
    slug: 'advocate-fatima-bibi',
    bio: 'Labor and employment lawyer. Represents workers in wage disputes, wrongful termination, and workplace harassment cases. Active member of Pakistan Workers Federation.',
    bioUrdu: 'محنت و روزگار وکیل۔ اجرت کے تنازعات، غیر قانونی برطرفی، اور ورک پلیس ہراسانی کے مقدمات میں مزدوروں کی نمائندگی۔ پاکستان ورکرز فیڈریشن کی فعال رکن۔',
    specialization: ['labor-employment-law', 'womens-rights-law'],
    city: 'Faisalabad',
    cityUrdu: 'فیصل آباد',
    province: 'punjab',
    licenseNumber: 'PBC/FSD/2013/1234',
    experienceYears: 10,
    education: 'LL.B Government College University Faisalabad',
    educationUrdu: 'ایل ایل بی گورنمنٹ کالج یونیورسٹی فیصل آباد',
    email: 'fatima@laborlaw.pk',
    phone: '+92-311-7776666',
    address: 'D-Ground, People\'s Colony, Faisalabad',
    addressUrdu: 'ڈی-گراؤنڈ، پیپلز کالونی، فیصل آباد',
    languages: ['English', 'Urdu', 'Punjabi'],
    rating: 4.4,
    reviewCount: 15,
    verified: true,
    featured: false,
    acceptingCases: true,
    imageColor: '#ea580c',
  },
  {
    name: 'Barrister Hassan Raza',
    nameUrdu: 'بیرسٹر حسن رضا',
    slug: 'barrister-hassan-raza',
    bio: 'Constitutional and public interest litigation lawyer. Argued landmark cases on fundamental rights and provincial autonomy. Visiting professor of constitutional law at LUMS.',
    bioUrdu: 'آئینی و عوامی مفاد کی مقدمہ بازی کے وکیل۔ بنیادی حقوق اور صوبائی خود مختاری پر تاریخی مقدمات لڑے۔ LUMS میں آئینی قانون کے وزٹنگ پروفیسر۔',
    specialization: ['constitutional-law'],
    city: 'Lahore',
    cityUrdu: 'لاہور',
    province: 'punjab',
    licenseNumber: 'PBC/LH/2007/0567',
    experienceYears: 16,
    education: 'LL.B LUMS, LL.M Harvard Law School',
    educationUrdu: 'ایل ایل بی لومس، ایل ایل ایم ہارورڈ لا اسکول',
    email: 'hassan@constlaw.pk',
    phone: '+92-322-4445555',
    website: 'www.constlaw.pk',
    address: 'Tower 4, MM Alam Road, Lahore',
    addressUrdu: 'ٹاور 4، ایم ایم عالم روڈ، لاہور',
    languages: ['English', 'Urdu'],
    rating: 4.9,
    reviewCount: 22,
    verified: true,
    featured: true,
    acceptingCases: true,
    imageColor: '#7c3aed',
  },
  {
    name: 'Advocate Nadia Shah',
    nameUrdu: 'ایڈوکیٹ نادیہ شاہ',
    slug: 'advocate-nadia-shah',
    bio: 'Consumer protection and environmental lawyer. Helps citizens file complaints against unfair trade practices and pollution. Active in climate litigation.',
    bioUrdu: 'صارفین کے تحفظ اور ماحولیاتی وکیل۔ شہریوں کو ناشفاف تجارتی عمل اور آلودگی کی شکایات درج کرنے میں مدد کرتی ہیں۔ موسمیاتی مقدمہ بازی میں فعال۔',
    specialization: ['consumer-protection-law', 'environmental-law'],
    city: 'Peshawar',
    cityUrdu: 'پشاور',
    province: 'kpk',
    licenseNumber: 'PBC/PSH/2015/1890',
    experienceYears: 9,
    education: 'LL.B University of Peshawar, Diploma Environmental Law',
    educationUrdu: 'ایل ایل بی پشاور یونیورسٹی، ڈپلومہ ماحولیاتی قانون',
    email: 'nadia@envlaw.pk',
    phone: '+92-333-2221111',
    address: 'Hayatabad Phase 3, Peshawar',
    addressUrdu: 'ہایatabاد فیز 3، پشاور',
    languages: ['English', 'Urdu', 'Pashto'],
    rating: 4.5,
    reviewCount: 9,
    verified: true,
    featured: false,
    acceptingCases: true,
    imageColor: '#059669',
  },
  {
    name: 'Advocate Bilal Ahmed',
    nameUrdu: 'ایڈوکیٹ بلال احمد',
    slug: 'advocate-bilal-ahmed',
    bio: 'Civil litigation specialist. Handles contract disputes, specific performance suits, and injunction applications. Known for thorough case preparation.',
    bioUrdu: 'دیوانی مقدمہ بازی کے ماہر۔ معاہدے کے تنازعات، مخصوص چارہ جوئی، اور حائل احکامات کی درخواستوں پر کارروائی۔ مکمل کیس کی تیاری کے لیے جانے جاتے ہیں۔',
    specialization: ['civil-law'],
    city: 'Multan',
    cityUrdu: 'ملتان',
    province: 'punjab',
    licenseNumber: 'PBC/MTN/2011/0456',
    experienceYears: 13,
    education: 'LL.B Bahauddin Zakariya University',
    educationUrdu: 'ایل ایل بی بہاؤالدین زکریا یونیورسٹی',
    email: 'bilal@civillaw.pk',
    phone: '+92-300-6665555',
    address: 'Bosan Road, Multan',
    addressUrdu: 'بوسن روڈ، ملتان',
    languages: ['English', 'Urdu', 'Saraiki'],
    rating: 4.3,
    reviewCount: 11,
    verified: true,
    featured: false,
    acceptingCases: true,
    imageColor: '#9333ea',
  },
  {
    name: 'Advocate Zainab Hussain',
    nameUrdu: 'ایڈوکیٹ زینب حسین',
    slug: 'advocate-zainab-hussain',
    bio: 'Family law and women\'s rights specialist in Sindh. Handles khula, custody, and domestic violence cases. Provides pro-bono services to low-income women.',
    bioUrdu: 'سندھ میں خاندانی قانون اور خواتین کے حقوق کی ماہر۔ خلع، حضانت، اور گھریلو تشدد کے مقدمات۔ کم آمدنی والی خواتین کو مفت قانونی خدمات فراہم کرتی ہیں۔',
    specialization: ['family-law', 'womens-rights-law'],
    city: 'Hyderabad',
    cityUrdu: 'حیدرآباد',
    province: 'sindh',
    licenseNumber: 'PBC/HYD/2014/0789',
    experienceYears: 11,
    education: 'LL.B University of Sindh',
    educationUrdu: 'ایل ایل بی سندھ یونیورسٹی',
    email: 'zainab@familylaw.pk',
    phone: '+92-345-7776666',
    address: 'Latifabad Unit 8, Hyderabad',
    addressUrdu: 'لطیف آباد یونٹ 8، حیدرآباد',
    languages: ['English', 'Urdu', 'Sindhi'],
    rating: 4.7,
    reviewCount: 14,
    verified: true,
    featured: false,
    acceptingCases: true,
    imageColor: '#db2777',
  },
  {
    name: 'Advocate Kamran Sheikh',
    nameUrdu: 'ایڈوکیٹ کامران شیخ',
    slug: 'advocate-kamran-sheikh',
    bio: 'Tax and corporate lawyer based in Quetta. Specializes in provincial tax matters, customs, and trade regulation. Represents clients before Appellate Tribunal Inland Revenue.',
    bioUrdu: 'کوئٹہ میں ٹیکس اور کارپوریٹ وکیل۔ صوبائی ٹیکس امور، کسٹم، اور تجارتی ریگولیشن میں مہارت۔ اپیل ٹریبیونل ان لینڈ ریونیو میں موکلین کی نمائندگی۔',
    specialization: ['tax-law'],
    city: 'Quetta',
    cityUrdu: 'کوئٹہ',
    province: 'balochistan',
    licenseNumber: 'PBC/QTA/2010/0312',
    experienceYears: 14,
    education: 'LL.B University of Balochistan',
    educationUrdu: 'ایل ایل بی بلوچستان یونیورسٹی',
    email: 'kamran@taxlaw.pk',
    phone: '+92-333-4443333',
    address: 'Jinnah Road, Quetta',
    addressUrdu: 'جناح روڈ، کوئٹہ',
    languages: ['English', 'Urdu', 'Balochi', 'Pashto'],
    rating: 4.4,
    reviewCount: 7,
    verified: true,
    featured: false,
    acceptingCases: true,
    imageColor: '#0891b2',
  },
  {
    name: 'Advocate Rabia Anwar',
    nameUrdu: 'ایڈوکیٹ ربیعہ انور',
    slug: 'advocate-rabia-anwar',
    bio: 'Young and dynamic criminal defense lawyer in Islamabad. Handles cybercrime, PECA, and white-collar cases. Active in legal aid clinics.',
    bioUrdu: 'اسلام آباد میں نوجوان اور متحرک فوجداری دفاعی وکیل۔ سائبر کرائم، PECA، اور وائٹ کالر مقدمات۔ قانونی امداد کلینکس میں فعال۔',
    specialization: ['criminal-law', 'cyber-it-law'],
    city: 'Islamabad',
    cityUrdu: 'اسلام آباد',
    province: 'federal',
    licenseNumber: 'PBC/ISB/2019/2456',
    experienceYears: 6,
    education: 'LL.B International Islamic University Islamabad',
    educationUrdu: 'ایل ایل بی بین الاقوامی اسلامی یونیورسٹی اسلام آباد',
    email: 'rabia@defenselaw.pk',
    phone: '+92-321-8887777',
    website: 'www.defenselaw.pk',
    address: 'I-8 Markaz, Islamabad',
    addressUrdu: 'آئی 8 مرکز، اسلام آباد',
    languages: ['English', 'Urdu'],
    rating: 4.6,
    reviewCount: 5,
    verified: true,
    featured: false,
    acceptingCases: true,
    imageColor: '#0d9488',
  },
]

// ===================== Document Templates =====================

export type SeedTemplateField = {
  key: string
  label: string
  labelUrdu?: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'select'
  required?: boolean
  placeholder?: string
  options?: string[]
}

export type SeedDocTemplate = {
  title: string
  titleUrdu: string
  slug: string
  description: string
  descriptionUrdu: string
  category: string
  categoryUrdu: string
  fields: SeedTemplateField[]
  templateText: string
  templateTextUrdu: string
  previewText?: string
}

export const docTemplates: SeedDocTemplate[] = [
  {
    title: 'Affidavit of Identity',
    titleUrdu: 'حلفیہ بیانِ شناخت',
    slug: 'affidavit-of-identity',
    description: 'A general affidavit to declare your identity, address, and personal details under oath. Useful for various legal and administrative purposes.',
    descriptionUrdu: 'عام حلفیہ بیان اپنی شناخت، پتہ، اور ذاتی تفصیلات کی حلفی طور پر تصدیق کے لیے۔ مختلف قانونی و انتظامی مقاصد کے لیے مفید۔',
    category: 'Identity & Declarations',
    categoryUrdu: 'شناخت و بیانات',
    fields: [
      { key: 'deponentName', label: 'Full Name', labelUrdu: 'پورا نام', type: 'text', required: true, placeholder: 'e.g., Ahmed Ali' },
      { key: 'fatherName', label: 'Father\'s Name', labelUrdu: 'والد کا نام', type: 'text', required: true },
      { key: 'cnic', label: 'CNIC Number', labelUrdu: 'شناختی کارڈ نمبر', type: 'text', required: true, placeholder: 'XXXXX-XXXXXXX-X' },
      { key: 'address', label: 'Address', labelUrdu: 'پتہ', type: 'textarea', required: true },
      { key: 'date', label: 'Date', labelUrdu: 'تاریخ', type: 'date', required: true },
    ],
    templateText: `AFFIDAVIT OF IDENTITY

I, {{deponentName}}, son/daughter of {{fatherName}}, holder of CNIC No. {{cnic}}, resident of {{address}}, do hereby solemnly affirm and declare as follows:

1. That the above-mentioned particulars are true and correct to the best of my knowledge and belief.
2. That I am a citizen of Pakistan.
3. That this affidavit is being executed for the purpose of declaration of identity for official and legal purposes.

I affirm and declare that the contents of this affidavit are true and correct to the best of my knowledge and belief, and nothing has been concealed or misstated.

Date: {{date}}

_________________________
Deponent

Sworn and signed before me on this {{date}}.

_________________________
Oath Commissioner`,
    templateTextUrdu: `حلفیہ بیانِ شناخت

میں، {{deponentName}}، فرزند/فرزندی {{fatherName}}، شناختی کارڈ نمبر {{cnic}} کا حامل، رہائشی {{address}}، حلفی طور پر یہ بیان دیتا/دیتی ہوں کہ:

1۔ مذکورہ بالا تفصیلات میرے علم اور یقین کے مطابق درست و سچ ہیں۔
2۔ میں پاکستان کا شہری ہوں۔
3۔ یہ حلفی بیان سرکاری و قانونی مقاصد کے لیے شناخت کے اعلان کے لیے پیش کیا جا رہا ہے۔

میں حلفی بیان دیتا/دیتی ہوں کہ اس حلفی بیان کا مواد میرے علم اور یقین کے مطابق سچ و درست ہے، اور کچھ بھی چھپایا یا غلط بیان نہیں کیا گیا۔

تاریخ: {{date}}

_________________________
بیان دہندہ

مجھ سے حلفی دستخط اس تاریخ {{date}} کو کیے گئے۔

_________________________
حلفی کمشنر`,
    previewText: 'A general-purpose affidavit for declaring your identity...',
  },
  {
    title: 'Residential Tenancy Agreement',
    titleUrdu: 'رہائشی کرایہ داری معاہدہ',
    slug: 'residential-tenancy-agreement',
    description: 'A comprehensive rental agreement between landlord and tenant for residential property. Includes rent, security deposit, duration, and termination terms.',
    descriptionUrdu: 'رہائشی جائداد کے لیے مکان مالک اور کرایہ دار کے درمیان جامع کرایہ معاہدہ۔ کرایہ، سیکیورٹی ڈپازٹ، مدت، اور خاتمے کی شرائط شامل۔',
    category: 'Property & Real Estate',
    categoryUrdu: 'جائداد و رئیل اسٹیٹ',
    fields: [
      { key: 'landlordName', label: 'Landlord Name', labelUrdu: 'مکان مالک کا نام', type: 'text', required: true },
      { key: 'landlordCnic', label: 'Landlord CNIC', labelUrdu: 'مکان مالک کا شناختی کارڈ', type: 'text', required: true },
      { key: 'tenantName', label: 'Tenant Name', labelUrdu: 'کرایہ دار کا نام', type: 'text', required: true },
      { key: 'tenantCnic', label: 'Tenant CNIC', labelUrdu: 'کرایہ دار کا شناختی کارڈ', type: 'text', required: true },
      { key: 'propertyAddress', label: 'Property Address', labelUrdu: 'جائداد کا پتہ', type: 'textarea', required: true },
      { key: 'monthlyRent', label: 'Monthly Rent (Rs.)', labelUrdu: 'ماہانہ کرایہ (روپے)', type: 'number', required: true },
      { key: 'securityDeposit', label: 'Security Deposit (Rs.)', labelUrdu: 'سیکیورٹی ڈپازٹ (روپے)', type: 'number', required: true },
      { key: 'startDate', label: 'Start Date', labelUrdu: 'آغاز کی تاریخ', type: 'date', required: true },
      { key: 'duration', label: 'Duration (months)', labelUrdu: 'مدت (ماہ)', type: 'number', required: true },
      { key: 'executionDate', label: 'Execution Date', labelUrdu: 'توثیق کی تاریخ', type: 'date', required: true },
    ],
    templateText: `RESIDENTIAL TENANCY AGREEMENT

This Tenancy Agreement is made and executed on {{executionDate}} at [City], Pakistan.

BY AND BETWEEN:

Mr/Ms. {{landlordName}}, CNIC No. {{landlordCnic}}, hereinafter referred to as the "Landlord" (which expression shall, where the context so admits, include his heirs, successors and assigns) of the ONE PART;

AND

Mr/Ms. {{tenantName}}, CNIC No. {{tenantCnic}}, hereinafter referred to as the "Tenant" (which expression shall, where the context so admits, include his heirs, successors and assigns) of the OTHER PART.

WHEREAS the Landlord is the lawful owner of the premises situated at:
{{propertyAddress}}

NOW THEREFORE, the parties agree as follows:

1. RENT: The Tenant shall pay a monthly rent of Rs. {{monthlyRent}}/- payable in advance by the 5th of each month.

2. SECURITY DEPOSIT: The Tenant has paid a security deposit of Rs. {{securityDeposit}}/- to the Landlord, refundable at the end of the tenancy, subject to deductions for any damage to the property.

3. TERM: This tenancy shall commence on {{startDate}} and remain in force for a period of {{duration}} months.

4. USE: The Tenant shall use the premises for residential purposes only.

5. TERMINATION: Either party may terminate this agreement by giving one month's prior notice.

IN WITNESS WHEREOF, the parties have signed this agreement on the date first above written.

_________________________          _________________________
Landlord                           Tenant

WITNESSES:

1. _________________________ (Name, CNIC, Signature)

2. _________________________ (Name, CNIC, Signature)`,
    templateTextUrdu: `رہائشی کرایہ داری معاہدہ

یہ کرایہ داری معاہدہ {{executionDate}} کو [شہر]، پاکستان میں عمل میں لایا گیا۔

کے درمیان:

جناب/محترمہ {{landlordName}}، شناختی کارڈ نمبر {{landlordCnic}}، جسے آئندہ "مکان مالک" کہا جائے گا (جس میں مناسب مقام پر ان کے ورثاء، جانشین اور متuccessors شامل ہوں گے) ایک طرف سے؛

اور

جناب/محترمہ {{tenantName}}، شناختی کارڈ نمبر {{tenantCnic}}، جسے آئندہ "کرایہ دار" کہا جائے گا دوسری طرف سے۔

جبکہ مکان مالک اس مقام کا قانونی مالک ہے:
{{propertyAddress}}

اب اس لیے فریقین درج ذیل پر متفق ہیں:

1۔ کرایہ: کرایہ دار ماہانہ {{monthlyRent}} روپے کرایہ ادا کرے گا، جو ہر مہینے کی 5 تاریخ سے قبل ادا کیا جائے۔

2۔ سیکیورٹی ڈپازٹ: کرایہ دار نے {{securityDeposit}} روپے سیکیورٹی ڈپازٹ ادا کیے ہیں، جو کرایہ داری کے اختتام پر واپس کیے جائیں گے، جائداد کو نقصان کی کٹوتی کے تابع۔

3۔ مدت: یہ کرایہ داری {{startDate}} سے شروع ہو گی اور {{duration}} ماہ تک جاری رہے گی۔

4۔ استعمال: کرایہ دار مقام کا استعمال صرف رہائشی مقاصد کے لیے کرے گا۔

5۔ خاتمہ: کوئی بھی فریق ایک ماہ کا پہلا نوٹس دے کر اس معاہدے کو ختم کر سکتا ہے۔

جس کی گواہی میں فریقین نے مندرجہ بالا تاریخ کو اس معاہدے پر دستخط کیے۔

_________________________          _________________________
مکان مالک                         کرایہ دار

گواہ:

1۔ _________________________ (نام، شناختی کارڈ، دستخط)

2۔ _________________________ (نام، شناختی کارڈ، دستخط)`,
    previewText: 'A complete rental agreement for residential property...',
  },
  {
    title: 'Non-Disclosure Agreement (NDA)',
    titleUrdu: 'رازداری معاہدہ (NDA)',
    slug: 'non-disclosure-agreement',
    description: 'A standard one-way NDA to protect confidential information shared between two parties. Suitable for business discussions, hiring contractors, and partnership talks.',
    descriptionUrdu: 'معیاری یکطرفہ رازداری معاہدہ دو فریقین کے درمیان شیئر کی جانے والی خفیہ معلومات کے تحفظ کے لیے۔ کاروباری مذاکرات، ٹھیکیداروں کی بھرتی، اور شراکت کی گفتگو کے لیے مناسب۔',
    category: 'Business & Commercial',
    categoryUrdu: 'کاروبار و تجارت',
    fields: [
      { key: 'disclosingParty', label: 'Disclosing Party Name', labelUrdu: 'فریقِ افشا کنندہ کا نام', type: 'text', required: true },
      { key: 'disclosingPartyAddress', label: 'Disclosing Party Address', labelUrdu: 'افشا کنندہ فریق کا پتہ', type: 'textarea', required: true },
      { key: 'receivingParty', label: 'Receiving Party Name', labelUrdu: 'وصول کنندہ فریق کا نام', type: 'text', required: true },
      { key: 'receivingPartyAddress', label: 'Receiving Party Address', labelUrdu: 'وصول کنندہ فریق کا پتہ', type: 'textarea', required: true },
      { key: 'purpose', label: 'Purpose of Disclosure', labelUrdu: 'افشا کا مقصد', type: 'textarea', required: true },
      { key: 'effectiveDate', label: 'Effective Date', labelUrdu: 'نافذ کی تاریخ', type: 'date', required: true },
      { key: 'duration', label: 'Confidentiality Term (years)', labelUrdu: 'رازداری مدت (سال)', type: 'number', required: true },
    ],
    templateText: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on {{effectiveDate}}.

BETWEEN:

{{disclosingParty}}, having its address at {{disclosingPartyAddress}} (the "Disclosing Party");

AND

{{receivingParty}}, having its address at {{receivingPartyAddress}} (the "Receiving Party").

WHEREAS the Disclosing Party possesses certain confidential and proprietary information, and the Receiving Party agrees to receive such information for the purpose of: {{purpose}}.

NOW THEREFORE, the parties agree as follows:

1. CONFIDENTIAL INFORMATION: All information disclosed by the Disclosing Party, whether in written, oral, electronic, or other form, shall be deemed confidential.

2. OBLIGATIONS: The Receiving Party shall:
   (a) Keep the Confidential Information strictly confidential;
   (b) Not disclose it to any third party without prior written consent;
   (c) Use it solely for the Purpose stated above;
   (d) Take reasonable measures to protect it.

3. EXCLUSIONS: The obligations shall not apply to information that:
   (a) Is or becomes publicly known through no breach of this Agreement;
   (b) Was independently developed by the Receiving Party;
   (c) Was rightfully received from a third party without confidentiality obligations.

4. TERM: This Agreement shall remain in effect for {{duration}} years from the Effective Date.

5. RETURN/DESTRUCTION: Upon request, the Receiving Party shall return or destroy all Confidential Information.

6. REMEDIES: The Disclosing Party may seek injunctive relief and damages for any breach.

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first above written.

_________________________          _________________________
Disclosing Party                    Receiving Party`,
    templateTextUrdu: `رازداری معاہدہ

یہ رازداری معاہدہ ("معاہدہ") {{effectiveDate}} کو عمل میں لایا گیا۔

کے درمیان:

{{disclosingParty}}، جس کا پتہ {{disclosingPartyAddress}} ہے ("افشا کنندہ فریق")؛

اور

{{receivingParty}}، جس کا پتہ {{receivingPartyAddress}} ہے ("وصول کنندہ فریق")۔

جبکہ افشا کنندہ فریق کے پاس کچھ خفیہ اور ملکیتی معلومات ہیں، اور وصول کنندہ فریق ان معلومات کو اس مقصد کے لیے وصول کرنے پر متفق ہے: {{purpose}}۔

اب اس لیے فریقین درج ذیل پر متفق ہیں:

1۔ خفیہ معلومات: افشا کنندہ فریق کی طرف سے افشا کی گئی تمام معلومات، خواہ تحریری، زبانی، الیکٹرانک یا کسی اور شکل میں، خفیہ سمجھی جائے گی۔

2۔ ذمہ داریاں: وصول کنندہ فریق:
   (الف) خفیہ معلومات کو سختی سے خفیہ رکھے گا؛
   (ب) پہلے تحریری اجازت کے بغیر کسی تیسری فریق کو افشا نہ کرے گا؛
   (ج) صرف مندرجہ بالا مقصد کے لیے استعمال کرے گا؛
   (د) تحفظ کے معقول اقدامات کرے گا۔

3۔ استثنے: یہ ذمہ داریاں ان معلومات پر لاگو نہیں ہوں گی جو:
   (الف) اس معاہدے کی خلاف ورزی کے بغیر عوامی طور پر معروف ہوں؛
   (ب) وصول کنندہ فریق نے آزادانہ طور پر تیار کی ہوں؛
   (ج) کسی تیسری فریق سے بغیر رازداری کی ذمہ داری کے قانونی طور پر حاصل کی ہوں۔

4۔ مدت: یہ معاہدہ نافذ کی تاریخ سے {{duration}} سال تک نافذ رہے گا۔

5۔ واپسی/تخریب: درخواست پر وصول کنندہ فریق تمام خفیہ معلومات واپس یا تخریب کر دے گا۔

6۔ چارہ جوئی: افشا کنندہ فریق کسی بھی خلاف ورزی کے لیے حائل احکامات اور نقصانات کا طالب ہو سکتا ہے۔

جس کی گواہی میں فریقین نے مندرجہ بالا تاریخ کو اس معاہدے پر دستخط کیے۔

_________________________          _________________________
افشا کنندہ فریق                      وصول کنندہ فریق`,
    previewText: 'A standard NDA to protect confidential business information...',
  },
  {
    title: 'Power of Attorney',
    titleUrdu: 'مختار نامہ',
    slug: 'power-of-attorney',
    description: 'A general power of attorney authorizing another person to act on your behalf for legal, financial, and property matters.',
    descriptionUrdu: 'عام مختار نامہ جو کسی دوسرے شخص کو قانونی، مالی، اور جائداد کے معاملات میں آپ کی طرف سے کام کرنے کا اختیار دیتا ہے۔',
    category: 'Identity & Declarations',
    categoryUrdu: 'شناخت و بیانات',
    fields: [
      { key: 'principalName', label: 'Principal Name', labelUrdu: 'مختار کنندہ کا نام', type: 'text', required: true },
      { key: 'principalCnic', label: 'Principal CNIC', labelUrdu: 'مختار کنندہ کا شناختی کارڈ', type: 'text', required: true },
      { key: 'principalAddress', label: 'Principal Address', labelUrdu: 'مختار کنندہ کا پتہ', type: 'textarea', required: true },
      { key: 'agentName', label: 'Agent Name', labelUrdu: 'مختار کا نام', type: 'text', required: true },
      { key: 'agentCnic', label: 'Agent CNIC', labelUrdu: 'مختار کا شناختی کارڈ', type: 'text', required: true },
      { key: 'agentAddress', label: 'Agent Address', labelUrdu: 'مختار کا پتہ', type: 'textarea', required: true },
      { key: 'executionDate', label: 'Execution Date', labelUrdu: 'توثیق کی تاریخ', type: 'date', required: true },
    ],
    templateText: `GENERAL POWER OF ATTORNEY

This Power of Attorney is executed on {{executionDate}} at [City], Pakistan.

BY:

Mr/Ms. {{principalName}}, CNIC No. {{principalCnic}}, residing at {{principalAddress}} (hereinafter called the "Principal" which expression shall, where the context admits, include heirs, successors and assigns).

IN FAVOUR OF:

Mr/Ms. {{agentName}}, CNIC No. {{agentCnic}}, residing at {{agentAddress}} (hereinafter called the "Attorney").

NOW THEREFORE, the Principal hereby appoints the Attorney as the lawful attorney of the Principal to do the following acts, deeds and things on behalf of the Principal:

1. To represent the Principal in all courts, tribunals, forums and authorities;
2. To sign, execute and file all pleadings, applications, affidavits, and documents;
3. To manage, sell, lease, or otherwise deal with the Principal's movable and immovable property;
4. To operate bank accounts, sign cheques, and conduct banking transactions;
5. To receive and recover any money, debts, or dues payable to the Principal;
6. To engage advocates, accountants, and other professionals on behalf of the Principal;
7. To do all such acts as may be necessary, incidental, or consequential to the matters aforesaid.

The Principal hereby ratifies and confirms all acts, deeds, and things lawfully done or caused to be done by the Attorney pursuant to this Power of Attorney.

This Power of Attorney shall remain in force until revoked by the Principal by written notice.

IN WITNESS WHEREOF, the Principal has signed this Power of Attorney on the date first above written.

_________________________
Principal

WITNESSES:

1. _________________________ (Name, CNIC, Signature)

2. _________________________ (Name, CNIC, Signature)`,
    templateTextUrdu: `عام مختار نامہ

یہ مختار نامہ {{executionDate}} کو [شہر]، پاکستان میں عمل میں لایا گیا۔

بذریعہ:

جناب/محترمہ {{principalName}}، شناختی کارڈ نمبر {{principalCnic}}، رہائشی {{principalAddress}} (جو آئندہ "مختار کنندہ" کہلائے گا، جس میں مناسب مقام پر ورثاء، جانشین اور متsuccessors شامل ہوں گے)۔

بہ نفع:

جناب/محترمہ {{agentName}}، شناختی کارڈ نمبر {{agentCnic}}، رہائشی {{agentAddress}} (جو آئندہ "مختار" کہلائے گا)۔

اب اس لیے مختار کنندہ اپنے مختار کے طور پر مختار کو مقرر کرتا ہے/کرتی ہے تاکہ وہ مختار کنندہ کی طرف سے درج ذیل افعال انجام دے سکے:

1۔ مختار کنندہ کی نمائندگی تمام عدالتوں، محکموں، فورموں اور اتھارٹیز میں کرنا؛
2۔ تمام درخواستوں، اپیلوں، حلفی بیانات اور دستاویزات پر دستخط کرنا، انہیں توثیق کرنا اور داخل کرنا؛
3۔ مختار کنندہ کی متحرک اور غیر منقولہ جائداد کا انتظام، فروخت، کرایہ، یا دوسرے طریقے سے سلوک کرنا؛
4۔ بینک اکاؤنٹس چلانا، چیکس پر دستخط کرنا، اور بینکنگ لین دین کرنا؛
5۔ مختار کنندہ کے قابل وصول کسی بھی رقم، قرضوں، یا واجبات کی وصولی کرنا؛
6۔ مختار کنندہ کی طرف سے وکلا، اکاؤنٹنٹس اور دیگر پیشہ ورانہ افراد کی خدمات حاصل کرنا؛
7۔ مذکورہ بالا امور کے لیے ضروری، ضمنی یا نتیجتاً ضروری تمام افعال کرنا۔

مختار کنندہ اس مختار نامہ کے تحت مختار کے طرف سے قانونی طور پر کیے گئے تمام افعال کی توثیق اور تصدیق کرتا ہے/کرتی ہے۔

یہ مختار نامہ مختار کنندہ کے تحریری نوٹس کے ذریعے منسوخ ہونے تک نافذ رہے گا۔

جس کی گواہی میں مختار کنندہ نے مندرجہ بالا تاریخ کو اس مختار نامہ پر دستخط کیے۔

_________________________
مختار کنندہ

گواہ:

1۔ _________________________ (نام، شناختی کارڈ، دستخط)

2۔ _________________________ (نام، شناختی کارڈ، دستخط)`,
    previewText: 'Authorize someone to act on your behalf for legal matters...',
  },
  {
    title: 'Employment Offer Letter',
    titleUrdu: 'ملازمت کا پیشکش نامہ',
    slug: 'employment-offer-letter',
    description: 'A formal employment offer letter template for hiring new employees. Includes position, salary, benefits, and terms of employment.',
    descriptionUrdu: 'نئے ملازمین کی بھرتی کے لیے باقاعدہ ملازمت کا پیشکش نامہ۔ عہدہ، تنخواہ، فوائد، اور ملازمت کی شرائط شامل۔',
    category: 'Business & Commercial',
    categoryUrdu: 'کاروبار و تجارت',
    fields: [
      { key: 'companyName', label: 'Company Name', labelUrdu: 'کمپنی کا نام', type: 'text', required: true },
      { key: 'employeeName', label: 'Employee Name', labelUrdu: 'ملازم کا نام', type: 'text', required: true },
      { key: 'employeeAddress', label: 'Employee Address', labelUrdu: 'ملازم کا پتہ', type: 'textarea', required: true },
      { key: 'position', label: 'Job Title/Position', labelUrdu: 'عہدہ', type: 'text', required: true },
      { key: 'salary', label: 'Monthly Salary (Rs.)', labelUrdu: 'ماہانہ تنخواہ (روپے)', type: 'number', required: true },
      { key: 'startDate', label: 'Start Date', labelUrdu: 'آغاز کی تاریخ', type: 'date', required: true },
      { key: 'probationMonths', label: 'Probation Period (months)', labelUrdu: 'پروبیشن مدت (ماہ)', type: 'number', required: true },
    ],
    templateText: `EMPLOYMENT OFFER LETTER

Date: {{startDate}}

To:
{{employeeName}}
{{employeeAddress}}

Subject: Offer of Employment

Dear {{employeeName}},

We are pleased to offer you the position of {{position}} with {{companyName}}. The terms and conditions of your employment are as follows:

1. POSITION: You will be employed as {{position}}.

2. START DATE: Your employment shall commence on {{startDate}}.

3. PROBATION: You will be on probation for a period of {{probationMonths}} months, during which your performance will be reviewed.

4. COMPENSATION: Your gross monthly salary will be Rs. {{salary}}/-, payable monthly subject to statutory deductions.

5. WORKING HOURS: Standard office hours shall apply, with weekly off as per company policy.

6. LEAVE: You shall be entitled to annual, casual, and sick leave as per company policy and applicable labor laws.

7. CONFIDENTIALITY: You shall maintain confidentiality of all company information.

8. TERMINATION: Either party may terminate the employment by giving one month's notice or salary in lieu thereof.

9. APPLICABLE LAW: This appointment shall be governed by the laws of Pakistan.

If you accept this offer, please sign and return the duplicate copy of this letter.

We look forward to your positive contribution to the company.

For {{companyName}}

_________________________
Authorized Signatory

ACCEPTANCE

I, {{employeeName}}, accept the above offer of employment on the terms stated herein.

_________________________
Employee Signature
Date:`,
    templateTextUrdu: `ملازمت کا پیشکش نامہ

تاریخ: {{startDate}}

بہ:
{{employeeName}}
{{employeeAddress}}

موضوع: ملازمت کی پیشکش

محترم {{employeeName}}،

ہمیں خوشی ہے کہ {{companyName}} میں {{position}} کا عہدہ آپ کو پیشکش کریں۔ آپ کی ملازمت کی شرائط درج ذیل ہیں:

1۔ عہدہ: آپ {{position}} کے عہدے پر ملازم رکھے جائیں گے۔

2۔ آغاز کی تاریخ: آپ کی ملازمت {{startDate}} سے شروع ہو گی۔

3۔ پروبیشن: آپ {{probationMonths}} ماہ کی پروبیشن پر ہوں گے، جس کے دوران آپ کی کارکردگی کا جائزہ لیا جائے گا۔

4۔ معاوضہ: آپ کی مجموعی ماہانہ تنخواہ {{salary}} روپے ہوگی، ماہانہ قانونی کٹوتیوں کے تابق ادایا جائے گی۔

5۔ کام کے اوقات: معیاری دفتری اوقات لاگو ہوں گے، ہفتہ وار چھٹی کمپنی پالیسی کے مطابق۔

6۔ رخصت: آپ سالانہ، کژوئل، اور طبی رخصت کے حقدار ہوں گے کمپنی پالیسی اور قابلِ لاگو محنت قوانین کے مطابق۔

7۔ رازداری: آپ کمپنی کی تمام معلومات کو خفیہ رکھیں گے۔

8۔ خاتمہ: کوئی بھی فریق ایک ماہ کا نوٹس یا اس کے بدلے تنخواہ دے کر ملازمت ختم کر سکتا ہے۔

9۔ قابلِ لاگو قانون: یہ تقرری پاکستان کے قوانین کے تابع ہوگی۔

اگر آپ اس پیشکش کو قبول کرتے ہیں، تو اس خط کی نقل پر دستخط کر کے واپس کریں۔

ہم آپ کی کمپنی کے لیے مثبت کردار کا منتظر ہیں۔

براے {{companyName}}

_________________________
اجازت یافتہ دستخط کار

قبولیت

میں، {{employeeName}}، مندرجہ بالا ملازمت کی پیشکش کو شرائط کے مطابق قبول کرتا/کرتی ہوں۔

_________________________
ملازم کا دستخط
تاریخ:`,
    previewText: 'Formal job offer letter with all key employment terms...',
  },
  {
    title: 'Sale Deed (Bay-Nama)',
    titleUrdu: 'بیع نامہ',
    slug: 'sale-deed',
    description: 'A property sale deed for transferring ownership of immovable property from seller to buyer. Includes price, property details, and transfer terms.',
    descriptionUrdu: 'غیر منقولہ جائداد کی ملکیت کو فروخت کنندہ سے خریدار کو منتقل کرنے کے لیے جائداد بیع نامہ۔ قیمت، جائداد کی تفصیلات، اور منتقلی کی شرائط شامل۔',
    category: 'Property & Real Estate',
    categoryUrdu: 'جائداد و رئیل اسٹیٹ',
    fields: [
      { key: 'sellerName', label: 'Seller Name', labelUrdu: 'فروخت کنندہ کا نام', type: 'text', required: true },
      { key: 'sellerCnic', label: 'Seller CNIC', labelUrdu: 'فروخت کنندہ کا شناختی کارڈ', type: 'text', required: true },
      { key: 'sellerAddress', label: 'Seller Address', labelUrdu: 'فروخت کنندہ کا پتہ', type: 'textarea', required: true },
      { key: 'buyerName', label: 'Buyer Name', labelUrdu: 'خریدار کا نام', type: 'text', required: true },
      { key: 'buyerCnic', label: 'Buyer CNIC', labelUrdu: 'خریدار کا شناختی کارڈ', type: 'text', required: true },
      { key: 'buyerAddress', label: 'Buyer Address', labelUrdu: 'خریدار کا پتہ', type: 'textarea', required: true },
      { key: 'propertyDetails', label: 'Property Description', labelUrdu: 'جائداد کی تفصیل', type: 'textarea', required: true },
      { key: 'price', label: 'Sale Price (Rs.)', labelUrdu: 'بیع قیمت (روپے)', type: 'number', required: true },
      { key: 'executionDate', label: 'Execution Date', labelUrdu: 'توثیق کی تاریخ', type: 'date', required: true },
    ],
    templateText: `SALE DEED (BAY-NAMA)

This Sale Deed is made and executed on {{executionDate}} at [City], Pakistan.

BETWEEN:

Mr/Ms. {{sellerName}}, CNIC No. {{sellerCnic}}, residing at {{sellerAddress}} (hereinafter called the "Seller") of the ONE PART;

AND

Mr/Ms. {{buyerName}}, CNIC No. {{buyerCnic}}, residing at {{buyerAddress}} (hereinafter called the "Buyer") of the OTHER PART.

WHEREAS the Seller is the absolute owner of the property more particularly described in the Schedule below;

AND WHEREAS the Seller has agreed to sell, and the Buyer has agreed to purchase, the said property for a total consideration of Rs. {{price}}/- (Rupees [in words] only).

NOW THIS DEED WITNESSETH AS FOLLOWS:

1. SALE: The Seller hereby sells, transfers, and conveys the said property to the Buyer with all rights, title, and interest.

2. CONSIDERATION: The total sale price is Rs. {{price}}/-, the receipt of which the Seller acknowledges.

3. POSSESSION: The Seller shall hand over vacant possession of the property to the Buyer on execution of this deed.

4. TITLE: The Seller assures that the property is free from all encumbrances, liens, and disputes.

5. EXPENSES: All stamp duty, registration charges, and taxes shall be borne as per law.

SCHEDULE OF PROPERTY
{{propertyDetails}}

IN WITNESS WHEREOF, the parties have signed this Sale Deed on the date first above written.

_________________________          _________________________
Seller                              Buyer

WITNESSES:

1. _________________________ (Name, CNIC, Signature)

2. _________________________ (Name, CNIC, Signature)`,
    templateTextUrdu: `بیع نامہ

یہ بیع نامہ {{executionDate}} کو [شہر]، پاکستان میں عمل میں لایا گیا۔

کے درمیان:

جناب/محترمہ {{sellerName}}، شناختی کارڈ نمبر {{sellerCnic}}، رہائشی {{sellerAddress}} (جو آئندہ "فروخت کنندہ" کہلائے گا) ایک طرف سے؛

اور

جناب/محترمہ {{buyerName}}، شناختی کارڈ نمبر {{buyerCnic}}، رہائشی {{buyerAddress}} (جو آئندہ "خریدار" کہلائے گا) دوسری طرف سے۔

جبکہ فروخت کنندہ مندرجہ ذیل شیڈول میں بیان کردہ جائداد کا مطلق مالک ہے؛

اور جبکہ فروخت کنندہ نے بیع کرنے پر اور خریدار نے خریدنے پر اتفاق کیا ہے، مذکورہ جائداد کے لیے مجموعی رقم {{price}} روپے۔

اب اس بیع نامے کی گواہی درج ذیل ہے:

1۔ بیع: فروخت کنندہ اسی جائداد کو خریدار کو تمام حقوق، عنوان، اور مفادات کے ساتھ بیع، منتقل، اور سپرد کرتا ہے۔

2۔ معاوضہ: مجموعی بیع قیمت {{price}} روپے ہے، جس کی وصولی فروخت کنندہ تسلیم کرتا ہے۔

3۔ قبضہ: فروخت کنندہ اس بیع نامے کی توثیق پر جائداد کا خالی قبضہ خریدار کے حوالے کر دے گا۔

4۔ عنوان: فروخت کنندہ یقینی بناتا ہے کہ جائداد تمام بوجھوں، رہن، اور تنازعات سے پاک ہے۔

5۔ اخراجات: سٹیمپ ڈیوٹی، رجسٹریشن فیس، اور ٹیکس قانون کے مطابق برداشت کیے جائیں گے۔

جائداد کا شیڈول
{{propertyDetails}}

جس کی گواہی میں فریقین نے مندرجہ بالا تاریخ کو اس بیع نامے پر دستخط کیے۔

_________________________          _________________________
فروخت کنندہ                         خریدار

گواہ:

1۔ _________________________ (نام، شناختی کارڈ، دستخط)

2۔ _________________________ (نام، شناختی کارڈ، دستخط)`,
    previewText: 'A property sale deed for transferring ownership...',
  },
  {
    title: 'General Affidavit',
    titleUrdu: 'عام حلفی بیان',
    slug: 'general-affidavit',
    description: 'A versatile general affidavit template that can be used for various declarations and sworn statements.',
    descriptionUrdu: 'ایک ہمہ مقصدی عام حلفی بیان ٹیمپلیٹ جو مختلف بیانات اور حلفی بیانات کے لیے استعمال کیا جا سکتا ہے۔',
    category: 'Identity & Declarations',
    categoryUrdu: 'شناخت و بیانات',
    fields: [
      { key: 'deponentName', label: 'Deponent Name', labelUrdu: 'بیان دہندہ کا نام', type: 'text', required: true },
      { key: 'deponentCnic', label: 'CNIC', labelUrdu: 'شناختی کارڈ', type: 'text', required: true },
      { key: 'deponentAddress', label: 'Address', labelUrdu: 'پتہ', type: 'textarea', required: true },
      { key: 'declaration', label: 'Declaration Statement', labelUrdu: 'بیان', type: 'textarea', required: true, placeholder: 'Type your declaration here...' },
      { key: 'date', label: 'Date', labelUrdu: 'تاریخ', type: 'date', required: true },
    ],
    templateText: `GENERAL AFFIDAVIT

I, {{deponentName}}, holder of CNIC No. {{deponentCnic}}, resident of {{deponentAddress}}, do hereby solemnly affirm and declare as under:

{{declaration}}

I affirm and declare that the contents of this affidavit are true and correct to the best of my knowledge and belief, and nothing has been concealed or misstated. I am liable for any false statement under the law.

Date: {{date}}

_________________________
Deponent

Sworn and signed before me on this {{date}} at [City, Pakistan].

_________________________
Oath Commissioner`,
    templateTextUrdu: `عام حلفی بیان

میں، {{deponentName}}، شناختی کارڈ نمبر {{deponentCnic}} کا حامل، رہائشی {{deponentAddress}}، حلفی طور پر یہ بیان دیتا/دیتی ہوں کہ:

{{declaration}}

میں حلفی بیان دیتا/دیتی ہوں کہ اس حلفی بیان کا مواد میرے علم اور یقین کے مطابق سچ و درست ہے، اور کچھ بھی چھپایا یا غلط بیان نہیں کیا گیا۔ میں کسی بھی جھوٹے بیان کے لیے قانون کے تابع ہوں/ہوں۔

تاریخ: {{date}}

_________________________
بیان دہندہ

مجھ سے حلفی دستخط اس تاریخ {{date}} کو [شہر، پاکستان] میں کیے گئے۔

_________________________
حلفی کمشنر`,
    previewText: 'A flexible affidavit template for any sworn declaration...',
  },
]
