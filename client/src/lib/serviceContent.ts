// Shared service content, used by both the general /services/:slug page and
// the localized /:state/:location/services/:service pages. Keeping this in
// one place avoids duplicating copy across the two page types.
export interface ServiceContentEntry {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  benefits: string[];
  process: { step: string; description: string }[];
}

export const serviceContent: Record<string, ServiceContentEntry> = {
  "precision-ag-consulting": {
    title: "Precision Ag Consulting",
    tagline: "Expert guidance for your precision agriculture investment",
    description: "Our precision agriculture consulting services help you make informed technology decisions. We assess your current operation, identify opportunities for improvement, and develop implementation strategies that deliver real ROI.",
    features: [
      "Technology assessment and recommendations",
      "ROI analysis for precision ag investments",
      "Integration planning across equipment brands",
      "Data management strategy development",
      "Agronomic prescription planning"
    ],
    benefits: [
      "Make confident technology decisions",
      "Avoid costly compatibility issues",
      "Maximize return on your precision ag investment",
      "Develop a clear implementation roadmap",
      "Leverage data for better agronomic decisions"
    ],
    process: [
      { step: "Assessment", description: "We evaluate your current equipment, operation size, and goals" },
      { step: "Recommendations", description: "We develop a technology plan tailored to your operation" },
      { step: "Planning", description: "We create an implementation timeline and budget" },
      { step: "Support", description: "We guide you through installation and beyond" }
    ]
  },
  "installation-calibration": {
    title: "Installation & Calibration",
    tagline: "Professional setup for lasting performance",
    description: "Expert installation and calibration services ensure your precision agriculture equipment performs at its best from day one. We install displays, receivers, steering systems, planters, and application equipment with attention to detail.",
    features: [
      "Display and monitor installation",
      "GPS/GNSS receiver mounting and configuration",
      "Autosteer system installation",
      "Planter technology installation (vDrive, DeltaForce, 20|20)",
      "Application control system setup"
    ],
    benefits: [
      "Equipment works correctly from the start",
      "Avoid costly setup mistakes",
      "Optimal performance and accuracy",
      "Warranty protection through proper installation",
      "Training included with installation"
    ],
    process: [
      { step: "Consultation", description: "We review your equipment and installation requirements" },
      { step: "Scheduling", description: "We coordinate installation timing around your season" },
      { step: "Installation", description: "Our technicians complete professional installation" },
      { step: "Calibration", description: "We calibrate and test all systems for accuracy" },
      { step: "Training", description: "We train your operators on proper use" }
    ]
  },
  "rtk-gnss-setup": {
    title: "RTK/GNSS Setup",
    tagline: "Sub-inch accuracy for precision operations",
    description: "Professional RTK and GNSS correction setup delivers the accuracy you need for precise planting, tillage, and application. We configure receivers, set up correction sources, and ensure reliable sub-inch guidance.",
    features: [
      "RTK base station installation",
      "Network RTK configuration",
      "Receiver firmware updates and optimization",
      "Correction source troubleshooting",
      "A-B line and boundary setup"
    ],
    benefits: [
      "Sub-inch pass-to-pass accuracy",
      "Eliminate overlap and skips",
      "Year-over-year repeatability for strip-till",
      "Reliable correction signal coverage",
      "Reduced input costs through precision"
    ],
    process: [
      { step: "Assessment", description: "We evaluate your coverage needs and existing equipment" },
      { step: "Configuration", description: "We set up receivers and correction sources" },
      { step: "Testing", description: "We verify accuracy in your fields" },
      { step: "Training", description: "We show you how to maintain RTK performance" }
    ]
  },
  "in-season-support": {
    title: "In-Season Support",
    tagline: "Help when you need it most",
    description: "Responsive technical support during critical planting and application windows. When equipment issues arise in the field, we provide phone, remote, and on-site assistance to keep you running.",
    features: [
      "Phone and text support from experienced technicians",
      "Remote diagnostics and troubleshooting",
      "On-site field visits when needed",
      "Parts sourcing and expedited delivery",
      "After-hours emergency support"
    ],
    benefits: [
      "Minimize downtime during critical windows",
      "Fast problem resolution",
      "Expert help from technicians who know your equipment",
      "Peace of mind during busy season",
      "Local support that understands your operation"
    ],
    process: [
      { step: "Contact", description: "Call or text our support line" },
      { step: "Diagnosis", description: "We work through the issue remotely if possible" },
      { step: "Resolution", description: "We solve the problem or dispatch a technician" },
      { step: "Follow-up", description: "We ensure everything is running smoothly" }
    ]
  },
  "on-farm-training": {
    title: "On-Farm Training",
    tagline: "Hands-on learning at your farm",
    description: "Comprehensive training programs delivered at your farm on your equipment. We train operators on display operation, guidance systems, planter technology, and data management to ensure you get full value from your investment.",
    features: [
      "Display operation and menu navigation",
      "Guidance line creation and field setup",
      "Planter monitor and control training",
      "Data transfer and management",
      "Troubleshooting common issues"
    ],
    benefits: [
      "Confident, competent operators",
      "Full utilization of equipment features",
      "Reduced operator errors",
      "Better data collection and use",
      "Training tailored to your specific equipment"
    ],
    process: [
      { step: "Planning", description: "We identify training needs and schedule sessions" },
      { step: "Preparation", description: "We prepare training materials for your equipment" },
      { step: "Training", description: "Hands-on sessions at your farm" },
      { step: "Practice", description: "Operators practice with guidance" },
      { step: "Resources", description: "We provide reference materials for future use" }
    ]
  }
};
