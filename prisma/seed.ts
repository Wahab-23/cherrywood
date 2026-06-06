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
    where: { slug: 'cherrywood-tower' },
    update: {
      title: 'Cherrywood Tower',
      location: 'Plot No. 125 Katrak Road, Depot Lines, Saddar, Karachi, 74200, Pakistan',
      type: 'residential & commercial',
      status: 'ongoing',
      description: 'Modern luxury at the center of the city. Cherrywood Tower is an iconic residential and commercial landmark presenting one of the best architectural designs. A perfect combination of sophistication and convenience, offering double-height ground floor shops for high-end brands and elegantly styled apartments above. With NFPA certified firefighting, standby generators, a rooftop garden, a jogging track, and secure parking, it is the ultimate destination for premium living and smart investment.',
      total_units: 48,
      hero_image: '/cherrywood-tower.png',
    },
    create: {
      title: 'Cherrywood Tower',
      slug: 'cherrywood-tower',
      location: 'Plot No. 125 Katrak Road, Depot Lines, Saddar, Karachi, 74200, Pakistan',
      type: 'residential & commercial',
      status: 'ongoing',
      description: 'Modern luxury at the center of the city. Cherrywood Tower is an iconic residential and commercial landmark presenting one of the best architectural designs. A perfect combination of sophistication and convenience, offering double-height ground floor shops for high-end brands and elegantly styled apartments above. With NFPA certified firefighting, standby generators, a rooftop garden, a jogging track, and secure parking, it is the ultimate destination for premium living and smart investment.',
      total_units: 48,
      hero_image: '/cherrywood-tower.png',
    },
  });

  // 4. Units
  await prisma.unit.createMany({
    data: [
      {
        project_id: project.id,
        unit_number: '101 (Type A)',
        type: '3 Bedrooms, Drawing & Lounge',
        floor: '1st Floor',
        size_sqft: 1152,
        price: 15500000,
        status: 'available',
      },
      {
        project_id: project.id,
        unit_number: '102 (Type A)',
        type: '3 Bedrooms, Drawing & Lounge',
        floor: '1st Floor',
        size_sqft: 1056,
        price: 14200000,
        status: 'available',
      },
      {
        project_id: project.id,
        unit_number: '201 (Type B)',
        type: '2 Bedrooms, Drawing & Lounge',
        floor: '2nd Floor',
        size_sqft: 950,
        price: 11500000,
        status: 'booked',
        owner_id: buyer.id,
      },
      {
        project_id: project.id,
        unit_number: '202 (Type B)',
        type: '2 Bedrooms, Drawing & Lounge',
        floor: '2nd Floor',
        size_sqft: 950,
        price: 11500000,
        status: 'available',
      },
      {
        project_id: project.id,
        unit_number: '301 (Type C)',
        type: '2 Bedrooms & Lounge',
        floor: '3rd Floor',
        size_sqft: 1016,
        price: 9200000,
        status: 'available',
      },
      {
        project_id: project.id,
        unit_number: '302 (Type C)',
        type: '2 Bedrooms & Lounge',
        floor: '3rd Floor',
        size_sqft: 916,
        price: 8500000,
        status: 'available',
      },
      {
        project_id: project.id,
        unit_number: 'G-01 (Shop)',
        type: 'Double Height Retail Shop',
        floor: 'Ground Floor',
        size_sqft: 450,
        price: 25000000,
        status: 'available',
      },
      {
        project_id: project.id,
        unit_number: 'G-02 (Shop)',
        type: 'Double Height Retail Shop',
        floor: 'Ground Floor',
        size_sqft: 600,
        price: 32000000,
        status: 'available',
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

  // 9. Pages — system (compulsory) pages are always seeded via upsert.
  // These cannot be deleted or re-created; admins may only edit them.
  const pages = [
    // ── Compulsory system pages ──────────────────────────────────────────
    {
      title: 'Homepage',
      slug: 'home',
      template: 'home',
      content: getInitialTemplateContent('home'),
      status: 'published',
    },
    {
      title: 'Contact Us',
      slug: 'contact',
      template: 'contact',
      content: getInitialTemplateContent('contact'),
      status: 'published',
    },
    {
      title: 'Careers at Cherrywood',
      slug: 'careers',
      template: 'careers',
      content: getInitialTemplateContent('careers'),
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
    },
    // ── Non-compulsory pages ─────────────────────────────────────────────
    {
      title: 'About Cherrywood',
      slug: 'about',
      template: 'default',
      content: JSON.stringify([{ type: 'paragraph', content: 'We build the future of living.' }]),
      status: 'published',
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {}, // Never overwrite existing admin edits
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
