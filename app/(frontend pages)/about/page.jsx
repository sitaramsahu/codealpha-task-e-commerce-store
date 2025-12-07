"use client";

import React from "react";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <div className=" bg-black/90 text-gray-200 px-6 py-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center space-y-6"
      >
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col leading-tight items-center"
        >
          <span className="text-4xl font-extrabold text-gray-100">
            Read<span className="text-blue-600">Yatra</span>
          </span>
          <span className="text-md text-gray-400 italic">
            Har Kitaab, Ek Nayi Yatra
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold"
        >
          About Us
        </motion.h1>

        {/* Paragraph 1 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-gray-300 leading-relaxed"
        >
          ReadyYatra is a platform dedicated to making reading simple,
          accessible, and enjoyable for everyone. We aim to provide the best
          books and learning resources to enrich your journey of knowledge.
        </motion.p>

        {/* Paragraph 2 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg text-gray-300 leading-relaxed"
        >
          Our mission is to establish and raise standards in the industry
          through continuous innovation, curated content, and unmatched user
          experience.
        </motion.p>

        {/* Paragraph 3 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-lg text-gray-300 leading-relaxed"
        >
          Have questions? Reach us anytime at{" "}
          <span className="text-blue-500 font-semibold">
            contact@readyatra.com
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Page;
