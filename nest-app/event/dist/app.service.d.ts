import { HttpException } from '@nestjs/common';
import { createEventDto } from './dto/create-event.dto';
import { updateEventDto } from './dto/update-event.dto';
import { SupabaseService } from './supabase/supabase.service';
import { joinEventDto } from './dto/join-event.dto';
import { leaveEventDto } from './dto/leave-event.dto';
export declare class AppService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    getEventsAdmin(): Promise<{
        [x: string]: any;
    }[]>;
    getEventsComing(): Promise<{
        [x: string]: any;
    }[]>;
    getMyEvents(): Promise<{
        [x: string]: any;
    }[]>;
    saveEvent(newEvent: createEventDto): Promise<HttpException | {
        statusCode: number;
        message: string;
    }>;
    getEventById(id: string): Promise<{
        [x: string]: any;
    }[]>;
    updateEvent(updateEvent: updateEventDto): Promise<HttpException | {
        statusCode: number;
        message: string;
    }>;
    deleteEvent(id: string): Promise<HttpException | {
        statusCode: number;
        message: string;
    }>;
    joinEvent(joinEvent: joinEventDto): Promise<HttpException | {
        statusCode: number;
        message: string;
    }>;
    leaveEvent(leaveEvent: leaveEventDto): Promise<HttpException | {
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
    getCompanies(): Promise<{
        [x: string]: any;
    }[]>;
    saveEventAdmin(newEvent: createEventDto): Promise<{
        statusCode: number;
        message: string;
    }>;
}
