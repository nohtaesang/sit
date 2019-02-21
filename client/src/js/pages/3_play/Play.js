import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
// components
import { Button } from '../../components/Button';

// store
import { useUser } from '../../store/user';
import { useMyKeyword } from '../../store/myKeyword';

//
import keywordList from '../../keywordList/keywordList';

function Play() {
	const [ user, setUser ] = useUser();
	const [ loading, setLoading ] = useState(false);
	const [ index, setIndex ] = useState(0);
	const [ myKeyword, setMyKeyword ] = useMyKeyword([]);
	const [ done, setDone ] = useState(false);

	onPressKeyword = async (text) => {
		if (loading) return;
		setLoading(true);
		setIndex(index + 1);

		if (!text) return;
		setMyKeyword(myKeyword.concat(text));
	};

	useEffect(() => {}, []);

	useEffect(
		() => {
			if (loading) {
				if (myKeyword.length === 3) {
					setMyKeyword(myKeyword.sort());
					setDone(true);
				} else {
					setLoading(false);
				}
			}
		},
		[ loading ]
	);

	useEffect(
		() => {
			if (done) {
				// 1. 있으면, 그 사람 id의 채팅방으로 조인
				// 그 사람의 정보 db에서 제거
				// 2. 없으면, db에 insert
				// chat방 개설
				// Actions.chat();

				(async () => {
					const other = await axios.post(`http://192.168.0.17:3001/chat/queue/isExist`, {
						email: user.email,
						gender: user.gender,
						keyword1: myKeyword[0],
						keyword2: myKeyword[1],
						keyword3: myKeyword[2]
					});

					let room = null;
					if (other.data) {
						// 채팅방 연결
						setMyKeyword(myKeyword.concat(true));
						await AsyncStorage.setItem('room', other.data.email);
						Actions.chat();
					} else {
						// 본인 데이터 삽입 후 채팅방 개설
						setMyKeyword(myKeyword.concat(false));
						room = await axios.post('http://192.168.0.17:3001/chat/queue/insert', {
							email: user.email,
							gender: user.gender,
							keyword1: myKeyword[0],
							keyword2: myKeyword[1],
							keyword3: myKeyword[2]
						});

						await AsyncStorage.setItem('room', room.data.email);
						Actions.chat();
					}
				})();
			}
		},
		[ done ]
	);

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

			<View style={styles.questionForm}>
				<Text style={styles.questionText}>Q. {keywordList[index].question}</Text>
			</View>
			{keywordList[index].answer.map((a, i) => {
				return (
					<TouchableOpacity style={styles.answerForm} key={i} onPress={() => onPressKeyword(a)}>
						<Text style={styles.answerText}>A. {a}</Text>
					</TouchableOpacity>
				);
			})}
			<TouchableOpacity style={styles.passForm} onPress={() => onPressKeyword(false)}>
				<Text style={styles.passText}>Pass</Text>
			</TouchableOpacity>
			{/* {myKeyword.map((a, i) => {
				return <Text key={i}>{a}</Text>;
			})} */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#fff',
		justifyContent: 'center'
		// alignItems: 'center'
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
	questionForm: {
		flex: 0.1,
		justifyContent: 'center',
		alignItems: 'center',
		// borderTopWidth: 1,
		borderBottomWidth: 1
	},
	questionText: {
		fontSize: 20
	},
	answerForm: {
		flex: 0.1,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1
	},
	answerText: {
		fontSize: 16
	},
	passForm: {
		flex: 0.1,

		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1
	},
	passText: {
		fontSize: 16
	},
	myKeyword: {}
});

export default Play;
