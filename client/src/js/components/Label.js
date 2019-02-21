import React from 'react';
import { StyleSheet, InputText, Text, View, TouchableOpacity } from 'react-native';

export const Button = (props) => {
	const { text, onPress } = props;

	return <InputText />;
};

const styles = StyleSheet.create({
	touchableOpacity: {
		justifyContent: 'center',
		alignItems: 'center',

		borderWidth: 1,
		borderRadius: 3,
		borderColor: '#333',
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		height: 50
	},
	text: {
		fontSize: 16
	}
});
