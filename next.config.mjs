/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // El dominio de Cloudinary
        port: "",
        pathname: "**", // Permite cualquier ruta dentro de ese dominio
      },
      {
        protocol: "https",
        hostname: "ejemplo.com", // El dominio de Cloudinary
        port: "",
        pathname: "**", // Permite cualquier ruta dentro de ese dominio
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // El dominio de Cloudinary
        port: "",
        pathname: "**", // Permite cualquier ruta dentro de ese dominio
      },
      // Si tienes avatares por defecto o de Clerk que no estén en Cloudinary, podrías necesitar añadir más dominios:
      // {
      //   protocol: 'https',
      //   hostname: 'img.clerk.com', // Dominio de imágenes de Clerk (avatares)
      //   port: '',
      //   pathname: '**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'avatars.githubusercontent.com', // Si usas avatares de GitHub
      //   port: '',
      //   pathname: '**',
      // },
      // Añade cualquier otro dominio de donde provengan tus imágenes externas.
    ],
  },
};

export default nextConfig;
