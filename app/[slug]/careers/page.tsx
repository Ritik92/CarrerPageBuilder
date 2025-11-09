import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CareersPageClient from './CareersPageClient';


async function getCompanyData(slug: string) {
  const company = await prisma.company.findUnique({
    where: { slug, published: true },
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompanyData(slug);

  if (!company) return { title: 'Company Not Found' };

  return {
    title: company.metaTitle || `Careers at ${company.name}`,
    description: company.metaDescription || company.description,
  };
}

export default async function CareersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompanyData(slug);

  if (!company) notFound();

  return <CareersPageClient company={company} />;
}