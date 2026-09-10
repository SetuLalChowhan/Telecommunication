import React from "react"
import { Outlet } from "react-router-dom"

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#f9fafb] text-foreground flex flex-col justify-center items-center">
      <div className="w-full max-w-[800px] p-4 sm:p-6 flex flex-col justify-center">
        <Outlet />
      </div>
    </div>
  )
}

export default PublicLayout
