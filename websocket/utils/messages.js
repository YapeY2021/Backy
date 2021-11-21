import moment from "moment";

function formatMessage(uid, eid, text, name) {
	return {
		uid,
		eid,
		text,
		name,
		time: moment().format("h:mm a"),
	};
}

export default formatMessage;
