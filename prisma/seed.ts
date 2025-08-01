import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Check if superuser already exists
  const existingSuperuser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'admin@example.com' },
        { username: 'admin' }
      ]
    }
  });

  if (existingSuperuser) {
    console.log('✅ Superuser already exists, skipping creation');
    return;
  }

  // Create superuser
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const superuser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      is_superuser: true,
      is_active: true
    }
  });

  console.log('✅ Superuser created successfully:', {
    id: superuser.id,
    username: superuser.username,
    email: superuser.email
  });

  // Create some sample projects
  const sampleProjects = [
    {
      name: 'Sample Project 1',
      description: 'This is a sample project for testing purposes',
      status: 'active' as const,
      budget: 10000.00,
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-12-31'),
      owner_id: superuser.id,
      is_active: true
    },
    {
      name: 'Sample Project 2',
      description: 'Another sample project for demonstration',
      status: 'completed' as const,
      budget: 5000.00,
      start_date: new Date('2024-02-01'),
      end_date: new Date('2024-06-30'),
      owner_id: superuser.id,
      is_active: true
    }
  ];

  for (const projectData of sampleProjects) {
    const project = await prisma.project.create({
      data: projectData
    });
    console.log('✅ Sample project created:', project.name);
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Default credentials:');
  console.log('   Email: admin@example.com');
  console.log('   Password: admin123');
  console.log('\n⚠️  Remember to change these credentials in production!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 