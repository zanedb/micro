# Microservices

## [/read-receipts](https://micro.zane.sh/read-receipts)

### Generates tracking/read receipt URLs.

### Routes:

- POST `/read-receipts/new`
  - Generates a read receipt URL & stat viewing URL
  - Returns all URLs:
  ```
  {
    "url": "https://micro.zane.sh/read-receipts/:key",
    "imageUrl": "https://micro.zane.sh/read-receipts/:key.png",
    "statsUrl": "https://micro.zane.sh/read-receipts/stats/:id"
  }
  ```
- GET `/read-receipts/:key`
  - This tracks a request, or click, for that read receipt URL
  - Returns a `200 OK`
- GET `/read-receipts/:key.png`
  - This tracks a request, or click, for that read receipt URL & returns a 1x1 tracking pixel image
  - Returns an [image file](https://raw.githubusercontent.com/zanedb/micro/master/static/pixel.png)
- GET `/read-receipts/stats/:id`
  - This shows all requests, or clicks, to a read receipt URL
  - Keep the id private, otherwise anyone can view your stats
  - Returns all requests:
  ```
  {
    "total": 1,
    "clicks": [
      {
        "timestamp": "2018-12-01T01:15:34.693Z",
        "ip": "127.0.0.1"
      }
    ]
  }
  ```

### Setup:

1. Create a file in the root directory called `.env`, containing the following:

```
# MongoDB instance URI
MONGODB_URI=
# root URL of app in production, ex. https://micro.zane.sh
URL=
# API key for ipstack.com, used for geolocating
IPSTACK_API_KEY=
```

2. Install packages:

```
yarn
```

3. Run!

```
yarn start
# or, for development:
yarn dev
```
