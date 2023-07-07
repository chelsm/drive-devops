import express, { json } from 'express';
import { createConnection } from 'mysql';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session'
import cors from 'cors';


// Config BDD
const bddConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'TestDB',
  port: 3306
};

const connection = createConnection(bddConfig);


connection.connect(error => {
  if (error) {
    console.error('Argh .. Echec de connexion:', error);
    return;
  }
  console.log('Base de donnée connectée ;D');
});


// Configuration de session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);

// Configuration de la stratégie locale de Passport
passport.use(new LocalStrategy(
  (username, password, done) => {
    const sql = 'SELECT * FROM users WHERE login = ?';
    connection.query(sql, [username], (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        return done(error);
      }
      if (results.length === 0) {
        return done(null, false, { message: 'Nom d\'utilisateur incorrect' });
      }
      const user = results[0];
      bcrypt.compare(password, user.password, (bcryptError, isMatch) => {
        if (bcryptError) {
          console.error('Erreur lors de la comparaison des mots de passe :', bcryptError);
          return done(bcryptError);
        }
        if (!isMatch) {
          return done(null, false, { message: 'Mot de passe incorrect' });
        }
        return done(null, user);
      });
    });
  }
));

// Sérialisation de l'utilisateur pour le stockage dans la session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Désérialisation de l'utilisateur à partir de la session
passport.deserializeUser((id, done) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  connection.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      return done(error);
    }
    if (results.length === 0) {
      return done(null, false);
    }
    const user = results[0];
    done(null, user);
  });
});





const app = express();
app.use(json());
app.use(passport.initialize());
app.use(passport.session());








//Simplement une création d'user, mdp hashé bien sûr !!
app.post('/signup', (req, res) => {
  const { login, password } = req.body;
  const sql = 'INSERT INTO users (login, password) VALUES (?, ?)';
  bcrypt.hash(password, 10, (error, hashedPassword) => {
    if (error) {
      console.error('Erreur lors du hachage du mot de passe :', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
      return;
    }
    connection.query(sql, [login, hashedPassword], (dbError, results) => {
      if (dbError) {
        console.error('Erreur lors de la création de l\'utilisateur :', dbError);
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
        return;
      }
      const nouvelUtilisateur = { id: results.insertId, login };

      // Ajoutez cette ligne pour connecter automatiquement l'utilisateur après l'inscription
      req.login(nouvelUtilisateur, (loginError) => {
        if (loginError) {
          console.error('Erreur lors de la connexion de l\'utilisateur :', loginError);
          res.status(500).json({ error: 'Erreur lors de la connexion de l\'utilisateur' });
          return;
        }
        res.status(201).json(nouvelUtilisateur);
      });
    });
  });
});

// On va récup un user, ma foi faudrait privatiser la route hin :p
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';
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


// La on va juste s'authentifier en récuprant les infos dans le local storage pour générer une session :D
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Authentification réussie' });
});

// Celle ci permet de vérifier le statut authentifié ou non !
app.get('/authentifie', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authentifie: true });
  } else {
    res.json({ authentifie: false });
  }
});

// la on déconnecte le user !
app.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Utilisateur déconnecté' });
});


//modifie un user, faudrait la rendre privée :t
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { nom } = req.body;
    const sql = 'UPDATE users SET nom = ?, WHERE id = ?';
    connection.query(sql, [nom, id], (error, results) => {
      if (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
        return;
      }
      res.json({ message: 'Utilisateur mis à jour avec succès' });
    });
  });
  
  
  //SUPPRIMER un user hop !
  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    connection.query(sql, [id], (error, results) => {
      if (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
        return;
      }
      res.json({ message: 'Utilisateur supprimé' });
    });
  });


  // Au cas ou ca puisse etre utile, petite fonction pour privatiser une route
  const checkIfAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Bah tu n es pas authentifie !' });
  }
  
  const port = 3002;
  app.listen(port, () => {
    console.log(`Serveur Express démarré sur le port ${port}`);
  });

  app.use(cors({
    origin: 'http://localhost:3001/'
  }));