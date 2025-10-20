import clsx from "clsx";
import Link from "next/link";

export default function Home() {
  return (
    <div className={clsx("")}>
      <ul>
        <Link
          className={clsx(
            "p-2 text-white font-bold bg-purple-500 text-lg hover:bg-purple-300",
          )}
          href="/timer"
        >
          Timer
        </Link>
      </ul>
    </div>
  );
}
