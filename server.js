const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/matches', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'matches.json');
    
    if (!fs.existsSync(path.dirname(dataPath))) {
      fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    }
    
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, JSON.stringify([]));
    }
    
    const matches = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json(matches);
  } catch (error) {
    console.error('Error al cargar partidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/matches', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'matches.json');
    const matches = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    const newMatch = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    matches.push(newMatch);
    fs.writeFileSync(dataPath, JSON.stringify(matches, null, 2));
    
    res.json(newMatch);
  } catch (error) {
    console.error('Error al guardar partido:', error);
    res.status(500).json({ error: 'Error al guardar el partido' });
  }
});

app.put('/api/matches/:id', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'matches.json');
    const matches = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const matchId = req.params.id;
    
    const matchIndex = matches.findIndex(match => match.id === matchId);
    
    if (matchIndex === -1) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }
    
    matches[matchIndex] = { ...matches[matchIndex], ...req.body };
    fs.writeFileSync(dataPath, JSON.stringify(matches, null, 2));
    
    res.json(matches[matchIndex]);
  } catch (error) {
    console.error('Error al actualizar partido:', error);
    res.status(500).json({ error: 'Error al actualizar el partido' });
  }
});

app.delete('/api/matches/:id', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'matches.json');
    const matches = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const matchId = req.params.id;
    
    const matchIndex = matches.findIndex(match => match.id === matchId);
    
    if (matchIndex === -1) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }
    
    const deletedMatch = matches.splice(matchIndex, 1)[0];
    fs.writeFileSync(dataPath, JSON.stringify(matches, null, 2));
    
    res.json({ 
      message: 'Partido eliminado exitosamente',
      deletedMatch: deletedMatch
    });
  } catch (error) {
    console.error('Error al eliminar partido:', error);
    res.status(500).json({ error: 'Error al eliminar el partido' });
  }
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
