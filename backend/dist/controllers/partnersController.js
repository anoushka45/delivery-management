"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePartner = exports.updatePartner = exports.addPartner = exports.getPartners = void 0;
const DeliveryPartner_1 = __importDefault(require("../models/DeliveryPartner"));
// Get all partners
const getPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partners = yield DeliveryPartner_1.default.find();
        res.status(200).json(partners);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching partners', error });
    }
});
exports.getPartners = getPartners;
// Add a new partner
const addPartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPartner = new DeliveryPartner_1.default(req.body);
        const savedPartner = yield newPartner.save();
        res.status(201).json(savedPartner);
    }
    catch (error) {
        res.status(400).json({ message: 'Error adding partner', error });
    }
});
exports.addPartner = addPartner;
// Update a partner
const updatePartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPartner = yield DeliveryPartner_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPartner);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating partner', error });
    }
});
exports.updatePartner = updatePartner;
// Delete a partner
const deletePartner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield DeliveryPartner_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Partner deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Error deleting partner', error });
    }
});
exports.deletePartner = deletePartner;
