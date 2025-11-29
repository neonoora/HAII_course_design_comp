/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Mark transformers and related packages as external (Next.js 13+ way)
  // This prevents webpack from bundling them and processing worker files
  serverComponentsExternalPackages: [
    '@xenova/transformers',
    'onnxruntime-node',
  ],
  webpack: (config, { isServer }) => {
    // Ignore .node files (native binaries) - they should not be processed by webpack
    // These are loaded dynamically at runtime by onnxruntime-node
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    })

    // Also ignore other binary files that might cause issues
    config.module.rules.push({
      test: /\.(wasm|bin)$/,
      type: 'asset/resource',
    })

    // Handle @xenova/transformers - only used server-side in API routes
    if (isServer) {
      // Mark as external to prevent bundling
      config.externals = config.externals || []
      if (Array.isArray(config.externals)) {
        config.externals.push('@xenova/transformers')
        config.externals.push('onnxruntime-node')
      } else {
        config.externals = [
          config.externals,
          '@xenova/transformers',
          'onnxruntime-node',
        ]
      }

      // Ignore worker files that transformers uses internally
      config.module.rules.push({
        test: /\.worker\.(js|ts)$/,
        use: 'ignore-loader',
      })
    } else {
      // On client-side, completely ignore transformers
      config.resolve.alias = {
        ...config.resolve.alias,
        '@xenova/transformers': false,
        'onnxruntime-node': false,
      }
    }

    return config
  },
}

module.exports = nextConfig

