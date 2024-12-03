import { Request, Response } from 'express';
import DeliveryPartner from '../models/DeliveryPartner';

// Get all partners
export const getPartners = async (req: Request, res: Response) => {
  try {
    const partners = await DeliveryPartner.find();
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching partners', error });
  }
};

// Add a new partner
export const addPartner = async (req: Request, res: Response) => {
  try {
    const newPartner = new DeliveryPartner(req.body);
    const savedPartner = await newPartner.save();
    res.status(201).json(savedPartner);
  } catch (error) {
    res.status(400).json({ message: 'Error adding partner', error });
  }
};

// Update a partner
export const updatePartner = async (req: Request, res: Response) => {
  try {
    const updatedPartner = await DeliveryPartner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPartner);
  } catch (error) {
    res.status(400).json({ message: 'Error updating partner', error });
  }
};

// Delete a partner
export const deletePartner = async (req: Request, res: Response) => {
  try {
    await DeliveryPartner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting partner', error });
  }
};
