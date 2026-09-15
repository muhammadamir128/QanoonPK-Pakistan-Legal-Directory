// FAQ data — common legal questions and answers for the Pakistani public

export type FAQItem = {
  id: string
  question: string
  questionUrdu: string
  answer: string
  answerUrdu: string
  category: string
  categoryUrdu: string
  relatedLaws?: string[] // slugs
  helpful?: boolean
}

export const faqItems: FAQItem[] = [
  // Criminal
  {
    id: 'fir-registration',
    question: 'How do I register an FIR (First Information Report)?',
    questionUrdu: 'میں ایف آئی آر (پہلی معلوماتی رپورٹ) کیسے درج کرواؤں؟',
    answer: 'To register an FIR, visit the police station having territorial jurisdiction over the place where the offence occurred. The SHO is legally bound to register the FIR under Section 154 CrPC. If they refuse, you can: (1) Send the complaint by registered post to the SP of the district; (2) File a complaint before the District & Sessions Judge under Section 22-A CrPC; (3) Approach the High Court under its constitutional jurisdiction (Art. 199). The FIR must be registered free of cost — no fee is chargeable.',
    answerUrdu: 'ایف آئی آر درج کرانے کے لیے، اس تھانے میں جائیں جس کا علاقائی اختیار جرم کے مقام پر ہو۔ ایس ایچ او قانوناً شق 154 CrPC کے تحت ایف آئی آر درج کرنے کا پابند ہے۔ اگر وہ انکار کرے تو آپ: (1) ضلع کے ایس پی کو رجسٹرڈ ڈاک کے ذریعے استغاثہ بھیجیں؛ (2) شق 22-A CrPC کے تحت ڈسٹرکٹ و سیشن جج کے سامنے استغاثہ دائر کریں؛ (3) آئینی اختیار (آرٹیکل 199) کے تحت ہائی کورٹ سے رجوع کریں۔ ایف آئی آر مفت درج ہوتی ہے — کوئی فیس نہیں۔',
    category: 'Criminal',
    categoryUrdu: 'فوجداری',
    relatedLaws: ['code-of-criminal-procedure-1898', 'pakistan-penal-code-1860'],
  },
  {
    id: 'bail-process',
    question: 'What is the procedure to get bail?',
    questionUrdu: 'ضمانت حاصل کرنے کا طریقہ کار کیا ہے؟',
    answer: 'For bailable offences, bail is granted as a right by the SHO or the court. For non-bailable offences, you must file a bail application before the Magistrate/Sessions Court. The court considers factors like: nature of accusation, severity of punishment, likelihood of accused fleeing, evidence strength, and criminal record. If the trial court rejects bail, you can appeal to the High Court and then the Supreme Court. A surety bond and surety guarantees are typically required.',
    answerUrdu: 'ضمانت کے قابل جرائم میں، ضمانت حق کے طور پر ایس ایچ او یا عدالت کی طرف سے دی جاتی ہے۔ غیر ضمانت کے قابل جرائم میں، آپ کو مجسٹریٹ/سیشن کورٹ کے سامنے ضمانت کی درخواست دائر کرنی ہوگی۔ عدالت علاقائی الزام، سزا کی شدت، ملزم کے بھاگنے کے امکانات، ثبوت کی مضبوطی، اور مجرمانہ ریکارڈ جیسے عوامل کو مدنظر رکھتی ہے۔ اگر ٹرائل کورٹ ضمانت مسترد کر دے، تو آپ ہائی کورٹ اور پھر سپریم کورٹ میں اپیل کر سکتے ہیں۔ ضمانتی باندھ اور ضمانتی گارنٹیاں عموماً ضروری ہوتی ہیں۔',
    category: 'Criminal',
    categoryUrdu: 'فوجداری',
    relatedLaws: ['code-of-criminal-procedure-1898'],
  },
  {
    id: 'defamation-case',
    question: 'Can I file a case for defamation?',
    questionUrdu: 'کیا میں عزت آبری کا مقدمہ دائر کر سکتا ہوں؟',
    answer: 'Yes. Defamation is criminalized under Sections 499-500 PPC (up to 2 years imprisonment + fine). You can also file a civil suit for damages. For online defamation, Section 20 of PECA 2016 applies (up to 2 years imprisonment + Rs. 1 million fine). The limitation period for civil defamation is 1 year from the date of publication. You must prove: (1) a false statement was made; (2) it was published to a third party; (3) it injured your reputation; (4) the defendant acted negligently or with malice.',
    answerUrdu: 'جی ہاں۔ عزت آبری شقوط 499-500 PPC کے تحت جرم ہے (2 سال تک قید + جرمانہ)۔ آپ نقصان کے لیے دیوانی دعوا بھی دائر کر سکتے ہیں۔ آن لائن عزت آبری کے لیے PECA 2016 کی شق 20 لاگو ہوتی ہے (2 سال قید + 10 لاکھ روپے جرمانہ)۔ دیوانی عزت آبری کی مدت اشاعت کی تاریخ سے 1 سال ہے۔ آپ کو ثابت کرنا ہوگا: (1) جھوٹا بیان دیا گیا؛ (2) اسے تیسری فریق کو شائع کیا گیا؛ (3) اس نے آپ کی شہرت کو نقصان پہنچایا؛ (4) مدعی علیہ نے لاپروائی یا بدنیتی سے عمل کیا۔',
    category: 'Criminal',
    categoryUrdu: 'فوجداری',
    relatedLaws: ['pakistan-penal-code-1860', 'prevention-of-electronic-crimes-act-2016'],
  },

  // Family
  {
    id: 'talaq-procedure',
    question: 'What is the legal procedure for talaq (divorce by husband)?',
    questionUrdu: 'طلاق (شوہر کی طرف سے طلاق) کا قانونی طریقہ کار کیا ہے؟',
    answer: 'Under Section 7 of the Muslim Family Laws Ordinance 1961: (1) The husband pronounces talaq; (2) He must immediately give written notice to the Chairman of the Union Council and send a copy to the wife; (3) Within 30 days, the Chairman forms an Arbitration Council to attempt reconciliation; (4) Talaq becomes effective 90 days after the notice is received by the Chairman (unless the wife is pregnant — then it takes effect after delivery). Failure to follow this procedure is punishable with imprisonment up to 1 year + Rs. 5,000 fine. Importantly, talaq not communicated in writing is NOT legally effective.',
    answerUrdu: 'مسلم فیملی لاز آرڈیننس 1961 کی شق 7 کے تحت: (1) شوہر طلاق دیتا ہے؛ (2) وہ فوراً یونین کونسل کے چیئرمین کو تحریری اطلاع دے اور بیوی کو کاپی بھیجے؛ (3) 30 دن کے اندر چیئرمین مصالحت کی کوشش کے لیے ثالثی کونسل بناتا ہے؛ (4) طلاق چیئرمین کے پاس اطلاع پہنچنے کے 90 دن بعد نافذ ہوتی ہے (جب تک بیوی حاملہ نہ ہو — تب تک وہ وضع حمل کے بعد نافذ ہوتی ہے)۔ اس طریقہ کار کی عدم پابندی 1 سال تک قید + 5,000 روپے جرمانے کی سزا رکھتی ہے۔ اہم بات: تحریری طور پر بغیر اطلاع دی طلاق قانوناً نافذ نہیں۔',
    category: 'Family',
    categoryUrdu: 'خاندانی',
    relatedLaws: ['muslim-family-laws-ordinance-1961'],
  },
  {
    id: 'khula-procedure',
    question: 'How can a wife get khula (judicial divorce)?',
    questionUrdu: 'بیوی خلع (عدالتی طلاق) کیسے حاصل کر سکتی ہے؟',
    answer: 'Khula is the wife\'s right to seek divorce through court under Section 8 of the MFLO 1961 and Section 10 of the Family Courts Act 1964. The procedure: (1) File a suit for khula in the Family Court having jurisdiction; (2) The court attempts reconciliation within the pre-trial phase; (3) If reconciliation fails and the wife is willing to return the dower (haq mehr) and other benefits received during marriage, the court dissolves the marriage; (4) The court issues a khula decree within 4-6 months typically. The wife does not need the husband\'s consent. Grounds include cruelty, desertion, failure to maintain, impotency, or any other valid reason.',
    answerUrdu: 'خلع بیوی کا حق ہے جو MFLO 1961 کی شق 8 اور فیملی کورٹس ایکٹ 1964 کی شق 10 کے تحت عدالت کے ذریعے طلاق حاصل کرنے کا ہے۔ طریقہ کار: (1) اختیار رکھنے والی فیملی کورٹ میں خلع کا دعوا دائر کریں؛ (2) عدالت پری ٹرائل مرحلے میں مصالحت کی کوشش کرتی ہے؛ (3) اگر مصالحت ناکام ہو اور بیوی مہر اور شادی کے دوران موصول ہونے والے دیگر فوائد واپس کرنے پر رضا مند ہو، تو عدالت شادی تحلیل کر دیتی ہے؛ (4) عدالت عموماً 4-6 ماہ میں خلع کا حکم جاری کرتی ہے۔ بیوی کو شوہر کی رضامندی کی ضرورت نہیں۔ بنیادوں میں ظلم، ترک، نان نفقہ نہ دینا، نامردی، یا کوئی اور موزوں وجہ شامل ہے۔',
    category: 'Family',
    categoryUrdu: 'خاندانی',
    relatedLaws: ['family-courts-act-1964', 'muslim-family-laws-ordinance-1961', 'dissolution-of-muslim-marriages-act-1939'],
  },
  {
    id: 'child-custody',
    question: 'Who gets child custody after divorce?',
    questionUrdu: 'طلاق کے بعد بچوں کی حضانت کسے ملتی ہے؟',
    answer: 'Child custody (hizanat) is governed by the Guardian and Wards Act 1890. The paramount consideration is the welfare of the minor. General rules: (1) Mother has the right of hizanat of a boy until 7 years and a girl until puberty (Hanafi school); (2) After this period, custody typically shifts to the father, but courts can extend the mother\'s custody for the child\'s welfare; (3) The father is the natural guardian (wali) of the minor\'s property throughout; (4) Mother can lose custody if she is of bad character, marries a stranger, or changes religion. The court can modify custody at any time based on the child\'s best interest.',
    answerUrdu: 'بچوں کی حضانت گارڈین اینڈ وارڈز ایکٹ 1890 کے تحت منظم ہوتی ہے۔ بنیادی غور نابالغ کی بھلائی ہے۔ عمومی اصول: (1) ماں کا حق حضانت لڑکے کے لیے 7 سال تک اور لڑکی کے لیے بلوغت تک ہے (حنفی مدرسہ)؛ (2) اس مدت کے بعد، حضانت عموماً باپ کو منتقل ہوتی ہے، مگر عدالتیں بچے کی بھلائی کے لیے ماں کی حضامت میں توسیع کر سکتی ہیں؛ (3) باپ نابالغ کی جائداد کا قدرتی سرپرست (ولی) رہتا ہے؛ (4) ماں حضانت سے محروم ہو سکتی ہے اگر اس کا کردار خراب ہو، غیر سے شادی کر لے، یا مذہب بدل لے۔ عدالت بچے کی بہترین دلچسپی کی بنیاد پر کسی بھی وقت حضانت تبدیل کر سکتی ہے۔',
    category: 'Family',
    categoryUrdu: 'خاندانی',
    relatedLaws: ['guardian-and-wards-act-1890', 'family-courts-act-1964'],
  },
  {
    id: 'second-marriage',
    question: 'Can a man take a second wife without permission?',
    questionUrdu: 'کیا شوہر بغیر اجازت دوسری شادی کر سکتا ہے؟',
    answer: 'Under Section 6 of the Muslim Family Laws Ordinance 1961, a man cannot contract a second marriage while the first marriage is subsisting without prior permission in writing from the Arbitration Council. To get permission, he must submit an application stating: (1) reasons for the proposed marriage; (2) whether the consent of the existing wife/wives has been obtained. The Council considers the application and grants or refuses permission. Contracting a second marriage without permission is punishable with imprisonment up to 1 year + Rs. 5,000 fine. The second marriage itself is still valid, but the husband is guilty of an offence.',
    answerUrdu: 'مسلم فیملی لاز آرڈیننس 1961 کی شق 6 کے تحت، شوہر پہلی بیوی زندہ رہتے ہوئے بغیر ثالثی کونسل کی تحریری اجازت کے دوسری شادی نہیں کر سکتا۔ اجازت حاصل کرنے کے لیے، اسے درخواست داخل کرنی ہوگی جس میں بیان ہو: (1) تجویز کردہ شادی کی وجوہات؛ (2) موجودہ بیوی/بیویوں کی رضامندی حاصل ہوئی ہے یا نہیں۔ کونسل درخواست پر غور کرتی ہے اور اجازت دے یا انکار کرے۔ بغیر اجازت دوسری شادی کرنے کی سزا 1 سال تک قید + 5,000 روپے جرمانہ ہے۔ دوسری شادی خود بخود قانونی ہے، مگر شوہر جرم کا مرتکب ہے۔',
    category: 'Family',
    categoryUrdu: 'خاندانی',
    relatedLaws: ['muslim-family-laws-ordinance-1961'],
  },

  // Cyber
  {
    id: 'online-harassment',
    question: 'What should I do if I am being harassed online?',
    questionUrdu: 'اگر میں آن لائن ہراسانی کا شکار ہوں تو کیا کروں؟',
    answer: 'Online harassment is a criminal offence under Section 16 (cyber stalking) and Section 20 (insult/dignity) of PECA 2016. Steps to take: (1) Document all evidence — screenshots, URLs, dates, times, messages; (2) Report the harasser on the platform (Facebook, Twitter, etc.); (3) File a complaint with the FIA Cyber Crime Wing (ccw@fia.gov.pk or call 1991); (4) Block the harasser; (5) If serious threats, file an FIR at your local police station; (6) For urgent threats, contact the Pakistan Telecommunication Authority (PTA) at 0800-55055. The FIA must register the complaint within 24 hours.',
    answerUrdu: 'آن لائن ہراسانی PECA 2016 کی شق 16 (سائبر اسٹاکنگ) اور شق 20 (تذلیل/عزت) کے تحت جرم ہے۔ اقدامات: (1) تمام ثبوت محفوظ کریں — اسکرین شاٹس، یو آر ایل، تاریخیں، اوقات، پیغامات؛ (2) ہراساں کرنے والے کو پلیٹ فارم پر رپورٹ کریں (فیس بک، ٹوئٹر وغیرہ)؛ (3) ایف آئی اے سائبر کرائم ونگ میں شکایت درج کریں (ccw@fia.gov.pk یا 1991 پر کال)؛ (4) ہراساں کرنے والے کو بلاک کریں؛ (5) سنگین دھمکیوں کی صورت میں اپنے مقامی تھانے میں ایف آئی آر درج کریں؛ (6) فوری دھمکیوں کے لیے پاکستان ٹیلی کامنکیشن اتھارٹی (PTA) 0800-55055 سے رابطہ کریں۔ ایف آئی اے 24 گھنٹوں کے اندر شکایت درج کرنے کا پابند ہے۔',
    category: 'Cyber',
    categoryUrdu: 'سائبر',
    relatedLaws: ['prevention-of-electronic-crimes-act-2016'],
  },
  {
    id: 'fake-account',
    question: 'Someone created a fake account in my name. What can I do?',
    questionUrdu: 'کسی نے میرے نام سے جعلی اکاؤنٹ بنایا ہے۔ میں کیا کر سکتا ہوں؟',
    answer: 'Creating a fake account in someone else\'s name is an offence under Sections 13 (electronic forgery) and 16 (cyber stalking) of PECA 2016, with imprisonment up to 3 years + fine up to Rs. 250,000 (Section 13) or 3 years + Rs. 1 million (Section 16). Steps: (1) Report the fake account to the platform (Facebook: facebook.com/hacked, Twitter: support form); (2) Take screenshots before the account is removed; (3) File a complaint with FIA Cyber Crime Wing (ccw@fia.gov.pk); (4) Send a legal notice through a lawyer demanding removal; (5) For defamation, file a complaint under Section 20 PECA. The PTA also has authority to direct platforms to remove offending content.',
    answerUrdu: 'کسی اور کے نام سے جعلی اکاؤنٹ بنانا PECA 2016 کی شقوط 13 (الیکٹرانک جعلسازی) اور 16 (سائبر اسٹاکنگ) کے تحت جرم ہے، 3 سال قید + 250,000 روپے جرمانہ (شق 13) یا 3 سال + 10 لاکھ روپے (شق 16)۔ اقدامات: (1) جعلی اکاؤنٹ کو پلیٹ فارم پر رپورٹ کریں (فیس بک: facebook.com/hacked، ٹوئٹر: سپورٹ فارم)؛ (2) اکاؤنٹ ہٹائے جانے سے پہلے اسکرین شاٹ لیں؛ (3) ایف آئی اے سائبر کرائم ونگ میں شکایت درج کریں (ccw@fia.gov.pk)؛ (4) وکیل کے ذریعے قانونی نوٹس بھیجیں کہ اکاؤنٹ ہٹایا جائے؛ (5) عزت آبری کے لیے شق 20 PECA کے تحت شکایت دائر کریں۔ PTA کو بھی پلیٹ فارمز کو ہدایت کرنے کا اختیار ہے۔',
    category: 'Cyber',
    categoryUrdu: 'سائبر',
    relatedLaws: ['prevention-of-electronic-crimes-act-2016'],
  },

  // Property
  {
    id: 'property-purchase',
    question: 'What documents should I check before buying property?',
    questionUrdu: 'جائداد خریدنے سے پہلے کون سی دستاویزات چیک کروں؟',
    answer: 'Before buying property, verify: (1) Title documents — Fard Malkiat (Record of Rights) from the patwari; (2) Mutation (Intqaal) entries showing previous transfers; (3) Whether the property is mortgaged — check with the relevant Sub-Registrar; (4) Property tax receipts up to date; (5) Utility bills (electricity, gas, water) cleared; (6) Approved building plan if construction exists; (7) NOC from relevant authority (CDA, LDA, KDA, etc.) for housing societies; (8) CNIC verification of seller through NADRA; (9) For agricultural land: Aks Shajra (field map) and Tatima Shajra. Always engage a competent lawyer for due diligence before paying any token money.',
    answerUrdu: 'جائداد خریدنے سے پہلے تصدیق کریں: (1) دستاویزاتِ عنوان — پٹواری سے فرد ملکیت (حقوق کا ریکارڈ)؛ (2) منتقلی (انتقال) کے اندراجات جو پچھلی منتقلیوں کو دکھاتے ہیں؛ (3) جائداد رہن تو نہیں — متعلقہ سب رجسٹرار سے چیک کریں؛ (4) پراپرٹی ٹیکس کی وصولیاں تک جدید؛ (5) یوٹیلیٹی بل (بجلی، گیس، پانی) صاف؛ (6) اگر تعمیر ہے تو منظور شدہ بلڈنگ پلان؛ (7) متعلقہ اتھارٹی (CDA، LDA، KDA وغیرہ) سے این او سی ہاؤسنگ سوسائٹیز کے لیے؛ (8) نادرا کے ذریعے فروش کی شناختی کارڈ کی تصدیق؛ (9) زرعی زمین کے لیے: نقشِ شجرہ اور تطیمہ شجرہ۔ کوئی بھی ٹوکن رقم ادا کرنے سے پہلے ہمیشہ قابل وکیل سے قانونی جانچ کروائیں۔',
    category: 'Property',
    categoryUrdu: 'جائداد',
    relatedLaws: ['transfer-of-property-act-1882', 'registration-act-1908', 'stamp-act-1899', 'land-revenue-act-1967'],
  },
  {
    id: 'tenant-rights',
    question: 'What are my rights as a tenant?',
    questionUrdu: 'بطور کرایہ دار میرے حقوق کیا ہیں؟',
    answer: 'Tenant rights in Pakistan are governed by provincial rent laws (e.g., Punjab Rented Premises Act 2009). Key rights: (1) The landlord cannot evict you without a court order; (2) Rent cannot be increased arbitrarily — usually capped by law; (3) You cannot be forced to vacate without sufficient notice (typically 1-2 months); (4) The landlord must maintain the premises in habitable condition; (5) Security deposit must be refunded at the end of tenancy, less legitimate deductions; (6) A written tenancy agreement is strongly recommended — verbal agreements are difficult to enforce. If evicted illegally, you can file a suit in the Rent Tribunal.',
    answerUrdu: 'پاکستان میں کرایہ دار کے حقوق صوبائی کرایہ قوانین (مثلاً پنجاب کرایہ داری پریمیسز ایکٹ 2009) کے تحت ہیں۔ اہم حقوق: (1) مکان مالک عدالتی حکم کے بغیر آپ کو بے دخل نہیں کر سکتا؛ (2) کرایہ خودمختارانہ طور پر بڑھایا نہیں جا سکتا — عموماً قانون کے تحت محدود؛ (3) کافی نوٹس (عموماً 1-2 ماہ) کے بغیر خالی کرانے پر مجبور نہیں کیا جا سکتا؛ (4) مکان مالک کو پریمیسز کو رہائشی حالت میں رکھنا ہوگا؛ (5) سیکیورٹی ڈپازٹ کرایہ داری کے اختتام پر واپس کیا جانا چاہیے، جائز کٹوتیوں کے سوا؛ (6) تحریری کرایہ معاہدہ مضبوطی سے تجویز کیا جاتا ہے — زبانی معاہدے نافذ کرنا مشکل ہیں۔ غیر قانونی طور پر بے دخل کیے جانے پر، آپ کرایہ ٹریبیونل میں دعوا دائر کر سکتے ہیں۔',
    category: 'Property',
    categoryUrdu: 'جائداد',
    relatedLaws: ['transfer-of-property-act-1882', 'contract-act-1872'],
  },

  // Tax
  {
    id: 'become-filer',
    question: 'How do I become an active taxpayer (filer)?',
    questionUrdu: 'میں ایکٹو ٹیکس پیر (فائلر) کیسے بنوں؟',
    answer: 'To become a filer with the FBR: (1) Register at the FBR IRIS portal (iris.fbr.gov.pk) using your CNIC and mobile number; (2) After registration, file your annual Income Tax Return by September 30 each year (for salaried individuals) — even with zero income, filing is mandatory to remain on the Active Taxpayer List (ATL); (3) The ATL is updated every Monday based on returns filed in the previous week; (4) Benefits of being a filer: lower withholding tax rates on banking transactions, property purchases, vehicle purchases, and many other transactions. Non-filers pay 2-4x higher withholding tax rates. You can verify your filer status at fbr.gov.pk/atl.',
    answerUrdu: 'FBR کے ساتھ فائلر بننے کے لیے: (1) FBR IRIS پورٹل (iris.fbr.gov.pk) پر اپنے شناختی کارڈ اور موبائل نمبر کے ساتھ رجسٹر کریں؛ (2) رجسٹریشن کے بعد، ہر سال 30 ستمبر تک اپنا سالانہ انکم ٹیکس ریٹرن داخل کریں (تنخواہ یافتہ افراد کے لیے) — صفر آمدنی پر بھی ATL میں رہنے کے لیے اندراج لازم؛ (3) ATL ہر پیر کو اپ ڈیٹ ہوتا ہے پچھلے ہفتے داخل شدہ ریٹرنز کی بنیاد پر؛ (4) فائلر ہونے کے فوائد: بینکنگ لین دین، جائداد کی خریداری، گاڑی کی خریداری، اور دیگر متعدد لین دین پر کم وِلڈنگ ٹیکس کی شرح۔ نان فائلرز 2-4 گنا زیادہ وِلڈنگ ٹیکس ادا کرتے ہیں۔ اپنا فائلر اسٹیٹس fbr.gov.pk/atl پر تصدیق کر سکتے ہیں۔',
    category: 'Tax',
    categoryUrdu: 'ٹیکس',
    relatedLaws: ['income-tax-ordinance-2001'],
  },
  {
    id: 'tax-filing-due',
    question: 'When is income tax filing due?',
    questionUrdu: 'انکم ٹیکس اندراج کب تک ہو؟',
    answer: 'Income tax returns in Pakistan are due on September 30 each year for individuals and AOPs (Associations of Persons). For companies, the due date is the 6th month after the close of the tax year (typically December 31 for a June 30 year-end). You can file a revised return within 5 years of the original filing date. Late filing attracts a penalty of 0.1% of the tax payable per day (subject to a minimum of Rs. 1,000 and maximum of 50% of the tax due). Even if your income is below the taxable threshold, you must file to remain on the Active Taxpayer List (ATL). The tax year in Pakistan runs from July 1 to June 30.',
    answerUrdu: 'پاکستان میں انکم ٹیکس ریٹرن افراد اور AOPs (اشخاص کی انجمنیں) کے لیے ہر سال 30 ستمبر تک داخل کرنا لازم ہے۔ کمپنیوں کے لیے، ٹیکس سال کے بند ہونے کے 6ویں مہینے کی تاریخ ہے (عموماً 30 جون کے سال کے اختتام کے لیے 31 دسمبر)۔ آپ اصل اندراج کی تاریخ سے 5 سال کے اندر ترمیم شدہ ریٹرن داخل کر سکتے ہیں۔ دیر سے اندراج پر قابلِ ادا ٹیکس کے 0.1% فی دن کا جرمانہ (کم از کم 1,000 روپے اور زیادہ سے زیادہ ٹیکس کا 50%)۔ اگر آپ کی آمدنی ٹیکس کی حد سے کم ہے، تب بھی ATL میں رہنے کے لیے اندراج لازم ہے۔ پاکستان میں ٹیکس سال 1 جولائی سے 30 جون تک چلتا ہے۔',
    category: 'Tax',
    categoryUrdu: 'ٹیکس',
    relatedLaws: ['income-tax-ordinance-2001'],
  },

  // Labor
  {
    id: 'unpaid-salary',
    question: 'My employer is not paying my salary. What can I do?',
    questionUrdu: 'میرا آجر میری تنخواہ نہیں دے رہا۔ میں کیا کر سکتا ہوں؟',
    answer: 'Unpaid salary is a violation of the Payment of Wages Act 1936. Steps: (1) Send a written demand to the employer by registered post, stating the amount and period; (2) If unpaid after 15 days, file a claim before the Labour Court (within 6 months of the unpaid wage); (3) For amounts above Rs. 1,000, file a civil suit; (4) For wrongful termination, file a separate claim under the Industrial Relations Act 2012; (5) You can also approach the Federal/Provincial Ombudsman. Keep evidence: appointment letter, salary slips, bank statements, attendance records. Penalties on employer: up to 6 months imprisonment + Rs. 1,000 fine.',
    answerUrdu: 'تنخواہ نہ دینا پیمنٹ آف ویجز ایکٹ 1936 کی خلاف ورزی ہے۔ اقدامات: (1) رجسٹرڈ ڈاک کے ذریعے آجر کو تحریری مطالبہ بھیجیں، رقم اور مدت بیان کرتے ہوئے؛ (2) 15 دن بعد بھی نہ ملنے پر، لیبر کورٹ میں دعوا دائر کریں (ادا نہ ہونے والی تنخواہ کے 6 ماہ کے اندر)؛ (3) 1,000 روپے سے زیادہ کے لیے، دیوانی دعوا دائر کریں؛ (4) غیر قانونی برطرفی کے لیے، انڈسٹریل ریلیشنز ایکٹ 2012 کے تحت الگ دعوا دائر کریں؛ (5) وفاقی/صوبائی سمچاسپرس سے بھی رجوع کر سکتے ہیں۔ ثبوت محفوظ رکھیں: تقرری کا خط، تنخواہ کی سلپس، بینک اسٹیٹمنٹس، حاضری کے ریکارڈ۔ آجر پر سزا: 6 ماہ تک قید + 1,000 روپے جرمانہ۔',
    category: 'Labor',
    categoryUrdu: 'محنت',
    relatedLaws: ['payment-of-wages-act-1936', 'industrial-relations-act-2012'],
  },
  {
    id: 'workplace-harassment',
    question: 'How do I report workplace harassment?',
    questionUrdu: 'میں ورک پلیس ہراسانی کی اطلاع کیسے دوں؟',
    answer: 'Workplace harassment is governed by the Protection Against Harassment of Women at Workplace Act 2010. Procedure: (1) File a written complaint with your organization\'s Inquiry Committee (mandatory for orgs with 25+ employees); (2) The Committee must complete inquiry within 30 days; (3) Major penalties: dismissal, reduction in rank, compulsory retirement, fine up to Rs. 500,000; (4) If unsatisfied with the Committee\'s decision, appeal to the Ombudsperson (federal or provincial) within 30 days; (5) Ombudsperson decisions can be challenged in the High Court. Time limit to file original complaint: 3 months from the incident. The Act protects both women and men.',
    answerUrdu: 'ورک پلیس ہراسانی پری وینشن اگینسٹ ہراسمنٹ آف ویمن ایٹ ورک پلیس ایکٹ 2010 کے تحت منظم ہے۔ طریقہ کار: (1) اپنے ادارے کی انکوائری کمیٹی کو تحریری شکایت دائر کریں (25+ ملازمین والے اداروں کے لیے لازمی)؛ (2) کمیٹی 30 دن کے اندر انکوائری مکمل کرے گی؛ (3) بڑی سزاؤں: برطرفی، رینک میں کمی، لازمی ریٹائرمنٹ، 5 لاکھ تک جرمانہ؛ (4) کمیٹی کے فیصلے سے غیر مطمئن ہوں تو 30 دن کے اندر سمچاسپرس (وفاقی یا صوبائی) میں اپیل کریں؛ (5) سمچاسپرس کے فیصلے کو ہائی کورٹ میں چیلنج کیا جا سکتا ہے۔ اصل شکایت درج کرانے کی مدت: واقعہ سے 3 ماہ۔ یہ ایکٹ خواتین اور مرد دونوں کا تحفظ کرتا ہے۔',
    category: 'Labor',
    categoryUrdu: 'محنت',
    relatedLaws: ['protection-against-harassment-of-women-at-workplace-act-2010'],
  },

  // General
  {
    id: 'find-lawyer',
    question: 'How do I find and verify a lawyer?',
    questionUrdu: 'میں وکیل کیسے تلاش اور تصدیق کروں؟',
    answer: 'To find and verify a lawyer: (1) Search the QanoonPK Lawyer Directory (qpk/lawyers) for verified lawyers by city and specialization; (2) Verify the license number with the Pakistan Bar Council (pakistanbarcouncils.com) or the relevant provincial Bar Council; (3) Ask for references from previous clients; (4) Check the lawyer\'s experience in your specific type of case; (5) Discuss fees upfront — most charge a consultation fee + appearance fee per hearing; (6) Always sign a written engagement letter (wakalatnama) before any work begins; (7) For free legal aid, contact: Punjab Bar Council Free Legal Aid, Sindh High Court Legal Aid, or NGO-run legal aid clinics. Avoid "guarantee win" promises — no ethical lawyer can guarantee an outcome.',
    answerUrdu: 'وکیل تلاش اور تصدیق کے لیے: (1) شہر اور تخصیص کے لحاظ سے تصدیق شدہ وکلاء کے لیے قانون پی کے وکلاء ڈائریکٹری (qpk/lawyers) تلاش کریں؛ (2) لائسنس نمبر پاکستان بار کونسل (pakistanbarcouncils.com) یا متعلقہ صوبائی بار کونسل سے تصدیق کریں؛ (3) سابق کلائنٹس سے حوالہ جات لیں؛ (4) آپ کے مخصوص قسم کے کیس میں وکیل کا تجربہ چیک کریں؛ (5) فیس پہلے بحث کریں — اکثر کنسلٹیشن فیس + ہر سماعت پر اپیرنس فیس لیتے ہیں؛ (6) کسی بھی کام کے آغاز سے پہلے ہمیشہ تحریری وکالت نامہ پر دستخط کریں؛ (7) مفت قانونی امداد کے لیے: پنجاب بار کونسل فری لیگل اید، سندھ ہائی کورٹ لیگل اید، یا این جی اے چلائی قانونی امداد کلینکس سے رابطہ کریں۔ "جیت کی ضمانت" کے وعدوں سے بچیں — کوئی بھی اخلاقی وکیل نتیجہ کی ضمانت نہیں دے سکتا۔',
    category: 'General',
    categoryUrdu: 'عام',
  },
  {
    id: 'free-legal-aid',
    question: 'Where can I get free legal aid in Pakistan?',
    questionUrdu: 'پاکستان میں میں مفت قانونی امداد کہاں سے حاصل کر سکتا ہوں؟',
    answer: 'Free legal aid is available from several sources: (1) Punjab Legal Aid Agency (PLAA) — provides free legal aid to deserving citizens in Punjab; (2) Sindh High Court Legal Aid Committee — for Sindh residents; (3) Women\'s Legal Aid Societies in major cities; (4) Pakistan Bar Council Free Legal Aid — through district bar associations; (5) NGOs: AGHS Legal Aid Cell (Lahore), Shirkat Gah, Aurat Foundation, HRCP; (6) Law clinics at universities (LUMS, QAU, Punjab University); (7) For women victims of violence: Women Protection Centers in Punjab (helpline 1043). Eligibility is usually based on income (BPL cardholders) or for vulnerable groups (women, children, minorities).',
    answerUrdu: 'مفت قانونی امداد متعدد ذرائع سے دستیاب ہے: (1) پنجاب لیگل اید ایجنسی (PLAA) — پنجاب میں مستحق شہریوں کو مفت قانونی امداد فراہم کرتی ہے؛ (2) سندھ ہائی کورٹ لیگل اید کمیٹی — سندھ کے رہائشیوں کے لیے؛ (3) بڑے شہروں میں خواتین کی قانونی امداد سوسائٹیز؛ (4) پاکستان بار کونسل فری لیگل اید — ضلعی بار ایسوسی ایشنز کے ذریعے؛ (5) این جی اوز: AGHS لیگل اید سیل (لاہور)، شirkat گاه، عورت فاؤنڈیشن، HRCP؛ (6) یونیورسٹیز میں لا کلینکس (لومس، قائد اعظم یونیورسٹی، پنجاب یونیورسٹی)؛ (7) تشدد کا شکار خواتین کے لیے: پنجاب میں ویمن پروٹیکشن سینٹرز (ہیلپ لائن 1043)۔ اہلیت عموماً آمدنی (بی پی ایل کارڈ ہولڈرز) یا کمزور گروپوں (خواتین، بچے، اقلیتیں) پر مبنی ہے۔',
    category: 'General',
    categoryUrdu: 'عام',
  },
  {
    id: 'limitation-period',
    question: 'What is the limitation period for filing a case?',
    questionUrdu: 'مقدمہ دائر کرنے کی محدود مدت کیا ہے؟',
    answer: 'The Limitation Act 1908 sets time limits for filing different types of cases. After the period expires, the case is "time-barred" and cannot be filed. Common limitation periods: (1) Recovery of money: 3 years from the date it became due; (2) Possession of immovable property: 12 years; (3) Breach of contract: 3 years from the date of breach; (4) Appeal to District Court: 30 days from the decree; (5) Appeal to High Court: 90 days; (6) Appeal to Supreme Court: 60 days; (7) Defamation (civil): 1 year; (8) Cheque dishonor (Section 138 NI Act): 30 days from dishonor. There are exceptions for minors, persons of unsound mind, and those under legal disability. Always consult a lawyer to confirm the limitation for your specific case.',
    answerUrdu: 'محدود مدت ایکٹ 1908 مختلف قسم کے مقدمات کے اندراج کے لیے وقت کی حد مقرر کرتا ہے۔ مدت ختم ہونے کے بعد، کیس "وقت سے بند" ہو جاتا ہے اور دائر نہیں ہو سکتا۔ عام محدود مدتیں: (1) رقم وصولی: وصولی کی تاریخ سے 3 سال؛ (2) غیر منقولہ جائداد کی قبضہ: 12 سال؛ (3) معاہدے کی خلاف ورزی: خلاف ورزی کی تاریخ سے 3 سال؛ (4) ضلع کورٹ میں اپیل: ڈگری سے 30 دن؛ (5) ہائی کورٹ میں اپیل: 90 دن؛ (6) سپریم کورٹ میں اپیل: 60 دن؛ (7) عزت آبری (دیوانی): 1 سال؛ (8) چیک باؤنس (شق 138 NI Act): باؤنس سے 30 دن۔ نابالغوں، ذہنی طور پر غیر معتبر افراد، اور قانونی معذوری والوں کے لیے استثنات ہیں۔ اپنے مخصوص کیس کی محدود مدت کی تصدیق کے لیے ہمیشہ وکیل سے رجوع کریں۔',
    category: 'General',
    categoryUrdu: 'عام',
    relatedLaws: ['limitation-act-1908'],
  },
  {
    id: 'court-fees',
    question: 'What are court fees and how are they calculated?',
    questionUrdu: 'کورٹ فیس کیا ہیں اور ان کا حساب کیسے ہوتا ہے؟',
    answer: 'Court fees are mandatory for filing civil cases in Pakistan, governed by the Court Fees Act 1870. They are calculated as a percentage of the claim value: (1) For claims up to Rs. 50,000: 6% of the claim; (2) Rs. 50,000 to Rs. 100,000: Rs. 3,000 + 5% of the amount above Rs. 50,000; (3) Above Rs. 100,000: Slab-based rates capping at around 6% for very high values. Specific fee types: ad-valorem (based on claim value), fixed (for specific applications), and process fees (for summons, warrants). Criminal cases generally don\'t require court fees. Family Court cases have nominal fixed fees. The plaintiff must affix court fee stamps on the plaint before filing.',
    answerUrdu: 'پاکستان میں دیوانی مقدمات کے اندراج کے لیے کورٹ فیس لازمی ہے، جو کورٹ فیز ایکٹ 1870 کے تحت منظم ہے۔ یہ دعویٰ کی قدر کے فیصد کے طور پر حساب کی جاتی ہے: (1) 50,000 روپے تک کے دعووں کے لیے: دعویٰ کا 6%؛ (2) 50,000 سے 100,000 روپے: 3,000 روپے + 50,000 سے زیادہ رقم کا 5%؛ (3) 100,000 سے زیادہ: سلاب بیس ریٹس جو بہت زیادہ قدروں کے لیے تقریباً 6% تک محدود ہیں۔ مخصوص فیس اقسام: ایڈ-ویلورم (دعویٰ کی قدر پر مبنی)، فکسڈ (مخصوص درخواستوں کے لیے)، اور پروسیس فیس (سمنس، وارنٹس کے لیے)۔ فوجداری مقدمات میں عموماً کورٹ فیس کی ضرورت نہیں۔ فیملی کورٹ کیسز میں معمولی فکسڈ فیس ہے۔ مدعی کو اندراج سے پہلے دعویٰ نامے پر کورٹ فیس سٹیمپ لگانے ہوں گے۔',
    category: 'General',
    categoryUrdu: 'عام',
    relatedLaws: ['code-of-civil-procedure-1908'],
  },
]
