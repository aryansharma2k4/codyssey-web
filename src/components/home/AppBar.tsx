import Image from "next/image";
import { DM_Sans } from "next/font/google";

const dm_sans = DM_Sans();

export default function AppBar() {
  return (
    <div className="m-5 select-none bg-[#D9D9D91A] rounded-[40px] pt-4 pb-4 pl-2 pr-2 backdrop-blur-[22px] shadow-[0px_4px_9.8px_0px_#00000040,inset_0px_0px_27px_0px_#00000029]">
      <div className="flex items-center pl-5">
        <Image
          src="/logo.svg"
          width={85}
          height={45}
          alt="GDG logo"
          className=""
        />
        <div className={`ml-5 text-xl sm:text-2xl ${dm_sans.className}`}>
          Google Developer Groups
        </div>
      </div>
    </div>
  );
}
