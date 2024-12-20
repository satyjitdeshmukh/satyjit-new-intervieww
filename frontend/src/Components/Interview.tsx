import React, { useState, useEffect, useRef, useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import styled from "styled-components";
import Webcam from "react-webcam";
import { MdCopyAll } from "react-icons/md";
import { Loader } from "./Loader ";
import * as faceapi from "face-api.js";
import debounce from 'lodash.debounce';
import { saveAs } from "file-saver";
import { Groq } from "groq-sdk";
type QuestionType = {
  question: string;
  techStack: string;
};
export const Interview = () => {
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  const [text, setText] = useState("");
  const [isCopied, setCopied] = useClipboard(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFeed, setShowFeed] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [feedBack, setFeedBack] = useState<string>("");
  const videoRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const questions: QuestionType[] = [
    { question: "Can you explain React and what is its use ", techStack: "React" },
    { question: "How do you manage state in a Node.js application?", techStack: "Node.js" },
    { question: "How would you optimize the performance of a React application?", techStack: "React" },
    { question: "What are middleware functions in Express, and how are they used?", techStack: "Express" },
    { question: "How would you structure routes and controllers in an Express application?", techStack: "Express" },
    { question: "What are the differences between MongoDB and a relational database like MySQL?", techStack: "MongoDB" },
    { question: "How do you perform CRUD operations using MongoDB?", techStack: "MongoDB" },
    { question: "What is the difference between functional and class components in React?", techStack: "React" },
    { question: "Can you explain the concept of virtual DOM in React?", techStack: "React" },
    { question: "What are the best practices for designing RESTful APIs with Node.js and Express?", techStack: "Node.js" },
    { question: "How do you handle database relationships in MongoDB?", techStack: "MongoDB" },
    { question: "What is the purpose of using `useEffect` in React?", techStack: "React" },
    { question: "How can you handle errors globally in an Express application?", techStack: "Express" },
    { question: "What strategies do you use to secure a Node.js and Express application?", techStack: "Node.js" },
    { question: "How can you use Mongoose to model relationships in MongoDB?", techStack: "MongoDB" },
  ];
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      console.log("Models Loaded");
    };
    loadModels();
  }, []);
  

const handleExpressionDetection = useCallback(async () => {
  if (videoRef.current && videoRef.current.video) {
    const video = videoRef.current.video as HTMLVideoElement;

    // Ensure video dimensions are loaded
    console.log("Video dimensions:", video.videoWidth, video.videoHeight);
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video dimensions are not ready.");
      return "Video dimensions are not initialized.";
    }

    try {
      // Load face-api.js models
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");

      // Perform face detection
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const canvas = canvasRef.current;
      if (canvas) {
        const { videoWidth: width, videoHeight: height } = video;

        // Set canvas dimensions based on video
        canvas.width = width;
        canvas.height = height;

        console.log("Canvas dimensions:", canvas.width, canvas.height);

        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, width, height); // Clear previous drawings

          // Check for detections
          if (detections.length > 0) {
            const resizedDetections = faceapi.resizeResults(detections, {
              width,
              height,
            });

            // Draw face detections, landmarks, and expressions
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

            // Return face expressions
            const expressions = detections.map((detection: { expressions: any; }) => detection.expressions);
            return JSON.stringify(expressions, null, 2);
          } else {
            console.log("No faces detected.");
            return "No faces detected.";
          }
        } else {
          console.error("Failed to initialize canvas context.");
          return "Canvas context initialization failed.";
        }
      } else {
        console.error("Canvas element is not available.");
        return "Canvas is not available.";
      }
    } catch (error) {
      console.error("Error during face detection:", error);
      return "An error occurred during face detection.";
    }
  } else {
    console.error("Video element is not properly initialized.");
    return "Video element is not initialized.";
  }
}, []);
  // const generateAnswerFeedback = async (answer: string) => {
  //   setIsLoading(true);
  //   setFeedBack("");
  //   try {
  //     const genAI = new GoogleGenerativeAI('AIzaSyBY6A9WF1RFZemj6uFZ3LzeD1B2iOKjFCs');
  //     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  //     const prompt = `User's answer: ${answer}. [//answer is correct or not "${questions[currentIndex].question}"?]`;
  //     const result = await model.generateContent(prompt);
  //     const evaluation = await result.response.text();
  //     setFeedBack(evaluation);
  //   } catch (error) {
  //     console.error("Error generating feedback:", error);
  //     setFeedBack("An error occurred while generating feedback.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const generateAnswerFeedback = async (answer: string): Promise<void> => {
    setIsLoading(true);
    setFeedBack("");
    try {
      const groq = new Groq({
        apiKey: "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",
        dangerouslyAllowBrowser: true
      });
  
      const prompt = `User's answer: ${answer}. [//answer is correct or not plase provide answer in point form with udates and correct naswer on separate paregramph  "${questions[currentIndex].question}"?]`;

      const result = await groq.chat.completions.create({
        messages: [{ 
          role: "user", 
          content: prompt 
        }],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      });
      const evaluation = result.choices[0]?.message?.content;
      setFeedBack(evaluation || "No feedback generated.");
    } catch (error) {
      console.error("Error generating feedback:", error);
      setFeedBack("An error occurred while generating feedback.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const interval = setInterval(handleExpressionDetection, 1000);
    return () => clearInterval(interval);
  }, [handleExpressionDetection]);
  const start = () => {
    alert("Interview Started");
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };
  const handleClear = () => {
    resetTranscript();
  };
  const handleTurnoff = () => {
    SpeechRecognition.abortListening();
  };
  const handleNextQuestion = () => {
    setShowFeed(false);
    resetTranscript();
    setCurrentIndex((prev) => (prev === questions.length - 1 ? 0 : prev + 1));
    window.speechSynthesis.cancel();
  };
  const handlePrevious = () => {
    setShowFeed(false);
    setCurrentIndex((prev) => (prev === 0 ? questions.length - 1 : prev - 1));
    window.speechSynthesis.cancel();
  };
  const debouncedTranscript = useCallback(
    debounce((newTranscript: string) => {
      setText(newTranscript);
    }, 500),
    []
  );
  useEffect(() => {
    debouncedTranscript(transcript);
  }, [transcript, debouncedTranscript]);
  const speakFeedback = (feedbackText: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(feedbackText);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };
  const calculateConfidenceAlgorithm1 = (transcript: string, totalTime: number) => {
    const words = transcript.trim().split(/\s+/);
    const wordCount = words.length;
    const longWords = words.filter(word => word.length > 6).length;
    const englishProficiency = (longWords / wordCount) * 100;
    const wordsPerSecond = wordCount / totalTime;
    const speedScore = Math.min(100, (wordsPerSecond / 2) * 100);
    const fillerWords = ['um', 'uh', 'like', 'you know'];
    const hesitationCount = words.filter(word => fillerWords.includes(word.toLowerCase())).length;
    const hesitationPenalty = hesitationCount * 5;
    const avgWordLength = words.reduce((acc, word) => acc + word.length, 0) / wordCount;
    const wordLengthScore = Math.min(100, avgWordLength * 10);
    let timeTaken = transcript.length / 4;
    const timePenalty = Math.max(0, timeTaken - 60);
    let confidenceScore = Math.min(
      100,
      wordCount * 2 + englishProficiency + speedScore + wordLengthScore - hesitationPenalty - timePenalty
    );
    return Math.max(0, Number(confidenceScore.toFixed(2)));
  };
  const calculateConfidenceAlgorithm3 = (transcript: string, totalTime: number) => {
    const words = transcript.trim().split(/\s+/);
    const wordCount = words.length;
    const speedFactor = Math.min(100, (wordCount / totalTime) * 40);
    const fillerWords = ['um', 'uh', 'like', 'you know'];
    const hesitationCount = words.filter(word => fillerWords.includes(word.toLowerCase())).length;
    const hesitationPenalty = hesitationCount * 20;
    const longWords = words.filter(word => word.length > 6).length;
    const vocabularyRichness = (longWords / wordCount) * 100;
    let confidenceScore = Math.min(100, vocabularyRichness + speedFactor - hesitationPenalty);
    return Math.max(0, Number(confidenceScore.toFixed(2)));
  };
  const sentimentAnalysis = (transcript: string) => {
    const wordWeights: { [key: string]: number } = {
        good: 1, great: 2, excellent: 3, amazing: 3, positive: 2, happy: 1, success: 2,
        bad: -1, terrible: -3, poor: -2, sad: -1, failure: -3, negative: -2, unhappy: -1
    };
    const words = transcript.trim().split(/\s+/);
    let sentimentScore = 0;
    words.forEach(word => {
        const lowerCaseWord = word.toLowerCase();
        if (lowerCaseWord in wordWeights) {
            sentimentScore += wordWeights[lowerCaseWord];
        }
    });
    const maxPossibleScore = words.length;
    const minPossibleScore = -words.length;
    const normalizedScore = ((sentimentScore - minPossibleScore) / (maxPossibleScore - minPossibleScore)) * 100 - 100;

    return Math.max(-100, Math.min(100, normalizedScore));
};
const generateReport = async () => {
  // Get face data from detection
  const faceData = await handleExpressionDetection();

  // Time calculation
  const totalTime = transcript.length / 4;

  // Confidence scores using different algorithms
  const confidenceScore1 = calculateConfidenceAlgorithm1(transcript, totalTime);
  // const confidenceScore2 = calculateConfidenceAlgorithm2(transcript, totalTime);
  const confidenceScore3 = calculateConfidenceAlgorithm3(transcript, totalTime);

  // Sentiment analysis
  const sentimentScore = sentimentAnalysis(transcript);
  const sentimentFeedback = sentimentScore > 0 ? 'Positive' : (sentimentScore < 0 ? 'Negative' : 'Neutral');

  // Word count and long words
  const words = transcript.trim().split(/\s+/);
  const wordCount = words.length;
  const longWords = words.filter(word => word.length > 6).length;

  // Time taken and word metrics
  const timeTaken = totalTime.toFixed(2);
  const wordsPerSecond = (wordCount / totalTime).toFixed(2);
  const averageWordLength = (transcript.length / wordCount).toFixed(2);

  // Generate full report
  const fullReport = `
    Question: ${questions[currentIndex].question}
    Transcript: ${transcript}
    Feedback: ${feedBack}
    Face Analysis: ${faceData}
    - By Sentence Formation Confidence Score: ${confidenceScore3}%
    Sentiment Analysis: ${sentimentFeedback} (${sentimentScore})
    Report details:
    - Time taken for answer: ${timeTaken} seconds
    - Word count: ${wordCount}
    - Long words (more than 6 characters): ${longWords}
    - Words per second: ${wordsPerSecond}
    - Average word length: ${averageWordLength}
  `;

  // Create a text file and save
  const blob = new Blob([fullReport], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "interview_report.txt");

  alert("Report Generated and saved as interview_report.txt!");
};

if (!browserSupportsSpeechRecognition) {
    return null;
  }
  return (
    <div>
      <DIV>
        {showFeed ? (
          <div className="feedback-container">
            <div className="feedback">
              <div>
                <div className="student-answer">
                  <h1 className="student-answer-heading">Your Answer</h1>
                  <p>{transcript}</p>
                </div>
              </div>
              <div className="chat-feedback">
                {isLoading === false && (
                  <p className="feedback-heading">Feedback</p>
                )}
                {isLoading ? (
                  <div className="loader">
                    <Loader />
                  </div>
                ) : (
                  <p className="feedback-text">{feedBack}</p>
                )}
              </div>
            </div>
            {isLoading ? null : (
              <div className="next-prev-container">
                <button
                  disabled={isLoading}
                  className="next-Question-btn"
                  onClick={handlePrevious}
                >
                  Previous Question
                </button>
                <button
                  className="next-Question-btn"
                  onClick={handleNextQuestion}
                  disabled={isLoading}
                >
                  Next Question
                </button>
              </div>
            )}
            <div className="voice-btn-container">
              <button
                className="btn voice"
                onClick={() => speakFeedback(feedBack)}
              >
                Answer in Voice Format
              </button>
            </div>
            <div className="generate-report-container">
              <button
                className="btn generate-report"
                onClick={generateReport}
              >
                Generate and Download Report
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="question-and-cam-container">
              <div className="question-container">
                <h1>Question {currentIndex + 1}</h1>
                <p className="question">
                  {currentIndex + 1}.{" "}
                  {questions.length !== 0 && questions[currentIndex].question}
                </p>
              </div>
              <div className="cam-container">
                <Webcam ref={videoRef} height="260px" />
                <canvas ref={canvasRef} />
              </div>
            </div>
            <div className="transcript-container">
              <div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                />
                <div className="transcript-btns">
                  <button onClick={setCopied}>
                    Copy <MdCopyAll />
                  </button>
                  <button onClick={handleClear}>Clear</button>
                </div>
              </div>
              <div className="action-buttons">
                <button className="start-btn" onClick={start}>
                  Start Interview
                </button>
                <button className="btn stop" onClick={handleTurnoff}>
                  Stop Listening
                </button>
                <button
                  className="btn submit"
                  onClick={() => {
                    setShowFeed(true);
                    generateAnswerFeedback(transcript);
                  }}
                >
                  Submit & Generate Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </DIV>
    </div>
  );
};

const DIV = styled.div`
  text-align: center;
  background: linear-gradient(180deg, #282c34 0%, #1c1e22 100%);
  min-height: 100vh;
  font-size: calc(10px + 2vmin);
  color: white;
  padding: 20px;
  .question {
    color: white;
    font-size: 22px;
  }
  .feedback-text {
    color: white;
    padding: 15px;
    font-size: 22px;
    margin: 10px 20px;
  }
  .btn {
    background-color: green;
    font-size: 22px;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-right: 10px;
    border-radius: 5px;
    padding: 6px 30px;
    font-weight: bold;
    cursor: pointer;
    color: white;
  }
  .stop {
    background-color: red;
  }
  .feedback-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .next-Question-btn {
    background-color: transparent;
    font-size: 22px;
    font-weight: bold;
    cursor: pointer;
    color: white;
  }
  textarea {
    font-size: 16px;
    padding: 15px;
    width: 300px;
    border-radius: 8px;
    margin-top: 20px;
  }
  .transcript-btns {
    display: flex;
    justify-content: space-evenly;
    margin-top: 15px;
  }
  .transcript-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .question-container {
    padding: 20px;
  }
  .cam-container {
    width: fit-content;
  }
  .generate-report {
    background-color: darkblue;
  }
  .student-answer {
    font-size: 22px;
    color: yellow;
    margin-top: 20px;
  }
  .student-answer-heading {
    color: white;
    font-size: 28px;
  }
`;
