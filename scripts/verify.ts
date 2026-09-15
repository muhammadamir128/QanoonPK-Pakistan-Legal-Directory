import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  const categories = await prisma.category.count()
  const laws = await prisma.law.count()
  const sections = await prisma.section.count()
  const amendments = await prisma.amendment.count()
  const lawyers = await prisma.lawyer.count()
  const templates = await prisma.docTemplate.count()
  const questions = await prisma.finderQuestion.count()
  const sampleLaw = await prisma.law.findFirst({
    include: {
      category: true,
      sections: { take: 2 },
      amendments: true,
      tags: { include: { tag: true } },
    },
  })

  console.log('=== Neon DB Verification ===')
  console.log({
    categories,
    laws,
    sections,
    amendments,
    lawyers,
    templates,
    questions,
  })
  console.log('\nSample Law:', {
    title: sampleLaw?.title,
    category: sampleLaw?.category?.name,
    sectionsCount: sampleLaw?.sections?.length,
    tags: sampleLaw?.tags?.map((t) => t.tag.name),
  })

  await prisma.$disconnect()
}

verify().catch(console.error)
