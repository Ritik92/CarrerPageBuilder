import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import JobDetailClient from './JobDetailClient';

async function getJobData(companySlug: string, jobId: string) {
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      company: { slug: companySlug, published: true },
      status: 'open',
    },
    include: { company: true },
  });

  return job;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; jobSlug: string }> }) {
  const { slug, jobSlug } = await params;
  const job = await getJobData(slug, jobSlug);

  if (!job) return { title: 'Job Not Found' };

  return {
    title: `${job.title} at ${job.company.name}`,
    description: job.description.substring(0, 160),
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string; jobSlug: string }> }) {
  const { slug, jobSlug } = await params;
  const job = await getJobData(slug, jobSlug);

  if (!job) notFound();

  return <JobDetailClient job={job} />;
}