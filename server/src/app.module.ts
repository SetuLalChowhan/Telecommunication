import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { auth } from './auth/auth.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/middleware/logger.middleware.js';
import { DoctorModule } from './doctors/doctors.module.js';
import { SpecialtiesModule } from './specialties/specialties.module.js';
import { PatientsModule } from './patients/patients.module.js';
import { AdminModule } from './admin/admin.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule.forRoot({
      auth,
    }),

    PrismaModule,
    UsersModule,
    DoctorModule,
    SpecialtiesModule,
    PatientsModule,
    AdminModule,
    AppointmentsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
