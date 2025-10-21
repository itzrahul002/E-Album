import React, { useRef, useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const Sparkle = ({ style }) => (
  <div
    style={{
      position: "absolute",
      width: "8px",
      height: "8px",
      background: "#d4af37",
      borderRadius: "50%",
      animation: "sparkle 2s infinite",
      pointerEvents: "none",
      ...style,
    }}
  />
);

const ToolbarButton = ({ children, onClick, title }) => (
  <button onClick={onClick} title={title} style={toolbarStyles.button}>
    {children}
  </button>
);

export default function FlipFlickAlbum() {
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

  const bookRef = useRef(null);
  const [bookSize, setBookSize] = useState({ width: 900, height: 650 });
  const [showAlbum, setShowAlbum] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
const [pagesPerSheet, setPagesPerSheet] = useState(1);

  // Responsive resizing
  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const aspectRatio = 4 / 3;
      let width, height;

      if (screenWidth < 420) {
        width = screenWidth * 0.94;
        height = screenHeight * 0.6;
      } else if (screenWidth < 768) {
        width = screenWidth * 0.85;
        height = screenHeight * 0.7;
      } else {
        height = Math.min(screenHeight * 0.8, 780);
        width = height * aspectRatio;
      }

      setBookSize({ width: Math.round(width), height: Math.round(height) });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Orientation change support
 useEffect(() => {
  const handleOrientationChange = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const aspectRatio = 4 / 3;
    let width, height;

    if (screenWidth < 420) {
      width = screenWidth * 0.94;
      height = screenHeight * 0.6;
    } else if (screenWidth < 768) {
      width = screenWidth * 0.85;
      height = screenHeight * 0.7;
    } else {
      height = Math.min(screenHeight * 0.8, 780);
      width = height * aspectRatio;
    }

    setBookSize({ width: Math.round(width), height: Math.round(height) });
  };

  window.addEventListener("orientationchange", handleOrientationChange);
  return () =>
    window.removeEventListener("orientationchange", handleOrientationChange);
}, []);


  // Prompt for rotate
  useEffect(() => {
    if (window.innerHeight > window.innerWidth) {
      setTimeout(() => {
        alert("📱 Rotate your phone for best album experience 🌸");
      }, 500);
    }
  }, []);

  useEffect(() => {
  const updatePagesPerSheet = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 768) {
      setPagesPerSheet(2); // landscape tablet/desktop
    } else {
      setPagesPerSheet(2); // mobile single page
    }
  };
  updatePagesPerSheet();
  window.addEventListener("resize", updatePagesPerSheet);
  return () => window.removeEventListener("resize", updatePagesPerSheet);
}, []);

  // Preload images
  useEffect(() => {
    images.forEach((name) => {
      const img = new Image();
      img.src = `/album/${name}`;
    });
  }, []);

  const goToNext = () => {
    try {
      bookRef.current.pageFlip().flipNext();
      setTimeout(syncPage, 350);
    } catch (e) {}
  };

  const goToPrev = () => {
    try {
      bookRef.current.pageFlip().flipPrev();
      setTimeout(syncPage, 350);
    } catch (e) {}
  };

  const syncPage = () => {
    try {
      const pf = bookRef.current.pageFlip();
      const page = pf.getCurrentPageIndex();
      setCurrentPage(page);
    } catch (e) {}
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn("Fullscreen unsupported or blocked", e);
    }
  };

  const openAlbum = () => {
    setShowAlbum(true);
    setTimeout(() => setIsLoaded(true), 700);
    setIsMusicOn(true);
  };

  // Add swipe gesture for mobile
  useEffect(() => {
    let startX = 0;
    let endX = 0;

    const handleTouchStart = (e) => (startX = e.touches[0].clientX);
    const handleTouchEnd = (e) => {
      endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) goToNext(); // swipe left
      if (endX - startX > 50) goToPrev(); // swipe right
    };

    const flipElement = document.querySelector(".flip-book-container");
    if (flipElement) {
      flipElement.addEventListener("touchstart", handleTouchStart);
      flipElement.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (flipElement) {
        flipElement.removeEventListener("touchstart", handleTouchStart);
        flipElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  // Render pages
  const renderPages = () =>
    images.map((img, index) => {
      const isCover = index === 0;
      const isLast = index === images.length - 1;

      return (
        <div
          key={index}
          className="page"
          style={{
            ...styles.photoPage,
            background:
              isCover || isLast
                ? `radial-gradient(circle at center, #3b0000, #1a0000)`
                : `linear-gradient(145deg, ${red}, ${darkRed})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              ...styles.photoFrame,
              border: isCover || isLast ? `6px solid ${gold}` : `4px solid ${gold}`,
              boxShadow: `0 0 35px ${goldShadow}`,
              maxWidth: isCover || isLast ? "80%" : "90%",
              maxHeight: isCover || isLast ? "90%" : "95%",
            }}
          >
            <img
              src={`/album/${img}`}
              alt={`Page ${index + 1}`}
              style={{
                ...styles.photoImage,
                objectFit: "cover",
              }}
              onClick={(e) => {
                if (isCover) return goToNext();
                const half = e.nativeEvent.offsetX < e.target.clientWidth / 2;
                half ? goToPrev() : goToNext();
              }}
            />
          </div>

          {!isCover && !isLast && (
            <>
              <Sparkle style={{ top: "8%", left: "16%" }} />
              <Sparkle style={{ top: "72%", left: "50%" }} />
              <Sparkle style={{ top: "42%", left: "84%" }} />
            </>
          )}
        </div>
      );
    });

  return (
    <div style={styles.appRoot}>
      {!showAlbum ? (
        <div style={styles.introContainer}>
          <div
            style={{
              ...styles.introCard,
              ...(isLoaded ? styles.introCardLoaded : {}),
            }}
          >
            <h1 style={styles.coupleNames}>💍 Tamil & Jeya 💍</h1>
            <p style={styles.details}>Date: 20 December 2025</p>
            <p style={styles.details}>Venue: Le Royal Wedding Hall, Chennai</p>
            <div style={{ marginTop: 20 }}>
              <button style={styles.startButton} onClick={openAlbum}>
                Open Wedding Album 📖
              </button>
            </div>
            <p
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Tip: tap or swipe to flip pages.
            </p>
          </div>
        </div>
      ) : (
        <div style={styles.albumContainer}>
          <div style={toolbarStyles.toolbar}>
            <ToolbarButton onClick={goToPrev} title="Previous">
              ⬅️
            </ToolbarButton>

            <div style={toolbarStyles.centerGroup}>
              <span style={toolbarStyles.pageText}>
                {currentPage + 1} / {Math.max(1, images.length)}
              </span>
            </div>

            <ToolbarButton onClick={goToNext} title="Next">
              ➡️
            </ToolbarButton>

            <ToolbarButton
              onClick={() => setIsMusicOn((v) => !v)}
              title={isMusicOn ? "Turn music off" : "Turn music on"}
            >
              {isMusicOn ? "🔊" : "🔇"}
            </ToolbarButton>

            <ToolbarButton onClick={toggleFullscreen} title="Fullscreen">
              {isFullscreen ? "🡽" : "⛶"}
            </ToolbarButton>

            <ToolbarButton
              onClick={() => {
                try {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Album link copied to clipboard");
                } catch (e) {
                  alert("Copy failed — use browser share instead");
                }
              }}
              title="Copy link"
            >
              🔗
            </ToolbarButton>
          </div>

          <div
            className="flip-book-container"
            style={{
              ...styles.bookWrap,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <HTMLFlipBook
              width={bookSize.width}
              height={bookSize.height}
              showCover={true}
              useMouseEvents={false}
              mobileScrollSupport={true}
              ref={bookRef}
              style={styles.book}
              flippingTime={700}
              maxShadowOpacity={0.45}
              onFlip={() => setTimeout(syncPage, 50)}
              onChangeOrientation={() => setTimeout(syncPage, 50)}
              onChangeState={() => setTimeout(syncPage, 50)}
              pagesPerSheet={pagesPerSheet}
            >
              {renderPages()}
            </HTMLFlipBook>
          </div>

          <audio
            src="/music.mpeg"
            autoPlay
            loop
            muted={!isMusicOn}
            style={{ display: "none" }}
          />

          <Sparkle style={{ top: "6%", left: "8%", width: 10, height: 10 }} />
          <Sparkle style={{ top: "20%", left: "86%", width: 6, height: 6 }} />
          <Sparkle style={{ top: "86%", left: "12%", width: 6, height: 6 }} />
        </div>
      )}

      <style>{`
        @keyframes sparkle {
          0%,100% { opacity: 0; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bgShift {
          0%,100% { background-position: left center; }
          50% { background-position: right center; }
        }

        @media (max-width: 768px) {
          .page img {
            border-radius: 8px !important;
          }
          button {
            font-size: 14px !important;
          }
        }

        @media (max-width: 768px) {
  .flip-book-container {
    transform: scale(0.95);
  }
  .page img {
    border-radius: 8px !important;
  }
}
@media (orientation: portrait) {
  .flip-book-container {
    transform: scale(0.92);
  }
}

        @media (orientation: portrait) {
          .page {
            padding: 8px !important;
          }
          .flip-book-container {
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}

// color palette
const red = "#800000";
const darkRed = "#4b0000";
const gold = "#d4af37";
const goldShadow = "rgba(212, 175, 55, 0.28)";

const styles = {
  appRoot: {
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: `linear-gradient(120deg, ${red}, ${darkRed}, #2b0000)`,
    backgroundSize: "300% 300%",
    animation: "bgShift 12s ease infinite",
    position: "relative",
    overflow: "hidden",
  },
  introContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    background: `url('/album/background-intro.jpg') center/cover no-repeat`,
    backgroundBlendMode: "overlay",
    backdropFilter: "blur(2px)",
  },
  introCard: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: "18px",
    padding: "36px 28px",
    textAlign: "center",
    boxShadow: "0 10px 35px rgba(0,0,0,0.6)",
    maxWidth: "440px",
    width: "92%",
    color: "#fff",
    border: `2px solid ${gold}`,
    transform: "translateY(0)",
    transition: "all 0.35s",
  },
  introCardLoaded: {
    animation: "fadeInScale 0.8s forwards",
  },
  coupleNames: {
    fontSize: "2.2rem",
    marginBottom: "12px",
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    color: "#fff",
    textShadow: "2px 2px 10px rgba(0,0,0,0.6)",
  },
  details: {
    fontSize: "1rem",
    margin: "6px 0",
    fontFamily: "'Roboto', sans-serif",
    color: "rgba(255,255,255,0.92)",
  },
  startButton: {
    marginTop: "18px",
    padding: "12px 22px",
    fontSize: "1rem",
    fontWeight: 600,
    color: red,
    backgroundColor: gold,
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(0,0,0,0.38)",
    transition: "all 0.25s",
  },
  albumContainer: {
    minHeight: "100vh",
    paddingTop: 52,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    background: "linear-gradient(135deg, #1a0000, #330000)",
    backgroundImage: "url('/album/background.jpg')",
    backgroundSize: "cover",
    backgroundBlendMode: "overlay",
  },
  bookWrap: { padding: 12 },
  book: {
    borderRadius: 12,
    boxShadow: `0 18px 45px ${goldShadow}`,
  },
  photoPage: {
    background: `linear-gradient(145deg, ${red}, ${darkRed})`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: 18,
  },
  photoFrame: {
    border: `5px solid ${gold}`,
    padding: 6,
    borderRadius: 14,
    boxShadow: `0 0 24px ${goldShadow}`,
    maxWidth: "92%",
    maxHeight: "92%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  photoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 10,
    cursor: "pointer",
    display: "block",
  },
};

const toolbarStyles = {
  toolbar: {
    position: "fixed",
    top: 8,
    left: 0,
    right: 0,
    margin: "0 auto",
    maxWidth: "95%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 60,
    padding: "6px 10px",
    backdropFilter: "blur(6px)",
    background: "rgba(0,0,0,0.25)",
    borderRadius: 999,
    boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
    flexWrap: "wrap",
    
  },
  button: {
    background: "transparent",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    fontSize: "clamp(12px, 2.5vw, 16px)",
    cursor: "pointer",
    borderRadius: 10,
    transition: "all 0.18s",
  },
  centerGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 12px",
    gap: 8,
  },
  pageText: {
    color: "#fff",
    fontWeight: 700,
    letterSpacing: "0.4px",
  },
};
