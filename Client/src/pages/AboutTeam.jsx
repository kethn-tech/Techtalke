import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code, Users, Target, Zap, Mail, MapPin, Coffee, Heart, Github, Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Kethan R Ayatti",
    role: "Project Manager & Full-Stack Developer",
    description:
      "Orchestrates project excellence while crafting seamless user experiences with modern development practices.",
    image:
      "https://res.cloudinary.com/datfhmdzv/image/upload/profile-images/6846a64863f03272880b2477.jpg",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
    details: {
      skills: ["React", "Vite", "Project Management", "UI/UX"],
      location: "Hubballi, Karnataka",
    },
  },
  {
    name: "Rohit J",
    role: "Back-End Developer & Database Administrator",
    description:
      "Architects scalable server infrastructure and optimizes database performance for enterprise-grade applications.",
    image:
      "https://res.cloudinary.com/datfhmdzv/image/upload/profile-images/6847ab6263f03272880b25fc.jpg",
    icon: Code,
    gradient: "from-green-500 to-emerald-500",
    details: {
      skills: ["Node.js", "Express.js", "MongoDB", "Socket.io"],
      location: "Hubballi, Karnataka",
    },
  },
  {
    name: "Annapurneshwari Mallesh",
    role: "Business Analyst & QA Tester",
    description:
      "Bridges business requirements with technical implementation and ensures quality through comprehensive testing strategies.",
    image:
      "https://res.cloudinary.com/datfhmdzv/image/upload/profile-images/6814e57d70694c83baa5f74b.jpg",
    icon: Target,
    gradient: "from-pink-500 to-rose-500",
    details: {
      skills: [
        "Testing",
        "Business Analysis",
        "QA Automation",
        "Documentation",
      ],
      location: "Hubballi, Karnataka",
    },
  },
  {
    name: "Sangamesh Hugar",
    role: "DevOps Engineer",
    description:
      "Streamlines deployment pipelines and ensures robust automation for continuous integration and delivery.",
    image:
      "https://res.cloudinary.com/datfhmdzv/image/upload/WhatsApp_Image_2025-08-20_at_18.50.28_88b94ca4_epbbj1.jpg",
    icon: Zap,
    gradient: "from-purple-500 to-indigo-500",
    details: {
      skills: ["Render", "Vercel", "CI/CD", "Cloud Services"],
      location: "Hubballi, Karnataka",
    },
  },
];

const AboutTeam = () => {
  const [flippedCard, setFlippedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCardClick = (idx) => {
    if (isMobile) {
      setFlippedCard(flippedCard === idx ? null : idx);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Elements - Adjusted for mobile */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-32 h-32 md:w-64 md:h-64 bg-cyan-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 py-12 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section - Mobile Optimized */}
          <div className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-4 md:mb-6">
              <Users className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
              <span className="text-xs md:text-sm font-medium text-blue-300">
                Meet Our Team
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight px-2">
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                Innovative Minds
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Behind TechTalke
              </span>
            </h1>

            <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
              A passionate collective of BCA 3rd-year students who transformed a
              shared vision into reality. We're building{" "}
              <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                TechTalke
              </span>{" "}
              — where tech communities connect, collaborate, and grow together.
            </p>
          </div>

          {/* Team Grid - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-16">
            {teamMembers.map((member, idx) => {
              const IconComponent = member.icon;
              const isFlipped = flippedCard === idx;

              return (
                <div
                  key={idx}
                  className="group relative h-80 md:h-96 perspective-1000 cursor-pointer"
                  onMouseEnter={() => setFlippedCard(idx)}
                  onMouseLeave={() => setFlippedCard(null)}
                  onClick={() => isMobile && handleCardClick(idx)}
                >
                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${member.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}
                  ></div>

                  {/* Card Container */}
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                      isFlipped ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front Side */}
                    <Card className="absolute inset-0 w-full h-full bg-slate-900/80 backdrop-blur-xl border-slate-700/50 rounded-2xl overflow-hidden backface-hidden">
                      <div
                        className={`h-2 bg-gradient-to-r ${member.gradient}`}
                      ></div>

                      <CardHeader className="text-center pt-4 md:pt-8 pb-3 md:pb-4 px-4">
                        <div className="relative mb-4 md:mb-6">
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${member.gradient} rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300`}
                          ></div>
                          <Avatar className="relative h-16 w-16 md:h-24 md:w-24 mx-auto ring-2 ring-slate-700 group-hover:ring-slate-600 transition-all duration-300">
                            <AvatarImage
                              src={member.image}
                              alt={member.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="text-sm md:text-lg font-bold bg-slate-800 text-slate-300">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <CardTitle className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors px-2">
                          {member.name}
                        </CardTitle>

                        <CardDescription
                          className={`font-semibold text-xs md:text-sm bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent flex items-center justify-center gap-2 px-2`}
                        >
                          <IconComponent className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-center leading-tight">
                            {member.role}
                          </span>
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="px-4 md:px-6 pb-4 md:pb-8">
                        <p className="text-slate-400 leading-relaxed text-xs md:text-sm group-hover:text-slate-300 transition-colors">
                          {member.description}
                        </p>
                        <div className="mt-3 md:mt-4 text-center">
                          <span className="text-xs text-slate-500">
                            {isMobile
                              ? "Tap to see more details"
                              : "Hover to see more details"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Back Side - Mobile Optimized */}
                    <Card className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border-slate-700/60 rounded-2xl overflow-hidden backface-hidden rotate-y-180 shadow-2xl">
                      <div
                        className={`h-3 bg-gradient-to-r ${member.gradient} relative overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </div>

                      <CardContent className="p-4 md:p-6 h-full flex flex-col justify-center">
                        {/* Header */}
                        <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                          <div
                            className={`p-2 md:p-3 rounded-xl bg-gradient-to-r ${member.gradient} shadow-lg flex-shrink-0`}
                          >
                            <IconComponent className="w-4 h-4 md:w-6 md:h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg md:text-2xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent truncate">
                              {member.name.split(" ")[0]}
                            </h3>
                            <p
                              className={`text-xs md:text-sm font-bold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}
                            >
                              Expertise Profile
                            </p>
                          </div>
                        </div>

                        {/* Skills Section */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-4 md:mb-6">
                            <div
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${member.gradient}`}
                            ></div>
                            <h4 className="text-sm md:text-lg font-bold text-white">
                              Core Skills
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
                            {member.details.skills.map((skill, skillIdx) => (
                              <div
                                key={skillIdx}
                                className={`px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r ${member.gradient} bg-opacity-15 border border-slate-600/40 backdrop-blur-sm text-center`}
                              >
                                <span className="text-xs md:text-sm font-semibold text-slate-200">
                                  {skill}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Location */}
                        <div className="mt-auto">
                          <div className="flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/40">
                            <MapPin
                              className={`w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0`}
                            />
                            <span className="text-sm md:text-base font-medium text-slate-200">
                              {member.details.location}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Journey Timeline - Mobile Optimized */}
          <div className="mb-12 md:mb-16">
            <div className="text-center mb-8 md:mb-12 px-4">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                Academic Journey
              </h2>
              <p className="text-slate-300 text-sm md:text-lg max-w-4xl mx-auto leading-relaxed">
                <span className="font-semibold text-cyan-300">TechTalke</span>{" "}
                represents our
                <span className="font-bold text-blue-300">
                  {" "}
                  5th Semester Minor Project 2
                </span>{" "}
                under the expert guidance of
                <span className="font-semibold text-purple-300">
                  {" "}
                  Hemalata Ma'am
                </span>
                , which we strategically extended from our
                <span className="font-bold text-green-300">
                  {" "}
                  4th Semester Minor Project 1
                </span>{" "}
                under the mentorship of
                <span className="font-semibold text-orange-300">
                  {" "}
                  Akash Sir
                </span>
              </p>
            </div>

            <div className="relative px-4">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 rounded-full"></div>

              <div className="space-y-8 md:space-y-12">
                {[
                  {
                    phase: "4th Semester Foundation",
                    description:
                      "Minor Project 1 under Akash Sir's guidance - laying the groundwork with core concepts",
                    icon: "📚",
                    position: "left",
                  },
                  {
                    phase: "Concept Evolution",
                    description:
                      "Identifying community needs and expanding our vision for a comprehensive platform",
                    icon: "🔄",
                    position: "right",
                  },
                  {
                    phase: "5th Semester Enhancement",
                    description:
                      "Minor Project 2 with Hemalata Ma'am - advanced features and professional implementation",
                    icon: "🚀",
                    position: "left",
                  },
                  {
                    phase: "TechTalke Launch",
                    description:
                      "Full-stack deployment connecting tech communities with real-time interactions",
                    icon: "🌟",
                    position: "right",
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className={`relative flex items-center ${
                      step.position === "right" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-1/2 ${
                        step.position === "right"
                          ? "text-right pr-8"
                          : "text-left pl-8"
                      }`}
                    >
                      <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300">
                        <div className="text-xl md:text-2xl mb-2">
                          {step.icon}
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                          {step.phase}
                        </h3>
                        <p className="text-slate-300 text-sm md:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 md:border-4 border-slate-900"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section - Mobile Optimized */}
          <div className="text-center px-4">
            <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/30">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
                Our Mission
              </h3>
              <p className="text-slate-300 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
                We believe in the power of collaboration and innovation. Our
                diverse expertise spans the entire development lifecycle — from
                strategic planning and intuitive design to robust backend
                architecture and seamless deployment. Together, we're not just
                building software; we're crafting experiences that bring tech
                communities closer together.
              </p>

              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {[
                  "Vite-React",
                  "Node.js",
                  "Express.js",
                  "MongoDB",
                  "Socket.io",
                  "Render",
                  "Vercel",
                ].map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-slate-800/60 border border-slate-600/30 text-slate-300 text-xs md:text-sm font-medium hover:border-blue-500/30 hover:text-blue-300 transition-all cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default AboutTeam;