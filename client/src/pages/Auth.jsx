import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const { token } = useAuth();

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-lg p-8">
        {!token ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">
                ZCoder
              </h1>

              <p className="text-gray-500 mt-2">
                Practice • Compete • Improve
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-8 mb-6 border-b pb-4">
              <NavLink
                to="/auth/signup"
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }
              >
                Sign Up
              </NavLink>

              <NavLink
                to="/auth/signin"
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }
              >
                Sign In
              </NavLink>
            </div>

            <Outlet />
          </>
        ) : (
          <div className="text-center">
            <NavLink
              to="/auth/profile"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              Go To Profile
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPage;