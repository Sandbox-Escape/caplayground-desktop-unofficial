# CAPlayground Desktop - Fully Local & Offline

🔒 **Complete offline Electron desktop application for CAPlayground - No remote connections, no cloud sync, no login required**

## ⚠️ Important: Fully Local Operation

**This desktop application is now completely offline and local:**
- ❌ No connections to caplayground.pages.dev or any remote service
- ❌ No cloud sync or remote storage
- ❌ No login, authentication, or user accounts
- ❌ No external API calls or network requests
- ✅ Everything runs locally on your machine
- ✅ Your code never leaves your device
- ✅ Works completely offline
- ✅ Built-in local code editor and execution environment

## 🚀 Features

- **Full Offline Operation**: Runs entirely on your local machine without any internet connection
- **Built-in Code Editor**: Clean, modern interface with syntax highlighting
- **Local Code Execution**: Safe, sandboxed JavaScript execution environment
- **No External Dependencies**: All functionality is self-contained
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Privacy-First**: Your code and data never leave your device

## 📦 Installation and Setup

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (version 16 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **Git** (for cloning) - Download from [git-scm.com](https://git-scm.com/)

Verify your installation:
```bash
node --version
npm --version
git --version
```

### 1. Clone the Repository

```bash
git clone https://github.com/Sandbox-Escape/caplayground-desktop-unofficial.git
cd caplayground-desktop-unofficial
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Electron for the desktop application
- Express for the local server
- All other required dependencies

### 3. Run the Application

```bash
npm start
```

This will:
1. Start a local Express server on `http://localhost:3000`
2. Launch the Electron desktop application
3. Display the fully local CAPlayground interface

**Note**: The application creates its own local server and does not connect to any external services.

## 🏗️ Building Distributable Packages

To create installers for distribution:

### Build for Current Platform
```bash
npm run build
```

### Build for Specific Platforms
```bash
# Windows
npx electron-builder --win

# macOS
npx electron-builder --mac

# Linux
npx electron-builder --linux

# All platforms
npx electron-builder --mwl
```

Built packages will be available in the `dist/` directory.

## 🔧 Architecture

- **Electron Main Process**: Manages the desktop application window
- **Local Express Server**: Serves the CAPlayground interface on localhost:3000
- **Built-in Editor**: HTML/CSS/JavaScript-based code editor
- **Local Execution**: Safe evaluation of code within the Electron context
- **No Network Dependencies**: Everything runs locally

## 🛡️ Security

This application prioritizes security and privacy:
- **No Remote Connections**: Never connects to external servers
- **Sandboxed Execution**: Code execution is contained within the application
- **No Data Collection**: No telemetry, analytics, or user tracking
- **Local Storage Only**: All data stays on your device

## ⚠️ Migration from Remote Version

If you previously used a version that connected to caplayground.pages.dev:
- **Your local code is safe**: This version doesn't access remote data
- **No cloud sync**: You'll need to manually save/backup your code
- **Fully independent**: This version works completely offline

## 🐛 Troubleshooting

### Common Issues

**"Port 3000 already in use"**
- Close any other applications using port 3000
- Or modify `LOCAL_PORT` in `main.js`

**Application won't start**
- Ensure Node.js and npm are properly installed
- Run `npm install` again to verify dependencies
- Check that no antivirus is blocking the application

**Code execution errors**
- Remember this is a basic execution environment
- Complex operations may need additional setup
- Check the browser console for detailed error messages

### Getting Help

1. Check the [Issues](https://github.com/Sandbox-Escape/caplayground-desktop-unofficial/issues) page
2. Create a new issue with:
   - Your operating system
   - Node.js version
   - Error messages
   - Steps to reproduce

## 📝 Development

To modify or extend the application:

1. **Frontend**: Edit the HTML template in `main.js` (around line 20-100)
2. **Backend**: Modify the Express server setup in `main.js`
3. **Electron**: Adjust window properties and app behavior in `main.js`
4. **Packaging**: Update build settings in `package.json`

## 📄 License

This is an unofficial, independent project. The application runs completely locally and does not interact with any remote CAPlayground services.

## 🔄 Version History

- **v2.0.0**: Complete rewrite for fully local operation
- **v1.0.0**: Original remote wrapper (deprecated)

---

**🔒 Privacy Notice**: This application operates entirely offline. No data is transmitted to external servers, and no user information is collected or stored remotely.
