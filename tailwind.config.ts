import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        "agri-primary": "var(--agri-primary)",
        "agri-secondary": "var(--agri-secondary)",
        "agri-accent": "var(--agri-accent)",
        "agri-orange": "var(--agri-orange)",
        "agri-brown": "var(--agri-brown)",
        "agri-cream": "var(--agri-cream)",
        // PTx Theme Colors
        "ptx-bright-green": "var(--color-bright-green)",
        "ptx-medium-green": "var(--color-medium-green)",
        "ptx-dark-green": "var(--color-dark-green)",
        "ptx-bright-orange": "var(--color-bright-orange)",
        "ptx-pumpkin": "var(--color-pumpkin)",
        "ptx-light-blue": "var(--color-light-blue)",
        "ptx-bright-blue": "var(--color-bright-blue)",
        "ptx-light-orange": "var(--color-light-orange)",
        "ptx-dark-orange": "var(--color-dark-orange)",
        "ptx-neutral-green": "var(--color-neutral-green)",
        "ptx-neutral-orange": "var(--color-neutral-orange)",
        "ptx-white": "var(--color-white)",
        "ptx-black": "var(--color-black)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        inter: ["Inter", "sans-serif"],
        // PTx Theme Fonts
        pilat: ["var(--font-primary)"],
        "pilat-wide": ["var(--font-primary-wide)"],
        lato: ["var(--font-secondary)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
