// next.config.ts or next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      new URL('https://github.com/**')
    ],
  },
};

module.exports = nextConfig; // use `export default` if you're using next.config.ts
