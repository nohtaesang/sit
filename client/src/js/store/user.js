import React, { useState, useEffect } from 'react';

export const user = {
	state: null,
	setState(user) {
		this.state = user;
		this.setters.forEach((setter) => setter(this.state));
	},
	setters: []
};

// Bind the setState function to the store object so
// we don't lose context when calling it elsewhere
user.setState = user.setState.bind(user);

// this is the custom hook we'll call on components.
export function useUser() {
	const [ state, set ] = useState(user.state);
	if (!user.setters.includes(set)) {
		user.setters.push(set);
	}

	useEffect(
		() => () => {
			user.setters = user.setters.filter((setter) => setter !== set);
		},
		[]
	);

	return [ state, user.setState ];
}
