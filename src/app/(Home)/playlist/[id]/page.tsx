"use client";
import React from "react";

export default function PostPage({
  params,
}: {
  params: Promise<{ id: "string" }>;
}) {
  const usedParams = React.use(params);
  return <div>{usedParams.id}</div>;
}
