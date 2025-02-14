import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HandThumbsUp, Person, BarChart } from 'react-bootstrap-icons';
import Layout from './components/Layout';
import HelixDemo from './components/HelixDemo';

import './styles/style.scss';
import 'bootstrap/dist/js/bootstrap';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.3)), url('../assets/heroBg.jpg')`,
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "35vh",
    marginBottom: "4rem"
  };

  const mediaIconStyle = {
    marginRight: "1rem",
    fontSize: "2rem"
  };

  const contactCardStyle = {
    width: '20rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  };
  
  return <Layout>
    <div style={heroStyle} className="d-flex align-items-center justify-content-center">
      <div className="container">
        <div style={{ position: "absolute", left: 0,  top: "25vh", zIndex: 0 }}>
          <HelixDemo width={windowWidth} height={200} key={windowWidth} />
        </div>
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="text-black">Safely Test and Evaluate AI Agents in Controlled Environments</h1>
          </div>
          <div className="col-md-4 d-flex justify-content-end">
            <div className="card" style={contactCardStyle}>
              <div className="card-body">
                <h5 className="card-title">Contact Us</h5>
                <form>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Name" />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form-control" placeholder="Email" />
                  </div>
                  <div className="mb-3">
                    <textarea className="form-control" rows={3} placeholder="Message"></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="container">
      <section id="advantages">
        <h2>Advantages</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="d-flex">
              <HandThumbsUp style={mediaIconStyle} />
              <div>
                <h5>Safe Testing</h5>
                <p>Test AI agents with simulated internet access while ensuring no real-world impact through our MITM infrastructure.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex">
              <Person style={mediaIconStyle} />
              <div>
                <h5>Cloud Management</h5>
                <p>Deploy and manage your AI agents in the cloud with our comprehensive management platform and API.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex">
              <BarChart style={mediaIconStyle} />
              <div>
                <h5>Detailed Analytics</h5>
                <p>Monitor agent behavior, track performance metrics, and generate comprehensive evaluation reports.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr />
      <section id="strategy">
        <h2>Our Technology</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card mx-3 mb-3">
              <div className="card-body">
                <h5 className="card-title">Request Interception</h5>
                <p className="card-text">
                  Our MITM infrastructure seamlessly intercepts and rewrites network requests,
                  allowing AI agents to interact with simulated environments without affecting real systems.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mx-3 mb-3">
              <div className="card-body">
                <h5 className="card-title">Environment Control</h5>
                <p className="card-text">
                  Create custom test scenarios and controlled environments to evaluate AI agent behavior
                  and capabilities while maintaining complete isolation from production systems.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mx-3 mb-3">
              <div className="card-body">
                <h5 className="card-title">Performance Analysis</h5>
                <p className="card-text">
                  Comprehensive analytics and reporting tools help you understand agent behavior,
                  identify potential issues, and optimize performance in your development cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Layout>
}
