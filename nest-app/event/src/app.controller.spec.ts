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

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports:[ConfigModule.forRoot()],
      controllers: [AppController],
      providers: [AppService, SupabaseService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
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
      const result = await appController.saveEvent(event);
      console.log(result);
      expect(result).toEqual({ statusCode: 201, message: "Created" });
    });
  });
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
    it("should throw an error when the event doesn't exist", async () => {
      // Mock the getEventById method to return an empty result (event not found)
      jest.spyOn(appService, 'getEventById').mockResolvedValueOnce([]);

      // Call the deleteEvent method and expect it to throw an HttpException
      await expect(appService.deleteEvent('123')).rejects.toThrow(HttpException);
      await expect(appService.deleteEvent('123')).rejects.toThrowError(
        new HttpException({ message: "L'évènement n'existe pas." }, HttpStatus.NOT_FOUND),
      );
  }); 
  });
});
