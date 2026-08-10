"use client";

import React from "react";
import { ThemeProvider } from "@/components/ThemeContext";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Education from "@/components/Education";
import Terminal from "@/components/Terminal";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <ThemeProvider>
      <Layout>
        {/* Dash Grid Spacer */}
        <div className="space-y-10">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Certifications />
          <Education />
          <Terminal />
          <Contact />
        </div>
      </Layout>
    </ThemeProvider>
  );
}
