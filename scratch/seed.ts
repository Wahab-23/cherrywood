import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding database...");

  // 1. Create Roles
  const roles = ["admin", "editor", "author", "buyer"];
  const createdRoles = [];
  for (const name of roles) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdRoles.push(role);
    console.log(`Role ${name} ensured.`);
  }

  const adminRole = createdRoles.find(r => r.name === "admin")!;

  // 2. Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: "password123", // In a real app, hash this!
      role_id: adminRole.id,
      status: "active",
    },
  });
  console.log(`Admin user created: ${adminUser.email}`);

  // 3. Create Blog Category
  const category = await prisma.blogCategory.upsert({
    where: { slug: "real-estate-trends" },
    update: {},
    create: {
      name: "Real Estate Trends",
      slug: "real-estate-trends",
    },
  });
  console.log(`Blog category created: ${category.name}`);

  // 4. Create dummy Project
  const project = await prisma.project.upsert({
    where: { slug: "luxury-heights-v1" },
    update: {},
    create: {
      title: "Luxury Heights",
      slug: "luxury-heights-v1",
      location: "Downtown, Metro City",
      type: "residential",
      status: "ongoing",
      total_units: 50,
      description: "A premium residential project with modern amenities.",
    },
  });
  console.log(`Project created: ${project.title}`);

  // 5. Create dummy Blog
  const blog = await prisma.blog.upsert({
    where: { slug: "welcome-to-cherrywood" },
    update: {},
    create: {
      title: "Welcome to Cherrywood",
      slug: "welcome-to-cherrywood",
      short_description: "Discover the best real estate opportunities.",
      content: "Cherrywood is your one-stop solution for finding premium properties...",
      status: "published",
      author_id: adminUser.id,
      category_id: category.id,
    },
  });
  console.log(`Blog created: ${blog.title}`);

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Note: We don't call prisma.$disconnect() here because our lib/prisma.ts might be shared 
    // and we want to let the process exit naturally or handle it there.
  });
