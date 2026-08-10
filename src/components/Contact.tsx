"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, ChevronDown, Copy, Check } from "lucide-react";
import { Github, Linkedin } from "@/components/SocialIcons";

interface MessageSignature {
  name: string;
  email: string;
  inquiry_type: string;
  subject: string;
  message: string;
}

const formatSubject = (name: string, inquiryType: string, rawSubject: string): string => {
  const cleanName = name.trim().replace(/[\r\n]+/g, " ");
  const cleanInquiry = inquiryType.trim().replace(/[\r\n]+/g, " ");
  const cleanSubject = rawSubject.trim().replace(/[\r\n]+/g, " ");

  let baseSubject = "";
  if (cleanSubject) {
    baseSubject = `Portfolio | ${cleanInquiry} | ${cleanSubject}`;
  } else {
    baseSubject = `Portfolio | ${cleanInquiry} | Message from ${cleanName}`;
  }

  return baseSubject.substring(0, 120).trim();
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiry_type: "General Inquiry",
    subject: "",
    message: "",
  });

  const [gotcha, setGotcha] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedSignature, setLastSubmittedSignature] = useState<MessageSignature | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "rate_limit" | "duplicate">("idle");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for edited field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; message?: string } = {};

    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      newErrors.name = "PLEASE ENTER YOUR NAME";
    } else if (nameTrimmed.length > 100) {
      newErrors.name = "NAME MUST NOT EXCEED 100 CHARACTERS";
    }

    const emailTrimmed = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
      newErrors.email = "PLEASE ENTER A VALID EMAIL ADDRESS";
    } else if (emailTrimmed.length > 254) {
      newErrors.email = "EMAIL ADDRESS IS TOO LONG";
    }

    const messageTrimmed = formData.message.trim();
    if (!messageTrimmed) {
      newErrors.message = "PLEASE ENTER YOUR MESSAGE";
    } else if (messageTrimmed.length > 3000) {
      newErrors.message = "MESSAGE MUST NOT EXCEED 3000 CHARACTERS";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (gotcha.trim() !== "") return;

    if (!validateForm()) {
      return;
    }

    const currentSignature: MessageSignature = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      inquiry_type: formData.inquiry_type.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    // Check exact duplicate against last successfully submitted message
    if (
      lastSubmittedSignature &&
      lastSubmittedSignature.name === currentSignature.name &&
      lastSubmittedSignature.email === currentSignature.email &&
      lastSubmittedSignature.inquiry_type === currentSignature.inquiry_type &&
      lastSubmittedSignature.subject === currentSignature.subject &&
      lastSubmittedSignature.message === currentSignature.message
    ) {
      setSubmitStatus("duplicate");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formattedSubject = formatSubject(
      formData.name,
      formData.inquiry_type,
      formData.subject
    );

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      _replyto: formData.email.trim(),
      inquiry_type: formData.inquiry_type,
      subject: formattedSubject,
      message: formData.message.trim(),
      _gotcha: gotcha,
    };

    try {
      const response = await fetch("https://formspree.io/f/xqerrlvv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setLastSubmittedSignature(currentSignature);
        setSubmitStatus("success");
        setFormData({ name: "", email: "", inquiry_type: "General Inquiry", subject: "", message: "" });
        setErrors({});
      } else if (response.status === 429) {
        setSubmitStatus("rate_limit");
      } else {
        setSubmitStatus("error");
      }
    } catch (_err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 border-t border-border-muted scroll-mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider">{"// COMM_LINK"}</h2>
          <h3 className="text-2xl font-bold tracking-tight mt-1">Connect with Operator</h3>
        </div>
        <div className="font-mono text-[11px] font-bold text-text-secondary bg-bg-secondary px-3 py-1.5 rounded border border-border-muted self-start flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#32D74B] animate-pulse"></span>
          <span>STATUS: <span className="text-[#32D74B]">READY</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-bg-secondary border border-border-muted rounded-lg p-6">
            <h4 className="font-mono text-xs text-accent-cyan uppercase tracking-wider mb-4">{"// OPERATOR_ENDPOINTS"}</h4>
            
            <div className="space-y-4 font-mono text-xs text-text-secondary">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-accent-cyan mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase text-text-secondary/50">PRIMARY_EMAIL</span>
                  <div className="flex items-center gap-2">
                    <a href="mailto:osama.faroukk97@gmail.com" className="text-text-primary hover:text-accent-cyan break-all">
                      osama.faroukk97@gmail.com
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy("osama.faroukk97@gmail.com", "email")}
                      className="p-1 text-text-secondary hover:text-accent-cyan transition-colors"
                      title="Copy Email to Clipboard"
                    >
                      {copiedField === "email" ? <Check size={12} className="text-[#32D74B]" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Linkedin size={16} className="text-accent-cyan mt-0.5 shrink-0" />
                <div>
                  <span className="block text-[11px] uppercase text-text-secondary/50">LINKEDIN_PROFILE</span>
                  <a href="https://linkedin.com/in/osamafaroukk" target="_blank" rel="noopener noreferrer" className="text-text-primary hover:text-accent-cyan">
                    linkedin.com/in/osamafaroukk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Github size={16} className="text-accent-cyan mt-0.5 shrink-0" />
                <div>
                  <span className="block text-[11px] uppercase text-text-secondary/50">GITHUB_REGISTRY</span>
                  <a href="https://github.com/OsamaFarouk" target="_blank" rel="noopener noreferrer" className="text-text-primary hover:text-accent-cyan">
                    github.com/OsamaFarouk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={16} className="text-accent-cyan mt-0.5 shrink-0" />
                <div>
                  <span className="block text-[11px] uppercase text-text-secondary/50">PHONE_CHANNEL</span>
                  <div className="flex items-center gap-2">
                    <a href="tel:+201000748445" className="text-text-primary hover:text-accent-cyan">
                      +20 100 074 8445
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy("+20 100 074 8445", "phone")}
                      className="p-1 text-text-secondary hover:text-accent-cyan transition-colors"
                      title="Copy Phone Number to Clipboard"
                    >
                      {copiedField === "phone" ? <Check size={12} className="text-[#32D74B]" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-accent-cyan mt-0.5 shrink-0" />
                <div>
                  <span className="block text-[11px] uppercase text-text-secondary/50">REGION</span>
                  <span className="text-text-primary">Cairo, Egypt · UTC+3</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-border-muted rounded-lg p-5 font-mono text-[12px] text-text-secondary leading-relaxed">
            <span className="text-accent-cyan font-bold block mb-1">NOTE ON DATA ROUTING:</span>
            Submissions are routed through a secure HTTPS contact endpoint. No external email application is required.
          </div>
        </div>

        <div className="lg:col-span-7 bg-bg-secondary border border-border-color rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(6,182,212,0.04)]">
          <div className="bg-bg-tertiary px-4 py-2 border-b border-border-color flex items-center justify-between font-mono text-[11px] text-text-secondary">
            <span>CHANNEL: SECURE_INBOUND</span>
            <span>ENCRYPTED_POST</span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
            {/* Honeypot field */}
            <input
              type="text"
              name="_gotcha"
              value={gotcha}
              onChange={(e) => setGotcha(e.target.value)}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            {submitStatus === "success" && (
              <div className="p-4 rounded bg-[#32D74B]/10 border border-[#32D74B]/40 font-mono text-xs text-[#32D74B] flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>MESSAGE TRANSMITTED SUCCESSFULLY</span>
              </div>
            )}

            {submitStatus === "duplicate" && (
              <div className="p-4 rounded bg-amber-500/10 border border-amber-500/40 font-mono text-xs text-amber-400 flex items-center gap-2 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0" />
                <span>DUPLICATE MESSAGE DETECTED — THIS EXACT MESSAGE HAS ALREADY BEEN TRANSMITTED</span>
              </div>
            )}

            {submitStatus === "rate_limit" && (
              <div className="p-4 rounded bg-amber-500/10 border border-amber-500/40 font-mono text-xs text-amber-400 flex items-center gap-2 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0" />
                <span>TRANSMISSION LIMIT REACHED — PLEASE TRY AGAIN LATER</span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 rounded bg-red-500/10 border border-red-500/40 font-mono text-xs text-red-400 flex items-center gap-2 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0" />
                <span>TRANSMISSION FAILED — PLEASE TRY AGAIN</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="block font-mono text-[11px] text-text-secondary uppercase">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 bg-bg-primary border rounded text-xs text-text-primary focus:outline-none transition-colors disabled:opacity-60 ${
                    errors.name ? "border-red-400 focus:border-red-400" : "border-border-muted focus:border-accent-cyan"
                  }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="font-mono text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block font-mono text-[11px] text-text-secondary uppercase">
                  Return Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-3 py-2 bg-bg-primary border rounded text-xs text-text-primary focus:outline-none transition-colors disabled:opacity-60 ${
                    errors.email ? "border-red-400 focus:border-red-400" : "border-border-muted focus:border-accent-cyan"
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="font-mono text-[11px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="inquiry_type" className="block font-mono text-[11px] text-text-secondary uppercase">
                Inquiry Type
              </label>
              <div className="relative">
                <select
                  id="inquiry_type"
                  name="inquiry_type"
                  value={formData.inquiry_type}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-bg-primary border border-border-muted rounded text-xs text-text-primary focus:outline-none focus:border-accent-cyan transition-colors appearance-none cursor-pointer pr-8 disabled:opacity-60"
                >
                  <option value="General Inquiry" className="bg-bg-primary text-text-primary">General Inquiry</option>
                  <option value="Job Opportunity" className="bg-bg-primary text-text-primary">Job Opportunity</option>
                  <option value="DevOps / Cloud Consulting" className="bg-bg-primary text-text-primary">DevOps / Cloud Consulting</option>
                  <option value="Project Collaboration" className="bg-bg-primary text-text-primary">Project Collaboration</option>
                  <option value="Professional Networking" className="bg-bg-primary text-text-primary">Professional Networking</option>
                  <option value="Other" className="bg-bg-primary text-text-primary">Other</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent-cyan">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="subject" className="block font-mono text-[11px] text-text-secondary uppercase">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-bg-primary border border-border-muted rounded text-xs text-text-primary focus:outline-none focus:border-accent-cyan transition-colors disabled:opacity-60"
                placeholder="Brief subject (optional)"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="block font-mono text-[11px] text-text-secondary uppercase">
                Message Body *
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 bg-bg-primary border rounded text-xs text-text-primary focus:outline-none transition-colors resize-none disabled:opacity-60 ${
                  errors.message ? "border-red-400 focus:border-red-400" : "border-border-muted focus:border-accent-cyan"
                }`}
                placeholder="Details of the project, role, or connection request..."
              />
              {errors.message && (
                <p className="font-mono text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded bg-accent-cyan text-bg-primary font-mono text-xs font-bold hover:bg-accent-cyan/95 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send size={12} />
              <span>{isSubmitting ? "TRANSMITTING MESSAGE..." : "TRANSMIT MESSAGE"}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
