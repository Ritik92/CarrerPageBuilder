import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PreviewPageClient from './PreviewPageClient';

async function getCompanyData(slug: string) {
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      jobs: {
        where: { status: 'open' },
        orderBy: { createdAt: 'desc' },
      },
      contentSections: {
        where: { visible: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  return company;
}

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompanyData(slug);

  if (!company) notFound();

  return <PreviewPageClient company={company} />;
}