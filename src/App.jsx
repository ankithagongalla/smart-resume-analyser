import { useState } from "react";

import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import CareerTarget from "./pages/CareerTarget";

import ResumeUpload from "./pages/ResumeUpload";
import Processing from "./pages/Processing";
import ResumeExtraction from "./pages/ResumeExtraction";
import SkillGapAnalysis from "./pages/SkillGapAnalysis";
import Roadmap from "./Roadmap";

function App() {
  // ==================================================
  // CURRENT PAGE
  // ==================================================

  const [currentPage, setCurrentPage] = useState("auth");

  // ==================================================
  // STUDENT DATA
  // ==================================================

  const [studentProfile, setStudentProfile] = useState(null);

  // ==================================================
  // CAREER DATA
  // ==================================================
  //
  // careerTarget = career display name
  // careerCode   = O*NET SOC code
  // careerDbId   = numeric database ID, if available
  // selectedCareer = complete selected career object
  //

  const [careerTarget, setCareerTarget] = useState("");
  const [careerCode, setCareerCode] = useState("");
  const [careerDbId, setCareerDbId] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);

  // ==================================================
  // RESUME DATA
  // ==================================================

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  // ==================================================
  // SKILL GAP DATA
  // ==================================================

  const [skillGapData, setSkillGapData] = useState(null);

  // ==================================================
  // AUTH
  // ==================================================

  const handleAuthContinue = () => {
    setCurrentPage("profile");
  };

  // ==================================================
  // PROFILE
  // ==================================================

  const handleProfileContinue = (profile) => {
    console.log("Student profile:", profile);

    setStudentProfile(profile);

    setCurrentPage("career-target");
  };

  // ==================================================
  // CAREER TARGET
  // ==================================================

  const handleCareerContinue = (career) => {
    console.log("Selected career:", career);

    if (!career) {
      return;
    }

    // ==================================================
    // IF CAREER IS JUST A STRING
    // ==================================================

    if (typeof career === "string") {
      setCareerTarget(career);
      setCareerCode("");
      setCareerDbId(null);

      setSelectedCareer({
        name: career,
        title: career,
        code: "",
        id: null,
        domain: "",
      });

      console.log("Career name:", career);
      console.log("Career code:", "");
      console.log("Career DB ID:", null);

      setCurrentPage("upload");
      return;
    }

    // ==================================================
    // GET CAREER NAME
    // ==================================================

    const careerName =
      career.name ||
      career.title ||
      career.label ||
      "";

    // ==================================================
    // GET O*NET SOC CODE
    // ==================================================

    const careerCode =
      career.code ||
      career.onet_soc_code ||
      "";

    // ==================================================
    // GET DATABASE ID
    // ==================================================
    //
    // IMPORTANT:
    // O*NET codes such as 17-2141.00 are NOT database IDs.
    // Only a purely numeric value is accepted as DB ID.
    //

    const careerDbId =
      /^\d+$/.test(String(career.id || ""))
        ? Number(career.id)
        : null;

    console.log("Career name:", careerName);
    console.log("Career code:", careerCode);
    console.log("Career DB ID:", careerDbId);

    // ==================================================
    // STORE CAREER INFORMATION SEPARATELY
    // ==================================================

    setCareerTarget(careerName);
    setCareerCode(careerCode);
    setCareerDbId(careerDbId);

    setSelectedCareer({
      ...career,
      name: careerName,
      title: careerName,
      code: careerCode,
      id: careerDbId,
    });

    // ==================================================
    // MOVE TO RESUME UPLOAD
    // ==================================================

    setCurrentPage("upload");
  };

  // ==================================================
  // RESUME UPLOAD
  // ==================================================

  const handleResumeSelected = (
    file,
    continueToProcessing = false
  ) => {
    if (!file) {
      setResumeFile(null);
      return;
    }

    console.log("SELECTED RESUME:", file);

    setResumeFile(file);

    if (continueToProcessing) {
      setCurrentPage("processing");
    }
  };

  // ==================================================
  // RESUME PROCESSING
  // ==================================================

  const handleProcessingComplete = (data) => {
    console.log(
      "RESUME EXTRACTION RESULT:",
      data
    );

    setResumeData(data);

    setCurrentPage("extraction");
  };

  // ==================================================
  // RESUME EXTRACTION
  // ==================================================

  const handleExtractionContinue = (data) => {
    console.log(
      "CONFIRMED RESUME DATA:",
      data
    );

    setResumeData(data);

    setCurrentPage("skill-gap");
  };

  // ==================================================
  // SKILL GAP
  // ==================================================

  const handleSkillGapContinue = (data) => {
    console.log(
      "SKILL GAP RESULT:",
      data
    );

    if (!data) {
      return;
    }

    if (data.success === false) {
      return;
    }

    setSkillGapData(data);

    setCurrentPage("roadmap");
  };

  // ==================================================
  // BACK NAVIGATION
  // ==================================================

  const goToAuth = () => {
    setCurrentPage("auth");
  };

  const goToProfile = () => {
    setCurrentPage("profile");
  };

  const goToCareerTarget = () => {
    setCurrentPage("career-target");
  };

  const goToUpload = () => {
    setCurrentPage("upload");
  };

  const goToProcessing = () => {
    setCurrentPage("processing");
  };

  const goToExtraction = () => {
    setCurrentPage("extraction");
  };

  const goToSkillGap = () => {
    setCurrentPage("skill-gap");
  };

  // ==================================================
  // AUTH PAGE
  // ==================================================

  if (currentPage === "auth") {
    return (
      <Auth
        onBack={() => {}}
        onContinue={handleAuthContinue}
      />
    );
  }

  // ==================================================
  // PROFILE PAGE
  // ==================================================

  if (currentPage === "profile") {
    return (
      <Profile
        onBack={goToAuth}
        onContinue={handleProfileContinue}
      />
    );
  }

  // ==================================================
  // CAREER TARGET PAGE
  // ==================================================

  if (currentPage === "career-target") {
    return (
      <CareerTarget
        onBack={goToProfile}
        onContinue={handleCareerContinue}
      />
    );
  }

  // ==================================================
  // RESUME UPLOAD PAGE
  // ==================================================

  if (currentPage === "upload") {
    return (
      <ResumeUpload
        onResumeSelected={handleResumeSelected}
      />
    );
  }

  // ==================================================
  // PROCESSING PAGE
  // ==================================================

  if (currentPage === "processing") {
    return (
      <Processing
        resumeFile={resumeFile}
        onComplete={handleProcessingComplete}
        onBack={goToUpload}
      />
    );
  }

  // ==================================================
  // EXTRACTION PAGE
  // ==================================================

  if (currentPage === "extraction") {
    return (
      <ResumeExtraction
        resumeFile={resumeFile}
        careerTarget={careerTarget}
        extractedData={resumeData}
        onBack={goToProcessing}
        onContinue={handleExtractionContinue}
      />
    );
  }

  // ==================================================
  // SKILL GAP PAGE
  // ==================================================

  if (currentPage === "skill-gap") {
    return (
      <SkillGapAnalysis
        resumeData={resumeData}
        careerTarget={careerTarget}
        careerCode={careerCode}
        careerDbId={careerDbId}
        selectedCareer={selectedCareer}
        onBack={goToExtraction}
        onContinue={handleSkillGapContinue}
      />
    );
  }

  // ==================================================
  // ROADMAP PAGE
  // ==================================================

  if (currentPage === "roadmap") {
    if (!skillGapData) {
      return (
        <div style={{ padding: "40px" }}>
          <h2>
            Roadmap data is not available.
          </h2>

          <button onClick={goToSkillGap}>
            Go Back
          </button>
        </div>
      );
    }

    return (
      <Roadmap
        roadmapData={skillGapData}
        onBack={goToSkillGap}
      />
    );
  }

  // ==================================================
  // FALLBACK
  // ==================================================

  return (
    <Auth
      onBack={() => {}}
      onContinue={handleAuthContinue}
    />
  );
}

export default App;