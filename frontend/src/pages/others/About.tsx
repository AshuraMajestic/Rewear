import { Heart, Users, Target, Star, Github, Mail, Crown, Award, Code, Lightbulb } from 'lucide-react'

export default function About() {
  const teamMembers = [
    {
      name: "Abhishek Kushwaha",
      role: "Team Lead (Integration)",
      email: "ashuramajestic@gmail.com",
      github: "https://github.com/AbhishekKush",
      avatar: "A",
      isLead: true,
      description: "Sofware Engineer with lots of dreams"
    },
    {
      name: "Amit Yadav",
      role: "Full Stack Developer",
      email: "yadavamit972341@gmail.com",
      github: "https://github.com/amityadav341",
      avatar: "A",
      isLead: false,
      description: "B.Tech Computer Science student at GTU,Ahmedabad. Skilled web developer and competitive programmer with strong problem-solving abilities."
    },
    {
      name: "Roshan Bhagat",
      role: "Full Stack Developer",
      email: "palroshan7850@gmail.com",
      github: "https://github.com/Roshan-2003",
      avatar: "R",
      isLead: false,
      description: "Front‑End Developer with keen eyes for back‑end technical details and a passion for building seamless, end‑to‑end user experiences."

    },
    {
      name: "Krutva Patel",
      role: "UI/UX Desginer",
      email: "kpatel077568@gmail.com",
      github: "https://github.com/SuGAr9807",
      avatar: "K",
      isLead: false,
      description: "Our top UI/UX designer with deep knowledge of color theory and combinations, as well as expertise in user and website workflow design."

    }
  ]

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "User-Centric Design",
      description: "We prioritize user experience in every decision we make, ensuring our platform is intuitive and accessible for everyone."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Community First",
      description: "Building a strong, supportive community where users can connect, share, and help each other find what they need."
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Innovation",
      description: "Constantly evolving and implementing new features to stay ahead of user needs and industry trends."
    },
    {
      icon: <Star className="w-8 h-8 text-purple-500" />,
      title: "Quality",
      description: "Maintaining high standards in code quality, security, and performance to deliver a reliable platform."
    }
  ]

  const stats = [
    { number: "1000+", label: "Happy Users" },
    { number: "500+", label: "Items Listed" },
    { number: "200+", label: "Successful Connections" },
    { number: "99.9%", label: "Uptime" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're a passionate team of developers dedicated to creating innovative solutions 
            that connect people and make sharing resources easier than ever before.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            To revolutionize how people share and access resources by creating a seamless, 
            secure, and user-friendly platform that brings communities together. We believe 
            in the power of connection and the importance of making resources accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-blue-100 text-lg">Numbers that showcase our growing community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded by a team of passionate developers, our platform was born from a simple idea: 
                what if sharing resources could be as easy as sending a message? We noticed that people 
                often had items they didn't need, while others were searching for exactly those items.
              </p>
              <p>
                Our journey began in 2024 when we came together as students and professionals with 
                diverse backgrounds in web development, mobile applications, and backend systems. 
                We combined our expertise to create a solution that bridges the gap between having 
                and needing.
              </p>
              <p>
                Today, we continue to innovate and improve our platform, always keeping our users 
                at the center of everything we do. We're not just building software; we're building 
                connections and fostering a community of sharing.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
            <div className="text-center">
              <Lightbulb className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Innovation at Heart</h3>
              <p className="text-gray-600">
                We believe in continuous improvement and staying ahead of the curve. 
                Our team is constantly exploring new technologies and methodologies to 
                enhance user experience and platform reliability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The talented individuals behind our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto">
                    {member.avatar}
                  </div>
                  {member.isLead && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                      <Crown className="w-4 h-4 text-yellow-800" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <p className="text-blue-600 font-semibold">{member.role}</p>
                  {member.isLead && <Award className="w-4 h-4 text-yellow-500" />}
                </div>
                
                <p className="text-gray-600 text-sm mb-6">{member.description}</p>
                
                <div className="flex justify-center gap-4">
                  <a 
                    href={`mailto:${member.email}`}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-3 rounded-full transition-colors duration-200"
                    title="Send Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a 
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition-colors duration-200"
                    title="GitHub Profile"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Technology Stack</h2>
          <p className="text-xl text-gray-600">Built with modern, reliable technologies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Code className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">Frontend</h3>
            <ul className="text-gray-600 space-y-2">
              <li>React.js with TypeScript</li>
              <li>Tailwind CSS</li>
              <li>React Router</li>
              <li>Modern UI/UX Design</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Code className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">Backend</h3>
            <ul className="text-gray-600 space-y-2">
              <li>Node.js & Express</li>
              <li>RESTful APIs</li>
              <li>JWT Authentication</li>
              <li>Database Integration</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Code className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">Mobile</h3>
            <ul className="text-gray-600 space-y-2">
              <li>React Native</li>
              <li>Cross-platform Development</li>
              <li>Native Performance</li>
              <li>Responsive Design</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-xl mb-8">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Join Our Community
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}