import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createEventDto } from './dto/create-event.dto';
import { SupabaseService } from './supabase/supabase.service';
import { ConfigModule, ConfigService } from '@nestjs/config';


describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports:[ConfigModule.forRoot()],
      controllers: [AppController],
      providers: [AppService, SupabaseService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

   describe('createEvent', () => {
    it('should create an event with the provided fields', async () => {
      const event: createEventDto = {
        name: 'Mon événement',
        description: 'Description de mon événement',
        date: new Date('2024-01-01'),
        time: '14:00',
        players: 10,
        companyId: 1,
        user: [{id:1}],
      };
      const savedEvent = await appController.saveEvent(event);
       expect(savedEvent).toEqual({ statusCode: 201, message: "Created" });
    });
  });
});