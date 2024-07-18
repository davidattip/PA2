/** @type {import('next').NextConfig} */
const nextConfig = {
    webpackDevMiddleware: config => {
        // Désactiver HMR en production
        if (process.env.NODE_ENV === 'production') {
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
            };
        }
        return config;
    },
};

export default nextConfig;