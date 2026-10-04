import { createRoot } from "react-dom/client";
import CometProfile from "@/components/comet-profile";
import LiquidVideoBackground from "@/components/liquid-video-background";
import "../styles/react-islands.css";

const profile = document.getElementById("comet-profile");
if (profile) createRoot(profile).render(<CometProfile />);

const background = document.getElementById("portfolio-background");
if (background) createRoot(background).render(<LiquidVideoBackground />);
