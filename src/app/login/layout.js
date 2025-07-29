import Image from "next/image";
import Link from "next/link";

export default function layout({ children }) {
  return (
    <div>
      <main>{children}</main>
      <nav className="absolute top-0 left-1/2 z-10 mt-4 -translate-x-1/2">
        <Link href={"/task"} className="relative h-fit w-fit">
          <Image
            width={128}
            height={1}
            src={`/essence_logo.svg`}
            alt="img"
          ></Image>
          <Image
            className="absolute top-0 left-0 opacity-40 blur-xs transition-all duration-500 hover:opacity-50 hover:blur-sm"
            src={`/essence_logo.svg`}
            alt="img"
            width={128}
            height={1}
          ></Image>
        </Link>
      </nav>
    </div>
  );
}
