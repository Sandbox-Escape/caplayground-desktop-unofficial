const { app, BrowserWindow, protocol, ipcMain, shell } = require('electron');
const express = require('express');
const path = require('path');

let localServer;
let mainWindow;
let authWindow;
const LOCAL_PORT = 3000;

// Supabase configuration - replace with your actual values
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key-here';

// Create local Express server for fully offline CAPlayground
function createLocalServer() {
  const server = express();
  
  // Serve static files from a local directory
  server.use(express.static(path.join(__dirname, 'caplayground-local')));
  
  // Basic HTML template for CAPlayground - fully offline with login
  server.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
        <title>CAPlayground Desktop - Fully Local</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: #1a1a1a;
                color: #fff;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding: 20px;
                background: #2a2a2a;
                border-radius: 10px;
            }
            .login-section {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            .btn {
                padding: 10px 20px;
                background: #0066cc;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                text-decoration: none;
                font-size: 14px;
            }
            .btn:hover {
                background: #0052a3;
            }
            .btn-github {
                background: #333;
            }
            .btn-github:hover {
                background: #24292e;
            }
            .btn-discord {
                background: #5865f2;
            }
            .btn-discord:hover {
                background: #4752c4;
            }
            .user-info {
                display: none;
                gap: 10px;
                align-items: center;
            }
            .user-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #666;
            }
            .playground-area {
                background: #2a2a2a;
                border-radius: 10px;
                padding: 20px;
                min-height: 500px;
            }
            .code-editor {
                width: 100%;
                height: 400px;
                background: #1e1e1e;
                border: 1px solid #444;
                border-radius: 5px;
                padding: 15px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 14px;
                color: #fff;
                resize: vertical;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>CAPlayground Desktop</h1>
                <div class="login-section" id="loginSection">
                    <button class="btn btn-github" onclick="loginWithProvider('github')">Login with GitHub</button>
                    <button class="btn btn-discord" onclick="loginWithProvider('discord')">Login with Discord</button>
                    <button class="btn" onclick="showEmailLogin()">Email Login</button>
                </div>
                <div class="user-info" id="userInfo">
                    <img class="user-avatar" id="userAvatar" src="" alt="User">
                    <span id="userName">Loading...</span>
                    <button class="btn" onclick="logout()">Logout</button>
                </div>
            </div>
            <div class="playground-area">
                <h2>Code Playground</h2>
                <textarea class="code-editor" placeholder="Write your code here..." id="codeEditor">
// Welcome to CAPlayground Desktop!
// This is a fully local development environment

console.log('Hello, World!');

// Your code is saved locally and privately
// Login to sync with cloud (optional)
                </textarea>
                <div style="margin-top: 15px;">
                    <button class="btn" onclick="runCode()">Run Code</button>
                    <button class="btn" onclick="saveCode()">Save Locally</button>
                    <button class="btn" onclick="loadCode()">Load</button>
                </div>
                <div id="output" style="margin-top: 20px; padding: 15px; background: #1e1e1e; border-radius: 5px; min-height: 100px; white-space: pre-wrap; font-family: monospace;"></div>
            </div>
        </div>

        <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
        <script>
            // Initialize Supabase client
            const supabaseUrl = '${SUPABASE_URL}';
            const supabaseKey = '${SUPABASE_ANON_KEY}';
            const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
            
            let currentUser = null;
            
            // Check for existing session on load
            window.addEventListener('DOMContentLoaded', async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    updateUIForUser(session.user);
                }
                
                // Listen for auth changes
                supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'SIGNED_IN' && session) {
                        updateUIForUser(session.user);
                    } else if (event === 'SIGNED_OUT') {
                        updateUIForGuest();
                    }
                });
                
                // Load saved code
                const savedCode = localStorage.getItem('caplayground-code');
                if (savedCode) {
                    document.getElementById('codeEditor').value = savedCode;
                }
            });
            
            function loginWithProvider(provider) {
                // Send message to main process to handle OAuth
                if (window.electronAPI) {
                    window.electronAPI.startOAuth(provider);
                } else {
                    // Fallback for testing in browser
                    supabase.auth.signInWithOAuth({ provider });
                }
            }
            
            function showEmailLogin() {
                const email = prompt('Enter your email:');
                const password = prompt('Enter your password:');
                if (email && password) {
                    supabase.auth.signInWithPassword({ email, password })
                        .then(({ error }) => {
                            if (error) {
                                alert('Login failed: ' + error.message);
                            }
                        });
                }
            }
            
            function logout() {
                supabase.auth.signOut();
            }
            
            function updateUIForUser(user) {
                currentUser = user;
                document.getElementById('loginSection').style.display = 'none';
                document.getElementById('userInfo').style.display = 'flex';
                document.getElementById('userName').textContent = user.email || user.user_metadata?.name || 'User';
                
                if (user.user_metadata?.avatar_url) {
                    document.getElementById('userAvatar').src = user.user_metadata.avatar_url;
                }
            }
            
            function updateUIForGuest() {
                currentUser = null;
                document.getElementById('loginSection').style.display = 'flex';
                document.getElementById('userInfo').style.display = 'none';
            }
            
            function runCode() {
                const code = document.getElementById('codeEditor').value;
                const output = document.getElementById('output');
                
                try {
                    // Capture console output
                    const originalLog = console.log;
                    let result = '';
                    console.log = (...args) => {
                        result += args.join(' ') + '\n';
                    };
                    
                    // Execute code
                    eval(code);
                    
                    // Restore console.log
                    console.log = originalLog;
                    
                    output.textContent = result || 'Code executed successfully (no output)';
                } catch (error) {
                    output.textContent = 'Error: ' + error.message;
                }
            }
            
            function saveCode() {
                const code = document.getElementById('codeEditor').value;
                localStorage.setItem('caplayground-code', code);
                alert('Code saved locally!');
            }
            
            function loadCode() {
                const savedCode = localStorage.getItem('caplayground-code');
                if (savedCode) {
                    document.getElementById('codeEditor').value = savedCode;
                    alert('Code loaded!');
                } else {
                    alert('No saved code found.');
                }
            }
        </script>
    </body>
    </html>
    `);
  });
  
  return server.listen(LOCAL_PORT, () => {
    console.log(`CAPlayground local server running on http://localhost:${LOCAL_PORT}`);
  });
}

// Handle OAuth authentication
ipcMain.handle('start-oauth', async (event, provider) => {
  return new Promise((resolve, reject) => {
    const authUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=http://localhost:${LOCAL_PORT}/auth/callback`;
    
    authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: false,
      parent: mainWindow,
      modal: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });
    
    authWindow.loadURL(authUrl);
    authWindow.show();
    
    // Handle navigation to catch the callback
    authWindow.webContents.on('will-navigate', (event, navigationUrl) => {
      if (navigationUrl.includes('/auth/callback')) {
        // Extract tokens from URL
        const url = new URL(navigationUrl);
        const accessToken = url.searchParams.get('access_token');
        const refreshToken = url.searchParams.get('refresh_token');
        
        if (accessToken) {
          // Send tokens to renderer process
          mainWindow.webContents.send('auth-success', {
            access_token: accessToken,
            refresh_token: refreshToken
          });
          authWindow.close();
          resolve({ success: true });
        } else {
          authWindow.close();
          reject(new Error('Authentication failed'));
        }
      }
    });
    
    authWindow.on('closed', () => {
      authWindow = null;
    });
  });
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      enableRemoteModule: false,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    show: false
  });
  
  // Load the local server instead of remote URL
  mainWindow.loadURL(`http://localhost:${LOCAL_PORT}`);
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  // Optional: Open DevTools for debugging
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  // Start local server first
  localServer = createLocalServer();
  
  // Then create the window
  setTimeout(createWindow, 1000); // Give server time to start
});

app.on('window-all-closed', () => {
  if (localServer) {
    localServer.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Ensure we quit when all windows are closed
app.on('before-quit', () => {
  if (localServer) {
    localServer.close();
  }
});

// Handle external links
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
});
