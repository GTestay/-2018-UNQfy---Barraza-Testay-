FROM node:8
# Utiliza la imagen de node 8 como base.
# A partir de esta imagen se ejecutarán los comandos de abajo creando una nueva imagen.

# Configura variables de entorno necesariar para correr node
ENV NODE_ENV=development
ENV DEBUG=true

# Crea un directorio y nos movemos ahí
WORKDIR /home/node/unqfy


# Copia los fuentes dentro del container
COPY . /home/node/unqfy/


# Copia el package.json package-lock.json en /home/node/my_node_app
#COPY package.json .
#COPY package-lock.json .

# Ejecuta npm install. Esto produce que se instalen todas las dependencias necearias para correr la aplicación
RUN ["npm", "install"]

# Expone el puerto 8000 donde corre la aplicación
EXPOSE 8000


# Le da permisos al usuario node para escribir en /home/node/my_node_app
# Como comentario, notar que el comando RUN nos permite ejecutar culquier comando bash valido.
RUN chown node:users /home/node/

# Habilita el usuario node. Por defecto, los containers corren los comandos con el usuario root
#USER node


# Comando por defecto sino se provee uno al hacer docker run
# El comando corre el servicio
CMD [ "node", "serverUnqfy" ]

# LISTO!

# Para construir la imagen
# sudo docker build -t unqfy_image .

# Para correr el container --user node
# sudo docker run -p 8000:8000 --name unqfy unqfy_image

# sudo docker run --net unqfynet --ip 172.20.0.21 -p 8000:8000 --name unqfy unqfy_image