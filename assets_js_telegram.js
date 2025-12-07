// telegram.js - Telegram WebApp integration
(function() {
  'use strict';

  // Telegram WebApp SDK will be loaded via script tag in HTML
  // This file handles initialization and provides utility functions

  const TG_BOT_USERNAME = 'fayni_arts';
  const TG_DM_URL = `https://t.me/${TG_BOT_USERNAME}`;
  
  let isTelegramEnv = false;
  let webApp = null;

  /**
   * Initialize Telegram WebApp
   */
  function initTelegramWebApp() {
    // Check if we're inside Telegram
    if (window.Telegram && window.Telegram.WebApp) {
      isTelegramEnv = true;
      webApp = window.Telegram.WebApp;
      
      console.log('Telegram WebApp detected');
      
      // Apply Telegram environment class
      document.body.classList.add('tg-env');
      
      // Initialize WebApp
      try {
        webApp.ready();
        
        // Apply theme from Telegram
        applyTelegramTheme();
        
        // Setup back button if available
        if (webApp.BackButton) {
          webApp.BackButton.onClick(() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              // If no history, close WebApp
              webApp.close();
            }
          });
        }
        
        // Setup main button for quick DM
        setupMainButton();
        
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
      }
    } else {
      console.log('Not in Telegram environment');
    }
  }

  /**
   * Apply Telegram theme to match app appearance
   */
  function applyTelegramTheme() {
    if (!webApp) return;
    
    // Telegram provides theme params
    const themeParams = webApp.themeParams;
    
    if (themeParams) {
      // Override CSS variables with Telegram theme
      const root = document.documentElement;
      
      if (themeParams.bg_color) {
        root.style.setProperty('--bg', themeParams.bg_color);
        root.style.setProperty('--bg-rgb', hexToRgb(themeParams.bg_color).join(','));
      }
      
      if (themeParams.text_color) {
        root.style.setProperty('--text', themeParams.text_color);
        root.style.setProperty('--text-rgb', hexToRgb(themeParams.text_color).join(','));
      }
      
      if (themeParams.hint_color) {
        root.style.setProperty('--muted', themeParams.hint_color);
        root.style.setProperty('--muted-rgb', hexToRgb(themeParams.hint_color).join(','));
      }
      
      if (themeParams.link_color) {
        root.style.setProperty('--accent', themeParams.link_color);
        root.style.setProperty('--accent-rgb', hexToRgb(themeParams.link_color).join(','));
      }
      
      if (themeParams.secondary_bg_color) {
        root.style.setProperty('--line', themeParams.secondary_bg_color);
        root.style.setProperty('--line-rgb', hexToRgb(themeParams.secondary_bg_color).join(','));
      }
    }
  }

  /**
   * Setup Telegram main button for quick DM
   */
  function setupMainButton() {
    if (!webApp || !webApp.MainButton) return;
    
    try {
      webApp.MainButton.setParams({
        text: 'Написать в ТГ',
        color: '#ffffff',
        text_color: '#000000',
        is_visible: true
      });
      
      webApp.MainButton.onClick(() => {
        openDM();
      });
    } catch (error) {
      console.error('Error setting up MainButton:', error);
    }
  }

  /**
   * Open Telegram direct message
   * Works both in Telegram WebApp and regular browser
   */
  function openDM() {
    try {
      if (isTelegramEnv && webApp && webApp.openTelegramLink) {
        // Inside Telegram - use native method
        webApp.openTelegramLink(TG_DM_URL);
      } else {
        // Outside Telegram - open in new tab
        window.open(TG_DM_URL, '_blank', 'noopener,noreferrer');
      }
      
      // Send analytics event if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'telegram_dm_click', {
          in_telegram: isTelegramEnv
        });
      }
    } catch (error) {
      console.error('Error opening DM:', error);
      // Fallback to direct window.open
      window.open(TG_DM_URL, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Open Telegram channel
   * @param {string} channelUrl - Full channel URL
   */
  function openChannel(channelUrl) {
    try {
      if (isTelegramEnv && webApp && webApp.openTelegramLink) {
        webApp.openTelegramLink(channelUrl);
      } else {
        window.open(channelUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error opening channel:', error);
      window.open(channelUrl, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Get current WebApp info
   * @returns {Object|null} WebApp info
   */
  function getWebAppInfo() {
    if (!webApp) return null;
    
    return {
      version: webApp.version,
      platform: webApp.platform,
      colorScheme: webApp.colorScheme,
      themeParams: webApp.themeParams,
      initData: webApp.initData,
      initDataUnsafe: webApp.initDataUnsafe
    };
  }

  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color
   * @returns {number[]} RGB values
   */
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }

  /**
   * Show alert via Telegram
   * @param {string} message - Alert message
   */
  function showAlert(message) {
    if (webApp && webApp.showAlert) {
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  }

  /**
   * Show confirm dialog via Telegram
   * @param {string} message - Confirm message
   * @param {Function} callback - Callback function
   */
  function showConfirm(message, callback) {
    if (webApp && webApp.showConfirm) {
      webApp.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      if (callback) callback(result);
    }
  }

  /**
   * Close WebApp (only works inside Telegram)
   */
  function closeWebApp() {
    if (webApp && webApp.close) {
      webApp.close();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTelegramWebApp);
  } else {
    initTelegramWebApp();
  }

  // Expose functions globally
  window.openDM = openDM;
  window.openTelegramChannel = openChannel;
  window.getWebAppInfo = getWebAppInfo;
  window.showTelegramAlert = showAlert;
  window.showTelegramConfirm = showConfirm;
  window.closeTelegramWebApp = closeWebApp;
  
  // Expose state
  window.isTelegramEnvironment = () => isTelegramEnv;
  window.telegramWebApp = () => webApp;

  console.log('Telegram integration loaded');
})();