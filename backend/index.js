const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡El servidor está funcionando!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
