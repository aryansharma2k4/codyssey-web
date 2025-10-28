import { Hubot_Sans } from "next/font/google";

const hubot_sans = Hubot_Sans();

export default function HeroContent() {
  return (
    <div
      className={`${hubot_sans.className} flex flex-col md:items-start select-none`}
    >
      <h1 className="font-extrabold text-5xl md:text-8xl">CODYSSEY’ 25</h1>
      <p className="pt-4 text-xl md:text-2xl">
        A Spooky{" "}
        <span className="text-[#FF5900]">competitive coding showdown</span>
        <br />
        that’ll test your logic, courage, and nerves.
      </p>
      <h1 className="text-5xl sm:text-8xl mt-4 font-extrabold text-transparent [-webkit-text-stroke:2px_gray]">
        12d : 23 h : 56m
      </h1>
      <button className="bg-[#FF7023] hover:bg-[#c44602] border-[#E41600] border-4 transition-all p-5 mt-8 rounded-3xl text-2xl font-medium self-center">
        Leader Board
      </button>
    </div>
  );
}
