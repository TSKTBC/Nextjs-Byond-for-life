import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';
const isVercel = process.env.VERCEL === '1';

const nextConfig: NextConfig = {
  // Vercelでは動的機能を使用、それ以外では静的エクスポート
  ...(isDev || isVercel ? {} : {
    output: 'export',
    trailingSlash: true,
  }),

  // 画像最適化（開発環境・Vercelでは最適化を有効化）
  images: {
    unoptimized: !isDev && !isVercel, // Vercelと開発環境では最適化を有効
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 95, 100],
  },

  // パフォーマンス最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 実験的機能
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'framer-motion'],
  },

  // webpack最適化
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module: { context: string }) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
                return `npm.${packageName?.replace('@', '')}`;
              },
            },
          },
        },
      };
    }
    return config;
  },

  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
