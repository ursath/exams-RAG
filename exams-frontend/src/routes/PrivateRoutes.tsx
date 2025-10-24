import { getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoutes = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				await getCurrentUser();
				setIsAuthenticated(true);
			} catch {
				setIsAuthenticated(false);
			}
		};

		checkAuth();
	}, []);
	if (isAuthenticated === null) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
					<p className="text-gray-600">Verificando autenticación...</p>
				</div>
			</div>
		);
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
