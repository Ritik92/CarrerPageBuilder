// // prisma/seed.ts
// import { PrismaClient } from '@prisma/client';
// import { parse } from 'csv-parse/sync';
// import * as fs from 'fs';
// import * as path from 'path';
// import bcrypt from 'bcryptjs';

// const prisma = new PrismaClient();

// // Parse salary string
// function parseSalary(salaryRange: string) {
//   const match = salaryRange.match(/([A-Z]+)\s+([\d.]+)([KL])?\s*[–-]\s*([\d.]+)([KL])?\s*\/\s*(month|year)/i);
  
//   if (!match) return { min: null, max: null, currency: 'USD', period: 'year' };

//   const currency = match[1];
//   let min = parseFloat(match[2]);
//   let max = parseFloat(match[4]);
//   const period = match[6].toLowerCase();

//   // Convert K/L to actual numbers
//   if (match[3] === 'K') min *= 1000;
//   if (match[3] === 'L') min *= 100000;
//   if (match[5] === 'K') max *= 1000;
//   if (match[5] === 'L') max *= 100000;

//   return {
//     min: Math.round(min),
//     max: Math.round(max),
//     currency,
//     period,
//   };
// }

// async function main() {
//   console.log('🧹 Cleaning up existing data...');
//   await prisma.job.deleteMany({});
//   await prisma.contentSection.deleteMany({});
//   await prisma.company.deleteMany({});
//   await prisma.user.deleteMany({});

//   console.log('👤 Creating test user...');
//   const hashedPassword = await bcrypt.hash('zomato321', 10);
  
//   const user = await prisma.user.create({
//     data: {
//       email: 'zomato@gmail.com',
//       password: hashedPassword,
//       name: 'Raj',
//     },
//   });

//   console.log(`✅ User created: ${user.email}`);

//   console.log('🏢 Creating test company...');
//   const company = await prisma.company.create({
//     data: {
//       userId: user.id,
//       name: 'Zomato',
//       slug: 'zomato',
//       description: 'A leading technology company with offices worldwide.',
//       primaryColor: '#E23744',
//       published: true,
//     },
//   });

//   console.log(`✅ Company created: ${company.name} (${company.slug})`);

//   // Read CSV file
//   const csvPath = path.join(process.cwd(), 'samplejobsdata.csv');
//   const fileContent = fs.readFileSync(csvPath, 'utf-8');
  
//   const records = parse(fileContent, {
//     columns: true,
//     skip_empty_lines: true,
//   });

//   console.log(`📄 Found ${records.length} jobs in CSV`);

//   console.log('💾 Seeding jobs...');
  
//   for (const record of records) {
//     const salary = parseSalary(record.salary_range);
    
//     await prisma.job.create({
//       data: {
//         companyId: company.id,
//         title: record.title,
//         description: `Job description for ${record.title}`,
//         location: record.location,
//         workPolicy: record.work_policy,
//         jobType: record.employment_type,
//         contractType: record.job_type,
//         department: record.department,
//         experienceLevel: record.experience_level,
//         salaryMin: salary.min,
//         salaryMax: salary.max,
//         salaryCurrency: salary.currency,
//         salaryPeriod: salary.period,
//         status: 'open',
//       },
//     });
//   }

//   console.log(`✅ Seeded ${records.length} jobs successfully!`);
//   console.log(`\n🔗 User Email: ${user.email}`);
//   console.log(`🔑 Password: password`);
//   console.log(`🔗 Company ID: ${company.id}`);
//   console.log(`🔗 Careers URL: /${company.slug}/careers`);
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seed failed:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });