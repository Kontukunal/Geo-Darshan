// components/Stepper.jsx
import React, { useState, Children, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Stepper = ({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col items-center justify-center p-4"
      {...rest}
    >
      <div
        className={`mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-xl ${stepCircleContainerClassName}`}
        style={{
          border: "1px solid #eaeaea",
          background: "#ffffff",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          className={`${stepContainerClassName} flex w-full items-center justify-center px-8 pt-8`}
        >
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && (
                  <StepConnector isComplete={currentStep > stepNumber} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`space-y-2 px-8 py-6 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={`px-8 pb-8 ${footerClassName}`}>
            <div
              className={`mt-6 flex ${
                currentStep !== 1 ? "justify-between" : "justify-end"
              }`}
            >
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`flex items-center space-x-2 rounded-lg px-6 py-3 font-medium transition-all duration-300 ${
                    currentStep === 1
                      ? "pointer-events-none opacity-50 bg-gray-100 text-gray-400"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                  }`}
                  {...backButtonProps}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>{backButtonText}</span>
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 active:scale-95"
                {...nextButtonProps}
              >
                <span>{isLastStep ? "Complete" : nextButtonText}</span>
                {!isLastStep && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
}) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export function Step({ children }) {
  return <div className="px-4">{children}</div>;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators,
}) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step);
  };

  const stepColors = {
    inactive: { bg: "#f5f5f7", text: "#9ca3af" },
    active: {
      bg: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      text: "#ffffff",
    },
    complete: {
      bg: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
      text: "#ffffff",
    },
  };

  return (
    <motion.div
      onClick={handleClick}
      className="relative flex flex-col items-center cursor-pointer outline-none focus:outline-none"
      animate={status}
      initial={false}
    >
      <div className="flex flex-col items-center">
        <motion.div
          variants={{
            inactive: { scale: 1 },
            active: { scale: 1.1 },
            complete: { scale: 1 },
          }}
          transition={{ duration: 0.3 }}
          className="flex h-12 w-12 items-center justify-center rounded-full font-semibold shadow-sm relative z-10 border border-gray-100"
          style={{
            background:
              status === "active"
                ? stepColors.active.bg
                : status === "complete"
                ? stepColors.complete.bg
                : stepColors.inactive.bg,
            color:
              status === "active" || status === "complete"
                ? stepColors.active.text
                : stepColors.inactive.text,
          }}
        >
          {status === "complete" ? (
            <CheckIcon className="h-5 w-5 text-white" />
          ) : (
            <span className="text-sm font-bold">{step}</span>
          )}
        </motion.div>

        <motion.span
          className="mt-2 text-xs font-medium text-gray-600 capitalize"
          animate={{
            color: status === "active" ? "#4f46e5" : "#6b7280",
            fontWeight: status === "active" ? "bold" : "normal",
          }}
          transition={{ duration: 0.2 }}
        >
          Step {step}
        </motion.span>
      </div>
    </motion.div>
  );
}

function StepConnector({ isComplete }) {
  return (
    <div className="relative mx-4 h-0.5 w-16 flex-1 overflow-hidden rounded bg-gray-100">
      <motion.div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600"
        initial={{ width: 0 }}
        animate={{ width: isComplete ? "100%" : 0 }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default Stepper;
