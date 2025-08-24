import Image from 'next/image';
import { FaEnvelope, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';

// --- TUTOR DATA ---
// You can update your social media links here
const tutors = [
  {
    name: 'Mr. Jayanta Kumar',
    email: 'kumarjayanta9635@gmail.com',
    photoUrl: '/jayanta.jpg', // Path to your photo in the /public folder
    socials: {
      instagram: 'https://www.instagram.com/kumarx416/?__pwa=1', // <-- REPLACE WITH YOUR INSTAGRAM LINK
      linkedin: 'https://www.linkedin.com/in/jayanta-kumar-31b4a434a',  // <-- REPLACE WITH YOUR LINKEDIN LINK
      facebook: 'https://www.facebook.com/Jay47kumar',  // <-- REPLACE WITH YOUR FACEBOOK LINK
    },
  },
  {
    name: 'Mr. Rajiv Ghosh',
    email: 'rajivghoah691@gmail.com',
    photoUrl: '/rajiv.jpg', // Path to your friend's photo in the /public folder
    socials: {
      instagram: 'https://www.instagram.com/rajiv_100k?igsh=ZG92OHU0am9oYXhh', // <-- REPLACE WITH YOUR FRIEND'S INSTAGRAM LINK
      linkedin: 'https://www.linkedin.com/in/rajiv-ghosh-340353321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',  // <-- REPLACE WITH YOUR FRIEND'S LINKEDIN LINK
      facebook: 'https://www.facebook.com/share/19D5uPWwLt/',  // <-- REPLACE WITH YOUR FRIEND'S FACEBOOK LINK
    },
  },
];

const TutorCard = ({ tutor }: { tutor: typeof tutors[0] }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center text-center shadow-lg">
      <div className="w-40 h-40 relative mb-4">
        <Image
          src={tutor.photoUrl}
          alt={`Photo of ${tutor.name}`}
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
      <h2 className="text-2xl font-bold font-heading text-white">{tutor.name}</h2>
      <div className="flex space-x-4 mt-6">
        <a href={`mailto:${tutor.email}`} title="Email" className="text-gray-400 hover:text-blue-400 transition-colors">
          <FaEnvelope size={24} />
        </a>
        <a href={tutor.socials.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="text-gray-400 hover:text-blue-400 transition-colors">
          <FaInstagram size={24} />
        </a>
        <a href={tutor.socials.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-gray-400 hover:text-blue-400 transition-colors">
          <FaLinkedin size={24} />
        </a>
        <a href={tutor.socials.facebook} target="_blank" rel="noopener noreferrer" title="Facebook" className="text-gray-400 hover:text-blue-400 transition-colors">
          <FaFacebook size={24} />
        </a>
      </div>
    </div>
  );
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-heading">Meet the Tutors</h1>
        <p className="mt-4 text-lg text-gray-400">We are dedicated to helping you learn what matters.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tutors.map((tutor) => (
          <TutorCard key={tutor.name} tutor={tutor} />
        ))}
      </div>
    </div>
  );
}