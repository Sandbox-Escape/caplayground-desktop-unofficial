# caplayground-desktop (unofficial)

Electron desktop wrapper for caplayground.pages.dev (unofficial)

## How to Install and Run

### 1. Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (version 16 or higher recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - This will also install npm (Node Package Manager)
- **Git** (to clone the repository)
  - Download from [git-scm.com](https://git-scm.com/)

To verify your installation, open a terminal/command prompt and run:
```bash
node --version
npm --version
git --version
```

### 2. Cloning the Repository

1. Open your terminal/command prompt
2. Navigate to the directory where you want to clone the project
3. Run the following command:

```bash
git clone https://github.com/Sandbox-Escape/caplayground-desktop-unofficial.git
```

4. Navigate into the project directory:

```bash
cd caplayground-desktop-unofficial
```

### 3. Installing Dependencies

Install all required dependencies using npm:

```bash
npm install
```

This will download and install all the packages listed in `package.json`, including Electron and other necessary dependencies.

### 4. Running the App

To start the application in development mode:

```bash
npm start
```

This will:
- Launch the Electron application
- Open a desktop window with the caplayground.pages.dev interface
- Enable hot-reload for development (if configured)

To stop the application, press `Ctrl+C` in the terminal or close the application window.

### 5. (Optional) Packaging the App

To create a distributable installer for your operating system, you can use Electron Builder:

#### Install Electron Builder (if not already included)

```bash
npm install --save-dev electron-builder
```

#### Build for your current platform

```bash
# For the current platform
npm run build

# Or use electron-builder directly
npx electron-builder
```

#### Build for specific platforms

```bash
# For Windows
npx electron-builder --win

# For macOS
npx electron-builder --mac

# For Linux
npx electron-builder --linux
```

#### Build for all platforms

```bash
npx electron-builder --mwl
```

The built installers will be available in the `dist/` directory.

**Note:** To build for macOS on non-Mac systems, or for Windows on non-Windows systems, you may need additional setup. Refer to the [Electron Builder documentation](https://www.electron.build/) for platform-specific build requirements.

## Troubleshooting

### Common Issues

- **"npm command not found"**: Make sure Node.js is properly installed and added to your system PATH
- **Permission errors on Linux/macOS**: Try running commands with `sudo` or fix npm permissions
- **Build fails**: Ensure all dependencies are installed (`npm install`) and you're using a compatible Node.js version
- **App won't start**: Check the console for error messages and ensure the main.js file exists

### Getting Help

If you encounter issues:
1. Check the [Issues](https://github.com/Sandbox-Escape/caplayground-desktop-unofficial/issues) page for known problems
2. Create a new issue with details about your problem and system information
3. Include error messages and steps to reproduce the issue

## License

This is an unofficial project. Please refer to the original caplayground.pages.dev for licensing information.
