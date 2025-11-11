import React from "react";
import "./ProfilePage.css";
import photo from "./assets/profile.png";
function ProfilePage() {
  return (
    <div className="resume-container">
      {/* Header */}
      <img src={photo} alt="Profile" className="profile-pic" />
      <header className="resume-header">
        <h1>Hitesh Ranjeet Jadhav</h1>
        <p> Full-Stack Developer</p>
        <p> Kolhapur, India | hiteshranjeetjadhav1234@gmail.com</p>
      </header>

      {/* Education */}
      <section>
        <h2>Education</h2>
        <ul>
          <li>
            <b>B.Tech in Computer Science Engineering</b> - D Y Patil College of
            Engineering (2022–2026)
          </li>
          <li>
            <b>HSC</b> - priyadarshini school, pune (2020–2022)
          </li>
        </ul>
      </section>

      {/* Skills */}
      <section>
        <h2>Technical Skills</h2>
        <ul>
          <li>Programming: C, C++, Java, Python, Php</li>
          <li> Web: HTML, CSS, JavaScript, React.js, Node.js</li>
          <li> Database: MySQL, MongoDB</li>
          <li> Machine Learning Basics</li>
        </ul>
      </section>

      {/* Projects */}
      <section>
        <h2>Projects</h2>
        <ul>
          <li>
            <b>hospital Management System</b> – A web app for managing hospital
            patients and payments.
          </li>
          <li>
            <b>Digital food menu card</b> – Digital menu card that appears after scaning QR
          </li>
        </ul>
      </section>

      {/* Contact */}
      <section>
        <h2>Contact</h2>
        <p>hiteshranjeetjadhav1234@gmail.com</p>
        <p>
          {" "}
          <a
            href="https://github.com/username"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>{" "}
          |
          <a
            href="https://linkedin.com/in/username"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </p>
      </section>
    </div>
  );
}

export default ProfilePage;
