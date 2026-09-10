import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Telemedicine Core API')
    .setDescription(
      'Production REST API for Telemedicine Platform with Doctor Availability, Real-time Booking, Google Meet, and Admin Management.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Health', 'System and database health checks')
    .addTag('Appointments', 'Booking engine, slots, and consultations')
    .addTag('Doctors', 'Doctor profile, availability, and day-offs')
    .addTag('Patients', 'Patient profile and medical records')
    .addTag('Admin', 'Super admin management and doctor verification')
    .addTag('Google', 'Google OAuth, Calendar and Meet integrations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
