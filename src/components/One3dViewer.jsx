import React, {useEffect, useState, useRef} from "react";
import "../styles/One3dViewer.css";
import CustomLoader from "./CustomLoader";
import FullScreenEnable from "./FullscreenEnable";

const One3DViewer = () => {
  const [carColorCode, setCarColorCode] = useState("RedCrystalMetallic");
  const [interiorToggled, setInteriorToggled] = useState(false);
  const [modelData, setModelData] = useState(null);
  const [seatToggled, setSeatToggled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  var options = {
    onEventClicked: (message) => {
      setModelData(message);
      if (message.message === "Interior View Start") {
        setInteriorToggled(true);
      } else if (message.message === "Exterior View Start") {
        setInteriorToggled(false);
      }
    },
    onEventComplete: (message) => {
      console.log(message);
    },
  };

  useEffect(() => {
    setIsLoading(true);

    const interval = setInterval(() => {
      let modelProgress = ONE3D.loadedPercent;

      setProgress((prevProgress) => {
        let randomIncreament = prevProgress + Math.floor(Math.random() * 25);
        let newProgress = randomIncreament + prevProgress;
        if (newProgress > modelProgress) {
          return modelProgress; //AT EACH STEP IN THE RANDOM INCREAMENT IF THE NEWPRO EXCEEDS THE ACTUAL PROGRESS
        }
        return newProgress;
      });
    }, 100);

    ONE3D.init(
      "one3d",
      "https://ee-deploy-website.s3.amazonaws.com/ee_suv/one3d/",
      "SUV",
      "SUV",
      {
        showDefaultLoader: false,
        color: "RedCrystalMetallic",
      }
    )
      .then((successData) => {
        ONE3D.registerClickAction(options);
        setIsLoading(false);
        clearInterval(interval);
      })
      .catch((error) => {
        console.log(error);
      });

    // window.addEventListener("resize", function () {
    //   ONE3D.resizeWindow;
    // });
    return () => {
      clearInterval(interval);
      // window.removeEventListener("resize", function () {
      //   ONE3D.resizeWindow; // this method is not available to the global var ONE3d
      // });
    };
  }, []);

  const handleExteriorView = () => {
    ONE3D.exteriorView()
      .then((success) => {
        console.log("On Success:", success);
        setInteriorToggled(!interiorToggled);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInteriorView = () => {
    ONE3D.interiorView()
      .then((success) => {
        setInteriorToggled(!interiorToggled);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFrontSeat = () => {
    ONE3D.frontseatView()
      .then((success) => {
        console.log("On Success:", success);
        setSeatToggled(!seatToggled);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBackSeat = () => {
    ONE3D.lastseatView()
      .then((success) => {
        console.log("On Success:", success);
        setSeatToggled(!seatToggled);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  const cars = [
    {id: 1, label: "Red Crystal", value: "RedCrystalMetallic"},
    {id: 2, label: "Blue Crystal", value: "CrystalBlue"},
    {id: 3, label: "Gray Metallic", value: "GrayMetallic"},
    {id: 4, label: "Snowflex White", value: "Snowflexwhite"},
    {id: 5, label: "Silver Metallic", value: "SilverMetallic"},
    {id: 6, label: "Jet Black", value: "JetBlack"},
  ];

  const buttonStyles = {
    backgroundColor: "#e81b09",
    paddingTop: "4.5pt",
    paddingBottom: "4.5pt",
    paddingLeft: "15px",
    paddingRight: "15px",
    fontSize: "15px",
    borderWidth: ".010416667in",
    fontWeight: 700,
    margin: "3.75pt",
    cursor: "pointer",
    border: "1px solid black",
    color: "#fff",
  };

  const leftSectionStyles = {
    position: "absolute",
    left: "20px",
    bottom: "10px",
    gap: "5px",
  };

  const rightSectionStyles = {
    position: "absolute",
    right: "15pt",
    bottom: "7.5pt",
    padding: "12px",
  };
  return (
    <div>
      {isLoading && (
        <div id="LoaderText1" className="loader">{`${progress}%`}</div>
      )}
      <div id="one3d"></div>
      <div style={{...leftSectionStyles, display: isLoading ? "none" : "flex"}}>
        <button
          onClick={interiorToggled ? handleExteriorView : handleInteriorView}
          style={buttonStyles}>
          {interiorToggled ? "Exterior" : "Interior"}
        </button>

        <button
          onClick={seatToggled ? handleFrontSeat : handleBackSeat}
          style={{
            ...buttonStyles,
            display: interiorToggled ? "block" : "none",
          }}>
          {seatToggled ? "FrontSeat" : "BackSeat"}
        </button>
      </div>

      <div
        style={{...rightSectionStyles, display: isLoading ? "none" : "flex"}}>
        <select
          value={carColorCode}
          onChange={(e) => {
            setCarColorCode(e.target.value);
            ONE3D.changeColor(e.target.value);
          }}
          className="colors">
          {cars.map((car) => (
            <option key={car.id} value={car.value}>
              {car.label}
            </option>
          ))}
        </select>
      </div>
      <FullScreenEnable />
    </div>
  );
};

export default One3DViewer;
