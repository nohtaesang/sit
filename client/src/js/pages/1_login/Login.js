import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
// components

import { InputField } from '../../components/InputField';
// store
import { useUser } from '../../store/user';
// img

const Login = () => {
	const [ user, setUser ] = useUser();
	const [ email, setEmail ] = useState('');
	const [ pw, setPw ] = useState('');

	onPressLogin = async () => {
		const result = await axios
			.post('http://192.168.0.17:3001/auth/login', {
				email,
				pw
			})
			.catch(() => {
				console.log('err');
				return false;
			});
		if (!result) return;

		const session = JSON.stringify(result.data);
		await AsyncStorage.removeItem('room');
		await AsyncStorage.setItem('session', session);
		await setUser(session);
		await Actions.main();
	};

	onPressJoin = () => {
		Actions.join();
	};

	onPressBack = () => {
		Actions.main();
	};

	return (
		<View style={styles.container}>
			<View style={styles.nav}>
				<TouchableOpacity onPress={onPressBack}>
					<Image style={styles.leftArrow} source={require('../../../img/left-arrow.png')} />
				</TouchableOpacity>
			</View>
			<Text style={styles.label}>Email</Text>
			<TextInput style={styles.textInput} onChangeText={(text) => setEmail(text)} value={email} />
			<Text style={styles.label}>Password</Text>
			<TextInput style={styles.textInput} onChangeText={(text) => setPw(text)} value={pw} />
			<TouchableOpacity style={styles.touchableOpacity} onPress={onPressLogin}>
				<Text style={styles.text}>로그인</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.touchableOpacity} onPress={onPressJoin}>
				<Text style={styles.text}>회원가입</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center'
	},
	nav: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 70,
		borderBottomWidth: 1,
		borderBottomColor: '#333',
		justifyContent: 'flex-end'
	},
	leftArrow: {
		width: 30,
		height: 25,
		marginLeft: 5,
		marginBottom: 10
	},
	label: {
		fontSize: 12,
		width: 250,
		marginTop: 30,
		color: '#aaa'
	},

	textInput: {
		borderBottomWidth: 1,
		borderBottomColor: '#aaa',
		fontSize: 12,
		width: 250,
		// textAlign: 'center',
		height: 35
		// padding
		// marginBottom: 10
	},
	text: {
		fontSize: 16,
		marginTop: 30
	},
	touchableOpacity: {
		// borderWidth: 1,
		// width: 250,
		// height: 45,
		// justifyContent: 'center',
		// alignItems: 'center',
		// borderRadius: 10,
		// marginTop: 10,
		// marginBottom: 10
	}
});

export default Login;
