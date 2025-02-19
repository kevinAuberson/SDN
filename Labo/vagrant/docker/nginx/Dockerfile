# Utiliser l'image de base officielle de Nginx
FROM nginx:alpine

# Définir un répertoire de travail
WORKDIR /usr/share/nginx/html

# Copier les fichiers du site dans l'image
COPY . .

# Vérification des permissions pour les fichiers copiés (facultatif)
RUN chmod -R 755 /usr/share/nginx/html

# Exposer le port 80 pour accéder au site
EXPOSE 80

# Commande pour lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
