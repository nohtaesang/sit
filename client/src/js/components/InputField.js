import React from 'react';
import { StyleSheet, TextInput, Text, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

export const InputField = (props) => {
	const { value, setValue, placeholder } = props;
	return (
		<KeyboardAvoidingView behavior="padding" enabled>
			<TextInput
				style={styles.textInput}
				onChangeText={(text) => setValue(text)}
				value={value}
				placeholder={placeholder}
			/>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	textInput: {
		borderWidth: 1,
		borderColor: '#333',
		marginLeft: 10,
		marginRight: 10,
		height: 50,
		fontSize: 16,
		padding: 10,
		marginTop: 10
	}
});
