/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
}

// open only behind the proxy
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

module.exports = nextConfig
