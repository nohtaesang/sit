import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
// components
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
// store
import { useUser } from '../../store/user';

const Join = () => {
	const [ user, setUser ] = useUser();

	const [ email, setEmail ] = useState('');
	const [ pw, setPw ] = useState('');
	const [ gender, setGender ] = useState('');
	const [ age, setAge ] = useState('');
	const [ location, setLocation ] = useState('');

	onPressJoin = async () => {
		console.log(email, pw, gender, age, location);
		if (!email || !pw || !gender || !age || !location) return;
		const join = await axios
			.post('http://192.168.0.17:3001/auth/join', {
				email,
				pw,
				gender,
				age,
				location
			})
			.catch((res) => {
				console.log('err');
				return false;
			});

		if (!join) return;

		const session = JSON.stringify(join.data);
		await AsyncStorage.setItem('session', session);
		await setUser(session);
		await Actions.main();
	};

	onPressBack = () => {
		Actions.login();
	};
	onPressMan = () => {
		setGender('man');
	};

	onPressWoman = () => {
		setGender('woman');
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
			<Text style={styles.label}>Gender</Text>
			<View style={styles.radioForm}>
				<TouchableOpacity style={gender === 'man' ? styles.radioActive : styles.radioBtn} onPress={onPressMan}>
					<Text>Man</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={gender === 'woman' ? styles.radioActive : styles.radioBtn}
					onPress={onPressWoman}
				>
					<Text>Woman</Text>
				</TouchableOpacity>
			</View>

			<Text style={styles.label}>Age</Text>
			<TextInput style={styles.textInput} onChangeText={(text) => setAge(text)} value={age} />
			<Text style={styles.label}>Location</Text>
			<TextInput style={styles.textInput} onChangeText={(text) => setLocation(text)} value={location} />
			<TouchableOpacity style={styles.button} onPress={onPressJoin}>
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
		height: 35
	},
	text: {
		fontSize: 16,
		marginTop: 30
	},
	radioForm: {
		flexDirection: 'row',
		width: 250,
		justifyContent: 'center',
		alignItems: 'center'
		// marginTop: 20
	},
	radioBtn: {
		flex: 0.5,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		margin: 2,
		marginTop: 15,
		borderRadius: 5,
		height: 35
	},
	radioActive: {
		flex: 0.5,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		margin: 2,
		marginTop: 15,
		borderRadius: 5,
		height: 35,
		backgroundColor: '#eee'
	}
});

export default Join;
