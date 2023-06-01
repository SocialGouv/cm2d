### Docker compose with elasticsearch and kibana 

This is a simple docker compose file to run elasticsearch and kibana.
ELK xpack security is enabled by default.

## How to run

```bash
docker-compose up -d
```

## First time setup

### Need to copy certificates to the host machine

```bash
mkdir certificates
docker cp elasticsearch:/usr/share/elasticsearch/config/certs/ca/ca.crt ./certificates/ca.crt
```

### Don't forget to copy Elastic passsword to webapp-next env environnement