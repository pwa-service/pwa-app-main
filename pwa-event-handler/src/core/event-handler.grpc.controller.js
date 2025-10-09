"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandlerGrpcController = void 0;
var common_1 = require("@nestjs/common");
var microservices_1 = require("@nestjs/microservices");
var grpc_client_meta_interceptor_1 = require("../common/interceptors/grpc-client-meta.interceptor");
var EventHandlerGrpcController = function () {
    var _classDecorators = [(0, common_1.Controller)(), (0, common_1.UseInterceptors)(grpc_client_meta_interceptor_1.GrpcClientMetaInterceptor)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _ViewContent_decorators;
    var _PrepareInstallLink_decorators;
    var _PwaFirstOpen_decorators;
    var _Lead_decorators;
    var _CompleteRegistration_decorators;
    var _Purchase_decorators;
    var _Subscribe_decorators;
    var EventHandlerGrpcController = _classThis = /** @class */ (function () {
        function EventHandlerGrpcController_1(core) {
            this.core = (__runInitializers(this, _instanceExtraInitializers), core);
        }
        EventHandlerGrpcController_1.prototype.ViewContent = function (dto) {
            return this.core.viewContent(dto);
        };
        EventHandlerGrpcController_1.prototype.PrepareInstallLink = function (dto) {
            return this.core.prepareInstallLink(dto);
        };
        EventHandlerGrpcController_1.prototype.PwaFirstOpen = function (dto) {
            return this.core.pwaFirstOpen(dto);
        };
        EventHandlerGrpcController_1.prototype.Lead = function (dto) {
            return this.core.lead(dto);
        };
        EventHandlerGrpcController_1.prototype.CompleteRegistration = function (dto) {
            return this.core.completeRegistration(dto);
        };
        EventHandlerGrpcController_1.prototype.Purchase = function (dto) {
            return this.core.purchase(dto);
        };
        EventHandlerGrpcController_1.prototype.Subscribe = function (dto) {
            return this.core.subscribe(dto);
        };
        return EventHandlerGrpcController_1;
    }());
    __setFunctionName(_classThis, "EventHandlerGrpcController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _ViewContent_decorators = [(0, microservices_1.GrpcMethod)('EventHandlerService', 'ViewContent')];
        _PrepareInstallLink_decorators = [(0, microservices_1.GrpcMethod)('EventHandlerService', 'PrepareInstallLink')];
        _PwaFirstOpen_decorators = [(0, microservices_1.GrpcMethod)('EventHandlerService', 'PwaFirstOpen')];
        _Lead_decorators = [(0, microservices_1.GrpcMethod)('EventHandlerService', 'Lead')];
        _CompleteRegistration_decorators = [(0, microservices_1.GrpcMethod)('EventHandlerService', 'CompleteRegistration')];
        _Purchase_decorators = [(0, microservices_1.GrpcMethod)('EventHandlerService', 'Purchase')];
        _Subscribe_decorators = [(0, microservices_1.GrpcMethod)('EventHandlerService', 'Subscribe')];
        __esDecorate(_classThis, null, _ViewContent_decorators, { kind: "method", name: "ViewContent", static: false, private: false, access: { has: function (obj) { return "ViewContent" in obj; }, get: function (obj) { return obj.ViewContent; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _PrepareInstallLink_decorators, { kind: "method", name: "PrepareInstallLink", static: false, private: false, access: { has: function (obj) { return "PrepareInstallLink" in obj; }, get: function (obj) { return obj.PrepareInstallLink; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _PwaFirstOpen_decorators, { kind: "method", name: "PwaFirstOpen", static: false, private: false, access: { has: function (obj) { return "PwaFirstOpen" in obj; }, get: function (obj) { return obj.PwaFirstOpen; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _Lead_decorators, { kind: "method", name: "Lead", static: false, private: false, access: { has: function (obj) { return "Lead" in obj; }, get: function (obj) { return obj.Lead; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _CompleteRegistration_decorators, { kind: "method", name: "CompleteRegistration", static: false, private: false, access: { has: function (obj) { return "CompleteRegistration" in obj; }, get: function (obj) { return obj.CompleteRegistration; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _Purchase_decorators, { kind: "method", name: "Purchase", static: false, private: false, access: { has: function (obj) { return "Purchase" in obj; }, get: function (obj) { return obj.Purchase; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _Subscribe_decorators, { kind: "method", name: "Subscribe", static: false, private: false, access: { has: function (obj) { return "Subscribe" in obj; }, get: function (obj) { return obj.Subscribe; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventHandlerGrpcController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventHandlerGrpcController = _classThis;
}();
exports.EventHandlerGrpcController = EventHandlerGrpcController;
