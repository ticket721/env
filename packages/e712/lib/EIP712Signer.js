"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var bn_js_1 = require("bn.js");
/**
 * EIP712Domain Type, useful as it is always required inside the payload for the signature
 */
exports.EIP712DomainType = [
    {
        'name': 'name',
        'type': 'string'
    },
    {
        'name': 'version',
        'type': 'string'
    },
    {
        'name': 'chainId',
        'type': 'uint256'
    },
    {
        'name': 'verifyingContract',
        'type': 'address'
    }
];
/**
 * Byte32 zero value
 */
var B32Z = '0x0000000000000000000000000000000000000000000000000000000000000000';
/**
 * Helper class that takes types, domain and primary when built and is able to verify provided arguments, sign payload and verify signatures
 * This class should be extended by a custom class.
 */
var EIP712Signer = /** @class */ (function () {
    //    ______      _     _ _        _____      _             __
    //    | ___ \    | |   | (_)      |_   _|    | |           / _|
    //    | |_/ /   _| |__ | |_  ___    | | _ __ | |_ ___ _ __| |_ __ _  ___ ___
    //    |  __/ | | | '_ \| | |/ __|   | || '_ \| __/ _ \ '__|  _/ _` |/ __/ _ \
    //    | |  | |_| | |_) | | | (__   _| || | | | ||  __/ |  | || (_| | (_|  __/
    //    \_|   \__,_|_.__/|_|_|\___|  \___/_| |_|\__\___|_|  |_| \__,_|\___\___|
    /**
     * Sets all information related to the signatures that will be generated.
     *
     * @param domain Domain structure
     * @param primary_type Primary Type to use
     * @param types Arrays containing name and fields
     */
    function EIP712Signer(domain) {
        var e_1, _a;
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        /**
         * All types of current Signer
         */
        this.structs = {
            EIP712Domain: exports.EIP712DomainType
        };
        /**
         * Mandatory domain structure
         */
        this.domain = {
            name: null,
            version: null,
            verifyingContract: null,
            chainId: null
        };
        /**
         * Required for checks
         */
        this.REQUIRED_FIELDS = ['domain', 'types', 'message', 'primaryType'];
        this._setDomain(domain);
        try {
            for (var types_1 = __values(types), types_1_1 = types_1.next(); !types_1_1.done; types_1_1 = types_1.next()) {
                var type = types_1_1.value;
                this._addType(type[0], type[1]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (types_1_1 && !types_1_1.done && (_a = types_1.return)) _a.call(types_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    /**
     * Adds provided type to type list
     *
     * @param name Name of the type
     * @param struct Fields of the type
     * @private
     */
    EIP712Signer.prototype._addType = function (name, struct) {
        if (this.structs[name] !== undefined) {
            throw new Error("Type already exists " + name);
        }
        this.structs[name] = struct;
    };
    /**
     * Sets the domain (EIP712Domain) structure
     *
     * @param domain Domain structure
     * @private
     */
    EIP712Signer.prototype._setDomain = function (domain) {
        this.domain = domain;
    };
    /**
     * Encodes a single field. Works by calling itself recursively for complexe types or arrays
     *
     * @param type Name of the given field
     * @param value Value of the given field
     * @private
     */
    EIP712Signer.prototype._encodeDataTypeField = function (type, value) {
        var _this = this;
        // If it's a structure type
        if (this.structs[type]) {
            return ['bytes32', value === null ? B32Z : this._hashData(type, value)];
        }
        // If it's bytes or string, hash it
        if (type === 'bytes') {
            return ['bytes32', ethers_1.utils.keccak256(value)];
        }
        // If it's bytes or string, hash it
        if (type === 'string') {
            return ['bytes32', ethers_1.utils.keccak256(Buffer.from(value, 'utf8'))];
        }
        // If ends by [], it's an array
        if (type.lastIndexOf('[]') === type.length - 2) {
            var extracted_type_1 = type.slice(0, type.lastIndexOf('[]'));
            var encoded_array = value.map(function (elem) { return _this._encodeDataTypeField(extracted_type_1, elem); });
            var abie = new ethers_1.utils.AbiCoder();
            return ['bytes32', ethers_1.utils.keccak256(abie.encode(encoded_array.map(function (elem) { return elem[0]; }), encoded_array.map(function (elem) { return elem[1]; })))];
        }
        // If it arrives here, it means that it's standard type and no manipulations are required
        return [type, value];
    };
    /**
     * Encodes a type and all of its fields. Is often called recursively when dealing with structures inside structures ...
     *
     * @param name Name of the type
     * @param payload Object that is supposed to contain all fields for given type
     * @private
     */
    EIP712Signer.prototype._encodeData = function (name, payload) {
        var e_2, _a;
        var encodedTypes = ['bytes32'];
        var encodedData = [this._hashType(name)];
        try {
            for (var _b = __values(this.structs[name]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var field = _c.value;
                // Check if all fields of type are found
                if (payload[field.name] === undefined) {
                    throw new Error("Invalid Payload: at type " + name + ", missing field " + field.name);
                }
                var field_res = this._encodeDataTypeField(field.type, payload[field.name]);
                encodedTypes.push(field_res[0]);
                encodedData.push(field_res[1]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var abie = new ethers_1.utils.AbiCoder();
        return abie.encode(encodedTypes, encodedData);
    };
    /**
     * Applies a kecca256 hash to the result of _encodeData
     *
     * @param type Name of the type
     * @param data Object that is supposed to contain all fields for given type
     * @private
     */
    EIP712Signer.prototype._hashData = function (type, data) {
        return ethers_1.utils.keccak256(this._encodeData(type, data));
    };
    /**
     * Recursively finds all the dependencies of given type. Required to encode the type.
     *
     * @param type Name of the type
     * @param met Map that stores types already found in the recursive process
     * @private
     */
    EIP712Signer.prototype._getDependenciesOf = function (type, met) {
        var e_3, _a;
        if (met === void 0) { met = {}; }
        var result = [];
        // If type already found or is not a struct type, stop recursive process
        if (met[type] === true || this.structs[type] === undefined)
            return result;
        result.push(type);
        met[type] = true;
        try {
            for (var _b = __values(this.structs[type]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var field = _c.value;
                result = result.concat(this._getDependenciesOf(field.type, met));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return result;
    };
    /**
     * Taking all types, getting all dependencies, putting main type first then all the rest
     * sorted. 100% Inspired by what was done in eth-sig-util
     *
     * @param type
     * @private
     */
    EIP712Signer.prototype._encodeType = function (type) {
        var e_4, _a;
        var result = '';
        var dependencies = this._getDependenciesOf(type)
            .filter(function (dep) { return dep !== type; })
            .sort();
        dependencies = [type].concat(dependencies);
        try {
            for (var dependencies_1 = __values(dependencies), dependencies_1_1 = dependencies_1.next(); !dependencies_1_1.done; dependencies_1_1 = dependencies_1.next()) {
                var t = dependencies_1_1.value;
                result += t + "(" + this.structs[t]
                    .map(function (struct) { return struct.type + " " + struct.name; }).join(',') + ")";
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (dependencies_1_1 && !dependencies_1_1.done && (_a = dependencies_1.return)) _a.call(dependencies_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return result;
    };
    /**
     * Applies a kecca256 hash to the result of _encdeType
     *
     * @param type Name of the type
     * @private
     */
    EIP712Signer.prototype._hashType = function (type) {
        return ethers_1.utils.keccak256(Buffer.from(this._encodeType(type)));
    };
    /**
     * Helper that verifies the types field on the provided payload
     *
     * @param payload Payload to verify
     * @private
     */
    EIP712Signer.prototype._verifyTypes = function (payload) {
        var e_5, _a, e_6, _b, e_7, _c;
        var primary_type_dependencies = this._getDependenciesOf(payload.primaryType);
        var required_types = {
            'EIP712Domain': this.structs['EIP712Domain']
        };
        try {
            for (var primary_type_dependencies_1 = __values(primary_type_dependencies), primary_type_dependencies_1_1 = primary_type_dependencies_1.next(); !primary_type_dependencies_1_1.done; primary_type_dependencies_1_1 = primary_type_dependencies_1.next()) {
                var dep = primary_type_dependencies_1_1.value;
                required_types[dep] = this.structs[dep];
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (primary_type_dependencies_1_1 && !primary_type_dependencies_1_1.done && (_a = primary_type_dependencies_1.return)) _a.call(primary_type_dependencies_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        if (Object.keys(payload.types).length !== Object.keys(required_types).length) {
            throw new Error("Invalid Types in given payload: got " + Object.keys(payload.types) + ", expect " + Object.keys(required_types));
        }
        try {
            for (var _d = __values(Object.keys(payload.types)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var type = _e.value;
                if (!this.structs[type])
                    throw new Error("Unknown type " + type);
                var current_type = payload.types[type];
                var registered_current_type = this.structs[type];
                var _loop_1 = function (field) {
                    var eq_idx = registered_current_type.findIndex(function (eq_field) { return eq_field.name === field.name; });
                    if (eq_idx === -1)
                        throw new Error("Error in " + type + " type: unknwon field with name " + field.name);
                    if (field.type !== registered_current_type[eq_idx].type)
                        throw new Error("Error in " + type + " type: mismatch in field types: got " + field.type + ", expected " + registered_current_type[eq_idx].type);
                };
                try {
                    for (var current_type_1 = (e_7 = void 0, __values(current_type)), current_type_1_1 = current_type_1.next(); !current_type_1_1.done; current_type_1_1 = current_type_1.next()) {
                        var field = current_type_1_1.value;
                        _loop_1(field);
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (current_type_1_1 && !current_type_1_1.done && (_c = current_type_1.return)) _c.call(current_type_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    /**
     * Helper that verifies the domain field on the provided payload
     *
     * @param payload Payload to verify
     * @private
     */
    EIP712Signer.prototype._verifyDomain = function (payload) {
        var e_8, _a;
        try {
            for (var _b = __values(this.structs['EIP712Domain']), _c = _b.next(); !_c.done; _c = _b.next()) {
                var field = _c.value;
                if (payload.domain[field.name] === undefined)
                    throw new Error("Missing field in domain: " + field.name);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
    };
    /**
     * Helper that verifies the primaryType field on the provided payload
     *
     * @param payload Payload to verify
     * @private
     */
    EIP712Signer.prototype._verifyPrimaryType = function (payload) {
        if (!this.structs[payload.primaryType]) {
            throw new Error("Invalid primary type " + payload.primaryType + ": unknown type");
        }
    };
    /**
     * Helper that verifies that all required fields are present
     *
     * @param payload Payload to verify
     * @private
     */
    EIP712Signer.prototype._verifyMainPayloadField = function (payload) {
        var e_9, _a;
        if (Object.keys(payload).length !== this.REQUIRED_FIELDS.length) {
            throw new Error("Invalid payload: has fields " + Object.keys(payload) + ", should have " + this.REQUIRED_FIELDS);
        }
        try {
            for (var _b = __values(this.REQUIRED_FIELDS), _c = _b.next(); !_c.done; _c = _b.next()) {
                var req = _c.value;
                if (!Object.keys(payload).includes(req)) {
                    throw new Error("Missing " + req + " field in payload");
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
    };
    /**
     * Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.
     *
     * @param num Signed integer value
     */
    EIP712Signer.prototype._fromSigned = function (num) {
        return new bn_js_1.BN(Buffer.from(num.slice(2), 'hex')).fromTwos(256);
    };
    /**
     * Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.
     *
     * @param num
     */
    EIP712Signer.prototype._toUnsigned = function (num) {
        return Buffer.from(num.toTwos(256).toArray());
    };
    /**
     * Pads provided string value to match provided length value.
     *
     * @param toPad Starting string to pad
     * @param length Target length
     * @private
     */
    EIP712Signer._padWithZeroes = function (toPad, length) {
        var myString = '' + toPad;
        while (myString.length < length) {
            myString = '0' + myString;
        }
        return myString;
    };
    /**
     * Throws if provided payload does not match current settings
     *
     * @param payload Payload to verify
     */
    EIP712Signer.prototype.verifyPayload = function (payload) {
        this._verifyMainPayloadField(payload);
        this._verifyTypes(payload);
        this._verifyDomain(payload);
        this._verifyPrimaryType(payload);
        void this.encode(payload);
    };
    /**
     * Encode the given payload
     *
     * @param payload Payload to encode
     * @param verify True if verifications should be made
     */
    EIP712Signer.prototype.encode = function (payload, verify) {
        if (verify === void 0) { verify = false; }
        this._verifyMainPayloadField(payload);
        if (verify) {
            this._verifyTypes(payload);
            this._verifyDomain(payload);
            this._verifyPrimaryType(payload);
        }
        // Magic Number
        var result = [Buffer.from('1901', 'hex')];
        result.push(Buffer.from(this._hashData('EIP712Domain', payload.domain).slice(2), 'hex'));
        if (payload.primaryType !== 'EIP712Domain') {
            result.push(Buffer.from(this._hashData(payload.primaryType, payload.message).slice(2), 'hex'));
        }
        return ethers_1.utils.keccak256(Buffer.concat(result));
    };
    /**
     * Sign the given payload
     *
     * @param privateKey Private key to use
     * @param payload Payload to sign
     * @param verify True if verifications should be made
     */
    EIP712Signer.prototype.sign = function (privateKey, payload, verify) {
        if (verify === void 0) { verify = false; }
        return __awaiter(this, void 0, void 0, function () {
            var sk, encoded_payload, signature, rSig, sSig, vSig, rStr, sStr, vStr;
            return __generator(this, function (_a) {
                sk = new ethers_1.utils.SigningKey(privateKey);
                encoded_payload = this.encode(payload, verify);
                signature = sk.signDigest(Buffer.from(encoded_payload.slice(2), 'hex'));
                rSig = this._fromSigned(signature.r);
                sSig = this._fromSigned(signature.s);
                vSig = signature.v;
                rStr = EIP712Signer._padWithZeroes(this._toUnsigned(rSig).toString('hex'), 64);
                sStr = EIP712Signer._padWithZeroes(this._toUnsigned(sSig).toString('hex'), 64);
                vStr = vSig.toString(16);
                return [2 /*return*/, {
                        hex: "0x" + rStr + sStr + vStr,
                        v: vSig,
                        r: rStr,
                        s: sStr
                    }];
            });
        });
    };
    /**
     * Verifies the given signature
     *
     * @param payload Payload used to generate the signature
     * @param signature Signature to verify
     * @param verify True if payload verifications should be made
     */
    EIP712Signer.prototype.verify = function (payload, signature, verify) {
        if (verify === void 0) { verify = false; }
        return __awaiter(this, void 0, void 0, function () {
            var encoded_payload;
            return __generator(this, function (_a) {
                encoded_payload = this.encode(payload, verify);
                return [2 /*return*/, ethers_1.utils.recoverAddress(Buffer.from(encoded_payload.slice(2), 'hex'), signature)];
            });
        });
    };
    /**
     * Helper that generates a complete payload, ready for signature (should work with web3, metamask etc)
     *
     * @param data Message field in the generated payload
     * @param primaryType Main type of given data
     */
    EIP712Signer.prototype.generatePayload = function (data, primaryType) {
        var e_10, _a;
        var dependencies = this._getDependenciesOf(primaryType);
        var types = {};
        try {
            for (var dependencies_2 = __values(dependencies), dependencies_2_1 = dependencies_2.next(); !dependencies_2_1.done; dependencies_2_1 = dependencies_2.next()) {
                var dep = dependencies_2_1.value;
                types[dep] = this.structs[dep];
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (dependencies_2_1 && !dependencies_2_1.done && (_a = dependencies_2.return)) _a.call(dependencies_2);
            }
            finally { if (e_10) throw e_10.error; }
        }
        types['EIP712Domain'] = this.structs['EIP712Domain'];
        return {
            domain: this.domain,
            primaryType: primaryType,
            types: types,
            message: data
        };
    };
    return EIP712Signer;
}());
exports.EIP712Signer = EIP712Signer;
