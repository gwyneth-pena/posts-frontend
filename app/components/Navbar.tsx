"use client";

import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "urql";
import { USER_ME_QUERY } from "../graphql/users.query";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [{ data, fetching }] = useQuery({
    query: USER_ME_QUERY,
    requestPolicy: "cache-and-network",
  });

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API}/logout`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    window.location.href = "/login";
  };

  const userLoggedIn = !fetching && data?.userMe;

  if (fetching && !data) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand fw-bold text-danger">
          MyPosts
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div
          className={`navbar-collapse ${
            isOpen ? "d-block" : "d-none"
          } d-lg-flex`}
        >
          <div className="ms-auto d-flex gap-2 mt-3 mt-lg-0 flex-wrap pb-4 pb-md-0">
            {userLoggedIn ? (
              <>
                <Text py={0} my={0}>
                  Hello,{" "}
                  <Text as="span" color="reddit.400" fontWeight="bold">
                    {data.userMe.username}
                  </Text>
                  !
                </Text>
                <Text
                  onClick={logout}
                  cursor="pointer"
                  style={{ fontSize: "12px" }}
                  py={0}
                  my={0}
                  mt={1}
                >
                  Logout
                </Text>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn rounded-pill px-4"
                  style={{
                    background: "#ff4500",
                    color: "white",
                    width: "130px",
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary rounded-pill px-4"
                  style={{
                    width: "130px",
                    border: "1px solid #ff4500",
                    color: "#ff4500",
                    background: "white",
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
