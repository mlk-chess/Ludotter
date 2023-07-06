# Ludotter

Lien du site en production : https://ludotter.site

1. Copier le .env.example et le renommer en .env
2. Remplir les variables d'environnement
3. ```
    docker compose up
   

### Lancement des test

1. Avec interface (se positionner dans le dossier web-app)
    ```
    cypress_url=url cypress_email=email_client cypress_password=password_client npm run e2e
    ```
2. Sans interface (se positionner dans le dossier web-app)
    ```
    cypress_url=url cypress_email=email_client cypress_password=password_client npm run e2e:headless
    ```
