const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const dataPath = path.join(process.cwd(), 'data', 'matches.json');
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Crear directorio si no existe
      if (!fs.existsSync(path.dirname(dataPath))) {
        fs.mkdirSync(path.dirname(dataPath), { recursive: true });
      }
      
      // Crear archivo si no existe
      if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify([]));
      }
      
      const matches = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json(matches);
    } else if (req.method === 'POST') {
      const matches = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      const newMatch = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
      };
      
      matches.push(newMatch);
      fs.writeFileSync(dataPath, JSON.stringify(matches, null, 2));
      
      res.json(newMatch);
    } else if (req.method === 'PUT') {
      const matches = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const matchId = req.query.id;
      
      const matchIndex = matches.findIndex(match => match.id === matchId);
      
      if (matchIndex === -1) {
        return res.status(404).json({ error: 'Partido no encontrado' });
      }
      
      matches[matchIndex] = { ...matches[matchIndex], ...req.body };
      fs.writeFileSync(dataPath, JSON.stringify(matches, null, 2));
      
      res.json(matches[matchIndex]);
    } else if (req.method === 'DELETE') {
      const matches = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const matchId = req.query.id;
      
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
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
