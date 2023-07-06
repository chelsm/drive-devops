# MySQL et phpMyAdmin avec Docker Compose

Cette configuration Docker Compose met en place une base de données MySQL et phpMyAdmin pour la gestion de la base de données. Les données MySQL sont stockées dans un volume Docker, et un script SQL d'initialisation pour la configuration initiale de la base de données.

## Prérequis

- Docker installé sur votre machine

## Utilisation

1. Clonez ou téléchargez ce dépôt sur votre machine locale.

2. Créez un fichier `.env` dans le même répertoire que le fichier `docker-compose.yml`. Ajoutez le mot de passe root MySQL dans le fichier `.env` avec le format suivant :
```
MYSQL_ROOT_PASSWORD=password
PMA_HOST=mysql
PMA_PORT=3306
```

3.  `init.sql` placez-le dans le même répertoire que le fichier `docker-compose.yml` créer la table user.

4. Ouvrez un terminal ou une invite de commandes et naviguez jusqu'au répertoire contenant le fichier `docker-compose.yml`.

5. Exécutez la commande suivante pour démarrer les conteneurs MySQL et phpMyAdmin : `docker-compose up -d`

|. `docker-compose down` arrêtera et supprimera les conteneurs, mais les données MySQL stockées dans le volume `db_data` persisteront (mais je comprend pas je vois rien wsh).
