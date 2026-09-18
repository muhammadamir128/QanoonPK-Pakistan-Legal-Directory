const path = require('path');
const fs = require('fs');
process.env.DATABASE_URL = 'file:' + path.resolve('db/custom.db').replace(/\\/g, '/');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const laws = await prisma.law.findMany({ select: { slug: true, title: true, categoryId: true } });
  console.log('Total laws:', laws.length);
  const lawyers = await prisma.lawyer.findMany({ select: { slug: true, name: true } });
  console.log('Total lawyers:', lawyers.length);
  const templates = await prisma.docTemplate.findMany({ select: { slug: true, title: true } });
  console.log('Total templates:', templates.length);
  fs.writeFileSync('scratch/existing-data.json', JSON.stringify({
    lawSlugs: laws.map(l => l.slug),
    lawyerSlugs: lawyers.map(l => l.slug),
    templateSlugs: templates.map(t => t.slug)
  }, null, 2));
  console.log('Saved to scratch/existing-data.json');
}

main().catch(console.error).finally(() => prisma.$disconnect());
