import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import { getInitialTemplateContent } from '../lib/pageConstants';

async function main() {
  console.log('Seeding database...');

  // 1. Roles
  const roles = [
    { 
        name: 'admin',
        access: {
            users: true,
            blogs: true,
            projects: true,
            pages: true,
            units: true,
            tags: true
        }
    },
    { 
        name: 'editor',
        access: {
            blogs: ["read", "update", "delete"],
            projects: ["read", "update"],
            pages: ["read", "update"],
            tags: ["read", "update"]
        }
    },
    { 
        name: 'author',
        access: {
            blogs: ["create", "read", "update"],
            tags: ["read"]
        }
    },
    { 
        name: 'buyer',
        access: {
            blogs: ["read"],
            units: ["read"]
        }
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { access: role.access },
      create: role,
    });
  }

  const allRoles = await prisma.role.findMany();
  const adminRole = allRoles.find((r) => r.name === 'admin')!;
  const editorRole = allRoles.find((r) => r.name === 'editor')!;
  const authorRole = allRoles.find((r) => r.name === 'author')!;
  const buyerRole = allRoles.find((r) => r.name === 'buyer')!;

  // 2. Users
  const password = await bcrypt.hash('password123', 10);
  const users = [
    {
      name: 'Admin User',
      email: 'admin@cherrywood.com',
      password,
      role_id: adminRole.id,
      is_verified: true,
      status: 'active',
    },
    {
      name: 'Editor User',
      email: 'editor@cherrywood.com',
      password,
      role_id: editorRole.id,
      is_verified: true,
      status: 'active',
    },
    {
      name: 'Author User',
      email: 'author@cherrywood.com',
      password,
      role_id: authorRole.id,
      is_verified: true,
      status: 'active',
    },
    {
      name: 'Buyer User',
      email: 'buyer@cherrywood.com',
      password,
      role_id: buyerRole.id,
      is_verified: false,
      status: 'active',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  const admin = await prisma.user.findUnique({ where: { email: 'admin@cherrywood.com' } });
  const author = await prisma.user.findUnique({ where: { email: 'author@cherrywood.com' } });
  const buyer = await prisma.user.findUnique({ where: { email: 'buyer@cherrywood.com' } });

  if (!admin || !author || !buyer) {
    throw new Error('Required users not found after creation');
  }

  // 3. Projects
  const project = await prisma.project.upsert({
    where: { slug: 'cherrywood-residency' },
    update: {},
    create: {
      title: 'Cherrywood Residency',
      slug: 'cherrywood-residency',
      location: 'Downtown City',
      type: 'residential',
      status: 'ongoing',
      description: 'Luxury apartments in the heart of the city.',
      total_units: 50,
    },
  });

  // 4. Units
  await prisma.unit.createMany({
    data: [
      {
        project_id: project.id,
        unit_number: '101',
        type: 'apartment',
        floor: '1st',
        size_sqft: 1200,
        price: 250000,
        status: 'available',
      },
      {
        project_id: project.id,
        unit_number: '202',
        type: 'apartment',
        floor: '2nd',
        size_sqft: 1500,
        price: 350000,
        status: 'booked',
        owner_id: buyer.id,
      },
    ],
    skipDuplicates: true,
  });

  // 5. Blog Categories
  const category = await prisma.blogCategory.upsert({
    where: { slug: 'real-estate-trends' },
    update: {},
    create: {
      name: 'Real Estate Trends',
      slug: 'real-estate-trends',
    },
  });

  // 6. Tags
  const tag = await prisma.tag.upsert({
    where: { slug: 'investment' },
    update: {},
    create: {
      name: 'Investment',
      slug: 'investment',
    },
  });

  // 7. Blogs
  const blog = await prisma.blog.upsert({
    where: { slug: 'investing-in-2026' },
    update: {},
    create: {
      title: 'Investing in Real Estate in 2026',
      slug: 'investing-in-2026',
      short_description: 'Why real estate is still the best investment.',
      content: 'Detailed blog content about real estate trends...',
      status: 'published',
      author_id: author.id,
      category_id: category.id,
    },
  });

  // 8. BlogTags
  await prisma.blogTag.upsert({
    where: { blog_id_tag_id: { blog_id: blog.id, tag_id: tag.id } },
    update: {},
    create: {
      blog_id: blog.id,
      tag_id: tag.id,
    },
  });

  // 9. Pages
  const pages = [
    {
      title: 'About Cherrywood',
      slug: 'about',
      template: 'default',
      content: JSON.stringify([{ type: 'paragraph', content: 'We build the future of living.' }]),
      status: 'published',
    },
    {
      title: 'Contact Directory',
      slug: 'contact',
      template: 'contact',
      content: getInitialTemplateContent('contact'),
      status: 'published',
    },
    {
      title: 'Terms & Conditions',
      slug: 'terms',
      template: 'policy',
      content: getInitialTemplateContent('policy'),
      status: 'published',
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy',
      template: 'policy',
      content: getInitialTemplateContent('policy'),
      status: 'published',
    },
    {
      title: 'The Journal',
      slug: 'journal',
      template: 'journal',
      content: getInitialTemplateContent('journal'),
      status: 'published',
    }
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
