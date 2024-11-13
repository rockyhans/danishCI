import React, { useState } from "react";
import logo from "../assets/srcP.jpg";
import UserImg from "../assets/userImg.jpg";
import "./Visit.css";
import JavaCompilerVisit from "./JavaCompilerVisit";
import CCompilerVisit from "./CCompilerVisit";
import PythonCompilerVisit from "./PythonCompilerVisit";
import CppCompilerVisit from "./CppCompilerVisit";
function Visit({ username }) {
  const [selectedCompiler, setSelectedCompiler] = useState("java");

  return (
    <>
      <div className="App1">
        <div className="blur">
          <header className="headerVisit">
            <img alt="logo" src={logo} className="logoImg" />
            
            <h1
              className="x"
              style={{ color: "orangered", marginLeft: "70px" }}
            >
              CodeAI
            </h1>
            <div className="userIV">
              <img alt="logo" src={UserImg} />
            </div>
          </header>
          <div className="ndNav">
            <div>
              <a href="/use" style={{textDecoration : 'none'}}>
                <h3>How to use this page.....?</h3>
              </a>
            </div>{" "}
            <div className="tab-buttons">
              <button
                className={selectedCompiler === "java" ? "active" : ""}
                onClick={() => setSelectedCompiler("java")}
              >
                <b>Java Compiler</b>
              </button>
              <button
                className={selectedCompiler === "c" ? "active" : ""}
                onClick={() => setSelectedCompiler("c")}
              >
                <b>C Compiler</b>
              </button>
              <button
                className={selectedCompiler === "cpp" ? "active" : ""}
                onClick={() => setSelectedCompiler("cpp")}
              >
                 <b>C++ Compiler</b>
              </button>
              <button
                className={selectedCompiler === "python" ? "active" : ""}
                onClick={() => setSelectedCompiler("python")}
              >
                <b>Python Compiler</b>
              </button>
            </div>
          </div>
        </div>

        <div className="compiler-container">
          <div
            className={
              selectedCompiler === "java" ? "compiler active" : "compiler"
            }
          >
            <JavaCompilerVisit />
          </div>
          <div
            className={
              selectedCompiler === "c" ? "compiler active" : "compiler"
            }
          >
            <CCompilerVisit />
          </div>
          <div
            className={
              selectedCompiler === "cpp" ? "compiler active" : "compiler"
            }
          >
            <CppCompilerVisit />
          </div>

          <div
            className={
              selectedCompiler === "python" ? "compiler active" : "compiler"
            }
          >
            <PythonCompilerVisit />
          </div>
        </div>
      </div>
    </>
  );
}

export default Visit;
