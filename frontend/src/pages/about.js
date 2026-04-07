import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/about.module.css";

export default function About() {
  useEffect(() => {
    document.title = "About Us - CareerBridge";
  }, []);

  return (
    <>


      <Navbar />

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>About CareerBridge</h1>
            <p className={styles.heroSubtitle}>
              Empowering the next generation to bridge the gap between education and employment
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.sectionText}>
              CareerBridge exists to empower individuals to bridge the gap between education and employment. 
              We believe that every student and job seeker deserves access to world-class career preparation 
              tools and personalized guidance. By combining artificial intelligence with professional expertise, 
              we're making career success more accessible than ever before.
            </p>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>What We Offer</h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>AI Assistant</h3>
                <p className={styles.featureDesc}>
                  Get personalized career advice and guidance powered by advanced AI technology. 
                  Our intelligent assistant understands your goals and helps you achieve them.
                </p>
              </div>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Skill Tests</h3>
                <p className={styles.featureDesc}>
                  Assess your technical and professional skills with our comprehensive, industry-aligned 
                  skill assessments designed to identify your strengths and growth areas.
                </p>
              </div>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Mock Interviews</h3>
                <p className={styles.featureDesc}>
                  Practice real interview scenarios with AI-powered feedback. Gain confidence and improve 
                  your interview performance before the real opportunity.
                </p>
              </div>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Performance Analytics</h3>
                <p className={styles.featureDesc}>
                  Track your progress with detailed analytics. See where you excel and where to focus your 
                  development efforts with data-driven insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className={styles.section + " " + styles.altBg}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Why Choose CareerBridge?</h2>
            <div className={styles.benefitsList}>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>✓</div>
                <div>
                  <h4 className={styles.benefitTitle}>Personalized Roadmaps</h4>
                  <p className={styles.benefitText}>
                    Every career path is unique. We create customized career roadmaps based on your skills, 
                    interests, and goals.
                  </p>
                </div>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>✓</div>
                <div>
                  <h4 className={styles.benefitTitle}>Data-Driven Approach</h4>
                  <p className={styles.benefitText}>
                    Our recommendations are backed by real market data and industry insights, ensuring you're 
                    preparing for actual job market demands.
                  </p>
                </div>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>✓</div>
                <div>
                  <h4 className={styles.benefitTitle}>Expert-Backed Content</h4>
                  <p className={styles.benefitText}>
                    Our AI is trained on content validated by industry experts and hiring professionals to 
                    ensure accuracy and relevance.
                  </p>
                </div>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>✓</div>
                <div>
                  <h4 className={styles.benefitTitle}>Accessible & Affordable</h4>
                  <p className={styles.benefitText}>
                    Quality career preparation shouldn't be expensive. We're committed to making our platform 
                    accessible to everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionTitle}>Our Vision</h2>
            <p className={styles.sectionText}>
              We envision a world where every student and job seeker has access to their own AI-powered 
              career mentor. We're building CareerBridge to become the world's most trusted AI career mentor, 
              transforming how people prepare for and navigate their professional journeys. Together, we can 
              level the playing field and help talented individuals unlock their full potential.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Bridge Your Career Gap?</h2>
            <p className={styles.ctaText}>
              Join thousands of students and job seekers already using CareerBridge to advance their careers.
            </p>
            <a href="/opportunities" className={styles.ctaButton}>
              Get Started Today
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
