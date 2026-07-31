"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommoditiesModule = void 0;
const common_1 = require("@nestjs/common");
const commodities_controller_1 = require("./commodities.controller");
const prices_controller_1 = require("./prices.controller");
let CommoditiesModule = class CommoditiesModule {
};
exports.CommoditiesModule = CommoditiesModule;
exports.CommoditiesModule = CommoditiesModule = __decorate([
    (0, common_1.Module)({ controllers: [commodities_controller_1.CommoditiesController, prices_controller_1.PricesController] })
], CommoditiesModule);
//# sourceMappingURL=commodities.module.js.map