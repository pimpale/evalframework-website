import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FileEarmarkPdf, Github, Clipboard, HandThumbsUp, Person, BarChart } from 'react-bootstrap-icons';

import Fig1 from './assets/figures/scaling_graph.png';

import { Prism as SyntaxHighligher } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowRight } from 'react-bootstrap-icons';


import './styles/style.scss';
import 'bootstrap/dist/js/bootstrap';
import Layout from './components/Layout';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



function App() {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.3)), url('../assets/heroBg.jpg')`,
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "50vh",
  };

  const mediaIconStyle = {
    marginRight: "1rem",
    fontSize: "2rem"
  };

  const testimonialItemStyle = {
    display: "inline-block",
    padding: 0,
    position: "relative" as const,
    margin: "25px 0 15px",
    width: "100%"
  };

  const testimonialAuthorStyle = {
    color: "#444",
    fontWeight: "bold",
    marginTop: "20px"
  };

  const testimonialOccupationStyle = {
    color: "#aaa"
  };

  return <Layout>
    <div style={heroStyle} className="d-flex align-items-center justify-content-center mb-5">
      <div className="container d-flex justify-content-center align-items-center">
        <h1 className="text-white">Secure your Browser and Computer Use LLM Agents.</h1>
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
                <h5>Easy to Use</h5>
                <p>Increases teaching time by automating attendance in every classroom and decreasing teacher responsibilities.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex">
              <Person style={mediaIconStyle} />
              <div>
                <h5>Secure Campus</h5>
                <p>Ensures schoolwide safety by recording student entrances and exits and preventing chronic absenteeism in integrated classrooms.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex">
              <BarChart style={mediaIconStyle} />
              <div>
                <h5>Detailed Reporting</h5>
                <p>Analyzes attendance data to provide extensive administrator reports on in-session campus safety and attendance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr />
      <section id="strategy">
        <h2>Our Strategy</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card mx-3 mb-3">
              <div className="card-body">
                <h5 className="card-title">Data Collection</h5>
                <p className="card-text">
                  The process begins with our RFID technology. All classrooms will have a scanner that captures scan-in/out data
                  from students whenever an ID card is detected
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mx-3 mb-3">
              <div className="card-body">
                <h5 className="card-title">Data Processing</h5>
                <p className="card-text">
                  Data from the RFID-driven scanners are transmitted to the Innexgo database
                  where this data is sorted into categorizations such as class periods, classrooms, and teachers.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mx-3 mb-3">
              <div className="card-body">
                <h5 className="card-title">Data Analysis</h5>
                <p className="card-text">
                  Innexgo displays the attendance data through our analytics dashboard where
                  teachers and administrators can monitor student attendance records and access numerous charts and reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr />
      <section id="testimonials">
        <h2>What people say about us</h2>
        <div style={testimonialItemStyle}>
          <p>&quot;Less time on trying to check who&apos;s there and more time for teaching.&quot;</p>
          <span className="d-block" style={testimonialAuthorStyle}>Channy Cornejo</span>
          <span className="d-block" style={testimonialOccupationStyle}>Math Department Chair</span>
        </div>
        <div style={testimonialItemStyle}>
          <p>&quot;It holds students accountable for their attendance habits.&quot;</p>
          <span className="d-block" style={testimonialAuthorStyle}>Carole Ng</span>
          <span className="d-block" style={testimonialOccupationStyle}>Computer Science Teacher</span>
        </div>
      </section>
    </div>
  </Layout>
}
