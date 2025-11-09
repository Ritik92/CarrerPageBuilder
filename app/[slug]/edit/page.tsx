import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditPageClient from './EditPageClient';

async function getCompanyData(slug: string) {
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      jobs: { orderBy: { createdAt: 'desc' } },
      contentSections: { orderBy: { order: 'asc' } },
    },
  });

  return company;
}

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompanyData(slug);
  console.log(company)
  if (!company) notFound();

  return <EditPageClient company={company} />;
}