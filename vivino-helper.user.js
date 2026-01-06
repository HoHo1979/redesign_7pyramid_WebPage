// ==UserScript==
// @name         Vivino Image Helper - Copy URLs Easily
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes copying Vivino image URLs easier - adds copy buttons to images
// @author       Wine Collector
// @match        https://www.vivino.com/*
// @icon         https://www.vivino.com/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';

    // Wait for page to load
    setTimeout(function() {
        addCopyButtonsToImages();
    }, 1000);

    function addCopyButtonsToImages() {
        // Find all wine images on product pages
        const images = document.querySelectorAll('img[alt*="bottle"], img[alt*="wine"], img.product-image');

        images.forEach((img, index) => {
            // Skip if already has button
            if (img.parentElement.querySelector('.vivino-copy-btn')) return;

            // Create copy button
            const btn = document.createElement('button');
            btn.className = 'vivino-copy-btn';
            btn.innerHTML = '📋 Copy Image URL';
            btn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 8px 12px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s;
            `;

            // Make button visible on hover
            img.parentElement.style.position = 'relative';
            img.parentElement.addEventListener('mouseenter', () => {
                btn.style.opacity = '1';
            });
            img.parentElement.addEventListener('mouseleave', () => {
                btn.style.opacity = '0';
            });

            // Copy URL on click
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const imageUrl = img.src || img.getAttribute('data-src');
                if (imageUrl) {
                    copyToClipboard(imageUrl);
                    btn.innerHTML = '✅ Copied!';
                    setTimeout(() => {
                        btn.innerHTML = '📋 Copy Image URL';
                    }, 2000);
                }
            });

            img.parentElement.appendChild(btn);
        });
    }

    function copyToClipboard(text) {
        try {
            GM_setClipboard(text, 'text');
            showNotification('Image URL copied! Paste into your tracker.', 'success');
        } catch (e) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showNotification('Image URL copied!', 'success');
        }
    }

    function showNotification(message, type = 'info') {
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4caf50' : '#667eea'};
            color: white;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notif.textContent = message;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.remove();
        }, 3000);
    }

    // Re-scan for new images periodically
    setInterval(function() {
        addCopyButtonsToImages();
    }, 5000);
})();
