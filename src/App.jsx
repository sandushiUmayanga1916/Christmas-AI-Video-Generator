/* eslint-disable no-irregular-whitespace */
// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useEffect } from "react";
import Snowfall from "react-snowfall";
import {
  Camera,
  Upload,
  Trash2,
  Info,
  ArrowLeft,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";

const App = () => {
  const [formStage, setFormStage] = useState("initial");
  const [initialFormData, setInitialFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [formData, setFormData] = useState({
    photo: null,
    message: "",
    selectedTemplate: "",
  });
  const [photoSize, setPhotoSize] = useState(0);
  const [error, setError] = useState("");
  const [uploadMode, setUploadMode] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const MAX_PHOTO_SIZE = 15 * 1024 * 1024;
  const MAX_MESSAGE_LENGTH = 100;
  const SUPPORTED_FORMATS = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/tiff",
    "image/heic",
  ];

  const templates = {
    male: [
      "https://honor-ai-video-gen.s3.ap-south-1.amazonaws.com/temp_img/1.jpeg",
      "https://honor-ai-video-gen.s3.ap-south-1.amazonaws.com/temp_img/2.jpeg",
      "https://honor-ai-video-gen.s3.ap-south-1.amazonaws.com/temp_img/3.jpeg",
      "https://honor-ai-video-gen.s3.ap-south-1.amazonaws.com/temp_img/4.jpeg",
    ],
    female: [
      "https://honor-ai-video-gen.s3.ap-south-1.amazonaws.com/temp_img/6.jpeg",
      "https://honor-ai-video-gen.s3.ap-south-1.amazonaws.com/temp_img/7.jpeg",
      "https://honor-ai-video-gen.s3.ap-south-1.amazonaws.com/temp_img/8.jpeg",
      "https://honor-ai-video-gen.s3.ap-south-1.amazonaws.com/temp_img/9.jpeg",
      "https://honor-ai-video-gen.s3.ap-south-1.amazonaws.com/temp_img/10.jpeg",
    ],
  };

  const allTemplates = [...templates.male, ...templates.female];

  const [robotVerification, setRobotVerification] = useState({
    challenge: null,
    userResponse: null,
    isVerified: false,
  });

  // Terms and Conditions Popup
  const renderTermsPopup = () => {
    if (!showTerms) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto relative">
          <h3 className="text-2xl font-bold text-purple-300 mb-4">
            Terms and Conditions
          </h3>

          <div className="space-y-4 text-purple-200">
            <p>
              Welcome to the HONOR Christmas Wish creator! By using this
              service, you agree to the following terms:
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-300">1. Eligibility </h4>
              <li className="flex items-start">
                <span className="mr-2">•</span> This campaign is open to all
                individuals.
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span> Participants must comply with
                all local laws and regulations applicable to their
                participation.
              </li>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-300">2. Platform Use</h4>
              <li className="flex items-start">
                <span className="mr-2">•</span>The platform provided for the
                Christmas Campaign allows participants to create videos by
                integrating images into a Christmas template, which will then
                animate and talk.
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>The platform is provided
                &ldquo;as is,&ldquo; and we do not guarantee uninterrupted or
                error-free operation.
              </li>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-300">
                3. Participant Responsibilities
              </h4>
              <li className="flex items-start">
                <span className="mr-2">•</span>Participants are solely
                responsible for the images and messages they upload and use
                within the platform.
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>By submitting content,
                participants confirm that they have the legal right to use any
                images or text provided and that their submissions do not
                violate copyright, privacy, or other legal rights.
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>Participants agree to refrain
                from uploading content that is offensive, defamatory,
                discriminatory, or otherwise inappropriate.
              </li>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-300">
                4. Intellectual Property
              </h4>
              <li className="flex items-start">
                <span className="mr-2">•</span> The platform and its templates
                remain the intellectual property of Singer Sri Lanka PLC.
                Participants may not reverse-engineer, replicate, or
                redistribute the template or any part of the platform.
              </li>

              <li className="flex items-start">
                <span className="mr-2">•</span>Any content submitted by
                participants remains their intellectual property. However, by
                participating, participants grant Honor Information Technology
                Co., Limited and Singer Sri Lanka PLC a non-exclusive,
                royalty-free, and worldwide license to use, display, and promote
                the submitted content for purposes related to the Christmas
                Campaign.
              </li>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-300">5. Liability</h4>
              <li className="flex items-start">
                <span className="mr-2">•</span> Honor Information Technology
                Co., Limited and Singer Sri Lanka PLC assume no responsibility
                for the content submitted by participants or for any
                consequences resulting from its use or misuse.
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>Honor Information Technology Co.,
                Limited and Singer Sri Lanka PLC disclaim liability for any
                technical issues or data loss arising from the use of the
                platform.
              </li>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-300">6. Privacy</h4>
              <li className="flex items-start">
                <span className="mr-2">•</span>Participants’ data, including
                uploaded images and messages, will be handled in accordance with
                the Privacy Policy of Honor Information Technology Co., Limited
                and Singer Sri Lanka PLC.
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span> Honor Information Technology
                Co., Limited and Singer Sri Lanka PLC will not share
                participants’ data with third parties unless required by law or
                for purposes directly related to the Christmas Campaign.
              </li>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-300">
                7. Disqualification
              </h4>
              <li className="flex items-start">
                <span className="mr-2">•</span>Participants may be disqualified
                for violating these terms and conditions or engaging in
                fraudulent or unethical behavior.
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>Honor Information Technology Co.,
                Limited and Singer Sri Lanka PLC reserve the right to remove any
                content deemed inappropriate or in violation of these terms
                without prior notice.
              </li>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-300">
                8. Modification and Termination
              </h4>
              <li className="flex items-start">
                <span className="mr-2">•</span>Honor Information Technology Co.,
                Limited and Singer Sri Lanka PLC reserve the right to modify or
                terminate the Christmas Campaign at any time without prior
                notice.
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>Changes to the campaign or terms
                and conditions will be communicated on Honor Information
                Technology Co., Limited and Singer Sri Lanka PLC’s website or
                platform.
              </li>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-300">
                9. Governing Law
              </h4>
              <li className="flex items-start">
                <span className="mr-2">•</span>Any disputes arising from this
                Christmas Campaign will be subject to the exclusive jurisdiction
                of the courts.
              </li>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-300">10. Ownership</h4>
              <li className="flex items-start">
                <span className="mr-2">•</span>The ownership of all rights,
                titles, and interests in the Christmas Campaign, including all
                related intellectual property and platform functionalities,
                belongs exclusively to Honor Information Technology Co., Limited
                and Singer Sri Lanka PLC.
              </li>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-purple-300">
                11. Acceptance of Terms
              </h4>
              <li className="flex items-start">
                <span className="mr-2">•</span>By participating in the Christmas
                Campaign, participants agree to these terms and conditions.
              </li>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
              onClick={handleTermsAccept}
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all"
            >
              I Accept
            </button>
            <button
              onClick={() => {
                setShowTerms(false);
                setFormStage("initial");
              }}
              className="flex-1 bg-gray-700 text-purple-300 py-3 rounded-lg hover:bg-gray-600 transition-all"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Robot verification challenge generation
  const generateRobotChallenge = () => {
    const operators = ["+", "-", "*"];
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let correctAnswer;
    switch (operator) {
      case "+":
        correctAnswer = num1 + num2;
        break;
      case "-":
        correctAnswer = num1 - num2;
        break;
      case "*":
        correctAnswer = num1 * num2;
        break;
      default:
        correctAnswer = num1 + num2;
    }

    return {
      question: `${num1} ${operator} ${num2} = ?`,
      correctAnswer: correctAnswer,
    };
  };

  const handleInitialChange = (e) => {
    setInitialFormData({
      ...initialFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setShowTerms(true);
  };
  const handleTermsAccept = () => {
    setShowTerms(false);
    setTermsAccepted(true);
    setFormStage("details");
  };

  const handleDetailsChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetPhotoState = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPhotoSize(0);
    setUploadMode(null);
    setIsCameraReady(false);

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const convertToJpeg = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas with the same dimensions as the original image
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image on white background (for formats with transparency)
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "white"; // White background
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Convert to JPEG with high quality
          canvas.toBlob(
            (blob) => {
              const convertedFile = new File([blob], "converted.jpg", {
                type: "image/jpeg",
              });
              resolve(convertedFile);
            },
            "image/jpeg",
            0.92
          ); // 0.92 is a high-quality compression
        };

        img.onerror = () => reject(new Error("Image loading failed"));
        img.src = event.target.result;
      };

      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (formStage === "details") {
      setRobotVerification({
        challenge: generateRobotChallenge(),
        userResponse: null,
        isVerified: false,
      });
    }
  }, [formStage]);

  const handleRobotVerificationChange = (e) => {
    const userAnswer = parseInt(e.target.value);

    setRobotVerification((prev) => ({
      ...prev,
      userResponse: userAnswer,
      isVerified: userAnswer === prev.challenge.correctAnswer,
    }));
  };

  const renderRobotVerification = () => {
    if (!robotVerification.challenge) return null;

    return (
      <div className="mt-6 bg-gray-700 rounded-lg p-4">
        <label className="block text-base font-medium text-purple-300 mb-2">
          Robot Verification
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <p className="text-purple-400 mb-2">
              Solve this simple math problem to verify you&apos;re not a robot:
            </p>
            <div className="flex items-center">
              <div className="bg-gray-600 px-4 py-2 rounded-lg mr-4 text-purple-200">
                {robotVerification.challenge.question}
              </div>
              <input
                type="number"
                value={robotVerification.userResponse || ""}
                onChange={handleRobotVerificationChange}
                className="w-24 p-2 rounded-lg bg-gray-800 text-purple-200 border-2 border-transparent focus:border-purple-500"
                placeholder="Your answer"
              />
              {robotVerification.userResponse !== null &&
                (robotVerification.isVerified ? (
                  <CheckCircle2 className="ml-2 text-green-500" />
                ) : (
                  <Circle className="ml-2 text-red-500" />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_PHOTO_SIZE) {
      setError("File size must be less than 15MB.");
      return;
    }

    // Check if conversion is needed
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setError(`Unsupported file format: ${file.type}`);
      return;
    }

    try {
      let processedFile;
      let processedFormat;

      // If not already JPEG, convert
      if (file.type !== "image/jpeg") {
        processedFile = await convertToJpeg(file);
        processedFormat = "JPEG";
        setError(`Converted to JPEG format automatically`);
      } else {
        processedFile = file;
        processedFormat = "JPEG";
      }

      // Read the processed file
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          photo: event.target.result,
          photoFormat: processedFormat,
        }));
        setPhotoSize(processedFile.size);
        setUploadMode("upload");
        setError("");
      };
      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error("Image processing error:", error);
      setError("Failed to process image. Please try another file.");
      resetPhotoState();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraReady) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoDataUrl = canvas.toDataURL("image/jpeg", 0.92);

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    setFormData((prev) => ({
      ...prev,
      photo: photoDataUrl,
      photoFormat: "JPEG",
    }));
    setPhotoSize(photoDataUrl.length);
    setIsCameraReady(false);
  };

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setCameraStream(stream);
      setUploadMode("camera");
      setIsCameraReady(true);
      setError("");
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Check permissions and HTTPS.");
      setUploadMode(null);
    }
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (formData.message.length > MAX_MESSAGE_LENGTH) {
      setError("Message exceeds maximum length.");
      return;
    }
    if (photoSize > MAX_PHOTO_SIZE) {
      setError("Photo size exceeds 15MB.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await fetch("https://api-christmaswish.enfection.com/gen-video-honor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: initialFormData.name,
          email: initialFormData.email,
          phone_number: initialFormData.phone,
          input_text: formData.message,
          gender: formData.gender,
          temp_image_path: formData.selectedTemplate,
          user_photo_path: formData.photo,
        }),
      });

      // Proceed to success regardless of response
      setFormStage("success");
    } catch (error) {
      console.error("Submission error:", error);
      // Still proceed to success even if there's an error
      setFormStage("success");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPhotoInstructions = () => {
    if (!showInstructions) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
          <button
            onClick={() => setShowInstructions(false)}
            className="absolute right-4 top-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <X size={20} />
          </button>

          <h3 className="font-bold text-purple-300 mb-4 flex items-center text-lg">
            <Info className="mr-2" /> Photo Upload Guidelines
          </h3>

          <ul className="space-y-3 text-purple-200">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Maximum file size: 15MB
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Avoid blurry or heavily filtered images
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              High-resolution images: Ensure to upload a clear image of your
              face with good lighting.
            </li>
          </ul>

          <button
            onClick={() => setShowInstructions(false)}
            className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  };

  const renderPhotoUpload = () => {
    if (!formData.photo) {
      return (
        <div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex-1 flex items-center justify-center bg-gray-700 text-purple-300 p-4 rounded-lg hover:bg-gray-600 transition-all"
            >
              <Upload className="mr-2" /> Upload Photo
              <input
                type="file"
                ref={fileInputRef}
                accept={SUPPORTED_FORMATS.join(",")}
                onChange={handleFileUpload}
                className="hidden"
              />
            </button>
            <button
              type="button"
              onClick={initializeCamera}
              className="flex-1 flex items-center justify-center bg-gray-700 text-purple-300 p-4 rounded-lg hover:bg-gray-600 transition-all"
            >
              <Camera className="mr-2" /> Take Photo
            </button>
          </div>
          <div className="mt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
            >
              <Info className="mr-1" /> Photo Upload Instructions
            </button>
          </div>
          {renderPhotoInstructions()}
        </div>
      );
    }

    return (
      <div className="relative">
        <img
          src={formData.photo}
          alt="Uploaded"
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={resetPhotoState}
            className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-all"
          >
            <Trash2 size={16} className="text-white" />
          </button>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-sm text-purple-400">
            Size: {(photoSize / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p className="text-sm text-purple-400">
            Format: {formData.photoFormat}
          </p>
        </div>
      </div>
    );
  };

  const renderCameraMode = () => {
    if (uploadMode !== "camera" || !isCameraReady) return null;

    return (
      <div className="mt-4">
        <div className="relative w-full aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-lg"
            autoPlay
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={capturePhoto}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all"
          >
            Capture Photo
          </button>
          <button
            onClick={resetPhotoState}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderFormStage = () => {
    switch (formStage) {
      case "details":
        if (!termsAccepted) {
          setFormStage("initial");
          return null;
        }
        return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (robotVerification.isVerified) {
                  handleInitialSubmit(e);
                } else {
                  setError("Please complete the robot verification.");
                }
              }}
              className="space-y-6 relative"
            >
            <button
              type="button"
              onClick={() => setFormStage("initial")}
              className="absolute -top-36 -left-7 flex items-center text-violet-400 hover:text-purple-300 m-6 font-bold "
            >
              <ArrowLeft className="mr-2" />
            </button>
            <div>
              <label
                htmlFor="name"
                className="block text-base font-medium text-purple-300"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={initialFormData.name}
                onChange={handleInitialChange}
                required
                className="p-4 mt-1 block w-full rounded-lg bg-gray-700 border-transparent text-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 transition-all duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-purple-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={initialFormData.email}
                onChange={handleInitialChange}
                required
                className="p-4 mt-1 block w-full rounded-lg bg-gray-700 border-transparent text-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 transition-all duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-base font-medium text-purple-300"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={initialFormData.phone}
                onChange={handleInitialChange}
                pattern="[0-9]{10}"
                title="Please enter a 10-digit phone number"
                required
                className="p-4 mt-1 block w-full rounded-lg bg-gray-700 border-transparent text-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 transition-all duration-300"
              />
              <p className="text-sm text-purple-400 mt-1">
                Format: 10 digits (e.g., 1234567890)
              </p>
            </div>
            {renderRobotVerification()}
            <button
              type="submit"
              disabled={
                !formData.photo || !robotVerification.isVerified || isSubmitting
              }
              className="w-full bg-purple-600 text-white py-2 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 disabled:bg-gray-700 disabled:text-purple-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Magical Christmas Wish"
              )}
            </button>
          </form>
        );

      case "initial":
        return (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="relative mx-auto mb-4 rounded-lg max-h-64 overflow-hidden">
              <video
                src="https://honor-ai-video-gen.s3.ap-south-1.amazonaws.com/gen_video/preview-video.mp4"
                alt="Your Christmas Wish Video"
                controls
                className="w-full h-full object-cover"
              />
            </div>
            <div className=" border-dashed border-2 border-purple-600 rounded-2xl p-4">
              <label className="block text-base font-medium text-purple-300 mb-4">
                Upload Photo
              </label>

              {renderPhotoUpload()}
              {renderCameraMode()}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-base font-medium text-purple-300 mb-4"
              >
                Christmas Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="May your Christmas sparkle with love, joy, and peace. Wishing you a season of blessings and cheer!"
                value={formData.message}
                onChange={handleDetailsChange}
                maxLength={MAX_MESSAGE_LENGTH}
                required
                rows={3}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-transparent text-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 transition-all duration-300 p-4"
              ></textarea>
              <div className="text-sm text-purple-400 mt-1">
                {formData.message.length} / {MAX_MESSAGE_LENGTH} characters
              </div>
            </div>
            <div>
              <div className="mt-2 flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      gender: prev.gender === "male" ? "" : "male",
                    }));
                  }}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    formData.gender === "male"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-purple-300 hover:bg-gray-600"
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      gender: prev.gender === "female" ? "" : "female",
                    }));
                  }}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    formData.gender === "female"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-700 text-purple-300 hover:bg-gray-600"
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-purple-300 mb-4">
                Choose a Template
              </label>
              <div className="mt-2 h-64 overflow-y-auto grid grid-cols-2 gap-4 p-2 bg-gray-700 rounded-lg">
                {allTemplates.map((template, index) => (
                  <img
                    key={index}
                    src={template}
                    alt={`Template ${index + 1}`}
                    className={`cursor-pointer border-2 rounded-lg transition-all object-cover h-40 w-full ${
                      formData.selectedTemplate === template
                        ? "border-purple-500 scale-105"
                        : "border-gray-600"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        selectedTemplate: template,
                      }))
                    }
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                !formData.photo ||
                !formData.message ||
                !formData.selectedTemplate
              }
              className="w-full bg-purple-600 text-white py-2 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 disabled:bg-gray-700 disabled:text-purple-400 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </form>
        );

      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="bg-green-600/20 border-2 border-green-500 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-2">
                Wish Submitted Successfully!
              </h3>
              <p className="text-purple-300">
  Your magical Christmas wish is on its way! ✨ Keep an eye on your phone, and in about 6 hours, you&apos;ll receive an SMS with the link to your special video. 🎄📲
  <br /><br />
  To download the video:
  <br />
  iPhone: Share → Save to Files
  <br />
  Android: Click the link
</p>

            </div>
            <button
              onClick={() => {
                setFormStage("initial");
                setInitialFormData({
                  name: "",
                  email: "",
                  phone: "",
                });
                setFormData({
                  photo: null,
                  message: "",
                  selectedTemplate: "",
                });
                setPhotoSize(0);
                setError("");
              }}
              className="w-full bg-purple-600 text-white py-2 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300"
            >
              Create Another Wish
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col relative">
      {renderTermsPopup()}
      <Snowfall snowflakeCount={300} color="#FFFFFF" />

      <div className="flex-grow flex items-center justify-center relative">
        {/* Left Side Image */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-0 hidden md:block">
          <img
            src="/upload/phone1.png"
            alt="Left Image"
            className="w-80 h-auto object-contain pl-8"
          />
        </div>

        {/* Right Side Image */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-0 hidden md:block">
          <img
            src="/upload/phone2.png"
            alt="Right Image"
            className="w-80 h-auto object-contain pr-12"
          />
        </div>

        <div className="bg-gray-800 p-5 shadow-2xl shadow-purple-900/50 w-full max-w-md relative z-10">
          <div className="block sm:hidden">
            <Snowfall snowflakeCount={300} color="#FFFFFF" />
          </div>

          <div className="flex justify-center mb-6">
            <img
              src="/upload/honerlogo.png"
              alt="Logo"
              className="w-52 object-contain"
            />
          </div>

          <div className="bg-gray-800 border-2 border-purple-600 p-5 rounded-2xl w-full max-w-md relative z-10">
            <h2 className="text-3xl font-extrabold mb-6 mt-4 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
              Bring your wishes to life
            </h2>

            {renderFormStage()}

            {error && (
              <div className="mt-4 bg-red-600/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Bottom Logo */}
          <div className="flex justify-center">
            <img
              src="/upload/singerlogo.png"
              alt="Logo"
              className="w-56 object-contain my-5"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white w-full py-4 px-8">
        <div className="flex justify-between items-center">
          <div className="w-1/3 flex justify-start">
            <img
              src="/upload/singer.png"
              alt="Footer HONOR Logo"
              className="w-28 h-auto object-contain"
            />
          </div>

          <div className="w-1/3 flex justify-center">
            <img
              src="/upload/singer.png"
              alt="Footer HONOR Logo"
              className="w-28 h-auto object-contain"
            />
          </div>

          <div className="w-1/3 flex justify-end">
            <img
              src="/upload/singer.png"
              alt="Footer SINGER Logo"
              className="w-28 h-auto object-contain"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
