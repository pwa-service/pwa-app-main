"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.EventHandlerCoreService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var client_1 = require("@prisma/client");
var EventHandlerCoreService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EventHandlerCoreService = _classThis = /** @class */ (function () {
        function EventHandlerCoreService_1(repo, logs) {
            var _a;
            this.repo = repo;
            this.logs = logs;
            this.log = new common_1.Logger(EventHandlerCoreService.name);
            this.graphVersion = (_a = process.env.FB_GRAPH_VERSION) !== null && _a !== void 0 ? _a : 'v21.0';
        }
        EventHandlerCoreService_1.prototype.viewContent = function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, pixelId, accessToken, fbclid, offerId, utmSource, payload, fb;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.log.debug({ tag: 'viewContent:input', event: event });
                            _a = event._meta, pixelId = _a.pixelId, accessToken = _a.accessToken, fbclid = _a.fbclid, offerId = _a.offerId, utmSource = _a.utmSource;
                            return [4 /*yield*/, this.repo.upsertSession({
                                    userId: event.userId,
                                    pwaDomain: event.pwaDomain,
                                    landingUrl: (_b = event.landingUrl) !== null && _b !== void 0 ? _b : null,
                                    queryStringRaw: (_c = event.queryStringRaw) !== null && _c !== void 0 ? _c : null,
                                    pixelId: pixelId,
                                    fbclid: fbclid !== null && fbclid !== void 0 ? fbclid : null,
                                    offerId: offerId !== null && offerId !== void 0 ? offerId : null,
                                    utmSource: utmSource !== null && utmSource !== void 0 ? utmSource : null,
                                    sub1: undefined,
                                })];
                        case 1:
                            _d.sent();
                            payload = this.payloadFbBuilder({
                                eventName: 'ViewContent',
                                sourceUrl: event.landingUrl || "https://".concat(event.pwaDomain),
                                userId: event.userId,
                                fbclid: fbclid,
                                offerId: offerId,
                                utmSource: utmSource,
                            });
                            this.log.debug({ tag: 'viewContent:payload', payload: payload });
                            return [4 /*yield*/, this.sendToFacebookApi(pixelId, accessToken, payload)];
                        case 2:
                            fb = _d.sent();
                            this.log.log({ tag: 'viewContent:fb-response', fb: fb });
                            return [2 /*return*/, { success: true, fb: fb }];
                    }
                });
            });
        };
        EventHandlerCoreService_1.prototype.prepareInstallLink = function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, pwaDomain, base, url, finalUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.log.debug({ tag: 'prepareInstallLink:input', event: event });
                            userId = event.userId, pwaDomain = event.pwaDomain;
                            base = process.env.TRACKER_BASE_URL || 'https://tracker.example.com/landing';
                            url = new URL(base);
                            url.searchParams.set('user_id', userId);
                            finalUrl = url.toString();
                            return [4 /*yield*/, this.repo.setFinalUrl(userId, finalUrl)];
                        case 1:
                            _a.sent();
                            this.log.log({ event: 'prepare-install-link', userId: userId, pwaDomain: pwaDomain, finalUrl: finalUrl });
                            return [2 /*return*/, { finalUrl: finalUrl }];
                    }
                });
            });
        };
        EventHandlerCoreService_1.prototype.pwaFirstOpen = function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var sess, accessToken, sourceUrl, built, eventId, fb, e_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            this.log.debug({ tag: 'pwaFirstOpen:input', event: event });
                            return [4 /*yield*/, this.repo.getSessionByUserId(event.userId)];
                        case 1:
                            sess = _c.sent();
                            this.log.debug({ tag: 'pwaFirstOpen:session', sess: sess });
                            if (!sess)
                                return [2 /*return*/, { success: true }];
                            return [4 /*yield*/, this.repo.getActiveAccessTokenByPixelId(sess.pixelId)];
                        case 2:
                            accessToken = _c.sent();
                            this.log.debug({ tag: 'pwaFirstOpen:accessToken', accessToken: accessToken });
                            if (!accessToken)
                                return [2 /*return*/, { success: true }];
                            sourceUrl = sess.finalUrl || sess.landingUrl || "https://".concat(sess.pwaDomain || event.pwaDomain);
                            built = this.payloadFbBuilder({
                                eventName: 'ViewContent',
                                sourceUrl: sourceUrl,
                                userId: event.userId,
                                fbclid: sess.fbclid || undefined,
                                offerId: sess.offerId || undefined,
                                utmSource: sess.utmSource || undefined,
                            });
                            this.log.debug({ tag: 'pwaFirstOpen:payload', built: built });
                            eventId = (_b = (_a = built === null || built === void 0 ? void 0 : built.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.event_id;
                            _c.label = 3;
                        case 3:
                            _c.trys.push([3, 6, , 8]);
                            return [4 /*yield*/, this.sendToFacebookApi(sess.pixelId, accessToken, built)];
                        case 4:
                            fb = _c.sent();
                            this.log.log({ tag: 'pwaFirstOpen:fb-response', fb: fb });
                            return [4 /*yield*/, this.repo.markFirstOpen({
                                    userId: event.userId,
                                    eventId: eventId !== null && eventId !== void 0 ? eventId : null,
                                    fbStatus: client_1.LogStatus.success,
                                    finalUrl: sourceUrl,
                                })];
                        case 5:
                            _c.sent();
                            return [2 /*return*/, { success: true }];
                        case 6:
                            e_1 = _c.sent();
                            this.log.error({ tag: 'pwaFirstOpen:fb-error', error: e_1.message });
                            return [4 /*yield*/, this.repo.markFirstOpen({
                                    userId: event.userId,
                                    eventId: eventId !== null && eventId !== void 0 ? eventId : null,
                                    fbStatus: client_1.LogStatus.error,
                                    finalUrl: sourceUrl,
                                })];
                        case 7:
                            _c.sent();
                            return [2 /*return*/, { success: false, error: e_1.message }];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        EventHandlerCoreService_1.prototype.lead = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, pixelId, accessToken, fbclid, offerId, utmSource, payload, fb;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.log.debug({ tag: 'lead:input', dto: dto });
                            _a = dto._meta, pixelId = _a.pixelId, accessToken = _a.accessToken, fbclid = _a.fbclid, offerId = _a.offerId, utmSource = _a.utmSource;
                            payload = this.payloadFbBuilder({
                                eventName: 'Lead',
                                sourceUrl: dto.landingUrl || "https://".concat(dto.pwaDomain),
                                userId: dto.userId,
                                fbclid: fbclid,
                                offerId: offerId,
                                utmSource: utmSource,
                            });
                            this.log.debug({ tag: 'lead:payload', payload: payload });
                            return [4 /*yield*/, this.sendToFacebookApi(pixelId, accessToken, payload)];
                        case 1:
                            fb = _b.sent();
                            this.log.log({ tag: 'lead:fb-response', fb: fb });
                            return [2 /*return*/, { status: 'ok' }];
                    }
                });
            });
        };
        EventHandlerCoreService_1.prototype.completeRegistration = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, pixelId, accessToken, fbclid, offerId, utmSource, payload, fb;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.log.debug({ tag: 'completeRegistration:input', dto: dto });
                            _a = dto._meta, pixelId = _a.pixelId, accessToken = _a.accessToken, fbclid = _a.fbclid, offerId = _a.offerId, utmSource = _a.utmSource;
                            payload = this.payloadFbBuilder({
                                eventName: 'CompleteRegistration',
                                sourceUrl: dto.landingUrl || "https://".concat(dto.pwaDomain),
                                userId: dto.userId,
                                fbclid: fbclid,
                                offerId: offerId,
                                utmSource: utmSource,
                            });
                            this.log.debug({ tag: 'completeRegistration:payload', payload: payload });
                            return [4 /*yield*/, this.sendToFacebookApi(pixelId, accessToken, payload)];
                        case 1:
                            fb = _b.sent();
                            this.log.log({ tag: 'completeRegistration:fb-response', fb: fb });
                            return [2 /*return*/, { status: 'ok' }];
                    }
                });
            });
        };
        EventHandlerCoreService_1.prototype.purchase = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, pixelId, accessToken, fbclid, offerId, utmSource, payload, fb;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.log.debug({ tag: 'purchase:input', dto: dto });
                            _a = dto._meta, pixelId = _a.pixelId, accessToken = _a.accessToken, fbclid = _a.fbclid, offerId = _a.offerId, utmSource = _a.utmSource;
                            payload = this.payloadFbBuilder({
                                eventName: 'Purchase',
                                sourceUrl: dto.landingUrl || "https://".concat(dto.pwaDomain),
                                userId: dto.userId,
                                fbclid: fbclid,
                                offerId: offerId,
                                utmSource: utmSource,
                                value: dto.value,
                                currency: dto.currency,
                            });
                            this.log.debug({ tag: 'purchase:payload', payload: payload });
                            return [4 /*yield*/, this.sendToFacebookApi(pixelId, accessToken, payload)];
                        case 1:
                            fb = _b.sent();
                            this.log.log({ tag: 'purchase:fb-response', fb: fb });
                            return [2 /*return*/, { status: 'ok' }];
                    }
                });
            });
        };
        EventHandlerCoreService_1.prototype.subscribe = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, pixelId, accessToken, fbclid, offerId, utmSource, payload, fb;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.log.debug({ tag: 'subscribe:input', dto: dto });
                            _a = dto._meta, pixelId = _a.pixelId, accessToken = _a.accessToken, fbclid = _a.fbclid, offerId = _a.offerId, utmSource = _a.utmSource;
                            payload = this.payloadFbBuilder({
                                eventName: 'Subscribe',
                                sourceUrl: dto.landingUrl || "https://".concat(dto.pwaDomain),
                                userId: dto.userId,
                                fbclid: fbclid,
                                offerId: offerId,
                                utmSource: utmSource,
                                value: dto.value,
                                currency: dto.currency,
                            });
                            this.log.debug({ tag: 'subscribe:payload', payload: payload });
                            return [4 /*yield*/, this.sendToFacebookApi(pixelId, accessToken, payload)];
                        case 1:
                            fb = _b.sent();
                            this.log.log({ tag: 'subscribe:fb-response', fb: fb });
                            return [2 /*return*/, { status: 'ok' }];
                    }
                });
            });
        };
        EventHandlerCoreService_1.prototype.sendToFacebookApi = function (pixelId, accessToken, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var eventId, clientIp, status, responseData, mock, url, _a, data, httpStatus, e_2, err, _b, httpStatus, data;
                var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                return __generator(this, function (_p) {
                    switch (_p.label) {
                        case 0:
                            eventId = (_h = (_e = (_d = (_c = payload === null || payload === void 0 ? void 0 : payload.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.event_id) !== null && _e !== void 0 ? _e : (_g = (_f = payload === null || payload === void 0 ? void 0 : payload.data) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.eventId) !== null && _h !== void 0 ? _h : Math.random().toString(36).slice(2, 12);
                            clientIp = (_l = (_k = (_j = payload === null || payload === void 0 ? void 0 : payload.data) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.user_data) === null || _l === void 0 ? void 0 : _l.client_ip_address;
                            status = client_1.LogStatus.success;
                            if (!(process.env.FB_MOCK === '1')) return [3 /*break*/, 3];
                            return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 100); })];
                        case 1:
                            _p.sent();
                            mock = {
                                events_received: (_o = (_m = payload === null || payload === void 0 ? void 0 : payload.data) === null || _m === void 0 ? void 0 : _m.length) !== null && _o !== void 0 ? _o : 1,
                                fbtrace_id: "MOCK-".concat(Math.random().toString(36).slice(2, 10)),
                                echo: { pixel_id: pixelId, first_event_id: eventId, version: this.graphVersion },
                            };
                            this.log.debug({ tag: 'fb-capi:mock', mock: mock });
                            responseData = mock;
                            return [4 /*yield*/, this.logs.createLog({
                                    userId: payload.userId,
                                    pixelId: pixelId,
                                    eventType: payload.eventType,
                                    eventId: eventId,
                                    status: status,
                                    responseData: mock,
                                    revenue: null,
                                    clientIp: clientIp,
                                    country: undefined,
                                })];
                        case 2:
                            _p.sent();
                            return [2 /*return*/, mock];
                        case 3:
                            url = "https://graph.facebook.com/".concat(this.graphVersion, "/").concat(encodeURIComponent(pixelId), "/events");
                            _p.label = 4;
                        case 4:
                            _p.trys.push([4, 6, 7, 9]);
                            return [4 /*yield*/, axios_1.default.post(url, payload, {
                                    params: { access_token: accessToken },
                                    headers: { 'Content-Type': 'application/json' },
                                    timeout: 7000,
                                })];
                        case 5:
                            _a = _p.sent(), data = _a.data, httpStatus = _a.status;
                            this.log.log({ tag: 'fb-capi', status: httpStatus, fbtrace_id: data === null || data === void 0 ? void 0 : data.fbtrace_id });
                            responseData = data;
                            status = client_1.LogStatus.success;
                            return [2 /*return*/, data];
                        case 6:
                            e_2 = _p.sent();
                            status = client_1.LogStatus.error;
                            err = e_2;
                            if (err.response) {
                                _b = err.response, httpStatus = _b.status, data = _b.data;
                                this.log.warn({ tag: 'fb-capi', status: httpStatus, body: data });
                                responseData = { error: "FB ".concat(httpStatus, ": ").concat(JSON.stringify(data)) };
                                throw new Error(responseData.error);
                            }
                            if (axios_1.default.isAxiosError(err)) {
                                this.log.error({ tag: 'fb-capi', stage: 'axios', error: err.message });
                                responseData = { error: "FB request failed: ".concat(err.message) };
                                throw new Error(responseData.error);
                            }
                            this.log.error({ tag: 'fb-capi', stage: 'unknown', error: String(e_2) });
                            responseData = { error: String(e_2) };
                            throw e_2;
                        case 7: return [4 /*yield*/, this.logs.createLog({
                                userId: payload.userId,
                                pixelId: pixelId,
                                eventType: payload.eventType,
                                eventId: eventId,
                                status: status,
                                responseData: responseData,
                                revenue: null,
                                clientIp: clientIp,
                                country: undefined,
                            })];
                        case 8:
                            _p.sent();
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        EventHandlerCoreService_1.prototype.payloadFbBuilder = function (input) {
            var _a, _b;
            var ts = Number.isFinite(input.eventTime) ? Number(input.eventTime) : Math.floor(Date.now() / 1000);
            var id = (_a = input.eventId) !== null && _a !== void 0 ? _a : Math.random().toString(36).slice(2, 12);
            var fbc = input.fbclid ? "fb.1.".concat(ts, ".").concat(input.fbclid) : undefined;
            var fbp = (_b = input.fbp) !== null && _b !== void 0 ? _b : "fb.1.".concat(ts, ".").concat(Math.floor(Math.random() * 1e12));
            var customBase = {
                content_ids: input.offerId ? [input.offerId] : undefined,
                content_type: input.offerId ? 'product' : undefined,
                content_category: input.utmSource || undefined,
            };
            var monetary = 'value' in input || 'currency' in input ? { value: input.value, currency: input.currency } : undefined;
            var event = {
                event_name: input.eventName,
                event_time: ts,
                event_id: id,
                action_source: 'website',
                event_source_url: input.sourceUrl,
                user_data: {
                    external_id: input.userId,
                    client_ip_address: input.clientIp,
                    client_user_agent: input.userAgent,
                    fbc: fbc,
                    fbp: fbp,
                },
                custom_data: __assign(__assign({}, customBase), (monetary !== null && monetary !== void 0 ? monetary : {})),
            };
            return { data: [event] };
        };
        return EventHandlerCoreService_1;
    }());
    __setFunctionName(_classThis, "EventHandlerCoreService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventHandlerCoreService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventHandlerCoreService = _classThis;
}();
exports.EventHandlerCoreService = EventHandlerCoreService;
