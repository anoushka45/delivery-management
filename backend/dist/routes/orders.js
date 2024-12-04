"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ordersController_1 = require("../controllers/ordersController");
const router = (0, express_1.Router)();
router.get('/', ordersController_1.getAllOrders);
router.post('/assign', ordersController_1.createAndAssignOrder);
router.put('/:id/status', ordersController_1.updateOrderStatus);
exports.default = router;
