# emap-server

The emap-server is created for collecting environment data from sensors node, based on Nodejs platform, using socket.io module and RethinkDB for realtime data updating. 

## How to deploy:

1. Clone or fork this project and install nodeJS (get from https://nodejs.org/en/).
2. cd into the emap-server folder and run:
```
npm install
```
3. Install RethinkDB database from https://www.rethinkdb.com/
4. Start RethinkDB and restore the backup data from https://github.com/MrWhoz/rethinkdb-backup (because the init DB table for the first time is not implemented yet, sorry for that inconvenience). And running command: ``` rethinkdb restore rethinkdb_dump_2016-12-06T21:50:32.tar.gz ```
5. After successfully restore the DB, you can check the DB: localhost:8080
6. Start the server: ``` node emap.js```
7. Go to: localhost:8888
--------------------------
## Node project:
1. Clone the node part here: https://github.com/hpsony94/skynet_node
2. Edit the servername in file arduino.ino
3. Start and enjoy.
--------------------------
username/password for login and editing node: xtungvo/abc123 
