# Run with
```
mvn clean package
java -jar target/FlashCards-0.1.jar server src/main/resources/config.yml
```

Running with docker
```
sudo docker build --no-cache -t flashcards-backend .
sudo docker run -d --name flashcards-backend -p 8080:8080 flashcards-backend
```
docker logs
```
sudo docker logs -f flashcards-backend
```

_db hosted here: https://console.aiven.io/_