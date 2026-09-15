import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/lawyers — create lawyer (admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, nameUrdu, slug, bio, bioUrdu, specialization, city, cityUrdu,
      province, licenseNumber, experienceYears, education, educationUrdu,
      email, phone, website, address, addressUrdu, languages,
      verified, featured, acceptingCases, imageColor,
    } = body

    if (!name || !slug || !city || !province) {
      return NextResponse.json({ ok: false, error: 'Missing required fields: name, slug, city, province' }, { status: 400 })
    }

    const lawyer = await db.lawyer.create({
      data: {
        name,
        nameUrdu: nameUrdu ?? null,
        slug,
        bio: bio ?? null,
        bioUrdu: bioUrdu ?? null,
        specialization: JSON.stringify(specialization ?? []),
        city,
        cityUrdu: cityUrdu ?? null,
        province,
        licenseNumber: licenseNumber ?? null,
        experienceYears: experienceYears ? parseInt(experienceYears) : null,
        education: education ?? null,
        educationUrdu: educationUrdu ?? null,
        email: email ?? null,
        phone: phone ?? null,
        website: website ?? null,
        address: address ?? null,
        addressUrdu: addressUrdu ?? null,
        languages: JSON.stringify(languages ?? []),
        verified: verified ?? false,
        featured: featured ?? false,
        acceptingCases: acceptingCases ?? true,
        imageColor: imageColor ?? null,
      },
    })
    return NextResponse.json({ ok: true, lawyer })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
