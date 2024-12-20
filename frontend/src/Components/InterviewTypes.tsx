import { Link, Navigate } from "react-router-dom";
export const InterviewTypes = () => {
  return(
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        margin: "40px",
        padding: "40px",
      }}
    >
      <div
        style={{
          boxShadow:
            " rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px ",
          width: "500px",
          padding: "40px",
        }}
      >
        <h1
          style={{ textAlign: "justify", fontWeight: "bold", fontSize: "40px" }}
        >
          FRONTEND
        </h1>
        <p style={{ textAlign: "justify" }}>
        A MERN (Java Script, React) interview evaluates a candidate's proficiency in full-stack web development, emphasizing both frontend and backend skills.
         It assesses their ability to use React and JavaScript to build dynamic and responsive user interfaces, alongside their expertise in MongoDB for data storage and Express.js with Node.js for server-side logic. 
         The interview typically focuses on coding skills, state management, API integration, and implementing best practices for building scalable and efficient web applications.
          This ensures readiness for comprehensive MERN stack development roles
        </p>
        {/* <div style={{ display: "flex", marginTop: "20px" }}>
          <img
            src="HTML.png"
            alt=""
            style={{ width: "40px", height: "40px" }}
          />
          <img
            src="Javascript.png"
            alt=""
            style={{ width: "40px", height: "40px" }}
          />
          <img
            src="React.png"
            alt=""
            style={{ width: "40px", height: "40px" }}
          />
          <img
            src="Node.png"
            alt=""
            style={{ width: "40px", height: "40px" }}
          />
        </div> */}
        <Link style={{textDecoration : "none"}} to={"/interview/mern?tectStack=mern"}>
          <button
            style={{
              display: "Block",
              backgroundColor: "#4CAF50",
              margin: "20px auto",
              color: " white",
              padding: "10px 20px",
              borderRadius: "5px",
              border : "solid lightgray 1px"
            }}
          >
            Start Interview
          </button>
        </Link>
      </div>
      {/* DSAaaaaaaaaa */}
      <div
        style={{
          boxShadow:
            " rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px ",
          width: "500px",
          padding: "40px",
        }}
      >
        <h1
          style={{ textAlign: "justify", fontWeight: "bold", fontSize: "40px"}}
        >
          BACKEND
        </h1>
        <p style={{ textAlign: "justify" }}>
        A backend technology interview focusing on Node.js, Express, and MongoDB evaluates a candidate's ability to build robust and scalable server-side applications.
         It tests their knowledge of the Node.js runtime, Express framework for building APIs, and MongoDB for database integration. Candidates are assessed on handling asynchronous programming, 
         designing RESTful APIs, and efficiently managing data operations. They are also evaluated on debugging, optimizing performance, and implementing best practices for secure backend development.
          This combination of skills is critical for modern web and application development roles.
        </p>

        {/* <p style={{ fontWeight: "bold" }}>Array | Matrix | Stack | Queue...</p> */}
        <Link style={{textDecoration : "none"}} to={"/interview/mern?tectStack=node"}>
          <button
            style={{
              display: "Block",
              backgroundColor: "#4CAF50",
              margin: "20px auto",
              color: " white",
              padding: "10px 20px",
              borderRadius: "5px",
              border : "solid lightgray 1px"
            }}
          >
            Start Interview
          </button>
        </Link>
      </div>
      {/* Simpleeeeeeeeeee */}
      
        
    </div>
  );
};
