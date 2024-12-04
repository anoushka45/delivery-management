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
exports.getPartnerOverview = exports.runAssignment = exports.getAssignmentMetrics = exports.getAllAssignments = void 0;
const Assignment_1 = __importDefault(require("../models/Assignment"));
const Order_1 = __importDefault(require("../models/Order"));
const DeliveryPartner_1 = __importDefault(require("../models/DeliveryPartner"));
// Get all assignments
const getAllAssignments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignments = yield Assignment_1.default.find();
        if (!assignments.length) {
            res.status(404).json({ message: 'No assignments found' });
            return;
        }
        res.status(200).json(assignments);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching assignments', error });
    }
});
exports.getAllAssignments = getAllAssignments;
// Get assignment metrics
const getAssignmentMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignments = yield Assignment_1.default.find();
        const totalAssigned = assignments.length;
        const successRate = (assignments.filter(a => a.status === 'success').length / totalAssigned) * 100;
        const averageTime = assignments.reduce((acc, a) => acc + (a.timestamp ? new Date(a.timestamp).getTime() : 0), 0) / totalAssigned;
        const failureReasons = assignments
            .filter(a => a.status === 'failed' && a.reason)
            .reduce((acc, a) => {
            acc[a.reason] = (acc[a.reason] || 0) + 1;
            return acc;
        }, {});
        res.status(200).json({
            totalAssigned,
            successRate,
            averageTime,
            failureReasons: Object.entries(failureReasons).map(([reason, count]) => ({ reason, count })),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching assignment metrics', error });
    }
});
exports.getAssignmentMetrics = getAssignmentMetrics;
// Run assignment
const runAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, partnerId } = req.body;
    try {
        const order = yield Order_1.default.findById(orderId);
        const partner = yield DeliveryPartner_1.default.findById(partnerId);
        if (!order || !partner) {
            res.status(404).json({ message: 'Order or partner not found' });
            return;
        }
        if (partner.currentLoad >= 3) {
            const assignment = new Assignment_1.default({
                orderId,
                partnerId,
                status: 'failed',
                reason: 'Partner at maximum load',
            });
            yield assignment.save();
            res.status(400).json({ message: 'Partner is at maximum load', assignment });
            return;
        }
        const assignment = new Assignment_1.default({
            orderId,
            partnerId,
            status: 'success',
        });
        yield assignment.save();
        order.status = 'assigned';
        order.assignedTo = partnerId;
        yield order.save();
        partner.currentLoad += 1;
        yield partner.save();
        res.status(200).json({ message: 'Assignment successful', assignment });
    }
    catch (error) {
        res.status(500).json({ message: 'Error running assignment', error });
    }
});
exports.runAssignment = runAssignment;
const getPartnerOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all partners
        const partners = yield DeliveryPartner_1.default.find();
        let available = 0; // Active and currentLoad < 3
        let busy = 0; // Active and currentLoad >= 3
        let offline = 0; // Inactive
        partners.forEach((partner) => {
            if (partner.status === 'inactive') {
                offline++;
            }
            else if (partner.currentLoad >= 3) {
                busy++;
            }
            else {
                available++;
            }
        });
        res.status(200).json({
            available,
            busy,
            offline,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching partner overview',
            error,
        });
    }
});
exports.getPartnerOverview = getPartnerOverview;
