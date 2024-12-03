import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import Order from '../models/Order';
import DeliveryPartner from '../models/DeliveryPartner';


// Get all assignments
export const getAllAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find();
    
    if (!assignments.length) {
      res.status(404).json({ message: 'No assignments found' });
      return;
    }

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error });
  }
};


// Get assignment metrics
export const getAssignmentMetrics = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find();

    const totalAssigned = assignments.length;
    const successRate = (assignments.filter(a => a.status === 'success').length / totalAssigned) * 100;
    const averageTime = assignments.reduce((acc, a) => acc + (a.timestamp ? new Date(a.timestamp).getTime() : 0), 0) / totalAssigned;

    const failureReasons = assignments
      .filter(a => a.status === 'failed' && a.reason)
      .reduce((acc, a) => {
        acc[a.reason!] = (acc[a.reason!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    res.status(200).json({
      totalAssigned,
      successRate,
      averageTime,
      failureReasons: Object.entries(failureReasons).map(([reason, count]) => ({ reason, count })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignment metrics', error });
  }
};

// Run assignment
export const runAssignment = async (req: Request, res: Response) => {
  const { orderId, partnerId } = req.body;

  try {
    const order = await Order.findById(orderId);
    const partner = await DeliveryPartner.findById(partnerId);

    if (!order || !partner) {
      res.status(404).json({ message: 'Order or partner not found' });
      return;
    }

    if (partner.currentLoad >= 3) {
      const assignment = new Assignment({
        orderId,
        partnerId,
        status: 'failed',
        reason: 'Partner at maximum load',
      });
      await assignment.save();
      res.status(400).json({ message: 'Partner is at maximum load', assignment });
      return;
    }

    const assignment = new Assignment({
      orderId,
      partnerId,
      status: 'success',
    });
    await assignment.save();

    order.status = 'assigned';
    order.assignedTo = partnerId;
    await order.save();

    partner.currentLoad += 1;
    await partner.save();

    res.status(200).json({ message: 'Assignment successful', assignment });
  } catch (error) {
    res.status(500).json({ message: 'Error running assignment', error });
  }
};


export const getPartnerOverview = async (req: Request, res: Response) => {
  try {
    // Fetch all partners
    const partners = await DeliveryPartner.find();

    let available = 0; // Active and currentLoad < 3
    let busy = 0;      // Active and currentLoad >= 3
    let offline = 0;   // Inactive

    partners.forEach((partner) => {
      if (partner.status === 'inactive') {
        offline++;
      } else if (partner.currentLoad >= 3) {
        busy++;
      } else {
        available++;
      }
    });

    res.status(200).json({
      available,
      busy,
      offline,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching partner overview',
      error,
    });
  }
};