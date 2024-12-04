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
exports.updateOrderStatus = exports.createAndAssignOrder = exports.getAllOrders = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const DeliveryPartner_1 = __importDefault(require("../models/DeliveryPartner"));
const Assignment_1 = __importDefault(require("../models/Assignment"));
// Get all orders
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find().populate('assignedTo', 'name email phone'); // Populate delivery partner info
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error });
    }
});
exports.getAllOrders = getAllOrders;
// Create and assign an order
const createAndAssignOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderNumber, customer, area, items, scheduledFor, totalAmount } = req.body;
    try {
        const newOrder = new Order_1.default({
            orderNumber,
            customer,
            area,
            items,
            status: 'pending',
            scheduledFor,
            totalAmount,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const savedOrder = yield newOrder.save();
        const availablePartner = yield DeliveryPartner_1.default.findOne({
            areas: area,
            status: 'active',
            currentLoad: { $lt: 3 },
        }).sort({ currentLoad: 1 });
        if (!availablePartner) {
            const failedAssignment = new Assignment_1.default({
                orderId: savedOrder._id,
                // partnerId: null,
                status: 'failed',
                reason: 'No available delivery partner found',
            });
            yield failedAssignment.save();
            res.status(400).json({
                message: 'No available delivery partner found for the area',
                order: savedOrder,
            });
            return;
        }
        savedOrder.status = 'assigned';
        savedOrder.assignedTo = availablePartner._id;
        yield savedOrder.save();
        availablePartner.currentLoad += 1;
        yield availablePartner.save();
        const successfulAssignment = new Assignment_1.default({
            orderId: savedOrder._id,
            partnerId: availablePartner._id,
            status: 'success',
        });
        yield successfulAssignment.save();
        res.status(201).json({
            message: 'Order created and assigned successfully',
            order: savedOrder,
            assignedTo: availablePartner,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error creating and assigning order',
            error: error,
        });
    }
});
exports.createAndAssignOrder = createAndAssignOrder;
// Update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const order = yield Order_1.default.findById(id);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        if (status === 'delivered' && order.assignedTo) {
            // Decrease partner's load if the order is delivered
            const partner = yield DeliveryPartner_1.default.findById(order.assignedTo);
            if (partner) {
                partner.currentLoad -= 1;
                yield partner.save();
            }
        }
        order.status = status;
        order.updatedAt = new Date();
        yield order.save();
        res.status(200).json({ message: 'Order status updated successfully', order });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error updating order status',
            error: error,
        });
    }
});
exports.updateOrderStatus = updateOrderStatus;
