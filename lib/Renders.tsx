import { SolarLogout2BoldDuotone } from "@/icons/icons";
import Link from "next/link";

export function renderAuthButtons(isAuth: boolean | null): JSX.Element {
  if (isAuth) {
    return (
      <>
        <Link
          href="/profile"
          className="px-4 py-2 hover:bg-slate-400 border rounded-lg"
        >
          Profile
        </Link>
        <button className="px-4 py-2 bg-red-600">
          <SolarLogout2BoldDuotone className="w-6 h-6" />
          <span>Logout</span>
        </button>
      </>
    );
  }

  if (isAuth === false) {
    return (
      <>
        <Link
          href="/login"
          className="px-4 py-2 hover:bg-slate-400 border rounded-lg"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-black text-white hover:bg-slate-800 rounded-lg"
        >
          Register
        </Link>
      </>
    );
  }

  return <p>Loading...</p>;
}
