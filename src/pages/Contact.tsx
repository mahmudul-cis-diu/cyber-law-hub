
import React from 'react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-cyberlaw-navy to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="contribute">Contribute Content</option>
                  <option value="report">Report an Issue</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <Button type="submit" className="w-full bg-cyberlaw-navy hover:bg-blue-800">
                Submit
              </Button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-cyberlaw-navy mb-6">Other Ways to Reach Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Email</h3>
                <p className="mb-2">General inquiries: <a href="mailto:info@cyberlawshub.com" className="text-blue-600 hover:underline">info@cyberlawshub.com</a></p>
                <p>Support: <a href="mailto:support@cyberlawshub.com" className="text-blue-600 hover:underline">support@cyberlawshub.com</a></p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Social Media</h3>
                <p className="mb-2">Twitter: <a href="https://twitter.com/cyberlawshub" className="text-blue-600 hover:underline">@cyberlawshub</a></p>
                <p>LinkedIn: <a href="https://linkedin.com/company/cyberlawshub" className="text-blue-600 hover:underline">Cyber Law Hub</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
