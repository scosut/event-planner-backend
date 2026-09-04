import express from 'express';
import Dancer from '../models/Dancer.js';
import { getChart, getCards, getTents } from '../pdf.js';

const materialRouter = express.Router();

// get place cards
materialRouter.get('/cards', async (req, res, next) => {
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
materialRouter.get('/chart', async (req, res, next) => {
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
materialRouter.get('/tents', async (req, res, next) => {
    try {
        const pdfBytes = await getTents();
        res.contentType('application/pdf');
        res.send(pdfBytes);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

export default materialRouter;
