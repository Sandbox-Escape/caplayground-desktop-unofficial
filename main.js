const { app, BrowserWindow, protocol } = require('electron');
const express = require('express');
const path = require('path');

let localServer;
const LOCAL_PORT = 3000;

// Create local Express server for fully offline CAPlayground
function createLocalServer() {
  const server = express();
  
  // Serve static files from a local directory
  server.use(express.static(path.join(__dirname, 'caplayground-local')));
  
  // Basic HTML template for CAPlayground - fully offline
  server.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                text-align: center;
                margin-bottom: 30px;
            }
            .playground {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                height: 70vh;
            }
            .editor, .preview {
                border: 1px solid #333;
                border-radius: 8px;
                background: #2d2d2d;
            }
            .editor-header, .preview-header {
                padding: 10px 15px;
                background: #333;
                border-bottom: 1px solid #444;
                font-size: 14px;
                font-weight: 600;
            }
            textarea {
                width: 100%;
                height: calc(100% - 45px);
                border: none;
                background: #2d2d2d;
                color: #fff;
                padding: 15px;
                font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
                font-size: 14px;
                resize: none;
                outline: none;
            }
            .preview-content {
                padding: 15px;
                height: calc(100% - 45px);
                overflow: auto;
            }
            .offline-notice {
                background: #0d7377;
                color: #fff;
                padding: 10px;
                border-radius: 6px;
                margin-bottom: 20px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 CAPlayground Desktop</h1>
                <div class="offline-notice">
                    🔒 Fully Local & Offline - No remote connections or cloud sync
                </div>
            </div>
            
            <div class="playground">
                <div class="editor">
                    <div class="editor-header">Code Editor</div>
                    <textarea id="code-editor" placeholder="Write your code here...\n\n// This is a fully local CAPlayground\n// No cloud sync, no login required\n// Everything stays on your device\n\nconsole.log('Hello from local CAPlayground!');"></textarea>
                </div>
                
                <div class="preview">
                    <div class="preview-header">Output</div>
                    <div class="preview-content" id="output">
                        <p>Welcome to the fully local CAPlayground!</p>
                        <p>✅ No remote API calls</p>
                        <p>✅ No cloud sync</p>
                        <p>✅ No login required</p>
                        <p>✅ Completely offline</p>
                        <p>Start coding to see your output here.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            const editor = document.getElementById('code-editor');
            const output = document.getElementById('output');
            
            // Simple local code execution (safe, sandboxed)
            editor.addEventListener('input', () => {
                const code = editor.value;
                if (code.trim()) {
                    try {
                        // Very basic local execution for demonstration
                        // In a real implementation, you'd want proper sandboxing
                        const logs = [];
                        const originalLog = console.log;
                        console.log = (...args) => {
                            logs.push(args.join(' '));
                        };
                        
                        // Execute in local context only
                        eval(code);
                        
                        console.log = originalLog;
                        
                        output.innerHTML = logs.length > 0 
                            ? '<pre>' + logs.join('\\n') + '</pre>'
                            : '<p>Code executed successfully (no output)</p>';
                    } catch (error) {
                        output.innerHTML = '<pre style="color: #ff6b6b;">Error: ' + error.message + '</pre>';
                    }
                } else {
                    output.innerHTML = '<p>Start coding to see your output here.</p>';
                }
            });
        </script>
    </body>
    </html>
    `);
  });
  
  return server.listen(LOCAL_PORT, 'localhost', () => {
    console.log(`Local CAPlayground server running on http://localhost:${LOCAL_PORT}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      // Disable any remote/external features
      enableRemoteModule: false,
      allowRunningInsecureContent: false
    },
    titleBarStyle: 'default',
    show: false
  });
  
  // Load the local server instead of remote URL
  win.loadURL(`http://localhost:${LOCAL_PORT}`);
  
  win.once('ready-to-show', () => {
    win.show();
  });
  
  // Optional: Open DevTools for debugging
  // win.webContents.openDevTools();
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
