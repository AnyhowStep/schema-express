"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_decorator_1 = require("schema-decorator");
class SchemaHandler {
    static Create(getRaw, setRaw, assertion) {
        return (req, res, next) => {
            let raw = getRaw(req, res);
            if (raw.value == undefined) {
                raw.value = {};
            }
            const value = schema_decorator_1.toClassOrAssert(raw.name, raw.value, assertion);
            setRaw(req, res, value);
            next();
        };
    }
    static CreateParameter(assertion) {
        return SchemaHandler.Create((req) => {
            return {
                name: "parameter",
                value: req.params,
            };
        }, (req, _res, value) => {
            req.params = value;
        }, assertion);
    }
    static CreateQuery(assertion) {
        return SchemaHandler.Create((req) => {
            return {
                name: "query",
                value: req.query,
            };
        }, (req, _res, value) => {
            req.query = value;
        }, assertion);
    }
    static CreateBody(assertion) {
        return SchemaHandler.Create((req) => {
            return {
                name: "body",
                value: req.body,
            };
        }, (req, _res, value) => {
            req.body = value;
        }, assertion);
    }
}
exports.SchemaHandler = SchemaHandler;
//# sourceMappingURL=SchemaHandler.js.map