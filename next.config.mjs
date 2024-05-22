/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "di2ponv0v5otw.cloudfront.net",
        port: "",
        pathname: "/posts/**",
      },
    ],
  },
};

export default nextConfig;
