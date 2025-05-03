# TechTalke

TechTalke is a modern real-time chat application designed to enhance communication through smart features, group collaboration, and seamless cross-platform support.

### Clone the Repository

```sh
git clone https://github.com/kethn-tech/TechTalke.git
cd TechTalke
```

### Install Dependencies

#### Client
```sh
cd Client
npm i vite --save-dev
npm install
```

#### Server
```sh
cd Server
npm install
```

### Environment Variables

Create a `.env` file in both the `Client` and `Server` directories and add the following:

#### **Client (.env)**
```env
VITE_APP_SERVER_URL=http://localhost:4000
```

#### **Server (.env)**
```env
DATABASE_URL=YOUR DB URL Local/atlas
JWT_KEY=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_SECRET
PORT=4000
```

## Usage

### Running the Client
```sh
cd Client
npm run dev
```

### Running the Server
```sh
cd Server
npm start
```

The client will run on `http://localhost:3000` and the server on `http://localhost:4000`.

## Folder Structure

```
Client/
  ├── .env
  ├── .eslintrc.cjs
  ├── .gitignore
  ├── components.json
  ├── index.html
  ├── jsconfig.json
  ├── package.json
  ├── postcss.config.js
  ├── public/
  ├── src/
  │   ├── App.jsx
  │   ├── assets/
  │   ├── components/
  │   ├── context/
  │   ├── index.css
  │   ├── lib/
  │   ├── main.jsx
  │   ├── pages/
  │   └── store/
  ├── tailwind.config.js
  └── vite.config.js
Server/
  ├── .env
  ├── config/
  │   └── database.js
  ├── controllers/
  │   ├── AuthController.js
  │   ├── ContactController.js
  │   ├── messageController.js
  │   └── profileController.js
  ├── middlewares/
  │   └── AuthMiddleware.js
  ├── models/
  ├── package.json
  ├── routes/
  ├── server.js
  ├── socket.js
  └── uploads/
```

## KRSTUDIO
## Kethan R Ayatti
