"use client";

import { useState } from 'react';
import { useTranslation } from '@/components/providers/translation-provider';
import { useAuth } from '@/components/providers/auth-provider';

export default function ContactPage() {
  const { t, currentLanguage } = useTranslation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Implement actual email sending logic
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Contact form submission:', {
        ...formData,
        userEmail: user?.email,
        timestamp: new Date().toISOString()
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-purple-600 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" data-translate="contact.title">
            {t('contact.title') || 'Contact Us'}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto" data-translate="contact.subtitle">
            {t('contact.subtitle') || 'We value your feedback and are here to help with any questions or suggestions you may have.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6" data-translate="contact.info.title">
              {t('contact.info.title') || 'Get in Touch'}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500/30 rounded-lg p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1" data-translate="contact.info.email.title">
                    {t('contact.info.email.title') || 'Email Support'}
                  </h3>
                  <p className="text-white/80" data-translate="contact.info.email.description">
                    {t('contact.info.email.description') || 'Send us your questions and we\'ll respond within 24 hours.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-500/30 rounded-lg p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1" data-translate="contact.info.improvement.title">
                    {t('contact.info.improvement.title') || 'Service Improvement'}
                  </h3>
                  <p className="text-white/80" data-translate="contact.info.improvement.description">
                    {t('contact.info.improvement.description') || 'Help us improve by sharing your suggestions and feedback.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-500/30 rounded-lg p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1" data-translate="contact.info.response.title">
                    {t('contact.info.response.title') || 'Quick Response'}
                  </h3>
                  <p className="text-white/80" data-translate="contact.info.response.description">
                    {t('contact.info.response.description') || 'We typically respond to all inquiries within 24 hours.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6" data-translate="contact.form.title">
              {t('contact.form.title') || 'Send us a Message'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2" data-translate="contact.form.name">
                  {t('contact.form.name') || 'Name'}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                  placeholder={t('contact.form.name_placeholder') || 'Your full name'}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2" data-translate="contact.form.email">
                  {t('contact.form.email') || 'Email'}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                  placeholder={t('contact.form.email_placeholder') || 'your.email@example.com'}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-white/90 mb-2" data-translate="contact.form.category">
                  {t('contact.form.category') || 'Category'}
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                >
                  <option value="general" className="bg-purple-900 text-white">
                    {t('contact.form.category_general') || 'General Inquiry'}
                  </option>
                  <option value="technical" className="bg-purple-900 text-white">
                    {t('contact.form.category_technical') || 'Technical Issue'}
                  </option>
                  <option value="feedback" className="bg-purple-900 text-white">
                    {t('contact.form.category_feedback') || 'Feedback & Suggestions'}
                  </option>
                  <option value="partnership" className="bg-purple-900 text-white">
                    {t('contact.form.category_partnership') || 'Partnership'}
                  </option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-white/90 mb-2" data-translate="contact.form.subject">
                  {t('contact.form.subject') || 'Subject'}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                  placeholder={t('contact.form.subject_placeholder') || 'Brief description of your message'}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-2" data-translate="contact.form.message">
                  {t('contact.form.message') || 'Message'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent resize-none"
                  placeholder={t('contact.form.message_placeholder') || 'Please provide details about your inquiry, issue, or suggestion...'}
                ></textarea>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-500/20 border border-green-300/30 rounded-lg p-4 text-green-100">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span data-translate="contact.form.success">
                      {t('contact.form.success') || 'Message sent successfully! We\'ll respond within 24 hours.'}
                    </span>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-4 text-red-100">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span data-translate="contact.form.error">
                      {t('contact.form.error') || 'Failed to send message. Please try again later.'}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span data-translate="contact.form.sending">
                      {t('contact.form.sending') || 'Sending...'}
                    </span>
                  </div>
                ) : (
                  <span data-translate="contact.form.submit">
                    {t('contact.form.submit') || 'Send Message'}
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}