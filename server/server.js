const express = require('express');
const xlsx = require('xlsx');
const app = express();
const PORT = 3000;

function obtenerTurnosDesdeExcel() {
    const workbook = xlsx.readFile('./assets/agenda.xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log(sheet);
    return sheet
}

app.get('/api/turnos', (req, res) => {
    const turnos = obtenerTurnosDesdeExcel();
    res.json(turnos);
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});