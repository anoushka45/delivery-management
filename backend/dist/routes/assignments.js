"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignmentsController_1 = require("../controllers/assignmentsController");
const router = (0, express_1.Router)();
router.get('/metrics', assignmentsController_1.getAssignmentMetrics);
router.post('/run', assignmentsController_1.runAssignment);
router.get('/', assignmentsController_1.getAllAssignments);
router.get('/partners/overview', assignmentsController_1.getPartnerOverview);
exports.default = router;
