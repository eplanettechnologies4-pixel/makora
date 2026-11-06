import { PrismaClient, UserRoleType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Makaura Beauty Marketplace Seed...');

  // 1. Seed Roles
  const roles = [
    {
      name: 'CUSTOMER',
      description: 'Marketplace retail customer',
      isSystem: true,
    },
    {
      name: 'BRAND_OWNER',
      description: 'Beauty brand owner and primary seller',
      isSystem: true,
    },
    {
      name: 'BRAND_STAFF',
      description: 'Brand store manager or fulfillment operator',
      isSystem: true,
    },
    {
      name: 'ADMIN',
      description: 'Marketplace administrator with operational access',
      isSystem: true,
    },
    {
      name: 'SUPER_ADMIN',
      description: 'Platform super administrator with root privileges',
      isSystem: true,
    },
  ];

  const seededRoles: Record<string, string> = {};

  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: { description: roleData.description },
      create: roleData,
    });
    seededRoles[role.name] = role.id;
    console.log(`   ✓ Role seeded: ${role.name}`);
  }

  // 2. Seed Permissions
  const permissions = [
    { name: 'brands:view', module: 'brands', description: 'View brand catalogs' },
    { name: 'brands:apply', module: 'brands', description: 'Submit brand application' },
    { name: 'brands:manage', module: 'brands', description: 'Manage own brand profile' },
    { name: 'brands:approve', module: 'brands', description: 'Approve or reject brand applications' },
    { name: 'applications:review', module: 'admin', description: 'Review onboarding applications' },
    { name: 'users:manage', module: 'admin', description: 'Manage marketplace user accounts' },
    { name: 'settlements:manage', module: 'settlements', description: 'Manage COD settlements' },
  ];

  for (const permData of permissions) {
    const perm = await prisma.permission.upsert({
      where: { name: permData.name },
      update: { description: permData.description },
      create: permData,
    });
    console.log(`   ✓ Permission seeded: ${perm.name}`);

    // Assign admin permissions to ADMIN role
    if (seededRoles['ADMIN']) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: seededRoles['ADMIN'],
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: seededRoles['ADMIN'],
          permissionId: perm.id,
        },
      });
    }
  }

  // 3. Seed Initial Administrator Account from Environment Variables
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@makaura.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'MakauraAdmin2026!Secure';
  const adminFirstName = process.env.ADMIN_INITIAL_FIRST_NAME || 'Makaura';
  const adminLastName = process.env.ADMIN_INITIAL_LAST_NAME || 'SuperAdmin';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail.toLowerCase().trim() },
  });

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  let adminUser;
  if (!existingAdmin) {
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail.toLowerCase().trim(),
        passwordHash,
        firstName: adminFirstName,
        lastName: adminLastName,
        role: UserRoleType.ADMIN,
        isActive: true,
        emailVerified: true,
      },
    });
    console.log(`   ✓ Initial Administrator account created: ${adminEmail}`);
  } else {
    adminUser = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        passwordHash,
        role: UserRoleType.ADMIN,
        isActive: true,
        emailVerified: true,
      },
    });
    console.log(`   ✓ Initial Administrator account verified/updated: ${adminEmail}`);
  }

  // Link admin to ADMIN role in user_roles
  if (seededRoles['ADMIN']) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: seededRoles['ADMIN'],
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: seededRoles['ADMIN'],
      },
    });
    console.log(`   ✓ Linked Administrator to ADMIN role`);
  }

  console.log('✅ Makaura Database Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error executing database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
