# Tax Calculator Frontend

This is the frontend for the Tax Calculator application, built with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the App

#### Development Mode

To run the app locally:

1. Start the frontend:
   ```bash
   npm start
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will reload when changes are made, and any lint errors will show in the console.

#### Running with the Backend

If you're running the backend along with the frontend, start the backend first. Once the backend is running, start the frontend, and it will be available at:

- Frontend: [http://localhost:3001](http://localhost:3001)

### Scripts

In the project directory, you can run the following scripts:

- **`npm start`**: Runs the app in development mode on [localhost:3000](http://localhost:3000) or [localhost:3001](http://localhost:3001) (with backend).
- **`npm test`**: Launches the test runner.
- **`npm run build`**: Builds the app for production to the `build` folder.
- **`npm run eject`**: Removes the Create React App toolchain. Use with caution, as it’s irreversible.

Here’s the updated **Deployment** section to reflect the automatic deployment process:

---

### Deployment

### Netlify

The frontend is currently deployed on [Netlify](https://tax-calculator-frontend.netlify.app/).

**Deployment Process:**
- Any changes that are added, committed, and pushed to the `main` branch will automatically be deployed to production on Netlify.
- Netlify continuously monitors the `main` branch for updates. Once changes are pushed, Netlify will rebuild the app and deploy it live.

To manage the deployment or review the app status, visit the [Netlify dashboard](https://app.netlify.com/sites/tax-calculator-frontend/overview).

### Render (Previously Hosted)

The frontend was originally hosted on Render, along with the backend and database. However, due to Render’s handling of single-page applications causing user experience issues, the frontend was moved to Netlify.

The backend and database are still hosted on Render:

- Backend: [Render Dashboard (Backend)](https://dashboard.render.com/web/srv-cr1ektrqf0us73fm9rh0)
- Database: [Render Dashboard (Database)](https://dashboard.render.com/d/dpg-cr1ceq23esus73at4vtg-a/info)

## Troubleshooting

If you encounter issues building the app or minification errors, refer to the [Create React App troubleshooting guide](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify).
