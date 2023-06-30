"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("./supabase/supabase.service");
let AppService = class AppService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getEventsAdmin() {
        const { data: events } = await this.supabaseService.client
            .from('events')
            .select('*, company(name,id)');
        return events;
    }
    async getEventsComing() {
        const today = new Date().toISOString().split('T')[0];
        ;
        const { data: events } = await this.supabaseService.client
            .from('events')
            .select('*, company(name)')
            .gt('date', today)
            .eq("status", 1);
        return events;
    }
    async getMyEvents() {
        const { data: events } = await this.supabaseService.client
            .from('events')
            .select('*')
            .eq('companyId', 1);
        return events;
    }
    async saveEvent(newEvent) {
        if (new Date(newEvent.date) < new Date()) {
            return new common_1.HttpException({ message: ["La date de l'événement ne peut pas être antérieure à la date actuelle."] }, common_1.HttpStatus.BAD_REQUEST);
        }
        const { error } = await this.supabaseService.client
            .from('events')
            .insert([{
                name: newEvent.name,
                description: newEvent.description,
                date: newEvent.date,
                time: newEvent.time,
                players: newEvent.players,
                companyId: 1,
                status: 1
            }]);
        if (error) {
            throw error;
        }
        return { statusCode: 201, message: "Created" };
    }
    async getEventById(id) {
        const { data: event } = await this.supabaseService.client
            .from('events')
            .select('*, company(name, address, city, zipcode)')
            .eq('id', id);
        return event;
    }
    async updateEvent(updateEvent) {
        const getEvent = await this.getEventById(updateEvent.id);
        const getUsersEvent = await this.getUsersByEvent(updateEvent.id);
        const countGetUsersEvent = getUsersEvent.length;
        if (getEvent.length == 0) {
            return new common_1.HttpException({ message: ["L'évènement n'existe pas."] }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (getEvent[0].status == -1) {
            return new common_1.HttpException({ message: ["Vous ne pouvez pas modifier un évènement annulé"] }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (new Date(getEvent[0].date) < new Date()) {
            return new common_1.HttpException({ message: ["Vous ne pouvez pas modifier un évènement passé"] }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (new Date(updateEvent.date) < new Date()) {
            return new common_1.HttpException({ message: ["La date de l'événement ne peut pas être antérieure à la date actuelle."] }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (countGetUsersEvent > updateEvent.players) {
            return new common_1.HttpException({ message: ["Vous ne pouvez pas modifier le nombre de personne."] }, common_1.HttpStatus.BAD_REQUEST);
        }
        const { error } = await this.supabaseService.client
            .from('events')
            .update([{
                name: updateEvent.name,
                description: updateEvent.description,
                date: updateEvent.date,
                time: updateEvent.time,
                players: updateEvent.players,
            }])
            .eq('id', updateEvent.id);
        return { statusCode: 200, message: "Updated" };
    }
    async deleteEvent(id) {
        const getEvent = await this.getEventById(id);
        if (getEvent.length == 0) {
            return new common_1.HttpException({ message: ["L'évènement n'existe pas."] }, common_1.HttpStatus.NOT_FOUND);
        }
        const { data, error } = await this.supabaseService.client
            .from('events')
            .update([{
                status: -1
            }])
            .eq('id', id);
        return { statusCode: 204, message: "Deleted" };
    }
    async joinEvent(joinEvent) {
        const getEvent = await this.getEventById(joinEvent.eventId);
        if (getEvent.length == 0) {
            return new common_1.HttpException({ message: ["L'évènement n'existe pas."] }, common_1.HttpStatus.NOT_FOUND);
        }
        if (new Date(getEvent[0].date) < new Date()) {
            return new common_1.HttpException({ message: ["Vous ne pouvez pas rejoindre un évènement passé"] }, common_1.HttpStatus.BAD_REQUEST);
        }
        const getUsersByEvent = await this.getUsersByEvent(joinEvent.eventId);
        if (getUsersByEvent.length >= getEvent[0].players) {
            return new common_1.HttpException({ message: ["Plus de place."] }, common_1.HttpStatus.BAD_REQUEST);
        }
        const { data } = await this.supabaseService.client
            .from('eventProfiles')
            .select('*')
            .eq('profileId', "72d1498a-3587-429f-8bec-3fafc0cd47bd")
            .eq('eventId', joinEvent.eventId);
        if (data.length > 0) {
            return new common_1.HttpException({ message: ["Vous êtes déjà inscrit."] }, common_1.HttpStatus.BAD_REQUEST);
        }
        const { error } = await this.supabaseService.client
            .from('eventProfiles')
            .insert([{
                eventId: joinEvent.eventId,
                profileId: "72d1498a-3587-429f-8bec-3fafc0cd47bd"
            }]);
        return { statusCode: 201, message: "Created" };
    }
    async leaveEvent(leaveEvent) {
        const getEvent = await this.getEventById(leaveEvent.eventId);
        if (getEvent.length == 0) {
            return new common_1.HttpException({ message: ["L'évènement n'existe pas."] }, common_1.HttpStatus.NOT_FOUND);
        }
        const { data } = await this.supabaseService.client
            .from('eventProfiles')
            .select('*')
            .eq('profileId', "72d1498a-3587-429f-8bec-3fafc0cd47bd")
            .eq('eventId', leaveEvent.eventId);
        if (data.length > 0) {
            const { data } = await this.supabaseService.client
                .from('eventProfiles')
                .delete()
                .eq('profileId', "72d1498a-3587-429f-8bec-3fafc0cd47bd")
                .eq('eventId', leaveEvent.eventId);
            return { statusCode: 200, message: "Deleted" };
        }
        return new common_1.HttpException({ message: ["Vous n'êtes pas inscrit."] }, common_1.HttpStatus.NOT_FOUND);
    }
    async getUsersByEvent(id) {
        const { data, error } = await this.supabaseService.client
            .from('eventProfiles')
            .select('profiles(name, firstname)')
            .eq('eventId', id);
        return data;
    }
    async getUserByEvent(id) {
        const { data, error } = await this.supabaseService.client
            .from('eventProfiles')
            .select('*')
            .eq('eventId', id)
            .eq('profileId', '72d1498a-3587-429f-8bec-3fafc0cd47bd');
        return data;
    }
    async getCompanies() {
        const { data, error } = await this.supabaseService.client
            .from('company')
            .select('*')
            .not('authId', "is", 'null');
        return data;
    }
    async saveEventAdmin(newEvent) {
        const { error } = await this.supabaseService.client
            .from('events')
            .insert([{
                name: newEvent.name,
                description: newEvent.description,
                date: newEvent.date,
                time: newEvent.time,
                players: newEvent.players,
                companyId: newEvent.companyId,
                status: 1
            }]);
        if (error) {
            throw error;
        }
        return { statusCode: 201, message: "Created" };
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map