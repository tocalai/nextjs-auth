/** @type {import('next').NextConfig} */
const nextConfig = {
    // experimental: {
    //     transpilePackages: ['react-syntax-highlighter', 'swagger-client', 'swagger-ui-react'],
    // },
    reactStrictMode: false,
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

module.exports = nextConfig
