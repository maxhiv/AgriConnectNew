
import React, { useEffect, useRef } from 'react';

interface ZohoFormProps {
  className?: string;
}

declare global {
  interface Window {
    ZFAdvLead?: any;
    zfutm_zfAdvLead?: any;
    ZFLead?: any;
    zfutm_zfLead?: any;
  }
}

export const ZohoFormIntegration: React.FC<ZohoFormProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formId = "zf_div_czeKUQbOHf1ngvNfF9yyEzAED60uCT8j5uFUeV0SQLw";

  useEffect(() => {
    const loadZohoForm = () => {
      try {
        // Create iframe element
        const iframe = document.createElement("iframe");
        
        // Base form URL
        let ifrmSrc = 'https://forms.zohopublic.com/vantagesouth120/form/WebsiteForm/formperma/czeKUQbOHf1ngvNfF9yyEzAED60uCT8j5uFUeV0SQLw';
        
        // UTM parameter handling for advanced lead tracking
        try {
          if (typeof window.ZFAdvLead !== "undefined" && typeof window.zfutm_zfAdvLead !== "undefined") {
            for (let prmIdx = 0; prmIdx < window.ZFAdvLead.utmPNameArr.length; prmIdx++) {
              let utmPm = window.ZFAdvLead.utmPNameArr[prmIdx];
              utmPm = (window.ZFAdvLead.isSameDomian && (window.ZFAdvLead.utmcustPNameArr.indexOf(utmPm) === -1)) 
                ? "zf_" + utmPm : utmPm;
              const utmVal = window.zfutm_zfAdvLead.zfautm_gC_enc(window.ZFAdvLead.utmPNameArr[prmIdx]);
              
              if (typeof utmVal !== "undefined" && utmVal !== "") {
                ifrmSrc += (ifrmSrc.indexOf('?') > 0) ? '&' : '?';
                ifrmSrc += utmPm + '=' + utmVal;
              }
            }
          }
          
          if (typeof window.ZFLead !== "undefined" && typeof window.zfutm_zfLead !== "undefined") {
            for (let prmIdx = 0; prmIdx < window.ZFLead.utmPNameArr.length; prmIdx++) {
              const utmPm = window.ZFLead.utmPNameArr[prmIdx];
              const utmVal = window.zfutm_zfLead.zfutm_gC_enc(window.ZFLead.utmPNameArr[prmIdx]);
              
              if (typeof utmVal !== "undefined" && utmVal !== "") {
                ifrmSrc += (ifrmSrc.indexOf('?') > 0) ? '&' : '?';
                ifrmSrc += utmPm + '=' + utmVal;
              }
            }
          }
        } catch (e) {
          console.warn('UTM tracking initialization failed:', e);
        }

        // Configure iframe to match your current form dimensions
        iframe.src = ifrmSrc;
        iframe.style.border = "none";
        iframe.style.height = "800px"; // Adjusted from 1280px to better fit your layout
        iframe.style.width = "100%"; // Changed from 90% to full width for better integration
        iframe.style.transition = "all 0.5s ease";
        iframe.style.borderRadius = "8px"; // Match your card border radius
        iframe.setAttribute('title', 'Contact Form');
        iframe.setAttribute('loading', 'lazy');

        // Clear container and append iframe
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(iframe);
        }
      } catch (e) {
        console.error('Failed to load Zoho form:', e);
      }
    };

    loadZohoForm();
  }, []);

  return (
    <div 
      className={`zoho-form-container ${className}`}
      style={{
        maxWidth: '640px', // Match your form card max width
        margin: '0 auto',
        padding: '0'
      }}
    >
      <div 
        ref={containerRef}
        id={formId}
        className="w-full"
      />
    </div>
  );
};

// Alternative configuration object for direct JavaScript usage
export const zohoFormConfig = {
  formId: "czeKUQbOHf1ngvNfF9yyEzAED60uCT8j5uFUeV0SQLw",
  baseUrl: "https://forms.zohopublic.com/vantagesouth120/form/WebsiteForm/formperma/",
  containerId: "zf_div_czeKUQbOHf1ngvNfF9yyEzAED60uCT8j5uFUeV0SQLw",
  
  // Customized dimensions to match your current form
  dimensions: {
    height: "800px",
    width: "100%",
    borderRadius: "8px",
    padding: "0",
    maxWidth: "640px"
  },
  
  // Field mapping from your current form to Zoho
  fieldMapping: {
    firstName: 'Name_First',
    lastName: 'Name_Last', 
    email: 'Email',
    phone: 'PhoneNumber_countrycode',
    service: 'Dropdown', // You'll need to configure this in Zoho
    message: 'MultiLine'
  },
  
  // Responsive breakpoints matching your Tailwind config
  responsive: {
    mobile: "100%",
    tablet: "100%", 
    desktop: "100%"
  }
};
