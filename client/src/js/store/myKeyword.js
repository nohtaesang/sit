import React, { useState, useEffect } from 'react';

export const myKeyword = {
	state: [],
	setState(myKeyword) {
		this.state = myKeyword;
		this.setters.forEach((setter) => setter(this.state));
	},
	setters: []
};

// Bind the setState function to the store object so
// we don't lose context when calling it elsewhere
myKeyword.setState = myKeyword.setState.bind(myKeyword);

// this is the custom hook we'll call on components.
export function useMyKeyword() {
	const [ state, set ] = useState(myKeyword.state);
	if (!myKeyword.setters.includes(set)) {
		myKeyword.setters.push(set);
	}

	useEffect(
		() => () => {
			myKeyword.setters = myKeyword.setters.filter((setter) => setter !== set);
		},
		[]
	);

	return [ state, myKeyword.setState ];
}
