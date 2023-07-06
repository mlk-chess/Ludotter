import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createEventDto } from './dto/create-event.dto';
import { SupabaseService } from './supabase/supabase.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { updateEventDto } from './dto/update-event.dto';
import { HttpException, HttpStatus } from '@nestjs/common';


describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let supabaseService: SupabaseService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports:[ConfigModule.forRoot()],
      controllers: [AppController],
      providers: [AppService, {
        
          provide: SupabaseService,
          useValue: {
            client: {
              from: jest.fn().mockReturnThis(),
              insert: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    supabaseService = app.get<SupabaseService>(SupabaseService);
  });

  //  describe('createEvent', () => {
  //   it('should create an event with the provided fields', async () => {
  //      const event: createEventDto = {
  //       name: 'Mon événement',
  //       description: 'Description de mon événement',
  //       date: new Date('2024-01-01'),
  //       time: '14:00',
  //       players: 10,
  //       companyId: 29,
  //       user: [{id:1}],
  //     };

  //     const result = await appController.saveEvent(event);
  //     expect(result).toEqual(new HttpException({ message: ["Une erreur s'est produite"] }, HttpStatus.INTERNAL_SERVER_ERROR));
  //   });
  // });

  
  describe('updateEvent', () => {
    it('should update an event', async () => {
      const eventId = '31'; // ID de l'événement à mettre à jour
      const updatedEvent: updateEventDto = {
        id: eventId,
        name: 'Loup garou',
        description: 'Venez jouer au loup garou',
        date: new Date('2024-01-02'),
        time: '15:00',
        players: 12,
        user: [{id:1}],
      };

      jest.spyOn(appService, 'updateEvent').mockResolvedValue({ statusCode: 200, message: "Updated" });

      const result = await appController.updateEvent(updatedEvent);

      expect(result).toEqual({ statusCode: 200, message: "Updated" });
      expect(appService.updateEvent).toHaveBeenCalledWith(updatedEvent);
    });
  });
  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const eventId = '32'; // ID de l'événement à supprimer

      jest.spyOn(appService, 'deleteEvent').mockResolvedValue({ statusCode: 204, message: "Deleted" });

      const result = await appController.deleteEvent(eventId);

      expect(appService.deleteEvent).toHaveBeenCalledWith(eventId);
    });
  });
});
