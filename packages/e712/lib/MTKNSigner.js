"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var EIP712Signer_1 = require("./EIP712Signer");
var ethers_1 = require("ethers");
exports.MTKNTypes = {
    EIP712Domain: EIP712Signer_1.EIP712DomainType,
    mActors: [
        {
            name: 'signer',
            type: 'address'
        },
        {
            name: 'relayer',
            type: 'address'
        }
    ],
    mTxParams: [
        {
            name: 'nonce',
            type: 'uint256'
        },
        {
            name: 'gasLimit',
            type: 'uint256'
        },
        {
            name: 'gasPrice',
            type: 'uint256'
        },
        {
            name: 'reward',
            type: 'uint256'
        }
    ],
    mTransfer: [
        {
            name: 'recipient',
            type: 'address'
        },
        {
            name: 'amount',
            type: 'uint256'
        },
        {
            name: 'actors',
            type: 'mActors'
        },
        {
            name: 'txparams',
            type: 'mTxParams'
        }
    ],
    mApprove: [
        {
            name: 'spender',
            type: 'address'
        },
        {
            name: 'amount',
            type: 'uint256'
        },
        {
            name: 'actors',
            type: 'mActors'
        },
        {
            name: 'txparams',
            type: 'mTxParams'
        }
    ],
    mTransferFrom: [
        {
            name: 'sender',
            type: 'address'
        },
        {
            name: 'recipient',
            type: 'address'
        },
        {
            name: 'amount',
            type: 'uint256'
        },
        {
            name: 'actors',
            type: 'mActors'
        },
        {
            name: 'txparams',
            type: 'mTxParams'
        }
    ]
};
/**
 * @description Helper class to generate mTKN signatures
 */
var MTKNSigner = /** @class */ (function (_super) {
    __extends(MTKNSigner, _super);
    function MTKNSigner(domain_name, domain_version, domain_chain_id, domain_contract) {
        return _super.call(this, {
            name: domain_name,
            version: domain_version,
            chainId: domain_chain_id,
            verifyingContract: domain_contract
        }, ['mActors', exports.MTKNTypes.mActors], ['mTxParams', exports.MTKNTypes.mTxParams], ['mTransfer', exports.MTKNTypes.mTransfer], ['mApprove', exports.MTKNTypes.mApprove], ['mTransferFrom', exports.MTKNTypes.mTransferFrom]) || this;
    }
    /**
     * @description Generates `transfer` signature or payload.
     *
     * @param recipient
     * @param amount
     * @param actors
     * @param txparams
     * @param private_key If provided, generates signature, otherwise generates payload
     */
    MTKNSigner.prototype.transfer = function (recipient, amount, actors, txparams, private_key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (private_key) {
                    return [2 /*return*/, this.sign(private_key, this.generatePayload({
                            recipient: recipient,
                            amount: amount,
                            actors: actors,
                            txparams: txparams
                        }, 'mTransfer'))];
                }
                else {
                    return [2 /*return*/, this.generatePayload({
                            recipient: recipient,
                            amount: amount,
                            actors: actors,
                            txparams: txparams
                        }, 'mTransfer')];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * @description Verifies `transfer` signature
     *
     * @param recipient
     * @param amount
     * @param actors
     * @param txparams
     * @param signature
     */
    MTKNSigner.prototype.verifyTransfer = function (recipient, amount, actors, txparams, signature) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, signer, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        payload = this.generatePayload({
                            recipient: recipient,
                            amount: amount,
                            actors: actors,
                            txparams: txparams
                        }, 'mTransfer');
                        _b = (_a = ethers_1.utils).getAddress;
                        return [4 /*yield*/, this.verify(payload, signature)];
                    case 1:
                        signer = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, signer === ethers_1.utils.getAddress(actors.signer)];
                }
            });
        });
    };
    /**
     * @description Generates `approve` signature or payload.
     *
     * @param spender
     * @param amount
     * @param actors
     * @param txparams
     * @param private_key If provided, generates signature, otherwise generates payload
     */
    MTKNSigner.prototype.approve = function (spender, amount, actors, txparams, private_key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (private_key) {
                    return [2 /*return*/, this.sign(private_key, this.generatePayload({
                            spender: spender,
                            amount: amount,
                            actors: actors,
                            txparams: txparams
                        }, 'mApprove'))];
                }
                else {
                    return [2 /*return*/, this.generatePayload({
                            spender: spender,
                            amount: amount,
                            actors: actors,
                            txparams: txparams
                        }, 'mApprove')];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * @description Verifies `approve` signature
     *
     * @param spender
     * @param amount
     * @param actors
     * @param txparams
     * @param signature
     */
    MTKNSigner.prototype.verifyApprove = function (spender, amount, actors, txparams, signature) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, signer, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        payload = this.generatePayload({
                            spender: spender,
                            amount: amount,
                            actors: actors,
                            txparams: txparams
                        }, 'mApprove');
                        _b = (_a = ethers_1.utils).getAddress;
                        return [4 /*yield*/, this.verify(payload, signature)];
                    case 1:
                        signer = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, signer === ethers_1.utils.getAddress(actors.signer)];
                }
            });
        });
    };
    /**
     * @description Generates `transferFrom` signature or payload.
     *
     * @param sender
     * @param recipient
     * @param amount
     * @param actors
     * @param txparams
     * @param private_key If provided, generates signature, otherwise generates payload
     */
    MTKNSigner.prototype.transferFrom = function (sender, recipient, amount, actors, txparams, private_key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (private_key) {
                    return [2 /*return*/, this.sign(private_key, this.generatePayload({
                            sender: sender,
                            recipient: recipient,
                            amount: amount,
                            actors: actors,
                            txparams: txparams
                        }, 'mTransferFrom'))];
                }
                else {
                    return [2 /*return*/, this.generatePayload({
                            sender: sender,
                            recipient: recipient,
                            amount: amount,
                            actors: actors,
                            txparams: txparams
                        }, 'mTransferFrom')];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * @description Verifies `transferFrom` signature
     *
     * @param sender
     * @param recipient
     * @param amount
     * @param actors
     * @param txparams
     * @param signature
     */
    MTKNSigner.prototype.verifyTransferFrom = function (sender, recipient, amount, actors, txparams, signature) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, signer, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        payload = this.generatePayload({
                            sender: sender,
                            recipient: recipient,
                            amount: amount,
                            actors: actors,
                            txparams: txparams
                        }, 'mTransferFrom');
                        _b = (_a = ethers_1.utils).getAddress;
                        return [4 /*yield*/, this.verify(payload, signature)];
                    case 1:
                        signer = _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, signer === ethers_1.utils.getAddress(actors.signer)];
                }
            });
        });
    };
    return MTKNSigner;
}(EIP712Signer_1.EIP712Signer));
exports.MTKNSigner = MTKNSigner;
