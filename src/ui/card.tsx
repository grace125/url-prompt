import React from "react";

export const Card = (p: { children: React.ReactNode, className?: string }) => <div className={p.className ? `card ${p.className}` : `card`}>{p.children}</div>