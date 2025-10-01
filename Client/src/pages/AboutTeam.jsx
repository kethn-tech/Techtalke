import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Users, Target, Zap, Mail, MapPin, Briefcase, Calendar, Award, ChevronRight, Sparkles, Rocket, Brain, Heart } from "lucide-react";

const teamMembers = [
  {
    name: "Kethan R Ayatti",
    role: "Project Manager",
    subtitle: "Full-Stack Developer",
    description:
      "Orchestrates project excellence while crafting seamless user experiences with modern development practices.",
    image:
      "https://res.cloudinary.com/datfhmdzv/image/upload/profile-images/6846a64863f03272880b2477.jpg",

    color: "blue",
    details: {
      skills: [
        "Project Management",
        "React-Vite",
        "API Integration",
        "UI/UX Design",
      ],
      experience: "3+ Years",
      location: "Hubballi, Karnataka",
      achievements: [
        "Led 5+ successful projects",
        "Certified Scrum Master",
        "UI/UX Excellence Award",
      ],
    },
  },
  {
    name: "Rohit J",
    role: "Backend Engineer",
    subtitle: "Database Administrator",
    description:
      "Architects scalable server infrastructure and optimizes database performance for enterprise applications.",
    image:
      "https://res.cloudinary.com/datfhmdzv/image/upload/profile-images/6847ab6263f03272880b25fc.jpg",
    color: "emerald",
    details: {
      skills: ["Node.js", "Express.js", "MongoDB", "Socket.io"],
      experience: "3+ Years",
      location: "Bijapura, Karnataka",
      achievements: [
        "Built 10+ RESTful APIs",
        "Database Performance Expert",
        "Real-time Systems Specialist",
      ],
    },
  },
  {
    name: "Annapurneshwari Mallesh",
    role: "Business Analyst",
    subtitle: "QA Engineer",
    description:
      "Bridges business requirements with technical implementation through comprehensive testing strategies.",
    image:
      "https://res.cloudinary.com/datfhmdzv/image/upload/profile-images/6814e57d70694c83baa5f74b.jpg",
    color: "purple",
    details: {
      skills: [
        "Testing Automation",
        "Business Analysis",
        "QA Strategies",
        "Documentation",
      ],
      experience: "2+ Years",
      location: "Belgavi, Karnataka",
      achievements: [
        "99% Bug Detection Rate",
        "Process Optimization Expert",
        "Agile Testing Certified",
      ],
    },
  },
  {
    name: "Sangamesh Hugar",
    role: "DevOps Engineer",
    subtitle: "Cloud Architect",
    description:
      "Streamlines deployment pipelines and ensures robust automation for continuous delivery.",
    image:
      "https://res.cloudinary.com/datfhmdzv/image/upload/WhatsApp_Image_2025-08-20_at_18.50.28_844537af_cj3ljq.jpg",
    color: "orange",
    details: {
      skills: ["Render", "Vercel", "CI/CD", "Cloud Services"],
      experience: "2+ Years",
      location: "Hubballi, Karnataka",
      achievements: [
        "Zero-downtime Deployments",
        "Infrastructure as Code Expert",
        "Cloud Cost Optimizer",
      ],
    },
  },
];

const colorVariants = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-500",
    gradient: "from-blue-500 to-blue-600",
    hover: "hover:border-blue-500/40",
    light: "bg-blue-50",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-500",
    gradient: "from-emerald-500 to-emerald-600",
    hover: "hover:border-emerald-500/40",
    light: "bg-emerald-50",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-500",
    gradient: "from-purple-500 to-purple-600",
    hover: "hover:border-purple-500/40",
    light: "bg-purple-50",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-500",
    gradient: "from-orange-500 to-orange-600",
    hover: "hover:border-orange-500/40",
    light: "bg-orange-50",
  },
};



const AboutTeam = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState("team");
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 overflow-hidden">
      {/* Subtle Floating Background Text */}
      <h1 className="pointer-events-none select-none absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-extrabold tracking-tighter text-white/5 whitespace-nowrap animate-float-slow">
        TechTalke
      </h1>
      {/* Hero Section */}
      <section className="relative bg-transparent overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
          <div className="absolute -bottom-32 left-40 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-white">Meet the Innovators</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Building the Future of
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tech Communities
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              We're a passionate team of BCA students transforming how developers connect, 
              collaborate, and grow together through TechTalke.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur-lg border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {["team", "journey", "vision"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      {activeTab === "team" && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, idx) => {
                const colors = colorVariants[member.color];
                
                return (
                  <div
                    key={idx}
                    id={`member-${idx}`}
                    data-animate
                    className={`bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-700/40 transform transition-all duration-700 ${
                      isVisible[`member-${idx}`] ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                    }`}
                    style={{ transitionDelay: `${idx * 150}ms` }}
                  >
                    <Card 
                      className={`relative h-full bg-slate-800/80 backdrop-blur-lg border-2 ${colors.border} ${colors.hover} transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:-translate-y-2`}
                      onClick={() => setSelectedMember(member)}
                    >
                      {/* Top Accent */}
                      <div className={`h-1 bg-gradient-to-r ${colors.gradient}`}></div>
                      
                      <CardContent className="p-6">
                        {/* Avatar with Status Indicator */}
                        <div className="relative mb-6">
                          <Avatar className="h-24 w-24 mx-auto ring-4 ring-white shadow-xl">
                            <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                            <AvatarFallback className={`text-2xl font-bold ${colors.bg} ${colors.text}`}>
                              {member.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          
                        </div>

                        {/* Info */}
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                          <p className={`font-semibold ${colors.text} mb-1`}>{member.role}</p>
                          <p className="text-sm text-gray-500 mb-4">{member.subtitle}</p>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4">{member.description}</p>
                          
                          {/* Quick Stats */}
                          <div className={`flex items-center justify-center gap-4 pt-4 border-t ${colors.border}`}>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-600">{member.details.experience}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-600">{member.details.location.split(",")[0]}</span>
                            </div>
                          </div>

                          {/* View More */}
                          <div className={`mt-4 flex items-center justify-center gap-2 ${colors.text} group-hover:gap-3 transition-all`}>
                            <span className="text-sm font-medium">View Profile</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Journey Section */}
      {activeTab === "journey" && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800 to-slate-900">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Our Academic Journey</h2>
              <p className="text-xl text-white max-w-3xl mx-auto">
                From concept to reality, guided by exceptional mentors
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500"></div>

              {/* Timeline Items */}
              <div className="space-y-12">
                {[
                  {
                    semester: "4th Semester",
                    title: "Foundation Phase",
                    mentor: "Akash Sir",
                    description: "Minor Project 1 - Established core architecture and fundamental concepts",
                    icon: Rocket,
                    color: "blue",
                    achievements: ["Core API Development", "Database Design", "Authentication System"],
                  },
                  {
                    semester: "5th Semester",
                    title: "Evolution & Enhancement",
                    mentor: "Hemalata Ma'am",
                    description: "Minor Project 2 - Advanced features and professional implementation",
                    icon: Brain,
                    color: "purple",
                    achievements: ["Real-time Chat", "Community Features", "Advanced UI/UX"],
                  },
                ].map((phase, idx) => (
                  <div
                    key={idx}
                    className={`relative flex items-center ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                      <div className="ml-16 md:ml-0 bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-slate-700/40 hover:shadow-2xl transition-shadow">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colorVariants[phase.color].bg} ${colorVariants[phase.color].border} mb-4`}>
                          <phase.icon className={`w-4 h-4 ${colorVariants[phase.color].text}`} />
                          <span className={`text-sm font-medium ${colorVariants[phase.color].text}`}>{phase.semester}</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">{phase.title}</h3> 
                        <p className="text-gray-400 mb-4">{phase.description}</p>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <Award className="w-5 h-5 text-amber-500" />
                          <span className="text-sm font-medium text-gray-400">Mentored by {phase.mentor}</span>
                        </div>
                        
                        <div className="space-y-2">
                          {phase.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${colorVariants[phase.color].bg}`}></div>
                              <span className="text-sm text-gray-400">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-blue-500 z-10"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Vision Section */}
      {activeTab === "vision" && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Our Vision & Mission</h2>
                  <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    Building bridges in the tech community through innovation and collaboration
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-blue-50" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                    <p className="text-blue-100 leading-relaxed">
                      To create a vibrant platform where tech enthusiasts can connect, learn, and grow together. 
                      We're committed to fostering meaningful interactions and knowledge sharing within the developer community.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                    <p className="text-blue-100 leading-relaxed">
                      To become the go-to platform for tech communities worldwide, enabling seamless collaboration 
                      and innovation across borders, technologies, and expertise levels.
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6">Powered By Modern Technology</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["React", "Node.js", "Express", "MongoDB", "Socket.io", "Tailwind CSS", "Vercel"].map((tech) => (
                      <span key={tech} className="px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
          <div className="bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700/40" onClick={(e) => e.stopPropagation()}>
            <div className={`h-2 bg-gradient-to-r ${colorVariants[selectedMember.color].gradient}`}></div>
            
            <div className="p-8">
              <div className="flex items-start gap-6 mb-8">
                <Avatar className="h-24 w-24 ring-4">
                  <AvatarImage src={selectedMember.image} alt={selectedMember.name} />
                  <AvatarFallback className="text-2xl font-bold">
                    {selectedMember.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-100 mb-1">{selectedMember.name}</h2>
                  <p className={`text-lg font-semibold ${colorVariants[selectedMember.color].text} mb-2`}>
                    {selectedMember.role} • {selectedMember.subtitle}
                  </p>
                  <p className="text-gray-600">{selectedMember.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-gray-400" />
                    Technical Skills
                  </h3>
                  <div className="space-y-2">
                    {selectedMember.details.skills.map((skill, idx) => (
                      <div key={idx} className={`px-4 py-2 rounded-lg ${colorVariants[selectedMember.color].bg} ${colorVariants[selectedMember.color].border} border`}>
                        <span className="text-sm font-medium text-gray-50">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-gray-400" />
                    Key Achievements
                  </h3>
                  <div className="space-y-2">
                    {selectedMember.details.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${colorVariants[selectedMember.color].bg} mt-2`}></div>
                        <span className="text-sm text-gray-600">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>{selectedMember.details.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Briefcase className="w-5 h-5" />
                  <span>{selectedMember.details.experience} Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutTeam;