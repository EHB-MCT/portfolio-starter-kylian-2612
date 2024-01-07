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

##Clone the Repository
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
   docker-compose up --build
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

For more details on setup and running the API, refer to the [full README](./README.md).

## Artist endpoints


## License

This project is licensed under the [MIT License](LICENSE).

## Questions and Support

    If you have any questions or need assistance, feel free to open a support ticket.



