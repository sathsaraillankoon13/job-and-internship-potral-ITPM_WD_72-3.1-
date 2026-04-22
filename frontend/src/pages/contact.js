import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import styles from "../styles/contact.module.css";

export default function Contact({ user }) {

  useEffect(() => {
    document.title = "Contact Us - CareerBridge";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    return name.trim().length >= 2 && name.trim().length <= 100;
  };

  const validateSubject = (subject) => {
    return subject.trim().length >= 3 && subject.trim().length <= 100;
  };

  const validateMessage = (message) => {
    return message.trim().length >= 10 && message.trim().length <= 2000;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!validateName(formData.name)) {
      newErrors.name = "Name must be between 2 and 100 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (!validateSubject(formData.subject)) {
      newErrors.subject = "Subject must be between 3 and 100 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (!validateMessage(formData.message)) {
      newErrors.message = "Message must be between 10 and 2000 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Submit form
    setLoading(true);
    try {
      // Here you would typically send the form data to your backend
      // Example: await api.post('/contact', formData);
      console.log("Form submitted:", formData);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Failed to send message. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>


      <Navbar user={user} />


      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>We're Here to Help You Build Your Career</h1>
            <p className={styles.heroSubtitle}>
              Have questions? We'd love to hear from you. Get in touch with our team.
            </p>
          </div>
        </section>

        <div className={styles.contentWrapper}>
          {/* Contact Information */}
          <section className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Get In Touch</h2>
            <div className={styles.contactGrid}>
              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>📧</div>
                <h3 className={styles.contactCardTitle}>Email</h3>
                <p className={styles.contactCardText}>
                  <a href="mailto:support@careerbridge.com">support@careerbridge.com</a>
                </p>
                <p className={styles.contactCardSubtext}>We'll respond within 24 hours</p>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>📞</div>
                <h3 className={styles.contactCardTitle}>Phone</h3>
                <p className={styles.contactCardText}>
                  <a href="tel:+1234567890">(123) 456-7890</a>
                </p>
                <p className={styles.contactCardSubtext}>Monday - Friday, 9 AM - 6 PM EST</p>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>📍</div>
                <h3 className={styles.contactCardTitle}>Office</h3>
                <p className={styles.contactCardText}>
                  123 Career Street<br />
                  Tech City, TC 12345<br />
                  United States
                </p>
              </div>
            </div>

            <div className={styles.messageBox}>
              <p>
                <strong>Need help?</strong> We're here for technical support, partnership inquiries, or any 
                career-related questions. Whether you're a student looking to ace interviews, a job seeker 
                building your skills, or an organization interested in partnering with us, reach out and let's 
                connect.
              </p>
            </div>
          </section>

          {/* Contact Form */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Send us a Message</h2>
            
            {submitted && (
              <div className={styles.successMessage}>
                ✓ Thank you for reaching out! We'll get back to you soon.
              </div>
            )}

            {errors.submit && (
              <div className={styles.errorMessage}>
                ✗ {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  placeholder="Your full name"
                  maxLength="100"
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                <span className={styles.charCount}>{formData.name.length}/100</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>
                  Subject <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.subject ? styles.inputError : ""}`}
                  placeholder="e.g., Technical Support, Partnership, Career Advice"
                  maxLength="100"
                />
                {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
                <span className={styles.charCount}>{formData.subject.length}/100</span>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Message <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                  placeholder="Tell us how we can help you..."
                  rows="6"
                  maxLength="2000"
                />
                {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                <span className={styles.charCount}>{formData.message.length}/2000</span>
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            <div className={styles.faqNote}>
              <p>
                <strong>Quick answers?</strong> Check our <a href="#faq">FAQ section</a> for common questions 
                about our features, pricing, and account management.
              </p>
            </div>
          </section>
        </div>

        {/* FAQ Section */}
        <section className={styles.faqSection} id="faq">
          <div className={styles.faqContent}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>How do I get started with CareerBridge?</h4>
                <p className={styles.faqAnswer}>
                  Create a free account on our platform and complete your profile. You'll have instant access 
                  to skill assessments and our AI career advisor.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>Is there a free trial?</h4>
                <p className={styles.faqAnswer}>
                  Yes! We offer a free basic plan with access to key features. Upgrade to premium for unlimited 
                  mock interviews and advanced analytics.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>How are mock interviews evaluated?</h4>
                <p className={styles.faqAnswer}>
                  Our AI evaluates your responses on communication, technical knowledge, and interview etiquette. 
                  You'll receive detailed feedback and tips for improvement.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>Can employers see my profile?</h4>
                <p className={styles.faqAnswer}>
                  Only if you choose to make it visible. You have complete control over your privacy settings 
                  and can opt-in to employer visibility at any time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
