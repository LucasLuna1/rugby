const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const dataPath = path.join('/tmp', 'matches.json');
    
    // Crear archivo si no existe
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, JSON.stringify([]));
    }

    const matches = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(matches)
      };
    }

    if (event.httpMethod === 'POST') {
      const newMatch = {
        id: Date.now().toString(),
        ...JSON.parse(event.body),
        createdAt: new Date().toISOString()
      };
      
      matches.push(newMatch);
      fs.writeFileSync(dataPath, JSON.stringify(matches, null, 2));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(newMatch)
      };
    }

    if (event.httpMethod === 'PUT') {
      const matchId = event.path.split('/').pop();
      const matchIndex = matches.findIndex(match => match.id === matchId);
      
      if (matchIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Partido no encontrado' })
        };
      }
      
      matches[matchIndex] = { ...matches[matchIndex], ...JSON.parse(event.body) };
      fs.writeFileSync(dataPath, JSON.stringify(matches, null, 2));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(matches[matchIndex])
      };
    }

    if (event.httpMethod === 'DELETE') {
      const matchId = event.path.split('/').pop();
      const matchIndex = matches.findIndex(match => match.id === matchId);
      
      if (matchIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Partido no encontrado' })
        };
      }
      
      const deletedMatch = matches.splice(matchIndex, 1)[0];
      fs.writeFileSync(dataPath, JSON.stringify(matches, null, 2));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Partido eliminado exitosamente',
          deletedMatch: deletedMatch
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};
