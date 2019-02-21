import React, { useState, useEffect, useRef } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	AsyncStorage,
	Image,
	TextInput,
	KeyboardAvoidingView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import io from 'socket.io-client';
// components
import { Button } from '../../components/Button';

import { InputField } from '../../components/InputField';
// store
import { useUser } from '../../store/user';
import { useMyKeyword } from '../../store/myKeyword';
// keywords
function Chat() {
	const [ user, setUser ] = useUser();
	const [ loading, setLoading ] = useState(false);
	const [ isMatch, setIsMatch ] = useState(false);
	const [ myKeyword, setMyKeyword ] = useMyKeyword([]);
	const [ room, setRoom ] = useState(null);
	const [ message, setMessage ] = useState('');
	const [ log, setLog ] = useState([]);
	const [ timer, setTimer ] = useState(0);
	const [ timerInterval, setTimerInterval ] = useState();

	const [ socket, setSocket ] = useState(
		io('http://14.39.199.54:3001', {
			timeout: 10000,
			jsonp: false,
			transports: [ 'websocket' ],
			agent: '-',
			pfx: '-',
			cert: '-',
			ca: '-',
			ciphers: '-',
			rejectUnauthorized: '-',
			perMessageDeflate: '-'
		})
	);

	useEffect(() => {
		(async () => {
			setRoom(await AsyncStorage.getItem('room'));
			setLoading(true);
			setIsMatch(myKeyword[3]);
		})();
	}, []);

	useEffect(
		() => {
			if (loading) {
				socket.emit('join', room, user.email);

				socket.on('join', (email, message) => {
					if (!isMatch && email !== user.email) setIsMatch(true);
					addLog({ type: 'join', name: email });
				});

				socket.on('message', (email, message) => {
					addLog({ type: 'message', name: email, message });
				});

				socket.on('leave', (email) => {
					addLog({ type: 'leave', name: email });
				});
			}
		},
		[ loading ]
	);

	useEffect(
		() => {
			if (isMatch) {
				clearInterval(timerInterval);
			} else {
				let value = 0;
				setTimerInterval(
					setInterval(() => {
						value++;
						setTimer(value);
					}, 1000)
				);
			}
		},
		[ isMatch ]
	);

	addLog = (message) => {
		setLog(log.concat(message));
	};

	// useEffect(() => {}, [ log ]);

	onPressSend = async () => {
		if (!message) return;

		socket.emit('message', room, user.email, message);
		setMessage('');
	};

	onPressMatchCancel = async () => {
		const other = await axios.post(`http://192.168.0.17:3001/chat/queue/delete`, {
			email: user.email
		});
		await Actions.main();

		// db에서 queue 삭제
	};

	onPressChatEnd = async () => {
		socket.emit('leave', room, user.email);
		Actions.main();
	};

	if (!isMatch) {
		return (
			<View style={styles.container}>
				<View style={styles.nav}>
					<TouchableOpacity onPress={onPressMatchCancel}>
						<Image style={styles.leftArrow} source={require('../../../img/left-arrow.png')} />
					</TouchableOpacity>
				</View>
				<Text style={styles.timer}>{timer} 초</Text>
				<Text style={styles.timer}>상대방을 기다리는 중입니다.</Text>
				<View style={styles.myKeywordsFrom}>
					<Text style={styles.timer}>내가 선택한 키워드: </Text>
					{myKeyword.map((a, i) => {
						return (
							<Text key={i} style={styles.timer}>
								{' '}
								{a}
							</Text>
						);
					})}
				</View>
			</View>
		);
	} else {
		return (
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<View style={styles.nav}>
					<TouchableOpacity onPress={onPressChatEnd}>
						<Image style={styles.leftArrow} source={require('../../../img/left-arrow.png')} />
					</TouchableOpacity>
				</View>
				<ScrollView
					style={styles.scrollView}
					ref={(ref) => (this.scrollView = ref)}
					onContentSizeChange={(contentWidth, contentHeight) => {
						this.scrollView.scrollToEnd({ animated: true });
					}}
				>
					{log.map((a, i) => {
						if (a.type === 'join') {
							return (
								<Text key={i} style={a.name === user.email ? styles.my : styles.other}>
									{a.name} 님이 채팅에 참여하셨습니다.
								</Text>
							);
						} else if (a.type === 'leave') {
							console.log('..');
							return (
								<Text key={i} style={a.name === user.email ? styles.my : styles.other}>
									{a.name} 님이 채팅에서 나가셨습니다.
								</Text>
							);
						} else {
							return (
								<Text key={i} style={a.name === user.email ? styles.my : styles.other}>
									{a.message}
								</Text>
							);
						}
					})}

					<View style={styles.scrollViewTemp} />
				</ScrollView>

				<View style={styles.inputForm}>
					<TextInput style={styles.textInput} onChangeText={(text) => setMessage(text)} value={message} />
					<TouchableOpacity style={styles.sendBtn} onPress={onPressSend}>
						<Text style={styles.text}>전송</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#fff',
		justifyContent: 'center',
		zIndex: 0
	},
	nav: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 70,
		borderBottomWidth: 1,
		borderBottomColor: '#333',
		justifyContent: 'flex-end',
		zIndex: 2
	},
	leftArrow: {
		width: 30,
		height: 25,
		marginLeft: 5,
		marginBottom: 10
	},
	myKeywordsFrom: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		fontWeight: 'bold',
		marginTop: 25
	},
	timer: {
		textAlign: 'center',
		fontSize: 16
	},
	scrollView: {
		// position: 'absolute',
		marginTop: 70,
		marginBottom: 0,

		padding: 10,
		zIndex: 1
	},
	scrollViewTemp: {
		height: 50,
		width: 50
	},
	my: {
		borderWidth: 1,
		borderRadius: 4,
		marginLeft: 'auto',
		padding: 5,
		maxWidth: 300,
		marginBottom: 5
	},
	other: {
		borderWidth: 1,
		borderRadius: 4,
		marginRight: 'auto',
		padding: 5,
		maxWidth: 300,
		marginBottom: 5
	},
	inputForm: {
		// position: 'absolute',
		// left: 0,
		// right: 0,
		flexDirection: 'row',
		marginTop: 'auto',
		height: 50,
		zIndex: 2,
		backgroundColor: 'white',

		borderTopWidth: 1
	},
	textInput: {
		flex: 0.8,
		borderRightWidth: 1,

		justifyContent: 'center',
		alignItems: 'center'
	},
	sendBtn: {
		flex: 0.2,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

export default Chat;
