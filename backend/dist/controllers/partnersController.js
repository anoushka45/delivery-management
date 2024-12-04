"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePartner = exports.updatePartner = exports.addPartner = exports.getPartners = void 0;
const DeliveryPartner_1 = __importDefault(require("../models/DeliveryPartner"));
// Get all partners
const getPartners = async (req, res) => {
    try {
        const partners = await DeliveryPartner_1.default.find();
        res.status(200).json(partners);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching partners', error });
    }
};
exports.getPartners = getPartners;
// Add a new partner
const addPartner = async (req, res) => {
    try {
        const newPartner = new DeliveryPartner_1.default(req.body);
        const savedPartner = await newPartner.save();
        res.status(201).json(savedPartner);
    }
    catch (error) {
        res.status(400).json({ message: 'Error adding partner', error });
    }
};
exports.addPartner = addPartner;
// Update a partner
const updatePartner = async (req, res) => {
    try {
        const updatedPartner = await DeliveryPartner_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPartner);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating partner', error });
    }
};
exports.updatePartner = updatePartner;
// Delete a partner
const deletePartner = async (req, res) => {
    try {
        await DeliveryPartner_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Partner deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Error deleting partner', error });
    }
};
exports.deletePartner = deletePartner;
