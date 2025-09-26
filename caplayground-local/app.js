// CAPlayground Desktop - JavaScript Application Logic
// Fully local and offline animated wallpaper editor

class CAPlaygroundDesktop {
  constructor() {
    this.layers = [];
    this.activeLayerId = null;
    this.layerCounter = 0;
    this.isPreviewMode = false;
    this.canvas = document.getElementById('canvas');
    this.layersList = document.getElementById('layers-list');
    
    // Initialize with default background layer
    this.addDefaultLayer();
    this.bindEvents();
    this.loadFromStorage();
  }
  
  bindEvents() {
    // Auto-save on changes
    document.addEventListener('change', () => this.autoSave());
    document.addEventListener('input', () => this.autoSave());
    
    // Layer selection
    this.layersList.addEventListener('click', (e) => {
      if (e.target.closest('.layer-item')) {
        const layerId = e.target.closest('.layer-item').dataset.layer;
        this.selectLayer(layerId);
      }
    });
  }
  
  addDefaultLayer() {
    const backgroundLayer = {
      id: 'background',
      name: 'Background',
      type: 'shape',
      x: 0,
      y: 0,
      width: 375,
      height: 812,
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      opacity: 1,
      animation: 'none',
      duration: 2,
      zIndex: 0
    };
    
    this.layers.push(backgroundLayer);
    this.activeLayerId = 'background';
    this.renderCanvas();
    this.updateLayersList();
  }
  
  addLayer() {
    this.layerCounter++;
    const newLayer = {
      id: `layer-${this.layerCounter}`,
      name: `Layer ${this.layerCounter}`,
      type: 'shape',
      x: Math.floor(Math.random() * 200) + 87,
      y: Math.floor(Math.random() * 500) + 156,
      width: 100,
      height: 100,
      backgroundColor: this.getRandomColor(),
      opacity: 0.7,
      animation: 'none',
      duration: 2,
      zIndex: this.layers.length
    };
    
    this.layers.push(newLayer);
    this.selectLayer(newLayer.id);
    this.updateLayersList();
    this.renderCanvas();
    this.showToast(`Added ${newLayer.name}`);
  }
  
  selectLayer(layerId) {
    this.activeLayerId = layerId;
    this.updateLayersList();
    this.updatePropertiesPanel();
    this.highlightActiveLayer();
  }
  
  updateLayersList() {
    this.layersList.innerHTML = '';
    
    this.layers.forEach(layer => {
      const layerElement = document.createElement('div');
      layerElement.className = `layer-item ${layer.id === this.activeLayerId ? 'active' : ''}`;
      layerElement.dataset.layer = layer.id;
      
      const icon = this.getLayerIcon(layer.type);
      layerElement.innerHTML = `
        <span>${layer.name}</span>
        <span>${icon}</span>
      `;
      
      this.layersList.appendChild(layerElement);
    });
  }
  
  getLayerIcon(type) {
    const icons = {
      shape: '🟡',
      text: '📝',
      image: '🖼️',
      background: '🎨'
    };
    return icons[type] || '⚪';
  }
  
  updatePropertiesPanel() {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer) return;
    
    document.getElementById('layerType').value = activeLayer.type;
    document.getElementById('width').value = activeLayer.width;
    document.getElementById('height').value = activeLayer.height;
    document.getElementById('x').value = activeLayer.x;
    document.getElementById('y').value = activeLayer.y;
    document.getElementById('animationType').value = activeLayer.animation;
    document.getElementById('duration').value = activeLayer.duration;
    document.getElementById('bgColor').value = this.hexFromColor(activeLayer.backgroundColor);
    document.getElementById('opacity').value = activeLayer.opacity;
  }
  
  getActiveLayer() {
    return this.layers.find(layer => layer.id === this.activeLayerId);
  }
  
  updateProperty(property, value) {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer) return;
    
    activeLayer[property] = property === 'backgroundColor' ? value : parseFloat(value);
    this.renderCanvas();
    this.autoSave();
  }
  
  updateLayerType() {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer) return;
    
    activeLayer.type = document.getElementById('layerType').value;
    this.updateLayersList();
    this.renderCanvas();
  }
  
  updateAnimation() {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer) return;
    
    activeLayer.animation = document.getElementById('animationType').value;
    activeLayer.duration = parseFloat(document.getElementById('duration').value);
    this.renderCanvas();
    this.autoSave();
  }
  
  renderCanvas() {
    // Clear canvas
    this.canvas.innerHTML = '';
    
    // Render layers in z-index order
    const sortedLayers = [...this.layers].sort((a, b) => a.zIndex - b.zIndex);
    
    sortedLayers.forEach(layer => {
      if (layer.id === 'background') {
        this.canvas.style.background = layer.backgroundColor;
        return;
      }
      
      const layerElement = document.createElement('div');
      layerElement.className = 'animated-layer';
      layerElement.dataset.layerId = layer.id;
      
      // Apply styles
      layerElement.style.cssText = `
        left: ${layer.x}px;
        top: ${layer.y}px;
        width: ${layer.width}px;
        height: ${layer.height}px;
        background: ${layer.backgroundColor};
        opacity: ${layer.opacity};
        z-index: ${layer.zIndex};
      `;
      
      // Apply animation
      if (layer.animation !== 'none') {
        layerElement.style.animation = `${layer.animation} ${layer.duration}s infinite`;
      }
      
      // Add content based on type
      if (layer.type === 'text') {
        layerElement.textContent = layer.text || 'Sample Text';
        layerElement.style.display = 'flex';
        layerElement.style.alignItems = 'center';
        layerElement.style.justifyContent = 'center';
        layerElement.style.color = 'white';
        layerElement.style.fontWeight = 'bold';
      }
      
      this.canvas.appendChild(layerElement);
    });
  }
  
  highlightActiveLayer() {
    // Remove previous highlights
    document.querySelectorAll('.animated-layer').forEach(el => {
      el.style.outline = 'none';
    });
    
    // Highlight active layer
    const activeElement = document.querySelector(`[data-layer-id="${this.activeLayerId}"]`);
    if (activeElement) {
      activeElement.style.outline = '2px solid #0066cc';
    }
  }
  
  togglePreview() {
    this.isPreviewMode = !this.isPreviewMode;
    
    if (this.isPreviewMode) {
      document.querySelectorAll('.animated-layer').forEach(el => {
        el.style.outline = 'none';
      });
      this.showToast('Preview Mode ON');
    } else {
      this.highlightActiveLayer();
      this.showToast('Preview Mode OFF');
    }
  }
  
  resetCanvas() {
    this.layers = [];
    this.layerCounter = 0;
    this.addDefaultLayer();
    this.showToast('Canvas Reset');
  }
  
  exportProject() {
    const projectData = {
      name: 'CAPlayground_Wallpaper',
      timestamp: Date.now(),
      layers: this.layers,
      canvasSize: { width: 375, height: 812 }
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `caplayground_${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    this.showToast('Project Exported!');
  }
  
  saveProject() {
    const projectData = {
      layers: this.layers,
      activeLayerId: this.activeLayerId,
      layerCounter: this.layerCounter
    };
    
    localStorage.setItem('caplayground-project', JSON.stringify(projectData));
    this.showToast('Project Saved Locally!');
  }
  
  loadFromStorage() {
    const saved = localStorage.getItem('caplayground-project');
    if (saved) {
      try {
        const projectData = JSON.parse(saved);
        this.layers = projectData.layers || [];
        this.activeLayerId = projectData.activeLayerId || null;
        this.layerCounter = projectData.layerCounter || 0;
        
        if (this.layers.length === 0) {
          this.addDefaultLayer();
        } else {
          this.updateLayersList();
          this.renderCanvas();
          this.updatePropertiesPanel();
        }
        
        console.log('Project loaded from storage');
      } catch (e) {
        console.warn('Failed to load project from storage', e);
        this.addDefaultLayer();
      }
    }
  }
  
  autoSave() {
    // Debounced auto-save
    clearTimeout(this.autoSaveTimeout);
    this.autoSaveTimeout = setTimeout(() => {
      this.saveProject();
    }, 1000);
  }
  
  getRandomColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  hexFromColor(color) {
    // Simple color extraction for color input
    if (color.startsWith('#')) return color;
    return '#ffffff'; // fallback
  }
  
  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2000);
  }
}

// Global functions for HTML event handlers
let app;

function addLayer() {
  app.addLayer();
}

function updateProperty(property, value) {
  app.updateProperty(property, value);
}

function updateLayerType() {
  app.updateLayerType();
}

function updateAnimation() {
  app.updateAnimation();
}

function togglePreview() {
  app.togglePreview();
}

function resetCanvas() {
  app.resetCanvas();
}

function exportProject() {
  app.exportProject();
}

function saveProject() {
  app.saveProject();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  app = new CAPlaygroundDesktop();
  console.log('CAPlayground Desktop initialized');
});
