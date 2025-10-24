import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import type { AuthUser } from "aws-amplify/auth";
import { useTranslation } from "react-i18next";
import { type NavigateFunction, useNavigate } from "react-router-dom";

type AuthenticatedContentProps = {
	signOut: () => void;
	user: AuthUser | undefined;
	navigate: NavigateFunction;
};

const AuthenticatedContent = ({
	signOut,
	user,
	navigate,
}: AuthenticatedContentProps) => {
	const { t } = useTranslation();
	return (
		<div className="bg-white p-10 rounded-2xl shadow-2xl border-2 border-gray-100 max-w-md w-full">
			<div className="text-center mb-6">
				<div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
					<svg
						className="w-10 h-10 text-white"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<title>Éxito</title>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<h1 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido!</h1>
				<p className="text-gray-500">Inicio de sesión exitoso</p>
			</div>

			<div className="space-y-3 mb-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
					<p className="text-xs text-gray-500 mb-1">{t("auth.user")}</p>
					<p className="font-semibold text-gray-800">
						{user?.username || "N/A"}
					</p>
				</div>
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
					<p className="text-xs text-gray-500 mb-1">{t("auth.userId")}</p>
					<p className="font-mono text-sm text-gray-700 break-all">
						{user?.userId || "N/A"}
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<button
					type="button"
					onClick={() => navigate("/")}
					className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl"
				>
					{t("auth.goToGenerator")}
				</button>
				<button
					type="button"
					onClick={signOut}
					className="w-full px-6 py-3 border-2 border-red-500 text-red-600 rounded-xl hover:bg-red-50 transition-all font-semibold"
				>
					{t("auth.signOut")}
				</button>
			</div>
		</div>
	);
};

export const LogInPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
			<div className="w-full max-w-md">
				{/* Logo/Header */}
				<div className="text-center mb-8">
					<div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4">
						<svg
							className="w-12 h-12 text-blue-600"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<title>{t("app.title")}</title>
							<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
							<path
								fillRule="evenodd"
								d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<h1 className="text-4xl font-bold text-gray-800 mb-2">
						{t("app.title")}
					</h1>
					<p className="text-gray-600">{t("app.description")}</p>
				</div>

				{/* Authenticator */}
				<Authenticator
					socialProviders={["google"]}
					variation="modal"
					hideSignUp={true}
				>
					{({ signOut, user }) => (
						<AuthenticatedContent
							signOut={signOut}
							user={user}
							navigate={navigate}
						/>
					)}
				</Authenticator>
			</div>
		</div>
	);
};
