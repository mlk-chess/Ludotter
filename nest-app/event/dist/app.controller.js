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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const microservices_1 = require("@nestjs/microservices");
const rpc_exception_filter_1 = require("./filters/rpc-exception.filter");
const create_event_dto_1 = require("./dto/create-event.dto");
const update_event_dto_1 = require("./dto/update-event.dto");
const join_event_dto_1 = require("./dto/join-event.dto");
const leave_event_dto_1 = require("./dto/leave-event.dto");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getEventsAdmin() {
        return this.appService.getEventsAdmin();
    }
    getEventsComing() {
        return this.appService.getEventsComing();
    }
    getMyEvents() {
        return this.appService.getMyEvents();
    }
    getEventById(id) {
        return this.appService.getEventById(id);
    }
    saveEvent(createEvent) {
        return this.appService.saveEvent(createEvent);
    }
    updateEvent(event) {
        return this.appService.updateEvent(event);
    }
    deleteEvent(id) {
        return this.appService.deleteEvent(id);
    }
    joinEvent(joinEvent) {
        return this.appService.joinEvent(joinEvent);
    }
    getUsersByEvent(id) {
        return this.appService.getUsersByEvent(id);
    }
    getUserByEvent(id) {
        return this.appService.getUserByEvent(id);
    }
    leaveEvent(leaveEvent) {
        return this.appService.leaveEvent(leaveEvent);
    }
    getCompanies() {
        return this.appService.getCompanies();
    }
    saveEventAdmin(createEvent) {
        return this.appService.saveEventAdmin(createEvent);
    }
};
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_getEventsAdmin' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getEventsAdmin", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_getEventsComing' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getEventsComing", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_getMyEvents' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getMyEvents", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_getEventById' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getEventById", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_saveEvent' }),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.UseFilters)(new rpc_exception_filter_1.RpcValidationFilter()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_dto_1.createEventDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "saveEvent", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_updateEvent' }),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.UseFilters)(new rpc_exception_filter_1.RpcValidationFilter()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_event_dto_1.updateEventDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateEvent", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_deleteEvent' }),
    (0, common_1.UseFilters)(new rpc_exception_filter_1.RpcValidationFilter()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "deleteEvent", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_joinEvent' }),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.UseFilters)(new rpc_exception_filter_1.RpcValidationFilter()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_event_dto_1.joinEventDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "joinEvent", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_getUsersByEvent' }),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.UseFilters)(new rpc_exception_filter_1.RpcValidationFilter()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getUsersByEvent", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_getUserByEvent' }),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.UseFilters)(new rpc_exception_filter_1.RpcValidationFilter()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getUserByEvent", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_leaveEvent' }),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.UseFilters)(new rpc_exception_filter_1.RpcValidationFilter()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_event_dto_1.leaveEventDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "leaveEvent", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_getCompanies' }),
    (0, common_1.UseFilters)(new rpc_exception_filter_1.RpcValidationFilter()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getCompanies", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'event_saveEventAdmin' }),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, common_1.UseFilters)(new rpc_exception_filter_1.RpcValidationFilter()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_dto_1.createEventDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "saveEventAdmin", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map