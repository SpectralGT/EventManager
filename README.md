# EventManager
![GitHub repo size](https://img.shields.io/github/repo-size/SpectralGT/EventManager)
![GitHub last commit](https://img.shields.io/github/last-commit/SpectralGT/EventManager)
![License](https://img.shields.io/github/license/SpectralGT/EventManager)


A modern event management web application built with Next.js, Prisma, and Tailwind CSS. EventManager enables users to create, manage, and explore events seamlessly.

## 🚀 Features

- **Event Creation & Management**: Easily create and manage events with user-friendly forms.
- **Responsive Design**: Optimized for all devices using Tailwind CSS.
- **Database Integration**: Utilizes Prisma ORM for efficient database operations.
- **Modern Stack**: Built with Next.js 13+, leveraging the App Router and TypeScript.
- **Deployment Ready**: Configured for deployment on platforms like Vercel.

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) 13+, [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Prisma ORM](https://www.prisma.io/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SpectralGT/EventManager.git
   cd EventManager
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL="your_database_connection_string"
   ```

   Replace `"your_database_connection_string"` with your actual database connection string.

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🗂 Project Structure

```
EventManager/
├── app/                 # Next.js App Router pages and layouts
├── components/          # Reusable UI components
├── lib/                 # Utility functions and helpers
├── prisma/              # Prisma schema and migrations
├── public/              # Static assets
├── styles/              # Global styles (if any)
├── .env                 # Environment variables
├── next.config.ts       # Next.js configuration
├── package.json         # Project metadata and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🧪 Scripts

- `npm run dev` or `yarn dev`: Starts the development server.
- `npm run build` or `yarn build`: Builds the application for production.
- `npm run start` or `yarn start`: Starts the production server.
- `npm run lint` or `yarn lint`: Runs ESLint for code quality checks.

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📬 Contact

For questions or feedback, please open an issue on the [GitHub repository](https://github.com/SpectralGT/EventManager/issues).