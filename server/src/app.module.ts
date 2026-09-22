import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { createObserveModule } from '@nestjs/observe';
import { auth } from './auth/auth.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.schema.js';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware.js';
import { LoggerMiddleware } from './common/middleware/logger.middleware.js';
import { DoctorModule } from './doctors/doctors.module.js';
import { SpecialtiesModule } from './specialties/specialties.module.js';
import { PatientsModule } from './patients/patients.module.js';
import { AdminModule } from './admin/admin.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { MedicalReportsModule } from './medical-reports/medical-reports.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { GoogleModule } from './google/google.module.js';
import { HealthModule } from './health/health.module.js';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module.js';
import { CmsModule } from './cms/cms.module.js';
import { BlogsModule } from './blogs/blogs.module.js';
import { ContactsModule } from './contacts/contacts.module.js';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    CloudinaryModule,

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),

    AuthModule.forRoot({
      auth,
    }),

    PrismaModule,
    HealthModule,
    UsersModule,
    DoctorModule,
    SpecialtiesModule,
    PatientsModule,
    AdminModule,
    AppointmentsModule,
    MedicalReportsModule,
    ReviewsModule,
    NotificationsModule,
    GoogleModule,
    CmsModule,
    BlogsModule,
    ContactsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggerMiddleware)
      .forRoutes('*');
  }
}
