import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCompass, FaStar, FaArrowRight, FaQuoteLeft } from "react-icons/fa";
import {
  MapPin,
  Heart,
  Navigation,
  Calendar,
  Star,
  BarChart3,
  TrendingUp,
  SlidersHorizontal,
  Users,
  Globe,
  Shield,
  Sparkles,
} from "lucide-react";
import { destinations } from "../data/destinations";
import DestinationCard from "../components/DestinationCard";
import CardNav from "../components/CardNav";

// LogoLoop Component
const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
};

const toCssLength = (value) =>
  typeof value === "number" ? `${value}px` : value ?? undefined;

const cx = (...parts) => parts.filter(Boolean).join(" ");

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener("resize", handleResize);
      callback();
      return () => window.removeEventListener("resize", handleResize);
    }

    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

const useImageLoader = (seqRef, onLoad, dependencies) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll("img") ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) {
        onLoad();
      }
    };

    images.forEach((img) => {
      const htmlImg = img;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener("load", handleImageLoad, { once: true });
        htmlImg.addEventListener("error", handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageLoad);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

const useAnimationLoop = (
  trackRef,
  targetVelocity,
  seqWidth,
  isHovered,
  pauseOnHover
) => {
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seqWidth > 0) {
      offsetRef.current =
        ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    if (prefersReduced) {
      track.style.transform = "translate3d(0, 0, 0)";
      return () => {
        lastTimestampRef.current = null;
      };
    }

    const animate = (timestamp) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime =
        Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = pauseOnHover && isHovered ? 0 : targetVelocity;

      const easingFactor =
        1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = nextOffset;

        const translateX = -offsetRef.current;
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, pauseOnHover, trackRef]);
};

export const LogoLoop = memo(
  ({
    logos,
    speed = 120,
    direction = "left",
    width = "100%",
    logoHeight = 28,
    gap = 32,
    pauseOnHover = true,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    ariaLabel = "Partner logos",
    className,
    style,
    grayscale = false,
  }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const seqRef = useRef(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const directionMultiplier = direction === "left" ? 1 : -1;
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceWidth =
        seqRef.current?.getBoundingClientRect?.()?.width ?? 0;

      if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded =
          Math.ceil(containerWidth / sequenceWidth) +
          ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, []);

    useResizeObserver(
      updateDimensions,
      [containerRef, seqRef],
      [logos, gap, logoHeight]
    );

    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight]);

    useAnimationLoop(
      trackRef,
      targetVelocity,
      seqWidth,
      isHovered,
      pauseOnHover
    );

    const cssVariables = useMemo(
      () => ({
        "--logoloop-gap": `${gap}px`,
        "--logoloop-logoHeight": `${logoHeight}px`,
        ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
      }),
      [gap, logoHeight, fadeOutColor]
    );

    const rootClasses = useMemo(
      () =>
        cx(
          "relative overflow-x-hidden group",
          "[--logoloop-gap:32px]",
          "[--logoloop-logoHeight:28px]",
          "[--logoloop-fadeColorAuto:#ffffff]",
          scaleOnHover && "py-[calc(var(--logoloop-logoHeight)*0.1)]",
          className
        ),
      [scaleOnHover, className]
    );

    const handleMouseEnter = useCallback(() => {
      if (pauseOnHover) setIsHovered(true);
    }, [pauseOnHover]);

    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover) setIsHovered(false);
    }, [pauseOnHover]);

    const renderLogoItem = useCallback(
      (item, key) => {
        const isNodeItem = "node" in item;

        const content = isNodeItem ? (
          <span
            className={cx(
              "inline-flex items-center",
              "motion-reduce:transition-none",
              scaleOnHover &&
                "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120"
            )}
            aria-hidden={!!item.href && !item.ariaLabel}
          >
            {item.node}
          </span>
        ) : (
          <img
            className={cx(
              "h-[var(--logoloop-logoHeight)] w-auto block object-contain",
              "[-webkit-user-drag:none] pointer-events-none",
              "[image-rendering:-webkit-optimize-contrast]",
              "motion-reduce:transition-none",
              grayscale && "filter grayscale",
              scaleOnHover &&
                "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120"
            )}
            src={item.src}
            srcSet={item.srcSet}
            sizes={item.sizes}
            width={item.width}
            height={item.height}
            alt={item.alt ?? ""}
            title={item.title}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        );

        const itemAriaLabel = isNodeItem
          ? item.ariaLabel ?? item.title
          : item.alt ?? item.title;

        const inner = item.href ? (
          <a
            className={cx(
              "inline-flex items-center no-underline rounded",
              "transition-opacity duration-200 ease-linear",
              "hover:opacity-80",
              "focus-visible:outline focus-visible:outline-current focus-visible:outline-offset-2"
            )}
            href={item.href}
            aria-label={itemAriaLabel || "logo link"}
            target="_blank"
            rel="noreferrer noopener"
          >
            {content}
          </a>
        ) : (
          content
        );

        return (
          <li
            className={cx(
              "flex-none mr-[var(--logoloop-gap)] text-[length:var(--logoloop-logoHeight)] leading-[1]",
              scaleOnHover && "overflow-visible group/item"
            )}
            key={key}
            role="listitem"
          >
            {inner}
          </li>
        );
      },
      [scaleOnHover, grayscale]
    );

    const logoLists = useMemo(
      () =>
        Array.from({ length: copyCount }, (_, copyIndex) => (
          <ul
            className="flex items-center"
            key={`copy-${copyIndex}`}
            role="list"
            aria-hidden={copyIndex > 0}
            ref={copyIndex === 0 ? seqRef : undefined}
          >
            {logos.map((item, itemIndex) =>
              renderLogoItem(item, `${copyIndex}-${itemIndex}`)
            )}
          </ul>
        )),
      [copyCount, logos, renderLogoItem]
    );

    const containerStyle = useMemo(
      () => ({
        width: toCssLength(width) ?? "100%",
        ...cssVariables,
        ...style,
      }),
      [width, cssVariables, style]
    );

    return (
      <div
        ref={containerRef}
        className={rootClasses}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {fadeOut && (
          <>
            <div
              aria-hidden
              className={cx(
                "pointer-events-none absolute inset-y-0 left-0 z-[1]",
                "w-[clamp(24px,8%,120px)]",
                "bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(255,255,255,0)_100%)]"
              )}
            />
            <div
              aria-hidden
              className={cx(
                "pointer-events-none absolute inset-y-0 right-0 z-[1]",
                "w-[clamp(24px,8%,120px)]",
                "bg-[linear-gradient(to_left,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(255,255,255,0)_100%)]"
              )}
            />
          </>
        )}

        <div
          className={cx(
            "flex w-max will-change-transform select-none",
            "motion-reduce:transform-none"
          )}
          ref={trackRef}
        >
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = "LogoLoop";

// Custom animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const LandingPage = () => {
  const validDestinations = destinations.filter(
    (d) => d.coordinates && d.coordinates.lat && d.coordinates.lng
  );

  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth - 50
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({
            left: 300,
            behavior: "smooth",
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Top 15 countries flags data (including India)
  const topCountriesFlags = [
    { src: "https://flagcdn.com/w320/in.png", alt: "India", title: "India" },
    {
      src: "https://flagcdn.com/w320/us.png",
      alt: "United States",
      title: "United States",
    },
    { src: "https://flagcdn.com/w320/cn.png", alt: "China", title: "China" },
    { src: "https://flagcdn.com/w320/jp.png", alt: "Japan", title: "Japan" },
    {
      src: "https://flagcdn.com/w320/de.png",
      alt: "Germany",
      title: "Germany",
    },
    {
      src: "https://flagcdn.com/w320/gb.png",
      alt: "United Kingdom",
      title: "United Kingdom",
    },
    { src: "https://flagcdn.com/w320/fr.png", alt: "France", title: "France" },
    { src: "https://flagcdn.com/w320/br.png", alt: "Brazil", title: "Brazil" },
    { src: "https://flagcdn.com/w320/it.png", alt: "Italy", title: "Italy" },
    { src: "https://flagcdn.com/w320/ca.png", alt: "Canada", title: "Canada" },
    { src: "https://flagcdn.com/w320/ru.png", alt: "Russia", title: "Russia" },
    {
      src: "https://flagcdn.com/w320/kr.png",
      alt: "South Korea",
      title: "South Korea",
    },
    {
      src: "https://flagcdn.com/w320/au.png",
      alt: "Australia",
      title: "Australia",
    },
    { src: "https://flagcdn.com/w320/es.png", alt: "Spain", title: "Spain" },
    { src: "https://flagcdn.com/w320/mx.png", alt: "Mexico", title: "Mexico" },
  ];

  // Navigation links for unauthenticated users
  const navLinks = [
    {
      label: "Explore",
      links: [
        {
          label: "Discover",
          href: "/recommendations",
          ariaLabel: "Go to Recommendations",
          icon: MapPin,
        },
        {
          label: "Preferences",
          href: "/survey",
          ariaLabel: "Go to Preferences",
          icon: SlidersHorizontal,
        },
      ],
      bgColor: "#e0f2fe",
      textColor: "#0c4a6e",
    },
    {
      label: "Trip Planner",
      links: [
        {
          label: "Favourites",
          href: "/favourites",
          ariaLabel: "Go to Favourites",
          icon: Heart,
        },
        {
          label: "Itineraries",
          href: "/itineraries",
          ariaLabel: "Go to Itineraries",
          icon: Calendar,
        },
      ],
      bgColor: "#eef2ff",
      textColor: "#312e81",
    },
    {
      label: "Analytics",
      links: [
        {
          label: "Compare",
          href: "/comparision",
          ariaLabel: "Go to Comparison",
          icon: BarChart3,
        },
        {
          label: "Trending",
          href: "/trending",
          ariaLabel: "Go to Trending",
          icon: TrendingUp,
        },
      ],
      bgColor: "#f0fdf4",
      textColor: "#14532d",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <CardNav
          items={navLinks}
          buttonLabel="Get Started"
          buttonClass="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 "
          onButtonClick={() => (window.location.href = "/signup")}
          className="z-50"
        />
      </div>

      {/* Hero Image at the top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <img
            src="https://images.pexels.com/photos/10618962/pexels-photo-10618962.jpeg"
            alt="Relaxing beach destination"
            className="w-full h-64 md:h-96 object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Hero Text Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Perfect
              </span>{" "}
              Destination
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Geo Darshan helps you find travel destinations that match your
              interests, style, and budget. Plan smarter, travel better.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
            >
              <Link to="/signup">
                <motion.button
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start Your Journey</span>
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-64 h-64 bg-purple-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-64 h-64 bg-blue-200 rounded-full opacity-20"></div>
        </div>
      </div>

      {/* Top Countries Flags Logo Loop Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Explore Top Destinations Worldwide
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing places across the globe with our personalized
            travel recommendations
          </p>
        </motion.div>

        <LogoLoop
          logos={topCountriesFlags}
          speed={80}
          logoHeight={80}
          gap={50}
          fadeOut={true}
          fadeOutColor="#ffffff"
          ariaLabel="Top countries flags"
          className="mb-12 md:mb-16"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {/* Features Section - Redesigned */}
        <section className="relative">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
            >
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Geo Darshan
              </span>
              ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Our platform offers everything you need to plan your perfect trip
              with confidence and ease.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: <Sparkles className="text-3xl" />,
                title: "Smart Recommendations",
                desc: "Get personalized destination suggestions based on your preferences, travel history, and current trends.",
                color: "bg-gradient-to-r from-blue-500 to-indigo-500",
              },
              {
                icon: <Globe className="text-3xl" />,
                title: "Global Coverage",
                desc: "Access detailed information about destinations across all continents with real-time updates.",
                color: "bg-gradient-to-r from-purple-500 to-pink-500",
              },
              {
                icon: <Shield className="text-3xl" />,
                title: "Trusted Information",
                desc: "Verified reviews and up-to-date information from reliable sources and fellow travelers.",
                color: "bg-gradient-to-r from-green-500 to-teal-500",
              },
              {
                icon: <Users className="text-3xl" />,
                title: "Community Driven",
                desc: "Join a community of travelers sharing experiences, tips, and hidden gems around the world.",
                color: "bg-gradient-to-r from-amber-500 to-orange-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex items-start mb-6">
                  <div
                    className={`p-4 rounded-xl ${feature.color} text-white shadow-lg flex-shrink-0`}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold ml-4 text-gray-900 mt-2">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Testimonials Section - Redesigned */}
        <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-inner">
          <div className="container mx-auto px-6">
            <motion.h3
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900"
            >
              What{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Travelers Say
              </span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center text-gray-600 mb-16 max-w-2xl mx-auto"
            >
              Hear from our community of travelers who have discovered amazing
              destinations with our platform.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  location: "Frequent Traveler",
                  text: "Geo Darshan helped me discover hidden gems I would never have found on my own. The recommendations were spot on!",
                  avatar: "SJ",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  name: "Michael Chen",
                  location: "Adventure Seeker",
                  text: "The itinerary planning feature saved me hours of research. Everything was perfectly organized for my trip to Japan!",
                  avatar: "MC",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  name: "Emma Rodriguez",
                  location: "Cultural Explorer",
                  text: "I've recommended Geo Darshan to all my friends. It's like having a personal travel assistant that knows your style!",
                  avatar: "ER",
                  color: "from-amber-500 to-orange-500",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col h-full"
                >
                  <div className="mb-6">
                    <FaQuoteLeft className="text-2xl text-indigo-400 opacity-70" />
                  </div>

                  <p className="text-gray-600 mb-8 flex-grow italic">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center mt-auto">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.location}
                      </p>
                      <div className="flex text-indigo-400 mt-1">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Explore the World?
              </h2>
              <p className="text-blue-100 mb-8">
                Join thousands of travelers who are already discovering their
                perfect destinations with Geo Darshan.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup">
                  <motion.button
                    className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Today
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
