import {
	type AuthUser,
	fetchAuthSession,
	getCurrentUser,
} from "aws-amplify/auth";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Context, UserAttributes } from "../types/user";

const UserContext = createContext<Context | null>(null);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
	const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
	const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const user = await getCurrentUser();
				setCurrentUser(user);

				const session = await fetchAuthSession();
				const idTokenPayload = session.tokens?.idToken?.payload;

				setUserAttributes({
					email:
						typeof idTokenPayload?.email === "string"
							? idTokenPayload.email
							: undefined,
					name:
						typeof idTokenPayload?.name === "string"
							? idTokenPayload.name
							: undefined,
				});
			} catch {
				setCurrentUser(null);
				setUserAttributes(null);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, []);

	return (
		<UserContext.Provider
			value={{ currentUser, isLoading, setCurrentUser, userAttributes }}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (!context)
		throw new Error("useUserContext must be used within a UserContextProvider");
	return context;
};
