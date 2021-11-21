import moment from "moment";

function formatMessage(uid, eid, text) {
	return {
		uid,
		eid,
		text,
		time: moment().format("h:mm a"),
	};
}

export default formatMessage;
