/*
 * This is for response codes for each status
 */

module.exports.statusResponse = {
	/* For response Status */
	fieldsRequired: {
		description: "MANDATORY_FIELDS_REQUIRED",
		code: 1000,
	},
	successResponse: {
		description: "SUCCESS",
		code: 1001,
	},
	/* For Not Found Status (404) */
	pageNotFound: {
		description: "PAGE_NOT_FOUND",
		code: 2000,
	},
	objectNotFound: {
		description: "OBJECT_NOT_FOUND",
		code: 2001,
	},
	/* Exceptional Error status */
	exceptionError: {
		description: "EXCEPTION_ERROR",
		code: 4000,
	},
	queryError: {
		description: "QUERY_ERROR",
		code: 4001,
	},
	unauthorized: {
		description: "NOT_AUTHORIZED",
		code: 4002,
	},
};
