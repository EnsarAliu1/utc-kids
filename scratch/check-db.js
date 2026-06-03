// check-db.js
const { PrismaClient } = require('../generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Duke kontrolluar databazën...");
  const students = await prisma.studentProfile.findMany({
    include: {
      submissions: true,
      achievements: true,
    }
  });
  console.log("Studentët në DB:", JSON.stringify(students, null, 2));

  const challenges = await prisma.challenge.findMany();
  console.log("Sfidat (Challenges) në DB:", challenges);

  const courses = await prisma.course.findMany();
  console.log("Kurset (Courses) në DB:", courses);

  const submissions = await prisma.submission.findMany();
  console.log("Submissions në DB:", submissions);

  pool.end();
}

main().catch(err => {
  console.error(err);
  pool.end();
});
