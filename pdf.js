import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import dotenv from 'dotenv';
dotenv.config();

export const getCards = async (dancers) => {
    const formUrl = `http://localhost:${process.env.PORT}/pdf/cards.pdf`;
    const fontUrl = `http://localhost:${process.env.PORT}/fonts/VLADIMIR.TTF`;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const customFont = await pdfDoc.embedFont(fontBytes);
    const form = pdfDoc.getForm();
    const fields = dancers
        .filter((dancer) => dancer.table && dancer.seat)
        .map((dancer) => ({
            value: `${dancer.firstName} ${dancer.lastName}`,
            front: form.getTextField(`t${dancer.table}s${dancer.seat}_front`),
            back: form.getTextField(`t${dancer.table}s${dancer.seat}_back`),
        }));

    fields.forEach((field) => {
        field.front.setText(field.value);
        field.back.setText(field.value);
        field.front.updateAppearances(customFont);
        field.back.updateAppearances(customFont);
    });

    form.flatten();

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
};

export const getChart = async (dancers) => {
    const formUrl = `http://localhost:${process.env.PORT}/pdf/chart.pdf`;
    const fontUrl = `http://localhost:${process.env.PORT}/fonts/ARIALN.TTF`;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const customFont = await pdfDoc.embedFont(fontBytes);

    const form = pdfDoc.getForm();
    const fields = dancers
        .filter((dancer) => dancer.table && dancer.seat)
        .map((dancer) => ({
            value: `${dancer.firstName} ${dancer.lastName}`,
            field: form.getTextField(`t${dancer.table}s${dancer.seat}`),
        }));

    fields.forEach((field) => {
        field.field.setText(field.value);
        field.field.updateAppearances(customFont);
    });

    form.flatten();

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
};

export const getTents = async () => {
    const formUrl = `http://localhost:${process.env.PORT}/pdf/tents.pdf`;
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
};
