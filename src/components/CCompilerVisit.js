import React, { useState, useRef } from "react";
import axios from "axios";
import { useCodeMirror } from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { solarizedDark } from "@uiw/codemirror-theme-solarized";
import ReactMarkdown from "react-markdown";

function CCompilerVisit() {
  const [cCode, setCCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [outputX, setOutputX] = useState("");

  const [error, setError] = useState("");
  const [inputRequired, setInputRequired] = useState(false);
  const [inputType, setInputType] = useState("");
  const [logOutput, setLogOutput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hii, I am ChatAI...! How can I help you?",
      isBot: true,
    },
  ]);
  const [clicked, setClicked] = useState(false);

  const cEditor = useRef(null);

  useCodeMirror({
    container: cEditor.current,
    value: cCode,
    theme: solarizedDark,
    extensions: [cpp(), solarizedDark],
    onChange: (value) => {
      setCCode(value);
      setLogOutput(`C: ${value}`);
    },
  });

  const doesCodeRequireInput = (code) => {
    return code.includes("Scanner") || code.includes("BufferedReader");
  };

  const compileCCode = async () => {
    setError("");
    setOutput("");

    if (doesCodeRequireInput(cCode) && input.trim() === "") {
      setInputType("string");
      setError("Please provide input for the code — expected string.");
      setInputRequired(true);
      return;
    }

    setLoading(true);
    setInputRequired(false);

    const postData = {
      language: "c",
      version: "10.2.0",
      files: [
        {
          name: "main.c",
          content: cCode,
        },
      ],
      stdin: input,
    };

    try {
      const res = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setOutput(
        cleanOutput(res.data.run.output || "No output from the server.")
      );
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setError(
        "Failed to compile Java code. Please check your code and try again."
      );
    }

    setLoading(false);
  };

  const cleanOutput = (output) => {
    return output.replace(/`/g, "").replace(/\*/g, "").trim();
  };

  const clearInput = () => {
    setInput("");
    setError("");
    setInputRequired(false);
  };

  const generateAns = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL, 

        // "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCok-7EJjFVuirqtP0Rzzpi5u-im4zvuYA",
        {
          contents: [{ parts: [{ text: logOutput }] }],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botResponse = cleanOutput(
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response received"
      );
      setMessages((prevMessages) => [
        { text: botResponse, isBot: true },
        ...prevMessages,
      ]);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setMessages((prevMessages) => [
        { text: "Failed to generate AI response.", isBot: true },
        ...prevMessages,
      ]);
      setError("Failed to generate AI response. Please try again.");
    }
    setLoading(false);
  };

  const generateAnsX = async (logOutput) => {
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL, 

        // "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCok-7EJjFVuirqtP0Rzzpi5u-im4zvuYA",
        {
          contents: [{ parts: [{ text: logOutput }] }],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botResponse =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received";
      setOutputX(botResponse); // Set AI response to output
    } catch (error) {
      console.error("Error:", error);
      setOutputX("Failed to generate AI response."); // Handle errors
    }
  };

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  };

  const [showOutput, setShowOutput] = useState(true);
  const [showAiAnswer, setShowAiAnswer] = useState(false);
  const [pos, setPos] = useState(""); // Add pos state here

  return (
    <div className="CompilerVisit">
      <h1 className="comH1V">C Compiler</h1>
      <div className="editor-containerV">
        <div className="inpOut">
          <div className="ele1">
            <br />
            <div className="row">
              <h3 className="compWri">Write Your C Code :</h3>

              <button
                onClick={() => {
                  compileCCode();
                  generateAnsX(logOutput); // Generate AI response on button click

                }}
                className="submit"
                style={{ border: "none" }}
              >
                <b>{loading ? "Compiling..." : "Compile and Run"}</b>
              </button>
            </div>
            <br />
            <div ref={cEditor} className="editor"></div>
          </div>

          <div className="ele2">
            <div className="iptDiv">
              <h3>
                <b>Input : </b>
              </h3>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter required input..."
                className="input-textarea"
                style={{
                  boxShadow: "none",
                  backgroundColor: "rgba(11, 11, 11, 0.7)",
                }}
              />
              <br />
              <button onClick={clearInput} className="clear-input-btn">
                Clear Input
              </button>
            </div>

            <div className="optDiv">
              {inputRequired && (
                <div className="input-message" style={{ color: "orange" }}>
                  Please provide input for the code — expected {inputType}.
                </div>
              )}
              <div className="oxxxx">
                <div className="fffff">
                  <button
                    style={{
                      marginTop: "0px",
                      textAlign: "center",
                    }}
                    onClick={() => {
                      setShowOutput(true);
                      setShowAiAnswer(false);
                      setPos("output");
                    }}
                  >
                    <b>Output :</b>
                  </button>

                  <div>
                    <button
                      className={pos === "outputX" ? "active" : ""}
                      // className={`pad hight textArea ${
                      //   pos === "outputX" ? "active" : ""
                      // }`}
                      onClick={() => {
                        setShowOutput(false);
                        setShowAiAnswer(true);
                        setPos("outputX");
                        // generateAnsX(logOutput); // Generate AI response on button click
                      }}
                    >
                      <b>AI Answer:</b>
                    </button>
                  </div>
                </div>
                {showOutput && (
                  <textarea
                    className="output"
                    value={output}
                    style={{
                      paddingLeft: "15px",
                      outline: "none",
                      padding: "10px",
                      resize: "none",
                      height: "340px",
                      width: "100%",
                    }}
                    disabled
                  />
                )}
                {showAiAnswer && (
                  <div
                    className={pos === "output" ? "output active" : "output"}
                    style={{
                      paddingLeft: "15px",
                      outline: "none",
                      padding: "10px",
                      resize: "none",
                      height: "340px",
                      width: "100%",
                    }}
                  >
                    <div
                      className="aiSolution"
                      style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor: "transparent",
                        resize: "none",
                        border: "none",
                        color: "rgb(245, 211, 124)",
                        overflowX: "auto", // Scroll if content overflows
                      }}
                      //value={outputX} // AI response displayed here
                      placeholder="Here , You will see the Solution of Error in the written code ..."
                      disabled
                    >
                      <ReactMarkdown>{outputX}</ReactMarkdown>{" "}
                      {/* Render AI response as Markdown */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h1 className="comH1V">Code with AI</h1>

      <div className="aiPageV" style={{ marginTop: "20px" }}>
        <div className="ele2">
          <button
            className={`colorChangeBtn ${clicked ? "clicked" : ""}`}
            onClick={() => {
              handleClick();
              generateAns();
            }}
          >
            <b>
              {loading ? "Generating AI Response..." : "Generate AI Response"}
            </b>
          </button>
          <br />
          <div className="ele22"></div>
        </div>

        <div
          className="ele1"
          style={{ border: "none", backgroundColor: "transparent" }}
        >
          <div
            className="user pad hight"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <textarea
              value={logOutput}
              className="textArea hight input"
              style={{
                width: "90%",
                marginLeft: "5%",
                height: "300px",
                outline: "none",
                resize: "none",
                border: "none",
                boxShadow: "0px 0px 100px black",
                borderRadius: "5px",
              }}
              placeholder="View your Code written in the editor , and feel free to ask any Questions related to it..."
              onChange={(e) => setLogOutput(e.target.value)}
            />
          </div>
          <br />

          {error && <div style={{ color: "red" }}>{error}</div>}

          {messages.map((message, i) => (
            <textarea
              key={i}
              className={`pad hight textArea ${
                message.isBot ? "aiAns" : "userAns"
              }`}
              style={
                message.text.includes(
                  "Hii, I am ChatAI...! How can I help you?"
                )
                  ? {
                      textAlign: "center",
                      fontFamily: "serif",
                      color: "green",
                      height: "auto",
                      borderRadius: "50px",
                      fontWeight: "bold",
                      paddingTop: "30px",
                      resize: "none",
                      backgroundColor: "black",
                    }
                  : { border: "2px solid black" }
              }
              value={message.text}
              disabled
            />
          ))}

          <br />
          <br />
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}

export default CCompilerVisit;
