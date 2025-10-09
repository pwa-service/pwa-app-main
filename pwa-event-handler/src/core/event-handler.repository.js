"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandlerRepository = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var EventHandlerRepository = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EventHandlerRepository = _classThis = /** @class */ (function () {
        function EventHandlerRepository_1(prisma) {
            this.prisma = prisma;
        }
        EventHandlerRepository_1.prototype.getActiveAccessTokenByPixelId = function (pixelId) {
            return __awaiter(this, void 0, void 0, function () {
                var rec;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.pixelToken.findFirst({
                                where: { pixelId: pixelId, status: client_1.Status.active },
                                select: { accessToken: true },
                            })];
                        case 1:
                            rec = _b.sent();
                            return [2 /*return*/, (_a = rec === null || rec === void 0 ? void 0 : rec.accessToken) !== null && _a !== void 0 ? _a : null];
                    }
                });
            });
        };
        EventHandlerRepository_1.prototype.upsertSession = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                return __generator(this, function (_o) {
                    return [2 /*return*/, this.prisma.pwaSession.upsert({
                            where: { userId: input.userId },
                            update: {
                                pwaDomain: input.pwaDomain,
                                landingUrl: (_a = input.landingUrl) !== null && _a !== void 0 ? _a : undefined,
                                queryStringRaw: (_b = input.queryStringRaw) !== null && _b !== void 0 ? _b : undefined,
                                pixelId: input.pixelId,
                                fbclid: (_c = input.fbclid) !== null && _c !== void 0 ? _c : undefined,
                                offerId: (_d = input.offerId) !== null && _d !== void 0 ? _d : undefined,
                                utmSource: (_e = input.utmSource) !== null && _e !== void 0 ? _e : undefined,
                                sub1: (_f = input.sub1) !== null && _f !== void 0 ? _f : undefined,
                            },
                            create: {
                                userId: input.userId,
                                pwaDomain: input.pwaDomain,
                                landingUrl: (_g = input.landingUrl) !== null && _g !== void 0 ? _g : null,
                                queryStringRaw: (_h = input.queryStringRaw) !== null && _h !== void 0 ? _h : null,
                                pixelId: input.pixelId,
                                fbclid: (_j = input.fbclid) !== null && _j !== void 0 ? _j : null,
                                offerId: (_k = input.offerId) !== null && _k !== void 0 ? _k : null,
                                utmSource: (_l = input.utmSource) !== null && _l !== void 0 ? _l : null,
                                sub1: (_m = input.sub1) !== null && _m !== void 0 ? _m : null,
                            },
                        })];
                });
            });
        };
        EventHandlerRepository_1.prototype.getSessionByUserId = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.pwaSession.findUnique({ where: { userId: userId } })];
                });
            });
        };
        EventHandlerRepository_1.prototype.setFinalUrl = function (userId, finalUrl) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.pwaSession.update({
                                where: { userId: userId },
                                data: { finalUrl: finalUrl },
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        EventHandlerRepository_1.prototype.markFirstOpen = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.prisma.pwaSession.update({
                                where: { userId: input.userId },
                                data: {
                                    firstOpenAt: new Date(),
                                    firstOpenEventId: (_a = input.eventId) !== null && _a !== void 0 ? _a : undefined,
                                    firstOpenFbStatus: (_b = input.fbStatus) !== null && _b !== void 0 ? _b : undefined,
                                    finalUrl: (_c = input.finalUrl) !== null && _c !== void 0 ? _c : undefined,
                                },
                            })];
                        case 1:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return EventHandlerRepository_1;
    }());
    __setFunctionName(_classThis, "EventHandlerRepository");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventHandlerRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventHandlerRepository = _classThis;
}();
exports.EventHandlerRepository = EventHandlerRepository;
