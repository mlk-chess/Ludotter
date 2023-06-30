import { AppService } from './app.service';
import { createEventDto } from './dto/create-event.dto';
import { updateEventDto } from './dto/update-event.dto';
import { joinEventDto } from './dto/join-event.dto';
import { leaveEventDto } from './dto/leave-event.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getEventsAdmin(): Promise<{
        [x: string]: any;
    }[]>;
    getEventsComing(): Promise<{
        [x: string]: any;
    }[]>;
    getMyEvents(): Promise<{
        [x: string]: any;
    }[]>;
    getEventById(id: string): Promise<{
        [x: string]: any;
    }[]>;
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
    getUserByEvent(id: string): Promise<{
        [x: string]: any;
    }[]>;
    leaveEvent(leaveEvent: leaveEventDto): Promise<import("@nestjs/common").HttpException | {
        statusCode: number;
        message: string;
    }>;
    getCompanies(): Promise<{
        [x: string]: any;
    }[]>;
    saveEventAdmin(createEvent: createEventDto): Promise<{
        statusCode: number;
        message: string;
    }>;
}
