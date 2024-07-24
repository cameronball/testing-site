(function() {
    let preferenceChanged = false; // Flag to track if the preference has changed

    // Function to set a cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Function to get a cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Function to get all cookies
    function getAllCookies() {
        const cookies = {};
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            const [name, ...value] = c.split('=');
            cookies[name] = value.join('=');
        }
        return cookies;
    }

    // Function to generate a hash from a string
    function hashString(str) {
        let hash = 0, i, chr;
        if (str.length === 0) return hash.toString();
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    // Function to generate a consistent unique identifier for an element
    function generateConsistentId(element) {
        let path = element.tagName;
        const attributes = Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`).join(';');
        if (attributes) {
            path += `|${attributes}`;
        }
        let parent = element.parentElement;
        while (parent) {
            path = parent.tagName + '>' + path;
            parent = parent.parentElement;
        }
        return hashString(path);
    }

    // Function to assign consistent unique identifiers to all elements
    function assignConsistentIds() {
        const allElements = document.getElementsByTagName('*');
        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            const consistentId = generateConsistentId(element);
            element.setAttribute('data-aydio-id', consistentId);
        }
    }

    // Function to create the popup
    function createPopup() {
        const overlay = document.createElement("div");
        overlay.id = "overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0, 0, 0, 0.5)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "1000";

        const popup = document.createElement("div");
        popup.id = "popup";
        popup.style.background = "white";
        popup.style.padding = "20px";
        popup.style.borderRadius = "5px";
        popup.style.textAlign = "center";
        popup.style.width = "500px";

        const title = document.createElement("h2");
        title.innerText = "Would you like adverts?";
        popup.appendChild(title);

        const message = document.createElement("p");
        message.innerText = "We offer an ad-supported version and a no-ads version of our site. Please choose your preference:";
        popup.appendChild(message);

        const noAdsButton = document.createElement("button");
        noAdsButton.id = "no-ads-button";
        noAdsButton.className = "popup-button";
        noAdsButton.innerText = "No Ads (Free)";
        noAdsButton.style.margin = "10px";
        noAdsButton.style.padding = "10px 20px";
        noAdsButton.style.border = "none";
        noAdsButton.style.cursor = "pointer";
        noAdsButton.style.borderRadius = "5px";
        noAdsButton.style.backgroundColor = "#4CAF50";
        noAdsButton.style.color = "white";

        const adsButton = document.createElement("button");
        adsButton.id = "ads-button";
        adsButton.className = "popup-button";
        adsButton.innerText = "I want ads.";
        adsButton.style.margin = "10px";
        adsButton.style.padding = "10px 20px";
        adsButton.style.border = "none";
        adsButton.style.cursor = "pointer";
        adsButton.style.borderRadius = "5px";
        adsButton.style.backgroundColor = "#f44336";
        adsButton.style.color = "white";

        popup.appendChild(noAdsButton);
        popup.appendChild(adsButton);

        const consentMessage = document.createElement("p");
        consentMessage.innerText = "By clicking 'No Ads' you agree to aydio's collection of data according to our privacy policy and terms, helping us to provide this site to you free of charge and ads.";
        consentMessage.style.fontSize = "1.25vh";
        popup.appendChild(consentMessage);

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        adsButton.addEventListener("click", function() {
            setCookie("userPreference", "ads", 30);
            document.body.removeChild(overlay);
            if (preferenceChanged) {
                setTimeout(() => location.reload(), 100); // Reload the page if preference changed
            }
        });

        noAdsButton.addEventListener("click", function() {
            setCookie("userPreference", "no-ads", 30);
            document.body.removeChild(overlay);
            logClicks();
            startKeystrokeLogging();
            gatherFingerprintData();
            console.log("All cookies:", getAllCookies());
            if (preferenceChanged) {
                setTimeout(() => location.reload(), 100); // Reload the page if preference changed
            }
        });
    }

    // Function to check if the user has already made a choice
    function checkCookie() {
        const userPreference = getCookie("userPreference");
        if (!userPreference) {
            createPopup();
        } else if (userPreference === "no-ads") {
            logClicks();
            startKeystrokeLogging();
            gatherFingerprintData();
            console.log("All cookies:", getAllCookies());
        }
    }

    // Function to log clicks on elements with their aydio-id
    function logClicks() {
        document.addEventListener('click', function(event) {
            const target = event.target;
            const aydioId = target.getAttribute('data-aydio-id');
            if (aydioId) {
                console.log(`Element clicked: aydio-id = ${aydioId}`);
                
                // Additional data
                const tagName = target.tagName;
                const classList = target.classList.toString();
                const elementId = target.id;
                const attributes = Array.from(target.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', ');
                const textContent = target.textContent.trim();
                const parentTagName = target.parentNode ? target.parentNode.tagName : null;
                const rect = target.getBoundingClientRect();
                const position = `Top: ${rect.top}, Left: ${rect.left}, Width: ${rect.width}, Height: ${rect.height}`;
                
                console.log(`Tag Name: ${tagName}`);
                console.log(`Class List: ${classList}`);
                console.log(`Element ID: ${elementId}`);
                console.log(`Attributes: ${attributes}`);
                console.log(`Text Content: ${textContent}`);
                console.log(`Parent Tag Name: ${parentTagName}`);
                console.log(`Position: ${position}`);
            }
        });
    }

    // Function to start logging keystrokes
    function startKeystrokeLogging() {
        let keystrokeBuffer = "";

        document.addEventListener('keydown', function(event) {
            keystrokeBuffer += event.key;
        });

        setInterval(() => {
            if (keystrokeBuffer.length > 0) {
                console.log(`Keystrokes: ${keystrokeBuffer}`);
                keystrokeBuffer = ""; // Reset buffer after logging
            }
        }, 30000); // Log keystrokes every 30 seconds
    }

    // Function to gather fingerprinting data
    function gatherFingerprintData() {
        const fingerprint = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportResolution: `${window.innerWidth}x${window.innerHeight}`,
            colorDepth: screen.colorDepth,
            timezoneOffset: new Date().getTimezoneOffset(),
            localStorageEnabled: checkLocalStorage(),
            sessionStorageEnabled: checkSessionStorage(),
            cookiesEnabled: navigator.cookieEnabled,
            deviceMemory: navigator.deviceMemory || 'N/A',
            hardwareConcurrency: navigator.hardwareConcurrency || 'N/A',
            plugins: getPlugins(),
            webGLRenderer: getWebGLRenderer(),
            touchSupport: getTouchSupport()
        };

        console.log("Fingerprint data:", fingerprint);
    }

    function checkLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

    function checkSessionStorage() {
        try {
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

    function getPlugins() {
        return Array.from(navigator.plugins).map(plugin => plugin.name).join(', ');
    }

    function getWebGLRenderer() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                }
            }
        } catch (e) {
            return 'N/A';
        }
        return 'N/A';
    }

    function getTouchSupport() {
        return {
            maxTouchPoints: navigator.maxTouchPoints || 0,
            touchEvent: 'ontouchstart' in window,
            touchStart: window.TouchEvent ? true : false
        };
    }

    // Function to create and style the circular button
    function createPreferenceButton() {
        const button = document.createElement("button");
        button.id = "preference-button";
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.width = "50px";
        button.style.height = "50px";
        button.style.borderRadius = "50%";
        button.style.backgroundColor = "#007BFF";
        button.style.color = "white";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.fontSize = "20px";
        button.style.zIndex = "1001";
        button.innerText = "⚙️";

        document.body.appendChild(button);

        button.addEventListener("click", function() {
            preferenceChanged = true;
            createPopup();
        });
    }

    window.onload = function() {
        assignConsistentIds();
        checkCookie();
        createPreferenceButton();
    };
})();
