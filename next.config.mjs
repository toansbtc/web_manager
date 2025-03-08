/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],
  },
  // i18n: {
  //   locales: ["en","vi"], // Supported languages
  //   defaultLocale: "vi",        // Default language
  //   localeDetection: true,      // Auto-detect user's language (optional)
  // },

  async rewrites() {
    return [
      {
        source: '/authen',
        destination: '/views/modals/loggin_registerModal',
      },
      {
        source: '/rule',
        destination: '/views/rule_term',
      },
      {
        source: '/profile',
        destination: '/views/profile',
      },
      {
        source: '/feedback',
        destination: '/views/profile/feedback',
      },
    ];
  },
};


export default nextConfig;
