import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Introduction",
    body: `Welcome to TechTalke. We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.`,
  },
  {
    title: "Information We Collect",
    body: `1. Account Information (name, email, password)\n2. Usage Data (pages visited, features used)\n3. Cookies and Tracking Technologies to enhance user experience.`,
  },
  {
    title: "How We Use Your Information",
    body: `• To create and manage your account\n• To provide and maintain the platform\n• To improve, personalize, and expand our services\n• To communicate with you, including sending updates and security alerts.`,
  },
  {
    title: "Data Security",
    body: `We implement industry-standard security measures, including encryption in transit and at rest, to protect your data against unauthorized access, alteration, disclosure, or destruction.`,
  },
  {
    title: "Your Choices",
    body: `You may review, update, or delete your account information at any time in your profile settings. You can also opt-out of non-essential communications.`,
  },
  {
    title: "Contact Us",
    body: `If you have any questions or concerns regarding this Privacy Policy, please contact us at privacy@techtalke.com.`,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-16 px-4 text-slate-100">
    <div className="max-w-4xl mx-auto space-y-12">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 text-transparent bg-clip-text"
      >
        Privacy Policy
      </motion.h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {sections.map((section, idx) => (
          <motion.div key={idx} variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            <p className="text-slate-300 whitespace-pre-line leading-relaxed">
              {section.body}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
);

export default PrivacyPolicy;