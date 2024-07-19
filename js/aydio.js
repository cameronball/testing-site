(function() {
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
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Function to create a unique 8-digit alphanumeric identifier
    function generateUniqueId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Function to assign unique identifiers to all elements
    function assignUniqueIds() {
        const allElements = document.getElementsByTagName('*');
        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            const uniqueId = generateUniqueId();
            element.setAttribute('data-aydio-id', uniqueId);
        }
    }

    // Function to create the popup
    function createPopup() {
        // Create overlay
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

        // Create popup
        const popup = document.createElement("div");
        popup.id = "popup";
        popup.style.background = "white";
        popup.style.padding = "20px";
        popup.style.borderRadius = "5px";
        popup.style.textAlign = "center";
        popup.style.width = "500px";

        // Create title
        const title = document.createElement("h2");
        title.innerText = "Would you like adverts?";
        popup.appendChild(title);

        // Create message
        const message = document.createElement("p");
        message.innerText = "We offer an ad-supported version and a no-ads version of our site. Please choose your preference:";
        popup.appendChild(message);

        // Create buttons
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

        // Append buttons to popup
        popup.appendChild(noAdsButton);
        popup.appendChild(adsButton);

        // Create consent message
        const consentMessage = document.createElement("p");
        consentMessage.innerText = "By clicking 'No Ads' you agree to aydio's collection of data according to our privacy policy and terms, helping us to provide this site to you free of charge and ads.";
        consentMessage.style.fontSize = "1.25vh";
        popup.appendChild(consentMessage);

        // Append popup to overlay
        overlay.appendChild(popup);

        // Append overlay to body
        document.body.appendChild(overlay);

        // Event listeners for buttons
        adsButton.addEventListener("click", function() {
            setCookie("userPreference", "ads", 30);
            document.body.removeChild(overlay);
        });

        noAdsButton.addEventListener("click", function() {
            setCookie("userPreference", "no-ads", 30);
            document.body.removeChild(overlay);
            logClicks(); // Start logging clicks if "no-ads" is selected
            startScreenshotInterval(); // Start taking screenshots if "no-ads" is selected
        });
    }

    // Function to check if the user has already made a choice
    function checkCookie() {
        const userPreference = getCookie("userPreference");
        if (!userPreference) {
            createPopup();
        } else if (userPreference === "no-ads") {
            logClicks(); // Start logging clicks if "no-ads" is already set
            startScreenshotInterval(); // Start taking screenshots if "no-ads" is already set
        }
    }

    // Function to log clicks on elements with their aydio-id
    function logClicks() {
        document.addEventListener('click', function(event) {
            const target = event.target;
            const aydioId = target.getAttribute('data-aydio-id');
            const tagName = target.tagName;
            const classList = target.classList.toString();
            const elementId = target.id;
            const attributes = Array.from(target.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', ');
            const textContent = target.textContent.trim();
            const parentTagName = target.parentNode ? target.parentNode.tagName : null;
            const rect = target.getBoundingClientRect();
            const position = `Top: ${rect.top}, Left: ${rect.left}, Width: ${rect.width}, Height: ${rect.height}`;
    
            if (aydioId) {
                console.log(`Element clicked: aydio-id = ${aydioId}`);
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

    // Function to load the html2canvas library dynamically
    function loadHtml2Canvas(callback) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'; // Updated URL to the latest version
        script.onload = callback;
        document.head.appendChild(script);
    }

    // Function to take a screenshot of the viewport using html2canvas
    function takeScreenshot() {
        // Capture only the viewport area
        html2canvas(document.body, { 
            scrollX: 0,
            scrollY: 0,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        }).then(function(canvas) {
            const img = canvas.toDataURL('image/png');
            console.log(`Screenshot taken: ${img}`);
            // Here you can send `img` to your server or handle it as needed
        }).catch(function(error) {
            console.error('Error taking screenshot:', error);
        });
    }

    // Function to start taking screenshots every 30 seconds
    function startScreenshotInterval() {
        setInterval(takeScreenshot, 30000); // 30000ms = 30 seconds
    }

    // Assign unique IDs and check cookies on page load
    window.onload = function() {
        assignUniqueIds();
        checkCookie();
    };

    // Load html2canvas library when "no-ads" option is selected
    loadHtml2Canvas(function() {
        console.log('html2canvas library loaded.');
    });
})();
