docker-compose down 

docker build -t back-end:latest ./back-end

docker build -t front-end:latest ./front-end


docker-compose up --build --force-recreate --remove-orphans

docker run -p 3000:3000