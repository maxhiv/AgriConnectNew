
// Zoho Form Configuration for Vantage South
// Customized to match current contact form dimensions and styling

window.VantageZohoForm = {
  // Form configuration
  config: {
    formId: "czeKUQbOHf1ngvNfF9yyEzAED60uCT8j5uFUeV0SQLw",
    baseUrl: "https://forms.zohopublic.com/vantagesouth120/form/WebsiteForm/formperma/",
    containerId: "zf_div_czeKUQbOHf1ngvNfF9yyEzAED60uCT8j5uFUeV0SQLw"
  },

  // Customized styling to match your current form card
  styling: {
    height: "800px",
    width: "100%",
    border: "none",
    borderRadius: "8px",
    transition: "all 0.5s ease",
    backgroundColor: "transparent",
    maxWidth: "640px",
    margin: "0 auto"
  },

  // Initialize the form with custom dimensions
  init: function(customContainerId = null) {
    const containerId = customContainerId || this.config.containerId;
    
    try {
      const iframe = document.createElement("iframe");
      
      // Build form URL with UTM tracking
      let formUrl = this.config.baseUrl + this.config.formId;
      formUrl = this.addUtmParameters(formUrl);
      
      // Apply styling
      iframe.src = formUrl;
      Object.assign(iframe.style, this.styling);
      
      // Add accessibility attributes
      iframe.setAttribute('title', 'Vantage South Contact Form');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-same-origin');
      
      // Insert into container
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
        container.appendChild(iframe);
        
        // Apply container styling to match your card layout
        container.style.padding = "32px"; // p-8 equivalent
        container.style.borderRadius = "8px";
        container.style.backgroundColor = "white";
        container.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
      }
      
      return iframe;
    } catch (e) {
      console.error('Failed to initialize Zoho form:', e);
      return null;
    }
  },

  // UTM parameter handling (from your original Zoho code)
  addUtmParameters: function(baseUrl) {
    let url = baseUrl;
    
    try {
      // Advanced lead tracking
      if (typeof ZFAdvLead !== "undefined" && typeof zfutm_zfAdvLead !== "undefined") {
        for (let i = 0; i < ZFAdvLead.utmPNameArr.length; i++) {
          let utmParam = ZFAdvLead.utmPNameArr[i];
          utmParam = (ZFAdvLead.isSameDomian && (ZFAdvLead.utmcustPNameArr.indexOf(utmParam) === -1)) 
            ? "zf_" + utmParam : utmParam;
          
          const utmValue = zfutm_zfAdvLead.zfautm_gC_enc(ZFAdvLead.utmPNameArr[i]);
          
          if (typeof utmValue !== "undefined" && utmValue !== "") {
            url += (url.indexOf('?') > 0) ? '&' : '?';
            url += utmParam + '=' + encodeURIComponent(utmValue);
          }
        }
      }
      
      // Standard lead tracking
      if (typeof ZFLead !== "undefined" && typeof zfutm_zfLead !== "undefined") {
        for (let i = 0; i < ZFLead.utmPNameArr.length; i++) {
          const utmParam = ZFLead.utmPNameArr[i];
          const utmValue = zfutm_zfLead.zfutm_gC_enc(ZFLead.utmPNameArr[i]);
          
          if (typeof utmValue !== "undefined" && utmValue !== "") {
            url += (url.indexOf('?') > 0) ? '&' : '?';
            url += utmParam + '=' + encodeURIComponent(utmValue);
          }
        }
      }
    } catch (e) {
      console.warn('UTM parameter processing failed:', e);
    }
    
    return url;
  },

  // Field mapping reference for Zoho form setup
  fieldMapping: {
    "firstName": "Name_First",
    "lastName": "Name_Last",
    "email": "Email", 
    "phone": "PhoneNumber_countrycode",
    "service": "Dropdown", // Configure options in Zoho: equipment, crop-management, soil-analysis, precision-agriculture, training, consulting
    "message": "MultiLine"
  },

  // Responsive configuration
  setResponsiveDimensions: function() {
    const iframe = document.querySelector(`#${this.config.containerId} iframe`);
    if (iframe) {
      const screenWidth = window.innerWidth;
      
      if (screenWidth < 768) {
        // Mobile - match your mobile form layout
        iframe.style.height = "700px";
        iframe.style.padding = "16px";
      } else if (screenWidth < 1024) {
        // Tablet
        iframe.style.height = "750px";
        iframe.style.padding = "24px";
      } else {
        // Desktop - match your lg:grid-cols-2 layout
        iframe.style.height = "800px";
        iframe.style.padding = "32px";
      }
    }
  }
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if container exists before initializing
  if (document.getElementById('zf_div_czeKUQbOHf1ngvNfF9yyEzAED60uCT8j5uFUeV0SQLw')) {
    window.VantageZohoForm.init();
    
    // Setup responsive handling
    window.addEventListener('resize', function() {
      window.VantageZohoForm.setResponsiveDimensions();
    });
  }
});
