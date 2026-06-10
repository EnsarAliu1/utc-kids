const { PrismaClient } = require("./../generated/prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DIRECT_URL && !process.env.DATABASE_URL) {
  console.error("Gabim: DATABASE_URL ose DIRECT_URL mungon në .env");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database via PrismaPg adapter...");

  // 1. Course
  await prisma.course.upsert({
    where: { id: "course_blockly_1" },
    update: {},
    create: {
      id: "course_blockly_1",
      title: "Blockly për Kids",
      description: "Mëso programimin duke ndërtuar faqe me blloqe yjesh",
      level: "KIDS_6_9",
    },
  });

  // 2. Module 1
  await prisma.module.upsert({
    where: { id: "module_blockly_1" },
    update: {},
    create: {
      id: "module_blockly_1",
      courseId: "course_blockly_1",
      title: "🪐 Fillimet Kozmike",
      order: 1,
    },
  });

  // 3. Lessons Mod 1
  await prisma.lesson.upsert({
    where: { id: "lesson_b1" },
    update: {},
    create: {
      id: "lesson_b1",
      moduleId: "module_blockly_1",
      title: "🛰️ Sekuenca e Parë",
      content: "Hyrje në HTML dhe blloqe",
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: "lesson_b2" },
    update: {},
    create: {
      id: "lesson_b2",
      moduleId: "module_blockly_1",
      title: "🚀 Portali i Lansimit",
      content: "Butonat dhe portalet e teleportimit",
      order: 2,
    },
  });

  // 4. Challenges Mod 1
  await prisma.challenge.upsert({
    where: { id: "sfida_html_1" },
    update: {
      lessonId: "lesson_b1",
      instructions: "Krijo një faqe që përmban një titull kryesor me tekstin saktësisht 'Përshëndetje Botë!' brenda bllokut Trup të faqes.",
      solutionCode: "<h1>Përshëndetje Botë!</h1>",
      xpReward: 30,
    },
    create: {
      id: "sfida_html_1",
      lessonId: "lesson_b1",
      instructions: "Krijo një faqe që përmban një titull kryesor me tekstin saktësisht 'Përshëndetje Botë!' brenda bllokut Trup të faqes.",
      solutionCode: "<h1>Përshëndetje Botë!</h1>",
      xpReward: 30,
    },
  });

  await prisma.challenge.upsert({
    where: { id: "sfida_html_2" },
    update: {
      lessonId: "lesson_b1",
      instructions: "Ndërto artikull me titull <h1>, paragraf <p> me tekstin 'Unë po mësoj kodim!' dhe një bllok Foto-Galaktike.",
      solutionCode: "<img>",
      xpReward: 40,
    },
    create: {
      id: "sfida_html_2",
      lessonId: "lesson_b1",
      instructions: "Ndërto artikull me titull <h1>, paragraf <p> me tekstin 'Unë po mësoj kodim!' dhe një bllok Foto-Galaktike.",
      solutionCode: "<img>",
      xpReward: 40,
    },
  });

  await prisma.challenge.upsert({
    where: { id: "sfida_html_3" },
    update: {
      lessonId: "lesson_b2",
      instructions: "Krijo buton të gjelbër me tekstin 'Kliko Këtu' dhe link <a> me tekstin 'UTC Kids' që çon te 'https://utckids.com'.",
      solutionCode: "<a>",
      xpReward: 50,
    },
    create: {
      id: "sfida_html_3",
      lessonId: "lesson_b2",
      instructions: "Krijo buton të gjelbër me tekstin 'Kliko Këtu' dhe link <a> me tekstin 'UTC Kids' që çon te 'https://utckids.com'.",
      solutionCode: "<a>",
      xpReward: 50,
    },
  });

  await prisma.challenge.upsert({
    where: { id: "sfida_html_4" },
    update: {
      lessonId: "lesson_b2",
      instructions: "Krijo një listë me dy elemente që përmbajnë tekstet 'Udhëto në Mars' dhe 'Fluturo në Hënë'.",
      solutionCode: "<ul>",
      xpReward: 60,
    },
    create: {
      id: "sfida_html_4",
      lessonId: "lesson_b2",
      instructions: "Krijo një listë me dy elemente që përmbajnë tekstet 'Udhëto në Mars' dhe 'Fluturo në Hënë'.",
      solutionCode: "<ul>",
      xpReward: 60,
    },
  });

  // 5. Module 2
  await prisma.module.upsert({
    where: { id: "module_blockly_2" },
    update: {},
    create: {
      id: "module_blockly_2",
      courseId: "course_blockly_1",
      title: "🌟 Galaktika e Stilimit",
      order: 2,
    },
  });

  // 6. Lessons Mod 2
  await prisma.lesson.upsert({
    where: { id: "lesson_b3" },
    update: {},
    create: {
      id: "lesson_b3",
      moduleId: "module_blockly_2",
      title: "🛸 Udhëtimi me Butona",
      content: "Stilimi i butonave dhe ngjyrave",
      order: 1,
    },
  });

  await prisma.lesson.upsert({
    where: { id: "lesson_b4" },
    update: {},
    create: {
      id: "lesson_b4",
      moduleId: "module_blockly_2",
      title: "🌌 Faqja Kozmike",
      content: "Ndërtimi i faqeve më të avancuara",
      order: 2,
    },
  });

  // 7. Challenges Mod 2
  await prisma.challenge.upsert({
    where: { id: "sfida_html_5" },
    update: {
      lessonId: "lesson_b3",
      instructions: "Krijo një Buton Lansimi të kaltër (klasa/ngjyra 'Kaltër 🔵') me tekstin 'Hap Portalin'.",
      solutionCode: "background-color: #3B82F6;",
      xpReward: 50,
    },
    create: {
      id: "sfida_html_5",
      lessonId: "lesson_b3",
      instructions: "Krijo një Buton Lansimi të kaltër (klasa/ngjyra 'Kaltër 🔵') me tekstin 'Hap Portalin'.",
      solutionCode: "background-color: #3B82F6;",
      xpReward: 50,
    },
  });

  await prisma.challenge.upsert({
    where: { id: "sfida_html_6" },
    update: {
      lessonId: "lesson_b3",
      instructions: "Ndërto një Buton Lansimi të kuq (klasa/ngjyra 'Kuqe 🔴') me tekstin 'Ndal Fluturimin'.",
      solutionCode: "background-color: #EF4444;",
      xpReward: 55,
    },
    create: {
      id: "sfida_html_6",
      lessonId: "lesson_b3",
      instructions: "Ndërto një Buton Lansimi të kuq (klasa/ngjyra 'Kuqe 🔴') me tekstin 'Ndal Fluturimin'.",
      solutionCode: "background-color: #EF4444;",
      xpReward: 55,
    },
  });

  await prisma.challenge.upsert({
    where: { id: "sfida_html_7" },
    update: {
      lessonId: "lesson_b4",
      instructions: "Ndërto një galaktikë me foto! Shto të paktën dy blloke të ndryshme të Foto-Galaktikës (img) brenda trupit të faqes.",
      solutionCode: "img",
      xpReward: 70,
    },
    create: {
      id: "sfida_html_7",
      lessonId: "lesson_b4",
      instructions: "Ndërto një galaktikë me foto! Shto të paktën dy blloke të ndryshme të Foto-Galaktikës (img) brenda trupit të faqes.",
      solutionCode: "img",
      xpReward: 70,
    },
  });

  await prisma.challenge.upsert({
    where: { id: "sfida_html_8" },
    update: {
      lessonId: "lesson_b4",
      instructions: "Krijo një menu teleportimi të avancuar! Ndërto një listë (<ul>) ku secili element listë (<li>) të përmbajë brenda tij një Portal Teleportimi (<a>). Shto të paktën dy të tillë.",
      solutionCode: "href",
      xpReward: 80,
    },
    create: {
      id: "sfida_html_8",
      lessonId: "lesson_b4",
      instructions: "Krijo një menu teleportimi të avancuar! Ndërto një listë (<ul>) ku secili element listë (<li>) të përmbajë brenda tij një Portal Teleportimi (<a>). Shto të paktën dy të tillë.",
      solutionCode: "href",
      xpReward: 80,
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
