# Library Management System – Frontend

A modern, easy-to-use web application for managing libraries, built with React. This project serves as the frontend for the Library Management System, allowing users to manage books, members, and transactions through a clean and responsive interface.

> **Note:** This frontend is designed to work seamlessly with the [Library-Management-System-Backend-](https://github.com/Aounil/Library-Management-System-Backend-) — a Java Spring Boot REST API also created by [Aounil](https://github.com/Aounil).

## Features

- 📚 **Book Management:** Add, update, search, and remove books.
- 👤 **Member Management:** Register members, view profiles(on going).
- 🔄 **Issue & Return:** Track book issuance and returns, view transaction history.
- 🔍 **Search & Filter:** Powerful search and filter options for books and members.
- 🔒 **Authentication:** User login/logout and role-based access (if backend supports).
- 🖥️ **Responsive Design:** Works on desktop and mobile browsers.





## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Aounil/Library-Management-System-Frontend.git
   cd Library-Management-System-Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm start
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```
The production-ready files will be in the `build/` directory.

## Connecting to the Backend

This frontend is tightly integrated with the [Library-Management-System-Backend-](https://github.com/Aounil/Library-Management-System-Backend-) — a RESTful API built in Java Spring Boot by [Aounil](https://github.com/Aounil).  
To use all features, make sure the backend server is running and accessible. You may need to update the API base URL in the frontend configuration to match your backend server's address.

## Technologies Used

- [React](https://reactjs.org/)
- JavaScript (ES6+)
- HTML5 & CSS3
- [Create React App](https://github.com/facebook/create-react-app)
- Axios or Fetch API for backend communication

## Folder Structure

```
src/
  components/     # Reusable UI components
  pages/          # Main application pages
  services/       # API calls
  utils/          # Utility functions
  App.js          # Main app component
  index.js        # Entry point
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

## Author

[Aounil](https://github.com/Aounil) (Fullstack developer: backend & frontend)