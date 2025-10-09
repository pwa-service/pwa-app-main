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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseDto = void 0;
var class_validator_1 = require("class-validator");
var PurchaseDto = function () {
    var _a;
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _pwaDomain_decorators;
    var _pwaDomain_initializers = [];
    var _pwaDomain_extraInitializers = [];
    var _landingUrl_decorators;
    var _landingUrl_initializers = [];
    var _landingUrl_extraInitializers = [];
    var _queryStringRaw_decorators;
    var _queryStringRaw_initializers = [];
    var _queryStringRaw_extraInitializers = [];
    var _value_decorators;
    var _value_initializers = [];
    var _value_extraInitializers = [];
    var _currency_decorators;
    var _currency_initializers = [];
    var _currency_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PurchaseDto() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.pwaDomain = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _pwaDomain_initializers, void 0));
                this.landingUrl = (__runInitializers(this, _pwaDomain_extraInitializers), __runInitializers(this, _landingUrl_initializers, void 0));
                this.queryStringRaw = (__runInitializers(this, _landingUrl_extraInitializers), __runInitializers(this, _queryStringRaw_initializers, void 0));
                this.value = (__runInitializers(this, _queryStringRaw_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.currency = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
            return PurchaseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, class_validator_1.IsString)()];
            _pwaDomain_decorators = [(0, class_validator_1.IsString)()];
            _landingUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUrl)({ require_protocol: true })];
            _queryStringRaw_decorators = [(0, class_validator_1.IsOptional)()];
            _value_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsPositive)()];
            _currency_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _pwaDomain_decorators, { kind: "field", name: "pwaDomain", static: false, private: false, access: { has: function (obj) { return "pwaDomain" in obj; }, get: function (obj) { return obj.pwaDomain; }, set: function (obj, value) { obj.pwaDomain = value; } }, metadata: _metadata }, _pwaDomain_initializers, _pwaDomain_extraInitializers);
            __esDecorate(null, null, _landingUrl_decorators, { kind: "field", name: "landingUrl", static: false, private: false, access: { has: function (obj) { return "landingUrl" in obj; }, get: function (obj) { return obj.landingUrl; }, set: function (obj, value) { obj.landingUrl = value; } }, metadata: _metadata }, _landingUrl_initializers, _landingUrl_extraInitializers);
            __esDecorate(null, null, _queryStringRaw_decorators, { kind: "field", name: "queryStringRaw", static: false, private: false, access: { has: function (obj) { return "queryStringRaw" in obj; }, get: function (obj) { return obj.queryStringRaw; }, set: function (obj, value) { obj.queryStringRaw = value; } }, metadata: _metadata }, _queryStringRaw_initializers, _queryStringRaw_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: function (obj) { return "value" in obj; }, get: function (obj) { return obj.value; }, set: function (obj, value) { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: function (obj) { return "currency" in obj; }, get: function (obj) { return obj.currency; }, set: function (obj, value) { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PurchaseDto = PurchaseDto;
