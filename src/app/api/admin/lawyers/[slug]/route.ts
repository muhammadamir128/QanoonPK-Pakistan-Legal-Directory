import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/admin/lawyers/[slug] — update lawyer
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const body = await req.json()
  const lawyer = await db.lawyer.findUnique({ where: { slug } })
  if (!lawyer) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })

  const {
    name, nameUrdu, bio, bioUrdu, specialization, city, cityUrdu, province,
    licenseNumber, experienceYears, education, educationUrdu,
    email, phone, website, address, addressUrdu, languages,
    verified, featured, acceptingCases, imageColor,
  } = body

  const updated = await db.lawyer.update({
    where: { id: lawyer.id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(nameUrdu !== undefined ? { nameUrdu } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(bioUrdu !== undefined ? { bioUrdu } : {}),
      ...(specialization !== undefined ? { specialization: JSON.stringify(specialization) } : {}),
      ...(city !== undefined ? { city } : {}),
      ...(cityUrdu !== undefined ? { cityUrdu } : {}),
      ...(province !== undefined ? { province } : {}),
      ...(licenseNumber !== undefined ? { licenseNumber } : {}),
      ...(experienceYears !== undefined ? { experienceYears: parseInt(experienceYears) } : {}),
      ...(education !== undefined ? { education } : {}),
      ...(educationUrdu !== undefined ? { educationUrdu } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(website !== undefined ? { website } : {}),
      ...(address !== undefined ? { address } : {}),
      ...(addressUrdu !== undefined ? { addressUrdu } : {}),
      ...(languages !== undefined ? { languages: JSON.stringify(languages) } : {}),
      ...(verified !== undefined ? { verified } : {}),
      ...(featured !== undefined ? { featured } : {}),
      ...(acceptingCases !== undefined ? { acceptingCases } : {}),
      ...(imageColor !== undefined ? { imageColor } : {}),
    },
  })
  return NextResponse.json({ ok: true, lawyer: updated })
}

// DELETE /api/admin/lawyers/[slug] — delete lawyer
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const lawyer = await db.lawyer.findUnique({ where: { slug } })
  if (!lawyer) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  await db.lawyer.delete({ where: { id: lawyer.id } })
  return NextResponse.json({ ok: true })
}
