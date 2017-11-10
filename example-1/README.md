# example-1

## Requirements

- Node.js >= 9.1.0

## Generate keys

```sh
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```

## Run

```sh
node server.js
```

Open: https://localhost:8443

