export interface BlogPost {
  slug: string
  title: string
  titleUrdu: string
  category: string
  categoryUrdu: string
  readTime: string
  date: string
  author: string
  summary: string
  summaryUrdu: string
  contentEn: string
  contentUrdu: string
  relatedLawSlugs: string[]
  tags: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'fir-darj-karwane-ka-tareeqa',
    title: 'How to Register an FIR in Pakistan & What to Do if Police Refuses',
    titleUrdu: 'تھانے میں ایف آئی آر درج کروانے کا مکمل قانونی طریقہ کار اور پولیس کے انکار کی صورت میں حل',
    category: 'Criminal Law',
    categoryUrdu: 'فوجداری قانون',
    readTime: '5 min read',
    date: '2025-01-15',
    author: 'Legal Research Bureau QanoonPK',
    summary: 'A step-by-step citizen guide to First Information Reports (FIR) under Section 154 CrPC, roznamcha vs FIR, and filing a Section 22-A/22-B petition before the Sessions Judge if police refuse to register.',
    summaryUrdu: 'دفعہ 154 ضابطہ فوجداری کے تحت ایف آئی آر درج کروانے کا طریقہ، روزنامچہ اور پرچے میں فرق، اور پولیس کے انکار پر سیشن جج کے پاس دفعہ 22-A کے تحت درخواست دائر کرنے کا طریقہ۔',
    contentEn: `### Understanding the First Information Report (FIR)

Under **Section 154 of the Code of Criminal Procedure (CrPC) 1898**, a First Information Report (FIR) is the earliest information given to the police relating to the commission of a **cognizable offence** (an offence where police can arrest without warrant, such as robbery, murder, theft, or severe assault).

### Step 1: Visiting the Police Station (Thana)
1. Go to the police station that holds territorial jurisdiction over the place where the incident occurred.
2. Present a clear, written application addressed to the **SHO (Station House Officer)** detailing:
   - Date, exact time, and precise location of the crime.
   - Names/descriptions of the accused (if known) or "unknown culprits".
   - Stolen items, injuries sustained, or evidence available.
   - Names of eyewitnesses.
3. If giving oral information, the police officer is statutorily required to write it down, read it over to you, and obtain your signature or thumb impression.
4. **Demand a free copy** of the registered FIR. Under Section 154 CrPC, the informant is entitled to an immediate copy free of cost.

### What is the Difference Between Roznamcha (Daily Diary) and FIR?
Police officers often record minor complaints in the **Daily Diary (Roznamcha / Sanad)** without formally registering an FIR. For a cognizable crime, recording in the Roznamcha alone is **illegal**. Demand that a formal FIR (form under Police Rules 1934) be sealed.

### What If Police Refuse to Register Your FIR?
If the SHO refuses or delays registering your FIR due to political pressure or corruption:
1. **Approach the SP / DPO:** Submit a written complaint to the District Police Officer (DPO) or Senior Superintendent of Police (SSP/SP Investigation).
2. **File Section 22-A / 22-B CrPC Petition (Ex-Officio Justice of Peace):**
   - Under Section 22-A & 22-B CrPC, the Sessions Judge and Additional Sessions Judges act as *Ex-Officio Justices of the Peace*.
   - You or your advocate can file a petition praying for a direction to the SHO to register an FIR.
   - The court calls for a police report within 24-48 hours and typically orders immediate FIR registration if a cognizable case is made out.
3. **Private Criminal Complaint (Istaghasa) under Section 200 CrPC:**
   - If police remain biased or fabricate facts, you can file a direct criminal complaint before the Judicial Magistrate. The Magistrate records statements under oath and can directly issue summons/warrants to the accused.`,
    contentUrdu: `### ایف آئی آر (First Information Report) کیا ہے؟

ضابطہ فوجداری (CrPC 1898) کی **دفعہ 154** کے تحت، کسی بھی دست اندازی پولیس جرم (Cognizable Offence) کے بارے میں تھانے کو دی جانے والی پہلی تحریری یا زبانی اطلاع کو ایف آئی آر کہا جاتا ہے۔

### مرحلہ 1: تھانے جانے کا طریقہ
1. وقوعہ جس تھانے کی حدود میں پیش آیا ہو، اس متعلقہ تھانے تشریف لے جائیں۔
2. ایس ایچ او (SHO) کے نام ایک صاف اور واضح درخواست پیش کریں جس میں درج ذیل تفصیلات ہوں:
   - تاریخ، وقت اور وقوعہ کی صحیح جگہ۔
   - ملزمان کے نام و ولدیت (اگر معلوم ہوں) ورنہ نامعلوم افراد۔
   - نقصان یا چوری شدہ مال کی تفصیل یا لگنے والی چوٹیں۔
   - موقع کے گواہان کے نام۔
3. زبانی بیان کی صورت میں محرر کا فرض ہے کہ وہ بیان لکھ کر آپ کو پڑھ کر سنائے اور دستخط کرائے۔
4. قانون کے مطابق **ایف آئی آر کی تصدیق شدہ نقل فوری اور مفت** حاصل کرنا سائل کا بنیادی حق ہے۔

### روزنامچہ اور ایف آئی آر کا فرق
اکثر پولیس اہلکار درخواست کو "روزنامچے" (Daily Diary) میں درج کر کے ٹال دیتے ہیں۔ اگر جرم سنگین (دست اندازی پولیس) ہے تو روزنامچے کی بجائے باقاعدہ ایف آئی آر کاٹنا لازمی ہے۔

### اگر پولیس ایف آئی آر درج کرنے سے انکار کر دے تو کیا کریں؟
1. **ایس پی / ڈی پی او کو درخواست:** ضلع کے ایس پی انویسٹی گیشن یا ڈی پی او کو تحریری شکایت دیں۔
2. **سیشن جج کے پاس دفعہ 22-A / 22-B کی درخواست (Justice of Peace):**
   - ضابطہ فوجداری کی دفعہ 22-A اور 22-B کے تحت ایڈیشنل سیشن ججز کو "جسٹس آف پیس" کے اختیارات حاصل ہیں۔
   - آپ وکیل کے ذریعے سیشن کورٹ میں درخواست دائر کر سکتے ہیں۔ عدالت تھانے سے 24 سے 48 گھنٹوں میں رپورٹ طلب کر کے فوری پرچہ درج کرنے کا حکم صادر فرماتی ہے۔
3. **استغاثہ (Private Complaint under Sec 200 CrPC):**
   - اگر پولیس جانبداری کرے تو سائل براہِ راست علاقہ مجسٹریٹ کی عدالت میں استغاثہ دائر کر سکتا ہے جہاں عدالت خود بیان قلمبند کر کے ملزمان کو طلب کرتی ہے۔`,
    relatedLawSlugs: ['pakistan-penal-code-1860', 'code-of-criminal-procedure-1898'],
    tags: ['FIR', 'CrPC', 'Police', 'Justice of Peace', 'Criminal Law'],
  },
  {
    slug: 'dishonour-cheque-489f-ppc',
    title: 'Dishonour of Cheque in Pakistan: Section 489-F PPC & Order 37 CPC',
    titleUrdu: 'بوگس چیک / چیک ڈس آنر کا قانون: دفعہ 489-F تعزیرات پاکستان اور آرڈر 37 دعویٰ',
    category: 'Banking & Criminal Law',
    categoryUrdu: 'بینکنگ و فوجداری قانون',
    readTime: '6 min read',
    date: '2025-01-20',
    author: 'Advocate High Court, QanoonPK Panel',
    summary: 'Everything you need to know about bouncing cheques in Pakistan: statutory requirements of Section 489-F PPC, issuing the 15-day legal notice, bank return memo, and recovery through Order 37 CPC.',
    summaryUrdu: 'پاکستان میں چیک باؤنس ہونے پر قانونی کارروائی کا طریقہ: دفعہ 489-F پی پی سی کے تقاضے، 15 روزہ قانونی نوٹس، بینک میمو، اور رقم کی فوری وصولی کے لیے آرڈر 37 کا دیوانی دعویٰ۔',
    contentEn: `### What is Section 489-F of Pakistan Penal Code?
Section 489-F PPC was inserted in 2002 to criminalize dishonestly issuing a cheque. The punishment is **up to 3 years imprisonment, or fine, or both**.

### The Essential Legal Ingredients of 489-F PPC:
To constitute an offence under Section 489-F PPC, three conditions must exist:
1. The cheque must have been issued with **dishonest intention (mens rea)**.
2. The cheque must be towards the repayment of a **loan or fulfillment of an obligation**.
3. The cheque was dishonoured by the bank upon presentation due to insufficient funds or exceeded credit limits.

### Step-by-Step Procedure When a Cheque Bounces:
1. **Obtain the Bank Dishonour Slip (Return Memo):**
   - Never accept an oral refusal. The bank is required to attach an official "Dishonour Slip" with reason stamped (e.g., *Insufficient Funds / Account Closed*).
2. **Send a 15-Day Legal Notice:**
   - Although not mandatory in the letter of 489-F, superior court judgments strongly require issuing a formal legal notice through a lawyer via registered post/TCS giving 15 days to pay the amount.
3. **Lodge the FIR:**
   - If the issuer fails to pay after the notice period, submit a formal application along with original bank memo and cheque copy to the police station for an FIR under 489-F PPC.

### Dual Remedy: Criminal FIR vs. Civil Recovery (Order 37 CPC)
Filing a criminal FIR under 489-F PPC sends the accused to jail, but it **does not automatically recover your money**.
To recover the money:
- You must simultaneously file a **Summary Suit for Recovery under Order 37 of the Code of Civil Procedure (CPC)** in the civil/district court.
- In an Order 37 suit, the defendant cannot even defend the case without first obtaining "Leave to Defend" from the court. If leave is refused, a decree is passed immediately.`,
    contentUrdu: `### دفعہ 489-F تعزیراتِ پاکستان کیا ہے؟
سن 2002 میں تعزیرات پاکستان میں دفعہ 489-F کا اضافہ کیا گیا جس کے تحت بدنیتی سے بوگس چیک جاری کرنا قابل دست اندازی پولیس جرم ہے جس کی سزا **3 سال قید یا جرمانہ یا دونوں** ہیں۔

### دفعہ 489-F کے بنیادی قانونی اجزاء:
1. چیک بدنیتی کی نیت سے جاری کیا گیا ہو۔
2. چیک کسی قرض کی واپسی یا جائز مالیاتی ذمہ داری (Obligation) کی مد میں دیا گیا ہو۔
3. بینک میں پیش کرنے پر اکاؤنٹ میں رقم نہ ہونے (Insufficient Funds) کی وجہ سے ڈس آنر ہو جائے۔

### چیک باؤنس ہونے پر قانونی مراحل:
1. **بینک سے ڈس آنر سلپ (Bank Memo) حاصل کریں:** بینک کی باقاعدہ مہر والی سلپ حاصل کریں جس پر باؤنس ہونے کی وجہ لکھی ہو۔
2. **15 روزہ قانونی نوٹس (Legal Notice):** وکیل کے ذریعے رجسٹری خط بھیج کر 15 دن میں رقم کی ادائیگی کا مطالبہ کریں۔
3. **تھانے میں ایف آئی آر کا اندراج:** نوٹس کی مدت گزرنے کے بعد چیک اور بینک میمو کے ہمراہ تھانے میں پرچہ درج کروائیں۔

### فوجداری کارروائی بمقابلہ دیوانی دعویٰ (آرڈر 37):
ایف آئی آر سے ملزم جیل چلا جاتا ہے مگر آپ کی رقم خود بخود واپس نہیں ملتی۔ رقم کی فوری وصولی کے لیے **سول کورٹ میں آرڈر 37 ضابطہ دیوانی (CPC) کے تحت سمری دعویٰ (Summary Suit)** دائر کرنا ضروری ہے جس میں عدالت فوری ڈگری صادر کرتی ہے۔`,
    relatedLawSlugs: ['pakistan-penal-code-1860', 'code-of-civil-procedure-1908'],
    tags: ['489-F', 'Cheque Dishonour', 'Banking', 'Order 37', 'PPC'],
  },
  {
    slug: 'khula-vs-talaq-procedure',
    title: 'Khula vs Talaq: Complete Legal Rights, Custody & Procedure in Pakistan',
    titleUrdu: 'خلع اور طلاق کا قانونی فرق، بچوں کی تحویل (Custody) اور مکمل عدالتی طریقہ کار',
    category: 'Family Law',
    categoryUrdu: 'عائلی قوانین',
    readTime: '7 min read',
    date: '2025-01-25',
    author: 'Family Law Specialist, QanoonPK',
    summary: 'A definitive guide on dissolution of marriage under Family Courts Act 1964 and Muslim Family Laws Ordinance 1961: Talaq notice to Union Council, filing for Khula, Haq Mehr rules, and child custody.',
    summaryUrdu: 'فیملی کورٹس ایکٹ 1964 اور مسلم فیملی لاء آرڈیننس 1961 کے تحت خلع اور طلاق کے قواعد: یونین کونسل نوٹس، حق مہر کی واپسی، خرچہ نان نفقہ اور بچوں کی تحویل کے اصول۔',
    contentEn: `### Distinction Between Talaq and Khula
- **Talaq:** The right of divorce exercised by the husband under Section 7 of the Muslim Family Laws Ordinance (MFLO) 1961.
- **Khula:** The judicial dissolution of marriage sought by the wife through a Family Court when she can no longer live with her husband within the limits prescribed by Allah.

### Procedure for Filing Khula in Family Court:
1. **Institution of Suit:** The wife files a suit for Dissolution of Marriage on the basis of Khula in the Family Court of the district where she currently resides.
2. **Pre-Trial Reconciliation:** Under Section 10 of the Family Courts Act 1964, the judge is required to hold a confidential pre-trial reconciliation attempt between the spouses.
3. **Passing of Decree on Khula:** If reconciliation fails, the court is bound to pass a decree for dissolution on Khula without dragging the trial for years.
4. **Haq Mehr (Dower) Rules:**
   - If marriage was consummated and dower was paid in cash, the wife typically surrenders up to 25% or 50% of the dower (as per recent provincial amendments) or waives unpaid deferred dower.

### Union Council Notice & 90 Days Reconciliation
A court decree of Khula or husband's Talaq notice does not immediately terminate the marriage legally. Under Section 7 & 8 MFLO 1961:
- A copy of the decree/notice must be dispatched to the **Chairman of the Union Council**.
- The Chairman forms an **Arbitration Council** and issues notices for 90 days.
- If reconciliation fails after 90 days, the Union Council issues an official **Talaq / Khula Effective Certificate**.

### Child Custody (Hizanat) & Maintenance (Kharcha)
- The father remains the natural guardian, but mother retains custody (Hizanat) of a boy until age 7 and a girl until puberty, subject to the paramount welfare of the minor.
- The father is legally obligated to pay monthly maintenance (Kharcha) for his children regardless of who has physical custody.`,
    contentUrdu: `### طلاق اور خلع میں بنیادی فرق
- **طلاق:** شوہر کی طرف سے مسلم فیملی لاز آرڈیننس 1961 کی دفعہ 7 کے تحت دیا جانے والا حق ہے۔
- **خلع:** بیوی کی طرف سے فیملی کورٹ کے ذریعے نکاح ختم کروانے کا عدالتی حق، جب وہ شوہر کے ساتھ حدود اللہ میں نہ رہ سکتی ہو۔

### فیملی کورٹ میں خلع لینے کا طریقہ:
1. **دعویٰ کی دائرگی:** خاتون اپنے موجودہ رہائشی ضلع کی فیملی کورٹ میں تنسیخِ نکاح کا دعویٰ دائر کرتی ہے۔
2. **پری ٹرائل راضی نامہ کی کوشش:** فیملی کورٹس ایکٹ کی دفعہ 10 کے تحت جج صاحب میاں بیوی کے درمیان صلح کی کوشش کرواتے ہیں۔
3. **خلع کی ڈگری:** صلح نہ ہونے پر عدالت فوری طور پر خلع کی ڈگری جاری کرنے کی پابند ہے۔
4. **حق مہر کے احکام:** غیر ادا شدہ حق مہر معاف ہو جاتا ہے، یا حالیہ ترامیم کے تحت ادا شدہ مہر کا ایک حصہ واپس کرنا ہوتا ہے۔

### یونین کونسل نوٹس اور 90 دن کی مدت:
عدالت سے خلع کی ڈگری کے بعد یونین کونسل کے چیئرمین کو نوٹس بھیجا جاتا ہے۔ چیئرمین ثالثی کونسل بناتا ہے اور 90 دن مکمل ہونے پر باقاعدہ **موثر سرٹیفکیٹ (Talaq Effectiveness Certificate)** جاری کرتا ہے۔

### بچوں کی تحویل (Custody) اور خرچہ نان نفقہ:
- نابالغ بچوں کی پرورش کا حق والدہ کے پاس رہتا ہے جب تک کہ اس کی دوسری شادی یا بچے کی فلاح و بہبود متاثر نہ ہو۔
- والد بچوں کا ماہانہ خرچہ نان و نفقہ ادا کرنے کا قانونی طور پر پابند ہے۔`,
    relatedLawSlugs: ['family-courts-act-1964', 'muslim-family-laws-ordinance-1961'],
    tags: ['Khula', 'Talaq', 'Family Court', 'Child Custody', 'Haq Mehr'],
  },
  {
    slug: 'cyber-crime-fia-complaint-guide',
    title: 'How to File an FIA Cyber Crime Complaint Under PECA 2016',
    titleUrdu: 'پیکا 2016 کے تحت ایف آئی اے سائبر کرائم ونگ میں آن لائن شکایت درج کروانے کا طریقہ',
    category: 'Cyber & IT Law',
    categoryUrdu: 'سائبر اور آئی ٹی قانون',
    readTime: '5 min read',
    date: '2025-02-01',
    author: 'Cyber Law Advisory Group',
    summary: 'Step-by-step citizen walkthrough on reporting blackmailing, fake social media profiles, non-consensual images, and banking OTP scams to FIA Cyber Crime Wing under PECA 2016.',
    summaryUrdu: 'سوشل میڈیا پر جعلی پروفائلز، بلیک میلنگ، غیر اخلاقی ویڈیوز/تصاویر اور بینک فراڈ کے خلاف پیکا 2016 کے تحت ایف آئی اے میں آن لائن شکایت درج کروانے کا مکمل گائیڈ۔',
    contentEn: `### What Offences are Covered by PECA 2016?
The **Prevention of Electronic Crimes Act (PECA) 2016** criminalizes:
- **Section 20:** Malicious transmission of information against modesty or dignity of a person.
- **Section 21:** Cyber stalking, harassment, and tracking someone online without consent.
- **Section 24:** Cyber terrorism and critical infrastructure attacks.
- **Financial Phishing & OTP Fraud:** Unauthorized access to bank accounts and wallets (Easypaisa/JazzCash).

### Step 1: Preserving Digital Evidence (Crucial!)
Before taking any legal steps, preserve the evidence:
1. Take high-resolution screenshots showing the **date, time, URL, and mobile numbers**.
2. Never delete WhatsApp chat threads, voice notes, or SMS.
3. Note the exact profile link (URL) of the perpetrator, not just their display name.

### Step 2: How to Lodge a Complaint with FIA:
1. **Online Web Portal:** Visit the official portal at \`complaint.fia.gov.pk\` and register using your CNIC and phone number.
2. **Helpline 1991:** Call 1991 to speak directly with an intake officer for immediate advice.
3. **Walk-in at Regional Cyber Crime Reporting Centre (CCRC):** Visit the nearest FIA Cyber Crime Reporting Centre located in major cities (Islamabad, Lahore, Karachi, Peshawar, Quetta, Multan, Faisalabad, Sukkur, Abbottabad).

### Protection for Female Complainants:
Under FIA standard operating procedures, female complaints regarding non-consensual images or stalking are handled with strict confidentiality by designated female enquiry officers. Immediate notices are dispatched to PTA (Pakistan Telecommunication Authority) to block explicit URLs within hours.`,
    contentUrdu: `### پیکا (PECA) 2016 کے تحت کون سے جرائم آتے ہیں؟
1. **دفعہ 20:** کسی کی عزت و وقار مجروح کرنے کے لیے جھوٹی مہم چلانا۔
2. **دفعہ 21:** سائبر اسٹاکنگ، آن لائن ہراسانی اور پیچھا کرنا۔
3. **بینک فراڈ اور او ٹی پی چوری:** ایزی پیسہ، جاز کیش یا بینک اکاؤنٹ سے دھوکہ دہی۔
4. **بلیک میلنگ اور نازیبا تصاویر:** بلیک میل کرنا اور تصاویر پھیلانا سنگین ناقابل ضمانت جرم ہے۔

### پہلا مرحلہ: ثبوت محفوظ کرنا (سب سے اہم)
- چیٹس، وائس میسجز اور پوسٹس کے سکرین شاٹس فوری محفوظ کریں۔
- مجرم کی پروفائل کا اصلی لنک (URL) اور موبائل نمبر نوٹ کریں۔
- واٹس ایپ چیٹ خود سے ڈیلیٹ نہ کریں۔

### ایف آئی اے میں رپورٹ کرنے کے طریقے:
1. **آن لائن ویب پورٹل:** \`complaint.fia.gov.pk\` پر جا کر شناختی کارڈ کے ساتھ آن لائن شکایت جمع کروائیں۔
2. **ہیلپ لائن 1991:** چوبیس گھنٹے فعال ہیلپ لائن پر کال کریں۔
3. **ایف آئی اے سائبر کرائم دفتر وزٹ:** اپنے شہر کے قریبی FIA سینٹر خود جا کر درخواست جمع کروائیں۔

خواتین کی شکایات کے لیے لیڈی انویسٹی گیشن آفیسرز تعینات ہیں اور پی ٹی اے کے ذریعے قابل اعتراض مواد کو فوری بلاک کروایا جاتا ہے۔`,
    relatedLawSlugs: ['prevention-of-electronic-crimes-act-2016'],
    tags: ['PECA 2016', 'Cyber Crime', 'FIA', 'Online Harassment', 'Social Media'],
  },
  {
    slug: 'property-purchase-due-diligence',
    title: 'Property Purchase in Pakistan: Due Diligence, Registry, Fard & NOC Checklist',
    titleUrdu: 'پاکستان میں پلاٹ یا جائیداد خریدتے وقت لازمی قانونی چیک لسٹ اور فراڈ سے بچاؤ',
    category: 'Property Law',
    categoryUrdu: 'اراضی و جائیداد قانون',
    readTime: '8 min read',
    date: '2025-02-05',
    author: 'Land Revenue Advocate, QanoonPK',
    summary: 'How to avoid real estate scams in Pakistan: verification of Fard-e-Malkiat, Aks Shajra, Mutation (Inteqal), Sub-Registrar records, housing society NOCs, and biometric verification.',
    summaryUrdu: 'پراپرٹی خریدتے وقت دھوکے سے بچنے کا طریقہ: فردِ ملکیت، عکس شجرہ، انتقال، رجسٹرار ریکارڈ کی پڑتال، ہاؤسنگ سوسائٹی کے این او سی اور بائیو میٹرک تصدیق کی مکمل گائیڈ۔',
    contentEn: `### 1. Verification of Title Documents (Fard & Inteqal)
Before handing over any token money (biyana):
- **Arazi Record Center (PLRA / Sindh Zameen / Digital Portal):** Obtain a fresh computerized *Fard Baraye Bae* (Fard for sale) directly from the revenue department.
- Verify whether the property is held under a registered deed (Baye-Nama) or revenue mutation (Inteqal).
- Check the **Shajra Nasab / Pedigree table** to ensure no undisclosed co-heir has a pending inheritance claim.

### 2. Physical Possession & Aks Shajra
Never buy property solely on paper:
- Match the Khasra and Khewat number on the ground with an **Aks Shajra** (cadastral map) prepared by a licensed patwari/tehsildar.
- Verify who holds actual physical possession. In Pakistani law, "possession is nine points of the law."

### 3. Housing Societies (LDA, CDA, RDA, SBCA Approvals)
If purchasing in a private housing scheme:
- Check the development authority portal (e.g. LDA for Lahore, CDA for Islamabad) to verify whether the society has an approved **No Objection Certificate (NOC)** and layout plan.
- Ensure the plot number exists in the approved phase, not an unacquired "file".

### 4. Search at Sub-Registrar Office (Non-Encumbrance Certificate)
- Conduct an inspection of Book 1 at the Sub-Registrar office for the past 12 years to verify the property is free from prior mortgages, court injunctions, or bank liens.`,
    contentUrdu: `### 1. فردِ ملکیت اور انتقال کی تصدیق
بیعانہ دینے سے پہلے سب سے اہم مرحلہ:
- **اراضی ریکارڈ سینٹر (PLRA):** کمپیوٹرائزڈ "فرد برائے بیع" خود جا کر تصدیق کروائیں۔
- چیک کریں کہ مالک کے پاس رجسٹری ہے یا صرف زبانی انتقال۔
- وراثتی جائیداد کی صورت میں شجرہ نسب دیکھ کر تسلی کریں کہ کسی وارث کا حصہ رہ تو نہیں گیا۔

### 2. موقع کا قبضہ اور عکس شجرہ
- صرف کاغذات پر یقین نہ کریں؛ موقع پر جا کر زمین کی پیمائش اور حدود اربعہ (Aks Shajra) چیک کریں۔
- دیکھیں کہ موقع پر قبضہ کس کا ہے۔ قانون میں قبضے کو بنیادی اہمیت حاصل ہے۔

### 3. ہاؤسنگ سوسائٹیز کی قانونی حیثیت (NOC)
اگر کسی سوسائٹی میں پلاٹ لے رہے ہیں:
- متعلقہ ڈویلپمنٹ اتھارٹی (جیسے ایل ڈی اے، سی ڈی اے، آر ڈی اے، ایس بی سی اے) سے تصدیق کریں کہ کیا سوسائٹی کا باقاعدہ NOC اور لے آؤٹ پلان منظور ہے؟
- محض فائلوں کی خرید و فروخت سے گریز کریں۔

### 4. سب رجسٹرار آفس میں بارہ سالہ ریکارڈ کی سرچ
وکیل کے ذریعے سب رجسٹرار دفتر سے سرچ کروا کر "نان انکمبرنس سرٹیفکیٹ" (Non-Encumbrance) حاصل کریں کہ جائیداد کسی بینک کے پاس رہن یا عدالتی حکم امتناعی کے تحت تو نہیں ہے۔`,
    relatedLawSlugs: ['transfer-of-property-act-1882', 'stamp-act-1899'],
    tags: ['Property Law', 'Fard', 'Registry', 'Real Estate', 'Due Diligence'],
  },
  {
    slug: 'bail-law-in-pakistan-guide',
    title: 'Bail Laws in Pakistan: Pre-Arrest (BBA) vs Post-Arrest Bail Guidelines',
    titleUrdu: 'پاکستان میں ضمانت کا قانون: ضمانت قبل از گرفتاری اور بعد از گرفتاری کے اصول',
    category: 'Criminal Law',
    categoryUrdu: 'فوجداری قانون',
    readTime: '6 min read',
    date: '2025-02-10',
    author: 'Criminal Defense Attorney, QanoonPK',
    summary: 'A complete breakdown of bail under Sections 496, 497, and 498 CrPC: bailable vs non-bailable offences, transit/protective bail, statutory delay grounds, and cancellation of bail.',
    summaryUrdu: 'ضابطہ فوجداری کی دفعات 496، 497 اور 498 کے تحت ضمانت کے قوانین: قابل ضمانت اور ناقابل ضمانت جرائم، حفاظتی ضمانت، تاخیر کی بنیاد پر ضمانت اور منسوخی کے قواعد۔',
    contentEn: `### Fundamentals of Bail Law
Under Anglo-Saxon jurisprudence followed in Pakistan, the golden rule remains: **"Bail is the rule, and jail is an exception"** unless the offence falls within the prohibitory clause of Section 497 CrPC.

### 1. Bailable Offenses (Section 496 CrPC):
In offences categorized as bailable in the Second Schedule of CrPC, bail is an **absolute statutory right**. The court or police station has no discretion to refuse bail if solvent sureties are furnished.

### 2. Pre-Arrest Bail (Bail Before Arrest / Section 498 CrPC):
- Sought when a person reasonably apprehends imminent arrest in a false or malicious criminal case.
- Must demonstrate:
  1. **Ulterior Motives / Malafide:** Registration of the case is tainted with malice, political victimization, or blackmail.
  2. **Irreparable Loss & Humiliation:** Police custody would ruin reputation without just cause.
- Usually granted ad-interim immediately upon filing, subject to joining police investigation.

### 3. Post-Arrest Bail (Section 497 CrPC):
- Filed after the accused has been arrested and sent to judicial custody in jail.
- **Prohibitory Clause:** Offenses punishable with death, life imprisonment, or 10 years imprisonment. In such offenses, bail is granted only if there are "further inquiry" grounds.
- **Statutory Delay Ground:** If trial has not concluded within 1 year for non-heinous offenses or 2 years for offenses punishable with death without fault of the defense, bail becomes a statutory right.`,
    contentUrdu: `### ضمانت کے بنیادی اصول
پاکستانی قانون کی رو سے سنہری اصول یہ ہے کہ: **"ضمانت حق ہے اور جیل استثنیٰ"** جب تک کہ جرم دفعہ 497 کی ممنوعہ شق میں نہ آتا ہو۔

### 1. قابل ضمانت جرائم (دفعہ 496 CrPC):
ان جرائم میں ضمانت حاصل کرنا ملزم کا قانونی حق ہے اور مناسب مچلکے جمع کروانے پر عدالت یا پولیس ضمانت منظور کرنے کی پابند ہے۔

### 2. ضمانت قبل از گرفتاری (Bail Before Arrest / دفعہ 498):
- جب کسی شہری کو بے گناہ ہونے کے باوجود بدنیتی یا دشمنی کی بنا پر گرفتاری کا خطرہ ہو۔
- عدالت میں بدنیتی (Malafide) اور عزت پر حرف آنے کا خوف ثابت کرنا ہوتا ہے۔
- عدالت پہلے عبوری (Ad-interim) ضمانت دیتی ہے اور بعد میں بحث سن کر کنفرم کرتی ہے۔

### 3. ضمانت بعد از گرفتاری (Post-Arrest Bail / دفعہ 497):
- گرفتاری کے بعد جب ملزم جوڈیشل ریمانڈ پر جیل چلا جائے تو یہ ضمانت دائر ہوتی ہے۔
- اگر مقدمے میں مزید انکوائری (Further Inquiry) کی گنجائش ہو یا گواہان کے بیانات میں تضاد ہو تو ضمانت منظور ہو جاتی ہے۔
- اگر مقدمے کے فیصلے میں غیر معمولی تاخیر ہو تو بھی قانون کے تحت ضمانت مل جاتی ہے۔`,
    relatedLawSlugs: ['code-of-criminal-procedure-1898', 'pakistan-penal-code-1860'],
    tags: ['Bail', 'CrPC 497', 'CrPC 498', 'Criminal Law', 'Police'],
  },
]
