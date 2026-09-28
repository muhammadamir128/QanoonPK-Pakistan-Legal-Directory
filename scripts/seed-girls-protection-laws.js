// Seed script to fully bind and seed all 16 Women & Girls Protection Laws into QanoonPK SQLite database
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

const dbPath = path.resolve('db/custom.db').replace(/\\/g, '/');
process.env.DATABASE_URL = 'file:' + dbPath;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LAWS_DATA = [
  // 1. Pakistan Penal Code (PPC), 1860
  {
    slug: 'pakistan-penal-code-1860',
    title: 'Pakistan Penal Code 1860',
    titleUrdu: 'مجموعہ تعزیراتِ پاکستان 1860',
    yearEnacted: 1860,
    categorySlug: 'criminal-law',
    status: 'IN_FORCE',
    jurisdiction: 'FEDERAL',
    summary: 'The primary penal statute of Pakistan defining criminal offenses, sexual assault, statutory rape (under 16), gang rape, child exploitation, child pornography, and kidnapping with severe punishments including life imprisonment and capital punishment.',
    summaryUrdu: 'پاکستان کا بنیادی فوجداری ضابطہ جس میں جنسی زیادتی، نابالغ لڑکیوں کا استحصال، گینگ ریپ، چائلڈ پورنوگرافی اور اغوا کے سنگین جرائم کی سزائیں بشمول عمر قید اور سزائے موت مقرر ہیں۔',
    fullText: 'Comprehensive penal code covering criminal liability, definitions, and offenses against the human body, women, and children.',
    sections: [
      {
        sectionNumber: '375',
        title: 'Rape (Definition & Consent)',
        titleUrdu: 'زنا بالجبیر (تعریف و رضامندی)',
        content: 'Rape is defined gender-neutrally. Occurs when sexual act is committed against will, without consent, under fear or threat, or through deception. Lack of physical resistance does not constitute consent. Any sexual intercourse with a girl under 16 years of age is statutory rape, regardless of alleged consent.',
        contentUrdu: 'رضامندی کے بغیر، مرضی کے خلاف، یا خوف و دھوکے کے ذریعے کیا جانے والا عمل۔ جسمانی مزاحمت نہ کرنا رضامندی نہیں مانا جائے گا۔ 16 سال سے کم عمر لڑکی کے ساتھ جنسی تعلق ہر صورت میں ریپ مانا جائے گا، خواہ رضامندی کا دعویٰ ہو۔',
        order: 1
      },
      {
        sectionNumber: '375A',
        title: 'Gang Rape',
        titleUrdu: 'گینگ ریپ',
        content: 'Where a woman or child is raped by two or more persons acting in furtherance of a common intention. Punishable with death or imprisonment for life, and fine.',
        contentUrdu: 'جب دو یا دو سے زائد افراد مل کر کسی خاتون یا بچے کے ساتھ زیادتی کا ارتکاب کریں۔ اس کی سزا موت یا عمر قید اور جرمانہ ہے۔',
        order: 2
      },
      {
        sectionNumber: '376',
        title: 'Punishment for Rape',
        titleUrdu: 'ریپ کی سزا',
        content: 'Rape punishable by death or imprisonment not less than 10 years up to 25 years or life imprisonment. Rape of minor child, mentally or physically impaired person, or rape by public servant (police, doctor, custodian) punishable strictly with death or imprisonment for life.',
        contentUrdu: 'عام زیادتی پر موت یا 10 سے 25 سال قید یا عمر قید۔ نابالغ بچے، معذور شخص سے زیادتی یا سرکاری اہلکار (پولیس، ڈاکٹر، جیلر) کی جانب سے اختیارات کے غلط استعمال پر سزا صرف موت یا عمر قید ہے۔',
        order: 3
      },
      {
        sectionNumber: '377A',
        title: 'Sexual Abuse of Children',
        titleUrdu: 'بچوں کا جنسی استحصال',
        content: 'Whoever subjects a child under 18 years to sexual abuse, indecent touching, caressing, exhibitionism, or compels any obscene act, with or without consent, commits sexual abuse.',
        contentUrdu: '18 سال سے کم عمر بچے کو جنسی طور پر چھونا، نامناسب حرکات کرنا، یا کسی غیر اخلاقی حرکت پر مجبور کرنا جنسی استحصال کے تحت جرم ہے۔',
        order: 4
      },
      {
        sectionNumber: '377B',
        title: 'Punishment for Sexual Abuse of Child',
        titleUrdu: 'بچوں کے جنسی استحصال کی سزا',
        content: 'Punishable with rigorous imprisonment for a term which shall not be less than 3 years and may extend to 7 years, and fine.',
        contentUrdu: 'سخت قید جس کی مدت کم از کم 3 سال اور زیادہ سے زیادہ 7 سال تک ہو سکتی ہے، اور بھاری جرمانہ۔',
        order: 5
      },
      {
        sectionNumber: '292A',
        title: 'Exposing Child to Obscene Material',
        titleUrdu: 'بچے کو فحش مواد دکھانا یا ترغیب دینا',
        content: 'Punishable with imprisonment up to 7 years and fine for seducing or exposing children to obscene material.',
        contentUrdu: 'بچے کو جنسی حرکت کی نیت سے بہکانا یا فحش مواد دکھانے پر 7 سال تک قید اور جرمانہ۔',
        order: 6
      },
      {
        sectionNumber: '292B',
        title: 'Child Pornography',
        titleUrdu: 'چائلڈ پورنوگرافی کی ممانعت',
        content: 'Producing, possessing, transmitting, or distributing child pornography is strictly prohibited, punishable with up to 7 years imprisonment and substantial fine.',
        contentUrdu: 'بچوں کا غلیظ یا فحش مواد بنانا، رکھنا، پھیلانا یا تقسیم کرنا، 7 سال قید اور جرمانہ۔',
        order: 7
      },
      {
        sectionNumber: '228A',
        title: 'Disclosure of Identity of Victim of Rape',
        titleUrdu: 'زیادتی کی شکار خاتون یا بچے کی شناخت ظاہر کرنے کی ممانعت',
        content: 'Printing or publishing the name or any matter which may make known the identity of any victim of rape without legal authorization is an offense punishable with imprisonment up to 3 years and fine.',
        contentUrdu: 'زیادتی کی شکار خاتون یا بچے کا نام یا ایسی تفصیلات شائع کرنا جس سے شناخت ظاہر ہو، قابل تعزیر جرم ہے جس کی سزا 3 سال قید اور جرمانہ ہے۔',
        order: 8
      },
      {
        sectionNumber: '364A',
        title: 'Kidnapping or Abducting a Person under the Age of 14',
        titleUrdu: '14 سال سے کم عمر بچے کا اغوا',
        content: 'Kidnapping or abducting any person under the age of 14 in order that such person may be subjected to grievous hurt, sexual slavery, or murder. Punishable with death, imprisonment for life, or rigorous imprisonment not less than 7 years.',
        contentUrdu: '14 سال سے کم عمر بچے کو نقصان، جنسی غلامی یا قتل کی نیت سے اغوا کرنے پر سزائے موت، عمر قید یا کم از کم 7 سال قید۔',
        order: 9
      },
      {
        sectionNumber: '366A',
        title: 'Procuration of Minor Girl',
        titleUrdu: 'نابالغ لڑکی کو جنسی مقاصد کے لیے حاصل کرنا',
        content: 'Whoever induces any girl under the age of 18 years to go from any place with intent that such girl may be forced or seduced to illicit intercourse. Punishable with imprisonment up to 10 years and fine.',
        contentUrdu: '18 سال سے کم عمر لڑکی کو ناپسندیدہ جنسی تعلق کے لیے ورغلانا یا حاصل کرنا، 10 سال تک قید اور جرمانہ۔',
        order: 10
      }
    ]
  },

  // 2. Protection of Women (Criminal Laws Amendment) Act, 2006
  {
    slug: 'protection-of-women-act-2006',
    title: 'Protection of Women (Criminal Laws Amendment) Act, 2006',
    titleUrdu: 'تحفظِ نسواں (فوجداری قوانین ترمیمی) ایکٹ 2006',
    yearEnacted: 2006,
    categorySlug: 'womens-rights-law',
    status: 'IN_FORCE',
    jurisdiction: 'FEDERAL',
    summary: 'Historic reform removing rape from the 1979 Hudood Ordinance back into the Pakistan Penal Code (Sections 375-376). It protected female victims from wrongful zina counter-allegations and eliminated the requirement of four male eyewitnesses for rape prosecutions.',
    summaryUrdu: 'تاریخی اصلاحی قانون جس نے زیادتی کو حدود آرڈیننس 1979 سے نکال کر تعزیراتِ پاکستان میں شامل کیا، تاکہ متاثرہ خواتین کو زنا کے جھوٹے جوابی مقدمات اور چار گواہوں کی کڑی شرط کے خطرے سے بچایا جا سکے۔',
    fullText: 'An Act to amend certain criminal laws to provide relief and protection to women against misuse of laws.',
    sections: [
      {
        sectionNumber: '1',
        title: 'Repeal of Zina bil Jabr from Hudood',
        titleUrdu: 'حدود آرڈیننس سے زنا بالجبر کا اخراج',
        content: 'Removed rape offenses from the Offence of Zina (Enforcement of Hudood) Ordinance 1979 and reinstated them in the Pakistan Penal Code under standard criminal law procedure.',
        contentUrdu: 'ریپ کے مقدمات کو حدود آرڈیننس سے ختم کر کے عام فوجداری نظام کے تحت لایا گیا تاکہ متاثرہ خاتون پر جھوٹا الزام نہ لگ سکے۔',
        order: 1
      },
      {
        sectionNumber: '5',
        title: 'Trial Procedure Safeguards',
        titleUrdu: 'ٹرائل کے حفاظتی ضوابط',
        content: 'Ensures cases of violence against women are tried by sessions courts with due process, legal representation, and protection against frivolous counter-complaints.',
        contentUrdu: 'خواتین کے خلاف جرائم کے مقدمات کو سیشن عدالتوں میں شفافیت، وکیل کی دستیابی اور جوابی جھوٹی کارروائیوں سے تحفظ کے ساتھ چلانے کی ضمانت۔',
        order: 2
      }
    ]
  },

  // 3. Criminal Law (Amendment) (Offences in the name or pretext of Honour) Act, 2016
  {
    slug: 'criminal-law-amendment-act-2016',
    title: 'Criminal Law (Amendment) (Offences Related to Rape and Honour) Act 2016',
    titleUrdu: 'فوجداری قانون (ترمیمی) ایکٹ 2016 (ریپ، غیرت اور چائلڈ ایبیوز)',
    yearEnacted: 2016,
    categorySlug: 'criminal-law',
    status: 'IN_FORCE',
    jurisdiction: 'FEDERAL',
    summary: 'Introduced stringent measures against child sexual abuse and pornography (Sections 377A, 292A-C PPC), mandated forensic DNA evidence in rape trials, and made rape strictly non-compoundable so families cannot force compromises or pardons.',
    summaryUrdu: 'بچوں کے جنسی استحصال اور پورنوگرافی کے خلاف نئی دفعات، ڈی این اے اور فارنزک شواہد کی قانونی لازمی حیثیت، اور ریپ کے جرائم کو ناقابلِ صلح (non-compoundable) قرار دیا گیا۔',
    fullText: 'Federal act introducing stringent child protection amendments into PPC and CrPC.',
    sections: [
      {
        sectionNumber: '3',
        title: 'Mandatory Forensic and DNA Evidence',
        titleUrdu: 'فارنزک اور ڈی این اے شواہد کی قانونی حیثیت',
        content: 'Amended procedural laws to prioritize DNA testing and forensic preservation in sexual assault investigations, rendering forensic science a primary corroborative tool.',
        contentUrdu: 'جنسی زیادتی کے کیسز میں ڈی این اے اور فارنزک شواہد کی فوری جانچ کو تفتیش کا بنیادی حصہ قرار دیا گیا۔',
        order: 1
      },
      {
        sectionNumber: '7',
        title: 'Non-Compoundable Nature of Rape',
        titleUrdu: 'ریپ کے جرم کا ناقابلِ صلح ہونا',
        content: 'Prohibited any legal compromise, settlement, or pardoning between the accused and the victim or their family in rape and child abuse cases.',
        contentUrdu: 'ریپ اور چائلڈ ایبیوز کے مقدمات میں ملزم اور متاثرہ کے خاندان کے مابین کسی بھی قسم کی صلح یا سمجھوتے پر قانونی پابندی۔',
        order: 2
      }
    ]
  },

  // 4. Criminal Law (Amendment) Act, 2021
  {
    slug: 'criminal-law-amendment-act-2021',
    title: 'Criminal Law (Amendment) Act 2021',
    titleUrdu: 'فوجداری قانون (ترمیمی) ایکٹ 2021',
    yearEnacted: 2021,
    categorySlug: 'criminal-law',
    status: 'IN_FORCE',
    jurisdiction: 'FEDERAL',
    summary: 'Broadened the legal definition of rape in PPC Section 375 to be gender-neutral, defined consent strictly (absence of physical resistance does not equate to consent), added Section 375A for Gang Rape with mandatory death or life imprisonment, and eliminated antiquated evidentiary barriers.',
    summaryUrdu: 'ریپ کی تعریف کو وسیع اور صنفی طور پر غیر جانبدار کیا، رضامندی کے اصول واضح کیے، گینگ ریپ کی نئی شق شامل کی اور سزائیں سخت کیں۔',
    fullText: 'Federal enactment substantially modernizing sexual assault provisions under the Pakistan Penal Code.',
    sections: [
      {
        sectionNumber: '2',
        title: 'Broadened Definition of Rape & Consent',
        titleUrdu: 'ریپ اور رضامندی کی جدید تعریف',
        content: 'Explicitly defined lack of physical struggle as non-consent, expanded penetrative offense boundaries, and protected vulnerable persons.',
        contentUrdu: 'مزاحمت نہ کرنے کو رضامندی تسلیم کرنے سے انکار اور کمزور افراد کے تحفظ کی واضح قانونی شق۔',
        order: 1
      }
    ]
  },

  // 5. Code of Criminal Procedure (CrPC), 1898
  {
    slug: 'code-of-criminal-procedure-1898',
    title: 'Code of Criminal Procedure 1898',
    titleUrdu: 'مجموعہ ضابطہ فوجداری 1898',
    yearEnacted: 1898,
    categorySlug: 'criminal-law',
    status: 'IN_FORCE',
    jurisdiction: 'FEDERAL',
    summary: 'Governs the criminal procedural lifecycle for offenses against girls and women: FIR registration (Section 154), medical examination of the victim within 24 hours (Section 164A), statement before Magistrate (Section 164), and in-camera trial provisions for victim privacy.',
    summaryUrdu: 'فوجداری مقدمات کے طریقہ کار کا قانون: ایف آئی آر (دفعہ 154)، 24 گھنٹے کے اندر میڈیکل معائنہ (دفعہ 164A)، مجسٹریٹ کے سامنے بیان (دفعہ 164) اور متاثرہ کی رازداری کے لیے ان کیمرہ ٹرائل۔',
    fullText: 'Comprehensive criminal procedure code for investigations, police registers, inquiries, and trials.',
    sections: [
      {
        sectionNumber: '154',
        title: 'First Information Report (FIR)',
        titleUrdu: 'ابتدائی اطلاعی رپورٹ (ایف آئی آر)',
        content: 'Mandates the immediate recording of information regarding a cognizable offense by the officer in charge of a police station without delay.',
        contentUrdu: 'قابل دست اندازی پولیس جرم کی اطلاع ملتے ہی فوری اور بلا تاخیر ایف آئی آر درج کرنے کا قانونی پابند عمل۔',
        order: 1
      },
      {
        sectionNumber: '164A',
        title: 'Medical Examination of the Victim of Rape',
        titleUrdu: 'زیادتی کی شکار کا میڈیکل معائنہ',
        content: 'Provides for the prompt medical and forensic examination of the victim by a registered medical practitioner with the victim’s or legal guardian’s consent within 24 hours of report.',
        contentUrdu: 'رجسٹرڈ میڈیکل پریکٹشنر کے ذریعے متاثرہ یا سرپرست کی اجازت سے 24 گھنٹے کے اندر فوری میڈیکل اور ڈی این اے نمونہ جات کا معائنہ۔',
        order: 2
      },
      {
        sectionNumber: '164',
        title: 'Recording of Statements and Confessions',
        titleUrdu: 'مجسٹریٹ کے روبرو بیان کا اندراج',
        content: 'Allows the recording of the victim statement under oath before a Judicial Magistrate, preserving testimony and reducing vulnerability to intimidation.',
        contentUrdu: 'جوڈیشل مجسٹریٹ کے سامنے حلفیہ بیان قلمبند کروانا تاکہ گواہی محفوظ ہو اور دباؤ کا خاتمہ ہو۔',
        order: 3
      },
      {
        sectionNumber: '352',
        title: 'In-Camera Trial Provision',
        titleUrdu: 'بند کمرہ سماعت (ان کیمرہ ٹرائل)',
        content: 'Empowers the court to hold trials of sexual assault cases in camera, excluding the general public to protect the dignity and privacy of the victim.',
        contentUrdu: 'متاثرہ کی عزت اور رازداری کے تحفظ کے لیے عام لوگوں کی عدم موجودگی میں بند کمرے میں مقدمے کی سماعت کا اختیار۔',
        order: 4
      }
    ]
  },

  // 6. Qanun-e-Shahadat Order, 1984
  {
    slug: 'qanun-e-shahadat-order-1984',
    title: 'Qanun-e-Shahadat Order 1984',
    titleUrdu: 'قانونِ شہادت آرڈر 1984',
    yearEnacted: 1984,
    categorySlug: 'criminal-law',
    status: 'IN_FORCE',
    jurisdiction: 'FEDERAL',
    summary: 'The law of evidence in Pakistan. Key reforms forbid questioning or character assassination based on the past sexual history of a rape victim, while prioritizing modern forensic reports and DNA analysis as admissible corroborative proof.',
    summaryUrdu: 'پاکستان کا قانونِ شہادت۔ جدید ترامیم کے تحت زیادتی کے مقدمات میں متاثرہ کے سابقہ کردار یا جنسی تاریخ پر سوال اٹھانا ممنوع ہے اور ڈی این اے و فارنزک کو بنیادی ثبوت مانا جاتا ہے۔',
    fullText: 'Order defining the admissibility of oral, documentary, and expert forensic evidence in Pakistani courts.',
    sections: [
      {
        sectionNumber: '151',
        title: 'Prohibition on Impeaching Victim Character by Past History',
        titleUrdu: 'سابقہ کردار پر سوال اٹھانے کی ممانعت',
        content: 'Bars defense counsel from introducing evidence or questioning regarding the general immoral character or prior sexual history of the complainant in sexual assault prosecutions.',
        contentUrdu: 'ریپ کے مقدمات میں متاثرہ خاتون یا بچے کے عمومی کردار یا ماضی کی بنیاد پر سوال اٹھانے یا جرح کرنے پر مکمل پابندی۔',
        order: 1
      },
      {
        sectionNumber: '164',
        title: 'Admissibility of Modern Electronic and Forensic Devices',
        titleUrdu: 'جدید فارنزک و سائنسی شواہد کی قبولیت',
        content: 'Authorizes courts to admit expert reports, DNA profiling, video link recordings, and electronic forensic analysis as substantive evidence.',
        contentUrdu: 'ڈی این اے رپورٹ، فارنزک جانچ، اور ویڈیو لنک ریکارڈنگ کو بطور مکمل ثبوت تسلیم کرنے کا اختیار۔',
        order: 2
      }
    ]
  },

  // 7. Anti-Rape (Investigation and Trial) Act, 2021
  {
    slug: 'anti-rape-investigation-and-trial-act-2021',
    title: 'Anti-Rape (Investigation and Trial) Act, 2021',
    titleUrdu: 'اینٹی ریپ (تفتیش و ٹرائل) ایکٹ 2021',
    yearEnacted: 2021,
    categorySlug: 'womens-rights-law',
    status: 'IN_FORCE',
    jurisdiction: 'FEDERAL',
    summary: 'Transformative legislation establishing Special Courts for rape cases with a 4-month trial mandate, Special Investigation Teams (SITs), Anti-Rape Crisis Cells, ban on virginity/two-finger testing, sex offender registry with NADRA, and free legal aid for victims.',
    summaryUrdu: 'خصوصی اینٹی ریپ عدالتیں (4 ماہ میں ٹرائل)، خصوصی تفتیشی ٹیمیں، کرائسز سیلز، ٹو فنگر ٹیسٹ پر مکمل پابندی، نادرا کے ساتھ جنسی مجرمان کی رجسٹری، اور مفت قانونی امداد۔',
    fullText: 'An Act to provide for expeditious investigation and trial of rape cases with dignity and specialized protections.',
    sections: [
      {
        sectionNumber: '3',
        title: 'Establishment of Special Courts',
        titleUrdu: 'خصوصی اینٹی ریپ عدالتوں کا قیام',
        content: 'Mandates the establishment of designated Special Courts across Pakistan exclusively hearing sexual assault cases, required to conclude trials within 4 months.',
        contentUrdu: 'صرف زیادتی کے مقدمات کے لیے خصوصی عدالتیں قائم کی گئیں جن کے لیے 4 ماہ کے اندر فیصلہ سنانا لازمی ہے۔',
        order: 1
      },
      {
        sectionNumber: '5',
        title: 'Anti-Rape Crisis Cells (ARCC)',
        titleUrdu: 'اینٹی ریپ کرائسز سیلز',
        content: 'Crisis cells established in teaching hospitals and major medical institutions to provide immediate emergency medical, psychological, and legal assistance in a safe, non-traumatizing environment.',
        contentUrdu: 'بڑے ہسپتالوں میں قائم کرائسز سیل جہاں فوری طبی امداد، ذہنی صحت کی رہنمائی اور قانونی مدد ایک ہی چھت تلے فراہم کی جاتی ہے۔',
        order: 2
      },
      {
        sectionNumber: '11',
        title: 'Prohibition on Virginity / Two-Finger Testing',
        titleUrdu: 'ٹو فنگر / کنوارپن ٹیسٹ پر قطعی پابندی',
        content: 'Strictly prohibits conducting virginity testing (including the two-finger test) on victims of sexual assault, rendering any such examination unlawful and disciplinary.',
        contentUrdu: 'متاثرہ خواتین یا لڑکیوں پر کنوارپن کی جانچ (ٹو فنگر ٹیسٹ) پر قانونی طور پر مکمل پابندی عائد کر دی گئی۔',
        order: 3
      },
      {
        sectionNumber: '14',
        title: 'Protection of Victim Identity & In-Camera Evidence',
        titleUrdu: 'متاثرہ کی شناخت کا تحفظ اور ویڈیو لنک بیان',
        content: 'Provides for evidence recording via video links, behind screens, or in-camera, ensuring the victim never has to face the accused directly in court.',
        contentUrdu: 'ویڈیو لنک یا پردے کے پیچھے بیان ریکارڈ کرنے کی سہولت تاکہ متاثرہ کو ملزم کے سامنے نہ آنا پڑے۔',
        order: 4
      },
      {
        sectionNumber: '18',
        title: 'Register of Sex Offenders',
        titleUrdu: 'جنسی مجرمان کی قومی رجسٹری',
        content: 'Requires NADRA to maintain a centralized, confidential register of convicted sex offenders to monitor and prevent repeat offenses.',
        contentUrdu: 'نادرا کے پاس سزا یافتہ جنسی مجرمان کی قومی سطح پر رجسٹری قائم کرنا تاکہ بار بار جرائم کا تدارک ہو۔',
        order: 5
      }
    ]
  },

  // 8. Zainab Alert, Recovery and Response Act, 2020
  {
    slug: 'zainab-alert-recovery-response-act-2020',
    title: 'Zainab Alert, Recovery and Response Act, 2020',
    titleUrdu: 'زینب الرٹ، بازیابی و جوابی کارروائی ایکٹ 2020',
    yearEnacted: 2020,
    categorySlug: 'human-rights-minority-law',
    status: 'IN_FORCE',
    jurisdiction: 'FEDERAL',
    summary: 'Enacted in the aftermath of the tragic abduction and murder of Zainab Ansari (2018). Established the Zainab Alert Response and Recovery Agency (ZARRA), emergency nationwide missing child alert system, Helpline 1099 integration, and penal consequences for police failure to register missing child reports.',
    summaryUrdu: 'معصوم زینب انصاری کے سانحے کے بعد نافذ کیا گیا۔ زارا (ZARRA) ایجنسی کا قیام، گمشدہ بچوں کے فوری قومی الرٹ کا نظام، ہیلپ لائن 1099 اور رپورٹ درج نہ کرنے والے پولیس اہلکاروں پر سزا۔',
    fullText: 'Federal statute for the swift recovery, alert, and protection of missing, abducted, and abused children in Pakistan.',
    sections: [
      {
        sectionNumber: '3',
        title: 'Establishment of ZARRA',
        titleUrdu: 'زارا (ZARRA) ایجنسی کا قیام',
        content: 'Establishes the Zainab Alert, Response and Recovery Agency under the Ministry of Human Rights to coordinate nationwide response on missing and abducted children.',
        contentUrdu: 'وزارتِ انسانی حقوق کے ماتحت زارا ایجنسی کا قیام جو گمشدہ بچوں کی فوری بازیابی کے لیے ملک گیر نگرانی کرتی ہے۔',
        order: 1
      },
      {
        sectionNumber: '4',
        title: 'Immediate Alert Mechanism & Broadcaster Broadcast',
        titleUrdu: 'فوری الرٹ اور میڈیا پر نشریات',
        content: 'Upon receiving a complaint of a missing or abducted child, alerts are triggered across law enforcement, telecommunications networks, television broadcasts, and border crossings within hours.',
        contentUrdu: 'بچے کی گمشدگی پر چند گھنٹوں کے اندر ٹی وی، موبائل نیٹ ورکس اور قانون نافذ کرنے والے اداروں پر الرٹ کا اجرا۔',
        order: 2
      },
      {
        sectionNumber: '9',
        title: 'Punishment for Failure by Police Officers',
        titleUrdu: 'پولیس اہلکاروں کی غفلت پر سزا',
        content: 'Any police officer who neglects, delays, or refuses to register an FIR regarding a missing or abducted child is liable to imprisonment up to 2 years and departmental action.',
        contentUrdu: 'اگر کوئی پولیس افسر گمشدہ بچے کی ایف آئی آر درج کرنے میں تاخیر یا انکار کرے تو اسے 2 سال تک قید اور محکمانہ سزا دی جائے گی۔',
        order: 3
      }
    ]
  },

  // 9. Juvenile Justice System Act, 2018
  {
    slug: 'juvenile-justice-system-act-2018',
    title: 'Juvenile Justice System Act, 2018',
    titleUrdu: 'نظامِ عدل برائے نو عمر ملزمان ایکٹ 2018',
    yearEnacted: 2018,
    categorySlug: 'human-rights-minority-law',
    status: 'IN_FORCE',
    jurisdiction: 'FEDERAL',
    summary: 'Applies when an accused or victim is a child (under 18 years). Mandates specialized Juvenile Courts, diversion programs, forbids holding children with adult convicts, prohibits the death penalty for juveniles, and sets minimum age of criminal responsibility at 10 years.',
    summaryUrdu: 'جب ملزم یا متاثرہ 18 سال سے کم عمر ہو تو یہ قانون لاگو ہوتا ہے۔ نو عمر عدالتیں، بچوں کو بڑے مجرموں سے الگ رکھنا، سزائے موت کی ممانعت اور اصلاحی نظام۔',
    fullText: 'Federal statute modifying justice administration for persons under eighteen years.',
    sections: [
      {
        sectionNumber: '4',
        title: 'Establishment of Juvenile Courts',
        titleUrdu: 'جووینائل عدالتوں کا قیام',
        content: 'Requires separate Juvenile Courts with child-friendly environments, privacy guarantees, and specialized judicial training.',
        contentUrdu: 'بچوں کے لیے الگ عدالتیں جہاں ماحول خوفزدہ کرنے والا نہ ہو اور رازداری برقرار رہے۔',
        order: 1
      },
      {
        sectionNumber: '16',
        title: 'Prohibition of Capital Punishment on Juveniles',
        titleUrdu: 'کم عمر ملزمان پر سزائے موت کی ممانعت',
        content: 'Explicitly prohibits awarding capital punishment (death sentence) or life imprisonment without possibility of release to any person who was under the age of 18 at the time of the offense.',
        contentUrdu: 'جرم کے وقت 18 سال سے کم عمر کسی بھی بچے کو سزائے موت یا سخت بیڑیاں ڈالنے پر قطعی پابندی۔',
        order: 2
      }
    ]
  },

  // 10. Punjab Destitute and Neglected Children Act, 2004
  {
    slug: 'punjab-destitute-neglected-children-act-2004',
    title: 'Punjab Destitute and Neglected Children Act 2004',
    titleUrdu: 'پنجاب ایکٹ برائے بے سہارا و لاوارث بچے 2004',
    yearEnacted: 2004,
    categorySlug: 'provincial-specific-law',
    status: 'IN_FORCE',
    jurisdiction: 'PUNJAB',
    summary: 'The provincial foundation for child welfare in Punjab. Established the Child Protection and Welfare Bureau (CPWB), emergency child rescue services, Helpline 1121, child protection courts, and shelter institutes for abused, neglected, and exploited young girls and boys.',
    summaryUrdu: 'پنجاب میں چائلڈ پروٹیکشن اینڈ ویلفیئر بیورو (CPWB) اور ہیلپ لائن 1121 کی بنیاد۔ زیادتی، بھیک مانگنے اور تشدد کے شکار بچوں کو پناہ، تعلیم اور قانونی سرپرستی۔',
    fullText: 'Provincial Act of Punjab for the care, custody, education, and protection of destitute children.',
    sections: [
      {
        sectionNumber: '3',
        title: 'Establishment of Child Protection & Welfare Bureau',
        titleUrdu: 'چائلڈ پروٹیکشن بیورو کا قیام',
        content: 'Provides for institutional rescue, safe custody, psychological counseling, and legal representation of children facing physical or sexual exploitation.',
        contentUrdu: 'تشدد اور جنسی استحصال کے شکار بچوں کی فوری ریسکیو، بحالی اور مفت قانونی نمائندگی کا ادارہ۔',
        order: 1
      },
      {
        sectionNumber: '18',
        title: 'Child Protection Helpline 1121 and Rescue',
        titleUrdu: 'چائلڈ ہیلپ لائن 1121 اور ریسکیو',
        content: 'Enables round-the-clock telephone and field rescue teams to intervene in child vulnerability and violence reports.',
        contentUrdu: '24 گھنٹے مفت ہیلپ لائن 1121 جس کے ذریعے متاثرہ بچوں کی بازیابی کی فوری ٹیم روانہ ہوتی ہے۔',
        order: 2
      }
    ]
  },

  // 11. Sindh Child Protection Authority Act, 2011
  {
    slug: 'sindh-child-protection-authority-act-2011',
    title: 'Sindh Child Protection Authority Act, 2011',
    titleUrdu: 'سندھ چائلڈ پروٹیکشن اتھارٹی ایکٹ 2011',
    yearEnacted: 2011,
    categorySlug: 'provincial-specific-law',
    status: 'IN_FORCE',
    jurisdiction: 'SINDH',
    summary: 'Established the Sindh Child Protection Authority (SCPA) to institutionalize child rights, investigate child abuse and exploitation, monitor children’s homes, provide emergency shelter, and coordinate legal proceedings for vulnerable young girls across Sindh.',
    summaryUrdu: 'سندھ میں بچوں کے حقوق اور تحفظ کے لیے سندھ چائلڈ پروٹیکشن اتھارٹی کا قیام، جو چائلڈ ایبیوز کے خلاف کارروائی اور متاثرہ بچیوں کو شیلٹر اور قانونی مدد فراہم کرتی ہے۔',
    fullText: 'Sindh provincial legislation for comprehensive child rights monitoring and institutional safeguards.',
    sections: [
      {
        sectionNumber: '4',
        title: 'Powers of the Child Protection Authority',
        titleUrdu: 'اتھارٹی کے اختیارات اور فرائض',
        content: 'Authority empowered to investigate child exploitation, initiate police reports, provide free legal counsel, and run transit shelters.',
        contentUrdu: 'بچوں کے استحصال کی تحقیقات، پولیس کارروائی کی نگرانی اور مفت قانونی وکلائی کی فراہمی کے اختیارات۔',
        order: 1
      }
    ]
  },

  // 12. Khyber Pakhtunkhwa Child Protection and Welfare Act, 2010
  {
    slug: 'khyber-pakhtunkhwa-child-protection-welfare-act-2010',
    title: 'Khyber Pakhtunkhwa Child Protection and Welfare Act 2010',
    titleUrdu: 'خیبر پختونخوا چائلڈ پروٹیکشن اینڈ ویلفیئر ایکٹ 2010',
    yearEnacted: 2010,
    categorySlug: 'provincial-specific-law',
    status: 'IN_FORCE',
    jurisdiction: 'KHYBER_PAKHTUNKHWA',
    summary: 'Establishes Child Protection Units (CPUs) in all KP districts to prevent child abuse, forced marriages of young girls, sexual exploitation, trafficking, and provide institutional rehabilitation with judicial oversight.',
    summaryUrdu: 'خیبر پختونخوا کے تمام اضلاع میں چائلڈ پروٹیکشن یونٹس کا قیام، تاکہ کم عمری کی شادی، زیادتی اور اسمگلنگ سے لڑکیوں اور بچوں کو تحفظ دیا جا سکے۔',
    fullText: 'Provincial enactment of Khyber Pakhtunkhwa safeguarding child rights and establishing protection units.',
    sections: [
      {
        sectionNumber: '5',
        title: 'District Child Protection Units (CPUs)',
        titleUrdu: 'ضلعی چائلڈ پروٹیکشن یونٹس',
        content: 'Provides for localized monitoring teams responding to child distress calls, domestic violence against girls, and legal referrals.',
        contentUrdu: 'ہر ضلع میں مانیٹرنگ اور ریسکیو ٹیمیں جو بچیوں پر گھریلو و جنسی تشدد کے خلاف قانونی کارروائی کرتی ہیں۔',
        order: 1
      }
    ]
  },

  // 13. Balochistan Child Protection Act, 2016
  {
    slug: 'balochistan-child-protection-act-2016',
    title: 'Balochistan Child Protection Act 2016',
    titleUrdu: 'بلوچستان چائلڈ پروٹیکشن ایکٹ 2016',
    yearEnacted: 2016,
    categorySlug: 'provincial-specific-law',
    status: 'IN_FORCE',
    jurisdiction: 'BALOCHISTAN',
    summary: 'Provincial statute establishing the Balochistan Child Protection Commission, child protection units, and legal safety nets to guard girls and children against abuse, forced labor, sexual exploitation, and early forced marriage.',
    summaryUrdu: 'بلوچستان چائلڈ پروٹیکشن کمیشن اور ضلعی یونٹس کا قیام، تاکہ بچیوں کو تشدد، بدسلوکی اور جبری کم عمری کی شادیوں سے قانونی طور پر محفوظ رکھا جا سکے۔',
    fullText: 'Balochistan provincial act for child welfare, protection commissions, and judicial procedures.',
    sections: [
      {
        sectionNumber: '4',
        title: 'Balochistan Child Protection Commission',
        titleUrdu: 'بلوچستان چائلڈ پروٹیکشن کمیشن',
        content: 'Functions as the highest provincial body tracking child vulnerability, enforcing anti-abuse guidelines, and securing state guardianship for endangered minors.',
        contentUrdu: 'صوبائی سطح پر کمیشن جو بچیوں اور بچوں کے تحفظ اور قانونی نگرانی کے انتظامات کو یقینی بناتا ہے۔',
        order: 1
      }
    ]
  },

  // 14. Child Marriage Restraint Act, 1929
  {
    slug: 'child-marriage-restraint-act-1929',
    title: 'Child Marriage Restraint Act 1929',
    titleUrdu: 'قانونِ انسدادِ کم عمری شادی 1929',
    yearEnacted: 1929,
    categorySlug: 'family-law',
    status: 'IN_FORCE',
    jurisdiction: 'FEDERAL',
    summary: 'The historic federal enactment prohibiting child marriages. Sets the minimum marriage age at 16 for females and 18 for males, prescribing penalties of fine and simple imprisonment for parents, guardians, and officiants who facilitate minor marriages.',
    summaryUrdu: 'کم عمری کی شادی پر پابندی کا بنیادی وفاقی قانون جس میں لڑکی کی کم از کم عمر 16 سال اور لڑکے کی 18 سال مقرر ہے۔ خلاف ورزی پر سزا اور جرمانہ عائد ہوتا ہے۔',
    fullText: 'Federal statute restraining the solemnisation of child marriages.',
    sections: [
      {
        sectionNumber: '2',
        title: 'Definition of Child and Child Marriage',
        titleUrdu: 'بچے اور کم عمری کی شادی کی تعریف',
        content: 'A child means a person who, if a male, is under eighteen years of age, and if a female, is under sixteen years of age. A child marriage means a marriage to which either of the contracting parties is a child.',
        contentUrdu: 'لڑکا 18 سال سے کم اور لڑکی 16 سال سے کم ہو تو بچہ قرار پائے گی۔ ایسی شادی جس میں کوئی ایک فریق نابالغ ہو کم عمری کی شادی کہلاتی ہے۔',
        order: 1
      },
      {
        sectionNumber: '4',
        title: 'Punishment for Male Adult Marrying a Child',
        titleUrdu: 'بالغ مرد کے بچے سے نکاح پر سزا',
        content: 'Whoever, being a male above eighteen years of age, contracts a child marriage shall be punishable with simple imprisonment which may extend to one month, or with fine.',
        contentUrdu: '18 سال سے بڑا مرد جو کسی نابالغ بچی سے نکاح کرے گا، قید اور جرمانے کا حقدار ہوگا۔',
        order: 2
      },
      {
        sectionNumber: '5',
        title: 'Punishment for Solemnizing a Child Marriage',
        titleUrdu: 'کم عمری کا نکاح پڑھانے والے کے لیے سزا',
        content: 'Whoever performs, conducts or directs any child marriage shall be punishable with simple imprisonment or fine, unless he proves reason to believe the marriage was not a child marriage.',
        contentUrdu: 'جو نکاح خواں یا وکیل کم عمری کا نکاح کروائے گا وہ قید اور جرمانے کا مجرم ہوگا۔',
        order: 3
      }
    ]
  },

  // 15. Sindh Child Marriages Restraint Act, 2013
  {
    slug: 'sindh-child-marriages-restraint-act-2013',
    title: 'Sindh Child Marriages Restraint Act, 2013',
    titleUrdu: 'سندھ چائلڈ میرجز ریسٹرینٹ ایکٹ 2013',
    yearEnacted: 2013,
    categorySlug: 'family-law',
    status: 'IN_FORCE',
    jurisdiction: 'SINDH',
    summary: 'Pioneering provincial legislation making the legal minimum age of marriage 18 years for both females and males in Sindh. Strictly punishes underage marriage facilitators, parents, and spouses with up to 3 years rigorous imprisonment, classifying the offense as cognizable and non-bailable.',
    summaryUrdu: 'سندھ کا انقلابی قانون جس کے تحت لڑکی اور لڑکے دونوں کے لیے شادی کی کم از کم عمر 18 سال لازمی ہے۔ خلاف ورزی پر 3 سال تک سخت قید اور جرمانہ۔ جرم قابل دست اندازی اور ناقابلِ ضمانت ہے۔',
    fullText: 'Sindh Act No. XV of 2014 restraining solemnisation of child marriages.',
    sections: [
      {
        sectionNumber: '2',
        title: 'Equal Marriageable Age of 18 Years',
        titleUrdu: 'لڑکی اور لڑکے دونوں کے لیے 18 سال کی عمر',
        content: 'A child means a person who, if a male or female, is under eighteen years of age. Strictly prohibits child marriages below age 18.',
        contentUrdu: 'لڑکا ہو یا لڑکی، 18 سال سے کم عمر کا شخص بچہ مانا جائے گا اور 18 سال سے کم عمر شادی قطعی ممنوع ہے۔',
        order: 1
      },
      {
        sectionNumber: '3',
        title: 'Rigorous Punishment for Underage Marriage Contracting',
        titleUrdu: 'کم عمری کے نکاح پر سخت سزا',
        content: 'Whoever contracts, facilitates, or permits child marriage punishable with rigorous imprisonment up to 3 years and fine not less than PKR 45,000.',
        contentUrdu: 'کم عمری کی شادی کرنے، کروانے یا اجازت دینے پر 3 سال تک بامشقت قید اور کم از کم 45 ہزار روپے جرمانہ۔',
        order: 2
      }
    ]
  },

  // 16. Islamabad Child Marriage Restraint Act, 2025
  {
    slug: 'islamabad-child-marriage-restraint-act-2025',
    title: 'Islamabad Child Marriage Restraint Act, 2025',
    titleUrdu: 'اسلام آباد چائلڈ میرج ریسٹرینٹ ایکٹ 2025',
    yearEnacted: 2025,
    categorySlug: 'family-law',
    status: 'IN_FORCE',
    jurisdiction: 'FEDERAL',
    summary: 'Enacted for the Islamabad Capital Territory (ICT) establishing 18 years as the strictly uniform minimum age of marriage for both girls and boys, eliminating statutory loopholes, protecting young girls from early forced matrimony, and prescribing rigorous penal consequences.',
    summaryUrdu: 'اسلام آباد کیپیٹل ٹیریٹری (ICT) کے لیے قانون جس کے تحت لڑکی اور لڑکے دونوں کے لیے شادی کی قانونی حد 18 سال مقرر کی گئی تاکہ بچیوں کو جبری و قبل از وقت شادی سے تحفظ مل سکے۔',
    fullText: 'Federal ICT legislation setting 18 years uniform minimum age for marriage.',
    sections: [
      {
        sectionNumber: '2',
        title: 'Uniform Age Requirement of 18 Years in ICT',
        titleUrdu: 'اسلام آباد میں 18 سال کی یکساں عمر',
        content: 'Strictly fixes eighteen years as the minimum threshold for lawful solemnization of marriage for both girls and boys within the Islamabad Capital Territory.',
        contentUrdu: 'اسلام آباد میں بچیوں اور لڑکوں دونوں کے لیے شادی کی کم از کم عمر 18 سال لازمی قرار دی گئی۔',
        order: 1
      },
      {
        sectionNumber: '5',
        title: 'Strict Penalties and Non-Bailable Cognizance',
        titleUrdu: 'سخت سزائیں اور ناقابلِ ضمانت گرفتاری',
        content: 'Prescribes substantial terms of imprisonment and financial penalties for officiants, guardians, and adult spouses involved in underage weddings.',
        contentUrdu: 'کم عمری کا نکاح پڑھانے والے، سرپرست اور بالغ دولہا کے لیے قید اور بھاری مالی جرمانے۔',
        order: 2
      }
    ]
  }
];

async function main() {
  console.log('🌟 Seeding 16 Women & Girls Protection Laws into:', dbPath);

  // Cache categories
  const categories = await prisma.category.findMany();
  const catMap = new Map(categories.map(c => [c.slug, c.id]));

  let addedLaws = 0;
  let addedSections = 0;

  for (const lawData of LAWS_DATA) {
    const categoryId = catMap.get(lawData.categorySlug) || catMap.get('womens-rights-law') || catMap.get('criminal-law');

    const law = await prisma.law.upsert({
      where: { slug: lawData.slug },
      update: {
        title: lawData.title,
        titleUrdu: lawData.titleUrdu,
        yearEnacted: lawData.yearEnacted,
        categoryId: categoryId,
        status: lawData.status,
        jurisdiction: lawData.jurisdiction,
        summary: lawData.summary,
        summaryUrdu: lawData.summaryUrdu
      },
      create: {
        slug: lawData.slug,
        title: lawData.title,
        titleUrdu: lawData.titleUrdu,
        yearEnacted: lawData.yearEnacted,
        categoryId: categoryId,
        status: lawData.status,
        jurisdiction: lawData.jurisdiction,
        summary: lawData.summary,
        summaryUrdu: lawData.summaryUrdu
      }
    });
    addedLaws++;

    // Add or update sections
    for (const sec of lawData.sections) {
      const existingSection = await prisma.section.findFirst({
        where: {
          lawId: law.id,
          sectionNumber: sec.sectionNumber
        }
      });

      if (existingSection) {
        await prisma.section.update({
          where: { id: existingSection.id },
          data: {
            title: sec.title,
            content: sec.content,
            contentUrdu: sec.contentUrdu,
            orderIndex: sec.order || 0
          }
        });
      } else {
        await prisma.section.create({
          data: {
            lawId: law.id,
            sectionNumber: sec.sectionNumber,
            title: sec.title,
            content: sec.content,
            contentUrdu: sec.contentUrdu,
            orderIndex: sec.order || 0
          }
        });
        addedSections++;
      }
    }
    console.log(`✅ Seeded: ${lawData.title} (${lawData.sections.length} sections)`);
  }

  // Synchronize binary file for serverless deployment
  const dbBuffer = fs.readFileSync(dbPath);
  const compressed = zlib.gzipSync(dbBuffer);
  const base64 = compressed.toString('base64');
  const binaryFileContent = `// Automatically generated binary seed of db/custom.db for serverless environments (Vercel)
// Updated on ${new Date().toISOString()}
export const DB_GZIP_BASE64 = '${base64}'\n`;
  fs.writeFileSync(path.resolve('src/lib/db-seed-binary.ts'), binaryFileContent);
  console.log('📦 Updated src/lib/db-seed-binary.ts with updated gzip binary.');

  const totalLaws = await prisma.law.count();
  const totalSections = await prisma.section.count();
  console.log(`\n🎉 Completed! Total Laws in DB: ${totalLaws}, Total Sections: ${totalSections}`);
}

main()
  .catch((err) => {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
