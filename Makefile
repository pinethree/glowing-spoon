postgresinit:
	docker run --name postgresalpine -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=postgres -d postgres:alpine

postgresrm:
	docker rm -f postgresalpine

postgres:
	docker exec -it postgresalpine psql

createdb:
	docker exec -it postgresalpine createdb --username=root --owner=root vrillar

dropdb:
	docker exec -it postgresalpine dropdb vrillar

cpdata:
	docker cp setup/data/. postgresalpine:/data

cpsql:
	docker cp setup/sql/. postgresalpine:/sql

importdb:
	docker exec -it postgresalpine psql -U root -d vrillar -f /sql/import.sql

seeddb: cpdata cpsql importdb

.PHONY: postgresinit postgres createdb dropdb cpdata cpsql importdb seeddb
