/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'harshbookcenter.com',
      'www.amazon.in',
      'www.selfstudys.com',
      'scert.goa.gov.in',
      'www.ncertbooks.guru',
      'smartdigibook.com',
      'www.schoolchamp.net',
      'm.media-amazon.com',
      'via.placeholder.com',
      'picsum.photos',
      'images.unsplash.com',
      'plus.unsplash.com',
      'unsplash.com',
      'example.com',
      'res.cloudinary.com',
      'images.pexels.com',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
