"use client";

import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "urql";
import { USER_ME_QUERY } from "../graphql/users.query";
import { config } from "@/config.env";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [{ data, fetching }] = useQuery({
    query: USER_ME_QUERY,
    requestPolicy: "cache-and-network",
  });

  const logout = async () => {
    await fetch(`${config.NEXT_PUBLIC_API}/logout`, {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    window.location.href = "/login";
  };

  const userLoggedIn = !fetching && data?.userMe;

  useEffect(() => {
    if (userLoggedIn) {
      document.cookie = `loggedIn=true; path=/; max-age=${
        60 * 60 * 2
      }; samesite=lax`;
    } else {
      document.cookie = "loggedIn=; path=/; max-age=0; samesite=lax";
    }
  }, [userLoggedIn]);

  if (fetching && !data) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4">
      <div className="container-fluid">
        {/* Logo */}
        <Link href="/?page=1" className="navbar-brand fw-bold text-danger">
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
          <div className="ms-auto d-flex align-items-center gap-3 flex-wrap mt-3 mt-lg-0 pb-4 pb-md-0">
            {userLoggedIn ? (
              <>
                {/* Greeting */}
                <Text py={0} my={0} fontSize="14px" whiteSpace="nowrap">
                  Hello,{" "}
                  <Link
                    href={`/profile/${data.userMe.username?.toLowerCase()}`}
                    className="text-decoration-none"
                    passHref
                  >
                    <Text
                      as="span"
                      color="reddit.400"
                      fontWeight="bold"
                      cursor="pointer"
                    >
                      {data.userMe.username}
                    </Text>
                  </Link>
                  !
                </Text>

                {/* Logout */}
                <Text
                  onClick={logout}
                  cursor="pointer"
                  fontSize="14px"
                  color="red.500"
                  _hover={{ textDecoration: "underline" }}
                  py={0}
                  my={0}
                  whiteSpace="nowrap"
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
