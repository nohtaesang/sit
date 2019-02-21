import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Button, View, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
// store
import { useUser } from '../../store/user';
import { useMyKeyword } from '../../store/myKeyword';

function Main() {
	// state
	const [ isLogin, setIsLogin ] = useState(false);
	// store
	const [ user, setUser ] = useUser();
	const [ myKeyword, setMyKeyword ] = useMyKeyword();

	onPressStart = () => {
		Actions.play();
	};

	onPressLogin = () => {
		Actions.login();
	};

	onPressLogout = async () => {
		await AsyncStorage.removeItem('room', null);
		await AsyncStorage.removeItem('session');
		await setUser(null);
		await setMyKeyword([]);
		await Actions.main();
	};

	useEffect(() => {
		(async () => {
			const session = await AsyncStorage.getItem('session');

			await AsyncStorage.removeItem('room', null);
			await setMyKeyword([]);
			// delete db
			if (session) {
				const curUser = JSON.parse(session);
				setUser(curUser);
				await axios.post(`http://192.168.0.17:3001/chat/queue/delete`, {
					email: curUser.email
				});
			} else {
				setUser(null);
			}
		})();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Text style={styles.logo}>ㅅit.</Text>
			</View>
			<View style={styles.bottom}>
				{!user ? (
					<TouchableOpacity style={styles.button} onPress={onPressLogin}>
						<Text style={styles.text}>로그인</Text>
					</TouchableOpacity>
				) : null}
				{user ? (
					<TouchableOpacity style={styles.button} onPress={onPressStart}>
						<Text style={styles.text}>시작하기</Text>
					</TouchableOpacity>
				) : null}
				{user ? (
					<TouchableOpacity style={styles.button} onPress={onPressLogout}>
						<Text style={styles.text}>로그아웃</Text>
					</TouchableOpacity>
				) : null}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center'
	},
	top: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	logo: {
		fontSize: 30,
		fontWeight: 'bold'
	},
	bottom: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontSize: 16,
		marginBottom: 30
	}
});

export default Main;
