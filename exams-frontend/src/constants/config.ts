import type { ResourcesConfig } from "aws-amplify";

export const awsconfig: ResourcesConfig = {
	Auth: {
		Cognito: {
			loginWith: {
				oauth: {
					domain: "us-east-1epj9uoc66.auth.us-east-1.amazoncognito.com",
					providers: ["Google"],
					redirectSignIn: ["http://localhost:3000/"],
					redirectSignOut: ["http://localhost:3000/"],
					responseType: "code",
					scopes: ["openid", "email", "profile"],
				},
			},
			userPoolClientId: "4rd8lep2gm7givtfvm28jvp2bu",
			userPoolId: "us-east-1_EpJ9UoC66",
		},
	},
};
