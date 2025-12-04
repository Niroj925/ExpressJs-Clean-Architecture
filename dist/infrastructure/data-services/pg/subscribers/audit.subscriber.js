"use strict";
// import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
// import {
//   EntitySubscriberInterface,
//   InsertEvent,
//   UpdateEvent,
//   SoftRemoveEvent,
//   EventSubscriber,
//   DataSource,
// } from 'typeorm';
// import { IClsStore } from 'src/core/abstracts/adapters/cls-store.abstract';
// import {
//   AppClsStore,
//   UserClsData,
// } from 'src/common/interface/app-cls-store.interface';
// @Injectable()
// @EventSubscriber()
// export class AuditSubscriber
//   implements EntitySubscriberInterface, OnModuleInit
// {
//   constructor(
//     private readonly cls: IClsStore<AppClsStore>,
//     private readonly dataSource: DataSource,
//   ) {}
//   /** Tell TypeORM to use THIS DI-ready instance */
//   onModuleInit() {
//     this.dataSource.subscribers.push(this);
//   }
//   async getCurrentUserId(): Promise<string | null> {
//     const user = this.cls.get<UserClsData>('user');
//     return user?.id ?? null;
//   }
//   async beforeInsert(event: InsertEvent<any>) {
//     if (!event.entity) return;
//     const userId = await this.getCurrentUserId();
//     if (userId) {
//       event.entity.createdBy = userId;
//       event.entity.updatedBy = userId;
//     }
//   }
//   async beforeUpdate(event: UpdateEvent<any>) {
//     if (!event.entity) return;
//     const userId = await this.getCurrentUserId();
//     if (userId) event.entity.updatedBy = userId;
//   }
//   async beforeSoftRemove(event: SoftRemoveEvent<any>) {
//     if (!event.entity) return;
//     const userId = await this.getCurrentUserId();
//     if (userId) event.entity.deletedBy = userId;
//   }
// }
