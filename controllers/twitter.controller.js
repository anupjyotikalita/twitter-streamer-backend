const { HTTP_ERROR_CODES } = require("../common/constants");
const { getErrorObject, sendResponse, isEmpty } = require("../common/util.functions");
const TwitterStream = require("../services/twitter.service");

class TwitterControllerClass {
    //add rule
    async searchKeyword(req, res) {
        const { body } = req;
        const { searchText } = body;

        if (!searchText) return sendResponse(res, HTTP_ERROR_CODES.BAD_REQUEST, undefined, 'Please provide a searchText');

        try {
            // get existing rule ids to delete
            const { body: { data: existingRules } } = await TwitterStream.getRules();

            if (!isEmpty(existingRules)) {
                const existingRuleIds = existingRules.map(rule => rule.id);

                // remove existing rules
                await TwitterStream.deleteRules(existingRuleIds);
            }
 

            // add new rule
            const { body: result } = await TwitterStream.addRule(`"${searchText}" -is:retweet`);

            sendResponse(res, 200, result);
        } catch (error) {
            sendResponse(res, HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, 'Internal Server Error');
        }
    }

    async deleteRules(_, res) {
        try {
            const { body: { data: existingRules } } = await TwitterStream.getRules();

            if (!isEmpty(existingRules)) {
                const existingRuleIds = existingRules.map(rule => rule.id);
                await TwitterStream.deleteRules(existingRuleIds);
            }

            sendResponse(res, 200);
        } catch (error) {
            sendResponse(res, HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR, undefined, "Internal Server Error");
        }
    }
}

const TwitterController = new TwitterControllerClass();

module.exports = TwitterController;