import { Outlet } from "react-router"

export const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{ background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #7c3aed 100%)" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm md:max-w-4xl space-y-3">
        <Outlet />
      </div>
    </div>
  )
}
