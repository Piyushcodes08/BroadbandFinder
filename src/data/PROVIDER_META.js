import attLogo from "../assets/att.png";
import comcastLogo from "../assets/comcast.png";
import RingCentralLogo from "../assets/RingCentral.png";
import spectrumLogo from "../assets/spectrum.png";
import SpectrumVoipLogo from "../assets/spectrum.png";
import Acc from "../assets/Acc.png";

export const PROVIDER_META = {
  "spectrum business": {
    logo: spectrumLogo,
    startingPrice: "$80/mo",
    speed: "500 Mbps",
    conditions: "When Bundled",
  },
  "at&t business": {
    logo: attLogo,
    startingPrice: "$70/mo",
    speed: "300 Mbps",
    conditions: "When Bundled",
  },
  "comcast business": {
    logo: comcastLogo,
    startingPrice: "$55/mo",
    speed: "200 Mbps",
    conditions: "When Bundled",
  },
  "acc business": {
    logo: Acc,
    startingPrice: "$70/mo",
    speed: "300 Mbps",
    conditions: "Tailored VoIP solution",
  },
  ringcentral: {
    logo: RingCentralLogo,
    startingPrice: "$20.00/line",
    speed: "Landline",
    conditions: "Tailored VoIP solution",
  },
  "spectrum voip": {
    logo: SpectrumVoipLogo,
    startingPrice: "$20.00/line",
    speed: "Landline",
    conditions: "Requires Spectrum Internet",
  },
};