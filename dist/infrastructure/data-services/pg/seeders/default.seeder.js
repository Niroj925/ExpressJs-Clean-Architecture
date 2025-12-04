"use strict";
// import { Repository } from 'typeorm';
// import { Injectable, Logger } from '@nestjs/common';
// import superAdminJson from '../../../../db-backups/super-admin-config.json';
// import { RoleEntity } from '../entities/role.entity';
// import { UserEntity } from '../entities/user.entity';
// import * as bcrypt from 'bcryptjs';
// import { UserRoleEntity } from '../entities/user-role.entity';
// import roleJson from '../../../../db-backups/role.config.json';
// import officeTypeJson from '../../../../db-backups/office-type.config.json';
// import { OfficeEntity } from '../entities/office.entity';
// import headOfficeJson from '../../../../db-backups/head-office-config.json';
// import { OfficeTypeEnum } from 'src/common/enums/office.enum';
// import { OfficeTypeEntity } from '../entities/office-type.entity';
// import { StaffDepartmentEnum } from 'src/common/enums/staff-profile.enum';
// import { StaffProfileEntity } from '../entities/staff-profile.entity';
// @Injectable()
// export class DefaultSeeder {
//   constructor() {}
//   private async hashPassword(password: string): Promise<string> {
//     return bcrypt.hash(password, 12);
//   }
//   private logIfExists(entity: string, name: string) {
//     Logger.log(`${entity} "${name}" already exists`, DefaultSeeder.name);
//   }
//   private logIfCreated(entity: string, name: string) {
//     Logger.log(`${entity} "${name}" created successfully`, DefaultSeeder.name);
//   }
//   async seedHeadOffice(
//     officeRepository: Repository<OfficeEntity>,
//   ): Promise<void> {
//     const existingOffice = await officeRepository.findOne({
//       where: { officeType: OfficeTypeEnum.HEAD_OFFICE },
//     });
//     if (existingOffice) {
//       this.logIfExists('Office of Head Office type', existingOffice.officeName);
//       return;
//     }
//     const newOffice = officeRepository.create({
//       officeName: headOfficeJson.officeName,
//       officeContact: headOfficeJson.officeContact,
//       officeType: OfficeTypeEnum.HEAD_OFFICE,
//     });
//     await officeRepository.save(newOffice);
//     this.logIfCreated('Head Office', headOfficeJson.officeName);
//   }
//   async seedSuperAdmin(
//     roleRepository: Repository<RoleEntity>,
//     userRepository: Repository<UserEntity>,
//     userRoleRepository: Repository<UserRoleEntity>,
//     officeRepository: Repository<OfficeEntity>,
//     staffProfileRepository: Repository<StaffProfileEntity>,
//   ): Promise<void> {
//     const [existingUser, superAdminRole, headOffice] = await Promise.all([
//       userRepository.findOne({ where: { email: superAdminJson.email } }),
//       roleRepository.findOne({
//         where: { systemName: 'SuperAdmin' },
//       }),
//       await officeRepository.findOne({
//         where: { officeType: OfficeTypeEnum.HEAD_OFFICE },
//       }),
//     ]);
//     if (!superAdminRole) {
//       return Logger.error(
//         'Super Admin role not found. Cannot assign role.',
//         DefaultSeeder.name,
//       );
//     }
//     if (existingUser) {
//       if (
//         existingUser.createdBy === null ||
//         existingUser.createdBy === undefined
//       ) {
//         await userRepository.update(existingUser.id, {
//           createdBy: existingUser.id,
//         }); // Set createdBy to the user itself if it's null})
//         Logger.log(
//           'createdBy is null for existing Super Admin, setting it to the new existing Super Admin itself',
//         );
//       } else {
//         Logger.log(
//           'createdBy is not null for existing Super Admin, keeping the existing value',
//           DefaultSeeder.name,
//         );
//       }
//       const staffProfile = await staffProfileRepository.findOne({
//         where: { user: { email: superAdminJson.email } },
//       });
//       if (staffProfile) {
//         return this.logIfExists('Staff Profile', superAdminJson.email);
//       } else {
//         const staffProfile = staffProfileRepository.create({
//           user: existingUser,
//           firstName: 'Super',
//           lastName: 'Admin',
//           department: StaffDepartmentEnum.ADMINISTRATION,
//           employmentStartDate: new Date(),
//         });
//         await staffProfileRepository.save(staffProfile);
//         this.logIfCreated('Staff Profile', superAdminJson.email);
//       }
//       return this.logIfExists('User', superAdminJson.email);
//     }
//     const newUser = userRepository.create({
//       office: headOffice,
//       email: superAdminJson.email,
//       contact: superAdminJson.contact,
//       password: await this.hashPassword(superAdminJson.password),
//     });
//     if (newUser.createdBy === null || newUser.createdBy === undefined) {
//       newUser.createdBy = newUser.id;
//       Logger.log(
//         'createdBy is null for existing Super Admin, setting it to the new existing Super Admin itself',
//       );
//     } else {
//       Logger.log(
//         'createdBy is not null for existing Super Admin, keeping the existing value',
//         DefaultSeeder.name,
//       );
//     }
//     await userRepository.save(newUser);
//     if (newUser) {
//       const staffProfile = staffProfileRepository.create({
//         user: newUser,
//         firstName: 'Super',
//         lastName: 'Admin',
//         department: StaffDepartmentEnum.ADMINISTRATION,
//         employmentStartDate: new Date(),
//       });
//       await staffProfileRepository.save(staffProfile);
//       const superAdminUser = userRoleRepository.create({
//         user: newUser,
//         role: superAdminRole,
//       });
//       await userRoleRepository.save(superAdminUser);
//       this.logIfCreated(
//         'SuperAdmin user, role and staff profile',
//         superAdminJson.email,
//       );
//     }
//   }
//   async seedRolesIfNotExists(
//     roleRepository: Repository<RoleEntity>,
//   ): Promise<void> {
//     for (const roleData of roleJson) {
//       const existingRole = await roleRepository.findOne({
//         where: { systemName: roleData.systemName },
//       });
//       if (!existingRole) {
//         await roleRepository.insert({
//           ...roleData,
//           id: roleData.id,
//         });
//         this.logIfCreated('Role', roleData.systemName);
//       }
//       this.logIfExists('Role', roleData.systemName);
//     }
//   }
//   async seedOfficeTypeIfNotExists(
//     officeTypeRepository: Repository<OfficeTypeEntity>,
//   ): Promise<void> {
//     await Promise.all(
//       officeTypeJson.map(async (officeType) => {
//         const existingOfficeType = await officeTypeRepository.findOne({
//           where: { officeTypeSystemName: officeType.officeTypeSystemName },
//         });
//         if (existingOfficeType) {
//           this.logIfExists('officeType', officeType.officeTypeSystemName);
//           return;
//         }
//         const createdOfficeType = officeTypeRepository.create(officeType);
//         await officeTypeRepository.save(createdOfficeType);
//         this.logIfCreated('officeType', officeType.officeTypeSystemName);
//       }),
//     );
//   }
// }
