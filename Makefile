postgresinit:
	docker run --name vrillar_db -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=postgres -d postgres:alpine

postgresrm:
	docker rm -f vrillar_db

postgres:
	docker exec -it vrillar_db psql

createdb:
	docker exec -it vrillar_db createdb --username=root --owner=root vrillar

dropdb:
	docker exec -it vrillar_db dropdb vrillar

cpdata:
	docker cp setup/data/. vrillar_db:/data

cpsql:
	docker cp setup/sql/. vrillar_db:/sql

preparedb: createdb cpdata cpsql

seeddb:
	docker exec -it vrillar_db psql -U root -d vrillar -f /sql/import.sql

.PHONY: postgresinit postgres createdb dropdb cpdata cpsql importdb seeddb
