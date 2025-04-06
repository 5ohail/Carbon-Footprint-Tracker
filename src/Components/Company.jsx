import React from "react";
import { Link } from "react-router-dom";

const Company = () => {
  const handleRedirect = (url) => {
    if (url) {
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      window.open(fullUrl, "_blank");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Company Overview */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-[#0066cc]">About Carbon Tracker</h1>
        <p className="text-gray-600">
          We help individuals and businesses monitor their carbon footprint with actionable insights, making sustainability more accessible.
        </p>
      </div>

      {/* Our Mission */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#0066cc]" >Our Mission</h2>
        <p className="text-gray-600">
          Carbon Tracker is committed to empowering people with data-driven solutions to reduce carbon emissions and drive sustainability.
        </p>
      </div>

      {/* Our Values */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#0066cc]">Our Values</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li><span className="font-medium">Sustainability:</span> Every action matters in creating a greener planet.</li>
          <li><span className="font-medium">Transparency:</span> Honest, data-driven insights for real impact.</li>
          <li><span className="font-medium">Innovation:</span> Leveraging technology for a cleaner future.</li>
        </ul>
      </div>

      {/* Meet the Team */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#0066cc]">Meet the Team</h2>
        <p className="text-gray-600">
          Our dedicated team of environmentalists, engineers, and developers work together to make sustainability tracking seamless.
        </p>
        <div className="flex flex-wrap gap-6">
          {[
            { name: "Ashok Teli", role: "Hardware", pic: '/member-1.jpeg', linkedin: 'https://www.linkedin.com/in/ashok-teli-b581aa280/' },
            { name: "Amrit Jha", role: "Hardware", pic: '/member-2.jpeg', linkedin: 'https://www.linkedin.com/in/amrit-jha-b85a0928b/' },
            { name: "Sohail Ansari", role: "Web Developer", pic: '/member-4.jpeg', linkedin: 'www.linkedin.com/in/sohailansari163' },
            { name: "MEMBER", role: "Presentation", pic: 'https://randomuser.me/api/portraits/men/75.jpg', linkedin: '' }
          ].map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                className="h-16 w-16 bg-gray-300 rounded-full object-cover cursor-pointer"
                src={member.pic}
                alt={member.role}
                title={member.linkedin ? (member.linkedin.startsWith("http") ? member.linkedin : `https://${member.linkedin}`) : "No LinkedIn profile"}
                onClick={() => handleRedirect(member.linkedin)}
              />
              <p className="font-medium mt-2">{member.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">{member.role}</p>
            </div>


          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[#0066cc]">Get in Touch</h2>
        <p className="text-gray-600">
          Have questions about Carbon Tracker? <Link to='/contact' className="text-blue-500">Fill out the form</Link> and our team will get back to you as soon as possible.
        </p>
        <p className="font-semibold text-[#0066cc]">Carbon Tracker</p>
        <p className="text-gray-600">Making carbon footprint tracking accessible and actionable.</p>
      </div>
    </div>
  );
};

export default Company;
