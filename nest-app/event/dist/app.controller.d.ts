import { AppService } from './app.service';
import { createEventDto } from './dto/create-event.dto';
import { updateEventDto } from './dto/update-event.dto';
import { joinEventDto } from './dto/join-event.dto';
import { leaveEventDto } from './dto/leave-event.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getEventsAdmin(): Promise<any[]>;
    getEventsComing(): Promise<any[]>;
    getMyEvents(): Promise<any[]>;
    getEventById(id: string): Promise<any[]>;
    saveEvent(createEvent: createEventDto): Promise<import("@nestjs/common").HttpException | {
        statusCode: number;
        message: string;
    }>;
    updateEvent(event: updateEventDto): Promise<import("@nestjs/common").HttpException | {
        statusCode: number;
        message: string;
    }>;
    deleteEvent(id: string): Promise<import("@nestjs/common").HttpException | {
        statusCode: number;
        message: string;
    }>;
    joinEvent(joinEvent: joinEventDto): Promise<import("@nestjs/common").HttpException | {
        statusCode: number;
        message: string;
    }>;
    getUsersByEvent(id: string): Promise<{
        profiles: {
            name: any;
            firstname: any;
        }[];
    }[]>;
    getUserByEvent(id: string): Promise<any[]>;
    leaveEvent(leaveEvent: leaveEventDto): Promise<import("@nestjs/common").HttpException | {
        statusCode: number;
        message: string;
    }>;
    getCompanies(): Promise<any[]>;
    saveEventAdmin(createEvent: createEventDto): Promise<{
        statusCode: number;
        message: string;
    }>;
}
