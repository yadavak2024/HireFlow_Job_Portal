import React, { useEffect, useState } from "react";

import {

  Routes,

  Route,

  Link,

  useNavigate,

} from "react-router-dom";



import {

  Search,

  MapPin,

  Briefcase,

  ArrowRight,

  ChevronRight,

  Menu,

  X,

} from "lucide-react";



const jobs = [

  {

    id: 1,

    title: "Frontend Developer",

    company: "TechNova",

    location: "Bengaluru, India",

    type: "Full-time",

    salary: "₹8–12 LPA",

    tag: "React.js",

  },

  {

    id: 2,

    title: "Full Stack Developer",

    company: "CloudPeak",

    location: "Remote",

    type: "Full-time",

    salary: "₹10–16 LPA",

    tag: "Node.js",

  },

  {

    id: 3,

    title: "UI/UX Designer",

    company: "PixelCraft",

    location: "Delhi, India",

    type: "Full-time",

    salary: "₹6–10 LPA",

    tag: "Figma",

  },

  {

    id: 4,

    title: "Python Developer",

    company: "DataSphere",

    location: "Hyderabad, India",

    type: "Full-time",

    salary: "₹7–13 LPA",

    tag: "Python",

  },

];



function Navbar() {

  const [open, setOpen] = useState(false);

  const [loggedIn, setLoggedIn] = useState(

    !!localStorage.getItem("token")

  );



  const user = JSON.parse(

    localStorage.getItem("user") || "null"

  );



  const dashboardPath =

    user?.role === "recruiter"

      ? "/recruiter-dashboard"

      : "/candidate-dashboard";



  useEffect(() => {

    const checkLogin = () => {

      setLoggedIn(!!localStorage.getItem("token"));

    };



    window.addEventListener("storage", checkLogin);



    return () => {

      window.removeEventListener("storage", checkLogin);

    };

  }, []);



  const handleDeleteJob = async (jobId) => {

    const confirmed = window.confirm(

      "Are you sure you want to delete this job?"

    );



    if (!confirmed) {

      return;

    }



    setDeleteLoading(jobId);



    try {

      const response = await fetch(

        "http\://localhost:5000/api/jobs/" + jobId,

        {

          method: "DELETE",

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );



      const data = await response.json();



      if (!response.ok) {

        setMessage(data.message || "Unable to delete job");

        setDeleteLoading("");

        return;

      }



      setPostedJobs(

        postedJobs.filter((job) => job._id !== jobId)

      );



      setMessage("Job deleted successfully.");

    } catch (error) {

      console.log(error);

      setMessage("Unable to connect to server.");

    }



    setDeleteLoading("");

  };



  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");



    setLoggedIn(false);

    setOpen(false);



    window.location.href = "/login";

  };



  return (

    <nav className="nav">

      <div className="nav-inner">

        <Link to="/" className="logo">

          <span className="logo-mark">H</span>

          Hire<span>Flow</span>

        </Link>



        <div className={"nav-links " + (open ? "show" : "")}>

          <Link to="/jobs">Find Jobs</Link>

          <Link to="/companies">Companies</Link>

          <Link to="/about">About</Link>



          {loggedIn ? (

            <>

              <Link to={dashboardPath}>

                Dashboard

              </Link>



              <button

                onClick={logout}

                style={{

                  background: "none",

                  border: "none",

                  cursor: "pointer",

                  font: "inherit",

                  padding: 0,

                }}

              >

                Logout

              </button>

            </>

          ) : (

            <>

              <Link to="/login">Sign in</Link>



              <Link

                to="/register"

                className="nav-btn"

              >

                Get Started

              </Link>

            </>

          )}

        </div>



        <button

          className="menu"

          onClick={() => setOpen(!open)}

        >

          {open ? <X /> : <Menu />}

        </button>

      </div>

    </nav>

  );

}



function SearchBox({ onSearch }) {

  const [q, setQ] = useState("");



  return (

    <div className="search-box">

      <div className="search-field">

        <Search />



        <input

          value={q}

          onChange={(e) => setQ(e.target.value)}

          placeholder="Job title, skills, or keywords"

        />

      </div>



      <div className="search-field">

        <MapPin />

        <input placeholder="Location" />

      </div>



      <button onClick={() => onSearch?.(q)}>

        Search jobs <ArrowRight size={17} />

      </button>

    </div>

  );

}



function JobCard({ job }) {

  return (

    <Link

      to={"/jobs/" + job.id}

      className="job-card"

    >

      <div className="company-icon">

        {job.company[0]}

      </div>



      <div className="job-info">

        <div className="job-top">

          <h3>{job.title}</h3>

          <span className="save">♡</span>

        </div>



        <p className="company">

          {job.company}

        </p>



        <div className="meta">

          <span>

            <MapPin size={14} />

            {job.location}

          </span>



          <span>

            <Briefcase size={14} />

            {job.type}

          </span>

        </div>



        <div className="tags">

          <span>{job.tag}</span>

          <b>{job.salary}</b>

        </div>

      </div>

    </Link>

  );

}



function Home() {

  const nav = useNavigate();



  return (

    <>

      <section className="hero">

        <div className="hero-bg"></div>



        <div className="container hero-content">

          <span className="eyebrow">

            THE SMARTER WAY TO GET HIRED

          </span>



          <h1>

            Find a job that <em>fits your future.</em>

          </h1>



          <p>

            Discover opportunities from innovative companies

            and take the next step in your career.

          </p>



          <SearchBox

            onSearch={(q) =>

              nav(

                "/jobs" +

                  (q

                    ? "?q=" + encodeURIComponent(q)

                    : "")

              )

            }

          />



          <div className="trusted">

            <span>

              Trusted by professionals at

            </span>



            <div>

              <b>Google</b>

              <b>Microsoft</b>

              <b>Amazon</b>

              <b>Adobe</b>

              <b>Meta</b>

            </div>

          </div>

        </div>

      </section>



      <section className="section">

        <div className="container">

          <div className="section-head">

            <div>

              <span className="eyebrow dark">

                CURATED FOR YOU

              </span>



              <h2>

                Featured opportunities

              </h2>

            </div>



            <Link

              to="/jobs"

              className="view"

            >

              View all jobs{" "}

              <ArrowRight size={17} />

            </Link>

          </div>



          <div className="jobs-grid">

            {jobs.slice(0, 3).map((j) => (

              <JobCard

                key={j.id}

                job={j}

              />

            ))}

          </div>

        </div>

      </section>



      <section className="stats">

        <div className="container stats-grid">

          <div>

            <strong>50K+</strong>

            <span>Active jobs</span>

          </div>



          <div>

            <strong>12K+</strong>

            <span>Hiring companies</span>

          </div>



          <div>

            <strong>1.8M+</strong>

            <span>Professionals</span>

          </div>



          <div>

            <strong>94%</strong>

            <span>Successful matches</span>

          </div>

        </div>

      </section>



      <section className="section categories">

        <div className="container">

          <span className="eyebrow dark">

            EXPLORE CAREERS

          </span>



          <h2>

            Find your next opportunity

          </h2>



          <div className="cat-grid">

            {[

              "Software Development",

              "Design & Creative",

              "Marketing",

              "Data & Analytics",

              "Sales",

              "Finance",

            ].map((x, i) => (

              <Link

                to="/jobs"

                className="cat"

                key={x}

              >

                <span className="cat-icon">

                  {

                    [

                      "⌘",

                      "✦",

                      "↗",

                      "◈",

                      "◎",

                      "$",

                    ][i]

                  }

                </span>



                <b>{x}</b>



                <ChevronRight size={17} />

              </Link>

            ))}

          </div>

        </div>

      </section>



      <section className="cta">

        <div className="container cta-inner">

          <div>

            <span className="eyebrow">

              FOR EMPLOYERS

            </span>



            <h2>

              Ready to build your next great team?

            </h2>



            <p>

              Reach talented professionals who are

              ready to make an impact.

            </p>

          </div>



          <Link

            to="/register"

            className="primary"

          >

            Start hiring{" "}

            <ArrowRight size={18} />

          </Link>

        </div>

      </section>



      <Footer />

    </>

  );

}



function Jobs() {

  const [q, setQ] = useState(

    new URLSearchParams(

      window.location.search

    ).get("q") || ""

  );



  const [allJobs, setAllJobs] = useState(jobs);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchJobs = async () => {

      try {

        const response = await fetch(

          "http\://localhost:5000/api/jobs"

        );



        const data = await response.json();



        if (response.ok) {

          const backendJobs = data.map((job) => ({

            id: job._id,

            title: job.title,

            company: job.company,

            location: job.location,

            type: job.type,

            salary: job.salary,

            tag: job.skills,

            description: job.description,

          }));



          setAllJobs([...backendJobs, ...jobs]);

        }

      } catch (error) {

        console.log(error);

      }



      setLoading(false);

    };



    fetchJobs();

  }, []);



  const list = allJobs.filter((j) =>

    (

      j.title +

      " " +

      j.company +

      " " +

      j.tag

    )

      .toLowerCase()

      .includes(q.toLowerCase())

  );



  return (

    <>

      <div className="page-head">

        <div className="container">

          <span className="eyebrow dark">

            OPPORTUNITIES

          </span>



          <h1>Find your next job</h1>



          <p>

            Explore roles from companies that

            are building the future.

          </p>



          <SearchBox onSearch={setQ} />

        </div>

      </div>



      <section className="section">

        <div className="container results">

          <aside>

            <h3>Filters</h3>



            <label>Job type</label>



            {[

              "Full-time",

              "Part-time",

              "Contract",

              "Internship",

            ].map((x) => (

              <div

                className="check"

                key={x}

              >

                <input type="checkbox" />

                {x}

              </div>

            ))}



            <label>Experience</label>



            {[

              "Entry level",

              "Mid level",

              "Senior level",

            ].map((x) => (

              <div

                className="check"

                key={x}

              >

                <input type="checkbox" />

                {x}

              </div>

            ))}

          </aside>



          <main>

            <div className="result-head">

              <b>

                {loading

                  ? "Loading jobs..."

                  : `${list.length} jobs found`}

              </b>



              <span>

                Sort: Recommended ▾

              </span>

            </div>



            {list.map((j) => (

              <JobCard

                key={j.id}

                job={j}

              />

            ))}

          </main>

        </div>

      </section>



      <Footer />

    </>

  );

}



function JobDetails({ id }) {

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  const [applyLoading, setApplyLoading] = useState(false);

  const [applyMessage, setApplyMessage] = useState("");



  const handleApply = async () => {

    const token = localStorage.getItem("token");



    if (!token) {

      window.location.href = "/login";

      return;

    }



    setApplyLoading(true);

    setApplyMessage("");



    try {

      const response = await fetch(

        "http\://localhost:5000/api/applications",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,

          },

          body: JSON.stringify({

            jobId: job.id,

          }),

        }

      );



      const data = await response.json();



      if (!response.ok) {

        setApplyMessage(data.message || "Unable to apply for this job");

        setApplyLoading(false);

        return;

      }



      setApplyMessage("Application submitted successfully! 🎉");

    } catch (error) {

      console.log(error);

      setApplyMessage("Unable to connect to server.");

    }



    setApplyLoading(false);

  };



  useEffect(() => {

    const fetchJob = async () => {

      try {

        const response = await fetch(

          "http\://localhost:5000/api/jobs/" + id

        );



        if (response.ok) {

          const data = await response.json();



          setJob({

            id: data._id,

            title: data.title,

            company: data.company,

            location: data.location,

            type: data.type,

            salary: data.salary,

            tag: data.skills,

            description: data.description,

          });

        } else {

          const staticJob = jobs.find(

            (j) => String(j.id) === String(id)

          );



          setJob(staticJob || jobs[0]);

        }

      } catch (error) {

        console.log(error);



        const staticJob = jobs.find(

          (j) => String(j.id) === String(id)

        );



        setJob(staticJob || jobs[0]);

      }



      setLoading(false);

    };



    fetchJob();

  }, [id]);



  if (loading) {

    return (

      <div className="simple">

        <div className="container">

          <h1>Loading job...</h1>

        </div>

      </div>

    );

  }



  return (

    <>

      <div className="detail-head">

        <div className="container">

          <Link

            to="/jobs"

            className="back"

          >

            ← Back to jobs

          </Link>



          <div className="detail-title">

            <div className="company-icon big">

              {job.company[0]}

            </div>



            <div>

              <h1>{job.title}</h1>



              <p>

                {job.company} ·{" "}

                {job.location}

              </p>

            </div>



            <div>

              <button

                className="primary apply"

                onClick={handleApply}

                disabled={applyLoading}

              >

                {applyLoading ? "Applying..." : "Apply now"}{" "}

                {!applyLoading && <ArrowRight size={17} />}

              </button>



              {applyMessage && (

                <p

                  style={{

                    marginTop: "10px",

                    marginBottom: 0,

                    color: applyMessage.includes("successfully")

                      ? "#18743a"

                      : "#b42318",

                    fontWeight: "600",

                  }}

                >

                  {applyMessage}

                </p>

              )}

            </div>

          </div>

        </div>

      </div>



      <section className="section">

        <div className="container detail-grid">

          <article>

            <h2>About the role</h2>



            <p>

              {job.description}

            </p>



            <h2>What you'll do</h2>



            <ul>

              <li>

                Build and ship high-quality,

                scalable features.

              </li>



              <li>

                Collaborate with product, design,

                and engineering teams.

              </li>



              <li>

                Write clean, maintainable and

                well-tested code.

              </li>



              <li>

                Contribute to technical decisions

                and best practices.

              </li>

            </ul>



            <h2>Requirements</h2>



            <ul>

              <li>

                Strong communication and

                problem-solving skills.

              </li>



              <li>

                Relevant experience with modern

                development practices.

              </li>



              <li>

                Ability to work independently and

                in a collaborative environment.

              </li>

            </ul>

          </article>



          <aside className="summary">

            <h3>Job overview</h3>



            <p>📍 {job.location}</p>

            <p>💼 {job.type}</p>

            <p>💰 {job.salary}</p>

            <p>⚡ {job.tag}</p>



            <hr />



            <h3>

              About {job.company}

            </h3>



            <p>

              A modern company focused on building

              products that make a difference.

            </p>

          </aside>

        </div>

      </section>



      <Footer />

    </>

  );

}





/* =========================
   CANDIDATE DASHBOARD
========================= */

function CandidateDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "https://hireflow-backend-ccba.onrender.com/api/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Unable to load applications");
          setLoading(false);
          return;
        }

        setApplications(data);
      } catch (error) {
        console.log(error);
        setError("Unable to connect to server.");
      }

      setLoading(false);
    };

    if (token) {
      fetchApplications();
    } else {
      setLoading(false);
      setError("Please login first.");
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="simple">
      <div className="container">
        <span className="eyebrow dark">
          CANDIDATE DASHBOARD
        </span>

        <h1>
          Welcome, {user?.name || "Candidate"} 👋
        </h1>

        <p>
          Find jobs, apply to opportunities and
          manage your applications from one place.
        </p>

        <div
          className="jobs-grid"
          style={{ marginTop: "30px" }}
        >
          <Link to="/jobs" className="job-card">
            <div className="company-icon">🔎</div>

            <div className="job-info">
              <h3>Find Jobs</h3>
              <p className="company">
                Explore available job opportunities
              </p>
            </div>
          </Link>

          <div
            className="job-card"
            style={{
              cursor: "default",
              gridColumn: "span 2",
            }}
          >
            <div className="company-icon">📄</div>

            <div className="job-info">
              <h3>My Applications</h3>

              <p className="company">
                Track your job applications
              </p>

              {loading && (
                <p style={{ marginTop: "15px" }}>
                  Loading applications...
                </p>
              )}

              {error && (
                <p
                  style={{
                    marginTop: "15px",
                    color: "#b42318",
                    fontWeight: "600",
                  }}
                >
                  {error}
                </p>
              )}

              {!loading && !error && applications.length === 0 && (
                <p style={{ marginTop: "15px" }}>
                  You have not applied for any jobs yet.
                </p>
              )}

              {!loading && !error && applications.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  {applications.map((application) => (
                    <div
                      key={application._id}
                      style={{
                        border: "1px solid #e5e5e5",
                        borderRadius: "12px",
                        padding: "15px",
                        marginBottom: "12px",
                        background: "#fafafa",
                      }}
                    >
                      <h4 style={{ margin: "0 0 6px" }}>
                        {application.job?.title || "Job"}
                      </h4>

                      <p style={{ margin: "4px 0", color: "#666" }}>
                        {application.job?.company || ""}
                      </p>

                      <p style={{ margin: "4px 0", color: "#666" }}>
                        📍 {application.job?.location || ""}
                      </p>

                      <p
                        style={{
                          margin: "8px 0 0",
                          fontWeight: "600",
                        }}
                      >
                        Status: {application.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="job-card">
            <div className="company-icon">👤</div>

            <div className="job-info">
              <h3>My Profile</h3>
              <p className="company">
                Manage your profile
              </p>
            </div>
          </div>
        </div>

        <button
          className="primary"
          style={{ marginTop: "30px" }}
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}


/* =========================

   RECRUITER DASHBOARD

========================= */



function RecruiterDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [salary, setSalary] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [postedJobs, setPostedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [deleteLoading, setDeleteLoading] = useState("");
  const [activeSection, setActiveSection] = useState("post");

  const fetchMyJobs = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/jobs/my-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPostedJobs(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      setApplicationMessage("");

      const response = await fetch(
        "http://localhost:5000/api/applications/recruiter-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setApplicationMessage(
          data.message || "Unable to load applications"
        );
        setApplications([]);
        return;
      }

      setApplications(data);
    } catch (error) {
      console.log(error);
      setApplicationMessage("Unable to connect to server.");
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMyJobs();
      fetchApplications();
    } else {
      setApplicationsLoading(false);
    }
  }, [token]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            company,
            location,
            type,
            salary,
            skills,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to post job");
        return;
      }

      setMessage("Job posted successfully! 🎉");
      setTitle("");
      setCompany("");
      setLocation("");
      setType("Full-time");
      setSalary("");
      setSkills("");
      setDescription("");

      await fetchMyJobs();
    } catch (error) {
      console.log(error);
      setMessage("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/applications/" +
          applicationId +
          "/status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update application");
        return;
      }

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status: data.application.status,
              }
            : application
        )
      );
    } catch (error) {
      console.log(error);
      alert("Unable to connect to server.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    setDeleteLoading(jobId);

    try {
      const response = await fetch(
        "http://localhost:5000/api/jobs/" + jobId,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to delete job");
        return;
      }

      setPostedJobs((currentJobs) =>
        currentJobs.filter((job) => job._id !== jobId)
      );

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application.job?._id !== jobId
        )
      );
    } catch (error) {
      console.log(error);
      alert("Unable to connect to server.");
    } finally {
      setDeleteLoading("");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const pendingApplications = applications.filter(
    (application) => application.status === "Pending"
  ).length;

  const shortlistedApplications = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  const rejectedApplications = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  return (
    <div
      style={{
        background: "#f7f8fc",
        minHeight: "calc(100vh - 70px)",
        padding: "50px 0 70px",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "25px",
            flexWrap: "wrap",
            marginBottom: "35px",
          }}
        >
          <div>
            <span className="eyebrow dark">RECRUITER PORTAL</span>
            <h1 style={{ marginTop: "8px", marginBottom: "8px" }}>
              Welcome, {user?.name || "Recruiter"} 👋
            </h1>
            <p style={{ margin: 0, color: "#666", fontSize: "16px" }}>
              Find great talent and build your next team.
            </p>
          </div>

          <button
            onClick={logout}
            style={{
              padding: "11px 20px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "18px",
            marginBottom: "30px",
          }}
        >
          <button
            onClick={() => setActiveSection("post")}
            style={{
              textAlign: "left",
              background: activeSection === "post" ? "#111" : "#fff",
              color: activeSection === "post" ? "#fff" : "#111",
              padding: "22px",
              borderRadius: "16px",
              border: "1px solid #e8e8ee",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "26px", marginBottom: "8px" }}>💼</div>
            <b>Post Jobs</b>
            <p style={{ margin: "6px 0 0", color: activeSection === "post" ? "#ccc" : "#777" }}>
              Create new opportunities
            </p>
          </button>

          <button
            onClick={() => setActiveSection("candidates")}
            style={{
              textAlign: "left",
              background: activeSection === "candidates" ? "#111" : "#fff",
              color: activeSection === "candidates" ? "#fff" : "#111",
              padding: "22px",
              borderRadius: "16px",
              border: "1px solid #e8e8ee",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "26px", marginBottom: "8px" }}>👥</div>
            <b>Find Candidates</b>
            <p style={{ margin: "6px 0 0", color: activeSection === "candidates" ? "#ccc" : "#777" }}>
              {applications.length} candidate applications
            </p>
          </button>

          <button
            onClick={() => setActiveSection("applications")}
            style={{
              textAlign: "left",
              background: activeSection === "applications" ? "#111" : "#fff",
              color: activeSection === "applications" ? "#fff" : "#111",
              padding: "22px",
              borderRadius: "16px",
              border: "1px solid #e8e8ee",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "26px", marginBottom: "8px" }}>📄</div>
            <b>Applications</b>
            <p style={{ margin: "6px 0 0", color: activeSection === "applications" ? "#ccc" : "#777" }}>
              Track candidate applications
            </p>
          </button>
        </div>

        {activeSection === "post" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.8fr) minmax(250px, 0.8fr)",
                gap: "25px",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  border: "1px solid #e7e7ed",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "25px 30px", borderBottom: "1px solid #eee" }}>
                  <h2 style={{ margin: 0 }}>Post a New Job</h2>
                  <p style={{ margin: "7px 0 0", color: "#777" }}>
                    Create a job listing and reach relevant candidates.
                  </p>
                </div>

                <form onSubmit={handlePostJob} style={{ padding: "30px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "18px",
                    }}
                  >
                    <div>
                      <label style={{ display: "block", marginBottom: "7px", fontWeight: "600" }}>
                        Job Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Full Stack Developer"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ marginBottom: 0 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "7px", fontWeight: "600" }}>
                        Company
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. HireFlow Technologies"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                        style={{ marginBottom: 0 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "7px", fontWeight: "600" }}>
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Noida / Remote"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        style={{ marginBottom: 0 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "7px", fontWeight: "600" }}>
                        Job Type
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          background: "#fff",
                        }}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "7px", fontWeight: "600" }}>
                        Salary
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹8-12 LPA"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        required
                        style={{ marginBottom: 0 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "7px", fontWeight: "600" }}>
                        Skills
                      </label>
                      <input
                        type="text"
                        placeholder="React, Node.js, MongoDB"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        required
                        style={{ marginBottom: 0 }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "18px" }}>
                    <label style={{ display: "block", marginBottom: "7px", fontWeight: "600" }}>
                      Job Description
                    </label>
                    <textarea
                      placeholder="Describe the role, responsibilities and what you are looking for..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows="7"
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        resize: "vertical",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>

                  {message && (
                    <div
                      style={{
                        marginTop: "18px",
                        padding: "13px 15px",
                        borderRadius: "10px",
                        background: message.includes("success") ? "#eefaf1" : "#fff3f3",
                        color: message.includes("success") ? "#18743a" : "#b42318",
                        fontWeight: "600",
                      }}
                    >
                      {message}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "22px" }}>
                    <button
                      type="submit"
                      className="primary"
                      disabled={loading}
                      style={{ minWidth: "145px" }}
                    >
                      {loading ? "Posting..." : "Post Job"}
                      {!loading && <ArrowRight size={17} />}
                    </button>
                  </div>
                </form>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ background: "#111", color: "#fff", borderRadius: "20px", padding: "25px" }}>
                  <div style={{ fontSize: "28px", marginBottom: "12px" }}>🚀</div>
                  <h3 style={{ margin: "0 0 10px" }}>Hiring made simple</h3>
                  <p style={{ margin: 0, color: "#ccc", lineHeight: 1.6 }}>
                    Publish clear job descriptions and connect with candidates looking for their next opportunity.
                  </p>
                </div>

                <div style={{ background: "#fff", border: "1px solid #e7e7ed", borderRadius: "20px", padding: "25px" }}>
                  <h3 style={{ marginTop: 0 }}>Your recruiter account</h3>
                  <p style={{ margin: "7px 0", color: "#666" }}>
                    <b>Name:</b> {user?.name || "Recruiter"}
                  </p>
                  <p style={{ margin: "7px 0", color: "#666" }}>
                    <b>Email:</b> {user?.email || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "30px",
                background: "#fff",
                borderRadius: "20px",
                border: "1px solid #e7e7ed",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "25px 30px", borderBottom: "1px solid #eee" }}>
                <h2 style={{ margin: 0 }}>My Posted Jobs</h2>
                <p style={{ margin: "7px 0 0", color: "#777" }}>
                  Manage the jobs you have posted.
                </p>
              </div>

              <div style={{ padding: "20px 30px" }}>
                {postedJobs.length === 0 ? (
                  <p style={{ color: "#777", margin: 0 }}>
                    You have not posted any jobs yet.
                  </p>
                ) : (
                  postedJobs.map((job) => (
                    <div
                      key={job._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap",
                        padding: "18px",
                        border: "1px solid #eee",
                        borderRadius: "14px",
                        marginBottom: "14px",
                      }}
                    >
                      <div>
                        <h3 style={{ margin: "0 0 6px" }}>{job.title}</h3>
                        <p style={{ margin: 0, color: "#666" }}>
                          {job.company} · {job.location} · {job.type}
                        </p>
                        <p style={{ margin: "6px 0 0", color: "#777", fontSize: "14px" }}>
                          {job.salary} · {job.skills}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        disabled={deleteLoading === job._id}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "9px",
                          border: "1px solid #f0caca",
                          background: "#fff5f5",
                          color: "#c62828",
                          cursor: deleteLoading === job._id ? "not-allowed" : "pointer",
                          fontWeight: "600",
                        }}
                      >
                        {deleteLoading === job._id ? "Deleting..." : "Delete Job"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {activeSection === "applications" && (
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e7e7ed", overflow: "hidden" }}>
            <div style={{ padding: "25px 30px", borderBottom: "1px solid #eee" }}>
              <h2 style={{ margin: 0 }}>Applications</h2>
              <p style={{ margin: "7px 0 0", color: "#777" }}>
                Track and manage candidates who applied to your jobs.
              </p>
            </div>

            <div style={{ padding: "20px 30px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "12px",
                  marginBottom: "22px",
                }}
              >
                <div style={{ padding: "16px", background: "#f7f8fc", borderRadius: "12px" }}>
                  <b>{applications.length}</b>
                  <p style={{ margin: "5px 0 0", color: "#777" }}>Total</p>
                </div>
                <div style={{ padding: "16px", background: "#f7f8fc", borderRadius: "12px" }}>
                  <b>{pendingApplications}</b>
                  <p style={{ margin: "5px 0 0", color: "#777" }}>Pending</p>
                </div>
                <div style={{ padding: "16px", background: "#f7f8fc", borderRadius: "12px" }}>
                  <b>{shortlistedApplications}</b>
                  <p style={{ margin: "5px 0 0", color: "#777" }}>Shortlisted</p>
                </div>
                <div style={{ padding: "16px", background: "#f7f8fc", borderRadius: "12px" }}>
                  <b>{rejectedApplications}</b>
                  <p style={{ margin: "5px 0 0", color: "#777" }}>Rejected</p>
                </div>
              </div>

              {applicationsLoading && <p>Loading applications...</p>}
              {applicationMessage && <p style={{ color: "#b42318", fontWeight: "600" }}>{applicationMessage}</p>}

              {!applicationsLoading && !applicationMessage && applications.length === 0 && (
                <p style={{ color: "#777" }}>No candidates have applied yet.</p>
              )}

              {!applicationsLoading && applications.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {applications.map((application) => (
                    <div
                      key={application._id}
                      style={{
                        border: "1px solid #e8e8ee",
                        borderRadius: "14px",
                        padding: "20px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "15px", flexWrap: "wrap" }}>
                        <div>
                          <h3 style={{ margin: "0 0 6px" }}>
                            {application.candidate?.name || "Candidate"}
                          </h3>
                          <p style={{ margin: "4px 0", color: "#666" }}>
                            {application.candidate?.email || "Email not available"}
                          </p>
                          <p style={{ margin: "10px 0 4px", fontWeight: "600" }}>
                            {application.job?.title || "Job"}
                          </p>
                          <p style={{ margin: 0, color: "#777" }}>
                            {application.job?.company || ""} · {application.job?.location || ""}
                          </p>
                        </div>

                        <div style={{ minWidth: "180px" }}>
                          <p style={{ margin: "0 0 10px", fontWeight: "600" }}>
                            Status: {application.status}
                          </p>

                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <button
                              onClick={() => updateApplicationStatus(application._id, "Shortlisted")}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #b8dfc4",
                                background: "#effaf2",
                                color: "#18743a",
                                cursor: "pointer",
                                fontWeight: "600",
                              }}
                            >
                              Shortlist
                            </button>

                            <button
                              onClick={() => updateApplicationStatus(application._id, "Rejected")}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #f0caca",
                                background: "#fff5f5",
                                color: "#c62828",
                                cursor: "pointer",
                                fontWeight: "600",
                              }}
                            >
                              Reject
                            </button>

                            <button
                              onClick={() => updateApplicationStatus(application._id, "Pending")}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                background: "#fff",
                                cursor: "pointer",
                                fontWeight: "600",
                              }}
                            >
                              Pending
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === "candidates" && (
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e7e7ed", overflow: "hidden" }}>
            <div style={{ padding: "25px 30px", borderBottom: "1px solid #eee" }}>
              <h2 style={{ margin: 0 }}>Find Candidates</h2>
              <p style={{ margin: "7px 0 0", color: "#777" }}>
                Candidates who have applied to your posted jobs appear here.
              </p>
            </div>

            <div style={{ padding: "20px 30px" }}>
              {applicationsLoading && <p>Loading candidates...</p>}

              {!applicationsLoading && applications.length === 0 && (
                <p style={{ color: "#777" }}>
                  No candidates found yet. Post a job and wait for applications.
                </p>
              )}

              {!applicationsLoading && applications.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {applications.map((application) => (
                    <div
                      key={application._id}
                      style={{
                        border: "1px solid #e8e8ee",
                        borderRadius: "14px",
                        padding: "20px",
                      }}
                    >
                      <div style={{ fontSize: "34px", marginBottom: "10px" }}>👤</div>
                      <h3 style={{ margin: "0 0 6px" }}>
                        {application.candidate?.name || "Candidate"}
                      </h3>
                      <p style={{ margin: "4px 0", color: "#666" }}>
                        {application.candidate?.email || "Email not available"}
                      </p>
                      <p style={{ margin: "12px 0 4px", fontWeight: "600" }}>
                        Applied for: {application.job?.title || "Job"}
                      </p>
                      <p style={{ margin: 0, color: "#777" }}>
                        {application.job?.location || "Location not available"}
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "12px",
                          padding: "6px 10px",
                          borderRadius: "20px",
                          background: "#f1f1f1",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {application.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Auth({ register = false }) {

  const navigate = useNavigate();



  const [name, setName] =

    useState("");



  const [email, setEmail] =

    useState("");



  const [password, setPassword] =

    useState("");



  const [role, setRole] =

    useState("candidate");



  const [loading, setLoading] =

    useState(false);



  const [error, setError] =

    useState("");



  const handleSubmit = async (e) => {

    e.preventDefault();



    setError("");

    setLoading(true);



    try {

      const url = register

        ? "http\://localhost:5000/api/auth/register"

        : "http\://localhost:5000/api/auth/login";



      const body = register

        ? {

            name,

            email,

            password,

            role,

          }

        : {

            email,

            password,

          };



      const response = await fetch(url, {

        method: "POST",



        headers: {

          "Content-Type":

            "application/json",

        },



        body: JSON.stringify(body),

      });



      const data =

        await response.json();



      if (!response.ok) {

        setError(

          data.message ||

            "Something went wrong"

        );



        setLoading(false);

        return;

      }



      if (data.token) {

        localStorage.setItem(

          "token",

          data.token

        );

      }



      if (data.user) {

        localStorage.setItem(

          "user",

          JSON.stringify(data.user)

        );

      }



      alert(data.message);



      if (data.user?.role === "recruiter") {

        window.location.href = "/recruiter-dashboard";

      } else {

        window.location.href = "/candidate-dashboard";

      }



    } catch (error) {

      console.log(error);



      setError(

        "Unable to connect to server. Please make sure backend is running."

      );

    }



    setLoading(false);

  };



  return (

    <div className="auth-page">

      <div className="auth-card">



        <Link

          to="/"

          className="logo center"

        >

          <span className="logo-mark">

            H

          </span>



          Hire<span>Flow</span>

        </Link>



        <h1>

          {register

            ? "Create your account"

            : "Welcome back"}

        </h1>



        <p>

          {register

            ? "Start your next career chapter today."

            : "Sign in to continue to your dashboard."}

        </p>



        <form

          onSubmit={handleSubmit}

        >



          {register && (

            <>

              <input

                type="text"

                placeholder="Full name"

                value={name}

                onChange={(e) =>

                  setName(e.target.value)

                }

                required

              />



              <select

                value={role}

                onChange={(e) =>

                  setRole(e.target.value)

                }

                style={{

                  width: "100%",

                  padding: "14px",

                  marginBottom: "15px",

                  borderRadius: "8px",

                  border: "1px solid #ddd",

                }}

              >

                <option value="candidate">

                  Candidate

                </option>

                <option value="recruiter">

                  Recruiter

                </option>

              </select>

            </>

          )}



          <input

            type="email"

            placeholder="Email address"

            value={email}

            onChange={(e) =>

              setEmail(e.target.value)

            }

            required

          />



          <input

            type="password"

            placeholder="Password"

            value={password}

            onChange={(e) =>

              setPassword(e.target.value)

            }

            required

          />



          {error && (

            <p

              style={{

                color: "red",

                marginTop: "10px",

              }}

            >

              {error}

            </p>

          )}



          <button

            type="submit"

            className="primary full"

            disabled={loading}

          >

            {loading

              ? "Please wait..."

              : register

              ? "Create account"

              : "Sign in"}



            {!loading && (

              <ArrowRight size={17} />

            )}

          </button>



        </form>



        <div className="or">

          or continue with

        </div>



        <button className="social">

          Continue with Google

        </button>



        <p className="switch">

          {register

            ? "Already have an account? "

            : "Don't have an account? "}



          <Link

            to={

              register

                ? "/login"

                : "/register"

            }

          >

            {register

              ? "Sign in"

              : "Create one"}

          </Link>

        </p>



      </div>

    </div>

  );

}





/* =========================

   SIMPLE PAGES

========================= */



function Simple({

  title,

  children,

}) {

  return (

    <>

      <div className="simple">

        <div className="container">



          <span className="eyebrow dark">

            HIRE<span>FLOW</span>

          </span>



          <h1>{title}</h1>



          {children}



        </div>

      </div>



      <Footer />

    </>

  );

}





/* =========================

   FOOTER

========================= */



function Footer() {

  return (

    <footer>

      <div className="container footer-grid">



        <div>

          <Link

            to="/"

            className="logo"

          >

            <span className="logo-mark">

              H

            </span>



            Hire<span>Flow</span>

          </Link>



          <p>

            Connecting ambitious people

            with companies doing meaningful

            work.

          </p>

        </div>



        <div>

          <b>For candidates</b>



          <Link to="/jobs">

            Find jobs

          </Link>



          <Link to="/register">

            Create profile

          </Link>

        </div>



        <div>

          <b>For employers</b>



          <Link to="/register">

            Post a job

          </Link>



          <Link to="/register">

            Hire talent

          </Link>

        </div>



        <div>

          <b>Company</b>



          <Link to="/about">

            About us

          </Link>



          <Link to="/companies">

            Companies

          </Link>

        </div>



      </div>



      <div className="container copyright">

        © 2026 HireFlow. Built for the future of work.

      </div>

    </footer>

  );

}





/* =========================

   APP

========================= */



export default function App() {

  return (

    <>

      <Navbar />



      <Routes>



        <Route

          path="/"

          element={<Home />}

        />



        <Route

          path="/jobs"

          element={<Jobs />}

        />



        <Route

          path="/jobs/:id"

          element={<JobRoute />}

        />



        <Route

          path="/login"

          element={<Auth />}

        />



        <Route

          path="/register"

          element={<Auth register />}

        />



        <Route

          path="/candidate-dashboard"

          element={

            <CandidateDashboard />

          }

        />



        <Route

          path="/recruiter-dashboard"

          element={

            <RecruiterDashboard />

          }

        />



        <Route

          path="/about"

          element={

            <Simple

              title="A better way to find meaningful work"

            >

              <p>

                HireFlow is a modern recruitment

                platform designed to make hiring

                simpler, faster and more human.

              </p>

            </Simple>

          }

        />



        <Route

          path="/companies"

          element={

            <Simple title="Companies hiring now">

              <div className="company-list">



                {[

                  "TechNova",

                  "CloudPeak",

                  "PixelCraft",

                  "DataSphere",

                  "Northstar",

                  "Vertex Labs",

                ].map((x) => (

                  <div

                    className="company-row"

                    key={x}

                  >

                    <div className="company-icon">

                      {x[0]}

                    </div>



                    <b>{x}</b>



                    <span>

                      View open positions →

                    </span>

                  </div>

                ))}



              </div>

            </Simple>

          }

        />



      </Routes>

    </>

  );

}





function JobRoute() {

  const { pathname } =

    window.location;



  return (

    <JobDetails

      id={pathname.split("/").pop()}

    />

  );

}