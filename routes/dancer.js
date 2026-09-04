import express from 'express';
import mongoose from 'mongoose';
import Dancer from '../models/Dancer.js';
import { getChart, getCards, getTents } from '../pdf.js';

const dancerRouter = express.Router();

// get all dancers
dancerRouter.get('/', async (req, res, next) => {
    try {
        const dancers = await Dancer.find()
            .sort({ lastName: 1, firstName: 1 })
            .collation({ locale: 'en', strength: 2 });
        res.json(dancers);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// get dancer by ID
dancerRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Dancer not found.');
        }

        const dancer = await Dancer.findById(req.params.id);

        if (!dancer) {
            res.status(404);
            throw new Error('Dancer not found.');
        }

        res.json(dancer);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// get place cards
dancerRouter.get('/pdf/cards', async (req, res, next) => {
    try {
        const dancers = await Dancer.find().sort({ table: 1, seat: 1 });
        const pdfBytes = await getCards(dancers);
        res.contentType('application/pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// get seating chart
dancerRouter.get('/pdf/chart', async (req, res, next) => {
    try {
        const dancers = await Dancer.find().sort({ table: 1, seat: 1 });
        const pdfBytes = await getChart(dancers);
        res.send(pdfBytes);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// get table tents
dancerRouter.get('/pdf/tents', async (req, res, next) => {
    try {
        const pdfBytes = await getTents();
        res.contentType('application/octet-stream');
        res.send(pdfBytes);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// add new dancer
dancerRouter.post('/', async (req, res, next) => {
    try {
        const { firstName, lastName } = req.body;

        if (!firstName?.trim() || !lastName?.trim()) {
            res.status(400);
            throw new Error('First name and last name are required.');
        }

        const newDancer = new Dancer({
            firstName,
            lastName,
            table: null,
            seat: null,
        });

        const savedDancer = await newDancer.save();
        res.status(201).json(savedDancer);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// delete existing dancer
dancerRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Dancer not found.');
        }

        const dancer = await Dancer.findById(id);

        if (!dancer) {
            res.status(404);
            throw new Error('Dancer not found.');
        }

        await dancer.deleteOne();
        res.json({ message: 'Dancer deleted successfully.' });
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// update dancer first and last names
dancerRouter.patch('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Dancer not found.');
        }

        const dancer = await Dancer.findById(id);

        if (!dancer) {
            res.status(404);
            throw new Error('Dancer not found.');
        }

        const { firstName, lastName } = req.body || {};

        if (!firstName?.trim() || !lastName?.trim()) {
            res.status(400);
            throw new Error('First name and last name are required.');
        }

        dancer.firstName = firstName;
        dancer.lastName = lastName;

        const updatedDancer = await dancer.save();
        res.json(updatedDancer);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// assign dancer seat
dancerRouter.patch('/:id/assign', async (req, res, next) => {
    try {
        const { id, table, seat } = req.body || {};

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Dancer not found.');
        }

        const dancer = await Dancer.findById(id);

        if (!dancer) {
            res.status(404);
            throw new Error('Dancer not found.');
        }

        dancer.table = table;
        dancer.seat = seat;

        const updatedDancer = await dancer.save();
        res.json(updatedDancer);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

// unassign dancer seat
dancerRouter.patch('/:id/unassign', async (req, res, next) => {
    try {
        const { id } = req.body || {};

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(404);
            throw new Error('Dancer not found.');
        }

        const dancer = await Dancer.findById(id);

        if (!dancer) {
            res.status(404);
            throw new Error('Dancer not found.');
        }

        dancer.table = null;
        dancer.seat = null;

        const updatedDancer = await dancer.save();
        res.json(updatedDancer);
    } catch (err) {
        console.log('Error: ', err);
        next(err);
    }
});

export default dancerRouter;
