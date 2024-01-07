# Artwork Library API

The Artwork Library API is a JavaScript-based library designed to connect artists with their artworks.

## Purpose

The Artwork Library API is written in Nodejs and is designed to create a usable library that facilitates the connection between artists and their artworks.

## Quick start

To get started with the project, follow these steps:

### Prerequisites

Ensure you have the following software installed:

- Docker
- Docker Compose

## Clone the Repository

1. Clone the repository using Git: 
   ```
   git clone https://github.com/EHB-MCT/portfolio-starter-kylian-2612.git
   ```
2. Navigate to the project directory:
   ```
   cd portfolio-starter-kylian-2612
   ```

### Installation

1. Copy the `.env.template` file to `.env`
2. Run the following command:

   ```
   docker-compose -f .\docker-compose.prod.yml up --build
   ```
#### Installation test environment

1. Copy the `.env.template` file to `.env`
2. Run the following command:

   ```
   docker-compose -f .\docker-compose.test.yml up --build
   ```

## Status 
    
    The project is currently in development

# API Endpoints
## Artwork endpoints
### Create Artwork

- **Route:** `POST /api/artworks`
- **Description:** Create a new artwork
- **Access:** Public

##### Request Body

- `title` (string): The title of the artwork.
- `image_url` (string): URL of the artwork image.
- `location_geohash` (string): Geohash representing the location of the artwork.

### Retrieve All Artworks

- **Route:** `GET /api/artworks`
- **Description:** Retrieve all artworks
- **Access:** Public

### Retrieve Artwork by ID

- **Route:** `GET /api/artworks/:id`
- **Description:** Retrieve a specific artwork by ID
- **Access:** Public

##### Request Parameters

- `id` (number): The ID of the artwork.

### Update Artwork by ID

- **Route:** `PUT /api/artworks/:id`
- **Description:** Update an artwork by ID
- **Access:** Public

##### Request Parameters

- `id` (number): The ID of the artwork.

##### Request Body

- `title` (string): The updated title of the artwork.
- `artist_uuid` (string): The updated UUID of the artist associated with the artwork.
- `image_url` (string): The updated URL of the artwork image.
- `location` (string): The updated location of the artwork.

### Delete Artwork by ID

- **Route:** `DELETE /api/artworks/:id`
- **Description:** Delete an artwork by ID
- **Access:** Public

##### Request Parameters

- `id` (number): The ID of the artwork to be deleted.

### Error Handling

- If an invalid ID is provided, the API responds with a 401 status and an error message.
- If an artwork is not found, the API responds with a 404 status and an error message.
- Internal server errors result in a 500 status and an error message.


## Artist endpoints

### Create Artist

- **Route:** `POST /artists`
- **Description:** Create a new artist
- **Access:** Public

##### Request Body

- `artist` (string): Artist name
- `uuid` (string): Artist UUID
- `birthyear` (number): Artist birth year
- `num_artworks` (number): Number of artworks by the artist

### Retrieve All Artists

- **Route:** `GET /artists`
- **Description:** Retrieve all artists
- **Access:** Public

### Retrieve Artist by ID

- **Route:** `GET /artists/:id`
- **Description:** Read one artist by ID
- **Access:** Public

##### Request Parameters

- `id` (number): Artist ID

### Update Artist by ID

- **Route:** `PUT /artists/:id`
- **Description:** Update an artist by ID
- **Access:** Public

##### Request Parameters

- `id` (number): Artist ID

##### Request Body

- `artist` (string): Updated artist name
- `uuid` (string): Updated artist UUID
- `birthyear` (number): Updated artist birth year
- `num_artworks` (number): Updated number of artworks by the artist

### Delete Artist by ID

- **Route:** `DELETE /artists/:id`
- **Description:** Delete an artist by ID
- **Access:** Public

##### Request Parameters

- `id` (number): Artist ID

### Error Handling

- If an invalid or negative ID is provided, the API responds with a 401 status and an error message.
- If an artist is not found, the API responds with a 404 status and an error message.
- Internal server errors result in a 500 status and an error message.


## License

This project is licensed under the [MIT License](LICENSE).

## Questions and Support

    If you have any questions or need assistance, feel free to open a support ticket.



