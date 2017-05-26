# Sport Matching 



## Instructions  



**Lancer le server et le client dans 2 terminals différents**



### Client

```shell
cd client/
npm install
bower install
node server.js
```

Lancé sur le port 8080

### Server 

**Important :** 

* Modifier le scénario choisit dans le fichier ./server/.env (parmis: test, production, developpement)
* Modifier le fichier de conf pour la base de données dans le dossier ./server/config en fonction du scénario choisit

```shell
cd server/ 
npm install 
npm run deploy
```

Lancé sur le port 5050

Le déploiement se fera automatiquement grâce à la migration et au seed de Sequelize



#### Adresse du client AngularJS 

https://sportmatching.herokuapp.com/#/

#### Adresse du server NodeJS

https://hassan-webproject.herokuapp.com/api/v1