import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { gsap } from "gsap";

const TargetCursor = ({
  targetSelector = ".cursor-target",
  spinDuration = 2,
  hideDefaultCursor = true,
  excludeSelector = "nav, .navbar, header",
}) => {
  const cursorRef = useRef(null);
  const cornersRef = useRef(null);
  const spinTl = useRef(null);
  const dotRef = useRef(null);
  const [isOverExcluded, setIsOverExcluded] = useState(false);
  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12,
      parallaxStrength: 0.00005,
    }),
    []
  );

  const moveCursor = useCallback(
    (x, y) => {
      if (!cursorRef.current || isOverExcluded) return;
      gsap.to(cursorRef.current, {
        x,
        y,
        duration: 0.1,
        ease: "power3.out",
      });
    },
    [isOverExcluded]
  );

  useEffect(() => {
    if (!cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor && !isOverExcluded) {
      document.body.style.cursor = "none";
    } else {
      document.body.style.cursor = originalCursor;
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll(".target-cursor-corner");

    let activeTarget = null;
    let currentTargetMove = null;
    let currentLeaveHandler = null;
    let isAnimatingToTarget = false;
    let resumeTimeout = null;

    const cleanupTarget = (target) => {
      if (currentTargetMove) {
        target.removeEventListener("mousemove", currentTargetMove);
      }
      if (currentLeaveHandler) {
        target.removeEventListener("mouseleave", currentLeaveHandler);
      }
      currentTargetMove = null;
      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap.timeline({ repeat: -1 }).to(cursor, {
        rotation: "+=360",
        duration: spinDuration,
        ease: "none",
      });
    };

    if (!isOverExcluded) {
      createSpinTimeline();
    }

    const moveHandler = (e) => {
      const excludedElement = document.querySelector(excludeSelector);
      const isOverExcludedElement =
        excludedElement &&
        (e.target === excludedElement || e.target.closest(excludeSelector));

      setIsOverExcluded(isOverExcludedElement);

      if (!isOverExcludedElement) {
        moveCursor(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousemove", moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current || isOverExcluded) return;

      const mouseX = gsap.getProperty(cursorRef.current, "x");
      const mouseY = gsap.getProperty(cursorRef.current, "y");

      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget ||
          elementUnderMouse.closest(targetSelector) === activeTarget);

      if (!isStillOverTarget) {
        if (currentLeaveHandler) {
          currentLeaveHandler();
        }
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      if (!dotRef.current || isOverExcluded) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current || isOverExcluded) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);

    const enterHandler = (e) => {
      if (isOverExcluded) return;

      const directTarget = e.target;

      const allTargets = [];
      let current = directTarget;
      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }

      const target = allTargets[0] || null;
      if (!target || !cursorRef.current || !cornersRef.current) return;

      if (activeTarget === target) return;

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;

      gsap.killTweensOf(cursorRef.current, "rotation");
      spinTl.current?.pause();

      gsap.set(cursorRef.current, { rotation: 0 });

      const updateCorners = (mouseX, mouseY) => {
        const rect = target.getBoundingClientRect();
        const cursorRect = cursorRef.current.getBoundingClientRect();

        const cursorCenterX = cursorRect.left + cursorRect.width / 2;
        const cursorCenterY = cursorRect.top + cursorRect.height / 2;

        const [tlc, trc, brc, blc] = Array.from(cornersRef.current);

        const { borderWidth, cornerSize, parallaxStrength } = constants;

        let tlOffset = {
          x: rect.left - cursorCenterX - borderWidth,
          y: rect.top - cursorCenterY - borderWidth,
        };
        let trOffset = {
          x: rect.right - cursorCenterX + borderWidth - cornerSize,
          y: rect.top - cursorCenterY - borderWidth,
        };
        let brOffset = {
          x: rect.right - cursorCenterX + borderWidth - cornerSize,
          y: rect.bottom - cursorCenterY + borderWidth - cornerSize,
        };
        let blOffset = {
          x: rect.left - cursorCenterX - borderWidth,
          y: rect.bottom - cursorCenterY + borderWidth - cornerSize,
        };

        if (mouseX !== undefined && mouseY !== undefined) {
          const targetCenterX = rect.left + rect.width / 2;
          const targetCenterY = rect.top + rect.height / 2;
          const mouseOffsetX = (mouseX - targetCenterX) * parallaxStrength;
          const mouseOffsetY = (mouseY - targetCenterY) * parallaxStrength;

          tlOffset.x += mouseOffsetX;
          tlOffset.y += mouseOffsetY;
          trOffset.x += mouseOffsetX;
          trOffset.y += mouseOffsetY;
          brOffset.x += mouseOffsetX;
          brOffset.y += mouseOffsetY;
          blOffset.x += mouseOffsetX;
          blOffset.y += mouseOffsetY;
        }

        const tl = gsap.timeline();
        const corners = [tlc, trc, brc, blc];
        const offsets = [tlOffset, trOffset, brOffset, blOffset];

        corners.forEach((corner, index) => {
          tl.to(
            corner,
            {
              x: offsets[index].x,
              y: offsets[index].y,
              duration: 0.2,
              ease: "power2.out",
            },
            0
          );
        });
      };

      isAnimatingToTarget = true;
      updateCorners();

      setTimeout(() => {
        isAnimatingToTarget = false;
      }, 1);

      let moveThrottle = null;
      const targetMove = (ev) => {
        if (moveThrottle || isAnimatingToTarget || isOverExcluded) return;
        moveThrottle = requestAnimationFrame(() => {
          const mouseEvent = ev;
          updateCorners(mouseEvent.clientX, mouseEvent.clientY);
          moveThrottle = null;
        });
      };

      const leaveHandler = () => {
        activeTarget = null;
        isAnimatingToTarget = false;

        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current);
          gsap.killTweensOf(corners);

          const { cornerSize } = constants;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 },
          ];

          const tl = gsap.timeline();
          corners.forEach((corner, index) => {
            tl.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.3,
                ease: "power3.out",
              },
              0
            );
          });
        }

        resumeTimeout = setTimeout(() => {
          if (
            !activeTarget &&
            cursorRef.current &&
            spinTl.current &&
            !isOverExcluded
          ) {
            const currentRotation = gsap.getProperty(
              cursorRef.current,
              "rotation"
            );
            const normalizedRotation = currentRotation % 360;

            spinTl.current.kill();
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, {
                rotation: "+=360",
                duration: spinDuration,
                ease: "none",
              });

            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: "none",
              onComplete: () => {
                spinTl.current?.restart();
              },
            });
          }
          resumeTimeout = null;
        }, 50);

        cleanupTarget(target);
      };

      currentTargetMove = targetMove;
      currentLeaveHandler = leaveHandler;

      target.addEventListener("mousemove", targetMove);
      target.addEventListener("mouseleave", leaveHandler);
    };

    window.addEventListener("mouseover", enterHandler, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseover", enterHandler);
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
    };
  }, [
    targetSelector,
    spinDuration,
    moveCursor,
    constants,
    hideDefaultCursor,
    excludeSelector,
    isOverExcluded,
  ]);

  useEffect(() => {
    if (!cursorRef.current || !spinTl.current || isOverExcluded) return;

    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, {
        rotation: "+=360",
        duration: spinDuration,
        ease: "none",
      });
    }
  }, [spinDuration, isOverExcluded]);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2"
        style={{
          willChange: "transform",
          display: isOverExcluded ? "none" : "block",
        }}
      >
        <div
          ref={dotRef}
          className="absolute left-1/2 top-1/2 w-2 h-2 bg-gradient-to-r from-blue-700 via-purple-500 to-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
          style={{ willChange: "transform" }}
        />

        <div
          className="target-cursor-corner absolute left-1/2 top-1/2 w-3 h-3 transform -translate-x-[150%] -translate-y-[150%] border-r-0 border-b-0"
          style={{
            willChange: "transform",
            background:
              "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #c4b5fd 100%)",
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
          }}
        />
        <div
          className="target-cursor-corner absolute left-1/2 top-1/2 w-3 h-3 transform translate-x-1/2 -translate-y-[150%] border-l-0 border-b-0"
          style={{
            willChange: "transform",
            background:
              "linear-gradient(225deg, #60a5fa 0%, #a78bfa 50%, #c4b5fd 100%)",
            clipPath: "polygon(0 0, 100% 0, 100% 100%)",
          }}
        />
        <div
          className="target-cursor-corner absolute left-1/2 top-1/2 w-3 h-3 transform translate-x-1/2 translate-y-1/2 border-l-0 border-t-0"
          style={{
            willChange: "transform",
            background:
              "linear-gradient(315deg, #60a5fa 0%, #a78bfa 50%, #c4b5fd 100%)",
            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        />
        <div
          className="target-cursor-corner absolute left-1/2 top-1/2 w-3 h-3 transform -translate-x-[150%] translate-y-1/2 border-r-0 border-t-0"
          style={{
            willChange: "transform",
            background:
              "linear-gradient(45deg, #60a5fa 0%, #a78bfa 50%, #c4b5fd 100%)",
            clipPath: "polygon(0 0, 100% 100%, 0 100%)",
          }}
        />
      </div>
    </>
  );
};

export default TargetCursor;
