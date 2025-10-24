import type { ResourcesConfig } from "aws-amplify";
import { API_CONFIG } from "./api"

export const awsconfig: ResourcesConfig = {
	Auth: {
		Cognito: {
			loginWith: {
				oauth: {
					domain: "us-east-1epj9uoc66.auth.us-east-1.amazoncognito.com",
					providers: ["Google"],
					redirectSignIn: [API_CONFIG.LAMBDA_URL],
					redirectSignOut: [API_CONFIG.LAMBDA_URL],
					responseType: "code",
					scopes: ["openid", "email", "profile"],
				},
			},
			userPoolClientId: "4rd8lep2gm7givtfvm28jvp2bu",
			userPoolId: "us-east-1_EpJ9UoC66",
		},
	},
};
