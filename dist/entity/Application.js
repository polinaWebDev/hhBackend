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
exports.Application = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const status_1 = require("../status");
let Application = class Application {
};
exports.Application = Application;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Application.prototype, "application_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Application.prototype, "job_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: status_1.Status,
        default: status_1.Status.PENDING
    }),
    __metadata("design:type", String)
], Application.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Application.prototype, "coverLetter", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (user) => user.applications),
    __metadata("design:type", Users_1.Users)
], Application.prototype, "user", void 0);
exports.Application = Application = __decorate([
    (0, typeorm_1.Entity)()
], Application);
