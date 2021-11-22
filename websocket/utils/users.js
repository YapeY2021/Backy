const users = [];

// Join user to chat
function userJoin(id, uid, room, firstname) {
	const user = { id, uid, room, firstname };

	users.push(user);

	return user;
}

//Get current user
function getCurrentUser(id) {
	return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id) {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
}

// GEt room users
function getRoomUsers(room) {
	return users.filter((user) => user.room === room);
}

export { userJoin, getCurrentUser, userLeave, getRoomUsers };
