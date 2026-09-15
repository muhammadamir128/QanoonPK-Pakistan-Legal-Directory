import { PrismaClient } from '@prisma/client'
import { categories, laws, lawTags } from '../src/lib/seed-data'
import { lawyers, docTemplates } from '../src/lib/lawyers-templates-data'

const db = new PrismaClient()

async function main() {
  console.log('🚀 Starting seed to Neon DB...')

  // 1. Insert categories
  console.log(`Inserting ${categories.length} categories...`)
  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        nameUrdu: cat.nameUrdu,
        icon: cat.icon,
        color: cat.color,
        description: cat.description,
        descriptionUrdu: cat.descriptionUrdu,
      },
      create: {
        name: cat.name,
        nameUrdu: cat.nameUrdu,
        slug: cat.slug,
        icon: cat.icon,
        color: cat.color,
        description: cat.description,
        descriptionUrdu: cat.descriptionUrdu,
      },
    })
  }

  // 2. Insert laws, sections, amendments
  console.log(`Inserting ${laws.length} laws...`)
  let lawsInserted = 0
  for (const law of laws) {
    const category = await db.category.findUnique({ where: { slug: law.categorySlug } })
    if (!category) {
      console.warn(`Category not found for slug: ${law.categorySlug}`)
      continue
    }

    const existing = await db.law.findUnique({ where: { slug: law.slug } })
    const data = {
      title: law.title,
      titleUrdu: law.titleUrdu,
      slug: law.slug,
      categoryId: category.id,
      yearEnacted: law.yearEnacted,
      jurisdiction: law.jurisdiction,
      status: law.status,
      summary: law.summary,
      summaryUrdu: law.summaryUrdu,
      gazetteReference: law.gazetteReference ?? null,
      promulgatingAuthority: law.promulgatingAuthority ?? null,
      applicabilityTags: JSON.stringify(law.applicabilityTags),
    }

    let lawId: string
    if (existing) {
      await db.law.update({ where: { id: existing.id }, data })
      lawId = existing.id
      await db.section.deleteMany({ where: { lawId } })
      await db.amendment.deleteMany({ where: { lawId } })
    } else {
      const created = await db.law.create({ data })
      lawId = created.id
      lawsInserted++
    }

    for (const s of law.sections) {
      await db.section.create({
        data: {
          lawId,
          sectionNumber: s.sectionNumber,
          title: s.title ?? null,
          content: s.content,
          contentUrdu: s.contentUrdu ?? null,
        },
      })
    }
    for (const a of law.amendments) {
      await db.amendment.create({
        data: {
          lawId,
          amendmentYear: a.amendmentYear,
          amendmentTitle: a.amendmentTitle,
          description: a.description,
          gazetteReference: a.gazetteReference ?? null,
          effectiveDate: null,
        },
      })
    }

    // Tags
    const tags = lawTags[law.slug] ?? []
    for (const tagName of tags) {
      const tag = await db.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      })
      await db.lawTag.upsert({
        where: { lawId_tagId: { lawId, tagId: tag.id } },
        update: {},
        create: { lawId, tagId: tag.id },
      })
    }
  }

  // 3. Finder questions
  console.log('Inserting finder questions...')
  await seedFinderQuestions()

  // 4. Seed lawyers
  console.log(`Inserting ${lawyers.length} lawyers...`)
  let lawyersInserted = 0
  for (const lawyer of lawyers) {
    const existing = await db.lawyer.findUnique({ where: { slug: lawyer.slug } })
    const data = {
      name: lawyer.name,
      nameUrdu: lawyer.nameUrdu ?? null,
      slug: lawyer.slug,
      bio: lawyer.bio ?? null,
      bioUrdu: lawyer.bioUrdu ?? null,
      specialization: JSON.stringify(lawyer.specialization),
      city: lawyer.city,
      cityUrdu: lawyer.cityUrdu ?? null,
      province: lawyer.province,
      licenseNumber: lawyer.licenseNumber ?? null,
      experienceYears: lawyer.experienceYears ?? null,
      education: lawyer.education ?? null,
      educationUrdu: lawyer.educationUrdu ?? null,
      email: lawyer.email ?? null,
      phone: lawyer.phone ?? null,
      website: lawyer.website ?? null,
      address: lawyer.address ?? null,
      addressUrdu: lawyer.addressUrdu ?? null,
      languages: JSON.stringify(lawyer.languages),
      rating: lawyer.rating ?? 0,
      reviewCount: lawyer.reviewCount ?? 0,
      verified: lawyer.verified ?? false,
      featured: lawyer.featured ?? false,
      acceptingCases: lawyer.acceptingCases ?? true,
      imageColor: lawyer.imageColor ?? null,
    }
    if (existing) {
      await db.lawyer.update({ where: { id: existing.id }, data })
    } else {
      await db.lawyer.create({ data })
      lawyersInserted++
    }
  }

  // 5. Seed document templates
  console.log(`Inserting ${docTemplates.length} document templates...`)
  let templatesInserted = 0
  for (const tpl of docTemplates) {
    const existing = await db.docTemplate.findUnique({ where: { slug: tpl.slug } })
    const data = {
      title: tpl.title,
      titleUrdu: tpl.titleUrdu ?? null,
      slug: tpl.slug,
      description: tpl.description,
      descriptionUrdu: tpl.descriptionUrdu,
      category: tpl.category,
      categoryUrdu: tpl.categoryUrdu,
      fieldsJson: JSON.stringify(tpl.fields),
      templateText: tpl.templateText,
      templateTextUrdu: tpl.templateTextUrdu,
      previewText: tpl.previewText ?? null,
    }
    if (existing) {
      await db.docTemplate.update({ where: { id: existing.id }, data })
    } else {
      await db.docTemplate.create({ data })
      templatesInserted++
    }
  }

  console.log('✅ Seed completed successfully!')
  console.log({
    categories: categories.length,
    laws: laws.length,
    lawyers: lawyers.length,
    templates: docTemplates.length,
  })
}

async function seedFinderQuestions() {
  await db.finderQuestion.deleteMany({})
  const questions = [
    {
      question: 'What kind of issue are you facing?',
      questionUrdu: 'آپ کس نوعیت کا مسئلہ درپیش ہے؟',
      orderIndex: 0,
      options: [
        { id: 'a', label: 'Crime committed against me / I am accused', labelUrdu: 'میرے خلاف جرم / مجھ پر الزام', nextIdx: 1 },
        { id: 'b', label: 'Marriage, divorce, custody or maintenance', labelUrdu: 'نکاح، طلاق، حضانت یا نان نفقہ', nextIdx: 2 },
        { id: 'c', label: 'Online fraud, harassment, fake account', labelUrdu: 'آن لائن فراڈ، ہراسانی، جعلی اکاؤنٹ', categoryIds: ['prevention-of-electronic-crimes-act-2016', 'electronic-transactions-ordinance-2002'] },
        { id: 'd', label: 'Workplace or salary dispute', labelUrdu: 'دفتر یا تنخواہ کا تنازعہ', categoryIds: ['industrial-relations-act-2012', 'payment-of-wages-act-1936', 'minimum-wages-ordinance-1961', 'protection-against-harassment-of-women-at-workplace-act-2010'] },
        { id: 'e', label: 'Tax / FBR notice / Filing', labelUrdu: 'ٹیکس / FBR نوٹس / اندراج', categoryIds: ['income-tax-ordinance-2001', 'sales-tax-act-1990', 'federal-excise-act-2005'] },
        { id: 'f', label: 'Property purchase / sale / dispute', labelUrdu: 'جائداد کی خرید و فروخت / تنازعہ', categoryIds: ['transfer-of-property-act-1882', 'registration-act-1908', 'stamp-act-1899', 'land-revenue-act-1967'] },
        { id: 'g', label: 'Contract / agreement dispute', labelUrdu: 'معاہدے کا تنازعہ', categoryIds: ['contract-act-1872', 'specific-relief-act-1877'] },
        { id: 'h', label: 'Women\'s rights violation', labelUrdu: 'خواتین کے حقوق کی خلاف ورزی', categoryIds: ['protection-against-harassment-of-women-at-workplace-act-2010', 'acid-control-and-acid-crime-prevention-act-2011', 'punjab-protection-of-women-against-violence-act-2016'] },
        { id: 'i', label: 'Consumer / defective product complaint', labelUrdu: 'صارف / معیب مصنوعات کی شکایت', categoryIds: ['punjab-consumer-protection-act-2005', 'sindh-consumer-protection-act-2014'] },
        { id: 'j', label: 'Fundamental right / government action', labelUrdu: 'بنیادی حق / حکومتی اقدام', categoryIds: ['constitution-of-pakistan-1973'] },
      ],
    },
    {
      question: 'What happened?',
      questionUrdu: 'کیا ہوا؟',
      orderIndex: 1,
      options: [
        { id: 'a', label: 'Theft / robbery / burglary', labelUrdu: 'چوری / ڈکیتی', categoryIds: ['pakistan-penal-code-1860', 'code-of-criminal-procedure-1898'] },
        { id: 'b', label: 'Murder / attempt to murder / injury', labelUrdu: 'قتل / قتل کی کوشش / زخم', categoryIds: ['pakistan-penal-code-1860', 'qanun-e-shahadat-order-1984'] },
        { id: 'c', label: 'Acid attack / disfigurement', labelUrdu: 'ایسڈ حملہ / چہرے کا بگاڑ', categoryIds: ['acid-control-and-acid-crime-prevention-act-2011', 'pakistan-penal-code-1860'] },
        { id: 'd', label: 'Online harassment / cyber fraud', labelUrdu: 'آن لائن ہراسانی / سائبر فراڈ', categoryIds: ['prevention-of-electronic-crimes-act-2016'] },
        { id: 'e', label: 'Defamation / insult / false accusation', labelUrdu: 'عزت آبری / تذلیل', categoryIds: ['pakistan-penal-code-1860', 'prevention-of-electronic-crimes-act-2016'] },
        { id: 'f', label: 'Drugs / narcotics', labelUrdu: 'منشیات', categoryIds: ['control-of-narcotic-substances-act-1997'] },
        { id: 'g', label: 'Terrorism / extremism', labelUrdu: 'دہشت گردی / انتہا پسندی', categoryIds: ['anti-terrorism-act-1997'] },
      ],
    },
    {
      question: 'What is the family issue?',
      questionUrdu: 'خاندانی مسئلہ کیا ہے؟',
      orderIndex: 2,
      options: [
        { id: 'a', label: 'Marriage registration / Nikahnama issue', labelUrdu: 'نکاح رجسٹری', categoryIds: ['muslim-family-laws-ordinance-1961', 'enforcement-of-muslim-family-laws-rules-1961'] },
        { id: 'b', label: 'Divorce (talaq) by husband', labelUrdu: 'طلاق (شوہر کی طرف سے)', categoryIds: ['muslim-family-laws-ordinance-1961', 'family-courts-act-1964'] },
        { id: 'c', label: 'Khula (wife seeking divorce)', labelUrdu: 'خلع (بیوی طلاق چاہے)', categoryIds: ['family-courts-act-1964', 'dissolution-of-muslim-marriages-act-1939'] },
        { id: 'd', label: 'Child custody / guardianship', labelUrdu: 'بچوں کی حضانت / ولایت', categoryIds: ['guardian-and-wards-act-1890', 'family-courts-act-1964'] },
        { id: 'e', label: 'Maintenance / dower (mahr)', labelUrdu: 'نان نفقہ / مہر', categoryIds: ['muslim-family-laws-ordinance-1961', 'family-courts-act-1964'] },
        { id: 'f', label: 'Child marriage (under-age)', labelUrdu: 'بچوں کی شادی', categoryIds: ['child-marriage-restraint-act-1929'] },
        { id: 'g', label: 'Second marriage / polygamy', labelUrdu: 'دوسری شادی', categoryIds: ['muslim-family-laws-ordinance-1961'] },
      ],
    },
  ]
  for (const q of questions) {
    await db.finderQuestion.create({
      data: {
        question: q.question,
        questionUrdu: q.questionUrdu,
        optionsJson: JSON.stringify(q.options),
        orderIndex: q.orderIndex,
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
