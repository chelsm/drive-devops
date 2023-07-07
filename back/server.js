import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

const dbConfig = {
  host: 'localhost',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'your_database_name',
};

const jwtSecret = 'secret'; // Clé secrète pour signer les tokens JWT

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
  } else {
    console.log('Connecté à la base de données MySQL.');
  }
});

app.use(cors());
app.use(express.json());

const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.userId = decoded.userId;
    next();
  });
};

app.post('/signup', (req, res) => {
  const { login, password } = req.body;

  connection.query('SELECT * FROM users WHERE login = ?', [login], async (error, results) => {
    if (error) {
      console.error('Erreur lors de la vérification du login existant :', error);
      res.sendStatus(500);
    } else if (results.length > 0) {
      res.status(409).send('Ce login existe déjà.');
    } else {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
          login,
          password: hashedPassword,
        };

        const insertQuery = 'INSERT INTO users SET ?';
        connection.query(insertQuery, user, (insertError, insertResult) => {
          if (insertError) {
            console.error('Erreur lors de la création de l\'utilisateur :', insertError);
            res.sendStatus(500);
          } else {
            const userId = insertResult.insertId;
            const token = generateToken(userId);
            res.status(201).json({ id: userId, token });
          }
        });
      } catch (hashError) {
        console.error('Erreur lors du hachage du mot de passe :', hashError);
        res.sendStatus(500);
      }
    }
  });
});

app.post('/login', (req, res) => {
  const { login, password } = req.body;

  connection.query('SELECT * FROM users WHERE login = ?', [login], async (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      res.sendStatus(500);
    } else if (results.length === 0) {
      res.sendStatus(401);
    } else {
      try {
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          const token = generateToken(user.id);
          res.status(200).json({ id: user.id, token });
        } else {
          res.sendStatus(401);
        }
      } catch (compareError) {
        console.error('Erreur lors de la comparaison des mots de passe :', compareError);
        res.sendStatus(500);
      }
    }
  });
});

app.get('/profile', verifyToken, (req, res) => {
  const userId = req.userId;

  connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
      res.sendStatus(500);
    } else if (results.length === 0) {
      res.sendStatus(404);
    } else {
      const user = results[0];
      res.status(200).json({ id: user.id, login: user.login });
    }
  });
});

app.listen(3000, () => {
  console.log('Le serveur est démarré sur le port 3000.');
});
