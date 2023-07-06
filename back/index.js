import express, { json } from 'express';
import { createConnection } from 'mysql';

// Config BDD
const bddConfig = {
  host: '',
  user: '',
  password: '',
  database: ''
};

const connection = createConnection(bddConfig);


connection.connect(error => {
  if (error) {
    console.error('Argh .. Echec de connexion:', error);
    return;
  }
  console.log('Base de donnée connectée ;D');
});


const app = express();
app.use(json());


app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM user';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Raté ! Echec de la récupération= des utilisateurs :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des users' });
      return;
    }
    res.json(results);
  });
});


app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM utilisateur WHERE id = ?';
  connection.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération de l\'user :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'user' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User non trouvé' });
      return;
    }
    res.json(results[0]);
  });
});


app.post('/users', (req, res) => {
  const { nom } = req.body;
  const sql = 'INSERT INTO user (nom) VALUES (?)';
  connection.query(sql, [nom], (error, results) => {
    if (error) {
      console.error('Erreur lors de la création de l\'user :', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'user' });
      return;
    }
    const nouvelUtilisateur = { id: results.insertId };
    res.status(201).json(nouvelUtilisateur);
  });
});


app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { nom } = req.body;
    const sql = 'UPDATE user SET nom = ?, WHERE id = ?';
    connection.query(sql, [nom, id], (error, results) => {
      if (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
        return;
      }
      res.json({ message: 'Utilisateur mis à jour avec succès' });
    });
  });
  
  
  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM user WHERE id = ?';
    connection.query(sql, [id], (error, results) => {
      if (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
        return;
      }
      res.json({ message: 'Utilisateur supprimé' });
    });
  });
  
  
  const port = 3000;
  app.listen(port, () => {
    console.log(`Serveur Express démarré sur le port ${port}`);
  });