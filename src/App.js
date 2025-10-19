import React, { useRef, useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";

// Sparkle component for decorative animation
const Sparkle = ({ style }) => (
  <div
    style={{
      position: "absolute",
      width: "6px",
      height: "6px",
      background: "#d4af37",
      borderRadius: "50%",
      animation: "sparkle 2s infinite",
      ...style,
    }}
  />
);

const App = () => {
  const images = [
    "0.jpg",
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpeg",
    "5.jpeg",
    "6.jpeg",
    "7.jpeg",
    "8.jpeg",
    "9.jpg",
  ];

  const bookRef = useRef();
  const [bookSize, setBookSize] = useState({ width: 800, height: 600 });
  const [showAlbum, setShowAlbum] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const aspectRatio = 4 / 3;
      let width, height;

      if (screenWidth < 600) {
        width = screenWidth * 0.9;
        height = width / aspectRatio;
      } else if (screenWidth < 1024) {
        width = screenWidth * 0.8;
        height = width / aspectRatio;
      } else {
        height = screenHeight * 0.75;
        width = height * aspectRatio;
      }

      setBookSize({ width, height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!showAlbum) {
    return (
      <div style={styles.introContainer}>
        <div style={styles.introCard} className="introCard">
          <h1 style={styles.coupleNames}>💍 Tamil & Jeya 💍</h1>
          <p style={styles.details}>Date: 20 December 2025</p>
          <p style={styles.details}>Venue: Le Royal Wedding Hall, Chennai</p>
          <button
            style={styles.startButton}
            onClick={() => setShowAlbum(true)}
            className="startButton"
          >
            Open Wedding Album 📖
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.albumContainer}>
      <HTMLFlipBook
        width={bookSize.width}
        height={bookSize.height}
        showCover={true}
        useMouseEvents={true}
        mobileScrollSupport={true}
        ref={bookRef}
        style={styles.book}
        flippingTime={900}
        maxShadowOpacity={0.5}
        size="stretch"
      >
        {/* Pages */}
        {images.map((img, index) => {
          let justify = "center";
          if (index % 2 === 0) justify = "flex-end";
          if (index % 2 === 1) justify = "flex-start";
          if (index === 0) justify = "center";

          return (
            <div
              key={index}
              className="page"
              style={{ ...styles.photoPage, justifyContent: justify }}
            >
              <div style={styles.photoFrame}>
                <img
                  src={`/album/${img}`}
                  alt={`Page ${index + 1}`}
                  style={styles.photoImage}
                />
              </div>

              {/* Add a few sparkles */}
              <Sparkle style={{ top: "10%", left: "20%" }} />
              <Sparkle style={{ top: "70%", left: "50%" }} />
              <Sparkle style={{ top: "40%", left: "80%" }} />
            </div>
          );
        })}
      </HTMLFlipBook>

      {/* Sparkle animation keyframes */}
      <style>
        {`
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1); }
          }
          .introCard {
            transform: scale(0.9);
            opacity: 0;
            animation: fadeInScale 0.8s forwards;
          }
          @keyframes fadeInScale {
            to { transform: scale(1); opacity: 1; }
          }
          .startButton:hover {
            box-shadow: 0 0 20px #d4af37, 0 0 40px #d4af37, 0 0 60px #d4af37;
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
};

// Color palette
const red = "#800000";
const darkRed = "#4b0000";
const gold = "#d4af37";
const goldShadow = "rgba(212, 175, 55, 0.4)";

const styles = {
  introContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    background: `url('/album/background.jpg') center/cover no-repeat`,
    backgroundBlendMode: "overlay",
    backdropFilter: "blur(3px)",
  },
  introCard: {
    backgroundColor: "rgba(198, 241, 58, 0.1)",
    backdropFilter: "blur(15px)",
    borderRadius: "25px",
    padding: "40px 30px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
    maxWidth: "400px",
    width: "90%",
    color: "#fff",
    border: `2px solid ${gold}`,
    transition: "transform 0.3s",
  },
  coupleNames: {
    fontSize: "2.2rem",
    marginBottom: "20px",
    fontFamily: "'Playfair Display', serif",
    fontWeight: "700",
        color:"#4b0000",

    textShadow: "2px 2px 8px rgba(255, 255, 255, 0.5)",
  },
  details: {
    fontSize: "1.1rem",
    margin: "10px 0",
    fontFamily: "'Roboto', sans-serif",
    color:"#800000",
  },
  startButton: {
    marginTop: "25px",
    padding: "12px 25px",
    fontSize: "1rem",
    fontWeight: "600",
    color: red,
    backgroundColor: gold,
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    transition: "all 0.3s",
  },
  albumContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${red}, ${darkRed})`,
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  book: {
    margin: "auto",
    borderRadius: "12px",
    boxShadow: `0 12px 35px ${goldShadow}`,
  },
  photoPage: {
    background: `linear-gradient(145deg, ${red}, ${darkRed})`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  photoFrame: {
    border: `5px solid ${gold}`,
    padding: "5px",
    borderRadius: "15px",
    boxShadow: `0 0 20px ${goldShadow}`,
    maxWidth: "95%",
    maxHeight: "95%",
  },
  photoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px",
  },
};

export default App;
