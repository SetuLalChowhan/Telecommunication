import React from "react";

const DashboardPage = () => {
  return (
    <div className="p-6 bg-card text-card-foreground rounded-xl shadow-sm border border-border min-h-[400px] flex flex-col justify-center items-center">
      <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Dashboard Overview
      </h1>
      <p className="text-muted-foreground text-base text-center max-w-md">
        Welcome to your dashboard area. The layout is fully ready and configured with Redux, QueryClient, and custom client hooks.
      </p>
    </div>
  );
};

export default DashboardPage;