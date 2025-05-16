
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-cyberlaw-navy to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Cyber Law Hub</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            A comprehensive resource for understanding cyber laws and regulations worldwide
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyberlaw-navy mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4">
              Cyber Law Hub aims to democratize access to cyber laws and regulations from around the world. We believe that understanding legal frameworks is essential for responsible digital citizenship and innovation.
            </p>
            <p className="text-lg text-gray-700">
              By creating a centralized, user-friendly platform, we make complex legal information accessible to everyone, from legal professionals to everyday internet users.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyberlaw-navy mb-6">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-3">Comprehensive Database</h3>
                <p>Access cyber laws from countries worldwide, organized by category and jurisdiction.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-3">Expert Analysis</h3>
                <p>Get insights from legal professionals who specialize in cyber law and digital policy.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-3">Community Contributions</h3>
                <p>Engage with a community of professionals sharing knowledge and perspectives.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-3">Regular Updates</h3>
                <p>Stay informed about the latest changes in cyber regulations around the world.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyberlaw-navy mb-6">Our Team</h2>
            <p className="text-lg text-gray-700 mb-6">
              Cyber Law Hub is maintained by a dedicated team of legal experts, technologists, and educators committed to improving digital literacy and legal awareness.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">Jane Smith</h3>
                <p className="text-gray-600">Legal Director</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-gray-600">Technology Lead</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">Sarah Johnson</h3>
                <p className="text-gray-600">Content Strategist</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-cyberlaw-navy mb-6">Contact Us</h2>
            <p className="text-lg text-gray-700 mb-4">
              Have questions, suggestions, or want to contribute? We'd love to hear from you.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Email us at: <a href="mailto:info@cyberlawshub.com" className="text-blue-600 hover:underline">info@cyberlawshub.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
