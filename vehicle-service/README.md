# Vehicle Service

Vehicle management and CRUD operations service.

## Endpoints

### Create Vehicle
```
POST /api/vehicles
Content-Type: application/json

{
  "model": "Civic",
  "brand": "Honda",
  "pricePerDay": 50.0
}

Response: 201 Created
{
  "id": "507f1f77bcf86cd799439012",
  "model": "Civic",
  "brand": "Honda",
  "pricePerDay": 50.0,
  "available": true,
  "createdAt": 1645000000000,
  "updatedAt": 1645000000000
}
```

### Get All Vehicles
```
GET /api/vehicles
Response: 200 OK
[
  {
    "id": "507f1f77bcf86cd799439012",
    "model": "Civic",
    "brand": "Honda",
    "pricePerDay": 50.0,
    "available": true,
    "createdAt": 1645000000000,
    "updatedAt": 1645000000000
  }
]
```

### Get Vehicle by ID
```
GET /api/vehicles/{id}
Response: 200 OK
{
  "id": "507f1f77bcf86cd799439012",
  "model": "Civic",
  "brand": "Honda",
  "pricePerDay": 50.0,
  "available": true,
  "createdAt": 1645000000000,
  "updatedAt": 1645000000000
}
```

### Update Vehicle
```
PUT /api/vehicles/{id}
Content-Type: application/json

{
  "model": "Civic 2024",
  "pricePerDay": 55.0,
  "available": false
}

Response: 200 OK
{...updated vehicle...}
```

### Get Available Vehicles
```
GET /api/vehicles/available
Response: 200 OK
[
  {...},
  {...}
]
```

## Running

### With Docker
```bash
docker build -t vehicle-service .
docker run -e MONGODB_URI=mongodb://localhost:27017/vehicle-db \
           -p 8082:8082 vehicle-service
```

### Locally
```bash
mvn spring-boot:run
```

## Database
- MongoDB database: `vehicle-db`
- Collection: `vehicles`

## Configuration
- `spring.data.mongodb.uri` - MongoDB connection string
