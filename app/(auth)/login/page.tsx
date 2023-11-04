"use client";

import { useRouter } from "next/navigation";
import React, { Fragment } from "react";

type LoginResultProps = { token: string } | { message: string };

const Login = () => {
  const router = useRouter();
  const [payload, setPayload] = React.useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const result = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: LoginResultProps = await result.json();

    if ("message" in data) {
      alert(data.message);
    } else {
      localStorage.setItem("token", data.token);
      router.push("/");
    }
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setPayload({
      ...payload,
      [evt.target.name]: evt.target.value,
    });
  };
  return (
    <Fragment>
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center gap-5">
          <h1 className="text-4xl font-bold">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              onChange={handleChange}
              type="text"
              name="email"
              placeholder="Email"
              className="border rounded-lg px-4 py-2"
            />
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Password"
              className="border rounded-lg px-4 py-2"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white hover:bg-slate-800 rounded-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
