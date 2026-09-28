// Seed script for Self Defence (Private Defence) Laws in QanoonPK
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

const dbPath = path.resolve('db/custom.db').replace(/\\/g, '/');
process.env.DATABASE_URL = 'file:' + dbPath;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PPC_PRIVATE_DEFENCE_SECTIONS = [
  {
    sectionNumber: '96',
    title: 'Things done in private defence',
    content: 'Nothing is an offence which is done in the exercise of the right of private defence. Every citizen is entitled to use lawful force to protect person and property.',
    contentUrdu: 'کوئی بھی عمل جو حقِ دفاعِ خود اختیاری (پرائیویٹ ڈیفنس) کے جائز استعمال میں کیا جائے وہ جرم نہیں ہے۔ ہر شہری کو اپنی اور دوسروں کی حفاظت کا قانونی حق حاصل ہے۔',
    orderIndex: 96
  },
  {
    sectionNumber: '97',
    title: 'Right of private defence of the body and of property',
    content: 'Every person has a right, subject to the restrictions contained in Section 99, to defend: (First) His own body, and the body of any other person, against any offence affecting the human body; (Secondly) The property, whether movable or immovable, of himself or of any other person, against any act which is an offence falling under the definition of theft, robbery, mischief or criminal trespass, or which is an attempt to commit any of those offenses.',
    contentUrdu: 'ہر شخص کو دفعہ 99 کی حدود کے تحت یہ حق حاصل ہے کہ وہ: (اول) اپنے اور کسی بھی دوسرے شخص کے جسم کا کسی بھی ایسے جرم سے دفاع کرے جس سے انسانی جان یا جسم کو خطرہ ہو۔ (دوم) اپنے یا کسی دوسرے شخص کے مال (منقولہ یا غیر منقولہ) کا چوری، ڈکیتی، شرارت، یا مجرمانہ مداخلتِ بے جا سے دفاع کرے۔',
    orderIndex: 97
  },
  {
    sectionNumber: '98',
    title: 'Right of private defence against act of a person of unsound mind, etc.',
    content: 'When an act, which would otherwise be a certain offence, is not that offence by reason of the youth, the want of maturity of understanding, the unsoundness of mind, or the intoxication of the person doing it, or by reason of any misconception on the part of that person, every person has the same right of private defence against that act which he would have if the act were that offence.',
    contentUrdu: 'اگر حملہ آور کم عمری، پاگل پن، نشے یا کسی غلط فہمی کی وجہ سے قانونی طور پر مجرم نہ بھی بنتا ہو، تب بھی دفاع کرنے والے کو اس کے خلاف اپنے دفاع کا وہی مکمل حق حاصل ہے جو کسی عام ہوش مند حملہ آور کے خلاف حاصل ہوتا ہے۔',
    orderIndex: 98
  },
  {
    sectionNumber: '99',
    title: 'Acts against which there is no right of private defence, and extent of force',
    content: 'There is no right of private defence against an act which does not reasonably cause the apprehension of death or of grievous hurt, if done, or attempted to be done, by a public servant acting in good faith under colour of his office, though that act may not be strictly justifiable by law. There is no right of private defence in cases in which there is time to have recourse to the protection of the public authorities. Extent to which the right may be exercised: The right of private defence in no case extends to the inflicting of more harm than it is necessary to inflict for the purpose of defence.',
    contentUrdu: 'حقِ دفاع کی حدود: (1) سرکاری ملازم کی نیک نیتی کی کارروائی کے خلاف حق نہیں ملتا جب تک جان یا شدید چوٹ کا خطرہ نہ ہو۔ (2) اگر پولیس یا سرکاری مدد حاصل کرنے کا مناسب وقت موجود ہو تو وہاں دفاع کا حق نہیں بلکہ مدد لینا ضروری ہے۔ (3) حقِ دفاع کسی صورت میں ضرورت سے زیادہ نقصان پہنچانے کی اجازت نہیں دیتا۔',
    orderIndex: 99
  },
  {
    sectionNumber: '100',
    title: 'When the right of private defence of the body extends to causing death',
    content: 'The right of private defence of the body extends, under the restrictions mentioned in Section 99, to the voluntary causing of death or of any other harm to the assailant, if the offence which occasions the exercise of the right be of any of the descriptions hereinafter enumerated, namely: (1) An assault causing reasonable apprehension of death; (2) An assault causing reasonable apprehension of grievous hurt; (3) An assault with the intention of committing rape; (4) An assault with the intention of gratifying unnatural lust; (5) An assault with the intention of kidnapping or abducting; (6) An assault with the intention of wrongfully confining a person under circumstances which may reasonably cause him to apprehend that he will be unable to have recourse to the public authorities; (7) An act of throwing or attempting to throw acid or administering acid.',
    contentUrdu: 'جسم کی حفاظت میں حملہ آور کی جان لینے کا حق 7 صورتوں میں جائز ہے: (1) ایسا حملہ جس سے موت واقع ہونے کا معقول اندیشہ ہو۔ (2) شدید چوٹ (Grievous Hurt) کا اندیشہ۔ (3) زنا بالجبر (Rape) کی نیت سے کیا گیا حملہ۔ (4) غیر فطری جنسی فعل کی نیت۔ (5) اغوا یا بچے کے اغوا کی نیت۔ (6) ایسا حبس بے جا جس میں سرکاری مدد طلب کرنا ناممکن بنا دیا گیا ہو۔ (7) تیزاب پھینکنے یا اس کی کوشش کا حملہ۔',
    orderIndex: 100
  },
  {
    sectionNumber: '101',
    title: 'When such right extends to causing any harm other than death',
    content: 'If the offence be not of any of the descriptions enumerated in Section 100, the right of private defence of the body does not extend to the voluntary causing of death to the assailant, but does extend, under the restrictions of Section 99, to the voluntary causing to the assailant of any harm other than death.',
    contentUrdu: 'اگر حملہ دفعہ 100 کی 7 خطرناک صورتوں میں نہ آتا ہو، تو دفاع کرنے والے کو حملہ آور کو موت کے علاوہ کوئی بھی مناسب نقصان (چوٹ یا قابو کرنا) پہنچانے کا حق ہے، لیکن جان لینا جائز نہیں۔',
    orderIndex: 101
  },
  {
    sectionNumber: '102',
    title: 'Commencement and continuance of the right of private defence of the body',
    content: 'The right of private defence of the body commences as soon as a reasonable apprehension of danger to the body arises from an attempt or threat to commit the offence, though the offence may not have been committed; and it continues as long as such apprehension of danger to the body continues.',
    contentUrdu: 'جسم کے دفاع کا حق اسی لمحے شروع ہو جاتا ہے جیسے ہی حملے یا خطرے کا معقول اندیشہ پیدا ہو، خواہ اصل حملہ ابھی نہ ہوا ہو۔ اور یہ حق تب تک برقرار رہتا ہے جب تک جان یا جسم کو خطرہ موجود رہے۔ خطرہ ختم ہوتے ہی یہ حق ختم ہو جاتا ہے۔',
    orderIndex: 102
  },
  {
    sectionNumber: '103',
    title: 'When the right of private defence of property extends to causing death',
    content: 'The right of private defence of property extends, under the restrictions mentioned in Section 99, to the voluntary causing of death or of any other harm to the wrong-doer, if the offence, the committing of which, or the attempting to commit which, occasions the exercise of the right, be an offence of any of the descriptions hereinafter enumerated, namely: (1) Robbery; (2) House-breaking by night; (3) Mischief by fire committed on any building, tent or vessel used as a human dwelling or place for the custody of property; (4) Theft, mischief, or house-trespass, under such circumstances as may reasonably cause apprehension that death or grievous hurt will be the consequence, if such right of private defence is not exercised.',
    contentUrdu: 'مال کے دفاع میں جان لینے کا حق 4 مخصوص صورتوں میں ہے: (1) ڈکیتی (Robbery)۔ (2) رات کے وقت گھر میں نقب زنی یا دروازہ توڑ کر داخل ہونا (House-breaking by night)۔ (3) کسی رہائشی مکان یا مال خانے کو آگ لگانا۔ (4) چوری یا غیر قانونی داخلہ ایسے حالات میں جہاں موت یا شدید چوٹ کا معقول اندیشہ ہو۔',
    orderIndex: 103
  },
  {
    sectionNumber: '104',
    title: 'When such right extends to causing any harm other than death',
    content: 'If the offence, the committing of which, or the attempting to commit which, occasions the exercise of the right of private defence, be theft, mischief, or criminal trespass, not of any of the descriptions enumerated in Section 103, that right does not extend to the voluntary causing of death, but does extend, subject to the restrictions of Section 99, to the voluntary causing to the wrong-doer of any harm other than death.',
    contentUrdu: 'اگر چوری یا نقصان دفعہ 103 والی خطرناک نوعیت کا نہ ہو، تو چور یا حملہ آور کو موت کے علاوہ کوئی بھی جسمانی نقصان پہنچا کر مال بچانے کا حق ہے، لیکن جان لینا جائز نہیں۔',
    orderIndex: 104
  },
  {
    sectionNumber: '105',
    title: 'Commencement and continuance of the right of private defence of property',
    content: 'The right of private defence of property commences when a reasonable apprehension of danger to the property commences. The right of private defence of property against theft continues till the offender has effected his retreat with the property or either the assistance of the public authorities is obtained, or the property has been recovered. The right against robbery continues as long as the offender causes or attempts to cause to any person death or hurt or wrongful restraint. The right against criminal trespass or mischief continues as long as the offender continues in the commission of criminal trespass or mischief.',
    contentUrdu: 'مال کے دفاع کا حق تب شروع ہوتا ہے جب مال کو نقصان کا خطرہ پیدا ہو۔ چوری کے خلاف یہ حق تب تک رہتا ہے جب تک چور مال لے کر بھاگ نہ جائے یا پولیس کی مدد نہ مل جائے۔ ڈکیتی میں جب تک خطرہ برقرار رہے۔ مجرمانہ مداخلت میں جب تک دخل اندازی جاری رہے۔',
    orderIndex: 105
  },
  {
    sectionNumber: '106',
    title: 'Right of private defence against deadly assault when there is risk of harm to innocent person',
    content: 'If in the exercise of the right of private defence against an assault which reasonably causes the apprehension of death, the defender be so situated that he cannot effectually exercise that right without risk of harm to an innocent person, his right of private defence extends to the running of that risk.',
    contentUrdu: 'اگر کسی مہلک حملے سے بچاؤ کے دوران ایسی مجبوری ہو کہ دفاع کرنے سے کسی بے گناہ شخص کو نادانستہ نقصان پہنچنے کا خدشہ ہو، تو قانون دفاع کرنے والے کو یہ خطرہ مول لینے کی اجازت دیتا ہے اور وہ مجرم قرار نہیں پائے گا۔',
    orderIndex: 106
  }
];

const ARMS_LAW = {
  slug: 'arms-ordinance-1965',
  title: 'Pakistan Arms Ordinance 1965',
  titleUrdu: 'پاکستان آرمز آرڈیننس 1965',
  yearEnacted: 1965,
  categorySlug: 'criminal-law',
  status: 'IN_FORCE',
  jurisdiction: 'FEDERAL',
  summary: 'Regulates the manufacture, conversion, sale, import, export, transport, bearing and possession of arms and ammunition in Pakistan. Prescribes firearm licensing procedures, penalties for possession of unlicensed weapons, and statutory restrictions on prohibited and non-prohibited bores.',
  summaryUrdu: 'پاکستان میں اسلحہ، گولہ بارود رکھنے، لائسنس کے اجرا، ممنوعہ اور غیر ممنوعہ بور کے ضوابط اور بغیر لائسنس اسلحہ رکھنے کی سزاؤں کا بنیادی وفاقی قانون۔',
  sections: [
    {
      sectionNumber: '8',
      title: 'Prohibition of going armed without licence',
      content: 'No person shall go armed with any arms, notwithstanding that the person is entitled to own, possess or carry such arms under a licence, unless the conditions of the licence so permit.',
      contentUrdu: 'کوئی بھی شخص بغیر لائسنس یا لائسنس کی شرائط کے برعکس اسلحہ لے کر عوامی مقامات پر نہیں جا سکتا۔',
      orderIndex: 1
    },
    {
      sectionNumber: '13',
      title: 'Penalty for unlicensed possession and breach of conditions',
      content: 'Whoever acquires, possesses or carries any firearm or ammunition without holding a valid licence issued under this Ordinance shall be punishable with imprisonment which may extend to seven years, or with fine, or with both.',
      contentUrdu: 'بغیر لائسنس اسلحہ یا بارود رکھنے یا ساتھ لے جانے پر 7 سال تک قید اور جرمانے کی سزا ہو سکتی ہے۔',
      orderIndex: 2
    }
  ]
};

async function main() {
  console.log('🛡️ Starting Private Defence laws seeding on:', dbPath);

  // 1. Seed PPC Sections 96-106
  const ppc = await prisma.law.findUnique({
    where: { slug: 'pakistan-penal-code-1860' }
  });

  if (!ppc) {
    console.error('PPC 1860 not found!');
    return;
  }

  for (const sec of PPC_PRIVATE_DEFENCE_SECTIONS) {
    const existing = await prisma.section.findFirst({
      where: { lawId: ppc.id, sectionNumber: sec.sectionNumber }
    });

    if (existing) {
      await prisma.section.update({
        where: { id: existing.id },
        data: {
          title: sec.title,
          content: sec.content,
          contentUrdu: sec.contentUrdu,
          orderIndex: sec.orderIndex
        }
      });
    } else {
      await prisma.section.create({
        data: {
          lawId: ppc.id,
          sectionNumber: sec.sectionNumber,
          title: sec.title,
          content: sec.content,
          contentUrdu: sec.contentUrdu,
          orderIndex: sec.orderIndex
        }
      });
    }
  }
  console.log(`✅ Seeded ${PPC_PRIVATE_DEFENCE_SECTIONS.length} Private Defence sections into PPC 1860!`);

  // 2. Seed Arms Ordinance 1965
  const cat = await prisma.category.findUnique({ where: { slug: ARMS_LAW.categorySlug } });
  const categoryId = cat ? cat.id : ppc.categoryId;

  const armsLaw = await prisma.law.upsert({
    where: { slug: ARMS_LAW.slug },
    update: {
      title: ARMS_LAW.title,
      titleUrdu: ARMS_LAW.titleUrdu,
      yearEnacted: ARMS_LAW.yearEnacted,
      categoryId,
      status: ARMS_LAW.status,
      jurisdiction: ARMS_LAW.jurisdiction,
      summary: ARMS_LAW.summary,
      summaryUrdu: ARMS_LAW.summaryUrdu
    },
    create: {
      slug: ARMS_LAW.slug,
      title: ARMS_LAW.title,
      titleUrdu: ARMS_LAW.titleUrdu,
      yearEnacted: ARMS_LAW.yearEnacted,
      categoryId,
      status: ARMS_LAW.status,
      jurisdiction: ARMS_LAW.jurisdiction,
      summary: ARMS_LAW.summary,
      summaryUrdu: ARMS_LAW.summaryUrdu
    }
  });

  for (const sec of ARMS_LAW.sections) {
    const existing = await prisma.section.findFirst({
      where: { lawId: armsLaw.id, sectionNumber: sec.sectionNumber }
    });

    if (existing) {
      await prisma.section.update({
        where: { id: existing.id },
        data: {
          title: sec.title,
          content: sec.content,
          contentUrdu: sec.contentUrdu,
          orderIndex: sec.orderIndex
        }
      });
    } else {
      await prisma.section.create({
        data: {
          lawId: armsLaw.id,
          sectionNumber: sec.sectionNumber,
          title: sec.title,
          content: sec.content,
          contentUrdu: sec.contentUrdu,
          orderIndex: sec.orderIndex
        }
      });
    }
  }
  console.log(`✅ Seeded Arms Ordinance 1965 with ${ARMS_LAW.sections.length} sections!`);

  // 3. Update binary seed
  const dbBuffer = fs.readFileSync(dbPath);
  const compressed = zlib.gzipSync(dbBuffer);
  const base64 = compressed.toString('base64');
  const binaryFileContent = `// Automatically generated binary seed of db/custom.db for serverless environments (Vercel)
// Updated on ${new Date().toISOString()}
export const DB_GZIP_BASE64 = '${base64}'\n`;
  fs.writeFileSync(path.resolve('src/lib/db-seed-binary.ts'), binaryFileContent);
  console.log('📦 Updated src/lib/db-seed-binary.ts');

  const totalLaws = await prisma.law.count();
  const totalSections = await prisma.section.count();
  console.log(`🎉 Total Laws: ${totalLaws}, Total Sections: ${totalSections}`);
}

main()
  .catch((e) => {
    console.error('Error seeding self-defence laws:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
